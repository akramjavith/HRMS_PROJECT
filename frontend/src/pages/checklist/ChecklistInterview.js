import React, { useState, useEffect, useRef, useContext } from "react";
import StyledDataGrid from "../../components/TableStyle";
import { Popover, TextField, IconButton, Switch, List, ListItem, ListItemText, Box, Typography, OutlinedInput, Dialog, Select, Checkbox, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
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
import Selects from "react-select";

function ChecklistInterview() {
  const gridRef = useRef(null);
  //useState
  const [checklistInterview, setChecklistInterview] = useState({ category:"Please Select Category",subcategory:"Please Select Sub Category",employeestatus:"Please Select Employee Status",checklisttype:"Please Select Checklist Type" });
  const [checklistNamesTodo, setChecklistNamesTodo] = useState([]);
  const [checklistNames, setChecklistNames] = useState("");
  const [checklistInterviewList, setChecklistInterviewList] = useState([]);
  const { auth } = useContext(AuthContext);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [singleChecklist, setSingleChecklist] = useState({});
  const [editTodo, setEditTodo] = useState([]);
  const [checklistNameEdit, setChecklistNameEdit] = useState("");
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
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const [excel, setExcel] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [categoryOption, setCategoryOption] = useState([]);
  const [categoryOpt, setCategoryOpt] = useState([]);
  const [subCategoryOpt, setSubCategoryOpt] = useState([]);
  const [subCategoryOptEdit, setSubCategoryOptEdit] = useState([]);
  const [employeeStatusOpt, setEmployeeStatusOpt] = useState([]);
  const [checklistTypeOpt, setChecklistTypeOpt] = useState([]);

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    category: true,
    subcategory: true,
    employeestatus: true,
    checklisttype: true,
    checklistname: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const username = isUserRoleAccess?.username;


  //useEffect
  useEffect(() => {
    getCategoryList();
    fetchCategory();
    fetchEmployeeStatus();
    fetchChecklistType();
  }, []);
  useEffect(() => {
    getCategoryListAll();
  }, [editOpen, singleChecklist]);
  useEffect(() => {
    getexcelDatas();
  }, [checklistInterviewList]);


  useEffect(() => {
    const filteredSubcat =[...categoryOption?.filter(u =>
        u.categoryname === checklistInterview.category)?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        }).flat()]
    setSubCategoryOpt(filteredSubcat);
}, [checklistInterview.category]);
  useEffect(() => {
    const filteredSubcatEdit =[...categoryOption?.filter(u =>
        u.categoryname === singleChecklist.category)?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        }).flat()]
    setSubCategoryOptEdit(filteredSubcatEdit);
}, [singleChecklist.category]);
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

  const sendRequest = async () => {
    const subcategoryName = checklistNamesTodo.length === 0 ? checklistNames : [...checklistNamesTodo];
    try {
      let res_doc = await axios.post(SERVICE.CREATE_CHECKLISTINTERVIEW, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        category: String(checklistInterview.category),
        subcategory: String(checklistInterview.subcategory),
        employeestatus: String(checklistInterview.employeestatus),
        checklisttype: String(checklistInterview.checklisttype),
        checklistname: subcategoryName,
        addedby: [{ name: String(isUserRoleAccess.companyname), date: String(new Date()) }],
      });
      setChecklistNamesTodo([]);
      setChecklistNames("");
      setChecklistInterview({ ...checklistInterview });
      
      await getCategoryList();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Added Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const handleClear = () => {
    setChecklistNamesTodo([]);
    setChecklistNames("");
    setChecklistInterview({ category:"Please Select Category",subcategory:"Please Select Sub Category",employeestatus:"Please Select Employee Status",checklisttype:"Please Select Checklist Type"});
    setShowAlert(
      <>
        {" "}
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Cleared Successfully👍"} </p>{" "}
      </>
    );
    handleClickOpenerr();
  };
  const getCategoryListAll = async () => {
    try {
      let response = await axios.get(`${SERVICE.ALL_CHECKLISTINTERVIEW}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSubDuplicate(response.data.checklistinterview.filter((data) => data._id !== singleChecklist._id));
      setLoading(true);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const sendRequestEdit = async () => {
    try {
      let res = await axios.put(`${SERVICE.SINGLE_CHECKLISTINTERVIEW}/${singleChecklist._id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        category: String(singleChecklist.category),
        subcategory: String(singleChecklist.subcategory),
        employeestatus: String(singleChecklist.employeestatus),
        checklisttype: String(singleChecklist.checklisttype),
        checklistname: [...editTodo],
        updatedby: [...updateby, { name: String(isUserRoleAccess.companyname), date: String(new Date()) }],
      });
      await getCategoryList();
      await getCategoryListAll();
    //   await getOverallEditSectionUpdate()
      setChecklistNameEdit("");
      
      handleEditClose();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Updated Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const getCategoryList = async () => {
    try {
      let response = await axios.get(`${SERVICE.ALL_CHECKLISTINTERVIEW}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setChecklistInterviewList(response?.data?.checklistinterview);
      setSubDuplicate(response?.data?.checklistinterview.filter((data) => data._id !== singleChecklist._id));
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const fetchCategory = async () => {
    try {
      let res = await axios.get(SERVICE.CHECKLISTCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOption(res?.data?.checklistcategory)
      setCategoryOpt([
        ...res?.data?.checklistcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const fetchEmployeeStatus = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_EMPLOYEESTATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmployeeStatusOpt([
        ...res?.data?.employeestatus?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const fetchChecklistType = async () => {
    try {
      let res = await axios.get(SERVICE.CHECKLISTTYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setChecklistTypeOpt([
        ...res?.data?.checklisttypes?.map((t) => ({
          ...t,
          label: t.typename,
          value: t.typename,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const EditTodoPopup = () => {
    getCategoryList();
    // const isSubNameMatch = checklistInterviewList.some((item) => item.checklistname.includes(checklistNameEdit));
    if (checklistNameEdit === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {" Please Enter Checklist Name "} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }  else if (editTodo.some((item) => item?.toLowerCase() === checklistNameEdit?.toLowerCase())) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Checklist Name"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      setEditTodo([...editTodo, checklistNameEdit]);
      setChecklistNameEdit("");
    }
  };

  const getcode = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_CHECKLISTINTERVIEW}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSingleChecklist(res.data.schecklistinterview);
      setEditTodo(res.data.schecklistinterview.checklistname);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // updateby edit page...
  let updateby = singleChecklist.updatedby;
  let addedby = singleChecklist.addedby;


  const [deletedocument, setDeletedocument] = useState({});
  const [checkdoc, setCheckdoc] = useState();


  const rowData = async (id) => {
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_CHECKLISTINTERVIEW}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeletedocument(res.data.schecklistinterview)
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  let deleteId = deletedocument?._id;

  const deleteData = async () => {
    try {
      let res = await axios.delete(
        `${SERVICE.SINGLE_CHECKLISTINTERVIEW}/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await getCategoryList();
      await getCategoryListAll();
      handleCloseDelete();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const delVendorcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_CHECKLISTINTERVIEW}/${item}`, {
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
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const addTodo = () => {
    getCategoryList();
    const isNameMatch = checklistInterviewList?.some((item) => 
    item?.category === checklistInterview?.category &&
    item?.subcategory === checklistInterview?.subcategory &&
    item?.employeestatus === checklistInterview?.employeestatus &&
    item?.checklisttype === checklistInterview?.checklisttype 
    );
    // const isSubNameMatch = checklistInterviewList.some((item) => item.checklistname.includes(subcategory));
    if (checklistNames === "") {
      setShowAlert(
        <>  
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Checklist Name"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Checklist-Interview Already Exist"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (checklistInterview.categoryname === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Category"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (checklistNamesTodo.some((item) => item?.toLowerCase() === checklistNames?.toLowerCase())) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Checklist Name"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      setChecklistNamesTodo([...checklistNamesTodo, checklistNames]);
      setChecklistNames("");
    }
  };
  const handleTodoEdit = (index, newValue) => {
    const isDuplicate = checklistNamesTodo.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    if (isDuplicate) {
      // Handle duplicate case, show an error message, and return early
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added! Please Enter Another Subcategory"} </p>{" "}
        </>
      );
      handleClickOpenerr();
      return;
    } else {
      if (checklistNamesTodo.some((item) => item?.toLowerCase() === newValue?.toLowerCase())) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Checklist Name"} </p>{" "}
          </>
        );
        handleClickOpenerr();
        return;
      }
    }
    const updatedTodos = [...checklistNamesTodo];
    updatedTodos[index] = newValue;
    setChecklistNamesTodo(updatedTodos);
  };
  const handleTodoEditPop = (index, newValue) => {
    const onlSub = checklistInterviewList.map((data) => data.checklistname);
    let concatenatedArray = [].concat(...onlSub);
    const isDuplicate = concatenatedArray.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    if (isDuplicate) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added! Please Enter Another Subcategory"} </p>{" "}
        </>
      );
      handleClickOpenerr();
      return;
    } else {
      if (editTodo.some((item) => item?.toLowerCase() === newValue?.toLowerCase())) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Already Added ! Please Enter Another Checklist Name"} </p>{" "}
          </>
        );
        handleClickOpenerr();
        return;
      }
    }
    const updatedTodos = [...editTodo];
    updatedTodos[index] = newValue;
    setEditTodo(updatedTodos);
  };
  const handleSubmit = () => {
    const isNameMatch = checklistInterviewList?.some((item) => 
    item?.category === checklistInterview?.category &&
    item?.subcategory === checklistInterview?.subcategory &&
    item?.employeestatus === checklistInterview?.employeestatus &&
    item?.checklisttype === checklistInterview?.checklisttype 
    );
    // function isSubcategoryNameMatch(data, namesToCheck) {
    //   for (const item of data) {
    //     for (const subcategoryName of item.checklistname) {
    //       if (namesToCheck.includes(subcategoryName)) {
    //         return true; // Return true if a match is found
    //       }
    //     }
    //   }
    //   return false; // No match found
    // }
    // const isSubNameMatch = isSubcategoryNameMatch(checklistInterviewList, checklistNamesTodo);
    if (isNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Checklist-Interview Already Exist "} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }  
    else if (checklistInterview.category === "Please Select Category") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Category"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } 
    else if (checklistInterview.subcategory === "Please Select Sub Category") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Sub Category"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } 
    else if (checklistInterview.employeestatus === "Please Select Employee Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Employee Status"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } 
    else if (checklistInterview.checklisttype === "Please Select Checklist Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Checklist Type"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } 
    else if (checklistNamesTodo.some((item) => item === "")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Checklist Name"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (checklistNamesTodo.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Checklist Name"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  const handleSubmitEdit = () => {
    getCategoryListAll();
    const isNameMatch = subDuplicate?.some((item) => 
    item?.category === singleChecklist?.category &&
    item?.subcategory === singleChecklist?.subcategory &&
    item?.employeestatus === singleChecklist?.employeestatus &&
    item?.checklisttype === singleChecklist?.checklisttype 
    );
    // function isSubcategoryNameMatch(data, namesToCheck) {
    //   for (const item of data) {
    //     for (const subcategoryName of item.checklistname) {
    //       if (namesToCheck.includes(subcategoryName)) {
    //         return true; // Return true if a match is found
    //       }
    //     }
    //   }
    //   return false; // No match found
    // }

    // const isSubNameMatch = isSubcategoryNameMatch(subDuplicate, editTodo);
    if (isNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Checklist-Interview Already Exist"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }  
    else if (singleChecklist.category === "Please Select Category") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Category"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (singleChecklist.subcategory === "Please Select Sub Category") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Sub Category"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (singleChecklist.employeestatus === "Please Select Employee Status") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Employee Status"} </p>{" "}
          </>
        );
        handleClickOpenerr();
      } 
      else if (singleChecklist.checklisttype === "Please Select Checklist Type") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Checklist Type"} </p>{" "}
          </>
        );
        handleClickOpenerr();
      } 
     else if (editTodo.some((item) => item === "")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Checklist Name"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (editTodo.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Checklist Name"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }

    else {
      sendRequestEdit();
    }
  };
  const deleteTodo = (index) => {
    const updatedTodos = [...checklistNamesTodo];
    updatedTodos.splice(index, 1);
    setChecklistNamesTodo(updatedTodos);
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
  const filteredDatas = checklistInterviewList?.filter((item) => {
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
    { field: "serialNumber", headerName: "S.No", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.serialNumber },
    { field: "category", headerName: "Category", flex: 0, width: 130, minHeight: "40px", hide: !columnVisibility.category},
    { field: "subcategory", headerName: "Sub Category", flex: 0, width: 130, minHeight: "40px", hide: !columnVisibility.subcategory },
    { field: "employeestatus", headerName: "Employee Status", flex: 0, width: 150, minHeight: "40px", hide: !columnVisibility.employeestatus },
    { field: "checklisttype", headerName: "Checklist Type", flex: 0, width: 150, minHeight: "40px", hide: !columnVisibility.checklisttype },
    { field: "checklistname", headerName: "Checklist Names", flex: 0, width: 180, minHeight: "40px", hide: !columnVisibility.checklistname },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("echecklistinterview") && (
            <Button
              onClick={() => {
                getcode(params.row.id);
                handleEditOpen();
              }}
              sx={userStyle.buttonedit}
            >
              <EditOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dchecklistinterview") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vchecklistinterview") && (
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
          {isUserRoleCompare?.includes("ichecklistinterview") && (
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
    const correctedArray = Array.isArray(item?.checklistname) ? item.checklistname.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      category: item.category,
      subcategory: item.subcategory,
      employeestatus: item.employeestatus,
      checklisttype: item.checklisttype,
      checklistname: correctedArray,
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
  const fileName = "Checklist-Interview";
  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = checklistInterviewList?.map((t, i) => ({
      "S.no": i + 1,
      "Category": t.category,
      "Sub Category": t.subcategory,
      "Employee Status": t.employeestatus,
      "Checklist Type": t.checklisttype,
      "Checklist Names": t.checklistname.join(","),
    }));
    setExcel(data);
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Checklist-Interview",
    pageStyle: "print",
  });
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ChecklistInterview.png");
        });
      });
    }
  };
  //  PDF
  const columns = [
    { title: "S.No ", field: "serialNumber" },
    { title: "Category", field: "category" },
    { title: "SubCategory", field: "subcategory" },
    { title: "Employee Status", field: "employeestatus" },
    { title: "Checklist Type", field: "checklisttype" },
    { title: "Checklist Names", field: "checklistname" },
  ];
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({ theme: "grid", columns: columns.map((col) => ({ ...col, dataKey: col.field })), body: checklistInterviewList });
    doc.save("ChecklistInterview.pdf");
  };
  return (
    <Box>
      <Headtitle title={"CHECKLIST INTERVIEW"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Manage Checklist-Interview</Typography>
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("achecklistinterview") && (
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography sx={userStyle.HeaderText}>Add Checklist-Interview</Typography>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={categoryOpt}
                      placeholder="Please Select Category"
                      value={{ label: checklistInterview.category, value: checklistInterview.category }}
                      onChange={(e) => {
                        setChecklistInterview({
                          ...checklistInterview,
                          category: e.value,
                          subcategory: "Please Select Sub Category",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={subCategoryOpt}
                      placeholder="Please Select Sub Category"
                      value={{ label: checklistInterview.subcategory, value: checklistInterview.subcategory }}
                      onChange={(e) => {
                        setChecklistInterview({
                          ...checklistInterview,
                          subcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Status <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={employeeStatusOpt}
                      placeholder="Please Select Employee Status"
                      value={{ label: checklistInterview.employeestatus, value: checklistInterview.employeestatus }}
                      onChange={(e) => {
                        setChecklistInterview({
                          ...checklistInterview,
                          employeestatus: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Checklist Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={checklistTypeOpt}
                      placeholder="Please Select Checklist Type"
                      value={{ label: checklistInterview.checklisttype, value: checklistInterview.checklisttype }}
                      onChange={(e) => {
                        setChecklistInterview({
                          ...checklistInterview,
                          checklisttype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Checklist Name <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput id="component-outlined" placeholder="Please Enter Checklist Name" value={checklistNames} onChange={(e) => setChecklistNames(e.target.value)} />
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
                  {checklistNamesTodo.length > 0 && (
                    <ul type="none">
                      {checklistNamesTodo.map((item, index) => {
                        return (
                          <li key={index}>
                            <br />
                            <Grid sx={{ display: "flex" }}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                Checklist Name <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput id="component-outlined" placeholder="Please Enter Checklist Name" value={item} onChange={(e) => handleTodoEdit(index, e.target.value)} />
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
                    <Button variant="contained" onClick={handleSubmit}>
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
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}> Edit Checklist-Interview </Typography>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={categoryOpt}
                      placeholder="Please Select Category"
                      value={{ label: singleChecklist.category, value: singleChecklist.category }}
                      onChange={(e) => {
                        setSingleChecklist({
                          ...singleChecklist,
                          category: e.value,
                          subcategory: "Please Select Sub Category",
                        });
                      }}
                    />
                  </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={subCategoryOptEdit}
                      placeholder="Please Select Sub Category"
                      value={{ label: singleChecklist.subcategory, value: singleChecklist.subcategory }}
                      onChange={(e) => {
                        setSingleChecklist({
                          ...singleChecklist,
                          subcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                    <Typography>
                      Employee Status <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={employeeStatusOpt}
                      placeholder="Please Select Employee Status"
                      value={{ label: singleChecklist.employeestatus, value: singleChecklist.employeestatus }}
                      onChange={(e) => {
                        setSingleChecklist({
                          ...singleChecklist,
                          employeestatus: e.value,
                        });
                      }}
                    />
                  </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                    <Typography>
                      Checklist Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={checklistTypeOpt}
                      placeholder="Please Select Checklist Type"
                      value={{ label: singleChecklist.checklisttype, value: singleChecklist.checklisttype }}
                      onChange={(e) => {
                        setSingleChecklist({
                          ...singleChecklist,
                          checklisttype: e.value,
                        });
                      }}
                    />
                  </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Checklist Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput id="component-outlined" placeholder="Please Enter Checklist Name" value={checklistNameEdit} onChange={(e) => setChecklistNameEdit(e.target.value)} />
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
                                placeholder="Please Enter Checklist Name"
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
                      setChecklistNameEdit("");
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
        <Dialog maxWidth="sm" open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}> View Checklist-Interview </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Category<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput readOnly id="component-outlined" type="text" placeholder="Please Select Category" value={singleChecklist.category} />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Sub Category<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput readOnly id="component-outlined" type="text" placeholder="Please Select Sub Category" value={singleChecklist.subcategory} />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Employee Status<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput readOnly id="component-outlined" type="text" placeholder="Please Select Employee Status" value={singleChecklist.employeestatus} />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Checklist Type<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput readOnly id="component-outlined" type="text" placeholder="Please Select Checklist Type" value={singleChecklist.checklisttype} />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <Typography>
                Checklist Name <b style={{ color: "red" }}>*</b>
                </Typography>
                {editTodo.length > 0 && (
                  <ul type="none">
                    {editTodo.map((item, index) => {
                      return (
                        <li key={index}>
                          <br />
                          <Grid sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                              <OutlinedInput id="component-outlined" placeholder="Please Enter Checklist Name" value={item} />{" "}
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
      {isUserRoleCompare?.includes("lchecklistinterview") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>List Checklist-Interview</Typography>
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
                      <MenuItem value={checklistInterviewList?.length}>All</MenuItem>
                    </Select>
                    <label htmlFor="pageSizeSelect">&ensp;</label>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box>
                    {isUserRoleCompare?.includes("excelchecklistinterview") && (
                      <>
                        <ExportXL csvData={excel} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvchecklistinterview") && (
                      <>
                        <ExportCSV csvData={excel} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("printchecklistinterview") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          {" "}
                          &ensp; <FaPrint /> &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfchecklistinterview") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagechecklistinterview") && (
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
                <Button variant="contained" color="error" sx={{ textTransform: "capitalize" }} onClick={handleClickOpenalert}>
                    Bulk Delete
                  </Button>
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
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Sub Category</StyledTableCell>
                    <StyledTableCell>Employee Status</StyledTableCell>
                    <StyledTableCell>Checklist Type</StyledTableCell>
                    <StyledTableCell>Checklist Names</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {checklistInterviewList?.length > 0 ? (
                    checklistInterviewList?.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{row.category}</StyledTableCell>
                        <StyledTableCell>{row.subcategory}</StyledTableCell>
                        <StyledTableCell>{row.employeestatus}</StyledTableCell>
                        <StyledTableCell>{row.checklisttype}</StyledTableCell>
                        <StyledTableCell>{row?.checklistname?.map((d) => d + ",")}</StyledTableCell>
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
            <Typography sx={userStyle.HeaderText}>Checklist-Interview List Info</Typography>
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

            <Grid >
              <Button variant="contained" style={{
                padding: '7px 13px',
                color: 'white',
                background: 'rgb(25, 118, 210)'
              }} onClick={() => {
                sendRequestEdit();
                handleCloseerrpop();
              }}>
                ok
              </Button>
            </Grid>

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
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deletedocument?.category} `}</span>was linked in <span style={{ fontWeight: "700" }}>Add Checklist-Interview</span>{" "}
                    </>
                  )
                    : (
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
export default ChecklistInterview;
