import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Popover, TextField, IconButton, Switch, List, ListItem, ListItemText, Box, Typography, OutlinedInput,
  Dialog, Select, Checkbox, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AiOutlineClose } from "react-icons/ai";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { UserRoleAccessContext, AuthContext, } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { FaPlus } from "react-icons/fa";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import PageHeading from "../../../components/PageHeading";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";

function AnnouncementCategory() {
  const pathname = window.location.pathname;
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

  let exportColumnNames = ['Category Code', 'Category Name', 'Subcategory Name'];
  let exportRowValues = ['categorycode', 'categoryname', 'subcategoryname']

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Announcement Category"),
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");

  let newval = "DA0001";
  const gridRef = useRef(null);
  //useState
  const [cateCode, setCatCode] = useState([]);
  const [category, setCategory] = useState({ categoryname: "" });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const { auth } = useContext(AuthContext);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [singleCategory, setSingleCategory] = useState({});
  const [editTodo, setEditTodo] = useState([]);
  const [subcategoryEdit, setSubCategoryEdit] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBtn, setIsBtn] = useState(false);

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
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // page refersh reload
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
  //useEffect
  useEffect(() => {
    getCategoryList();
  }, []);
  useEffect(() => {
    getCategoryListAll();
  }, [editOpen, singleCategory]);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      overallBulkdelete(selectedRows);
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

  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    const subcategoryName =
      subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    try {
      let res_doc = await axios.post(SERVICE.CREATE_ANNOUNCEMENTCATEGORY, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        categoryname: String(category.categoryname),
        categorycode: String(newval),
        subcategoryname: subcategoryName,
        addedby: [{ name: String(isUserRoleAccess.companyname), date: String(new Date()) }],
      });
      setSubcategoryTodo([]);
      setSubcategory("");
      setCategory({ ...category, categoryname: "" });
      await getCategoryList();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
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
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.ALL_ANNOUNCEMENTCATEGORY}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSubDuplicate(
        response.data.announcementcategory.filter(
          (data) => data._id !== singleCategory._id
        )
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const sendRequestEdit = async () => {
    setPageName(!pageName);
    try {
      let announcement = await axios.put(
        `${SERVICE.ANNOUNCEMENTCATEGORY_OVERALLEDIT}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldcategory: oldCat,
          newcategory: singleCategory.categoryname,
          oldsubcategoryarray: oldsubArray,
          newsubcategoryarray: editTodo,
        }
      );

      let res = await axios.put(
        `${SERVICE.SINGLE_ANNOUNCEMENTCATEGORY}/${singleCategory._id}`,
        {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          categoryname: String(singleCategory.categoryname),
          subcategoryname: [...editTodo],
          updatedby: [
            ...updateby,
            { name: String(isUserRoleAccess.companyname), date: String(new Date()) },
          ],
        }
      );

      await getCategoryList();
      await getCategoryListAll();
      setSubCategoryEdit("");
      handleEditClose();
      handleCloseOverallEditPopup();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getCategoryList = async () => {
    setPageName(!pageName);

    try {
      let response = await axios.get(`${SERVICE.ALL_ANNOUNCEMENTCATEGORY}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setCategoryList(response.data.announcementcategory);
      setSubDuplicate(
        response.data.announcementcategory.filter(
          (data) => data._id !== singleCategory._id
        )
      );
      setCatCode(response.data.announcementcategory);
      setLoading(true);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

  };
  const EditTodoPopup = () => {
    getCategoryList();
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter  Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editTodo.some(
        (item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase()
      )
    ) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setEditTodo([...editTodo, subcategoryEdit]);
      setSubCategoryEdit("");
    }
  };
  const [oldsubArray, setOldSubArray] = useState([]);
  const [oldCat, setOldCat] = useState("");
  const getcode = async (id, categoryname, subcategory) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_ANNOUNCEMENTCATEGORY}/${id}`,
        {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }
      );
      setSingleCategory(res.data.sannouncementcategory);
      setEditTodo(res.data.sannouncementcategory.subcategoryname);
      setOldSubArray(res.data.sannouncementcategory.subcategoryname);
      setOldCat(res.data.sannouncementcategory.categoryname);
      handleEditOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getViewcode = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_ANNOUNCEMENTCATEGORY}/${id}`,
        {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }
      );
      setSingleCategory(res.data.sannouncementcategory);
      setEditTodo(res.data.sannouncementcategory.subcategoryname);
      handleViewOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getInfocode = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_ANNOUNCEMENTCATEGORY}/${id}`,
        {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }
      );
      setSingleCategory(res.data.sannouncementcategory);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // updateby edit page...
  let updateby = singleCategory.updatedby;
  let addedby = singleCategory.addedby;

  const [deletedocument, setDeletedocument] = useState({});

  const rowData = async (id, categoryname) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_ANNOUNCEMENTCATEGORY}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeletedocument(res.data.sannouncementcategory);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  let deleteId = deletedocument?._id;

  const deleteData = async () => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.ANNOUNCEMENTCATEGORY_OVERALLDELETE}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: deletedocument?.categoryname,
          subcategory: deletedocument?.subcategoryname,
        }
      );
      if (overallcheck?.data?.mayidelete) {
        let res = await axios.delete(
          `${SERVICE.SINGLE_ANNOUNCEMENTCATEGORY}/${deleteId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );

        await getCategoryList();
        await getCategoryListAll();
        handleCloseDelete();
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
      handleCloseDelete();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const overallBulkdelete = async (ids) => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.ANNOUNCEMENTCATEGORY_OVERALLBULKDELETE}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          id: ids,
        }
      );

      setSelectedRows(overallcheck?.data?.result);
      setIsDeleteOpencheckbox(true);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const delVendorcheckbox = async () => {
    setPageName(!pageName);
    try {
      if (selectedRows?.length > 0) {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(
            `${SERVICE.SINGLE_ANNOUNCEMENTCATEGORY}/${item}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        });

        // Wait for all delete requests to complete
        await Promise.all(deletePromises);

        await getCategoryList();
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const addTodo = () => {
    getCategoryList();
    const isNameMatch = categoryList?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        category?.categoryname.toLowerCase()
    );
    if (subcategory === "") {
      setPopupContentMalert("Please Enter Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (category.categoryname === "") {
      setPopupContentMalert("Please Enter Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      subCategoryTodo.some(
        (item) => item?.toLowerCase() === subcategory?.toLowerCase()
      )
    ) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
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
    const onlSub = categoryList.map((data) => data.subcategoryname);
    let concatenatedArray = [].concat(...onlSub);
    const isDuplicate = concatenatedArray.some(
      (item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase()
    );

    const updatedTodos = [...editTodo];
    updatedTodos[index] = newValue;
    setEditTodo(updatedTodos);
  };
  const handleSubmit = () => {
    const isNameMatch = categoryList?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        category?.categoryname.toLowerCase()
    );
    const isDuplicate = subDuplicate.some((item) =>
      subCategoryTodo.includes(item)
    );

    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isDuplicate) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (category.categoryname === "") {
      setPopupContentMalert("Please Enter Category ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategory !== "") {
      setPopupContentMalert("Add SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      subCategoryTodo.length !==
      new Set(subCategoryTodo.map((item) => item.toLowerCase())).size
    ) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else {
      sendRequest();
    }
  };

  //overall edit popup
  const [openOverAllEditPopup, setOpenOverAllEditPopup] = useState(false);
  const handleOpenOverallEditPopup = () => {
    setOpenOverAllEditPopup(true);
  };
  const handleCloseOverallEditPopup = () => {
    setOpenOverAllEditPopup(false);
  };
  const handleSubmitEdit = () => {
    getCategoryListAll();
    const isNameMatch = subDuplicate?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        singleCategory?.categoryname.toLowerCase()
    );

    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleCategory.categoryname === "") {
      setPopupContentMalert("Please Enter Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategoryEdit !== "") {
      setPopupContentMalert("Add SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length === 0) {
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editTodo.length !==
      new Set(editTodo.map((item) => item.toLowerCase())).size
    ) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else {
      handleOpenOverallEditPopup();
      handleEditClose();
      // sendRequestEdit()
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
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
    );
  });
  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredDatas.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    Math.abs(firstVisiblePage + visiblePages - 1),
    totalPages
  );
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
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
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
      width: 230,
      minHeight: "40px",
      hide: !columnVisibility.categorycode,
    },
    {
      field: "categoryname",
      headerName: "Category Name",
      flex: 0,
      width: 230,
      minHeight: "40px",
      hide: !columnVisibility.categoryname,
    },
    {
      field: "subcategoryname",
      headerName: "Sub Category Name",
      flex: 0,
      width: 230,
      minHeight: "40px",
      hide: !columnVisibility.subcategoryname,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eannouncementcategory") && (
            <Button
              onClick={() => {
                getcode(
                  params.row.id,
                  params.row.categoryname,
                  params.row.subcategoryname
                );
              }}
              sx={userStyle.buttonedit}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dannouncementcategory") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.categoryname);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vannouncementcategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getViewcode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iannouncementcategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getInfocode(params.row.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData.map((item, index) => {
    const correctedArray = Array.isArray(item?.subcategoryname)
      ? item.subcategoryname.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname,
      categorycode: item.categorycode,
      subcategoryname: correctedArray?.toString(),
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
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );
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
        {" "}
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
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={column.headerName}
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
              Show All{" "}
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibility({})}
            >
              {" "}
              Hide All{" "}
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
    documentTitle: "Announcement Category",
    pageStyle: "print",
  });
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Announcement Category.png");
        });
      });
    }
  };


  return (
    <Box>
      <Headtitle title={"ANNOUNCEMENT CATEGORY"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Announcement Category"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Announcement"
        subpagename="Announcement Category"
        subsubpagename=""
      />


      {isUserRoleCompare?.includes("aannouncementcategory") && (
        <Box sx={userStyle.container}>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>
                Add Announcement Category
              </Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
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
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                {cateCode &&
                  cateCode.map(() => {
                    let strings = "DA";
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
                    if (
                      digits.length < 4 &&
                      getlastBeforeChar == 0 &&
                      getlastThreeChar == 0
                    ) {
                      refNOINC = ("000" + refNOINC).substr(-4);
                      newval = strings + refNOINC;
                    } else if (
                      digits.length < 4 &&
                      getlastBeforeChar > 0 &&
                      getlastThreeChar == 0
                    ) {
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
                <OutlinedInput
                  id="component-outlined"
                  placeholder="Please Enter Category  Code"
                  value={newval}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={12} xs={12}></Grid>
            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
              <FormControl fullWidth size="small">
                {" "}
                <Typography>
                  {" "}
                  SubCategory Name <b style={{ color: "red" }}>*</b>{" "}
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  placeholder="Please Enter SubCategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                />
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
                              SubCategory <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              placeholder="Please Enter SubCategory"
                              value={item}
                              onChange={(e) =>
                                handleTodoEdit(index, e.target.value)
                              }
                            />
                          </FormControl>
                          &emsp;
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
                            <AiOutlineClose />{" "}
                          </Button>
                        </Grid>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Grid item md={12} sm={12} xs={12}>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                    disabled={isBtn}
                  >
                    {" "}
                    SAVE{" "}
                  </Button>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    {" "}
                    CLEAR{" "}
                  </Button>
                </Grid>
              </Grid>
            </Grid>


            {/* <Grid item md={1} marginTop={3}></Grid>
            <Grid item md={5}></Grid> */}
          </Grid>
        </Box>
      )}


      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography
              variant="h6"
              style={{ fontSize: "20px", fontWeight: 900 }}
            >
              {" "}
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
              {" "}
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          maxWidth="md"
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ marginTop: "47px" }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  Edit Announcement Category{" "}
                </Typography>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Category Name <b style={{ color: "red" }}>*</b>{" "}
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
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Category Code <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter Category  Code"
                    value={singleCategory.categorycode}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    SubCategory Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter SubCategory"
                    value={subcategoryEdit}
                    onChange={(e) => setSubCategoryEdit(e.target.value)}
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
                    marginTop: "28px",
                    padding: "6px 10px",
                  }}
                >
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
                          <Grid
                            md={12}
                            sm={12}
                            xs={12}
                            sx={{ display: "flex" }}
                          >
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
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
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
        <Dialog
          maxWidth="md"
          open={openView}
          onClose={handlViewClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ marginTop: "47px" }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  View Announcement Category{" "}
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography> Category Name</Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Category  Name"
                    value={singleCategory.categoryname}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Category Code</Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    placeholder="Please Enter Category  Code"
                    value={singleCategory.categorycode}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <Typography>SubCategory</Typography>
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
                              />{" "}
                            </FormControl>{" "}
                            &emsp; &emsp;
                          </Grid>{" "}
                        </li>
                      );
                    })}{" "}
                  </ul>
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                {" "}
                <br /> <br />
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={buttonStyles.btncancel}
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
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "350px",
            }}
          >
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
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("lannouncementcategory") && (
            <>
              <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Announcement Category List
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
                            PaperProps: { style: { maxHeight: 180, width: 80 } },
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
                          {/* <MenuItem value={categoryList?.length}>All</MenuItem> */}
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
                      <Box>
                        {isUserRoleCompare?.includes("excelannouncementcategory") && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpen(true);
                                setFormat("xl");
                              }}
                              sx={userStyle.buttongrp}
                            >
                              <FaFileExcel />
                              &ensp;Export to Excel&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("csvannouncementcategory") && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpen(true);
                                setFormat("csv");
                              }}
                              sx={userStyle.buttongrp}
                            >
                              <FaFileCsv />
                              &ensp;Export to CSV&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("printannouncementcategory") && (
                          <>
                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                              &ensp;
                              <FaPrint />
                              &ensp;Print&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("pdfannouncementcategory") && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={() => {
                                setIsPdfFilterOpen(true);
                              }}
                            >
                              <FaFilePdf />
                              &ensp;Export to PDF&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("imageannouncementcategory") && (
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleCaptureImage}
                          >
                            {" "}
                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                            &ensp;Image&ensp;{" "}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <Box>
                        <FormControl fullWidth size="small">
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
                  </Grid>{" "}
                  <br /> <br />
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
                  <Button
                    sx={userStyle.buttongrp}
                    onClick={handleOpenManageColumns}
                  >
                    {" "}
                    Manage Columns
                  </Button>{" "}
                  &emsp;
                  {isUserRoleCompare?.includes("bdannouncementcategory") && (
                    <Button
                      variant="contained"
                      sx={[
                        buttonStyles.buttonbulkdelete, // Correctly apply the button styles
                        { textTransform: "capitalize" } // Inline styles
                      ]}
                      onClick={handleClickOpenalert}
                    >
                      Bulk Delete
                    </Button>
                  )}
                  <br />
                  {/* ****** Table start ****** */}
                  <Box style={{ width: "100%", overflowY: "hidden" }}>
                    <br />
                    <StyledDataGrid
                      rows={rowsWithCheckboxes}
                      density="compact"
                      columns={columnDataTable.filter(
                        (column) => columnVisibility[column.field]
                      )}
                      autoHeight={true}
                      hideFooter
                      ref={gridRef}
                      onSelectionModelChange={handleSelectionChange}
                      selectionModel={selectedRows}
                      getRowClassName={getRowClassName}
                      disableRowSelectionOnClick
                    />
                  </Box>
                </Grid>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <FirstPageIcon />
                    </Button>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      x={userStyle.paginationbtn}
                    >
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                        disabled={page === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateNextIcon />
                    </Button>
                    <Button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
                {/* manage colmns popover */}
                <Popover
                  id={id}
                  open={isManageColumnsOpen}
                  anchorEl={anchorEl}
                  onClose={handleCloseManageColumns}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                  {manageColumnsContent}
                </Popover>

              </Box>
            </>
          )}
        </>
      )}



      {/* overall edit */}
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

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
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
              {selectedRows?.length === 0 ? (
                <>
                  The Datas in the selected rows are already used in
                  Announcement page, you can't delete.
                </>
              ) : (
                <>
                  Are you sure? Only {selectedRows?.length} datas can be deleted
                  remaining are used in Announcement page.
                </>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delVendorcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* bulk edit popup */}
      <Dialog
        open={openOverAllEditPopup}
        onClose={handleCloseOverallEditPopup}
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
            If this Data used in Announcement page that may also edits. Are you
            sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOverallEditPopup} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={(e) => sendRequestEdit()}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={categoryList ?? []}
        filename={"Announcement Category"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Announcement Category Info"
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
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />
    </Box>
  );
}
export default AnnouncementCategory;