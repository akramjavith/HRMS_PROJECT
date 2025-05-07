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
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Switch, Table, TableBody, TableContainer, TableHead, TextField, Typography } from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

function EducationCategory() {
  let newval = "EC0001";
  let exportColumnNames = ['Category Code', 'Category  ', 'Subcategory Name'];
  let exportRowValues = ['categorycode', 'categoryname', 'subcategoryname'];

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

  const [cateCode, setCatCode] = useState([]);
  const [category, setCategory] = useState({ categoryname: "" });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [isFirstSubCateView, setIsFirstSubCateView] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch,
    pageName,
    setPageName,
    buttonStyles } = useContext(UserRoleAccessContext);

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
      pagename: String("Education Category"),
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
  const { auth } = useContext(AuthContext);
  const [singleCategory, setSingleCategory] = useState({});
  const [editTodo, setEditTodo] = useState([]);
  const [subcategoryEdit, setSubCategoryEdit] = useState("");
  const [isBtn, setIsBtn] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editDuplicate, setEditDuplicate] = useState([]);
  const [subDuplicate, setSubDuplicate] = useState([]);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Education Category.png");
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

  const getCategory = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYEDUCATION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCatCode(response?.data?.educationcategory);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const delAccountcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.CATEGORYEDUCATION_SINGLE}/${item}`, {
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

      await getCategory(); getCategoryList();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendRequest = async () => {
    setIsBtn(true)
    const subcategoryName = subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    setPageName(!pageName)
    try {
      let res_queue = await axios.post(SERVICE.CATEGORYEDUCATION_CREATE, {
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
      await getCategoryList(); getCategory();
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

  //Project updateby edit page...
  let updateby = singleCategory?.updatedby;
  let addedby = singleCategory?.addedby;

  let subprojectsid = singleCategory?._id;

  const sendRequestEdit = async () => {
    const subcategoryName = subcategoryEdit.length !== 0 || "" ? [...editTodo, subcategoryEdit] : [...editTodo];
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.CATEGORYEDUCATION_SINGLE}/${subprojectsid}`, {
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
      await getCategoryList(); getCategory();
      setSubCategoryEdit("");
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();


      handleEditClose();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [isEducationcat, setisEducationcat] = useState(false)

  const getCategoryList = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYEDUCATION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryList(response?.data?.educationcategory);
      setisEducationcat(true)
    } catch (err) {
      setisEducationcat(true)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getCategoryListAll = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYEDUCATION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubDuplicate(response?.data?.educationcategory.filter((data) => data._id !== singleCategory._id));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryId = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYEDUCATION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEditDuplicate(response?.data?.educationcategory.filter((data) => data._id !== singleCategory._id));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const EditTodoPopup = () => {
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter  Subcategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (editTodo.some((item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase())) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else {
      setEditTodo([...editTodo, subcategoryEdit]);
      setSubCategoryEdit("");
    }
  };

  const [editEducationcat, setEditEducationcat] = useState([])

  const getCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CATEGORYEDUCATION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.seducationcategory);
      setEditTodo(res?.data?.seducationcategory?.subcategoryname);
      setEditEducationcat(categoryList?.filter((item) => item?._id !== id))
      handleEditOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getviewCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CATEGORYEDUCATION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.seducationcategory);
      setEditTodo(res?.data?.seducationcategory?.subcategoryname);
      handleViewOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [deleteId, setDeleteId] = useState({});

  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.CATEGORYEDUCATION_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setDeleteId(res?.data?.seducationcategory);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  const deleteData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.delete(`${SERVICE.CATEGORYEDUCATION_SINGLE}/${deleteId?._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await getCategoryList(); getCategory();
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();


    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getinfoCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CATEGORYEDUCATION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.seducationcategory);
      setEditTodo(res?.data?.seducationcategory?.subcategoryname);
      handleClickOpeninfo();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const addTodo = () => {
    getCategoryList();
    const isSubNameMatch = subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase());
    if (subcategory === "") {
      setPopupContentMalert("Please Enter Subcategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (isSubNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase())) {
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
    // If no duplicate is found, update the editTodo array
    const updatedTodos = [...editTodo];
    updatedTodos[index] = newValue;

    setEditTodo(updatedTodos);
  };

  const handleSubmit = () => {
    let matchValue = subCategoryTodo.filter((data) => data === subCategoryTodo.includes(data));
    const isNameMatch = categoryList?.some((item) => item?.categoryname?.toLowerCase() === category?.categoryname.toLowerCase());
    const isSubNameMatch = subDuplicate.some((item) => subCategoryTodo.includes(item));

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
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }
    else if (subCategoryTodo.length !== new Set(subCategoryTodo.map(item => item.toLowerCase())).size) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


      return;
    }
    else if (subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else {
      sendRequest();
    }
  };


  const handleSubmitEdit = () => {
    const isNameMatch = editEducationcat?.some((item) => item?.categoryname?.toLowerCase() === singleCategory?.categoryname.toLowerCase());
    const correctedArray = Array.isArray(editTodo) ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];

    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (singleCategory.categoryname === "") {
      setPopupContentMalert("Please Enter Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }
    else if (subcategoryEdit !== "") {
      setPopupContentMalert("Add Sub Category ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    }
    else if (editTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter Sub Category");
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
    else if (editTodo.length === 0) {
      setPopupContentMalert("Please Insert Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (editTodo.length !== new Set(editTodo.map(item => item.toLowerCase())).size) {

      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
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
  const filteredDatas = categoryList?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });



  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
      field: "categorycode",
      headerName: "Category Code",
      flex: 0,
      width: 230,
      minHeight: "40px",
      hide: !columnVisibility.categorycode,
    },
    {
      field: "categoryname",
      headerName: "Category ",
      flex: 0,
      width: 230,
      minHeight: "40px",
      hide: !columnVisibility.categoryname,
    },
    {
      field: "subcategoryname",
      headerName: "SubCategory",

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
          {isUserRoleCompare?.includes("eeducationcategory") && (
            <Button
              onClick={() => {
                getCode(params.row.id);
                getCategoryListAll();
                getCategoryId();
              }}
              sx={userStyle.buttonedit}
              style={{ minWidth: "0px" }}
            >
              <EditOutlinedIcon style={{ fontSize: "large" }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("deducationcategory") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("veducationcategory") && (
            <Button
              sx={userStyle.buttonview}
              onClick={(e) => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontSize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ieducationcategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
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
    documentTitle: "Education Category",
    pageStyle: "print",
  });


  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";











  return (
    <Box>
      <Headtitle title={"EDUCATION CATEGORY "} />
      <PageHeading
        title="Education Category"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="HR Setup"
        subpagename="Education Category"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aeducationcategory") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>Add Education Category</Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {!isFirstSubCateView && (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category  <b style={{ color: "red" }}>*</b>
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
                      let strings = "EC";
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
              <Grid item md={8}></Grid>
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
                              <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory" value={item} onChange={(e) => handleTodoEdit(index, e.target.value)} />
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
              <Grid item md={12} sm={12} xs={12}>
                <Typography>&nbsp;</Typography>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button variant="contained" onClick={handleSubmit} disabled={isBtn} sx={buttonStyles.buttonsubmit}>
                    SAVE
                  </Button>
                  <Button onClick={handleClear} sx={buttonStyles.btncancel}>
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
        <Dialog maxWidth="md" open={editOpen} onClose={handleEditClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>Edit Education Category</Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {!isFirstSubCateView && (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category  <b style={{ color: "red" }}>*</b>
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
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    SubCategory<b style={{ color: "red" }}>*</b>
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
              <Grid item md={12} sm={12} xs={12}>
                <Typography>&nbsp;</Typography>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button variant="contained" onClick={handleSubmitEdit} sx={buttonStyles.buttonsubmit}>
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
        <Dialog maxWidth="md"
          open={openView}
          onClose={handlViewClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ marginTop: "80px" }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>View Education Category</Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                {!isFirstSubCateView && (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category
                    </Typography>
                    <OutlinedInput readOnly id="component-outlined" type="text" placeholder="Please Enter Category  Name" value={singleCategory.categoryname} />
                  </FormControl>
                )}
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category Code
                  </Typography>
                  <OutlinedInput readOnly id="component-outlined" placeholder="Please Enter Category  Code" value={singleCategory.categorycode} />
                </FormControl>
              </Grid>

              <Grid item md={6.45} sm={12} xs={12}>
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
                              <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory" value={item} />
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
                    variant="contained"
                    onClick={() => {
                      handlViewClose();
                    }}
                    sx={buttonStyles.btncancel}
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
      {isUserRoleCompare?.includes("leducationcategory") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>All Education Category List</Typography>
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
                  {isUserRoleCompare?.includes("exceleducationcategory") && (
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
                  {isUserRoleCompare?.includes("csveducationcategory") && (
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
                  {isUserRoleCompare?.includes("printeducationcategory") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printeducationcategory") && (
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
                  {isUserRoleCompare?.includes("imageeducationcategory") && (
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
              {isUserRoleCompare?.includes("bdeducationcategory") && (
                <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                  Bulk Delete
                </Button>
              )}
            </Grid>

            <br />
            <br />
            {/* ****** Table start ****** */}
            {!isEducationcat ?
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
              </>}

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
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table" id="addcategroyticket" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }}>
                  <StyledTableRow>
                    <StyledTableCell>SNo</StyledTableCell>
                    <StyledTableCell>Category Code</StyledTableCell>
                    <StyledTableCell>Category </StyledTableCell>
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
            {/* Manage Column */}
          </Box>

          <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
              <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                Are you sure?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete} variant="outlined">
                Cancel
              </Button>
              <Button onClick={(e) => deleteData(deleteId)} autoFocus variant="contained" color="error">
                {" "}
                OK{" "}
              </Button>
            </DialogActions>
          </Dialog>

          <Box>
            <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                  Are you sure?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                  Cancel
                </Button>
                <Button autoFocus variant="contained" color="error" onClick={(e) => delAccountcheckbox(e)}>
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                  Please Select any Row
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* this is info view details */}

          <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ width: "550px", padding: "20px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>Education Category Info</Typography>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">addedby</Typography>
                      <br />
                      <Table>
                        <TableHead>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                        </TableHead>
                        <TableBody>
                          {addedby?.map((item, i) => (
                            <StyledTableRow>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Updated by</Typography>
                      <br />
                      <Table>
                        <TableHead>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                        </TableHead>
                        <TableBody>
                          {updateby?.map((item, i) => (
                            <StyledTableRow>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </FormControl>
                  </Grid>
                </Grid>
                <br /> <br />
                <br />
                <Grid container spacing={2}>
                  <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                    {" "}
                    Back{" "}
                  </Button>
                </Grid>
              </>
            </Box>
          </Dialog>
        </>
      )}
      {" "}
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
        filename={"Education Category"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

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

export default EducationCategory;