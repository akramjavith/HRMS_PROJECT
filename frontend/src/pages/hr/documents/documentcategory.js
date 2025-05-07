import React, { useState, useEffect, useRef, useContext } from "react";
import { Popover, TextField, IconButton, Switch, List, ListItem, ListItemText, Box, Typography, OutlinedInput, Dialog, Select, TableRow, TableCell, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, Checkbox } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { SERVICE } from "../../../services/Baseservice";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useReactToPrint } from "react-to-print";
import { AiOutlineClose } from "react-icons/ai";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import StyledDataGrid from "../../../components/TableStyle";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { FaPlus } from "react-icons/fa";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import LoadingButton from "@mui/lab/LoadingButton";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";

function DocumentCategory() {

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setBtnLoad(false);
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

  let exportColumnNames = ['Type Master', 'CategoryCode', 'Category ', 'Subcategory'];
  let exportRowValues = ['typemastername', 'categorycode', 'categoryname', 'subcategoryname'];
  let newval = "DC0001";

  const [cateCode, setCatCode] = useState([]);
  const [category, setCategory] = useState({ categoryname: "" });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [isFirstSubCateView, setIsFirstSubCateView] = useState(false);
  const [loader, setLoader] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [isBtn, setIsBtn] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [singleCategory, setSingleCategory] = useState({});
  const [editTodo, setEditTodo] = useState([]);
  const [subcategoryEdit, setSubCategoryEdit] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  const [btnLoad, setBtnLoad] = useState(false)
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  // Type master document values create
  const [selectedOptionsType, setSelectedOptionsType] = useState([]);
  let [valueType, setValueType] = useState("");

  const handleTypeChange = (options) => {
    setValueType(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsType(options);
  };

  const customValueRendererType = (valueType, _type) => {
    return valueType.length
      ? valueType.map(({ label }) => label).join(", ")
      : "Please Select Type ";
  };

  // Type master document values Edit
  const [selectedOptionsTypeEdit, setSelectedOptionsTypeEdit] = useState([]);
  let [valueTypeEdit, setValueTypeEdit] = useState("");

  const handleTypeEditChange = (options) => {
    setValueType(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTypeEdit(options);
  };

  const customValueRendererTypeEdit = (valueTypeEdit, _type) => {
    return valueTypeEdit.length
      ? valueTypeEdit.map(({ label }) => label).join(", ")
      : "Please Select Type ";
  };

  const [typeOpts, setTypeOpts] = useState([]);
  const [typeOptsEdit, setTypeOptsEdit] = useState([]);

  //get all Areas.
  const fetchTypedocument = async () => {
    try {
      let res = await axios.get(SERVICE.TYPEMASTERDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const all = [
        ...res?.data?.typemasterdouments.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setTypeOpts(all);
      setTypeOptsEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchTypedocument();
  }, []);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [subDuplicate, setSubDuplicate] = useState([]);

  // const { isUserRoleCompare } = useContext(UserRoleAccessContext);

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
    setBtnLoad(false)
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [ovProj, setOvProj] = useState("");
  const [deletePages, setDeletePages] = useState("");
  const [ovProjCount, setOvProjCount] = useState(0);
  const [getOverAllCount, setGetOverallCount] = useState("");

  const [ovProjsub, setOvProjsub] = useState("");

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  const filteredDatas = categoryList?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
  const rowDataTable = filteredData.map((item, index) => {
    const correctedArray = Array.isArray(item?.subcategoryname) ? item.subcategoryname.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      typemastername: item.typemastername.join(",")?.toString(),
      categoryname: item.categoryname,
      categorycode: item.categorycode,
      subcategoryname: correctedArray.toString(),
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

  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => { setOpeninfo(true); };
  const handleCloseinfo = () => { setOpeninfo(false); };
  const [openView, setOpenView] = useState(false);
  const handleViewOpen = () => {
    setOpenView(true);
  };
  const handlViewClose = () => {
    setOpenView(false);
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
      pagename: String("Documents/Add Category Document"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const getCategory = async () => {

    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCatCode(response?.data?.doccategory);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const sendRequest = async () => {
    setIsBtn(true)
    setBtnLoad(true)
    const subcategoryName = subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    setPageName(!pageName);
    try {
      let res_queue = await axios.post(SERVICE.CATEGORYDOCUMENT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: String(category.categoryname),
        categorycode: String(newval),
        subcategoryname: subcategoryName,
        typemastername: [...valueType],
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
      setIsBtn(false)
      setBtnLoad(false)
      await getCategory();
      await getCategoryList();
    } catch (err) { setIsBtn(false); setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleClear = () => {
    setSubcategoryTodo([]);
    setSubcategory("");
    setCategory({ ...category, categoryname: "" });
    setSelectedOptionsType([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const sendRequestEdit = async () => {
    setPageName(!pageName);
    let type = selectedOptionsTypeEdit.map((item) => item.value);
    try {
      let res = await axios.put(`${SERVICE.CATEGORYDOCUMENT_SINGLE}/${singleCategory._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: String(singleCategory.categoryname),
        subcategoryname: [...editTodo],
        typemastername: [...type],
        updatedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await getCategory(); getOverallEditSectionUpdate();
      setSubCategoryEdit("");
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleEditClose();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getCategoryList = async () => {
    setPageName(!pageName);
    setLoader(true)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(false)
      setCategoryList(response?.data?.doccategory);
      setSubDuplicate(response?.data?.doccategory.filter((data) => data._id !== singleCategory._id));
      setCatCode(response?.data?.doccategory);
    } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    getCategoryList();
  }, [editOpen]);

  const EditTodoPopup = () => {
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.some((item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase())) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory !");
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
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.CATEGORYDOCUMENT_OVERALLEDIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: categoryname,
        oldnamesub: subcategoryname,
      });
      setOvProjCount(res?.data?.count);
      setDocindex(Number(docindex));

      setGetOverallCount(`${ovProj} is linked in  ${res?.data?.documents?.length > 0 ? "Add Documents ," : ""}  
        ${res?.data?.assignDocument?.length > 0 ? "Assign Documents" : ""}
       whether you want to do changes ..??`);

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.CATEGORYDOCUMENT_OVERALLEDIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
        oldnamesub: ovProjsub,
      });
      sendEditRequestOverall(res?.data?.documents, res?.data?.assignDocument);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendEditRequestOverall = async (documents, assignDocument) => {
    setPageName(!pageName);
    try {
      if (documents.length > 0) {
        let answ = documents.map((d, i) => {
          let category = d.categoryname?.filter(data => data !== ovProj);
          let res = axios.put(`${SERVICE.DOCUMENT_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryname: [...category, singleCategory.categoryname],
          });
        });
      }
      if (assignDocument.length > 0) {
        let answ = assignDocument.map((d, i) => {
          let category = d.categoryname?.filter(data => data !== ovProj);
          let res = axios.put(`${SERVICE.ASSIGNDOCUMENT_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryname: [...category, singleCategory.categoryname],
          });
        });
      }
    } catch (err) {
      console.log(err, 'err'); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getCode = async (id, categoryname, subcategory) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYDOCUMENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sdoccategory);
      setSelectedOptionsTypeEdit(
        res?.data?.sdoccategory.typemastername.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setEditTodo(res?.data?.sdoccategory?.subcategoryname);
      setOvProj(categoryname);
      setOvProjsub(subcategory);
      getOverallEditSection(categoryname, subcategory);
      handleEditOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getViewCode = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYDOCUMENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sdoccategory);
      setEditTodo(res?.data?.sdoccategory?.subcategoryname);
      handleViewOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  let updateby = singleCategory?.updatedby;
  let addedby = singleCategory?.addedby;
  let snos = 1;
  const getinfoCode = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYDOCUMENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sdoccategory);
      setEditTodo(res?.data?.sdoccategory?.subcategoryname);
      handleClickOpeninfo();
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
      getOverallEditSectionOverallDelete(selectedRows)
    }
  };

  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const getOverallEditSectionOverallDelete = async (ids) => {
    try {

      let res = await axios.post(SERVICE.OVERALL_DOCUEMENT_CATEGORY_DELETE, {
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
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const delVendorcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.CATEGORYDOCUMENT_SINGLE}/${item}`, {
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

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [deletedocument, setDeletedocument] = useState({});
  const [checkdoc, setCheckdoc] = useState();

  const rowData = async (id, categoryname) => {
    setPageName(!pageName);
    try {
      const [res, resdev] = await Promise.all([
        axios.get(`${SERVICE.CATEGORYDOCUMENT_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.CATEGORYDOCUMENT_OVERALLDELETE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkcat: String(categoryname),
        })
      ])
      setDeletedocument(res.data.sdoccategory);
      setCheckdoc(resdev?.data?.documnetcat);
      setDeletePages(`${resdev?.data?.documnetcat?.length > 0 ? "Add Documents ," : ""}  
        ${resdev?.data?.assigndocument?.length > 0 ? "Assign Documents" : ""}`)

      if ((resdev?.data?.documnetcat).length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  let deleteId = deletedocument?._id;

  const deleteData = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.delete(`${SERVICE.CATEGORYDOCUMENT_SINGLE}/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await getCategory();
      await getCategoryList();
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const addTodo = () => {
    getCategoryList();
    const isSubNameMatch = subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase());
    if (subcategory === "") {
      setPopupContentMalert("Please Enter Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory !");
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
      setPopupContentMalert("Already Added ! Please Enter Another category !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {

      setPopupContentMalert("Already Added ! Please Enter Another subcategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedOptionsType.length == 0) {
      setPopupContentMalert("Please Select Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (category.categoryname === "") {

      setPopupContentMalert("Please Enter Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategory !== "") {
      setPopupContentMalert("Add SubCategory Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategory.length > 0 && subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.length !== new Set(subCategoryTodo.map(item => item.toLowerCase())).size) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    else if (subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleSubmitEdit = () => {
    getCategoryList();
    const isNameMatch = subDuplicate?.some((item) => item?.categoryname?.toLowerCase() === singleCategory?.categoryname.toLowerCase());
    const correctedArray = Array.isArray(editTodo) ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];

    let conditon = "The" + " " + (singleCategory.categoryname !== ovProj && editTodo[docindex] !== ovProjsub[docindex] ? ovProj + ovProjsub[docindex] : singleCategory.categoryname !== ovProj ? ovProj : ovProjsub[docindex]);

    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedOptionsTypeEdit.length == 0) {
      setPopupContentMalert("Please Select Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (singleCategory.categoryname === "") {
      setPopupContentMalert("Please Enter Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategoryEdit !== "") {
      setPopupContentMalert("Add Sub Category Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (editTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
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
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    else if ((singleCategory.categoryname != ovProj) && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
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
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    categoryname: true,
    categorycode: true,
    subcategoryname: true,
    typemastername: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

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
  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

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
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "typemastername",
      headerName: "Type Master",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.typemastername,
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
      headerName: "Category",
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
          {isUserRoleCompare?.includes("edocumentscategory") && (
            <Button
              onClick={() => {
                getCode(params.row.id, params.row.categoryname, params.row.subcategoryname);

              }}

              style={{ minWidth: "0px" }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ddocumentscategory") && (
            <Button

              onClick={(e) => {
                rowData(params.row.id, params.row.categoryname);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vdocumentscategory") && (
            <Button

              onClick={(e) => {
                getViewCode(params.row.id);

              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("idocumentscategory") && (
            <Button
              sx={buttonStyles.buttoninfo}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
            </Button>
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

  // Excel
  const fileName = "Category_Document";
  let excelno = 1;


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Category Documents",
    pageStyle: "print",
  });
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Category Document.png");
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
      {isUserRoleCompare?.includes("adocumentscategory") && (
        <>
          <PageHeading
            title="Category Document"
            modulename="Documents"
            submodulename="Documents Category"
            mainpagename=""
            subpagename=""
            subsubpagename=""
          />
          <Box sx={userStyle.selectcontainer}>
            <Headtitle title={"category document"} />
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>Add Document Category </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type Master <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={typeOpts}
                    value={selectedOptionsType}
                    onChange={handleTypeChange}
                    valueRenderer={customValueRendererType}
                    labelledBy="Please Select Type"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {!isFirstSubCateView && (
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
                        setCategory({
                          ...category,
                          categoryname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                )}
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  {cateCode &&
                    cateCode.map(() => {
                      let strings = "DC";
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
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnLoad} variant="contained" onClick={handleSubmit}>
                    SAVE
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
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
                <Typography sx={userStyle.HeaderText}>Edit Category Document</Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type Master <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={typeOptsEdit}
                    value={selectedOptionsTypeEdit}
                    onChange={handleTypeEditChange}
                    valueRenderer={customValueRendererTypeEdit}
                    labelledBy="Please Select Type"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {!isFirstSubCateView && (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
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
              <Grid item md={3} sm={12} xs={12}>
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
                  <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmitEdit}>
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
        <Dialog maxWidth="md" open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>View Category Document</Typography>
              </Grid>
              <Grid item md={4} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type Master</Typography>
                  <Typography>   {singleCategory.typemastername + ","}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                {!isFirstSubCateView && (
                  <FormControl fullWidth size="small">
                    <Typography>
                      <b>Category</b>
                    </Typography>
                    <Typography>{singleCategory.categoryname}</Typography>
                  </FormControl>
                )}
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Category Code</b>
                  </Typography>
                  <Typography>{singleCategory.categorycode}</Typography>
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
                          <Grid sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                              <Typography>{index + 1}{". "}{item}</Typography>
                            </FormControl>
                            &emsp;
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
                  <Button
                    sx={buttonStyles.btncancel}
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
      <br />
      <br />

      {loader ?
        <Box sx={userStyle.container}>
          <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box> :
        <>
          {isUserRoleCompare?.includes("ldocumentscategory") && (
            <>
              <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography sx={userStyle.HeaderText}>All Category Document List</Typography>
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
                          {/* <MenuItem value={categoryList?.length}>All</MenuItem> */}
                        </Select>
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
                        {isUserRoleCompare?.includes("exceldocumentscategory") && (
                          <>
                            <Button onClick={(e) => {
                              setIsFilterOpen(true)
                              setFormat("xl")
                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("csvdocumentscategory") && (

                          <>
                            <Button onClick={(e) => {
                              setIsFilterOpen(true)
                              setFormat("csv")
                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                          </>
                        )}
                        {isUserRoleCompare?.includes("printdocumentscategory") && (
                          <>
                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                              &ensp;
                              <FaPrint />
                              &ensp;Print&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("pdfdocumentscategory") && (
                          <>
                            <Button sx={userStyle.buttongrp}
                              onClick={() => {
                                setIsPdfFilterOpen(true)
                              }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("imagedocumentscategory") && (
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
                  &emsp;
                  {isUserRoleCompare?.includes("bddocumentscategory") && (
                    <>
                      <Button variant="contained" color="error" sx={{ ...buttonStyles.buttonbulkdelete, textTransform: "capitalize" }} onClick={handleClickOpenalert}>
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

              </Box>
            </>
          )}
        </>
      }
      <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.btncancel} onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button sx={buttonStyles.buttonsubmit} onClick={(e) => deleteData(deleteId)} autoFocus variant="contained" color="error">
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
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
              sx={buttonStyles.btncancel}
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
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deletedocument?.categoryname} `}</span>was linked in <span style={{ fontWeight: "700" }}>{deletePages}</span>{" "}
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
      {/* ALERT DIALOG */}
      <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
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
              <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Ok</Button>
            }
          </DialogActions>
        </Dialog>

      </Box>

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
        filename={"Category Documents"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Category Document Info"
        addedby={addedby}
        updateby={updateby}
      />
    </Box>
  );
}

export default DocumentCategory;