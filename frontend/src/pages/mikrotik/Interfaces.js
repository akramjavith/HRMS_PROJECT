import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
    Typography,
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
import AlertDialog from "../../components/Alert.js";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling.js";
import ExportData from "../../components/ExportData.js";
import Headtitle from "../../components/Headtitle.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import StyledDataGrid from "../../components/TableStyle.js";
import { UserRoleAccessContext } from "../../context/Appcontext.js";
import { AuthContext } from "../../context/Appcontext.js";
import { userStyle } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice.js";
import InterfacesData from './InterfacesData';

function Interfaces() {


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
            })
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
        })
        setFilterApplied(false);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        window.location.reload();
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

    const { dataInterface, loading, error } = InterfacesData(filterFinal?.url, filterFinal?.username, filterFinal?.password, interval, filterApplied);


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
        "Type",
        "Actual MTU",
        "L2 Mtu",
        "Tx",
        "Rx",
        "Tx Packet (p/s)",
        "Rx Packet (p/s)",
        "FP Tx",
        "FP Rx",
        "FP Tx Packet (p/s)",
        "FP Rx Packet (p/s)",
    ];
    let exportRowValues = [
        "name",
        "type",
        "actualmtu",
        "l2mtu",
        "tx",
        "rx",
        "txpacket",
        "rxpacket",
        "fptx",
        "fprx",
        "fptxpacket",
        "fprxpacket",
    ];

    let typeOptions = [
        { label: "Invite", value: "Invite" },
        { label: "Open", value: "Open" },
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
    const [assetVariant, setAssetVariant] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        name: "",
        url: "",
        username: "",
        password: "",
        showpassword: false,
    });
    const [assetVariantEdit, setAssetVariantEdit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        name: "",
        url: "",
        username: "",
        password: "",
    });
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
            pagename: String("Mikrotik Interfaces"),
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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allAssetVariantEdit, setAllAssetVariantEdit] = useState([]);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        name: true,
        type: true,
        actualmtu: true,
        l2mtu: true,
        tx: true,
        rx: true,
        txpacket: true,
        rxpacket: true,
        fptx: true,
        fprx: true,
        fptxpacket: true,
        fprxpacket: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber(dataInterface);
    }, [dataInterface]);

    // useEffect(() => {
    //     fetchMikroTikInterface();
    // }, []);
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
            await axios.delete(
                `${SERVICE.SINGLE_MIKROTIKMASTER}/${deleteTeamId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchMikroTikInterface();
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








    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_MIKROTIKMASTER}/${assetVariantEdit.id}`,
                {
                    company: String(assetVariantEdit.company),
                    branch: String(assetVariantEdit.branch),
                    unit: String(assetVariantEdit.unit),
                    name: String(assetVariantEdit.name),
                    url: String(assetVariantEdit.url),
                    username: String(assetVariantEdit.username),
                    password: String(assetVariantEdit.password),
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
            await fetchMikroTikInterface();
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

        if (assetVariantEdit.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.name === "") {
            setPopupContentMalert("Please Enter Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.url === "") {
            setPopupContentMalert("Please Enter URL!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.url !== "" && !isValidURL(assetVariantEdit.url)) {
            setPopupContentMalert("Please Enter Valid URL!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.username === "") {
            setPopupContentMalert("Please Enter Username!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetVariantEdit.password === "") {
            setPopupContentMalert("Please Enter Password!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };
    //get all Asset Variant name.
    const fetchMikroTikInterface = async () => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.get(SERVICE.GETALL_MIKROTIK_INTERFACE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas =
                response?.data?.allmikrotikinterface
            console.log(datas)
            setTeamsArray(datas);
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
                    saveAs(blob, "MikrotikInterface.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Mikrotik Interfaces",
        pageStyle: "print",
    });



    const [prevItems, setPrevItems] = useState([]); // Previous data

    // Function to convert bytes to an appropriate unit
    const formatBytes = (bytes) => {
        if (bytes < 1000) return `${bytes} bps`; // Bytes per second
        if (bytes < 1000000) return `${(bytes / 1000).toFixed(2)} Kbps`; // Kilobits per second
        return `${(bytes / 1000000).toFixed(2)} Mbps`; // Megabits per second
    };
    //serial no for listing items
    const addSerialNumber = (iterfacedatas) => {
        const itemsWithSerialNumber = iterfacedatas?.map((item, index) => {
            // Get previous data for comparison
            const prevItem = prevItems[index] || {};

            // Calculate current and previous byte values
            const txBytes = Number(item["tx-byte"]) || 0;
            const rxBytes = Number(item["rx-byte"]) || 0;
            const fptxBytes = Number(item["fp-tx-byte"]) || 0;
            const fprxBytes = Number(item["fp-rx-byte"]) || 0;

            // Calculate the differences
            const txDiff = txBytes - (Number(prevItem["tx-byte"]) || 0);
            const rxDiff = rxBytes - (Number(prevItem["rx-byte"]) || 0);
            const fptxDiff = fptxBytes - (Number(prevItem["fp-tx-byte"]) || 0);
            const fprxDiff = fprxBytes - (Number(prevItem["fp-rx-byte"]) || 0);



            // Calculate current and previous byte values
            const txPacket = Number(item["tx-packet"]) || 0;
            const rxPacket = Number(item["rx-packet"]) || 0;
            const fptxPacket = Number(item["fp-tx-packet"]) || 0;
            const fprxPacket = Number(item["fp-rx-packet"]) || 0;
            // Calculate current and previous byte values
            const txDiffPacket = txPacket - Number(prevItem["tx-packet"]) || 0;
            const rxDiffPacket = rxPacket - Number(prevItem["rx-packet"]) || 0;
            const fptxDiffPacket = fptxPacket - Number(prevItem["fp-tx-packet"]) || 0;
            const fprxDiffPacket = fprxPacket - Number(prevItem["fp-rx-packet"]) || 0;

            return {
                ...item, // Original data
                serialNumber: index + 1, // Serial number
                actualmtu: item?.mtu, // Actual MTU
                tx: formatBytes(txDiff * 8), // Convert to appropriate unit
                rx: formatBytes(rxDiff * 8), // Convert to appropriate unit
                fptx: formatBytes(fptxDiff * 8), // Convert to appropriate unit
                fprx: formatBytes(fprxDiff * 8), // Convert to appropriate unit
                // txpacket: item["tx-packet"] || 0, // Ensure value is a number
                // rxpacket: item["rx-packet"] || 0, // Ensure value is a number
                // fptxpacket: item["fp-tx-packet"] || 0, // Ensure value is a number
                // fprxpacket: item["fp-rx-packet"] || 0, // Ensure value is a number
                txpacket: txDiffPacket,
                rxpacket: rxDiffPacket,
                fptxpacket: fptxDiffPacket,
                fprxpacket: fprxDiffPacket,
            };
        });

        // Update the previous items to the current ones before setting new items
        setPrevItems(iterfacedatas);
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
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "actualmtu",
            headerName: "Actual MTU",
            flex: 0,
            width: 150,
            hide: !columnVisibility.actualmtu,
            headerClassName: "bold-header",
        },
        {
            field: "l2mtu",
            headerName: "L2 Mtu",
            flex: 0,
            width: 150,
            hide: !columnVisibility.l2mtu,
            headerClassName: "bold-header",
        },
        {
            field: "tx",
            headerName: "Tx",
            flex: 0,
            width: 150,
            hide: !columnVisibility.tx,
            headerClassName: "bold-header",
        },
        {
            field: "rx",
            headerName: "Rx",
            flex: 0,
            width: 150,
            hide: !columnVisibility.rx,
            headerClassName: "bold-header",
        },
        {
            field: "txpacket",
            headerName: "Tx Packet (p/s)",
            flex: 0,
            width: 150,
            hide: !columnVisibility.txpacket,
            headerClassName: "bold-header",
        },
        {
            field: "rxpacket",
            headerName: "Rx Packet (p/s)",
            flex: 0,
            width: 150,
            hide: !columnVisibility.rxpacket,
            headerClassName: "bold-header",
        },
        {
            field: "fptx",
            headerName: "FP Tx",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fptx,
            headerClassName: "bold-header",
        },
        {
            field: "fprx",
            headerName: "FP Rx",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fprx,
            headerClassName: "bold-header",
        },
        {
            field: "fptxpacket",
            headerName: "FP Tx Packet (p/s)",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fptxpacket,
            headerClassName: "bold-header",
        },
        {
            field: "fprxpacket",
            headerName: "FP Rx Packet (p/s)",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fprxpacket,
            headerClassName: "bold-header",
        },



        // {
        //   field: "actions",
        //   headerName: "Action",
        //   flex: 0,
        //   width: 250,
        //   minHeight: "40px !important",
        //   sortable: false,
        //   hide: !columnVisibility.actions,
        //   headerClassName: "bold-header",
        //   renderCell: (params) => (
        //     <Grid sx={{ display: "flex" }}>
        //       {isUserRoleCompare?.includes("einterface") && (
        //         <>
        //           <Button
        //             sx={userStyle.buttonedit}
        //             onClick={() => {
        //               setAssetVariantEdit(params.row);
        //               handleClickOpenEdit();
        //             }}
        //           >
        //             <EditOutlinedIcon sx={buttonStyles.buttonedit} />
        //           </Button>
        //         </>
        //       )}

        //       {isUserRoleCompare?.includes("dinterface") && (
        //         <>
        //           <Button
        //             sx={userStyle.buttondelete}
        //             onClick={(e) => {
        //               setDeleteTeamId(params.row.id);
        //               handleClickOpen();
        //             }}
        //           >
        //             <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
        //           </Button>
        //         </>
        //       )}
        //       {isUserRoleCompare?.includes("vinterface") && (
        //         <Button
        //           sx={userStyle.buttonedit}
        //           onClick={() => {
        //             // getviewCode(params.row.id);
        //             setSingleRow(params?.row);
        //             handleClickOpenview();
        //           }}
        //         >
        //           <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
        //         </Button>
        //       )}
        //       {isUserRoleCompare?.includes("iinterface") && (
        //         <Button
        //           size="small"
        //           sx={userStyle.actionbutton}
        //           onClick={() => {
        //             setSingleRow(params?.row);
        //             handleClickOpeninfo();
        //           }}
        //         >
        //           <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
        //         </Button>
        //       )}
        //     </Grid>
        //   ),
        // },
    ];


    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item[".id"],
            serialNumber: item.serialNumber,
            name: item?.name,
            type: item?.type,
            actualmtu: item?.actualmtu,
            l2mtu: item?.l2mtu,

            tx: item?.tx,
            rx: item?.rx,
            txpacket: item?.txpacket,
            rxpacket: item?.rxpacket,
            fptx: item?.fptx,
            fprx: item?.fprx,
            fptxpacket: item?.fptxpacket,
            fprxpacket: item?.fprxpacket,
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
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;
    // Side effect to open the popup on error
    useEffect(() => {
        if (error) { // If an error occurred
            setPopupContentMalert(error?.message);  // Set popup message from the error
            setPopupSeverityMalert('error');        // Set severity to "error"
            handleClickOpenPopupMalert();           // Open the popup
        }
    }, [error]); // Run the effect only when `error` changes

    return (
        <Box>
            <Headtitle title={"MIKROTIK INTERFACES"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Mikrotik Interfaces"
                modulename="Mikrotik"
                submodulename="Interfaces"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("linterfaces") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Filter Mikrotik Interfaces
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
            {isUserRoleCompare?.includes("linterfaces") && (
                <>
                    {loading ? (
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
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    List Mikrotik Interfaces
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
                                            <MenuItem value={dataInterface?.length}>
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
                                        {isUserRoleCompare?.includes("excelinterfaces") && (
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
                                        {isUserRoleCompare?.includes("csvinterfaces") && (
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
                                        {isUserRoleCompare?.includes("printinterfaces") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfinterfaces") && (
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
                                        {isUserRoleCompare?.includes("imageinterfaces") && (
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
                            View Mikrotik Master
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{singleRow.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{singleRow.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{singleRow.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{singleRow.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">URL</Typography>
                                    <Typography>{singleRow.url}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Username</Typography>
                                    <Typography>{singleRow.username}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Password</Typography>
                                    <Typography>{singleRow.password}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.buttonsubmit}
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
                                            Company <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={accessbranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: assetVariantEdit.company,
                                                value: assetVariantEdit.company,
                                            }}
                                            onChange={(e) => {

                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    company: e.target.value,
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
                                            options={accessbranch
                                                ?.filter((comp) =>
                                                    assetVariantEdit.company === comp.company
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
                                                label: assetVariantEdit.branch,
                                                value: assetVariantEdit.branch,
                                            }}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    branch: e.value,
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
                                            options={accessbranch
                                                ?.filter(
                                                    (comp) =>
                                                        assetVariantEdit.company === comp.company &&
                                                        assetVariantEdit.branch === comp.branch
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
                                                label: assetVariantEdit.unit,
                                                value: assetVariantEdit.unit,
                                            }}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    unit: e.value,
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
                                            URL<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter URL"
                                            value={assetVariantEdit.url}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    url: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Username<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Username"
                                            value={assetVariantEdit.username}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    username: e.target.value?.trim(),
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Password<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            placeholder="Please Enter Password"
                                            id="outlined-adornment-password"
                                            type={assetVariantEdit?.showpassword ? "text" : "password"}
                                            value={assetVariantEdit.password}
                                            onChange={(e) => {
                                                setAssetVariantEdit({
                                                    ...assetVariantEdit,
                                                    password: e.target.value,
                                                });
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        onClick={(e) => {
                                                            setAssetVariantEdit({
                                                                ...assetVariantEdit,
                                                                showpassword: !assetVariantEdit?.showpassword,
                                                            });
                                                        }}
                                                        edge="end"
                                                    >
                                                        {!assetVariantEdit.showpassword ? (
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
                filename={"Mikrotik Interfaces"}
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
                heading="Mikrotik Master Info"
                addedby={singleRow?.addedby}
                updateby={singleRow?.updatedby}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default Interfaces;
