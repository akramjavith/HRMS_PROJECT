


import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Backdrop, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextareaAutosize, TextField, Typography, } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import domtoimage from 'dom-to-image';
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext, } from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";

function RemoteEmployeePendingDetailsList({ tableData, setReload, tableLoader, branchData,
    unitData }) {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        // setSubmitLoader(false);
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
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Work Mode",
        "Empcode",
        "Name", "RemoteSystemName", "ShortName"
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "team",
        "workmode",
        "empcode",
        "companyname", "workstationinput", "shortname"
    ];


    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleAccess,
        isUserRoleCompare,
        allUsersData,
        isAssignBranch,
        pageName,
        setPageName,
        buttonStyles,
        allTeam,
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
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [workmode, setWorkmode] = useState("");

    const { auth } = useContext(AuthContext);
    const [isBtn, setIsBtn] = useState(false);
    const [isBtnFilter, setIsBtnFilter] = useState(false);
    const [loader, setLoader] = useState(false);

    const [pfesiform, setPfesiForm] = useState({
        esideduction: false,
        pfdeduction: false,
        uan: "UAN",
        pfmembername: "",
        insurancenumber: "",
        ipname: "",
        pfesifromdate: "",
        isenddate: false,
        pfesienddate: "",
        workstationinput: "",
    });

    const [addremoteemployeeWorkmode, setAddremoteemployeeWorkmode] = useState({
        wfhconfigurationdetails: "",
        internetdailylimit: "",
        internetspeed: "",
        internetssidname: "",
        auditchecklistworkareasecure: "Please Select",
        auditchecklistwindowsongroundlevelworkarea: "Please Select",
        auditchecklistworkstationisstored: "Please Select",
        auditchecklistnoprivatelyowned: "Please Select",
        auditchecklistwifisecurity: "Please Select",
    });

    const [isAddOpenalert, setAddOpenalert] = useState(false);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Remote Employee Pending Details List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Copied fields Name
    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
    };

    // Manage Columns
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

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        empcode: true,
        workmode: true,
        companyname: true, shortname: true, workstationinput: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const getCode = async (e, mode) => {
        setPageName(!pageName);
        try {
            setIsLoading(true);
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.GET_SINGLE_REMOTE_WORKMODE}/?employeeid=${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let remoteWorkModeArray = response?.data?.addremoteworkmode;
            setPfesiForm({ ...res?.data?.suser, addremoteworkmode: remoteWorkModeArray });
            const lastworkmode =
                remoteWorkModeArray.length > 0
                    ? remoteWorkModeArray[
                    remoteWorkModeArray.length - 1
                    ]
                    : remoteWorkModeArray;

            setWorkmode(lastworkmode);
            setdocumentFiles(lastworkmode?.wfhsetupphoto);
            setdocumentFilesssid(lastworkmode?.internetssidphoto);
            handleClickOpenView();
            setIsLoading(false);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");
    const [employeeDetails, setEmployeeDetails] = useState({
        employeename: "",
        id: "",
        workstationinput: "",
    });
    const [rowParamsData, setRowParamsData] = useState({})
    const allotWorkStation = async (row) => {
        setRowParamsData(row)
        setPageName(!pageName);
        try {
            let aggregationPipeline = [
                {
                    $match: {
                        company: row?.company,
                        branch: row?.branch,
                        unit: row?.unit,
                        workstationinput: { $regex: "_[0-9]+_" }, // Match workstation codes
                    }
                },
                {
                    $addFields: {
                        workstationNumber: {
                            $toInt: { $arrayElemAt: [{ $split: ["$workstationinput", "_"] }, 1] }
                        }
                    }
                },
                {
                    $sort: { workstationNumber: -1 } // Get the highest workstation number
                },
                {
                    $limit: 1
                }
            ]
            let branchCode = branchData?.find(data => data?.name === row?.branch)?.code || "";
            let unitCode = unitData?.find(data => data?.name === row?.unit)?.code || "";
            // let req = await axios.get(SERVICE.USER, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            // });
            let req = await axios.post(
                SERVICE.DYNAMICUSER_CONTROLLER,
                {
                    aggregationPipeline,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            let result = req.data.users
            console.log(result, "result")

            // let lastwscode;
            // let lastworkstation = req.data.users
            //   ?.filter(
            //     (item) =>
            //       item.company === row.company &&
            //       item.branch === row.branch &&
            //       item.unit === row.unit
            //   )
            //   .filter((item) => /_[0-9]+_/.test(item?.workstationinput));

            // if (lastworkstation.length === 0) {
            //   lastwscode = 0;
            // } else {
            //   let highestWorkstation = lastworkstation.reduce(
            //     (max, item) => {
            //       const num = parseInt(item.workstationinput.split("_")[1]);
            //       return num > max.num ? { num, item } : max;
            //     },
            //     { num: 0, item: null }
            //   ).num;

            //   lastwscode = highestWorkstation.toString().padStart(2, "0");
            // }
            let lastwscode = result.length > 0 ? result[0].workstationNumber + 1 : 1;
            let formattedWorkstationCode = lastwscode.toString().padStart(2, "0");

            let autoWorkStation = `W${branchCode?.slice(0, 2)?.toUpperCase()}${unitCode?.slice(0, 2)?.toUpperCase()}_${formattedWorkstationCode}_${row?.username?.toUpperCase()}`;

            // let autoWorkStation = `W${row?.branchcode
            //   ?.slice(0, 2)
            //   ?.toUpperCase()}${row?.unitcode?.slice(0, 2)?.toUpperCase()}_${lastwscode === 0
            //     ? "01"
            //     : (Number(lastwscode) + 1).toString().padStart(2, "0")
            //   }_${row?.username?.toUpperCase()}`;

            setPrimaryWorkStationInput(autoWorkStation?.slice(0, 15));
            setEmployeeDetails({
                employeename: row.companyname,
                id: row?.id,
                workstationinput: row?.workstationinput?.slice(0, 15),
                workmode: row?.workmode,
            });
            return autoWorkStation?.slice(0, 15)
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const getCodeEdit = async (row) => {
        setIsLoading(true);
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${row.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.GET_SINGLE_REMOTE_WORKMODE}/?employeeid=${row.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let remoteWorkModeArray = response?.data?.addremoteworkmode;
            setPfesiForm({ ...res?.data?.suser, addremoteworkmode: remoteWorkModeArray });
            const lastworkmode =
                remoteWorkModeArray.length > 0
                    ? remoteWorkModeArray[
                    remoteWorkModeArray.length - 1
                    ]
                    : remoteWorkModeArray;

            setSelectedOptionsSystemType(
                lastworkmode?.wfhsystemtype?.length > 0
                    ? [
                        ...lastworkmode?.wfhsystemtype?.map((t) => ({
                            ...t,
                            label: t,
                            value: t,
                        })),
                    ]
                    : []
            );
            setValueSystemTypeCat(lastworkmode?.wfhsystemtype);
            setSelectedOptionsNetworkType(
                lastworkmode?.wfhsystemtype?.length > 0
                    ? [
                        ...lastworkmode?.internetnetworktype?.map((t) => ({
                            ...t,
                            label: t,
                            value: t,
                        })),
                    ]
                    : []
            );
            setValueNetworkTypeCat(lastworkmode?.internetnetworktype);
            setAddremoteemployeeWorkmode(lastworkmode);
            setdocumentFiles(lastworkmode?.wfhsetupphoto);
            setdocumentFilesssid(lastworkmode?.internetssidphoto);
            await allotWorkStation(row);
            handleClickOpenEdit();
            setIsLoading(false);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const getCodeAdd = async (row) => {
        setIsLoading(true);
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${row.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.GET_SINGLE_REMOTE_WORKMODE}/?employeeid=${row.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let remoteWorkModeArray = response?.data?.addremoteworkmode;
            setPfesiForm({ ...res?.data?.suser, addremoteworkmode: remoteWorkModeArray });
            const lastworkmode =
                remoteWorkModeArray.length > 0
                    ? remoteWorkModeArray[
                    remoteWorkModeArray.length - 1
                    ]
                    : remoteWorkModeArray;

            setSelectedOptionsSystemType(
                lastworkmode?.wfhsystemtype?.length > 0
                    ? [
                        ...lastworkmode?.wfhsystemtype?.map((t) => ({
                            label: t,
                            value: t,
                        })),
                    ]
                    : []
            );
            setValueSystemTypeCat(lastworkmode?.wfhsystemtype);
            setSelectedOptionsNetworkType(
                lastworkmode?.wfhsystemtype?.length > 0
                    ? [
                        ...lastworkmode?.internetnetworktype?.map((t) => ({
                            label: t,
                            value: t,
                        })),
                    ]
                    : []
            );
            setValueNetworkTypeCat(lastworkmode?.internetnetworktype);
            setAddremoteemployeeWorkmode(lastworkmode);
            setdocumentFiles(lastworkmode?.wfhsetupphoto);
            setdocumentFilesssid(lastworkmode?.internetssidphoto);
            setPrimaryWorkStationInput(row.workstationinput?.slice(0, 15));
            setEmployeeDetails({
                employeename: row.companyname,
                id: row?.id,
                workstationinput: row?.workstationinput?.slice(0, 15),
                workmode: row?.workmode,
                lastlogid: row?.lastlogid,
            });
            setPrimaryWorkStationInput(row?.shortname?.slice(0, 15));
            // await allotWorkStation(row);
            handleClickOpenAdd();
            setIsLoading(false);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    // Edit model
    const [isViewOpen, setIsViewOpen] = useState(false);
    const handleClickOpenView = () => {
        setIsViewOpen(true);
    };
    const handleCloseModView = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsViewOpen(false);
    };
    const [isLoading, setIsLoading] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsLoading(false);
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    const [isAddOpen, setIsAddOpen] = useState(false);
    const handleClickOpenAdd = () => {
        setIsLoading(false);
        setIsAddOpen(true);
    };
    const handleCloseModAdd = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsAddOpen(false);
    };

    const LoadingBackdrop = ({ open }) => {
        return (
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <div className="pulsating-circle">
                    <CircularProgress color="inherit" className="loading-spinner" />
                </div>
                <Typography
                    variant="h6"
                    sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
                >
                    Please Wait...
                </Typography>
            </Backdrop>
        );
    };

    //Boardingupadate updateby edit page...
    let updateby = pfesiform?.updatedby;
    let addedby = pfesiform?.addedby;

    //edit Put call
    let boredit = pfesiform?._id;

    const updateLastLog = async () => {
        setReload("sdkfskdjfbsd")
        setIsBtn(true);
        let now = new Date();
        let currentTime = now.toLocaleTimeString();
        setPageName(!pageName);
        try {
            let workStationInput = await allotWorkStation(rowParamsData)
            await axios.put(
                `${SERVICE.UPDATE_ANYLOG_REMOTE_WORKMODE}/?logid=${employeeDetails?.lastlogid}&logname=addremoteworkmode`,
                {
                    withoutdetails: false,
                    workstationinput: workStationInput,
                    wfhsystemtype: valueSystemTypeCat,
                    wfhconfigurationdetails: String(
                        addremoteemployeeWorkmode.wfhconfigurationdetails
                    ),
                    wfhsetupphoto: documentFiles,
                    internetnetworktype: valueNetworkTypeCat,
                    internetdailylimit: String(
                        addremoteemployeeWorkmode.internetdailylimit
                    ),
                    internetspeed: String(addremoteemployeeWorkmode.internetspeed),

                    internetssidname: String(
                        addremoteemployeeWorkmode.internetssidname
                    ),
                    internetssidphoto: documentFilesssid,
                    auditchecklistworkareasecure: String(
                        addremoteemployeeWorkmode.auditchecklistworkareasecure
                    ),
                    auditchecklistwindowsongroundlevelworkarea: String(
                        addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea
                    ),
                    auditchecklistworkstationisstored: String(
                        addremoteemployeeWorkmode.auditchecklistworkstationisstored
                    ),
                    auditchecklistnoprivatelyowned: String(
                        addremoteemployeeWorkmode.auditchecklistnoprivatelyowned
                    ),
                    auditchecklistwifisecurity: String(
                        addremoteemployeeWorkmode.auditchecklistwifisecurity
                    ),

                    updatename: String(isUserRoleAccess.companyname),
                    updatetime: currentTime,
                    date: String(new Date()),
                    updatedby: [
                        ...updateby,
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
            setReload("gjghfghfghfg")
            //   await sendRequest();
            setAddremoteemployeeWorkmode({
                wfhconfigurationdetails: "",
                internetdailylimit: "",
                internetspeed: "",
                internetssidname: "",
                auditchecklistworkareasecure: "Please Select",
                auditchecklistwindowsongroundlevelworkarea: "Please Select",
                auditchecklistworkstationisstored: "Please Select",
                auditchecklistnoprivatelyowned: "Please Select",
                auditchecklistwifisecurity: "Please Select",
            });
            setSelectedOptionsSystemType([]);
            setSelectedOptionsNetworkType([]);
            setdocumentFilesssid([]);
            setdocumentFiles([]);

            handleCloseModAdd();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
            setIsBtn(false);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };


    const addSubmit = (e) => {
        e.preventDefault();
        if (selectedOptionsSystemType.length === 0) {
            setPopupContentMalert("Please Select System Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (addremoteemployeeWorkmode.wfhconfigurationdetails === "") {
            setPopupContentMalert("Please Enter Configuration Details!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (documentFiles.length === 0) {
            setPopupContentMalert("Please Upload WFH Setup Photo!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsNetworkType.length === 0) {
            setPopupContentMalert("Please Select Network Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (addremoteemployeeWorkmode.internetdailylimit === "") {
            setPopupContentMalert("Please Enter Daily Limit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (addremoteemployeeWorkmode.internetspeed === "") {
            setPopupContentMalert("Please Enter Internet Speed!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (addremoteemployeeWorkmode.internetssidname === "") {
            setPopupContentMalert("Please Enter SSID-Name!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (documentFilesssid.length === 0) {
            setPopupContentMalert("Please Upload SSID-Photo!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            addremoteemployeeWorkmode.auditchecklistworkareasecure === "Please Select" || !addremoteemployeeWorkmode.auditchecklistworkareasecure
        ) {
            setPopupContentMalert("Please Select Audit Checklist 1 !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea ===
            "Please Select" || !addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea
        ) {
            setPopupContentMalert("Please Select Audit Checklist 2 !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            addremoteemployeeWorkmode.auditchecklistworkstationisstored ===
            "Please Select" || !addremoteemployeeWorkmode.auditchecklistworkstationisstored
        ) {
            setPopupContentMalert("Please Select Audit Checklist 3 !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            addremoteemployeeWorkmode.auditchecklistnoprivatelyowned ===
            "Please Select" || !addremoteemployeeWorkmode.auditchecklistnoprivatelyowned
        ) {
            setPopupContentMalert("Please Select Audit Checklist 4 !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            addremoteemployeeWorkmode.auditchecklistwifisecurity === "Please Select" || !addremoteemployeeWorkmode.auditchecklistwifisecurity
        ) {
            setPopupContentMalert("Please Select Audit Checklist 5!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            updateLastLog();
        }
    };

    //------------------------------------------------------

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("xl");

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Remote Employee Pending Details List",
        pageStyle: "print",
    });

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            shortname: item.workstationinput ? item?.workstationinput?.slice(0, 15) : "",
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber(tableData);
    }, [tableData]);

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
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(tableData.length / pageSize);

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
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "empcode",
            headerName: "Emp Code",
            flex: 0,
            width: 200,
            hide: !columnVisibility.empcode,
            headerClassName: "bold-header",
            pinned: "left",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Empc Code!");
                            }}
                            options={{ message: "Copied Emp Code!" }}
                            text={params?.data?.empcode}
                        >
                            <ListItemText primary={params?.data?.empcode} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "companyname",
            headerName: "Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
            pinned: "left",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Name!");
                            }}
                            options={{ message: "Copied Name!" }}
                            text={params?.data?.companyname}
                        >
                            <ListItemText primary={params?.data?.companyname} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",

        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 100,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "workmode",
            headerName: "Work Mode",
            flex: 0,
            width: 100,
            hide: !columnVisibility.workmode,
            headerClassName: "bold-header",
        },
        {
            field: "workstationinput",
            headerName: "RemoteSystemName",
            flex: 0,
            width: 200,
            hide: !columnVisibility.workstationinput,
            headerClassName: "bold-header",
        },
        {
            field: "shortname",
            headerName: "ShortName",
            flex: 0,
            width: 200,
            hide: !columnVisibility.shortname,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }} gap={2}>
                    {
                        params?.data?.shortname !== "" ?
                            <Typography>{params?.data?.shortname}</Typography>
                            :
                            (params?.data?.approvedremotestatus === "applied" && params?.data?.shortname === "") ?
                                <Typography sx={{ color: "green" }}>{"Applied"}</Typography>
                                :
                                <Typography sx={{ color: "red" }}>{"Yet to approve"}</Typography>

                    }
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 350,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }} gap={2}>
                    {isUserRoleCompare?.includes("vremoteemployeedetailslist") && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            View
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("eremoteemployeedetailslist") && (
                        <>
                            {params?.data?.withoutdetails ?
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        getCodeAdd(params.data);
                                    }}
                                >
                                    Add Details
                                </Button> :
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        getCodeEdit(params.data);
                                    }}
                                >
                                    Change
                                </Button>
                            }

                        </>

                    )}
                    {isUserRoleCompare?.includes("eremoteemployeedetailslist") && (
                        <Link to={`/remoteemployeedetailslog/${params.data.id}`}>
                            <Button sx={userStyle.buttondelete}>
                                <MenuIcon style={{ fontsize: "large" }} />
                            </Button>
                        </Link>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            companyname: item.companyname,

            workmode: item.workmode || "",
            shortname: item.workstationinput ? item?.workstationinput?.slice(0, 15) : "",
            workstationinput: item.workstationinput,
            username: item.username || "",
            branchcode: item.branchcode || "",
            unitcode: item.unitcode || "",
            count: item.count || "",
            systemname: item.systemname || "",
            systemshortname: item.systemshortname || "",
            withoutdetails: item.withoutdetails,
            lastlogid: item.lastlogid,
            addremoteworkmode: item.addremoteworkmode,
            approvedremotestatus: item.approvedremotestatus,
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

    // // Function to filter columns based on search query
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    const [selectedOptionsSystemType, setSelectedOptionsSystemType] = useState(
        []
    );
    let [valueSystemTypeCat, setValueSystemTypeCat] = useState([]);

    const [selectedOptionsNetworkType, setSelectedOptionsNetworkType] = useState(
        []
    );
    let [valueNetworkTypeCat, setValueNetworkTypeCat] = useState([]);

    const [isClearOpenalert, setClearOpenalert] = useState(false);

    const handleSystemTypeChange = (options) => {
        setValueSystemTypeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSystemType(options);
    };

    const handleNetworkTypeChange = (options) => {
        setValueNetworkTypeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsNetworkType(options);
    };

    const customValueRendererSystemType = (valueSystemTypeCat, _categoryname) => {
        return valueSystemTypeCat?.length
            ? valueSystemTypeCat.map(({ label }) => label)?.join(", ")
            : "Please Select System Type";
    };

    const customValueRendererNetworkType = (
        valueNetworkTypeCat,
        _categoryname
    ) => {
        return valueNetworkTypeCat?.length
            ? valueNetworkTypeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Network Type";
    };

    const workfromhomesystemDetails = [
        { label: "Desktop", value: "Desktop" },
        { label: "Laptop", value: "Laptop" },
    ];
    const workfromhomeinternetDetails = [
        { label: "WIFI", value: "WIFI" },
        { label: "Mobile Network", value: "Mobile Network" },
    ];
    const auditcheckListOpt = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];

    const [documentFiles, setdocumentFiles] = useState([]);

    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleResumeUpload = (event) => {
        const file = event.target.files[0]; // Only the first file
        const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

        if (!file) {
            return; // No file selected
        }

        if (file.size > maxFileSize) {
            setPopupContentMalert(
                "File size is greater than 1MB, please upload a file below 1MB!"
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            return; // Stop further processing
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setdocumentFiles((prevFiles) => [
                // ...prevFiles,
                {
                    name: file.name,
                    preview: reader.result,
                    data: reader.result.split(",")[1],
                    remark: "resume file",
                },
            ]);
        };
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const [documentFilesssid, setdocumentFilesssid] = useState([]);

    const handleFileDeletessid = (index) => {
        setdocumentFilesssid((prevFiles) =>
            prevFiles.filter((_, i) => i !== index)
        );
    };

    const handleResumeUploadssid = (event) => {
        const file = event.target.files[0]; // Only the first file
        const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

        if (!file) {
            return; // No file selected
        }

        if (file.size > maxFileSize) {
            setPopupContentMalert(
                "File size is greater than 1MB, please upload a file below 1MB!"
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            return; // Stop further processing
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setdocumentFilesssid((prevFiles) => [
                // ...prevFiles,
                {
                    name: file.name,
                    preview: reader.result,
                    data: reader.result.split(",")[1],
                    remark: "resume file",
                },
            ]);
        };
    };

    const renderFilePreviewssid = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    //FILTER START
    useEffect(() => {
        fetchDepartments();
    }, []);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const [filterState, setFilterState] = useState({
        type: "Individual",
        employeestatus: "Please Select Employee Status",
    });

    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
    ];

    //MULTISELECT ONCHANGE START

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };



    const [filterLoader, setFilterLoader] = useState(false);
    // const [tableLoader, setTableLoader] = useState(false);








    //FILTER END

    return (
        <Box>
            <NotificationContainer />
            {/* <Headtitle title={"Remote Employee Details"} /> */}
            <LoadingBackdrop open={isLoading} />
            {/* ****** Header Content ****** */}

            {isUserRoleCompare?.includes("menuremoteemployeedetailslist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Remote Employee Pending Details List
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
                                        <MenuItem value={tableData?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes(
                                        "excelremoteemployeedetailslist"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "csvremoteemployeedetailslist"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "printremoteemployeedetailslist"
                                    ) && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleprint}
                                                >
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "pdfremoteemployeedetailslist"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "imageremoteemployeedetailslist"
                                    ) && (
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
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={tableData}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={tableData}
                                />
                            </Grid>
                        </Grid><br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
                        <>
                            {tableLoader ? (
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
                            ) : (
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefTableImg} >
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
                                        gridRefTableImg={gridRefTableImg}
                                        paginated={false}
                                        filteredDatas={filteredDatas}
                                        // totalDatas={totalDatas}
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        itemsList={tableData}
                                    />
                                </Box>
                            )}
                        </>
                    </Box>
                </>
            )}{" "}


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

            {/* Delete Modal */}

            <Box>
                {/* View DIALOG */}
                <Dialog
                    open={isViewOpen}
                    onClose={handleCloseModView}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    sx={{ marginTop: "50px" }}
                >
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Typography sx={userStyle.HeaderText}>
                                {" "}
                                Remote Employee Work Mode Details
                            </Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                {/* {pfesiform?.workstationinput && ( */}
                                <Grid item md={4} sm={12} xs={12}>
                                    <Typography>
                                        Work Station: {pfesiform?.workstationinput?.slice(0, 15)}
                                    </Typography>
                                </Grid>
                                {/* )} */}

                                <Grid item md={4} sm={12} xs={12}>
                                    <Typography>Employee code: {pfesiform.empcode}</Typography>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <Typography>
                                        Employee Name: {pfesiform.companyname}
                                    </Typography>
                                </Grid>
                            </Grid>{" "}
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {" "}
                                        WFH System Details
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>System Type</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.wfhsystemtype}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Configuration Details </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={workmode?.wfhconfigurationdetails}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <Typography>WFH Setup Photo </Typography>
                                    <Grid>
                                        <br />
                                        {documentFiles?.length > 0 &&
                                            documentFiles.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={6} sm={6} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid></Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <VisibilityOutlinedIcon
                                                                style={{
                                                                    fontsize: "large",
                                                                    cursor: "pointer",
                                                                }}
                                                                sx={buttonStyles.buttonview}
                                                                onClick={() => renderFilePreview(file)}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {" "}
                                        Internet Details
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Network Type</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.internetnetworktype}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <Typography>Daily Limit </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.internetdailylimit}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <Typography>Internet Speed</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.internetspeed}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <Typography>SSID-Name </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.internetssidname}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <Typography>SSID-Photo </Typography>
                                    <Grid>
                                        <br />
                                        {documentFilesssid?.length > 0 &&
                                            documentFilesssid.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={6} sm={6} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid></Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <VisibilityOutlinedIcon
                                                                style={{
                                                                    fontsize: "large",
                                                                    cursor: "pointer",
                                                                }}
                                                                sx={buttonStyles.buttonview}
                                                                onClick={() => renderFilePreviewssid(file)}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>
                                </Grid>

                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Audit Checklist
                                    </Typography>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        1. Work area is secure and restricted to only the SDS
                                        employee
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.auditchecklistworkareasecure}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        2. Windows on ground level work area(s) can be covered when
                                        viewing PHI (e.g., blinds)
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={
                                                workmode?.auditchecklistwindowsongroundlevelworkarea
                                            }
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        3. Workstation is stored in a secured area when not in use
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.auditchecklistworkstationisstored}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        4. No privately owned equipment in use (e.g., personal
                                        laptop)
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.auditchecklistnoprivatelyowned}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        5. Wi-Fi security has WPA2 protection or better enabled
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={workmode?.auditchecklistwifisecurity}
                                            readOnly={true}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br /> <br />
                            <Grid container>
                                <Button
                                    variant="contained"
                                    onClick={handleCloseModView}
                                    sx={buttonStyles.btncancel}
                                >
                                    Back
                                </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <Box>

                {/* Add DIALOG */}
                <Dialog
                    open={isAddOpen}
                    onClose={handleCloseModAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    sx={{ marginTop: "50px" }}
                >
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Typography sx={userStyle.HeaderText}>
                                {" "}
                                Remote Employee Work Mode Details Edit
                            </Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} sm={12} xs={12}>
                                    <Typography>
                                        Work Station: {primaryWorkStationInput}
                                    </Typography>
                                </Grid>

                                <Grid item md={4} sm={12} xs={12}>
                                    <Typography>Employee code: {pfesiform.empcode}</Typography>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <Typography>
                                        Employee Name: {pfesiform.companyname}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {" "}
                                        WFH System Details
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            System Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={workfromhomesystemDetails}
                                            value={selectedOptionsSystemType}
                                            onChange={(e) => {
                                                handleSystemTypeChange(e);
                                            }}
                                            valueRenderer={customValueRendererSystemType}
                                            labelledBy="Please Select System Type"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Configuration Details <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={addremoteemployeeWorkmode.wfhconfigurationdetails}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    wfhconfigurationdetails: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <Typography>
                                        WFH Setup Photo <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Grid>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            component="label"
                                            sx={{
                                                "@media only screen and (max-width:550px)": {
                                                    marginY: "5px",
                                                },
                                                ...buttonStyles.buttonsubmit,
                                            }}
                                        >
                                            Upload
                                            <input
                                                type="file"
                                                id="resume"
                                                accept=".jpeg, .png, .jpg, .ipg"
                                                name="file"
                                                hidden
                                                onChange={(e) => {
                                                    handleResumeUpload(e);
                                                }}
                                            />
                                        </Button>
                                        <br />
                                        <br />
                                        {documentFiles?.length > 0 &&
                                            documentFiles.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={6} sm={6} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid></Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <VisibilityOutlinedIcon
                                                                style={{
                                                                    fontsize: "large",
                                                                    cursor: "pointer",
                                                                }}
                                                                sx={buttonStyles.buttonview}
                                                                onClick={() => renderFilePreview(file)}
                                                            />
                                                        </Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <Button
                                                                style={{
                                                                    fontsize: "large",
                                                                    cursor: "pointer",
                                                                    marginTop: "-5px",
                                                                }}
                                                                sx={buttonStyles.buttondelete}
                                                                onClick={() => handleFileDelete(index)}
                                                            >
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        {" "}
                                        Internet Details
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Network Type <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={workfromhomeinternetDetails}
                                            value={selectedOptionsNetworkType}
                                            onChange={(e) => {
                                                handleNetworkTypeChange(e);
                                            }}
                                            valueRenderer={customValueRendererNetworkType}
                                            labelledBy="Please Select Network Type"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <Typography>
                                            Daily Limit <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Daily Limit"
                                            value={addremoteemployeeWorkmode.internetdailylimit}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    internetdailylimit: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <Typography>
                                            Internet Speed<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Internet Speed"
                                            value={addremoteemployeeWorkmode.internetspeed}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    internetspeed: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <Typography>
                                            SSID-Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter SSID Name"
                                            value={addremoteemployeeWorkmode.internetssidname}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    internetssidname: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <Typography>
                                        SSID-Photo <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Grid>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            component="label"
                                            sx={{
                                                "@media only screen and (max-width:550px)": {
                                                    marginY: "5px",
                                                },
                                                ...buttonStyles.buttonsubmit,
                                            }}
                                        >
                                            Upload
                                            <input
                                                type="file"
                                                id="resume"
                                                accept=".jpeg, .png, .jpg, .ipg"
                                                name="file"
                                                hidden
                                                onChange={(e) => {
                                                    handleResumeUploadssid(e);
                                                }}
                                            />
                                        </Button>
                                        <br />
                                        <br />
                                        {documentFilesssid?.length > 0 &&
                                            documentFilesssid.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={6} sm={6} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid></Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <VisibilityOutlinedIcon
                                                                style={{
                                                                    fontsize: "large",
                                                                    cursor: "pointer",
                                                                }}
                                                                sx={buttonStyles.buttonview}
                                                                onClick={() => renderFilePreviewssid(file)}
                                                            />
                                                        </Grid>
                                                        <Grid item md={1} sm={6} xs={6}>
                                                            <Button
                                                                style={{
                                                                    fontsize: "large",
                                                                    cursor: "pointer",
                                                                    marginTop: "-5px",
                                                                }}
                                                                sx={buttonStyles.buttondelete}
                                                                onClick={() => handleFileDeletessid(index)}
                                                            >
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>
                                </Grid>

                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.SubHeaderText}>
                                        Audit Checklist
                                    </Typography>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        1. Work area is secure and restricted to only the SDS
                                        employee<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            maxMenuHeight={250}
                                            options={auditcheckListOpt}
                                            placeholder="Please Select SubCategory"
                                            value={{
                                                label:
                                                    addremoteemployeeWorkmode.auditchecklistworkareasecure || "Please Select",
                                                value:
                                                    addremoteemployeeWorkmode.auditchecklistworkareasecure || "Please Select",
                                            }}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    auditchecklistworkareasecure: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        2. Windows on ground level work area(s) can be covered when
                                        viewing PHI (e.g., blinds)<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            maxMenuHeight={250}
                                            options={auditcheckListOpt}
                                            placeholder="Please Select SubCategory"
                                            value={{
                                                label:
                                                    addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea || "Please Select",
                                                value:
                                                    addremoteemployeeWorkmode.auditchecklistwindowsongroundlevelworkarea || "Please Select",
                                            }}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    auditchecklistwindowsongroundlevelworkarea: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        3. Workstation is stored in a secured area when not in use
                                        <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            maxMenuHeight={250}
                                            options={auditcheckListOpt}
                                            placeholder="Please Select SubCategory"
                                            value={{
                                                label:
                                                    addremoteemployeeWorkmode.auditchecklistworkstationisstored || "Please Select",
                                                value:
                                                    addremoteemployeeWorkmode.auditchecklistworkstationisstored || "Please Select",
                                            }}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    auditchecklistworkstationisstored: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        4. No privately owned equipment in use (e.g., personal
                                        laptop)<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            maxMenuHeight={250}
                                            options={auditcheckListOpt}
                                            placeholder="Please Select SubCategory"
                                            value={{
                                                label:
                                                    addremoteemployeeWorkmode.auditchecklistnoprivatelyowned || "Please Select",
                                                value:
                                                    addremoteemployeeWorkmode.auditchecklistnoprivatelyowned || "Please Select",
                                            }}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    auditchecklistnoprivatelyowned: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={9} sm={12} xs={12}>
                                    <Typography>
                                        5. Wi-Fi security has WPA2 protection or better enabled
                                        <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Selects
                                            maxMenuHeight={250}
                                            options={auditcheckListOpt}
                                            placeholder="Please Select SubCategory"
                                            value={{
                                                label:
                                                    addremoteemployeeWorkmode.auditchecklistwifisecurity || "Please Select",
                                                value:
                                                    addremoteemployeeWorkmode.auditchecklistwifisecurity || "Please Select",
                                            }}
                                            onChange={(e) => {
                                                setAddremoteemployeeWorkmode({
                                                    ...addremoteemployeeWorkmode,
                                                    auditchecklistwifisecurity: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br /> <br />
                            <Grid container>
                                <Grid
                                    item
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={addSubmit}
                                            disabled={isBtn}
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Update
                                        </Button>
                                        <Grid item md={1}></Grid>
                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={handleCloseModAdd}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid sx={{ display: "flex", justifyContent: "center" }}>
                                        <Typography>
                                            Manage Wi-Fi connection&#62; More Wi-Fi Settings&#62;
                                            choose the connection &#62; take the screenshot (complete
                                            page with SSID and other details)
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>

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
                itemsTwo={tableData ?? []}
                filename={"Remote Employee Pending Details"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default RemoteEmployeePendingDetailsList;