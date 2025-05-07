import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, Chip, DialogContent, List, ListItem, ListItemText, Popover, TextField, IconButton, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import StyledDataGrid from "../../../components/TableStyle";
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import Headtitle from "../../../components/Headtitle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PageHeading from "../../../components/PageHeading";
import ExportData from "../../../components/ExportData";
import ExportDataView from "../../../components/ExportData";
import ExportDataCateView from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import AlertDialog from "../../../components/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const LinearProgressBar = ({ progress }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#1976d2b0",
          color: "white",
          textAlign: "center",
          lineHeight: "20px",
        }}
      >
        {progress}%
      </div>
    </div>
  );
};

function ProductionDay() {
  const [productionDays, setProductionDays] = useState([]);

  const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);

  let username = isUserRoleAccess.username;
  let companyname = isUserRoleAccess.companyname;

  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //Datatable
  const [pageView, setPageView] = useState(1);
  const [pageSizeView, setPageSizeView] = useState(10);

  //Datatable
  const [pageCategoryView, setPageCategoryView] = useState(1);
  const [pageSizeCategoryView, setPageSizeCategoryView] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryView, setSearchQueryView] = useState("");
  const [searchQueryCategoryView, setSearchQueryCategoryView] = useState("");

  const { auth } = useContext(AuthContext);

  const [viewData, setViewData] = useState([]);
  const [categoryViewData, setCategoryViewData] = useState([]);

  // const [isloadingPop, setIsloadingPop] = useState(false);

  const [fileFormat, setFormat] = useState("");

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
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [isFilterOpenView, setIsFilterOpenView] = useState(false);
  const [isPdfFilterOpenView, setIsPdfFilterOpenView] = useState(false);
  // page refersh reload
  const handleCloseFilterModView = () => {
    setIsFilterOpenView(false);
  };

  const handleClosePdfFilterModView = () => {
    setIsPdfFilterOpenView(false);
  };

  const [isFilterOpenCategoryView, setIsFilterOpenCategoryView] = useState(false);
  const [isPdfFilterOpenCategoryView, setIsPdfFilterOpenCategoryView] = useState(false);

  // page refersh reload
  const handleCloseFilterModCategoryView = () => {
    setIsFilterOpenCategoryView(false);
  };

  const handleClosePdfFilterModCategoryView = () => {
    setIsPdfFilterOpenCategoryView(false);
  };

  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus;
    });
    return result[0]?.name;
  };

  // get week for month's start to end
  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [selectedDate, setSelectedDate] = useState("");

  const [isBankdetail, setBankdetail] = useState(false);
  const [isBankdetailCateView, setBankdetailCateView] = useState(false);
  const [viewbtnload, setviewbtnload] = useState("");

  const gridRef = useRef(null);
  const gridRefview = useRef(null);
  const gridRefCategoryView = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  const [searchQueryManageView, setSearchQueryManageView] = useState("");
  const [searchQueryManageCategoryView, setSearchQueryManageCategoryView] = useState("");

  const [prodLastDate, setProdLastDate] = useState(0);
  const [deldayPointLoad, setDeldayPointLoad] = useState(false);
  const [rerunLoad, setRerunLoad] = useState("");

  //Dialog open last daypoint delete popup
  const [lastDayDelPop, setLastDayDelPop] = useState({ date: "", open: false });

  const handleLastDayDelPopOpen = (date) => {
    setLastDayDelPop({ open: true, date: date });
  };
  const handleLastDayDelPopClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setLastDayDelPop({ open: false, date: "" });
  };

  //Dialog open Last day create popup
  const [lastProdDayCreatePop, setLastProdDayCreatePop] = useState({ date: "", open: false });

  const handleLastProdDayCreatePopOpen = (date) => {
    setLastProdDayCreatePop({ open: true, date: date });
  };
  const handleLastProdDayCreatePopClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setLastProdDayCreatePop({ open: false, date: "" });
  };

  //Dialog open Last day create popup
  const [lastProdDayCreatePopNew, setLastProdDayCreatePopNew] = useState({ date: "", open: false });

  const handleLastProdDayCreatePopOpenNew = (date) => {
    setLastProdDayCreatePopNew({ open: true, date: date });
  };
  const handleLastProdDayCreatePopCloseNew = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setLastProdDayCreatePopNew({ open: false, date: "" });
  };

  const [openDaypointCreateConfirm, setOpenDaypointCreateConfirm] = useState({ open: false, date: "" });
  const handleClickOpenDaypointCreateConfirmPopup = (date) => {
    setOpenDaypointCreateConfirm({ open: true, date: date });
  };
  const handleCloseDaypointCreateConfirmPopup = () => {
    setOpenDaypointCreateConfirm({ open: false, date: "" });
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Point Creation.png");
        });
      });
    }
  };
  //image
  const handleCaptureImageview = () => {
    if (gridRefview.current) {
      html2canvas(gridRefview.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Point Creation.png");
        });
      });
    }
  };
  //image
  const handleCaptureImageCategoryView = () => {
    if (gridRefCategoryView.current) {
      html2canvas(gridRefCategoryView.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Point Creation.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Dialog open
  const [isViewDialog, setIsViewDialog] = useState(false);

  const handleViewDialogOpen = (event) => {
    setPageView(1);
    setSearchQueryView("");
    setPageSizeView(10);
    setIsViewDialog(true);
  };
  const handleViewDialogClose = () => {
    setIsViewDialog(false);
  };

  //Dialog open
  const [isCategoryViewDialog, setIsCategoryViewDialog] = useState(false);

  const handleCategoryViewDialogOpen = (event) => {
    setcolumnVisibilityCategoryView(initialcolumnVisibilityCategoryView);
    setPageCategoryView(1);
    setSearchQueryCategoryView("");
    setPageSizeCategoryView(10);
    setIsCategoryViewDialog(true);
  };
  const handleCategoryViewDialogClose = () => {
    setIsCategoryViewDialog(false);
  };

  //Delete Dialog open
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteOpen = (event) => {
    setIsDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };
  const [alertMsg, setAlertMsg] = useState(false);

  const handleProgressUpdate = (val, sts) => {
    setAlert(Math.round(Number(val) * 10));
    setAlertMsg(sts);
  };
  //Dialog open
  const [isLoaderDialog, setIsLoaderDialog] = useState(false);

  const handleLoaderDialogOpen = (val, reason) => {
    setIsLoaderDialog(true);
  };
  const handleLoaderDialogClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsLoaderDialog(false);
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

  // Manage Columns
  const [isManageColumnsOpenView, setManageColumnsOpenView] = useState(false);
  const [anchorElView, setAnchorElView] = useState(null);

  const handleOpenManageColumnsView = (event) => {
    setAnchorElView(event.currentTarget);
    setManageColumnsOpenView(true);
  };
  const handleCloseManageColumnsView = () => {
    setManageColumnsOpenView(false);
    setSearchQueryManageView("");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Manage Columns
  const [isManageColumnsOpenCategoryView, setManageColumnsOpenCategoryView] = useState(false);
  const [anchorElCategoryView, setAnchorElCategoryView] = useState(null);

  const handleOpenManageColumnsCategoryView = (event) => {
    setAnchorElCategoryView(event.currentTarget);
    setManageColumnsOpenCategoryView(true);
  };
  const handleCloseManageColumnsCategoryView = () => {
    setManageColumnsOpenCategoryView(false);
    setSearchQueryManageCategoryView("");
  };

  const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
    "& .custom-id-lateentry": {
      color: "red !important",
    },
  }));

  const openCategoryView = Boolean(anchorElCategoryView);
  const idCategoryView = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row";
    }

    return "";
  };
  const getRowClassNameCategoryview = (params) => {
    if (params.row.lateentrystatus === "Late Entry") {
      return "custom-id-lateentry";
    }
    return "";
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    date: true,
    username: true,
    companyname: true,
    status: true,
    createddate: true,
    actions: true,
    filestatus: true,
    actionsdaypoint: true,
  };

  // Show All Columns & Manage Columns
  const initialcolumnVisibilityView = {
    serialNumber: true,
    date: true,
    mode: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empname: true,
    empcode: true,
    department: true,
    vendor: true,
    user: true,
    filename: true,
    processcode: true,
    experience: true,
    target: true,
    points: true,
    avgpoint: true,
    aprocess: true,
    sprocess: true,
    contarget: true,
    conpoints: true,
    conavg: true,
    weekoff: true,
    action: true,
  };
  // Show All Columns & Manage Columns
  const initialcolumnVisibilityCategoryView = {
    serialNumber: true,
    dateval: true,
    mode: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empname: true,
    empcode: true,
    department: true,
    vendor: true,
    user: true,
    filename: true,
    category: true,
    unitid: true,
    processcode: true,
    experience: true,
    target: true,
    points: true,
    avgpoint: true,
    aprocess: true,
    sprocess: true,
    contarget: true,
    conpoints: true,
    conavg: true,
    weekoff: true,
    // uunitrate: true,
    // aunitrate: true,
    // uflag: true,
    // aflag: true,
    // points: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [columnVisibilityView, setcolumnVisibilityView] = useState(initialcolumnVisibilityView);
  const [columnVisibilityCategoryView, setcolumnVisibilityCategoryView] = useState(initialcolumnVisibilityCategoryView);

  const fetchProductionDay = async () => {
    try {
      setBankdetail(true);

      let res = await axios.get(SERVICE.PRODUCTION_DAYS_CHECKAFTER_DAYPOINTCREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setProductionDays(res.data.productionupload);
      setBankdetail(false);
    } catch (err) {
      console.log(err, "err");
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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

  // Error Popup model
  const [isErrorOpenDayPoint, setIsErrorOpenDayPoint] = useState(false);
  // const [showAlert, setShowAlert] = useState();
  //Delete model
  const handleClickOpenDayPoint = () => {
    setIsErrorOpenDayPoint(true);
  };
  const handleCloseModDayPoint = () => {
    setIsErrorOpenDayPoint(false);
    // fetchAllDayPoints();
  };

  // Error Popup model
  const [beforeDaypointDel, setBeforeDaypointDel] = useState({ open: false, date: "" });

  const handleClickOpenDelBeforeDayPoint = (date) => {
    setBeforeDaypointDel({ open: true, date: date });
  };
  const handleClickCloseDelBeforeDayPoint = () => {
    setBeforeDaypointDel({ open: false, date: "" });
  };

  // Error Popup model
  const [beforeProdDayCreate, setbeforeProdDayCreate] = useState({ open: false, date: "" });

  const handleClickOpenProdDayCreate = (date) => {
    setbeforeProdDayCreate({ open: true, date: date });
  };
  const handleClickCloseProdDayCreate = () => {
    setbeforeProdDayCreate({ open: false, date: "" });
  };
  // Error Popup model
  const [beforeProdDayRerun, setbeforeProdDayRerun] = useState({ open: false, date: "" });

  const handleClickOpenProdDayRerun = (date) => {
    setbeforeProdDayRerun({ open: true, date: date });
  };
  const handleClickCloseProdDayRerun = () => {
    setbeforeProdDayRerun({ open: false, date: "" });
  };

  // Create before day daypoint Popup model
  const [beforeDayPointCreate, setbeforeDayPointCreate] = useState({ open: false, date: "" });

  const handleClickOpenCreateBeforeDayPoint = (date) => {
    setbeforeDayPointCreate({ open: true, date: date });
  };
  const handleClickCloseCreateBeforeDayPoint = () => {
    setbeforeDayPointCreate({ open: false, date: "" });
  };

  // Create before day daypoint Popup model
  const [selectedDayPointCreate, setSelectedDayPointCreate] = useState({ open: false, date: "" });

  const handleClickOpenCreateSelectedDayPoint = (date) => {
    setSelectedDayPointCreate({ open: true, date: date });
  };
  const handleClickCloseCreateSelectedDayPoint = () => {
    setSelectedDayPointCreate({ open: false, date: "" });
  };

  //  PDF
  const columnsview = [
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Mode", dataKey: "mode" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Team", dataKey: "team" },
    { title: "Name", dataKey: "empname" },
    { title: "Emp Code", dataKey: "empcode" },
    { title: "Department", dataKey: "department" },
    { title: "Date", dataKey: "date" },
    { title: "Project-Vendor", dataKey: "vendor" },
    { title: "User", dataKey: "user" },
    { title: "Category", dataKey: "filename" },
    { title: "Process Code", dataKey: "processcode" },
    { title: "Exp", dataKey: "experience" },
    { title: "Target", dataKey: "target" },
    { title: "Points", dataKey: "points" },
    { title: "Avg Point", dataKey: "avgpoint" },
    { title: "P Process", dataKey: "aprocess" },
    { title: "S Process", dataKey: "sprocess" },
    { title: "Con Tar", dataKey: "contarget" },
    { title: "Con Points", dataKey: "conpoints" },
    { title: "Con Avg", dataKey: "conavg" },
  ];

  const downloadPdfView = (isfilter) => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTableView.map((t, index) => ({
          ...t,
          serialNumber: index + 1,
        }))
        : itemsView?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }));

    const maxColumnsPerPage = 10; // Maximum number of columns per page
    const totalPages = Math.ceil(columnsview.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columnsview.length);

      const currentPageColumns = columnsview.slice(startIdx, endIdx);

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: dataWithSerial,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }

    doc.save("Production Point Creation.pdf");
  };

  // Excel
  const fileName = "Production Point Creation";

  const columnscategoryview = [
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Mode", dataKey: "mode" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Team", dataKey: "team" },
    { title: "Name", dataKey: "empname" },
    { title: "Emp Code", dataKey: "empcode" },
    { title: "Department", dataKey: "department" },
    { title: "Date", dataKey: "date" },
    { title: "Project-Vendor", dataKey: "vendor" },
    { title: "User", dataKey: "user" },
    { title: "Category", dataKey: "filename" },
    { title: "Process Code", dataKey: "processcode" },
    { title: "Exp", dataKey: "experience" },
    { title: "Target", dataKey: "target" },
    { title: "Points", dataKey: "points" },
    { title: "Avg Point", dataKey: "avgpoint" },
    { title: "P Process", dataKey: "aprocess" },
    { title: "S Process", dataKey: "sprocess" },
    { title: "Con Tar", dataKey: "contarget" },
    { title: "Con Points", dataKey: "conpoints" },
    { title: "Con Avg", dataKey: "conavg" },
  ];

  const downloadPdfCategoryView = (isfilter) => {
    const doc = new jsPDF({
      orientation: "landscape",
    });
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTableCategoryView.map((t, index) => ({
          ...t,
          serialNumber: index + 1,
        }))
        : itemsCategoryView?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }));

    const maxColumnsPerPage = 10; // Maximum number of columns per page
    const totalPages = Math.ceil(columnscategoryview.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columnscategoryview.length);

      const currentPageColumns = columnscategoryview.slice(startIdx, endIdx);

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: dataWithSerial,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }
    doc.save("Production Category Point View.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production Point Creation",
    pageStyle: "print",
  });

  //print...
  const componentRefview = useRef();
  const handleprintview = useReactToPrint({
    content: () => componentRefview.current,
    documentTitle: "Production Point Creation",
    pageStyle: "print",
  });
  //print...
  const componentRefCategoryView = useRef();
  const handleprintCategoryView = useReactToPrint({
    content: () => componentRefCategoryView.current,
    documentTitle: "Production Category Point View",
    pageStyle: "print",
  });

  const [targetPoints, setTargetPoints] = useState([]);
  const [categoryProcessMap, setCategoryProcessMap] = useState([]);

  const fetchTargetCategoryProcessMap = async () => {
    setIsCheckUnAllotMismatch(true);
    try {
      const [res_Target, res_vendor, res_freq, res_Cate_map] = await Promise.all([
        axios.get(SERVICE.TARGETPOINTS_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        axios.get(SERVICE.ATTENDANCE_STATUS, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        axios.get(SERVICE.CATEGORYPROCESSMAP_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
      ]);

      setTargetPoints(res_Target?.data?.targetpoints);
      setAttStatus(res_vendor?.data?.attendancestatus);
      setAttModearr(res_freq?.data?.allattmodestatus);
      setCategoryProcessMap(res_Cate_map?.data?.categoryprocessmaps);
      setIsCheckUnAllotMismatch(false);
    } catch (err) {
      console.log(err);
      setIsCheckUnAllotMismatch(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchTargetCategoryProcessMap();
  }, []);
  //table entries ..,.

  const [items, setItems] = useState([]);

  const addSerialNumber = async () => {
    try {
      const itemsWithSerialNumber = productionDays?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        dateold: item.date,
        date: moment(item.date).format("DD-MM-YYYY"),
        createddate: moment(item.createddate).format("DD-MM-YYYY hh:mm:ss a"),
      }));

      setItems(itemsWithSerialNumber);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    addSerialNumber();
  }, [productionDays]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    // setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    // setSelectAllChecked(false);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setPage(1);
    setSearchQuery(event.target.value);
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [deleteId, setDeleteId] = useState("");
  const [selectedDeleteIdList, setSelectedDeleteIdList] = useState("");

  const handleDelete = async (uniqid, id, dateval) => {
    let [date, month, year] = dateval.split("-");

    try {
      let res_queue = await axios.post(SERVICE.GET_DAY_POINTS_LIMITED_DATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: `${year}-${month}-${date}`,
      });

      if (res_queue.data.daypointsupload.length > 0) {
        setPopupContentMalert("Day point already Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setDeleteId(id);
        setSelectedDeleteIdList(uniqid);
        handleDeleteOpen();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [isloadDelUniqid, setisloadDelUniqid] = useState(false);

  const deleteMatchidList = async () => {
    try {
      setisloadDelUniqid(true);
      let RES = await axios.delete(`${SERVICE.PRODUCTION_DAY_SINGLE}/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res_Delete_Day_List = await axios.post(SERVICE.PRODUCTION_DAY_LIST_DELETE_UNIQID, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        uniqid: selectedDeleteIdList,
      });
      setisloadDelUniqid(false);
      handleDeleteClose();

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchProductionDay();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleViewData = async (uniqid, date) => {
    try {
      let RES = await axios.post(SERVICE.PRODUCTION_DAY_LIST_GET_VIEW_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        uniqid: uniqid,
      });

      setViewData(RES.data.productiondaylists.map((item) => ({ ...item, date: date })));

      handleViewDialogOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  function convertTo24HourFormat(time) {
    // Check if the time contains "AM/PM/am/pm"
    if (/am|pm/i.test(time)) {
      // Convert to 24-hour format
      const [hours, minutes, secondsPart] = time.split(/[: ]/);
      const period = time.slice(-2).toUpperCase(); // Extract AM/PM
      let hours24 = parseInt(hours, 10);

      if (period === "PM" && hours24 !== 12) {
        hours24 += 12;
      } else if (period === "AM" && hours24 === 12) {
        hours24 = 0;
      }

      // Format the time in 24-hour format
      return `${hours24.toString().padStart(2, "0")}:${minutes}:${secondsPart.slice(0, 2)}`;
    }
    // If already in 24-hour format, return as is
    return time;
  }

  const handleViewDataCategory = async (userid, category, fromtodate, params) => {
    setCategoryViewData([]);
    // Split the string at the $
    const dateTimeArray = fromtodate.split("$");
    // Extract dates
    const startDate = dateTimeArray[0].split("T")[0];
    const endDate = dateTimeArray[1].split("T")[0];
    setBankdetailCateView(true);
    setviewbtnload(params.row.id);
    console.log(params, "params");
    try {
      let RES = await axios.post(SERVICE.PRODUCTION_DAY_CATEGORY_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userid: userid,
        category: category,
        startdate: dateTimeArray[0],
        enddate: dateTimeArray[1],
        mode: params.row.mode,
      });

      let categoryDate = RES.data.productionupload.map((item) => {
        const uploadtime = item.mode === "Manual" ? convertTo24HourFormat(item.time) : item.formattedtime;

        let uploadOrgDate = params.row.mode === "Manual" ? "" : item.dateval.split(" IST")[0];
        let finalDateTime = params.row.mode === "Manual" ? `${item.fromdate}T${uploadtime}Z` : `${uploadOrgDate.split(" ")[0]}T${uploadOrgDate.split(" ")[1]}Z`;

        if (new Date(finalDateTime) >= new Date(dateTimeArray[0]) && new Date(finalDateTime) <= new Date(dateTimeArray[1]))
          return {
            ...item,
            mode: item.mode === "Manual" ? "Manual" : "Production",
            empname: params.row.empname,
            empcode: params.row.empcode,
            processcode: params.row.processcode,
            experience: params.row.experience,
            target: params.row.target,
            aprocess: params.row.aprocess,
            sprocess: params.row.sprocess,
            contarget: params.row.contarget,
            department: params.row.department,
            company: params.row.company,
            branch: params.row.branch,
            unit: params.row.unit,
            team: params.row.team,
            weekoff: params.row.weekoff,
          };
      });

      setCategoryViewData(categoryDate.filter((item) => item != null && item != undefined));
      setBankdetailCateView(false);
      setviewbtnload("");
      handleCategoryViewDialogOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [dayPointDelId, setDayPointDelId] = useState("");
  //set function to get particular row
  const rowDataDaypoint = async (date) => {
    try {
      let resCheckPayrun = await axios.post(SERVICE.CHECK_PAYRUN_GENERATED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });
      const isPayrunGenerated = resCheckPayrun.data.payruncontrol > 0;
      if (isPayrunGenerated) {
        setPopupContentMalert(`Payrun Already Generated`);
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        let res = await axios.post(SERVICE.GET_DAYPOINT_ID_BYDATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: date,
        });
        setDayPointDelId(res?.data?.daypointsupload._id);
        handleClickOpenDayPoint();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delDayPoint = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_DAY_POINTS}/${dayPointDelId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchProductionDay();
      handleCloseModDayPoint();
      setPage(1);

      setPopupContent("Deleted Successfully 👍");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delDayPointLast = async (date) => {
    try {
      const [data, res_Day, res_FileStatus] = await Promise.all([
        axios.post(SERVICE.DELETE_DAYPOINT_ORG_BYDATE, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          date: date,
        }),
        axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          date: date,
        }),
      ]);

      await fetchProductionDay();
      handleClickCloseDelBeforeDayPoint();

      if (res_Day.statusText === "OK") {
        if (res_Day.data.countDay > 0) {
          handleClickOpenProdDayRerun(date);
        } else {
          handleClickOpenProdDayCreate(date);
        }
      }

      setPopupContent("Deleted Successfully 👍");
      setPopupSeverity("success");
      handleClickOpenPopup();

      setPage(1);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [isloading, setIsloading] = useState(false);
  const [isloadingPop, setIsloadingPop] = useState(false);

  const handleSubmitDaypointCreate = (date) => {
    handleDayPointCreate(date);
  };

  const handleDayPointCreate = async (date, type) => {
    try {
      setIsloading(true);
      setIsloadingPop(true);
      // Fetch data
      const res_Day = await axios.post(SERVICE.PRODUCTION_DAYS_GETLIST_BY_DATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });

      const finaldate = moment(date).format("DDMMYYYY");

      const finalData = res_Day.data.result.map((item) => ({
        ...item,
        date: date,
        avgpoint: (Number(item.points) / Number(item.target)) * 100,
        point: item.points,
        companyname: item.company,
        name: item.empname,
      }));

      // Send the POST request

      if (finalData.length > 0) {
        let startMonthDate = new Date(date);
        let endMonthDate = new Date(date);

        const daysArray = [];
        while (startMonthDate <= endMonthDate) {
          const formattedDate = `${String(startMonthDate.getDate()).padStart(2, "0")}/${String(startMonthDate.getMonth() + 1).padStart(2, "0")}/${startMonthDate.getFullYear()}`;
          const dayName = startMonthDate.toLocaleDateString("en-US", { weekday: "long" });
          const dayCount = startMonthDate.getDate();
          const shiftMode = "Main Shift";
          const weekNumberInMonth =
            getWeekNumberInMonth(startMonthDate) === 1
              ? `${getWeekNumberInMonth(startMonthDate)}st Week`
              : getWeekNumberInMonth(startMonthDate) === 2
                ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
                : getWeekNumberInMonth(startMonthDate) === 3
                  ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
                  : getWeekNumberInMonth(startMonthDate) > 3
                    ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                    : "";

          daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

          // Move to the next day
          startMonthDate.setDate(startMonthDate.getDate() + 1);
        }

        let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: String("Approved"),
        });

        let leaveresult = res_applyleave?.data?.applyleaves;

        let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_PROD_DAYPOINT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: date,
          // employee: finalData.map((item) => item.name),
        });

        function splitArray(array, chunkSize) {
          const resultarr = [];
          for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            resultarr.push({
              data: chunk,
            });
          }
          return resultarr;
        }

        let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map((item) => item.companyname))] : [];
        const resultarr = splitArray(employeelistnames, 10);

        async function sendBatchRequest(batch) {
          try {
            let res = await axios.post(
              SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER_PROD_DAYPOINT,
              {
                employee: batch.data,
                userDates: daysArray,
                date: date,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              }
            );
            // console.log(res.data.finaluser,'res.data.finaluser')
            const filteredBatch = res.data.finaluser.filter((d) => {
              // const [day, month, year] = d.rowformattedDate.split('/');
              const formattedDate = new Date(date);
              const reasonDate = new Date(d.reasondate);
              const dojDate = new Date(d.dojDate);

              if (d.reasondate && d.reasondate !== "") {
                return formattedDate <= reasonDate;
              } else if (d.doj && d.doj !== "") {
                return formattedDate >= dojDate;
              } else {
                return d;
              }
            });

            let filtered = filteredBatch;

            let countByEmpcodeClockin = {}; // Object to store count for each empcode
            let countByEmpcodeClockout = {};

            const result = filtered?.map((item, index) => {
              // Initialize count for empcode if not already present
              if (!countByEmpcodeClockin[item.empcode]) {
                countByEmpcodeClockin[item.empcode] = 1;
              }
              if (!countByEmpcodeClockout[item.empcode]) {
                countByEmpcodeClockout[item.empcode] = 1;
              }

              // Adjust clockinstatus based on lateclockincount
              let updatedClockInStatus = item.clockinstatus;
              // Adjust clockoutstatus based on earlyclockoutcount
              let updatedClockOutStatus = item.clockoutstatus;

              // Filter out only 'Absent' items for the current employee
              const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

              // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
              if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
                // Define the date format for comparison
                const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
                const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day"));

                const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
                const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day"));

                if (isPreviousDayLeave) {
                  updatedClockInStatus = "BeforeWeekOffLeave";
                  updatedClockOutStatus = "BeforeWeekOffLeave";
                }
                if (isPreviousDayAbsent) {
                  updatedClockInStatus = "BeforeWeekOffAbsent";
                  updatedClockOutStatus = "BeforeWeekOffAbsent";
                }
                if (isNextDayLeave) {
                  updatedClockInStatus = "AfterWeekOffLeave";
                  updatedClockOutStatus = "AfterWeekOffLeave";
                }
                if (isNextDayAbsent) {
                  updatedClockInStatus = "AfterWeekOffAbsent";
                  updatedClockOutStatus = "AfterWeekOffAbsent";
                }
              }

              // Check if 'Late - ClockIn' count exceeds the specified limit
              if (updatedClockInStatus === "Late - ClockIn") {
                updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
              }
              // Check if 'Early - ClockOut' count exceeds the specified limit
              if (updatedClockOutStatus === "Early - ClockOut") {
                updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
              }

              return {
                ...item,
                clockinstatus: updatedClockInStatus,
                clockoutstatus: updatedClockOutStatus,
              };
            });

            return result;
          } catch (err) {
            console.error("Error in POST request for batch:", batch.data, err);
          }
        }

        async function getAllResults() {
          let allResults = [];
          for (let batch of resultarr) {
            const finaldata = await sendBatchRequest(batch);
            // console.log(finaldata, 'finldate');
            allResults = allResults.concat(finaldata);
          }

          return { allResults }; // Return both results as an object
        }

        getAllResults()
          .then(async (results) => {
            // console.log(results, 'results');
            const itemsWithSerialNumber = results.allResults?.map((item, index) => ({
              ...item,
              serialNumber: index + 1,
              weekoff: item.shift,
              companyname: item.companyname,
              // attendanceauto: getattendancestatus(item),
              daystatus: item.shift === "Not Allotted" ? "ShiftNot Allot" : item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
              // appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
              // modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // paidpresent: getFinalPaid(
              //   getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              //   getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
              // ),
              // lopday: getAssignLeaveDayForLop(
              //   getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))
              // ),
              // paidpresentday: getAssignLeaveDayForPaid(
              //   getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))
              // ),
            }));

            // const res_MonthSet = await axios.post(SERVICE.DEPTMONTHSET_PROD_LIMITED, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   date: date,
            // });

            // let filteredMonthsets = res_MonthSet.data.departmentdetails;
            // console.log(itemsWithSerialNumber, finalData, 'itemsWithSerialNumber');
            let itemsWithSerialNumberKeyChanged = itemsWithSerialNumber
              .filter((item) => !finalData.some((d) => d.name === item.companyname && (d.weekoff?.toLowerCase() === item.weekoff?.toLowerCase() || d.weekoff === "Week Off" || d.weekoff === "" || d.weekoff === "Not Allot")))
              .map((data) => {
                let getprocess = data.process;
                let findexpval = Number(data.exp) < 1 ? "00" : Number(data.exp) <= 9 ? `0${Number(data.exp)}` : data.exp;

                let getprocessCode = getprocess + findexpval;

                let findSalDetails = targetPoints.find((d) => d.branch === data.branch && d.company === data.company && d.processcode === getprocessCode);

                let findTargetVal = findSalDetails ? Number(findSalDetails.points) : 0;

                return {
                  name: data.companyname,
                  points: 0,
                  point: 0,
                  target: findTargetVal,
                  date: date,
                  empname: data.companyname,
                  empcode: data.empcode,
                  company: data.company,
                  fromtodate: "2000-11-11T00:00:00.000Z$2000-11-11T00:00:00.000Z",
                  unit: data.unit,
                  team: data.team,
                  dateval: date,
                  processcode: getprocess,
                  exper: data.exp,
                  weekoff: data.weekoff === "Not Allotted" ? "Not Allot" : data.weekoff,
                  branch: data.branch,
                  shiftsts: "Disable",
                  daypointsts: data.daystatus ? data.daystatus : "not defined",
                  production: 0,
                  manual: 0,
                  shiftpoints: 0,
                  conshiftpoints: 0,
                  users: [],
                  count: 0,
                  avgpoint: 0,
                  companyname: data.company,
                };
              });

            const finalDataWithDayStatus = finalData.map((data) => {
              let findUserDayStatus = itemsWithSerialNumber.find((item) => item.username === data.name);

              return {
                ...data,
                daypointsts: findUserDayStatus ? findUserDayStatus.daystatus : "not defined",
              };
            });

            let pointEmployeesWithWeekOff = [...finalDataWithDayStatus, ...itemsWithSerialNumberKeyChanged];

            const ans = [
              {
                filename: `ORIGINAL_DAYPOINT_${finaldate}`,
                date: date,
                uploaddata: pointEmployeesWithWeekOff,
                type: "nonexcel",
                document: [],
                addedby: [
                  {
                    name: String(username),
                    date: String(new Date()),
                  },
                ],
              },
            ];

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
              }
            };

            xmlhttp.open("POST", SERVICE.ADD_DAY_POINTS, true);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.send(JSON.stringify(ans));

            console.log("Calling fetchProductionDay...");
            await fetchProductionDay();
            console.log("fetchProductionDay called.");

            setIsloading(false); // Reset loading state
            setIsloadingPop(false);
            setPopupContent("Created Successfully 👍");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseDaypointCreateConfirmPopup();
            handleClickCloseCreateBeforeDayPoint();
            handleClickCloseCreateSelectedDayPoint();
            if (type === "reruncreate") {
              let dateoneafter = new Date(date);
              dateoneafter.setDate(dateoneafter.getDate() + 1);
              let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

              handleClickOpenCreateSelectedDayPoint(newDateOnePlus);
            }
            // setIsloading(false);
            // setShowAlert(
            //   <>
            //     <CheckCircleOutlineIcon sx={{ fontSize: '100px', color: '#7ac767' }} />
            //     <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Created Successfully 👍'}</p>
            //   </>
            // );
            // handleClickOpenerr();
          })
          .catch((error) => {
            setIsloading(false);
            setIsloadingPop(false);
            console.error("Error in getting all results:", error);
          });
      } else {
        setIsloading(false);
        setIsloadingPop(false);
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Create production Day"}</p>
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {
      setIsloadingPop(false);
      handleClickCloseCreateBeforeDayPoint();
      handleClickCloseCreateSelectedDayPoint();
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Dialog open
  const [createDaypointLastdate, setCreateDaypointLastdate] = useState({ open: false, date: "" });

  const handleLastDaypointCreatePopOpen = (date) => {
    setCreateDaypointLastdate({ open: true, date: date });
  };
  const handleLastDaypointCreatePopClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setCreateDaypointLastdate({ open: false, date: "" });
  };

  //Dialog open
  const [createDaypointSelecteddate, setCreateDaypointSelecteddate] = useState({ open: false, date: "" });

  const handleSelectedDaypointCreatePopOpen = (date) => {
    setCreateDaypointSelecteddate({ open: true, date: date });
  };
  const handleSelectedDaypointCreatePopClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setCreateDaypointSelecteddate({ open: false, date: "" });
  };

  //Dialog delete current dayponit for rerun open
  const [delCurrDaypoint, setDelCurrDaypoint] = useState({ open: false, date: "" });

  const handleCurrentDaypointDelPopOpen = (date, uniqueid, beforeProdDay, beforeDayPoint, currDaypoint) => {
    setDelCurrDaypoint({ open: true, date: date, uniqueid, beforeProdDay, beforeDayPoint, currDaypoint });
  };
  const handleCurrentDaypointDelPopClose = (event, reason) => {
    // console.log("123")
    if (reason && reason === "backdropClick") return;
    setDelCurrDaypoint({ ...delCurrDaypoint, open: false, date: "" });
  };
  const [createdayPointLoadPop, setCreatedayPointLoadPop] = useState(false);

  const handleDayPointCreateLastDay = async (date, type) => {
    try {
      setCreatedayPointLoadPop(true);
      let res_Day = await axios.post(SERVICE.PRODUCTION_DAYS_GETLIST_BY_DATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });

      let finaldate = moment(date).format("DDMMYYYY");

      let finalData = res_Day.data.result.map((item) => {
        // console.log((Number(item.points)) - (Number((item.conshiftpoints).toFixed(5))));
        // let diff =  Number(item.points) - Number(item.conshiftpoints)
        return {
          ...item,
          date: date,

          avgpoint: (Number(item.points) / Number(item.target)) * 100,
          point: item.points,
          companyname: item.company,
          name: item.empname,
        };
      });

      let startMonthDate = new Date(date);
      let endMonthDate = new Date(date);

      const daysArray = [];
      while (startMonthDate <= endMonthDate) {
        const formattedDate = `${String(startMonthDate.getDate()).padStart(2, "0")}/${String(startMonthDate.getMonth() + 1).padStart(2, "0")}/${startMonthDate.getFullYear()}`;
        const dayName = startMonthDate.toLocaleDateString("en-US", { weekday: "long" });
        const dayCount = startMonthDate.getDate();
        const shiftMode = "Main Shift";
        const weekNumberInMonth =
          getWeekNumberInMonth(startMonthDate) === 1
            ? `${getWeekNumberInMonth(startMonthDate)}st Week`
            : getWeekNumberInMonth(startMonthDate) === 2
              ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
              : getWeekNumberInMonth(startMonthDate) === 3
                ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
                : getWeekNumberInMonth(startMonthDate) > 3
                  ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                  : "";

        daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

        // Move to the next day
        startMonthDate.setDate(startMonthDate.getDate() + 1);
      }

      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });

      let leaveresult = res_applyleave?.data?.applyleaves;

      let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_PROD_DAYPOINT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
        // employee: finalData.map((item) => item.name),
      });

      function splitArray(array, chunkSize) {
        const resultarr = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          const chunk = array.slice(i, i + chunkSize);
          resultarr.push({
            data: chunk,
          });
        }
        return resultarr;
      }

      let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map((item) => item.companyname))] : [];
      const resultarr = splitArray(employeelistnames, 10);

      async function sendBatchRequest(batch) {
        try {
          let res = await axios.post(
            SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER_PROD_DAYPOINT,
            {
              employee: batch.data,
              userDates: daysArray,
              date: date,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );

          const filteredBatch = res.data.finaluser.filter((d) => {
            // const [day, month, year] = d.rowformattedDate.split('/');
            const formattedDate = new Date(date);
            const reasonDate = new Date(d.reasondate);
            const dojDate = new Date(d.dojDate);

            if (d.reasondate && d.reasondate !== "") {
              return formattedDate <= reasonDate;
            } else if (d.doj && d.doj !== "") {
              return formattedDate >= dojDate;
            } else {
              return d;
            }
          });

          let filtered = filteredBatch;

          let countByEmpcodeClockin = {}; // Object to store count for each empcode
          let countByEmpcodeClockout = {};

          const result = filtered?.map((item, index) => {
            // Initialize count for empcode if not already present
            if (!countByEmpcodeClockin[item.empcode]) {
              countByEmpcodeClockin[item.empcode] = 1;
            }
            if (!countByEmpcodeClockout[item.empcode]) {
              countByEmpcodeClockout[item.empcode] = 1;
            }

            // Adjust clockinstatus based on lateclockincount
            let updatedClockInStatus = item.clockinstatus;
            // Adjust clockoutstatus based on earlyclockoutcount
            let updatedClockOutStatus = item.clockoutstatus;

            // Filter out only 'Absent' items for the current employee
            const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

            // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
            if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
              // Define the date format for comparison
              const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

              const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
              const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day"));

              const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
              const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day"));

              if (isPreviousDayLeave) {
                updatedClockInStatus = "BeforeWeekOffLeave";
                updatedClockOutStatus = "BeforeWeekOffLeave";
              }
              if (isPreviousDayAbsent) {
                updatedClockInStatus = "BeforeWeekOffAbsent";
                updatedClockOutStatus = "BeforeWeekOffAbsent";
              }
              if (isNextDayLeave) {
                updatedClockInStatus = "AfterWeekOffLeave";
                updatedClockOutStatus = "AfterWeekOffLeave";
              }
              if (isNextDayAbsent) {
                updatedClockInStatus = "AfterWeekOffAbsent";
                updatedClockOutStatus = "AfterWeekOffAbsent";
              }
            }

            // Check if 'Late - ClockIn' count exceeds the specified limit
            if (updatedClockInStatus === "Late - ClockIn") {
              updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
              countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
            }
            // Check if 'Early - ClockOut' count exceeds the specified limit
            if (updatedClockOutStatus === "Early - ClockOut") {
              updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
              countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
            }

            return {
              ...item,
              clockinstatus: updatedClockInStatus,
              clockoutstatus: updatedClockOutStatus,
            };
          });

          return result;
        } catch (err) {
          console.error("Error in POST request for batch:", batch.data, err);
        }
      }

      async function getAllResults() {
        let allResults = [];
        for (let batch of resultarr) {
          const finaldata = await sendBatchRequest(batch);
          allResults = allResults.concat(finaldata);
        }

        return { allResults }; // Return both results as an object
      }

      getAllResults()
        .then(async (results) => {
          const itemsWithSerialNumber = results.allResults?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            weekoff: item.shift,
            // attendanceauto: getattendancestatus(item),
            daystatus: item.shift === "Not Allotted" ? "ShiftNot Allot" : item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
            // appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            // lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            // loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            // lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
            // modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            // paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            // paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            // paidpresent: getFinalPaid(
            //   getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            //   getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
            // ),
            // lopday: getAssignLeaveDayForLop(
            //   getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))
            // ),
            // paidpresentday: getAssignLeaveDayForPaid(
            //   getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))
            // ),
          }));

          let itemsWithSerialNumberKeyChanged = itemsWithSerialNumber
            .filter((item) => !finalData.some((d) => d.name === item.companyname && (d.weekoff?.toLowerCase() === item.weekoff?.toLowerCase() || d.weekoff === "Week Off" || d.weekoff === "" || d.weekoff === "Not Allot")))
            .map((data) => {
              let getprocess = data.process;
              let findexpval = Number(data.exp) < 1 ? "00" : Number(data.exp) <= 9 ? `0${Number(data.exp)}` : data.exp;

              let getprocessCode = getprocess + findexpval;

              let findSalDetails = targetPoints.find((d) => d.branch === data.branch && d.company === data.company && d.processcode === getprocessCode);

              let findTargetVal = findSalDetails ? Number(findSalDetails.points) : 0;

              return {
                name: data.companyname,
                points: 0,
                point: 0,
                target: findTargetVal,
                date: date,
                empname: data.companyname,
                empcode: data.empcode,
                company: data.company,
                fromtodate: "2000-11-11T00:00:00.000Z$2000-11-11T00:00:00.000Z",
                unit: data.unit,
                team: data.team,
                dateval: "",
                processcode: getprocess,
                exper: data.exp,
                weekoff: data.weekoff === "Not Allotted" ? "Not Allot" : data.weekoff,
                branch: data.branch,
                shiftsts: "Disable",
                daypointsts: data.daystatus ? data.daystatus : "not defined",
                production: 0,
                manual: 0,
                shiftpoints: 0,
                conshiftpoints: 0,
                users: [],
                count: 0,
                avgpoint: 0,
                companyname: data.company,
              };
            });

          const finalDataWithDayStatus = finalData.map((data) => {
            let findUserDayStatus = itemsWithSerialNumber.find((item) => item.username === data.name);

            return {
              ...data,
              daypointsts: findUserDayStatus ? findUserDayStatus.daystatus : "not defined",
            };
          });

          let pointEmployeesWithWeekOff = [...finalDataWithDayStatus, ...itemsWithSerialNumberKeyChanged];
          // console.log(pointEmployeesWithWeekOff, 'pointEmployeesWithWeekOff');

          // console.log(finalData, 'finalData');
          const ans = [
            {
              filename: `ORIGINAL_DAYPOINT_${finaldate}`,
              date: date,
              uploaddata: pointEmployeesWithWeekOff,
              type: "nonexcel",
              document: [],
              addedby: [
                {
                  name: String(username),
                  date: String(new Date()),
                },
              ],
            },
          ];

          let res_Daypoint_Check = await axios.post(SERVICE.CHECK_ISDAYPOINT_CREATED, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: date,
          });
          const checkDaypointAlreadyCreated = res_Daypoint_Check.data.count;

          if (checkDaypointAlreadyCreated === 0) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
              }
            };
            // setLoading(true); // Set loading to true when starting the upload
            xmlhttp.open("POST", SERVICE.ADD_DAY_POINTS);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.send(JSON.stringify(ans));
          }
          setPopupContent("Created Successfully 👍");
          setPopupSeverity("success");
          handleClickOpenPopup();
          setIsloading(false);
          setCreatedayPointLoadPop(false);
          await fetchProductionDay();
          let dateoneafter = new Date(date);
          dateoneafter.setDate(dateoneafter.getDate() + 1);
          let newDateOnePlus = dateoneafter.toISOString().split("T")[0];
          if (type === "popup") {
            handleLastDaypointCreatePopClose();
            handleSelectedDaypointCreatePopOpen(newDateOnePlus);
          } else if (type === "finalpop") {
            handleSelectedDaypointCreatePopClose();
          }
        })
        .catch((error) => {
          setIsloading(false);
          setCreatedayPointLoadPop(false);
          console.error("Error in getting all results:", error);
        });
    } catch (err) {
      console.log(err, "err");
      setCreatedayPointLoadPop(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [deldayPointLoadPop, setDeldayPointLoadPop] = useState(false);
  const handleCurrDayPointDel = async (date, type, uniqueid, beforeProdDay, beforeDayPoint, currDaypoint) => {
    try {
      setDeldayPointLoadPop(true);
      await axios.post(SERVICE.DAYPOINT_DELETE_BYDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });
      setDeldayPointLoadPop(false);
      handleCurrentDaypointDelPopClose();
      // setDelCurrDaypoint({ open: false, date: '',...delCurrDaypoint });
      setPopupContent("Deleted Successfully 👍");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchProductionDay();
      await handleRerunRow(date, type, uniqueid, beforeProdDay, beforeDayPoint, currDaypoint);
    } catch (err) {
      handleCurrentDaypointDelPopClose();
      setDeldayPointLoad(false);
      setDeldayPointLoadPop(false);
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchProductionDayLastData = async (selcDate) => {
    setSelectedDate(selcDate);
    try {
      if (selcDate != "") {
        const [res_Day_temp, res_DayPoint_temp] = await Promise.all([
          axios.post(SERVICE.PRODUCTIONDAY_LASTDATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: selcDate,
          }),
          axios.post(SERVICE.PRODUCTION_DAYPOINT_LASTDATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: selcDate,
          }),
        ]);

        setProdLastDate(res_Day_temp.data.productionupload);
        setProdLastDayPoint(res_DayPoint_temp.data.productionupload);
      }
    } catch (err) {
      setSelectedDate("");
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchProductionDayLastData(selectedDate);
  }, [selectedDate]);

  const handleRerun = async (selcDate, uniqueid, id) => {
    setDeldayPointLoadPop(true);
    try {
      let resCheckPayrun = await axios.post(SERVICE.CHECK_PAYRUN_GENERATED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: selcDate,
      });
      const isPayrunGenerated = resCheckPayrun.data.payruncontrol > 0;
      if (isPayrunGenerated) {
        setPopupContentMalert(`Payrun Already Generated`);
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        let dateoneafter = new Date(selcDate);
        dateoneafter.setDate(dateoneafter.getDate() + 1);
        let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

        const [res_Day_temp, res_DayPoint_temp, res_Curr_Daypoint, res_FileStatus] = await Promise.all([
          axios.post(SERVICE.PRODUCTIONDAY_LASTDATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: selcDate,
          }),
          axios.post(SERVICE.PRODUCTION_DAYPOINT_LASTDATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: selcDate,
          }),
          axios.post(SERVICE.PRODUCTION_DAYPOINT_LASTDATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: newDateOnePlus,
          }),
        ]);
        let beforeProdDay = res_Day_temp.data.productionupload;
        let beforeDayPoint = res_DayPoint_temp.data.productionupload;
        let currDaypoint = res_Curr_Daypoint.data.productionupload;
        setDeldayPointLoadPop(false);
        if (currDaypoint > 0) {
          handleCurrentDaypointDelPopOpen(selcDate, uniqueid, beforeProdDay, beforeDayPoint, currDaypoint);
        } else {
          await handleRerunRow(selcDate, "rerun", uniqueid, beforeProdDay, beforeDayPoint, currDaypoint);
        }
      }
    } catch (err) {
      setDeldayPointLoadPop(false);
      console.log(err);
    }
  };

  const handleRerunRow = async (selcDate, type, uniqueid, beforeProdDay, beforeDayPoint, currDaypoint) => {
    setRerunLoad(id);
    handleCurrentDaypointDelPopClose();
    setDeldayPointLoadPop(true);
    let alertval = "";
    handleProgressUpdate(alertval, "Checking...");
    handleLoaderDialogOpen();
    let dateoneafter = new Date(selcDate);
    dateoneafter.setDate(dateoneafter.getDate() + 1);
    let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

    let dateonebefore = new Date(selcDate);
    dateonebefore.setDate(dateonebefore.getDate() - 1);
    let newDateOneMinus = dateonebefore.toISOString().split("T")[0];
    setIsCheckUnAllotMismatch(true);

    let result;
    try {
      // Fetch all necessary data
      let [result, ResChevkCount, filestatusupload] = await Promise.all([
        axios.post(SERVICE.CHECK_ZERO_MISMATCH_PRESENT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: selcDate,
        }),
        axios.post(SERVICE.GET_UNIQID_FROM_DATE_PRODUPLOAD, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: selcDate,
        }),
        axios.post(SERVICE.PRODUCTION_DAYS_CHECK_FILESTATUS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: selcDate,
        }),
      ]);
      if (ResChevkCount.data.totalSum !== ResChevkCount.data.productionUpload) {
        setIsCheckUnAllotMismatch(false);

        setPopupContentMalert(`Please review the uploaded files. Some data may not have been fully uploaded for these dates ${newDateOneMinus}, ${selcDate}, ${newDateOnePlus}`);

        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
        setIsCheckUnAllotMismatch(false);
        handleLoaderDialogClose();
        setDeldayPointLoad(false);
        setDeldayPointLoadPop(false);
      } else if (result.data.count > 0) {
        setIsCheckUnAllotMismatch(false);
        setDeldayPointLoadPop(false);
        setShowAlert(
          <>
            <p>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            </p>
            <span>{`Please Update these`} </span>
            <p style={{ fontSize: "20px", fontWeight: 900, color: "red" }}>{`${moment(new Date(selcDate)).format("DD-MM-YYYY")}, ${moment(new Date(newDateOnePlus)).format("DD-MM-YYYY")}`} </p>
            <span>{`date's Original/Manual Zero Unitrate Unallot value`}</span>
          </>
        );
        handleClickOpenerr();
        setIsCheckUnAllotMismatch(false);
        handleLoaderDialogClose();
        setDeldayPointLoad(false);
      } else {
        try {
          let startMonthDateMinus = new Date(selcDate);
          let startdate = startMonthDateMinus.setDate(startMonthDateMinus.getDate() - 1);
          let startMonthDate = new Date(startdate);

          let firstDate = new Date(selcDate);
          let enddate = firstDate.setDate(firstDate.getDate() + 1);
          let endMonthDate = new Date(enddate);

          // console.log(daysArray, 'daysArray')
          handleProgressUpdate(alertval, "Checking...");
          handleLoaderDialogOpen();

          handleProgressUpdate(2, "Checking...");
          let res_employee;
          try {
            res_employee = await axios.post(SERVICE.DEPTMONTHSET_PROD_LIMITED, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selcDate,
            });
          } catch (err) {
            console.log(err, "err");
            setIsCheckUnAllotMismatch(false);
            handleLoaderDialogClose();
            setDeldayPointLoad(false);
            setDeldayPointLoadPop(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
          }
          let filteredMonthsets = res_employee.data.departmentdetails;

          handleProgressUpdate(3, "Checking...");

          async function fetchDataInBatches() {
            let batchNumber = 0;
            let allData = [];
            let allusers = [];
            let apiUrl = "";
            let hasMoreData = true;
            let totalBatchNumber = 10;
            // const batchsize = ResChevkCount.data.totalSum > 420000 ? 40000 : ResChevkCount.data.totalSum < 250000 ? 30000 : ResChevkCount.data.totalSum / 9 < 30000 ? 30000 : ResChevkCount.data.totalSum / 9;

            while (hasMoreData) {
              try {
                if (batchNumber === 0) {
                  apiUrl = SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY;
                } else {
                  apiUrl = SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY_ALLBATCH;
                }

                const currentBatch = Number(batchNumber) * 30;
                const beforeBatch = (Number(batchNumber) - 1) * 30;

                const response = await axios.post(
                  apiUrl,
                  batchNumber === 0
                    ? {
                      date: selcDate,
                      // userDates: daysArray,
                      batchNumber: batchNumber,
                      batchSize: 0,
                    }
                    : {
                      date: selcDate,
                      users: allusers.slice(beforeBatch, currentBatch),
                      batchNumber: batchNumber,
                    },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                  }
                );

                if (batchNumber === 0) {
                  allusers = response.data.users || [];
                  totalBatchNumber = Math.ceil(allusers.length / 30);
                }
                const productionupload = response.data.productionupload || [];
                if (batchNumber > 0 && batchNumber > totalBatchNumber + 1) {
                  hasMoreData = false;
                } else {
                  let filtered = productionupload.filter((item) => item != null && item !== undefined);
                  allData = [...allData, ...filtered];

                  batchNumber++;
                  const progress = batchNumber > 0 ? (batchNumber / (totalBatchNumber + 1)) * 5 : 1;
                  handleProgressUpdate(3 + progress, "Checking...");
                }
              } catch (err) {
                console.log(err, "err123");
                setIsCheckUnAllotMismatch(false);
                handleLoaderDialogClose();
                handleApiError(err, setShowAlert, handleClickOpenerr);
                allData = -1;
                console.error("Error fetching data:", err);
                hasMoreData = false;
              }
            }

            return allData;
          }

          fetchDataInBatches().then(async (allData) => {
            try {
              if (allData === -1) {
                setIsCheckUnAllotMismatch(false);
                handleLoaderDialogClose();
                setDeldayPointLoad(false);

                setPopupContentMalert(`something went wrong!`);

                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
                setDeldayPointLoadPop(false);
              } else {
                let datavalue = allData.filter((d) => d != null);

                if (datavalue.length > 0) {
                  await axios.post(SERVICE.PRODDAY_DELETE_BYDATE, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: selcDate,
                  });

                  handleLoaderDialogOpen();

                  handleProgressUpdate(5, "Creating...");

                  const result = [];

                  // Create a map to store the accumulated unitrate values
                  const unitrateMap = {};

                  datavalue.forEach((item) => {
                    const key = item.filename + item.user + item.mode + item.fromtodate; // Generating a unique key based on category and user
                    if (unitrateMap[key]) {
                      // If the key already exists, add the unitrate value
                      unitrateMap[key].points += item.points;
                      unitrateMap[key].shiftpoints += item.shiftpoints;
                    } else {
                      // If the key doesn't exist, create a new entry
                      unitrateMap[key] = { ...item };
                      result.push(unitrateMap[key]); // Add to the result array
                    }
                  });

                  handleProgressUpdate(8, "Creating...");

                  let finalCalData = result.map((item) => {
                    let findMonthStartDate = filteredMonthsets.find((data) => new Date(selcDate) >= new Date(data.fromdate) && new Date(selcDate) <= new Date(data.todate) && data.department === item.department);

                    let findDate = findMonthStartDate ? findMonthStartDate.fromdate : selcDate;
                    const groupedByMonthProcs = {};

                    // Group items by month
                    // item.assignExpLog &&
                    //   item.assignExpLog.length > 0 &&
                    //   item.assignExpLog.forEach((item) => {
                    //     const monthYear = item.updatedate?.split('-').slice(0, 2).join('-');
                    //     if (!groupedByMonthProcs[monthYear]) {
                    //       groupedByMonthProcs[monthYear] = [];
                    //     }
                    //     groupedByMonthProcs[monthYear].push(item);
                    //   });

                    // // Extract the last item of each group
                    // const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                    // // Filter the data array based on the month and year
                    // lastItemsForEachMonthPros.sort((a, b) => {
                    //   return new Date(a.updatedate) - new Date(b.updatedate);
                    // });
                    // // Find the first item in the sorted array that meets the criteria
                    // let filteredItem = null;

                    // for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                    //   const date = lastItemsForEachMonthPros[i].updatedate;

                    //   if (selcDate >= date) {
                    //     filteredItem = lastItemsForEachMonthPros[i];
                    //   } else {
                    //     break;
                    //   }
                    // }

                    // let modevalue = filteredItem;

                    // const calculateMonthsBetweenDates = (startDate, endDate) => {
                    //   if (startDate && endDate) {
                    //     const start = new Date(startDate);
                    //     const end = new Date(endDate);

                    //     let years = end.getFullYear() - start.getFullYear();
                    //     let months = end.getMonth() - start.getMonth();
                    //     let days = end.getDate() - start.getDate();

                    //     // Convert years to months
                    //     months += years * 12;

                    //     // Adjust for negative days
                    //     if (days < 0) {
                    //       months -= 1; // Subtract a month
                    //       days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
                    //     }

                    //     // Adjust for days 15 and above
                    //     if (days >= 15) {
                    //       months += 1; // Count the month if 15 or more days have passed
                    //     }

                    //     return months <= 0 ? 0 : months;
                    //   }

                    //   return 0; // Return 0 if either date is missing
                    // };

                    // // Calculate difference in months between findDate and item.doj
                    // let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
                    // if (modevalue) {
                    //   //findexp end difference yes/no
                    //   if (modevalue.endexp === 'Yes') {
                    //     differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
                    //     //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                    //     if (modevalue.expmode === 'Add') {
                    //       differenceInMonthsexp += parseInt(modevalue.expval);
                    //     } else if (modevalue.expmode === 'Minus') {
                    //       differenceInMonthsexp -= parseInt(modevalue.expval);
                    //     } else if (modevalue.expmode === 'Fix') {
                    //       differenceInMonthsexp = parseInt(modevalue.expval);
                    //     }
                    //   } else {
                    //     differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                    //     // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                    //     if (modevalue.expmode === 'Add') {
                    //       differenceInMonthsexp += parseInt(modevalue.expval);
                    //     } else if (modevalue.expmode === 'Minus') {
                    //       differenceInMonthsexp -= parseInt(modevalue.expval);
                    //     } else if (modevalue.expmode === 'Fix') {
                    //       differenceInMonthsexp = parseInt(modevalue.expval);
                    //     } else {
                    //       // differenceInMonths = parseInt(modevalue.expval);
                    //       differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                    //     }
                    //   }

                    //   //findtar end difference yes/no
                    //   if (modevalue.endtar === 'Yes') {
                    //     differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
                    //     //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                    //     if (modevalue.expmode === 'Add') {
                    //       differenceInMonthstar += parseInt(modevalue.expval);
                    //     } else if (modevalue.expmode === 'Minus') {
                    //       differenceInMonthstar -= parseInt(modevalue.expval);
                    //     } else if (modevalue.expmode === 'Fix') {
                    //       differenceInMonthstar = parseInt(modevalue.expval);
                    //     }
                    //   } else {
                    //     differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                    //     if (modevalue.expmode === 'Add') {
                    //       differenceInMonthstar += parseInt(modevalue.expval);
                    //     } else if (modevalue.expmode === 'Minus') {
                    //       differenceInMonthstar -= parseInt(modevalue.expval);
                    //     } else if (modevalue.expmode === 'Fix') {
                    //       differenceInMonthstar = parseInt(modevalue.expval);
                    //     } else {
                    //       // differenceInMonths = parseInt(modevalue.expval);
                    //       differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                    //     }
                    //   }

                    //   differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                    //   if (modevalue.expmode === 'Add') {
                    //     differenceInMonths += parseInt(modevalue.expval);
                    //   } else if (modevalue.expmode === 'Minus') {
                    //     differenceInMonths -= parseInt(modevalue.expval);
                    //   } else if (modevalue.expmode === 'Fix') {
                    //     differenceInMonths = parseInt(modevalue.expval);
                    //   } else {
                    //     // differenceInMonths = parseInt(modevalue.expval);
                    //     differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                    //   }
                    // } else {
                    //   differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                    //   differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                    //   differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                    // }

                    // let findexpval = differenceInMonthstar < 1 ? '00' : differenceInMonthstar <= 9 ? '0' + differenceInMonthstar : differenceInMonthstar;
                    let findexpval = Number(item.exp) < 1 ? "00" : Number(item.exp) <= 9 ? `0${Number(item.exp)}` : item.exp;
                    let getprocessCode = item.processcode + findexpval;

                    let findSalDetails = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === getprocessCode);

                    let findTargetVal = findSalDetails ? Number(findSalDetails.points) : 0;
                    let roundedPoints = Number(Number(item.points)?.toFixed(5));

                    let avgPointValue = findTargetVal > 0 ? Number(((roundedPoints / findTargetVal) * 100)?.toFixed(5)) : 0;

                    const [findProj] = item.vendor.split("-");

                    let findPrimaryProcess = categoryProcessMap.find((d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Primary" && d.process.slice(-4) === item.processcode?.slice(-4) && findProj === d.project && d.categoryname?.toLowerCase() === item.filename?.toLowerCase());
                    let findSecondayProcess = categoryProcessMap.find((d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Secondary" && d.process === item.processcode && findProj === d.project && d.categoryname.toLowerCase() === item.filename.toLowerCase());

                    let AprocessValue = findPrimaryProcess && findPrimaryProcess.processtypes === "Primary" ? findPrimaryProcess.process : "";
                    let SprocessValue = findSecondayProcess && findSecondayProcess.processtypes === "Secondary" ? findSecondayProcess.process : "";

                    let AlterProcessCode = AprocessValue + findexpval;

                    let findSalDetailsForAlterProcess = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === AlterProcessCode);

                    let findTargetValForAlterProcess = findSalDetailsForAlterProcess ? Number(findSalDetailsForAlterProcess.points) : "";

                    let conTargetValue = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process ? findTargetValForAlterProcess : findTargetVal;

                    let conPoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.points : item.points;
                    let conshiftpoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.shiftpoints : item.shiftpoints;

                    let conavg = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (((findTargetVal / findTargetValForAlterProcess) * item.points) / findTargetVal) * 100 : avgPointValue;

                    return {
                      ...item,
                      experience: item.exp,
                      target: findTargetVal,
                      dateval: item.formatteddatetime,
                      project: findProj,
                      points: roundedPoints,
                      aprocess: AprocessValue,
                      conshiftpoints: conshiftpoints,
                      sprocess: SprocessValue,
                      avgpoint: avgPointValue,
                      contarget: conTargetValue,
                      conpoints: conPoints > 0 ? Number(conPoints).toFixed(5) : conPoints,
                      conavg: conavg > 0 ? Number(conavg).toFixed(5) : conavg,
                    };
                  });

                  let finalRemovedUserData = finalCalData.filter((item) => new Date(item.dojDate) <= new Date(selcDate));
                  // let finalRemovedUserData = finalCalData

                  handleProgressUpdate(8, "Creating...");
                  let resGetUniqid;
                  try {
                    resGetUniqid = await axios.get(SERVICE.PRODUCTION_DAY_UNIQID, {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    });
                  } catch (err) {
                    console.log(err, "err456");
                    setIsCheckUnAllotMismatch(false);
                    handleLoaderDialogClose();
                    setDeldayPointLoad(false);
                    setDeldayPointLoadPop(false);
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                  }
                  let prodDayUniqId = resGetUniqid.data.productionDayid;
                  handleProgressUpdate(9, "Creating...");
                  let resCreate;

                  let filestatusfinal = filestatusupload.data.productionupload === 0 ? "Pending Upload" : "Final";

                  try {
                    resCreate = await axios.post(SERVICE.PRODUCTION_DAY_CREATE, {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                      date: String(selcDate),
                      createddate: String(new Date()),
                      username: String(username),
                      companyname: String(companyname),
                      filestatus: filestatusfinal,
                      uniqueid: uniqueid,
                    });
                  } catch (err) {
                    console.log(err, "err");
                    setIsCheckUnAllotMismatch(false);
                    handleLoaderDialogClose();
                    setDeldayPointLoad(false);
                    setDeldayPointLoadPop(false);
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                  }
                  handleProgressUpdate(9, "Creating...");
                  let res;
                  try {
                    res = await fetch(SERVICE.PRODUCTION_DAY_LIST_CREATE, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                      },
                      body: JSON.stringify(
                        finalRemovedUserData.map((item) => ({
                          ...item,

                          uniqueid: uniqueid,
                          addedby: [
                            {
                              name: String(username),
                              companyname: String(companyname),
                              date: String(new Date()),
                            },
                          ],
                        }))
                      ),
                    });
                  } catch (err) {
                    console.log(err, "err");
                    handleLoaderDialogClose();
                    setDeldayPointLoad(false);
                    setDeldayPointLoadPop(false);
                    setIsCheckUnAllotMismatch(false);
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                  }

                  handleProgressUpdate(10, "Created...");
                  await fetchProductionDay();
                  handleLoaderDialogClose();
                  setDeldayPointLoad(false);
                  setDeldayPointLoadPop(false);
                  setIsCheckUnAllotMismatch(false);
                  if (beforeProdDay > 0 && beforeDayPoint > 0) {
                    handleLastDayDelPopOpen(newDateOneMinus);
                  } else if (beforeProdDay > 0 && beforeDayPoint == 0) {
                    handleLastProdDayCreatePopOpen(newDateOneMinus);
                  } else if (beforeProdDay == 0 && beforeDayPoint == 0) {
                    handleLastProdDayCreatePopOpenNew(newDateOneMinus);
                  }

                  // handleLastDaypointCreatePopOpen(selcDate, type);
                } else {
                  setIsCheckUnAllotMismatch(false);
                  handleLoaderDialogClose();
                  setDeldayPointLoad(false);

                  setPopupContentMalert("No data to Create");
                  setDeldayPointLoadPop(false);
                  setPopupSeverityMalert("warning");
                  handleClickOpenPopupMalert();
                }
              }
            } catch (err) {
              console.log(err, "err");
              setIsCheckUnAllotMismatch(false);
              handleLoaderDialogClose();
              setDeldayPointLoad(false);
              setDeldayPointLoadPop(false);
              handleApiError(err, setShowAlert, handleClickOpenerr);
              console.error("Error fetching data:", err);
            }
          });
        } catch (err) {
          console.log(err, "err");
          setDeldayPointLoad(false);
          setDeldayPointLoadPop(false);
          setBankdetail(false);
          setIsCheckUnAllotMismatch(false);
          handleLoaderDialogClose();
          handleApiError(err, setShowAlert, handleClickOpenerr);
        }
      }
    } catch (err) {
      console.log(err, "err");
      setDeldayPointLoad(false);
      setDeldayPointLoadPop(false);
      setIsCheckUnAllotMismatch(false);
      handleLoaderDialogClose();
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
    },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.companyname,
    },
    {
      field: "createddate",
      headerName: "Created Date",
      flex: 0,
      width: 180,
      hide: !columnVisibility.createddate,
    },
    {
      field: "status",
      headerName: "Day Point Status",
      flex: 0,
      width: 130,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => {
        return (
          <Grid sx={{ display: "flex", borderRadius: "0px" }}>
            <Chip sx={{ height: "25px" }} color={params.row.status === "Created" ? "success" : "warning"} variant="outlined" label={params.row.status} />
          </Grid>
        );
      },
    },
    {
      field: "filestatus",
      headerName: "File Status",
      flex: 0,
      width: 140,
      hide: !columnVisibility.filestatus,
      renderCell: (params) => {
        return (
          <Grid sx={{ display: "flex" }}>
            {params.row.filestatus === "" || params.row.filestatus === undefined ? null : (
              <Chip
                label={params.row.filestatus}
                size="small"
                sx={{
                  "& .MuiChip-label": {
                    color: "white", // Change to your desired color
                  },
                  background: params.row.filestatus === "Final" ? "#458648" : params.row.filestatus === "Pending Upload" ? "#d54c4c" : "#db833a",
                }}
                icon={params.row.filestatus === "Final" ? <CheckCircleOutlineIcon style={{ color: "white" }} /> : params.row.filestatus === "Pending Upload" ? <ReportProblemOutlinedIcon style={{ color: "white" }} /> : <PendingOutlinedIcon style={{ color: "white" }} />}
              />
            )}
          </Grid>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 230,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => {
        return (
          <Grid sx={{ display: "flex", gap: "8px" }}>
            {isUserRoleCompare?.includes("vproductionday") && (
              <Button color="success" onClick={(e) => handleViewData(params.row.uniqueid, params.row.date)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
                View
              </Button>
            )}

            {isUserRoleCompare?.includes("vproductionday") && (
              <Button color="info" disabled={params.row.filestatus == "Final"} onClick={(e) => handleRerun(params.row.dateold, params.row.uniqueid, params.row.id)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
                Re run
              </Button>
            )}

            {isUserRoleCompare?.includes("dproductionday") && (
              <Button color="error" disabled={params.row.status === "Created"} onClick={(e) => handleDelete(params.row.uniqueid, params.row.id, params.row.date)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
                Delete
              </Button>
            )}
          </Grid>
        );
      },
    },
    {
      field: "actionsdaypoint",
      headerName: "Daypoint Actions",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actionsdaypoint,
      headerClassName: "bold-header",
      renderCell: (params) => {
        return (
          <Grid sx={{ display: "flex", gap: "8px" }}>
            {isUserRoleCompare?.includes("vproductionday") &&
              (params.row.status === "Created" ? (
                <Button
                  color="warning"
                  onClick={(e) => {
                    rowDataDaypoint(params.row.dateold);
                  }}
                  variant="contained"
                  sx={{ textTransform: "capitalize", backgroundColor: "#ff5722", padding: "4px" }}
                >
                  <RemoveCircleIcon /> Daypoint Delete
                </Button>
              ) : (
                <LoadingButton
                  // disabled={dataArrayLength > 0}
                  disabled={isloading === params.row.dateold}
                  loading={isloading === params.row.dateold}
                  // onClick={(e) => handleSubmitDaypointCreate(params.row.dateold)}
                  onClick={(e) => handleClickOpenDaypointCreateConfirmPopup(params.row.dateold)}
                  sx={{ textTransform: "capitalize", backgroundColor: "#1b8971", "&:hover": { backgroundColor: "#1b8971" }, color: "white", padding: "4px" }}
                  //
                  loadingPosition="end"
                >
                  <AddCircleIcon /> Daypoint Create
                </LoadingButton>
              ))}
          </Grid>
        );
      },
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      date: item.date,
      dateold: item.dateold,
      username: item.username,
      companyname: item.companyname,
      createddate: item.createddate,
      fromtodate: item.fromtodate,
      uniqueid: item.uniqueid,
      status: item.status,
      // actionsdaypoint: item.actionsdaypoint,
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

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    fetchProductionDay();
  }, [selectedDayPointCreate, isBankdetail, beforeDaypointDel, isErrorOpenDayPoint]);

  useEffect(() => {
    // fetchDepartmentMonthsets();
    setColumnVisibility(initialColumnVisibility);
  }, []);

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
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
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

  const [itemsView, setItemsView] = useState([]);

  const addSerialNumberView = async () => {
    try {
      const itemsWithSerialNumber = viewData?.map((item, index) => {
        const [year, month, date] = item.date.split("-");

        return {
          ...item,
          serialNumber: index + 1,
          date: `${date}-${month}-${year}`,
          conavg: item.conavg ? Number(item.conavg) : item.conavg,
          conpoints: item.conpoints ? Number(item.conpoints) : 0,
          contarget: item.contarget ? Number(item.contarget) : 0,
          avgpoint: item.avgpoint ? Number(item.avgpoint) : 0,
          points: item.points ? Number(item.points) : 0,
          target: item.target ? Number(item.target) : 0,
          experience: item.experience ? Number(item.experience) : 0,
        };
      });
      setItemsView(itemsWithSerialNumber);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    addSerialNumberView();
  }, [viewData]);

  //Datatable
  const handlePageChangeView = (newPage) => {
    setPageView(newPage);
  };

  const handlePageSizeChangeView = (event) => {
    setPageSizeView(Number(event.target.value));

    setPageView(1);
  };

  //datatable....
  const handleSearchChangeView = (event) => {
    setPageView(1);
    setSearchQueryView(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsview = searchQueryView.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasView = itemsView?.filter((item) => {
    return searchTermsview.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataView = filteredDatasView?.slice((pageView - 1) * pageSizeView, pageView * pageSizeView);

  const totalPageViews = Math.ceil(filteredDatasView?.length / pageSizeView);

  const visiblePagesView = Math.min(totalPageViews, 3);

  const firstVisiblePageView = Math.max(1, pageView - 1);
  const lastVisiblePageView = Math.min(firstVisiblePageView + visiblePagesView - 1, totalPageViews);

  const pageNumbersView = [];

  const indexOfLastItemView = pageView * pageSizeView;
  const indexOfFirstItemView = indexOfLastItemView - pageSizeView;

  for (let i = firstVisiblePageView; i <= lastVisiblePageView; i++) {
    pageNumbersView.push(i);
  }

  const columnDataTableView = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityView.serialNumber,
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibilityView.mode,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 140,
      hide: !columnVisibilityView.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 80,
      hide: !columnVisibilityView.Unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 80,
      hide: !columnVisibilityView.team,
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 220,
      hide: !columnVisibilityView.empname,
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 150,
      hide: !columnVisibilityView.empcode,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 150,
      hide: !columnVisibilityView.department,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 110,
      hide: !columnVisibilityView.date,
    },
    {
      field: "vendor",
      headerName: "Project-Vendor",
      flex: 0,
      width: 180,
      hide: !columnVisibilityView.vendor,
    },
    {
      field: "user",
      headerName: "User",
      flex: 0,
      width: 100,
      hide: !columnVisibilityView.user,
    },
    {
      field: "filename",
      headerName: "Category",
      flex: 0,
      width: 300,
      hide: !columnVisibilityView.filename,
    },
    {
      field: "processcode",
      headerName: "Process Code",
      flex: 0,
      width: 120,
      hide: !columnVisibilityView.processcode,
    },
    {
      field: "experience",
      headerName: "Exp",
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.experience,
    },
    {
      field: "weekoff",
      headerName: "Shift",
      flex: 0,
      width: 150,
      hide: !columnVisibilityView.weekoff,
    },
    {
      field: "target",
      headerName: "Target",
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.target,
    },
    {
      field: "points",
      headerName: "Points",
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.points,
    },
    {
      field: "avgpoint",
      headerName: "Avg Point",
      flex: 0,
      width: 100,
      hide: !columnVisibilityView.avgpoint,
    },
    {
      field: "aprocess",
      headerName: "P Process",
      flex: 0,
      width: 120,
      hide: !columnVisibilityView.aprocess,
    },
    {
      field: "sprocess",
      headerName: "S Process",
      flex: 0,
      width: 120,
      hide: !columnVisibilityView.sprocess,
    },
    {
      field: "contarget",
      headerName: "Con Tar",
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.contarget,
    },
    {
      field: "conpoints",
      headerName: "Con Points",
      flex: 0,
      width: 110,
      hide: !columnVisibilityView.conpoints,
    },
    {
      field: "conavg",
      headerName: "Con Avg",
      flex: 0,
      width: 110,
      hide: !columnVisibilityView.conavg,
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 0,
      width: 110,
      hide: !columnVisibilityView.action,
      renderCell: (params) => {
        return (
          <Grid sx={{ display: "flex", gap: "8px" }}>
            {isUserRoleCompare?.includes("vproductionday") && (
              // <Button color="primary"
              //  onClick={(e) => handleViewDataCategory(params.row.user, params.row.filename, params.row.fromtodate, params)}
              //   variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
              //   View
              // </Button>
              <LoadingButton onClick={(e) => handleViewDataCategory(params.row.user, params.row.filename, params.row.fromtodate, params)} loading={viewbtnload === params.row.id} color="primary" loadingPosition="end" variant="contained">
                View
              </LoadingButton>
            )}
          </Grid>
        );
      },
    },
  ];

  const rowDataTableView = filteredDataView.map((item, index) => {
    return {
      ...item,
      mode: item.mode,
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      vendor: item.vendor,
      date: item.date,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      department: item.department,
      empname: item.empname,
      createddate: item.createddate,
    };
  });

  // Show All Columns functionality
  const handleShowAllColumnsView = () => {
    const updatedVisibility = { ...columnVisibilityView };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setcolumnVisibilityView(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityView");
    if (savedVisibility) {
      setcolumnVisibilityView(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityView", JSON.stringify(columnVisibilityView));
  }, [columnVisibilityView]);

  useEffect(() => {
    // fetchDepartmentMonthsets();
    setcolumnVisibilityView(initialcolumnVisibilityView);
  }, []);

  //   useEffect(() => {
  //     fetchDepartmentMonthsets();
  //   }, []);

  // // Function to filter columns based on search query
  const filteredColumnsView = columnDataTableView.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageView.toLowerCase()));

  // Manage Columns functionality
  const togglecolumnVisibilityView = (field) => {
    setcolumnVisibilityView((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentView = (
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
        onClick={handleCloseManageColumnsView}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageView} onChange={(e) => setSearchQueryManageView(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsView.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityView[column.field]} onChange={() => togglecolumnVisibilityView(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setcolumnVisibilityView(initialcolumnVisibilityView)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newcolumnVisibilityView = {};
                columnDataTableView.forEach((column) => {
                  newcolumnVisibilityView[column.field] = false; // Set hide property to true
                });
                setcolumnVisibilityView(newcolumnVisibilityView);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [alert, setAlert] = useState("");
  const [isCheckUnAllotMismatch, setIsCheckUnAllotMismatch] = useState(false);
  const [prodLastDayPoint, setProdLastDayPoint] = useState(0);
  const [prodLastDay, setProdLastDay] = useState(0);

  const checkLastDayPoint = async (date) => {
    setSelectedDate(date);
    try {
      if (date != "") {
        let dateonebefore = new Date(date);
        dateonebefore.setDate(dateonebefore.getDate() - 1);
        let newDateOneMinus = dateonebefore.toISOString().split("T")[0];

        // Fetch all necessary data
        let [res_LastDayPoint, res_Day] = await Promise.all([
          axios.post(SERVICE.CHECK_DAYPOINT_ORG_BYDATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: newDateOneMinus,
          }),
          axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: newDateOneMinus,
          }),
        ]);

        setProdLastDayPoint(res_LastDayPoint.data.count);
        setProdLastDay(res_Day.data.countDay);
      }
    } catch (err) {
      setSelectedDate("");
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [rerunLoader, setRerunload] = useState(false);

  const handleFilterSaveRerun = async (selcDate, type) => {
    handleClickCloseProdDayCreate();
    handleClickCloseProdDayRerun();
    try {
      setRerunload(true);
      let alertval = "";
      handleProgressUpdate(alertval, "Checking...");
      handleLoaderDialogOpen();

      setIsCheckUnAllotMismatch(true);

      if (selcDate === "") {
        setIsCheckUnAllotMismatch(false);

        setPopupContentMalert("Please Select Date");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        handleClickCloseProdDayCreate();
        handleClickCloseProdDayRerun();
      } else {
        let dateoneafter = new Date(selcDate);
        dateoneafter.setDate(dateoneafter.getDate() + 1);
        let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

        let dateonebefore = new Date(selcDate);
        dateonebefore.setDate(dateonebefore.getDate() - 1);
        let newDateOneMinus = dateonebefore.toISOString().split("T")[0];
        setIsCheckUnAllotMismatch(true);

        try {
          // Fetch all necessary data
          let [CHECK_ZERO, ResChevkCount, filestatusupload] = await Promise.all([
            axios.post(SERVICE.CHECK_ZERO_MISMATCH_PRESENT, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selcDate,
            }),
            axios.post(SERVICE.GET_UNIQID_FROM_DATE_PRODUPLOAD, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selcDate,
            }),
            axios.post(SERVICE.PRODUCTION_DAYS_CHECK_FILESTATUS, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selcDate,
            }),
          ]);

          if (ResChevkCount.data.totalSum !== ResChevkCount.data.productionUpload) {
            setIsCheckUnAllotMismatch(false);
            setPopupContentMalert(`Please review the uploaded files. Some data may not have been fully uploaded for these dates ${newDateOneMinus}, ${selcDate}, ${newDateOnePlus}`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            handleClickCloseProdDayCreate();
            handleClickCloseProdDayRerun();
            setIsCheckUnAllotMismatch(false);
            handleLoaderDialogClose();
            setRerunload(false);
          } else if (CHECK_ZERO.data.count > 0) {
            setIsCheckUnAllotMismatch(false);
            handleClickCloseProdDayCreate();
            handleClickCloseProdDayRerun();
            setPopupContentMalert(
              `Please Update these dates (${moment(new Date(selcDate)).format("DD-MM-YYYY")}, ${moment(new Date(newDateOnePlus)).format("DD-MM-YYYY")})
                 Original/Manual Zero Unitrate Unalloted values`
            );

            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();

            setIsCheckUnAllotMismatch(false);
            handleLoaderDialogClose();
            setRerunload(false);
          } else {
            try {
              handleProgressUpdate(alertval, "Checking...");
              handleLoaderDialogOpen();

              handleProgressUpdate(2, "Checking...");

              handleProgressUpdate(3, "Checking...");

              async function fetchDataInBatches() {
                let batchNumber = 0;
                let allData = [];
                let hasMoreData = true;
                let response;
                let allusers = [];
                let apiUrl;
                let totalBatchNumber = 6;
                while (hasMoreData) {
                  try {
                    if (batchNumber === 0) {
                      apiUrl = SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY;
                    } else {
                      apiUrl = SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY_ALLBATCH;
                    }
                    const currentBatch = Number(batchNumber) * 30;
                    const beforeBatch = (Number(batchNumber) - 1) * 30;
                    const response = await axios.post(
                      apiUrl,
                      batchNumber === 0
                        ? {
                          date: selcDate,
                          // userDates: daysArray,
                          batchNumber: batchNumber,
                          batchSize: 0,
                        }
                        : {
                          date: selcDate,
                          users: allusers.slice(beforeBatch, currentBatch),
                          batchNumber: batchNumber,
                        },
                      {
                        headers: {
                          Authorization: `Bearer ${auth.APIToken}`,
                        },
                      }
                    );

                    if (batchNumber === 0) {
                      allusers = response.data.users || [];
                      totalBatchNumber = Math.ceil(allusers.length / 30);
                    }
                    const productionupload = response.data.productionupload || [];
                    if (batchNumber > 0 && batchNumber > totalBatchNumber + 1) {
                      hasMoreData = false;
                    } else {
                      let filtered = productionupload.filter((item) => item != null && item !== undefined);
                      allData = [...allData, ...filtered];

                      batchNumber++;
                      const progress = batchNumber > 0 ? (batchNumber / (totalBatchNumber + 1)) * 5 : 1;
                      handleProgressUpdate(3 + progress, "Checking...");
                    }
                  } catch (err) {
                    console.log(err.response.data.message, "err123888");
                    setIsCheckUnAllotMismatch(false);
                    handleLoaderDialogClose();

                    setPopupContentMalert(err.response.data.message === "shifttiming" ? "Shifttime value is undefined" : "something went wrong!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();

                    allData = -1;

                    hasMoreData = false;
                  }
                }

                return allData;
              }

              fetchDataInBatches().then(async (allData) => {
                try {
                  if (allData === -1) {
                    setRerunload(false);
                    setIsCheckUnAllotMismatch(false);
                    handleLoaderDialogClose();
                    handleClickCloseProdDayCreate();
                    handleClickCloseProdDayRerun();
                    setPopupContentMalert("Something went wrong!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                  } else {
                    // if (type === 'rerun') {
                    let res_Day;

                    res_Day = await axios.post(SERVICE.PRODDAY_DELETE_BYDATE, {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                      date: selcDate,
                    });
                    // }

                    let datavalue = allData.filter((d) => d != null);

                    if (datavalue.length > 0) {
                      await axios.post(SERVICE.PRODDAY_DELETE_BYDATE, {
                        headers: {
                          Authorization: `Bearer ${auth.APIToken}`,
                        },
                        date: selcDate,
                      });
                      handleLoaderDialogOpen();

                      handleProgressUpdate(5, "Creating...");

                      const result = [];

                      const unitrateMap = {};

                      datavalue.forEach((item) => {
                        const key = item.filename + item.user + item.mode + item.fromtodate; // Generating a unique key based on category and user
                        if (unitrateMap[key]) {
                          // If the key already exists, add the unitrate value
                          unitrateMap[key].points += item.points;
                          unitrateMap[key].shiftpoints += item.shiftpoints;
                        } else {
                          // If the key doesn't exist, create a new entry
                          unitrateMap[key] = { ...item };
                          result.push(unitrateMap[key]); // Add to the result array
                        }
                      });

                      handleProgressUpdate(8, "Creating...");

                      let finalCalData = result.map((item) => {
                        // let findMonthStartDate = filteredMonthsets.find((data) => new Date(selcDate) >= new Date(data.fromdate) && new Date(selcDate) <= new Date(data.todate) && data.department === item.department);

                        // let findDate = findMonthStartDate ? findMonthStartDate.fromdate : selcDate;
                        // const groupedByMonthProcs = {};

                        // // Group items by month
                        // item.assignExpLog &&
                        //   item.assignExpLog.length > 0 &&
                        //   item.assignExpLog.forEach((item) => {
                        //     const monthYear = item.updatedate?.split('-').slice(0, 2).join('-');
                        //     if (!groupedByMonthProcs[monthYear]) {
                        //       groupedByMonthProcs[monthYear] = [];
                        //     }
                        //     groupedByMonthProcs[monthYear].push(item);
                        //   });

                        // // Extract the last item of each group
                        // const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                        // // Filter the data array based on the month and year
                        // lastItemsForEachMonthPros.sort((a, b) => {
                        //   return new Date(a.updatedate) - new Date(b.updatedate);
                        // });
                        // // Find the first item in the sorted array that meets the criteria
                        // let filteredItem = null;

                        // for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                        //   const date = lastItemsForEachMonthPros[i].updatedate;

                        //   if (selcDate >= date) {
                        //     filteredItem = lastItemsForEachMonthPros[i];
                        //   } else {
                        //     break;
                        //   }
                        // }

                        // let modevalue = filteredItem;

                        // const calculateMonthsBetweenDates = (startDate, endDate) => {
                        //   if (startDate && endDate) {
                        //     const start = new Date(startDate);
                        //     const end = new Date(endDate);

                        //     let years = end.getFullYear() - start.getFullYear();
                        //     let months = end.getMonth() - start.getMonth();
                        //     let days = end.getDate() - start.getDate();

                        //     // Convert years to months
                        //     months += years * 12;

                        //     // Adjust for negative days
                        //     if (days < 0) {
                        //       months -= 1; // Subtract a month
                        //       days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
                        //     }

                        //     // Adjust for days 15 and above
                        //     if (days >= 15) {
                        //       months += 1; // Count the month if 15 or more days have passed
                        //     }

                        //     return months <= 0 ? 0 : months;
                        //   }

                        //   return 0; // Return 0 if either date is missing
                        // };

                        // // Calculate difference in months between findDate and item.doj
                        // let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
                        // if (modevalue) {
                        //   //findexp end difference yes/no
                        //   if (modevalue.endexp === 'Yes') {
                        //     differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
                        //     //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                        //     if (modevalue.expmode === 'Add') {
                        //       differenceInMonthsexp += parseInt(modevalue.expval);
                        //     } else if (modevalue.expmode === 'Minus') {
                        //       differenceInMonthsexp -= parseInt(modevalue.expval);
                        //     } else if (modevalue.expmode === 'Fix') {
                        //       differenceInMonthsexp = parseInt(modevalue.expval);
                        //     }
                        //   } else {
                        //     differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                        //     // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                        //     if (modevalue.expmode === 'Add') {
                        //       differenceInMonthsexp += parseInt(modevalue.expval);
                        //     } else if (modevalue.expmode === 'Minus') {
                        //       differenceInMonthsexp -= parseInt(modevalue.expval);
                        //     } else if (modevalue.expmode === 'Fix') {
                        //       differenceInMonthsexp = parseInt(modevalue.expval);
                        //     } else {
                        //       // differenceInMonths = parseInt(modevalue.expval);
                        //       differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                        //     }
                        //   }

                        //   //findtar end difference yes/no
                        //   if (modevalue.endtar === 'Yes') {
                        //     differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
                        //     //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                        //     if (modevalue.expmode === 'Add') {
                        //       differenceInMonthstar += parseInt(modevalue.expval);
                        //     } else if (modevalue.expmode === 'Minus') {
                        //       differenceInMonthstar -= parseInt(modevalue.expval);
                        //     } else if (modevalue.expmode === 'Fix') {
                        //       differenceInMonthstar = parseInt(modevalue.expval);
                        //     }
                        //   } else {
                        //     differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                        //     if (modevalue.expmode === 'Add') {
                        //       differenceInMonthstar += parseInt(modevalue.expval);
                        //     } else if (modevalue.expmode === 'Minus') {
                        //       differenceInMonthstar -= parseInt(modevalue.expval);
                        //     } else if (modevalue.expmode === 'Fix') {
                        //       differenceInMonthstar = parseInt(modevalue.expval);
                        //     } else {
                        //       // differenceInMonths = parseInt(modevalue.expval);
                        //       differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                        //     }
                        //   }

                        //   differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                        //   if (modevalue.expmode === 'Add') {
                        //     differenceInMonths += parseInt(modevalue.expval);
                        //   } else if (modevalue.expmode === 'Minus') {
                        //     differenceInMonths -= parseInt(modevalue.expval);
                        //   } else if (modevalue.expmode === 'Fix') {
                        //     differenceInMonths = parseInt(modevalue.expval);
                        //   } else {
                        //     // differenceInMonths = parseInt(modevalue.expval);
                        //     differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                        //   }
                        // } else {
                        //   differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                        //   differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                        //   differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                        // }

                        // let findexpval = differenceInMonthstar < 1 ? '00' : differenceInMonthstar <= 9 ? '0' + differenceInMonthstar : differenceInMonthstar;
                        let findexpval = Number(item.exp) < 1 ? "00" : Number(item.exp) <= 9 ? `0${Number(item.exp)}` : item.exp;
                        let getprocessCode = item.processcode + findexpval;

                        let findSalDetails = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === getprocessCode);

                        let findTargetVal = findSalDetails ? Number(findSalDetails.points) : 0;
                        let roundedPoints = Number(Number(item.points)?.toFixed(5));

                        let avgPointValue = findTargetVal > 0 ? Number(((roundedPoints / findTargetVal) * 100)?.toFixed(5)) : 0;

                        const [findProj] = item.vendor.split("-");

                        let findPrimaryProcess = categoryProcessMap.find(
                          (d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Primary" && d.process.slice(-4) === (item.processcode ? item.processcode?.slice(-4) : item.processcode) && findProj === d.project && d.categoryname?.toLowerCase() === item.filename?.toLowerCase()
                        );
                        let findSecondayProcess = categoryProcessMap.find((d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Secondary" && d.process === item.processcode && findProj === d.project && d.categoryname.toLowerCase() === item.filename.toLowerCase());

                        let AprocessValue = findPrimaryProcess && findPrimaryProcess.processtypes === "Primary" ? findPrimaryProcess.process : "";
                        let SprocessValue = findSecondayProcess && findSecondayProcess.processtypes === "Secondary" ? findSecondayProcess.process : "";

                        let AlterProcessCode = AprocessValue + findexpval;

                        let findSalDetailsForAlterProcess = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === AlterProcessCode);

                        let findTargetValForAlterProcess = findSalDetailsForAlterProcess ? Number(findSalDetailsForAlterProcess.points) : "";

                        let conTargetValue = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process ? findTargetValForAlterProcess : findTargetVal;

                        let conPoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.points : item.points;
                        let conshiftpoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.shiftpoints : item.shiftpoints;

                        let conavg = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (((findTargetVal / findTargetValForAlterProcess) * item.points) / findTargetVal) * 100 : avgPointValue;

                        return {
                          ...item,
                          experience: item.exp,
                          target: findTargetVal,

                          project: findProj,
                          points: roundedPoints,
                          aprocess: AprocessValue,
                          conshiftpoints: conshiftpoints,
                          sprocess: SprocessValue,
                          avgpoint: avgPointValue,
                          contarget: conTargetValue,
                          conpoints: conPoints > 0 ? Number(Number(conPoints).toFixed(5)) : 0,
                          conavg: conavg > 0 ? Number(Number(conavg).toFixed(5)) : 0,
                        };
                      });

                      let finalRemovedUserData = finalCalData.filter((item) => new Date(item.dojDate) <= new Date(selcDate));
                      // let finalRemovedUserData = finalCalData

                      handleProgressUpdate(8, "Creating...");
                      if (finalRemovedUserData.length > 0) {
                        let resGetUniqid;
                        try {
                          resGetUniqid = await axios.get(SERVICE.PRODUCTION_DAY_UNIQID, {
                            headers: {
                              Authorization: `Bearer ${auth.APIToken}`,
                            },
                          });
                        } catch (err) {
                          console.log(err, "err456");
                          setIsCheckUnAllotMismatch(false);
                          handleLoaderDialogClose();
                          setRerunload(false);
                          handleClickCloseProdDayCreate();
                          handleClickCloseProdDayRerun();

                          handleApiError(err, setShowAlert, handleClickOpenerr);
                        }
                        let prodDayUniqId = resGetUniqid.data.productionDayid;
                        handleProgressUpdate(9, "Creating...");
                        let resCreate;
                        let filestatusfinal = filestatusupload.data.productionupload === 0 ? "Pending Upload" : "Final";
                        try {
                          resCreate = await axios.post(SERVICE.PRODUCTION_DAY_CREATE, {
                            headers: {
                              Authorization: `Bearer ${auth.APIToken}`,
                            },
                            date: String(selcDate),
                            createddate: String(new Date()),
                            username: String(username),
                            filestatus: filestatusfinal,
                            companyname: String(companyname),
                            uniqueid: Number(prodDayUniqId) + 1,
                          });
                        } catch (err) {
                          console.log(err, "err");
                          setIsCheckUnAllotMismatch(false);
                          handleLoaderDialogClose();
                          handleClickCloseProdDayCreate();
                          handleClickCloseProdDayRerun();
                          handleApiError(err, setShowAlert, handleClickOpenerr);
                        }
                        handleProgressUpdate(9, "Creating...");
                        let res;
                        try {
                          res = await fetch(SERVICE.PRODUCTION_DAY_LIST_CREATE, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json;charset=UTF-8",
                            },
                            body: JSON.stringify(
                              finalRemovedUserData.map((item) => ({
                                ...item,

                                uniqueid: Number(prodDayUniqId) + 1,
                                addedby: [
                                  {
                                    name: String(username),
                                    companyname: String(companyname),
                                    date: String(new Date()),
                                  },
                                ],
                              }))
                            ),
                          });
                        } catch (err) {
                          console.log(err, "err");
                          handleLoaderDialogClose();
                          setIsCheckUnAllotMismatch(false);
                          handleClickCloseProdDayCreate();
                          handleClickCloseProdDayRerun();
                          handleApiError(err, setShowAlert, handleClickOpenerr);
                        }

                        handleProgressUpdate(10, "Created...");
                        await fetchProductionDay();
                        handleLoaderDialogClose();
                        handleClickCloseProdDayCreate();
                        handleClickCloseProdDayRerun();
                        handleClickOpenCreateBeforeDayPoint(selcDate);
                        setRerunload(false);
                        setIsCheckUnAllotMismatch(false);
                      } else {
                        setIsCheckUnAllotMismatch(false);
                        handleLoaderDialogClose();
                        handleClickCloseProdDayCreate();
                        handleClickCloseProdDayRerun();
                        setPopupContentMalert("No data to Create");
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert();
                        setRerunload(false);
                      }
                    } else {
                      setIsCheckUnAllotMismatch(false);
                      handleLoaderDialogClose();
                      handleClickCloseProdDayCreate();
                      handleClickCloseProdDayRerun();
                      setPopupContentMalert("No data to Create");
                      setPopupSeverityMalert("info");
                      handleClickOpenPopupMalert();
                      setRerunload(false);
                    }
                  }
                } catch (err) {
                  console.log(err, "err");
                  setIsCheckUnAllotMismatch(false);
                  handleClickCloseProdDayCreate();
                  handleClickCloseProdDayRerun();
                  handleLoaderDialogClose();
                  setRerunload(false);
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  console.error("Error fetching data:", err);
                }
              });
            } catch (err) {
              setRerunload(false);
              console.log(err, "err");
              handleClickCloseProdDayCreate();
              handleClickCloseProdDayRerun();
              setBankdetail(false);
              setIsCheckUnAllotMismatch(false);
              handleLoaderDialogClose();
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }
        } catch (err) {
          setRerunload(false);
          console.log(err, "err");
          handleClickCloseProdDayCreate();
          handleClickCloseProdDayRerun();
          setIsCheckUnAllotMismatch(false);
          handleLoaderDialogClose();
          handleApiError(err, setShowAlert, handleClickOpenerr);
        }
      }
    } catch (err) {
      setRerunload(false);
      console.log(err, "err");
      handleClickCloseProdDayCreate();
      setBankdetail(false);
      setIsCheckUnAllotMismatch(false);
      handleLoaderDialogClose();
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleFilterSave = async (selcDate, type, beforeday, beforedaypoint) => {
    try {
      let alertval = "";
      handleProgressUpdate(alertval, "Checking...");
      handleLoaderDialogOpen();

      setIsCheckUnAllotMismatch(true);
      let res_Day;
      try {
        res_Day = await axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: selcDate,
        });
      } catch (err) {
        console.log(err, "err");
        setIsCheckUnAllotMismatch(false);
        handleLoaderDialogClose();
        setBankdetail(false);
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }

      let checkDate = res_Day.data.countDay > 0;

      if (selcDate === "") {
        setIsCheckUnAllotMismatch(false);

        setPopupContentMalert("Please Select Date");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (checkDate) {
        setIsCheckUnAllotMismatch(false);

        setPopupContentMalert("Already this Date Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        handleLoaderDialogClose();
        setBankdetail(false);
        setIsCheckUnAllotMismatch(false);
      } else {
        let dateoneafter = new Date(selcDate);
        dateoneafter.setDate(dateoneafter.getDate() + 1);
        let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

        let dateonebefore = new Date(selcDate);
        dateonebefore.setDate(dateonebefore.getDate() - 1);
        let newDateOneMinus = dateonebefore.toISOString().split("T")[0];
        setIsCheckUnAllotMismatch(true);

        try {
          // Fetch all necessary data
          let [CHECK_ZERO, ResChevkCount, filestatusupload] = await Promise.all([
            axios.post(SERVICE.CHECK_ZERO_MISMATCH_PRESENT, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selcDate,
            }),
            axios.post(SERVICE.GET_UNIQID_FROM_DATE_PRODUPLOAD, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selcDate,
            }),
            axios.post(SERVICE.PRODUCTION_DAYS_CHECK_FILESTATUS, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selcDate,
            }),
          ]);

          if (ResChevkCount.data.totalSum !== ResChevkCount.data.productionUpload) {
            setIsCheckUnAllotMismatch(false);

            setPopupContentMalert(`Please review the uploaded files. Some data may not have been fully uploaded for these dates ${newDateOneMinus}, ${selcDate}, ${newDateOnePlus}`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

            setIsCheckUnAllotMismatch(false);
            handleLoaderDialogClose();
          } else if (CHECK_ZERO.data.count > 0) {
            setIsCheckUnAllotMismatch(false);

            setPopupContentMalert(
              `Please Update these dates (${moment(new Date(selcDate)).format("DD-MM-YYYY")}, ${moment(new Date(newDateOnePlus)).format("DD-MM-YYYY")})
                 Original/Manual Zero Unitrate Unalloted values`
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();

            setIsCheckUnAllotMismatch(false);
            handleLoaderDialogClose();
          } else {
            try {
              let startMonthDateMinus = new Date(selcDate);
              let startdate = startMonthDateMinus.setDate(startMonthDateMinus.getDate() - 1);
              let startMonthDate = new Date(startdate);

              let firstDate = new Date(selcDate);
              let enddate = firstDate.setDate(firstDate.getDate() + 1);
              let endMonthDate = new Date(enddate);

              handleProgressUpdate(1, "Checking...");
              handleLoaderDialogOpen();

              handleProgressUpdate(2, "Checking...");

              handleProgressUpdate(3, "Checking...");

              async function fetchDataInBatches() {
                let batchNumber = 0;
                let allData = [];
                let hasMoreData = true;
                let allusers = [];
                let apiUrl;
                let totalBatchNumber = 10;
                while (hasMoreData) {
                  try {
                    if (batchNumber === 0) {
                      apiUrl = SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY;
                    } else {
                      apiUrl = SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY_ALLBATCH;
                    }
                    const currentBatch = Number(batchNumber) * 30;
                    const beforeBatch = (Number(batchNumber) - 1) * 30;

                    const response = await axios.post(
                      apiUrl,
                      batchNumber === 0
                        ? {
                          date: selcDate,
                          // userDates: daysArray,
                          batchNumber: batchNumber,
                          batchSize: 0,
                        }
                        : {
                          date: selcDate,
                          users: allusers.slice(beforeBatch, currentBatch),
                          batchNumber: batchNumber,
                        },
                      {
                        headers: {
                          Authorization: `Bearer ${auth.APIToken}`,
                        },
                      }
                    );

                    if (batchNumber === 0) {
                      allusers = response.data.users || [];
                      totalBatchNumber = Math.ceil(allusers.length / 30);
                    }
                    const productionupload = response.data.productionupload || [];
                    if (batchNumber > 0 && batchNumber > totalBatchNumber + 1) {
                      hasMoreData = false;
                    } else {
                      let filtered = productionupload.filter((item) => item != null && item !== undefined);
                      allData = [...allData, ...filtered];
                      console.log(batchNumber, totalBatchNumber, filtered.length, "batch");
                      batchNumber++;
                      const progress = batchNumber > 0 ? (batchNumber / (totalBatchNumber + 1)) * 5 : 1;
                      handleProgressUpdate(3 + progress, "Checking...");
                    }
                  } catch (err) {
                    console.log(err, "err123888");
                    setIsCheckUnAllotMismatch(false);
                    handleLoaderDialogClose();

                    setPopupContentMalert(err.response.data.message === "shifttiming" ? "Shifttime value is undefined" : "something went wrong!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();

                    allData = -1;

                    hasMoreData = false;
                  }
                }

                return allData;
              }

              fetchDataInBatches().then(async (allData) => {
                try {
                  if (allData === -1) {
                    setIsCheckUnAllotMismatch(false);
                    handleLoaderDialogClose();

                    setPopupContentMalert("Something went wrong!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                  } else {
                    let datavalue = allData.filter((d) => d != null && d != undefined);

                    if (datavalue.length > 0) {
                      handleLoaderDialogOpen();

                      handleProgressUpdate(5, "Creating...");

                      const result = [];

                      const unitrateMap = {};

                      datavalue.forEach((item) => {
                        const key = item.filename + item.user + item.mode + item.fromtodate; // Generating a unique key based on category and user
                        if (unitrateMap[key]) {
                          // If the key already exists, add the unitrate value
                          unitrateMap[key].points += item.points;
                          unitrateMap[key].shiftpoints += item.shiftpoints;
                        } else {
                          // If the key doesn't exist, create a new entry
                          unitrateMap[key] = { ...item };
                          result.push(unitrateMap[key]); // Add to the result array
                        }
                      });

                      handleProgressUpdate(8, "Creating...");

                      let finalCalData = result.map((item) => {
                        let findexpval = Number(item.exp) < 1 ? "00" : Number(item.exp) <= 9 ? `0${Number(item.exp)}` : item.exp;

                        let getprocessCode = item.processcode + findexpval;

                        let findSalDetails = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === getprocessCode);

                        let findTargetVal = findSalDetails ? Number(findSalDetails.points) : 0;
                        let roundedPoints = Number(item.points?.toFixed(5));

                        let avgPointValue = findTargetVal > 0 ? Number(((roundedPoints / findTargetVal) * 100)?.toFixed(5)) : 0;

                        const [findProj] = item.vendor.split("-");

                        let findPrimaryProcess = categoryProcessMap.find(
                          (d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Primary" && d.process?.slice(-4) === (item.processcode ? item.processcode?.slice(-4) : item.processcode) && findProj === d.project && d.categoryname?.toLowerCase() === item.filename?.toLowerCase()
                        );
                        let findSecondayProcess = categoryProcessMap.find((d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Secondary" && d.process === item.processcode && findProj === d.project && d.categoryname.toLowerCase() === item.filename.toLowerCase());

                        let AprocessValue = findPrimaryProcess && findPrimaryProcess.processtypes === "Primary" ? findPrimaryProcess.process : "";
                        let SprocessValue = findSecondayProcess && findSecondayProcess.processtypes === "Secondary" ? findSecondayProcess.process : "";

                        let AlterProcessCode = AprocessValue + findexpval;

                        let findSalDetailsForAlterProcess = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === AlterProcessCode);

                        let findTargetValForAlterProcess = findSalDetailsForAlterProcess ? Number(findSalDetailsForAlterProcess.points) : "";

                        let conTargetValue = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process ? findTargetValForAlterProcess : findTargetVal;

                        let conPoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.points : item.points;
                        let conshiftpoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.shiftpoints : item.shiftpoints;

                        let conavg = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (((findTargetVal / findTargetValForAlterProcess) * item.points) / findTargetVal) * 100 : avgPointValue;

                        return {
                          ...item,
                          experience: item.exp,
                          target: findTargetVal,

                          project: findProj,
                          points: roundedPoints,
                          aprocess: AprocessValue,
                          conshiftpoints: conshiftpoints,
                          sprocess: SprocessValue,
                          avgpoint: avgPointValue,
                          contarget: conTargetValue,
                          conpoints: conPoints > 0 ? Number(conPoints).toFixed(5) : conPoints,
                          conavg: conavg > 0 ? Number(conavg).toFixed(5) : conavg,
                        };
                      });

                      let finalRemovedUserData = finalCalData.filter((item) => new Date(item.dojDate) <= new Date(selcDate));

                      handleProgressUpdate(8, "Creating...");
                      if (finalRemovedUserData.length > 0) {
                        let resGetUniqid;
                        try {
                          resGetUniqid = await axios.get(SERVICE.PRODUCTION_DAY_UNIQID, {
                            headers: {
                              Authorization: `Bearer ${auth.APIToken}`,
                            },
                          });
                        } catch (err) {
                          console.log(err, "err456");
                          setIsCheckUnAllotMismatch(false);
                          handleLoaderDialogClose();
                          handleApiError(err, setShowAlert, handleClickOpenerr);
                        }
                        let prodDayUniqId = resGetUniqid.data.productionDayid;
                        handleProgressUpdate(9, "Creating...");
                        let resCreate;

                        let filestatusfinal = filestatusupload.data.productionupload == 0 ? "Pending Upload" : "Final";

                        try {
                          resCreate = await axios.post(SERVICE.PRODUCTION_DAY_CREATE, {
                            headers: {
                              Authorization: `Bearer ${auth.APIToken}`,
                            },
                            date: String(selcDate),
                            createddate: String(new Date()),
                            username: String(username),
                            companyname: String(companyname),
                            filestatus: filestatusfinal,
                            uniqueid: Number(prodDayUniqId) + 1,
                          });
                        } catch (err) {
                          console.log(err, "err");
                          setIsCheckUnAllotMismatch(false);
                          handleLoaderDialogClose();
                          handleApiError(err, setShowAlert, handleClickOpenerr);
                        }
                        handleProgressUpdate(9, "Creating...");
                        let res;
                        try {
                          res = await fetch(SERVICE.PRODUCTION_DAY_LIST_CREATE, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json;charset=UTF-8",
                            },
                            body: JSON.stringify(
                              finalRemovedUserData.map((item) => ({
                                ...item,

                                uniqueid: Number(prodDayUniqId) + 1,
                                addedby: [
                                  {
                                    name: String(username),
                                    companyname: String(companyname),
                                    date: String(new Date()),
                                  },
                                ],
                              }))
                            ),
                          });
                        } catch (err) {
                          console.log(err, "err");
                          handleLoaderDialogClose();
                          setIsCheckUnAllotMismatch(false);
                          handleApiError(err, setShowAlert, handleClickOpenerr);
                        }

                        handleProgressUpdate(10, "Created...");
                        await fetchProductionDay();
                        handleLoaderDialogClose();

                        let [res_LastDayPoint, res_Day] = await Promise.all([
                          axios.post(SERVICE.CHECK_DAYPOINT_ORG_BYDATE, {
                            headers: {
                              Authorization: `Bearer ${auth.APIToken}`,
                            },
                            date: newDateOneMinus,
                          }),
                          axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
                            headers: {
                              Authorization: `Bearer ${auth.APIToken}`,
                            },
                            date: newDateOneMinus,
                          }),
                        ]);
                        let beforeday = res_Day.data.countDay;
                        let beforedaypoint = res_LastDayPoint.data.count;

                        if (beforeday > 0 && beforedaypoint > 0) {
                          handleClickOpenDelBeforeDayPoint(newDateOneMinus);
                        } else if (beforeday > 0) {
                          handleClickOpenProdDayRerun(newDateOneMinus);
                        } else if (beforeday === 0) {
                          handleClickOpenProdDayCreate(newDateOneMinus);
                        }
                        setSelectedDate("");
                        setIsCheckUnAllotMismatch(false);
                      } else {
                        setSelectedDate("");
                        setIsCheckUnAllotMismatch(false);
                        handleLoaderDialogClose();

                        setPopupContentMalert("No data to Create");
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert();
                      }
                    } else {
                      setSelectedDate("");
                      setIsCheckUnAllotMismatch(false);
                      handleLoaderDialogClose();

                      setPopupContentMalert("No data to Create");
                      setPopupSeverityMalert("info");
                      handleClickOpenPopupMalert();
                    }
                  }
                } catch (err) {
                  setSelectedDate("");
                  console.log(err, "err");
                  setIsCheckUnAllotMismatch(false);
                  handleLoaderDialogClose();
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  console.error("Error fetching data:", err);
                }
              });
            } catch (err) {
              setSelectedDate("");
              console.log(err, "err");

              setBankdetail(false);
              setIsCheckUnAllotMismatch(false);
              handleLoaderDialogClose();
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }
        } catch (err) {
          setSelectedDate("");
          console.log(err, "err");
          setIsCheckUnAllotMismatch(false);
          handleLoaderDialogClose();
          handleApiError(err, setShowAlert, handleClickOpenerr);
        }
      }
    } catch (err) {
      console.log(err, "err");
      setSelectedDate("");
      setBankdetail(false);
      setIsCheckUnAllotMismatch(false);
      handleLoaderDialogClose();
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleBeforeDayPointDelandProdDayCreate = async (date) => {
    setDeldayPointLoad(true);
    try {
      await axios.post(SERVICE.DAYPOINT_DELETE_BYDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });
      handleLastDayDelPopClose();
      handleLastProdDayCreatePopOpen(date);
      await fetchProductionDay();
      setDeldayPointLoad(false);
    } catch (err) {
      setDeldayPointLoad(false);
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handlelastProdDayDelCreate = async (date) => {
    try {
      await axios.post(SERVICE.DAYPOINT_DELETE_BYDATE_ORG, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });

      let res_FileStatus = await axios.post(SERVICE.PRODUCTION_DAYS_CHECK_FILESTATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });

      let checkfilestatus = res_FileStatus.data.productionupload;
      handleLastProdDayCreatePopClose();
      handleFilterSaveLastDateRerun(date, "popup", checkfilestatus);
    } catch (err) {
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handlelastProdDayCreateNew = async (date) => {
    try {
      handleLastProdDayCreatePopCloseNew();
      handleFilterSaveLastDateRerun(date, "newcreate");
    } catch (err) {
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleFilterSaveLastDateRerun = async (selcDate, type) => {
    setDeldayPointLoad(true);

    let alertval = "";
    handleProgressUpdate(alertval, "Checking...");
    handleLoaderDialogOpen();
    let dateoneafter = new Date(selcDate);
    dateoneafter.setDate(dateoneafter.getDate() + 1);
    let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

    let dateonebefore = new Date(selcDate);
    dateonebefore.setDate(dateonebefore.getDate() - 1);
    let newDateOneMinus = dateonebefore.toISOString().split("T")[0];
    setIsCheckUnAllotMismatch(true);

    if (selcDate === "") {
      setIsCheckUnAllotMismatch(false);

      setPopupContentMalert("Please Select Date");

      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
      setDeldayPointLoad(false);
    } else {
      setIsCheckUnAllotMismatch(true);
      let result;
      try {
        // Fetch all necessary data
        let [result, ResChevkCount, filestatusupload] = await Promise.all([
          axios.post(SERVICE.CHECK_ZERO_MISMATCH_PRESENT, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: selcDate,
          }),
          axios.post(SERVICE.GET_UNIQID_FROM_DATE_PRODUPLOAD, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: selcDate,
          }),
          axios.post(SERVICE.PRODUCTION_DAYS_CHECK_FILESTATUS, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: selcDate,
          }),
        ]);
        if (ResChevkCount.data.totalSum !== ResChevkCount.data.productionUpload) {
          setIsCheckUnAllotMismatch(false);

          setPopupContentMalert(`Please review the uploaded files. Some data may not have been fully uploaded for these dates ${newDateOneMinus}, ${selcDate}, ${newDateOnePlus}`);

          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
          setIsCheckUnAllotMismatch(false);
          handleLoaderDialogClose();
          setDeldayPointLoad(false);
        } else if (result.data.count > 0) {
          setIsCheckUnAllotMismatch(false);
          setShowAlert(
            <>
              <p>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
              </p>
              <span>{`Please Update these`} </span>
              <p style={{ fontSize: "20px", fontWeight: 900, color: "red" }}>{`${moment(new Date(selcDate)).format("DD-MM-YYYY")}, ${moment(new Date(newDateOnePlus)).format("DD-MM-YYYY")}`} </p>
              <span>{`date's Original/Manual Zero Unitrate Unallot value`}</span>
            </>
          );
          handleClickOpenerr();
          setIsCheckUnAllotMismatch(false);
          handleLoaderDialogClose();
          setDeldayPointLoad(false);
        } else {
          try {
            let startMonthDateMinus = new Date(selcDate);
            let startdate = startMonthDateMinus.setDate(startMonthDateMinus.getDate() - 1);
            let startMonthDate = new Date(startdate);

            let firstDate = new Date(selcDate);
            let enddate = firstDate.setDate(firstDate.getDate() + 1);
            let endMonthDate = new Date(enddate);

            // console.log(endMonthDate)
            const daysArray = [];
            while (startMonthDate <= endMonthDate) {
              const formattedDate = `${String(startMonthDate.getDate()).padStart(2, "0")}/${String(startMonthDate.getMonth() + 1).padStart(2, "0")}/${startMonthDate.getFullYear()}`;
              const dayName = startMonthDate.toLocaleDateString("en-US", {
                weekday: "long",
              });
              const dayCount = startMonthDate.getDate();
              const shiftMode = "Main Shift";
              const weekNumberInMonth =
                getWeekNumberInMonth(startMonthDate) === 1
                  ? `${getWeekNumberInMonth(startMonthDate)}st Week`
                  : getWeekNumberInMonth(startMonthDate) === 2
                    ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
                    : getWeekNumberInMonth(startMonthDate) === 3
                      ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
                      : getWeekNumberInMonth(startMonthDate) > 3
                        ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                        : "";

              daysArray.push({
                formattedDate,
                dayName,
                dayCount,
                shiftMode,
                weekNumberInMonth,
              });

              // Move to the next day
              startMonthDate.setDate(startMonthDate.getDate() + 1);
            }
            // console.log(daysArray, 'daysArray')
            handleProgressUpdate(alertval, "Checking...");
            handleLoaderDialogOpen();
            // let res_Target;
            // try {
            //   res_Target = await axios.get(SERVICE.TARGETPOINTS_LIMITED, {
            //     headers: {
            //       Authorization: `Bearer ${auth.APIToken}`,
            //     },
            //   });
            // } catch (err) {
            //   console.log(err, 'err');
            //   setIsCheckUnAllotMismatch(false);
            //   handleLoaderDialogClose();
            //   setDeldayPointLoad(false);
            //   handleApiError(err, setShowAlert, handleClickOpenerr);
            // }
            // let targetPoints = res_Target.data.targetpoints ? res_Target.data.targetpoints : [];
            // let res_Cate;
            // try {
            //   res_Cate = await axios.get(SERVICE.CATEGORYPROCESSMAP_LIMITED, {
            //     headers: {
            //       Authorization: `Bearer ${auth.APIToken}`,
            //     },
            //   });
            // } catch (err) {
            //   console.log(err, 'err');
            //   setIsCheckUnAllotMismatch(false);
            //   handleLoaderDialogClose();
            //   setDeldayPointLoad(false);
            //   handleApiError(err, setShowAlert, handleClickOpenerr);
            // }
            // let categoryProcessMap = res_Cate.data.categoryprocessmaps;

            handleProgressUpdate(2, "Checking...");
            let res_employee;
            try {
              res_employee = await axios.post(SERVICE.DEPTMONTHSET_PROD_LIMITED, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                date: selcDate,
              });
            } catch (err) {
              console.log(err, "err");
              setIsCheckUnAllotMismatch(false);
              handleLoaderDialogClose();
              setDeldayPointLoad(false);
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
            let filteredMonthsets = res_employee.data.departmentdetails;

            handleProgressUpdate(3, "Checking...");

            async function fetchDataInBatches() {
              let batchNumber = 0;
              let allData = [];
              let allusers = [];
              let apiUrl = "";
              let hasMoreData = true;
              let totalBatchNumber = 10;
              // const batchsize = ResChevkCount.data.totalSum > 420000 ? 40000 : ResChevkCount.data.totalSum < 250000 ? 30000 : ResChevkCount.data.totalSum / 9 < 30000 ? 30000 : ResChevkCount.data.totalSum / 9;

              while (hasMoreData) {
                try {
                  if (batchNumber === 0) {
                    apiUrl = SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY;
                  } else {
                    apiUrl = SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY_ALLBATCH;
                  }
                  const currentBatch = Number(batchNumber) * 30;
                  const beforeBatch = (Number(batchNumber) - 1) * 30;

                  const response = await axios.post(
                    apiUrl,
                    batchNumber === 0
                      ? {
                        date: selcDate,
                        // userDates: daysArray,
                        batchNumber: batchNumber,
                        batchSize: 0,
                      }
                      : {
                        date: selcDate,
                        users: allusers.slice(beforeBatch, currentBatch),
                        batchNumber: batchNumber,
                      },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );

                  if (batchNumber === 0) {
                    allusers = response.data.users || [];
                    totalBatchNumber = Math.ceil(allusers.length / 30);
                  }
                  const productionupload = response.data.productionupload || [];
                  if (batchNumber > 0 && batchNumber > totalBatchNumber + 1) {
                    hasMoreData = false;
                  } else {
                    let filtered = productionupload.filter((item) => item != null && item !== undefined);
                    allData = [...allData, ...filtered];

                    batchNumber++;
                    const progress = batchNumber > 0 ? (batchNumber / (totalBatchNumber + 1)) * 5 : 1;
                    handleProgressUpdate(3 + progress, "Checking...");
                  }
                } catch (err) {
                  console.log(err, "err123");
                  setIsCheckUnAllotMismatch(false);
                  handleLoaderDialogClose();
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  allData = -1;
                  console.error("Error fetching data:", err);
                  hasMoreData = false;
                }
              }

              return allData;
            }

            fetchDataInBatches().then(async (allData) => {
              try {
                if (allData === -1) {
                  setIsCheckUnAllotMismatch(false);
                  handleLoaderDialogClose();
                  setDeldayPointLoad(false);

                  setPopupContentMalert("something went wrong!");

                  setPopupSeverityMalert("warning");
                  handleClickOpenPopupMalert();
                } else {
                  let datavalue = allData.filter((d) => d != null);

                  if (datavalue.length > 0) {
                    await axios.post(SERVICE.PRODDAY_DELETE_BYDATE, {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                      date: selcDate,
                    });
                    handleLoaderDialogOpen();

                    handleProgressUpdate(5, "Creating...");

                    const result = [];

                    // Create a map to store the accumulated unitrate values
                    const unitrateMap = {};

                    datavalue.forEach((item) => {
                      const key = item.filename + item.user + item.mode + item.fromtodate; // Generating a unique key based on category and user
                      if (unitrateMap[key]) {
                        // If the key already exists, add the unitrate value
                        unitrateMap[key].points += item.points;
                        unitrateMap[key].shiftpoints += item.shiftpoints;
                      } else {
                        // If the key doesn't exist, create a new entry
                        unitrateMap[key] = { ...item };
                        result.push(unitrateMap[key]); // Add to the result array
                      }
                    });

                    handleProgressUpdate(8, "Creating...");

                    let finalCalData = result.map((item) => {
                      let findexpval = Number(item.exp) < 1 ? "00" : Number(item.exp) <= 9 ? `0${Number(item.exp)}` : item.exp;
                      let getprocessCode = item.processcode + findexpval;

                      let findSalDetails = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === getprocessCode);

                      let findTargetVal = findSalDetails ? Number(findSalDetails.points) : 0;
                      let roundedPoints = Number(Number(item.points)?.toFixed(5));

                      let avgPointValue = findTargetVal > 0 ? Number(((roundedPoints / findTargetVal) * 100)?.toFixed(5)) : 0;

                      const [findProj] = item.vendor.split("-");

                      let findPrimaryProcess = categoryProcessMap.find((d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Primary" && d.process?.slice(-4) === item.processcode?.slice(-4) && findProj === d.project && d.categoryname?.toLowerCase() === item.filename?.toLowerCase());
                      let findSecondayProcess = categoryProcessMap.find((d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Secondary" && d.process === item.processcode && findProj === d.project && d.categoryname.toLowerCase() === item.filename.toLowerCase());

                      let AprocessValue = findPrimaryProcess && findPrimaryProcess.processtypes === "Primary" ? findPrimaryProcess.process : "";
                      let SprocessValue = findSecondayProcess && findSecondayProcess.processtypes === "Secondary" ? findSecondayProcess.process : "";

                      let AlterProcessCode = AprocessValue + findexpval;

                      let findSalDetailsForAlterProcess = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === AlterProcessCode);

                      let findTargetValForAlterProcess = findSalDetailsForAlterProcess ? Number(findSalDetailsForAlterProcess.points) : "";

                      let conTargetValue = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process ? findTargetValForAlterProcess : findTargetVal;

                      let conPoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.points : item.points;
                      let conshiftpoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.shiftpoints : item.shiftpoints;

                      let conavg = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (((findTargetVal / findTargetValForAlterProcess) * item.points) / findTargetVal) * 100 : avgPointValue;

                      return {
                        ...item,
                        experience: item.exp,
                        target: findTargetVal,
                        dateval: item.formatteddatetime,
                        project: findProj,
                        points: roundedPoints,
                        aprocess: AprocessValue,
                        conshiftpoints: conshiftpoints,
                        sprocess: SprocessValue,
                        avgpoint: avgPointValue,
                        contarget: conTargetValue,
                        conpoints: conPoints > 0 ? Number(conPoints).toFixed(5) : conPoints,
                        conavg: conavg > 0 ? Number(conavg).toFixed(5) : conavg,
                      };
                    });

                    let finalRemovedUserData = finalCalData.filter((item) => new Date(item.dojDate) <= new Date(selcDate));
                    // let finalRemovedUserData = finalCalData

                    handleProgressUpdate(8, "Creating...");
                    let resGetUniqid;
                    try {
                      resGetUniqid = await axios.get(SERVICE.PRODUCTION_DAY_UNIQID, {
                        headers: {
                          Authorization: `Bearer ${auth.APIToken}`,
                        },
                      });
                    } catch (err) {
                      console.log(err, "err456");
                      setIsCheckUnAllotMismatch(false);
                      handleLoaderDialogClose();
                      setDeldayPointLoad(false);
                      handleApiError(err, setShowAlert, handleClickOpenerr);
                    }
                    let prodDayUniqId = resGetUniqid.data.productionDayid;
                    handleProgressUpdate(9, "Creating...");
                    let resCreate;

                    let filestatusfinal = filestatusupload.data.productionupload === 0 ? "Pending Upload" : "Final";

                    try {
                      resCreate = await axios.post(SERVICE.PRODUCTION_DAY_CREATE, {
                        headers: {
                          Authorization: `Bearer ${auth.APIToken}`,
                        },
                        date: String(selcDate),
                        createddate: String(new Date()),
                        username: String(username),
                        companyname: String(companyname),
                        filestatus: filestatusfinal,
                        uniqueid: Number(prodDayUniqId) + 1,
                      });
                    } catch (err) {
                      console.log(err, "err");
                      setIsCheckUnAllotMismatch(false);
                      handleLoaderDialogClose();
                      setDeldayPointLoad(false);
                      handleApiError(err, setShowAlert, handleClickOpenerr);
                    }
                    handleProgressUpdate(9, "Creating...");
                    let res;
                    try {
                      res = await fetch(SERVICE.PRODUCTION_DAY_LIST_CREATE, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json;charset=UTF-8",
                        },
                        body: JSON.stringify(
                          finalRemovedUserData.map((item) => ({
                            ...item,

                            uniqueid: Number(prodDayUniqId) + 1,
                            addedby: [
                              {
                                name: String(username),
                                companyname: String(companyname),
                                date: String(new Date()),
                              },
                            ],
                          }))
                        ),
                      });
                    } catch (err) {
                      console.log(err, "err");
                      handleLoaderDialogClose();
                      setDeldayPointLoad(false);
                      setIsCheckUnAllotMismatch(false);
                      handleApiError(err, setShowAlert, handleClickOpenerr);
                    }
                    setDeldayPointLoad("");
                    handleProgressUpdate(10, "Created...");
                    await fetchProductionDay();
                    handleLoaderDialogClose();
                    setDeldayPointLoad(false);
                    setIsCheckUnAllotMismatch(false);
                    handleLastDaypointCreatePopOpen(selcDate, type);
                  } else {
                    setIsCheckUnAllotMismatch(false);
                    handleLoaderDialogClose();
                    setDeldayPointLoad(false);

                    setPopupContentMalert("No data to Create");

                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                  }
                }
              } catch (err) {
                console.log(err, "err");
                setIsCheckUnAllotMismatch(false);
                handleLoaderDialogClose();
                setDeldayPointLoad(false);
                handleApiError(err, setShowAlert, handleClickOpenerr);
                console.error("Error fetching data:", err);
              }
            });
          } catch (err) {
            console.log(err, "err");
            setDeldayPointLoad(false);
            setBankdetail(false);
            setIsCheckUnAllotMismatch(false);
            handleLoaderDialogClose();
            handleApiError(err, setShowAlert, handleClickOpenerr);
          }
        }
      } catch (err) {
        console.log(err, "err");
        setDeldayPointLoad(false);
        setIsCheckUnAllotMismatch(false);
        handleLoaderDialogClose();
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  // datatableCategoryv view

  const [itemsCategoryView, setItemsCategoryView] = useState([]);

  const addSerialNumberCategoryView = async () => {
    try {
      const itemsWithSerialNumber = categoryViewData?.map((item, index) => {
        let finalunitrate = item.updatedunitrate ? Number(item.updatedunitrate) : Number(item.unitrate);
        let finalflag = item.updatedflag ? Number(item.updatedflag) : Number(item.flagcount);
        const uploadtime = item.mode === "Manual" ? convertTo24HourFormat(item.time) : item.formattedtime;

        let roundedPoints = item.mode === "Manual" && item.lateentrystatus === "Late Entry" ? 0 : finalunitrate * finalflag * 8.333333333333333;

        let avgPointValue = item.target > 0 ? Number(((roundedPoints / Number(item.target)) * 100)?.toFixed(5)) : 0;

        let conPoints = item.sprocess === "" && item.aprocess === "" ? 0 : item.sprocess === "" && item.aprocess !== item.process && item.contarget > 0 ? (Number(item.target) / Number(item.contarget)) * roundedPoints : roundedPoints;

        let conavg = item.sprocess === "" && item.aprocess === "" ? 0 : item.sprocess === "" && item.aprocess !== item.process && item.contarget > 0 ? (((Number(item.target) / Number(item.contarget)) * roundedPoints) / item.target) * 100 : avgPointValue;

        return {
          ...item,
          serialNumber: index + 1,
          mode: item.mode === "Manual" ? "Manual" : "Production",
          filename: item.mode === "Manual" ? item.filename : item.filename.split(".xlsx")[0],
          dateval: item.mode === "Manual" ? `${item.fromdate} ${uploadtime}` : item.dateval,
          target: item.target,

          aprocess: item.aprocess,
          sprocess: item.sprocess,
          avgpoint: Number(avgPointValue.toFixed(5)),
          contarget: Number(item.contarget),
          conpoints: conPoints > 0 ? Number(Number(conPoints).toFixed(5)) : 0,
          conavg: conavg > 0 ? Number(Number(conavg).toFixed(5)) : 0,

          points: item.mode === "Manual" && item.lateentrystatus === "Late Entry" ? 0 : Number(Number(finalunitrate * finalflag * 8.333333333333333).toFixed(5)),
        };
      });
      setItemsCategoryView(itemsWithSerialNumber);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    addSerialNumberCategoryView();
  }, [categoryViewData]);

  //Datatable
  const handlePageChangeCategoryView = (newPage) => {
    setPageCategoryView(newPage);
  };

  const handlePageSizeChangeCategoryView = (event) => {
    setPageSizeCategoryView(Number(event.target.value));

    setPageCategoryView(1);
  };

  //datatable....
  const handleSearchChangeCategoryView = (event) => {
    setPageCategoryView(1);
    setSearchQueryCategoryView(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsCategoryView = searchQueryCategoryView.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasCategoryView = itemsCategoryView?.filter((item) => {
    return searchTermsCategoryView.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataCategoryView = filteredDatasCategoryView?.slice((pageCategoryView - 1) * pageSizeCategoryView, pageCategoryView * pageSizeCategoryView);

  const totalPageCategoryViews = Math.ceil(filteredDatasCategoryView?.length / pageSizeCategoryView);

  const visiblePagesCategoryView = Math.min(totalPageCategoryViews, 3);

  const firstVisiblePageCategoryView = Math.max(1, pageCategoryView - 1);
  const lastVisiblePageCategoryView = Math.min(firstVisiblePageCategoryView + visiblePagesCategoryView - 1, totalPageCategoryViews);

  const pageNumbersCategoryView = [];

  const indexOfLastItemCategoryView = pageCategoryView * pageSizeCategoryView;
  const indexOfFirstItemCategoryView = indexOfLastItemCategoryView - pageSizeCategoryView;

  for (let i = firstVisiblePageCategoryView; i <= lastVisiblePageCategoryView; i++) {
    pageNumbersCategoryView.push(i);
  }

  const columnDataTableCategoryView = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityCategoryView.serialNumber,
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.mode,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 90,
      hide: !columnVisibilityCategoryView.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 140,
      hide: !columnVisibilityCategoryView.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 80,
      hide: !columnVisibilityCategoryView.Unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 80,
      hide: !columnVisibilityCategoryView.team,
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 220,
      hide: !columnVisibilityCategoryView.empname,
    },
    {
      field: "experience",
      headerName: "Exp",
      flex: 0,
      width: 90,
      hide: !columnVisibilityCategoryView.experience,
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 150,
      hide: !columnVisibilityCategoryView.empcode,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 150,
      hide: !columnVisibilityCategoryView.department,
    },
    {
      field: "dateval",
      headerName: "Date",
      flex: 0,
      width: 190,
      hide: !columnVisibilityCategoryView.dateval,
    },

    {
      field: "vendor",
      headerName: "vendor",
      flex: 0,
      width: 180,
      hide: !columnVisibilityCategoryView.vendor,
    },
    {
      field: "user",
      headerName: "User",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.user,
    },
    {
      field: "unitid",
      headerName: "Identify Number",
      flex: 0,
      width: 200,
      hide: !columnVisibilityCategoryView.user,
    },
    {
      field: "filename",
      headerName: "Category",
      flex: 0,
      width: 350,
      hide: !columnVisibilityCategoryView.filename,
    },

    {
      field: "category",
      headerName: "Sub Category",
      flex: 0,
      width: 420,
      hide: !columnVisibilityCategoryView.filename,
    },

    {
      field: "processcode",
      headerName: "Process Code",
      flex: 0,
      width: 120,
      hide: !columnVisibilityCategoryView.processcode,
    },

    {
      field: "target",
      headerName: "Target",
      flex: 0,
      width: 90,
      hide: !columnVisibilityCategoryView.target,
    },

    {
      field: "points",
      headerName: "Points",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.points,
    },
    {
      field: "avgpoint",
      headerName: "Avg Point",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.avgpoint,
    },

    {
      field: "aprocess",
      headerName: "P Process",
      flex: 0,
      width: 120,
      hide: !columnVisibilityCategoryView.aprocess,
    },
    {
      field: "sprocess",
      headerName: "S Process",
      flex: 0,
      width: 120,
      hide: !columnVisibilityCategoryView.sprocess,
    },
    {
      field: "contarget",
      headerName: "Con Tar",
      flex: 0,
      width: 90,
      hide: !columnVisibilityCategoryView.contarget,
    },
    {
      field: "conpoints",
      headerName: "Con Points",
      flex: 0,
      width: 110,
      hide: !columnVisibilityCategoryView.conpoints,
    },
    {
      field: "conavg",
      headerName: "Con Avg",
      flex: 0,
      width: 110,
      hide: !columnVisibilityCategoryView.conavg,
    },
  ];

  const rowDataTableCategoryView = filteredDataCategoryView.map((item, index) => {
    return {
      ...item,
      mode: item.mode,
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      date: item.date,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      department: item.department,
      empname: item.empname,
      createddate: item.createddate,
    };
  });

  // Show All Columns functionality
  const handleShowAllColumnsCategoryView = () => {
    const updatedVisibility = { ...columnVisibilityCategoryView };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setcolumnVisibilityCategoryView(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityCategoryView");
    if (savedVisibility) {
      setcolumnVisibilityCategoryView(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityCategoryView", JSON.stringify(columnVisibilityCategoryView));
  }, [columnVisibilityCategoryView]);

  useEffect(() => {
    // fetchDepartmentMonthsets();
    setcolumnVisibilityCategoryView(initialcolumnVisibilityCategoryView);
  }, []);

  // // Function to filter columns based on search query
  const filteredColumnsCategoryView = columnDataTableCategoryView.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageCategoryView.toLowerCase()));

  // Manage Columns functionality
  const togglecolumnVisibilityCategoryView = (field) => {
    setcolumnVisibilityCategoryView((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentCategoryView = (
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
        onClick={handleCloseManageColumnsCategoryView}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageCategoryView} onChange={(e) => setSearchQueryManageCategoryView(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsCategoryView.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityCategoryView[column.field]} onChange={() => togglecolumnVisibilityCategoryView(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setcolumnVisibilityCategoryView(initialcolumnVisibilityCategoryView)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newcolumnVisibilityCategoryView = {};
                columnDataTableCategoryView.forEach((column) => {
                  newcolumnVisibilityCategoryView[column.field] = false; // Set hide property to true
                });
                setcolumnVisibilityCategoryView(newcolumnVisibilityCategoryView);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  let exportColumnNames = columnDataTable.map((item) => item.headerName).filter((d) => d !== "SNo" && !d.includes("Action"));
  let exportRowValues = columnDataTable.map((item) => item.field).filter((d) => d !== "serialNumber" && !d.includes("action"));

  let exportColumnNamesView = columnDataTableView.map((item) => item.headerName).filter((d) => d !== "SNo" && !d.includes("Action"));
  let exportRowValuesView = columnDataTableView.map((item) => item.field).filter((d) => d !== "serialNumber" && !d.includes("action"));

  //Rowdatatable Category view
  let exportColumnNamesCategoryView = columnDataTableCategoryView.map((item) => item.headerName).filter((d) => d !== "SNo" && !d.includes("Action"));
  let exportRowValuesCategoryView = columnDataTableCategoryView.map((item) => item.field).filter((d) => d !== "serialNumber" && !d.includes("action"));

  return (
    <Box>
      <Headtitle title={"Production Day"} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Production Day" modulename="Production" submodulename="Upload" mainpagename="Original" subpagename="Production Day" subsubpagename="" />
      <Typography sx={userStyle.HeaderText}></Typography>
      <br />
      {isUserRoleCompare?.includes("lproductionday") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Production Point Creation</Typography>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      checkLastDayPoint(e.target.value);
                    }}
                    inputProps={{ max: new Date().toISOString().split("T")[0] }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={2} xs={12} sm={6} marginTop={3}>
                <LoadingButton
                  onClick={(e) => {
                    handleFilterSave(selectedDate, "create", prodLastDate, prodLastDayPoint);
                  }}
                  loading={isCheckUnAllotMismatch}
                  color="primary"
                  loadingPosition="end"
                  variant="contained"
                >
                  {" "}
                  <span>Create &ensp;</span>
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
          <br />
          <Box sx={userStyle.container}>
            <Grid container style={userStyle.dataTablestyle}>
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
                    <MenuItem value={productionDays?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelproductionday") && (
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
                  {isUserRoleCompare?.includes("csvproductionday") && (
                    // <>
                    //   <ExportCSV
                    //     csvData={rowDataTable?.map((item, index) => ({
                    //       Sno: index + 1,
                    //       Date: item.date,
                    //       "Company Name": item.companyname,
                    //       "Created Date": item.createddate,
                    //     }))}
                    //     fileName={"Production Point Creation"}
                    //   />
                    // </>
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
                  {isUserRoleCompare?.includes("printproductionday") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfproductionday") && (
                    // <>
                    //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                    //     <FaFilePdf />
                    //     &ensp;Export to PDF&ensp;
                    //   </Button>
                    // </>
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
                  {isUserRoleCompare?.includes("imageproductionday") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
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
            <br />
            <br />
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
            {isBankdetail ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress color="inherit" />  */}
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
          </Box>
        </>
      )}

      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/*DELETE ALERT DIALOG */}
      <Dialog open={isErrorOpenDayPoint} onClose={handleCloseModDayPoint} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModDayPoint}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => delDayPoint()}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/*BEFORE DAYPOINT DELETE ALERT DIALOG */}
      <Dialog open={beforeDaypointDel.open} onClose={handleClickCloseDelBeforeDayPoint} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <RemoveCircleOutlineIcon sx={{ fontSize: "80px", color: "#ff0000" }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to delete </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(beforeDaypointDel.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Daypoint? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickCloseDelBeforeDayPoint}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => delDayPointLast(beforeDaypointDel.date)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/*BEFORE PRODDAY CREATE  ALERT DIALOG */}
      <Dialog open={beforeProdDayCreate.open} onClose={handleClickCloseProdDayCreate} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <AddCircleOutlineIcon sx={{ fontSize: "80px", color: "green" }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to create </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(beforeProdDayCreate.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Production Day? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickCloseProdDayCreate}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <LoadingButton autoFocus variant="contained" loading={rerunLoader} color="error" onClick={(e) => handleFilterSaveRerun(beforeProdDayCreate.date, "create")}>
            {" "}
            OK
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*BEFORE PRODDAY CREATE  ALERT DIALOG */}
      <Dialog open={beforeDayPointCreate.open} onClose={handleClickCloseCreateBeforeDayPoint} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <AddCircleOutlineIcon sx={{ fontSize: "80px", color: "green" }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to create </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(beforeDayPointCreate.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Day Point? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickCloseCreateBeforeDayPoint}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <LoadingButton autoFocus variant="contained" color="error" loading={isloading} onClick={(e) => handleDayPointCreate(beforeDayPointCreate.date, "reruncreate")}>
            {" "}
            OK
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*SELECTEDday CREATE  ALERT DIALOG */}
      <Dialog open={selectedDayPointCreate.open} onClose={handleClickCloseCreateSelectedDayPoint} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <AddCircleOutlineIcon sx={{ fontSize: "80px", color: "green" }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to create </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(selectedDayPointCreate.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Day Point? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickCloseCreateSelectedDayPoint}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <LoadingButton autoFocus variant="contained" color="error" loading={isloading} onClick={(e) => handleDayPointCreate(selectedDayPointCreate.date, "rerun")}>
            {" "}
            OK
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*BEFORE PRODDAY rerun  ALERT DIALOG */}
      <Dialog open={beforeProdDayRerun.open} onClose={handleClickCloseProdDayRerun} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to rerun </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(beforeProdDayRerun.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Production Day? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickCloseProdDayRerun}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <LoadingButton autoFocus variant="contained" loading={rerunLoader} color="error" onClick={(e) => handleFilterSaveRerun(beforeProdDayRerun.date, "rerun")}>
            {" "}
            OK{" "}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Created Date</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.date} </StyledTableCell>
                  <StyledTableCell>{row.companyname} </StyledTableCell>
                  <StyledTableCell>{row.createddate} </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRefview}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Mode</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>

              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>ProjectVendor</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Process Code</StyledTableCell>
              <StyledTableCell>Exp</StyledTableCell>
              <StyledTableCell>Target</StyledTableCell>
              <StyledTableCell>Points</StyledTableCell>
              <StyledTableCell>Avg Point</StyledTableCell>
              <StyledTableCell>P Process</StyledTableCell>
              <StyledTableCell>S Process</StyledTableCell>
              <StyledTableCell>Con Tar</StyledTableCell>
              <StyledTableCell>Con Points</StyledTableCell>
              <StyledTableCell>Con Avg</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTableView &&
              rowDataTableView.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.mode} </StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell>{row.unit} </StyledTableCell>
                  <StyledTableCell>{row.team} </StyledTableCell>
                  <StyledTableCell> {row.empname}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.department}</StyledTableCell>
                  <StyledTableCell> {row.date}</StyledTableCell>
                  <StyledTableCell> {row.vendor}</StyledTableCell>
                  <StyledTableCell> {row.user}</StyledTableCell>
                  <StyledTableCell> {row.filename}</StyledTableCell>
                  <StyledTableCell> {row.processcode}</StyledTableCell>
                  <StyledTableCell> {row.experience}</StyledTableCell>
                  <StyledTableCell> {row.target}</StyledTableCell>
                  <StyledTableCell> {row.points}</StyledTableCell>
                  <StyledTableCell> {row.avgpoint}</StyledTableCell>
                  <StyledTableCell> {row.aprocess}</StyledTableCell>
                  <StyledTableCell> {row.sprocess}</StyledTableCell>
                  <StyledTableCell> {row.contarget}</StyledTableCell>
                  <StyledTableCell> {row.conpoints}</StyledTableCell>
                  <StyledTableCell> {row.conavg}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRefCategoryView}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Mode</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>ProjectVendor</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Identify Number</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>SubCategory</StyledTableCell>
              <StyledTableCell>U-Unitrate</StyledTableCell>
              <StyledTableCell>A-Unitrate</StyledTableCell>
              <StyledTableCell>U-Flag</StyledTableCell>
              <StyledTableCell>A-Flag</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTableCategoryView &&
              rowDataTableCategoryView.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.mode} </StyledTableCell>
                  <StyledTableCell> {row.empname}</StyledTableCell>
                  <StyledTableCell> {row.date}</StyledTableCell>
                  <StyledTableCell> {row.vendor}</StyledTableCell>
                  <StyledTableCell> {row.user}</StyledTableCell>
                  <StyledTableCell> {row.unitid}</StyledTableCell>
                  <StyledTableCell> {row.filename}</StyledTableCell>
                  <StyledTableCell> {row.category}</StyledTableCell>
                  <StyledTableCell> {row.uunitrate}</StyledTableCell>
                  <StyledTableCell> {row.aunitrate}</StyledTableCell>
                  <StyledTableCell> {row.uflag}</StyledTableCell>
                  <StyledTableCell> {row.aflag}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isViewDialog} onClose={handleViewDialogClose} aria-labelledby="alert-dialog-title" maxWidth="1400px" fullWidth={true} aria-describedby="alert-dialog-description">
        <DialogContent sx={{ padding: "20px" }}>
          <Typography variant="h6">{"View List"}</Typography>
          <Grid container style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <label>Show entries:</label>
                <Select
                  id="pageSizeViewSelect"
                  size="small"
                  value={pageSizeView}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180,
                        width: 80,
                      },
                    },
                  }}
                  onChange={handlePageSizeChangeView}
                  sx={{ width: "77px" }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={viewData?.length}>All</MenuItem>
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
                {isUserRoleCompare?.includes("excelproductionday") && (
                  <>
                    <Button
                      onClick={(e) => {
                        setIsFilterOpenView(true);
                        setFormat("xl");
                      }}
                      sx={userStyle.buttongrp}
                    >
                      <FaFileExcel />
                      &ensp;Export to Excel&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvproductionday") && (
                  // <>
                  //   <ExportCSV
                  //     csvData={rowDataTableView?.map((item, index) => ({
                  //       Sno: index + 1,
                  //       Mode: item.mode,
                  //       Name: item.empname,
                  //       Empcode: item.empcode,
                  //       Company: item.company,
                  //       Branch: item.branch,
                  //       Unit: item.unit,
                  //       Team: item.team,
                  //       Department: item.department,
                  //       Date: item.date,
                  //       ProjectVendor: item.vendor,

                  //       User: item.user,
                  //       Category: item.filename,
                  //       "Process Code": item.processcode,
                  //       Exp: item.experience && item.experience != "" ? Number(item.experience) : "",
                  //       Target: item.target && item.target != "" ? Number(item.target) : "",
                  //       Points: item.points && item.points != "" ? Number(item.points) : "",
                  //       "Avg Point": item.avgpoint && item.avgpoint != "" ? Number(item.avgpoint) : "",
                  //       "P Process": item.aprocess,
                  //       "S Process": item.sprocess,
                  //       "Con Tar": item.contarget && item.contarget != "" ? Number(item.contarget) : '',
                  //       "Con Points": item.conpoints && item.conpoints != "" ? Number(item.conpoints) : "",
                  //       "Con Avg": item.conavg && item.conavg != "" ? Number(item.conavg) : "",
                  //     }))
                  //       ?.sort((a, b) => {
                  //         // if (a.Name < b.Name) return -1;
                  //         // if (a.Name > b.Name) return 1;

                  //         // if (a.Category < b.Category) return -1;
                  //         // if (a.Category > b.Category) return 1;

                  //         if ((a.User).toLowerCase() < (b.User).toLowerCase()) return -1;
                  //         if ((a.User).toLowerCase() > (b.User).toLowerCase()) return 1;

                  //         if ((a.Category).toLowerCase() < (b.Category).toLowerCase()) return -1;
                  //         if ((a.Category).toLowerCase() > (b.Category).toLowerCase()) return 1;

                  //         return 0;
                  //       })
                  //     }
                  //     fileName={fileName}
                  //   />
                  // </>
                  <>
                    <Button
                      onClick={(e) => {
                        setIsFilterOpenView(true);
                        setFormat("csv");
                      }}
                      sx={userStyle.buttongrp}
                    >
                      <FaFileCsv />
                      &ensp;Export to CSV&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("printproductionday") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprintview}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfproductionday") && (
                  // <>
                  //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdfView()}>
                  //     <FaFilePdf />
                  //     &ensp;Export to PDF&ensp;
                  //   </Button>
                  // </>
                  <>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpenView(true);
                      }}
                    >
                      <FaFilePdf />
                      &ensp;Export to PDF&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imageproductionday") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageview}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item md={2} xs={6} sm={6}>
              <Box>
                <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={searchQueryView} onChange={handleSearchChangeView} />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <br />
          <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsView}>
            Show All Columns
          </Button>
          &ensp;
          <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsView}>
            Manage Columns
          </Button>
          &ensp;
          <br />
          <br />
          {/* Manage Column */}
          <Popover
            id={id}
            open={isManageColumnsOpenView}
            anchorEl={anchorEl}
            onClose={handleCloseManageColumnsView}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {manageColumnsContentView}
          </Popover>
          {isBankdetail ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {/* <CircularProgress color="inherit" />  */}
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                  ref={gridRefview}
                  rows={rowDataTableView}
                  columns={columnDataTableView.filter((column) => columnVisibilityView[column.field])}
                  onSelectionModelChange={handleSelectionChange}
                  autoHeight={true}
                  density="compact"
                  hideFooter
                  getRowClassName={getRowClassName}
                  disableRowSelectionOnClick
                />
              </Box>

              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing {filteredDataView.length > 0 ? (pageView - 1) * pageSizeView + 1 : 0} to {Math.min(pageView * pageSizeView, filteredDatasView.length)} of {filteredDatasView.length} entries
                </Box>
                <Box>
                  <Button onClick={() => setPageView(1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                    <FirstPageIcon />
                  </Button>
                  <Button onClick={() => handlePageChangeView(pageView - 1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                    <NavigateBeforeIcon />
                  </Button>
                  {pageNumbersView?.map((pageViewNumberView) => (
                    <Button key={pageViewNumberView} sx={userStyle.paginationbtn} onClick={() => handlePageChangeView(pageViewNumberView)} className={pageView === pageViewNumberView ? "active" : ""} disabled={pageView === pageViewNumberView}>
                      {pageViewNumberView}
                    </Button>
                  ))}
                  {lastVisiblePageView < totalPageViews && <span>...</span>}
                  <Button onClick={() => handlePageChangeView(pageView + 1)} disabled={pageView === totalPageViews} sx={userStyle.paginationbtn}>
                    <NavigateNextIcon />
                  </Button>
                  <Button onClick={() => setPageView(totalPageViews)} disabled={pageView === totalPageViews} sx={userStyle.paginationbtn}>
                    <LastPageIcon />
                  </Button>
                </Box>
              </Box>
            </>
          )}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button variant="contained" color="error" onClick={handleViewDialogClose}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* CATEGORYVIEW DIalog */}
      <Dialog open={isCategoryViewDialog} onClose={handleCategoryViewDialogClose} aria-labelledby="alert-dialog-title" maxWidth="1400px" fullWidth={true} aria-describedby="alert-dialog-description">
        <DialogContent sx={{ padding: "20px" }}>
          <Typography variant="h6">{"CategoryView List"}</Typography>
          <Grid container style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <label>Show entries:</label>
                <Select
                  id="pageSizeCategoryViewSelect"
                  size="small"
                  value={pageSizeCategoryView}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180,
                        width: 80,
                      },
                    },
                  }}
                  onChange={handlePageSizeChangeCategoryView}
                  sx={{ width: "77px" }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={viewData?.length}>All</MenuItem>
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
                {isUserRoleCompare?.includes("excelproductionday") && (
                  <>
                    <Button
                      onClick={(e) => {
                        setIsFilterOpenCategoryView(true);

                        setFormat("xl");
                      }}
                      sx={userStyle.buttongrp}
                    >
                      <FaFileExcel />
                      &ensp;Export to Excel&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvproductionday") && (
                  <>
                    <Button
                      onClick={(e) => {
                        setIsFilterOpenCategoryView(true);
                        setFormat("csv");
                      }}
                      sx={userStyle.buttongrp}
                    >
                      <FaFileCsv />
                      &ensp;Export to CSV&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("printproductionday") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprintCategoryView}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfproductionday") && (
                  <>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpenCategoryView(true);
                      }}
                    >
                      <FaFilePdf />
                      &ensp;Export to PDF&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imageproductionday") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImageCategoryView}>
                    {" "}
                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item md={2} xs={6} sm={6}>
              <Box>
                <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={searchQueryCategoryView} onChange={handleSearchChangeCategoryView} />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <br />
          <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsCategoryView}>
            Show All Columns
          </Button>
          &ensp;
          <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsCategoryView}>
            Manage Columns
          </Button>
          &ensp;
          <br />
          <br />
          {/* Manage Column */}
          <Popover
            id={idCategoryView}
            open={isManageColumnsOpenCategoryView}
            anchorEl={anchorElCategoryView}
            onClose={handleCloseManageColumnsCategoryView}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {manageColumnsContentCategoryView}
          </Popover>
          {isBankdetailCateView ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {/* <CircularProgress color="inherit" />  */}
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            </>
          ) : (
            <>
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
                ref={gridRefCategoryView}
              >
                <CustomStyledDataGrid
                  onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                  rows={rowDataTableCategoryView}
                  columns={columnDataTableCategoryView.filter((column) => columnVisibilityCategoryView[column.field])}
                  onSelectionModelChange={handleSelectionChange}
                  autoHeight={true}
                  density="compact"
                  hideFooter
                  getRowClassName={getRowClassNameCategoryview}
                  disableRowSelectionOnClick
                />
              </Box>

              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing {filteredDataCategoryView.length > 0 ? (pageCategoryView - 1) * pageSizeCategoryView + 1 : 0} to {Math.min(pageCategoryView * pageSizeCategoryView, filteredDatasCategoryView.length)} of {filteredDatasCategoryView.length} entries
                </Box>
                <Box>
                  <Button onClick={() => setPageCategoryView(1)} disabled={pageCategoryView === 1} sx={userStyle.paginationbtn}>
                    <FirstPageIcon />
                  </Button>
                  <Button onClick={() => handlePageChangeCategoryView(pageCategoryView - 1)} disabled={pageCategoryView === 1} sx={userStyle.paginationbtn}>
                    <NavigateBeforeIcon />
                  </Button>
                  {pageNumbersCategoryView?.map((pageCategoryViewNumberCategoryView) => (
                    <Button key={pageCategoryViewNumberCategoryView} sx={userStyle.paginationbtn} onClick={() => handlePageChangeCategoryView(pageCategoryViewNumberCategoryView)} className={pageCategoryView === pageCategoryViewNumberCategoryView ? "active" : ""} disabled={pageCategoryView === pageCategoryViewNumberCategoryView}>
                      {pageCategoryViewNumberCategoryView}
                    </Button>
                  ))}
                  {lastVisiblePageCategoryView < totalPageCategoryViews && <span>...</span>}
                  <Button onClick={() => handlePageChangeCategoryView(pageCategoryView + 1)} disabled={pageCategoryView === totalPageCategoryViews} sx={userStyle.paginationbtn}>
                    <NavigateNextIcon />
                  </Button>
                  <Button onClick={() => setPageCategoryView(totalPageCategoryViews)} disabled={pageCategoryView === totalPageCategoryViews} sx={userStyle.paginationbtn}>
                    <LastPageIcon />
                  </Button>
                </Box>
              </Box>
            </>
          )}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button variant="contained" color="error" onClick={handleCategoryViewDialogClose}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/*DELETE ALERT DIALOG */}
      <Dialog open={isDeleteOpen} onClose={handleDeleteClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={(e) => {
              deleteMatchidList();
            }}
            loading={isloadDelUniqid}
            color="error"
            loadingPosition="end"
            variant="contained"
          >
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*DELETE ALERT DIALOG */}
      <Dialog open={isLoaderDialog} onClose={handleLoaderDialogClose} aria-labelledby="alert-dialog-title" maxWidth="sm" fullWidth={true} aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          {alertMsg}
          <LinearProgressBar progress={alert} />
        </DialogContent>
      </Dialog>

      {/*DELETE DAYPOINT BEFORE DATE ALERT DIALOG */}
      <Dialog open={lastDayDelPop.open} onClose={handleLastDayDelPopClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <RemoveCircleOutlineIcon sx={{ fontSize: "80px", color: "#ff0000" }} />

          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to delete </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(lastDayDelPop.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Day point? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLastDayDelPopClose}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={(e) => {
              handleBeforeDayPointDelandProdDayCreate(lastDayDelPop.date);
            }}
            loading={deldayPointLoad}
            color="error"
            loadingPosition="end"
            variant="contained"
          >
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*CREATE PRIDUCTION DAY BEFORE DATE ALERT DIALOG */}
      <Dialog open={lastProdDayCreatePop.open} onClose={handleLastProdDayCreatePopClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          {/* <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Do you want to rerun {lastProdDayCreatePop.date} date Production Day?
          </Typography> */}
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to rerun </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(lastProdDayCreatePop.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Production Day? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLastProdDayCreatePopClose}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={(e) => {
              handlelastProdDayDelCreate(lastProdDayCreatePop.date, "");
            }}
            loading={deldayPointLoad}
            color="error"
            loadingPosition="end"
            variant="contained"
          >
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*CREATE PRIDUCTION DAY BEFORE DATE ALERT DIALOG */}
      <Dialog open={lastProdDayCreatePopNew.open} onClose={handleLastProdDayCreatePopCloseNew} maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: { md: "350px" }, textAlign: "center", alignItems: "center" }}>
          <AddCircleOutlineIcon sx={{ fontSize: "80px", color: "green" }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to create </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(lastProdDayCreatePopNew.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Production Day? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLastProdDayCreatePopCloseNew}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={(e) => {
              handlelastProdDayCreateNew(lastProdDayCreatePopNew.date, "newcreate");
            }}
            loading={deldayPointLoad}
            color="error"
            loadingPosition="end"
            variant="contained"
          >
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*CREATE LAST DATE DAYPOINT */}
      <Dialog open={createDaypointLastdate.open} onClose={handleLastDaypointCreatePopClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <AddCircleOutlineIcon sx={{ fontSize: "80px", color: "green" }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to create </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(createDaypointLastdate.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Day Point? </span>
          {/* <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Do you want to create {createDaypointLastdate.date} Day Point?
          </Typography> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLastDaypointCreatePopClose}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={(e) => {
              handleDayPointCreateLastDay(createDaypointLastdate.date, "popup");
            }}
            loading={createdayPointLoadPop}
            color="error"
            loadingPosition="end"
            variant="contained"
          >
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*CREATE DAY POINT SELECTED DATE */}
      <Dialog open={createDaypointSelecteddate.open} onClose={handleSelectedDaypointCreatePopClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <AddCircleOutlineIcon sx={{ fontSize: "80px", color: "green" }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to create </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(createDaypointSelecteddate.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Day Point? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSelectedDaypointCreatePopClose}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={(e) => {
              handleDayPointCreateLastDay(createDaypointSelecteddate.date, "finalpop");
            }}
            loading={createdayPointLoadPop}
            color="error"
            loadingPosition="end"
            variant="contained"
          >
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*CREATE DAY POINT SELECTED DATE */}
      <Dialog open={delCurrDaypoint.open} onClose={handleCurrentDaypointDelPopClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <RemoveCircleOutlineIcon sx={{ fontSize: "80px", color: "#ff0000" }} />

          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to delete </Typography>
          <span style={{ color: "red", textAlign: "center", fontSize: "20px", fontWeight: "bolder" }}> ({moment(delCurrDaypoint.date).format("DD-MM-YYYY")})</span>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}> this date Day Point? </span>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCurrentDaypointDelPopClose}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={(e) => {
              handleCurrDayPointDel(delCurrDaypoint.date, "rerundel", delCurrDaypoint.uniqueid, delCurrDaypoint.beforeProdDay, delCurrDaypoint.beforeDayPoint, delCurrDaypoint.currDaypoint);
            }}
            loading={deldayPointLoadPop}
            color="error"
            loadingPosition="end"
            variant="contained"
          >
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/*CDAYPOINT CREATE CONFIRMATION TO PREVENT DOUBLE CLICK*/}
      <Dialog open={openDaypointCreateConfirm.open} onClose={handleCloseDaypointCreateConfirmPopup} maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: { md: "295px" }, textAlign: "center", alignItems: "center" }}>
          {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: '80px', color: 'green' }} /> */}
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}> Do you want to create {moment(openDaypointCreateConfirm.date).format("DD-MM-YYYY")} daypoint </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDaypointCreateConfirmPopup}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={(e) => {
              handleDayPointCreate(openDaypointCreateConfirm.date);
            }}
            loading={isloadingPop}
            color="error"
            loadingPosition="end"
            variant="contained"
          >
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

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
        itemsTwo={items ?? []}
        filename={"Production Day"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <ExportDataView
        isFilterOpen={isFilterOpenView}
        handleCloseFilterMod={handleCloseFilterModView}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenView}
        isPdfFilterOpen={isPdfFilterOpenView}
        setIsPdfFilterOpen={setIsPdfFilterOpenView}
        handleClosePdfFilterMod={handleClosePdfFilterModView}
        filteredDataTwo={rowDataTableView ?? []}
        itemsTwo={itemsView ?? []}
        filename={"Production Day List"}
        exportColumnNames={exportColumnNamesView}
        exportRowValues={exportRowValuesView}
        componentRef={componentRefview}
      />
      <ExportDataCateView
        isFilterOpen={isFilterOpenCategoryView}
        handleCloseFilterMod={handleCloseFilterModCategoryView}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenCategoryView}
        // isPdfFilterOpen={isPdfFilterOpenCategoryView}
        // setIsPdfFilterOpen={setIsPdfFilterOpenCategoryView}
        handleClosePdfFilterMod={handleClosePdfFilterModCategoryView}
        filteredDataTwo={rowDataTableCategoryView ?? []}
        itemsTwo={itemsCategoryView ?? []}
        filename={"Production Day View List"}
        exportColumnNames={exportColumnNamesCategoryView}
        exportRowValues={exportRowValuesCategoryView}
        componentRef={componentRefview}
      />

      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpenView} onClose={handleClosePdfFilterModView} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
            onClick={handleClosePdfFilterModView}
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
              downloadPdfView("filtered");
              setIsPdfFilterOpenView(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdfView("overall");
              setIsPdfFilterOpenView(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpenCategoryView} onClose={handleClosePdfFilterModCategoryView} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
            onClick={handleClosePdfFilterModCategoryView}
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
              downloadPdfCategoryView("filtered");
              setIsPdfFilterOpenCategoryView(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdfCategoryView("overall");
              setIsPdfFilterOpenCategoryView(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* VALIDATION */}
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default ProductionDay;