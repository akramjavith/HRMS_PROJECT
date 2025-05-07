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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";

function Checklistcategory() {

  const pathname = window.location.pathname;
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setBtnSubmit(false);
    setBtnSubmitEdit(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setBtnSubmit(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };



  const [btnSubmit, setBtnSubmit] = useState(false);
  const [btnSubmitEdit, setBtnSubmitEdit] = useState(false);
  let newval = "CA0001";
  const [cateCode, setCatCode] = useState([]);
  const [category, setCategory] = useState({ categoryname: "" });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [isFirstSubCateView, setIsFirstSubCateView] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const { isUserRoleCompare, allProjects, isUserRoleAccess, pageName, setPageName, isAssignBranch,
    buttonStyles } = useContext(
      UserRoleAccessContext
    );
  const { auth } = useContext(AuthContext);
  const [singleCategory, setSingleCategory] = useState({});
  const [editTodo, setEditTodo] = useState([]);
  const [subcategoryEdit, setSubCategoryEdit] = useState("");
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editDuplicate, setEditDuplicate] = useState([]);
  const [subDuplicate, setSubDuplicate] = useState([]);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Checklist Category"),
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

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Checklistcategory.png");
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
    handleCloseerr();
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      checkUsedByOtherBulk();
    }
  };

  const checkUsedByOtherBulk = async (data) => {
    let collectedDatas = selectedRows.map((item) => {
      return rowDataTable.find((data) => data.id === item)
    }).flatMap((item) => {
      let categoryName = item?.categoryname;
      let subCategory = item?.subcategoryname.split(',');

      let combinedData = subCategory.map(sub => ({
        category: categoryName,
        subcategory: sub,
        id: item.id
      }));

      return combinedData;
    })

    try {
      let res = await axios.post(SERVICE.CHECKLISTCATEGORYCHECKWITHCHECKLISTTYPE, {
        combinedData: collectedDatas
      })
      const uniqueData = Array.from(new Map(res?.data?.matchedConditions?.map(item => [item?.id, item])).values());
      if (res.data.exists) {
        if (uniqueData.length === selectedRows.length) {
          setPopupContentMalert(`All the Selected ${res.data.popupMessage}`);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Some of the ${res.data.popupMessage}`}</p>
            </>
          );
          handleClickOpenerr();
        }

        setSelectedRows((prev) => {
          return prev.filter((item) => !res.data.matchedConditions.some((data) => data.id === item))
        })
      } else {
        setIsDeleteOpencheckbox(true);
      }
    } catch (err) {
      console.log(err)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }


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


  const [showAlertNew, setShowAlertNew] = useState();
  const [isErrorOpenNew, setIsErrorOpenNew] = useState(false);
  const handleClickOpenerrNew = () => {
    setIsErrorOpenNew(true);
  };
  const handleCloseerrNew = () => {
    setIsErrorOpenNew(false);
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

  const checkUsedByOther = async (data) => {
    let categoryName = data?.categoryname;
    let subCategory = data?.subcategoryname.split(',');

    let combinedData = subCategory.map(sub => ({
      category: categoryName,
      subcategory: sub,
      id: data.id
    }));

    try {
      let res = await axios.post(SERVICE.CHECKLISTCATEGORYCHECKWITHCHECKLISTTYPE, {
        combinedData
      })
      if (res.data.exists) {
        setPopupContentMalert(res.data.popupMessage);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }
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
      let response = await axios.get(`${SERVICE.CHECKLISTCATEGORY}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCatCode(response.data.checklistcategory);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const delChecklistcategorycheckbox = async () => {
    handleCloseerr();
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.CHECKLISTCATEGORY_SINGLE}/${item}`, {
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

      await getCategory();
      await getCategoryList();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendRequest = async () => {
    const subcategoryName =
      subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    setPageName(!pageName)
    try {

      let res_queue = await axios.post(SERVICE.CHECKLISTCATEGORY_CREATE, {
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
      await getCategoryList();
      await getCategory();
      setBtnSubmit(false);
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

  //Project updateby edit page...
  let updateby = singleCategory?.updatedby;
  let addedby = singleCategory?.addedby;

  let subprojectsid = singleCategory?._id;

  const sendRequestEdit = async () => {
    const subcategoryName =
      subcategoryEdit.length !== 0 || ""
        ? [...editTodo, subcategoryEdit]
        : [...editTodo];
    setPageName(!pageName)
    try {

      let res = await axios.put(
        `${SERVICE.CHECKLISTCATEGORY_SINGLE}/${subprojectsid}`,
        {
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
        }
      );
      let categoryUpdate = await axios.post(SERVICE.CHECKLISTCATEGORYOVERALLUPDATE, {
        oldcategory: oldCategory,
        category: String(singleCategory.categoryname)
      })
      handleCloseerrNew();
      await getCategoryList();
      await getCategoryListAll();
      await getCategory();
      setSubCategoryEdit("");
      setBtnSubmitEdit(false);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleEditClose();

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

  const getCategoryList = async () => {
    setPageName(!pageName)



    try {
      let response = await axios.get(`${SERVICE.CHECKLISTCATEGORY}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let datas = response?.data?.checklistcategory?.map((item) => {
        return {
          ...item, subcategoryname: item.subcategoryname.join(","),
        }
      })
      setCategoryList(datas);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

  };

  const getCategoryListAll = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CHECKLISTCATEGORY}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubDuplicate(
        response.data.checklistcategory.filter(
          (data) => data._id !== singleCategory._id
        )
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    getCategoryList();
    getCategoryListAll();
  }, []);

  useEffect(() => {
    getCategoryListAll();
  }, [editOpen, singleCategory]);

  const getCategoryId = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CHECKLISTCATEGORY}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEditDuplicate(
        response.data.checklistcategory.filter(
          (data) => data._id !== singleCategory._id
        )
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const EditTodoPopup = () => {
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter Subcategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (
      editTodo.some(
        (item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase()
      )
    ) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else {
      setEditTodo([...editTodo, subcategoryEdit]);
      setSubCategoryEdit("");
    }
  };

  const [oldCategory, setOldCategory] = useState("");

  const getCode = async (id, category) => {
    setPageName(!pageName)
    try {
      const [res] = await Promise.all([
        axios.get(`${SERVICE.CHECKLISTCATEGORY_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),

      ]);

      setSingleCategory(res.data.schecklistcategory);
      setOldCategory(res.data.schecklistcategory?.categoryname);
      // console.log(res.data.schecklistcategory);
      setEditTodo(res.data.schecklistcategory.subcategoryname);
      handleEditOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getviewCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CHECKLISTCATEGORY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res.data.schecklistcategory);
      setEditTodo(res.data.schecklistcategory.subcategoryname);
      handleViewOpen();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [deleteId, setDeleteId] = useState({});

  const deleteData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.delete(
        `${SERVICE.CHECKLISTCATEGORY_SINGLE}/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await getCategoryList();
      await getCategory();
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getinfoCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CHECKLISTCATEGORY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res.data.schecklistcategory);
      setEditTodo(res.data.schecklistcategory.subcategoryname);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const addTodo = () => {
    getCategoryList();
    const isSubNameMatch = subCategoryTodo.some(
      (item) => item?.toLowerCase() === subcategory?.toLowerCase()
    );
    if (subcategory === "") {
      setPopupContentMalert("Please Enter Subcategory Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (isSubNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Subcategory");
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
    // If no duplicate is found, update the editTodo array
    const updatedTodos = [...editTodo];
    updatedTodos[index] = newValue;

    setEditTodo(updatedTodos);
  };

  const handleSubmit = () => {
    setBtnSubmit(true);
    const lowerCaseSet = new Set(subCategoryTodo.map(item => item.toLowerCase()));
    const lowerCaseArr = subCategoryTodo.map(item => item.toLowerCase());

    let isSubDuplicated = lowerCaseSet.size !== lowerCaseArr.length;

    const isNameMatch = categoryList?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        category?.categoryname.toLowerCase()
    );
    const isSubNameMatch = subDuplicate.some((item) =>
      subCategoryTodo.includes(item)
    );

    if (isSubDuplicated) {
      setPopupContentMalert("Sub Category Name Duplicated!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    }

    else if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (isSubNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (category.categoryname === "") {
      setPopupContentMalert("Please Enter Category Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter Sub Category Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter Sub Category Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    }
    else if (subCategoryTodo.length !== 0 && subcategory !== "") {
      setPopupContentMalert("Subcategory Name is Filled. Please Insert!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else {
      sendRequest();
    }
  };

  const handleSubmitEdit = async () => {
    setBtnSubmitEdit(true);
    getCategoryListAll();

    const lowerCaseSet = new Set(editTodo.map(item => item.toLowerCase()));
    const lowerCaseArr = editTodo.map(item => item.toLowerCase());

    let isSubDuplicated = lowerCaseSet.size !== lowerCaseArr.length;

    const isNameMatch = subDuplicate?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        singleCategory?.categoryname.toLowerCase()
    );

    if (isSubDuplicated) {
      setPopupContentMalert("Sub Category Name Duplicated!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();



    }
    else if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (singleCategory.categoryname === "") {
      setPopupContentMalert("Please Enter Category Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (editTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter Sub Category Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (editTodo.length == 0) {
      setPopupContentMalert("Please Enter Sub Category Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    }
    else if (editTodo.length !== 0 && subcategoryEdit !== "") {
      setPopupContentMalert("Subcategory Name is Filled. Please Insert!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }
    else {
      if (singleCategory.categoryname !== oldCategory) {
        const [resNew] = await Promise.all([

          axios.post(SERVICE.CHECKLISTCONNECTEDPAGES, {
            category: oldCategory
          })
        ]);
        let isOpen = resNew.data.message === "No linked data found." ? false : true;
        if (isOpen) {
          setShowAlertNew(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`${resNew.data.message} wish to update?`}</p>
            </>
          );
          handleClickOpenerrNew();
        } else {
          sendRequestEdit();
        }
      } else {
        sendRequestEdit();
      }

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
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

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
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
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
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
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
      headerName: "Category Name",
      flex: 0,
      width: 230,
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
          {isUserRoleCompare?.includes("echecklistcategory") && (
            <Button
              onClick={() => {
                getCode(params.row.id, params.row.categoryname);

                getCategoryId();
              }}
              sx={userStyle.buttonedit}
              style={{ minWidth: "0px" }}
            >
              <EditOutlinedIcon style={{ fontSize: "large" }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dchecklistcategory") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                setDeleteId(params.row.id);
                // handleClickOpen();
                checkUsedByOther(params.row);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vchecklistcategory") && (
            <Button
              sx={userStyle.buttonview}
              onClick={(e) => {
                getviewCode(params.row.id);

              }}
            >
              <VisibilityOutlinedIcon style={{ fontSize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ichecklistcategory") && (
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

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname,
      categorycode: item.categorycode,
      subcategoryname: item.subcategoryname,
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
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

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
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={
                  column.field === "checkbox" ? "Checkbox" : column.headerName
                }
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
    documentTitle: "Checklist Category",
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

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName)
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error('Blob or FileSaver not supported');
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error('FileSaver.saveAs is not available');
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error('Error exporting to Excel', error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,

        CategoryCode: item.categorycode || '',
        "Category Name": item.categoryname || '',
        "Subcategory Name": item.subcategoryname || '',

      };
    });
  };

  const handleExportXL = (isfilter) => {

    const dataToExport = isfilter === "filtered" ? filteredData : categoryList;

    if (!dataToExport || dataToExport.length === 0) {
      console.error('No data available to export');
      return;
    }

    exportToExcel(formatData(dataToExport), 'Checklist Category');
    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [

    { title: "CategoryCode", field: "categorycode" },
    { title: "Category Name", field: "categoryname" },
    { title: "Subcategory Name", field: "subcategoryname" },

  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
          ...t,
          serialNumber: index + 1,

        }))
        : categoryList?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,


        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Checklist Category.pdf");
  };


  return (
    <Box>
      <Headtitle title={"CHECKLIST CATEGORY"} />
      <PageHeading
        title="Checklist Category"
        modulename="Checklist"
        submodulename="Checklist Category"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("achecklistcategory") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Add Checklist Category
                </Typography>
              </Grid>
              {/* <Grid item md={2}></Grid> */}
              <Grid item md={4} sm={12} xs={12}>
                {!isFirstSubCateView && (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Category Name"
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
                      let strings = "CA";
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
                    Category Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter Category Code"
                    value={newval}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    SubCategory Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter SubCategory Name"
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
                                SubCategory Name<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                placeholder="Please Enter SubCategory Name"
                                value={item}
                                onChange={(e) =>
                                  handleTodoEdit(index, e.target.value)
                                }
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
                <br />
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <LoadingButton variant="contained" sx={buttonStyles.buttonsubmit} loading={btnSubmit} onClick={handleSubmit}>
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
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "450px", textAlign: "center", alignItems: "center" }}
          >
            <Typography
              variant="h6"
              style={{ fontSize: "20px", fontWeight: 900 }}
            >
              {showAlert}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              style={{
                padding: "7px 13px",
                color: "#000",

              }}
              onClick={handleCloseerr}
            >
              close
            </Button>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={delChecklistcategorycheckbox}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          open={isErrorOpenNew}
          onClose={handleCloseerrNew}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "450px", textAlign: "center", alignItems: "center" }}
          >
            <Typography
              variant="h6"
              style={{ fontSize: "20px", fontWeight: 900 }}
            >
              {showAlertNew}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              style={{
                padding: "7px 13px",
                color: "#000",

              }}
              onClick={handleCloseerrNew}
            >
              close
            </Button>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={sendRequestEdit}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          maxWidth="lg"
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ marginTop: '50px' }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Checklist Category
                </Typography>
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
                      placeholder="Please Enter Category Name"
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
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter Category Code"
                    value={singleCategory.categorycode}
                  />
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
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter SubCategory Name"
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
                                placeholder="Please Enter SubCategor Name"
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
                  <LoadingButton loading={btnSubmitEdit} sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmitEdit}>
                    Update
                  </LoadingButton>
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
        <Dialog
          maxWidth="lg"
          open={openView}
          onClose={handlViewClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  View Checklist Category
                </Typography>
              </Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12}>
                {!isFirstSubCateView && (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category Name
                    </Typography>
                    <OutlinedInput
                      readOnly
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Category Name"
                      value={singleCategory.categoryname}
                    />
                  </FormControl>
                )}
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category Code
                  </Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    placeholder="Please Enter Category Code"
                    value={singleCategory.categorycode}
                  />
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
                              <OutlinedInput
                                id="component-outlined"
                                placeholder="Please Enter SubCategory Name"
                                value={item}
                              />
                            </FormControl>
                            &emsp;
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
      {isUserRoleCompare?.includes("lchecklistcategory") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Checklist Category List
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
                  {isUserRoleCompare?.includes("excelchecklistcategory") && (
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
                  {isUserRoleCompare?.includes("csvchecklistcategory") && (
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
                  {isUserRoleCompare?.includes("printchecklistcategory") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfchecklistcategory") && (
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
                  {isUserRoleCompare?.includes("imagechecklistcategory") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
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
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              &ensp;
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
                sx={buttonStyles.buttonbulkdelete}
              >
                Bulk Delete
              </Button>
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
                  onClipboardCopy={(copiedString) =>
                    setCopiedData(copiedString)
                  }
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                  autoHeight={true}
                  ref={gridRef}
                  density="compact"
                  hideFooter
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
                  sx={userStyle.paginationbtn}
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
              <Table
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                id="addcategroyticket"
                ref={componentRef}
              >
                <TableHead sx={{ fontWeight: "600" }}>
                  <StyledTableRow>
                    <StyledTableCell>SNo</StyledTableCell>
                    <StyledTableCell>Category Code</StyledTableCell>
                    <StyledTableCell>Category Name</StyledTableCell>
                    <StyledTableCell>Sub Category Name</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredDatas?.length > 0 ? (
                    filteredDatas?.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{row.categorycode}</StyledTableCell>
                        <StyledTableCell>{row.categoryname}</StyledTableCell>
                        <StyledTableCell>
                          {row?.subcategoryname}
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
            {/* Manage Column */}
          </Box>

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
              <Typography
                variant="h5"
                sx={{ color: "red", textAlign: "center" }}
              >
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

          <Box>
            <Dialog
              open={isDeleteOpencheckbox}
              onClose={handleCloseModcheckbox}
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
                  variant="h5"
                  sx={{ color: "red", textAlign: "center" }}
                >
                  Are you sure?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseModcheckbox}
                  sx={userStyle.btncancel}
                >
                  Cancel
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  color="error"
                  onClick={(e) => delChecklistcategorycheckbox(e)}
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box>
            {/* ALERT DIALOG */}
            <Dialog
              open={isDeleteOpenalert}
              onClose={handleCloseModalert}
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

          {/* this is info view details */}

          <Dialog
            open={openInfo}
            onClose={handleCloseinfo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box sx={{ width: "550px", padding: "20px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>
                  Checklist Category Info
                </Typography>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">addedby</Typography>
                      <br />
                      <Table>
                        <TableHead>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {"SNO"}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {"UserName"}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
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
                                {moment(item.date).format(
                                  "DD-MM-YYYY hh:mm:ss a"
                                )}
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
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {"SNO"}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {"UserName"}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
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
                                {moment(item.date).format(
                                  "DD-MM-YYYY hh:mm:ss a"
                                )}
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
                  <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel} >
                    {" "}
                    Back{" "}
                  </Button>
                </Grid>
              </>
            </Box>
          </Dialog>
        </>
      )}{" "}
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
          {fileFormat === "xl" ? (
            <>
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

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
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

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
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

export default Checklistcategory;