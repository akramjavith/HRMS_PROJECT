import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table.js";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StyledDataGrid from "../../../components/TableStyle.js";
import ViewHeadlineOutlinedIcon from "@mui/icons-material/ViewHeadlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext.js";
import { AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import ExportData from "../../../components/ExportData.js";
import AlertDialog from "../../../components/Alert.js";
import MessageAlert from "../../../components/MessageAlert.js";
import InfoPopup from "../../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading.js";

function Productionunitrate() {

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

  let exportColumnNames = ['Project', 'Category', 'SubCategory', 'O-Rate', 'T-Rate', 'M-Rate', 'Conversion', 'Points', 'Flagcount', 'FlagStatus'];
  let exportRowValues = ['project', 'category', 'subcategory', 'orate', 'trate', 'mrate', 'conversion', 'points', 'flagcount', 'flagstatus']

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [unitRate, setUnitRate] = useState({ project: "Please Select Project", category: "Please Select Category", subcategory: "Please Select Subcategory", orate: 0, mrate: 0, conversion: "8.333333333333333", points: "0.0000", flagcount: 1 });
  const [unitRateEdit, setUnitRateEdit] = useState({ project: "", category: "", subcategory: "", orate: "", mrate: "", conversion: "", points: "", flagcount: "" });
  const [unitRateArray, setUnitRateArray] = useState([]);
  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteUnitRate, setDeleteUnitRate] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [projects, setProjects] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    project: true,
    category: true,
    subcategory: true,
    orate: true,
    mrate: true,
    trate: true,
    conversion: true,
    points: true,
    flagcount: true,
    flagstatus: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // page refersh reload
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;

  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const fetchProject = async () => {
    setPageName(!pageName)
    try {
      let res_project = await axios.get(SERVICE.VENDORMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_project?.data?.vendormaster.filter((item, index) => {
        // Check if the index of the current item is equal to the index of the first occurrence of the item
        return index === res_project?.data?.vendormaster.findIndex((obj) => obj["projectname"] === item["projectname"]);
      });
      const projall = [
        ...result.map((d) => ({
          ...d,
          label: d.projectname,
          value: d.projectname,
        })),
      ];

      setProjects(projall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchCategory = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.CATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOption(res_category?.data?.categoryprod);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchSubCategory = async () => {
    setPageName(!pageName)
    try {
      let res_subcategory = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubCategoryOption(res_subcategory?.data?.subcategoryprod);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteUnitRate(res?.data?.sunitsrate);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Alert delete popup
  let proid = deleteUnitRate._id;
  const delProcess = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${proid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchUnitRate();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      await axios.post(SERVICE.PRODUCTION_UNITRATE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: String(unitRate.category),
        subcategory: String(unitRate.subcategory),
        project: String(unitRate.project),
        orate: String(unitRate.orate),
        mrate: String(unitRate.mrate),
        points: String(unitRate.points),
        flagcount: String(unitRate.flagcount),
        conversion: String(unitRate.conversion),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchUnitRate();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    addSerialNumber();
  }, [unitRateArray]);

  useEffect(() => {
    fetchUnitRate();
  }, []);

  useEffect(() => {
    fetchCategory();
    fetchSubCategory();
    fetchProject();
  }, [unitRateEdit, isEditOpen, unitRate]);

  const handleChangemrateedit = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setUnitRateEdit({ ...unitRateEdit, mrate: inputValue });
    }
  };

  const handleChangeflagcountedit = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setUnitRateEdit({ ...unitRateEdit, flagcount: inputValue });
    }
  };

  const handleChangemrate = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setUnitRate({ ...unitRate, mrate: inputValue });
    }
  };

  const handleChangeorate = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setUnitRate({ ...unitRate, flagcount: 1, orate: inputValue, mrate: inputValue, points: (inputValue / unitRate.conversion).toFixed(4) });
    }
  };

  const handleChangeconversion = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setUnitRate({ ...unitRate, conversion: inputValue });
    }
  };
  const handleChangepoints = (e) => {
    // Regular expression to match only positive numeric values
    //  const regex = /^[0-9]+(\.[0-9]+)?$/;// Only allows positive integers
    const regex = /^[0-9]+(\.[0-9]{1,4})?$/;
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setUnitRate({ ...unitRate, points: inputValue, orate: inputValue * unitRate.conversion });
    }
  };
  const handleChangeflagcount = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setUnitRate({ ...unitRate, flagcount: inputValue });
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (unitRate.project === "Please Select Project") {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRate.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRate.subcategory === "Please Select Subcategory") {
      setPopupContentMalert("Please Select Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRate.orate === "") {
      setPopupContentMalert("Please Enter O-Rate");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRate.mrate === "") {
      setPopupContentMalert("Please Enter M-Rate");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRate.conversion === "") {
      setPopupContentMalert("Please Enter Conversion");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRate.points === "") {
      setPopupContentMalert("Please Enter Points");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRate.flagcount === "") {
      setPopupContentMalert("Please Enter Flagcount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRate.flagcount == 0) {
      setPopupContentMalert("Please Enter Valid Flagcount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setUnitRate({ ...unitRate, project: "Please Select Project", category: "Please Select Category", subcategory: "Please Select Subcategory", orate: "", mrate: "", conversion: "8.333333333333333", points: "", flagcount: "" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const [isLogOpen, setIsLogOpen] = useState(false);
  //LOg model...
  const handleClickOpenLog = () => {
    setIsLogOpen(true);
  };
  const handleCloseModLog = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsLogOpen(false);
  };

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUnitRateEdit(res?.data?.sunitsrate);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUnitRateEdit(res?.data?.sunitsrate);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUnitRateEdit(res?.data?.sunitsrate);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [lograte, setlograte] = useState([]);

  //get single row to edit....
  const getratelogdata = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setlograte(res?.data?.sunitsrate);
      handleClickOpenLog();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  let updateby = unitRateEdit.updatedby;
  let addedby = unitRateEdit.addedby;
  let taskgroupingId = unitRateEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${taskgroupingId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        mrate: String(unitRateEdit.mrate),
        flagcount: String(unitRateEdit.flagcount),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchUnitRate();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    if (unitRateEdit.project === "Please Select Project") {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRateEdit.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRateEdit.subcategory === "Please Select Subcategory") {
      setPopupContentMalert("Please Select Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitRateEdit.mrate === "Please Enter M-Rate") {
      setPopupContentMalert("Please Select M-Rate");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get all Unit Rate.
  const fetchUnitRate = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.PRODUCTION_UNITRATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let unitsRates = res_freq?.data?.unitsrate;
      let sorted = unitsRates.sort((a, b) => {
        // Names are the same, sort by category alphabetically
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        // Categories are the same, sort by priority alphabetically
        if (a.subcategory < b.subcategory) return -1;
        if (a.subcategory > b.subcategory) return 1;
        return 0;
      });
      setUnitRateArray(sorted);
      setLoader(true);
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const bulkdeletefunction = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${item}`, {
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
      await fetchUnitRate();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Unit Rate.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Unit Rate",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = unitRateArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
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
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
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
      headerName: "Checkbox",
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
      width: 80,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "project",
      headerName: "Project",
      flex: 0,
      width: 150,
      hide: !columnVisibility.project,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 350,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "SubCategory",
      flex: 0,
      width: 390,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "orate",
      headerName: "O-Rate",
      flex: 0,
      width: 90,
      hide: !columnVisibility.orate,
      headerClassName: "bold-header",
    },
    {
      field: "trate",
      headerName: "T-Rate",
      flex: 0,
      width: 90,
      hide: !columnVisibility.trate,
      headerClassName: "bold-header",
    },
    {
      field: "mrate",
      headerName: "M-Rate",
      flex: 0,
      width: 90,
      hide: !columnVisibility.mrate,
      headerClassName: "bold-header",
    },
    {
      field: "conversion",
      headerName: "Conversion",
      flex: 0,
      width: 150,
      hide: !columnVisibility.conversion,
      headerClassName: "bold-header",
    },
    {
      field: "points",
      headerName: "Points",
      flex: 0,
      width: 90,
      hide: !columnVisibility.points,
      headerClassName: "bold-header",
    },
    {
      field: "flagcount",
      headerName: "Flagcount",
      flex: 0,
      width: 100,
      hide: !columnVisibility.flagcount,
      headerClassName: "bold-header",
    },
    {
      field: "flagstatus",
      headerName: "FlagStatus",
      flex: 0,
      width: 100,
      hide: !columnVisibility.flagstatus,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 270,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("iproductionunitrate") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={() => {
                getratelogdata(params.row.id);
              }}
            >
              <ViewHeadlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("eproductionunitrate") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dproductionunitrate") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vproductionunitrate") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}

          {isUserRoleCompare?.includes("iproductionunitrate") && (
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      category: item.category,
      subcategory: item.subcategory,
      project: item.project,
      orate: item.orate,
      mrate: item.mrate,
      trate: item.trate,
      conversion: item.conversion,
      points: Number(item.points).toFixed(4),
      flagcount: item.flagcount,
      flagstatus: item.flagstatus,
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
  // Function to filter columns based on search query
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
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              {" "}
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
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  return (
    <Box>
      <Headtitle title={"PRODUCTION UNIT RATE"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Production Unit Rate"
        modulename="Production"
        submodulename="SetUp"
        mainpagename="Production Unit Rate"
        subpagename=""
        subsubpagename=""
      />

      <Typography sx={userStyle.HeaderText}></Typography>
      <>
        {isUserRoleCompare?.includes("aproductionunitrate") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                    Add Production Unit Rate
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Project<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={projects}
                      placeholder="Please Select Project"
                      value={{ label: unitRate.project, value: unitRate.project }}
                      onChange={(e) => {
                        setUnitRate({
                          ...unitRate,
                          project: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={[...new Set(categoryOption?.filter((u) => u.project === unitRate.project).map((d) => d.name))].map((name) => ({
                        label: name,
                        value: name,
                      }))}
                      placeholder="Please Select Category"
                      value={{ label: unitRate.category, value: unitRate.category }}
                      onChange={(e) => {
                        setUnitRate({
                          ...unitRate,
                          category: e.value,
                          subcategory: "Please Select Subcategory",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={subCategoryOption
                        ?.filter((u) => u.categoryname === unitRate.category)
                        .map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      value={{ label: unitRate.subcategory, value: unitRate.subcategory }}
                      onChange={(e) => {
                        setUnitRate({
                          ...unitRate,
                          subcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12} lg={3}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      O-Rate<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="Number" sx={userStyle.hideArrows} value={unitRate.orate} onChange={handleChangeorate} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12} lg={3}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      M-Rate<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="Number" sx={userStyle.hideArrows} value={unitRate.mrate} onChange={handleChangemrate} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12} lg={3}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Conversion<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="Number" sx={userStyle.hideArrows} value={unitRate.conversion} onChange={handleChangeconversion} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12} lg={3}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Points<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="number" sx={userStyle.hideArrows} value={unitRate.points} onChange={handleChangepoints} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12} lg={3}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      FlagCount<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="Number" sx={userStyle.hideArrows} value={unitRate.flagcount} onChange={handleChangeflagcount} />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <Button variant="contained" onClick={handleSubmit}>
                    {" "}
                    Submit
                  </Button>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br /> <br />
      {/* ****** Table Start ****** */}
      {!loader ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("lproductionunitrate") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Production Unit Rate List</Typography>
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
                      {/* <MenuItem value={unitRateArray?.length}>All</MenuItem> */}
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
                    {isUserRoleCompare?.includes("excelproductionunitrate") && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            fetchUnitRate();
                            setFormat("xl");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvproductionunitrate") && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            fetchUnitRate();
                            setFormat("csv");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileCsv />
                          &ensp;Export to CSV&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printproductionunitrate") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfproductionunitrate") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            fetchUnitRate();
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageproductionunitrate") && (
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
              {isUserRoleCompare?.includes("bdproductionunitrate") && (
                <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                  Bulk Delete
                </Button>
              )}
              <br />
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
                  Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
              {/* ****** Table End ****** */}
            </Box>
          )}
        </>
      )}
      {/* ****** Table End ****** */}
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
      {/* this is info view details */}
      <Dialog open={isLogOpen} onClose={handleCloseModLog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="1600px">
        <Box sx={{ padding: "20px 30px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Unit Rate Log</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Log Details</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Name"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Vendor"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"File From"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"O-Rate"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"T-Rate"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Filename"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"File Date"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Updated Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {lograte?.oratelog?.map((item, i) => {
                        return (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.vendor}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.filefrom}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.orate}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.trate}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.filename}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.dateval}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <DialogActions>
              <Button variant="contained" onClick={handleCloseModLog}>
                Back
              </Button>
            </DialogActions>
          </>
        </Box>
      </Dialog>


      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Unit Rate</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {" "}
                    Project
                  </Typography>
                  <Typography>{unitRateEdit.project}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    Category
                  </Typography>
                  <Typography>{unitRateEdit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    SubCategory
                  </Typography>
                  <Typography>{unitRateEdit.subcategory}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    O-Rate
                  </Typography>
                  <Typography>{unitRateEdit.orate}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {" "}
                    T-Rate
                  </Typography>
                  <Typography>{unitRateEdit.trate}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {" "}
                    M-Rate
                  </Typography>
                  <Typography>{unitRateEdit.mrate}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    Conversion
                  </Typography>
                  <Typography>{unitRateEdit.conversion}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Points
                  </Typography>
                  <Typography>{Number(unitRateEdit.points).toFixed(4)}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Flag count
                  </Typography>
                  <Typography>{unitRateEdit.flagcount}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
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
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Unit Rate</Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Project
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={projects}
                      isDisabled
                      placeholder="Please Select Project"
                      value={{ label: unitRateEdit.project, value: unitRateEdit.project }}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={[...new Set(categoryOption?.filter((u) => u.project === unitRateEdit.project).map((d) => d.name))].map((name) => ({
                        label: name,
                        value: name,
                      }))}
                      isDisabled
                      placeholder="Please Select Category"
                      value={{ label: unitRateEdit.category, value: unitRateEdit.category }}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={subCategoryOption
                        ?.filter((u) => u.category === unitRateEdit.categoryname)
                        .map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      isDisabled
                      placeholder="Please Select Subcategory"
                      value={{ label: unitRateEdit.subcategory, value: unitRateEdit.subcategory }}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} lg={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      O-Rate
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={unitRateEdit.orate}
                      readOnly
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} lg={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      M-Rate
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      value={unitRateEdit.mrate}
                      sx={userStyle.hideArrows}
                      onChange={(e) => handleChangemrateedit(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} lg={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      T-Rate
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={unitRateEdit.trate}
                      readOnly
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} lg={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Conversion
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled
                      value={unitRateEdit.conversion}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} lg={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Points
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled
                      value={unitRateEdit.points}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} lg={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      FlagCount
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={unitRateEdit.flagcount}
                      placeholder="Please Enter Flagcount"
                      onChange={(e) => handleChangeflagcountedit(e)}

                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
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
        filteredDataTwo={filteredData ?? []}
        itemsTwo={unitRateArray ?? []}
        filename={"Production Unit Rate"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Unit Rate Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProcess}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
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
      <br />

    </Box>
  );
}

export default Productionunitrate;