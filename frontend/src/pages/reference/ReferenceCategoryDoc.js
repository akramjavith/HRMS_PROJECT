import React, { useState, useEffect, useRef, useContext } from "react";
import { Popover, TextField, IconButton, Switch, List, ListItem, ListItemText, Box, Typography, OutlinedInput, Dialog, Select, Checkbox, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";

import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";

import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AiOutlineClose } from "react-icons/ai";

import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { FaPlus } from "react-icons/fa";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import LoadingButton from "@mui/lab/LoadingButton";

function ReferenceCategoryDoc() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setIsBtn(false);
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

  let exportColumnNames = ['CategoryCode', 'Category ', 'Subcategory'];
  let exportRowValues = ['categorycode', 'categoryname', 'subcategoryname'];

  let newval = "RF0001";
  const gridRef = useRef(null);
  //useState
  const [cateCode, setCatCode] = useState([]);
  const [category, setCategory] = useState({ categoryname: "" });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [items, setItems] = useState([]);
  const { auth } = useContext(AuthContext);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [singleCategory, setSingleCategory] = useState({});
  const [editTodo, setEditTodo] = useState([]);
  const [subcategoryEdit, setSubCategoryEdit] = useState("");
  const [loading, setLoading] = useState(false);

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
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

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [subDuplicate, setSubDuplicate] = useState([]);
  const [openInfo, setOpeninfo] = useState(false);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
  const [isBtn, setIsBtn] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
  const username = isUserRoleAccess?.username;

  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';


  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };


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
      pagename: String("Reference/Reference Category"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });

  }
















  //useEffect
  useEffect(() => {
    getCategoryList();
  }, []);
  useEffect(() => {
    getCategoryListAll();
  }, [editOpen, singleCategory]);
  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);


  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      getOverallEditSectionOverallDelete(selectedRows)
      // setIsDeleteOpencheckbox(true);
    }
  };


  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  //overall edit section for all pages
  const getOverallEditSectionOverallDelete = async (ids) => {
    try {

      let res = await axios.post(SERVICE.OVERALL_REFERENCE_CATEGORY_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: ids
      });
      setSelectedRows(res?.data?.result);
      setSelectedRowsCount(res?.data?.count)
      setSelectAllChecked(
        res?.data?.count === filteredData.length
      );
      setIsDeleteOpencheckbox(true);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleViewOpen = () => {
    setOpenView(true);
  };
  const handlViewClose = () => {
    setOpenView(false);
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");

  const [ovProjsub, setOvProjsub] = useState("");

  const sendRequest = async () => {
    setIsBtn(true)
    const subcategoryName = subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    setPageName(!pageName)
    try {
      let res_doc = await axios.post(SERVICE.REFCATEGORYDOCUMENT_CREATE, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        categoryname: String(category.categoryname),
        categorycode: String(newval),
        subcategoryname: subcategoryName,
        addedby: [{ name: String(isUserRoleAccess.companyname), date: String(new Date()) }],
      });
      setSubcategoryTodo([]);
      setSubcategory("");
      setCategory({ ...category, categoryname: "" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await getCategoryList();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const handleClear = () => {
    setSubcategoryTodo([]);
    setSubcategory("");
    setCategory({ ...category, categoryname: "" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const getCategoryListAll = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSubDuplicate(response.data.doccategory.filter((data) => data._id !== singleCategory._id));
      setLoading(true);
    } catch (err) { setLoading(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const sendRequestEdit = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.REFCATEGORYDOCUMENT_SINGLE}/${singleCategory._id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        categoryname: String(singleCategory.categoryname),
        subcategoryname: [...editTodo],
        updatedby: [...updateby, { name: String(isUserRoleAccess.companyname), date: String(new Date()) }],
      });
      await getCategoryList(); getOverallEditSectionUpdate();
      setSubCategoryEdit("");
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleEditClose();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getCategoryList = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setCategoryList(response.data.doccategory);
      const answer = response.data.doccategory?.length > 0 ? response.data.doccategory?.map((item, index) => {
        const correctedArray = Array.isArray(item?.subcategoryname) ? item.subcategoryname.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          categoryname: item.categoryname,
          categorycode: item.categorycode,
          subcategoryname: correctedArray.toString(),
        };
      }) : []
      setItems(answer)
      setSubDuplicate(response.data.doccategory.filter((data) => data._id !== singleCategory._id));
      setCatCode(response.data.doccategory);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const EditTodoPopup = () => {
    getCategoryList();
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter  Subcategory ");
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

  const [docindex, setDocindex] = useState("");

  //overall edit section for all pages
  const getOverallEditSection = async (categoryname, subcategoryname) => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.REFCATEGORYDOCUMENT_OVERALLEDIRT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: categoryname,
        oldnamesub: subcategoryname,
      });
      setOvProjCount(res.data.count);
      setDocindex(Number(docindex));

      setGetOverallCount(` ${categoryname} is linked in  ${res.data.refdocuments?.length > 0 ? "Add Reference Document" : ""}  
       whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.REFCATEGORYDOCUMENT_OVERALLEDIRT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
        oldnamesub: ovProjsub,
      });
      sendEditRequestOverall(res.data.refdocuments);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendEditRequestOverall = async (refdocuments) => {
    setPageName(!pageName)
    try {
      if (refdocuments.length > 0) {
        let answ = refdocuments.map((d, i) => {
          let res = axios.put(`${SERVICE.REFDOCUMENT_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryname: String(singleCategory.categoryname),
            subcategoryname: String(editTodo[docindex]),
          });
        });
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getcode = async (id, categoryname, subcategory) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT_SINGLE}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSingleCategory(res.data.sdoccategory);
      setEditTodo(res.data.sdoccategory.subcategoryname);
      setOvProj(categoryname);
      setOvProjsub(subcategory);
      getOverallEditSection(categoryname, subcategory);
      handleEditOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  // View Page in Table
  const getViewcode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT_SINGLE}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSingleCategory(res.data.sdoccategory);
      setEditTodo(res.data.sdoccategory.subcategoryname);
      handleViewOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  // Info Page in Table
  const getInfocode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT_SINGLE}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSingleCategory(res.data.sdoccategory);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // updateby edit page...
  let updateby = singleCategory.updatedby;
  let addedby = singleCategory.addedby;
  const [deletedocument, setDeletedocument] = useState({});
  const [checkdoc, setCheckdoc] = useState();

  const rowData = async (id, categoryname) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletedocument(res.data.sdoccategory);

      let resdev = await axios.post(SERVICE.REFDOCUMENT_OVERALLDELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkcategory: String(categoryname),
      });
      setCheckdoc(resdev?.data?.refdocumnetcat);

      if ((resdev?.data?.refdocumnetcat).length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  let deleteId = deletedocument?._id;

  const deleteData = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.delete(`${SERVICE.REFCATEGORYDOCUMENT_SINGLE}/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await getCategoryList();
      await getCategoryListAll();
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delVendorcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.REFCATEGORYDOCUMENT_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await getCategoryList();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const addTodo = () => {
    getCategoryList();
    const isSubNameMatch = subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase());
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (subcategory === "") {
      setPopupContentMalert("Please Enter Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
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
    const isDuplicate = concatenatedArray.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());

    const updatedTodos = [...editTodo];
    updatedTodos[index] = newValue;
    setEditTodo(updatedTodos);
  };
  const handleSubmit = () => {
    const isNameMatch = categoryList?.some((item) => item?.categoryname?.toLowerCase() === category?.categoryname.toLowerCase());

    const isSubNameMatch = subDuplicate.some((item) => subCategoryTodo.includes(item));
    if (isNameMatch) {

      setPopupContentMalert("Already Added ! Please Enter Another category ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isSubNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (category.categoryname === "") {
      setPopupContentMalert("Please Enter Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategory !== "") {
      setPopupContentMalert("Add SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategory.length > 0 && subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.some((item) => item === "")) {

      setPopupContentMalert("Please Enter SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.some((item) => item === "")) {

      setPopupContentMalert("Please Enter SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.length === 0) {

      setPopupContentMalert("Please Add SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.length !== new Set(subCategoryTodo.map(item => item.toLowerCase())).size) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else {
      sendRequest();
    }
  };
  const handleSubmitEdit = () => {
    getCategoryListAll();
    const isNameMatch = subDuplicate?.some((item) => item?.categoryname?.toLowerCase() === singleCategory?.categoryname.toLowerCase());

    const correctedArray = Array.isArray(editTodo) ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
    let conditon = "The" + " " + (singleCategory.categoryname !== ovProj && editTodo[docindex] !== ovProjsub[docindex] ? ovProj + ovProjsub[docindex] : singleCategory.categoryname !== ovProj ? ovProj : ovProjsub[docindex]);

    // const isSubNameMatch = isSubcategoryNameMatch(subDuplicate, editTodo);
    if (isNameMatch) {

      setPopupContentMalert("Already Added ! Please Enter Another category !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleCategory.categoryname === "") {

      setPopupContentMalert("Please Enter Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategoryEdit !== "") {

      setPopupContentMalert("Add Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (editTodo.some((item) => item === "")) {

      setPopupContentMalert("Please Enter SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length === 0) {

      setPopupContentMalert("Please Enter SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if ((singleCategory.categoryname != ovProj) && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
      // setPopupContentMalert(`${conditon + getOverAllCount}`);
      // setPopupSeverityMalert("info");
      // handleClickOpenPopupMalert();
    }
    else if (subcategoryEdit === "" && editTodo.length === 0) {

      setPopupContentMalert("Please Enter Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }
    else if (editTodo.length > 0 && editTodo.length === 0) {
      setPopupContentMalert("Please Insert Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    }
    else if (editTodo.length === 0) {

      setPopupContentMalert("Please Insert Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (editTodo.length !== new Set(editTodo.map(item => item.toLowerCase())).size) {

      setPopupContentMalert("Already Added ! Please Enter Another Subcategory! ");
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
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  const filteredDatas = categoryList?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
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
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: {
        fontWeight: "bold",
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
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    { field: "serialNumber", headerName: "S.No", flex: 0, width: 180, minHeight: "40px", hide: !columnVisibility.serialNumber },
    { field: "categorycode", headerName: "Category Code", flex: 0, width: 230, minHeight: "40px", hide: !columnVisibility.categorycode },
    { field: "categoryname", headerName: "Category", flex: 0, width: 230, minHeight: "40px", hide: !columnVisibility.categoryname },
    { field: "subcategoryname", headerName: "SubCategory", flex: 0, width: 230, minHeight: "40px", hide: !columnVisibility.subcategoryname },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ereferencecategory") && (
            <Button
              onClick={() => {
                getcode(params.row.id, params.row.categoryname, params.row.subcategoryname);

              }}
              sx={userStyle.buttonedit}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dreferencecategory") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.categoryname);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vreferencecategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getViewcode(params.row.id);

              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ireferencecategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getInfocode(params.row.id);
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
    const correctedArray = Array.isArray(item?.subcategoryname) ? item.subcategoryname.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname,
      categorycode: item.categorycode,
      subcategoryname: correctedArray.toString(),
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
      <IconButton aria-label="close" onClick={handleCloseManageColumns} sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
        {" "}
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
              {" "}
              Show All{" "}
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
              {" "}
              Hide All{" "}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );
  // Excel
  const fileName = "Reference_Category_Document_List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Reference_Category_Document_List",
    pageStyle: "print",
  });
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Reference_Category_Document_List.png");
        });
      });
    }
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



  return (
    <Box>
      <Headtitle title={"REFERENCE CATEGORY"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Reference Category"
        modulename="References"
        submodulename="Reference Category"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("areferencecategory") && (
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography sx={userStyle.HeaderText}>Add Reference Category </Typography>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Category"
                      value={category.categoryname}
                      onChange={(e) => {
                        setCategory({ ...category, categoryname: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    {cateCode &&
                      cateCode.map(() => {
                        let strings = "RF";
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
                      {" "}
                      Category Code <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput id="component-outlined" placeholder="Please Enter Category  Code" value={newval} />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    {" "}
                    <Typography>
                      {" "}
                      SubCategory <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
                  </FormControl>
                  &emsp;
                  <Button variant="contained" color="success" onClick={addTodo} type="button" sx={{ height: "30px", minWidth: "30px", marginTop: "28px", padding: "6px 10px" }}>
                    <FaPlus />
                  </Button>
                </Grid>
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
                                  SubCategory <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory" value={item} onChange={(e) => handleTodoEdit(index, e.target.value)} />
                              </FormControl>
                              &emsp;
                              <Button variant="contained" color="error" type="button" onClick={(e) => deleteTodo(index)} sx={{ height: "30px", minWidth: "30px", marginTop: "28px", padding: "6px 10px" }}>
                                <AiOutlineClose />{" "}
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
                  {" "}
                  <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                    <LoadingButton loading={isBtn} variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit} >
                      {" "}
                      SAVE{" "}
                    </LoadingButton>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      {" "}
                      CLEAR{" "}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </>
      )}

      <Box>
        <Dialog maxWidth="md" open={editOpen} onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ marginTop: "40px" }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}> Edit Reference Category  </Typography>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Category <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Category"
                    value={singleCategory.categoryname}
                    onChange={(e) => {
                      setSingleCategory({ ...singleCategory, categoryname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Category Code <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput id="component-outlined" placeholder="Please Enter Category  Code" value={singleCategory.categorycode} />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    SubCategory <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory" value={subcategoryEdit} onChange={(e) => setSubCategoryEdit(e.target.value)} />
                </FormControl>
                &emsp;
                <Button variant="contained" color="success" onClick={EditTodoPopup} type="button" sx={{ height: "30px", minWidth: "30px", marginTop: "28px", padding: "6px 10px" }}>
                  <FaPlus />
                </Button>
              </Grid>
              <Grid item md={6} sm={12} xs={12}></Grid>
              <Grid item md={6} sm={12} xs={12}>
                {editTodo.length > 0 && (
                  <ul type="none">
                    {editTodo.map((item, index) => {
                      return (
                        <li key={index}>
                          <br />
                          <Grid md={12} sm={12} xs={12} sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                              <OutlinedInput
                                id="component-outlined"
                                placeholder="Please Enter SubCategory"
                                value={item}
                                onChange={(e) => {
                                  handleTodoEditPop(index, e.target.value);
                                }}
                              />
                            </FormControl>
                            &emsp;
                            <Button variant="contained" color="error" type="button" onClick={(e) => deleteTodoEdit(index)} sx={{ height: "30px", minWidth: "30px", marginTop: "5px", padding: "6px 10px" }}>
                              {" "}
                              <AiOutlineClose />
                            </Button>
                          </Grid>
                        </li>
                      );
                    })}{" "}
                  </ul>
                )}
              </Grid>
              <Grid item md={1} marginTop={3}></Grid>
              <Grid item md={5}></Grid>
              <Grid item md={12} sm={12} xs={12}>
                {" "}
                <br /> <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmitEdit}>
                    {" "}
                    Update{" "}
                  </Button>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={() => {
                      handleEditClose();
                      setSubCategoryEdit("");
                    }}
                  >
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
      {/* view dialog */}
      <Box>
        <Dialog maxWidth="md" open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ marginTop: "40px" }}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}> View Reference Category  </Typography>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    <b>Category {" "}</b>
                  </Typography>
                  <Typography>
                    {" "}
                    {singleCategory.categoryname}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Category Code</b>
                  </Typography>
                  <Typography>
                    {" "}
                    {singleCategory.categorycode}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <Typography>
                  <b>SubCategory</b>
                </Typography>
                {editTodo.length > 0 && (
                  <ul type="none">
                    {editTodo.map((item, index) => {
                      return (
                        <li key={index}>
                          {/* <br /> */}
                          <Grid sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {index + 1} .
                                {item}
                              </Typography>
                            </FormControl>{" "}
                            {/* &emsp; &emsp; */}
                          </Grid>{" "}
                        </li>
                      );
                    })}{" "}
                  </ul>
                )}
              </Grid>
              <Grid item md={1} marginTop={3}></Grid>
              <Grid item md={5}></Grid>
              <Grid item md={12} sm={12} xs={12}>
                {" "}
                <br /> <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <Button
                    sx={buttonStyles.btncancel}
                    variant="contained"
                    onClick={() => {
                      handlViewClose();
                    }}
                  >
                    {" "}
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
      {isUserRoleCompare?.includes("lreferencecategory") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>Reference Category List</Typography>
              </Grid>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <label>Show entries:</label>
                    <Select id="pageSizeSelect" value={pageSize} MenuProps={{ PaperProps: { style: { maxHeight: 180, width: 80 } } }} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={categoryList?.length}>All</MenuItem> */}
                    </Select>
                    <label htmlFor="pageSizeSelect">&ensp;</label>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box>
                    {isUserRoleCompare?.includes("excelreferencecategory") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvreferencecategory") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>
                    )}
                    {isUserRoleCompare?.includes("printreferencecategory") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          {" "}
                          &ensp; <FaPrint /> &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfreferencecategory") && (
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagereferencecategory") && (
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
              </Grid>{" "}

              <Button
                sx={userStyle.buttongrp}
                onClick={() => {
                  handleShowAllColumns();
                  setColumnVisibility(initialColumnVisibility);
                }}
              >
                {" "}
                Show All Columns
              </Button>
              &emsp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                {" "}
                Manage Columns
              </Button>{" "}
              &emsp;
              {isUserRoleCompare?.includes("bdreferencecategory") && (
                <Button variant="contained" color="error" sx={{ ...buttonStyles.buttonbulkdelete, textTransform: "capitalize" }} onClick={handleClickOpenalert}>
                  Bulk Delete
                </Button>)}
              <br /> <br />
              {/* ****** Table start ****** */}
              <Box style={{ width: "100%", overflowY: "hidden" }}>
                <br />
                <StyledDataGrid rows={rowsWithCheckboxes} density="compact" columns={columnDataTable.filter((column) => columnVisibility[column.field])} autoHeight={true} hideFooter ref={gridRef} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} getRowClassName={getRowClassName} disableRowSelectionOnClick />
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
                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} x={userStyle.paginationbtn}>
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
            {/* manage colmns popover */}
            <Popover id={id} open={isManageColumnsOpen} anchorEl={anchorEl} onClose={handleCloseManageColumns} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
              {manageColumnsContent}
            </Popover>
            {/* print */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table" id="jobopening" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }}>
                  <StyledTableRow>
                    <StyledTableCell>SNo</StyledTableCell>
                    <StyledTableCell>Category Code</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>SubCategory</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData?.length > 0 ? (
                    filteredData?.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{row.categorycode}</StyledTableCell>
                        <StyledTableCell>{row.categoryname}</StyledTableCell>
                        <StyledTableCell>{row?.subcategoryname?.map((d) => d + ",")}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      {" "}
                      <StyledTableCell colSpan={7} align="center">
                        No Data Available
                      </StyledTableCell>{" "}
                    </StyledTableRow>
                  )}
                  <StyledTableRow></StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
      {/* delete modal */}
      <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.btncancel} onClick={handleCloseDelete} >
            Cancel
          </Button>
          <Button sx={buttonStyles.buttonsubmit} onClick={(e) => deleteData(deleteId)} autoFocus variant="contained" color="error">
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Reference Category List Info"
        addedby={addedby}
        updateby={updateby}
      />

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
                // style={{
                //   padding: "7px 13px",
                //   color: "white",
                //   background: "rgb(25, 118, 210)",
                // }}
                sx={buttonStyles.buttonsubmit}
                onClick={() => {
                  sendRequestEdit();
                  handleCloseerrpop();
                }}
              >
                ok
              </Button>
            </Grid>

            <Button
              sx={buttonStyles.btncancel}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deletedocument?.categoryname} `}</span>was linked in <span style={{ fontWeight: "700" }}>Add Reference</span>{" "}
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button sx={buttonStyles.buttonsubmit} onClick={handleCloseCheck} autoFocus variant="contained" color="error">
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
                <Button variant="contained" color='error'
                  onClick={(e) => delVendorcheckbox(e)}
                  sx={buttonStyles.buttonsubmit}
                > OK </Button>
              </>
              :
              <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={buttonStyles.buttonsubmit}>Ok</Button>
            }
          </DialogActions>
        </Dialog>

      </Box>
      {/* <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delVendorcheckbox(e)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box> */}

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />

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
    </Box>
  );
}
export default ReferenceCategoryDoc;