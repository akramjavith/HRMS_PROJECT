import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import * as XLSX from "xlsx";
import { LoadingButton } from "@mui/lab";

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
  TextField,
  Typography,
  InputAdornment,
  Tooltip,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";




function PaidDateFix() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [additionalFilters, setAdditionalFilters] = useState([]);

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [logicOperator, setLogicOperator] = useState("AND");
  const [filterValue, setFilterValue] = useState("");

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")
  const [fileFormat, setFormat] = useState('')
  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // // page refersh reload
  // const handleCloseFilterMod = () => {
  //   setIsFilterOpen(false);
  // };
  // const handleClosePdfFilterMod = () => {
  //   setIsPdfFilterOpen(false);
  // };


  const [exportLoading, setExportLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
    // setloadingdeloverall(false);
    setExportLoading(false)
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
    setExportLoading(false)
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

  useEffect(() => {

    getapi();

  }, []);
  const gridRefTable = useRef(null);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Paid Date Fix"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });

  }
  let exportColumnNames = ["Department", "Month", "Year", "Date", "Paymode", "After Expiry"];
  let exportRowValues = ["department", "month", "year", "date", "paymode", "afterexpiry"];
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  //get current month
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  const ans = new Date().getMonth();
  //get current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYear - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });
  const xeroxyears = Array.from(
    new Array(10),
    (val, index) => Number(Number(currentYear) + 1) - index
  );
  const xeroxgetyear = xeroxyears.map((year) => {
    return { value: year, label: year };
  });
  //get all months
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const xeroxmonths = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const check = months.find((item) => item.value === ans + 1);
  const [paiddatefix, setPaiddatefix] = useState({
    department: "Please Select Department",
    month: check.label,
    year: year,
    date: formattedDate,
    paymode: "Please Select Paymode",
  });
  const [paiddatefixEdit, setPaiddatefixEdit] = useState({
    department: "Please Select Department",
    month: "",
    year: "",
    date: formattedDate,
    paymode: "Please Select Paymode",
  });
  const [isXerox, setIsXerox] = useState({
    year: "Select Year",
    month: "Select Month",
    monthvalue: "",
    department: "Please Select Department",
    paymode: "",
  });
  const [isXeroxLoad, setIsXeroxLoad] = useState(false);
  const [paiddatefixs, setPaiddatefixs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPaiddatefixedit, setAllPaiddatefixedit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [paiddatefixCheck, setPaiddatefixcheck] = useState(false);
  const username = isUserRoleAccess.username;
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [departments, setDepartments] = useState([]);
  const [paymodes, setPaymodes] = useState([]);
  const [departmentsEdit, setDepartmentsEdit] = useState([]);
  const [paymodesEdit, setPaymodesEdit] = useState([]);
  // Multi Select Create
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");
  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };
  const customValueRendererCate = (valueCate, _department) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };
  // Edit functionlity
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  const handleCategoryChangeEdit = (options) => {
    setSelectedOptionsCateEdit(options);
  };
  const customValueRendererCateEdit = (valueCateEdit, _department) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };
  //xerox filter
  const [selectedOptionsPaymode, setSelectedOptionsPaymode] = useState([]);
  const [isPaymode, setIsPaymode] = useState([]);
  const handlePaymodeChange = (options) => {
    setIsPaymode(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsPaymode(options);
  };

  //get all Areas.
  const fetchDepartmentDropdown = async () => {
    try {
      let res_dept = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const deptall = [
        ...res_dept?.data?.departmentdetails.map((d) => ({
          ...d,
          label: d.deptname,
          value: d.deptname,
        })),
      ];
      setDepartments(deptall);
      setDepartmentsEdit(deptall);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //get all Areas.
  const fetchPaymodeDropdown = async () => {
    try {
      let res_pay = await axios.get(SERVICE.PAIDSTATUSFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let resdata = res_pay?.data?.paidstatusfixs.filter((data, index) => {
        return (
          data?.frequency?.toLowerCase() !== "hold" &&
          data?.frequency?.toLowerCase() !== "reject"
        );
      });
      const paymodeall = [
        ...resdata.map((d) => ({
          ...d,
          label: d.frequency,
          value: d.frequency,
        })),
      ];
      const ans = paymodeall.map((data) => data.value);
      const totAns = ans?.length > 0 && [...new Set(ans)];
      setPaymodes(
        totAns?.length > 0
          ? totAns?.map((d) => ({
            ...d,
            label: d,
            value: d,
          }))
          : []
      );
      setPaymodesEdit(
        totAns?.length > 0
          ? totAns?.map((d) => ({
            ...d,
            label: d,
            value: d,
          }))
          : []
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //image
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Paid Date Fix.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
    setIsHandleChange(true);
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
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
    department: true,
    month: true,
    year: true,
    date: true,
    paymode: true,
    actions: true,
    afterexpiry: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [deletePaiddate, setDeletePaiddate] = useState("");
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.PAIDDATEFIX_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletePaiddate(res?.data?.spaiddatefix);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Alert delete popup
  let Paiddatesid = deletePaiddate?._id;
  const delPaiddate = async (e) => {
    try {
      if (Paiddatesid) {
        await axios.delete(`${SERVICE.PAIDDATEFIX_SINGLE}/${Paiddatesid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchEmployee();
        // await fetchPaiddatefix();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const delPaiddatecheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PAIDDATEFIX_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchEmployee();
      // await fetchPaiddatefix();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //add function
  const sendRequest = async () => {
    try {
      let subprojectscreate = await axios.post(SERVICE.PAIDDATEFIX_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: [...valueCate],
        month: String(paiddatefix.month),
        year: String(paiddatefix.year),
        date: String(paiddatefix.date),
        paymode: String(paiddatefix.paymode),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();
      // await fetchPaiddatefix();
      setPaiddatefix({
        ...paiddatefix,
        department: "Please Select Department",
        month: check.label,
        year: year,
        date: formattedDate,
      });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let departments = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = paiddatefixsarrayDup.some(
      (item) =>
        item.month === paiddatefix.month &&
        item.year == paiddatefix.year &&
        item.paymode === paiddatefix.paymode &&
        item.department.some((data) => departments.includes(data))
    );
    if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paiddatefix.paymode === "Please Select Paymode") {
      setPopupContentMalert("Please Select Paymode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paiddatefix.date == "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSearchQuery("");
      sendRequest();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setPaiddatefix({
      department: "Please Select Department",
      month: check.label,
      year: year,
      date: formattedDate,
      paymode: "Please Select Paymode",
    });
    setSelectedOptionsCate([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
    setSearchQuery("");
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
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.PAIDDATEFIX_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaiddatefixEdit(res?.data?.spaiddatefix);
      setSelectedOptionsCateEdit(
        res?.data?.spaiddatefix.department.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PAIDDATEFIX_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaiddatefixEdit(res?.data?.spaiddatefix);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PAIDDATEFIX_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaiddatefixEdit(res?.data?.spaiddatefix);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //Project updateby edit page...
  let updateby = paiddatefixEdit?.updatedby;
  let addedby = paiddatefixEdit?.addedby;
  let subprojectsid = paiddatefixEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    let empCate = selectedOptionsCateEdit.map((item) => item.value);
    try {
      let res = await axios.put(
        `${SERVICE.PAIDDATEFIX_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: [...empCate],
          month: String(paiddatefixEdit.month),
          year: String(paiddatefixEdit.year),
          date: String(paiddatefixEdit.date),
          paymode: String(paiddatefixEdit.paymode),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchEmployee();
      //  fetchPaiddatefix();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const editSubmit = async (e) => {
    e.preventDefault();
    await fetchPaiddatefixAll();
    let departmentsEditt = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = allPaiddatefixedit.some(
      (item) =>
        item.month === paiddatefixEdit.month &&
        item.year == paiddatefixEdit.year &&
        item.paymode === paiddatefixEdit.paymode &&
        item.department.some((data) => departmentsEditt.includes(data))
    );
    if (selectedOptionsCateEdit.length == 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paiddatefixEdit.paymode === "Please Select Paymode") {
      setPopupContentMalert("Please Select Paymode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paiddatefixEdit.date == "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  const [paiddatefixsarrayDup, setPaiddatefixsarrayDup] = useState([])
  //get all Sub vendormasters.
  const fetchPaiddatefix = async () => {
    try {
      setPaiddatefixcheck(true)
      let res_vendor = await axios.get(SERVICE.PAIDDATEFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaiddatefixsarrayDup(res_vendor?.data?.paiddatefixs);
      setPaiddatefixcheck(false);
    } catch (err) { setPaiddatefixcheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const [paiddatefixsFilterArray, setPaiddatefixsFilterArray] = useState([])
  //get all Sub vendormasters.
  const fetchPaiddatefixArray = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.PAIDDATEFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaiddatefixsFilterArray(res_vendor?.data?.paiddatefixs.map((t, index) => ({
        ...t,
        Sno: index + 1,
        Departments: t.department?.toString(),
        Month: t.month,
        Year: t.year,
        Dates: moment(t.date).format("DD-MM-YYYY"),
        Paymode: t.paymode,
      })));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchPaiddatefixArray()
  }, [isFilterOpen])
  const [overallFilterdata, setOverallFilterdata] = useState([]);
  // const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [paidDateCount, setPaidDateCount] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [totalDatas, setTotalDatas] = useState(0)

  const fetchEmployee = async () => {

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery
    };


    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }


    try {
      setPaiddatefixcheck(true);
      let res_employee = await axios.post(SERVICE.PAIDDATEFIX_SORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });
      let subcates = res_employee?.data?.result.map((d, index) => ({
        ...d,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      let subcatescount = res_employee?.data?.totalCount;

      setPaidDateCount(subcatescount);
      // setOverallItems(res_employee?.data?.overallitems.map((item, index) => {
      //   return {
      //     ...item, date: moment(item.date).format("DD-MM-YYYY"), serialNumber: index + 1
      //   }
      // }))
      setTotalDatas(res_employee?.data?.totalDatas)
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + 3 - 1, totalPages);
      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }
      setPageNumbers(newPageNumbers);
      let mappedDatas = subcates?.map((item, index) => {
        return {
          ...item,
          date: moment(item.date).format("DD-MM-YYYY"),

        }
      })
      setPaiddatefixs(mappedDatas)

      setOverallFilterdata(mappedDatas);
      setPaiddatefixcheck(false);
    } catch (err) {
      setPaiddatefixcheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
  };

  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

  const handleAddFilter = () => {
    if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
      setAdditionalFilters([
        ...additionalFilters,
        { column: selectedColumn, condition: selectedCondition, value: filterValue }
      ]);
      setSelectedColumn("");
      setSelectedCondition("Contains");
      setFilterValue("");
    }
  };



  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };

  const handleResetSearch = async () => {

    setPaiddatefixcheck(true);
    // Reset all filters and pagination state
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }

    try {
      let res_employee = await axios.post(SERVICE.PAIDDATEFIX_SORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let subcates = res_employee?.data?.result.map((d, index) => ({
        ...d,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      let subcatescount = res_employee?.data?.totalCount;

      setPaidDateCount(subcatescount);
      // setOverallItems(res_employee?.data?.overallitems.map((item, index) => {
      //   return {
      //     ...item, date: moment(item.date).format("DD-MM-YYYY"), serialNumber: index + 1
      //   }
      // }))
      setTotalDatas(res_employee?.data?.totalDatas)
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + 3 - 1, totalPages);
      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }
      setPageNumbers(newPageNumbers);
      let mappedDatas = subcates?.map((item, index) => {
        return {
          ...item,
          date: moment(item.date).format("DD-MM-YYYY"),

        }
      })
      setPaiddatefixs(mappedDatas)
      setItems(mappedDatas)

      setOverallFilterdata(mappedDatas);
      setPaiddatefixcheck(false);
    } catch (err) {
      setPaiddatefixcheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchEmployeeUpdate = async () => {
    try {

      let res_employee = await axios.post(SERVICE.PAIDDATEFIX_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery
      });

      let subcates = res_employee?.data?.result.map((d, index) => ({
        ...d,
        serialNumber: (page - 1) * pageSize + index + 1,


      }));
      let subcatescount = res_employee?.data?.totalCount;
      // setOverallItems(res_employee?.data?.overallitems.map((item) => {
      //   return {
      //     ...item, date: moment(item.date).format("DD-MM-YYYY")
      //   }
      // }))
      setTotalDatas(res_employee?.data?.totalDatas)
      setPaidDateCount(subcatescount);
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + 3 - 1, totalPages);
      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }
      setPageNumbers(newPageNumbers);
      setPaiddatefixs(subcates?.map((item) => {
        return {
          ...item, date: moment(item.date).format("DD-MM-YYYY")
        }
      }))

      setOverallFilterdata(subcates?.map((item) => {
        return {
          ...item, date: moment(item.date).format("DD-MM-YYYY")
        }
      }));

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };




  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery]);

  //get all Sub vendormasters.
  const fetchPaiddatefixAll = async () => {
    try {
      let res_meet = await axios.get(SERVICE.PAIDDATEFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllPaiddatefixedit(
        res_meet?.data?.paiddatefixs.filter(
          (item) => item._id !== paiddatefixEdit._id
        )
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Paid Date Fix",
    pageStyle: "print",
  });
  useEffect(() => {
    fetchDepartmentDropdown();
    fetchPaymodeDropdown();
  }, []);
  useEffect(() => {
    fetchEmployee();
    fetchPaiddatefix();
    fetchPaiddatefixAll();
  }, []);
  useEffect(() => {
    fetchPaiddatefixAll();
  }, [isEditOpen, paiddatefixEdit]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const [items, setItems] = useState([]);
  const addSerialNumber = (datas) => {

    let filteredDatas = datas?.map((item) => {
      return {
        ...item, department: item?.department?.join(",").toString(),
      }
    })
    setFilteredDatas(filteredDatas)
    setItems(filteredDatas);
  };
  useEffect(() => {
    addSerialNumber(paiddatefixs);
  }, [paiddatefixs]);
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
    // setFilterValue(event.target.value);
    // setPage(1);
  };

  // Split the search query into individual terms
  // const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  // const filteredDatas = paiddatefixs?.filter((item) => {
  //   return searchTerms.every((term) =>
  //     Object.values(item).join(" ").toLowerCase().includes(term)
  //   );
  // });
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const currentDate = new Date();

  // Set the current date to midnight to only compare dates
  currentDate.setHours(0, 0, 0, 0);


  const handleExpiryChange = async (e, params) => {

    let value = e.target.value;

    try {

      try {
        let res = await axios.post(SERVICE.PAIDDATEFIX_UPDATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          id: params.data.id,
          afterexpiry: String(value),
          name: String(isUserRoleAccess.companyname),
          date: String(new Date()),

        });

      } catch (err) {
        console.log(err, 'err')
      }
      await fetchEmployeeUpdate();
    } catch (error) {
      // Handle error if necessary
      console.error('Error updating expiry:', error);
    }
  };


  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
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
      pinned: 'left',
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 160,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "month",
      headerName: "Month",
      flex: 0,
      width: 130,
      hide: !columnVisibility.month,
      headerClassName: "bold-header",
    },
    {
      field: "year",
      headerName: "Year",
      flex: 0,
      width: 130,
      hide: !columnVisibility.year,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 130,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "paymode",
      headerName: "Paymode",
      flex: 0,
      width: 130,

      hide: !columnVisibility.paymode,
      headerClassName: "bold-header",
    },
    {
      field: "afterexpiry",
      headerName: "After Expiry",
      flex: 0,

      width: 230,
      hide: !columnVisibility.afterexpiry,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <>
          {new Date(params.data.dateold) < currentDate && (
            <Select
              onChange={(e) => handleExpiryChange(e, params)}
              sx={{ minWidth: "120px" }}
              value={params.data.afterexpiry}>
              <MenuItem value={"Enable"}>Enable</MenuItem>
              <MenuItem value={"Disable"}>Disable</MenuItem>

            </Select >

          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <>
          {new Date(params.data.dateold) >= currentDate && (
            <Grid sx={{ display: "flex" }}>

              {isUserRoleCompare?.includes("epaiddatefix") && (
                <Button
                  sx={userStyle.buttonedit}
                  onClick={() => {
                    getCode(params.data.id, params.data.name);
                  }}
                >
                  <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                </Button>
              )}
              {isUserRoleCompare?.includes("dpaiddatefix") && (
                <Button
                  sx={userStyle.buttondelete}
                  onClick={(e) => {
                    rowData(params.data.id, params.data.name);
                  }}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                </Button>
              )}
              {isUserRoleCompare?.includes("vpaiddatefix") && (
                <Button
                  sx={userStyle.buttonedit}
                  onClick={() => {
                    getviewCode(params.data.id);
                  }}
                >
                  <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                </Button>
              )}
              {isUserRoleCompare?.includes("ipaiddatefix") && (
                <Button
                  sx={userStyle.buttonedit}
                  onClick={() => {
                    getinfoCode(params.data.id);
                  }}
                >
                  <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                </Button>
              )}
            </Grid>

          )}
        </>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

  const rowDataTable = items.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      department: item.department,
      month: item.month,
      year: item.year,
      date: item.date,
      dateold: item.date,
      paymode: item.paymode,
      afterexpiry: item.afterexpiry,
      afterexpirymodes: ["Enable", 'Disable']
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
              // secondary={column.headerName }
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



  const handleExportXL = async (isfilter) => {
    try {

      if (isfilter === "filtered") {
        // Define headers
        let headers = ["Department",
          "Month",
          "Year",
          "Date",
          "Paymode",
          "After Expiry"];

        // Transform data
        const excelData = paiddatefixs.map((entry) => [
          entry.department,
          entry.month,
          entry.year,
          entry.date,
          entry.paymode,
          entry.afterexpiry,
        ]);

        // Combine headers and data
        const finalData = [headers, ...excelData];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(finalData);

        // Create workbook and export
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Save file
        XLSX.writeFile(wb, "Paiddatefix.xlsx");
        setIsFilterOpen(false);
      } else if (isfilter === "overall") {
        let result = [];
        setExportLoading(true);

        let response = await axios.get(SERVICE.PAID_DATE_FIX_EXCELDOWNLOAD, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          responseType: "blob", // Move this inside the same object
        });
        console.log(response, "response");
        // Create a Blob from the response
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Paiddatefix.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Assuming response.data is the binary data for the Excel file

        setExportLoading(false);
        setIsFilterOpen(false);
      }
    } catch (err) {

      setExportLoading(false)
    }
  };

  const downloadCSV = async (isfilter) => {
    try {
      if (isfilter === "filtered") {
        let headers = ["Department",
          "Month",
          "Year",
          "Date",
          "Paymode",
          "After Expiry"];

        // Transform data
        const excelData = paiddatefixs.map((entry) => [
          entry.department,
          entry.month,
          entry.year,
          entry.date,
          entry.paymode,
          entry.afterexpiry,
        ]);
        // Combine headers and data
        const finalData = [headers, ...excelData];
        // Convert to CSV
        const ws = XLSX.utils.aoa_to_sheet(finalData);
        const csvOutput = XLSX.utils.sheet_to_csv(ws);

        // Trigger CSV file download in browser
        const blob = new Blob([csvOutput], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Paiddatefix.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (isfilter === "overall") {
        let result = [];
        setExportLoading(true);

        try {
          let response = await axios.get(SERVICE.PAID_DATE_FIX_CSVDOWNLOAD, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            responseType: "blob", // Move this inside the same object
          })
          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");

          a.href = url;
          a.download = "Paiddatefix.csv"; // File name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url); // Clean up
          setExportLoading(false);
          setIsFilterOpen(false);
        } catch (error) {
          console.error("Error downloading CSV:", error);
        }
      }
    } catch (err) {
      setExportLoading(false)
    }
  };

  const downloadPdf = async (isfilter) => {
    try {
      if (isfilter === "filtered") {
        try {
          let headers = ["Department",
            "Month",
            "Year",
            "Date",
            "Paymode",
            "After Expiry"];

          // Transform data
          const excelData = paiddatefixs.map((entry) => [
            entry.department,
            entry.month,
            entry.year,
            entry.date,
            entry.paymode,
            entry.afterexpiry ?? "",
          ]);


          // Combine headers and data
          const tableData = [headers, ...excelData];

          // const docDefinition = {
          //   pageSize: "A4",
          //   pageOrientation: "potrait", // Landscape mode
          //   content: [
          //     { text: "paiddatefix", style: "header", alignment: "center" },
          //     { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "right" },
          //     "\n",
          //     {
          //       table: {
          //         headerRows: 1,
          //         widths: ["auto", "auto", "auto",
          //           "auto", "auto", "auto"],
          //         body: tableData,
          //       },
          //       layout: "lightHorizontalLines", // Table styling
          //     },
          //   ],
          //   styles: {
          //     header: { fontSize: 14, bold: true },
          //     subheader: { fontSize: 10, italics: true },
          //   },
          //   defaultStyle: { fontSize: 8 }, // Reduce font size
          // };


          const docDefinition = {
            pageSize: "A4",
            pageOrientation: "landscape", // Landscape mode
            pageMargins: [20, 20, 20, 20], // Adjust margins
            content: [
              { text: "paiddatefix", style: "header", alignment: "center" },
              { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "right" },
              "\n",
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "*", "*", "*", "*", "*"], // Auto-expand columns
                  body: tableData,
                },
                layout: "lightHorizontalLines", // Table styling
              },
            ],
            styles: {
              header: { fontSize: 16, bold: true },
              subheader: { fontSize: 10, italics: true },
            },
            defaultStyle: { fontSize: 10 }, // Adjust default font size
          };

          pdfMake.createPdf(docDefinition).download("Paiddatefix.pdf");



          // pdfMake.createPdf(docDefinition).download("Paiddatefix.pdf"); // Trigger downloa
          setIsPdfFilterOpen(false);
        } catch (err) {
          console.log(err);
        }
      } else if (isfilter === "overall") {
        setExportLoading(true);
        let response = await axios.get(SERVICE.PAID_DATE_FIX_PDFDOWNLOAD, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          responseType: "blob", // Move this inside the same object
        });
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Paiddatefix.pdf";
        link.click();
        URL.revokeObjectURL(link.href);
        setExportLoading(false);
        setIsFilterOpen(false);
      }
    } catch (err) {
      console.log(err, "errpdf")
      setExportLoading(false)
    }
  };



  return (
    <Box>
      <Headtitle title={"Paid Date Fix"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Paid Date Fix"
        modulename="PayRoll"
        submodulename="PayRoll Setup"
        mainpagename="Paid Date Fix"
        subpagename=""
        subsubpagename=""
      />

      {isUserRoleCompare?.includes("apaiddatefix") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Paid Date Fix
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={departments}
                      value={selectedOptionsCate}
                      onChange={handleCategoryChange}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Area"
                    // className="scrollable-multiselect"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Typography>Month</Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={200}
                      value={{
                        label: paiddatefix.month,
                        value: paiddatefix.month,
                      }}
                      onChange={(e) => {
                        setPaiddatefix({ ...paiddatefix, month: e.label });
                      }}
                      options={months}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Typography>Year</Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={200}
                      value={{
                        label: paiddatefix.year,
                        value: paiddatefix.year,
                      }}
                      onChange={(e) => {
                        setPaiddatefix({ ...paiddatefix, year: e.value });
                      }}
                      options={getyear}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Date <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={paiddatefix.date}
                      onChange={(e) => {
                        setPaiddatefix({
                          ...paiddatefix,
                          date: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Typography>
                    Pay Mode <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={paymodes}
                      maxMenuHeight={200}
                      value={{
                        label: paiddatefix.paymode,
                        value: paiddatefix.paymode,
                      }}
                      onChange={(e) => {
                        setPaiddatefix({ ...paiddatefix, paymode: e.label });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12} mt={3}>
                  <div style={{ display: 'flex', gap: '20px' }}>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Submit
                    </Button>


                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      Clear
                    </Button>

                  </div>
                </Grid>
              </Grid>

            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Paid Date Fix
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Department<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={departmentsEdit}
                        value={selectedOptionsCateEdit}
                        onChange={handleCategoryChangeEdit}
                        valueRenderer={customValueRendererCateEdit}
                        labelledBy="Please Select Department"
                      // className="scrollable-multiselect"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Typography>Month</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={200}
                        value={{
                          label: paiddatefixEdit.month,
                          value: paiddatefixEdit.month,
                        }}
                        onChange={(e) => {
                          setPaiddatefixEdit({
                            ...paiddatefixEdit,
                            month: e.label,
                          });
                        }}
                        options={months}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Typography>Year</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={200}
                        value={{
                          label: paiddatefixEdit.year,
                          value: paiddatefixEdit.year,
                        }}
                        onChange={(e) => {
                          setPaiddatefixEdit({
                            ...paiddatefixEdit,
                            year: e.value,
                          });
                        }}
                        options={getyear}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Date </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={paiddatefixEdit.date}
                        onChange={(e) => {
                          setPaiddatefixEdit({
                            ...paiddatefixEdit,
                            date: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Typography>
                      Pay Mode <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        options={paymodesEdit}
                        maxMenuHeight={200}
                        value={{
                          label: paiddatefixEdit.paymode,
                          value: paiddatefixEdit.paymode,
                        }}
                        onChange={(e) => {
                          setPaiddatefixEdit({
                            ...paiddatefixEdit,
                            paymode: e.label,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lpaiddatefix") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Paid Date Fix List
              </Typography>
            </Grid>
            <br />
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
                    <MenuItem value={paiddatefixs?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelpaiddatefix") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchPaiddatefixArray()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvpaiddatefix") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchPaiddatefixArray()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printpaiddatefix") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfpaiddatefix") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchPaiddatefixArray()
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagepaiddatefix") && (
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
              <Grid item md={2} xs={6} sm={6}>
                {/* <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={paiddatefixs} setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={true}
                  totalDatas={overallItems}
                /> */}
                <FormControl fullWidth size="small">
                  <OutlinedInput size="small"
                    id="outlined-adornment-weight"
                    startAdornment={
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        {advancedFilter && (
                          <IconButton onClick={handleResetSearch}>
                            <MdClose />
                          </IconButton>
                        )}
                        <Tooltip title="Show search options">
                          <span>
                            <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                          </span>
                        </Tooltip>
                      </InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{ 'aria-label': 'weight', }}
                    type="text"
                    value={getSearchDisplay()}
                    onChange={handleSearchChange}
                    placeholder="Type to search..."
                    disabled={!!advancedFilter}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdpaiddatefix") && (

              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
                sx={buttonStyles.buttonbulkdelete}
              >
                Bulk Delete
              </Button>
            )}

            <br />
            <br />
            {paiddatefixCheck ? (
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
                <AggridTableForPaginationTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  totalDatas={paidDateCount}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={paiddatefixs}
                />

                {/* <AggridTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRef}
                  paginated={true}
                  filteredDatas={filteredDatas}
                  totalDatas={paidDateCount}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}
                /> */}
              </>
            )}
          </Box>
          <Popover
            id={idSearch}
            open={openSearch}
            anchorEl={anchorElSearch}
            onClose={handleCloseSearch}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
          >
            <Box style={{ padding: "10px", maxWidth: '450px' }}>
              <Typography variant="h6">Advance Search</Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseSearch}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent sx={{ width: "100%" }}>
                <Box sx={{
                  width: '350px',
                  maxHeight: '400px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Box sx={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    // paddingRight: '5px'
                  }}>
                    <Grid container spacing={1}>
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography>Columns</Typography>
                        <Select fullWidth size="small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: "auto",
                              },
                            },
                          }}
                          style={{ minWidth: 150 }}
                          value={selectedColumn}
                          onChange={(e) => setSelectedColumn(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>Select Column</MenuItem>
                          {filteredSelectedColumn.map((col) => (
                            <MenuItem key={col.field} value={col.field}>
                              {col.headerName}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography>Operator</Typography>
                        <Select fullWidth size="small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: "auto",
                              },
                            },
                          }}
                          style={{ minWidth: 150 }}
                          value={selectedCondition}
                          onChange={(e) => setSelectedCondition(e.target.value)}
                          disabled={!selectedColumn}
                        >
                          {conditions.map((condition) => (
                            <MenuItem key={condition} value={condition}>
                              {condition}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography>Value</Typography>
                        <TextField fullWidth size="small"
                          value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                          placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                          sx={{
                            '& .MuiOutlinedInput-root.Mui-disabled': {
                              backgroundColor: 'rgb(0 0 0 / 26%)',
                            },
                            '& .MuiOutlinedInput-input.Mui-disabled': {
                              cursor: 'not-allowed',
                            },
                          }}
                        />
                      </Grid>
                      {additionalFilters.length > 0 && (
                        <>
                          <Grid item md={12} sm={12} xs={12}>
                            <RadioGroup
                              row
                              value={logicOperator}
                              onChange={(e) => setLogicOperator(e.target.value)}
                            >
                              <FormControlLabel value="AND" control={<Radio />} label="AND" />
                              <FormControlLabel value="OR" control={<Radio />} label="OR" />
                            </RadioGroup>
                          </Grid>
                        </>
                      )}
                      {additionalFilters.length === 0 && (
                        <Grid item md={4} sm={12} xs={12} >
                          <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                            Add Filter
                          </Button>
                        </Grid>
                      )}

                      <Grid item md={2} sm={12} xs={12}>
                        <Button variant="contained" onClick={() => {
                          fetchEmployee();
                          setIsSearchActive(true);
                          setAdvancedFilter([
                            ...additionalFilters,
                            { column: selectedColumn, condition: selectedCondition, value: filterValue }
                          ])
                        }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                          Search
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </DialogContent>
            </Box>
          </Popover>
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
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "auto", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Paid Date Fix
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Department</Typography>
                  <Typography>{paiddatefixEdit.department + ","}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Month</Typography>
                  <Typography>{paiddatefixEdit.month}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Year</Typography>
                  <Typography>{paiddatefixEdit.year}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(paiddatefixEdit.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paymode</Typography>
                  <Typography>{paiddatefixEdit.paymode}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
                sx={buttonStyles.btncancel}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
        // isFilterOpen={isFilterOpen}
        // handleCloseFilterMod={handleCloseFilterMod}
        // fileFormat={fileFormat}
        // setIsFilterOpen={setIsFilterOpen}
        // isPdfFilterOpen={isPdfFilterOpen}
        // setIsPdfFilterOpen={setIsPdfFilterOpen}
        // handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={overallItems ?? []}
        filename={"Paid Date Fix"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Paid Date Fix Info"
        addedby={addedby}
        updateby={updateby}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delPaiddate}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delPaiddatecheckbox}
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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} /> : <FaFileCsv style={{ fontSize: "80px", color: "green" }} />}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              fileFormat === "xl" ? handleExportXL("filtered") : downloadCSV("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <LoadingButton
            autoFocus
            loading={exportLoading}
            variant="contained"
            onClick={(e) => {
              fileFormat === "xl" ? handleExportXL("overall") : downloadCSV("overall");
            }}
          >
            Export Over All Data
          </LoadingButton>
        </DialogActions>
      </Dialog>

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
              downloadPdf("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <LoadingButton
            variant="contained"
            loading={exportLoading}
            onClick={(e) => {
              downloadPdf("overall");
            }}
          >
            Export Over All Data
          </LoadingButton>
        </DialogActions>
      </Dialog>


    </Box>




  );
}
export default PaidDateFix;