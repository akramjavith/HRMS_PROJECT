import React, { useState, useEffect, useRef, useContext } from "react";
import { Popover, TextField, IconButton, Checkbox, Switch, List, ListItem, ListItemText, Box, Typography, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import { saveAs } from "file-saver";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AiOutlineClose } from "react-icons/ai";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { FaPlus } from "react-icons/fa";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import LoadingButton from "@mui/lab/LoadingButton";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";

function Addcateorytickets() {
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

  let exportColumnNames = ['Category Code', 'Category Name', 'SubCategory Name'];
  let exportRowValues = ['categorycode', 'categoryname', 'subcategoryname']

  let newval = "TC0001";
  const [cateCode, setCatCode] = useState([]);
  const [isBtn, setIsBtn] = useState(false);
  const [category, setCategory] = useState({ categoryname: "" });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [isFirstSubCateView, setIsFirstSubCateView] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categorycheck, setCategoryCheck] = useState(false);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [ovcategory, setOvcategory] = useState("");
  const [ovSubcategory, setOvSubcategory] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
  const [ovProjCountDelete, setOvProjCountDelete] = useState("");
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

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Ticket Category Master"),
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Ticket Category.png");
        });
      });
    }
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  useEffect(
    () => {
      const beforeUnloadHandler = (event) => handleBeforeUnload(event);
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      getOverallEditSectionOverallDelete(selectedRows)
    }
  };

  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  //overall edit section for all pages
  const getOverallEditSectionOverallDelete = async (ids) => {
    setPageName(!pageName)
    try {

      let res = await axios.post(SERVICE.OVERALL_BULK_CATEGORY_TICKET_DELETE, {
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
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
    setCategoryCheck(false)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYTICKET}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCatCode(response?.data?.ticketcategory);
      setCategoryCheck(true);
    } catch (err) { setCategoryCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const delAccountcheckbox = async () => {
    setPageName(!pageName)
    try {

      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.CATEGORYTICKET_SINGLE}/${item}`, {
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
    setPageName(!pageName)
    setIsBtn(true)
    const subcategoryName = subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    try {
      let res_queue = await axios.post(SERVICE.CATEGORYTICKET_CREATE, {
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
      setIsBtn(false)
      await getCategoryList(); getCategory();
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
    setPageName(!pageName)
    const subcategoryName = subcategoryEdit.length !== 0 || "" ? [...editTodo, subcategoryEdit] : [...editTodo];
    try {
      let res = await axios.put(`${SERVICE.CATEGORYTICKET_SINGLE}/${subprojectsid}`, {
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
      await getOverallEditSectionUpdate(); getCategoryList(); getCategory();
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
      let response = await axios.get(`${SERVICE.CATEGORYTICKET}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryList(response.data.ticketcategory);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getCategoryListAll = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYTICKET}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return response.data.ticketcategory.filter((data) => data._id !== singleCategory._id)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

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

  const getCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CATEGORYTICKET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sticketcategory);
      setEditTodo(res?.data?.sticketcategory?.subcategoryname);
      setOvcategory(res?.data?.sticketcategory?.categoryname);
      setOvSubcategory(res?.data?.sticketcategory?.subcategoryname);
      getOverallEditSection(res?.data?.sticketcategory?.categoryname, res?.data?.sticketcategory?.subcategoryname);
      handleEditOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const rowData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CATEGORYTICKET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sticketcategory);
      setDeleteId(res?.data?.sticketcategory?._id);
      getOverallEditSectionDelete(res?.data?.sticketcategory?.categoryname, res?.data?.sticketcategory?.subcategoryname);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //overall edit section for all pages
  const getOverallEditSectionDelete = async (cat, subcate) => {
    setPageName(!pageName)
    try {

      let res = await axios.post(SERVICE.OVERALL_CATEGORY_TICKET_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: cat,
        subcategory: subcate,
      });
      setOvProjCountDelete(res?.data?.count);
      setGetOverallCountDelete(`This data is linked in 
          ${res?.data?.reason?.length > 0 ? "Reason Master," : ""}
          ${res?.data?.subsubcategory?.length > 0 ? "Sub Subcategory Master," : ""}
          ${res?.data?.resolverreason?.length > 0 ? "Resolver Reason Master," : ""}
          ${res?.data?.assetgroupingdata?.length > 0 ? "Material Category Grouping Master," : ""}
          ${res?.data?.selfcheck?.length > 0 ? "Self CheckPoint Master," : ""}
          ${res?.data?.checkpoint?.length > 0 ? "CheckPoint Master Master," : ""}
          ${res?.data?.teamgroup?.length > 0 ? "TeamGrouping Master," : ""}
          ${res?.data?.priority?.length > 0 ? "Priority Master," : ""}
          ${res?.data?.duedate?.length > 0 ? "DueDate Master," : ""}
          ${res?.data?.requiredfield?.length > 0 ? "Required Field Master," : ""}
          ${res?.data?.typegroup?.length > 0 ? "Type Group Master," : ""}
          ${res?.data?.raisemaster?.length > 0 ? "Raise Ticket Master," : ""}`);

      if (res?.data?.count > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (cat, subcate) => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.OVERALL_CATEGORY_TICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: cat,
        subcategory: subcate,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`This data is linked in 
          ${res?.data?.reason?.length > 0 ? "Reason Master," : ""}
          ${res?.data?.subsubcategory?.length > 0 ? "Sub Subcategory Master," : ""}
          ${res?.data?.resolverreason?.length > 0 ? "Resolver Reason Master," : ""}
          ${res?.data?.assetgroupingdata?.length > 0 ? "Material Category Grouping Master," : ""}
          ${res?.data?.selfcheck?.length > 0 ? "Self CheckPoint Master," : ""}
          ${res?.data?.checkpoint?.length > 0 ? "CheckPoint Master Master," : ""}
          ${res?.data?.teamgroup?.length > 0 ? "TeamGrouping Master," : ""}
          ${res?.data?.priority?.length > 0 ? "Priority Master," : ""}
          ${res?.data?.duedate?.length > 0 ? "DueDate Master," : ""}
          ${res?.data?.requiredfield?.length > 0 ? "Required Field Master," : ""}
          ${res?.data?.typegroup?.length > 0 ? "Type Group Master," : ""}
          ${res?.data?.raisemaster?.length > 0 ? "Raise Ticket Master," : ""}
           whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.OVERALL_CATEGORY_TICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: ovcategory,
        subcategory: ovSubcategory,
      });
      sendEditRequestOverall(res?.data?.reason,
        res?.data?.resolverreason,
        res?.data?.assetgroupingdata,
        res?.data?.subsubcategory,
        res?.data?.selfcheck,
        res?.data?.checkpoint,
        res?.data?.teamgroup,
        res?.data?.priority,
        res?.data?.duedate,
        res?.data?.requiredfield,
        res?.data?.raisemaster,
        res?.data?.typegroup
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendEditRequestOverall = async (reason,
    resolverreason,
    assetgroupingdata,
    subsubcategory,
    selfcheck,
    checkpoint,
    teamgroup,
    priority,
    duedate,
    requiredfield,
    raisemaster,
    typegroup) => {
    try {

      if (reason?.length > 0) {
        let answ = reason.map((d, i) => {
          const category = d?.categoryreason?.filter(data => data !== ovcategory)
          const subcategory = d?.subcategoryreason?.filter(data => !ovSubcategory?.includes(data))
          const subcategoryold = d?.subcategoryreason?.filter(data => ovSubcategory?.includes(data))
          // const subcategorynew = ovSubcategory?.filter(data => ovSubcategory?.includes(data))
          let res = axios.put(`${SERVICE.REASONMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryreason: [...category, singleCategory.categoryname],
          });
        });
      }
      if (resolverreason.length > 0) {
        let answ = resolverreason.map((d, i) => {
          const category = d?.categoryreason?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryreason: [...category, singleCategory.categoryname],
          });
        });
      }
      if (assetgroupingdata.length > 0) {
        let answ = assetgroupingdata.map((d, i) => {
          const category = d?.categoryname?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.ASSETCATEGORYGROUPING_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryname: [...category, singleCategory.categoryname],
          });
        });
      }
      if (subsubcategory.length > 0) {
        let answ = subsubcategory.map((d, i) => {
          const category = d?.categoryname?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryname: [...category, singleCategory.categoryname],
          });
        });
      }
      if (selfcheck.length > 0) {
        let answ = selfcheck.map((d, i) => {
          const category = d?.category?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: [...category, singleCategory.categoryname],
          });
        });
      }
      if (checkpoint.length > 0) {
        let answ = checkpoint.map((d, i) => {
          const category = d?.category?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.CHECKPOINTTICKET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: [...category, singleCategory.categoryname],
          });
        });
      }
      if (teamgroup.length > 0) {
        let answ = teamgroup.map((d, i) => {
          const category = d?.categoryfrom?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.TEAMGROUPING_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryfrom: [...category, singleCategory.categoryname],
          });
        });
      }
      if (priority.length > 0) {
        let answ = priority.map((d, i) => {
          const category = d?.category?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.PRIORITYMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: [...category, singleCategory.categoryname],
          });
        });
      }
      if (duedate.length > 0) {
        let answ = duedate.map((d, i) => {
          const category = d?.category?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.DUEDATE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: [...category, singleCategory.categoryname],
          });
        });
      }
      if (requiredfield.length > 0) {
        let answ = requiredfield.map((d, i) => {
          const category = d?.category?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.REQUIREFIELDS_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: [...category, singleCategory.categoryname],
          });
        });
      }
      if (raisemaster.length > 0) {
        let answ = raisemaster.map((d, i) => {
          let res = axios.put(`${SERVICE.RAISETICKET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: singleCategory.categoryname,
          });
        });
      }
      if (typegroup.length > 0) {
        let answ = typegroup.map((d, i) => {
          const category = d?.categorytype?.filter(data => data !== ovcategory)
          let res = axios.put(`${SERVICE.TYPEMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categorytype: [...category, singleCategory.categoryname],
          });
        });
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getviewCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CATEGORYTICKET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sticketcategory);
      setEditTodo(res?.data?.sticketcategory?.subcategoryname);
      handleViewOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [deleteId, setDeleteId] = useState({});

  const deleteData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.delete(`${SERVICE.CATEGORYTICKET_SINGLE}/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await getCategoryList();
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getinfoCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CATEGORYTICKET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sticketcategory);
      setEditTodo(res?.data?.sticketcategory?.subcategoryname);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const addTodo = () => {
    getCategoryList();
    const isSubNameMatch = subCategoryTodo.some((item) => item?.toLowerCase() === subcategory?.toLowerCase());

    if (subcategory === "") {
      setPopupContentMalert("Please Enter Subcategory");
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
      setPopupContentMalert("Add SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategory.length > 0 && subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo.length !== new Set(subCategoryTodo.map(item => item.toLowerCase())).size) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory ");
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

  const handleSubmitEdit = async () => {
    let resdata = await getCategoryListAll();
    const isNameMatch = resdata?.some((item) => item?.categoryname?.toLowerCase() === singleCategory?.categoryname.toLowerCase());
    const correctedArray = Array.isArray(editTodo) ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleCategory.categoryname === "") {
      setPopupContentMalert("Please Enter Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategoryEdit !== "") {
      setPopupContentMalert("Add SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (editTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length == 0) {
      setPopupContentMalert("Please Enter SubCategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (singleCategory.categoryname != ovcategory && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (editTodo.length > 0 && editTodo.length === 0) {
      setPopupContentMalert("Please Insert SubCategory");
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
      headerName: "Category Name",
      flex: 0,
      width: 230,
      minHeight: "40px",
      hide: !columnVisibility.categoryname,
    },
    {
      field: "subcategoryname",
      headerName: "SubCategory Name",
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
          {isUserRoleCompare?.includes("eticketcategorymaster") && (
            <Button
              onClick={() => {
                getCode(params.row.id);
              }}
              sx={userStyle.buttonedit}
              style={{ minWidth: "0px" }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dticketcategorymaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vticketcategorymaster") && (
            <Button
              sx={userStyle.buttonview}
              onClick={(e) => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iticketcategorymaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
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
    documentTitle: "Category_Ticket",
    pageStyle: "print",
  });

  return (
    <Box>
      <Headtitle title={"CATEGORY TICKETS"} />
      <PageHeading
        title="Tickets Category"
        modulename="Tickets"
        submodulename="Master"
        mainpagename="Ticket Category Master"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aticketcategorymaster") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>Add Tickets Category </Typography>
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
                      let strings = "TC";
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
              <Grid item md={2}></Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    SubCategory Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory Name" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
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
                                SubCategory Name<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory Name" value={item} onChange={(e) => handleTodoEdit(index, e.target.value)} />
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

              <Grid item md={4} sm={12} xs={12}>
              <Grid item md={12} sm={12} xs={12}>

                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <LoadingButton variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit} loading={isBtn}>
                    SAVE
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    CLEAR
                  </Button>
                </Grid>
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
        <Dialog maxWidth="lg" open={editOpen} onClose={handleEditClose} aria-labelledby="alert-dialog-title" 
        aria-describedby="alert-dialog-description"
        sx={{ marginTop: "47px" }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>Edit Tickets Category </Typography>
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
                    SubCategory Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory Name" value={subcategoryEdit} onChange={(e) => setSubCategoryEdit(e.target.value)} />
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
                                placeholder="Please Enter SubCategory Name"
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
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmitEdit}>
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
        <Dialog maxWidth="lg" open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" 
        aria-describedby="alert-dialog-description" 
        sx={{ marginTop: "47px" }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>View Tickets Category </Typography>
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
                  SubCategory Name
                </Typography>

                {editTodo.length > 0 && (
                  <ul type="none">
                    {editTodo.map((item, index) => {
                      return (
                        <li key={index}>
                          <br />
                          <Grid sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                              <OutlinedInput id="component-outlined" placeholder="Please Enter SubCategory Name" value={item} />
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
      {isUserRoleCompare?.includes("lticketcategorymaster") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>All Ticket Category List</Typography>
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
                  {isUserRoleCompare?.includes("excelticketcategorymaster") && (

                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>

                  )}
                  {isUserRoleCompare?.includes("csvticketcategorymaster") && (

                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                  )}
                  {isUserRoleCompare?.includes("printticketcategorymaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfticketcategorymaster") && (

                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}  ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>

                  )}
                  {isUserRoleCompare?.includes("imageticketcategorymaster") && (
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
              {isUserRoleCompare?.includes("bdticketcategorymaster") && (
                <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                  Bulk Delete
                </Button>)}
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
                    <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                    <Button variant="contained" color='error'
                      onClick={(e) => delAccountcheckbox(e)}
                    > OK </Button>
                  </>
                  :
                  <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
                }
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
                    sendRequestEdit();
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

          {/* Check delete Modal */}
          <Box>
            <>
              <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                  <DialogContent
                    sx={{
                      width: "350px",
                      textAlign: "center",
                      alignItems: "center",
                    }}
                  >
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                      {getOverAllCountDelete}
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
            filename={"Ticket Category"}
            exportColumnNames={exportColumnNames}
            exportRowValues={exportRowValues}
            componentRef={componentRef}
          />
          {/* INFO */}
          <InfoPopup
            openInfo={openInfo}
            handleCloseinfo={handleCloseinfo}
            heading="Ticket Category Info"
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
          {/* EXTERNAL COMPONENTS -------------- END */}
          <br />

        </>
      )}{" "}
    </Box>
  );
}

export default Addcateorytickets;