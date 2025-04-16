import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
import { ThreeDots } from 'react-loader-spinner';
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
import PageHeading from "../../../components/PageHeading";

function Nonproduction() {
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
    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const [fileFormat, setFormat] = useState("");
    const CurrentDate = new Date()
    const [nonProductionState, setNonProductionState] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        mode: "",
        count: "1",
        date: moment(CurrentDate).format("YYYY-MM-DD"),
        fromtime: "",
        totime: "",
        totalhours: ""
    });
    const [nonProductionEdit, setNonProductionEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        mode: "",
        count: "1",
        date: "",
        fromtime: "",
        totime: "",
        totalhours: ""
    })
    const [modeEdit, setModeEdit] = useState("")
    const [countEdit, setCountEdit] = useState("")
    const [taskcategorys, setTaskcategorys] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess,  isAssignBranch, pageName, setPageName  } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [taskcategoryCheck, setTaskcategorycheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Non Production.png');
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
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
        name: true,
        category: true,
        subcategory: true,
        date: true,
        count: true,
        fromtime: true,
        totime: true,
        mode: true,
        isapproved: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    const [deleteCategroy, setDeleteCategory] = useState("");
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteCategory(res?.data?.snonproduction);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    // Alert delete popup
    let taskcategorysid = deleteCategroy?._id;
    const delTaskCategory = async () => {
        setPageName(!pageName)
        try {
            if (taskcategorysid) {
                await axios.delete(`${SERVICE.NONPRODUCTION_SINGLE}/${taskcategorysid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchTaskcategory();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const delTaskCatecheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.NONPRODUCTION_SINGLE}/${item}`, {
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
            await fetchTaskcategory();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //add function 
    const [isBtn, setBtn] = useState(false)
    const sendRequest = async () => {
        setBtn(true)
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.NONPRODUCTION_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(nonProductionState.category),
                subcategory: String(nonProductionState.subcategory),
                mode: String(modeState),
                count: String(countvalue),
                date: String(nonProductionState.date),
                fromtime: String(nonProductionState.fromtime),
                totime: String(nonProductionState.totime),
                totalhours: String(nonProductionState.totalhours),
                alloteddays: String(catSubCatData.mindays),
                allotedhours: String(catSubCatData.minhours),
                allotedminutes: String(catSubCatData.minminutes),
                days: String(catSubCatData.maxdays),
                hours: String(catSubCatData.maxhours),
                minutes: String(catSubCatData.maxminutes),
                name: isUserRoleAccess.companyname,
                company: isUserRoleAccess.company,
                branch: isUserRoleAccess.branch,
                unit: isUserRoleAccess.unit,
                team: isUserRoleAccess.team,
                empcode: isUserRoleAccess.empcode,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchTaskcategory();
            setNonProductionState({
                ...nonProductionState,
                count: "1",
                date: moment(CurrentDate).format("YYYY-MM-DD"),
                fromtime: "",
                totime: "",
                totalhours: ""
            })
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBtn(false)
        } catch (err) {
            setBtn(false)
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = taskcategorys.some(item => item.category.toLowerCase() == nonProductionState.category.toLowerCase() &&
            item.subcategory.toLowerCase() == nonProductionState.subcategory.toLowerCase() &&
            item.name == isUserRoleAccess.companyname
        );
        if (nonProductionState.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonProductionState.subcategory === "Please Select Sub Category") {
            setPopupContentMalert("Please Select Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (modeState === "") {
            setPopupContentMalert("Please Select Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonProductionState.date === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonProductionState.fromtime === "") {
            setPopupContentMalert("Please Select From Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonProductionState.totime === "") {
            setPopupContentMalert("Please Select To Time");
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
    }
    const handleClear = (e) => {
        e.preventDefault();
        setNonProductionState({
            category: "Please Select Category",
            subcategory: "Please Select Sub Category",
            mode: "",
            count: "1",
            date: moment(CurrentDate).format("YYYY-MM-DD"),
            fromtime: "",
            totime: "",
            totalhours: ""
        })
        setModeState("");
        setCount("")
        setSubCatOpt([])
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
        setSubCategoryOptionFilter([])
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
            let res = await axios.get(`${SERVICE.NONPRODUCTION_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionEdit(res?.data?.snonproduction);
            setModeEdit(res?.data?.snonproduction?.mode)
            setCountEdit(res?.data?.snonproduction?.count)
            // handleSubCategory(res?.data?.snonproduction?.category)
            handleClickOpenEdit();
            getCategoryEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTION_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionEdit(res?.data?.snonproduction);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTION_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionEdit(res?.data?.snonproduction);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //Project updateby edit page...
    let updateby = nonProductionEdit?.updatedby;
    let addedby = nonProductionEdit?.addedby;
    let subprojectsid = nonProductionEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.NONPRODUCTION_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(nonProductionEdit.category),
                subcategory: String(nonProductionEdit.subcategory),
                mode: String(modeEdit),
                count: String(countEdit),
                date: String(nonProductionEdit.date),
                fromtime: String(nonProductionEdit.fromtime),
                totime: String(nonProductionEdit.totime),
                totalhours: String(nonProductionEdit.totalhours),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTaskcategory();
            setCount("");
            setModeState("")
            handleCloseModEdit()
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setSubCategoryOptionFilter([])
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchTaskcategoryAll();
        const isNameMatch = resdata.some(item =>
            item.category.toLowerCase() === (nonProductionEdit.category).toLowerCase() &&
            item.subcategory.toLowerCase() == nonProductionEdit.subcategory.toLowerCase() &&
            item.name == nonProductionEdit.name
        );
        if (nonProductionEdit.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonProductionEdit.subcategory === "Please Select Sub Category") {
            setPopupContentMalert("Please Select Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (modeEdit === "") {
            setPopupContentMalert("Please Select Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonProductionEdit.date === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonProductionEdit.fromtime === "") {
            setPopupContentMalert("Please Select From Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonProductionEdit.totime === "") {
            setPopupContentMalert("Please Select To Time");
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
    }
    const [catOpt, setCatOpt] = useState([])
    const [subCatOpt, setSubCatOpt] = useState([])
    const getCategory = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const CatOpt = [...response?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            setCatOpt(CatOpt)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const getCategoryAndSubcategory = async (e) => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const CatOpt = [...response?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            setCatOpt(CatOpt)
            let result = response?.data?.categoryandsubcategory.find((d) => d.categoryname === e.categoryname);
            const subcatealls = result?.subcategoryname?.map((d) => ({
                label: d,
                value: d,
            }));
            setSubCatOpt(subcatealls)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => {
        getCategory()
    }, [])
    const getCategoryEdit = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const CatOpt = [...response?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            setCategoryOption(CatOpt)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const getCategoryAndSubcategoryEdit = async (e) => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const CatOpt = [...response?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            setCategoryOption(CatOpt)
            let result = response?.data?.categoryandsubcategory.find((d) => d.categoryname === e.categoryname);
            const subcatealls = result?.subcategoryname?.map((d) => ({
                label: d,
                value: d,
            }));
            setSubCategoryOptionFilter(subcatealls)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [categoryOption, setCategoryOption] = useState([])
    const [subCategoryOption, setSubCategoryOption] = useState([])
    const [subCategoryOptionFilter, setSubCategoryOptionFilter] = useState([])
    const handleSubCategory = (cat) => {
        const filterSubCat = subCategoryOption?.filter((item) => item.category === cat)
        const setSubCatOption = filterSubCat
            ? Array.from(new Set(filterSubCat.map(item => item.subcategory))).map(subcategory => ({
                label: subcategory,
                value: subcategory
            }))
            : [];
        setSubCategoryOptionFilter(setSubCatOption)
    }
    const [modeState, setModeState] = useState("")
    const [countvalue, setCount] = useState("")
    const [catSubCatData, setCatSubCatData] = useState([])
    const fetchNonProductionUnitRate = async (cat, subCat) => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.NONPRODUCTIONUNITRATEGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const manageNonProd = res_vendor?.data?.nonproductionunitrate.filter((item) => item.categoryname == cat && item.subcategory == subCat);
            setCatSubCatData(manageNonProd?.[0])
            const setNonProd = manageNonProd.length > 0 ? manageNonProd[0]?.base : "";
            setModeState(setNonProd);
            setModeEdit(setNonProd);
            setCount(setNonProd == "Count" ? "1" : "")
            setCountEdit(setNonProd == "Count" ? "1" : "")
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    let exportColumnNames = ["Name", "Category", " Sub Category", "Date", "Count", "From Time", "To Time", "Mode", "Is Approved"];
    let exportRowValues = ["name", "category", "subcategory", "date", "count", "fromtime", "totime", "mode", "isapproved"];
    //get all Sub vendormasters.
    const fetchTaskcategory = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.NONPRODUCTION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTaskcategorycheck(true)
            const Data = res_vendor?.data?.nonproduction
            if (!isUserRoleAccess.role.includes("Manager")) {
                const userData = Data.filter((t) => {
                    return t.name == isUserRoleAccess.companyname
                })
                setTaskcategorys(userData);
            } else {
                setTaskcategorys(res_vendor?.data?.nonproduction?.map((t, index) => ({
                    ...t,
                    Sno: index + 1,
                    name: t.name,
                    category: t.category,
                    subcategory: t.subcategory,
                    date: t.date,
                    count: t.count,
                    fromtime: t.fromtime,
                    totime: t.totime,
                    mode: t.mode,
                    isapproved: t.isapproved,
                })));
            }
        } catch (err) { setTaskcategorycheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    //get all Sub vendormasters.
    const fetchTaskcategoryAll = async () => {
        setPageName(!pageName)
        try {
            let res_meet = await axios.get(SERVICE.NONPRODUCTION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            return res_meet?.data?.nonproduction.filter(item => item._id !== nonProductionEdit._id)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Non Production',
        pageStyle: 'print'
    });
    useEffect(() => {
        fetchTaskcategory();
        // fetchUserAllotBy();
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
        const itemsWithSerialNumber = taskcategorys?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }
    useEffect(() => {
        addSerialNumber();
    }, [taskcategorys])
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
            flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "name", headerName: "Name", flex: 0, width: 130, hide: !columnVisibility.name, headerClassName: "bold-header" },
        { field: "category", headerName: "Category Name", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 150, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 150, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "count", headerName: "Count", flex: 0, width: 150, hide: !columnVisibility.count, headerClassName: "bold-header" },
        { field: "fromtime", headerName: "From Time", flex: 0, width: 150, hide: !columnVisibility.fromtime, headerClassName: "bold-header" },
        { field: "totime", headerName: "To Time", flex: 0, width: 150, hide: !columnVisibility.totime, headerClassName: "bold-header" },
        { field: "mode", headerName: "Mode", flex: 0, width: 150, hide: !columnVisibility.mode, headerClassName: "bold-header" },
        {
            field: "isapproved",
            headerName: "Is Approved",
            flex: 0,
            width: 150,
            hide: !columnVisibility.isapproved,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {(params.row.isapproved !== undefined) ?
                        (params.row.isapproved === true) ?
                            <>
                                <Button color="success" >
                                    Approved
                                </Button>
                            </> :
                            <>
                                <Button color="error" >
                                    Rejected
                                </Button>
                            </> : ""
                    }
                </Grid>
            ),
        },
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
                    {isUserRoleCompare?.includes("enonproductions") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dnonproductions") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vnonproductions") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("inonproductions") && (
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
    ]
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            name: item.name,
            category: item.category,
            subcategory: item.subcategory,
            mode: item.mode,
            count: item.count,
            date: moment(item.date).format("DD-MM-YYYY"),
            fromtime: item.fromtime,
            totime: item.totime,
            totalhours: item.totalhours,
            isapproved: item.approvestatus
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
    const appliedFOrOpt = [{ label: "Employee", value: "Employee" }, { label: "Team", value: "Team" }, { label: "Unit", value: "Unit" }, { label: "Branch", value: "Branch" }, { label: "Process", value: "Process" }]
    const handleFromTimeChange = (e) => {
        setNonProductionState({ ...nonProductionState, fromtime: e.target.value, });
        calculateTotalTime(e.target.value, nonProductionState.totime);
    };
    const handleToTimeChange = (e) => {
        setNonProductionState({ ...nonProductionState, totime: e.target.value, });
        calculateTotalTime(nonProductionState.fromtime, e.target.value);
    };
    //Edit
    const handleFromTimeChangeEdit = (e) => {
        setNonProductionEdit({ ...nonProductionEdit, fromtime: e.target.value, });
        calculateTotalTimeEdit(e.target.value, nonProductionEdit.totime);
    };
    const handleToTimeChangeEdit = (e) => {
        setNonProductionEdit({ ...nonProductionEdit, totime: e.target.value, });
        calculateTotalTimeEdit(nonProductionEdit.fromtime, e.target.value);
    };
    // Total time Calculations for the create
    const calculateTotalTime = (from, to) => {
        if (from && to) {
            const fromTime = new Date(`1970-01-01T${from}`);
            const toTime = new Date(`1970-01-01T${to}`);
            if (!isNaN(fromTime) && !isNaN(toTime)) {
                const timeDiff = toTime.getTime() - fromTime.getTime();
                const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
                const totalMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const formattedTotalTime = `${totalHours}h ${totalMinutes}m`;
                setNonProductionState({ ...nonProductionState, totalhours: formattedTotalTime, fromtime: from, totime: to });
            } else {
                setNonProductionState({ ...nonProductionState, totalhours: '', fromtime: from, totime: to });
            }
        }
    };
    //Edit
    const calculateTotalTimeEdit = (from, to) => {
        if (from && to) {
            const fromTime = new Date(`1970-01-01T${from}`);
            const toTime = new Date(`1970-01-01T${to}`);
            if (!isNaN(fromTime) && !isNaN(toTime)) {
                const timeDiff = toTime.getTime() - fromTime.getTime();
                const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
                const totalMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const formattedTotalTime = `${totalHours}h ${totalMinutes}m`;
                setNonProductionEdit({ ...nonProductionEdit, totalhours: formattedTotalTime, fromtime: from, totime: to });
            } else {
                setNonProductionEdit({ ...nonProductionEdit, totalhours: '', fromtime: from, totime: to });
            }
        }
    };
    console.log(isUserRoleCompare.includes("anonproductions"))
    return (
        <Box>
            <Headtitle title={'Non Production'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Non Production"
                modulename="Production"
                submodulename="Non Production"
                mainpagename="Non-production Setup"
                subpagename="Non Productions"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("anonproductions")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Non Production</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={catOpt}
                                                value={{
                                                    label: nonProductionState.category,
                                                    value: nonProductionState.category,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionState({
                                                        ...nonProductionState,
                                                        category: e.value,
                                                        subcategory: "Please Select Sub Category"
                                                    });
                                                    // getSubCategory(e.value)
                                                    setModeState([])
                                                    // handleSubCategory(e.value)
                                                    setCount('');
                                                    setModeState("")
                                                    getCategoryAndSubcategory(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Category <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={subCatOpt}
                                                value={{
                                                    label: nonProductionState.subcategory,
                                                    value: nonProductionState.subcategory,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionState({
                                                        ...nonProductionState,
                                                        subcategory: e.value,
                                                    });
                                                    fetchNonProductionUnitRate(nonProductionState.category, e.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Mode <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Mode"
                                                value={modeState}
                                                readOnly={true}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Count <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Count"
                                                value={countvalue}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Date <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                placeholder="Please Enter Name"
                                                value={nonProductionState.date}
                                                onChange={(e) => {
                                                    setNonProductionState({ ...nonProductionState, date: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>From Time <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="time"
                                                value={nonProductionState.fromtime}
                                                onChange={handleFromTimeChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>To Time <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="time"
                                                value={nonProductionState.totime}
                                                onChange={handleToTimeChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Total Hours<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="teaxt"
                                                placeholder=""
                                                readOnly={true}
                                                value={nonProductionState.totalhours}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />  <br />
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
                                        >
                                            SAVE
                                        </Button>
                                        <Button sx={userStyle.btncancel}
                                            onClick={handleClear}
                                        >
                                            CLEAR
                                        </Button>
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
                    }}
                >
                    <Box sx={{ padding: '20px 50px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Non Production</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={categoryOption}
                                                value={{
                                                    label: nonProductionEdit.category,
                                                    value: nonProductionEdit.category,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionEdit({
                                                        ...nonProductionEdit,
                                                        category: e.value,
                                                        subcategory: "Please Select Sub Category"
                                                    });
                                                    setModeState([])
                                                    setModeEdit("");
                                                    setCountEdit("");
                                                    getCategoryAndSubcategoryEdit(e)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Category <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={subCategoryOptionFilter}
                                                value={{
                                                    label: nonProductionEdit.subcategory,
                                                    value: nonProductionEdit.subcategory,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionEdit({
                                                        ...nonProductionEdit,
                                                        subcategory: e.value,
                                                    });
                                                    fetchNonProductionUnitRate(nonProductionEdit.category, e.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Mode <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Mode"
                                                value={modeEdit}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Count <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Count"
                                                value={countEdit}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Date <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                placeholder="Please Enter Name"
                                                value={nonProductionEdit.date}
                                                onChange={(e) => {
                                                    setNonProductionEdit({ ...nonProductionEdit, date: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>From Time <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="time"
                                                value={nonProductionEdit.fromtime}
                                                onChange={handleFromTimeChangeEdit}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>To Time <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="time"
                                                value={nonProductionEdit.totime}
                                                onChange={handleToTimeChangeEdit}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Total Hours<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="teaxt"
                                                placeholder=""
                                                readOnly={true}
                                                value={nonProductionEdit.totalhours}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" type="submit" onClick={editSubmit}>Update</Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
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
            {isUserRoleCompare?.includes("lnonproductions") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Production Individual List</Typography>
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
                                        {/* <MenuItem value={(taskcategorys?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelnonproductions") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchNonProductionUnitRate();
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvnonproductions") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchNonProductionUnitRate();
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printnonproductions") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint /> &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfnonproductions") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                    fetchNonProductionUnitRate();
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagenonproductions") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
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
                        {isUserRoleCompare?.includes("bdnonproductions") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}
                        <br /><br />
                        {!taskcategoryCheck ?
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
                                    }} ref={gridRef}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        autoHeight={true}
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
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Non Production</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{nonProductionEdit.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category Name</Typography>
                                    <Typography>{nonProductionEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Category</Typography>
                                    <Typography>{nonProductionEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{moment(nonProductionEdit.date).format("DD-MM-YYYY")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Count</Typography>
                                    <Typography>{nonProductionEdit.count}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">From Time</Typography>
                                    <Typography>{nonProductionEdit.fromtime}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">To Time</Typography>
                                    <Typography>{nonProductionEdit.totime}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Mode</Typography>
                                    <Typography>{nonProductionEdit.mode}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}> Back </Button>
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
                itemsTwo={taskcategorys ?? []}
                filename={"Non Production"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Non Production Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delTaskCategory}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delTaskCatecheckbox}
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
export default Nonproduction;