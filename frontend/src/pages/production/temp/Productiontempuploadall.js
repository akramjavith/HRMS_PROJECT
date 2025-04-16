import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import Selects from "react-select";
import { Link } from "react-router-dom";
import { userStyle, colourStyles } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { StyledTableRow, StyledTableCell } from "../../../components/Table.js";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import { MultiSelect } from "react-multi-select-component";
import ImageIcon from "@mui/icons-material/Image";
import { Flex, Progress } from "antd";
import { BASE_URL } from "../../../services/Authservice.js";
import AlertDialog from "../../../components/Alert.js";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import {
//   DeleteConfirmation,
//   PleaseSelectRow,
// } from "../../components/DeleteConfirmation.js";

import ExportData from "../../../components/ExportData.js";
import ExportDataView from "../../../components/ExportData.js";
import ExportDataViewAll from "../../../components/ExportData.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";

// Inspired by the former Facebook spinners.
function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

function ProductionTempUpload() {
  const datetimeZoneOptions = [
    { value: "India Standard Time", label: "India Standard Time" },
    { value: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi", label: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi" },
    { value: "(GMT -12:00) Eniwetok, Kwajalein", label: "(GMT -12:00) Eniwetok, Kwajalein" },
    { value: "(GMT -11:00) Midway Island, Samoa", label: "(GMT -11:00) Midway Island, Samoa" },
    { value: "(GMT -10:00) Hawaii", label: "(GMT -10:00) Hawaii" },
    { value: "(GMT -9:30) Taiohae", label: "(GMT -9:30) Taiohae" },
    { value: "(GMT -9:00) Alaska", label: "(GMT -9:00) Alaska" },
    { value: "(GMT -8:00) Pacific Time (US & Canada)", label: "(GMT -8:00) Pacific Time (US & Canada)" },
    { value: "(GMT -7:00) Mountain Time (US & Canada)", label: "(GMT -7:00) Mountain Time (US & Canada)" },
    { value: "(GMT -6:00) Central Time (US & Canada), Mexico City", label: "(GMT -6:00) Central Time (US & Canada), Mexico City" },
    { value: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima", label: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima" },
    { value: "(GMT -4:30) Caracas", label: "(GMT -4:30) Caracas" },
    { value: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz", label: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz" },
    { value: "(GMT -3:30) Newfoundland", label: "(GMT -3:30) Newfoundland" },
    { value: "(GMT -3:00) Brazil, Buenos Aires, Georgetown", label: "(GMT -3:00) Brazil, Buenos Aires, Georgetown" },
    { value: "(GMT -2:00) Mid-Atlantic", label: "(GMT -2:00) Mid-Atlantic" },
    { value: "(GMT -1:00) Azores, Cape Verde Islands", label: "(GMT -1:00) Azores, Cape Verde Islands" },
    { value: "(GMT) Western Europe Time, London, Lisbon, Casablanca", label: "(GMT) Western Europe Time, London, Lisbon, Casablanca" },
    { value: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris", label: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris" },
    { value: "(GMT +2:00) Kaliningrad, South Africa", label: "(GMT +2:00) Kaliningrad, South Africa" },
    { value: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg", label: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg" },
    { value: "(GMT +3:30) Tehran", label: "(GMT +3:30) Tehran" },
    { value: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi", label: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi" },
    { value: "(GMT +4:30) Kabul", label: "(GMT +4:30) Kabul" },
    { value: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent", label: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent" },
    { value: "(GMT +5:45) Kathmandu, Pokhara", label: "(GMT +5:45) Kathmandu, Pokhara" },
    { value: "(GMT +6:00) Almaty, Dhaka, Colombo", label: "(GMT +6:00) Almaty, Dhaka, Colombo" },
    { value: "(GMT +6:30) Yangon, Mandalay", label: "(GMT +6:30) Yangon, Mandalay" },
    { value: "(GMT +7:00) Bangkok, Hanoi, Jakarta", label: "(GMT +7:00) Bangkok, Hanoi, Jakarta" },
    { value: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong", label: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong" },
    { value: "(GMT +8:45) Eucla", label: "(GMT +8:45) Eucla" },
    { value: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk", label: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
    { value: "(GMT +9:30) Adelaide, Darwin", label: "(GMT +9:30) Adelaide, Darwin" },
    { value: "(GMT +10:00) Eastern Australia, Guam, Vladivostok", label: "(GMT +10:00) Eastern Australia, Guam, Vladivostok" },
    { value: "(GMT +10:30) Lord Howe Island", label: "(GMT +10:30) Lord Howe Island" },
    { value: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia", label: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia" },
    { value: "(GMT +11:30) Norfolk Island", label: "(GMT +11:30) Norfolk Island" },
    { value: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka", label: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka" },
    { value: "(GMT +12:45) Chatham Islands", label: "(GMT +12:45) Chatham Islands" },
    { value: "(GMT +13:00) Apia, Nukualofa", label: "(GMT +13:00) Apia, Nukualofa" },
    { value: "(GMT +14:00) Line Islands, Tokelau", label: "(GMT +14:00) Line Islands, Tokelau" },
  ];

  const istTimeZoneall = datetimeZoneOptions.find((option) => option.label.includes("India Standard Time"));
  const istTimeZone = istTimeZoneall.label;

  const [productiontemp, setProductiontemp] = useState({ nameround: "", datetimezone: istTimeZone, vendor: "Please Select Vendor", fromdate: "", tododate: "", sheetnumber: 2 });

  const [productiontempEdit, setProductiontempEdit] = useState({ nameround: "", datetimezone: "", vendor: "", fromdate: "", tododate: "", sheetnumber: "" });
  const [productiontempView, setProductiontempView] = useState([]);
  const [productiontempviewAll, setProductiontempViewAll] = useState([]);

  const [productionsTemp, setProductionsTemp] = useState([]);

  // const [allProductionedit, setAllProductionedit] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [yeardrop, setYeardrop] = useState("yyyy");
  const [monthdrop, setMonthdrop] = useState("MM");
  const [datedrop, setDatedrop] = useState("dd");
  const [symboldrop, setSymboldrop] = useState("-");
  const [yeardropEdit, setYeardropEdit] = useState("");
  const [monthdropEdit, setMonthdropEdit] = useState("");
  const [datedropEdit, setDatedropEdit] = useState("");
  const [symboldropEdit, setSymboldropEdit] = useState("/");
  const [readingmodeEdit, setReadingmodeEdit] = useState("Choose Project Vendor");

  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [productionCheck, setProductioncheck] = useState(false);
  const [productionViewCheck, setProductionViewcheck] = useState(false);
  const [productionfirstViewCheck, setProductionfirstViewcheck] = useState(false);
  const [productionsecondViewCheck, setProductionecondViewcheck] = useState(false);


  const [selectedVendor, setSelectedVendor] = useState([]);
  const [selectedFromdate, setSelectedFromdate] = useState("");
  const [selectedTodate, setSelectedTodate] = useState("");
  const [projVendors, setProjVendors] = useState([]);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);
  const gridRefview = useRef(null);
  const gridRefviewall = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [copiedData, setCopiedData] = useState("");

  const [openviewalert, setOpenviewalert] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageview, setPageview] = useState(1);
  const [pageviewAll, setPageviewAll] = useState(1);

  const [pageSize, setPageSize] = useState(10);
  const [pageSizeview, setPageSizeview] = useState(10);
  const [pageSizeviewAll, setPageSizeviewAll] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryview, setSearchQueryview] = useState("");
  const [searchQueryviewAll, setSearchQueryviewAll] = useState("");

  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQueryManageview, setSearchQueryManageview] = useState("");
  const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState("");

  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };

  const handleCloseviewalert = () => {
    setOpenviewalert(false);
  };


  const [fileFormat, setFormat] = useState('')
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
    setIsFilterOpenView(false);
  };


  const [isFilterOpenViewAll, setIsFilterOpenViewAll] = useState(false);
  const [isPdfFilterOpenViewAll, setIsPdfFilterOpenViewAll] = useState(false);

  // page refersh reload
  const handleCloseFilterModViewAll = () => {
    setIsFilterOpenViewAll(false);
  };

  const handleClosePdfFilterModViewAll = () => {
    setIsFilterOpenViewAll(false);
  };

  let exportColumnNames = [
    'Vendor',
    'Date Time Zone',
    'From Date',
    'To Date',
    'User Name',
    'Created Date'
  ]
  let exportRowValues = [

    'vendor',
    'datetimezone',
    'fromdatelist',
    'todatelist',
    'username',
    'createddate'
  ]

  let exportColumnNamesView = [
    'Date', 'Filename', 'Total Data'
  ]

  let exportRowValuesView = [

    'createddate', 'filenamelist', 'totaldata'
  ]


  let exportColumnNamesViewAll = [
    'Category',
    'Indentity Name',
    'Login id',
    'Process Date',
    'Unit Rate',
    'Flag Count',
    'Section',
    'Clientid'
  ]
  let exportRowValuesViewAll = [
    'category',
    'unitid',
    'user',
    'dateval',
    'unitrate',
    'flagcount',
    'section',
    'alllogin'
  ]



  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Temp Upload.png");
        });
      });
    }
  };

  //image view
  const handleCaptureImageview = () => {
    if (gridRefview.current) {
      html2canvas(gridRefview.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Upload Temp Production Total Files .png");
        });
      });
    }
  };

  //image view all
  const handleCaptureImageviewall = () => {
    if (gridRefviewall.current) {
      html2canvas(gridRefviewall.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Upload Temp Production Total Files .png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
    setProductiontempView([]);
    setSearchQueryview("");
    setPageview(1);
    setColumnVisibilityview(initialColumnVisibilityview);
  };

  // viewAll model
  const [openviewAll, setOpenviewAll] = useState(false);

  const handleClickOpenviewAll = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenviewAll(true);
  };

  const handleCloseviewAll = () => {
    setOpenviewAll(false);
    setProductiontempViewAll([]);
    setSearchQueryviewAll("");
    setPageviewAll(1);
    setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
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
  const [isDeleteOpenview, setisDeleteOpenview] = useState(false);

  const handleClickOpendelview = () => {
    setisDeleteOpenview(true);
  };
  const handleCloseModdelview = () => {
    setisDeleteOpenview(false);
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
  const [isDeleteOpenviewsuccess, setIsDeleteOpenviewsuccess] = useState(false);
  const [showAlertcomplete, setShowAlertcomplete] = useState();

  const handleClickOpenviewSuccess = () => {
    setIsDeleteOpenviewsuccess(true);
  };
  const handleCloseModviewSuccess = () => {
    setIsDeleteOpenviewsuccess(false);
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

  // Manage Columns
  const [isManageColumnsOpenview, setManageColumnsOpenview] = useState(false);
  const [anchorElview, setAnchorElview] = useState(null);

  const handleOpenManageColumnsview = (event) => {
    setAnchorElview(event.currentTarget);
    setManageColumnsOpenview(true);
  };
  const handleCloseManageColumnsview = () => {
    setManageColumnsOpenview(false);
    setSearchQueryManageview("");
  };

  const openviewpop = Boolean(anchorElview);
  const idview = openviewpop ? "simple-popover" : undefined;

  // Manage Columnsviewall
  const [isManageColumnsOpenviewAll, setManageColumnsOpenviewAll] = useState(false);
  const [anchorElviewAll, setAnchorElviewAll] = useState(null);

  const handleOpenManageColumnsviewAll = (event) => {
    setAnchorElviewAll(event.currentTarget);
    setManageColumnsOpenviewAll(true);
  };
  const handleCloseManageColumnsviewAll = () => {
    setManageColumnsOpenviewAll(false);
    setSearchQueryManageviewAll("");
  };

  const openviewpopall = Boolean(anchorElviewAll);
  const idviewall = openviewpopall ? "simple-popover" : undefined;

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

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
    vendor: true,
    fromdate: true,
    todate: true,
    fromdatelist: true,
    todatelist: true,
    datetimezone: true,
    exceldatefomrat: true,
    sheetnumber: true,
    filename: true,
    addedby: true,
    username: true,
    createddate: true,
    actions: true,
    checksts: true,
    percent: true,
    overallcount: true,
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibilityview = {
    serialNumber: true,
    checkbox: true,
    vendor: true,
    fromdate: true,
    todate: true,
    fromdatelist: true,
    todatelist: true,
    datetimezone: true,
    exceldatefomrat: true,
    sheetnumber: true,
    filename: true,
    filenamelist: true,
    totaldata: true,
    createddate: true,
    actions: true,
  };
  // Show All Columns & Manage Columns
  const initialColumnVisibilityviewAll = {
    serialNumber: true,
    datetimezone: true,
    exceldatefomrat: true,
    filenamelist: true,
    datevallist: true,
    actions: true,
    unitid: true,
    user: true,
    unitrate: true,
    dateval: true,
    category: true,
    flagcount: true,
    section: true,
    alllogin: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [columnVisibilityview, setColumnVisibilityview] = useState(initialColumnVisibilityview);
  const [columnVisibilityviewAll, setColumnVisibilityviewAll] = useState(initialColumnVisibilityview);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteRound, setDeleteRound] = useState("");
  const [deleteallDatas, setDeleteallDatas] = useState([]);
  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const rowData = async (id, vendor, from, to, uniqid, filename) => {
    setShowAlert("Loading...");
    setloadingdeloverall(true);
    handleClickOpen();

    try {
      let res = await axios.get(`${SERVICE.PRODUCTION_TEMP_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteRound(res?.data?.sproductiontemp);
      let resNew = await axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_GETDELETEDATASALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // filename:String(filename),
        id: Number(uniqid),
      });
      setDeleteallDatas(resNew?.data?.productiontempuploadall);
      setShowAlert("Are You Sure?..");
      setloadingdeloverall(false);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let Productionsid = deleteRound?._id;
  const delProduction = async (e) => {
    setloadingdeloverall(true);
    try {
      if (Productionsid) {
        setShowAlert("deleting...");
        setloadingdeloverall(true);

        if (deleteallDatas.length > 0) {
          // Function to split an array into chunks
          let deleteDatas = deleteallDatas.map((item) => item._id);
          function chunkArray(array, chunkSize) {
            const chunks = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              chunks.push(array.slice(i, i + chunkSize));
            }
            return chunks;
          }

          // Split deleteDatas into chunks of 25000
          const chunkSize = 25000;
          const deleteDataChunks = chunkArray(deleteDatas, chunkSize);

          // Iterate through each chunk and send a separate request
          const deletePromises = [];
          for (const chunk of deleteDataChunks) {
            const deletePromise = axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_DELETEMULTI, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
                "Content-Type": "application/json;charset=UTF-8",
              },
              ids: chunk,
            });
            deletePromises.push(deletePromise);
          }

          Promise.all(deletePromises)
            .then(async () => {
              await axios.delete(`${SERVICE.PRODUCTION_TEMP_SINGLE}/${e}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                  "Content-Type": "application/json;charset=UTF-8",
                },
              });
              setloadingdeloverall(false);
              await fetchProductiontemp();
              handleCloseMod();
              setSelectedRows([]);
              setPage(1);
            })
            .catch((error) => {
              // Handle errors if any of the promises fail
              console.error("Error during file processing:", error);
            });
        } else {
          await axios.delete(`${SERVICE.PRODUCTION_TEMP_SINGLE}/${e}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
              "Content-Type": "application/json;charset=UTF-8",
            },
          });
          setloadingdeloverall(false);
          await fetchProductiontemp();
          handleCloseMod();
          setSelectedRows([]);
          setPage(1);
        }
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); } finally {
      setShowAlertcomplete(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
        </>
      );
      handleClickOpenviewSuccess();
    }
  };

  const delProductioncheckbox = async () => {
    try {

      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PRODUCTION_TEMP_SINGLE}/${item}`, {
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

      await fetchProductiontemp();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function
  const sendRequest = async () => {
    try {
      let subprojectscreate = await axios.post(SERVICE.PRODUCTION_TEMP_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendor: String(productiontemp.vendor),
        fromdate: String(productiontemp.fromdate),
        todate: String(productiontemp.todate),
        datetimezone: String(productiontemp.datetimezone),
        sheetnumber: String(productiontemp.sheetnumber),
        yeardrop: String(yeardrop),
        monthdrop: String(monthdrop),
        datedrop: String(datedrop),
        symboldrop: String(symboldrop),
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      await fetchProductiontemp();
      setProductiontemp({ ...productiontemp, nameround: "" });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    // const isNameMatch = productionsTemp.some(item => item.nameround.toLowerCase() === (productiontemp.nameround).toLowerCase());
    if (productiontemp.vendor === "Please Select Vendor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Vendor"}</p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (isNameMatch) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon
    //                 sx={{ fontSize: "100px", color: "orange" }}
    //             />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //                 {"Name already exits!"}
    //             </p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setProductiontemp({ nameround: "" });
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

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
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
      let res = await axios.get(`${SERVICE.PRODUCTION_TEMP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProductiontempEdit(res?.data?.sproductiontemp);
      setMonthdropEdit(res?.data?.sproductiontemp.monthdrop);
      setYeardropEdit(res?.data?.sproductiontemp.yeardrop);
      setDatedropEdit(res?.data?.sproductiontemp.datedrop);
      setSymboldropEdit(res?.data?.sproductiontemp.symboldrop);
      // await fetchProductiontempAll()
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [geteditid, setgetedit] = useState("");


  const handleDownloadReturn = async (downloadname, dupename) => {
    const encodedDownloadName = encodeURIComponent(downloadname);
    const fullURL = `${BASE_URL}/api/download/${encodedDownloadName}`;

    // const filename = 'bandicam 2023-12-20 19-01-29-542.mp4'; // Replace with the desired file name
    fetch(fullURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        // Handle the blob (e.g., create a download link)
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = dupename;
        downloadLink.click();
      })
      .catch(error => console.error('Error:', error));
  };


  // get single row to view....
  const getviewCode = async (e, vendor, from, to, id) => {
    try {
      handleClickOpenview();
      setProductionViewcheck(false);
      setgetedit(id);
      let res = await axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_FILENAMEONLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        id: String(id),
      });

      setProductiontempView(res?.data?.productiontempuploadall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); } finally {
      setProductionViewcheck(true);
      setPageview(1);
      setColumnVisibilityview(initialColumnVisibilityview);
    }
  };

  // get single row to view....
  const getviewCodeall = async (filename, id) => {
    try {
      handleClickOpenviewAll();
      setProductionfirstViewcheck(false);

      let res = await axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_FILENAMELIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        filename: String(filename),
        id: String(id),
      });
      // let matchedData = res?.data?.productiontempuploadall.filter((item) => item.filename === filename && item.uniqueid == id);
      setProductiontempViewAll(res?.data?.productiontempuploadall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); } finally {
      setProductionfirstViewcheck(true);
      setPageviewAll(1);
      setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PRODUCTION_TEMP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProductiontempEdit(res?.data?.sproductiontemp);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [deleteFileNameDatas, setDeleteFileNameDatas] = useState([]);

  const [productionviewdel, setProductionviewdel] = useState({ uniqid: "" });
  // const [delLoader, setDelLoader] = useState(false);
  // get single row to view....
  const rowDataviewall = async (filename, id, vendor, from, to) => {
    handleClickOpendelview();
    setloadingdel(true);
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <Typography sx={{ fontSize: '22px' }}>{"Loading..."}</Typography>
      </>
    );
    try {
      let res = await axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_GETDELETEDATAS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        filename: String(filename),
        id: String(id),
      });

      // let matchedData = res?.data?.productiontempuploadall.filter((item) => item.filename === filename && item.uniqueid == id);
      let matchedData = res?.data?.productiontempuploadall;
      setDeleteFileNameDatas(matchedData);
      setProductionviewdel({ ...productionviewdel, from: from, to: to, uniqid: id, vendor: vendor });
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography sx={{ fontSize: '22px' }}>{"Are you Sure "}</Typography>
        </>
      );
      setloadingdel(false);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [loadingdel, setloadingdel] = useState(false);
  //delete based on filename
  const delProductionview = async () => {
    setloadingdel(true);

    try {

      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography sx={{ fontSize: '22px' }}>{"deleting..."}</Typography>
        </>
      );
      setloadingdel(true);
      let deleteDatas = deleteFileNameDatas.map((item) => item._id);
      function chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
      }

      // Split deleteDatas into chunks of 25000
      const chunkSize = 25000;
      const deleteDataChunks = chunkArray(deleteDatas, chunkSize);

      // Iterate through each chunk and send a separate request
      const deletePromises = [];
      for (const chunk of deleteDataChunks) {
        const deletePromise = axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_DELETEMULTI, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
            "Content-Type": "application/json;charset=UTF-8",
          },
          ids: chunk,
        });
        deletePromises.push(deletePromise);
      }


      // let deleteDatas = deleteFileNameDatas.map((item) => item._id);
      // let resnew = await axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_DELETEMULTI, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },

      //   ids: deleteDatas,
      // });

      Promise.all(deletePromises)
        .then(async () => {
          let res = await axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_FILENAMEONLY, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            id: Number(geteditid),
          });

          setProductiontempView(res?.data?.productiontempuploadall);
          setloadingdel(false);
          handleCloseModdelview();
        })
        .catch((error) => {
          handleCloseModdelview();
          // Handle errors if any of the promises fail
          console.error("Error during file processing:", error);
        });




    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); } finally {
      let res = await axios.post(SERVICE.PRODUCTION_TEMP_UPLOAD_FILENAMEONLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        id: Number(geteditid),
      });

      setProductiontempView(res?.data?.productiontempuploadall);

      setPage(1);
      setloadingdel(false);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
        </>
      );
      handleClickOpendelview();
    }
  };

  //Project updateby edit page...
  let updateby = productiontempEdit?.updatedby;
  let addedby = productiontempEdit?.addedby;

  let subprojectsid = productiontempEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.PRODUCTION_TEMP_SINGLE}/${subprojectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendor: String(productiontempEdit.vendor),
        fromdate: String(productiontempEdit.fromdate),
        todate: String(productiontempEdit.todate),
        datetimezone: String(productiontempEdit.datetimezone),
        sheetnumber: String(productiontempEdit.sheetnumber),
        yeardrop: String(yeardropEdit),
        monthdrop: String(monthdropEdit),
        datedrop: String(datedropEdit),
        symboldrop: String(symboldropEdit),
        updatedby: [
          ...updateby,
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      await fetchProductiontemp();
      // await fetchProductiontempAll();
      handleCloseModEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    // fetchProductiontempAll();
    // const isNameMatch = allProductionedit.some(item => item.nameround.toLowerCase() === (productiontempEdit.nameround).toLowerCase());
    if (productiontempEdit.vendor === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Vendor"}</p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (isNameMatch) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon
    //                 sx={{ fontSize: "100px", color: "orange" }}
    //             />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //                 {"Name already exits!"}
    //             </p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchProductiontemp = async () => {
    setSelectedVendor([]);
    setSelectedFromdate("");
    setSelectedTodate("")
    setProductioncheck(true);
    try {
      let res_vendor = await axios.get(SERVICE.PRODUCTION_TEMP_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let sorted = res_vendor?.data?.productiontemp.sort((a, b) => {
        const dateA = new Date(a.fromdate);
        const dateB = new Date(b.fromdate);

        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;

      });
      setPage(1)
      setProductionsTemp(sorted);
      setProductioncheck(false);
    } catch (err) { setProductioncheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //get all Sub vendormasters.
  const fetchVendors = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setVendors(vendorall);
      let vendorallproj = res_vendor?.data?.vendormaster.map((d) => ({
        ...d,
        label: d.projectname + "-" + d.name,
        value: d.projectname + "-" + d.name,
      }));
      setProjVendors(vendorallproj);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = productionsTemp?.map((item, index) => ({ ...item, username: item.addedby[0].companyname, serialNumber: index + 1, fromdatelist: moment(item.fromdate)?.format("DD-MM-YYYY"), todatelist: moment(item.todate)?.format("DD-MM-YYYY"), exceldatefomrat: item.yeardrop + item.monthdrop + item.datedrop + item.symboldrop }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [productionsTemp]);

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

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

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

  //get all Sub vendormasters.
  const fetchProductionoriginalafterstatus = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.PRODUCTION_TEMP_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let sorted = res_vendor?.data?.productiontemp.sort((a, b) => {
        const dateA = new Date(a.fromdate);
        const dateB = new Date(b.fromdate);

        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;

      });

      setProductionsTemp(sorted);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // const [ percentUploaded, setPercentUploaded] = useState(0);
  const checkUpdatedFileSts = async (id, count, idval) => {
    try {
      let resNew = await axios.post(SERVICE.PRODUCTION_UPLOAD_CHECKSTATUS_TEMP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        id: Number(id),
      });
      let total = Math.ceil((resNew.data.productionupload / Number(count)) * 100);
      let resupdate = await axios.put(`${SERVICE.PRODUCTION_TEMP_SINGLE}/${idval}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        percent: total,
      });
      fetchProductionoriginalafterstatus();
    } catch (err) { setProductioncheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const checkRerun = async (row) => {
    let today = new Date(row.createddate);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate1 = dd + mm + yyyy;
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
      width: 70,
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
    { field: "vendor", headerName: "Vendor", flex: 0, width: 200, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
    { field: "datetimezone", headerName: "Date Time Zone", flex: 0, width: 200, hide: !columnVisibility.datetimezone, headerClassName: "bold-header" },

    { field: "fromdatelist", headerName: "From Date", flex: 0, width: 100, hide: !columnVisibility.fromdatelist, headerClassName: "bold-header" },
    { field: "todatelist", headerName: "To Date", flex: 0, width: 100, hide: !columnVisibility.todatelist, headerClassName: "bold-header" },
    // { field: "filename", headerName: "FileName", flex: 0, width: 200, hide: !columnVisibility.filename, headerClassName: "bold-header" },
    { field: "username", headerName: "User Name", flex: 0, width: 250, hide: !columnVisibility.username, headerClassName: "bold-header" },
    { field: "createddate", headerName: "createddate", flex: 0, width: 180, hide: !columnVisibility.CreatedDate, headerClassName: "bold-header" },

    {
      field: "checksts",
      headerName: "Check Status",
      flex: 0,
      width: 120,
      hide: !columnVisibility.checksts,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vproductiontempuploadlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                checkUpdatedFileSts(params.row.uniqueid, params.row.overallcount, params.row.id);
              }}
            >
              Check
            </Button>
          )}
        </Grid>
      ),
    },
    { field: "overallcount", headerName: "Count", flex: 0, width: 130, hide: !columnVisibility.overallcount, headerClassName: "bold-header" },
    {
      field: "percent",
      headerName: "Status",
      flex: 0,
      width: 180,
      hide: !columnVisibility.percent,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Flex
          vertical
          gap="small"
          style={{
            width: 170,
          }}
        >
          <Progress percent={params.row.percent} status={Number(params.row.percent) === 100 ? "active" : "active"} showInfo={true} />
        </Flex>
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
        <Grid sx={{ display: "flex" }}>
          {/* {isUserRoleCompare?.includes("eproductiontempuploadlist") && (
            <Button
              sx={userStyle.buttonedit}
              disabled
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )} */}
          {isUserRoleCompare?.includes("vproductiontempuploadlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id, params.row.vendor, params.row.fromdate, params.row.todate, params.row.uniqueid);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dproductiontempuploadlist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.vendor, params.row.fromdate, params.row.todate, params.row.uniqueid);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}

          {isUserRoleCompare?.includes("iproductiontempuploadlist") && (
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
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      vendor: item.vendor,
      fromdate: item.fromdate,
      todate: item.todate,
      fromdatelist: item.fromdatelist,
      todatelist: item.todatelist,
      datetimezone: item.datetimezone,
      exceldatefomrat: item.exceldatefomrat,
      sheetnumber: item.sheetnumber,
      filename: item.filename,
      uniqueid: item.uniqueid,
      createddate: item.createddate,
      overallcount: item.overallcount,
      percent: item.percent,
      username: item.username,
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

  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Vendor", field: "vendor" },
    { title: "Date Time Zone", field: "datetimezone" },
    { title: "From Date", field: "fromdate" },
    { title: "To Date", field: "todate" },
    { title: "User Name", field: "username" },
    { title: "Created Date", field: "createddate" },
  ];

  const downloadPdf = () => {
    var data = filteredData?.map((t, index) => ({
      serialNumber: index + 1,
      vendor: t.vendor,
      datetimezone: t.datetimezone,
      fromdate: moment(t.fromdate)?.format("DD-MM-YYYY"),
      todate: moment(t.todate)?.format("DD-MM-YYYY"),
      username: t.addedby[0].companyname,
      createddate: t.createddate,
    }));
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: data,
      styles: {
        fontSize: 5,
      },
    });
    doc.save("Production Temp Upload.pdf");
  };

  // pdf.....
  const columnsview = [
    { title: "Sno", field: "serialNumber" },
    { title: "Date", field: "date" },
    { title: "Filename", field: "filename" },
    { title: "Total Data", field: "totaldata" },
  ];

  const downloadPdfview = () => {
    var data = filteredDataview?.map((t, index) => {
      const filenamelistview = t.filename?.split(".x");
      const filenamelist = filenamelistview[0];
      const dateval = t.createddate;
      const dateOnly = dateval && dateval.split("T")[0];

      return {
        serialNumber: t.serialNumber,
        date: t.createddate, // Update the Date field
        filename: t.filenamelist,
        totaldata: t.totaldata,
      };
    });
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columnsview.map((col) => ({ ...col, dataKey: col.field })),
      body: data,
    });
    doc.save("Upload Temp Production Total Files.pdf");
  };

  // pdf.....
  const columnsviewall = [
    { title: "Sno", field: "serialNumber" },
    { title: "Category", field: "category" },
    { title: "Indentity Name", field: "unitid" },
    { title: "Login id", field: "user" },
    { title: "Process Date", field: "processcode" },
    { title: "Unit Rate", field: "unitrate" },
    { title: "Flag Count", field: "flagcount" },
    { title: "Section", field: "section" },
    { title: "Clientid", field: "alllogin" },
  ];

  const downloadPdfviewall = () => {
    var data = filteredDataviewAll?.map((t, index) => ({
      serialNumber: index + 1,
      category: t.category,
      unitid: t.unitid,
      user: t.user,
      processcode: t.dateval,
      unitrate: t.unitrate,
      flagcount: t.flagcount,
      section: t.section,
      alllogin: t.alllogin,
    }));
    const doc = new jsPDF({ orientation: "lanscape" });
    doc.autoTable({
      theme: "grid",
      columns: columnsviewall.map((col) => ({ ...col, dataKey: col.field })),
      body: data,
      styles: {
        fontSize: 8,
      },
    });
    doc.save("Uploaded Temp Production List.pdf");
  };

  // Excel
  const fileName = "Production Temp Upload";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production Temp Upload",
    pageStyle: "print",
  });

  //print.view..
  const componentRefview = useRef();
  const handleprintview = useReactToPrint({
    content: () => componentRefview.current,
    documentTitle: "Upload Temp Production Total Files",
    pageStyle: "print",
  });

  //print.view.all.
  const componentRefviewall = useRef();
  const handleprintviewall = useReactToPrint({
    content: () => componentRefviewall.current,
    documentTitle: "Uploaded Temp Production List",
    pageStyle: "print",
  });

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  useEffect(() => {
    fetchProductiontemp();
    fetchVendors();
  }, []);

  // useEffect(() => {
  //   fetchProductiontempAll();
  // }, [isEditOpen, productiontempEdit]);

  // view table codes
  const [itemsview, setItemsview] = useState([]);

  const addSerialNumberview = () => {
    const itemsWithSerialNumber = productiontempView?.map((item, index) => {
      const filenamelistview = item.filename?.split(".x");
      const filenamelist = filenamelistview[0];
      // const dateObject = new Date(item.dateval);
      // const datavallist = dateObject?.toISOString()?.split('T')[0];
      const dateval = item.createddate;
      const dateOnly = dateval && dateval?.split("T")[0];
      return {
        ...item,
        serialNumber: index + 1,
        filenamelist: filenamelist,
        createddate: moment(dateOnly)?.format("DD-MM-YYYY"),
      };
    });
    setItemsview(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberview();
  }, [productiontempView]);

  //Datatable
  const handlePageChangeview = (newPage) => {
    setPageview(newPage);
  };

  const handlePageSizeChangeview = (event) => {
    setPageSizeview(Number(event.target.value));
    setPageview(1);
  };

  //datatable....
  const handleSearchChangeview = (event) => {
    setSearchQueryview(event.target.value);
    setPageview(1);
  };
  // Split the search query into individual terms
  const searchTermsview = searchQueryview.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataviews = itemsview?.filter((item) => {
    return searchTermsview.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataview = filteredDataviews.slice((pageview - 1) * pageSizeview, pageview * pageSizeview);

  const totalPagesview = Math.ceil(filteredDataviews.length / pageSizeview);

  const visiblePagesview = Math.min(totalPagesview, 3);

  const firstVisiblePageview = Math.max(1, pageview - 1);
  const lastVisiblePageview = Math.min(firstVisiblePageview + visiblePagesview - 1, totalPagesview);

  const pageNumbersview = [];

  const indexOfLastItemview = pageview * pageSizeview;
  const indexOfFirstItemview = indexOfLastItemview - pageSizeview;

  for (let i = firstVisiblePageview; i <= lastVisiblePageview; i++) {
    pageNumbersview.push(i);
  }

  const columnDataTableview = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityview.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "createddate", headerName: "Date", flex: 0, width: 150, hide: !columnVisibilityview.createddate, headerClassName: "bold-header" },
    { field: "filenamelist", headerName: "File Name", flex: 0, width: 350, hide: !columnVisibilityview.filenamelist, headerClassName: "bold-header" },
    { field: "totaldata", headerName: "Total Data", flex: 0, width: 110, hide: !columnVisibilityview.totaldata, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "10px" }}>
          {isUserRoleCompare?.includes("vproductiontempuploadlist") && (
            <Button
              sx={{ minWidth: "40px" }}
              onClick={() => {
                getviewCodeall(params.row.filename, params.row.uniqueid);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dproductiontempuploadlist") && (
            <Button
              // disabled
              sx={{ minWidth: "40px" }}
              onClick={(e) => {
                rowDataviewall(params.row.filename, params.row.uniqueid, params.row.vendor, params.row.fromdate, params.row.todate);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dproductiontempuploadlist") && (
            <Button
              // disabled
              sx={{ minWidth: "40px" }}
              onClick={(e) => {
                handleDownloadReturn(params.row.filenamenew, params.row.filename);
              }}
            >
              <DownloadOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTableview = filteredDataview.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      vendor: item.vendor,
      fromdate: item.fromdate,
      todate: item.todate,
      fromdatelist: item.fromdatelist,
      todatelist: item.todatelist,
      datetimezone: item.datetimezone,
      exceldatefomrat: item.exceldatefomrat,
      sheetnumber: item.sheetnumber,
      filename: item.filename,
      filenamenew: item.filenamenew,
      filenamelist: item.filenamelist,
      totaldata: item.totaldata,
      uniqueid: item.uniqueid,
      createddate: item.createddate,
    };
  });

  // const rowsWithCheckboxes = rowDataTableview.map((row) => ({
  //   ...row,
  //   // Create a custom field for rendering the checkbox
  //   checkbox: selectedRows.includes(row.id),
  // }));

  // Show All Columns functionality
  const handleShowAllColumnsview = () => {
    const updatedVisibility = { ...columnVisibilityview };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityview(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityview");
    if (savedVisibility) {
      setColumnVisibilityview(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityview", JSON.stringify(columnVisibilityview));
  }, [columnVisibilityview]);

  // // Function to filter columns based on search query
  const filteredColumnsview = columnDataTableview.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityview = (field) => {
    setColumnVisibilityview((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentview = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsview}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageview} onChange={(e) => setSearchQueryManageview(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsview.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityview[column.field]} onChange={() => toggleColumnVisibilityview(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityview(initialColumnVisibilityview)}>
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
                columnDataTableview.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityview(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  // view all codes

  const [itemsviewAll, setItemsviewAll] = useState([]);

  const addSerialNumberviewAll = () => {
    const itemsWithSerialNumber = productiontempviewAll?.map((item, index) => ({ ...item, serialNumber: index + 1, fromdatelist: moment(item.fromdate)?.format("DD-MM-YYYY"), todatelist: moment(item.todate)?.format("DD-MM-YYYY"), exceldatefomrat: item.yeardrop + item.monthdrop + item.datedrop + item.symboldrop }));
    setItemsviewAll(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberviewAll();
  }, [productiontempviewAll]);

  //Datatable
  const handlePageChangeviewAll = (newPage) => {
    setPageviewAll(newPage);
  };

  const handlePageSizeChangeviewAll = (event) => {
    setPageSizeviewAll(Number(event.target.value));
    setPageviewAll(1);
  };

  //datatable....
  const handleSearchChangeviewAll = (event) => {
    setSearchQueryviewAll(event.target.value);
    setPageviewAll(1);
  };
  // Split the search query into individual terms
  const searchTermsviewAll = searchQueryviewAll.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataviewAlls = itemsviewAll?.filter((item) => {
    return searchTermsviewAll.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataviewAll = filteredDataviewAlls.slice((pageviewAll - 1) * pageSizeviewAll, pageviewAll * pageSizeviewAll);

  const totalPagesviewAll = Math.ceil(filteredDataviewAlls.length / pageSizeviewAll);

  const visiblePagesviewAll = Math.min(totalPagesviewAll, 3);

  const firstVisiblePageviewAll = Math.max(1, pageviewAll - 1);
  const lastVisiblePageviewAll = Math.min(firstVisiblePageviewAll + visiblePagesviewAll - 1, totalPagesviewAll);

  const pageNumbersviewall = [];

  const indexOfLastItemviewAll = pageviewAll * pageSizeviewAll;
  const indexOfFirstItemviewAll = indexOfLastItemviewAll - pageSizeviewAll;

  for (let i = firstVisiblePageviewAll; i <= lastVisiblePageviewAll; i++) {
    pageNumbersviewall.push(i);
  }

  const columnDataTableviewAll = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibilityviewAll.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "category", headerName: "Category", flex: 0, width: 270, hide: !columnVisibilityviewAll.category, headerClassName: "bold-header" },
    { field: "unitid", headerName: "Identity Name", flex: 0, width: 180, hide: !columnVisibilityviewAll.unitid, headerClassName: "bold-header" },
    { field: "user", headerName: "Login id", flex: 0, width: 100, hide: !columnVisibilityviewAll.user, headerClassName: "bold-header" },
    { field: "dateval", headerName: "Process Date", flex: 0, width: 190, hide: !columnVisibilityviewAll.dateval, headerClassName: "bold-header" },
    { field: "unitrate", headerName: "Unit Rate", flex: 0, width: 100, hide: !columnVisibilityviewAll.unitrate, headerClassName: "bold-header" },
    { field: "flagcount", headerName: "Flag Count", flex: 0, width: 100, hide: !columnVisibilityviewAll.flagcount, headerClassName: "bold-header" },
    { field: "section", headerName: "Section", flex: 0, width: 100, hide: !columnVisibilityviewAll.section, headerClassName: "bold-header" },
    { field: "alllogin", headerName: "Clientid", flex: 0, width: 100, hide: !columnVisibilityviewAll.alllogin, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 80,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "20px" }}>
          {isUserRoleCompare?.includes("eproductiontempuploadlist") && (
            <Link to={`/production/productiontempuploadedit/${params.row.id}`}>
              <Button
                sx={{ minWidth: "40px" }}
              // disabled
              // onClick={() => {
              //   getviewCodealledit(params.row.id);
              // }}
              >
                <EditOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            </Link>
          )}

          {/* {isUserRoleCompare?.includes("dproductiontempuploadlist") && (
            <Button
            disabled
              sx={{minWidth:'40px'}}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )} */}
        </Grid>
      ),
    },
  ];

  const rowDataTableviewAll = filteredDataviewAll.map((item, index) => {
    const filenamelistviewAll = item.filename?.split(".x");
    const filenamelist = filenamelistviewAll[0];
    const dateObject = new Date(item.dateval);
    // const datavallist = dateObject?.toISOString()?.split('T')[0];
    //     const ISTDateString = dateObject.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      vendor: item.vendor,
      fromdate: item.fromdate,
      todate: item.todate,
      fromdatelist: item.fromdatelist,
      todatelist: item.todatelist,
      datetimezone: item.datetimezone,
      exceldatefomrat: item.exceldatefomrat,
      sheetnumber: item.sheetnumber,
      filename: item.filename,
      unitid: item.unitid,
      user: item.user,
      unitrate: item.unitrate,
      dateval: item.dateval,
      filenamelist: filenamelist,
      totaldata: item.totaldata,
      category: item.category,
      uniqueid: item.uniqueid,
      flagcount: item.flagcount,
      section: item.section,
      alllogin: item.alllogin,
      // datavallist:datavallist,
    };
  });

  // const rowsWithCheckboxes = rowDataTableviewAll.map((row) => ({
  //   ...row,
  //   // Create a custom field for rendering the checkbox
  //   checkbox: selectedRows.includes(row.id),
  // }));

  // Show All Columns functionality
  const handleShowAllColumnsviewAll = () => {
    const updatedVisibility = { ...columnVisibilityviewAll };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityviewAll(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityviewAll");
    if (savedVisibility) {
      setColumnVisibilityviewAll(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityviewAll", JSON.stringify(columnVisibilityviewAll));
  }, [columnVisibilityviewAll]);

  // // Function to filter columns based on search query
  const filteredColumnsviewAll = columnDataTableviewAll.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageviewAll.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityviewAll = (field) => {
    setColumnVisibilityviewAll((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentviewAll = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsviewAll}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageviewAll} onChange={(e) => setSearchQueryManageviewAll(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsviewAll.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityviewAll[column.field]} onChange={() => toggleColumnVisibilityviewAll(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityviewAll(initialColumnVisibilityviewAll)}>
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
                columnDataTableviewAll.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityviewAll(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );



  const handleProjectChange = (options) => {

    setSelectedVendor(options);
  };

  const customValueRendererProject = (valueProject, _categoryname) => {
    return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Project";
  };

  const handleFilterSubmit = async () => {
    try {
      if (selectedVendor.length === 0 && selectedFromdate === "" && selectedTodate === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Value to Filter"}</p>
          </>
        );
        handleClickOpenerr();
      } else if (selectedVendor.length === 0 && (selectedFromdate == "" || selectedTodate === "")) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select both From and Todate"}</p>
          </>
        );
        handleClickOpenerr();
      }
      else {
        setProductioncheck(true);
        let res_vendor = await axios.post(SERVICE.PRODUCTION_TEMP_LIMITED_FILTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          vendor: selectedVendor.map(item => item.value),
          fromdate: selectedFromdate,
          todate: selectedTodate
        });

        let sorted = res_vendor?.data?.productiontemp.sort((a, b) => {
          const dateA = new Date(a.fromdate);
          const dateB = new Date(b.fromdate);

          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;

        });
        setPage(1)
        setProductioncheck(false);
        setProductionsTemp(sorted);
      }
    } catch (err) { setProductioncheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  }


  return (
    <Box>
      <Headtitle title={"Production Temp Upload"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Production Temp Upload</Typography>



      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lproductiontempuploadlist") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid item md={8} sm={8} xs={12}>
              <Typography sx={userStyle.importheadtext}>Filter</Typography>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Vendor
                  </Typography>
                  <MultiSelect
                    options={projVendors}
                    value={selectedVendor}
                    onChange={(e) => {
                      handleProjectChange(e);
                    }}
                    valueRenderer={customValueRendererProject}
                    labelledBy="Please Select Vendor"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        From Date <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={selectedFromdate}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          // Ensure that the selected date is not in the future
                          const currentDate = new Date().toISOString().split("T")[0];
                          if (selectedDate <= currentDate) {
                            setSelectedFromdate(selectedDate);
                            setSelectedTodate(selectedDate);
                          } else {
                            // Handle the case where the selected date is in the future (optional)
                            // You may choose to show a message or take other actions.
                            console.log("Please select a date on or before today.");
                          }
                        }}
                        // Set the max attribute to the current date
                        inputProps={{ max: new Date().toISOString().split("T")[0] }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        To Date <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={selectedTodate}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          // Ensure that the selected date is not in the future
                          const currentDate = new Date().toISOString().split("T")[0];
                          const fromdateval = selectedFromdate != "" && new Date(selectedFromdate).toISOString().split("T")[0];
                          if (selectedFromdate == "") {
                            setShowAlert(
                              <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please Select From date`}</p>
                              </>
                            );
                            handleClickOpenerr();
                          } else if (selectedDate < fromdateval) {
                            setShowAlert(
                              <>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{`To Date should be after or equal to From Date`}</p>
                              </>
                            );
                            handleClickOpenerr();

                            setTimeout(() => setSelectedTodate(""), 0);

                          } else if (selectedDate <= currentDate) {
                            setSelectedTodate(selectedDate);
                          } else {
                            console.log("Please select a date on or before today.");
                          }
                        }}
                        // Set the max attribute to the current date
                        inputProps={{ max: new Date().toISOString().split("T")[0], min: selectedFromdate !== "" ? selectedFromdate : null }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={1.2} sm={6} xs={12} marginTop={3}>
                <Button variant="contained" onClick={(e) => handleFilterSubmit(e)} >Filter</Button>
              </Grid>
              <Grid item md={2} sm={6} xs={12} marginTop={3}>
                <Button sx={userStyle.btncancel} onClick={(e) => fetchProductiontemp(e)} >Clear</Button>
              </Grid>
            </Grid>
          </Box>
          <br />
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Production Temp Upload List</Typography>
              </Grid>
              <Grid item md={4} sm={4} xs={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Link to="/production/productiontempupload">
                  <Button variant="contained" style={{ padding: "7px 14px", borderRadius: "4px" }}>
                    Add
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <br />
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
                    <MenuItem value={productionsTemp?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelproductiontempuploadlist") && (
                    <>
                      {/* <ExportXL
                        csvData={filteredData?.map((t, index) => ({
                          Sno: index + 1,
                          Vendor: t.vendor,
                          "Date Time Zone": t.datetimezone,
                          "From Date": moment(t.fromdate)?.format("DD-MM-YYYY"),
                          "To Date": moment(t.todate)?.format("DD-MM-YYYY"),
                          "User Name": t.addedby[0].companyname,
                          "Created Date": t.createddate,
                        }))}
                        fileName={fileName}
                      /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvproductiontempuploadlist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printproductiontempuploadlist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfproductiontempuploadlist") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)

                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageproductiontempuploadlist") && (
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
            <Button variant="contained" disabled color="error" onClick={handleClickOpenalert}>
              Bulk Delete
            </Button>
            <br />
            <br />
            {productionCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FacebookCircularProgress />
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
          maxWidth="lg"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ overflow: "auto", padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>Edit Production Temp Upload</Typography>
                  </Grid>
                </Grid>
                <br />

                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Vendor<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={vendors}
                        styles={colourStyles}
                        value={{ label: productiontempEdit.vendor, value: productiontempEdit.vendor }}
                        onChange={(e) => {
                          setProductiontempEdit({ ...productiontempEdit, vendor: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>From Date </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={productiontempEdit.fromdate}
                        onChange={(e) => {
                          setProductiontempEdit({ ...productiontempEdit, fromdate: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>To Date </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={productiontempEdit.todate}
                        onChange={(e) => {
                          setProductiontempEdit({ ...productiontempEdit, todate: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Date Time Zone<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={datetimeZoneOptions}
                        placeholder="Please Select Time Zone"
                        value={{ label: productiontempEdit.datetimezone, value: productiontempEdit.datetimezone }}
                        onChange={(e) => {
                          setProductiontempEdit({ ...productiontempEdit, datetimezone: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Excel Date Format</Typography>

                    <Grid container spacing={0.3}>
                      <Grid item md={3.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Select
                            fullWidth
                            labelId="demo-select-small"
                            id="demo-select-small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            value={yeardropEdit}
                            onChange={(e) => {
                              setYeardropEdit(e.target.value);
                            }}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            <MenuItem value="Year" disabled>
                              {" "}
                              {"Year"}{" "}
                            </MenuItem>
                            <MenuItem value="dd"> {"dd"} </MenuItem>
                            <MenuItem value="d"> {"d"} </MenuItem>
                            <MenuItem value="MM"> {"MM"} </MenuItem>
                            <MenuItem value="M"> {"M"} </MenuItem>
                            <MenuItem value="MMM"> {"MMM"} </MenuItem>
                            <MenuItem value="MMMM"> {"MMMM"} </MenuItem>
                            <MenuItem value="yyyy"> {"yyyy"} </MenuItem>
                            <MenuItem value="yy"> {"yy"} </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          {/* <Typography>Excel Date Format</Typography> */}
                          <Select
                            fullWidth
                            labelId="demo-select-small"
                            id="demo-select-small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            value={monthdropEdit}
                            onChange={(e) => {
                              setMonthdropEdit(e.target.value);
                            }}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            <MenuItem value="Month" disabled>
                              {" "}
                              {"Month"}{" "}
                            </MenuItem>
                            <MenuItem value="MM"> {"MM"} </MenuItem>
                            <MenuItem value="M"> {"M"} </MenuItem>
                            <MenuItem value="MMM"> {"MMM"} </MenuItem>
                            <MenuItem value="MMMM"> {"MMMM"} </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          {/* <Typography>Excel Date Format</Typography> */}
                          <Select
                            fullWidth
                            labelId="demo-select-small"
                            id="demo-select-small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            value={datedropEdit}
                            onChange={(e) => {
                              setDatedropEdit(e.target.value);
                            }}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            <MenuItem value="Date" disabled>
                              {" "}
                              {"Date"}{" "}
                            </MenuItem>
                            <MenuItem value="dd"> {"dd"} </MenuItem>
                            <MenuItem value="d"> {"d"} </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={2.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          {/* <Typography>Excel Date Format</Typography> */}
                          <Select
                            fullWidth
                            labelId="demo-select-small"
                            id="demo-select-small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            value={symboldropEdit}
                            onChange={(e) => {
                              setSymboldropEdit(e.target.value);
                            }}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            <MenuItem value="/" disabled>
                              {" "}
                              {"/"}{" "}
                            </MenuItem>
                            <MenuItem value="/"> {"/"} </MenuItem>
                            <MenuItem value="."> {"."} </MenuItem>
                            <MenuItem value="-"> {"-"} </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>{" "}
                  <br />
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Sheet Number </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={productiontempEdit.sheetnumber}
                        onChange={(e) => {
                          setProductiontempEdit({ ...productiontempEdit, sheetnumber: e.target.value });
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
                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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

      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              {showAlert}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            {/* <Button autoFocus variant="contained" color="error" onClick={(e) => { delProduction(Productionsid)}}>
              {" "}
              OK{" "}
            </Button> */}
            <LoadingButton
              onClick={(e) => {
                delProduction(Productionsid);
              }}
              loading={loadingdeloverall}
              color="error"
              loadingPosition="end"
              variant="contained"
            >
              {" "}
              <span>OK &ensp;</span>
            </LoadingButton>
          </DialogActions>
        </Dialog>
        {/* ALERT del view DIALOG */}
        <Dialog open={isDeleteOpenview} onClose={handleCloseModdelview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} /> */}
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              {showAlert}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModdelview} sx={userStyle.btncancel}>
              Cancel
            </Button>
            {/* <Button autoFocus variant="contained" color="error" onClick={(e) => delProductionview()}>
              {" "}
              OK{" "}
            </Button> */}
            <LoadingButton onClick={delProductionview} loading={loadingdel} color="error" loadingPosition="end" variant="contained">
              {" "}
              <span>OK &ensp;</span>
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}

        <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>Production Temp Upload Info</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                <Button variant="contained" onClick={handleCloseinfo}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Date Time Zone</TableCell>
                <TableCell>From Date</TableCell>
                <TableCell>To Date</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Created Dater</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.datetimezone}</TableCell>
                    <TableCell>{row.fromdatelist}</TableCell>
                    <TableCell>{row.todatelist}</TableCell>
                    <TableCell>{row.addedby[0]?.companyname}</TableCell>
                    <TableCell>{row.createddate}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* print view layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefview}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Total Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredDataview &&
                filteredDataview.map((row, index) => {
                  const filenamelistview = row.filename?.split(".x");
                  const filenamelist = filenamelistview[0];
                  const dateval = row.createddate;
                  const dateOnly = dateval && dateval?.split("T")[0];
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.createddate}</TableCell>
                      <TableCell>{filenamelist}</TableCell>
                      <TableCell>{row.totaldata}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefviewall}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Indentity Name</TableCell>
                <TableCell>Login id</TableCell>
                <TableCell>Process Date</TableCell>
                <TableCell>Unit Rate</TableCell>
                <TableCell>Flag Count</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Clientid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredDataviewAll &&
                filteredDataviewAll.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.unitid}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.dateval}</TableCell>
                    <TableCell>{row.unitrate}</TableCell>
                    <TableCell>{row.flagcount}</TableCell>
                    <TableCell>{row.section}</TableCell>
                    <TableCell>{row.alllogin}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="md">
        <DialogContent>
          <>
            <Typography sx={userStyle.HeaderText}>Upload Temp Production Total Files</Typography>
            <br />
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeview}
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeview}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={productiontempView?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelproductiontempuploadlist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpenView(true)

                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvproductiontempuploadlist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpenView(true);
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                  )}
                  {isUserRoleCompare?.includes("printproductiontempuploadlist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintview}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfproductiontempuploadlist") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpenView(true)

                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageproductiontempuploadlist") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageview}>
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
                    <OutlinedInput id="component-outlined" type="text" value={searchQueryview} onChange={handleSearchChangeview} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsview}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsview}>
              Manage Columns
            </Button>
            {/* Manage Column */}
            <Popover
              id={idview}
              open={isManageColumnsOpenview}
              anchorEl={anchorElview}
              onClose={handleCloseManageColumnsview}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentview}
            </Popover>
            <br />
            <br />
            {!productionViewCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FacebookCircularProgress />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowDataTableview} columns={columnDataTableview.filter((column) => columnVisibilityview[column.field])} onSelectionModelChange={handleSelectionChange} autoHeight={true} ref={gridRefview} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredDataview.length > 0 ? (pageview - 1) * pageSizeview + 1 : 0} to {Math.min(pageview * pageSizeview, filteredDataviews.length)} of {filteredDataviews.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageview(1)} disabled={pageview === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeview(pageview - 1)} disabled={pageview === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbersview?.map((pageNumberview) => (
                      <Button key={pageNumberview} sx={userStyle.paginationbtn} onClick={() => handlePageChangeview(pageNumberview)} className={pageview === pageNumberview ? "active" : ""} disabled={pageview === pageNumberview}>
                        {pageNumberview}
                      </Button>
                    ))}
                    {lastVisiblePageview < totalPagesview && <span>...</span>}
                    <Button onClick={() => handlePageChangeview(pageview + 1)} disabled={pageview === totalPagesview} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageview(totalPagesview)} disabled={pageview === totalPagesview} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
            <br />
          </>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseview}>
            {" "}
            Back{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/* viewAll model */}
      <Dialog open={openviewAll} onClose={handleClickOpenviewAll} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg">
        <DialogContent>
          <>
            <Typography sx={userStyle.HeaderText}>Uploaded Temp Production List</Typography>
            {/* <br /> */}
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeviewAll}
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeviewAll}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={productiontempviewAll?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelproductiontempuploadlist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpenViewAll(true)

                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvproductiontempuploadlist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpenViewAll(true)

                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printproductiontempuploadlist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintviewall}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfproductiontempuploadlist") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpenViewAll(true)

                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageproductiontempuploadlist") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageviewall}>
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
                    <OutlinedInput id="component-outlined" type="text" value={searchQueryviewAll} onChange={handleSearchChangeviewAll} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsviewAll}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsviewAll}>
              Manage Columns
            </Button>
            <br />
            {/* Manage Column */}
            <Popover
              id={idviewall}
              open={isManageColumnsOpenviewAll}
              anchorEl={anchorElviewAll}
              onClose={handleCloseManageColumnsviewAll}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentviewAll}
            </Popover>
            {/* <br /> */}
            {!productionfirstViewCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FacebookCircularProgress />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowDataTableviewAll} columns={columnDataTableviewAll.filter((column) => columnVisibilityviewAll[column.field])} onSelectionModelChange={handleSelectionChange} autoHeight={true} ref={gridRefviewall} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredDataviewAlls.length > 0 ? (pageviewAll - 1) * pageSizeviewAll + 1 : 0} to {Math.min(pageviewAll * pageSizeviewAll, filteredDataviewAlls.length)} of {filteredDataviewAlls.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageviewAll(1)} disabled={pageviewAll === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeviewAll(pageviewAll - 1)} disabled={pageviewAll === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbersviewall?.map((pageNumberviewAll) => (
                      <Button key={pageNumberviewAll} sx={userStyle.paginationbtn} onClick={() => handlePageChangeviewAll(pageNumberviewAll)} className={pageviewAll === pageNumberviewAll ? "active" : ""} disabled={pageviewAll === pageNumberviewAll}>
                        {pageNumberviewAll}
                      </Button>
                    ))}
                    {lastVisiblePageviewAll < totalPagesviewAll && <span>...</span>}
                    <Button onClick={() => handlePageChangeviewAll(pageviewAll + 1)} disabled={pageviewAll === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageviewAll(totalPagesviewAll)} disabled={pageviewAll === totalPagesviewAll} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseviewAll}>
            Back
          </Button>
        </DialogActions>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
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

      <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delProductioncheckbox(e)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
      {/* delete success msg */}
      <Dialog open={isDeleteOpenviewsuccess} onClose={handleCloseModviewSuccess} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
          <Typography variant="h6">{showAlertcomplete}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseModviewSuccess}>
            ok
          </Button>
        </DialogActions>
      </Dialog>

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
        filename={"Production Original Upload"}
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
        filteredDataTwo={rowDataTableview ?? []}
        itemsTwo={itemsview ?? []}
        filename={"Upload Production Total Files"}
        exportColumnNames={exportColumnNamesView}
        exportRowValues={exportRowValuesView}
        componentRef={componentRefview}
      />
      <ExportDataViewAll
        isFilterOpen={isFilterOpenViewAll}
        handleCloseFilterMod={handleCloseFilterModViewAll}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenViewAll}
        isPdfFilterOpen={isPdfFilterOpenViewAll}
        setIsPdfFilterOpen={setIsPdfFilterOpenViewAll}
        handleClosePdfFilterMod={handleClosePdfFilterModViewAll}
        filteredDataTwo={rowDataTableviewAll ?? []}
        itemsTwo={itemsviewAll ?? []}
        filename={"Uploaded Production List"}
        exportColumnNames={exportColumnNamesViewAll}
        exportRowValues={exportRowValuesViewAll}
        componentRef={componentRefviewall}
      />
    </Box>
  );
}

export default ProductionTempUpload;