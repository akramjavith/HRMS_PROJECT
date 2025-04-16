import React, { useState, useEffect, useRef, useContext } from "react";
import { Popover, TextField, IconButton, Switch, List, ListItem, ListItemText, Box, Typography, OutlinedInput, Dialog, Select, Checkbox, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment-timezone";
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
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PageHeading from "../../components/PageHeading";



function ReferenceCategoryDoc() {
  let newval = "RF0001";
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
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(UserRoleAccessContext);
  const [isBtn, setIsBtn] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
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







  const [overallExcelDatas, setOverallExcelDatas] = useState([])
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
  const handleExportXL = (isfilter) => {

    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          "Sno": index + 1,
          "Category Name": item.categoryname,
          "Category Code": item.categorycode,
          "Sub Category Name": item.subcategoryname,

        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        overallExcelDatas.map((item, index) => ({
          "Sno": index + 1,
          "Category Name": item.categoryname,
          "Category Code": item.categorycode,
          "Sub Category Name": item.subcategoryname.join(","),
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  // get all branches
  const fetchOverallExcelDatas = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.REFCATEGORYDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverallExcelDatas(res_freq?.data?.doccategory);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  useEffect(() => {
    fetchOverallExcelDatas();
  }, [isFilterOpen])


















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
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
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
      setIsDeleteOpencheckbox(true);
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Added Successfully"} </p>
        </>
      );
      handleClickOpenerr();
      await getCategoryList();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const handleClear = () => {
    setSubcategoryTodo([]);
    setSubcategory("");
    setCategory({ ...category, categoryname: "" });
    setShowAlert(
      <>
        {" "}
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Cleared Successfully"} </p>{" "}
      </>
    );
    handleClickOpenerr();
  };
  const getCategoryListAll = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSubDuplicate(response.data.doccategory.filter((data) => data._id !== singleCategory._id));
      setLoading(true);
    } catch (err) { setLoading(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Updated Successfully"} </p>
        </>
      );
      handleClickOpenerr();
      handleEditClose();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const getCategoryList = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setCategoryList(response.data.doccategory);
      setSubDuplicate(response.data.doccategory.filter((data) => data._id !== singleCategory._id));
      setCatCode(response.data.doccategory);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const EditTodoPopup = () => {
    getCategoryList();
    if (subcategoryEdit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {" Please Enter  Subcategory "} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (editTodo.some((item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase())) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Subcategory "} </p>{" "}
        </>
      );
      handleClickOpenerr();
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

      setGetOverallCount(` is linked in  ${res.data.refdocuments?.length > 0 ? "Add Reference Document" : ""}  
       whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully"} </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await getCategoryList();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully"} </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const addTodo = () => {
    getCategoryList();
    const isSubNameMatch = subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase());
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (subcategory === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Subcategory"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (isSubNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Subcategory "} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    // else if (subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase())) {
    //   setShowAlert(
    //     <>
    //       {" "}
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Subcategory "} </p>{" "}
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else {
      setSubcategoryTodo([...subCategoryTodo, subcategory]);
      setSubcategory("");
    }
  };
  const handleTodoEdit = (index, newValue) => {
    const isDuplicate = subCategoryTodo.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    // if (isDuplicate) {
    //   // Handle duplicate case, show an error message, and return early
    //   setShowAlert(
    //     <>
    //       {" "}
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added! Please Enter Another Subcategory"} </p>{" "}
    //     </>
    //   );
    //   handleClickOpenerr();
    //   return;
    // } else {
    //   if (subCategoryTodo.some((item) => item?.toLowerCase() === newValue?.toLowerCase())) {
    //     setShowAlert(
    //       <>
    //         {" "}
    //         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Subcategory "} </p>{" "}
    //       </>
    //     );
    //     handleClickOpenerr();
    //     return;
    //   }
    // }
    const updatedTodos = [...subCategoryTodo];
    updatedTodos[index] = newValue;
    setSubcategoryTodo(updatedTodos);
  };
  const handleTodoEditPop = (index, newValue) => {
    const onlSub = categoryList.map((data) => data.subcategoryname);
    let concatenatedArray = [].concat(...onlSub);
    const isDuplicate = concatenatedArray.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    // if (isDuplicate) {
    //   setShowAlert(
    //     <>
    //       {" "}
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added! Please Enter Another Subcategory"} </p>{" "}
    //     </>
    //   );
    //   handleClickOpenerr();
    //   return;
    // } else {
    //   if (editTodo.some((item) => item?.toLowerCase() === newValue?.toLowerCase())) {
    //     setShowAlert(
    //       <>
    //         {" "}
    //         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Subcategory "} </p>{" "}
    //       </>
    //     );
    //     handleClickOpenerr();
    //     return;
    //   }
    // }
    const updatedTodos = [...editTodo];
    updatedTodos[index] = newValue;
    setEditTodo(updatedTodos);
  };
  const handleSubmit = () => {
    const isNameMatch = categoryList?.some((item) => item?.categoryname?.toLowerCase() === category?.categoryname.toLowerCase());
    // function isSubcategoryNameMatch(data, namesToCheck) {
    //   for (const item of data) {
    //     for (const subcategoryName of item.subcategoryname) {
    //       if (namesToCheck.includes(subcategoryName)) {
    //         return true; // Return true if a match is found
    //       }
    //     }
    //   }
    //   return false; // No match found
    // }
    const isSubNameMatch = subDuplicate.some((item) => subCategoryTodo.includes(item));
    if (isNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another category "} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (isSubNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another subcategory "} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (category.categoryname === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Category"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (subcategory !== "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Add SubCategory Name"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (subcategory.length > 0 && subCategoryTodo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter SubCategory"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (subCategoryTodo.some((item) => item === "")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter SubCategory"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (subCategoryTodo.some((item) => item === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter SubCategory"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (subCategoryTodo.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter SubCategory"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (subCategoryTodo.length !== new Set(subCategoryTodo.map(item => item.toLowerCase())).size) {

      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added ! Please Enter Another Subcategory "}</p>
        </>
      );
      handleClickOpenerr();
      return;
    } else {
      sendRequest();
    }
  };
  const handleSubmitEdit = () => {
    getCategoryListAll();
    const isNameMatch = subDuplicate?.some((item) => item?.categoryname?.toLowerCase() === singleCategory?.categoryname.toLowerCase());
    // function isSubcategoryNameMatch(data, namesToCheck) {
    //   for (const item of data) {
    //     for (const subcategoryName of item.subcategoryname) {
    //       if (namesToCheck.includes(subcategoryName)) {
    //         return true; // Return true if a match is found
    //       }
    //     }
    //   }
    //   return false; // No match found
    // }

    const correctedArray = Array.isArray(editTodo) ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
    let conditon = "The" + " " + (singleCategory.categoryname !== ovProj && editTodo[docindex] !== ovProjsub[docindex] ? ovProj + ovProjsub[docindex] : singleCategory.categoryname !== ovProj ? ovProj : ovProjsub[docindex]);

    // const isSubNameMatch = isSubcategoryNameMatch(subDuplicate, editTodo);
    if (isNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another category "} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (singleCategory.categoryname === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Category"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (subcategoryEdit !== "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Add Sub Category Name"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (editTodo.some((item) => item === "")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter SubCategory"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (editTodo.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter SubCategory"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if ((singleCategory.categoryname != ovProj || editTodo[docindex] != ovProjsub[docindex]) && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{conditon + getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (subcategoryEdit === "" && editTodo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Sub Category"}</p>
        </>
      );
      handleClickOpenerr();

    }
    else if (editTodo.length > 0 && editTodo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Insert Sub Category"}</p>
        </>
      );
      handleClickOpenerr();


    }
    else if (editTodo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Insert Sub Category"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (editTodo.length !== new Set(editTodo.map(item => item.toLowerCase())).size) {

      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added ! Please Enter Another Subcategory "}</p>
        </>
      );
      handleClickOpenerr();
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
                handleEditOpen();
              }}
              sx={userStyle.buttonedit}
            >
              <EditOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dreferencecategory") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.categoryname);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vreferencecategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getcode(params.row.id);
                handleViewOpen();
              }}
            >
              <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ireferencecategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getcode(params.row.id);
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
  const fileName = "Reference_Category_Document";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Reference_Category_Document",
    pageStyle: "print",
  });
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Reference_Category_Document.png");
        });
      });
    }
  };
  //  PDF
  const columns = [
    { title: "CategoryCode", field: "categorycode" },
    { title: "Category ", field: "categoryname" },
    { title: "Subcategory", field: "subcategoryname" },
  ];
  const downloadPdf = (isfilter) => {


    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable?.map((item, index) => ({
        "serialNumber": index + 1,
        categoryname: item.categoryname,
        categorycode: item.categorycode,
        subcategoryname: item.subcategoryname,

      })) :
      overallExcelDatas.map((item, index) => ({
        "serialNumber": index + 1,
        categoryname: item.categoryname,
        categorycode: item.categorycode,
        subcategoryname: item.subcategoryname.map((t, i) => `${i + 1 + ". "}` + t).toString(),

      }))
      ;

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
        cellWidth: 'auto'
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Reference_Category_Document.pdf");
  };

  return (
    <Box>
      <Headtitle title={"REFERENCE CATEGORY"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Reference Documents Category"
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
                  <Typography sx={userStyle.HeaderText}>Add Reference Documents Category </Typography>
                </Grid>
                <Grid item md={2}></Grid>
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
                <Grid item md={4} sm={12} xs={12}>
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
                <Grid item md={2}></Grid>
                <Grid item md={2}></Grid>
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
                  <br /> <br />
                  <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                    <Button variant="contained" onClick={handleSubmit} disabled={isBtn}>
                      {" "}
                      SAVE{" "}
                    </Button>
                    <Button sx={userStyle.btncancel} onClick={handleClear}>
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
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6" style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {showAlert}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }} onClick={handleCloseerr}>
              {" "}
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog maxWidth="sm" open={editOpen} onClose={handleEditClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item>
                <Typography sx={userStyle.HeaderText}> Edit Reference Documents Category  </Typography>
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
                  <Button variant="contained" onClick={handleSubmitEdit}>
                    {" "}
                    Update{" "}
                  </Button>
                  <Button
                    sx={userStyle.btncancel}
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
        <Dialog maxWidth="md" open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}> View Reference Documents Category  </Typography>
              </Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Category {" "}
                  </Typography>
                  <OutlinedInput readOnly id="component-outlined" type="text" placeholder="Please Enter Category" value={singleCategory.categoryname} />
                </FormControl>
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
                              <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory" value={item} />{" "}
                            </FormControl>{" "}
                            &emsp; &emsp;
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
                <Typography sx={userStyle.HeaderText}>All Reference Documents Category </Typography>
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
                      <MenuItem value={categoryList?.length}>All</MenuItem>
                    </Select>
                    <label htmlFor="pageSizeSelect">&ensp;</label>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box>
                    {isUserRoleCompare?.includes("excelreferencecategory") && (
                      // <>
                      //   <ExportXL csvData={filteredData?.map((t, i) => ({
                      //     "S.no": i + 1,
                      //     "Category Code": t.categorycode,
                      //     "Category": t.categoryname,
                      //     SubCategoryname: t.subcategoryname.join(","),
                      //   }))} fileName={fileName} />
                      // </>
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchOverallExcelDatas()
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvreferencecategory") && (
                      // <>
                      //   <ExportCSV csvData={filteredData?.map((t, i) => ({
                      //     "S.no": i + 1,
                      //     "Category Code": t.categorycode,
                      //     "Category": t.categoryname,
                      //     SubCategoryname: t.subcategoryname.join(","),
                      //   }))} fileName={fileName} />
                      // </>
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchOverallExcelDatas()
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
                      // <>
                      //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                      //     <FaFilePdf />
                      //     &ensp;Export to PDF&ensp;
                      //   </Button>
                      // </>
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                            fetchOverallExcelDatas()
                          }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
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
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                {" "}
                Manage Columns
              </Button>{" "}
              &emsp;
              {isUserRoleCompare?.includes("bdreferencecategory") && (
                <Button variant="contained" color="error" sx={{ textTransform: "capitalize" }} onClick={handleClickOpenalert}>
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
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button onClick={(e) => deleteData(deleteId)} autoFocus variant="contained" color="error">
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Reference Category List Info</Typography>
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
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deletedocument?.categoryname} `}</span>was linked in <span style={{ fontWeight: "700" }}>Add Reference Documents</span>{" "}
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
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
              fetchOverallExcelDatas()
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
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
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delVendorcheckbox(e)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
export default ReferenceCategoryDoc;