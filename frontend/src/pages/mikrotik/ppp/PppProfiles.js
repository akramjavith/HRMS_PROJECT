import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus, } from "react-icons/fa";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography, Autocomplete, Stack
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert.js";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { UserRoleAccessContext } from "../../../context/Appcontext.js";
import { AuthContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";

function PppProfiles() {


    //FILTER START
    const [interval, setInterval] = useState(1000);
    const [filterApplied, setFilterApplied] = useState(false);
    const [mikrotikMaster, setMikrotikMaster] = useState([])
    const [filterDatas, setFilterDatas] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        name: "Please Select Name",
        url: "",
        username: "",
        password: "",
    })
    const [filterFinal, setFilterFinal] = useState({
        url: "",
        username: "",
        password: "",
        company: "",
        branch: "",
        unit: "",
        name: "",
    })

    //submit option for saving
    const handleFilter = (e) => {
        e.preventDefault();

        if (filterDatas.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterDatas.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterDatas.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filterDatas.name === "Please Select Name") {
            setPopupContentMalert("Please Select Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            setFilterApplied(true);
            setFilterFinal({
                url: filterDatas?.url,
                username: filterDatas?.username,
                password: filterDatas?.password,
                company: filterDatas?.company,
                branch: filterDatas?.branch,
                unit: filterDatas?.unit,
                name: filterDatas?.name,
            })
            fetchMikroTikProfiles(filterDatas?.url,
                filterDatas?.username,
                filterDatas?.password,)
            fetchMikroTikIpPool(filterDatas?.url,
                filterDatas?.username,
                filterDatas?.password,)
        }
    };
    const [ipPoolOptions, setIpPoolOptions] = useState([]);


    const fetchMikroTikIpPool = async (url,
        username,
        password) => {
        setPageName(!pageName);
        try {
            let response = await axios.post(SERVICE.GET_MIKROTIK_IPPOOL, {
                url, username, password
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas = response?.data?.ippool?.map(data => data.name);
            setIpPoolOptions(datas);
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };
    const handleClearFilter = (e) => {
        e.preventDefault();
        setFilterDatas({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            name: "Please Select Name",
            url: "",
            username: "",
            password: "",
        });
        setFilterFinal({
            url: "",
            username: "",
            password: "",
            company: "",
            branch: "",
            unit: "",
            name: "",
        })
        setTeamsArray([]);
        setFilterApplied(false);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //get all Asset Variant name.
    const fetchMikroRikMaster = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(SERVICE.ALL_MIKROTIKMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas =
                response?.data?.mikrotikmaster?.filter((item) =>
                    isAssignBranch.some(
                        (branch) =>
                            branch.company === item.company &&
                            branch.branch === item.branch &&
                            branch.unit === item.unit
                    )
                );
            setMikrotikMaster(datas);
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };
    useEffect(() => {
        fetchMikroRikMaster();
    }, []);




    //FILTER END





    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };


    let exportColumnNames = [
        "Name",
        "Local Address",
        "Remote Address",
        "Bridge Learning",
        "Dns-Server",
        "IP Range",
        "Rate Limit (rx/tx)",
        "Only One",

    ];
    let exportRowValues = [
        "name",
        "localaddress",
        "remoteaddress",
        "bridgelearning",
        "dnsserver",
        "range",
        "ratelimit",
        "onlyone",
    ];



    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    function isValidURL(url) {
        setPageName(!pageName);
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
    const ipRegex = /^$|^[0-9.]+$/;
    const [dnsServerTodo, setDnsServerTodo] = useState([]);
    const [dnsServer, setDnsServer] = useState("");
    const addDnsServer = () => {
        const isDuplicate = dnsServerTodo?.includes(dnsServer);

        if (dnsServer === "") {
            setPopupContentMalert("Please Enter Dns Server");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isDuplicate) {
            setPopupContentMalert("Dns Server already Exist");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setDnsServerTodo((prevState) => [...prevState, dnsServer]);
            setDnsServer("");
        }
    };
    const deleteDnsServerTodo = (index) => {
        setDnsServerTodo(dnsServerTodo.filter((_, i) => i !== index));
    };
    //EDitT
    const [dnsServerTodoEdit, setDnsServerTodoEdit] = useState([]);
    const [dnsServerEdit, setDnsServerEdit] = useState("");
    const addDnsServerEdit = () => {
        const isDuplicate = dnsServerTodoEdit?.includes(dnsServerEdit);

        if (dnsServerEdit === "") {
            setPopupContentMalert("Please Enter Dns Server");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isDuplicate) {
            setPopupContentMalert("Dns Server already Exist");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setDnsServerTodoEdit((prevState) => [...prevState, dnsServerEdit]);
            setDnsServerEdit("");
        }
    };
    const deleteDnsServerTodoEdit = (index) => {
        setDnsServerTodoEdit(dnsServerTodoEdit.filter((_, i) => i !== index));
    };
    const [assetVariant, setAssetVariant] = useState({
        name: "",
        localaddress: "",
        remoteaddress: "",
        bridgelearning: "default",
        dnsserver: "",
        range:""
    });
    const [assetVariantEdit, setAssetVariantEdit] = useState({
        name: "",
        localaddress: "",
        remoteaddress: "",
        bridgelearning: "default",
        dnsserver: "",
        range:""
    });
    let bridgeLearningOptions = [
        { label: "default", value: "default" },
        { label: "no", value: "no" },
        { label: "yes", value: "yes" },
    ]
    const [teamsArray, setTeamsArray] = useState([]);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        buttonStyles,
        isAssignBranch,
    } = useContext(UserRoleAccessContext);

    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Mikrotik PPP Profiles"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isBtn, setIsBtn] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenRestore, setIsDeleteOpenRestore] = useState(false);
    const [deleteAssetVariant, setDeleteAssetVariant] = useState({});

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allAssetVariantEdit, setAllAssetVariantEdit] = useState([]);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        name: true,
        localaddress: true,
        remoteaddress: true,
        bridgelearning: true,
        dnsserver: true,
        range: true,
        onlyone: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber(teamsArray);
    }, [teamsArray]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };

    const [singleRow, setSingleRow] = useState({});
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
    //Delete model
    const handleClickOpenRestore = () => {
        setIsDeleteOpenRestore(true);
    };
    const handleCloseModRestore = () => {
        setIsDeleteOpenRestore(false);
    };
    // page refersh reload code
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

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
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

    const [deleteTeamId, setDeleteTeamId] = useState("");

    const deleteTeam = async () => {
        setPageName(!pageName);
        try {
            await axios.post(
                `${SERVICE.DELETE_MIKROTIK_PROFILE}`, {
                id: deleteTeamId,
                url: filterFinal?.url,
                username: filterFinal?.username,
                password: filterFinal?.password,
            },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchMikroTikProfiles(filterFinal?.url,
                filterFinal?.username,
                filterFinal?.password,)
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };








    //add model...
    const [isAddOpen, setIsAddOpen] = useState(false);
    const handleClickOpenAdd = () => {
        setIsAddOpen(true);
    };
    const handleCloseModAdd = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsAddOpen(false);
        setAssetVariant({
            name: "",
            localaddress: "",
            remoteaddress: "",
            bridgelearning: "default",
            dnsserver: "",
            range:""
        });
        setDnsServerTodo([]);
        setDnsServer("");
    };
    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = items?.some(
            (item) =>
                item.name?.trim().toLowerCase() === assetVariant.name?.trim().toLowerCase()
        );
        if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (assetVariant.name === "") {
            setPopupContentMalert("Please Enter Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }


        // else if (assetVariant.localaddress === "") {
        //     setPopupContentMalert("Please Enter Local Address!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (assetVariant.remoteaddress === "") {
        //     setPopupContentMalert("Please Enter Remote Address!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        else if (dnsServerTodo?.length === 0) {
            setPopupContentMalert("Please Add Dns Server!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            sendRequest();

        }
    };



    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true);
        let dnsString = dnsServerTodo?.join(",")
        try {
            await axios.post(
                SERVICE.CREATE_MIKROTIK_PROFILE,
                {
                    name: String(assetVariant.name),
                    bridgelearning: String(assetVariant.bridgelearning),
                    dnsserver: String(dnsString),
                    localaddress: String(assetVariant.localaddress),
                    remoteaddress: String(assetVariant.remoteaddress),
                    adminusername: String(filterFinal.username),
                    adminpassword: String(filterFinal.password),
                    url: String(filterFinal.url),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchMikroTikProfiles(filterFinal?.url,
                filterFinal?.username,
                filterFinal?.password,)
            setAssetVariant({
                name: "",
                localaddress: "",
                remoteaddress: "",
                bridgelearning: "default",
                dnsserver: "",
                range:""
            });
            setDnsServerTodo([]);
            setDnsServer("");
            handleCloseModAdd();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
            setIsBtn(false);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        let dnsString = dnsServerTodoEdit?.join(",")
        try {
            let res = await axios.put(
                `${SERVICE.UPDATE_MIKROTIK_PROFILE}`,
                {
                    id: String(assetVariantEdit.id),
                    mikrotikid: String(assetVariantEdit.id),
                    name: String(assetVariantEdit.name),
                    bridgelearning: String(assetVariantEdit.bridgelearning),
                    dnsserver: String(dnsString),
                    localaddress: String(assetVariantEdit.localaddress),
                    remoteaddress: String(assetVariantEdit.remoteaddress),
                    adminusername: String(filterFinal.username),
                    adminpassword: String(filterFinal.password),
                    url: String(filterFinal.url),
                    updatedby: [
                        ...assetVariantEdit?.updatedby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchMikroTikProfiles(filterFinal?.url,
                filterFinal?.username,
                filterFinal?.password,)
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log("Error Response:", err.response);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };
    const editSubmit = (e) => {
        e.preventDefault();

        const isNameMatch = items?.filter((item) => item.id !== assetVariantEdit.id)?.some(
            (item) =>
                item.name?.trim().toLowerCase() === assetVariantEdit.name?.trim().toLowerCase()
        );
        if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (assetVariantEdit.name === "") {
            setPopupContentMalert("Please Enter Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }


        // else if (assetVariantEdit.localaddress === "") {
        //     setPopupContentMalert("Please Enter Local Address!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (assetVariantEdit.remoteaddress === "") {
        //     setPopupContentMalert("Please Enter Remote Address!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        else if (dnsServerTodoEdit?.length === 0) {
            setPopupContentMalert("Please Add Dns Server!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();

        }
    };
    //get all Asset Variant name.
    const fetchMikroTikProfiles = async (url,
        username,
        password) => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.post(SERVICE.GET_MIKROTIK_PROFILES, {
                url, username, password
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let ipPools = await axios.post(SERVICE.GET_MIKROTIK_IPPOOL, {
                url, username, password
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            console.log(ipPools?.data?.ippool , 'ipPools?.data?.ippool')

            let datas = response?.data?.profiles?.map(data => {
                const matchedItems = ipPools?.data?.ippool?.find(item => data?.name === item?.name);
            
                if (matchedItems) {
                    console.log(matchedItems , 'matchedItems')
                    return { ...data, range: matchedItems?.ranges };
                } 
                return data;
            });
            setTeamsArray(datas);
            console.log(datas, ipPoolOptions,'response?.data?.profiles')
            setLoader(false);
        } catch (err) {
            setLoader(false);
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Mikrotik PPP Profiles.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Mikrotik PPP Profiles",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (profiledatas) => {
        const itemsWithSerialNumber = profiledatas?.map((item, index) => {


            return {
                ...item, // Original data
                serialNumber: index + 1, // Serial number
                id: item?.[".id"],
                name: item?.name,
                localaddress: item?.["local-address"],
                remoteaddress: item?.["remote-address"],
                bridgelearning: item?.["bridge-learning"],
                dnsserver: item?.["dns-server"],
                range: item?.range ? item?.range : "",
                ratelimit: "",
                onlyone: item?.["only-one"],
                addedby: item?.addedby,
                updatedby: item?.updatedby,
                createdAt: item?.createdAt,
            };
        });
        // Update the state with the new items
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
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },

        {
            field: "name",
            headerName: "Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
        },

        {
            field: "localaddress",
            headerName: "Local Address",
            flex: 0,
            width: 150,
            hide: !columnVisibility.localaddress,
            headerClassName: "bold-header",
        },

        {
            field: "remoteaddress",
            headerName: "Remote Address",
            flex: 0,
            width: 150,
            hide: !columnVisibility.remoteaddress,
            headerClassName: "bold-header",
        },
        {
            field: "bridgelearning",
            headerName: "Bridge Learning",
            flex: 0,
            width: 150,
            hide: !columnVisibility.bridgelearning,
            headerClassName: "bold-header",
        },
        {
            field: "dnsserver",
            headerName: "Dns-Server",
            flex: 0,
            width: 150,
            hide: !columnVisibility.dnsserver,
            headerClassName: "bold-header",
        },
        {
            field: "range",
            headerName: "IP Range",
            flex: 0,
            width: 150,
            hide: !columnVisibility.range,
            headerClassName: "bold-header",
        },

        // {
        //     field: "ratelimit",
        //     headerName: "Rate Limit (rx/tx)",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.ratelimit,
        //     headerClassName: "bold-header",
        // },

        {
            field: "onlyone",
            headerName: "Only One",
            flex: 0,
            width: 150,
            hide: !columnVisibility.onlyone,
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
                    {isUserRoleCompare?.includes("esecrets") && (
                        <>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    setAssetVariantEdit(params.row);
                                    setDnsServerTodoEdit(params.row?.dnsserver?.split(","))
                                    handleClickOpenEdit();
                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        </>
                    )}

                    {isUserRoleCompare?.includes("dsecrets") && (
                        <>
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    setDeleteTeamId(params.row.id);
                                    handleClickOpen();
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        </>
                    )}
                    {isUserRoleCompare?.includes("vsecrets") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                // getviewCode(params.row.id);
                                setSingleRow(params?.row);
                                handleClickOpenview();
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("isecrets") && (params?.row?.addedby?.length > 0 || params?.row?.updatedby?.length > 0) && (
                        <Button
                            size="small"
                            sx={userStyle.actionbutton}
                            onClick={() => {
                                setSingleRow(params?.row);
                                handleClickOpeninfo();
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];


    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            name: item?.name,
            localaddress: item?.localaddress,
            remoteaddress: item?.remoteaddress,
            bridgelearning: item?.bridgelearning,
            dnsserver: item?.dnsserver,
            range: item?.range,
            ratelimit: item?.ratelimit,
            onlyone: item?.onlyone,
            addedby: item?.addedby,
            updatedby: item?.updatedby,
            createdAt: item?.createdAt,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
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

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");


    return (
        <Box>
            <Headtitle title={"MIKROTIK PPP PROFILES"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Mikrotik PPP Profiles"
                modulename="Mikrotik"
                submodulename="PPP"
                mainpagename="Profiles"
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("lsecrets") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Filter Mikrotik PPP Profiles
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: filterDatas.company,
                                                value: filterDatas.company,
                                            }}
                                            onChange={(e) => {
                                                setFilterDatas({
                                                    ...filterDatas,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter((comp) =>
                                                    filterDatas.company === comp.company
                                                )
                                                ?.map((data) => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: filterDatas.branch,
                                                value: filterDatas.branch,
                                            }}
                                            onChange={(e) => {
                                                setFilterDatas({
                                                    ...filterDatas,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter(
                                                    (comp) =>
                                                        filterDatas.company === comp.company &&
                                                        filterDatas.branch === comp.branch
                                                )
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: filterDatas.unit,
                                                value: filterDatas.unit,
                                            }}
                                            onChange={(e) => {
                                                setFilterDatas({
                                                    ...filterDatas,
                                                    unit: e.value,
                                                    name: "Please Select Name",
                                                    url: "",
                                                    username: "",
                                                    password: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={mikrotikMaster
                                                ?.filter(
                                                    (comp) =>
                                                        filterDatas.company === comp.company &&
                                                        filterDatas.branch === comp.branch &&
                                                        filterDatas.unit === comp.unit
                                                )
                                                ?.map((data) => ({
                                                    label: data.name,
                                                    value: data.name,
                                                    url: data.url,
                                                    username: data.username,
                                                    password: data.password,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: filterDatas.name,
                                                value: filterDatas.name,
                                            }}
                                            onChange={(e) => {
                                                setFilterDatas({
                                                    ...filterDatas,
                                                    name: e.value,
                                                    url: e.url,
                                                    username: e.username,
                                                    password: e.password,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6} mt={3}>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFilter}
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Filter
                                        </Button>

                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={handleClearFilter}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>

                        </>
                    </Box>
                )}
            </>
            <br /> <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lsecrets") && (
                <>
                    {loader ? (
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
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}

                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <Typography sx={userStyle.importheadtext}>
                                        List Mikrotik PPP Profiles
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    {isUserRoleCompare?.includes("asecrets") && filterApplied && (
                                        <>

                                            <Button
                                                variant="contained"
                                                sx={buttonStyles.buttonsubmit}
                                                onClick={handleClickOpenAdd}
                                            >
                                                Add New
                                            </Button>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                            <br />
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
                                            <MenuItem value={teamsArray?.length}>
                                                All
                                            </MenuItem>
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
                                        {isUserRoleCompare?.includes("excelsecrets") && (
                                            <>
                                                <Button
                                                    onClick={(e) => {
                                                        setIsFilterOpen(true);
                                                        setFormat("xl");
                                                    }}
                                                    sx={userStyle.buttongrp}
                                                >
                                                    <FaFileExcel />
                                                    &ensp;Export to Excel&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvsecrets") && (
                                            <>
                                                <Button
                                                    onClick={(e) => {
                                                        setIsFilterOpen(true);
                                                        setFormat("csv");
                                                    }}
                                                    sx={userStyle.buttongrp}
                                                >
                                                    <FaFileCsv />
                                                    &ensp;Export to CSV&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printsecrets") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfsecrets") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true);
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagesecrets") && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
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
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>

                            <br />
                            <br />
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <StyledDataGrid
                                    // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                    )}
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
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth={true}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Mikrotik PPP Profile
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{singleRow.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Local Address</Typography>
                                    <Typography>{singleRow.localaddress}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Remote Address</Typography>
                                    <Typography>{singleRow.remoteaddress}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Bridge Learning</Typography>
                                    <Typography>{singleRow.bridgelearning}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Dns-Server</Typography>
                                    <Typography>{singleRow.dnsserver}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">IP Range</Typography>
                                    <Typography>{singleRow.range}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Only One</Typography>
                                    <Typography>{singleRow.onlyone}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.btncancel}
                                onClick={handleCloseview}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
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
                                    Edit Mikrotik Master
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company
                                        </Typography>

                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.company}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch
                                        </Typography>

                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.branch}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit
                                        </Typography>

                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.unit}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mikrotik Name
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={filterFinal.name}
                                            readOnly
                                        // onChange={(e) => {
                                        //     setAssetVariantEdit({
                                        //         ...assetVariantEdit,
                                        //         name: e.target.value,
                                        //     });
                                        // }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={assetVariantEdit.name}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    name: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Bridge Learning<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={bridgeLearningOptions}
                                            value={{
                                                label: assetVariantEdit.bridgelearning,
                                                value: assetVariantEdit.bridgelearning,
                                            }}
                                            onChange={(e) => {

                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    bridgelearning: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Local Address
                                        </Typography>
                                        <Autocomplete
                                            freeSolo
                                            options={ipPoolOptions} // predefined options
                                            inputValue={assetVariantEdit.localaddress}
                                            onInputChange={(event, newInputValue, reason) => {
                                                // Only apply the regex validation when the reason is 'input' (typing)
                                                if (reason === 'input') {
                                                    if (ipRegex.test(newInputValue) && newInputValue.length <= 15) {
                                                        setAssetVariantEdit({
                                                            ...assetVariantEdit,
                                                            localaddress: newInputValue, // Update localaddress only if it matches IP format
                                                        });
                                                    }
                                                } else {
                                                    // When selecting from dropdown, directly set the value
                                                    setAssetVariantEdit({
                                                        ...assetVariantEdit,
                                                        localaddress: newInputValue,
                                                    });
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    // label="Enter or Select Local Address"
                                                    variant="outlined"
                                                    placeholder="e.g., 192.168.85.1"
                                                    fullWidth
                                                />
                                            )}
                                        />


                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Remote Address
                                        </Typography>
                                        <Autocomplete
                                            freeSolo
                                            options={ipPoolOptions} // predefined options
                                            inputValue={assetVariantEdit.remoteaddress}
                                            onInputChange={(event, newInputValue, reason) => {
                                                // Only apply the regex validation when the reason is 'input' (typing)
                                                if (reason === 'input') {
                                                    if (ipRegex.test(newInputValue) && newInputValue.length <= 15) {
                                                        setAssetVariantEdit({
                                                            ...assetVariantEdit,
                                                            remoteaddress: newInputValue, // Update remoteaddress only if it matches IP format
                                                        });
                                                    }
                                                } else {
                                                    // When selecting from dropdown, directly set the value
                                                    setAssetVariantEdit({
                                                        ...assetVariantEdit,
                                                        remoteaddress: newInputValue,
                                                    });
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    // label="Enter or Select Remote Address"
                                                    variant="outlined"
                                                    placeholder="e.g., 192.168.85.200"
                                                    fullWidth
                                                />
                                            )}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Dns Server<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >

                                            <OutlinedInput
                                                id="internal-url-input"
                                                type="text"
                                                placeholder="Please Enter Dns Server"
                                                value={dnsServerEdit}
                                                onChange={(e) => {
                                                    let newInputValue = e.target.value
                                                    if (ipRegex.test(newInputValue) && newInputValue.length <= 15) {
                                                        setDnsServerEdit(newInputValue)
                                                    }
                                                }}
                                                sx={{ width: "300px" }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={addDnsServerEdit}
                                                type="button"
                                                sx={{ height: "40px", minWidth: "40px" }}
                                                disabled={dnsServerTodoEdit?.length >= 2}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </Stack>
                                    </FormControl>

                                    <List dense>
                                        {dnsServerTodoEdit.map((data, index) => (
                                            <ListItem
                                                key={index}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        color="error"
                                                        onClick={() => deleteDnsServerTodoEdit(index)}
                                                    >
                                                        <AiOutlineClose />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText primary={data} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>

                            </Grid>


                            <br /> <br />
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
                                    <Button
                                        variant="contained"
                                        onClick={editSubmit}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseModEdit}
                                    >
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            {/* ADD DIALOG */}
            <Box>
                <Dialog
                    open={isAddOpen}
                    onClose={handleCloseModAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Add Mikrotik PPP Profile
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company
                                        </Typography>

                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.company}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch
                                        </Typography>

                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.branch}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit
                                        </Typography>

                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterFinal.unit}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mikrotik Name
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={filterFinal.name}
                                            readOnly
                                        // onChange={(e) => {
                                        //     setAssetVariantEdit({
                                        //         ...assetVariantEdit,
                                        //         name: e.target.value,
                                        //     });
                                        // }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={assetVariant.name}
                                            onChange={(e) => {
                                                setAssetVariant({
                                                    ...assetVariant,
                                                    name: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Bridge Learning<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={bridgeLearningOptions}
                                            value={{
                                                label: assetVariant.bridgelearning,
                                                value: assetVariant.bridgelearning,
                                            }}
                                            onChange={(e) => {

                                                setAssetVariant({
                                                    ...assetVariant,
                                                    bridgelearning: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Local Address
                                        </Typography>
                                        <Autocomplete
                                            freeSolo
                                            options={ipPoolOptions} // predefined options
                                            inputValue={assetVariant.localaddress}
                                            onInputChange={(event, newInputValue, reason) => {
                                                // Only apply the regex validation when the reason is 'input' (typing)
                                                if (reason === 'input') {
                                                    if (ipRegex.test(newInputValue) && newInputValue.length <= 15) {
                                                        setAssetVariant({
                                                            ...assetVariant,
                                                            localaddress: newInputValue, // Update localaddress only if it matches IP format
                                                        });
                                                    }
                                                } else {
                                                    // When selecting from dropdown, directly set the value
                                                    setAssetVariant({
                                                        ...assetVariant,
                                                        localaddress: newInputValue,
                                                    });
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    // label="Enter or Select Local Address"
                                                    variant="outlined"
                                                    placeholder="e.g., 192.168.85.1"
                                                    fullWidth
                                                />
                                            )}
                                        />


                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Remote Address
                                        </Typography>
                                        <Autocomplete
                                            freeSolo
                                            options={ipPoolOptions} // predefined options
                                            inputValue={assetVariant.remoteaddress}
                                            onInputChange={(event, newInputValue, reason) => {
                                                // Only apply the regex validation when the reason is 'input' (typing)
                                                if (reason === 'input') {
                                                    if (ipRegex.test(newInputValue) && newInputValue.length <= 15) {
                                                        setAssetVariant({
                                                            ...assetVariant,
                                                            remoteaddress: newInputValue, // Update remoteaddress only if it matches IP format
                                                        });
                                                    }
                                                } else {
                                                    // When selecting from dropdown, directly set the value
                                                    setAssetVariant({
                                                        ...assetVariant,
                                                        remoteaddress: newInputValue,
                                                    });
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    // label="Enter or Select Remote Address"
                                                    variant="outlined"
                                                    placeholder="e.g., 192.168.85.200"
                                                    fullWidth
                                                />
                                            )}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Dns Server<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >

                                            <OutlinedInput
                                                id="internal-url-input"
                                                type="text"
                                                placeholder="Please Enter Dns Server"
                                                value={dnsServer}
                                                onChange={(e) => {
                                                    let newInputValue = e.target.value
                                                    if (ipRegex.test(newInputValue) && newInputValue.length <= 15) {
                                                        setDnsServer(newInputValue)
                                                    }
                                                }}
                                                sx={{ width: "300px" }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={addDnsServer}
                                                type="button"
                                                sx={{ height: "40px", minWidth: "40px" }}
                                                disabled={dnsServerTodo?.length >= 2}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </Stack>
                                    </FormControl>

                                    <List dense>
                                        {dnsServerTodo.map((data, index) => (
                                            <ListItem
                                                key={index}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        color="error"
                                                        onClick={() => deleteDnsServerTodo(index)}
                                                    >
                                                        <AiOutlineClose />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText primary={data} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>

                            </Grid>

                            <br /> <br />
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
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        {" "}
                                        Submit
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseModAdd}
                                    >
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"Mikrotik PPP Profiles"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteTeam}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Mikrotik PPP Profiles Info"
                addedby={singleRow?.addedby}
                updateby={singleRow?.updatedby}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default PppProfiles;