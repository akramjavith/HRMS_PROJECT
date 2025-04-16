import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, TextareaAutosize } from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext.js";
import { AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { saveAs } from "file-saver";
import { colourStyles } from "../../../pageStyle.js";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../../components/Pagination.js';
import AlertDialog from "../../../components/Alert.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
function ManageShortageMaster() {
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
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    //state to handle holiday values
    const [manageshortagemaster, setManageshortagemaster] = useState({
        department: "Please Select Department",
        from: "",
        to: "",
        amount: "",
    });
    const [manageshortagemasterEdit, setManageshortagemasterEdit] = useState({
        department: "Please Select Department",
        from: "",
        to: "",
        amount: "",
    });
    const [departmentOpt, setDepartmentopt] = useState([]);
    const [departmentOptEdit, setDepartmentoptEdit] = useState([]);
    const [manageshortagemasters, setManageshortagemasters] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [statusCheck, setStatusCheck] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteHoliday, setDeleteHoliday] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allManageshortagemasterEdit, setAllManageshortagemasterEdit] = useState([]);
    const fetchDepartmentDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const deptall = [
                ...res_category?.data?.departmentdetails.map((d) => ({
                    ...d,
                    label: d.deptname,
                    value: d.deptname,
                })),
            ];
            setDepartmentopt(deptall);
            setDepartmentoptEdit(deptall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => {
        fetchDepartmentDropdowns();
    }, []);
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        department: true,
        experienceinmonth: true,
        amount: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [isAddOpenalert, setIsAddOpenalert] = useState(false);
    const [isUpdateOpenalert, setIsUpdateOpenalert] = useState(false);
    const [isAddOpenCheckalert, SetIsAddOpenCheckalert] = useState(false);
    const [isClearOpenCheckalert, SetIsClearOpenCheckalert] = useState(false);
    const [isUpdateOpenCheckalert, SetIsUpdateOpenCheckalert] = useState(false);
    const [isDeleteOpenCheckalert, SetIsDeleteOpenCheckalert] = useState(false);
    const [isDeleteBulkOpenCheckalert, SetIsBulkDeleteOpenCheckalert] = useState(false);
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
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
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
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
    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MANAGESHORTAGEMASTER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteHoliday(res.data.smanageshortagemaster);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // Alert delete popup
    let holidayid = deleteHoliday._id;
    const delManageshortagemaster = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.MANAGESHORTAGEMASTER_SINGLE}/${holidayid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchEmployee();
            await fetchManageshortagemaster();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //add function
    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            let statusCreate = await axios.post(SERVICE.MANAGESHORTAGEMASTER_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: String(manageshortagemaster.department),
                from: String(manageshortagemaster.from),
                to: String(manageshortagemaster.to),
                amount: String(manageshortagemaster.amount),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setManageshortagemaster({ ...manageshortagemaster, from: "", to: "", amount: "" })
            await fetchEmployee();
            await fetchManageshortagemaster();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = manageshortagemastersDup.some((item) =>
            item.department?.toLowerCase() == manageshortagemaster.department?.toLowerCase() &&
            item.from == manageshortagemaster.from &&
            item.to == manageshortagemaster.to &&
            item.amount == manageshortagemaster.amount);
        if (manageshortagemaster.department === 'Please Select Department') {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (manageshortagemaster.from === "") {
            setPopupContentMalert("Please Enter From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (manageshortagemaster.to === "") {
            setPopupContentMalert("Please Enter To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (manageshortagemaster.amount === "") {
            setPopupContentMalert("Please Enter Amount");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (Number(manageshortagemaster.to) <= Number(manageshortagemaster.from)) {
            setPopupContentMalert("Please Enter To Experience Greater Then From Experience");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };
    const handleclear = (e) => {
        e.preventDefault();
        setManageshortagemaster({
            department: "Please Select Department",
            from: "",
            to: "",
            amount: "",
        });
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
            let res = await axios.get(`${SERVICE.MANAGESHORTAGEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageshortagemasterEdit(res?.data?.smanageshortagemaster);
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MANAGESHORTAGEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageshortagemasterEdit(res?.data?.smanageshortagemaster);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MANAGESHORTAGEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageshortagemasterEdit(res?.data?.smanageshortagemaster);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // updateby edit page...
    let updateby = manageshortagemasterEdit?.updatedby;
    let addedby = manageshortagemasterEdit?.addedby;
    let holidayId = manageshortagemasterEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.MANAGESHORTAGEMASTER_SINGLE}/${holidayId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: String(manageshortagemasterEdit.department),
                from: String(manageshortagemasterEdit.from),
                to: String(manageshortagemasterEdit.to),
                amount: String(manageshortagemasterEdit.amount),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchEmployee(); fetchManageshortagemaster();
            handleCloseModEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const editSubmit = (e) => {
        e.preventDefault();
        fetchManageshortagemasterAll();
        const isNameMatch = allManageshortagemasterEdit.some((item) => item.department === manageshortagemasterEdit.department && item.from == manageshortagemasterEdit.from && item.to == manageshortagemasterEdit.to && item.amount == manageshortagemasterEdit.amount);
        if (manageshortagemasterEdit.department === 'Please Select Department') {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (manageshortagemasterEdit.from === "") {
            setPopupContentMalert("Please Enter From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (manageshortagemasterEdit.to === "") {
            setPopupContentMalert("Please Enter To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (manageshortagemasterEdit.amount === "") {
            setPopupContentMalert("Please Enter Amount");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (Number(manageshortagemasterEdit.to) <= Number(manageshortagemasterEdit.from)) {
            setPopupContentMalert("Please Enter To Experience Greater Then From Experience");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };
    const [manageshortagemastersDup, setManageshortagemastersDup] = useState([])
    //get all data.
    const fetchManageshortagemaster = async () => {
        setPageName(!pageName)
        try {
            let res_status = await axios.get(SERVICE.MANAGESHORTAGEMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageshortagemastersDup(res_status?.data?.manageshortagemasters)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [manageshortagemastersFilterArray, setManageshortagemastersFilterArray] = useState([])
    const fetchManageshortagemasterArray = async () => {
        setPageName(!pageName)
        try {
            let res_status = await axios.get(SERVICE.MANAGESHORTAGEMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageshortagemastersFilterArray(res_status?.data?.manageshortagemasters?.map((t, index) => ({
                ...t,
                experienceinmonth: t.from + "-" + t.to,
            })))
            console.log(manageshortagemastersFilterArray)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => {
        fetchManageshortagemasterArray();
    }, [isFilterOpen])
    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const fetchEmployee = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.post(SERVICE.MANAGESHORTAGEMASTER_SORT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                searchQuery: searchQuery
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                experienceinmonth: item.from + "-" + item.to,
            }));
            setManageshortagemasters(itemsWithSerialNumber)
            setOverallFilterdata(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => {
        fetchEmployee();
    }, [page, pageSize, searchQuery]);
    //get all data.
    const fetchManageshortagemasterAll = async () => {
        setPageName(!pageName)
        try {
            let res_status = await axios.get(SERVICE.MANAGESHORTAGEMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllManageshortagemasterEdit(res_status?.data?.manageshortagemasters.filter((item) => item._id !== manageshortagemasterEdit._id));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Shortage Master.png");
                });
            });
        }
    };
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Shortage Master",
        pageStyle: "print",
    });
    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = manageshortagemasters?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
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
    const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = overallFilterdata?.filter((item) => {
        return searchOverAllTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
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
                        setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
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
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "department", headerName: "Department", flex: 0, width: 150, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "experienceinmonth", headerName: "Experience In Month", flex: 0, width: 150, hide: !columnVisibility.experienceinmonth, headerClassName: "bold-header" },
        { field: "amount", headerName: "Amount", flex: 0, width: 250, hide: !columnVisibility.amount, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("eshortagemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dshortagemaster") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vshortagemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ishortagemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            department: item.department,
            experienceinmonth: item.experienceinmonth,
            amount: item.amount,
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
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton aria-label="close" onClick={handleCloseManageColumns} sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
    useEffect(() => {
        fetchEmployee();
        fetchManageshortagemaster();
    }, []);
    useEffect(() => {
        addSerialNumber();
    }, [manageshortagemasters]);
    useEffect(() => {
        fetchManageshortagemasterAll();
    }, [isEditOpen]);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    const delManageshortagemastercheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.MANAGESHORTAGEMASTER_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectAllChecked(false);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchEmployee();
            await fetchManageshortagemaster();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const handleCloseAddalert = () => {
        setIsAddOpenalert(false)
    }
    const handleCloseUpdatealert = () => {
        setIsUpdateOpenalert(false)
    }
    const [fileFormat, setFormat] = useState('')
    let exportColumnNames = ["Department", "Experienceinmonth", "Amount"];
    let exportRowValues = ["department", "experienceinmonth", "amount"];
    return (
        <Box>
            <Headtitle title={"Manage Shortage Master"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Manage Shortage Master"
                modulename="PayRoll"
                submodulename="PayRoll Setup"
                mainpagename="Shortage Master"
                subpagename=""
                subsubpagename=""
            />
            {!statusCheck ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("ashortagemaster") && (
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Shortage Master</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Department <b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <Selects
                                                options={departmentOpt}
                                                styles={colourStyles}
                                                value={{
                                                    label: manageshortagemaster.department,
                                                    value: manageshortagemaster.department,
                                                }}
                                                onChange={(e) => {
                                                    setManageshortagemaster({
                                                        ...manageshortagemaster,
                                                        department: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sx={12} sm={12}>
                                        <Typography>
                                            Experience In Month <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item md={2} sx={12} sm={12} marginTop={1}>
                                                <Typography>From</Typography>
                                            </Grid>
                                            <Grid item md={4} sx={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        placeholder="Please Enter From"
                                                        type="text"
                                                        sx={userStyle.input}
                                                        value={manageshortagemaster.from}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === "" || (parseFloat(value) > 0 && !isNaN(value))) { // Allow empty string or a number greater than 0
                                                                setManageshortagemaster({ ...manageshortagemaster, from: value, to: "" });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={1} sx={12} sm={12} marginTop={1}>
                                                <Typography>To</Typography>
                                            </Grid>
                                            <Grid item md={5} sx={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        placeholder="Please Enter To"
                                                        type="text"
                                                        sx={userStyle.input}
                                                        value={manageshortagemaster.to}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === "" || (parseFloat(value) > 0 && !isNaN(value))) { // Allow empty string or a number greater than 0
                                                                setManageshortagemaster({ ...manageshortagemaster, to: value });
                                                            }
                                                        }} />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={3} sx={12} sm={12}>
                                        <Typography>
                                            Amount <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter Amount"
                                                type="number"
                                                sx={userStyle.input}
                                                value={manageshortagemaster.amount}
                                                onChange={(e) => {
                                                    setManageshortagemaster({ ...manageshortagemaster, amount: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid item md={12} sm={12} xs={12}>
                                    <br />
                                    <br />
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <Button variant="contained"
                                            onClick={handleSubmit}
                                        >
                                            SAVE
                                        </Button>
                                        <Button sx={userStyle.btncancel}
                                            onClick={handleclear}
                                        >
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    )}
                    <br />
                </>
            )}
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lshortagemaster") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Shortage Master List</Typography>
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
                                        {/* <MenuItem value={manageshortagemasters?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelshortagemaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchManageshortagemasterArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvshortagemaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchManageshortagemasterArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printshortagemaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfshortagemaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchManageshortagemasterArray()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageshortagemaster") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
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
                        {isUserRoleCompare?.includes("bdshortagemaster") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>)}
                        <br />
                        <br />
                        <Box style={{ width: "100%", overflowY: "hidden" }}>
                            <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                        </Box>
                        <Box>
                            <Pagination
                                page={searchQuery !== "" ? 1 : page}
                                pageSize={pageSize}
                                totalPages={searchQuery !== "" ? 1 : totalPages}
                                onPageChange={handlePageChange}
                                pageItemLength={filteredDatas?.length}
                                totalProjects={
                                    searchQuery !== "" ? filteredDatas?.length : totalProjects
                                }
                            />
                        </Box>
                        {/* ****** Table End ****** */}
                    </Box>
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
            <Box>
                {/* Update DIALOG */}
                <Dialog open={isUpdateOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Update Successfully
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseUpdatealert}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
            </Box>
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
                <Box sx={{ padding: "30px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Shortage Master</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Department</Typography>
                                    <Typography>{manageshortagemasterEdit.department}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Experience In Month</Typography>
                                    <Grid container spacing={1}>
                                        <Grid item md={6} sx={12} sm={12}>
                                            <Typography>From</Typography>
                                            <Typography>{manageshortagemasterEdit.from}</Typography>
                                        </Grid>
                                        <Grid item md={6} sx={12} sm={12}>
                                            <Typography>To</Typography>
                                            <Typography>{manageshortagemasterEdit.to}</Typography>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Amount</Typography>
                                    <Typography>{manageshortagemasterEdit.amount}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
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
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}
                >
                    <Box sx={{ padding: '30px' }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}> Edit Shortage Master </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Department <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={departmentOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: manageshortagemasterEdit.department,
                                                value: manageshortagemasterEdit.department,
                                            }}
                                            onChange={(e) => {
                                                setManageshortagemasterEdit({
                                                    ...manageshortagemasterEdit,
                                                    department: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sx={12} sm={12}>
                                    <Typography>
                                        Experience In Month <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid item md={2} sx={12} sm={12} marginTop={1}>
                                            <Typography>From</Typography>
                                        </Grid>
                                        <Grid item md={4} sx={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    placeholder="Please Enter From"
                                                    type="number"
                                                    sx={userStyle.input}
                                                    value={manageshortagemasterEdit.from}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === "" || (parseFloat(value) > 0 && !isNaN(value))) { // Allow empty string or a number greater than 0
                                                            setManageshortagemasterEdit({ ...manageshortagemasterEdit, from: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1} sx={12} sm={12} marginTop={1}>
                                            <Typography>To</Typography>
                                        </Grid>
                                        <Grid item md={5} sx={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    placeholder="Please Enter To"
                                                    type="number"
                                                    sx={userStyle.input}
                                                    value={manageshortagemasterEdit.to}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === "" || (parseFloat(value) > 0 && !isNaN(value))) { // Allow empty string or a number greater than 0
                                                            setManageshortagemasterEdit({ ...manageshortagemasterEdit, to: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sx={12} sm={12}>
                                    <Typography>
                                        Amount <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            placeholder="Please Enter Amount"
                                            type="number"
                                            sx={userStyle.input}
                                            value={manageshortagemasterEdit.amount}
                                            onChange={(e) => {
                                                setManageshortagemasterEdit({ ...manageshortagemasterEdit, amount: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
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
                filteredDataTwo={filteredDatas ?? []}
                itemsTwo={manageshortagemastersFilterArray ?? []}
                filename={"Shortage Master"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Shortage Master Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delManageshortagemaster}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delManageshortagemastercheckbox}
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
export default ManageShortageMaster;