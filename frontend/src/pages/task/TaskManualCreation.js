import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    TableRow,
    TableCell,
    TextareaAutosize,
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
import { handleApiError } from "../../components/Errorhandling";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { userStyle } from "../../pageStyle";
import StyledDataGrid from "../../components/TableStyle";
import { FaPrint, FaFilePdf, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';


function TaskManualCreation() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
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
        'Employee Name',
        'Task Name',
        'Date',
        'Time',
        'Status',
        'Description'
    ];
    let exportRowValues = [
        'username',
        'taskname',
        'taskdate',
        'tasktime',
        'taskstatus',
        'description'
    ];


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
            pagename: String("Task/Task Manual Creation"),
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
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [taskGrouping, setTaskGrouping] = useState({
        taskname: "",
        taskdate: "",
        tasktime: "",
        taskstatus: "Please Select Status",
        description: ""
    });
    const [taskGroupingEdit, setTaskGroupingEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        schedule: "Please Select Schedule",
        frequency: "Please Select Frequency",
        duration: "00:10",
        breakupcount: "1",
        hour: "",
        min: "",
        timetype: "",
        monthdate: "",
        date: "",
        annumonth: "",
        annuday: ""
    });

    const [taskGroupingArray, setTaskGroupingArray] = useState([]);
    const [TaskGroupingItemsList, setTaskGroupingItemsList] = useState([]);
    const [taskGroupingArrayEdit, setTaskGroupingArrayEdit] = useState([]);
    const [documentFiles, setdocumentFiles] = useState([]);
    const [documentFilesEdit, setdocumentFilesEdit] = useState([]);
    const [btnLoad, setBtnLoad] = useState(false)














    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    const { isUserRoleCompare, isUserRoleAccess, pageName,
        setPageName,
        buttonStyles, } = useContext(
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
    const [deleteTaskGrouping, setDeleteTaskGrouping] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        taskname: true,
        username: true,
        taskdetails: true,
        taskstatus: true,
        taskdate: true,
        tasktime: true,
        description: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    useEffect(() => {
        addSerialNumber(TaskGroupingItemsList);
    }, [TaskGroupingItemsList]);


    useEffect(() => {
        fetchTaskGroupingAll();
    }, [isEditOpen]);
    useEffect(() => {
        fetchTaskGrouping();
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
        setBtnLoad(false)
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
    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
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
        setIsHandleChange(true);
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

    const handleResumeUpload = (event) => {
        const resume = event.target.files;

        const reader = new FileReader();
        const file = resume[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            setdocumentFiles([...documentFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "Document file" }]);
        };

    };

    //Rendering File
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleResumeUploadEdit = (event) => {
        const resume = event.target.files;

        const reader = new FileReader();
        const file = resume[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            setdocumentFilesEdit([...documentFilesEdit, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "Document file" }]);
        };

    };

    //Rendering File
    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDeleteEdit = (index) => {
        setdocumentFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };




    //set function to get particular row
    const rowData = async (id) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASKFORUSER}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteTaskGrouping(res?.data?.staskforuser);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // Alert delete popup
    let proid = deleteTaskGrouping._id;
    const delProcess = async () => {
        setPageName(!pageName);
        try {
            const idDelete = await axios.delete(`${SERVICE.SINGLE_TASKFORUSER}/${proid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchTaskGrouping();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { console.log(err, 'err'); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    //add function
    const sendRequest = async () => {
        setBtnLoad(true)

        setPageName(!pageName);
        try {
            let brandCreate = await axios.post(SERVICE.CREATE_TASKFORUSER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess?.companyname,
                taskname: taskGrouping.taskname,
                taskdate: taskGrouping.taskdate,
                tasktime: taskGrouping.tasktime,
                taskstatus: taskGrouping.taskstatus,
                taskdetails: "Manual",
                description: taskGrouping.description,
                files: documentFiles,
                taskassigneddate: moment(taskGrouping.taskdate).format("DD-MM-YYYY"),
                formattedDate: new Date(taskGrouping.taskdate),

                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setTaskGrouping(brandCreate.data);
            setdocumentFiles([])
            setSearchQuery("")
            await fetchTaskGrouping();
            setTaskGrouping({
                ...taskGrouping, taskname: "",
                taskdate: "",
                tasktime: "",
                taskstatus: "Please Select Status",
                description: ""
            })
            setPopupContent('Added Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBtnLoad(false)
        }
        catch (err) {
            setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = taskGroupingArray?.some(
            (item) => {
                return item.taskname?.toLowerCase() === taskGrouping.taskname?.toLowerCase() &&
                    item.taskdate === taskGrouping.taskdate
            }
        )

        if (taskGrouping.taskname === "" || taskGrouping?.taskname === undefined) {
            setPopupContentMalert('Please Enter Task Name');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (taskGrouping.taskdate === "" || taskGrouping.taskdate === undefined) {
            setPopupContentMalert('Please Select Date');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.tasktime === "" || taskGrouping.tasktime === undefined) {
            setPopupContentMalert('Please Select Time');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.taskstatus === "Please Select Status" || taskGrouping.taskstatus === undefined || taskGrouping.taskstatus === "") {
            setPopupContentMalert('Please Select Status');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGrouping.description === "" || taskGrouping.description === undefined) {
            setPopupContentMalert('Please Enter Description');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((taskGrouping.taskstatus === "Completed") && documentFiles?.length < 1) {
            setPopupContentMalert('Please Upload Documents');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (isNameMatch) {
            setPopupContentMalert('Task Manual Creation already exists!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest()

        }
    };

    const backPage = useNavigate();
    const HandleCancel = () => {
        backPage("/task/taskforuser");
    }
    const handleclear = (e) => {
        e.preventDefault();
        setTaskGrouping({
            taskname: "",
            taskdate: "",
            tasktime: "",
            taskstatus: "Please Select Status",
            description: ""
        });
        setdocumentFiles([])
        setPopupContent('Cleared Successfully');
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
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASKFORUSER}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskGroupingEdit(res?.data?.staskforuser);
            setdocumentFilesEdit(res?.data?.staskforuser?.files)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....

    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASKFORUSER}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskGroupingEdit(res?.data?.staskforuser);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....

    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TASKFORUSER}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskGroupingEdit(res?.data?.staskforuser);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    let updateby = taskGroupingEdit.updatedby;
    let addedby = taskGroupingEdit.addedby;
    let taskgroupingId = taskGroupingEdit._id;

    //editing the single data...

    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_TASKFORUSER}/${taskgroupingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    username: taskGroupingEdit?.username,
                    category: String(taskGroupingEdit.category),
                    taskname: taskGroupingEdit.taskname,
                    taskdate: taskGroupingEdit.taskdate,
                    tasktime: taskGroupingEdit.tasktime,
                    taskstatus: taskGroupingEdit.taskstatus,
                    taskdetails: "Manual",
                    files: documentFilesEdit,
                    description: taskGroupingEdit.description,
                    taskassigneddate: moment(taskGroupingEdit.taskdate).format("DD-MM-YYYY"),
                    formattedDate: new Date(taskGroupingEdit.taskdate),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchTaskGrouping();
            await fetchTaskGroupingAll();
            handleCloseModEdit();
            setPopupContent('Updated Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const editSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = taskGroupingArrayEdit?.some(
            (item) => {
                return item.taskname?.toLowerCase() === taskGroupingEdit.taskname?.toLowerCase() &&
                    item.taskdate === taskGroupingEdit.taskdate
            }
        )


        if (taskGroupingEdit.taskname === "" || taskGroupingEdit?.taskname === undefined) {
            setPopupContentMalert('Please Enter Task Name');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.taskdate === "" || taskGroupingEdit.taskdate === undefined) {
            setPopupContentMalert('Please Select Date');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.tasktime === "" || taskGroupingEdit.tasktime === undefined) {
            setPopupContentMalert('Please Select Time');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.taskstatus === "Please Select Status" || taskGroupingEdit.taskstatus === undefined || taskGroupingEdit.taskstatus === "") {
            setPopupContentMalert('Please Select Status');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (taskGroupingEdit.description === "" || taskGroupingEdit.description === undefined) {
            setPopupContentMalert('Please Enter Description');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((taskGroupingEdit.taskstatus === "Completed") && documentFilesEdit?.length < 1) {
            setPopupContentMalert('Please Upload Documents');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (isNameMatch) {
            setPopupContentMalert('Task Manual Creation already exists!');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };

    //get all Task Schedule Grouping.

    const fetchTaskGrouping = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALLMANUALALL_TASKFORUSER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const answer = isUserRoleAccess?.role?.includes("Manager") ?
                res_freq?.data?.taskforuser?.filter(data => data.taskdetails === "Manual")
                : res_freq?.data?.taskforuser?.filter(data => data.taskdetails === "Manual" && data?.username === isUserRoleAccess?.companyname)

            const finalList = answer?.length > 0 ? answer?.map((item, index) => ({
                // ...item,
                serialNumber: index + 1,
                id: item._id,
                username: item.username,
                taskname: item.taskname,
                taskdate: moment(item.taskdate).format("DD-MM-YYYY"),
                tasktime: item.tasktime,
                taskdetails: item.taskdetails,
                taskstatus: item.taskstatus,
                description: item.description,

            })) : []
            setTaskGroupingItemsList(finalList)
            setTaskGroupingArray(res_freq?.data?.taskforuser?.filter(data => data.taskdetails === "Manual"));
            setLoader(true);
        }
        catch (err) {
            setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const bulkdeletefunction = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_TASKFORUSER}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(true);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchTaskGrouping();
            setPopupContent('Deleted Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    //get all Task Schedule Grouping.

    const fetchTaskGroupingAll = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALLMANUALALL_TASKFORUSER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTaskGroupingArrayEdit(
                res_freq?.data?.taskforuser?.filter(
                    (item) => item._id !== taskGroupingEdit._id && item.taskdetails === 'Manual'
                ));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Task Manual Creation.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // Excel
    const fileName = "TaskManualCreation";
    // get particular columns for export excel


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Task Manual Creation",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (data) => {
        setItems(data);
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
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },



        {
            field: "username",
            headerName: "Username",
            flex: 0,
            width: 150,
            hide: !columnVisibility.username,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "taskname",
            headerName: "Task Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskname,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "taskdate",
            headerName: "Task Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskdate,
            headerClassName: "bold-header",
        },
        {
            field: "tasktime",
            headerName: "Task Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.tasktime,
            headerClassName: "bold-header",
        },
        {
            field: "taskstatus",
            headerName: "Task Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskstatus,
            headerClassName: "bold-header",
        },
        {
            field: "taskdetails",
            headerName: "Task Details",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskdetails,
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
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
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
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("etaskmanualcreation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dtaskmanualcreation") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vtaskmanualcreation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("itaskmanualcreation") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
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
            username: item.username,
            taskname: item.taskname,
            taskdate: item.taskdate,
            tasktime: item.tasktime,
            taskdetails: item.taskdetails,
            taskstatus: item.taskstatus,
            description: item.description,
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




    return (
        <Box>
            <Headtitle title={"TASK MANUAL CREATION"} />
            {/* ****** Header Content ****** */}

            <PageHeading
                title="Task Manual Creation"
                modulename="Task"
                submodulename="Task Manual Creation"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("ataskmanualcreation") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                                        Add Task Manual Creation
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                sx={userStyle.input}
                                                placeholder="Please Enter Task Name"
                                                value={isUserRoleAccess?.companyname}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Task Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Task Name"
                                            value={taskGrouping.taskname}
                                            onChange={(e) => {
                                                setTaskGrouping({
                                                    ...taskGrouping,
                                                    taskname: e.target.value,

                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="Date"
                                                value={taskGrouping.taskdate}
                                                onChange={(e) => {
                                                    setTaskGrouping({
                                                        ...taskGrouping,
                                                        taskdate: e.target.value,
                                                    });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Time<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="Time"
                                                value={taskGrouping.tasktime}
                                                onChange={(e) => {
                                                    setTaskGrouping({
                                                        ...taskGrouping,
                                                        tasktime: e.target.value,
                                                    });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>



                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={[{ label: "Progress", value: "Progress" }, { label: "Pending", value: "Pending" }, { label: "Completed", value: "Completed" }]}
                                            value={{ label: taskGrouping.taskstatus, value: taskGrouping.taskstatus }}
                                            onChange={(e) => {
                                                setTaskGrouping({ ...taskGrouping, taskstatus: e.value });
                                                setdocumentFiles([])
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description<b style={{ color: "red" }}>*</b></Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={taskGrouping.description}
                                                onChange={(e) => {
                                                    setTaskGrouping({ ...taskGrouping, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            </Grid>
                            {taskGrouping.taskstatus === "Completed" &&
                                <Grid item md={12} sm={12} xs={12}>
                                    <br /> <br />
                                    <Typography variant="h6">Upload Document<b style={{ color: "red" }}>*</b></Typography>
                                    <Grid marginTop={2}>
                                        <Button variant="contained" size="small" component="label" sx={{ ...buttonStyles?.buttonsubmit, "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                            Upload
                                            <input
                                                type="file"
                                                id="resume"
                                                accept=".xlsx, .xls, .csv, .pdf, .txt, .jpg , .jpeg , .png"
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
                                                        <Grid item lg={3} md={3} sm={6} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                        </Grid>
                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                            <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>
                                </Grid>}

                            <Grid item md={12} sm={12} xs={12}>
                                <br />
                                <br />
                                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                    <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnLoad} variant='contained' color='primary' onClick={handleSubmit} >Submit</LoadingButton>

                                    <Button sx={buttonStyles.btncancel}
                                        onClick={handleclear}
                                    >
                                        {" "}
                                        CLEAR
                                    </Button>
                                    <Button sx={buttonStyles.btncancel}
                                        onClick={() => HandleCancel()}
                                    >
                                        {" "}
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                )}
            </>
            <br />   <br />
            {/* ****** Table Start ****** */}
            {!loader ?
                <Box sx={userStyle.container}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box> :
                <>
                    {isUserRoleCompare?.includes("ltaskmanualcreation") && (
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    Task Manual Creation List
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
                                            <MenuItem value={TaskGroupingItemsList?.length}>
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
                                        {isUserRoleCompare?.includes("exceltaskmanualcreation") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvtaskmanualcreation") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printtaskmanualcreation") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftaskmanualcreation") && (

                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagetaskmanualcreation") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon
                                                    sx={{ fontSize: "15px" }}
                                                /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={TaskGroupingItemsList}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={items}
                                    />
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
                            {isUserRoleCompare?.includes("bdtaskmanualcreation") && (
                                <Button sx={buttonStyles.buttonbulkdelete} variant="contained" color="error" onClick={handleClickOpenalert}>
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
                                    // totalDatas={totalProjects}
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={items}

                                />
                            </Box>

                            {/* ****** Table End ****** */}
                        </Box>
                    )}
                </>}
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
                        sx={buttonStyles.btncancel}

                    >
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        sx={buttonStyles.buttonsubmit}
                        variant="contained"
                        color="error"
                        onClick={(e) => delProcess(proid)}
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
                maxWidth="lg"
                fullWidth={true}
                sx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Task Manual Creation
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{taskGroupingEdit.username}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Task Name</Typography>
                                    <Typography>{taskGroupingEdit.taskname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Date</Typography>
                                    <Typography>{moment(taskGroupingEdit.taskdate).format("DD-MM-YYYY")
                                    }</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Time</Typography>
                                    <Typography>{taskGroupingEdit.tasktime}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">status</Typography>
                                    <Typography>{taskGroupingEdit.taskstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Description</Typography>
                                    <Typography>{taskGroupingEdit.description}</Typography>
                                </FormControl>
                            </Grid>

                            {taskGroupingEdit.taskstatus === "Completed" &&
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Documents</Typography>
                                        {taskGroupingEdit.files?.length > 0 &&
                                            taskGroupingEdit.files?.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item lg={3} md={3} sm={6} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </FormControl>
                                </Grid>}
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                sx={buttonStyles.btncancel}
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
            {/* Bulk delete ALERT DIALOG */}
            <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        Please Select any Row
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>

            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color="error"
                            onClick={(e) => bulkdeletefunction(e)}
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
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        overflow: 'Auto',
                        '& .MuiPaper-root': {
                            overflow: 'Auto',
                        },
                        marginTop: "80px"
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Task Manual Creation
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                sx={userStyle.input}
                                                placeholder="Please Enter Task Name"
                                                value={taskGroupingEdit?.username}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Task Name<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                sx={userStyle.input}
                                                placeholder="Please Enter Task Name"
                                                value={taskGroupingEdit.taskname}
                                                onChange={(e) => {
                                                    setTaskGroupingEdit({
                                                        ...taskGroupingEdit,
                                                        taskname: e.target.value,

                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="Date"
                                                value={taskGroupingEdit.taskdate}
                                                onChange={(e) => {
                                                    setTaskGroupingEdit({
                                                        ...taskGroupingEdit,
                                                        taskdate: e.target.value,
                                                    });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Time<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="Time"
                                                value={taskGroupingEdit.tasktime}
                                                onChange={(e) => {
                                                    setTaskGroupingEdit({
                                                        ...taskGroupingEdit,
                                                        tasktime: e.target.value,
                                                    });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>



                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={[{ label: "Progress", value: "Progress" }, { label: "Pending", value: "Pending" }, { label: "Completed", value: "Completed" }]}
                                            value={{ label: taskGroupingEdit.taskstatus, value: taskGroupingEdit.taskstatus }}
                                            onChange={(e) => {
                                                setTaskGroupingEdit({ ...taskGroupingEdit, taskstatus: e.value });
                                                setdocumentFilesEdit([])
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description<b style={{ color: "red" }}>*</b></Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={taskGroupingEdit.description}
                                                onChange={(e) => {
                                                    setTaskGroupingEdit({ ...taskGroupingEdit, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            </Grid>
                            {taskGroupingEdit.taskstatus === "Completed" &&
                                <Grid item md={12} sm={12} xs={12}>
                                    <br /> <br />
                                    <Typography variant="h6">Upload Document<b style={{ color: "red" }}>*</b></Typography>
                                    <Grid marginTop={2}>
                                        <Button variant="contained" size="small" component="label" sx={{ ...buttonStyles?.buttonsubmit, "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                            Upload
                                            <input
                                                type="file"
                                                id="resume"
                                                accept=".xlsx, .xls, .csv, .pdf, .txt, .jpg , .jpeg , .png"
                                                name="file"
                                                hidden
                                                onChange={(e) => {
                                                    handleResumeUploadEdit(e);
                                                }}
                                            />
                                        </Button>
                                        <br />
                                        <br />
                                        {documentFilesEdit?.length > 0 &&
                                            documentFilesEdit?.map((file, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item lg={3} md={3} sm={6} xs={6}>
                                                            <Typography>{file.name}</Typography>
                                                        </Grid>
                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                                                        </Grid>
                                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                                            <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteEdit(index)}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ))}
                                    </Grid>
                                </Grid>}

                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={editSubmit}>
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
                itemsTwo={TaskGroupingItemsList ?? []}
                filename={"Task Manual Creation"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Task Manual Creation Info"
                addedby={addedby}
                updateby={updateby}
            />
        </Box>
    );
}

export default TaskManualCreation;