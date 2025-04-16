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
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
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
import domtoimage from 'dom-to-image';

function Errorcontrol() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    // page refersh reload
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
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
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const [managetypepgState, setManagetypepgState] = useState({
        process: "Please Select Process",
        mode: "",
        rate: "",
        islock: "Open"
    });
    const [managetypepgStateEdit, setManagetypepgStateEdit] = useState({
        process: "Please Select Process",
        mode: "",
        rate: "",
        islock: "Open"
    });

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Error Control"),
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

    const [projects, setProjects] = useState([]);
    const [process, setProcess] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // for create section
    const [selectedProject, setSelectedProject] = useState("Please Select Project Vendor");
    const isLockOptions = [
        { label: "Open", value: "Open" },
        { label: "Lock", value: "Lock" },
    ]
    //for edit section
    const [selectedProjectEdit, setSelectedProjectEdit] = useState("Please Select Project Vendor");
    const [processEdit, setProcessEdit] = useState([]);
    const [penaltyErrorControl, setPenaltyErrorControl] = useState([]);
    useEffect(() => {
        fetchProjectDropdowns();
    }, [selectedProject, selectedProjectEdit]);
    useEffect(() => {
        fetchPenaltyErrorControl();
    }, [])
    //get all Sub vendormasters.
    const fetchPenaltyErrorControl = async () => {
        setPageName(!pageName)
        setSourcecheck(false)

        try {
            let res_vendor = await axios.get(SERVICE.PENALTYERRORCONTROLGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setPenaltyErrorControl(res_vendor?.data?.penaltyerrorcontrol);
            setSourcecheck(true)
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }
    const [penaltyErrorControlArray, setPenaltyErrorControlArray] = useState([])
    //get all Sub vendormasters.
    const fetchPenaltyErrorControlArray = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.PENALTYERRORCONTROLGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setPenaltyErrorControlArray(res_vendor?.data?.penaltyerrorcontrol);
        } catch (err) {  handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    useEffect(() => {
        fetchPenaltyErrorControlArray();
    }, [isFilterOpen])
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
    const [isActive, setIsActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [sourceCheck, setSourcecheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Error Control.png");
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
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };
    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        projectvendor: true,
        process: true,
        mode: true,
        rate: true,
        islock: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    const [deleteSource, setDeleteSource] = useState("");
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYERRORCONTROL_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.spenaltyerrorcontrol);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async (e) => {
        setPageName(!pageName)
        try {
            if (Sourcesid) {
                await axios.delete(`${SERVICE.PENALTYERRORCONTROL_SINGLE}/${Sourcesid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchPenaltyErrorControl();
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
                return axios.delete(`${SERVICE.PENALTYERRORCONTROL_SINGLE}/${item}`, {
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
            await fetchPenaltyErrorControl();
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
            let subprojectscreate = await axios.post(SERVICE.PENALTYERRORCONTROL_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                projectvendor: String(selectedProject),
                process: String(managetypepgState.process),
                mode: String(managetypepgState.mode),
                rate: Number(managetypepgState.rate),
                islock: String(managetypepgState.islock),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchPenaltyErrorControl();
            setSelectedProject("Please Select Project Vendor")
            setManagetypepgState({
                process: "Please Select Process",
                mode: "",
                rate: "",
                islock: "Open"
            });
            setProcess([])
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false)
        } catch (err) {
            setIsBtn(false);
            if (err.response.data.message === "Data Already Exist!") {
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
        else if (managetypepgState.mode === "" || managetypepgState.mode === undefined) {
            setPopupContentMalert("Please Enter Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgState.rate === "" || managetypepgState.rate === undefined) {
            setPopupContentMalert("Please Enter Rate");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgState.islock === "" || managetypepgState.islock === undefined) {
            setPopupContentMalert("Please Select Islock");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    }
    const handleClear = (e) => {
        e.preventDefault();
        setSelectedProject("Please Select Project Vendor")
        setManagetypepgState({
            process: "Please Select Process",
            mode: "",
            rate: "",
            islock: "Open"
        });
        setProcess([])
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
            let res = await axios.get(`${SERVICE.PENALTYERRORCONTROL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSelectedProjectEdit(res?.data?.spenaltyerrorcontrol.projectvendor)
            setManagetypepgStateEdit(res?.data?.spenaltyerrorcontrol);
            handleProjectChangeEdit({ label: res?.data?.spenaltyerrorcontrol.projectvendor, value: res?.data?.spenaltyerrorcontrol.projectvendor });
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYERRORCONTROL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setManagetypepgStateEdit(res?.data?.spenaltyerrorcontrol);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PENALTYERRORCONTROL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setManagetypepgStateEdit(res?.data?.spenaltyerrorcontrol);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //Project updateby edit page...
    let updateby = managetypepgStateEdit?.updatedby;
    let addedby = managetypepgStateEdit?.addedby;
    let subprojectsid = managetypepgStateEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.PENALTYERRORCONTROL_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                projectvendor: String(selectedProjectEdit),
                process: String(managetypepgStateEdit.process),
                mode: String(managetypepgStateEdit.mode),
                rate: Number(managetypepgStateEdit.rate),
                islock: String(managetypepgStateEdit.islock),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchPenaltyErrorControl();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            if (err.response.data.message === "Data Already Exist!") {
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
        else if (managetypepgStateEdit.mode === "" || managetypepgStateEdit.mode === undefined) {
            setPopupContentMalert("Please Enter Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgStateEdit.rate === "" || managetypepgStateEdit.rate === undefined) {
            setPopupContentMalert("Please Enter Rate");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (managetypepgStateEdit.islock === "" || managetypepgStateEdit.islock === undefined) {
            setPopupContentMalert("Please Select Islock");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Error Control',
        pageStyle: 'print'
    });
    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;
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
        const itemsWithSerialNumber = datas?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }
    useEffect(() => {
        addSerialNumber(penaltyErrorControl);
    }, [penaltyErrorControl])
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
        { field: "projectvendor", headerName: "Project Vendor", flex: 0, width: 200, hide: !columnVisibility.projectvendor, pinned: 'left', headerClassName: "bold-header" },
        { field: "process", headerName: "Process", flex: 0, width: 200, hide: !columnVisibility.process, headerClassName: "bold-header", pinned: 'left', },
        { field: "mode", headerName: "Mode", flex: 0, width: 200, hide: !columnVisibility.mode, headerClassName: "bold-header" },
        { field: "rate", headerName: "Rate", flex: 0, width: 100, hide: !columnVisibility.rate, headerClassName: "bold-header" },
        { field: "islock", headerName: "Is Lock", flex: 0, width: 100, hide: !columnVisibility.islock, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("eerrorcontrol") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            handleClickOpenEdit();
                            getCode(params.data.id);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("derrorcontrol") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.data.id) }}><DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("verrorcontrol") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenview();
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ierrorcontrol") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
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
            mode: item.mode,
            rate: item.rate,
            islock: item.islock
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
    const [fileFormat, setFormat] = useState('')
    let exportColumnNames = ["Project Vendor", "Process", "Mode", "Rate", "Is Lock"];
    let exportRowValues = ["projectvendor", "process", "mode", "rate", "islock"];
    return (
        <Box>
            <Headtitle title={'ERROR CONTROL'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Error Control"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Error Control"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aerrorcontrol")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Error Control</Typography>
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
                                                    setManagetypepgState({
                                                        ...managetypepgState,
                                                        process: "Please Select Process",
                                                    });
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
                                            <Typography>Mode<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Mode"
                                                value={managetypepgState.mode}
                                                onChange={(e) => {
                                                    setManagetypepgState({
                                                        ...managetypepgState,
                                                        mode: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Rate<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                inputMode="decimal"
                                                pattern="[0-9]*"
                                                placeholder="Please Enter Rate"
                                                value={managetypepgState.rate}
                                                onChange={(e) => {
                                                    const value = e.target.value;
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
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Is Lock <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={isLockOptions}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgState.islock,
                                                    value: managetypepgState.islock,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgState({
                                                        ...managetypepgState,
                                                        islock: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} mt={3}>
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
                    // maxWidth="sm"
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}
                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Error Control</Typography>
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
                                            <Typography>Mode <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Mode"
                                                value={managetypepgStateEdit.mode}
                                                onChange={(e) => {
                                                    setManagetypepgStateEdit({
                                                        ...managetypepgStateEdit,
                                                        mode: e.target.value,
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
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Is Lock <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={isLockOptions}
                                                // styles={colourStyles}
                                                value={{
                                                    label: managetypepgStateEdit.islock,
                                                    value: managetypepgStateEdit.islock,
                                                }}
                                                onChange={(e) => {
                                                    setManagetypepgStateEdit({
                                                        ...managetypepgStateEdit,
                                                        islock: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>Update</Button>
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
            {isUserRoleCompare?.includes("lerrorcontrol") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>List Error Control</Typography>
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
                                        {/* <MenuItem value={(penaltyErrorControl?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelerrorcontrol") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPenaltyErrorControlArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csverrorcontrol") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchPenaltyErrorControlArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printerrorcontrol") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdferrorcontrol") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchPenaltyErrorControlArray()
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageerrorcontrol") && (
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
                                    maindatas={penaltyErrorControl}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false} />
                            </Grid>
                        </Grid>

                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bderrorcontrol") && (
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
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
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
                        <Typography sx={userStyle.HeaderText}>View Error Control</Typography>
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
                                    <Typography variant="h6">Mode</Typography>
                                    <Typography>{managetypepgStateEdit.mode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Rate</Typography>
                                    <Typography>{managetypepgStateEdit.rate}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Is Lock</Typography>
                                    <Typography>{managetypepgStateEdit.islock}</Typography>
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
            {/* EXTERNAL COMPONENTS -------------- END */}
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
                itemsTwo={penaltyErrorControl ?? []}
                filename={"Error Control"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Error Control Info"
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
export default Errorcontrol;