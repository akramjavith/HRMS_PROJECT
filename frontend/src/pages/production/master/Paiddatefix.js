import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import "jspdf-autotable";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../../components/Pagination.js';
import AlertDialog from "../../../components/Alert.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";




function PaidDateFix() {
  const [fileFormat, setFormat] = useState('')
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
  let exportColumnNames = ["Department", "Month", "Year", "Date", "Paymode", "After Expiry"];
  let exportRowValues = ["Departments", "month", "year", "Dates", "paymode", "afterexpiry"];
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
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
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
  const handleXerox = async () => {
    if (isXerox.year === "Select Year") {
      setPopupContentMalert("Please Select Year");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isXerox.month === "Select Month") {
      setPopupContentMalert("Please Select Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isXerox.department === "Please Select Department") {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsPaymode.length === 0) {
      setPopupContentMalert("Please Select PayMode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      let res_status = await axios.post(SERVICE.XEROXMONTHYEARPAIDMODE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: [isXerox.department],
        paymode: isPaymode,
      });
      const resdata = res_status?.data.paiddatemodes;
      if (resdata.length > 0) {
        setIsXeroxLoad(true);
        await resdata.forEach((data, index) => {
          //date condition
          const resdate = Number(isXerox.monthvalue) + 1;
          const finaldate = resdate >= 10 ? resdate : "0" + resdate;
          const changeddate =
            data.type == "Next Month" && isXerox.month == "December"
              ? Number(isXerox.year) + 1 + "-" + "01" + "-" + data.date
              : data.type == "Next Month"
                ? isXerox.year + "-" + finaldate + "-" + data.date
                : isXerox.year + "-" + isXerox.monthvalue + "-" + data.date;
          //duplictae check
          const isNameMatch = paiddatefixs.some(
            (item) =>
              item.month === isXerox.month &&
              item.year == isXerox.year &&
              item.paymode === data.paymode &&
              item.department.some((data) => data === isXerox.department)
          );
          if (isNameMatch) {
            setIsXeroxLoad(false);
            setPopupContentMalert("Data Already Added!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          } else {
            let subprojectscreate = axios.post(SERVICE.PAIDDATEFIX_CREATE, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: [isXerox.department],
              month: String(isXerox.month),
              year: String(isXerox.year),
              date: String(changeddate),
              paymode: String(data.paymode),
              addedby: [
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            });
            fetchEmployee();
            fetchPaiddatefix();
          }
        });
        setPopupContent("Generated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setIsXerox({
          year: "Select Year",
          month: "Select Month",
          monthvalue: "",
          department: "Please Select Department",
        });
        setSelectedOptionsPaymode([]);
        setIsPaymode([]);
        setIsXeroxLoad(false);
      } else {
        setPopupContentMalert("There is no data!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const handleclearXerox = () => {
    setIsXeroxLoad(false);
    setIsXerox({
      year: "Select Year",
      month: "Select Month",
      monthvalue: "",
      department: "Please Select Department",
      paymode: "",
    });
    setSelectedOptionsPaymode([]);
    setIsPaymode([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Paid Date Fix.png");
        });
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
        await fetchPaiddatefix();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchEmployee();
      await fetchPaiddatefix();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      await fetchPaiddatefix();
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      await fetchEmployee(); fetchPaiddatefix();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchPaiddatefixAll();
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
    } catch (err) { setPaiddatefixcheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

  const fetchEmployee = async () => {
    try {
      setPaiddatefixcheck(true);
      let res_employee = await axios.post(SERVICE.PAIDDATEFIX_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery
      });
      // const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      // const itemsWithSerialNumber = ans?.map((item, index) => ({
      //   ...item,
      //   serialNumber: (page - 1) * pageSize + index + 1,
      //   Departments: item.department?.toString(),
      //   Dates: moment(item.date).format("DD-MM-YYYY"),
      // }));
      // // setAcpointCalculation(res_vendor?.data?.acpointcalculation);

      // setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      // setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      // setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      // setPage((data) => { return ans?.length > 0 ? data : 1 });
      let subcates = res_employee?.data?.result.map((d, index) => ({
        ...d,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      let subcatescount = res_employee?.data?.totalCount;
      setPaidDateCount(subcatescount);
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + 3 - 1, totalPages);
      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }
      setPageNumbers(newPageNumbers);
      setPaiddatefixs(subcates)
      setOverallFilterdata(subcates);
      setPaiddatefixcheck(false);
    } catch (err) { setPaiddatefixcheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      setPaidDateCount(subcatescount);
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + 3 - 1, totalPages);
      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }
      setPageNumbers(newPageNumbers);
      setPaiddatefixs(subcates)
      setOverallFilterdata(subcates);

    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
  const addSerialNumber = () => {
    // const itemsWithSerialNumber = paiddatefixs?.map((item, index) => ({
    //   ...item,
    //   serialNumber: index + 1,
    // }));
    const itemsWithSerialNumber = paiddatefixs
    // setItems(itemsWithSerialNumber);
    setFilteredDatas(itemsWithSerialNumber)
  };
  useEffect(() => {
    addSerialNumber();
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

  // const handleExpiryChange = (e, params) => {
  //   console.log(e, params, 'sdfsd');
  //   let value = e.target.value
  //   let res = await axios.put(`${SERVICE.PAIDDATEFIX_SINGLE}/${params.row.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${auth.APIToken}`,
  //     },
  //     afterexpiry: String(value),
  //     updatedby: [
  //       ...updateby,
  //       {
  //         name: String(isUserRoleAccess.companyname),
  //         date: String(new Date()),
  //       },
  //     ],
  //   })

  // }
  const handleExpiryChange = async (e, params) => {
    // console.log(e, params, 'sdfsd');
    let value = e.target.value;

    try {

      try {
        let res = await axios.post(SERVICE.PAIDDATEFIX_UPDATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          id: params.row.id,
          afterexpiry: String(value),
          name: String(isUserRoleAccess.companyname),
          date: String(new Date()),

        });
        console.log(res.status, 'ksdf');
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
              updatedSelectedRows.length === filteredDatas.length
            );
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
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 160,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
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
      renderCell: (params) => (
        <>
          {new Date(params.row.dateold) < currentDate && (
            <Select
              onChange={(e) => handleExpiryChange(e, params)}
              sx={{ minWidth: "120px" }}
              value={params.row.afterexpiry}>
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
      renderCell: (params) => (
        <>
          {new Date(params.row.dateold) >= currentDate && (
            <Grid sx={{ display: "flex" }}>

              {isUserRoleCompare?.includes("epaiddatefix") && (
                <Button
                  sx={userStyle.buttonedit}
                  onClick={() => {
                    getCode(params.row.id, params.row.name);
                  }}
                >
                  <EditOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}
              {isUserRoleCompare?.includes("dpaiddatefix") && (
                <Button
                  sx={userStyle.buttondelete}
                  onClick={(e) => {
                    rowData(params.row.id, params.row.name);
                  }}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}
              {isUserRoleCompare?.includes("vpaiddatefix") && (
                <Button
                  sx={userStyle.buttonedit}
                  onClick={() => {
                    getviewCode(params.row.id);
                  }}
                >
                  <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}
              {isUserRoleCompare?.includes("ipaiddatefix") && (
                <Button
                  sx={userStyle.buttonedit}
                  onClick={() => {
                    getinfoCode(params.row.id);
                  }}
                >
                  <InfoOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}
            </Grid>

          )}
        </>
      ),
    },
  ];
  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      department: item.department.join(",").toString(),
      month: item.month,
      year: item.year,
      date: moment(item.date).format("DD-MM-YYYY"),
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
  return (
    <Box>
      <Headtitle title={"Paid Date Fix"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Paid Date Fix</Typography>
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
                    <Typography>Date </Typography>
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
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
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
                    <Button variant="contained" type="submit">
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={userStyle.btncancel}
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
                    {/* <MenuItem value={paiddatefixs?.length}>All</MenuItem> */}
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <Button
              variant="contained"
              color="error"
              onClick={handleClickOpenalert}
            >
              Bulk Delete
            </Button>
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
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
                {/* <Box>
                  <Pagination
                    page={searchQuery !== "" ? 1 : page}
                    pageSize={pageSize}
                    totalPages={searchQuery !== "" ? 1 : totalPages}
                    onPageChange={handlePageChange}
                    pageItemLength={filteredDatas?.length}
                    totalProjects={
                      searchQuery !== "" ? filteredDatas?.length : totalProjects
                    }
                  />
                </Box> */}
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredDatas.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, paidDateCount)} of {paidDateCount} entries
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
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={filteredDatas ?? []}
        itemsTwo={paiddatefixsFilterArray ?? []}
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
    </Box>
  );
}
export default PaidDateFix;