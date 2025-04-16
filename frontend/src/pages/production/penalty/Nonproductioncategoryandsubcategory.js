import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, TextareaAutosize, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, Switch, TextField, Typography } from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
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
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import PageHeading from "../../../components/PageHeading.js";

function CategoryAndSubcategory() {
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
    let newval = "PC0001";
    const [cateCode, setCatCode] = useState([]);
    const [category, setCategory] = useState({ categoryname: "" });
    const [subCategoryTodo, setSubcategoryTodo] = useState([]);
    const [subcategory, setSubcategory] = useState("");
    const [isFirstSubCateView, setIsFirstSubCateView] = useState(false);
    const [categorySubcategoryList, setCategorySubcategoryList] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const { auth, setAuth } = useContext(AuthContext);
    const [singleCategory, setSingleCategory] = useState({});
    const [editTodo, setEditTodo] = useState([]);
    const [subcategoryEdit, setSubCategoryEdit] = useState("");
    const [nameCheck, setNameCheck] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [editDuplicate, setEditDuplicate] = useState([]);
    const [subDuplicate, setSubDuplicate] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, buttonStyles, pageName, setPageName } = useContext(UserRoleAccessContext);
    const username = isUserRoleAccess?.username;
    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const [ovProj, setOvProj] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjsub, setOvProjsub] = useState("");
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    const filteredDatas = categorySubcategoryList?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
    });
    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
    const rowDataTable = filteredData.map((item, index) => {
        const correctedArray = Array.isArray(item?.subcategoryname) ? item.subcategoryname.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item.categoryname,
            categorycode: item.categorycode,
            subcategorynamearr: item?.subcategoryname,
            subcategoryname: correctedArray?.toString(),
            subcategory: correctedArray.toString(),
        };
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
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
    const getCategory = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCatCode(response.data.categoryandsubcategory);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Non Production Category and Subcategory"),
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
        getCategory();
        getapi();
    }, []);
    const [isBtn, setBtn] = useState(false)
    const sendRequest = async () => {
        const subcategoryName = subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
        setPageName(!pageName)
        setBtn(true)
        try {
            let res_queue = await axios.post(SERVICE.CATEGORYANDSUBCATEGORY_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                categoryname: String(category.categoryname),
                categorycode: String(newval),
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
            setCategory({ ...category, categoryname: "" });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await getCategoryAndSubcategory();
            await getCategory();
            setBtn(false)

        } catch (err) {
            setBtn(false)

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const handleClear = () => {
        setSubcategoryTodo([]);
        setSubcategory("");
        setCategory({ ...category, categoryname: "" });
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };
    const [nonProductionUnitRateEdit, setNonProductionUnitRateEdit] = useState([])
    //Project updateby edit page...
    let updateby = editOpen ? singleCategory?.updatedby : nonProductionUnitRateEdit?.updatedby;
    let addedby = nonProductionUnitRateEdit?.addedby;
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionUnitRateEdit(res?.data?.scategoryandsubcategory);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const sendRequestEdit = async () => {
        const subcategoryName = subcategoryEdit.length !== 0 || "" ? [...editTodo, subcategoryEdit] : [...editTodo];
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.CATEGORYANDSUBCATEGORY_SINGLE}/${singleCategory._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                categoryname: String(singleCategory.categoryname),
                subcategoryname: [...editTodo],
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await getCategoryAndSubcategory();
            await getCategory();
            //   await getOverallEditSectionUpdate();
            setSubCategoryEdit("");
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleEditClose();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [categorySubcategoryListOverall, setCategorySubcategoryListOverall] = useState([])
    const getCategoryAndSubcategoryOverall = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategorySubcategoryListOverall(response.data.categoryandsubcategory.map((item, index) => {
                const correctedArray = Array.isArray(item?.subcategoryname) ? item.subcategoryname.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
                return {
                    id: item._id,
                    serialNumber: index + 1,
                    categoryname: item.categoryname,
                    categorycode: item.categorycode,
                    subcategoryname: correctedArray,
                    subcategory: correctedArray.toString(),
                };
            }));
            // setEditDuplicate(response.data.doccategory.filter(data => data._id !== singleCategory._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        getCategoryAndSubcategoryOverall()
    }, [isFilterOpen, isPdfFilterOpen])
    const getCategoryAndSubcategory = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategorySubcategoryList(response.data.categoryandsubcategory);
            // setEditDuplicate(response.data.doccategory.filter(data => data._id !== singleCategory._id));
            setSubDuplicate(response.data.categoryandsubcategory.filter((data) => data._id !== singleCategory._id));
            setCatCode(response.data.categoryandsubcategory);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        getCategoryAndSubcategory();
    }, []);
    useEffect(() => {
        getCategoryAndSubcategory();
    }, [editOpen, editTodo]);
    const getCategoryId = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEditDuplicate(response.data.categoryandsubcategory.filter((data) => data._id !== singleCategory._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const EditTodoPopup = () => {
        if (subcategoryEdit === "") {
            setPopupContentMalert("Please Enter  Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (editTodo.some((item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase())) {
            setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setEditTodo([...editTodo, subcategoryEdit]);
            setSubCategoryEdit("");
        }
    };


    const OverallExist = async (categoryname, subcat) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.OVERALL_CATEGORYANDSUBCATEGORY_NONPRODUCT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: String(categoryname),
                oldpurpose: subcat,
            })

            setOvProjCount(res?.data?.count);
            setGetOverallCount(<span style={{ fontWeight: "700", color: "#777" }}>
                <span style={{ fontWeight: "bold", color: "black" }}> The </span>
                {`${categoryname} & ${subcat?.toString()}`}
                <span style={{ fontWeight: "bold", color: "black" }}> was linked</span>
            </span>);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

        }
    }

    const [docindex, setDocindex] = useState("");
    const getCode = async (id, popup, categoryname, subcategory,) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORY_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleCategory(res?.data?.scategoryandsubcategory);
            setEditTodo(res?.data?.scategoryandsubcategory?.subcategoryname);
            setOvProj(categoryname);
            setOvProjsub(subcategory);
            OverallExist(res.data.scategoryandsubcategory?.categoryname, res.data.scategoryandsubcategory.subcategoryname)
            if (popup === "view") {
                handleViewOpen();
            } else {
                handleEditOpen();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            // setIsDeleteOpencheckbox(true);
            overallBulkdelete(selectedRows);

        }
    };

    const [selectedRowsCount, setSelectedRowsCount] = useState(0);

    const overallBulkdelete = async (ids) => {
        setPageName(!pageName);
        try {
            let overallcheck = await axios.post(
                `${SERVICE.OVERALL_NONPRODUCTIONCATEGORYMASTER_BULKDELETE}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    id: ids,
                }
            );

            setSelectedRows(overallcheck?.data?.result);
            setSelectedRowsCount(overallcheck?.data?.count)
            setIsDeleteOpencheckbox(true);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    //Delete model
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const delVendorcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.CATEGORYANDSUBCATEGORY_SINGLE}/${item}`, {
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
            await getCategoryAndSubcategory();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [deletedocument, setDeletedocument] = useState({});
    const [checkdoc, setCheckdoc] = useState();
    const [checkUser, setCheckUser] = useState();

    const rowData = async (id, categoryname, subcat) => {
        setPageName(!pageName)
        try {
            // let res = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORY_SINGLE}/${id}`, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            // });
            const [res, resuser] = await Promise.all([
                await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORY_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.OVERALL_CATEGORYANDSUBCATEGORY_NONPRODUCT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    oldname: String(categoryname),
                    oldpurpose: subcat,
                })
            ])
            setDeletedocument(res?.data?.scategoryandsubcategory);
            setCheckUser(resuser?.data?.count);
            if (resuser?.data?.count > 0) {
                // handleClickOpenCheck();
                setPopupContentMalert(
                    <span style={{ fontWeight: "700", color: "#777" }}>
                        {`${res?.data?.scategoryandsubcategory?.categoryname}  & ${res?.data?.scategoryandsubcategory?.subcategoryname?.toString()}`}
                        <span style={{ fontWeight: "bold", color: "black" }}>was linked</span>
                    </span>
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleClickOpen();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    let deleteId = deletedocument?._id;
    const deleteData = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.delete(`${SERVICE.CATEGORYANDSUBCATEGORY_SINGLE}/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await getCategoryAndSubcategory();
            await getCategory();
            handleCloseDelete();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const addTodo = () => {
        getCategoryAndSubcategory();
        const isSubNameMatch = subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase());
        // const isSubNameMatch = categorySubcategoryList.some((item) => item.subcategoryname.includes(subcategory));
        if (subcategory === "") {
            setPopupContentMalert("Please Enter Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isSubNameMatch) {
            setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setSubcategoryTodo([...subCategoryTodo, subcategory]);
            setSubcategory("");
        }
    };
    const handleTodoEdit = (index, newValue) => {
        const updatedTodos = [...subCategoryTodo];
        updatedTodos[index] = newValue;
        setSubcategoryTodo(updatedTodos);
    };
    const handleTodoEditPop = (index, newValue) => {
        // If no duplicate is found, update the editTodo array
        const updatedTodos = [...editTodo];
        updatedTodos[index] = newValue;
        setEditTodo(updatedTodos);
    };
    const handleSubmit = () => {
        let matchValue = subCategoryTodo.filter((data) => data === subCategoryTodo.includes(data));
        const isNameMatch = categorySubcategoryList?.some((item) => item?.categoryname?.toLowerCase() === category?.categoryname.toLowerCase());
        const isSubNameMatch = subDuplicate.some((item) => subCategoryTodo.includes(item));
        const hasDuplicates = (arr) =>
            new Set(arr.map((s) => s.toLowerCase())).size !== arr.length;
        if (isNameMatch) {
            setPopupContentMalert("Already Added ! Please Enter Another category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isSubNameMatch) {
            setPopupContentMalert("Already Added ! Please Enter Another subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (category.categoryname === "") {
            setPopupContentMalert("Please Enter Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subcategory.length > 0 && subCategoryTodo.length === 0) {
            setPopupContentMalert("Please Insert Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subcategory !== "") {
            setPopupContentMalert("Please Insert Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subCategoryTodo.some((item) => item === "")) {
            setPopupContentMalert("Please Enter Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subCategoryTodo.some((item) => item === "")) {
            setPopupContentMalert("Please Enter Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (subCategoryTodo.length === 0) {
            setPopupContentMalert("Please Enter Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (hasDuplicates(subCategoryTodo)) {
            setPopupContentMalert("Already Added ! Please Enter Another subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };
    const handleSubmitEdit = () => {
        getCategoryAndSubcategory();
        const isNameMatch = subDuplicate?.some((item) => item?.categoryname?.toLowerCase() === singleCategory?.categoryname.toLowerCase());
        const isSubNameMatch = editDuplicate.some((item) => item.subcategoryname.includes(editTodo));
        const isSubNameMatchTodo = editDuplicate.some((item) => item.subcategoryname.includes(subcategoryEdit));
        const correctedArray = Array.isArray(editTodo) ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
        let subname = correctedArray.toString();
        let conditon = "The" + " " + (singleCategory.categoryname !== ovProj && editTodo[docindex] !== ovProjsub[docindex] ? ovProj + ovProjsub[docindex] : singleCategory.categoryname !== ovProj ? ovProj : ovProjsub[docindex]);
        const hasDuplicates = (arr) =>
            new Set(arr.map((s) => s.toLowerCase())).size !== arr.length;
        if (isNameMatch) {
            setPopupContentMalert("Already Added ! Please Enter Another category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (singleCategory.categoryname === "") {
            setPopupContentMalert("Please Enter Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (editTodo.some((item) => item === "")) {
            setPopupContentMalert("Please Enter Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if ((singleCategory.categoryname != ovProj ||
            !editTodo?.every((item) => ovProjsub?.includes(item))) &&
            ovProjCount > 0) {
            setPopupContentMalert(getOverAllCount);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subcategoryEdit === "" && editTodo.length === 0) {
            setPopupContentMalert("Please Enter Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (editTodo.length > 0 && editTodo.length === 0) {
            setPopupContentMalert("Please Insert Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subcategoryEdit !== "") {
            setPopupContentMalert("Please Insert Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editTodo.length === 0) {
            setPopupContentMalert("Please Insert Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (hasDuplicates(editTodo)) {
            setPopupContentMalert("Already Added ! Please Enter Another subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
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
    const dataGridStyles = {
        root: {
            "& .MuiDataGrid-row": {
                height: "15px",
            },
        },
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
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };
    // Modify the filtering logic to check each term
    const totalPages = Math.ceil(filteredDatas.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(Math.abs(firstVisiblePage + visiblePages - 1), totalPages);
    const pageNumbers = [];
    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const [isOpen, setIsOpen] = useState(false);
    const handleMakeOpen = () => {
        setIsOpen(true);
    };
    const handleMakeClose = () => {
        setIsOpen(false);
    };
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
            width: 90,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "categorycode",
            headerName: "Category Code",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.categorycode,
        },
        {
            field: "categoryname",
            headerName: "Category Name",
            flex: 0,
            width: 180,
            minHeight: "40px",
            hide: !columnVisibility.categoryname,
        },
        {
            field: "subcategoryname",
            headerName: "Sub Categoryname",
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
                    {isUserRoleCompare?.includes("ecategory&subcategory") && (
                        <Button
                            onClick={() => {
                                getCode(params.row.id, "edit", params.row.categoryname, params.row.subcategoryname);
                                getCategoryId();
                            }}
                            sx={userStyle.buttonedit}
                            style={{ minWidth: "0px" }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dcategory&subcategory") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.categoryname, params.row.subcategorynamearr);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vcategory&subcategory") && (
                        <Button
                            sx={userStyle.buttonview}
                            onClick={(e) => {
                                getCode(params.row.id, "view");
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("icategory&subcategory") && (
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
    ];
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

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Category and Subcategory",
        pageStyle: "print",
    });
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Category and Subcategory.png");
                });
            });
        }
    };
    const exportColumnNames = ["Category Code", "Category ", "Subcategory Name"]
    const exportRowValues = ["categorycode", "categoryname", "subcategoryname"]
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    return (
        <Box>
            <Headtitle title={"Category and Subcategory"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Category and Subcategory"
                modulename="Production"
                submodulename="Non Production"
                mainpagename="Non-production Setup"
                subpagename="Category & Subcategory"
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("acategory&subcategory") && (
                    <>
                        <Box sx={userStyle.container}>
                            <Headtitle title={"CATEGORY AND SUBCATEGORY"} />
                            <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Typography sx={userStyle.importheadtext}>Add Category and Subcategory</Typography>
                                </Grid>


                                <Grid item md={4} sm={12} xs={12}>
                                    {!isFirstSubCateView && (
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Category  Name"
                                                value={category.categoryname}
                                                onChange={(e) => {
                                                    setCategory({
                                                        ...category,
                                                        categoryname: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                </Grid>
                                <Grid item md={4} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        {cateCode &&
                                            cateCode.map(() => {
                                                let strings = "PC";
                                                let refNo = cateCode[cateCode.length - 1].categorycode;
                                                let digits = (cateCode.length + 1).toString();
                                                const stringLength = refNo.length;
                                                let lastChar = refNo.charAt(stringLength - 1);
                                                let getlastBeforeChar = refNo.charAt(stringLength - 2);
                                                let getlastThreeChar = refNo.charAt(stringLength - 3);
                                                let lastBeforeChar = refNo.slice(-2);
                                                let lastThreeChar = refNo.slice(-3);
                                                let lastDigit = refNo.slice(-4);
                                                let refNOINC = parseInt(lastChar) + 1;
                                                let refLstTwo = parseInt(lastBeforeChar) + 1;
                                                let refLstThree = parseInt(lastThreeChar) + 1;
                                                let refLstDigit = parseInt(lastDigit) + 1;
                                                if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                                                    refNOINC = ("000" + refNOINC).substr(-4);
                                                    newval = strings + refNOINC;
                                                } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                                                    refNOINC = ("00" + refLstTwo).substr(-4);
                                                    newval = strings + refNOINC;
                                                } else if (digits.length < 4 && getlastThreeChar > 0) {
                                                    refNOINC = ("0" + refLstThree).substr(-4);
                                                    newval = strings + refNOINC;
                                                } else {
                                                    refNOINC = refLstDigit.substr(-4);
                                                    newval = strings + refNOINC;
                                                }
                                            })}
                                        <Typography>
                                            Category Code <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlined" placeholder="Please Enter Category  Code" value={newval} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            SubCategory <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
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
                                <Grid item md={8} marginTop={3}></Grid>
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
                                                                    SubCategory <b style={{ color: "red" }}>*</b>
                                                                </Typography>
                                                                <OutlinedInput id="component-outlined"
                                                                    placeholder="Please Enter SubCategory"
                                                                    value={item} onChange={(e) =>
                                                                        handleTodoEdit(index, e.target.value)}
                                                                />
                                                            </FormControl>

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
                                <Grid item md={12} sm={12} xs={12}>
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <Button sx={buttonStyles.buttonsubmit} disabled={isBtn} onClick={handleSubmit}>
                                            SAVE
                                        </Button>
                                        <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Box>
                    </>
                )}
            </>
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
                <Dialog maxWidth="lg" open={editOpen} onClose={handleEditClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ marginTop: "80px" }}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>Edit Category and Subcategory</Typography>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                {!isFirstSubCateView && (
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Category  Name"
                                            value={singleCategory.categoryname}
                                            onChange={(e) => {
                                                setSingleCategory({
                                                    ...singleCategory,
                                                    categoryname: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                )}
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Category Code <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput id="component-outlined" placeholder="Please Enter Category  Code" value={singleCategory.categorycode} />
                                </FormControl>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        SubCategory <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory" value={subcategoryEdit} onChange={(e) => setSubCategoryEdit(e.target.value)} />
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
                                                                placeholder="Please Enter SubCategory"
                                                                value={item}
                                                                onChange={(e) => {
                                                                    handleTodoEditPop(index,
                                                                        e.target.value);
                                                                }}
                                                            />
                                                        </FormControl>
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
                                    <Button
                                        sx={buttonStyles.buttonsubmit} onClick={handleSubmitEdit}>
                                        Update
                                    </Button>
                                    <Button
                                        sx={buttonStyles.btncancel}
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
                <Dialog maxWidth="md" open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ marginTop: "80px" }}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>View Category and Subcategory</Typography>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                {!isFirstSubCateView && (
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category Name
                                        </Typography>
                                        <OutlinedInput readOnly id="component-outlined" type="text" placeholder="Please Enter Category  Name" value={singleCategory.categoryname} />
                                    </FormControl>
                                )}
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Category Code
                                    </Typography>
                                    <OutlinedInput readOnly id="component-outlined" placeholder="Please Enter Category  Code" value={singleCategory.categorycode} />
                                </FormControl>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}></Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <Typography>
                                    SubCategory
                                </Typography>
                                {editTodo.length > 0 && (
                                    <ul type="none">
                                        {editTodo.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <br />
                                                    <Grid sx={{ display: "flex" }}>
                                                        <FormControl fullWidth size="small">
                                                            <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={5}
                                                                value={item}
                                                            />
                                                        </FormControl>
                                                        &emsp;
                                                        {/* <Button variant="contained" color="success" onClick={EditTodoPopup} type="button" sx={{ height: '30px', minWidth: '30px', marginTop: '5px', padding: '6px 10px' }}><FaPlus /></Button>&nbsp; */}
                                                        &emsp;
                                                        {/* <Button variant="contained" color="error" type="button" onClick={(e) => deleteTodo(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '5px', padding: '6px 10px' }}><AiOutlineClose /></Button> */}
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
                                        sx={buttonStyles.btncancel}
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
            {isUserRoleCompare?.includes("lcategory&subcategory") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>Category and Subcategory List</Typography>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row" }}>
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
                                <Grid item md={8} xs={12} sm={12} >
                                    <Typography>&nbsp;</Typography>

                                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                        {isUserRoleCompare?.includes("excelcategory&subcategory") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    getCategoryAndSubcategoryOverall()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvcategory&subcategory") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    getCategoryAndSubcategoryOverall()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printcategory&subcategory") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfcategory&subcategory") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                        getCategoryAndSubcategoryOverall()
                                                    }}>
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagecategory&subcategory") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
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
                            <Grid item md={12} xs={12} sm={12}></Grid>
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
                            &emsp;
                            {isUserRoleCompare?.includes("bdcategory&subcategory") && (
                                <>
                                    <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                                        Bulk Delete
                                    </Button>
                                </>
                            )}
                            <br />
                            <br />
                            {/* ****** Table start ****** */}
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <br />
                                <StyledDataGrid
                                    rows={rowsWithCheckboxes}
                                    density="compact"
                                    columns={columnDataTable.filter((column) => columnVisibility[column.field])} // Only render visible columns
                                    onSelectionModelChange={handleSelectionChange}
                                    autoHeight={true}
                                    hideFooter
                                    ref={gridRef}
                                    getRowClassName={getRowClassName}
                                    selectionModel={selectedRows}
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Grid>
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
                        {/* Manage Column */}
                    </Box>
                </>
            )
            }
            {/* overall edit */}
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Grid>
                            <Button
                                variant="contained"
                                style={{
                                    padding: "7px 13px",
                                    color: "white",
                                    background: "rgb(25, 118, 210)",
                                }}
                                onClick={() => {
                                    sendRequestEdit();
                                    handleCloseerrpop();
                                }}
                            >
                                ok
                            </Button>
                        </Grid>
                        <Button
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                padding: "7px 13px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
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
            {/* overall delete */}
            {/* Check Delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    {checkdoc?.length > 0 ? (
                                        <>
                                            <span style={{ fontWeight: "700", color: "#777" }}>{`${deletedocument?.categoryname} `}</span>was linked in <span style={{ fontWeight: "700" }}>Add Documents</span>{" "}
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
                                <Button sx={buttonStyles.buttonsubmit}
                                    onClick={(e) => delVendorcheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button sx={buttonStyles.buttonsubmit} onClick={handleCloseModcheckbox} >Ok</Button>
                        }
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
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={categorySubcategoryListOverall ?? []}
                filename={"Category and Subcategory"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <DeleteConfirmation
                open={openDelete}
                onClose={handleCloseDelete}
                onConfirm={deleteData}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delVendorcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            /> */}
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
                heading="Category and Subcategory Info"
                addedby={addedby}
                updateby={updateby}
            />
        </Box >
    );
}

export default CategoryAndSubcategory;
