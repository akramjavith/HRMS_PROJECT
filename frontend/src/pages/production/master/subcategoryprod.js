import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice.js";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import StyledDataGrid from "../../../components/TableStyle.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Selects from "react-select";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import ExportData from "../../../components/ExportData.js";
import AlertDialog from "../../../components/Alert.js";
import MessageAlert from "../../../components/MessageAlert.js";
import InfoPopup from "../../../components/InfoPopup.js";
import { MultiSelect } from "react-multi-select-component";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading.js";

function SubCategoryMaster() {

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  let exportColumnNames = ['Project Name', 'category Name', 'Subcategory Name', 'Mode'];
  let exportRowValues = ['project', 'categoryname', 'name', 'mode'];

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [projects, setProjects] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategory, setSubcategory] = useState({ name: "", mode: "Allot" });
  const [subcategoryid, setSubcategoryid] = useState({ name: "", mode: "Allot" });
  const [selectedProject, setSelectedProject] = useState("Please Select Project");
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Please Select Category");
  const [selectedProjectedit, setSelectedProjectedit] = useState("Please Select Project");
  const [selectedCategoryedit, setSelectedCategoryedit] = useState("Please Select Category");
  const [modulecheck, setmodulecheck] = useState(false);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
  const [allModuleedit, setAllModuleedit] = useState([]);
  const username = isUserRoleAccess.username;
  const [getrowid, setRowGetid] = useState("");


  const [mismatchMode, setMismatchMode] = useState([]);
  const [mismatchModeEdit, setMismatchModeEdit] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState(3);
  const [pageNumbers, setPageNumbers] = useState([]);

  const mismatchModes = [
    { label: "Unit + Flag", value: "Unit + Flag" },
    { label: "Unit", value: "Unit" },
    { label: "Flag", value: "Flag" },
    { label: "Unit + Section", value: "Unit + Section" },
    { label: "Flag Mismatched", value: "Flag Mismatched" }
  ]

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);
  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // setPage(1);
  };
  const modes = [
    { label: "Allot", value: "Allot" },
    { label: "Section", value: "Section" },
  ];
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
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
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Subcategory.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    project: true,
    categoryname: true,
    name: true,
    mode: true,
    actions: true,
    mismatchmode: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleProjectChange = (e) => {
    const selectedProject = e.value;
    setSelectedProject(selectedProject);
    setSelectedCategory("Please Select Category");
  };


  const handleMisMatchChange = (options) => {

    setMismatchMode(options);

  };

  const customValueRendererMode = (valueMode, _categoryname) => {
    return valueMode?.length
      ? valueMode.map(({ label }) => label)?.join(", ")
      : "Please Select Mode";
  };

  const handleMisMatchChangeEdit = (options) => {

    setMismatchModeEdit(options);

  };

  const customValueRendererModeEdit = (valueMode, _categoryname) => {
    return valueMode?.length
      ? valueMode.map(({ label }) => label)?.join(", ")
      : "Please Select Mode";
  };



  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //set function to get particular row
  const [deletemodule, setDeletemodule] = useState({});

  const rowData = async (id, name) => {
    // setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletemodule(res?.data?.ssubcategoryprod);

      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Project for Dropdowns
  const fetchProjectDropdowns = async () => {
    // setPageName(!pageName)
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.projmaster.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProjects(projall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchCategoryDropdowns = async () => {
    // setPageName(!pageName)
    try {
      let res_project = await axios.get(SERVICE.CATEGORYPROD_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategories(res_project?.data?.categoryprod);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let susbcategoriesexcelid = deletemodule._id;
  const delModule = async () => {
    // setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${susbcategoriesexcelid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllSubCategory();
      setPage(1);
      setSelectedRows([]);
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const delProjectcheckbox = async () => {
    // setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      await fetchAllSubCategory();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function...
  const sendRequest = async (unitrate) => {
    const mismatchdata = mismatchMode.map(item => item.value);
    // setPageName(!pageName)
    try {
      if (unitrate === 0) {
        let flagstatusval = categories.find((d) => d.project === selectedProject && d.name === selectedCategory);

        let modulesUnit = await axios.post(SERVICE.PRODUCTION_UNITRATE_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          project: String(selectedProject),
          category: String(selectedCategory),
          subcategory: String(subcategory.name),
          mrate: String(0),
          orate: String(0),
          trate: String(0),
          flagcount: String(1),
          flagstatus: flagstatusval ? flagstatusval.flagstatus : "No",
          conversion: String(8.333333333333333),
          points: String(0),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
              fileName: String(""),
            },
          ],
        });
      }
      let modules = await axios.post(SERVICE.SUBCATEGORYPROD_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        categoryname: String(selectedCategory),
        name: String(subcategory.name),
        mode: String(subcategory.mode),
        mismatchmode: mismatchdata,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchAllSubCategory();
      setSubcategory({ ...subcategory, name: "", mode: "Allot" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = async (e) => {
    // setPageName(!pageName)
    try {
      let resSub = await axios.post(SERVICE.CHECKSUBCATEGORY_MANUAL_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        category: String(selectedCategory),
        subcategory: String(subcategory.name),
      });
      const isNameMatch = resSub?.data?.subcategoryprod;
      if (selectedProject === "" || selectedProject == "Please Select Project") {
        setPopupContentMalert("Please Select Project");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedCategory === "" || selectedCategory == "Please Select Category") {
        setPopupContentMalert("Please Select Category");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (subcategory.name === "") {
        setPopupContentMalert("Please Enter Subcategory Name");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (mismatchMode.length === 0) {
        setPopupContentMalert("Please Select Mismatch Mode");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (isNameMatch > 0) {
        setPopupContentMalert("Data already exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

      else {
        let res = await axios.post(SERVICE.CHECKUNITRATE_MANUAL_CREATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          project: String(selectedProject),
          category: String(selectedCategory),
          subcategory: String(subcategory.name),
        });
        let unitrates = res?.data?.unitsrate;
        if (res.statusText === "OK") {
          sendRequest(unitrates);
        } else {
          setPopupContentMalert("Something Went Wrong!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }

      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setSelectedProject("Please Select Project");
    setSelectedCategory("Please Select Category");
    setSubcategory("Please Select Subcategory");
    setSelectedVendors([]);
    setSubcategory({ name: "", mode: "Allot" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  //get single row to edit....
  const getCode = async (e, name) => {
    // setPageName(!pageName)
    try {
      setRowGetid(e);
      let res = await axios.get(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubcategoryid(res?.data?.ssubcategoryprod);
      setRowGetid(res?.data?.ssubcategoryprod);
      setSelectedProjectedit(res?.data?.ssubcategoryprod.project);
      setSelectedCategoryedit(res?.data?.ssubcategoryprod.categoryname);
      setMismatchModeEdit(res?.data?.ssubcategoryprod.mismatchmode.map(item => ({
        ...item,
        label: item,
        value: item
      })))
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    // // setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubcategoryid(res?.data?.ssubcategoryprod);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    // // setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubcategoryid(res?.data?.ssubcategoryprod);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //subcategory updateby edit page...
  let updateby = subcategoryid?.updatedby;
  let addedby = subcategoryid?.addedby;
  let categoriesid = subcategoryid?._id;

  //editing the single data...
  const sendEditRequest = async (unitrate) => {
    // // setPageName(!pageName)
    try {
      if (unitrate === 0) {
        let flagstatusval = categories.find((d) => d.project === selectedProject && d.name === selectedCategory);

        let modulesUnit = await axios.post(SERVICE.PRODUCTION_UNITRATE_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          project: String(selectedProjectedit),
          category: String(selectedCategoryedit),
          subcategory: String(subcategoryid.name),
          mrate: String(0),
          orate: String(0),
          flagcount: String(1),
          flagstatus: flagstatusval ? flagstatusval.flagstatus : "No",
          conversion: String(8.333333333333333),
          points: String(0),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
              fileName: String(""),
            },
          ],
        });
      }
      let res = await axios.put(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${categoriesid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProjectedit,
        categoryname: selectedCategoryedit,
        name: String(subcategoryid.name),
        mode: String(subcategoryid.mode),
        mismatchmode: mismatchModeEdit.map(item => item.value),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchAllSubCategory();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const editSubmit = async (e) => {
    // // setPageName(!pageName)
    try {
      let resSub = await axios.post(SERVICE.CHECKSUBCATEGORY_MANUAL_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProjectedit),
        category: String(selectedCategoryedit),
        subcategory: String(subcategoryid.name),
        id: subcategoryid._id,
      });
      const isNameMatch = resSub?.data?.subcategoryprod;
      if (selectedProjectedit === "" || selectedProjectedit === "Please Select Project") {
        setPopupContentMalert("Please Select Project");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedCategoryedit === "" || selectedCategoryedit == "Please Select Category") {
        setPopupContentMalert("Please Select Category");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (subcategoryid.name === "") {
        setPopupContentMalert("Please Enter subcategory Name");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (mismatchModeEdit.length === 0) {
        setPopupContentMalert("Please Select Mismatch Mode");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatch > 0) {
        setPopupContentMalert("Name already exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        let res = await axios.post(SERVICE.CHECKUNITRATE_MANUAL_CREATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          project: String(selectedProjectedit),
          category: String(selectedCategoryedit),
          subcategory: String(subcategoryid.name),
        });
        let unitrates = res?.data?.unitsrate;
        // console.log(res.statusText, 'res.statusText')
        if (res.statusText === "OK") {
          sendEditRequest(unitrates);
        } else {
          setPopupContentMalert("Something Went Wrong!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [subcategoriesCount, setSubcategoriesCount] = useState(0);

  //get all category.
  const fetchAllSubCategory = async () => {
    // // setPageName(!pageName)
    try {
      let res_module = await axios.post(SERVICE.SUBCATEGORYPROD_LIST_LIMITED_PAGINATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: page,
        pageSize: pageSize,
        searchterm: searchQuery,
      });

      let uniquesubRates = res_module?.data.subcategoryprod.sort((a, b) => {
        // Names are the same, sort by category alphabetically
        if (a.categoryname < b.categoryname) return -1;
        if (a.categoryname > b.categoryname) return 1;
        // Categories are the same, sort by priority alphabetically
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      let subcates = uniquesubRates.map((d, index) => ({
        ...d,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      let subcatescount = res_module?.data?.totalCount;
      setSubcategoriesCount(subcatescount);
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }
      setPageNumbers(newPageNumbers);
      let uniqueArrayfinal = subcates;
      setSubcategories(subcates);
      setmodulecheck(true);
    } catch (err) { setmodulecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchAllSubCategory();
    fetchSubCategoryexcelAll()
  }, [page, searchQuery, pageSize]); //

  // get all modules.
  const fetchSubCategoryexcelAll = async () => {
    // setPageName(!pageName)
    try {
      let res_module = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllModuleedit(res_module?.data?.subcategoryprod);
    } catch (err) { setmodulecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production Subcategory",
    pageStyle: "print",
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllSubCategory();
    fetchProjectDropdowns();
  }, []);

  useEffect(() => {
    fetchCategoryDropdowns();
  }, [isEditOpen]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = subcategories;
    // ?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [subcategories]);

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
            setSelectAllChecked(updatedSelectedRows.length === items.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 80,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "project", headerName: "Project Name", flex: 0, width: 150, hide: !columnVisibility.project, headerClassName: "bold-header" },
    { field: "categoryname", headerName: "Category", flex: 0, width: 350, hide: !columnVisibility.categoryname, headerClassName: "bold-header" },
    { field: "name", headerName: "Sub Category", flex: 0, width: 460, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "mode", headerName: "Mode", flex: 0, width: 80, hide: !columnVisibility.mode, headerClassName: "bold-header" },
    { field: "mismatchmode", headerName: "Mismatch Mode", flex: 0, width: 250, hide: !columnVisibility.mismatchmode, headerClassName: "bold-header" },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 230,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eproductionsubcategory") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dproductionsubcategory") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vproductionsubcategory") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iproductionsubcategory") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={() => {
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

  const rowDataTable = items.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      project: item.project,
      categoryname: item.categoryname,
      name: item.name,
      mode: item.mode,
      mismatchmode: item.mismatchmode,
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
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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

  return (
    <Box>
      <Headtitle title={"SUBCATEGORY"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Production Subcategory "
        modulename="Production"
        submodulename="SetUp"
        mainpagename="Production Sub Category "
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aproductionsubcategory") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Add Production Subcategory</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Project <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Selects options={projects} value={{ label: selectedProject, value: selectedProject }} onChange={handleProjectChange} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Category <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Selects
                    options={[...new Set(categories.filter((d) => d.project === selectedProject).map((d) => d.name))].map((name) => ({
                      label: name,
                      value: name,
                    }))}

                    value={{ label: selectedCategory, value: selectedCategory }}
                    onChange={(e) => setSelectedCategory(e.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={subcategory.name}
                    placeholder="Please Enter Subcategory name"
                    onChange={(e) => {
                      setSubcategory({ ...subcategory, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Mode <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Selects
                    options={modes}

                    value={{ label: subcategory.mode, value: subcategory.mode }}
                    onChange={(e) => {
                      setSubcategory({ ...subcategory, mode: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mismatch Mode <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={mismatchModes}
                    value={mismatchMode}
                    onChange={(e) => {
                      handleMisMatchChange(e);
                    }}
                    valueRenderer={customValueRendererMode}
                    labelledBy="Please Select Mode"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  SUBMIT
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                <Button sx={userStyle.btncancel} onClick={handleclear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <Box>
        {/* edit model */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px 25px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>Edit Production Subcategory</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={projects}

                      value={{ label: selectedProjectedit, value: selectedProjectedit }}
                      onChange={(e) => {
                        setSelectedProjectedit(e.value);
                        setSelectedCategoryedit("Please Select Category");
                      }}
                    />
                  </FormControl>
                </Grid>
                {/* } */}
                <Grid item md={8} xs={12} sm={6}>
                  <Typography>
                    category <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={[...new Set(categories.filter((d) => d.project === selectedProjectedit).map((d) => d.name))].map((name) => ({
                        label: name,
                        value: name,
                      }))}

                      value={{ label: selectedCategoryedit, value: selectedCategoryedit }}
                      onChange={(e) => setSelectedCategoryedit(e.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Subcategory Name"
                      value={subcategoryid.name}
                      onChange={(e) => {
                        setSubcategoryid({ ...subcategoryid, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Mode <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={modes}

                      value={{ label: subcategoryid.mode, value: subcategoryid.mode }}
                      onChange={(e) => {
                        setSubcategoryid({ ...subcategoryid, mode: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mismatch Mode <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={mismatchModes}
                      value={mismatchModeEdit}
                      onChange={(e) => {
                        handleMisMatchChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererModeEdit}
                      labelledBy="Please Select Project"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Box sx={{ display: "flex", justifyContent: "end", gap: "10px" }}>
                <Button variant="contained" onClick={editSubmit}>
                  {" "}
                  Update
                </Button>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                  {" "}
                  Cancel{" "}
                </Button>
              </Box>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lproductionsubcategory") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}> Production Subcategory List</Typography>
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
                    {/* <MenuItem value={subcategoriesCount?.length}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelproductionsubcategory") && (
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
                  {isUserRoleCompare?.includes("csvproductionsubcategory") && (
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
                  {isUserRoleCompare?.includes("printproductionsubcategory") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfproductionsubcategory") && (
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
                  {isUserRoleCompare?.includes("imageproductionsubcategory") && (
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
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdproductionsubcategory") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!modulecheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>

                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <br />
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {items.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, subcategoriesCount)} of {subcategoriesCount} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers.map((pageNumber) => (
                      <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber} sx={userStyle.paginationbtn}>
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
                {/* ****** Table End ****** */}
              </>
            )}
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

      {/* view model */}
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Production Subcategory</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">project</Typography>
                  <Typography>{subcategoryid.project}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Category</Typography>
                  <Typography>{subcategoryid.categoryname}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{subcategoryid.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{subcategoryid.mode}</Typography>
                </FormControl>
              </Grid>
              <br />
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      <br />
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
        filteredDataTwo={subcategories ?? []}
        itemsTwo={allModuleedit ?? []}
        filename={"Production Subcategory"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Production Subcategory Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delModule}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delProjectcheckbox}
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

export default SubCategoryMaster;