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
  Popover,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PageHeading from "../../components/PageHeading";

function ClockinIP() {
  const [fileFormat, setFormat] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
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
  }
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length == 0) {
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
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  let exportColumnNames = ["Company", "Branch", "IP Address"];
  let exportRowValues = ["company", "branch", "ipaddresses"];
  const gridRef = useRef(null);
  //useState
  const [clockinIP, setClockinIP] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
  });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [isBtn, setIsBtn] = useState(false);
  const [subcategory, setSubcategory] = useState("");
  const [clockinIPList, setClockinIPList] = useState([]);
  const { auth } = useContext(AuthContext);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [singleClockinIP, setSingleClockinIP] = useState({});
  const [editTodo, setEditTodo] = useState([]);
  const [subcategoryEdit, setSubCategoryEdit] = useState("");
  const [loading, setLoading] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [subDuplicate, setSubDuplicate] = useState([]);
  const [openInfo, setOpeninfo] = useState(false);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, } = useContext(
    UserRoleAccessContext
  );
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [deleteId, setDeleteId] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [branchIP, setBranchIP] = useState([]);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    company: true,
    branch: true,
    ipaddress: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const username = isUserRoleAccess?.username;
  //useEffect
  useEffect(() => {
    getClockinIPList();
  }, []);
  useEffect(() => {
    getClockinIPListAll();
  }, [editOpen, singleClockinIP]);
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
    setIsBtn(true);
    const subcategoryName =
      subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
    setPageName(!pageName)
    try {
      let res_doc = await axios.post(SERVICE.CLOCKINIP_CREATE, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        company: String(clockinIP.company),
        branch: String(clockinIP.branch),
        ipaddress: subcategoryName,
        addedby: [{ name: String(username), date: String(new Date()) }],
      });
      setSubcategoryTodo([]);
      setSubcategory("");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await getClockinIPList();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      const messages = err?.response?.data?.message;
      if (messages) {
        setPopupContentMalert(messages);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setPopupContentMalert("something went wrong!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const handleClear = () => {
    setSubcategoryTodo([]);
    setSubcategory("");
    setClockinIP({
      company: "Please Select Company",
      branch: "Please Select Branch",
    });
    setBranchIP([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const getClockinIPListAll = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : []; // Return an empty array if isAssignBranch is undefined or null

    setPageName(!pageName)
    try {
      let response = await axios.post(`${SERVICE.ASSIGNCLOCKINIP}`, {
        assignbranch: accessbranch
      }, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSubDuplicate(
        response.data.clockinip.filter(
          (data) => data._id !== singleClockinIP._id
        )
      );
      setLoading(true);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setPopupContentMalert(messages);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setPopupContentMalert("something went wrong!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const sendRequestEdit = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.CLOCKINIP_SINGLE}/${singleClockinIP._id}`,
        {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          company: String(singleClockinIP.company),
          branch: String(singleClockinIP.branch),
          ipaddress: [...editTodo],
          updatedby: [
            ...updateby,
            { name: String(username), date: String(new Date()) },
          ],
        }
      );
      await getClockinIPList();
      await getClockinIPListAll();
      setSubCategoryEdit("");
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleEditClose();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setPopupContentMalert(messages);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setPopupContentMalert("something went wrong!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const getClockinIPList = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : []; // Return an empty array if isAssignBranch is undefined or null

    setPageName(!pageName)
    try {
      let response = await axios.post(`${SERVICE.ASSIGNCLOCKINIP}`, {
        assignbranch: accessbranch
      }, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setClockinIPList(response.data.clockinip.map((item, index) => {
        const correctedArray = Array.isArray(item?.ipaddress)
          ? item.ipaddress.map((d) => (Array.isArray(d) ? d.join(",") : d))
          : [];
        return {
          ...item,
          serialNumber: item.serialNumber,
          company: item.company,
          branch: item.branch,
          ipaddresses: item.ipaddress.toString(),
        }
      }));
      setSubDuplicate(
        response.data.clockinip.filter(
          (data) => data._id !== singleClockinIP._id
        )
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setPopupContentMalert(messages);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setPopupContentMalert("something went wrong!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const EditTodoPopup = () => {
    getClockinIPList();
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.some((item) => item === subcategoryEdit)) {
      setPopupContentMalert("Already Added ! Please Enter Another IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setEditTodo([...editTodo, subcategoryEdit]);
      setSubCategoryEdit("");
    }
  };
  const getinfoCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.CLOCKINIP_SINGLE}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSingleClockinIP(res.data.sclockinip);
      setEditTodo(res.data.sclockinip.ipaddress);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"something went wrong!"}{" "}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  // updateby edit page...
  let updateby = singleClockinIP.updatedby;
  let addedby = singleClockinIP.addedby;
  const deleteData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.delete(`${SERVICE.CLOCKINIP_SINGLE}/${deleteId}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      await getClockinIPList();
      handleCloseDelete();
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setPopupContentMalert("Please Enter IP Address");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setPopupContentMalert("something went wrong!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const addTodo = () => {
    getClockinIPList();
    const isNameMatch = clockinIPList?.some(
      (item) => item?.branch?.toLowerCase() === clockinIP?.branch.toLowerCase()
    );
    if (subcategory === "") {
      setPopupContentMalert("Please Enter IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (clockinIP.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === subcategory)) {
      setPopupContentMalert("Already Added ! Please Enter Another IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSubcategoryTodo([...subCategoryTodo, subcategory]);
      setSubcategory("");
    }
  };
  const handleTodoEdit = (index, newValue) => {
    const isDuplicate = subCategoryTodo.some(
      (item, i) => i !== index && item === newValue
    );
    if (isDuplicate) {
      // Handle duplicate case, show an error message, and return early
      setPopupContentMalert("Already Added ! Please Enter Another IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else {
      if (subCategoryTodo.some((item) => item === newValue)) {
        setPopupContentMalert("Already Added ! Please Enter Another IP Address");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        return;
      }
    }
    const updatedTodos = [...subCategoryTodo];
    updatedTodos[index] = newValue;
    setSubcategoryTodo(updatedTodos);
  };
  const handleTodoEditPop = (index, newValue) => {
    const onlSub = clockinIPList.map((data) => data.ipaddress);
    let concatenatedArray = [].concat(...onlSub);
    const isDuplicate = concatenatedArray.some(
      (item, i) => i !== index && item === newValue
    );
    const updatedTodos = [...editTodo];
    updatedTodos[index] = newValue;
    setEditTodo(updatedTodos);
  };
  const handleSubmit = () => {
    const isNameMatch = clockinIPList?.some(
      (item) =>
        item?.company === clockinIP?.company &&
        item?.branch === clockinIP?.branch
    );
    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Select Another Branch ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (clockinIP.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (clockinIP.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategory != "") {
      setPopupContentMalert("Please Add Todo And Submit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleSubmitEdit = () => {
    getClockinIPListAll();
    const onlSub = clockinIPList.map((data) => data.ipaddress);
    let concatenatedArray = [].concat(...onlSub);
    // const isDuplicate = concatenatedArray.some((item, i) => i !== index && item === newValue);
    const isNameMatch = subDuplicate?.some(
      (item) =>
        item?.company === singleClockinIP?.company &&
        item?.branch === singleClockinIP?.branch
    );
    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Select Another Branch ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleClockinIP.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleClockinIP.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategoryEdit != "") {
      setPopupContentMalert("Please Add Todo And Submit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length === 0) {
      setPopupContentMalert("Please Enter IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      editTodo.length !==
      new Set(editTodo.map((item) => item.toLowerCase())).size
    ) {
      setPopupContentMalert("Already Added !Please Enter IP Address");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
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
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": { overflowY: "hidden" },
    "& .MuiDataGrid-columnHeaderTitle": { fontWeight: " bold !important " },
    "& .custom-id-row": { backgroundColor: "#1976d22b !important" },
    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important",
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": { backgroundColor: "#ff00004a !important" },
      "& .custom-in-row:hover": { backgroundColor: "#ffff0061 !important" },
      "& .custom-others-row:hover": { backgroundColor: "#0080005e !important" },
    },
  }));
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
  const searchOverTerms = searchQuery?.split(" ");
  const filteredDatas = clockinIPList?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.includes(term)
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
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "ipaddress",
      headerName: "IP Address",
      flex: 0,
      width: 250,
      minHeight: "40px",
      hide: !columnVisibility.ipaddress,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eclockinip") && (
            <Button
              onClick={() => {
                getinfoCode(params.row.id);
                handleEditOpen();
              }}
              sx={userStyle.buttonedit}
            >
              <EditOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dclockinip") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                setDeleteId(params.row.id);
                handleClickOpen();
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vclockinip") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getinfoCode(params.row.id);
                handleViewOpen();
              }}
            >
              <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iclockinip") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
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
    const correctedArray = Array.isArray(item?.ipaddress)
      ? item.ipaddress.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      ipaddress: item.ipaddress.toString(),
    };
  });
  //function to fetch ip by branch
  const fetchIP = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.BRANCH_IP, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        branch: String(e),
      });
      setBranchIP(res?.data?.ipbybranch);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
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
    column.headerName.includes(searchQueryManage)
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
  const fileName = "ClockinIP";
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Clockin IP",
    pageStyle: "print",
  });
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ClockinIP.png");
        });
      });
    }
  };
  return (
    <Box>
      <Headtitle title={"CLOCKIN IP"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Clockin IP"
        modulename="Settings"
        submodulename="Clockin IP"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("aclockinip") && (
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Add Clockin IP
                </Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={isAssignBranch
                      ?.map((data) => ({
                        label: data.company,
                        value: data.company,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    placeholder="Please Select Company"
                    value={{
                      label: clockinIP.company,
                      value: clockinIP.company,
                    }}
                    onChange={(e) => {
                      setClockinIP({
                        ...clockinIP,
                        company: e.value,
                        branch: "Please Select Branch",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={isAssignBranch
                      ?.filter((comp) => clockinIP.company === comp.company)
                      ?.map((data) => ({
                        label: data.branch,
                        value: data.branch,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    placeholder="Please Select Branch"
                    value={{
                      label: clockinIP.branch,
                      value: clockinIP.branch,
                    }}
                    onChange={(e) => {
                      setClockinIP({ ...clockinIP, branch: e.value });
                      fetchIP(e.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}></Grid>
              {/* <Grid item md={2}></Grid> */}
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  {" "}
                  <Typography>
                    {" "}
                    IP Address <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter IP Address"
                    value={subcategory}
                    onChange={(e) => {
                      const userInput = e.target.value;
                      if (/^$|^[0-9.]+$/.test(userInput)) {
                        setSubcategory(userInput);
                      }
                    }}
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
                              <Typography>&nbsp;</Typography>
                              <Typography>{item} </Typography>
                              {/* <OutlinedInput id="component-outlined" placeholder="Please Enter IP Address" value={item} onChange={(e) => handleTodoEdit(index, e.target.value)} /> */}
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
                {branchIP && (
                  <ul type="none">
                    {branchIP.map((dataItem) => (
                      <li key={dataItem._id}>
                        <br />
                        <ul type="none">
                          {dataItem.ipaddress.map((ip, index) => (
                            <Grid sx={{ display: "flex" }}>
                              <FormControl fullWidth size="small">
                                {/* <li key={index}>{ip}</li> */}
                                {/* <Typography>&nbsp;</Typography> */}
                                <Typography>{ip} </Typography>
                              </FormControl>
                            </Grid>
                          ))}
                        </ul>
                      </li>
                    ))}
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
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isBtn}
                  >
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
      {/* alert dialog */}
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
      {/* edit dialog */}
      <Box>
        <Dialog
          maxWidth="md"
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ maxWidth: "800px" }}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  Edit Clockin IP{" "}
                </Typography>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={isAssignBranch
                      ?.map((data) => ({
                        label: data.company,
                        value: data.company,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    placeholder="Please Select Branch"
                    value={{
                      label:
                        singleClockinIP.company === ""
                          ? "Please Select Company"
                          : singleClockinIP.company,
                      value:
                        singleClockinIP.company === ""
                          ? "Please Select Company"
                          : singleClockinIP.company,
                    }}
                    onChange={(e) => {
                      setSingleClockinIP({
                        ...singleClockinIP,
                        company: e.value,
                        branch: "Please Select Branch",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={isAssignBranch
                      ?.filter(
                        (comp) => singleClockinIP.company === comp.company
                      )
                      ?.map((data) => ({
                        label: data.branch,
                        value: data.branch,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    placeholder="Please Select Branch"
                    value={{
                      label: singleClockinIP.branch,
                      value: singleClockinIP.branch,
                    }}
                    onChange={(e) => {
                      setSingleClockinIP({
                        ...singleClockinIP,
                        branch: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    IP Address <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter IP Address"
                    value={subcategoryEdit}
                    onChange={(e) => {
                      const userInput = e.target.value;
                      if (/^$|^[0-9.]+$/.test(userInput)) {
                        setSubCategoryEdit(userInput);
                      }
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
                                placeholder="Please Enter IP Address"
                                value={item}
                                onChange={(e) => {
                                  const userInput = e.target.value;
                                  if (/^$|^[0-9.]+$/.test(userInput)) {
                                    handleTodoEditPop(index, userInput);
                                  }
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
        <Dialog
          maxWidth="md"
          open={openView}
          onClose={handlViewClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ maxWidth: "800px" }}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  View Clockin IP{" "}
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography> Company</Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    type="text"
                    placeholder="Please Select Conmpany"
                    value={singleClockinIP.company}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography> Branch </Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    type="text"
                    placeholder="Please Select Branch"
                    value={singleClockinIP.branch}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <Typography>IP Address</Typography>
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
                                placeholder="Please Enter IP Address"
                                value={item}
                              />{" "}
                            </FormControl>
                          </Grid>{" "}
                        </li>
                      );
                    })}{" "}
                  </ul>
                )}
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
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
      {isUserRoleCompare?.includes("lclockinip") && (
        <>
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
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography sx={userStyle.HeaderText}>
                    All Clockin IP List
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
                        <MenuItem value={clockinIPList?.length}>All</MenuItem>
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
                      {isUserRoleCompare?.includes("excelclockinip") && (
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
                      {isUserRoleCompare?.includes("csvclockinip") && (
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
                      {isUserRoleCompare?.includes("printclockinip") && (
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
                      {isUserRoleCompare?.includes("pdfclockinip") && (
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
                      {isUserRoleCompare?.includes("imageclockinip") && (
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
          )}
        </>
      )}
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
      {/* EXTERNAL COMPONENTS -------------- END */}
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={filteredData ?? []}
        itemsTwo={clockinIPList ?? []}
        filename={"ClockinIP"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Clockin IP List Info"
        addedby={addedby}
        updateby={updateby}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteData}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
    </Box>
  );
}
export default ClockinIP;