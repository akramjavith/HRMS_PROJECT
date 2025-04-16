import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, Dialog, Chip, DialogContent, List, ListItem, ListItemText, Popover, TextField, IconButton, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody,
} from "@mui/material";
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
// import AlertDialog from "../../../components/Alert";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import {
//   DeleteConfirmation,
//   PleaseSelectRow,
// } from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading";
import ExportData from "../../../components/ExportData";
import ExportDataView from "../../../components/ExportData";
import ExportDataCateView from "../../../components/ExportData";
// import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import AlertDialog from "../../../components/Alert";


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



  const [fileFormat, setFormat] = useState('');

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

  let exportColumnNames = [

    "Date",
    "Company Name",
    "Created Date",
    "Day Point Status"
  ]
  let exportRowValues = [

    "date",
    "companyname",
    "createddate",
    "status"
  ]

  //Rowdatatable view 

  let exportColumnNamesView = [
    'Mode',
    'Company', 'Branch',
    'Unit', 'Team',
    'Name', 'Emp Code',
    'Department', 'Date',
    'Project-Vendor', 'User',
    'Category', 'Process Code',
    'Exp', 'Target',
    'Points', 'Avg Point',
    'P Process', 'S Process',
    'Con Tar', 'Con Points',
    'Con Avg'
  ]
  let exportRowValuesView = [

    'mode',
    'company', 'branch',
    'unit', 'team',
    'empname', 'empcode',
    'department', 'date',
    'vendor', 'user',
    'filename', 'processcode',
    'experience', 'target',
    'points', 'avgpoint',
    'aprocess', 'sprocess',
    'contarget', 'conpoints',
    'conavg'
  ]

  //Rowdatatable Category view 

  let exportColumnNamesCategoryView = [
    'Mode', 'Name',
    'Date', 'Vendor',
    'User', 'IdentifyNumber',
    'Category', 'SubCategory',
    'U-Unitrate', 'A-Unitrate',
    'U-Flag', 'A-Flag', "Points"
  ]
  let exportRowValuesCategoryView = [

    'mode', 'empname',
    'dateval', 'vendor',
    'user', 'unitid',
    'filename', 'category',
    'unitrate', 'updatedunitrate',
    'flagcount', 'updatedflag', 'points'
  ]

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
    setIsFilterOpenView(false);
  };

  const handleClosePdfFilterModCategoryView = () => {
    setIsPdfFilterOpenCategoryView(false);
  };

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

  const openCategoryView = Boolean(anchorElCategoryView);
  const idCategoryView = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row";
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
    action: true,
  };
  // Show All Columns & Manage Columns
  const initialcolumnVisibilityCategoryView = {
    serialNumber: true,
    dateval: true,
    mode: true,
    // company: true,
    // branch: true,
    // unit: true,
    // team: true,
    empname: true,
    // empcode: true,
    // department: true,
    vendor: true,
    user: true,
    filename: true,
    category: true,
    unitid: true,
    // processcode: true,
    // experience: true,
    // target: true,
    // points: true,
    // avgpoint: true,
    // aprocess: true,
    // sprocess: true,
    // contarget: true,
    // conpoints: true,
    // conavg: true,
    uunitrate: true,
    aunitrate: true,
    uflag: true,
    aflag: true,
    points: true,

  };


  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [columnVisibilityView, setcolumnVisibilityView] = useState(initialcolumnVisibilityView);
  const [columnVisibilityCategoryView, setcolumnVisibilityCategoryView] = useState(initialcolumnVisibilityCategoryView);

  //get all productionDays list details
  const fetchProductionDay = async () => {
    try {
      setBankdetail(true);

      const [res, res_queue] = await Promise.all([
        axios.get(SERVICE.PRODUCTION_DAYS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.GET_DAY_POINTS_LIMITED_DATE_ONLY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let finaldaypts = res_queue.data.daypointsupload.map(item => item.date)

      let finalproddays = res.data.productiondays.map(item => {
        return {
          ...item,
          status: finaldaypts.includes(item.date) ? "Created" : "Not Created"
        }
      }

      )

      let sorted = finalproddays.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA > dateB) return -1; // For descending date order
        if (dateA < dateB) return 1;  // For descending date order

      });


      setProductionDays(sorted);
      setBankdetail(false);
    } catch (err) {
      console.log(err, 'err')
      setBankdetail(false); handleApiError(err, setShowAlert, handleClickOpenerr);
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


    // doc.autoTable({
    //   theme: "grid",

    //   styles: {
    //     fontSize: 5,
    //   },
    //   columns: columnsview,
    //   body: rowDataTableView,
    // });
    doc.save("Production Point Creation.pdf");
  };

  // Excel
  const fileName = "Production Point Creation";

  //  PDF
  const columnscategoryview = [
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Mode", dataKey: "mode" },
    { title: "Name", dataKey: "empname" },
    { title: "Date", dataKey: "dateval" },
    { title: "Vendor", dataKey: "vendor" },
    { title: "User", dataKey: "user" },
    { title: "IdentifyNumber", dataKey: "unitid" },
    { title: "Category", dataKey: "filename" },
    { title: "SubCategory", dataKey: "category" },
    { title: "uunitrate", dataKey: "uunitrate" },
    { title: "aunitrate", dataKey: "aunitrate" },
    { title: "uflag", dataKey: "uflag" },
    { title: "aflag", dataKey: "aflag" },

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
      // const deletePromises = deleteIdList?.map((item) => {
      // return axios.delete(`${SERVICE.PRODUCTION_DAY_LIST_SINGLE}/${item}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });
      // });
      // await Promise.all(deletePromises);
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
  const handleViewDataCategory = async (userid, category, fromtodate, params) => {
    console.log(userid, category, fromtodate, params)
    setCategoryViewData([])
    // Split the string at the $
    const dateTimeArray = fromtodate.split('$');
    // Extract dates
    const startDate = dateTimeArray[0].split('T')[0];
    const endDate = dateTimeArray[1].split('T')[0];
    setBankdetailCateView(true);
    setviewbtnload(params.row.id);
    console.log(new Date(dateTimeArray[0]), new Date(dateTimeArray[1]), 'datetme')

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
      // console.log(RES.data.productionupload)
      let categoryDate = RES.data.productionupload.map(item => {
        let uploadOrgDate = params.row.mode === "Manual" ? "" : item.dateval.split(" IST")[0]
        let finalDateTime = params.row.mode === "Manual" ? `${item.fromdate}T${item.time}Z` : `${uploadOrgDate.split(" ")[0]}T${uploadOrgDate.split(" ")[1]}Z`;

        // console.log(new Date(finalDateTime), new Date(dateTimeArray[0]), new Date(dateTimeArray[1]))
        if (new Date(finalDateTime) >= new Date(dateTimeArray[0]) && new Date(finalDateTime) <= new Date(dateTimeArray[1]))
          return {
            ...item,
            empname: params.row.empname
          }
      })

      setCategoryViewData(categoryDate.filter(item => item != null && item != undefined));
      setBankdetailCateView(false);
      setviewbtnload("");
      handleCategoryViewDialogOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [dayPointDelId, setDayPointDelId] = useState("")
  //set function to get particular row
  const rowDataDaypoint = async (date) => {
    try {
      console.log(date)
      let res = await axios.post(SERVICE.GET_DAYPOINT_ID_BYDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date
      });
      setDayPointDelId(res?.data?.daypointsupload._id);
      handleClickOpenDayPoint();
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
  const [isloading, setIsloading] = useState(false)
  const handleDayPointCreate = async (date) => {
    try {
      setIsloading(date);
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

      const ans = [
        {
          filename: `ORIGINAL_DAYPOINT_${finaldate}`,
          date: date,
          uploaddata: finalData,
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

      try {
        // setLoading(true); // Set loading to true when starting the upload
        xmlhttp.open("POST", SERVICE.ADD_DAY_POINTS);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(ans));
        await fetchProductionDay();
        // setdocumentFiles([]);
        setIsloading("");
      } catch (err) {
      } finally {

        setPopupContent("Created Successfully 👍");
        setPopupSeverity("success");
        handleClickOpenPopup();
        await fetchProductionDay();
      }

    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  const handleRerun = async (id, date, uniqueid) => {
    try {
      let res_Delete_Day_List = await axios.post(SERVICE.PRODUCTION_DAY_LIST_DELETE_UNIQID, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        uniqid: uniqueid,
      });

      let res_Target = await axios.get(SERVICE.TARGETPOINTS_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setTarpoints(res_employee.data.targetpoints);
      let targetPoints = res_Target.data.targetpoints;

      let res_Cate = await axios.get(SERVICE.CATEGORYPROCESSMAP_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let categoryProcessMap = res_Cate.data.categoryprocessmaps;

      let res_employee = await axios.post(SERVICE.DEPTMONTHSET_PROD_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });
      let filteredMonthsets = res_employee.data.departmentdetails;

      const response = await axios.post(
        SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY,
        {
          date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let datavalue = response.data.productionupload;

      // const result = [];

      // // Create a map to store the accumulated unitrate values
      // const unitrateMap = {};

      // datavalue.forEach((item) => {
      //   const key = item.filename + item.user; // Generating a unique key based on category and user
      //   if (unitrateMap[key]) {
      //     // If the key already exists, add the unitrate value
      //     unitrateMap[key].points += item.points;
      //   } else {
      //     // If the key doesn't exist, create a new entry
      //     unitrateMap[key] = { ...item };
      //     result.push(unitrateMap[key]); // Add to the result array
      //   }
      // });

      // let finalCalData = result.map((item) => {
      //   let findMonthStartDate = filteredMonthsets.find((data) => new Date(date) >= new Date(data.fromdate) && new Date(date) <= new Date(data.todate) && data.department === item.department);

      //   let findDate = findMonthStartDate ? findMonthStartDate.fromdate : date;

      //   const groupedByMonthProcs = {};

      //   // Group items by month
      //   item.assignExpLog &&
      //     item.assignExpLog.forEach((d) => {
      //       const monthYear = d.updatedate?.split("-").slice(0, 2).join("-");
      //       if (!groupedByMonthProcs[monthYear]) {
      //         groupedByMonthProcs[monthYear] = [];
      //       }
      //       groupedByMonthProcs[monthYear].push(d);
      //     });

      //   // Extract the last item of each group
      //   const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

      //   // Filter the data array based on the month and year
      //   lastItemsForEachMonthPros.sort((a, b) => {
      //     return new Date(a.updatedate) - new Date(b.updatedate);
      //   });
      //   // Find the first item in the sorted array that meets the criteria
      //   let filteredItem = null;

      //   for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
      //     const datenew = lastItemsForEachMonthPros[i].updatedate;

      //     if (date >= datenew) {
      //       filteredItem = lastItemsForEachMonthPros[i];
      //     } else {
      //       break;
      //     }
      //   }
      //   // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
      //   let modevalue = filteredItem;

      //   const calculateMonthsBetweenDates = (startDate, endDate) => {
      //     if (startDate && endDate) {
      //       const start = new Date(startDate);
      //       const end = new Date(endDate);

      //       let years = end.getFullYear() - start.getFullYear();
      //       let months = end.getMonth() - start.getMonth();
      //       let days = end.getDate() - start.getDate();

      //       // Convert years to months
      //       months += years * 12;

      //       // Adjust for negative days
      //       if (days < 0) {
      //         months -= 1;
      //         days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
      //       }

      //       // Adjust months for every 15 days
      //       months += Math.floor(days / 16);

      //       return months;
      //     }
      //   };

      //   // Calculate difference in months between findDate and item.doj
      //   let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
      //   if (modevalue) {
      //     //findexp end difference yes/no
      //     if (modevalue.endexp === "Yes") {
      //       differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
      //       differenceInMonthsexp = differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
      //       //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
      //       if (modevalue.expmode === "Add") {
      //         differenceInMonthsexp += parseInt(modevalue.expval);
      //       } else if (modevalue.expmode === "Minus") {
      //         differenceInMonthsexp -= parseInt(modevalue.expval);
      //       } else if (modevalue.expmode === "Fix") {
      //         differenceInMonthsexp = parseInt(modevalue.expval);
      //       }
      //     } else {
      //       differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
      //       differenceInMonthsexp = differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
      //       // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
      //       if (modevalue.expmode === "Add") {
      //         differenceInMonthsexp += parseInt(modevalue.expval);
      //       } else if (modevalue.expmode === "Minus") {
      //         differenceInMonthsexp -= parseInt(modevalue.expval);
      //       } else if (modevalue.expmode === "Fix") {
      //         differenceInMonthsexp = parseInt(modevalue.expval);
      //       } else {
      //         // differenceInMonths = parseInt(modevalue.expval);
      //         differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
      //       }
      //     }

      //     //findtar end difference yes/no
      //     if (modevalue.endtar === "Yes") {
      //       differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
      //       //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
      //       differenceInMonthstar = differenceInMonthstar < 1 ? 0 : differenceInMonthstar;
      //       if (modevalue.expmode === "Add") {
      //         differenceInMonthstar += parseInt(modevalue.expval);
      //       } else if (modevalue.expmode === "Minus") {
      //         differenceInMonthstar -= parseInt(modevalue.expval);
      //       } else if (modevalue.expmode === "Fix") {
      //         differenceInMonthstar = parseInt(modevalue.expval);
      //       }
      //     } else {
      //       differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
      //       differenceInMonthstar = differenceInMonthstar < 1 ? 0 : differenceInMonthstar;
      //       if (modevalue.expmode === "Add") {
      //         differenceInMonthstar += parseInt(modevalue.expval);
      //       } else if (modevalue.expmode === "Minus") {
      //         differenceInMonthstar -= parseInt(modevalue.expval);
      //       } else if (modevalue.expmode === "Fix") {
      //         differenceInMonthstar = parseInt(modevalue.expval);
      //       } else {
      //         // differenceInMonths = parseInt(modevalue.expval);
      //         differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
      //       }
      //     }

      //     differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
      //     differenceInMonths = differenceInMonths < 1 ? 0 : differenceInMonths;
      //     if (modevalue.expmode === "Add") {
      //       differenceInMonths += parseInt(modevalue.expval);
      //     } else if (modevalue.expmode === "Minus") {
      //       differenceInMonths -= parseInt(modevalue.expval);
      //     } else if (modevalue.expmode === "Fix") {
      //       differenceInMonths = parseInt(modevalue.expval);
      //     } else {
      //       // differenceInMonths = parseInt(modevalue.expval);
      //       differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
      //     }
      //   } else {
      //     differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
      //     differenceInMonthsexp = differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;

      //     differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
      //     differenceInMonthstar = differenceInMonthstar < 1 ? 0 : differenceInMonthstar;

      //     differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
      //     differenceInMonths = differenceInMonths < 1 ? 0 : differenceInMonths;
      //   }

      //   let findexpval = differenceInMonthstar < 1 ? "00" : differenceInMonthstar < 9 ? "0" + differenceInMonthstar : differenceInMonthstar;

      //   let getprocessCode = item.processcode + findexpval;

      //   let findSalDetails = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === getprocessCode);

      //   let findTargetVal = findSalDetails ? Number(findSalDetails.points) : "";
      //   let roundedPoints = Number(item.points.toFixed(3));

      //   let avgPointValue = findTargetVal > 0 ? Number(((roundedPoints / findTargetVal) * 100).toFixed(3)) : "";

      //   const [findProj] = item.vendor.split("-");

      //   let findPrimaryProcess = categoryProcessMap.find((d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Primary" && d.process.slice(-4) === item.processcode.slice(-4) && findProj === d.project && d.categoryname.toLowerCase() === item.filename.toLowerCase());
      //   let findSecondayProcess = categoryProcessMap.find((d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Secondary" && d.process === item.processcode && findProj === d.project && d.categoryname.toLowerCase() === item.filename.toLowerCase());

      //   let AprocessValue = findPrimaryProcess && findPrimaryProcess.processtypes === "Primary" ? findPrimaryProcess.process : "";
      //   let SprocessValue = findSecondayProcess && findSecondayProcess.processtypes === "Secondary" ? findSecondayProcess.process : "";

      //   let AlterProcessCode = AprocessValue + findexpval;

      //   let findSalDetailsForAlterProcess = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === AlterProcessCode);

      //   let findTargetValForAlterProcess = findSalDetailsForAlterProcess ? Number(findSalDetailsForAlterProcess.points) : "";
      //   let conTargetValue = 0;
      //   let conPoints = 0;

      //   let conavg = 0;
      //   if (AprocessValue === "" && SprocessValue === "") {
      //     conTargetValue = 0;
      //     conPoints = 0;

      //     conavg = 0;
      //   } else {
      //     conTargetValue = SprocessValue === "" && AprocessValue !== item.process ? findTargetValForAlterProcess : findTargetVal;
      //     conPoints = SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.points : roundedPoints;

      //     conavg = SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (((findTargetVal / findTargetValForAlterProcess) * item.points) / conTargetValue) * 100 : avgPointValue;
      //   }
      //   return {
      //     ...item,
      //     experience: differenceInMonthstar < 1 ? 0 : differenceInMonthstar,
      //     target: findTargetVal,
      //     project: findProj,
      //     points: roundedPoints,
      //     aprocess: AprocessValue,
      //     sprocess: SprocessValue,
      //     avgpoint: avgPointValue,
      //     contarget: conTargetValue,
      //     conpoints: conPoints > 0 ? Number(conPoints).toFixed(6) : conPoints,
      //     conavg: conavg > 0 ? Number(conavg).toFixed(6) : conavg,
      //   };
      // });

      // finalCalData?.map((item) => {
      //   return axios.post(`${SERVICE.PRODUCTION_DAY_LIST_CREATE}`, {
      //     headers: {
      //       Authorization: `Bearer ${auth.APIToken}`,
      //     },
      //     company: String(item.company),
      //     branch: String(item.branch),
      //     unit: String(item.unit),
      //     team: String(item.team),
      //     department: String(item.department),
      //     experience: String(item.experience),
      //     project: String(item.project),
      //     empname: String(item.empname),
      //     empcode: String(item.empcode),
      //     dateval: String(item.dateval),
      //     user: String(item.user),
      //     unitid: String(item.unitid),
      //     username: String(item.username),
      //     doj: String(item.doj),
      //     mode: String(item.mode),
      //     unitrate: String(item.unitrate),
      //     target: String(item.target),
      //     points: String(item.points),
      //     avgpoint: String(item.avgpoint),
      //     processcode: String(item.processcode),
      //     aprocess: String(item.aprocess),
      //     sprocess: String(item.sprocess),
      //     filename: String(item.filename),
      //     category: String(item.category),
      //     processtypes: String(item.processtype),
      //     contarget: String(item.contarget),
      //     conpoints: String(item.conpoints),
      //     conavg: String(item.conavg),
      //     uniqueid: Number(uniqueid),
      //     // ...item,
      //     addedby: [
      //       {
      //         name: String(username),
      //         companyname: String(companyname),
      //         date: String(new Date()),
      //       },
      //     ],
      //   });
      // });

      // let RES = await axios.put(`${SERVICE.PRODUCTION_DAY_SINGLE}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      //   // date: String(selectedDate),
      //   createddate: String(new Date()),
      //   username: String(username),
      //   companyname: String(companyname),

      // });
      // // setViewData(RES.data.productiondaylists);
      // await fetchProductionDay();
      // // handleViewDialogOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 130,
      hide: !columnVisibility.date,
    },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 280,
      hide: !columnVisibility.companyname,
    },
    {
      field: "createddate",
      headerName: "Created Date",
      flex: 0,
      width: 230,
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
            <Chip
              sx={{ height: "25px" }}
              color={params.row.status === "Created" ? "success" : "warning"} variant="outlined"
              label={params.row.status}
            />

          </Grid>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
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
              <Button color="info" disabled onClick={(e) => handleRerun(params.row.id, params.row.dateold, params.row.uniqueid)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
                Re run
              </Button>
            )}

            {isUserRoleCompare?.includes("dproductionday") && (
              <Button color="error" disabled={params.row.status == "Created"} onClick={(e) => handleDelete(params.row.uniqueid, params.row.id, params.row.date)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
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
      width: 160,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actionsdaypoint,
      headerClassName: "bold-header",
      renderCell: (params) => {
        return (
          <Grid sx={{ display: "flex", gap: "8px" }}>
            {isUserRoleCompare?.includes("vproductionday") && (
              params.row.status == "Created" ?
                <Button color="warning" onClick={(e) => {
                  rowDataDaypoint(params.row.dateold);
                }} variant="contained" sx={{ textTransform: "capitalize", backgroundColor: "#ff5722", padding: "4px" }}>
                  <RemoveCircleIcon />  Daypoint Delete
                </Button>
                :
                // <Button color="success" 
                // onClick={(e) => handleDayPointCreate(params.row.dateold)}
                //  variant="contained" sx={{ textTransform: "capitalize", backgroundColor: "#1b8971", padding: "4px" }}>
                //   <AddCircleIcon />  Daypoint Create
                // </Button>
                <LoadingButton
                  // disabled={dataArrayLength > 0}
                  loading={isloading === params.row.dateold}
                  onClick={(e) => handleDayPointCreate(params.row.dateold)}
                  sx={{ textTransform: "capitalize", backgroundColor: "#1b8971", '&:hover': { backgroundColor: "#1b8971" }, color: "white", padding: "4px" }}
                  //  
                  loadingPosition="end"

                >
                  <AddCircleIcon />  Daypoint Create
                </LoadingButton>

            )
            }
          </Grid >
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
  }, []);

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
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
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
          conpoints: item.conpoints ? Number(item.conpoints) : "",
          contarget: item.contarget ? Number(item.contarget) : "",
          avgpoint: item.avgpoint ? Number(item.avgpoint) : "",
          points: item.points ? Number(item.points) : "",
          target: item.target ? Number(item.target) : "",
          experience: item.experience ? Number(item.experience) : "",
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
              <LoadingButton
                onClick={(e) => handleViewDataCategory(params.row.user, params.row.filename, params.row.fromtodate, params)}

                loading={viewbtnload === params.row.id}
                color="primary"
                loadingPosition="end"
                variant="contained"
              >
                View
              </LoadingButton>
            )}
          </Grid>
        )
      }
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
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityView[column.field]} onChange={() => togglecolumnVisibilityView(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              />
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

  const [alert, setAlert] = useState("");
  const [isCheckUnAllotMismatch, setIsCheckUnAllotMismatch] = useState(false);

  const handleFilterSave = async () => {
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
          date: selectedDate,
        });


      } catch (err) {
        console.log(err, 'err')
        setIsCheckUnAllotMismatch(false);
        handleLoaderDialogClose();
        setBankdetail(false);
        handleApiError(err, setShowAlert, handleClickOpenerr);

      }

      let checkDate = res_Day.data.count > 0;


      if (selectedDate === "") {
        setIsCheckUnAllotMismatch(false);

        setPopupContentMalert("Please Select Date");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (checkDate) {
        setIsCheckUnAllotMismatch(false);

        setPopupContentMalert("Already this Date Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        handleLoaderDialogClose();
        setBankdetail(false);
        setIsCheckUnAllotMismatch(false);
      }
      else {
        let dateoneafter = new Date(selectedDate);
        dateoneafter.setDate(dateoneafter.getDate() + 1);
        let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

        let dateonebefore = new Date(selectedDate);
        dateonebefore.setDate(dateonebefore.getDate() - 1);
        let newDateOneMinus = dateonebefore.toISOString().split("T")[0];
        setIsCheckUnAllotMismatch(true);

        try {
          // Fetch all necessary data
          let [result, ResChevkCount] = await Promise.all([
            axios.post(SERVICE.CHECK_ZERO_MISMATCH_PRESENT, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selectedDate,
            }),
            axios.post(SERVICE.GET_UNIQID_FROM_DATE_PRODUPLOAD, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: selectedDate,
            }),
          ])

          if (ResChevkCount.data.totalSum != ResChevkCount.data.productionUpload) {
            setIsCheckUnAllotMismatch(false);

            setPopupContentMalert(`Please review the uploaded files. Some data may not have been fully uploaded for these dates ${newDateOneMinus}, ${selectedDate}, ${newDateOnePlus}`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

            setIsCheckUnAllotMismatch(false);
            handleLoaderDialogClose();
          }
          else if (result.data.count > 0) {

            setIsCheckUnAllotMismatch(false);

            setPopupContentMalert(`Please Update these dates (${moment(new Date(selectedDate)).format("DD-MM-YYYY")}, ${moment(new Date(newDateOnePlus)).format("DD-MM-YYYY")})
            Unitrate Unalloted values`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

            setIsCheckUnAllotMismatch(false);
            handleLoaderDialogClose();
          }
          else {
            try {



              let startMonthDateMinus = new Date(selectedDate);
              let startdate = startMonthDateMinus.setDate(startMonthDateMinus.getDate() - 1);
              let startMonthDate = new Date(startdate);

              let firstDate = new Date(selectedDate);
              let enddate = firstDate.setDate(firstDate.getDate() + 1);
              let endMonthDate = new Date(enddate);


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
              console.log(daysArray, 'daysArray')
              handleProgressUpdate(alertval, "Checking...");
              handleLoaderDialogOpen();
              let res_Target;
              try {
                res_Target = await axios.get(SERVICE.TARGETPOINTS_LIMITED, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                });
              } catch (err) {
                console.log(err, 'err')
                setIsCheckUnAllotMismatch(false);
                handleLoaderDialogClose();
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
              let targetPoints = res_Target.data.targetpoints ? res_Target.data.targetpoints : [];
              let res_Cate;
              try {
                res_Cate = await axios.get(SERVICE.CATEGORYPROCESSMAP_LIMITED, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                });
              } catch (err) {
                console.log(err, 'err')
                setIsCheckUnAllotMismatch(false);
                handleLoaderDialogClose();
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
              let categoryProcessMap = res_Cate.data.categoryprocessmaps;

              handleProgressUpdate(2, "Checking...");
              let res_employee;
              try {
                res_employee = await axios.post(SERVICE.DEPTMONTHSET_PROD_LIMITED, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  date: selectedDate,
                });
              } catch (err) {
                console.log(err, 'err')
                setIsCheckUnAllotMismatch(false);
                handleLoaderDialogClose();
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
              let filteredMonthsets = res_employee.data.departmentdetails;

              handleProgressUpdate(3, "Checking...");

              async function fetchDataInBatches() {
                let batchNumber = 1;
                let allData = [];
                let hasMoreData = true;

                while (hasMoreData) {
                  try {
                    const response = await axios.post(
                      SERVICE.PRODUCTION_UPLOAD_GET_SINGLEDATE_DATA_PRODUCTION_DAY,
                      {
                        date: selectedDate,
                        userDates: daysArray,
                        batchNumber: batchNumber,
                        batchSize: 40000,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${auth.APIToken}`,
                        },
                      }
                    );

                    if (response.data.productionupload.length === 0) {
                      hasMoreData = false;
                    } else {
                      console.log(response.data.productionupload)
                      let filtered = response.data.productionupload.filter(item => item != null)
                      allData = [...allData, ...filtered];
                      batchNumber++;
                      handleProgressUpdate(3 + batchNumber / 2, "Checking...");
                    }
                  } catch (err) {
                    console.log(err.response.data.message, 'err123888')
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
                    let datavalue = allData.filter((d) => d != null);

                    if (datavalue.length > 0) {
                      handleLoaderDialogOpen();

                      handleProgressUpdate(5, "Creating...");

                      const result = [];

                      const unitrateMap = {};

                      datavalue.forEach((item) => {

                        const key = item.filename + item.user; // Generating a unique key based on category and user
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
                        let findMonthStartDate = filteredMonthsets.find((data) => new Date(selectedDate) >= new Date(data.fromdate) && new Date(selectedDate) <= new Date(data.todate) && data.department === item.department);

                        let findDate = findMonthStartDate ? findMonthStartDate.fromdate : selectedDate;
                        const groupedByMonthProcs = {};

                        // Group items by month
                        item.assignExpLog &&
                          item.assignExpLog.forEach((d) => {
                            const monthYear = d.updatedate?.split("-").slice(0, 2).join("-");
                            if (!groupedByMonthProcs[monthYear]) {
                              groupedByMonthProcs[monthYear] = [];
                            }
                            groupedByMonthProcs[monthYear].push(d);
                          });

                        // Extract the last item of each group
                        const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                        // Filter the data array based on the month and year
                        lastItemsForEachMonthPros.sort((a, b) => {
                          return new Date(a.updatedate) - new Date(b.updatedate);
                        });
                        // Find the first item in the sorted array that meets the criteria
                        let filteredItem = null;

                        for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                          const date = lastItemsForEachMonthPros[i].updatedate;

                          if (selectedDate >= date) {
                            filteredItem = lastItemsForEachMonthPros[i];
                          } else {
                            break;
                          }
                        }
                        // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
                        let modevalue = filteredItem;

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
                        //       months -= 1;
                        //       days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
                        //     }

                        //     // Adjust months for every 15 days
                        //     months += Math.floor(days / 15.5);

                        //     return months;
                        //   }
                        // };

                        const calculateMonthsBetweenDates = (startDate, endDate) => {
                          if (startDate && endDate) {
                            const start = new Date(startDate);
                            const end = new Date(endDate);

                            let years = end.getFullYear() - start.getFullYear();
                            let months = end.getMonth() - start.getMonth();
                            let days = end.getDate() - start.getDate();

                            // Convert years to months
                            months += years * 12;

                            // Adjust for negative days
                            if (days < 0) {
                              months -= 1; // Subtract a month
                              days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
                            }

                            // Adjust for days 15 and above
                            if (days >= 15) {
                              months += 1; // Count the month if 15 or more days have passed
                            }

                            return months;
                          }

                          return 0; // Return 0 if either date is missing
                        };



                        // Calculate difference in months between findDate and item.doj
                        let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
                        if (modevalue) {
                          //findexp end difference yes/no
                          if (modevalue.endexp === "Yes") {
                            differenceInMonthsexp = calculateMonthsBetweenDates(
                              item.doj,
                              modevalue.endexpdate
                            );
                            //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                            if (modevalue.expmode === "Add") {
                              differenceInMonthsexp += parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Minus") {
                              differenceInMonthsexp -= parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Fix") {
                              differenceInMonthsexp = parseInt(modevalue.expval);
                            }
                          } else {
                            differenceInMonthsexp = calculateMonthsBetweenDates(
                              item.doj,
                              findDate
                            );
                            // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                            if (modevalue.expmode === "Add") {
                              differenceInMonthsexp += parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Minus") {
                              differenceInMonthsexp -= parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Fix") {
                              differenceInMonthsexp = parseInt(modevalue.expval);
                            } else {
                              // differenceInMonths = parseInt(modevalue.expval);
                              differenceInMonthsexp = calculateMonthsBetweenDates(
                                item.doj,
                                findDate
                              );
                            }
                          }

                          //findtar end difference yes/no
                          if (modevalue.endtar === "Yes") {
                            differenceInMonthstar = calculateMonthsBetweenDates(
                              item.doj,
                              modevalue.endtardate
                            );
                            //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                            if (modevalue.expmode === "Add") {
                              differenceInMonthstar += parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Minus") {
                              differenceInMonthstar -= parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Fix") {
                              differenceInMonthstar = parseInt(modevalue.expval);
                            }
                          } else {
                            differenceInMonthstar = calculateMonthsBetweenDates(
                              item.doj,
                              findDate
                            );
                            if (modevalue.expmode === "Add") {
                              differenceInMonthstar += parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Minus") {
                              differenceInMonthstar -= parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Fix") {
                              differenceInMonthstar = parseInt(modevalue.expval);
                            } else {
                              // differenceInMonths = parseInt(modevalue.expval);
                              differenceInMonthstar = calculateMonthsBetweenDates(
                                item.doj,
                                findDate
                              );
                            }
                          }

                          differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                          if (modevalue.expmode === "Add") {
                            differenceInMonths += parseInt(modevalue.expval);
                          } else if (modevalue.expmode === "Minus") {
                            differenceInMonths -= parseInt(modevalue.expval);
                          } else if (modevalue.expmode === "Fix") {
                            differenceInMonths = parseInt(modevalue.expval);
                          } else {
                            // differenceInMonths = parseInt(modevalue.expval);
                            differenceInMonths = calculateMonthsBetweenDates(
                              item.doj,
                              findDate
                            );
                          }
                        } else {
                          differenceInMonthsexp = calculateMonthsBetweenDates(
                            item.doj,
                            findDate
                          );
                          differenceInMonthstar = calculateMonthsBetweenDates(
                            item.doj,
                            findDate
                          );
                          differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                        }


                        let findexpval = differenceInMonthstar < 1 ? "00" : differenceInMonthstar <= 9 ? "0" + differenceInMonthstar : differenceInMonthstar;

                        let getprocessCode = item.processcode + findexpval;

                        let findSalDetails = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === getprocessCode);

                        let findTargetVal = findSalDetails ? Number(findSalDetails.points) : 0;
                        let roundedPoints = Number(item.points?.toFixed(3));

                        let avgPointValue = findTargetVal > 0 ? Number(((roundedPoints / findTargetVal) * 100)?.toFixed(3)) : 0;

                        const [findProj] = item.vendor.split("-");

                        let findPrimaryProcess = categoryProcessMap.find(
                          (d) =>
                            d.company === item.company &&
                            d.branch === item.branch &&
                            d.processtypes === "Primary" &&
                            d.process.slice(-4) === item.processcode.slice(-4) &&
                            findProj === d.project &&
                            (d.categoryname)?.toLowerCase() === (item.filename)?.toLowerCase()
                        );
                        let findSecondayProcess = categoryProcessMap.find(
                          (d) => d.company === item.company && d.branch === item.branch && d.processtypes === "Secondary" && d.process === item.processcode && findProj === d.project && d.categoryname.toLowerCase() === item.filename.toLowerCase()
                        );

                        let AprocessValue = findPrimaryProcess && findPrimaryProcess.processtypes === "Primary" ? findPrimaryProcess.process : "";
                        let SprocessValue = findSecondayProcess && findSecondayProcess.processtypes === "Secondary" ? findSecondayProcess.process : "";

                        let AlterProcessCode = AprocessValue + findexpval;


                        let findSalDetailsForAlterProcess = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === AlterProcessCode);

                        let findTargetValForAlterProcess = findSalDetailsForAlterProcess ? Number(findSalDetailsForAlterProcess.points) : "";

                        let conTargetValue = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process ? findTargetValForAlterProcess : findTargetVal;


                        let conPoints = SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.points : item.points;
                        let conshiftpoints =
                          SprocessValue === "" && AprocessValue === "" ? 0 : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0 ? (findTargetVal / findTargetValForAlterProcess) * item.shiftpoints : item.shiftpoints;

                        let conavg =
                          SprocessValue === "" && AprocessValue === ""
                            ? 0
                            : SprocessValue === "" && AprocessValue !== item.process && conTargetValue > 0
                              ? (((findTargetVal / findTargetValForAlterProcess) * item.points) / findTargetVal) * 100
                              : avgPointValue;

                        return {
                          ...item,
                          experience: differenceInMonthstar < 1 ? 0 : differenceInMonthstar,
                          target: findTargetVal,

                          project: findProj,
                          points: roundedPoints,
                          aprocess: AprocessValue,
                          conshiftpoints: conshiftpoints,
                          sprocess: SprocessValue,
                          avgpoint: avgPointValue,
                          contarget: conTargetValue,
                          conpoints: conPoints > 0 ? Number(conPoints).toFixed(6) : conPoints,
                          conavg: conavg > 0 ? Number(conavg).toFixed(6) : conavg,
                        };
                      });

                      let finalRemovedUserData = finalCalData.filter(item => item.doj <= selectedDate)
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
                        console.log(err, 'err456');
                        setIsCheckUnAllotMismatch(false);
                        handleLoaderDialogClose();
                        handleApiError(err, setShowAlert, handleClickOpenerr);

                      }
                      let prodDayUniqId = resGetUniqid.data.productionDayid;
                      handleProgressUpdate(9, "Creating...");
                      let resCreate;
                      try {
                        resCreate = await axios.post(SERVICE.PRODUCTION_DAY_CREATE, {
                          headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                          },
                          date: String(selectedDate),
                          createddate: String(new Date()),
                          username: String(username),
                          companyname: String(companyname),
                          uniqueid: Number(prodDayUniqId) + 1,
                        });
                      } catch (err) {
                        console.log(err, 'err')
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
                        console.log(err, 'err')
                        handleLoaderDialogClose();
                        setIsCheckUnAllotMismatch(false);
                        handleApiError(err, setShowAlert, handleClickOpenerr);
                      }
                      handleProgressUpdate(10, "Created...");
                      await fetchProductionDay();
                      handleLoaderDialogClose();
                      setIsCheckUnAllotMismatch(false);
                    } else {
                      setIsCheckUnAllotMismatch(false);
                      handleLoaderDialogClose();

                      setPopupContentMalert("No data to Create");
                      setPopupSeverityMalert("info");
                      handleClickOpenPopupMalert();
                    }
                  }
                } catch (err) {
                  console.log(err, 'err')
                  setIsCheckUnAllotMismatch(false);
                  handleLoaderDialogClose();
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  console.error("Error fetching data:", err);
                }
              });


            } catch (err) {
              console.log(err, 'err')

              setBankdetail(false);
              setIsCheckUnAllotMismatch(false);
              handleLoaderDialogClose();
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

        } catch (err) {
          console.log(err, 'err')
          setIsCheckUnAllotMismatch(false);
          handleLoaderDialogClose();
          handleApiError(err, setShowAlert, handleClickOpenerr);

        }
        // console.log(result.data, 'dfdf')

      }
    } catch (err) {
      console.log(err, 'err')

      setBankdetail(false);
      setIsCheckUnAllotMismatch(false);
      handleLoaderDialogClose();
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // datatableCategoryv view

  const [itemsCategoryView, setItemsCategoryView] = useState([]);

  const addSerialNumberCategoryView = async () => {
    try {
      const itemsWithSerialNumber = categoryViewData?.map((item, index) => {
        let finalunitrate = item.updatedunitrate ? Number(item.updatedunitrate) : Number(item.unitrate);
        let finalflag = item.updatedflag ? Number(item.updatedflag) : Number(item.flagcount);

        return {
          ...item,
          serialNumber: index + 1,
          mode: item.mode === "Manual" ? "Manual" : "Production",
          filename: item.mode === "Manual" ? item.filename : item.filename.split(".xlsx")[0],
          dateval: item.mode === "Manual" ? `${item.fromdate} ${item.time}` : item.dateval,
          uunitrate: item.unitrate ? Number(item.unitrate) : "",
          aunitrate: item.updatedunitrate ? Number(item.updatedunitrate) : "",
          uflag: item.flagcount ? Number(item.flagcount) : "",
          aflag: item.updatedflag ? Number(item.updatedflag) : "",
          points: finalunitrate * finalflag * 8.333333333333333,
          // points: upload.mode == "Manual" ? finalunitrate * 8.333333333333333 : finalunitrate * finalflag * 8.333333333333333,
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
    // {
    //   field: "company",
    //   headerName: "Company",
    //   flex: 0,
    //   width: 90,
    //   hide: !columnVisibilityCategoryView.company,
    // },
    // {
    //   field: "branch",
    //   headerName: "Branch",
    //   flex: 0,
    //   width: 140,
    //   hide: !columnVisibilityCategoryView.branch,
    // },
    // {
    //   field: "unit",
    //   headerName: "Unit",
    //   flex: 0,
    //   width: 80,
    //   hide: !columnVisibilityCategoryView.Unit,
    // },
    // {
    //   field: "team",
    //   headerName: "Team",
    //   flex: 0,
    //   width: 80,
    //   hide: !columnVisibilityCategoryView.team,
    // },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 220,
      hide: !columnVisibilityCategoryView.empname,
    },
    // {
    //   field: "experience",
    //   headerName: "Exp",
    //   flex: 0,
    //   width: 90,
    //   hide: !columnVisibilityCategoryView.experience,
    // },
    // {
    //   field: "empcode",
    //   headerName: "Emp Code",
    //   flex: 0,
    //   width: 150,
    //   hide: !columnVisibilityCategoryView.empcode,
    // },
    // {
    //   field: "department",
    //   headerName: "Department",
    //   flex: 0,
    //   width: 150,
    //   hide: !columnVisibilityCategoryView.department,
    // },
    {
      field: "dateval",
      headerName: "Date",
      flex: 0,
      width: 190,
      hide: !columnVisibilityCategoryView.date,
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
      field: "uunitrate",
      headerName: "U-Unitrate",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.filename,
    },
    {
      field: "aunitrate",
      headerName: "A-Unitrate",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.filename,
    },
    {
      field: "uflag",
      headerName: "U-Flag",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.filename,
    },
    {
      field: "aflag",
      headerName: "A-Flag",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.filename,
    },
    {
      field: "points",
      headerName: "Points",
      flex: 0,
      width: 100,
      hide: !columnVisibilityCategoryView.points,
    },
    // {
    //   field: "processcode",
    //   headerName: "Process Code",
    //   flex: 0,
    //   width: 120,
    //   hide: !columnVisibilityCategoryView.processcode,
    // },

    // {
    //   field: "target",
    //   headerName: "Target",
    //   flex: 0,
    //   width: 90,
    //   hide: !columnVisibilityCategoryView.target,
    // },
    // {
    //   field: "points",
    //   headerName: "Points",
    //   flex: 0,
    //   width: 90,
    //   hide: !columnVisibilityCategoryView.points,
    // },
    // {
    //   field: "avgpoint",
    //   headerName: "Avg Point",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibilityCategoryView.avgpoint,
    // },
    // {
    //   field: "aprocess",
    //   headerName: "P Process",
    //   flex: 0,
    //   width: 120,
    //   hide: !columnVisibilityCategoryView.aprocess,
    // },
    // {
    //   field: "sprocess",
    //   headerName: "S Process",
    //   flex: 0,
    //   width: 120,
    //   hide: !columnVisibilityCategoryView.sprocess,
    // },
    // {
    //   field: "contarget",
    //   headerName: "Con Tar",
    //   flex: 0,
    //   width: 90,
    //   hide: !columnVisibilityCategoryView.contarget,
    // },
    // {
    //   field: "conpoints",
    //   headerName: "Con Points",
    //   flex: 0,
    //   width: 110,
    //   hide: !columnVisibilityCategoryView.conpoints,
    // },
    // {
    //   field: "conavg",
    //   headerName: "Con Avg",
    //   flex: 0,
    //   width: 110,
    //   hide: !columnVisibilityCategoryView.conavg,
    // },

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
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityCategoryView[column.field]} onChange={() => togglecolumnVisibilityCategoryView(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              />
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


  return (
    <Box>
      <Headtitle title={"Production Day"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Production Day"
        modulename="Production"
        submodulename="Upload"
        mainpagename="Original"
        subpagename="Production Day"
        subsubpagename=""
      />
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
                  <OutlinedInput id="component-outlined" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} inputProps={{ max: new Date().toISOString().split("T")[0] }} />
                </FormControl>
              </Grid>

              <Grid item md={2} xs={12} sm={6} marginTop={3}>
                {/* <Button variant="contained" onClick={() => handleFilterSave()}>
                  Create
                </Button> */}
                <LoadingButton
                  onClick={(e) => {
                    handleFilterSave();
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
                    // <>
                    //   <ExportXL
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
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
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
                      <Button onClick={(e) => {
                        setIsFilterOpen(true);
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

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
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)

                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
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
                    <Button onClick={(e) => {
                      setIsFilterOpenView(true);
                      setFormat("xl");
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
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
                    <Button onClick={(e) => {
                      setIsFilterOpenView(true);
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

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
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpenView(true)

                      }}
                    ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
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

                  // <>
                  //   <ExportXL
                  //     csvData={rowDataTableCategoryView
                  //       ?.map((item, index) => ({
                  //         Sno: index + 1,
                  //         Mode: item.mode,
                  //         Name: item.empname,

                  //         Date: item.dateval,
                  //         ProjectVendor: item.vendor,

                  //         User: item.user,
                  //         IdentifyNumber: item.unitid,
                  //         Category: item.filename,
                  //         SubCategory: item.category,
                  //         "U-Unitrate": item.unitrate,
                  //         "A-Unitrate": item.updatedunitrate,
                  //         "U-Flag": item.flagcount,
                  //         "A-Flag": item.updatedflag,

                  //       }))
                  //       ?.sort((a, b) => {

                  //         if ((a.User).toLowerCase() < (b.User).toLowerCase()) return -1;
                  //         if ((a.User).toLowerCase() > (b.User).toLowerCase()) return 1;

                  //         if ((a.Category).toLowerCase() < (b.Category).toLowerCase()) return -1;
                  //         if ((a.Category).toLowerCase() > (b.Category).toLowerCase()) return 1;

                  //         return 0;
                  //       })
                  //     }

                  //     fileName={"Production Category Points View"}
                  //   />
                  // </>
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpenCategoryView(true)

                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>

                )}
                {isUserRoleCompare?.includes("csvproductionday") && (
                  // <>
                  //   <ExportCSV
                  //     csvData={rowDataTableCategoryView
                  //       ?.map((item, index) => ({
                  //         Sno: index + 1,
                  //         Mode: item.mode,
                  //         Name: item.empname,

                  //         Date: item.dateval,
                  //         ProjectVendor: item.vendor,

                  //         User: item.user,
                  //         IdentifyNumber: item.unitid,
                  //         Category: item.filename,
                  //         SubCategory: item.category,
                  //         "U-Unitrate": item.unitrate,
                  //         "A-Unitrate": item.updatedunitrate,
                  //         "U-Flag": item.flagcount,
                  //         "A-Flag": item.updatedflag,

                  //       }))
                  //       ?.sort((a, b) => {

                  //         if ((a.User).toLowerCase() < (b.User).toLowerCase()) return -1;
                  //         if ((a.User).toLowerCase() > (b.User).toLowerCase()) return 1;

                  //         if ((a.Category).toLowerCase() < (b.Category).toLowerCase()) return -1;
                  //         if ((a.Category).toLowerCase() > (b.Category).toLowerCase()) return 1;

                  //         return 0;
                  //       })
                  //     }

                  //     fileName={"Production Category Points View"}
                  //   />
                  // </>
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpenCategoryView(true);
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

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
                  // <>
                  //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdfCategoryView()}>
                  //     <FaFilePdf />
                  //     &ensp;Export to PDF&ensp;
                  //   </Button>
                  // </>
                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpenCategoryView(true)

                      }}
                    ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
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
                <StyledDataGrid
                  onClipboardCopy={(copiedString) => setCopiedData(copiedString)}

                  rows={rowDataTableCategoryView}
                  columns={columnDataTableCategoryView.filter((column) => columnVisibilityCategoryView[column.field])}
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
      <Dialog
        open={isPdfFilterOpenView}
        onClose={handleClosePdfFilterModView}
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
      <Dialog
        open={isPdfFilterOpenCategoryView}
        onClose={handleClosePdfFilterModCategoryView}
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

export default ProductionDay;