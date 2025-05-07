import {
    Box,
    Button,
    FormControl,
    Grid,
    Typography,
    Checkbox,
    OutlinedInput,
    InputAdornment,
    IconButton,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import AlertDialog from "../../../components/Alert.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import Headtitle from "../../../components/Headtitle.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
function PppL2tpServer() {


    //FILTER START
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
            fetchMikroTikL2tpServer(filterDatas?.url,
                filterDatas?.username,
                filterDatas?.password,)
            // fetchMikroTikProfiles(filterDatas?.url,
            //     filterDatas?.username,
            //     filterDatas?.password,)
        }
    };
    const [ipPoolOptions, setIpPoolOptions] = useState([]);


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
        setL2tpServerDetails({})
        setShowPassword(false)
        setSelectedAuth([]);
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
        "Rate Limit (rx/tx)",
        "Only One",

    ];
    let exportRowValues = [
        "name",
        "localaddress",
        "remoteaddress",
        "bridgelearning",
        "dnsserver",
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
    });
    const [assetVariantEdit, setAssetVariantEdit] = useState({
        name: "",
        localaddress: "",
        remoteaddress: "",
        bridgelearning: "default",
        dnsserver: "",
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
            pagename: String("Mikrotik PPP L2tpServer"),
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

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
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

        if (!l2tpServerDetails["max-mtu"]) {
            setPopupContentMalert("Please Enter Max MTU!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (l2tpServerDetails["max-mtu"] && l2tpServerDetails["max-mtu"]?.length < 4) {
            setPopupContentMalert("Please Enter Valid Max MTU!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!l2tpServerDetails["max-mru"]) {
            setPopupContentMalert("Please Enter Max MRU!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (l2tpServerDetails["max-mru"] && l2tpServerDetails["max-mru"]?.length < 4) {
            setPopupContentMalert("Please Enter Valid Max MRU!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!l2tpServerDetails["default-profile"]) {
            setPopupContentMalert("Please Select Default Profile!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!l2tpServerDetails["use-ipsec"]) {
            setPopupContentMalert("Please Select Use IPsec");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!l2tpServerDetails["ipsec-secret"]) {
            setPopupContentMalert("Please Enter IPsec Secret");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (!l2tpServerDetails["caller-id-type"]) {
            setPopupContentMalert("Please Select Caller ID Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }


        else {
            sendRequest();

        }
    };


    const [isBtn, setIsBtn] = useState(false);
    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true);
        let dnsString = dnsServerTodo?.join(",")
        try {
            await axios.put(
                SERVICE.UPDATE_MIKROTIK_L2TPSERVER,
                {
                    l2tpserverdetails: l2tpServerDetails,
                    adminusername: String(filterFinal.username),
                    adminpassword: String(filterFinal.password),
                    url: String(filterFinal.url),
                    create: create,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchMikroTikL2tpServer(filterFinal?.url,
                filterFinal?.username,
                filterFinal?.password,)
            setAssetVariant({
                name: "",
                localaddress: "",
                remoteaddress: "",
                bridgelearning: "default",
                dnsserver: "",
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
    const [l2tpServerDetails, setL2tpServerDetails] = useState({})
    const [showpassword, setShowPassword] = useState(false)
    const [create, setCreate] = useState(false)

    const [selectedAuth, setSelectedAuth] = useState([]);
    const handleCheckboxChange = (event, value) => {
        const newSelectedAuth = event.target.checked
            ? [...selectedAuth, value]
            : selectedAuth.filter((auth) => auth !== value);
        let convertToSring = newSelectedAuth?.join(",")
        setSelectedAuth(newSelectedAuth);
        setL2tpServerDetails((prevState) => ({
            ...prevState,
            authentication: convertToSring || ""
        }));
    };
    //get all Asset Variant name.
    const fetchMikroTikL2tpServer = async (url,
        username,
        password) => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.post(SERVICE.GET_MIKROTIK_L2TPSERVER, {
                url, username, password
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas = response?.data?.l2tpserver
            console.log(datas)
            if (Object.keys(datas).length === 0) {
                setL2tpServerDetails({
                    "accept-proto-version": "all",
                    "accept-pseudowire-type": "all",
                    "allow-fast-path": "true",
                    "authentication": "",
                    "caller-id-type": "ip-address",
                    "default-profile": "L2TP",
                    "enabled": "true",
                    "ipsec-secret": "",
                    "keepalive-timeout": "30",
                    "l2tpv3-circuit-id": "",
                    "l2tpv3-cookie-length": "0",
                    "l2tpv3-digest-hash": "md5",
                    "max-mru": "1450",
                    "max-mtu": "1450",
                    "max-sessions": "unlimited",
                    "mrru": "disabled",
                    "one-session-per-host": "false",
                    "use-ipsec": "yes"
                });
                setSelectedAuth([]);
                setCreate(true);
            } else {
                setL2tpServerDetails(datas);
                setSelectedAuth(datas?.authentication?.split(",") ?? [])
                setCreate(false);
            }
            setShowPassword(false)
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


    const [profileOptions, setProfileOptions] = useState([])
    const fetchMikroTikProfiles = async (url,
        username,
        password) => {
        setPageName(!pageName);
        try {
            let response = await axios.post(SERVICE.GET_MIKROTIK_PROFILES, {
                url, username, password
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas = response?.data?.profiles?.map(data => ({
                label: data?.name,
                value: data?.name,
            }))
            setProfileOptions(datas);
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









    const [fileFormat, setFormat] = useState("");


    return (
        <Box>
            <Headtitle title={"MIKROTIK PPP L2TPSERVER"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Mikrotik PPP L2tp Server"
                modulename="Mikrotik"
                submodulename="PPP"
                mainpagename="L2TP Server"
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("ll2tpserver") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Filter Mikrotik PPP L2tp Server
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
            {isUserRoleCompare?.includes("ll2tpserver") && (
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
                        <>
                            {Object.keys(l2tpServerDetails).length !== 0 && <Box sx={userStyle.container}>
                                <Grid container spacing={2}>

                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth>
                                            <FormGroup>
                                                <FormControlLabel
                                                    label="Enabled"
                                                    control={
                                                        <Checkbox
                                                            checked={Boolean(l2tpServerDetails.enabled)}
                                                            // onChange={(e) => {
                                                            //     setL2tpServerDetails((prevState) => ({
                                                            //         ...prevState,
                                                            //         enabled: e.target.checked,
                                                            //     }));
                                                            // }}
                                                            readOnly
                                                        />
                                                    }
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Max MTU   <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Max MTU"
                                                value={l2tpServerDetails["max-mtu"]}
                                                // onChange={(e) => {
                                                //     if (e.target.value?.length <= 5) {

                                                //         setL2tpServerDetails((prevState) => ({
                                                //             ...prevState,
                                                //             "max-mtu": e.target.value.replace(/[^0-9.;\s]/g, ""),
                                                //         }));
                                                //     }
                                                // }}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Max MRU   <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Max MRU"
                                                value={l2tpServerDetails["max-mru"]}
                                                // onChange={(e) => {
                                                //     if (e.target.value?.length <= 5) {

                                                //         setL2tpServerDetails((prevState) => ({
                                                //             ...prevState,
                                                //             "max-mru": e.target.value.replace(/[^0-9.;\s]/g, ""),
                                                //         }));
                                                //     }
                                                // }}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Keepalive Timeout  </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Keepalive Timeout"
                                                value={l2tpServerDetails["keepalive-timeout"]}
                                                // onChange={(e) => {
                                                //     if (e.target.value?.length <= 10) {

                                                //         setL2tpServerDetails((prevState) => ({
                                                //             ...prevState,
                                                //             "keepalive-timeout": e.target.value.replace(/[^0-9.;\s]/g, ""),
                                                //         }));
                                                //     }
                                                // }}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Default Profile<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            {/* <Selects */}
                                            {/* maxMenuHeight={300}
                                                options={profileOptions}
                                                value={{
                                                    label: l2tpServerDetails["default-profile"] || "Please Select Profile",
                                                    value: l2tpServerDetails["default-profile"] || "Please Select Profile",
                                                }}
                                                onChange={(e) => {
                                                    setL2tpServerDetails((prevState) => ({
                                                        ...prevState,
                                                        "default-profile": e.value,
                                                    }));
                                                }} */}
                                            {/* /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Default Profile"
                                                value={l2tpServerDetails["default-profile"]}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Authentication
                                        </Typography>
                                        <FormControl size="small" fullWidth>
                                            <FormGroup style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between', // Align checkboxes horizontally
                                            }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            readOnly
                                                            checked={selectedAuth.includes('mschap1')}
                                                        // onChange={(e) => handleCheckboxChange(e, 'mschap1')}
                                                        />
                                                    }
                                                    label="mschap1"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            readOnly
                                                            checked={selectedAuth.includes('mschap2')}
                                                        // onChange={(e) => handleCheckboxChange(e, 'mschap2')}
                                                        />
                                                    }
                                                    label="mschap2"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            readOnly
                                                            checked={selectedAuth.includes('chap')}
                                                        // onChange={(e) => handleCheckboxChange(e, 'chap')}
                                                        />
                                                    }
                                                    label="chap"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            readOnly
                                                            checked={selectedAuth.includes('pap')}
                                                        // onChange={(e) => handleCheckboxChange(e, 'pap')}
                                                        />
                                                    }
                                                    label="pap"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Use IPsec<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            {/* <Selects
                                                maxMenuHeight={300}
                                                options={[
                                                    { label: "yes", value: "yes" },
                                                    { label: "no", value: "no" },
                                                    { label: "required ", value: "required" },
                                                ]}
                                                value={{
                                                    label: l2tpServerDetails["use-ipsec"] || "Please Select Use IPsec",
                                                    value: l2tpServerDetails["use-ipsec"] || "Please Select Use IPsec",
                                                }}
                                                onChange={(e) => {

                                                    setL2tpServerDetails((prevState) => ({
                                                        ...prevState,
                                                        "use-ipsec": e.value,
                                                    }));
                                                }}
                                            /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Default Profile"
                                                value={l2tpServerDetails["use-ipsec"]}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                IPsec Secret<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                placeholder="Please Enter IPsec Secret"
                                                id="outlined-adornment-password"
                                                type={showpassword ? "text" : "password"}
                                                value={l2tpServerDetails["ipsec-secret"]}
                                                // onChange={(e) => {
                                                //     setL2tpServerDetails((prevState) => ({
                                                //         ...prevState,
                                                //         "ipsec-secret": e.value,
                                                //     }));
                                                // }}
                                                readOnly
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onMouseDown={(event) => {
                                                                event.preventDefault();
                                                            }}
                                                            onClick={(e) => {
                                                                setShowPassword(!showpassword)


                                                            }}
                                                            edge="end"
                                                        >
                                                            {!showpassword ? (
                                                                <VisibilityOff sx={{ fontSize: "25px" }} />
                                                            ) : (
                                                                <Visibility sx={{ fontSize: "25px" }} />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Caller ID Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            {/* <Selects
                                                maxMenuHeight={300}
                                                options={[
                                                    { label: "ip-address", value: "ip-address" },
                                                    { label: "number", value: "number" },
                                                ]}
                                                value={{
                                                    label: l2tpServerDetails["caller-id-type"] || "Please Select Caller ID Type",
                                                    value: l2tpServerDetails["caller-id-type"] || "Please Select Caller ID Type",
                                                }}
                                                onChange={(e) => {

                                                    setL2tpServerDetails((prevState) => ({
                                                        ...prevState,
                                                        "caller-id-type": e.value,
                                                    }));
                                                }}
                                            /> */}
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Default Profile"
                                                value={l2tpServerDetails["caller-id-type"]}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth>
                                            <FormGroup>
                                                <FormControlLabel
                                                    label="One Session Per Host"
                                                    control={
                                                        <Checkbox
                                                            checked={Boolean(l2tpServerDetails["one-session-per-host"])}
                                                            // onChange={(e) => {
                                                            //     setL2tpServerDetails((prevState) => ({
                                                            //         ...prevState,
                                                            //         "one-session-per-host": e.target.checked,
                                                            //     }));
                                                            // }}
                                                            readOnly
                                                        />
                                                    }
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth>
                                            <FormGroup>
                                                <FormControlLabel
                                                    label="Allow Fast Path"
                                                    control={
                                                        <Checkbox
                                                            checked={Boolean(l2tpServerDetails["allow-fast-path"])}
                                                            // onChange={(e) => {
                                                            //     setL2tpServerDetails((prevState) => ({
                                                            //         ...prevState,
                                                            //         "allow-fast-path": e.target.checked,
                                                            //     }));
                                                            // }}
                                                            readOnly
                                                        />
                                                    }
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                {/* <br />
                                <br /> */}
                                {/* <Grid
                                    container
                                    sx={{ justifyContent: "center", display: "flex" }}
                                    spacing={2}
                                >
                                    <Grid item>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Link
                                            to="/dashboard"
                                            style={{ textDecoration: "none", color: "white" }}
                                        >
                                            {" "}
                                            <Button sx={buttonStyles.btncancel}> Cancel </Button>{" "}
                                        </Link>
                                    </Grid>
                                </Grid> */}
                            </Box>}

                        </>
                    )}
                </>
            )}

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
        </Box>
    );
}

export default PppL2tpServer;
