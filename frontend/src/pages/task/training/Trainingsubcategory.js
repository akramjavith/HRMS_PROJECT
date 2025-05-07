import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TextareaAutosize,
    DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { userStyle, colourStyles } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import Selects from "react-select";
import 'jspdf-autotable';
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment, { duration } from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import LoadingButton from "@mui/lab/LoadingButton";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function TrainingSubcategory() {

    const pathname = window.location.pathname;
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
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

    let exportColumnNames = ['Category', 'Subcategory Name', 'Duration', 'Module', 'Customer', 'Queue', 'Process'];
    let exportRowValues = ['category', 'subcategoryname', 'duration', 'module', 'customer', 'queue', 'process']

    const [trainingsubcategory, setTrainingsubcategory] = useState({
        category: "Please Select Category",
        subcategoryname: "",
        description: "",
        module: "Please Select Module",
        customer: "Please Select Customer",
        queue: "Please Select Queue",
        process: "Please Select Process",
    });
    const [btnLoad, setBtnLoad] = useState(false)
    const [selectedRowsCount, setSelectedRowsCount] = useState(0);
    const [ovcategory, setOvcategory] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
    const [ovProjCountDelete, setOvProjCountDelete] = useState("");
    const [trainingsubcategoryEdit, setTrainingsubcategoryEdit] = useState({ category: "Please Select Category", subcategoryname: "", description: "" })
    const [trainingsubcategorys, setTrainingsubcategorys] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allTrainingsubcategoryedit, setAllTrainingsubcategoryedit] = useState([]);
    const [category, setCategory] = useState([]);
    const [categoryEdit, setCategoryEdit] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [hours, setHours] = useState("Hrs");
    const [hoursEdit, setHoursEdit] = useState("Hrs");
    const [minutes, setMinutes] = useState("Mins");
    const [minutesEdit, setMinutesEdit] = useState("Mins");
    const [DocumentsChosed, setDocumentsChosed] = useState([]);
    const [DocumentsChosedEdit, setDocumentsChosedEdit] = useState([]);
    const [DocumentsDisplay, setDocumentsDisplay] = useState("Please Select Documents");
    const [DocumentsDisplayEdit, setDocumentsDisplayEdit] = useState("Please Select Documents");
    const [hrsOption, setHrsOption] = useState([]);
    const [minsOption, setMinsOption] = useState([]);
    const [tasksubcategoryCheck, setTasksubcategorycheck] = useState(false);
    const username = isUserRoleAccess.username
    const [documentsList, setDocumentsList] = useState([]);
    const [documentsListEdit, setDocumentsListEdit] = useState([]);
    const gridRef = useRef(null);
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [customeropt, setCustomerOptions] = useState([]);
    const [queueopt, setQueue] = useState([]);
    const [processOpt, setProcessOpt] = useState([]);
    const [customeroptEdit, setCustomerOptionsEdit] = useState([]);
    const [queueoptEdit, setQueueEdit] = useState([]);
    const [processOptEdit, setProcessOptEdit] = useState([]);
    const [moduleOpt, setModuleOpt] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Training Subcategory"),
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

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [addDocTodo, setAddDocTodo] = useState([])
    const [addDocTodoEdit, setAddDocTodoEdit] = useState([])
    const addTodo = (e) => {
        const DuplicateData = addDocTodo?.some(data => data.name === DocumentsChosed?.value)
        if (DocumentsDisplay === "Please Select Documents") {
            setPopupContentMalert("Please Select Documents");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (DuplicateData) {
            setPopupContentMalert("Please Select Different Document");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            const answer = {
                document: DocumentsChosed?.documentstext,
                name: DocumentsChosed?.value,
                files: DocumentsChosed?.document

            }
            setAddDocTodo([...addDocTodo, answer])
        }
        setDocumentsChosed([])
        setDocumentsDisplay("Please Select Documents")
    }

    const addTodoEdit = (e) => {
        const DuplicateData = addDocTodoEdit?.some(data => data.name === DocumentsChosedEdit?.value)
        if (DocumentsDisplayEdit === "Please Select Documents") {
            setPopupContentMalert("Please Select Documents");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (DuplicateData) {
            setPopupContentMalert("Please Select Different Document");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            const answer = {
                document: DocumentsChosedEdit?.documentstext,
                name: DocumentsChosedEdit?.value,
                files: DocumentsChosedEdit?.document

            }
            setAddDocTodoEdit([...addDocTodoEdit, answer])
        }
        setDocumentsChosedEdit([])
        setDocumentsDisplayEdit("Please Select Documents")
    }

    const deleteTodo = (index) => {
        const updatedTodos = [...addDocTodo];
        updatedTodos.splice(index, 1);
        setAddDocTodo(updatedTodos)
    }
    const deleteTodoEdit = (index) => {
        const updatedTodos = [...addDocTodoEdit];
        updatedTodos.splice(index, 1);
        setAddDocTodoEdit(updatedTodos)
    }

    //function to generate hrs
    const generateHrsOptions = () => {
        const hrsOpt = [];
        for (let i = 0; i <= 23; i++) {
            if (i < 10) {
                i = "0" + i;
            }
            hrsOpt.push({ value: i.toString(), label: i.toString() });
        }
        setHrsOption(hrsOpt);
    };
    //function to generate mins
    const generateMinsOptions = () => {
        const minsOpt = [];
        for (let i = 0; i <= 59; i++) {
            if (i < 10) {
                i = "0" + i;
            }
            minsOpt.push({ value: i.toString(), label: i.toString() });
        }
        setMinsOption(minsOpt);
    };

    //get all project.
    const fetchAllApproveds = async () => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document")?.flatMap(item => item?.module)
            const removedDuplicate = [...new Set([...answer])]
            console.log(answer, 'answer')
            setModuleOpt(removedDuplicate.map((data) => ({
                ...data,
                label: data,
                value: data,
            })))
            // setDocumentsList(answer);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchCustomer = async (module) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document" && data.module?.includes(module))?.flatMap(item => item?.customer)
            const removedDuplicate = [...new Set([...answer])]
            setCustomerOptions(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchQueue = async (module, customer) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document" && data.customer?.includes(customer) && data.module?.includes(module))?.flatMap(item => item?.queue)
            const removedDuplicate = [...new Set([...answer])]
            setQueue(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchProcess = async (module, customer, queue) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document" &&
                data.customer?.includes(customer) &&
                data.module?.includes(module) && data.queue?.includes(queue))?.flatMap(item => item?.process)
            const removedDuplicate = [...new Set([...answer])]
            setProcessOpt(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all project.
    const fetchAllDocumentsList = async (module, customer, queue, process) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.post(SERVICE.FILTER_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                module: module,
                customer: customer,
                queue: queue,
                process: process
            });
            console.log(res_queue?.data.document, 'res')
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document" &&
                data.customer?.includes(customer) &&
                data.module?.includes(module) && data.queue?.includes(queue) && data.process?.includes(process)).map(datt => ({
                    ...datt,
                    label: datt?.form + "-" + moment(datt.createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    value: datt?.form + "-" + moment(datt.createdAt).format('DD-MM-YYYY hh:mm:ss a')

                }))
            setDocumentsList(answer);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    useEffect(() => {
        fetchAllApproveds();
        generateHrsOptions();
        generateMinsOptions();
    }, []);

    const fetchCustomerEdit = async (module) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document" && data.module?.includes(module))?.flatMap(item => item?.customer)
            const removedDuplicate = [...new Set([...answer])]
            setCustomerOptionsEdit(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchQueueEdit = async (module, customer) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document" && data.customer?.includes(customer) && data.module?.includes(module))?.flatMap(item => item?.queue)
            const removedDuplicate = [...new Set([...answer])]
            setQueueEdit(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchProcessEdit = async (module, customer, queue) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document" &&
                data.customer?.includes(customer) &&
                data.module?.includes(module) && data.queue?.includes(queue))?.flatMap(item => item?.process)
            const removedDuplicate = [...new Set([...answer])]
            setProcessOptEdit(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all project.
    const fetchAllDocumentsListEdit = async (module, customer, queue, process) => {
        setPageName(!pageName);
        try {
            let res_queue = await axios.post(SERVICE.FILTER_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                module: module,
                customer: customer,
                queue: queue,
                process: process
            });
            console.log(res_queue?.data.document, 'resd')
            const answer = res_queue?.data.document?.filter(data => data.type === "Quickclaim Document" &&
                data.customer?.includes(customer) &&
                data.module?.includes(module) && data.queue?.includes(queue) && data.process?.includes(process)).map(datt => ({
                    ...datt,
                    label: datt?.form + "-" + moment(datt.createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    value: datt?.form + "-" + moment(datt.createdAt).format('DD-MM-YYYY hh:mm:ss a')
                }))
            setDocumentsListEdit(answer);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Training Subcategory.png");
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
    const [searchedString, setSearchedString] = useState("");

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
        setBtnLoad(false)
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
        setIsHandleChange(true);
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            getOverallEditSectionOverallDelete(selectedRows)

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
        category: true,
        subcategoryname: true,
        duration: true,
        customer: true,
        module: true,
        queue: true,
        process: true,
        description: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const fetchTrainingcategory = async () => {
        setPageName(!pageName);
        try {
            let task = await axios.get(SERVICE.TRAININGCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const categoryall = [...task?.data?.trainingcategorys?.map((d) => (
                {
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname
                }
            ))];
            setCategory(categoryall);
            setCategoryEdit(categoryall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchTrainingcategory()
    }, [])

    const [deleteSubcategroy, setDeleteSubcategory] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSubcategory(res?.data?.strainingsubcategory);
            getOverallEditSectionDelete(res?.data?.strainingsubcategory?.subcategoryname)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // Alert delete popup
    let trainingsubcategorysid = deleteSubcategroy?._id;
    const delTrainingSubcategory = async (e) => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${trainingsubcategorysid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchTrainingsubcategory();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1)
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delTrainingSubcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${item}`, {
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
            await fetchTrainingsubcategory();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //add function 
    const sendRequest = async () => {
        setPageName(!pageName);
        setBtnLoad(true)
        try {
            let subprojectscreate = await axios.post(SERVICE.TRAININGSUBCATEGORY_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(trainingsubcategory.category),
                subcategoryname: String(trainingsubcategory.subcategoryname),
                description: String(trainingsubcategory.description),
                duration: trainingsubcategory.duration,
                module: trainingsubcategory.module,
                customer: trainingsubcategory.customer,
                queue: trainingsubcategory.queue,
                process: trainingsubcategory.process,
                documentslist: addDocTodo,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchTrainingsubcategory();
            setTrainingsubcategory({ ...trainingsubcategory, subcategoryname: "", description: "" })
            setBtnLoad(false)
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = trainingsubcategorys.some(item => item.subcategoryname.toLowerCase() === (trainingsubcategory.subcategoryname).toLowerCase() && item.category === String(trainingsubcategory.category));
        if (trainingsubcategory.category === "" || trainingsubcategory.category === "Please Select Category") {
            setPopupContentMalert("Please Select  Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategory?.duration === undefined || trainingsubcategory?.duration === "00:00" || trainingsubcategory?.duration?.includes("Hrs")) {
            setPopupContentMalert("Please Select Duration");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (trainingsubcategory.duration === undefined || minutes === "Mins") {
            setPopupContentMalert("Please Select Mins");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategory.module === "Please Select Module") {
            setPopupContentMalert("Please Select Module");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategory.customer === "Please Select Customer") {
            setPopupContentMalert("Please Select Customer");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategory.queue === "Please Select Queue") {
            setPopupContentMalert("Please Select Queue");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategory.process === "Please Select Process") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (addDocTodo?.length < 1) {
            setPopupContentMalert("Please Add Documents");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategory.subcategoryname === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Name already Exists");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            sendRequest();
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setTrainingsubcategory({
            category: "Please Select Category",
            module: "Please Select Module",
            customer: "Please Select Customer",
            queue: "Please Select Queue",
            process: "Please Select Process",
            subcategoryname: "", description: ""
        })
        setHours("Hrs")
        setMinutes("Mins")
        setAddDocTodo([])
        setProcessOpt([])
        setDocumentsList([])
        setQueue([])
        setCustomerOptions([])
        setDocumentsDisplay("Please Select Documents")
        setDocumentsChosed([])
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
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingsubcategoryEdit(res?.data?.strainingsubcategory);
            const [hourscal, minutescal] = res?.data?.strainingsubcategory?.duration.split(":");
            setHoursEdit(hourscal);
            setMinutesEdit(minutescal);
            setAddDocTodoEdit(res?.data?.strainingsubcategory?.documentslist)
            fetchCustomerEdit(res?.data?.strainingsubcategory?.module)
            fetchQueueEdit(res?.data?.strainingsubcategory?.module, res?.data?.strainingsubcategory?.customer)
            fetchProcessEdit(res?.data?.strainingsubcategory?.module,
                res?.data?.strainingsubcategory?.customer,
                res?.data?.strainingsubcategory?.queue)
            fetchAllDocumentsListEdit(res?.data?.strainingsubcategory?.module,
                res?.data?.strainingsubcategory?.customer,
                res?.data?.strainingsubcategory?.queue,
                res?.data?.strainingsubcategory?.process)
            getOverallEditSection(res?.data?.strainingsubcategory?.subcategoryname)
            setOvcategory(res?.data?.strainingsubcategory?.subcategoryname)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingsubcategoryEdit(res?.data?.strainingsubcategory);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingsubcategoryEdit(res?.data?.strainingsubcategory);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit page...
    let updateby = trainingsubcategoryEdit?.updatedby;
    let addedby = trainingsubcategoryEdit?.addedby;
    let subprojectsid = trainingsubcategoryEdit?._id;

    //overall edit section for all pages
    const getOverallEditSectionOverallDelete = async (ids) => {
        setPageName(!pageName);
        try {

            let res = await axios.post(SERVICE.OVERALL_TRAINING_SUBOVERALL_CATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                id: ids
            });
            setSelectedRows(res?.data?.result);
            setSelectedRowsCount(res?.data?.count)
            setIsDeleteOpencheckbox(true);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //overall edit section for all pages
    const getOverallEditSectionDelete = async (cat) => {
        setPageName(!pageName);
        try {

            let res = await axios.post(SERVICE.OVERALL_TRAINING_SUBCATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                subcategory: cat
            });
            setOvProjCountDelete(res.data.count);
            setGetOverallCountDelete(`This data is linked in 
                ${res.data.trainingUsers.length > 0 ? "Training For Users ," : ""}
            ${res.data.trandetails.length > 0 ? "Training Details ," : ""}
            ${res.data.trandetailslog.length > 0 ? "Training Details Log," : ""}
                 `);

            if (res?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //overall edit section for all pages
    const getOverallEditSection = async (cat) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.OVERALL_TRAINING_SUBCATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                subcategory: cat,
            });
            setOvProjCount(res?.data?.count);
            setGetOverallCount(`This data is linked in 
         ${res?.data?.trainingUsers?.length > 0 ? "Training For Users ," : ""}
     ${res?.data?.trandetails?.length > 0 ? "Training Details ," : ""}
     ${res?.data?.trandetailslog?.length > 0 ? "Training Details Log," : ""}
         whether you want to do changes ..??`);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.OVERALL_TRAINING_SUBCATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                subcategory: ovcategory,
            });
            sendEditRequestOverall(
                res?.data?.trainingUsers,
                res?.data?.trandetails,
                res?.data?.trandetailslog

            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const sendEditRequestOverall = async (trainuser, traindetails, trandetailslog) => {
        try {
            if (trainuser?.length > 0) {
                let answ = trainuser.map((d, i) => {
                    const answer = d?.trainingdocuments?.filter(data => data?.subcategory !== ovcategory)
                    const answerCate = d?.trainingdocuments?.filter(data => data?.subcategory === ovcategory)?.map((item
                    ) => {
                        return { ...item, subcategory: trainingsubcategoryEdit.subcategoryname }
                    })
                    let res = axios.put(`${SERVICE.SINGLE_TRAINING_FOR_USER}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdocuments: [...answer, ...answerCate],
                    });
                });
            }

            if (traindetails?.length > 0) {
                let answ = traindetails.map((d, i) => {
                    const answer = d?.trainingdocuments?.filter(data => data?.subcategory !== ovcategory)
                    const answerCate = d?.trainingdocuments?.filter(data => data?.subcategory === ovcategory)?.map((item
                    ) => {
                        return { ...item, subcategory: trainingsubcategoryEdit.subcategoryname }
                    })

                    let res = axios.put(`${SERVICE.SINGLE_TRAININGDETAILS}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdocuments: [...answer, ...answerCate],
                    });
                });
            }
            if (trandetailslog?.length > 0) {
                let answ = trandetailslog.map((d, i) => {
                    const answer = d?.trainingdetailslog?.filter(data => data?.subcategory !== ovcategory)
                    const answerCate = d?.trainingdetailslog?.filter(data => data?.subcategory === ovcategory)?.map((item
                    ) => {
                        return { ...item, subcategory: trainingsubcategoryEdit.subcategoryname }
                    })

                    let res = axios.put(`${SERVICE.SINGLE_TRAININGDETAILS}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdetailslog: [...answer, ...answerCate],
                    });
                });
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(trainingsubcategoryEdit.category),
                subcategoryname: String(trainingsubcategoryEdit.subcategoryname),
                description: String(trainingsubcategoryEdit.description),
                duration: trainingsubcategoryEdit.duration,
                module: trainingsubcategoryEdit.module,
                customer: trainingsubcategoryEdit.customer,
                queue: trainingsubcategoryEdit.queue,
                process: trainingsubcategoryEdit.process,
                documentslist: addDocTodoEdit,
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTrainingsubcategory();
            await getOverallEditSectionUpdate();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { console.log(err, 'err'); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const editSubmit = (e) => {
        e.preventDefault();
        fetchTrainingsubcategoryAll();
        const isNameMatch = allTrainingsubcategoryedit.some(item => item.subcategoryname.toLowerCase() === (trainingsubcategoryEdit.subcategoryname).toLowerCase() && item.category === String(trainingsubcategoryEdit.category));
        if (trainingsubcategoryEdit.category === "" || trainingsubcategoryEdit.category === "Please Select Category") {
            setPopupContentMalert("Please Select  Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategoryEdit.subcategoryname === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategoryEdit?.duration === undefined || trainingsubcategoryEdit?.duration === "00:00" || trainingsubcategoryEdit?.duration?.includes("Hrs")) {
            setPopupContentMalert("Please Select Duration");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (trainingsubcategoryEdit.duration === undefined || minutesEdit === "Mins") {
            setPopupContentMalert("Please Select Mins");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategoryEdit.module === "Please Select Module") {
            setPopupContentMalert("Please Select Module");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategoryEdit.customer === "Please Select Customer") {
            setPopupContentMalert("Please Select Customer");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategoryEdit.queue === "Please Select Queue") {
            setPopupContentMalert("Please Select Queue");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategoryEdit.process === "Please Select Process") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (addDocTodoEdit?.length < 1) {
            setPopupContentMalert("Please Add Documents");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingsubcategoryEdit.subcategoryname != ovcategory && ovProjCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
                </>
            );
            handleClickOpenerrpop();
        }

        else if (isNameMatch) {
            setPopupContentMalert("Name already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }

    //get all Sub vendormasters.
    const fetchTrainingsubcategory = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.FILTERTRAININGSUBCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setTrainingsubcategorys(res_vendor?.data?.trainingsubcategorys.map((item, index) => ({ ...item, serialNumber: index + 1 })));
            setTasksubcategorycheck(true)
        } catch (err) { setTasksubcategorycheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //get all Sub vendormasters.
    const fetchTrainingsubcategoryAll = async () => {
        setPageName(!pageName);
        try {
            let res_meet = await axios.get(SERVICE.FILTERTRAININGSUBCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllTrainingsubcategoryedit(res_meet?.data?.trainingsubcategorys.filter(item => item._id !== trainingsubcategoryEdit._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Training Subcategory',
        pageStyle: 'print'
    });

    useEffect(() => {
        fetchTrainingsubcategory();
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
        addSerialNumber(trainingsubcategorys);
    }, [trainingsubcategorys])

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

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "category", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header", pinned: "left",
            lockPinned: true,
        },
        { field: "subcategoryname", headerName: "Subcategory Name", flex: 0, width: 150, hide: !columnVisibility.subcategoryname, headerClassName: "bold-header" },
        { field: "duration", headerName: "Duration", flex: 0, width: 150, hide: !columnVisibility.subcategoryname, headerClassName: "bold-header" },
        { field: "module", headerName: "Module", flex: 0, width: 150, hide: !columnVisibility.module, headerClassName: "bold-header" },
        { field: "customer", headerName: "Customer", flex: 0, width: 150, hide: !columnVisibility.customer, headerClassName: "bold-header" },
        { field: "queue", headerName: "Queue", flex: 0, width: 150, hide: !columnVisibility.queue, headerClassName: "bold-header" },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibility.process, headerClassName: "bold-header" },
        { field: "description", headerName: "Description", flex: 0, width: 250, hide: !columnVisibility.description, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("etrainingsubcategory") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {

                            getCode(params.data.id, params.data.name);
                        }}><EditOutlinedIcon sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dtrainingsubcategory") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.data.id, params.data.name) }}>
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vtrainingsubcategory") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("itrainingsubcategory") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
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
            category: item.category,
            subcategoryname: item.subcategoryname,
            duration: item.duration,
            module: item.module,
            customer: item.customer,
            queue: item.queue,
            process: item.process,
            description: item.description,
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
    return (
        <Box>
            <Headtitle title={'Training Subcategory'} />
            <PageHeading
                title="Training Subcategory"
                modulename="Training"
                submodulename="Training Subcategory"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("atrainingsubcategory")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Training Subcategory</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth >
                                            <Typography>Category <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={category}
                                                styles={colourStyles}
                                                value={{ label: trainingsubcategory.category, value: trainingsubcategory.category }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({ ...trainingsubcategory, category: e.value });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Duration<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item md={6} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={hrsOption}
                                                        placeholder="Hrs"
                                                        value={{ label: hours, value: hours }}
                                                        onChange={(e) => {
                                                            setHours(e.value);
                                                            setTrainingsubcategory({ ...trainingsubcategory, duration: `${e.value}:${minutes}` });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid item md={6} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={minsOption}
                                                        placeholder="Mins"
                                                        value={{ label: minutes, value: minutes }}
                                                        onChange={(e) => {
                                                            setMinutes(e.value);
                                                            setTrainingsubcategory({ ...trainingsubcategory, duration: `${hours}:${e.value}` });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Module<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={moduleOpt}
                                                placeholder="Please Select Module"
                                                value={{ label: trainingsubcategory.module, value: trainingsubcategory.module }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({
                                                        ...trainingsubcategory, module: e.value,
                                                        customer: "Please Select Customer",
                                                        queue: "Please Select Queue",
                                                        process: "Please Select Process",

                                                    });
                                                    setDocumentsDisplay("Please Select Documents")
                                                    setDocumentsChosed([])
                                                    setQueue([])
                                                    setProcessOpt([])
                                                    fetchCustomer(e.value)
                                                    setDocumentsList([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Customer<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={customeropt}
                                                placeholder="Please Select Customer"
                                                value={{ label: trainingsubcategory.customer, value: trainingsubcategory.customer }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({
                                                        ...trainingsubcategory, customer: e.value,
                                                        queue: "Please Select Queue",
                                                        process: "Please Select Process",
                                                    });
                                                    setDocumentsDisplay("Please Select Documents")
                                                    setDocumentsChosed([])
                                                    setProcessOpt([])
                                                    setDocumentsList([])
                                                    fetchQueue(trainingsubcategory.module, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={queueopt}
                                                placeholder="Please Select Queue"
                                                value={{ label: trainingsubcategory.queue, value: trainingsubcategory.queue }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({
                                                        ...trainingsubcategory, queue: e.value,
                                                        process: "Please Select Process",
                                                    });
                                                    setDocumentsDisplay("Please Select Documents")
                                                    setDocumentsChosed([])
                                                    setDocumentsList([])
                                                    fetchProcess(trainingsubcategory.module, trainingsubcategory.customer, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Process<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={processOpt}
                                                placeholder="Please Select Process"
                                                value={{ label: trainingsubcategory.process, value: trainingsubcategory.process }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({
                                                        ...trainingsubcategory, process: e.value
                                                    });
                                                    setDocumentsDisplay("Please Select Documents")
                                                    setDocumentsChosed([])
                                                    fetchAllDocumentsList(trainingsubcategory.module, trainingsubcategory.customer, trainingsubcategory.queue, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Documents<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={documentsList}
                                                placeholder="Please Select Documents"
                                                value={{ label: DocumentsDisplay, value: DocumentsDisplay }}
                                                onChange={(e) => {
                                                    setDocumentsChosed(e)
                                                    setDocumentsDisplay(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={addTodo}
                                            type="button"
                                            sx={{
                                                height: "30px",
                                                minWidth: "30px",
                                                marginTop: "28px",
                                                padding: "6px 10px",
                                            }}
                                        >
                                            <FaPlus />
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"
                                                value={trainingsubcategory.subcategoryname}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({ ...trainingsubcategory, subcategoryname: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={trainingsubcategory.description}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({ ...trainingsubcategory, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Documents List<b style={{ color: "red" }}>*</b>
                                        </Typography>  <br />
                                        {addDocTodo?.length > 0 &&
                                            addDocTodo?.map((data, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={9} xs={12} sm={6}>
                                                            <Typography>{data.name}</Typography>
                                                        </Grid>
                                                        <Grid item md={2} xs={12} sm={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                type="button"
                                                                sx={{
                                                                    height: "25px",
                                                                    minWidth: "30px",
                                                                    padding: "6px 10px",
                                                                }}
                                                                onClick={() => {
                                                                    deleteTodo(index);
                                                                }}
                                                            >
                                                                <AiOutlineClose />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>

                                                </>))}
                                    </Grid>

                                    <Grid item md={4} xs={12} sm={6} marginTop={5}>
                                        <Grid container spacing={2}>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <LoadingButton loading={btnLoad} variant='contained' sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>Submit</LoadingButton>

                                            </Grid>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
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
                    maxWidth="lg"
                    sx={{ marginTop: "47px" }}
                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Training Subcategory</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth >
                                            <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={categoryEdit}
                                                styles={colourStyles}
                                                value={{ label: trainingsubcategoryEdit.category, value: trainingsubcategoryEdit.category }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, category: e.value });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Duration<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item md={6} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={hrsOption}
                                                        placeholder="Hrs"
                                                        value={{ label: hoursEdit, value: hoursEdit }}
                                                        onChange={(e) => {
                                                            setHoursEdit(e.value);
                                                            setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, duration: `${e.value}:${minutesEdit}` });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={minsOption}
                                                        placeholder="Mins"
                                                        value={{ label: minutesEdit, value: minutesEdit }}
                                                        onChange={(e) => {
                                                            setMinutesEdit(e.value);
                                                            setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, duration: `${hoursEdit}:${e.value}` });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Module<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={moduleOpt}
                                                placeholder="Please Select Module"
                                                value={{ label: trainingsubcategoryEdit.module, value: trainingsubcategoryEdit.module }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({
                                                        ...trainingsubcategoryEdit, module: e.value,
                                                        customer: "Please Select Customer",
                                                        queue: "Please Select Queue",
                                                        process: "Please Select Process",


                                                    });
                                                    setDocumentsDisplayEdit("Please Select Documents")
                                                    setDocumentsChosedEdit([])
                                                    setDocumentsListEdit([])
                                                    setQueueEdit([])
                                                    setProcessOptEdit([])
                                                    fetchCustomerEdit(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Customer<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={customeroptEdit}
                                                placeholder="Please Select Customer"
                                                value={{ label: trainingsubcategoryEdit.customer, value: trainingsubcategoryEdit.customer }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({
                                                        ...trainingsubcategoryEdit, customer: e.value,
                                                        queue: "Please Select Queue",
                                                        process: "Please Select Process",
                                                    });
                                                    setDocumentsDisplayEdit("Please Select Documents")
                                                    setDocumentsChosedEdit([])
                                                    setDocumentsListEdit([])
                                                    setProcessOptEdit([])
                                                    fetchQueueEdit(trainingsubcategoryEdit.module, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={queueoptEdit}
                                                placeholder="Please Select Queue"
                                                value={{ label: trainingsubcategoryEdit.queue, value: trainingsubcategory.queue }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({
                                                        ...trainingsubcategoryEdit, queue: e.value,
                                                        process: "Please Select Process",
                                                    });
                                                    setDocumentsDisplayEdit("Please Select Documents")
                                                    setDocumentsChosedEdit([])
                                                    setDocumentsListEdit([])
                                                    fetchProcessEdit(trainingsubcategoryEdit.module, trainingsubcategoryEdit.customer, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Process<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={processOptEdit}
                                                placeholder="Please Select Process"
                                                value={{ label: trainingsubcategoryEdit.process, value: trainingsubcategoryEdit.process }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({
                                                        ...trainingsubcategoryEdit, process: e.value
                                                    });
                                                    setDocumentsDisplayEdit("Please Select Documents")
                                                    setDocumentsChosedEdit([])
                                                    fetchAllDocumentsListEdit(trainingsubcategoryEdit.module, trainingsubcategoryEdit.customer, trainingsubcategoryEdit.queue, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Documents<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={documentsListEdit}
                                                placeholder="Please Select Documents"
                                                value={{ label: DocumentsDisplayEdit, value: DocumentsDisplayEdit }}
                                                onChange={(e) => {
                                                    setDocumentsChosedEdit(e)
                                                    setDocumentsDisplayEdit(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={addTodoEdit}
                                            type="button"
                                            sx={{
                                                height: "30px",
                                                minWidth: "30px",
                                                marginTop: "28px",
                                                padding: "6px 10px",
                                            }}
                                        >
                                            <FaPlus />
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"
                                                value={trainingsubcategoryEdit.subcategoryname}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, subcategoryname: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={trainingsubcategoryEdit.description}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Documents List<b style={{ color: "red" }}>*</b>
                                        </Typography>  <br />
                                        {addDocTodoEdit?.length > 0 &&
                                            addDocTodoEdit?.map((data, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={10} xs={12} sm={6}>
                                                            <Typography>{data.name}</Typography>
                                                        </Grid>
                                                        <Grid item md={2} xs={12} sm={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                type="button"
                                                                sx={{
                                                                    height: "25px",
                                                                    minWidth: "30px",
                                                                    padding: "6px 10px",
                                                                }}
                                                                onClick={() => {
                                                                    deleteTodoEdit(index);
                                                                }}
                                                            >
                                                                <AiOutlineClose />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>

                                                </>))}
                                    </Grid>
                                </Grid>
                                <br />
                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} type="submit">Update</Button>
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
            {isUserRoleCompare?.includes("ltrainingsubcategory") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Training Subcategory List</Typography>
                        </Grid>

                        <br />

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
                                        <MenuItem value={(trainingsubcategorys?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("exceltrainingsubcategory") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvtrainingsubcategory") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printtrainingsubcategory") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdftrainingsubcategory") && (

                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}  ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagetrainingsubcategory") && (
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
                                    maindatas={trainingsubcategorys}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={trainingsubcategorys}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdtrainingsubcategory") && (
                            <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}

                        <br />
                        {!tasksubcategoryCheck ?
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
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }}
                                >
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
                                            itemsList={trainingsubcategorys}
                                        />
                                    </>

                                </Box>

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
                sx={{ marginTop: "47px" }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Training Subcategory</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{trainingsubcategoryEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{trainingsubcategoryEdit.subcategoryname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Duration</Typography>
                                    <Typography>{trainingsubcategoryEdit.duration}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Module</Typography>
                                    <Typography>{trainingsubcategoryEdit.module}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Customer</Typography>
                                    <Typography>{trainingsubcategoryEdit.customer}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{trainingsubcategoryEdit.queue}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Process</Typography>
                                    <Typography>{trainingsubcategoryEdit.process}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{trainingsubcategoryEdit.description}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Documents</Typography>
                                    <Typography>{trainingsubcategoryEdit?.documentslist?.map((t, i) => `${i + 1 + ". "}` + t.name).toString()}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}> Back </Button>
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
                        <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }} sx={buttonStyles.buttonsubmit}
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
                            sx={buttonStyles.btncancel}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Check delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent
                                sx={{
                                    width: "350px",
                                    textAlign: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    {getOverAllCountDelete}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error" sx={buttonStyles.buttonsubmit}>
                                    {" "}
                                    OK{" "}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
            </Box>
            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        {selectedRowsCount > 0 ?
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Some of the Data's are Linked in other pages. Do You want to Delete the Remaining.?</Typography>
                            :
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>This Data is Linked in Some pages</Typography>

                        }
                    </DialogContent>
                    <DialogActions>
                        {selectedRowsCount > 0 ?
                            <>
                                <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Cancel</Button>
                                <Button variant="contained" color='error' sx={buttonStyles.buttonsubmit}
                                    onClick={(e) => delTrainingSubcheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Ok</Button>
                        }
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error' sx={buttonStyles.buttonsubmit}
                            onClick={handleCloseModalert}
                        > OK </Button>
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
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" sx={buttonStyles.buttonsubmit} onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
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
                itemsTwo={trainingsubcategorys ?? []}
                filename={"Training Subcategory"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Training Subcategory Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delTrainingSubcategory}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
            <br />
        </Box>
    );
}


export default TrainingSubcategory;