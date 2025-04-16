import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Popover,
  TextField,
  IconButton,
  Switch,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  Select,
  Checkbox,
  MenuItem,
  TableBody,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
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
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import StyledDataGrid from "../../components/TableStyle";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
function IpCategory() {

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
    setloadingdeloverall(false)
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
    setloadingdeloverall(false)
  };



  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  //check delete model
  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => {

    setisCheckOpenbulk(true);
  };
  const handlebulkCloseCheck = () => {
    setSelectedRows([])
    setSelectedRowsCat([])
    setisCheckOpenbulk(false);
    setSelectAllChecked(false);
  };

  const [fileFormat, setFormat] = useState("");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable.map((t, index) => {
          return {
            serialNumber: index + 1,
            "Category Code": t.categorycode,
            "Category": t.categoryname,
            SubCategory: t.subcategoryname.join(","),
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        categoryList?.map((item, index) => ({
          "S.No": index + 1,
          "Category Code": item.categorycode,
          "Category": item.categoryname,
          "Subcategory": item.subcategoryname?.join(","),
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "CategoryCode", field: "categorycode" },
    { title: "Category ", field: "categoryname" },
    { title: "Subcategoryname", field: "subcategoryname" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((item, index) => {
          return {
            serialNumber: index + 1,
            categorycode: item.categorycode,
            categoryname: item.categoryname,
            subcategoryname: item.subcategoryname,
          };
        })
        : categoryList?.map((item, index) => ({
          serialNumber: index + 1,
          categorycode: item.categorycode,
          categoryname: item.categoryname,
          subcategoryname: item.subcategoryname?.join(","),
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Ip_Category.pdf");
  };

  let newval = "IP0001";
  const gridRef = useRef(null);
  //useState
  const [cateCode, setCatCode] = useState([]);
  const [loadingdeloverall, setloadingdeloverall] = useState(false);
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

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({ ipcategory: [] });

  const handleClickOpenCheck = (data) => {
    setisCheckOpen(true);
    // setOveraldeletecheck(data);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [subDuplicate, setSubDuplicate] = useState([]);
  const [openInfo, setOpeninfo] = useState(false);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const [excel, setExcel] = useState([]);
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
    subcategorynamelist: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //useEffect
  useEffect(() => {
    getCategoryList();
  }, []);
  useEffect(() => {
    getCategoryListAll();
  }, [editOpen, singleCategory]);
  useEffect(() => {
    getexcelDatas();
  }, [categoryList]);


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



  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const [checkUnit, setCheckUnit] = useState();

  // const handleClickOpenalert = async () => {
  //   let value = [...new Set(selectedRowsCat.flat())];
  //   if (selectedRows.length === 0) {
  //     setIsDeleteOpenalert(true);
  //   } else {
  //     let resdev = await axios.post(SERVICE.OVERALL_DELETE_IPCATEGORY, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       checkunit: value,
  //     });

  //     if (resdev?.data?.ipcat?.length > 0) {
  //       setCheckUnit([]);
  //       handleClickOpenCheck(resdev?.data?.ipcat);
  //     } else {
  //       setIsDeleteOpencheckbox(true);
  //     }
  //   }
  // };
  const handleClickOpenalert = async () => {
    // let value = [...new Set(selectedRowsCat.flat())];
    let value = [...new Set(selectedRowsCat.flat())];
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      let resdev = await axios.post(SERVICE.OVERALL_DELETE_IPCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkunit: value,
      });

      if (resdev?.data?.ipcat?.length > 0) {
        setOveraldeletecheck({ ...overalldeletecheck, ipcategory: resdev?.data?.ipcat })
        handleClickOpenCheckbulk();
        setCheckUnit([]);
        // handleClickOpenCheck(resdev?.data?.ipcat);
      } else {
        setIsDeleteOpencheckbox(true);
      }
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
    const subcategoryName =
      subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    try {
      let res_doc = await axios.post(SERVICE.IPCATEGORY_CREATE, {
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
      let response = await axios.get(`${SERVICE.IPCATEGORY}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSubDuplicate(
        response.data.ipcategory.filter(
          (data) => data._id !== singleCategory._id
        )
      );
      setLoading(true);
    } catch (err) { setLoading(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const sendRequestEdit = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.IPCATEGORY_SINGLE}/${singleCategory._id}`,
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
      await getOverallEditSectionUpdate();
      setSubCategoryEdit("");
      handleEditClose();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getCategoryList = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.IPCATEGORY}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setCategoryList(response.data.ipcategory);
      setSubDuplicate(
        response.data.ipcategory.filter(
          (data) => data._id !== singleCategory._id
        )
      );
      setCatCode(response.data.ipcategory);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const EditTodoPopup = () => {
    setPageName(!pageName)
    getCategoryList();
    if (subcategoryEdit === "") {

      setPopupContentMalert("Please Enter Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editTodo.some(
        (item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase()
      )
    ) {

      setPopupContentMalert("Already Added ! Please Enter Another Subcategory ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    } else {
      setEditTodo([...editTodo, subcategoryEdit]);
      setSubCategoryEdit("");
    }
  };

  const [docindex, setDocindex] = useState("");

  //overall edit section for all pages
  const getOverallEditSection = async (categoryname) => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_IPCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: categoryname,
      });
      setOvProjCount(res.data.count);

      setGetOverallCount(` is linked in  ${res.data.ipmaster?.length > 0 ? "IP Masters" : ""
        }  
       whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_IPCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res.data.ipmaster);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendEditRequestOverall = async (ipmaster) => {
    setPageName(!pageName)
    try {
      if (ipmaster.length > 0) {
        let answ = ipmaster.map((d, i) => {
          let res = axios.put(`${SERVICE.IPMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryname: String(singleCategory.categoryname),
            ipconfig: [
              {
                ...d.ipconfig,
                categoryname: String(singleCategory.categoryname),
                subcategoryname: d.ipconfig[0].subcategoryname,
                type: d.ipconfig[0].type,
                subnet: d.ipconfig[0].subnet,
                ipdetails: d.ipconfig[0].ipdetails,
                ipaddress: d.ipconfig[0].ipaddress,
                gateway: d.ipconfig[0].gateway,
                dns1: d.ipconfig[0].dns1,
                company: d.ipconfig[0].company,
                branch: d.ipconfig[0].branch,
                unit: d.ipconfig[0].unit,
                floor: d.ipconfig[0].floor,
                area: d.ipconfig[0].area,
                location: d.ipconfig[0].location,
                assetmaterial: d.ipconfig[0].assetmaterial,
                status: d.ipconfig[0].status,
              },
            ],
          });
        });
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getcode = async (id, categoryname, type) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.IPCATEGORY_SINGLE}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSingleCategory(res.data.sipcategory);
      setEditTodo(res.data.sipcategory.subcategoryname);
      setOvProj(categoryname);
      getOverallEditSection(categoryname);
      if (type == "edit") {
        handleEditOpen();
      } else if (type == "view") {
        handleViewOpen();
      } else if (type == "info") {
        handleClickOpeninfo();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // updateby edit page...
  let updateby = singleCategory.updatedby;
  let addedby = singleCategory.addedby;

  const [deletedocument, setDeletedocument] = useState({});

  const rowData = async (id, categoryname) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.IPCATEGORY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletedocument(res?.data?.sipcategory);

      let resdev = await axios.post(SERVICE.OVERALL_DELETE_IPCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkunit: [categoryname],
      });
      setCheckUnit(resdev?.data?.ipcat);
      if (resdev?.data?.ipcat?.length > 0) {
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
      let res = await axios.delete(`${SERVICE.IPCATEGORY_SINGLE}/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await getCategoryList();
      await getCategoryListAll();
      handleCloseDelete();
      setPopupContent("Delted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delVendorcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.IPCATEGORY_SINGLE}/${item}`, {
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
      setPopupContent("Delted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delReasoncheckboxWithoutLink = async () => {
    setPageName(!pageName)
    try {
      // let filtered = rowDataTable.filter(
      //   (d) =>
      //     !overalldeletecheck.ipcategory.some(
      //       (item) => d.categoryname === item.categoryname
      //     )
      // );
      let filtered = rowDataTable.filter(
        (d) =>
          selectedRows.includes(d.id) &&
          !overalldeletecheck.ipcategory.some((item) => d.categoryname === item.categoryname)
      );

      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.IPCATEGORY_SINGLE}/${item.id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handlebulkCloseCheck();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await getCategoryList();
      setPopupContent("Delted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const addTodo = () => {

    getCategoryList();
    if (subcategory === "") {

      setPopupContentMalert("Please Enter Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      subCategoryTodo.some(
        (item) => item?.toLowerCase() === subcategory?.toLowerCase()
      )
    ) {

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

    const updatedTodos = [...editTodo];
    updatedTodos[index] = newValue;
    setEditTodo(updatedTodos);
  };

  const handleSubmit = () => {
    setloadingdeloverall(true);
    let matchValue = subCategoryTodo.filter(
      (data) => data === subCategoryTodo.includes(data)
    );
    const isNameMatch = categoryList?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        category?.categoryname.toLowerCase()
    );
    const isSubNameMatch = subDuplicate.some((item) =>
      subCategoryTodo.includes(item)
    );

    if (isNameMatch) {

      setPopupContentMalert("Already Added ! Please Enter Another category !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {

      setPopupContentMalert("Already Added ! Please Enter Another Subcategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (category.categoryname === "") {

      setPopupContentMalert("Please Enter Category !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategory !== "") {

      setPopupContentMalert("Please Enter SubCategory Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (subcategory.length > 0 && subCategoryTodo.length === 0) {

      setPopupContentMalert("Please Enter SubCategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter SubCategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter SubCategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      subCategoryTodo.length !==
      new Set(subCategoryTodo.map((item) => item.toLowerCase())).size
    ) {

      setPopupContentMalert("Already Added ! Please Enter Another SubCategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (subCategoryTodo.length === 0) {

      setPopupContentMalert(" Please Enter SubCategory !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else {
      sendRequest();
    }
  };

  const handleSubmitEdit = () => {
    setPageName(!pageName)
    getCategoryList();
    const isNameMatch = subDuplicate?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        singleCategory?.categoryname.toLowerCase()
    );

    const correctedArray = Array.isArray(editTodo)
      ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];

    let conditon =
      "The" +
      " " +
      (singleCategory.categoryname !== ovProj &&
        editTodo[docindex] !== ovProjsub[docindex]
        ? ovProj + ovProjsub[docindex]
        : singleCategory.categoryname !== ovProj
          ? ovProj
          : ovProjsub[docindex]);

    if (isNameMatch) {


      setPopupContentMalert("Already Added ! Please Enter Another category ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleCategory.categoryname === "") {

      setPopupContentMalert("Please Enter Category ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategoryEdit !== "") {

      setPopupContentMalert("Add Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.some((item) => item === "")) {

      setPopupContentMalert("Please Enter Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (singleCategory.categoryname != ovProj ||
        editTodo[docindex] != ovProjsub[docindex]) &&
      ovProjCount > 0
    ) {
      // setShowAlertpop(
      //   <>
      //     <ErrorOutlineOutlinedIcon
      //       sx={{ fontSize: "100px", color: "orange" }}
      //     />
      //     <p style={{ fontSize: "20px", fontWeight: 900 }}>
      //       {conditon + getOverAllCount}
      //     </p>
      //   </>
      // );
      // handleClickOpenerrpop();
      setPopupContentMalert(conditon + getOverAllCount);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategoryEdit === "" && editTodo.length === 0) {

      setPopupContentMalert("Please Enter Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length > 0 && editTodo.length === 0) {

      setPopupContentMalert("Please Insert Sub Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length === 0) {

      setPopupContentMalert("Please Insert Sub Category");
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
    } else if (singleCategory.categoryname != ovProj && ovProjCount > 0) {
      // setShowAlertpop(
      //   <>
      //     <ErrorOutlineOutlinedIcon
      //       sx={{ fontSize: "100px", color: "orange" }}
      //     />
      //     <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
      //   </>
      // );
      // handleClickOpenerrpop();
      setPopupContentMalert(getOverAllCount);
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

  const [selectedRowsCat, setSelectedRowsCat] = useState([]);
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
              setSelectedRowsCat([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              const allRowIdsCat = rowDataTable.map((row) => row.categoryname);
              setSelectedRows(allRowIds);
              setSelectedRowsCat(allRowIdsCat);
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
            let updatedSelectedRowsCat;

            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
              updatedSelectedRowsCat = selectedRowsCat.filter(
                (selectedId) => selectedId !== params.row.categoryname
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
              updatedSelectedRowsCat = [
                ...selectedRowsCat,
                params.row.categoryname,
              ];
            }
            setSelectedRows(updatedSelectedRows);
            setSelectedRowsCat(updatedSelectedRowsCat);

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
      headerName: "Category",
      flex: 0,
      width: 230,
      minHeight: "40px",
      hide: !columnVisibility.categoryname,
    },
    {
      field: "subcategorynamelist",
      headerName: "Sub Category",
      flex: 0,
      width: 230,
      minHeight: "40px",
      hide: !columnVisibility.subcategorynamelist,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eipcategory") && (
            <Button
              onClick={() => {
                getcode(params.row.id, params.row.categoryname, "edit");
                // handleEditOpen();
              }}
              sx={userStyle.buttonedit}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dipcategory") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.categoryname);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vipcategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getcode(params.row.id, "", "view");
                // handleViewOpen();
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iipcategory") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpeninfo();
                getcode(params.row.id, "", "info");
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
      subcategoryname: item.subcategoryname,
      subcategorynamelist: correctedArray.join(","),
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
  // Excel
  const fileName = "Ip_Category";
  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = categoryList?.map((t, i) => ({
      "S.no": i + 1,
      "Category ": t.categoryname,
      "Category Code": t.categorycode,
      SubCategoryname: t.subcategoryname.join(","),
    }));
    setExcel(data);
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Ip_Category",
    pageStyle: "print",
  });
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Ip_Category.png");
        });
      });
    }
  };

  const pathname = window.location.pathname;

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Ip Category"),
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

  return (
    <Box>
      <Headtitle title={"Ip Category"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Ip Category </Typography> */}
      <PageHeading
        title="IP Category"
        modulename="Network Administration"
        submodulename="IP"
        mainpagename="IP Category"
        subpagename=""
        subsubpagename=""
      />

      {isUserRoleCompare?.includes("aipcategory") && (
        <Box sx={userStyle.container}>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>Add IP Category</Typography>
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={4} sm={12} xs={12}>
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
                    setCategory({ ...category, categoryname: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                {cateCode &&
                  cateCode.map(() => {
                    let strings = "IP";
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
            <Grid item md={2}></Grid>


            <Grid item md={2}></Grid>



            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
              <FormControl fullWidth size="small">
                {" "}
                <Typography>
                  {" "}
                  SubCategory <b style={{ color: "red" }}>*</b>{" "}
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
            {/* <Grid item md={1} marginTop={3}></Grid>
            <Grid item md={5}></Grid>
            <Grid item md={2}></Grid> */}

            <Grid item lg={1} md={2} sm={2} xs={6} >
              <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                <LoadingButton
                  onClick={handleSubmit}
                  loading={loadingdeloverall}
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                >
                  SAVE
                </LoadingButton>
              </Box>

            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={6} >
              <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                  {" "}
                  CLEAR{" "}
                </Button>
              </Box>
            </Grid>

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
            <Grid item md={1} marginTop={3}></Grid>
            <Grid item md={5}></Grid>
            {/* <Grid item md={12} sm={12} xs={12}>
              {" "}
              <br /> <br />
              <Grid
                sx={{ display: "flex", justifyContent: "center", gap: "15px" }}
              >
              
                <LoadingButton
                  onClick={handleSubmit}
                  loading={loadingdeloverall}
                  color="primary"
                  loadingPosition="end"
                  variant="contained"
                >
                  SAVE
                </LoadingButton>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  {" "}
                  CLEAR{" "}
                </Button>
              </Grid>
            </Grid> */}
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
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    {" "}
                    Edit IP Category
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Category  <b style={{ color: "red" }}>*</b>{" "}
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
                      SubCategory <b style={{ color: "red" }}>*</b>
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
                    <Button variant="contained" onClick={handleSubmitEdit} sx={buttonStyles.buttonsubmit}>
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
            </>
          </Box>
        </Dialog>
      </Box>
      {/* view dialog */}
      <Box>
        <Dialog
          maxWidth="sm"
          open={openView}
          onClose={handlViewClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  View IP Category{" "}
                </Typography>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography> Category</Typography>
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
            </Grid>
            <DialogActions>
              <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
                onClick={() => {
                  handlViewClose();
                }}
              >
                {" "}
                Back
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Box>
      <br />

      {isUserRoleCompare?.includes("lipcategory") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  IP Category List
                </Typography>
              </Grid>
            </Grid>
            {!loading ? (
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
            ) : (
              <>
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
                      {isUserRoleCompare?.includes("excelipcategory") && (
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
                      {isUserRoleCompare?.includes("csvipcategory") && (
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
                      {isUserRoleCompare?.includes("printipcategory") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleprint}
                          >
                            {" "}
                            &ensp; <FaPrint /> &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdfipcategory") && (
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
                      {isUserRoleCompare?.includes("imageipcategory") && (
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
                {isUserRoleCompare?.includes("bdipcategory") && (
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonbulkdelete}
                    onClick={handleClickOpenalert}
                  >
                    Bulk Delete
                  </Button>
                )}
                <br /> <br />
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
              </>
            )}
          </Box>
        </>
      )}

      {/* print */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          id="jobopening"
          ref={componentRef}
        >
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SNo</StyledTableCell>
              <StyledTableCell>Category Code</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Sub Category</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable?.length > 0 ? (
              rowDataTable?.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.categorycode}</StyledTableCell>
                  <StyledTableCell>{row.categoryname}</StyledTableCell>
                  <StyledTableCell>
                    {row?.subcategoryname?.map((d) => d + ",")}
                  </StyledTableCell>
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
      {/* delete modal */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
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
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={(e) => deleteData(deleteId)}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* this is info view details */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Ip Category Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
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
              <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseinfo}>
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
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            {/* <Dialog
              open={isCheckOpen}
              onClose={handleCloseCheck}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "80px", color: "orange" }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "black", textAlign: "center" }}
                >
                  {checkUnit?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deletedocument.categoryname} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>IP Master</span>
                    </>
                  ) : (
                    ""
                  )}

                  {overalldeletecheck?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${overalldeletecheck.map(
                        (item) => item.categoryname
                      )} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>IP Master</span>{" "}
                      {categoryList.filter(
                        (d) =>
                          !overalldeletecheck.some(
                            (item) => d.categoryname === item.categoryname
                          )
                      ).length > 0 && (
                        <Typography>
                          Do You want to Delete others?...
                        </Typography>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                {checkUnit?.length > 0 ||
                categoryList.filter(
                  (d) =>
                    !overalldeletecheck.some(
                      (item) => d.categoryname === item.categoryname
                    )
                ).length === 0 ? (
                  <Button
                    onClick={handleCloseCheck}
                    autoFocus
                    variant="contained"
                    color="error"
                  >
                    {" "}
                    OK{" "}
                  </Button>
                ) : (
                  ""
                )}
                {overalldeletecheck?.length > 0 &&
                categoryList.filter(
                  (d) =>
                    !overalldeletecheck.some(
                      (item) => d.categoryname === item.categoryname
                    )
                ).length > 0 ? (
                  <>
                    <Button
                      onClick={delReasoncheckboxWithoutLink}
                      variant="contained"
                    >
                      {" "}
                      Yes{" "}
                    </Button>
                    <Button
                      onClick={handleCloseCheck}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </DialogActions>
            </Dialog> */}
            <Dialog
              open={isCheckOpen}
              onClose={handleCloseCheck}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "80px", color: "orange" }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "black", textAlign: "center" }}
                >
                  {checkUnit?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deletedocument.categoryname} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>IP Master</span>
                    </>
                  ) : (
                    ""
                  )}

                  {/* {overalldeletecheck?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${overalldeletecheck.map(
                        (item) => item.categoryname
                      )} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>IP Master</span>{" "}
                      {categoryList.filter(
                        (d) =>
                          !overalldeletecheck.some(
                            (item) => d.categoryname === item.categoryname
                          )
                      ).length > 0 && (
                          <Typography>
                            Do You want to Delete others?...
                          </Typography>
                        )}
                    </>
                  ) : (
                    ""
                  )} */}
                </Typography>
              </DialogContent>
              <DialogActions>
                {checkUnit?.length > 0
                  // ||
                  //   categoryList.filter(
                  //     (d) =>
                  //       !overalldeletecheck.ipcategory.some(
                  //         (item) => d.categoryname === item.categoryname
                  //       )
                  //   ).length === 0
                  ? (
                    <Button
                      onClick={handleCloseCheck}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      {" "}
                      OK{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                {/* {overalldeletecheck?.length > 0 &&
                  categoryList.filter(
                    (d) =>
                      !overalldeletecheck.some(
                        (item) => d.categoryname === item.categoryname
                      )
                  ).length > 0 ? (
                  <>
                    <Button
                      onClick={delReasoncheckboxWithoutLink}
                      variant="contained"
                    >
                      {" "}
                      Yes{" "}
                    </Button>
                    <Button
                      onClick={handleCloseCheck}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                  </>
                ) : (
                  ""
                )} */}
              </DialogActions>
            </Dialog>
          </Box>


          <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
              <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>


                {(overalldeletecheck.ipcategory?.length > 0) && (
                  <>
                    <span style={{ fontWeight: "700", color: "#777" }}>
                      {[
                        ...new Set(
                          [...overalldeletecheck.ipcategory].map(item => item.categoryname)
                        )
                      ].join(",")}
                    </span> was linked in <span style={{ fontWeight: "700", color: "#777" }}>
                      {[...new Set(overalldeletecheck.ipcategory.map(item => item.categoryname))].length > 0
                        ? "IP Master"
                        : ""


                      }
                    </span>

                    {

                      (
                        (overalldeletecheck.ipcategory?.length > 0) &&

                        categoryList.filter(d => selectedRows?.includes(d._id) &&
                          ![
                            ...new Set(
                              [...overalldeletecheck.ipcategory].map(item => item.categoryname)
                            )
                          ].includes(d.categoryname)

                        ).length > 0
                      )



                      && (
                        <Typography>Do you want to delete others?...</Typography>
                      )
                    }
                  </>
                )}



              </Typography>
            </DialogContent>
            <DialogActions>



              {



                (



                  ((overalldeletecheck.ipcategory?.length > 0) ?

                    categoryList.filter(d => selectedRows?.includes(d._id) &&
                      ![
                        ...new Set(
                          [...overalldeletecheck.ipcategory].map(item => item.categoryname)
                        )
                      ].includes(d.categoryname)

                    ).length === 0

                    : ""

                  )


                ) ? (
                  <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">
                    {" "}
                    OK{" "}
                  </Button>
                )
                  : (
                    ""
                  )

              }





              {


                ((overalldeletecheck.ipcategory?.length > 0) ?

                  categoryList.filter(d => selectedRows?.includes(d._id) &&
                    ![
                      ...new Set(
                        [...overalldeletecheck.ipcategory].map(item => item.categoryname)
                      )
                    ].includes(d.categoryname)

                  ).length > 0

                  : ""

                )


                  ? (
                    <>

                      <Button onClick={delReasoncheckboxWithoutLink} variant="contained" >
                        {" "}
                        Yes{" "}
                      </Button>
                      <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">
                        {" "}
                        Cancel{" "}
                      </Button>
                    </>
                  ) : (
                    ""
                  )}

            </DialogActions>
          </Dialog>

        </>
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
              Are you sure?
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

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
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
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          )}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
              // fetchProductionClientRateArray();
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
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
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

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
export default IpCategory;