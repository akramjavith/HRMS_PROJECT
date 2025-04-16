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
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
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
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';
import PageHeading from "../../../components/PageHeading.js";
import { ThreeDots } from 'react-loader-spinner';


function Nonproductionallot() {
    const [loader, setLoader] = useState(false)

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

    const userId = useParams().id

    const [fileFormat, setFormat] = useState("");
    const [assignedBy, setAssignedBy] = useState({ assignedname: "" });
    const [nonproductionEdit, setNonproductionEdit] = useState({
        employeename: "",
        category: "Please Select Category",
        subcategory: "Please Select Sub Category"
    })
    const [assignedByAllot, setAssignedByAllot] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
    })
    const [assignedByEdit, setAssignedByEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
    })
    const [nonproductionArray, setNonProductionAllotArray] = useState([])
    const [catOptAllot, setCatOptAllot] = useState([])
    const [catOptEdit, setCatOptEdit] = useState([])
    const [updateId, setUpdateId] = useState([])
    const [subCatOptAllot, setSubCatOptAllot] = useState([])
    const [subCatOptAllotEdit, setSubCatOptAllotEdit] = useState([])
    const [assignedByAllotEdit, setAssignedByAllotEdit] = useState([])
    const [assignedByArray, setAssignebyArray] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [sources, setAssignedby] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [sourceCheck, setSourcecheck] = useState(false);
    const username = isUserRoleAccess.companyname
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Non Production Unit Allot Entry.png');
                });
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
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeecode: true,
        employeename: true,
        category: true,
        subcategory: true,
        createdate: true,
        createtime: true,
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
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.nonproductionunitallot);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async (e) => {
        setPageName(!pageName)
        setLoader(true)
        try {
            if (Sourcesid) {
                await axios.delete(`${SERVICE.NONPRODUCTIONUNITALLOT_SINGLE}/${deleteSource?._id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchUserAllotBy();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
            }
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)

        } catch (err) {
            setLoader(false)
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const delSourcecheckbox = async () => {
        setPageName(!pageName)
        setLoader(true)

        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.NONPRODUCTIONUNITALLOT_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            await fetchUserAllotBy();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)

        } catch (err) {
            setLoader(false)

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    //add function 
    const sendRequest = async () => {
        setPageName(!pageName)
        setLoader(true)

        try {
            let subprojectscreate = await axios.post(SERVICE.ASSIGNEDBY_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignedname: String(assignedBy.assignedname),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchAssignedBy();
            setAssignedBy({ assignedname: "" })
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)

        } catch (err) {
            setLoader(false)

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsActive(true)
        const isNameMatch = assignedByArray.some(item => item.assignedname.toLowerCase() == assignedBy.assignedname.toLowerCase());
        if (assignedBy.assignedname === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Name already exits");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
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
        setSubCatOptAllotEdit([])
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
        setUpdateId(e)
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonproductionEdit(res?.data?.nonproductionunitallot)
            setAssignedByEdit(res?.data?.nonproductionunitallot);
            getCategoryAndSubcategory()
            getCategoryAndSubcategoryEdit(res?.data?.nonproductionunitallot?.category)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAssignedByEdit(res?.data?.nonproductionunitallot);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAssignedByEdit(res?.data?.nonproductionunitallot);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //Project updateby edit page...
    let updateby = assignedByEdit?.updatedby;
    let addedby = assignedByEdit?.addedby;
    let subprojectsid = assignedByEdit?._id;
    //editing the single data...
    const sendAllotRequest = async () => {
        setPageName(!pageName)
        setLoader(true)
        try {
            let res = await axios.post(`${SERVICE.NONPRODUCTIONUNITALLOT_CREATE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(assignedByAllot.category),
                subcategory: String(assignedByAllot.subcategory),
                company: String(assignedByEdit.company),
                branch: String(assignedByEdit.branch),
                unit: String(assignedByEdit.unit),
                team: String(assignedByEdit.team),
                employeename: String(assignedByEdit.companyname),
                employeecode: String(assignedByEdit.empcode),
                empid: String(assignedByEdit._id),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            handleCloseModEditAllot()
            await fetchAssignedBy();
            setPageSize(10)
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)

        } catch (err) {
            setLoader(false)

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }


    let userAllotid = nonproductionEdit?._id;
    const sendEditRequest = async () => {
        setPageName(!pageName)
        setLoader(true)
        try {
            let res = await axios.put(`${SERVICE.NONPRODUCTIONUNITALLOT_SINGLE}/${userAllotid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(nonproductionEdit.category),
                subcategory: String(nonproductionEdit.subcategory),
                company: String(nonproductionEdit.company),
                branch: String(nonproductionEdit.branch),
                unit: String(nonproductionEdit.unit),
                team: String(nonproductionEdit.team),
                employeename: String(nonproductionEdit.employeename),
                employeecode: String(nonproductionEdit.employeecode),
                empid: String(userId),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchUserAllotBy();
            setLoader(false)

        } catch (err) {
            setLoader(false)

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }
    const editSubmit = (e) => {
        e.preventDefault();

        const filtDup = nonProductionAllotArrayEdit?.some((item) => {
            return (
                item?.category === nonproductionEdit.category &&
                item?.subcategory === nonproductionEdit.subcategory
            );
        });

        if (nonproductionEdit.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonproductionEdit.subcategory === "Please Select Sub Category") {
            setPopupContentMalert("Please Select Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filtDup) {
            setPopupContentMalert("Category & Sub Category Already Alloted");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }

    const AllotSubmit = (e) => {
        e.preventDefault();
        const filtDup = nonproductionArray
            ?.filter((item) => item?.empid === userId)
            ?.some((item) => {
                return (
                    item?.category === assignedByAllot.category &&
                    item?.subcategory === assignedByAllot.subcategory
                );
            });

        if (assignedByAllot.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assignedByAllot.subcategory === "Please Select Sub Category") {
            setPopupContentMalert("Please Select Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filtDup) {
            setPopupContentMalert("Category & Sub Category Already Alloted");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendAllotRequest();
        }
    }

    //get all Sub vendormasters.
    const [assignedbyOverall, setAssignedbyOverall] = useState([])
    const fetchAssignedByArray = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const userAssign = res?.data?.nonproductionunitallot.filter((t) => {
                return t.empid == userId
            })
            // setSourcecheck(true)
            setAssignedbyOverall(userAssign.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    team: item.team,
                    employeecode: item.employeecode,
                    employeename: item.employeename,
                    category: item.category,
                    subcategory: item.subcategory,
                    createdate: moment(item.createdAt).format('DD-MM-YYYY'),
                    createtime: moment(item.createdAt).format('hh:mm:ss a')
                }
            }));
            setSourcecheck(true);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    useEffect(() => {
        fetchAssignedByArray()
    }, [isFilterOpen, isPdfFilterOpen])
    const fetchUserAllotBy = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const userAssign = res?.data?.nonproductionunitallot.filter((t) => {
                return t.empid == userId
            })
            // setSourcecheck(true)
            setAssignedby(userAssign);
            setSourcecheck(true);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const fetchAssignedBy = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const userAssign = res?.data?.nonproductionunitallot.filter((t) => {
                return t.employeename == assignedByEdit.companyname
            });
            // setSourcecheck(true)
            setAssignedby(userAssign);
            setSourcecheck(true);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    useEffect(() => {
        fetchAssignedByArray()
    }, [isFilterOpen, isPdfFilterOpen])
    const exportColumnNames = [
        'Company',
        'Branch', 'Unit',
        'Team', 'Employee Code',
        'Employee Name', 'Category',
        'Sub Category', 'Create Date',
        'Create Time'
    ]
    const exportRowValues = [
        'company',
        'branch', 'unit',
        'team', 'employeecode',
        'employeename', 'category',
        'subcategory', 'createdate',
        'createtime'
    ]
    // Excel
    const fileName = "Non Production Unit Allot Entry";
    const [sourceData, setSourceData] = useState([]);
    // get particular columns for export excel 
    const getexcelDatas = () => {
        var data = rowDataTable?.map((t, index) => ({
            "Sno": index + 1,
            "Assigned Name": t.assignedname,
        }));
        setSourceData(data);
    }
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Non Production Unit Allot Entry',
        pageStyle: 'print'
    });
    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;
    useEffect(() => {
        getexcelDatas();
    }, [assignedByEdit, assignedBy, sources])
    const [nonProductionAllotArrayEdit, setNonProductionAllotArrayEdit] = useState()
    const fetchNonProductionByEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filteredArray = res?.data?.nonproductionunitallot
                ?.filter((item) => item?.empid === userId)
                ?.filter((filid) => filid?._id !== e);

            setNonProductionAllotArrayEdit(filteredArray);

        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        fetchUserAllotBy();
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
    const addSerialNumber = () => {
        const itemsWithSerialNumber = sources?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }
    useEffect(() => {
        addSerialNumber();
    }, [sources])
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
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeecode", headerName: "Employee Code", flex: 0, width: 125, hide: !columnVisibility.employeecode, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 130, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
        { field: "category", headerName: "Category", flex: 0, width: 110, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 130, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
        { field: "createdate", headerName: "Create Date", flex: 0, width: 130, hide: !columnVisibility.createdate, headerClassName: "bold-header" },
        { field: "createtime", headerName: "Create Time", flex: 0, width: 130, hide: !columnVisibility.createtime, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("enon-productionunitallot") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            getCode(params.row.id);
                            fetchNonProductionByEdit(params.row.id)
                            // fetchNonProductionUpdateBy(params.row.id)
                        }}><EditOutlinedIcon sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dnon-productionunitallot") && (
                        <Button sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id)
                            }}><DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vnon-productionunitallot") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("inon-productionunitallot") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />                        </Button>
                    )}
                </Grid>
            ),
        },
    ]
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeecode: item.employeecode,
            employeename: item.employeename,
            category: item.category,
            subcategory: item.subcategory,
            createdate: moment(item.createdAt).format('DD-MM-YYYY'),
            createtime: moment(item.createdAt).format('hh:mm:ss a')
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
    const [isEditOpenAllot, setIsEditOpenAllot] = useState(false);
    const handleClickOpenEditAllot = () => {
        setIsEditOpenAllot(true);
    };
    const handleCloseModEditAllot = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpenAllot(false);
        setAssignedByAllot({
            ...assignedByAllotEdit,
            category: "Please Select Category",
            subcategory: "Please Select Sub Category",
        })
    };
    const getCategoryAndSubcategory = async () => {
        setPageName(!pageName)
        try {
            let NonProduction = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // const CatOpt = [...response?.data?.categoryandsubcategory?.map((t) => ({
            //     ...t,
            //     label: t.categoryname,
            //     value: t.categoryname,
            // }))]
            const CatOptall = [...response?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            const filterAlloted = NonProduction?.data?.nonproductionunitallot?.filter((item) =>
                item?.employeename?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase())
            const CatOpt = filterAlloted?.map((t) => ({
                ...t,
                label: t.category,
                value: t.category,
            }))
            const removeDup = CatOpt.filter((item, index, self) =>
                index === self.findIndex((t) => t.value === item.value)
            );
            if (!isUserRoleAccess.role.includes("Manager")) {
                setCatOptAllot(removeDup)
                setCatOptEdit(removeDup)
            } else {
                setCatOptAllot(CatOptall)
                setCatOptEdit(CatOptall)
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getCodeEmp = async (e) => {
        setPageName(!pageName)
        try {

            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAssignedByEdit(res?.data?.suser)
            getCategoryAndSubcategoryAllot()
            handleClickOpenEditAllot();
            fetchNonProductionBy();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getCategoryAndSubcategoryAllot = async () => {
        setPageName(!pageName)
        try {
            let NonProduction = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const CatOptall = [...response?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            const filterAlloted = NonProduction?.data?.nonproductionunitallot?.filter((item) =>
                item?.employeename?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase())
            const CatOpt = filterAlloted?.map((t) => ({
                ...t,
                label: t.category,
                value: t.category,
            }))
            const removeDup = CatOpt.filter((item, index, self) =>
                index === self.findIndex((t) => t.value === item.value)
            );
            // const CatOpt = [...response?.data?.categoryandsubcategory?.map((t) => ({
            //     ...t,
            //     label: t.categoryname,
            //     value: t.categoryname,
            // }))]
            if (!isUserRoleAccess.role.includes("Manager")) {
                setCatOptAllot(removeDup)
            } else {
                setCatOptAllot(CatOptall)
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getCategoryAndSubAllot = async (e) => {
        setPageName(!pageName)
        try {
            let NonProduction = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // const CatOpt = [...response?.data?.categoryandsubcategory?.map((t) => ({
            //     ...t,
            //     label: t.categoryname,
            //     value: t.categoryname,
            // }))]
            // setCatOptAllot(CatOpt)
            // let result = response?.data?.categoryandsubcategory.find((d) => d.categoryname === e.categoryname);
            // const subcatealls = result?.subcategoryname?.map((d) => ({
            //     label: d,
            //     value: d,
            // }));
            let resultall = response?.data?.categoryandsubcategory.find((d) => d.categoryname === e.categoryname);
            const subcatealls = resultall?.subcategoryname?.map((d) => ({
                label: d,
                value: d,
            }));
            const filterAlloted =
                NonProduction?.data?.nonproductionunitallot?.filter((item) =>
                    item?.employeename?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase()
                    &&
                    item?.category?.toLowerCase() ===
                    e?.value?.toLowerCase())
            const result = filterAlloted?.map((t) => ({
                ...t,
                label: t.subcategory,
                value: t.subcategory,
            }))
            const removeDup = result.filter((item, index, self) =>
                index === self.findIndex((t) => t.value === item.value)
            );
            if (!isUserRoleAccess.role.includes("Manager")) {
                setSubCatOptAllot(removeDup)
            } else {
                setSubCatOptAllot(subcatealls)
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getCategoryAndSubcategoryEdit = async (e) => {
        setPageName(!pageName)
        try {
            let NonProduction = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let resultall = response?.data?.categoryandsubcategory.find((d) => d.categoryname === e);
            const subcatealls = resultall?.subcategoryname?.map((d) => ({
                label: d,
                value: d,
            }));
            const filterAlloted =
                NonProduction?.data?.nonproductionunitallot?.filter((item) =>
                    item?.employeename?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase()
                    &&
                    item?.category?.toLowerCase() ===
                    e?.toLowerCase())
            const result = filterAlloted?.map((t) => ({
                ...t,
                label: t.subcategory,
                value: t.subcategory,
            }))
            const removeDup = result.filter((item, index, self) =>
                index === self.findIndex((t) => t.value === item.value)
            );
            if (!isUserRoleAccess.role.includes("Manager")) {
                setSubCatOptAllotEdit(removeDup)
            } else {
                setSubCatOptAllotEdit(subcatealls)
            }
            // setSubCatOptAllot(subcatealls)

        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const fetchNonProductionBy = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setNonProductionAllotArray(res?.data?.nonproductionunitallot);
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    return (
        <Box>
            <Headtitle title={'Non Production Unit Allot Entry'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Non Production Unit Allot Entry"
                modulename="Production"
                submodulename="Non Production"
                mainpagename="Non-production Setup"
                subpagename="Non-production Unit Allot"
                subsubpagename=""
            />
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lnon-productionunitallot") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        {/* <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Log List</Typography>
                        </Grid> */}
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.SubHeaderText}>Log List</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                                <>
                                    {isUserRoleCompare?.includes("anon-productionunitallot") && (
                                        <Link style={{ textDecoration: "none", color: "white", float: "right" }}>
                                            <Button variant="contained" onClick={() => {
                                                getCodeEmp(userId)
                                            }}>Allot</Button>
                                        </Link>
                                    )}
                                </>
                                <>
                                    <Link to="/production/nonproductionunitallot" style={{ textDecoration: "none", color: "white", float: "right" }}>
                                        <Button sx={buttonStyles.btncancel} >Go Back</Button>
                                    </Link>
                                </>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Typography>&nbsp;</Typography>
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
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} >
                                <Typography>&nbsp;</Typography>
                                <Box >
                                    {isUserRoleCompare?.includes("excelnon-productionunitallot") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchAssignedByArray();
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvnon-productionunitallot") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchAssignedByArray();
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printnon-productionunitallot") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfnon-productionunitallot") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                    fetchAssignedByArray();
                                                }}>
                                                <FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagenon-productionunitallot") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small" >
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
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdnon-productionunitallot") && (
                            <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}
                        <br /><br />
                        {loader ?
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
                                        Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
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
                maxWidth="md"
                fullWidth={true}
                sx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Non Production Unit Allot Entry </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{assignedByEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{assignedByEdit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{assignedByEdit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{assignedByEdit.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Code</Typography>
                                    <Typography>{assignedByEdit.employeecode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{assignedByEdit.employeename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{assignedByEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Category</Typography>
                                    <Typography>{assignedByEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Created Date</Typography>
                                    <Typography>{moment(assignedByEdit.createdAt).format('DD-MM-YYYY')}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Created Time</Typography>
                                    <Typography>{moment(assignedByEdit.createdAt).format('hh:mm:ss a')}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button sx={buttonStyles.btncancel} onClick={handleCloseview}> Back </Button>
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
            <Box>
                {/* Allot DIALOG */}
                <Dialog
                    open={isEditOpenAllot}
                    onClose={handleCloseModEditAllot}
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
                            <form onSubmit={AllotSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Non Production Unit Allot</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Employee Name"
                                                value={assignedByEdit.companyname}
                                            // onChange={(e) => {
                                            //     setAssignedByEdit({ ...assignedByEdit, companyname: e.target.value });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth >
                                            <Typography>
                                                Category<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={catOptAllot}
                                                value={{ label: assignedByAllot.category, value: assignedByAllot.category }}
                                                onChange={(e) => {
                                                    setAssignedByAllot({
                                                        ...assignedByAllot,
                                                        category: e.value,
                                                        subcategory: "Please Select Sub Category"
                                                    });
                                                    getCategoryAndSubAllot(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth >
                                            <Typography>
                                                Sub Category<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={subCatOptAllot}
                                                value={{ label: assignedByAllot.subcategory, value: assignedByAllot.subcategory }}
                                                onChange={(e) => {
                                                    setAssignedByAllot({
                                                        ...assignedByAllot,
                                                        subcategory: e.value,
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
                                        <Button sx={buttonStyles.buttonsubmit} type="submit" >Save</Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseModEditAllot} >Cancel</Button>
                                    </Grid>
                                </Grid>
                                {/* </DialogContent> */}
                            </form>
                        </>
                    </Box>
                </Dialog>
            </Box>
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
                                        <Typography sx={userStyle.HeaderText}>Edit Non Production Unit Allot Entry  </Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Employee Name"
                                                value={nonproductionEdit.employeename}
                                            // onChange={(e) => {
                                            //     setAssignedByEdit({ ...assignedByEdit, companyname: e.target.value });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth >
                                            <Typography>
                                                Category<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={catOptEdit}
                                                value={{ label: nonproductionEdit.category, value: nonproductionEdit.category }}
                                                onChange={(e) => {
                                                    setNonproductionEdit({
                                                        ...nonproductionEdit,
                                                        category: e.value,
                                                        subcategory: "Please Select Sub Category"
                                                    });
                                                    getCategoryAndSubcategoryEdit(e.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth >
                                            <Typography>
                                                Sub Category<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={subCatOptAllotEdit}
                                                value={{ label: nonproductionEdit.subcategory, value: nonproductionEdit.subcategory }}
                                                onChange={(e) => {
                                                    setNonproductionEdit({
                                                        ...nonproductionEdit,
                                                        subcategory: e.value,
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
                                        <Button sx={buttonStyles.buttonsubmit} type="submit" >Update</Button>
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
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={assignedbyOverall ?? []}
                filename={"Non Production Unit Allot Entry"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Non Production Unit Allot Entry Info"
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


export default Nonproductionallot;
