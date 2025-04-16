import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, Switch, TextField, Typography } from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function SubCategoryMaster() {

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

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    let exportColumnNames = ["Catgory Template Name", "SubCategory Template Name"];
    let exportRowValues = ["categoryname", "subcategoryname"];

    const [isBtn, setIsBtn] = useState(false);
    const [category, setCategory] = useState({ categoryname: "Please Select Category Template Name" });
    const [subCategoryTodo, setSubcategoryTodo] = useState([]);
    const [subcategory, setSubcategory] = useState("");
    const [isFirstSubCateView, setIsFirstSubCateView] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [items, setItems] = useState([]);
    const [categorycheck, setCategoryCheck] = useState(false);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [singleCategory, setSingleCategory] = useState({});
    const [editTodo, setEditTodo] = useState([]);
    const [subcategoryEdit, setSubCategoryEdit] = useState("");
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [subDuplicate, setSubDuplicate] = useState([]);

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "SubCategory Template Master.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
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

    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
        setSearchQueryManage("");
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const [editOpen, setEditOpen] = useState(false);
    const handleEditOpen = () => {
        setEditOpen(true);
    };
    const handleEditClose = () => {
        setEditOpen(false);
    };
    const [openDelete, setOpenDelete] = useState(false);
    const handleClickOpen = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const [openView, setOpenView] = useState(false);
    const handleViewOpen = () => {
        setOpenView(true);
    };
    const handlViewClose = () => {
        setOpenView(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const [projects, setProjects] = useState([]);
    //fetching Project for Dropdowns
    const fetchCategoryMasters = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.CATEGORYMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projall = [
                ...res?.data?.categorymasters.map((d) => ({
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                })),
            ];
            setProjects(projall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchCategoryMasters();
    }, []);

    const delAccountcheckbox = async () => {
        setPageName(!pageName);
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SUBCATEGORYMASTER_SINGLE}/${item}`, {
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

            await getCategoryList();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true)
        const subcategoryName = subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
        try {
            let res_queue = await axios.post(SERVICE.SUBCATEGORYMASTER_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                categoryname: String(category.categoryname),
                subcategoryname: subcategoryName,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setSubcategoryTodo([]);
            setSubcategory("");
            setCategory({ ...category, categoryname: "Please Select Category Template Name" });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false)
            await getCategoryList();
        } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleClear = () => {
        setSubcategoryTodo([]);
        setSubcategory("");
        setCategory({ ...category, categoryname: "Please Select Category Template Name" });
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //Project updateby edit page...
    let updateby = singleCategory?.updatedby;
    let addedby = singleCategory?.addedby;

    let subprojectsid = singleCategory?._id;

    const sendRequestEdit = async () => {
        setPageName(!pageName);
        const subcategoryName = subcategoryEdit.length !== 0 || "" ? [...editTodo, subcategoryEdit] : [...editTodo];
        try {
            let res = await axios.put(`${SERVICE.SUBCATEGORYMASTER_SINGLE}/${subprojectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                categoryname: String(singleCategory.categoryname),
                subcategoryname: [...editTodo],
                updatedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await getCategoryList();
            setSubCategoryEdit("");
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleEditClose();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const getCategoryList = async () => {
        setPageName(!pageName);
        setCategoryCheck(false)
        try {
            let response = await axios.get(`${SERVICE.SUBCATEGORYMASTER}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategoryList(response.data.subcategorymaster);
            setCategoryCheck(true);
        } catch (err) { setCategoryCheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const getCategoryListAll = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(`${SERVICE.SUBCATEGORYMASTER}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            return response.data.subcategorymaster.filter((data) => data._id !== singleCategory._id)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    const EditTodoPopup = () => {
        if (subcategoryEdit === "") {
            setPopupContentMalert("Please Enter Subcategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (editTodo.some((item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase())) {
            setPopupContentMalert("Already Added ! Please Enter Another Subcategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setEditTodo([...editTodo, subcategoryEdit]);
            setSubCategoryEdit("");
        }
    };

    const getCode = async (id) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SUBCATEGORYMASTER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleCategory(res?.data?.ssubcategorymaster);
            setEditTodo(res?.data?.ssubcategorymaster?.subcategoryname);
            handleEditOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [checkUser, setCheckUser] = useState();

    const rowData = async (id, catname, subcatarr) => {
        setPageName(!pageName);
        try {
            const [res, resuser] = await Promise.all([
                axios.get(`${SERVICE.SUBCATEGORYMASTER_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.OVERALL_SUBCATEGORYMASTER, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    catname: String(catname),
                    subcatarr: subcatarr,
                })
            ])

            setSingleCategory(res?.data?.ssubcategorymaster);
            setDeleteId(res?.data?.ssubcategorymaster?._id);
            setCheckUser(resuser?.data?.count);
            if (resuser?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const getviewCode = async (id) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SUBCATEGORYMASTER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleCategory(res?.data?.ssubcategorymaster);
            setEditTodo(res?.data?.ssubcategorymaster?.subcategoryname);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [deleteId, setDeleteId] = useState({});

    const deleteData = async (id) => {
        setPageName(!pageName);
        try {
            let res = await axios.delete(`${SERVICE.SUBCATEGORYMASTER_SINGLE}/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await getCategoryList();
            handleCloseDelete();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const getinfoCode = async (id) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SUBCATEGORYMASTER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleCategory(res?.data?.ssubcategorymaster);
            setEditTodo(res?.data?.ssubcategorymaster?.subcategoryname);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const addTodo = () => {
        getCategoryList();
        const isSubNameMatch = subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase());

        if (subcategory === "") {
            setPopupContentMalert("Please Enter Subcategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isSubNameMatch) {
            setPopupContentMalert("Already Added ! Please Enter Another Subcategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase())) {
            setPopupContentMalert("Already Added ! Please Enter Another Subcategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setSubcategoryTodo([...subCategoryTodo, subcategory]);
            setSubcategory("");
        }
    };

    const handleTodoEdit = (index, newValue) => {
        const isDuplicate = subCategoryTodo.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
        const updatedTodos = [...subCategoryTodo];
        updatedTodos[index] = newValue;
        setSubcategoryTodo(updatedTodos);
    };

    const handleTodoEditPop = (index, newValue) => {
        const onlSub = categoryList.map((data) => data.subcategoryname);
        let concatenatedArray = [].concat(...onlSub);

        // Check if newValue already exists in the editDuplicate array
        const isDuplicate = concatenatedArray.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());


        // If no duplicate is found, update the editTodo array
        const updatedTodos = [...editTodo];
        updatedTodos[index] = newValue;

        setEditTodo(updatedTodos);
    };

    const handleSubmit = () => {
        let matchValue = subCategoryTodo.filter((data) => data === subCategoryTodo.includes(data));
        // const isNameMatch = categoryList?.some((item) => item?.categoryname?.toLowerCase() === category?.categoryname.toLowerCase());
        const isNameMatch = categoryList?.some((item) => item.categoryname === String(category.categoryname));
        const isSubNameMatch = subDuplicate.some((item) => subCategoryTodo.includes(item));

        if (isNameMatch) {
            setPopupContentMalert("Already Added ! Please Enter Another Category Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isSubNameMatch) {
            setPopupContentMalert("Already Added ! Please Enter Another Subcategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (category.categoryname === "Please Select Category Template Name") {
            setPopupContentMalert("Please Select Category Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subcategory !== "") {
            setPopupContentMalert("Add SubCategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subcategory.length > 0 && subCategoryTodo.length === 0) {
            setPopupContentMalert("Please Enter SubCategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subCategoryTodo.some((item) => item === "")) {
            setPopupContentMalert("Please Enter SubCategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (subCategoryTodo.some((item) => item === "")) {
            setPopupContentMalert("Please Enter SubCategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subCategoryTodo.length !== new Set(subCategoryTodo.map(item => item.toLowerCase())).size) {
            setPopupContentMalert("Already Added ! Please Enter Another Subcategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return;
        }
        else if (subCategoryTodo.length === 0) {
            setPopupContentMalert("Please Enter Sub Category Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    const handleSubmitEdit = async () => {
        let resdata = await getCategoryListAll();
        // const isNameMatch = resdata?.some((item) => item?.categoryname?.toLowerCase() === singleCategory?.categoryname.toLowerCase());
        const isNameMatch = resdata?.some((item) => item.categoryname === String(singleCategory.categoryname));
        const correctedArray = Array.isArray(editTodo) ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];

        if (isNameMatch) {
            setPopupContentMalert("Already Added ! Please Enter Another Category Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (singleCategory.categoryname === "") {
            setPopupContentMalert("Please Select Category Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subcategoryEdit !== "") {
            setPopupContentMalert("Add SubCategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editTodo.some((item) => item === "")) {
            setPopupContentMalert("Please Enter SubCategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (editTodo.length == 0) {
            setPopupContentMalert("Please Enter SubCategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (editTodo.length > 0 && editTodo.length === 0) {
            setPopupContentMalert("Please Insert SubCategory ");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (editTodo.length !== new Set(editTodo.map(item => item.toLowerCase())).size) {

            setPopupContentMalert("Already Added ! Please Enter Another Subcategory Template Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return;
        }


        else {
            sendRequestEdit();
        }
    };

    const deleteTodo = (index) => {
        const updatedTodos = [...subCategoryTodo];
        updatedTodos.splice(index, 1);
        setSubcategoryTodo(updatedTodos);
    };

    const deleteTodoEdit = (index) => {
        const updatedTodos = [...editTodo];
        updatedTodos.splice(index, 1);
        setEditTodo(updatedTodos);
    };

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        serialNumber: true,
        categoryname: true,
        categorycode: true,
        subcategoryname: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    //serial no for listing items 
    const addSerialNumber = () => {
        const itemsWithSerialNumber = categoryList?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [categoryList])

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
    const [searchQuery, setSearchQuery] = useState("");
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

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(Math.abs(firstVisiblePage + visiblePages - 1), totalPages);

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
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },

        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "categoryname",
            headerName: "Category Template Name",
            flex: 0,
            width: 230,
            minHeight: "40px",
            hide: !columnVisibility.categoryname,
        },
        {
            field: "subcategoryname",
            headerName: "SubCategory Template Name",

            flex: 0,
            width: 230,
            minHeight: "40px",
            hide: !columnVisibility.subcategoryname,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 230,
            hide: !columnVisibility.actions,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("esubcategorymaster") && (
                        <Button
                            onClick={() => {
                                getCode(params.row.id);
                            }}
                            sx={userStyle.buttonedit}
                            style={{ minWidth: "0px" }}
                        >
                            <EditOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dsubcategorymaster") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.categoryname, params.row.subcategoryarr);

                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vsubcategorymaster") && (
                        <Button
                            sx={userStyle.buttonview}
                            onClick={(e) => {
                                getviewCode(params.row.id);
                                handleViewOpen();
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("isubcategorymaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
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

    const rowDataTable = filteredData.map((item, index) => {
        const correctedArray = Array.isArray(item?.subcategoryname) ? item.subcategoryname.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item.categoryname,
            subcategoryname: correctedArray.toString(),
            subcategoryarr: item?.subcategoryname,
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "SubCategory Template Master",
        pageStyle: "print",
    });


    return (
        <Box>
            <Headtitle title={"SUBCATEGORY MASTER"} />
            <PageHeading
                title="Manage Subcategory Template"
                modulename="Template"
                submodulename="Master"
                mainpagename="Subcategory Master"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("asubcategorymaster") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>Add Subcategory Template</Typography>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>
                                    Category Template Name <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={projects}
                                        styles={colourStyles}
                                        //   value={category.categoryname}
                                        value={{ label: category.categoryname, value: category.categoryname }}
                                        onChange={(e) => {
                                            setCategory({
                                                ...category,
                                                categoryname: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>

                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        SubCategory Template Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory Template Name" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
                                </FormControl>
                                &emsp;
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
                                &nbsp;
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                {subCategoryTodo.length > 0 && (
                                    <ul type="none">
                                        {subCategoryTodo.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <br />
                                                    <Grid sx={{ display: "flex" }}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                {" "}
                                                                SubCategory Template Name<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory Template Name" value={item} onChange={(e) => handleTodoEdit(index, e.target.value)} />
                                                        </FormControl>
                                                        &emsp;
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
                                                        &nbsp; &emsp;
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            type="button"
                                                            onClick={(e) => deleteTodo(index)}
                                                            sx={{
                                                                height: "30px",
                                                                minWidth: "30px",
                                                                marginTop: "28px",
                                                                padding: "6px 10px",
                                                            }}
                                                        >
                                                            <AiOutlineClose />
                                                        </Button>
                                                    </Grid>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
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
                                    <LoadingButton variant="contained" onClick={handleSubmit} loading={isBtn}>
                                        SAVE
                                    </LoadingButton>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6" style={{ fontSize: "20px", fontWeight: 900 }}>
                            {showAlert}
                        </Typography>
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
            <Box>
                <Dialog maxWidth="lg" open={editOpen} onClose={handleEditClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>Edit Subcategory Template</Typography>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>
                                    Category Template Name <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={projects}
                                        styles={colourStyles}
                                        value={{ label: singleCategory.categoryname, value: singleCategory.categoryname }}
                                        onChange={(e) => {
                                            setSingleCategory({
                                                ...singleCategory,
                                                categoryname: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>

                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        SubCategory Template Name <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput id="component-outlined"
                                        placeholder="Please Enter SubCategory Template Name"
                                        value={subcategoryEdit} onChange={(e) => setSubCategoryEdit(e.target.value)} />
                                </FormControl>
                                &emsp;
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={EditTodoPopup}
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
                                &nbsp;
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                {editTodo.length > 0 && (
                                    <ul type="none">
                                        {editTodo.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <br />
                                                    <Grid sx={{ display: "flex" }}>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                placeholder="Please Enter SubCategory Template Name"
                                                                value={item}
                                                                onChange={(e) => {
                                                                    handleTodoEditPop(index, e.target.value);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        &emsp;
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={EditTodoPopup}
                                                            type="button"
                                                            sx={{
                                                                height: "30px",
                                                                minWidth: "30px",
                                                                marginTop: "5px",
                                                                padding: "6px 10px",
                                                            }}
                                                        >
                                                            <FaPlus />
                                                        </Button>
                                                        &nbsp; &emsp;
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            type="button"
                                                            onClick={(e) => deleteTodoEdit(index)}
                                                            sx={{
                                                                height: "30px",
                                                                minWidth: "30px",
                                                                marginTop: "5px",
                                                                padding: "6px 10px",
                                                            }}
                                                        >
                                                            <AiOutlineClose />
                                                        </Button>
                                                    </Grid>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
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
                                    <Button variant="contained" onClick={handleSubmitEdit}>
                                        Update
                                    </Button>
                                    <Button
                                        sx={userStyle.btncancel}
                                        onClick={() => {
                                            handleEditClose();
                                            setSubCategoryEdit("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Box>
            <Box>
                <Dialog maxWidth="lg" open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>View Subcategory Template</Typography>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                {!isFirstSubCateView && (
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category Template Name
                                        </Typography>
                                        <OutlinedInput readOnly id="component-outlined" type="text" value={singleCategory.categoryname} />
                                    </FormControl>
                                )}
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>

                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}></Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <Typography>
                                    SubCategory Template Name
                                </Typography>

                                {editTodo.length > 0 && (
                                    <ul type="none">
                                        {editTodo.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <br />
                                                    <Grid sx={{ display: "flex" }}>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory Template Name" value={item} />
                                                        </FormControl>
                                                        &emsp;
                                                    </Grid>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
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
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            handlViewClose();
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Box>
            <br />
            <br />
            {isUserRoleCompare?.includes("lsubcategorymaster") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>Subcategory Template List</Typography>
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
                                        </Select>
                                        <label htmlFor="pageSizeSelect">&ensp;</label>
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
                                    {/* <Box > */}
                                    {isUserRoleCompare?.includes("excelsubcategorymaster") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>

                                    )}
                                    {isUserRoleCompare?.includes("csvsubcategorymaster") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printsubcategorymaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfsubcategorymaster") && (

                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>

                                    )}
                                    {isUserRoleCompare?.includes("imagesubcategorymaster") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
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
                            <br />
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={() => {
                                    handleShowAllColumns();
                                    setColumnVisibility(initialColumnVisibility);
                                }}
                            >
                                Show All Columns
                            </Button>
                            &emsp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                Manage Columns
                            </Button>
                            &ensp;
                    
                            <br />
                            <br />
                            {/* ****** Table start ****** */}
                        </Grid>
                        {!categorycheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
                                    <br />
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
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
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
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

                    </Box>

                </>
            )}{" "}

            {/* Check delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    {checkUser > 0 ? (
                                        <>
                                            <span style={{ fontWeight: "700", color: "#777" }}>{`Subcategory Template`} </span>was linked
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                                    {" "}
                                    OK{" "}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"SubCategory Template Master"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="SubCategory Template Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={openDelete}
                onClose={handleCloseDelete}
                onConfirm={deleteData}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAccountcheckbox}
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
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default SubCategoryMaster;