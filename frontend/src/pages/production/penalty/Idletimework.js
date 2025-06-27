import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Checkbox, Dialog, TextareaAutosize, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import axios from '../../../axiosInstance.js';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import Resizable from 'react-resizable';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import AlertDialog from '../../../components/Alert.js';
import { DeleteConfirmation, PleaseSelectRow } from '../../../components/DeleteConfirmation.js';
import { handleApiError } from '../../../components/Errorhandling.js';
import ExportData from '../../../components/ExportData.js';
import Headtitle from '../../../components/Headtitle.js';
import InfoPopup from '../../../components/InfoPopup.js';
import MessageAlert from '../../../components/MessageAlert.js';
import StyledDataGrid from '../../../components/TableStyle.js';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext.js';
import { userStyle, colourStyles } from '../../../pageStyle.js';
import { SERVICE } from '../../../services/Baseservice.js';
import PageHeading from '../../../components/PageHeading.js';
import moment from "moment-timezone";
import { getCurrentServerTime } from '../../../components/getCurrentServerTime';

function IdleTimeWork() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState('');
    const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [popupSeverity, setPopupSeverity] = useState('');
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };
    const [fileFormat, setFormat] = useState('');
    const [ManageIdleWorkState, setManageIdleWorkState] = useState({
        name: '',
        appliedfor: 'Please Select Applied For',
        company: 'Please Select Company', branch: 'Please Select Branch', unit: 'Please Select Unit',
        team: 'Please Select Team', employee: 'Please Select Employee', process: "Please Select Process",
        idlework: "Please Select Idle Work", date: "", fromtime: "", totime: "", explanation: ""
    });
    const [ManageIdleWorkEdit, setManageIdleWorkEdit] = useState({ name: '', appliedfor: '' });
    const [taskcategorys, setTaskcategorys] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, isAssignBranch, allUsersData, allTeam } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [taskcategoryCheck, setTaskcategorycheck] = useState(false);
    const username = isUserRoleAccess.username;
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState('');
    const [copiedData, setCopiedData] = useState('');
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Idle Time Work.png');
                });
            });
        }
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // servertime add code
    const [serverTime, setServerTime] = useState(null);

    useEffect(() => {
        const fetchTime = async () => {
            const time = await getCurrentServerTime();
            setServerTime(time);
        };
        fetchTime();
    }, []);

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
                    data?.subsubpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.includes(window.location.pathname)
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
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    //Delete model
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
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage('');
    };
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
        if (selectedRows.includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        appliedfor: true,
        idlework: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        process: true,
        date: true,
        fromtime: true,
        totime: true,
        explanation: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    // dropdown functionality

    const [processQueueArray, setProcessQueueArray] = useState([]);
    const [idleWorkOpt, setIdleWorkOpt] = useState([]);
    const [idleWorkOptEdit, setIdleWorkOptEdit] = useState([]);

    // Get all process queues

    const fetchProcessQueue = async () => {
        setPageName(!pageName);
        try {
            const res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const allProcesses = res_freq?.data?.processqueuename || [];
            setProcessQueueArray(allProcesses);
        } catch (err) {
            // console.error("Error fetching process queue:", err);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // for Idle work Master 
    const fetchIdleWorkMaster = async () => {
        setPageName(!pageName);
        try {
            const res_freq = await axios.get(SERVICE.MANAGEIDLEWORK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const result = res_freq?.data?.manageidlework.filter(
                (d) => ManageIdleWorkState.appliedfor === d.appliedfor
            );

            const labelKey = {
                Employee: 'employeename',
                Team: 'teamname',
                Unit: 'unitname',
                Branch: 'branchname',
                Process: 'processname'
            }[ManageIdleWorkState.appliedfor];

            const branchall = result.map((d) => ({
                ...d,
                label: d[labelKey] || d.name,
                value: d[labelKey] || d.name,
            }));

            setIdleWorkOpt(branchall);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    // for Idle work Master Edit
    const fetchIdleWorkMasterEdit = async () => {
        setPageName(!pageName);
        try {
            const res_freq = await axios.get(SERVICE.MANAGEIDLEWORK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const result = res_freq?.data?.manageidlework.filter(
                (d) => ManageIdleWorkEdit.appliedfor === d.appliedfor
            );

            const labelKey = {
                Employee: 'employeename',
                Team: 'teamname',
                Unit: 'unitname',
                Branch: 'branchname',
                Process: 'processname'
            }[ManageIdleWorkEdit.appliedfor];

            const branchall = result.map((d) => ({
                ...d,
                label: d[labelKey] || d.name,
                value: d[labelKey] || d.name,
            }));

            setIdleWorkOptEdit(branchall);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    useEffect(() => {
        fetchProcessQueue();
    }, []);

    useEffect(() => {
        fetchIdleWorkMaster();
    }, [ManageIdleWorkState.appliedfor]);
    useEffect(() => {
        fetchIdleWorkMasterEdit();
    }, [ManageIdleWorkEdit.appliedfor]);


    const [deleteCategroy, setDeleteCategory] = useState('');
    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.IDLETIMEWORK_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteCategory(res?.data?.sidletimework);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // Alert delete popup
    let taskcategorysid = deleteCategroy?._id;
    const delTaskCategory = async (e) => {
        setPageName(!pageName);
        try {
            if (taskcategorysid) {
                await axios.delete(`${SERVICE.IDLETIMEWORK_SINGLE}/${deleteCategroy?._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchTaskcategory();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
                setPopupContent('Deleted Successfully');
                setPopupSeverity('success');
                handleClickOpenPopup();
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const delTaskCatecheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.IDLETIMEWORK_SINGLE}/${item}`, {
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
            await fetchTaskcategory();
            setPopupContent('Deleted Successfully');
            setPopupSeverity('success');
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //add function
    const [isBtn, setBtn] = useState(false);
    const sendRequest = async () => {
        setBtn(true);
        setPageName(!pageName);
        const appliedFor = ManageIdleWorkState.appliedfor;
        try {
            let subprojectscreate = await axios.post(SERVICE.IDLETIMEWORK_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                appliedfor: String(ManageIdleWorkState.appliedfor),
                idlework: String(ManageIdleWorkState.idlework),
                company: appliedFor !== "Company" ? String(ManageIdleWorkState.company) : "",
                branch: ["Branch", "Unit", "Team", "Employee", "Process"].includes(appliedFor) ? String(ManageIdleWorkState.branch) : "",
                unit: ["Unit", "Team", "Employee"].includes(appliedFor) ? String(ManageIdleWorkState.unit) : "",
                team: ["Team", "Employee"].includes(appliedFor) ? String(ManageIdleWorkState.team) : "",
                employee: appliedFor === "Employee" ? String(ManageIdleWorkState.employee) : "",
                process: appliedFor === "Process" ? String(ManageIdleWorkState.process) : "",
                date: String(ManageIdleWorkState.date),
                fromtime: String(ManageIdleWorkState.fromtime),
                totime: String(ManageIdleWorkState.totime),
                explanation: String(ManageIdleWorkState.explanation),

                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        // date: String(new Date()),
                    },
                ],
            });
            await fetchTaskcategory();
            setManageIdleWorkState({ ...ManageIdleWorkState, categoryname: '', description: '' });
            setPopupContent('Added Successfully');
            setPopupSeverity('success');
            handleClickOpenPopup();
            setBtn(false);
        } catch (err) {
            setBtn(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        const appliedFor = ManageIdleWorkState.appliedfor;
        const isNameMatch = taskcategorys.some((item) => {
            const appliedFor = ManageIdleWorkState.appliedfor;

            if (appliedFor === "Company") {
                return item.company === ManageIdleWorkState.company && item.idlework === ManageIdleWorkState.idlework;
            }

            if (appliedFor === "Branch") {
                return item.company === ManageIdleWorkState.company &&
                    item.branch === ManageIdleWorkState.branch && item.idlework === ManageIdleWorkState.idlework;
            }

            if (appliedFor === "Unit") {
                return item.company === ManageIdleWorkState.company &&
                    item.branch === ManageIdleWorkState.branch &&
                    item.unit === ManageIdleWorkState.unit && item.idlework === ManageIdleWorkState.idlework;
            }

            if (appliedFor === "Team") {
                return item.company === ManageIdleWorkState.company &&
                    item.branch === ManageIdleWorkState.branch &&
                    item.unit === ManageIdleWorkState.unit &&
                    item.team === ManageIdleWorkState.team && item.idlework === ManageIdleWorkState.idlework;
            }

            if (appliedFor === "Employee") {
                return item.company === ManageIdleWorkState.company &&
                    item.branch === ManageIdleWorkState.branch &&
                    item.unit === ManageIdleWorkState.unit &&
                    item.team === ManageIdleWorkState.team &&
                    item.employee === ManageIdleWorkState.employee && item.idlework === ManageIdleWorkState.idlework;
            }

            if (appliedFor === "Process") {
                return item.company === ManageIdleWorkState.company &&
                    item.branch === ManageIdleWorkState.branch &&
                    item.process === ManageIdleWorkState.process && item.idlework === ManageIdleWorkState.idlework;
            }

            return false;
        });


        if (ManageIdleWorkState.appliedfor === 'Please Select Applied For') {
            setPopupContentMalert('Please Select Applied For');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (ManageIdleWorkState.idlework === 'Please Select Idle Work') {
            setPopupContentMalert('Please Select Idle Work');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (appliedFor !== "Company" && ManageIdleWorkState.company === 'Please Select Company') {
            setPopupContentMalert('Please Select Company');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((appliedFor === "Branch" || appliedFor === "Unit" || appliedFor === "Team" || appliedFor === "Employee" || appliedFor === "Process") &&
            ManageIdleWorkState.branch === "Please Select Branch") {
            setPopupContentMalert('Please Select Branch');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((appliedFor === "Unit" || appliedFor === "Team" || appliedFor === "Employee") &&
            ManageIdleWorkState.unit === "Please Select Unit") {
            setPopupContentMalert('Please Select Unit');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((appliedFor === "Team" || appliedFor === "Employee") &&
            ManageIdleWorkState.team === "Please Select Team") {
            setPopupContentMalert('Please Select Team');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (appliedFor === "Employee" && ManageIdleWorkState.employee === "Please Select Employee") {
            setPopupContentMalert('Please Select Employee');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (appliedFor === "Process" && ManageIdleWorkState.process === "Please Select Process") {
            setPopupContentMalert('Please Select Employee');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (ManageIdleWorkState.date === '') {
            setPopupContentMalert('Please Select Date');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert('Data already exists!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };
    const handleClear = (e) => {
        e.preventDefault();
        setManageIdleWorkState({
            appliedfor: "Please Select Applied For",
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            employee: "Please Select Employee",
            process: "Please Select Process",
            idlework: "Please Select Idle Work",
            date: "",
            fromtime: "",
            totime: "",
            explanation: ""
        });
        setPopupContent('Cleared Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
    };
    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === 'backdropClick') return;
        setIsEditOpen(false);
    };
    const handleUpdateAlert = () => {
        setIsEditOpen(false);
        setPopupContent('Updated Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
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
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.IDLETIMEWORK_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageIdleWorkEdit(res?.data?.sidletimework);
            setIdleWorkOptEdit(res?.data?.sidletimework.idlework);
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.IDLETIMEWORK_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageIdleWorkEdit(res?.data?.sidletimework);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.IDLETIMEWORK_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageIdleWorkEdit(res?.data?.sidletimework);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //Project updateby edit page...
    let updateby = ManageIdleWorkEdit?.updatedby;
    let addedby = ManageIdleWorkEdit?.addedby;
    let subprojectsid = ManageIdleWorkEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        const appliedFor = ManageIdleWorkEdit.appliedfor;
        try {
            let res = await axios.put(`${SERVICE.IDLETIMEWORK_SINGLE}/${subprojectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                appliedfor: String(ManageIdleWorkEdit.appliedfor),
                idlework: String(ManageIdleWorkEdit.idlework),
                company: appliedFor !== "Company" ? String(ManageIdleWorkEdit.company) : "",
                branch: ["Branch", "Unit", "Team", "Employee", "Process"].includes(appliedFor) ? String(ManageIdleWorkEdit.branch) : "",
                unit: ["Unit", "Team", "Employee"].includes(appliedFor) ? String(ManageIdleWorkEdit.unit) : "",
                team: ["Team", "Employee"].includes(appliedFor) ? String(ManageIdleWorkEdit.team) : "",
                employee: appliedFor === "Employee" ? String(ManageIdleWorkEdit.employee) : "",
                process: appliedFor === "Process" ? String(ManageIdleWorkEdit.process) : "",
                date: String(ManageIdleWorkEdit.date),
                fromtime: String(ManageIdleWorkEdit.fromtime),
                totime: String(ManageIdleWorkEdit.totime),
                explanation: String(ManageIdleWorkEdit.explanation),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        // date: String(new Date()),
                    },
                ],
            });
            await fetchTaskcategory();
            handleUpdateAlert();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchTaskcategoryAll();
        const appliedFor = ManageIdleWorkEdit.appliedfor;

        const isNameMatch = resdata.some((item) => {
            const appliedFor = ManageIdleWorkEdit.appliedfor;

            if (appliedFor === "Company") {
                return item.company === ManageIdleWorkEdit.company && item.idlework === ManageIdleWorkEdit.idlework;
            }

            if (appliedFor === "Branch") {
                return item.company === ManageIdleWorkEdit.company &&
                    item.branch === ManageIdleWorkEdit.branch && item.idlework === ManageIdleWorkEdit.idlework;
            }

            if (appliedFor === "Unit") {
                return item.company === ManageIdleWorkEdit.company &&
                    item.branch === ManageIdleWorkEdit.branch &&
                    item.unit === ManageIdleWorkEdit.unit && item.idlework === ManageIdleWorkEdit.idlework;
            }

            if (appliedFor === "Team") {
                return item.company === ManageIdleWorkEdit.company &&
                    item.branch === ManageIdleWorkEdit.branch &&
                    item.unit === ManageIdleWorkEdit.unit &&
                    item.team === ManageIdleWorkEdit.team && item.idlework === ManageIdleWorkEdit.idlework;
            }

            if (appliedFor === "Employee") {
                return item.company === ManageIdleWorkEdit.company &&
                    item.branch === ManageIdleWorkEdit.branch &&
                    item.unit === ManageIdleWorkEdit.unit &&
                    item.team === ManageIdleWorkEdit.team &&
                    item.employee === ManageIdleWorkEdit.employee && item.idlework === ManageIdleWorkEdit.idlework;
            }

            if (appliedFor === "Process") {
                return item.company === ManageIdleWorkEdit.company &&
                    item.branch === ManageIdleWorkEdit.branch &&
                    item.process === ManageIdleWorkEdit.process && item.idlework === ManageIdleWorkEdit.idlework;
            }

            return false;
        });
        if (ManageIdleWorkEdit.appliedfor === 'Please Select Applied For') {
            setPopupContentMalert('Please Select Applied For');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (ManageIdleWorkEdit.idlework === 'Please Select Idle Work') {
            setPopupContentMalert('Please Select Idle Work');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (appliedFor !== "Company" && ManageIdleWorkEdit.company === 'Please Select Company') {
            setPopupContentMalert('Please Select Company');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((appliedFor === "Branch" || appliedFor === "Unit" || appliedFor === "Team" || appliedFor === "Employee" || appliedFor === "Process") &&
            ManageIdleWorkEdit.branch === "Please Select Branch") {
            setPopupContentMalert('Please Select Branch');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((appliedFor === "Unit" || appliedFor === "Team" || appliedFor === "Employee") &&
            ManageIdleWorkEdit.unit === "Please Select Unit") {
            setPopupContentMalert('Please Select Unit');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((appliedFor === "Team" || appliedFor === "Employee") &&
            ManageIdleWorkEdit.team === "Please Select Team") {
            setPopupContentMalert('Please Select Team');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (appliedFor === "Employee" && ManageIdleWorkEdit.employee === "Please Select Employee") {
            setPopupContentMalert('Please Select Employee');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (appliedFor === "Process" && ManageIdleWorkEdit.process === "Please Select Process") {
            setPopupContentMalert('Please Select Employee');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (ManageIdleWorkEdit.date === '') {
            setPopupContentMalert('Please Select Date');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert('Data already exists!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };
    const [taskcategorysOverall, setTaskcategorysOverall] = useState([]);
    //get all Sub vendormasters.
    const fetchTaskcategoryArray = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.IDLETIMEWORK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskcategorycheck(true);
            setTaskcategorysOverall(res_vendor?.data?.idletimeworks);
        } catch (err) {
            setTaskcategorycheck(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    useEffect(() => {
        fetchTaskcategoryArray();
    }, [isFilterOpen, isPdfFilterOpen]);
    //get all Sub vendormasters.
    const fetchTaskcategory = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.IDLETIMEWORK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskcategorycheck(true);
            setTaskcategorys(res_vendor?.data?.idletimeworks);
        } catch (err) {
            setTaskcategorycheck(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //get all Sub vendormasters.
    const fetchTaskcategoryAll = async () => {
        setPageName(!pageName);
        try {
            let res_meet = await axios.get(SERVICE.IDLETIMEWORK, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            return res_meet?.data?.idletimeworks.filter((item) => item._id !== ManageIdleWorkEdit._id);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const exportColumnNames = ['Applied For', 'Idle Work', 'Company', 'Branch', 'Unit', 'Team',
        'Employee', 'Process', 'Date', 'From Time', 'To Time', 'Explanation'];
    const exportRowValues = ['appliedfor', 'idlework', 'company', 'branch', 'unit', 'team',
        'employee', 'process', 'date', 'fromtime', 'totime', 'explanation'];
    // Excel
    const fileName = 'Idle Time Work';
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Idle Time Work',
        pageStyle: 'print',
    });

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String('Idle Time Work'),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date(serverTime)),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    // date: String(new Date(serverTime)),
                },
            ],
        });
    };

    useEffect(() => {
        getapi();
        fetchTaskcategory();
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);
    const [items, setItems] = useState([]);
    const addSerialNumber = () => {
        const itemsWithSerialNumber = taskcategorys?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber();
    }, [taskcategorys]);
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
    const searchTerms = searchQuery.toLowerCase().split(' ');
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
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
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        {
            field: 'checkbox',
            headerName: 'Checkbox', // Default header name
            headerStyle: {
                fontWeight: 'bold', // Apply the font-weight style to make the header text bold
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
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 80,
            hide: !columnVisibility.checkbox,
            headerClassName: 'bold-header',
        },
        {
            field: 'serialNumber',
            headerName: 'SNo',
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: 'bold-header',
        },
        { field: 'appliedfor', headerName: 'Applied For', flex: 0, width: 120, hide: !columnVisibility.appliedfor, headerClassName: 'bold-header' },
        { field: 'idlework', headerName: 'Idle Work', flex: 0, width: 120, hide: !columnVisibility.idlework, headerClassName: 'bold-header' },
        { field: 'company', headerName: 'Company', flex: 0, width: 120, hide: !columnVisibility.company, headerClassName: 'bold-header' },
        { field: 'branch', headerName: 'Branch', flex: 0, width: 120, hide: !columnVisibility.branch, headerClassName: 'bold-header' },
        { field: 'unit', headerName: 'Unit', flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: 'bold-header' },
        { field: 'team', headerName: 'Team', flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: 'bold-header' },
        { field: 'employee', headerName: 'Employee', flex: 0, width: 120, hide: !columnVisibility.employee, headerClassName: 'bold-header' },
        { field: 'process', headerName: 'Process', flex: 0, width: 120, hide: !columnVisibility.process, headerClassName: 'bold-header' },
        { field: 'date', headerName: 'Date', flex: 0, width: 120, hide: !columnVisibility.date, headerClassName: 'bold-header' },
        { field: 'fromtime', headerName: 'From Time', flex: 0, width: 120, hide: !columnVisibility.fromtime, headerClassName: 'bold-header' },
        { field: 'totime', headerName: 'To Time', flex: 0, width: 120, hide: !columnVisibility.totime, headerClassName: 'bold-header' },
        { field: 'explanation', headerName: 'Explanation', flex: 0, width: 120, hide: !columnVisibility.explanation, headerClassName: 'bold-header' },
        {
            field: 'actions',
            headerName: 'Action',
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: 'bold-header',
            renderCell: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes('eidletimework') && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id, params.row.name);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes('didletimework') && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />{' '}
                        </Button>
                    )}
                    {isUserRoleCompare?.includes('vidletimework') && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{' '}
                        </Button>
                    )}
                    {isUserRoleCompare?.includes('iidletimework') && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />{' '}
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
            appliedfor: item.appliedfor,
            idlework: item.idlework,
            // idlework: item.idlework === "Please Select Idle Work" ? "" : item.idlework,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employee: item.employee,
            process: item.process,
            date: moment(item.date).format("DD-MM-YYYY"),
            fromtime: item.fromtime,
            totime: item.totime,
            explanation: item.explanation,
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

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%' }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: 'flex' }}
                                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
    const appliedFOrOpt = [
        { label: 'Employee', value: 'Employee' },
        { label: 'Team', value: 'Team' },
        { label: 'Unit', value: 'Unit' },
        { label: 'Branch', value: 'Branch' },
        { label: 'Process', value: 'Process' },
    ];
    return (
        <Box>
            <Headtitle title={'Idle Time Work'} />
            <PageHeading title="Idle Time Work" modulename="Production" submodulename="Non Production" mainpagename="Non-production Setup" subpagename="Idle Time Work" subsubpagename="" />
            {/* ****** Header Content ****** */}
            {isUserRoleCompare?.includes('aidletimework') && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Idle Time Work</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Applied For<b style={{ color: 'red' }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={appliedFOrOpt}
                                            value={{
                                                label: ManageIdleWorkState.appliedfor,
                                                value: ManageIdleWorkState.appliedfor,
                                            }}
                                            onChange={(e) => {
                                                setManageIdleWorkState({
                                                    ...ManageIdleWorkState,
                                                    appliedfor: e.value,
                                                    company: "Please Select Company",
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    team: "Please Select Team",
                                                    employee: "Please Select Employee",
                                                    process: "Please Select Process",
                                                    idlework: "Please Select Idle Work",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Idle Work<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={idleWorkOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: ManageIdleWorkState.idlework,
                                                value: ManageIdleWorkState.idlework,
                                            }}
                                            onChange={(e) => {
                                                setManageIdleWorkState({
                                                    ...ManageIdleWorkState,
                                                    idlework: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                {(ManageIdleWorkState.appliedfor === "Employee" ||
                                    ManageIdleWorkState.appliedfor === "Team" ||
                                    ManageIdleWorkState.appliedfor === "Unit" ||
                                    ManageIdleWorkState.appliedfor === "Branch" ||
                                    ManageIdleWorkState.appliedfor === "Process") && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={accessbranch
                                                        ?.map((data) => ({
                                                            label: data.company,
                                                            value: data.company,
                                                        }))
                                                        .filter((item, index, self) =>
                                                            self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                        )}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: ManageIdleWorkState.company,
                                                        value: ManageIdleWorkState.company,
                                                    }}
                                                    onChange={(e) => {
                                                        setManageIdleWorkState({
                                                            ...ManageIdleWorkState,
                                                            company: e.value,
                                                            branch: "Please Select Branch",
                                                            unit: "Please Select Unit",
                                                            team: "Please Select Team",
                                                            employee: "Please Select Employee",
                                                            process: "Please Select Process",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}

                                {(ManageIdleWorkState.appliedfor === "Employee" ||
                                    ManageIdleWorkState.appliedfor === "Team" ||
                                    ManageIdleWorkState.appliedfor === "Unit" ||
                                    ManageIdleWorkState.appliedfor === "Branch" ||
                                    ManageIdleWorkState.appliedfor === "Process") && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={ManageIdleWorkState.appliedfor === "Branch" ? [{
                                                        label: "ALL",
                                                        value: "ALL"
                                                    }, ...accessbranch
                                                        ?.filter((comp) => ManageIdleWorkState.company === comp.company)
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) =>
                                                            self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                        )] : accessbranch
                                                            ?.filter((comp) => ManageIdleWorkState.company === comp.company)
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: ManageIdleWorkState.branch,
                                                        value: ManageIdleWorkState.branch,
                                                    }}
                                                    onChange={(e) => {
                                                        setManageIdleWorkState({
                                                            ...ManageIdleWorkState,
                                                            branch: e.value,
                                                            unit: "Please Select Unit",
                                                            team: "Please Select Team",
                                                            employee: "Please Select Employee",
                                                            process: "Please Select Process",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}

                                {(ManageIdleWorkState.appliedfor === "Employee" ||
                                    ManageIdleWorkState.appliedfor === "Team" ||
                                    ManageIdleWorkState.appliedfor === "Unit") && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={ManageIdleWorkState.appliedfor === "Unit" ? [{
                                                        label: "ALL",
                                                        value: "ALL"
                                                    }, ...accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                ManageIdleWorkState.company === comp.company &&
                                                                ManageIdleWorkState.branch === comp.branch
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        }))
                                                        .filter((item, index, self) =>
                                                            self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                        )] : accessbranch
                                                            ?.filter(
                                                                (comp) =>
                                                                    ManageIdleWorkState.company === comp.company &&
                                                                    ManageIdleWorkState.branch === comp.branch
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            }))
                                                            .filter((item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: ManageIdleWorkState.unit,
                                                        value: ManageIdleWorkState.unit,
                                                    }}
                                                    onChange={(e) => {
                                                        setManageIdleWorkState({
                                                            ...ManageIdleWorkState,
                                                            unit: e.value,
                                                            team: "Please Select Team",
                                                            employee: "Please Select Employee",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}

                                {(ManageIdleWorkState.appliedfor === "Employee" ||
                                    ManageIdleWorkState.appliedfor === "Team") && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={ManageIdleWorkState.appliedfor === "Team" ? [{
                                                        label: "ALL",
                                                        value: "ALL"
                                                    }, ...allTeam
                                                        ?.filter(
                                                            (comp) =>
                                                                ManageIdleWorkState.company === comp.company &&
                                                                ManageIdleWorkState.branch === comp.branch &&
                                                                ManageIdleWorkState.unit === comp.unit
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.teamname,
                                                            value: data.teamname,
                                                        }))
                                                        .filter((item, index, self) =>
                                                            self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                        )] : allTeam
                                                            ?.filter(
                                                                (comp) =>
                                                                    ManageIdleWorkState.company === comp.company &&
                                                                    ManageIdleWorkState.branch === comp.branch &&
                                                                    ManageIdleWorkState.unit === comp.unit
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.teamname,
                                                                value: data.teamname,
                                                            }))
                                                            .filter((item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: ManageIdleWorkState.team,
                                                        value: ManageIdleWorkState.team,
                                                    }}
                                                    onChange={(e) => {
                                                        setManageIdleWorkState({
                                                            ...ManageIdleWorkState,
                                                            team: e.value,
                                                            employee: "Please Select Employee",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}

                                {ManageIdleWorkState.appliedfor === "Employee" && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={ManageIdleWorkState.appliedfor === "Employee" ? [{
                                                    label: "ALL",
                                                    value: "ALL"
                                                }, ...allUsersData
                                                    ?.filter(
                                                        (comp) =>
                                                            ManageIdleWorkState.company === comp.company &&
                                                            ManageIdleWorkState.branch === comp.branch &&
                                                            ManageIdleWorkState.unit === comp.unit &&
                                                            ManageIdleWorkState.team === comp.team
                                                    )
                                                    ?.map((data) => ({
                                                        label: data.companyname,
                                                        value: data.companyname,
                                                    }))
                                                    .filter((item, index, self) =>
                                                        self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                    )] : allUsersData
                                                        ?.filter(
                                                            (comp) =>
                                                                ManageIdleWorkState.company === comp.company &&
                                                                ManageIdleWorkState.branch === comp.branch &&
                                                                ManageIdleWorkState.unit === comp.unit &&
                                                                ManageIdleWorkState.team === comp.team
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.companyname,
                                                            value: data.companyname,
                                                        }))
                                                        .filter((item, index, self) =>
                                                            self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                        )}
                                                styles={colourStyles}
                                                value={{
                                                    label: ManageIdleWorkState.employee,
                                                    value: ManageIdleWorkState.employee,
                                                }}
                                                onChange={(e) => {
                                                    setManageIdleWorkState({
                                                        ...ManageIdleWorkState,
                                                        employee: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                {ManageIdleWorkState.appliedfor === "Process" && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Process <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={ManageIdleWorkState.appliedfor === "Process" ? [{
                                                    label: "ALL",
                                                    value: "ALL"
                                                }, ...processQueueArray
                                                    ?.filter(
                                                        (comp) =>
                                                            ManageIdleWorkState.company === comp.company &&
                                                            ManageIdleWorkState.branch === comp.branch
                                                    )
                                                    ?.map((data) => ({
                                                        label: data.name,
                                                        value: data.name,
                                                    }))
                                                    .filter(
                                                        (item, index, self) =>
                                                            self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                    )] : processQueueArray
                                                        ?.filter(
                                                            (comp) =>
                                                                ManageIdleWorkState.company === comp.company &&
                                                                ManageIdleWorkState.branch === comp.branch
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.name,
                                                            value: data.name,
                                                        }))
                                                        .filter(
                                                            (item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                        )}
                                                styles={colourStyles}
                                                value={{
                                                    label: ManageIdleWorkState.process,
                                                    value: ManageIdleWorkState.process,
                                                }}
                                                onChange={(e) => {
                                                    setManageIdleWorkState({
                                                        ...ManageIdleWorkState,
                                                        process: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                )}




                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Date <b style={{ color: 'red' }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={ManageIdleWorkState.date}
                                            onChange={(e) => {
                                                setManageIdleWorkState({ ...ManageIdleWorkState, date: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>From Time</Typography>
                                        <OutlinedInput
                                            id="fromtime"
                                            type="time"
                                            value={ManageIdleWorkState.fromtime}
                                            onChange={(e) => {
                                                const fromTime = e.target.value;
                                                const toTime = ManageIdleWorkState.totime;

                                                // Clear totime if it becomes invalid
                                                if (toTime && fromTime >= toTime) {
                                                    setManageIdleWorkState({ ...ManageIdleWorkState, fromtime: fromTime, totime: '' });
                                                } else {
                                                    setManageIdleWorkState({ ...ManageIdleWorkState, fromtime: fromTime });
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>To Time</Typography>
                                        <OutlinedInput
                                            id="totime"
                                            type="time"
                                            value={ManageIdleWorkState.totime}
                                            inputProps={{
                                                min: ManageIdleWorkState.fromtime || undefined,
                                            }}
                                            disabled={!ManageIdleWorkState.fromtime}
                                            onChange={(e) => {
                                                const toTime = e.target.value;
                                                const fromTime = ManageIdleWorkState.fromtime;

                                                // Only allow if toTime > fromTime
                                                if (fromTime && toTime > fromTime) {
                                                    setManageIdleWorkState({ ...ManageIdleWorkState, totime: toTime });
                                                } else {
                                                    setManageIdleWorkState({ ...ManageIdleWorkState, totime: '' });
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Explanation
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={7}
                                            value={ManageIdleWorkState.explanation}
                                            onChange={(e) => {
                                                setManageIdleWorkState({ ...ManageIdleWorkState, explanation: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                    <Typography>&nbsp;</Typography>
                                    <Grid
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '15px',
                                        }}
                                    >
                                        <Button sx={buttonStyles.buttonsubmit} onClick={handleSubmit} disabled={isBtn}>
                                            SAVE
                                        </Button>
                                        <Button sx={buttonStyles.btncancel} onClick={handleClear}>
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
                    maxWidth="md"
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                        marginTop: "42px"
                    }}
                >
                    <DialogContent sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Idle Time Work</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Applied For<b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={appliedFOrOpt}
                                                value={{
                                                    label: ManageIdleWorkEdit.appliedfor,
                                                    value: ManageIdleWorkEdit.appliedfor,
                                                }}
                                                onChange={(e) => {
                                                    setManageIdleWorkEdit({
                                                        ...ManageIdleWorkEdit,
                                                        appliedfor: e.value,
                                                        company: "Please Select Company",
                                                        branch: "Please Select Branch",
                                                        unit: "Please Select Unit",
                                                        team: "Please Select Team",
                                                        employee: "Please Select Employee",
                                                        process: "Please Select Process",
                                                        idlework: "Please Select Idle Work",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Idle Work<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={idleWorkOptEdit}
                                                // options={Array.isArray(idleWorkOptEdit) ? idleWorkOptEdit : []}
                                                styles={colourStyles}
                                                value={{
                                                    label: ManageIdleWorkEdit.idlework,
                                                    value: ManageIdleWorkEdit.idlework,
                                                }}
                                                onChange={(e) => {
                                                    setManageIdleWorkEdit({
                                                        ...ManageIdleWorkEdit,
                                                        idlework: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    {(ManageIdleWorkEdit.appliedfor === "Employee" ||
                                        ManageIdleWorkEdit.appliedfor === "Team" ||
                                        ManageIdleWorkEdit.appliedfor === "Unit" ||
                                        ManageIdleWorkEdit.appliedfor === "Branch" ||
                                        ManageIdleWorkEdit.appliedfor === "Process") && (
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Company<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={accessbranch
                                                            ?.map((data) => ({
                                                                label: data.company,
                                                                value: data.company,
                                                            }))
                                                            .filter((item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )}
                                                        styles={colourStyles}
                                                        value={{
                                                            label: ManageIdleWorkEdit.company,
                                                            value: ManageIdleWorkEdit.company,
                                                        }}
                                                        onChange={(e) => {
                                                            setManageIdleWorkEdit({
                                                                ...ManageIdleWorkEdit,
                                                                company: e.value,
                                                                branch: "Please Select Branch",
                                                                unit: "Please Select Unit",
                                                                team: "Please Select Team",
                                                                employee: "Please Select Employee",
                                                                process: "Please Select Process",
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}

                                    {(ManageIdleWorkEdit.appliedfor === "Employee" ||
                                        ManageIdleWorkEdit.appliedfor === "Team" ||
                                        ManageIdleWorkEdit.appliedfor === "Unit" ||
                                        ManageIdleWorkEdit.appliedfor === "Branch" ||
                                        ManageIdleWorkEdit.appliedfor === "Process") && (
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Branch<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={ManageIdleWorkEdit.appliedfor === "Branch" ? [{
                                                            label: "ALL",
                                                            value: "ALL"
                                                        }, ...accessbranch
                                                            ?.filter((comp) => ManageIdleWorkEdit.company === comp.company)
                                                            ?.map((data) => ({
                                                                label: data.branch,
                                                                value: data.branch,
                                                            }))
                                                            .filter((item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )] : accessbranch
                                                                ?.filter((comp) => ManageIdleWorkEdit.company === comp.company)
                                                                ?.map((data) => ({
                                                                    label: data.branch,
                                                                    value: data.branch,
                                                                }))
                                                                .filter((item, index, self) =>
                                                                    self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                                )}
                                                        styles={colourStyles}
                                                        value={{
                                                            label: ManageIdleWorkEdit.branch,
                                                            value: ManageIdleWorkEdit.branch,
                                                        }}
                                                        onChange={(e) => {
                                                            setManageIdleWorkEdit({
                                                                ...ManageIdleWorkEdit,
                                                                branch: e.value,
                                                                unit: "Please Select Unit",
                                                                team: "Please Select Team",
                                                                employee: "Please Select Employee",
                                                                process: "Please Select Process",
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}

                                    {(ManageIdleWorkEdit.appliedfor === "Employee" ||
                                        ManageIdleWorkEdit.appliedfor === "Team" ||
                                        ManageIdleWorkEdit.appliedfor === "Unit") && (
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Unit<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={ManageIdleWorkEdit.appliedfor === "Unit" ? [{
                                                            label: "ALL",
                                                            value: "ALL"
                                                        }, ...accessbranch
                                                            ?.filter(
                                                                (comp) =>
                                                                    ManageIdleWorkEdit.company === comp.company &&
                                                                    ManageIdleWorkEdit.branch === comp.branch
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.unit,
                                                                value: data.unit,
                                                            }))
                                                            .filter((item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )] : accessbranch
                                                                ?.filter(
                                                                    (comp) =>
                                                                        ManageIdleWorkEdit.company === comp.company &&
                                                                        ManageIdleWorkEdit.branch === comp.branch
                                                                )
                                                                ?.map((data) => ({
                                                                    label: data.unit,
                                                                    value: data.unit,
                                                                }))
                                                                .filter((item, index, self) =>
                                                                    self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                                )}
                                                        styles={colourStyles}
                                                        value={{
                                                            label: ManageIdleWorkEdit.unit,
                                                            value: ManageIdleWorkEdit.unit,
                                                        }}
                                                        onChange={(e) => {
                                                            setManageIdleWorkEdit({
                                                                ...ManageIdleWorkEdit,
                                                                unit: e.value,
                                                                team: "Please Select Team",
                                                                employee: "Please Select Employee",
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}

                                    {(ManageIdleWorkEdit.appliedfor === "Employee" ||
                                        ManageIdleWorkEdit.appliedfor === "Team") && (
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Team<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={ManageIdleWorkEdit.appliedfor === "Team" ? [{
                                                            label: "ALL",
                                                            value: "ALL"
                                                        }, ...allTeam
                                                            ?.filter(
                                                                (comp) =>
                                                                    ManageIdleWorkEdit.company === comp.company &&
                                                                    ManageIdleWorkEdit.branch === comp.branch &&
                                                                    ManageIdleWorkEdit.unit === comp.unit
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.teamname,
                                                                value: data.teamname,
                                                            }))
                                                            .filter((item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )] : allTeam
                                                                ?.filter(
                                                                    (comp) =>
                                                                        ManageIdleWorkEdit.company === comp.company &&
                                                                        ManageIdleWorkEdit.branch === comp.branch &&
                                                                        ManageIdleWorkEdit.unit === comp.unit
                                                                )
                                                                ?.map((data) => ({
                                                                    label: data.teamname,
                                                                    value: data.teamname,
                                                                }))
                                                                .filter((item, index, self) =>
                                                                    self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                                )}
                                                        styles={colourStyles}
                                                        value={{
                                                            label: ManageIdleWorkEdit.team,
                                                            value: ManageIdleWorkEdit.team,
                                                        }}
                                                        onChange={(e) => {
                                                            setManageIdleWorkEdit({
                                                                ...ManageIdleWorkEdit,
                                                                team: e.value,
                                                                employee: "Please Select Employee",
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}

                                    {ManageIdleWorkEdit.appliedfor === "Employee" && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={ManageIdleWorkEdit.appliedfor === "Employee" ? [{
                                                        label: "ALL",
                                                        value: "ALL"
                                                    }, ...allUsersData
                                                        ?.filter(
                                                            (comp) =>
                                                                ManageIdleWorkEdit.company === comp.company &&
                                                                ManageIdleWorkEdit.branch === comp.branch &&
                                                                ManageIdleWorkEdit.unit === comp.unit &&
                                                                ManageIdleWorkEdit.team === comp.team
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.companyname,
                                                            value: data.companyname,
                                                        }))
                                                        .filter((item, index, self) =>
                                                            self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                        )] : allUsersData
                                                            ?.filter(
                                                                (comp) =>
                                                                    ManageIdleWorkEdit.company === comp.company &&
                                                                    ManageIdleWorkEdit.branch === comp.branch &&
                                                                    ManageIdleWorkEdit.unit === comp.unit &&
                                                                    ManageIdleWorkEdit.team === comp.team
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.companyname,
                                                                value: data.companyname,
                                                            }))
                                                            .filter((item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: ManageIdleWorkEdit.employee,
                                                        value: ManageIdleWorkEdit.employee,
                                                    }}
                                                    onChange={(e) => {
                                                        setManageIdleWorkEdit({
                                                            ...ManageIdleWorkEdit,
                                                            employee: e.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                    {ManageIdleWorkEdit.appliedfor === "Process" && (
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Process <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={ManageIdleWorkEdit.appliedfor === "Process" ? [{
                                                        label: "ALL",
                                                        value: "ALL"
                                                    }, ...processQueueArray
                                                        ?.filter(
                                                            (comp) =>
                                                                ManageIdleWorkEdit.company === comp.company &&
                                                                ManageIdleWorkEdit.branch === comp.branch
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.name,
                                                            value: data.name,
                                                        }))
                                                        .filter(
                                                            (item, index, self) =>
                                                                self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                        )] : processQueueArray
                                                            ?.filter(
                                                                (comp) =>
                                                                    ManageIdleWorkEdit.company === comp.company &&
                                                                    ManageIdleWorkEdit.branch === comp.branch
                                                            )
                                                            ?.map((data) => ({
                                                                label: data.name,
                                                                value: data.name,
                                                            }))
                                                            .filter(
                                                                (item, index, self) =>
                                                                    self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                                                            )}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: ManageIdleWorkEdit.process,
                                                        value: ManageIdleWorkEdit.process,
                                                    }}
                                                    onChange={(e) => {
                                                        setManageIdleWorkEdit({
                                                            ...ManageIdleWorkEdit,
                                                            process: e.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Date <b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={ManageIdleWorkEdit.date}
                                                onChange={(e) => {
                                                    setManageIdleWorkEdit({ ...ManageIdleWorkEdit, date: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>From Time</Typography>
                                            <OutlinedInput
                                                id="fromtime"
                                                type="time"
                                                value={ManageIdleWorkEdit.fromtime}
                                                onChange={(e) => {
                                                    const fromTime = e.target.value;
                                                    const toTime = ManageIdleWorkEdit.totime;

                                                    // Clear totime if it becomes invalid
                                                    if (toTime && fromTime >= toTime) {
                                                        setManageIdleWorkEdit({ ...ManageIdleWorkEdit, fromtime: fromTime, totime: '' });
                                                    } else {
                                                        setManageIdleWorkEdit({ ...ManageIdleWorkEdit, fromtime: fromTime });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>To Time</Typography>
                                            <OutlinedInput
                                                id="totime"
                                                type="time"
                                                value={ManageIdleWorkEdit.totime}
                                                inputProps={{
                                                    min: ManageIdleWorkEdit.fromtime || undefined,
                                                }}
                                                disabled={!ManageIdleWorkEdit.fromtime}
                                                onChange={(e) => {
                                                    const toTime = e.target.value;
                                                    const fromTime = ManageIdleWorkEdit.fromtime;

                                                    // Only allow if toTime > fromTime
                                                    if (fromTime && toTime > fromTime) {
                                                        setManageIdleWorkEdit({ ...ManageIdleWorkEdit, totime: toTime });
                                                    } else {
                                                        setManageIdleWorkEdit({ ...ManageIdleWorkEdit, totime: '' });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Explanation
                                            </Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={7}
                                                value={ManageIdleWorkEdit.explanation}
                                                onChange={(e) => {
                                                    setManageIdleWorkEdit({ ...ManageIdleWorkEdit, explanation: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.buttonsubmit} type="submit" onClick={editSubmit}>
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                                {/* </DialogContent> */}
                            </form>
                        </>
                    </DialogContent>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes('lidletimework') && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Idle Time Work List</Typography>
                        </Grid>
                        <Grid item md={12} xs={12} sm={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Typography>&nbsp;</Typography>
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
                                        sx={{ width: '77px' }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12}>
                                <Typography>&nbsp;</Typography>

                                <Box>
                                    {isUserRoleCompare?.includes('excelidletimework') && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchTaskcategoryArray();
                                                    setFormat('xl');
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('csvidletimework') && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchTaskcategoryArray();
                                                    setFormat('csv');
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('printidletimework') && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('pdfidletimework') && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                    fetchTaskcategoryArray();
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('imageidletimework') && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {' '}
                                            <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br></br>
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {isUserRoleCompare?.includes('bdidletimework') && (
                            <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        {!taskcategoryCheck ? (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
                                        Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}
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
                maxWidth="md"
                sx={{
                    marginTop: "42px"
                }}
            >
                <DialogContent sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Idle Time Work</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Applied For</Typography>
                                    <Typography>{ManageIdleWorkEdit.appliedfor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Idle Work </Typography>
                                    <Typography>{ManageIdleWorkEdit.appliedfor}</Typography>
                                </FormControl>
                            </Grid>
                            {(ManageIdleWorkEdit.appliedfor === "Employee" ||
                                ManageIdleWorkEdit.appliedfor === "Team" ||
                                ManageIdleWorkEdit.appliedfor === "Unit" ||
                                ManageIdleWorkEdit.appliedfor === "Branch" ||
                                ManageIdleWorkEdit.appliedfor === "Process") && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Company </Typography>
                                            <Typography>{ManageIdleWorkEdit.company}</Typography>
                                        </FormControl>
                                    </Grid>
                                )}
                            {(ManageIdleWorkEdit.appliedfor === "Employee" ||
                                ManageIdleWorkEdit.appliedfor === "Team" ||
                                ManageIdleWorkEdit.appliedfor === "Unit" ||
                                ManageIdleWorkEdit.appliedfor === "Branch" ||
                                ManageIdleWorkEdit.appliedfor === "Process") && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Branch </Typography>
                                            <Typography>{ManageIdleWorkEdit.branch}</Typography>
                                        </FormControl>
                                    </Grid>
                                )}
                            {(ManageIdleWorkEdit.appliedfor === "Employee" ||
                                ManageIdleWorkEdit.appliedfor === "Team" ||
                                ManageIdleWorkEdit.appliedfor === "Unit") && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Unit </Typography>
                                            <Typography>{ManageIdleWorkEdit.branch}</Typography>
                                        </FormControl>
                                    </Grid>
                                )}
                            {(ManageIdleWorkEdit.appliedfor === "Employee" ||
                                ManageIdleWorkEdit.appliedfor === "Team") && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Team </Typography>
                                            <Typography>{ManageIdleWorkEdit.team}</Typography>
                                        </FormControl>
                                    </Grid>
                                )}
                            {ManageIdleWorkEdit.appliedfor === "Employee" && (
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Employee </Typography>
                                        <Typography>{ManageIdleWorkEdit.employee}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {ManageIdleWorkEdit.appliedfor === "Process" && (
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Process </Typography>
                                        <Typography>{ManageIdleWorkEdit.process}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Date </Typography>
                                    <Typography>{ManageIdleWorkEdit.date}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>From Time </Typography>
                                    <Typography>{ManageIdleWorkEdit.fromtime}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>To Time </Typography>
                                    <Typography>{ManageIdleWorkEdit.totime}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Explanation </Typography>
                                    <Typography>
                                        {ManageIdleWorkEdit.explanation}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                                {' '}
                                Back{' '}
                            </Button>
                        </Grid>
                    </>
                </DialogContent>
            </Dialog>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}
                        >
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
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
            {/* SUCCESS */}
            <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
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
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={taskcategorysOverall ?? []}
                filename={'Idle Time Work'}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Idle Time Work Info" addedby={addedby} updateby={updateby} />
            <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delTaskCategory} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
            <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delTaskCatecheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
            <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
        </Box>
    );
}

export default IdleTimeWork;
