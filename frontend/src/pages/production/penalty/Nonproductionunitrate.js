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
import axios from 'axios';
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
import PageHeading from "../../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';
import domtoimage from 'dom-to-image';

function Nonproductionunitrate() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [fileFormat, setFormat] = useState('')
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
    const [nonProductionUnitRate, setNonProductionUnitRate] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        base: "Please Select Base",
        process: "Please Select Process",
        mindays: "",
        minhours: "",
        minminutes: "",
        maxdays: "",
        maxhours: "",
        maxminutes: "",
        rate: ""
    });
    const [nonProductionUnitRateEdit, setNonProductionUnitRateEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        base: "Please Select Base",
        process: "Please Select Process",
        mindays: "",
        minhours: "",
        minminutes: "",
        maxdays: "",
        maxhours: "",
        maxminutes: "",
        rate: ""
    });
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subCategoriesEdit, setSubCategoriesEdit] = useState([]);
    const BaseOptions = [{ label: "Time", value: "Time" }, { label: "Count", value: "Count" }];
    const timeOptions = [{ label: "Hours", value: "Hours" }, { label: "Day", value: "Day" }];
    const countOptions = [{ label: "Count", value: "Count" }];
    const [nonProductionUnitRateList, setNonProductionUnitRateList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, buttonStyles, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [taskcategoryCheck, setTaskcategorycheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');

    const [searchedString, setSearchedString] = useState("")
    const gridRefTable = useRef(null);
    const [isHandleChange, setIsHandleChange] = useState(false);



    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Non Production Unit Rate.png");
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
        category: true,
        subcategory: true,
        base: true,
        process: true,
        mindays: true,
        minhours: true,
        minminutes: true,
        maxdays: true,
        maxhours: true,
        maxminutes: true,
        rate: true,
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
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITRATE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteCategory(res?.data?.snonproductionunitrate);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    // Alert delete popup
    let taskcategorysid = deleteCategroy?._id;
    const delTaskCategory = async (e) => {
        setPageName(!pageName)
        try {
            if (taskcategorysid) {
                await axios.delete(`${SERVICE.NONPRODUCTIONUNITRATE_SINGLE}/${deleteCategroy?._id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchNonProductionUnitRate();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const delTaskCatecheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.NONPRODUCTIONUNITRATE_SINGLE}/${item}`, {
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
            await fetchNonProductionUnitRate();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [isBtn, setBtn] = useState(false)
    //add function 
    const sendRequest = async () => {
        setBtn(true)
        const rate = typeof nonProductionUnitRate.rate === 'number' ? Number(nonProductionUnitRate.rate.toFixed(2)) : nonProductionUnitRate.rate;
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.NONPRODUCTIONUNITRATE_CREATE, {
                categoryname: nonProductionUnitRate.category,
                subcategory: nonProductionUnitRate.subcategory,
                base: nonProductionUnitRate.base,
                process: nonProductionUnitRate.process,
                mindays: Number(nonProductionUnitRate.mindays),
                minhours: Number(nonProductionUnitRate.minhours),
                minminutes: Number(nonProductionUnitRate.minminutes),
                maxdays: Number(nonProductionUnitRate.maxdays),
                maxhours: Number(nonProductionUnitRate.maxhours),
                maxminutes: Number(nonProductionUnitRate.maxminutes),
                rate: rate,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchNonProductionUnitRate();
            setNonProductionUnitRate({
                ...nonProductionUnitRate, category: "Please Select Category",
                subcategory: "Please Select Sub Category",
                base: "Please Select Base",
                process: "Please Select Process",
                mindays: "",
                minhours: "",
                minminutes: "",
                maxdays: "",
                maxhours: "",
                maxminutes: "",
                rate: ""
            });
            setSubCategories([]);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBtn(false)
        } catch (err) {
            setBtn(false)
            if (err?.response?.data?.message == "Data Already Exist!") {
                setPopupContentMalert("Data Already Exist!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (nonProductionUnitRate.base === "Time") {
            if (nonProductionUnitRate.category === "" || nonProductionUnitRate.category === "Please Select Category") {
                setPopupContentMalert("Please Select Category");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (nonProductionUnitRate.subcategory === "" || nonProductionUnitRate.subcategory === "Please Select Sub Category") {
                setPopupContentMalert("Please Select Sub Category");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.base === "" || nonProductionUnitRate.base === "Please Select Base") {
                setPopupContentMalert("Please Select Base");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.process === "" || nonProductionUnitRate.process === "Please Select Process") {
                setPopupContentMalert("Please Select Process");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.mindays === "") {
                setPopupContentMalert("Please Enter Min Days");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.minhours === "") {
                setPopupContentMalert("Please Enter Min Hours");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.minminutes === "") {
                setPopupContentMalert("Please Enter Min Minutes");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.maxdays === "") {
                setPopupContentMalert("Please Enter Max Days");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.maxhours === "") {
                setPopupContentMalert("Please Enter Max Hours");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.maxminutes === "") {
                setPopupContentMalert("Please Enter Max Minutes");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (Number(nonProductionUnitRate.maxdays) < Number(nonProductionUnitRate.mindays)) {
                setPopupContentMalert("Max Days Should Be Greater Than Min Days");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (Number(nonProductionUnitRate.maxhours) < Number(nonProductionUnitRate.minhours)) {
                setPopupContentMalert("Max Hours Should Be Greater Than Min Hours");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (Number(nonProductionUnitRate.maxminutes) < Number(nonProductionUnitRate.minminutes)) {
                setPopupContentMalert("Max Minutes Should Be Greater Than Min Minutes");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest();
            }
        } else {
            if (nonProductionUnitRate.category === "" || nonProductionUnitRate.category === "Please Select Category") {
                setPopupContentMalert("Please Select Category");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.subcategory === "" || nonProductionUnitRate.subcategory === "Please Select Sub Category") {
                setPopupContentMalert("Please Select Sub Category");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.base === "" || nonProductionUnitRate.base === "Please Select Base") {
                setPopupContentMalert("Please Select Base");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.process === "" || nonProductionUnitRate.process === "Please Select Process") {
                setPopupContentMalert("Please Select Process");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRate.rate === "") {
                setPopupContentMalert("Please Enter Rate");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest();
            }
        }
    }
    const handleClear = (e) => {
        e.preventDefault();
        setNonProductionUnitRate({
            category: "Please Select Category",
            subcategory: "Please Select Sub Category",
            base: "Please Select Base",
            process: "Please Select Process",
            mindays: "",
            minhours: "",
            minminutes: "",
            maxdays: "",
            maxhours: "",
            maxminutes: "",
            rate: ""
        })
        setSearchQuery("")
        setPageSize(10)
        setFilteredChanges(null)
        setFilteredRowData([])
        setSubCategories([]);
        fetchNonProductionUnitRate()
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
    //get all Sub vendormasters.
    const fetchCategoryDropdown = async () => {
        setPageName(!pageName)
        try {
            let resCategory = await axios.get(SERVICE.CATEGORYANDSUBCATEGORYGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategories(resCategory.data.categoryandsubcategory.map((data) => ({
                label: data.categoryname, value: data.categoryname
            })))
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const handleCategoryChange = async (e) => {
        setPageName(!pageName)
        try {
            let resCategory = await axios.get(SERVICE.CATEGORYANDSUBCATEGORYGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const CatOpt = [...resCategory?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            setCategories(CatOpt)
            let result = resCategory?.data?.categoryandsubcategory.find((d) => d.categoryname === e.value);
            const subcatealls = result?.subcategoryname?.map((d) => ({
                label: d,
                value: d,
            }));
            setSubCategories(subcatealls)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const handleCategoryChangeEdit = async (e) => {
        setPageName(!pageName)
        try {
            let resCategory = await axios.get(SERVICE.CATEGORYANDSUBCATEGORYGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const CatOpt = [...resCategory?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            setCategories(CatOpt)
            let result = resCategory?.data?.categoryandsubcategory.find((d) => d.categoryname === e);
            const subcatealls = result?.subcategoryname?.map((d) => ({
                label: d,
                value: d,
            }));
            // setSubCatOptAllot(subcatealls)
            setSubCategoriesEdit(subcatealls)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    //get single row to edit....
    const getCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITRATE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionUnitRateEdit((prev) => {
                return { ...prev, ...res?.data?.snonproductionunitrate, category: res?.data?.snonproductionunitrate.categoryname };
            });
            handleCategoryChangeEdit(res?.data?.snonproductionunitrate.categoryname)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITRATE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionUnitRateEdit({ ...res?.data?.snonproductionunitrate, category: res?.data?.snonproductionunitrate.categoryname });
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITRATE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionUnitRateEdit(res?.data?.snonproductionunitrate);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //Project updateby edit page...
    let updateby = nonProductionUnitRateEdit?.updatedby;
    let addedby = nonProductionUnitRateEdit?.addedby;
    let subprojectsid = nonProductionUnitRateEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        const rate = typeof nonProductionUnitRateEdit.rate === 'number' ? Number(nonProductionUnitRateEdit.rate.toFixed(2)) : nonProductionUnitRateEdit.rate;
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.NONPRODUCTIONUNITRATE_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: nonProductionUnitRateEdit.category,
                subcategory: nonProductionUnitRateEdit.subcategory,
                base: nonProductionUnitRateEdit.base,
                process: nonProductionUnitRateEdit.process,
                mindays: Number(nonProductionUnitRateEdit.mindays),
                minhours: Number(nonProductionUnitRateEdit.minhours),
                minminutes: Number(nonProductionUnitRateEdit.minminutes),
                maxdays: Number(nonProductionUnitRateEdit.maxdays),
                maxhours: Number(nonProductionUnitRateEdit.maxhours),
                maxminutes: Number(nonProductionUnitRateEdit.maxminutes),
                rate: rate,
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchNonProductionUnitRate();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            if (err?.response?.data?.message == "Data Already Exist!") {
                setPopupContentMalert("Data Already Exist!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    }
    const editSubmit = (e) => {
        e.preventDefault();
        if (nonProductionUnitRateEdit.base === "Time") {
            if (nonProductionUnitRateEdit.category === "" || nonProductionUnitRateEdit.category === "Please Select Category") {
                setPopupContentMalert("Please Select Category");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.subcategory === "" || nonProductionUnitRateEdit.subcategory === "Please Select Sub Category") {
                setPopupContentMalert("Please Select Sub Category");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.base === "" || nonProductionUnitRateEdit.base === "Please Select Base") {
                setPopupContentMalert("Please Select Base");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.process === "" || nonProductionUnitRateEdit.process === "Please Select Process") {
                setPopupContentMalert("Please Select Process");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.mindays === "") {
                setPopupContentMalert("Please Enter Min Days");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.minhours === "") {
                setPopupContentMalert("Please Enter Min Hours");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.minminutes === "") {
                setPopupContentMalert("Please Enter Min Minutes");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.maxdays === "") {
                setPopupContentMalert("Please Enter Max Days");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.maxhours === "") {
                setPopupContentMalert("Please Enter Max Hours");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.maxminutes === "") {
                setPopupContentMalert("Please Enter Max Minutes");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (Number(nonProductionUnitRateEdit.maxdays) < Number(nonProductionUnitRateEdit.mindays)) {
                setPopupContentMalert("Max Days Should Be Greater Than Min Days");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (Number(nonProductionUnitRateEdit.maxhours) < Number(nonProductionUnitRateEdit.minhours)) {
                setPopupContentMalert("Max Hours Should Be Greater Than Min Hours");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (Number(nonProductionUnitRateEdit.maxminutes) < Number(nonProductionUnitRateEdit.minminutes)) {
                setPopupContentMalert("Max Minutes Should Be Greater Than Min Minutes");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                sendEditRequest();
            }
        } else {
            if (nonProductionUnitRateEdit.category === "" || nonProductionUnitRateEdit.category === "Please Select Category") {
                setPopupContentMalert("Please Select Category");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.subcategory === "" || nonProductionUnitRateEdit.subcategory === "Please Select Sub Category") {
                setPopupContentMalert("Please Select Sub Category");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.base === "" || nonProductionUnitRateEdit.base === "Please Select Base") {
                setPopupContentMalert("Please Select Base");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.process === "" || nonProductionUnitRateEdit.process === "Please Select Process") {
                setPopupContentMalert("Please Select Process");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (nonProductionUnitRateEdit.rate === "") {
                setPopupContentMalert("Please Enter Rate");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                sendEditRequest();
            }
        }
    }
    const [nonProductionUnitRateListOverall, setNonProductionUnitRateListOverall] = useState([])
    //get all Sub vendormasters.
    const fetchNonProductionUnitRateOverall = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.NONPRODUCTIONUNITRATEGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionUnitRateListOverall(res_vendor?.data?.nonproductionunitrate.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    category: item.categoryname,
                    subcategory: item.subcategory,
                    base: item.base,
                    process: item.process,
                    mindays: item.mindays,
                    minhours: item.minhours,
                    minminutes: item.minminutes,
                    maxdays: item.maxdays,
                    maxhours: item.maxhours,
                    maxminutes: item.maxminutes,
                    rate: item.rate
                }
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    useEffect(() => {
        fetchNonProductionUnitRateOverall()
    }, [isFilterOpen, isPdfFilterOpen])
    const fetchNonProductionUnitRate = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.NONPRODUCTIONUNITRATEGETALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTaskcategorycheck(true)
            setNonProductionUnitRateList(res_vendor?.data?.nonproductionunitrate?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                category: item.categoryname,
            })));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const exportColumnNames = [
        'Category',
        'Sub Category', 'Base',
        'Process', 'Min Days',
        'Min Hours', 'Min Minutes',
        'Max Days', 'Max Hours',
        'Max Minutes', 'Rate'
    ]
    const exportRowValues = [
        'category',
        'subcategory', 'base',
        'process', 'mindays',
        'minhours', 'minminutes',
        'maxdays', 'maxhours',
        'maxminutes', 'rate'
    ]
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Non Production Unit Rate',
        pageStyle: 'print'
    });

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Non Production Unit Rate"),
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
        getapi()
        fetchNonProductionUnitRate();
        fetchCategoryDropdown();
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
    };
    useEffect(() => {
        addSerialNumber(nonProductionUnitRateList);
    }, [nonProductionUnitRateList]);

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
            pinned: 'left', lockPinned: true,
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header", pinned: 'left',
        },
        { field: "category", headerName: "Category", flex: 0, width: 100, hide: !columnVisibility.category, headerClassName: "bold-header", pinned: 'left', },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 150, hide: !columnVisibility.subcategory, headerClassName: "bold-header", pinned: 'left', },
        { field: "base", headerName: "Base", flex: 0, width: 100, hide: !columnVisibility.base, headerClassName: "bold-header" },
        { field: "process", headerName: "Process", flex: 0, width: 100, hide: !columnVisibility.process, headerClassName: "bold-header" },
        { field: "mindays", headerName: "Min Days", flex: 0, width: 120, hide: !columnVisibility.mindays, headerClassName: "bold-header" },
        { field: "minhours", headerName: "Min Hours", flex: 0, width: 120, hide: !columnVisibility.minhours, headerClassName: "bold-header" },
        { field: "minminutes", headerName: "Min Minutes", flex: 0, width: 120, hide: !columnVisibility.minminutes, headerClassName: "bold-header" },
        { field: "maxdays", headerName: "Max Days", flex: 0, width: 120, hide: !columnVisibility.maxdays, headerClassName: "bold-header" },
        { field: "maxhours", headerName: "Max Hours", flex: 0, width: 120, hide: !columnVisibility.maxhours, headerClassName: "bold-header" },
        { field: "maxminutes", headerName: "Max Minutes", flex: 0, width: 120, hide: !columnVisibility.maxminutes, headerClassName: "bold-header" },
        { field: "rate", headerName: "Rate", flex: 0, width: 120, hide: !columnVisibility.rate, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 280,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("enonproductionunitrate") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            getCode(params.data.id);
                        }}>
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dnonproductionunitrate") && (
                        <Button sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name)
                            }}>
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />                                </Button>
                    )}
                    {isUserRoleCompare?.includes("vnonproductionunitrate") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("inonproductionunitrate") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
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
            category: item.category,
            subcategory: item.subcategory,
            base: item.base,
            process: item.process,
            mindays: item.mindays,
            minhours: item.minhours,
            minminutes: item.minminutes,
            maxdays: item.maxdays,
            maxhours: item.maxhours,
            maxminutes: item.maxminutes,
            rate: item.rate
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
    return (
        <Box>
            <Headtitle title={"Non Production Unit Rate"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Non Production Unit Rate"
                modulename="Production"
                submodulename="Non Production"
                mainpagename="Non-production Setup"
                subpagename="Non Production Unit Rate"
                subsubpagename=""
            />                {/* ****** Header Content ****** */}
            {isUserRoleCompare?.includes("anonproductionunitrate")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Non Production Unit Rate</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={categories}
                                                // styles={colourStyles}
                                                value={{
                                                    label: nonProductionUnitRate.category,
                                                    value: nonProductionUnitRate.category,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionUnitRate({
                                                        ...nonProductionUnitRate,
                                                        category: e.value, subcategory: "Please Select Sub Category",
                                                    });
                                                    setSubCategories([]);
                                                    handleCategoryChange(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Category <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={subCategories}
                                                // styles={colourStyles}
                                                value={{
                                                    label: nonProductionUnitRate.subcategory,
                                                    value: nonProductionUnitRate.subcategory,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionUnitRate({
                                                        ...nonProductionUnitRate,
                                                        subcategory: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Base <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={BaseOptions}
                                                // styles={colourStyles}
                                                value={{
                                                    label: nonProductionUnitRate.base,
                                                    value: nonProductionUnitRate.base,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionUnitRate({
                                                        ...nonProductionUnitRate,
                                                        base: e.value, process: "Please Select Process"
                                                    });
                                                    if (e.value === "Time") {
                                                        setNonProductionUnitRate((prev) => ({
                                                            ...prev, rate: 1.00, mindays: "", minhours: "", minminutes: "", maxdays: "", maxhours: "", maxminutes: ""
                                                        }))
                                                    } else {
                                                        setNonProductionUnitRate((prev) => ({
                                                            ...prev, mindays: 0, minhours: 0, minminutes: 0, maxdays: 0, maxhours: 0, maxminutes: 0, rate: ""
                                                        }))
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Process <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={(nonProductionUnitRate.base === "Time") ? timeOptions : (nonProductionUnitRate.base === "Count") ? countOptions : []}
                                                // styles={colourStyles}
                                                value={{
                                                    label: nonProductionUnitRate.process,
                                                    value: nonProductionUnitRate.process,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionUnitRate({
                                                        ...nonProductionUnitRate,
                                                        process: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}></Grid>
                                    <Grid item md={4} xs={12} sm={12}></Grid>
                                    {nonProductionUnitRate.base === "Time" ? <><Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Min Days<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                inputMode="decimal"
                                                pattern="[0-9]*"
                                                placeholder="Please Enter Min Days"
                                                value={nonProductionUnitRate.mindays}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Regular expression to allow only numbers with up to two decimal places
                                                    const regex = /^\d*\.?\d{0,2}$/;
                                                    // Check if the input value matches the regex pattern
                                                    if (regex.test(value) || value === '') {
                                                        // If the input is valid, update the state
                                                        setNonProductionUnitRate({ ...nonProductionUnitRate, mindays: e.target.value });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Hours <b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Min Hours"
                                                    value={nonProductionUnitRate.minhours}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, minhours: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Minutes <b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Min Minutes"
                                                    value={nonProductionUnitRate.minminutes}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, minminutes: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Days<b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Max Days"
                                                    value={nonProductionUnitRate.maxdays}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, maxdays: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Hours <b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Max Hours"
                                                    value={nonProductionUnitRate.maxhours}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, maxhours: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Minutes <b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Max Minutes"
                                                    value={nonProductionUnitRate.maxminutes}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, maxminutes: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Rate</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    disabled={true}
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Rate"
                                                    value={nonProductionUnitRate.rate.toFixed(2)}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, rate: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid> </> : <><Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Days</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Min Days"
                                                    value={nonProductionUnitRate.mindays}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, mindays: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Hours </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Min Hours"
                                                    value={nonProductionUnitRate.minhours}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, minhours: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Minutes</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Min Minutes"
                                                    disabled={true}
                                                    value={nonProductionUnitRate.minminutes}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, minminutes: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Days</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Max Days"
                                                    value={nonProductionUnitRate.maxdays}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, maxdays: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Hours </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Max Hours"
                                                    value={nonProductionUnitRate.maxhours}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, maxhours: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Minutes </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Max Minutes"
                                                    value={nonProductionUnitRate.maxminutes}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, maxminutes: e.target.value });
                                                        }
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
                                                    value={nonProductionUnitRate.rate}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRate({ ...nonProductionUnitRate, rate: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid> </>}
                                    <Grid item md={4} sm={12} xs={12}>
                                        <Typography>&nbsp;</Typography>
                                        <Grid
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "15px",
                                            }}
                                        >
                                            <Button sx={buttonStyles.buttonsubmit}
                                                onClick={handleSubmit}
                                                disabled={isBtn}
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
                    maxWidth="md"
                    sx={{ marginTop: "80px" }}

                >
                    <Box sx={{ width: "full-width", padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Non Production Unit Rate</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={categories}
                                                // styles={colourStyles}
                                                value={{
                                                    label: nonProductionUnitRateEdit.category,
                                                    value: nonProductionUnitRateEdit.category,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionUnitRateEdit({
                                                        ...nonProductionUnitRateEdit,
                                                        category: e.value, subcategory: "Please Select Sub Category",
                                                    });
                                                    setSubCategoriesEdit([]);
                                                    handleCategoryChangeEdit(e.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Category <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={subCategoriesEdit}
                                                // styles={colourStyles}
                                                value={{
                                                    label: nonProductionUnitRateEdit.subcategory,
                                                    value: nonProductionUnitRateEdit.subcategory,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionUnitRateEdit({
                                                        ...nonProductionUnitRateEdit,
                                                        subcategory: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Base <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={BaseOptions}
                                                // styles={colourStyles}
                                                value={{
                                                    label: nonProductionUnitRateEdit.base,
                                                    value: nonProductionUnitRateEdit.base,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionUnitRateEdit({
                                                        ...nonProductionUnitRateEdit,
                                                        base: e.value, process: "Please Select Process"
                                                    });
                                                    if (e.value === "Time") {
                                                        setNonProductionUnitRateEdit((prev) => ({
                                                            ...prev, rate: 1.00, mindays: "", minhours: "", minminutes: "", maxdays: "", maxhours: "", maxminutes: ""
                                                        }))
                                                    } else {
                                                        setNonProductionUnitRateEdit((prev) => ({
                                                            ...prev, mindays: 0, minhours: 0, minminutes: 0, maxdays: 0, maxhours: 0, maxminutes: 0, rate: ""
                                                        }))
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Process <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={(nonProductionUnitRateEdit.base === "Time") ? timeOptions : (nonProductionUnitRateEdit.base === "Count") ? countOptions : []}
                                                // styles={colourStyles}
                                                value={{
                                                    label: nonProductionUnitRateEdit.process,
                                                    value: nonProductionUnitRateEdit.process,
                                                }}
                                                onChange={(e) => {
                                                    setNonProductionUnitRateEdit({
                                                        ...nonProductionUnitRateEdit,
                                                        process: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}></Grid>
                                    <Grid item md={4} xs={12} sm={12}></Grid>
                                    {nonProductionUnitRateEdit.base === "Time" ? <><Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Min Days<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                inputMode="decimal"
                                                pattern="[0-9]*"
                                                placeholder="Please Enter Min Days"
                                                value={nonProductionUnitRateEdit.mindays}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Regular expression to allow only numbers with up to two decimal places
                                                    const regex = /^\d*\.?\d{0,2}$/;
                                                    // Check if the input value matches the regex pattern
                                                    if (regex.test(value) || value === '') {
                                                        // If the input is valid, update the state
                                                        setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, mindays: e.target.value });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Hours <b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Min Hours"
                                                    value={nonProductionUnitRateEdit.minhours}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, minhours: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Minutes <b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Min Minutes"
                                                    value={nonProductionUnitRateEdit.minminutes}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, minminutes: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Days<b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Max Days"
                                                    value={nonProductionUnitRateEdit.maxdays}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, maxdays: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Hours <b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Max Hours"
                                                    value={nonProductionUnitRateEdit.maxhours}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, maxhours: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Minutes <b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Max Minutes"
                                                    value={nonProductionUnitRateEdit.maxminutes}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, maxminutes: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Rate</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    disabled={true}
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Rate"
                                                    value={nonProductionUnitRateEdit.rate.toFixed(2)}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, rate: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid> </> : <><Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Days</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Min Days"
                                                    value={nonProductionUnitRateEdit.mindays}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, mindays: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Hours </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Min Hours"
                                                    value={nonProductionUnitRateEdit.minhours}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, maxhours: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Min Minutes</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    placeholder="Please Enter Min Minutes"
                                                    disabled={true}
                                                    value={nonProductionUnitRateEdit.minminutes}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, maxminutes: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Days</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Max Days"
                                                    value={nonProductionUnitRateEdit.maxdays}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, maxdays: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Hours </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Max Hours"
                                                    value={nonProductionUnitRateEdit.maxhours}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, maxhours: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>Max Minutes </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="[0-9]*"
                                                    disabled={true}
                                                    placeholder="Please Enter Max Minutes"
                                                    value={nonProductionUnitRateEdit.maxminutes}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, maxminutes: e.target.value });
                                                        }
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
                                                    value={nonProductionUnitRateEdit.rate}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Regular expression to allow only numbers with up to two decimal places
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        // Check if the input value matches the regex pattern
                                                        if (regex.test(value) || value === '') {
                                                            // If the input is valid, update the state
                                                            setNonProductionUnitRateEdit({ ...nonProductionUnitRateEdit, rate: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid> </>} </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.buttonsubmit} type="submit">Update</Button>
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
            {isUserRoleCompare?.includes("lnonproductionunitrate") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Non Production Unit Rate List</Typography>
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
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelnonproductionunitrate") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchNonProductionUnitRateOverall()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvnonproductionunitrate") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchNonProductionUnitRateOverall()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printnonproductionunitrate") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfnonproductionunitrate") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchNonProductionUnitRateOverall()
                                                }}>
                                                <FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagenonproductionunitrate") && (
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
                                    maindatas={nonProductionUnitRateList}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={nonProductionUnitRateList}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdnonproductionunitrate") && (
                            <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}
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
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={nonProductionUnitRateList} />


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
                mx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Non Production Unit Rate</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{nonProductionUnitRateEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Category</Typography>
                                    <Typography>{nonProductionUnitRateEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Base</Typography>
                                    <Typography>{nonProductionUnitRateEdit.base}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Process</Typography>
                                    <Typography>{nonProductionUnitRateEdit.process}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Min Days</Typography>
                                    <Typography>{nonProductionUnitRateEdit.mindays}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Min Hours</Typography>
                                    <Typography>{nonProductionUnitRateEdit.minhours}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Min Minutes</Typography>
                                    <Typography>{nonProductionUnitRateEdit.minminutes}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Max Days</Typography>
                                    <Typography>{nonProductionUnitRateEdit.maxdays}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Max Hours</Typography>
                                    <Typography>{nonProductionUnitRateEdit.maxhours}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Max Minutes</Typography>
                                    <Typography>{nonProductionUnitRateEdit.maxminutes}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Rate</Typography>
                                    <Typography>{nonProductionUnitRateEdit.rate}</Typography>
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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={nonProductionUnitRateListOverall ?? []}
                filename={"Non Production Unit Rate"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
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
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Non Production Unit Rate Info"
                addedby={addedby}
                updateby={updateby}
            />
        </Box>
    );
}
export default Nonproductionunitrate;