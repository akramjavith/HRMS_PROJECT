import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

function AssetSoftwareGrouping() {
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

    let exportColumnNames = ["Material", "Application Name", "Operating System", "Remote Access Software", "Web Browser", "Device Drivers", "Productivity Software", "Cloud Computing Software", "Communication Software", "Development Software", "Database Management Software", "Security Software", "Network Software", "Printer Software", "Multimedia Software",];
    let exportRowValues = ["material", "applicationname", "operatingsystem", "remoteaccesssoftware", "webbrowser", "devicedrivers", "productivitysoftware", "cloudcomputingsoftware", "communicationsoftware", "developmentsoftware", "databasemanagementsoftware", "securitysoftware", "networksoftware", "printersoftware", "multimediasoftware",];

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Asset Software Grouping"),
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

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [applicationName, setApplicationName] = useState({

        bulkselect: true,
        remoteaccesssoftware: true,
        applicationname: true,
        operatingsystem: true,
        webbrowser: true,
        devicedrivers: true,
        productivitysoftware: true,
        cloudcomputingsoftware: true,
        communicationsoftware: true,
        developmentsoftware: true,
        databasemanagementsoftware: true,
        securitysoftware: true,
        networksoftware: true,
        printersoftware: true,
        multimediasoftware: true,

    });

    const ifBulkselect = applicationName?.remoteaccesssoftware &&
        applicationName?.applicationname &&
        applicationName?.operatingsystem &&
        applicationName?.webbrowser &&
        applicationName?.devicedrivers &&
        applicationName?.productivitysoftware &&
        applicationName?.cloudcomputingsoftware &&
        applicationName?.communicationsoftware &&
        applicationName?.developmentsoftware &&
        applicationName?.databasemanagementsoftware &&
        applicationName?.securitysoftware &&
        applicationName?.networksoftware &&
        applicationName?.printersoftware &&
        applicationName?.multimediasoftware

    useEffect(() => {
        setApplicationName({
            ...applicationName,
            bulkselect: ifBulkselect
        })
    }, [ifBulkselect])


    const [applicationNameEdit, setApplicationNameEdit] = useState({
        material: "",
        bulkselect: true,
        remoteaccesssoftware: true,
        applicationname: true,
        operatingsystem: true,
        webbrowser: true,
        devicedrivers: true,
        productivitysoftware: true,
        cloudcomputingsoftware: true,
        communicationsoftware: true,
        developmentsoftware: true,
        databasemanagementsoftware: true,
        securitysoftware: true,
        networksoftware: true,
        printersoftware: true,
        multimediasoftware: true,
    });

    const ifBulkselectEdit = applicationNameEdit?.remoteaccesssoftware &&
        applicationNameEdit?.applicationname &&
        applicationNameEdit?.operatingsystem &&
        applicationNameEdit?.webbrowser &&
        applicationNameEdit?.devicedrivers &&
        applicationNameEdit?.productivitysoftware &&
        applicationNameEdit?.cloudcomputingsoftware &&
        applicationNameEdit?.communicationsoftware &&
        applicationNameEdit?.developmentsoftware &&
        applicationNameEdit?.databasemanagementsoftware &&
        applicationNameEdit?.securitysoftware &&
        applicationNameEdit?.networksoftware &&
        applicationNameEdit?.printersoftware &&
        applicationNameEdit?.multimediasoftware

    useEffect(() => {
        setApplicationNameEdit({
            ...applicationNameEdit,
            bulkselect: ifBulkselectEdit
        })
    }, [ifBulkselectEdit])

    const [loader, setLoader] = useState(false);
    const [applicationNameArray, setApplicationNameArray] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isBtn, setIsBtn] = useState(false);
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteAssetCapacity, setDeleteApplicationName] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allApplicationNameEdit, setAllApplicationNameEdit] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        material: true,
        applicationname: true,
        operatingsystem: true,
        remoteaccesssoftware: true,
        webbrowser: true,
        devicedrivers: true,
        productivitysoftware: true,
        cloudcomputingsoftware: true,
        developmentsoftware: true,
        databasemanagementsoftware: true,
        securitysoftware: true,
        communicationsoftware: true,
        networksoftware: true,
        printersoftware: true,
        multimediasoftware: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    //useEffect
    useEffect(() => {
        addSerialNumber();
    }, [applicationNameArray]);

    useEffect(() => {
        fetchApplicationName();
        fetchApplicationNameAll();
    }, [isEditOpen]);

    useEffect(() => {
        fetchApplicationName();
        fetchMaterialAll()
    }, []);
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

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
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

    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_ASSETSOFTWAREGROUPING}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteApplicationName(res?.data?.sassertsoftwaregrouping);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // Alert delete popup
    let assetid = deleteAssetCapacity._id;
    const delAsset = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.SINGLE_ASSETSOFTWAREGROUPING}/${assetid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchApplicationName();
            setLoader(true);
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName)
        setIsBtn(true);
        try {

            const IndividualSettingPromises = valueMaterialCat?.map((item) => {
                return axios.post(SERVICE.CREATE_ASSETSOFTWAREGROUPING, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    material: String(item),
                    bulkselect: Boolean(applicationName.bulkselect),
                    applicationname: Boolean(applicationName.applicationname),
                    operatingsystem: Boolean(applicationName.operatingsystem),
                    remoteaccesssoftware: Boolean(applicationName.remoteaccesssoftware),
                    webbrowser: Boolean(applicationName.webbrowser),
                    devicedrivers: Boolean(applicationName.devicedrivers),
                    productivitysoftware: Boolean(applicationName.productivitysoftware),
                    cloudcomputingsoftware: Boolean(applicationName.cloudcomputingsoftware),
                    communicationsoftware: Boolean(applicationName.communicationsoftware),
                    databasemanagementsoftware: Boolean(applicationName.databasemanagementsoftware),
                    developmentsoftware: Boolean(applicationName.developmentsoftware),
                    securitysoftware: Boolean(applicationName.securitysoftware),
                    networksoftware: Boolean(applicationName.networksoftware),
                    printersoftware: Boolean(applicationName.printersoftware),
                    multimediasoftware: Boolean(applicationName.multimediasoftware),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                })
            });

            await Promise.all(IndividualSettingPromises);


            await fetchApplicationName();
            setApplicationName({
                bulkselect: true,
                remoteaccesssoftware: true,
                webbrowser: true,
                devicedrivers: true,
                productivitysoftware: true,
                cloudcomputingsoftware: true,
                communicationsoftware: true,
                developmentsoftware: true,
                databasemanagementsoftware: true,
                securitysoftware: true,
                networksoftware: true,
                printersoftware: true,
                multimediasoftware: true,
                applicationname: true,
                operatingsystem: true,
            });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
            setIsBtn(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        setPageName(!pageName)
        e.preventDefault();
        const isNameMatch = applicationNameArray?.some(
            (item) => valueMaterialCat?.includes(item.material)
        );
        if (selectedOptionsMaterial?.length === 0) {
            setPopupContentMalert("Please Select Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        setPageName(!pageName)
        e.preventDefault();
        setApplicationName({ name: "", type: "Please Select Type" });
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
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
    const getCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_ASSETSOFTWAREGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplicationNameEdit(res?.data?.sassertsoftwaregrouping);
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_ASSETSOFTWAREGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplicationNameEdit(res?.data?.sassertsoftwaregrouping);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_ASSETSOFTWAREGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplicationNameEdit(res?.data?.sassertsoftwaregrouping);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //frequency master name updateby edit page...
    let updateby = applicationNameEdit.updatedby;
    let addedby = applicationNameEdit.addedby;
    let frequencyId = applicationNameEdit._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_ASSETSOFTWAREGROUPING}/${frequencyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    material: String(applicationNameEdit?.material),
                    bulkselect: Boolean(applicationNameEdit.bulkselect),
                    applicationname: Boolean(applicationNameEdit.applicationname),
                    operatingsystem: Boolean(applicationNameEdit.operatingsystem),
                    remoteaccesssoftware: Boolean(applicationNameEdit.remoteaccesssoftware),
                    webbrowser: Boolean(applicationNameEdit.webbrowser),
                    devicedrivers: Boolean(applicationNameEdit.devicedrivers),
                    productivitysoftware: Boolean(applicationNameEdit.productivitysoftware),
                    cloudcomputingsoftware: Boolean(applicationNameEdit.cloudcomputingsoftware),
                    communicationsoftware: Boolean(applicationNameEdit.communicationsoftware),
                    developmentsoftware: Boolean(applicationNameEdit.developmentsoftware),
                    databasemanagementsoftware: Boolean(applicationNameEdit.databasemanagementsoftware),
                    securitysoftware: Boolean(applicationNameEdit.securitysoftware),
                    networksoftware: Boolean(applicationNameEdit.networksoftware),
                    printersoftware: Boolean(applicationNameEdit.printersoftware),
                    multimediasoftware: Boolean(applicationNameEdit.multimediasoftware),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchApplicationName();
            await fetchApplicationNameAll();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const editSubmit = (e) => {
        setPageName(!pageName)
        e.preventDefault();
        fetchApplicationNameAll();
        const isNameMatch = allApplicationNameEdit?.some(
            (item) =>
                item.material?.toLowerCase() === applicationNameEdit.material?.toLowerCase()
        );
        if (applicationNameEdit.material === "" || applicationNameEdit.material === undefined) {
            setPopupContentMalert("Please Select Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };

    //company multiselect
    const [selectedOptionsMaterial, setSelectedOptionsCompany] = useState([]);
    let [valueMaterialCat, setValueMaterialCat] = useState([]);
    const handleMaterialChange = (options) => {
        setValueMaterialCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);

    };

    const customValueRendererMaterial = (valueMaterialCat, _categoryname) => {
        return valueMaterialCat?.length
            ? valueMaterialCat.map(({ label }) => label)?.join(", ")
            : "Please Select Material";
    };

    const [materialOpt, setMaterialopt] = useState([]);

    const fetchMaterialAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ASSETS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const resultall = res?.data?.assetmaterial.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
                assettype: d.assettype,
                asset: d.assethead,
            }));

            const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) => i.label === item.label && i.value === item.value
                    ) === index
                );
            });
            setMaterialopt(assetmaterialuniqueArray);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //get all frequency master name.
    const fetchApplicationName = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_ASSETSOFTWAREGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            setApplicationNameArray(res_freq?.data?.assertsoftwaregrouping.map((item, index) => {
                return {
                    _id: item._id,
                    serialNumber: item.serialNumber,
                    material: item.material,
                    remoteaccesssoftware: item.remoteaccesssoftware === true ? "YES" : "NO",
                    webbrowser: item.webbrowser === true ? "YES" : "NO",
                    devicedrivers: item.devicedrivers === true ? "YES" : "NO",
                    productivitysoftware: item.productivitysoftware === true ? "YES" : "NO",
                    cloudcomputingsoftware: item.cloudcomputingsoftware === true ? "YES" : "NO",
                    communicationsoftware: item.communicationsoftware === true ? "YES" : "NO",
                    developmentsoftware: item.developmentsoftware === true ? "YES" : "NO",
                    databasemanagementsoftware: item.databasemanagementsoftware === true ? "YES" : "NO",
                    securitysoftware: item.securitysoftware === true ? "YES" : "NO",
                    networksoftware: item.networksoftware === true ? "YES" : "NO",
                    printersoftware: item.printersoftware === true ? "YES" : "NO",
                    multimediasoftware: item.multimediasoftware === true ? "YES" : "NO",
                    applicationname: item.applicationname === true ? "YES" : "NO",
                    operatingsystem: item.operatingsystem === true ? "YES" : "NO",
                };
            }));
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const bulkDeleteFunction = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_ASSETSOFTWAREGROUPING}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchApplicationNameAll();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //get all Asset Software Grouping Name.
    const fetchApplicationNameAll = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_ASSETSOFTWAREGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            setApplicationNameArray(res_freq?.data?.assertsoftwaregrouping.map((item, index) => {
                return {
                    _id: item._id,
                    serialNumber: item.serialNumber,
                    material: item.material,
                    remoteaccesssoftware: item.remoteaccesssoftware === true ? "YES" : "NO",
                    webbrowser: item.webbrowser === true ? "YES" : "NO",
                    devicedrivers: item.devicedrivers === true ? "YES" : "NO",
                    productivitysoftware: item.productivitysoftware === true ? "YES" : "NO",
                    cloudcomputingsoftware: item.cloudcomputingsoftware === true ? "YES" : "NO",
                    communicationsoftware: item.communicationsoftware === true ? "YES" : "NO",
                    developmentsoftware: item.developmentsoftware === true ? "YES" : "NO",
                    databasemanagementsoftware: item.databasemanagementsoftware === true ? "YES" : "NO",
                    securitysoftware: item.securitysoftware === true ? "YES" : "NO",
                    networksoftware: item.networksoftware === true ? "YES" : "NO",
                    printersoftware: item.printersoftware === true ? "YES" : "NO",
                    multimediasoftware: item.multimediasoftware === true ? "YES" : "NO",
                    applicationname: item.applicationname === true ? "YES" : "NO",
                    operatingsystem: item.operatingsystem === true ? "YES" : "NO",
                };
            }));
            setAllApplicationNameEdit(
                res_freq?.data?.assertsoftwaregrouping.filter(
                    (item) => item._id !== applicationNameEdit._id
                )
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Asset Software Grouping.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Asset Software Grouping",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = applicationNameArray?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
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
                            setSelectedRows(allRowIds);
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
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
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
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "material",
            headerName: "Material",
            flex: 0,
            width: 150,
            hide: !columnVisibility.material,
            headerClassName: "bold-header",
        },
        {
            field: "applicationname",
            headerName: "Application Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.applicationname,
            headerClassName: "bold-header",
        },
        {
            field: "operatingsystem",
            headerName: "Operating System",
            flex: 0,
            width: 150,
            hide: !columnVisibility.operatingsystem,
            headerClassName: "bold-header",
        },
        {
            field: "remoteaccesssoftware",
            headerName: "Remote Access Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.remoteaccesssoftware,
            headerClassName: "bold-header",
        },
        {
            field: "webbrowser",
            headerName: "Web Browser",
            flex: 0,
            width: 150,
            hide: !columnVisibility.webbrowser,
            headerClassName: "bold-header",
        },
        {
            field: "devicedrivers",
            headerName: "Device Drivers",
            flex: 0,
            width: 150,
            hide: !columnVisibility.devicedrivers,
            headerClassName: "bold-header",
        },
        {
            field: "productivitysoftware",
            headerName: "Productivity Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.productivitysoftware,
            headerClassName: "bold-header",
        },
        {
            field: "cloudcomputingsoftware",
            headerName: "Cloud Computing Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.cloudcomputingsoftware,
            headerClassName: "bold-header",
        },
        {
            field: "communicationsoftware",
            headerName: "Communication Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.communicationsoftware,
            headerClassName: "bold-header",
        },
        {
            field: "developmentsoftware",
            headerName: "Development Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.developmentsoftware,
            headerClassName: "bold-header",
        },
        {
            field: "databasemanagementsoftware",
            headerName: "Database Management Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.databasemanagementsoftware,
            headerClassName: "bold-header",
        },
        {
            field: "securitysoftware",
            headerName: "Security Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.securitysoftware,
            headerClassName: "bold-header",
        },
        {
            field: "networksoftware",
            headerName: "Network Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.networksoftware,
            headerClassName: "bold-header",
        },
        {
            field: "printersoftware",
            headerName: "Printer Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.printersoftware,
            headerClassName: "bold-header",
        },
        {
            field: "multimediasoftware",
            headerName: "Multimedia Software",
            flex: 0,
            width: 150,
            hide: !columnVisibility.multimediasoftware,
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
                    {isUserRoleCompare?.includes("eassetsoftwaregrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dassetsoftwaregrouping") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vassetsoftwaregrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iassetsoftwaregrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.row.id);
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
            id: item._id,
            serialNumber: item.serialNumber,
            material: item.material,
            remoteaccesssoftware: item.remoteaccesssoftware,
            webbrowser: item.webbrowser,
            devicedrivers: item.devicedrivers,
            productivitysoftware: item.productivitysoftware,
            cloudcomputingsoftware: item.cloudcomputingsoftware,
            communicationsoftware: item.communicationsoftware,
            developmentsoftware: item.developmentsoftware,
            databasemanagementsoftware: item.databasemanagementsoftware,
            securitysoftware: item.securitysoftware,
            networksoftware: item.networksoftware,
            printersoftware: item.printersoftware,
            multimediasoftware: item.multimediasoftware,
            operatingsystem: item.operatingsystem,
            applicationname: item.applicationname,
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

    const typeOpt = [
        { label: "Remote Access Software", value: "Remote Access Software" },
        { label: "Web Browser", value: "Web Browser" },
        { label: "Device Drivers", value: "Device Drivers" },
        { label: "Productivity Software", value: "Productivity Software" },
        { label: "Cloud Computing Software", value: "Cloud Computing Software" },
        { label: "Communication Software", value: "Communication Software" },
        { label: "Development Software", value: "Development Software" },
        { label: "Multimedia Software", value: "Multimedia Software" },
        { label: "Database Management Software", value: "Database Management Software" },
        { label: "Security Software", value: "Security Software" },
        { label: "Network Software", value: "Network Software" },
        { label: "Printer Software", value: "Printer Software" },
    ];


    return (
        <Box>
            <Headtitle title={"APPLICATION NAME"} />
            <PageHeading
                title="Asset Software Grouping"
                modulename="Asset"
                submodulename="Asset Specifications"
                mainpagename="Software"
                subpagename="Asset Software Grouping"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aassetsoftwaregrouping") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Asset Software Grouping
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Material <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={materialOpt}
                                            value={selectedOptionsMaterial}
                                            onChange={(e) => {
                                                handleMaterialChange(e);
                                            }}
                                            valueRenderer={customValueRendererMaterial}
                                            labelledBy="Please Select Material"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6} sx={{ display: "flex", justifyContent: "center" }}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox
                                                    checked={applicationName.bulkselect}
                                                    onChange={() =>
                                                        setApplicationName((prev) => {
                                                            const newBulkSelect = !prev.bulkselect;
                                                            return {
                                                                ...prev,
                                                                bulkselect: newBulkSelect,
                                                                remoteaccesssoftware: newBulkSelect ? (prev.remoteaccesssoftware ? true : !prev.remoteaccesssoftware) : false,
                                                                webbrowser: newBulkSelect ? (prev.webbrowser ? true : !prev.webbrowser) : false,
                                                                devicedrivers: newBulkSelect ? (prev.devicedrivers ? true : !prev.devicedrivers) : false,
                                                                productivitysoftware: newBulkSelect ? (prev.productivitysoftware ? true : !prev.productivitysoftware) : false,
                                                                cloudcomputingsoftware: newBulkSelect ? (prev.cloudcomputingsoftware ? true : !prev.cloudcomputingsoftware) : false,
                                                                communicationsoftware: newBulkSelect ? (prev.communicationsoftware ? true : !prev.communicationsoftware) : false,
                                                                developmentsoftware: newBulkSelect ? (prev.developmentsoftware ? true : !prev.developmentsoftware) : false,
                                                                databasemanagementsoftware: newBulkSelect ? (prev.databasemanagementsoftware ? true : !prev.databasemanagementsoftware) : false,
                                                                securitysoftware: newBulkSelect ? (prev.securitysoftware ? true : !prev.securitysoftware) : false,
                                                                networksoftware: newBulkSelect ? (prev.networksoftware ? true : !prev.networksoftware) : false,
                                                                printersoftware: newBulkSelect ? (prev.printersoftware ? true : !prev.printersoftware) : false,
                                                                multimediasoftware: newBulkSelect ? (prev.multimediasoftware ? true : !prev.multimediasoftware) : false,
                                                                applicationname: newBulkSelect ? (prev.applicationname ? true : !prev.applicationname) : false,
                                                                operatingsystem: newBulkSelect ? (prev.operatingsystem ? true : !prev.operatingsystem) : false,
                                                            };
                                                        })
                                                    }
                                                />
                                            }
                                            label="Bulk Select"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6} >
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.applicationname}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            applicationname: !prev.applicationname,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Application Name"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.operatingsystem}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            operatingsystem: !prev.operatingsystem,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Operating System"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.remoteaccesssoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            remoteaccesssoftware: !prev.remoteaccesssoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Remote Access Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.webbrowser}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            webbrowser: !prev.webbrowser,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Web Browser"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.devicedrivers}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            devicedrivers: !prev.devicedrivers,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Device Drivers"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.productivitysoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            productivitysoftware: !prev.productivitysoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Productivity Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.cloudcomputingsoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            cloudcomputingsoftware: !prev.cloudcomputingsoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Cloud Computing Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.communicationsoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            communicationsoftware: !prev.communicationsoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Communication Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.developmentsoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            developmentsoftware: !prev.developmentsoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Development Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.multimediasoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            multimediasoftware: !prev.multimediasoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Multimedia Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.databasemanagementsoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            databasemanagementsoftware: !prev.databasemanagementsoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Database Management Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.securitysoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            securitysoftware: !prev.securitysoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Security Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.networksoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            networksoftware: !prev.networksoftware,
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Network Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationName.printersoftware}
                                                    onChange={() =>
                                                        setApplicationName((prev) => ({
                                                            ...prev,
                                                            printersoftware: !prev.printersoftware,
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Printer Software"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12} sx={{ marginTop: "25px" }}>
                                    <Grid container spacing={4}>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <Button
                                                variant="contained"
                                                sx={buttonStyles.buttonsubmit}
                                                onClick={handleSubmit}
                                                disabled={isBtn}
                                            >
                                                Submit
                                            </Button>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                                Clear
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}
            <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lassetsoftwaregrouping") && (
                <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>
                            Asset Software Grouping List
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
                                    {/* <MenuItem value={applicationNameArray?.length}>All</MenuItem> */}
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
                                {isUserRoleCompare?.includes("excelassetsoftwaregrouping") && (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                setIsFilterOpen(true);
                                                fetchApplicationName();
                                                setFormat("xl");
                                            }}
                                            sx={userStyle.buttongrp}
                                        >
                                            <FaFileExcel />
                                            &ensp;Export to Excel&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csvassetsoftwaregrouping") && (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                setIsFilterOpen(true);
                                                fetchApplicationName();
                                                setFormat("csv");
                                            }}
                                            sx={userStyle.buttongrp}
                                        >
                                            <FaFileCsv />
                                            &ensp;Export to CSV&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printassetsoftwaregrouping") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfassetsoftwaregrouping") && (
                                    <>
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpen(true);
                                                fetchApplicationName();
                                            }}
                                        >
                                            <FaFilePdf />
                                            &ensp;Export to PDF&ensp;
                                        </Button>
                                    </>
                                )}
                                <Button
                                    sx={userStyle.buttongrp}
                                    onClick={handleCaptureImage}
                                >
                                    {" "}
                                    <ImageIcon
                                        sx={{ fontSize: "15px" }}
                                    /> &ensp;Image&ensp;{" "}
                                </Button>
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
                    &ensp;
                    {isUserRoleCompare?.includes("bdassetsoftwaregrouping") && (
                        <Button
                            variant="contained"
                            sx={buttonStyles.buttonbulkdelete}
                            onClick={handleClickOpenalert}
                        >
                            Bulk Delete
                        </Button>
                    )}
                    <br />
                    <br />
                    {!loader ? (
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
                        <>
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <StyledDataGrid
                                    onClipboardCopy={(copiedString) =>
                                        setCopiedData(copiedString)
                                    }
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
                        </>
                    )}
                    {/* ****** Table End ****** */}
                </Box>
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
                maxWidth="lg"
                fullWidth={true}
                sx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Asset Software Grouping
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Material</Typography>
                                    <Typography>{applicationNameEdit.material}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Application Name</Typography>
                                    <Typography>{applicationNameEdit.applicationname === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Operating System</Typography>
                                    <Typography>{applicationNameEdit.operatingsystem === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Remote Access Software</Typography>
                                    <Typography>{applicationNameEdit.remoteaccesssoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Web Browser</Typography>
                                    <Typography>{applicationNameEdit.webbrowser === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Device Drivers</Typography>
                                    <Typography>{applicationNameEdit.devicedrivers === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Productivity Software</Typography>
                                    <Typography>{applicationNameEdit.productivitysoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Cloud Computing Software</Typography>
                                    <Typography>{applicationNameEdit.cloudcomputingsoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Communication Software</Typography>
                                    <Typography>{applicationNameEdit.communicationsoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Development Software</Typography>
                                    <Typography>{applicationNameEdit.developmentsoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Multimedia Software</Typography>
                                    <Typography>{applicationNameEdit.multimediasoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Database Management Software</Typography>
                                    <Typography>{applicationNameEdit.databasemanagementsoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Security Software</Typography>
                                    <Typography>{applicationNameEdit.securitysoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Network Software</Typography>
                                    <Typography>{applicationNameEdit.networksoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Printer Software</Typography>
                                    <Typography>{applicationNameEdit.printersoftware === true ? "YES" : "NO"}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.btncancel}
                                onClick={handleCloseview}
                            // sx={{ marginLeft: "15px" }}
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
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        marginTop: "80px"
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Asset Software Grouping
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={materialOpt}
                                            // styles={colourStyles}
                                            value={{
                                                label: applicationNameEdit.material,
                                                value: applicationNameEdit.material,
                                            }}
                                            onChange={(e) => {
                                                setApplicationNameEdit({
                                                    ...applicationNameEdit,
                                                    material: e.value,

                                                })
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6} sx={{ display: "flex", justifyContent: "center" }}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox
                                                    checked={applicationNameEdit.bulkselect}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => {
                                                            const newBulkSelect = !prev.bulkselect;
                                                            return {
                                                                ...prev,
                                                                bulkselect: newBulkSelect,
                                                                remoteaccesssoftware: newBulkSelect ? (prev.remoteaccesssoftware ? true : !prev.remoteaccesssoftware) : false,
                                                                webbrowser: newBulkSelect ? (prev.webbrowser ? true : !prev.webbrowser) : false,
                                                                devicedrivers: newBulkSelect ? (prev.devicedrivers ? true : !prev.devicedrivers) : false,
                                                                productivitysoftware: newBulkSelect ? (prev.productivitysoftware ? true : !prev.productivitysoftware) : false,
                                                                cloudcomputingsoftware: newBulkSelect ? (prev.cloudcomputingsoftware ? true : !prev.cloudcomputingsoftware) : false,
                                                                communicationsoftware: newBulkSelect ? (prev.communicationsoftware ? true : !prev.communicationsoftware) : false,
                                                                developmentsoftware: newBulkSelect ? (prev.developmentsoftware ? true : !prev.developmentsoftware) : false,
                                                                databasemanagementsoftware: newBulkSelect ? (prev.databasemanagementsoftware ? true : !prev.databasemanagementsoftware) : false,
                                                                securitysoftware: newBulkSelect ? (prev.securitysoftware ? true : !prev.securitysoftware) : false,
                                                                networksoftware: newBulkSelect ? (prev.networksoftware ? true : !prev.networksoftware) : false,
                                                                printersoftware: newBulkSelect ? (prev.printersoftware ? true : !prev.printersoftware) : false,
                                                                multimediasoftware: newBulkSelect ? (prev.multimediasoftware ? true : !prev.multimediasoftware) : false,
                                                                applicationname: newBulkSelect ? (prev.applicationname ? true : !prev.applicationname) : false,
                                                                operatingsystem: newBulkSelect ? (prev.operatingsystem ? true : !prev.operatingsystem) : false,
                                                            };
                                                        })
                                                    }
                                                />
                                            }
                                            label="Bulk Select"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6} >
                                </Grid>

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.applicationname}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            applicationname: !prev.applicationname,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Application Name"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.operatingsystem}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            operatingsystem: !prev.operatingsystem,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Operating System"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.remoteaccesssoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            remoteaccesssoftware: !prev.remoteaccesssoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Remote Access Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.webbrowser}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            webbrowser: !prev.webbrowser,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Web Browser"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.devicedrivers}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            devicedrivers: !prev.devicedrivers,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Device Drivers"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.productivitysoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            productivitysoftware: !prev.productivitysoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Productivity Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.cloudcomputingsoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            cloudcomputingsoftware: !prev.cloudcomputingsoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Cloud Computing Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.communicationsoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            communicationsoftware: !prev.communicationsoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Communication Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.developmentsoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            developmentsoftware: !prev.developmentsoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Development Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.multimediasoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            multimediasoftware: !prev.multimediasoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Multimedia Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.databasemanagementsoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            databasemanagementsoftware: !prev.databasemanagementsoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Database Management Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.securitysoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            securitysoftware: !prev.securitysoftware,

                                                        }))
                                                    }
                                                />
                                            }
                                            label="Security Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.networksoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            networksoftware: !prev.networksoftware,
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Network Software"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl component="fieldset">
                                        <Typography>
                                            &nbsp;
                                        </Typography>
                                        <FormControlLabel
                                            sx={{ width: "200px" }}
                                            control={
                                                <Checkbox

                                                    checked={!!applicationNameEdit.printersoftware}
                                                    onChange={() =>
                                                        setApplicationNameEdit((prev) => ({
                                                            ...prev,
                                                            printersoftware: !prev.printersoftware,
                                                        }))
                                                    }
                                                />
                                            }
                                            label="Printer Software"
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
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
            {/* EXPTERNAL COMPONENTS -------------- START */}
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
                itemsTwo={applicationNameArray ?? []}
                filename={"Asset Software Grouping"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Asset Software Grouping Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delAsset}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={bulkDeleteFunction}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXPTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default AssetSoftwareGrouping;
