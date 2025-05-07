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
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
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
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

function Addcategoryinterview() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setSubmitLoader(false);
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

  let exportColumnNames = [
    "Category Code",
    "Category Name",
    "Subcategory Name",
    "Mode",
  ];
  let exportRowValues = [
    "categorycode",
    "categoryname",
    "subcategoryname",
    "mode",
  ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  let modeOptions = [
    {
      label: "Questions",
      value: "Questions",
    },
    {
      label: "Online or Interview Test",
      value: "Online or Interview Test",
    },
    {
      label: "Typing Test",
      value: "Typing Test",
    },
    {
      label: "Verification/Administrative",
      value: "Verification/Administrative",
    },
  ];

  const customValueRendererQuestions = (valueQuestionsCat) => {
    return valueQuestionsCat?.length
      ? valueQuestionsCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
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
      pagename: String("Category Interview"),
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

  const [fileFormat, setFormat] = useState("");

  let newval = "IC0001";
  const [cateCode, setCatCode] = useState([]);
  const [category, setCategory] = useState({
    categoryname: "",
    mode: "Questions",
  });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [subcategory, setSubcategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

  if (isUserRoleCompare?.includes("menuexitinterviewdropdown")) {
    modeOptions.push({ label: "Exit Interview", value: "Exit Interview" });
  }
  const { auth } = useContext(AuthContext);
  const [singleCategory, setSingleCategory] = useState({});
  const [editTodo, setEditTodo] = useState([]);
  const [subcategoryEdit, setSubCategoryEdit] = useState("");
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "InterviewCategory.png");
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
    if (selectedRows?.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      overallBulkdelete(selectedRows);
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
    setSubmitLoader(false);
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

  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const handleAddTypeOpen = () => {
    setAddTypeOpen(true);
  };
  const handleAddTypeClose = () => {
    setAddTypeOpen(false);
  };
  useEffect(() => {
    fetchInterviewtypemaster();
  }, []);
  const [typeMasteDetails, setTypeMasterDetails] = useState([])
  const [typeDetails, setTypeDetails] = useState({
    mode: "Questions",
    eixstornew: "New",
    newtype: "",
    existingcategory: [],
    existingsubcategory: [],
    existingtypeid: "",
    newcategory: "",
    newsubcategory: [],
    updatedby: [],
  })
  const fetchInterviewtypemaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTypeMasterDetails(res_vendor?.data?.interviewtypemasters);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const handleCreateType = async () => {

    const isNameMatch = typeMasteDetails?.some(
      (item) =>
        item.nametype.toLowerCase() ===
        typeDetails.newtype.toLowerCase() &&
        item.mode === typeDetails?.mode &&
        item.categorytype?.includes(category?.categoryname) &&
        item.subcategorytype.some((data) => typeDetails?.newsubcategory?.includes(data))
    );

    if (isNameMatch) {
      setPopupContentMalert("Data already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (typeDetails?.newtype === '') {
      setPopupContentMalert("Please Enter Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (category?.categoryname === "") {
      setPopupContentMalert("Please Enter Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (typeDetails?.newsubcategory?.length === 0) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      createType();
    }
  };

  const createType = async () => {
    setPageName(!pageName);
    try {
      await axios.post(SERVICE.INTERVIEWTYPEMASTER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categorytype: [category?.categoryname],
        subcategorytype: typeDetails?.newsubcategory?.length > 0 ? typeDetails?.newsubcategory?.map(data => data?.value) : [],
        nametype: String(typeDetails?.newtype),
        mode: String(typeDetails?.mode),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await sendRequest();
      await fetchInterviewtypemaster();
      setTypeDetails({
        mode: "Questions",
        eixstornew: "New",
        newtype: "",
        existingcategory: [],
        existingsubcategory: [],
        existingtypeid: "",
        newcategory: "",
        newsubcategory: [],
        updatedby: [],
      })
      // setPopupContent("Added Successfully");
      // setPopupSeverity("success");
      // handleClickOpenPopup();
      // setSubmitLoader(false);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleUpateType = async () => {

    const isNameMatch = typeMasteDetails?.filter(item => item?._id !== typeDetails?.existingtypeid)?.some(
      (item) =>
        item.nametype.toLowerCase() ===
        typeDetails.newtype.toLowerCase() &&
        item.mode === typeDetails?.mode &&
        item.categorytype?.includes(category?.categoryname) &&
        item.subcategorytype.some((data) => typeDetails?.newsubcategory?.includes(data))
    );

    if (isNameMatch) {
      setPopupContentMalert("Data already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (typeDetails?.newtype === '') {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (category?.categoryname === "") {
      setPopupContentMalert("Please Enter Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (typeDetails?.newsubcategory?.length === 0) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      updateType();
    }
  };

  const updateType = async () => {
    setPageName(!pageName);
    try {
      let subcat = typeDetails?.newsubcategory?.length > 0 ? typeDetails?.newsubcategory?.map(data => data?.value) : []
      let updateby = typeDetails?.updatedby?.length > 0 ? typeDetails?.updatedby : []
      await axios.put(
        `${SERVICE.INTERVIEWTYPEMASTER_SINGLE}/${typeDetails?.existingtypeid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          categorytype: [...typeDetails?.existingcategory, category?.categoryname],
          subcategorytype: [...typeDetails?.existingsubcategory, ...subcat],
          nametype: String(typeDetails?.newtype),
          mode: String(typeDetails?.mode),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await sendRequest(true);
      await fetchInterviewtypemaster();
      setTypeDetails({
        mode: "Questions",
        eixstornew: "New",
        newtype: "",
        existingcategory: [],
        existingsubcategory: [],
        existingtypeid: "",
        newcategory: "",
        newsubcategory: [],
        updatedby: [],
      })
      // setPopupContent("Added Successfully");
      // setPopupSeverity("success");
      // handleClickOpenPopup();
      // setSubmitLoader(false);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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

  //overall edit popup
  const [openOverAllEditPopup, setOpenOverAllEditPopup] = useState(false);
  const handleOpenOverallEditPopup = () => {
    setOpenOverAllEditPopup(true);
  };
  const handleCloseOverallEditPopup = () => {
    setOpenOverAllEditPopup(false);
  };

  const getCategory = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYINTERVIEW}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCatCode(response?.data?.interviewcategory);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const delInterviewcheckbox = async () => {
    setPageName(!pageName);
    try {
      if (selectedRows?.length > 0) {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(`${SERVICE.CATEGORYINTERVIEW_SINGLE}/${item}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });

        // Wait for all delete requests to complete
        await Promise.all(deletePromises);

        await getCategory();
        getCategoryList();
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const overallBulkdelete = async (ids) => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.CATEGORYINTERVIEW_OVERALLBULKDELETE}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          id: ids,
        }
      );

      setSelectedRows(overallcheck?.data?.result);
      setIsDeleteOpencheckbox(true);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const sendRequest = async (update) => {
    const subcategoryName =
      subCategoryTodo?.length === 0 ? subcategory : [...subCategoryTodo];
    setPageName(!pageName);
    try {
      let res_queue = await axios.post(SERVICE.CATEGORYINTERVIEW_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: String(category.categoryname),
        mode: String(category.mode),
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
      setCategory({ ...category, categoryname: "", mode: "Questions" });

      await getCategoryList();
      getCategory();
      handleAddTypeClose();
      setPopupContent(update ? "Updated Successfully" : "Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setSubmitLoader(false);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleClear = () => {
    setSubcategoryTodo([]);
    setSubcategory("");
    setCategory({ ...category, categoryname: "", mode: "Questions" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Project updateby edit page...
  let updateby = singleCategory?.updatedby;
  let addedby = singleCategory?.addedby;

  let subprojectsid = singleCategory?._id;

  const sendRequestEdit = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.CATEGORYINTERVIEW_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          categoryname: String(singleCategory.categoryname),
          mode: String(singleCategory.mode),
          subcategoryname: [...editTodo],
          updatedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      if (singleCategory.categoryname !== oldCategory) {
        let res = await axios.put(`${SERVICE.CATEGORYINTERVIEW_OVERALLEDIT}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          newcategory: String(singleCategory.categoryname),
          oldcategory: String(oldCategory),
          mode: String(singleCategory.mode),
        });
        if (res?.data?.resulttraining?.length > 0) {
          let answ = res?.data?.resulttraining.map((d, i) => {
            const regex = /\(([^-]+)-/;
            const match = d.testnames.match(regex);
            const updatedTestName = d?.testnames?.replace(
              match[1],
              singleCategory.categoryname
            );
            let res = axios.put(`${SERVICE.SINGLE_TRAININGDETAILS}/${d._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              testnames: updatedTestName,
            });
          });
        }
      }
      await getCategoryList();
      getCategory();
      setSubCategoryEdit("");

      handleEditClose();
      handleCloseOverallEditPopup();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getCategoryList = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYINTERVIEW}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filteredDatas = response?.data?.interviewcategory?.filter((data) => {
        if (data?.mode === "Exit Interview") {
          return isUserRoleCompare?.includes("menuexitinterviewdropdown");
        }
        return true;
      });
      setCategoryList(filteredDatas);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getCategoryListAll = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYINTERVIEW}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return response.data.interviewcategory.filter(
        (data) => data._id !== singleCategory._id
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const EditTodoPopup = () => {
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter  Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editTodo.some(
        (item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase()
      )
    ) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another Subcategory!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setEditTodo([...editTodo, subcategoryEdit]);
      setSubCategoryEdit("");
    }
  };

  const [oldCategory, setOldCategory] = useState("");
  const getCode = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYINTERVIEW_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sinterviewcategory);
      setEditTodo(res?.data?.sinterviewcategory?.subcategoryname);
      setOldCategory(res?.data?.sinterviewcategory?.categoryname);
      handleEditOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const getviewCode = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYINTERVIEW_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sinterviewcategory);
      setEditTodo(res?.data?.sinterviewcategory?.subcategoryname);
      handleViewOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [deleteId, setDeleteId] = useState({
    id: "",
    category: "",
    subcategory: "",
    mode: "",
  });

  const deleteData = async () => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.CATEGORYINTERVIEW_OVERALLDELETE}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          mode: deleteId?.mode,
          category: deleteId?.category,
          subcategory: deleteId?.subcategory,
        }
      );
      if (overallcheck?.data?.mayidelete) {
        let res = await axios.delete(
          `${SERVICE.CATEGORYINTERVIEW_SINGLE}/${deleteId?.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        await getCategoryList();
        getCategory();
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }

      handleCloseDelete();
    } catch (err) {
      handleCloseDelete();
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getinfoCode = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYINTERVIEW_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res?.data?.sinterviewcategory);
      setEditTodo(res?.data?.sinterviewcategory?.subcategoryname);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const addTodo = () => {
    if (subcategory === "") {
      setPopupContentMalert("Please Enter Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      subCategoryTodo.some(
        (item) => item?.toLowerCase() === subcategory?.toLowerCase()
      )
    ) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another Subcategory !"
      );
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
    setSubmitLoader(true);
    const isNameMatch = categoryList?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        category?.categoryname.toLowerCase() && item.mode === category?.mode
    );
    const hasDuplicates = (arr) =>
      new Set(arr.map((s) => s.toLowerCase())).size !== arr?.length;

    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (category.categoryname === "") {
      setPopupContentMalert("Please Enter Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategory !== "") {
      setPopupContentMalert("Please Add the Todo and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo?.length === 0) {
      setPopupContentMalert("Please Enter Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (hasDuplicates(subCategoryTodo)) {
      setPopupContentMalert("Sub Categories Can not be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((data) => data === "")) {
      setPopupContentMalert("Please Fill All The  Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (category?.mode === "Questions") {
        handleAddTypeOpen();
      } else {
        sendRequest();
      }
    }
  };

  const handleSubmitEdit = async () => {
    let resdata = await getCategoryListAll();
    const isNameMatch = resdata?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        singleCategory?.categoryname.toLowerCase() &&
        item.mode === singleCategory?.mode
    );

    const hasDuplicates = (arr) =>
      new Set(arr.map((s) => s.toLowerCase())).size !== arr?.length;
    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleCategory.categoryname === "") {
      setPopupContentMalert("Please Enter Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Fill All The  Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategoryEdit !== "") {
      setPopupContentMalert("Please Add the Todo and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo?.length === 0) {
      setPopupContentMalert("Please Enter Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (hasDuplicates(editTodo)) {
      setPopupContentMalert("Sub Categories Can not be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (singleCategory.categoryname !== oldCategory) {
        handleOpenOverallEditPopup();
        handleEditClose();
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
    mode: true,
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

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

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
            if (rowDataTable?.length === 0) {
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
              updatedSelectedRows?.length === filteredData?.length
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
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "categorycode",
      headerName: "Category Code",
      flex: 0,
      width: 130,
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
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.mode,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 230,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ecategoryinterview") && (
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
          {isUserRoleCompare?.includes("dcategoryinterview") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                setDeleteId({
                  ...deleteId,
                  id: params.row.id,
                  category: params.row.categoryname,
                  subcategory: params.row.subcategoryname,
                  mode: params.row.mode,
                });
                handleClickOpen();
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vcategoryinterview") && (
            <Button
              sx={userStyle.buttonview}
              onClick={(e) => {
                getviewCode(params.row.id);

              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("icategoryinterview") && (
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
    const correctedArray = Array.isArray(item?.subcategoryname)
      ? item.subcategoryname.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname,
      mode: item.mode,
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
    setColumnVisibility(initialColumnVisibility);
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

  // Excel
  const fileName = "Interview Category ";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Addinterviewcategory",
    pageStyle: "print",
  });

  return (
    <Box>
      <Headtitle title={"INTERVIEW CATEGORY"} />
      <PageHeading
        title="Interview Category"
        modulename="Interview"
        submodulename="Interview Setup"
        mainpagename="Category Interview"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("acategoryinterview") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Add Interview Category
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
                      let strings = "IC";
                      let refNo = cateCode[cateCode?.length - 1].categorycode;
                      let digits = (cateCode?.length + 1).toString();
                      const stringLength = refNo?.length;
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
                        digits?.length < 4 &&
                        getlastBeforeChar == 0 &&
                        getlastThreeChar == 0
                      ) {
                        refNOINC = ("000" + refNOINC).substr(-4);
                        newval = strings + refNOINC;
                      } else if (
                        digits?.length < 4 &&
                        getlastBeforeChar > 0 &&
                        getlastThreeChar == 0
                      ) {
                        refNOINC = ("00" + refLstTwo).substr(-4);
                        newval = strings + refNOINC;
                      } else if (digits?.length < 4 && getlastThreeChar > 0) {
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
                    placeholder="Please Enter Category  Code"
                    value={newval}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={modeOptions}
                    styles={colourStyles}
                    value={{
                      label: category.mode,
                      value: category.mode,
                    }}
                    onChange={(e) => {
                      setCategory({
                        ...category,
                        mode: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    SubCategory <b style={{ color: "red" }}>*</b>
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
                &nbsp;
              </Grid>
              <Grid item md={1} marginTop={3}></Grid>
              <Grid item md={5}></Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12}>
                {subCategoryTodo?.length > 0 && (
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
                  <LoadingButton
                    loading={submitLoader}
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    Save
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
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
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
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              sx={buttonStyles.buttonsubmit}
              onClick={handleCloseerr}
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
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Interview Category
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
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter Category  Code"
                    value={singleCategory.categorycode}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode <b style={{ color: "red" }}>*</b>
                  </Typography>

                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter SubCategory"
                    value={singleCategory.mode}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
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
                &nbsp;
              </Grid>
              <Grid item md={1} marginTop={3}></Grid>
              <Grid item md={5}></Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12}>
                {editTodo?.length > 0 && (
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
                    onClick={handleSubmitEdit}
                    sx={buttonStyles.buttonsubmit}
                  >
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
        <Dialog
          maxWidth="lg"
          open={addTypeOpen}
          onClose={handleAddTypeClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Create/Update Interview Type Master
                </Typography>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode
                  </Typography>

                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Mode"
                    value={typeDetails?.mode}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Choose Existing or New
                  </Typography>

                  <Selects
                    options={[
                      { label: "New", value: "New" },
                      { label: "Existing", value: "Existing" },
                    ]}
                    value={{
                      label: typeDetails?.eixstornew ? typeDetails?.eixstornew : "Please Select Existing Or New",
                      value: typeDetails?.eixstornew ? typeDetails?.eixstornew : "Please Select Existing Or New",
                    }}
                    onChange={(e) => {

                      setTypeDetails((prev) => ({
                        ...prev,
                        eixstornew: e.value,
                        newtype: "",
                        existingtypeid: "",
                        existingcategory: [],
                        existingsubcategory: [],
                        newcategory: "",
                        newsubcategory: [],
                        updatedby: [],
                      }))
                    }}
                  />
                </FormControl>
              </Grid>
              {typeDetails?.eixstornew === "Existing" &&
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={typeMasteDetails?.length > 0 ? typeMasteDetails?.map(data => ({
                          ...data,
                          label: data?.nametype,
                          value: data?.nametype,
                        })).filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label &&
                                i.value === item.value
                            ) === index
                          );
                        }) : []}
                        styles={colourStyles}
                        value={{
                          label: typeDetails?.newtype ? typeDetails?.newtype : "Please Select Existing Type",
                          value: typeDetails?.newtype ? typeDetails?.newtype : "Please Select Existing Type",
                        }}
                        onChange={(e) => {
                          setTypeDetails((prev) => ({
                            ...prev,
                            newtype: e.value,
                            // existingcategory: e?.categorytype,
                            // existingsubcategory: e?.subcategorytype,
                            // existingtypeid: e?._id,
                            // updatedby: e?.updatedby,
                          }))
                        }}
                      />

                    </FormControl>
                  </Grid>
                  {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Existing Category</Typography>
                      <Typography>
                        {Array.isArray(typeDetails?.existingcategory)
                          ? typeDetails?.existingcategory
                            ?.map((item) => `${item}`)
                            .join(",")
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Existing Sub Category</Typography>
                      <Typography>
                        {Array.isArray(typeDetails?.existingcategory)
                          ? typeDetails?.existingcategory
                            ?.map((item) => `${item}`)
                            .join(",")
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid> */}
                </>}
              {typeDetails?.eixstornew === "New" &&
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={typeDetails?.newtype}
                        placeholder="Please Enter Name"
                        onChange={(e) => {

                          setTypeDetails((prev) => ({
                            ...prev,
                            newtype: e.target.value,
                          }))
                        }}
                      />
                    </FormControl>
                  </Grid> </>}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category
                  </Typography>

                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Category"
                    value={category?.categoryname}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  SubCategory <b style={{ color: "red" }}>*</b>
                </Typography>

                <MultiSelect
                  options={subCategoryTodo?.length > 0 ?
                    subCategoryTodo?.map(data => ({
                      label: data,
                      value: data,
                    })) : []
                  }

                  value={typeDetails?.newsubcategory}
                  onChange={(e) => {

                    setTypeDetails((prev) => ({
                      ...prev,
                      newsubcategory: e,
                    }))

                  }}
                  valueRenderer={customValueRendererQuestions}
                  labelledBy="Please Select Sub Category"
                />
              </Grid>

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
                  {/* {typeDetails?.eixstornew === "Existing" ? <Button
                    variant="contained"
                    onClick={handleUpateType}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Update
                  </Button> : */}
                  <Button
                    variant="contained"
                    onClick={handleCreateType}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Create
                  </Button>
                  {/* } */}

                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={() => {
                      handleAddTypeClose();
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
                  View Interviews Category
                </Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Category Name</Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Category  Name"
                    value={singleCategory.categoryname}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
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
              <Grid item md={2} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Mode</Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    placeholder="Please Enter Category  Code"
                    value={singleCategory.mode}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}></Grid>
              <Grid item md={1} marginTop={3}></Grid>
              <Grid item md={5}></Grid>
              <Grid item md={2}></Grid>
              <Grid item md={4} sm={12} xs={12}>
                <Typography>SubCategory</Typography>

                {editTodo?.length > 0 && (
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
                              />
                            </FormControl>
                            &emsp; &emsp;
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
      <br />
      {isUserRoleCompare?.includes("lcategoryinterview") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  All Interview Category List
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
                  {/* <Box > */}
                  {isUserRoleCompare?.includes("excelcategoryinterview") && (
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
                  {isUserRoleCompare?.includes("csvcategoryinterview") && (
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
                  {isUserRoleCompare?.includes("printcategoryinterview") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfcategoryinterview") && (
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
                  {isUserRoleCompare?.includes("imagecategoryinterview") && (
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
              {isUserRoleCompare?.includes("bdcategoryinterview") && (
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonbulkdelete}
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
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
                {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                {filteredDatas?.length} entries
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
            {/* Manage Column */}
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
              <Typography
                variant="h5"
                sx={{ color: "red", textAlign: "center" }}
              >
                If this category used in any of the pages that may also edits.
                Are you sure?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseOverallEditPopup} variant="outlined" sx={buttonStyles.btncancel}>
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
                  {selectedRows?.length === 0 ? (
                    <>
                      The Datas in the selected rows are already used in some
                      pages, you can't delete.
                    </>
                  ) : (
                    <>
                      Are you sure? Only {selectedRows?.length} datas can be
                      deleted remaining are used in some pages.
                    </>
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseModcheckbox}
                  sx={buttonStyles.btncancel}
                >
                  Cancel
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  color="error"
                  onClick={(e) => delInterviewcheckbox(e)}
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      )}{" "}
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
        filename={"Interview Category"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Interview Category Info"
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
    </Box>
  );
}

export default Addcategoryinterview;