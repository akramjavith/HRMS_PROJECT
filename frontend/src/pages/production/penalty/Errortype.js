import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import Resizable from 'react-resizable';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';


function Penaltyerrorupload() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
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
    }
    const [managetypepgState, setManagetypepgState] = useState({
        process: "Please Select Process",
        errortype: "",
        ismoving: "Please Select Is Moving",
        penaltycalculation: "Please Select Penalty Calculation",
        status: "Please Select Status",
        rate: 1,
    });
    const [managetypepgStateEdit, setManagetypepgStateEdit] = useState({
        process: "Please Select Process",
        errortype: "",
        ismoving: "Please Select Is Moving",
        penaltycalculation: "Please Select Penalty Calculation",
        status: "Please Select Status",
        rate: 1,
    });
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Error Type"),
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [assignedByArray, setAssignebyArray] = useState([])
    const [assignedByArrayEdit, setAssignedbyArrayEdit] = useState([])
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
        };
        const inputElement = document.getElementById('component-outlined');
        inputElement.addEventListener('wheel', handleWheel);
        return () => {
            inputElement.removeEventListener('wheel', handleWheel);
        };
    }, []);
    const [penaltyErrorUpload, setPenaltyErrorUpload] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [sourceCheck, setSourcecheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    //image


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Error Type.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsActive(false)
    };
    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRows?.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    // for create section
    const [selectedProject, setSelectedProject] = useState("Please Select Project Vendor");
    //for edit section
    const [selectedProjectEdit, setSelectedProjectEdit] = useState("Please Select Project Vendor");
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };
    const [projects, setProjects] = useState([]);
    const [process, setProcess] = useState([]);
    const [processEdit, setProcessEdit] = useState([]);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
       .react-resizable-handle {
       width: 10px;
       height: 100%;
       position: absolute;
       right: 0;
       bottom: 0;
       cursor: col-resize;
       }
       `;
    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };
    useEffect(() => {

        fetchProjectDropdowns();

    }, [selectedProject, selectedProjectEdit]);
    //fetching Project for Dropdowns
    const fetchProjectDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projall = [
                ...res_project?.data?.vendormaster.map((d) => ({
                    ...d,
                    label: d.projectname + "-" + d.name,
                    value: d.projectname + "-" + d.name,
                })),
            ];
            setProjects(projall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        projectvendor: true,
        process: true,
        errortype: true,
        ismoving: true,
        penaltycalculation: true,
        status: true,
        rate: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    const handleProjectChange = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PRODUCTIONPROCESSQUEUEGETALL}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let filteredProcess = res.data.productionprocessqueue.filter((data) => {
                return data.projectvendor === e.value;
            })
            setProcess(filteredProcess.map((data) => ({
                label: data.processqueue,
                value: data.processqueue
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const handleProjectChangeEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PRODUCTIONPROCESSQUEUEGETALL}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let filteredProcess = res.data.productionprocessqueue.filter((data) => {
                return data.projectvendor === e.value;
            })
            setProcessEdit(filteredProcess.map((data) => ({
                label: data.processqueue,
                value: data.processqueue
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const [deleteSource, setDeleteSource] = useState("");
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYERRORUPLOAD_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.spenaltyerrorupload);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async (e) => {
        setPageName(!pageName)
        try {
            if (Sourcesid) {
                await axios.delete(`${SERVICE.PENALTYERRORUPLOAD_SINGLE}/${Sourcesid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchPenaltyErrorUpload();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
            }
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const delSourcecheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.PENALTYERRORUPLOAD_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            await fetchPenaltyErrorUpload();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [isBtn, setIsBtn] = useState(false)
    //add function 
    const sendRequest = async () => {
        setIsBtn(true)
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.PENALTYERRORUPLOAD_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                projectvendor: String(selectedProject),
                process: String(managetypepgState.process),
                errortype: String(managetypepgState.errortype),
                ismoving: String(managetypepgState.ismoving),
                penaltycalculation: String(managetypepgState.penaltycalculation),
                status: String(managetypepgState.status),
                rate: String(managetypepgState.rate),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchPenaltyErrorUpload();
            setSelectedProject("Please Select Project Vendor")
            setManagetypepgState({
                process: "Please Select Process",
                errortype: "",
                ismoving: "Please Select Is Moving",
                penaltycalculation: "Please Select Penalty Calculation",
                status: "Please Select Status",
                rate: 1,
            })
            setProcess([]);
            setIsActive(false)
            setIsBtn(false)
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err)
            setIsBtn(false)
            if (err.response?.data?.message === "Data Already Exists!") {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    }
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsActive(true)
        if (selectedProject === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgState.process === "Please Select Process" || managetypepgState.process === "") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgState.errortype === "" || managetypepgState.errortype === undefined) {
            setPopupContentMalert("Please Enter Error Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgState.ismoving === "Please Select Is Moving" || managetypepgState.ismoving === undefined) {
            setPopupContentMalert("Please Select Is Moving");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgState.penaltycalculation === "Please Select Penalty Calculation" || managetypepgState.penaltycalculation === undefined) {
            setPopupContentMalert("Please Select Penalty Calculation");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgState.status === "Please Select Status" || managetypepgState.status === undefined) {
            setPopupContentMalert("Please Select Status");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgState.rate === "" || managetypepgState.rate === undefined || managetypepgState.rate === 0) {
            setPopupContentMalert("Please Enter Rate");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    }
    const handleClear = (e) => {
        e.preventDefault();
        setSelectedProject("Please Select Project Vendor");
        setManagetypepgState({
            process: "Please Select Process",
            errortype: "",
            ismoving: "Please Select Is Moving",
            penaltycalculation: "Please Select Penalty Calculation",
            status: "Please Select Status",
            rate: 1,
        })
        setProcess([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }
    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
    };
    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //get single row to edit....
    const getCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYERRORUPLOAD_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSelectedProjectEdit(res?.data?.spenaltyerrorupload.projectvendor)
            setManagetypepgStateEdit(res?.data?.spenaltyerrorupload);
            handleProjectChangeEdit({ label: res?.data?.spenaltyerrorupload.projectvendor, value: res?.data?.spenaltyerrorupload.projectvendor });
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYERRORUPLOAD_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setManagetypepgStateEdit(res?.data?.spenaltyerrorupload);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYERRORUPLOAD_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setManagetypepgStateEdit(res?.data?.spenaltyerrorupload);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //Project updateby edit page...
    let updateby = managetypepgStateEdit?.updatedby;
    let addedby = managetypepgStateEdit?.addedby;
    let subprojectsid = managetypepgStateEdit?._id;
    console.log(subprojectsid)
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.PENALTYERRORUPLOAD_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                projectvendor: String(selectedProjectEdit),
                process: String(managetypepgStateEdit.process),
                errortype: String(managetypepgStateEdit.errortype),
                ismoving: String(managetypepgStateEdit.ismoving),
                penaltycalculation: String(managetypepgStateEdit.penaltycalculation),
                status: String(managetypepgStateEdit.status),
                rate: String(managetypepgStateEdit.rate),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchPenaltyErrorUpload();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            if (err.response?.data?.message === "Data Already Exists!") {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    }
    const editSubmit = (e) => {
        e.preventDefault();
        if (selectedProjectEdit === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgStateEdit.process === "Please Select Process" || managetypepgStateEdit.process === "") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgStateEdit.errortype === "" || managetypepgStateEdit.errortype === undefined) {
            setPopupContentMalert("Please Enter Error Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgStateEdit.ismoving === "Please Select Is Moving" || managetypepgStateEdit.ismoving === undefined) {
            setPopupContentMalert("Please Select Is Moving");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgStateEdit.penaltycalculation === "Please Select Penalty Calculation" || managetypepgStateEdit.penaltycalculation === undefined) {
            setPopupContentMalert("Please Select Penalty Calculation");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgStateEdit.status === "Please Select Status" || managetypepgStateEdit.status === undefined) {
            setPopupContentMalert("Please Select Status");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgStateEdit.rate === "" || managetypepgStateEdit.rate === undefined || managetypepgStateEdit.rate === 0) {
            setPopupContentMalert("Please Enter Rate");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }
    const [penaltyErrorUploadArray, setPenaltyErrorUploadArray] = useState([])
    //get all Sub vendormasters.
    const fetchPenaltyErrorUploadArray = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.PENALTYERRORUPLOADGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setPenaltyErrorUploadArray(res_vendor?.data?.penaltyerrorupload);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    useEffect(() => {
        fetchPenaltyErrorUploadArray();
    }, [isFilterOpen])
    //get all Sub vendormasters.
    const fetchPenaltyErrorUpload = async () => {
        setPageName(!pageName)
        setSourcecheck(false)

        try {
            let res_vendor = await axios.get(SERVICE.PENALTYERRORUPLOADGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            setPenaltyErrorUpload(res_vendor?.data?.penaltyerrorupload.map((item, index) => ({ ...item, serialNumber: index + 1 })));
            setAssignebyArray(res_vendor?.data?.manageTypePG)
            setAssignedbyArrayEdit(res_vendor?.data?.manageTypePG)
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }


    }
    // pdf.....
    let exportColumnNames = ["Project Vendor", "Process", "Error Type", "Is Moving", "Penalty Calculation", "Status", "Rate"];
    let exportRowValues = ["projectvendor", "process", "errortype", "ismoving", "penaltycalculation", "status", "rate"];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Error Type',
        pageStyle: 'print'
    });
    useEffect(() => {
        fetchPenaltyErrorUpload();
        fetchInteractorType();
    }, [])
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);
    const [items, setItems] = useState([]);
    const addSerialNumber = (datas) => {
        setItems(datas);
    }
    useEffect(() => {
        addSerialNumber(penaltyErrorUpload);
    }, [penaltyErrorUpload])
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
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
    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
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
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',
            lockPinned: true,
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',
        },
        { field: "projectvendor", headerName: "Project Vendor", flex: 0, width: 150, hide: !columnVisibility.projectvendor, headerClassName: "bold-header", pinned: 'left', },
        { field: "process", headerName: "Process", flex: 0, width: 100, hide: !columnVisibility.process, headerClassName: "bold-header", pinned: 'left', },
        { field: "errortype", headerName: "Error Type", flex: 0, width: 150, hide: !columnVisibility.errortype, headerClassName: "bold-header" },
        { field: "ismoving", headerName: "Is Moving", flex: 0, width: 150, hide: !columnVisibility.ismoving, headerClassName: "bold-header" },
        { field: "penaltycalculation", headerName: "Penalty Calculation", flex: 0, width: 150, hide: !columnVisibility.penaltycalculation, headerClassName: "bold-header" },
        { field: "status", headerName: "Status", flex: 0, width: 100, hide: !columnVisibility.status, headerClassName: "bold-header" },
        { field: "rate", headerName: "Rate", flex: 0, width: 100, hide: !columnVisibility.rate, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("eerrortype") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            getCode(params.data.id);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("derrortype") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.data.id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("verrortype") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ierrortype") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ]
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            process: item.process,
            errortype: item.errortype,
            ismoving: item.ismoving,
            penaltycalculation: item.penaltycalculation,
            status: item.status,
            rate: item.rate,
        }
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
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

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
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
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
    //get all interactorType name.
    const fetchInteractorType = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.PENALTYERRORUPLOADGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const isMovingOpt = [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]
    const PenaltyCalOpt = [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]
    const StatusOpt = [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }, { label: "Valid", value: "Valid" }, { label: "Invalid", value: "Invalid" }]
    const [fileFormat, setFormat] = useState('')
    return (
        <Box>
            <Headtitle title={'ERROR TYPE'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Error Type"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Error Type"
                subsubpagename=""
            />

            {isUserRoleCompare?.includes("aerrortype")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Error Type</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Project Vendor <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={projects}
                                                // styles={colourStyles}
                                                value={{
                                                    label: selectedProject,
                                                    value: selectedProject,
                                                }}
                                                onChange={(e) => {
                                                    setSelectedProject(e.value)
                                                    setManagetypepgState((prev) => ({
                                                        ...prev, process: "Please Select Process"
                                                    }))
                                                    handleProjectChange(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Process <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={process}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgState.process,
                                                    value: managetypepgState.process,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgState({
                                                        ...managetypepgState,
                                                        process: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Error Type <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Error Type"
                                                value={managetypepgState.errortype}
                                                onChange={(e) => {
                                                    setManagetypepgState({
                                                        ...managetypepgState,
                                                        errortype: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>IS Moving <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={isMovingOpt}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgState.ismoving,
                                                    value: managetypepgState.ismoving,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgState({
                                                        ...managetypepgState,
                                                        ismoving: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Penalty Calculation <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={PenaltyCalOpt}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgState.penaltycalculation,
                                                    value: managetypepgState.penaltycalculation,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgState({
                                                        ...managetypepgState,
                                                        penaltycalculation: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Status <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={StatusOpt}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgState.status,
                                                    value: managetypepgState.status,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgState({
                                                        ...managetypepgState,
                                                        status: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Rate <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                inputMode="decimal"
                                                pattern="[0-9]*"
                                                placeholder="Please Enter Rate"
                                                value={managetypepgState.rate}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === "") {
                                                        setManagetypepgState({
                                                            ...managetypepgState,
                                                            rate: "",
                                                        });
                                                    } else {
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setManagetypepgState({
                                                                ...managetypepgState,
                                                                rate: value,
                                                            });
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} mt={3}>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    gap: "15px",
                                                }}
                                            >
                                                <Button variant="contained"
                                                    color="primary"
                                                    onClick={handleSubmit}
                                                    disabled={isBtn}
                                                    sx={buttonStyles.buttonsubmit}
                                                >
                                                    SAVE
                                                </Button>
                                                <Button sx={buttonStyles.btncancel}
                                                    onClick={handleClear}
                                                >
                                                    CLEAR
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>


                            </>
                        </Box>
                    </>
                )}
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}

                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Error Type</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Project Vendor <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={projects}
                                                // styles={colourStyles}
                                                value={{
                                                    label: selectedProjectEdit,
                                                    value: selectedProjectEdit,
                                                }}
                                                onChange={(e) => {
                                                    setSelectedProjectEdit(e.value)
                                                    setManagetypepgStateEdit((prev) => ({
                                                        ...prev, process: "Please Select Process"
                                                    }))
                                                    handleProjectChangeEdit(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Process <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={processEdit}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgStateEdit.process,
                                                    value: managetypepgStateEdit.process,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgStateEdit({
                                                        ...managetypepgStateEdit,
                                                        process: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Error Type <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Error Type"
                                                value={managetypepgStateEdit.errortype}
                                                onChange={(e) => {
                                                    setManagetypepgStateEdit({
                                                        ...managetypepgStateEdit,
                                                        errortype: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>IS Moving <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={isMovingOpt}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgStateEdit.ismoving,
                                                    value: managetypepgStateEdit.ismoving,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgStateEdit({
                                                        ...managetypepgStateEdit,
                                                        ismoving: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Penalty Calculation <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={PenaltyCalOpt}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgStateEdit.penaltycalculation,
                                                    value: managetypepgStateEdit.penaltycalculation,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgStateEdit({
                                                        ...managetypepgStateEdit,
                                                        penaltycalculation: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Status <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={StatusOpt}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgStateEdit.status,
                                                    value: managetypepgStateEdit.status,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgStateEdit({
                                                        ...managetypepgStateEdit,
                                                        status: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Rate <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                inputMode="decimal"
                                                pattern="[0-9]*"
                                                placeholder="Please Enter Rate"
                                                value={managetypepgStateEdit.rate}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === "") {
                                                        setManagetypepgStateEdit({
                                                            ...managetypepgStateEdit,
                                                            rate: "",
                                                        });
                                                    } else {
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setManagetypepgStateEdit({
                                                                ...managetypepgStateEdit,
                                                                rate: value,
                                                            });
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} type="submit" >Update</Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
                                    </Grid>
                                </Grid>
                                {/* </DialogContent> */}
                            </form>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lerrortype") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>List Error Type</Typography>
                        </Grid>

                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(penaltyErrorUpload?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelerrortype") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPenaltyErrorUploadArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csverrortype") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPenaltyErrorUploadArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printerrortype") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdferrortype") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchPenaltyErrorUploadArray()
                                                }}>
                                                <FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageerrortype") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={penaltyErrorUpload}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}

                                />
                            </Grid>
                        </Grid>

                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bderrortype") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>Bulk Delete</Button>)}
                        <br /><br />
                        {!sourceCheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                            :
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
                                    gridRefTable={gridRef}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    // totalDatas={totalProjects}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                // itemsList={overallFilterdataAllData}

                                />
                            </>}
                    </Box>
                </>
            )
            }
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
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
            >
                <Box sx={{ width: "550px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>View Error Type</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project Vendor</Typography>
                                    <Typography>{managetypepgStateEdit.projectvendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Process</Typography>
                                    <Typography>{managetypepgStateEdit.process}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Error Type</Typography>
                                    <Typography>{managetypepgStateEdit.errortype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Is Moving</Typography>
                                    <Typography>{managetypepgStateEdit.ismoving}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Penalty Calculation</Typography>
                                    <Typography>{managetypepgStateEdit.penaltycalculation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Status</Typography>
                                    <Typography>{managetypepgStateEdit.status}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Rate</Typography>
                                    <Typography>{managetypepgStateEdit.rate}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* ALERT DIALOG */}
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
                        <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={penaltyErrorUploadArray ?? []}
                filename={"Error Type"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Error Type Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delSource}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delSourcecheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
        </Box>
    );
}


export default Penaltyerrorupload;