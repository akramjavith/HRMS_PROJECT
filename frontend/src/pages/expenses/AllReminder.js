import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";
import { MultiSelect } from "react-multi-select-component";
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
  Popover,
  Select,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
  DialogTitle,
  TextareaAutosize,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { v4 as uuidv4 } from "uuid";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import {
  frequencyOpt,
  month,
  monthsOption,
} from "../../components/Componentkeyword";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import AddExpensePopup from "./AddExpensePopup";
import EditExpensePopup from "./EditExpensePopup";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import { FaTrash } from "react-icons/fa";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { makeStyles } from "@material-ui/core";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Webcamimage from "../asset/Webcameimageasset";
const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function AllReminder() {
  const navigate = useNavigate();
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
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

  let exportColumnNames = [
    "Company",
    "Branch",
    "Bill Date",
    "Due Date",
    "Bill No",
    "Vendor Name",
    "Frequency",
    "Source",
    "Total Amount",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "billdate",
    "duedate",
    "billno",
    "vendor",
    "vendorfrequency",
    "source",
    "amount",
  ];


  //attachments start
  const classes = useStyles();
  const renderFilePreview = async (file) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };


  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  const handleRemarkChangeUpload = (value, index) => {
    setRefImage((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };
  const handleRemarkChangeWebCam = (value, index) => {
    setCapturedImages((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };
  const handleRemarkChangeDragDrop = (value, index) => {
    setRefImageDrag((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    webcamClose();
    setGetImg("");
  };
  const showWebcam = () => {
    webcamOpen();
  };
  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };


  //reference images
  const handleInputChange = (event) => {
    const selectedFile = event.target.files[0]; // Only take the first file
    if (!selectedFile) return;

    // Check if the file exceeds 1MB (1,024,000 bytes)
    if (selectedFile.size > 1024000) {
      setPopupContentMalert(
        `The file "${selectedFile.name}" is larger than 1MB and will not be uploaded.`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Prevent further processing
    }

    // Set only the latest selected file
    setRefImage([{ file: selectedFile }]);
  };
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };

  const removeCapturedImage = (index) => {
    const newCapturedImages = [...capturedImages];
    newCapturedImages.splice(index, 1);
    setCapturedImages(newCapturedImages);
  };
  const resetImage = () => {
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    // previewFile(event.dataTransfer.files[0]);
    // const files = event.dataTransfer.files;
    // let newSelectedFilesDrag = [];
    // // Only the first file
    // const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    // if (!files) {
    //   return; // No file selected
    // }

    // if (files[0].size > maxFileSize) {
    //   setPopupContentMalert(
    //     "File size is greater than 1MB, please upload a file below 1MB!"
    //   );
    //   setPopupSeverityMalert("warning");
    //   handleClickOpenPopupMalert();
    //   return; // Stop further processing
    // }


    // for (let i = 0; i < 1; i++) {
    //   const file = files[i];
    //   // if (file.type.startsWith("image/")) {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     newSelectedFilesDrag.push({
    //       name: file.name,
    //       size: file.size,
    //       type: file.type,
    //       preview: reader.result,
    //       base64: reader.result.split(",")[1],
    //     });
    //     setRefImage(newSelectedFilesDrag);
    //     // setRefImageDrag(newSelectedFilesDrag);
    //   };
    //   reader.readAsDataURL(file);

    // } else {
    //   setPopupContentMalert("Only Accept Images!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }

    const selectedFile = event.dataTransfer.files[0]; // Only take the first file
    if (!selectedFile) return;

    // Check if the file exceeds 1MB (1,024,000 bytes)
    if (selectedFile.size > 1024000) {
      setPopupContentMalert(
        `The file "${selectedFile.name}" is larger than 1MB and will not be uploaded.`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Prevent further processing
    }

    // Set only the latest selected file
    setRefImage([{ file: selectedFile }]);
    // }
  };
  const handleUploadOverAll = () => {
    setUploadPopupOpen(false);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...refImageDrag];
    newSelectedFiles.splice(index, 1);
    setRefImageDrag(newSelectedFiles);
  };

  //attachments end
  const [fileFormat, setFormat] = useState("");

  const gridRef = useRef(null);
  const [documentsList, setDocumentsList] = useState([]);
  const {
    isUserRoleCompare,
    pageName,
    setPageName,
    isAssignBranch,
    isUserRoleAccess,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }


        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));
  const [singleDoc, setSingleDoc] = useState({});
  const { auth } = useContext(AuthContext);
  //Datatable
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openInfo, setOpeninfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [viewInfo, setViewInfo] = useState([]);
  const [openView, setOpenView] = useState(false);
  const initialColumnVisibility = {
    actions: true,
    company: true,
    branch: true,
    checkbox: true,
    serialNumber: true,
    vendorfrequency: true,
    billdate: true,
    duedate: true,
    vendor: true,
    source: true,
    billno: true,
    amount: true,
  };

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = (date.getMonth() + 1).toString().padStart(2, "0");

  const [yearsOption, setYearsOption] = useState([]);
  const [periodState, setPeriodState] = useState({
    year: currentYear.toString(),
    month: currentMonth,
    monthlabel: month[date.getMonth()],
  });

  //function to generate mins

  //function to generate mins
  const generateYearsOptions = () => {
    const yearsOpt = [];
    let fromPrevThreeYrs = 2023
    for (let i = fromPrevThreeYrs; i <= currentYear + 30; i++) {
      yearsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setYearsOption(yearsOpt);
  };

  const [frequencyValue, setFrequencyValue] = useState("Daily");
  const [dailyDate, setDailyDate] = useState(moment().format("YYYY-MM-DD"));
  const [weeklyDate, setWeeklyDate] = useState();

  function getMinSelectableDate() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Find the date of the earliest Monday in the current month
    let earliestMonday = new Date(currentYear, currentMonth, 1);
    while (earliestMonday.getDay() !== 1) {
      earliestMonday.setDate(earliestMonday.getDate() + 1);
    }
    return earliestMonday.toISOString().split("T")[0]; // Return the date in YYYY-MM-DD format
  }

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(documentsList);
  }, [documentsList]);

  function getMaxSelectableDate() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Find the date of the latest Sunday in the current month
    let latestSunday = new Date(currentYear, currentMonth + 1, 0);
    while (latestSunday.getDay() !== 0) {
      latestSunday.setDate(latestSunday.getDate() - 1);
    }
    return latestSunday.toISOString().split("T")[0]; // Return the date in YYYY-MM-DD format
  }

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [vendorAuto, setVendorAuto] = useState("");
  const [expenseEditAuto, setExpenseEditAuto] = useState("");
  const [expenseEditId, setExpenseEditId] = useState();
  useEffect(() => {
    // sendRequest("Daily", moment().format("YYYY-MM-DD"));
    generateYearsOptions();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
  const [openviewalertExpEdit, setOpenviewalertExpEdit] = useState(false);

  const [expenseCatePop, setExpenseCatePop] = useState();
  const [expenseSubCatePop, setExpenseSubCatePop] = useState();
  const [reminderId, setReminderId] = useState();
  const [expenseDatePop, setExpenseDatePop] = useState();
  // view model
  const handleClickOpenviewalertvendor = () => {
    setOpenviewalertvendro(true);
  };

  const handleCloseviewalertvendor = () => {
    setOpenviewalertvendro(false);
  };
  const handleClickOpenviewalertExp = () => {
    setOpenviewalertExpEdit(true);
  };

  const handleCloseviewalertExp = () => {
    setOpenviewalertExpEdit(false);
  };
  //image


  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "All Remainder.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handlViewClose = () => {
    setOpenView(false);
  };
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //delete model
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const handleFilterClick = () => {
    if (filterUser.frequency?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (filterUser.day === "Custom Fields" && (filterUser.fromdate === "" || filterUser.todate === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Both From Date and To Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {

      sendRequest();
    }
  };

  const sendRequest = async (e) => {
    try {
      setLoading(true);
      setPageName(!pageName);
      const year = periodState.year;
      const month = periodState.month;
      const startDate = moment(`${year}-${month}-01`).format("YYYY-MM-DD");

      // Get the end date of the month
      const endDate = moment(`${year}-${month}-01`).endOf("month").format("YYYY-MM-DD");



      let res = await axios.post(SERVICE.ALLREMINDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        frequency: filterUser?.frequency?.map(data => data?.value),
        fromdate: filterUser?.day === "Custom Month" ? startDate : filterUser?.fromdate,
        todate: filterUser?.day === "Custom Month" ? endDate : filterUser?.todate,
        // vendorfrequency: String(e),
        // filterdates: String(filterdates),
        // filteryear: String(filteryear),
        assignbranch: [
          ...accessbranch,
          isUserRoleCompare?.includes("lassignexpenseothers") && {
            company: "Others",
            branch: "",
            unit: "",
          },
        ],
        company: valueCompanyCat,
        branch: valueBranchCat,
        includeothers: isUserRoleCompare?.includes("lassignexpenseothers")
      });

      // if (e === "Daily" || e === "Monthly" || e === "Weekly") {
      const expenseReminders = res?.data?.expensereminder || []; // Assuming res?.data?.expensereminder is your array of objects
      const groupedData = expenseReminders.reduce((accumulator, item) => {
        const vendorId = item.vendorid;
        const source = item.source;
        const vendorName = item.vendor;
        const existingItem = accumulator.find(
          (group) => group.vendorid === vendorId && group.source === source && group.vendor === vendorName
        );

        if (existingItem) {
          // If the vendorid already exists in the accumulator, update the fields accordingly
          existingItem.amount += parseFloat(item.amount); // Add the amount
          existingItem._id.push(item._id); // Push the _id to the existing array
          // existingItem.source.push(item.source); // Push the source to the existing array
          existingItem.billno.push(item.billno); // Push the billno to the existing array
          existingItem.currdate.push(item.currdate); // Push the currdate to the existing array
          existingItem.billdate.push(item?.billdate); // Push the currdate to the existing array
          existingItem.duedate.push(item?.duedate); // Push the currdate to the existing array
          existingItem.company.push(item?.company); // Push the currdate to the existing array
          existingItem.branch.push(item?.branch); // Push the currdate to the existing array
        } else {
          // If the vendorid doesn't exist, create a new object
          accumulator.push({
            _id: [item._id], // Create an array with the _id
            vendor: item.vendor,
            company: [item.company],
            branch: [item.branch],
            currdate: [item.currdate],
            billdate: [item?.billdate],
            duedate: [item?.duedate],
            filteredfrom: item.filteredfrom,
            vendorfrequency: item.vendorfrequency,
            frequency: item?.frequency,
            assignbranch: item?.assignbranch,
            fromdate: item?.fromdate,
            todate: item?.todate,
            finalbillstatus: item?.finalbillstatus,
            filterdates: item?.filterdates,
            filteryear: item?.filteryear,
            expensetotal: item?.expensetotal,
            amount: parseFloat(item.amount), // Convert amount to float
            source: item.source, // Create an array with the source
            billno: [item.billno], // Create an array with the billno
            vendorid: vendorId,
            serialNumber: accumulator.length + 1, // Add serial number
            uniqueid: uuidv4(), // Generate unique ID
          });
        }

        return accumulator;
      }, []);

      const rowDataTableData = groupedData.map((item) => {
        return {
          id: item.uniqueid,
          serialNumber: item.serialNumber,
          vendorfrequency: item.vendorfrequency,
          vendor: item.vendor,
          vendorid: item.vendorid,
          company: [...new Set(item?.company)].toString(),
          branch: [...new Set(item?.branch)].toString(),
          currdate: item.currdate.toString(),
          billdate: [...new Set(item?.billdate || "")].toString(),
          duedate: [...new Set(item?.duedate || "")].toString(),
          source: item.source,
          billno: item.billno.toString(),
          dbids: item._id,
          checklog: item.billno,
          amount: item?.amount || 0,
          filteredfrom: item.filteredfrom,
          filterdates: item?.filterdates,
          filteryear: item?.filteryear,
          assignbranch: item?.assignbranch,
          frequency: item?.frequency,
          fromdate: item?.fromdate,
          todate: item?.todate,
          finalbillstatus: item?.finalbillstatus,
          // allPayNowData: item
        };
      });
      setDocumentsList(rowDataTableData);
      // }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //Project updateby edit page...
  let updateby = singleDoc.updatedby;
  let addedby = viewInfo.addedby;


  // Excel
  const fileName = "Payment Due Reminder";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "All Remainder",
    pageStyle: "print",
  });

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
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
    );
  });
  const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
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
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.company,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.branch,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "billdate",
      headerName: "Bill Date",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.billdate,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "duedate",
      headerName: "Due Date",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.duedate,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "billno",
      headerName: "Bill Number",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.billno,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "vendor",
      headerName: "Vendor Name",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.vendor,
    },
    {
      field: "vendorfrequency",
      headerName: "Frequency",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.vendorfrequency,
    },
    {
      field: "source",
      headerName: "Source",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.source,
      cellRenderer: (params) => {
        const speedStatus = params.data.source; // Check speed status for the row
        const color = speedStatus === "Expense" ? "green" : speedStatus === "Stock Purchase" ? "#000435" : speedStatus === "Manual Stock Entry" ? "orange" : "brown"; // Green if true, red if false

        return (
          <span style={{ color: color }}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.amount,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.actions,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      //lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex", padding: "10px" }}>
          {isUserRoleCompare?.includes("eallremainder") && params?.data?.amount !== 0 && (
            <LoadingButton variant="contained" size="small" loading={payNowLoader === params?.data?.id} sx={{
              background: params?.data?.source === "Expense" ? "green" : params?.data?.source === "Stock Purchase" ? "#000435" : params?.data?.source === "Manual Stock Entry" ? "orange" : "brown"
            }} onClick={() => {
              getviewCode(params.data);
            }}>
              Pay Now
            </LoadingButton>
          )}
          {isUserRoleCompare?.includes("eallremainder") && (
            <>
              {/* {Array.isArray(params.data.checklog) &&
                params?.data?.checklog.length > 1 && ( */}

              <Button
                variant="contained"
                sx={{
                  minWidth: "10px",
                  padding: "6px 5px",
                  marginLeft: "10px",
                }}
                onClick={
                  () => {
                    navigate("/expense/allreminderlog", {
                      state: {
                        migrateData: {
                          fromdate: params?.data?.fromdate,
                          todate: params?.data?.todate,
                          assignbranch: params?.data?.assignbranch,
                          frequency: params?.data?.frequency,
                          vendorid: params?.data?.vendorid,
                          vendor: params?.data?.vendor,
                          source: params?.data?.source,
                          company: valueCompanyCat,
                          branch: valueBranchCat,
                          includeothers: isUserRoleCompare?.includes("lassignexpenseothers")
                        }
                      },
                    });
                  }
                }
              >
                <MenuIcon style={{ fontsize: "small" }} />
              </Button>
              {/* )} */}
            </>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData;
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
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
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  useEffect(() => {
    getapi();
  }, []);


  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);

    setPayNowData({});
    setPayNowDatas([]);
    setPayNowLoader("");
    setmodeofpay([])
    setVendor({
      vendorname: "",
      emailid: "",
      phonenumber: "",
      phonenumberone: "",
      phonenumbertwo: "",
      phonenumberthree: "",
      phonenumberfour: "",
      whatsappnumber: "",
      contactperson: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      gstnumber: "",
      creditdays: "",
      bankname: "Please Select Bank Name",
      bankbranchname: "",
      accountholdername: "",
      accountnumber: "",
      ifsccode: "",
      phonecheck: false,
      modeofpayments: "Please Select Mode of Payments",
      paymentfrequency: "Please Select Payment Frequency",
      monthlyfrequency: "",
      weeklyfrequency: "",
      vendorstatus: "",
      upinumber: "",
      chequenumber: "",
      cardnumber: "",
      cardholdername: "",
      cardtransactionnumber: "",
      cardtype: "Please Select Card Type",
      cardmonth: "Month",
      cardyear: "Year",
      cardsecuritycode: "",

      payamount: "",
      payamountdate: "",
      payamounttime: "",
      description: "",
      refno: "",
    })
    setRefImage([]);
  };

  const [modeofpay, setmodeofpay] = useState([]);

  const [vendor, setVendor] = useState({
    vendorname: "",
    emailid: "",
    phonenumber: "",
    phonenumberone: "",
    phonenumbertwo: "",
    phonenumberthree: "",
    phonenumberfour: "",
    whatsappnumber: "",
    contactperson: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    gstnumber: "",
    creditdays: "",
    bankname: "Please Select Bank Name",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    phonecheck: false,
    modeofpayments: "Please Select Mode of Payments",
    paymentfrequency: "Please Select Payment Frequency",
    monthlyfrequency: "",
    weeklyfrequency: "",
    vendorstatus: "",
    upinumber: "",
    chequenumber: "",
    cardnumber: "",
    cardholdername: "",
    cardtransactionnumber: "",
    cardtype: "Please Select Card Type",
    cardmonth: "Month",
    cardyear: "Year",
    cardsecuritycode: "",

    payamount: "",
    payamountdate: "",
    payamounttime: "",
    description: "",
    refno: "",
  });

  const [payNowData, setPayNowData] = useState({});
  const [payNowLoader, setPayNowLoader] = useState("");
  const [payNowSubmitLoader, setPayNowSubmitLoader] = useState(false);
  const [payNowDatas, setPayNowDatas] = useState([]);
  const [source, setSource] = useState("");
  const [vendorDetails, setVendorDetails] = useState("")
  const getviewCode = async (e) => {
    console.log(e, "e");
    setPayNowLoader(e?.id);
    setPageName(!pageName);
    try {
      if (e.source === "Scheduled Payment") {
        setSource("Scheduled Payment")
        let res = await axios.post(`${SERVICE.BULKPAY_SCHEDULEPAYENT_BILLS}`, {
          method: "get",
          ids: e?.dbids,
          updateData: {}
        }, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        let unpaidDatas = res?.data?.expenses?.filter(data => data?.paidbillstatus !== "Completed")
        const totalAmounts = unpaidDatas?.reduce(
          (accumulator, item) => {
            return {
              balanceamount: Number(accumulator.balanceamount) + (Number(item.dueamount) - Number(item.paidamount)),
              totalbillamount:
                Number(accumulator.totalbillamount) + Number(item.dueamount),
              paidamount: Number(accumulator.paidamount) + Number(item.paidamount)
            };
          },
          { balanceamount: 0, totalbillamount: 0, paidamount: 0 } // Initial values
        );
        setPayNowData(totalAmounts);
        setPayNowDatas(unpaidDatas);
      }
      else if (e.source === "Expense") {
        setSource("Expense")
        let res = await axios.post(`${SERVICE.BULKPAY_EXPENSE}`, {
          method: "get",
          ids: e?.dbids,
          updateData: {}
        }, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        let unpaidDatas = res?.data?.expenses?.filter(data => data?.billstatus !== "Completed")
        const totalAmounts = unpaidDatas?.reduce(
          (accumulator, item) => {
            return {
              balanceamount: Number(accumulator.balanceamount) + Number(item.balanceamount),
              totalbillamount:
                Number(accumulator.totalbillamount) + Number(item.totalbillamount),
              paidamount: Number(accumulator.paidamount) + Number(item.paidamount)
            };
          },
          { balanceamount: 0, totalbillamount: 0, paidamount: 0 } // Initial values
        );
        setPayNowData(totalAmounts);
        setPayNowDatas(unpaidDatas);
      }
      else {
        setSource(e.source)
        let res = await axios.post(`${SERVICE.GET_STOCK_DETAILS}`, {
          method: "get",
          ids: e?.dbids,
          updateData: {},
          collectionname: e.source
        }, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        console.log(res.data?.expenses, "res.data?.expenses");
        const totalAmounts = res?.data?.expenses?.reduce(
          (accumulator, item) => {
            return {
              balanceamount: Number(accumulator.balanceamount) + Number((item?.requestmode === "Asset Material" ? item?.totalbillamount : item?.totalbillamountstock) - item.paidamount),
              totalbillamount:
                Number(accumulator.totalbillamount) + Number(item?.requestmode === "Asset Material" ? item?.totalbillamount : item?.totalbillamountstock),
              paidamount: Number(accumulator.paidamount) + Number(item.paidamount)
            };
          },
          { balanceamount: 0, totalbillamount: 0, paidamount: 0 } // Initial values
        );
        setPayNowData(totalAmounts);
        setPayNowDatas(res.data?.expenses);
      }
      if (e.vendorid) {
        let vendorDetails = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${e.vendorid}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        })
        setVendorDetails(vendorDetails?.data?.svendordetails);
        console.log(vendorDetails?.data?.svendordetails);
      } else {
        setVendorDetails({});

      }
      setPayNowLoader("");
      handleClickOpenview();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("All Remainder"),
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


  const handleSubmit = (e) => {
    e.preventDefault();
    // const isNameMatch = vendormaster.some(
    //   (item) =>
    //     item.vendorname.toLowerCase() === (vendor.vendorname).toLowerCase()
    // );

    if (vendor.payamount === "") {
      setPopupContentMalert("Please Enter Amount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (vendor.payamountdate === "") {
      setPopupContentMalert("Please Enter Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.payamounttime === "") {
      setPopupContentMalert("Please Select time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (vendor.refno === "") {
      setPopupContentMalert("Please Enter Ref No!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      vendor.paymentfrequency === "Weekly" && (vendor.weeklyfrequency === "" || !vendor.weeklyfrequency)
    ) {
      setPopupContentMalert("Please Select Weekly Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (vendor.modeofpayments === "Please Select Mode of Payments") {
      setPopupContentMalert("Please Select Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.bankname === "Please Select Bank Name"
    ) {
      setPopupContentMalert("Please Select Bank Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.bankbranchname === ""
    ) {
      setPopupContentMalert("Please Enter Bank Branch Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.accountholdername === ""
    ) {
      setPopupContentMalert("Please Enter Account Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.accountnumber === ""
    ) {
      setPopupContentMalert("Please Enter Account Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Bank Transfer") && vendor.ifsccode === "") {
      setPopupContentMalert("Please Enter IFSC Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("UPI") && vendor.upinumber === "") {
      setPopupContentMalert("Please Enter UPI Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardnumber === "") {
      setPopupContentMalert("Please Enter Card Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardholdername === "") {
      setPopupContentMalert("Please Enter Card Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Card") &&
      vendor.cardtransactionnumber === ""
    ) {
      setPopupContentMalert("Please Enter Card Transaction Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Card") &&
      vendor.cardtype === "Please Select Card Type"
    ) {
      setPopupContentMalert("Please Select Card Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardmonth === "Month") {
      setPopupContentMalert("Please Select Expire Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardyear === "Year") {
      setPopupContentMalert("Please Select Expire Year!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardsecuritycode === "") {
      setPopupContentMalert("Please Enter Card Security Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Cheque") && vendor.chequenumber === "") {
      setPopupContentMalert("Please Enter Cheque Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (modeofpay.length === 0) {
      setPopupContentMalert("Please Insert Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (Number(payNowData?.totalbillamount - payNowData?.paidamount) !== Number(vendor.payamount)) {
      setPopupContentMalert("Please Enter Full Amount For Bulk Pay!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (isNameMatch) {
    //   setPopupContentMalert("Data Already exist!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // } 
    else {
      payNowExpense();
    }
  };
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const payNowExpense = async () => {
    setPageName(!pageName);
    try {
      setPayNowSubmitLoader(true)
      if (source === "Scheduled Payment") {
        await Promise.all(
          payNowDatas?.map(async (data) => {
            let formData = new FormData();

            if (refImage.length > 0) {
              refImage.forEach((item) => {
                formData.append("attachments", item.file); // `files` is the key for multiple files
              });
            }

            const jsonData = {
              paidamount: Number(data?.dueamount),
              paidmode: vendor.modeofpayments,
              paidstatus: "Paid",
              sortdate: new Date(),
              paidbillstatus: "Completed",


              bankname:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.bankname)
                  : "",
              bankbranchname:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.bankbranchname)
                  : "",
              accountholdername:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.accountholdername)
                  : "",
              accountnumber:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.accountnumber)
                  : "",
              ifsccode:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.ifsccode)
                  : "",

              upinumber:
                vendor.modeofpayments === "UPI" ? String(vendor.upinumber) : "",

              cardnumber:
                vendor.modeofpayments === "Card" ? String(vendor.cardnumber) : "",
              cardholdername:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardholdername)
                  : "",
              cardtransactionnumber:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardtransactionnumber)
                  : "",
              cardtype:
                vendor.modeofpayments === "Card" ? String(vendor.cardtype) : "",
              cardmonth:
                vendor.modeofpayments === "Card" ? String(vendor.cardmonth) : "",
              cardyear:
                vendor.modeofpayments === "Card" ? String(vendor.cardyear) : "",
              cardsecuritycode:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardsecuritycode)
                  : "",

              chequenumber:
                vendor.modeofpayments === "Cheque"
                  ? String(vendor.chequenumber)
                  : "",

              cash: vendor.modeofpayments === "Cash" ? String("Cash") : "",


              paymentduereminderlog: [
                ...(data?.paymentduereminderlog?.length > 0 ? data?.paymentduereminderlog : []),
                {
                  balanceamount: 0,
                  expensetotal: data?.expensetotal,
                  modeofpayments: vendor.modeofpayments,
                  refno: vendor.refno,
                  // attachments: refImage?.length > 0 ? refImage[0]?.preview : "",
                  // filetype: refImage?.length > 0 ? refImage[0]?.type : "",
                  payamountdate: moment(`${vendor.payamountdate} ${vendor.payamounttime}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm"),
                  // payamountdate: vendor.payamountdate,
                  description: vendor.description || "",
                  payamount: vendor.payamount,
                  bankname: vendor.modeofpayments === "Bank Transfer"
                    ? String(vendor.bankname)
                    : "",
                  bankbranchname: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.bankbranchname
                    : "",
                  accountholdername: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.accountholdername
                    : "",
                  accountnumber: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.accountnumber
                    : "",
                  ifsccode: vendor.modeofpayments === "Bank Transfer" ? vendor.ifsccode : "",

                  upinumber: vendor.modeofpayments === "UPI" ? vendor.upinumber : "",

                  cardnumber: vendor.modeofpayments === "Card" ? vendor.cardnumber : "",
                  cardholdername: vendor.modeofpayments === "Card"
                    ? vendor.cardholdername
                    : "",
                  cardtransactionnumber: vendor.modeofpayments === "Card"
                    ? vendor.cardtransactionnumber
                    : "",
                  cardtype: vendor.modeofpayments === "Card" ? vendor.cardtype : "",
                  cardmonth: vendor.modeofpayments === "Card" ? vendor.cardmonth : "",
                  cardyear: vendor.modeofpayments === "Card" ? vendor.cardyear : "",
                  cardsecuritycode: vendor.modeofpayments === "Card"
                    ? vendor.cardsecuritycode
                    : "",
                  chequenumber: vendor.modeofpayments === "Cheque"
                    ? vendor.chequenumber
                    : "",
                  addedby: [
                    {
                      name: String(isUserRoleAccess.companyname),
                      date: String(new Date()),
                    },
                  ],
                }]
            }
            formData.append("jsonData", JSON.stringify(jsonData));
            await axios.put(
              `${SERVICE.UPDATEPAYNOWSCHEDULEPAYMENT}/${data?._id}`, formData,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

              }
            );
          })
        );
      } else if (source === "Expense") {
        await Promise.all(
          payNowDatas?.map(async (data) => {
            let formData = new FormData();

            if (refImage.length > 0) {
              refImage.forEach((item) => {
                formData.append("attachments", item.file); // `files` is the key for multiple files
              });
            }

            const jsonData = {
              paidamount: Number(data?.totalbillamount),
              balanceamount: 0,
              paidmode: vendor.modeofpayments,
              paidstatus: "Paid",
              sortdate: new Date(),
              billstatus: "Completed",


              bankname:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.bankname)
                  : "",
              bankbranchname:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.bankbranchname)
                  : "",
              accountholdername:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.accountholdername)
                  : "",
              accountnumber:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.accountnumber)
                  : "",
              ifsccode:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.ifsccode)
                  : "",

              upinumber:
                vendor.modeofpayments === "UPI" ? String(vendor.upinumber) : "",

              cardnumber:
                vendor.modeofpayments === "Card" ? String(vendor.cardnumber) : "",
              cardholdername:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardholdername)
                  : "",
              cardtransactionnumber:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardtransactionnumber)
                  : "",
              cardtype:
                vendor.modeofpayments === "Card" ? String(vendor.cardtype) : "",
              cardmonth:
                vendor.modeofpayments === "Card" ? String(vendor.cardmonth) : "",
              cardyear:
                vendor.modeofpayments === "Card" ? String(vendor.cardyear) : "",
              cardsecuritycode:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardsecuritycode)
                  : "",

              chequenumber:
                vendor.modeofpayments === "Cheque"
                  ? String(vendor.chequenumber)
                  : "",

              cash: vendor.modeofpayments === "Cash" ? String("Cash") : "",


              paymentduereminderlog: [
                ...(data?.paymentduereminderlog?.length > 0 ? data?.paymentduereminderlog : []),
                {
                  balanceamount: 0,
                  expensetotal: data?.expensetotal,
                  modeofpayments: vendor.modeofpayments,
                  refno: vendor.refno,
                  // attachments: refImage?.length > 0 ? refImage[0]?.preview : "",
                  // filetype: refImage?.length > 0 ? refImage[0]?.type : "",
                  payamountdate: moment(`${vendor.payamountdate} ${vendor.payamounttime}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm"),
                  // payamountdate: vendor.payamountdate,
                  description: vendor.description || "",
                  payamount: vendor.payamount,
                  bankname: vendor.modeofpayments === "Bank Transfer"
                    ? String(vendor.bankname)
                    : "",
                  bankbranchname: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.bankbranchname
                    : "",
                  accountholdername: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.accountholdername
                    : "",
                  accountnumber: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.accountnumber
                    : "",
                  ifsccode: vendor.modeofpayments === "Bank Transfer" ? vendor.ifsccode : "",

                  upinumber: vendor.modeofpayments === "UPI" ? vendor.upinumber : "",

                  cardnumber: vendor.modeofpayments === "Card" ? vendor.cardnumber : "",
                  cardholdername: vendor.modeofpayments === "Card"
                    ? vendor.cardholdername
                    : "",
                  cardtransactionnumber: vendor.modeofpayments === "Card"
                    ? vendor.cardtransactionnumber
                    : "",
                  cardtype: vendor.modeofpayments === "Card" ? vendor.cardtype : "",
                  cardmonth: vendor.modeofpayments === "Card" ? vendor.cardmonth : "",
                  cardyear: vendor.modeofpayments === "Card" ? vendor.cardyear : "",
                  cardsecuritycode: vendor.modeofpayments === "Card"
                    ? vendor.cardsecuritycode
                    : "",
                  chequenumber: vendor.modeofpayments === "Cheque"
                    ? vendor.chequenumber
                    : "",
                  addedby: [
                    {
                      name: String(isUserRoleAccess.companyname),
                      date: String(new Date()),
                    },
                  ],
                }]

            }
            formData.append("jsonData", JSON.stringify(jsonData));
            await axios.put(
              `${SERVICE.UPDATEPAYNOWEXPENSES}/${data?._id}`, formData,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              }
            );
          })
        );
      } else {
        await Promise.all(
          payNowDatas?.map(async (data) => {
            let formData = new FormData();

            if (refImage.length > 0) {
              refImage.forEach((item) => {
                formData.append("attachments", item.file); // `files` is the key for multiple files
              });
            }


            const jsonData = {
              paidamount: Number(data?.totalbillamount),
              balanceamount: 0,
              paidmode: vendor.modeofpayments,
              paidstatus: "Paid",
              sortdate: new Date(),
              billstatus: "Completed",


              bankname:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.bankname)
                  : "",
              bankbranchname:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.bankbranchname)
                  : "",
              accountholdername:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.accountholdername)
                  : "",
              accountnumber:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.accountnumber)
                  : "",
              ifsccode:
                vendor.modeofpayments === "Bank Transfer"
                  ? String(vendor.ifsccode)
                  : "",

              upinumber:
                vendor.modeofpayments === "UPI" ? String(vendor.upinumber) : "",

              cardnumber:
                vendor.modeofpayments === "Card" ? String(vendor.cardnumber) : "",
              cardholdername:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardholdername)
                  : "",
              cardtransactionnumber:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardtransactionnumber)
                  : "",
              cardtype:
                vendor.modeofpayments === "Card" ? String(vendor.cardtype) : "",
              cardmonth:
                vendor.modeofpayments === "Card" ? String(vendor.cardmonth) : "",
              cardyear:
                vendor.modeofpayments === "Card" ? String(vendor.cardyear) : "",
              cardsecuritycode:
                vendor.modeofpayments === "Card"
                  ? String(vendor.cardsecuritycode)
                  : "",

              chequenumber:
                vendor.modeofpayments === "Cheque"
                  ? String(vendor.chequenumber)
                  : "",

              cash: vendor.modeofpayments === "Cash" ? String("Cash") : "",


              paymentduereminderlog: [
                ...(data?.paymentduereminderlog?.length > 0 ? data?.paymentduereminderlog : []),
                {
                  balanceamount: 0,
                  expensetotal: data?.expensetotal,
                  modeofpayments: vendor.modeofpayments,
                  // attachments: refImage?.length > 0 ? refImage[0]?.preview : "",
                  // filetype: refImage?.length > 0 ? refImage[0]?.type : "",
                  // payamountdate: vendor.payamountdate,
                  payamountdate: moment(`${vendor.payamountdate} ${vendor.payamounttime}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm"),

                  description: vendor.description || "",
                  payamount: vendor.payamount,
                  refno: vendor.refno,
                  bankname: vendor.modeofpayments === "Bank Transfer"
                    ? String(vendor.bankname)
                    : "",
                  bankbranchname: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.bankbranchname
                    : "",
                  accountholdername: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.accountholdername
                    : "",
                  accountnumber: vendor.modeofpayments === "Bank Transfer"
                    ? vendor.accountnumber
                    : "",
                  ifsccode: vendor.modeofpayments === "Bank Transfer" ? vendor.ifsccode : "",

                  upinumber: vendor.modeofpayments === "UPI" ? vendor.upinumber : "",

                  cardnumber: vendor.modeofpayments === "Card" ? vendor.cardnumber : "",
                  cardholdername: vendor.modeofpayments === "Card"
                    ? vendor.cardholdername
                    : "",
                  cardtransactionnumber: vendor.modeofpayments === "Card"
                    ? vendor.cardtransactionnumber
                    : "",
                  cardtype: vendor.modeofpayments === "Card" ? vendor.cardtype : "",
                  cardmonth: vendor.modeofpayments === "Card" ? vendor.cardmonth : "",
                  cardyear: vendor.modeofpayments === "Card" ? vendor.cardyear : "",
                  cardsecuritycode: vendor.modeofpayments === "Card"
                    ? vendor.cardsecuritycode
                    : "",
                  chequenumber: vendor.modeofpayments === "Cheque"
                    ? vendor.chequenumber
                    : "",
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.companyname),
                      date: String(new Date()),
                    },
                  ],

                }]
            }
            formData.append("jsonData", JSON.stringify(jsonData));
            await axios.put(
              `${SERVICE.UPDATE_STOCK_DETAILS}/${data?._id}/${source}`, formData,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

              }
            );
          })
        );
      }




      handleCloseview();
      await sendRequest();
      setPopupContent("Paid Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setPayNowSubmitLoader(false)
    } catch (err) {
      setPayNowSubmitLoader(false)
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const deleteTodo = (index) => {
    setmodeofpay(
      modeofpay.filter((data) => {
        return data !== index;
      })
    );
    switch (index) {
      case "Bank Transfer":
        setVendor({
          ...vendor,
          bankname: "Please Select Bank Name",
          bankbranchname: "",
          accountholdername: "",
          accountnumber: "",
          ifsccode: "",
        });
        break;
      case "UPI":
        setVendor({ ...vendor, upinumber: "" });
        break;
      case "Cheque":
        setVendor({ ...vendor, chequenumber: "" });
        break;
      case "Card":
        setVendor({
          ...vendor,
          cardnumber: "",
          cardholdername: "",
          cardtransactionnumber: "",
          cardtype: "Please Select Card Type",
          cardmonth: "Month",
          cardyear: "Year",
          cardsecuritycode: "",
        });
        break;
    }
  };

  const handlemodeofpay = () => {
    if (modeofpay.includes(vendor.modeofpayments === "Please Select Mode of Payments")) {
      setPopupContentMalert("Please Select Mode of Payments");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (modeofpay.includes(vendor.modeofpayments)) {
      setPopupContentMalert("ToDo is Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      if (vendor.modeofpayments === "Bank Transfer" && vendorDetails?.modeofpayments?.includes("Bank Transfer")) {
        setVendor((prev) => ({
          ...prev,
          bankname: vendorDetails?.bankname || "",
          bankbranchname: vendorDetails?.bankbranchname || "",
          accountholdername: vendorDetails?.accountholdername || "",
          accountnumber: vendorDetails?.accountnumber || "",
          ifsccode: vendorDetails?.ifsccode || "",
        }))
      } else if (vendor.modeofpayments === "UPI" && vendorDetails?.modeofpayments?.includes("UPI")) {
        setVendor((prev) => ({
          ...prev,
          upinumber: vendorDetails?.upinumber || ""
        }))
      }
      else if (vendor.modeofpayments === "Card" && vendorDetails?.modeofpayments?.includes("Card")) {
        setVendor((prev) => ({
          ...prev,
          cardnumber: vendorDetails?.cardnumber || "",
          cardholdername: vendorDetails?.cardholdername || "",
          cardtransactionnumber: vendorDetails?.cardtransactionnumber || "",
          cardtype: vendorDetails?.cardtype || "",
          cardmonth: vendorDetails?.cardmonth || "",
          cardyear: vendorDetails?.cardyear || "",
          cardsecuritycode: vendorDetails?.cardsecuritycode || "",
        }))
      }
      else if (vendor.modeofpayments === "Cheque" && vendorDetails?.modeofpayments?.includes("Cheque")) {
        setVendor((prev) => ({
          ...prev,
          chequenumber: vendorDetails?.chequenumber || "",
        }))
      }
      setmodeofpay([vendor.modeofpayments]);
    }
  };


  //bank name options
  const accounttypes = [
    { value: "ALLAHABAD BANK", label: "ALLAHABAD BANK" },
    { value: "ANDHRA BANK", label: "ANDHRA BANK" },
    { value: "AXIS BANK", label: "AXIS BANK" },
    { value: "STATE BANK OF INDIA", label: "STATE BANK OF INDIA" },
    { value: "BANK OF BARODA", label: "BANK OF BARODA" },
    { value: "CITY UNION BANK", label: "CITY UNION BANK" },
    { value: "UCO BANK", label: "UCO BANK" },
    { value: "UNION BANK OF INDIA", label: "UNION BANK OF INDIA" },
    { value: "BANK OF INDIA", label: "BANK OF INDIA" },
    { value: "BANDHAN BANK LIMITED", label: "BANDHAN BANK LIMITED" },
    { value: "CANARA BANK", label: "CANARA BANK" },
    { value: "GRAMIN VIKASH BANK", label: "GRAMIN VIKASH BANK" },
    { value: "CORPORATION BANK", label: "CORPORATION BANK" },
    { value: "INDIAN BANK", label: "INDIAN BANK" },
    { value: "INDIAN OVERSEAS BANK", label: "INDIAN OVERSEAS BANK" },
    { value: "ORIENTAL BANK OF COMMERCE", label: "ORIENTAL BANK OF COMMERCE" },
    { value: "PUNJAB AND SIND BANK", label: "PUNJAB AND SIND BANK" },
    { value: "PUNJAB NATIONAL BANK", label: "PUNJAB NATIONAL BANK" },
    { value: "RESERVE BANK OF INDIA", label: "RESERVE BANK OF INDIA" },
    { value: "SOUTH INDIAN BANK", label: "SOUTH INDIAN BANK" },
    { value: "UNITED BANK OF INDIA", label: "UNITED BANK OF INDIA" },
    { value: "CENTRAL BANK OF INDIA", label: "CENTRAL BANK OF INDIA" },
    { value: "VIJAYA BANK", label: "VIJAYA BANK" },
    { value: "DENA BANK", label: "DENA BANK" },
    {
      value: "BHARATIYA MAHILA BANK LIMITED",
      label: "BHARATIYA MAHILA BANK LIMITED",
    },
    { value: "FEDERAL BANK LTD", label: "FEDERAL BANK LTD" },
    { value: "HDFC BANK LTD", label: "HDFC BANK LTD" },
    { value: "ICICI BANK LTD", label: "ICICI BANK LTD" },
    { value: "IDBI BANK LTD", label: "IDBI BANK LTD" },
    { value: "PAYTM BANK", label: "PAYTM BANK" },
    { value: "FINO PAYMENT BANK", label: "FINO PAYMENT BANK" },
    { value: "INDUSIND BANK LTD", label: "INDUSIND BANK LTD" },
    { value: "KARNATAKA BANK LTD", label: "KARNATAKA BANK LTD" },
    { value: "KOTAK MAHINDRA BANK", label: "KOTAK MAHINDRA BANK" },
    { value: "YES BANK LTD", label: "YES BANK LTD" },
    { value: "SYNDICATE BANK", label: "SYNDICATE BANK" },
    { value: "BANK OF MAHARASHTRA", label: "BANK OF MAHARASHTRA" },
    { value: "DCB BANK", label: "DCB BANK" },
    { value: "IDFC BANK", label: "IDFC BANK" },
    {
      value: "JAMMU AND KASHMIR BANK BANK",
      label: "JAMMU AND KASHMIR BANK BANK",
    },
    { value: "KARUR VYSYA BANK", label: "KARUR VYSYA BANK" },
    { value: "RBL BANK", label: "RBL BANK" },
    { value: "TMB BANK", label: "TMB BANK" },
    { value: "DHANLAXMI BANK", label: "DHANLAXMI BANK" },
    { value: "CSB BANK", label: "CSB BANK" },
  ];
  const modeofpayments = [
    { value: "Cash", label: "Cash" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "UPI", label: "UPI" },
    { value: "Card", label: "Card" },
    { value: "Cheque", label: "Cheque" },
  ];

  const cardtypes = [
    { value: "Credit Card", label: "Credit Card" },
    { value: "Debit Card", label: "Debit Card" },
    { value: "Visa Card", label: "Visa Card" },
    { value: "Master Card", label: "Master Card" },
  ];

  const customValueRendererFrequency = (valueCompanyCat, placeholder) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : `Please Select Frequency`;
  };


  const daysoptions = [
    { label: "Yesterday", value: "Yesterday" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Custom Month", value: "Custom Month" },
    { label: "Custom Fields", value: "Custom Fields" },
  ]

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [filterUser, setFilterUser] = useState({
    frequency: [],
    day: "Today",
    fromtime: '00:00',
    totime: '23:59',
    fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD')
  });

  const handleChangeFilterDate = (e) => {
    let fromDate = '';
    let toDate = moment().format('YYYY-MM-DD');
    switch (e.value) {
      case 'Today':
        setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
        break;
      case 'Yesterday':
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        toDate = fromDate; // Yesterday’s date
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Week':
        fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Week':
        fromDate = moment().startOf('week').format('YYYY-MM-DD');
        toDate = moment().endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Month':
        fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Month':
        fromDate = moment().startOf('month').format('YYYY-MM-DD');
        toDate = moment().endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Custom Fields':
        setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
        break;
      default:
        return;
    }
  }
  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };
  return (
    <Box>
      <Headtitle title={"ALL REMAINDER"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="All Remainder List"
        modulename="Expenses"
        submodulename="Remainder"
        mainpagename="All Remainder"
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("lallremainder") && (
          <>
            <Box sx={userStyle.selectcontainer}>
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Frequency<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={[
                          { label: "Daily", value: "Daily" },
                          { label: "Monthly", value: "Monthly" },
                          { label: "BillWise", value: "BillWise" },
                          { label: "Weekly", value: "Weekly" },
                        ]}
                        value={filterUser?.frequency}
                        onChange={(e) => {

                          setFilterUser((prev) => ({
                            ...prev,
                            frequency: e,
                          }))
                        }}
                        valueRenderer={customValueRendererFrequency}
                        labelledBy="Please Select Frequency"
                      />

                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Company
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <MultiSelect
                        options={[
                          ...accessbranch?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          })),
                          isUserRoleCompare?.includes(
                            "lassignexpenseothers"
                          ) && {
                            label: "Others",
                            value: "Others",
                          },
                        ]
                          ?.filter(Boolean) // Filter out falsy values, including `undefined`
                          ?.filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsCompany}
                        onChange={(e) => {
                          handleCompanyChange(e);
                        }}
                        valueRenderer={customValueRendererCompany}
                        labelledBy="Please Select Company"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Branch</Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) =>
                            valueCompanyCat?.includes(comp.company)
                          )
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsBranch}
                        onChange={(e) => {
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                        disabled={valueCompanyCat?.includes("Others")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={{ fontWeight: "500" }}>
                        Date Mode
                      </Typography>
                      <Selects
                        options={daysoptions}
                        // styles={colourStyles}
                        value={{ label: filterUser.day ? filterUser.day : "Please Select Days", value: filterUser.day ? filterUser.day : "Please Select Days" }}
                        onChange={(e) => {
                          handleChangeFilterDate(e);
                          setFilterUser((prev) => ({ ...prev, day: e.value }))
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {filterUser.day !== "" && filterUser.day !== "Custom Month" && <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          From Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="from-date"
                          type="date"
                          disabled={filterUser.day !== "Custom Fields"}
                          value={filterUser.fromdate}
                          onChange={(e) => {
                            const newFromDate = e.target.value;
                            setFilterUser((prevState) => ({
                              ...prevState,
                              fromdate: newFromDate,
                              todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          To Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="to-date"
                          type="date"
                          value={filterUser.todate}
                          disabled={filterUser.day !== "Custom Fields"}
                          onChange={(e) => {
                            const selectedToDate = new Date(e.target.value);
                            const selectedFromDate = new Date(filterUser.fromdate);

                            if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                              setFilterUser({
                                ...filterUser,
                                todate: e.target.value
                              });
                            } else {
                              setFilterUser({
                                ...filterUser,
                                todate: "" // Reset to empty string if the condition fails
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>}
                  {filterUser.day === "Custom Month" && <>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography sx={{ fontWeight: "500" }}>
                          Year
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={yearsOption}
                          placeholder="Mins"
                          styles={colourStyles}
                          value={{
                            label: periodState.year,
                            value: periodState.year,
                          }}
                          onChange={(e) => {
                            setPeriodState({
                              ...periodState,
                              year: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography sx={{ fontWeight: "500" }}>
                          Month
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={monthsOption}
                          placeholder="Months"
                          styles={colourStyles}
                          value={{
                            label: periodState.monthlabel,
                            value: periodState.month,
                          }}
                          onChange={(e) => {
                            setPeriodState({
                              ...periodState,
                              month: e.value,
                              monthlabel: e.label,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>}
                  {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={frequencyOpt}
                        placeholder="Please Select Company"
                        styles={colourStyles}
                        value={{ label: frequencyValue, value: frequencyValue }}
                        onChange={(e) => {
                          setFrequencyValue(e.value);
                          setDailyDate(moment().format("YYYY-MM-DD"));
                          setWeeklyDate("");
                          setPeriodState({
                            year: currentYear.toString(),
                            month: currentMonth,
                            monthlabel: month[date.getMonth()],
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  &ensp;
                  {frequencyValue === "Daily" && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="from-date"
                          type="date"
                          value={dailyDate}
                          onChange={(e) => {
                            e.target.value === ""
                              ? setDailyDate(moment().format("YYYY-MM-DD"))
                              : setDailyDate(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                  {frequencyValue === "Weekly" && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="from-date"
                          type="date"
                          value={weeklyDate}
                          onChange={(e) => {
                            if (new Date(e.target.value).getDay() === 1) {
                              setWeeklyDate(e.target.value);
                            } else if (e.target.value === "") {
                              setWeeklyDate("");
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                  {frequencyValue === "Monthly" && (
                    <>
                      <Grid item md={1.5} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={yearsOption}
                            placeholder="Mins"
                            styles={colourStyles}
                            value={{
                              label: periodState.year,
                              value: periodState.year,
                            }}
                            onChange={(e) => {
                              setPeriodState({
                                ...periodState,
                                year: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={1.5} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={monthsOption}
                            placeholder="MOnths"
                            styles={colourStyles}
                            value={{
                              label: periodState.monthlabel,
                              value: periodState.month,
                            }}
                            onChange={(e) => {
                              setPeriodState({
                                ...periodState,
                                month: e.value,
                                monthlabel: e.label,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )} */}

                </>
              </Grid>
              <br />
              <br />
              <br />
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleFilterClick}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={() => {
                      setPeriodState({
                        year: currentYear.toString(),
                        month: currentMonth,
                        monthlabel: month[date.getMonth()],
                      });
                      setValueCompanyCat([]);
                      setSelectedOptionsCompany([]);
                      setValueBranchCat([]);
                      setSelectedOptionsBranch([]);
                      setFilterUser({
                        frequency: [],
                        day: "Today",
                        fromtime: '00:00',
                        totime: '23:59',
                        fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD')
                      });
                    }}
                  >
                    {" "}
                    Clear{" "}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
        <br />
        {isUserRoleCompare?.includes("lallremainder") && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>
                    List All Remainder
                  </Typography>
                </Grid>
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
                <Grid>
                  {isUserRoleCompare?.includes("excelallremainder") && (
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
                  {isUserRoleCompare?.includes("csvallremainder") && (
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
                  {isUserRoleCompare?.includes("printallremainder") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfallremainder") && (
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
                  {isUserRoleCompare?.includes("imageallremainder") && (
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
              </Grid>
              {/* ****** Table Grid Container ****** */}
              <Grid style={userStyle.dataTablestyle}>
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
                    <MenuItem value={documentsList?.length}>All</MenuItem>
                  </Select>
                </Box>
                <Box>
                  <FormControl fullWidth size="small">
                    <AggregatedSearchBar
                      columnDataTable={columnDataTable}
                      setItems={setItems}
                      addSerialNumber={addSerialNumber}
                      setPage={setPage}
                      maindatas={documentsList}
                      setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={documentsList}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={() =>
                        setColumnVisibility(initialColumnVisibility)
                      }
                    >
                      Show All Columns
                    </Button>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleOpenManageColumns}
                    >
                      Manage Columns
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <br />
              {/* ****** Table start ****** */}
              {loading ? (
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
                <AggridTable
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
                  gridRefTable={gridRefTable}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  // totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={documentsList}
                />
              )}
              {/* ****** Table End ****** */}
            </Box>

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
          </>
        )}
      </>
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
              All Remainder Info
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
              <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      <br />
      <br />
      {/* view model */}
      <Dialog
        open={openView}
        onClose={handlViewClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "500px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View All Remainder
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee Code</Typography>
                  <Typography>{singleDoc.empcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{singleDoc.companyname}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlViewClose}
                sx={buttonStyles.btncancel}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
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
            <Typography variant="h6">{showAlert}</Typography>
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
              sx={buttonStyles.buttonsubmit}
            >
              {" "}
              ok{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{ marginTop: "50px" }}

      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Pay Now
            </Typography>
            <Grid container spacing={4}>
              <Grid item md={5} xs={12} sm={12}>
                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography variant="h6">Tota Bill Amount:</Typography>
                  &nbsp;
                  <Typography variant="h6">{payNowData?.totalbillamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3.5} xs={12} sm={12}>
                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography variant="h6">Due Amount:</Typography>  &nbsp;
                  <Typography variant="h6">{payNowData?.totalbillamount - payNowData?.paidamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3.5} xs={12} sm={12}>
                <FormControl fullWidth size="small" sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography variant="h6">Paid Amount:</Typography>
                  <Typography variant="h6">{payNowData?.paidamount}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={4}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Enter Amount <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.payamount}
                    placeholder="Please Enter Amount"
                    onChange={(e) => {
                      // Allow only numeric values
                      let numericValue = e.target.value.replace(/[^0-9]/g, '');
                      let totalAmount = payNowData?.totalbillamount - payNowData?.paidamount
                      // Prevent leading zero (do not allow "0" as the first digit)
                      if (numericValue.startsWith('0')) {
                        numericValue = numericValue.replace(/^0+/, '');
                      }

                      // Ensure entered value does not exceed payNowData?.amount
                      if (numericValue === '' || Number(numericValue) <= Number(totalAmount)) {
                        setVendor({ ...vendor, payamount: numericValue });
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    value={vendor.payamountdate}
                    onChange={(e) => {
                      setVendor({ ...vendor, payamountdate: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Time <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="time"
                    placeholder="HH:MM:AM/PM"
                    value={vendor.payamounttime}
                    onChange={(e) => {
                      setVendor({ ...vendor, payamounttime: e.target.value });
                    }}
                  />


                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Ref No <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.refno}
                    placeholder="Please Enter Reference Number"
                    onChange={(e) => {
                      setVendor({ ...vendor, refno: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Description
                  </Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={2.5}
                    value={vendor.description}
                    onChange={(e) => {
                      setVendor({ ...vendor, description: e.target.value });
                    }}
                  />


                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>Attachments</Typography>
                <Box sx={{ display: "flex", justifyContent: "left" }}>
                  <Button
                    variant="contained"
                    onClick={handleClickUploadPopupOpen}
                  >
                    Upload
                  </Button>
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                {isWebcamCapture == true && capturedImages?.length > 0 &&
                  capturedImages?.map((file, index) => (
                    <Grid
                      container
                      key={index}
                      alignItems="center"
                      spacing={2}
                      sx={{
                        padding: "8px 0",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {/* File Icon */}
                      <Grid item md={1} sm={2} xs={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {file.type.includes("image/") ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              height={40}
                              style={{
                                maxWidth: "100%",
                              }}
                            />
                          ) : (
                            <img
                              className={classes.preview}
                              src={getFileIcon(file.name)}
                              height={40}
                              alt="file icon"
                            />
                          )}
                        </Box>
                      </Grid>

                      {/* File Name */}
                      <Grid item md={3} sm={3} xs={3}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </Typography>
                      </Grid>

                      {/* Remarks Input */}
                      <Grid item md={4} sm={4} xs={4}>
                        <TextField
                          variant="outlined"
                          size="small"
                          placeholder="Enter remarks"
                          value={file?.remarks || ""}
                          onChange={(e) => handleRemarkChangeWebCam(e.target.value, index)}
                          fullWidth
                        />
                      </Grid>

                      {/* View and Delete Icons */}
                      <Grid
                        item
                        md={4}
                        sm={3}
                        xs={3}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Button
                          sx={{
                            padding: "6px",
                            minWidth: "36px",
                            borderRadius: "50%",
                            ":hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }}
                          onClick={() => renderFilePreview(file)}
                        >
                          <VisibilityOutlinedIcon
                            style={{ fontSize: "18px", color: "#357AE8" }}
                          />
                        </Button>
                        <Button
                          sx={{
                            padding: "6px",
                            minWidth: "36px",
                            borderRadius: "50%",
                            ":hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }}
                          onClick={() => removeCapturedImage(index)}
                        >
                          <FaTrash
                            style={{ fontSize: "18px", color: "#a73131" }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                {refImage?.length > 0 && refImage?.map((data, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : ( */}
                        <img
                          className={classes.preview}
                          src={getFileIcon(data.file.name)}
                          height="10"
                          alt="file icon"
                        />
                        {/* )} */}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={7}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2"> {data.file.name} </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={1}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(data.file)}
                        >
                          <VisibilityOutlinedIcon
                            style={{ fontsize: "12px", color: "#357AE8" }}
                          />
                        </Button>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => handleDeleteFile(index)}
                        >
                          <FaTrash
                            style={{ color: "#a73131", fontSize: "12px" }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}



                {refImageDrag?.length > 0 && refImageDrag?.map((file, index) => (
                  <Grid
                    container
                    key={index}
                    alignItems="center"
                    spacing={2}
                    sx={{
                      padding: "8px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {/* File Icon */}
                    <Grid item md={1} sm={2} xs={2}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {file.type.includes("image/") ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            height={40}
                            style={{
                              maxWidth: "100%",
                            }}
                          />
                        ) : (
                          <img
                            className={classes.preview}
                            src={getFileIcon(file.name)}
                            height={40}
                            alt="file icon"
                          />
                        )}
                      </Box>
                    </Grid>

                    {/* File Name */}
                    <Grid item md={3} sm={3} xs={3}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Grid>

                    {/* Remarks Input */}
                    <Grid item md={4} sm={4} xs={4}>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Enter remarks"
                        value={file?.remarks || ""}
                        onChange={(e) => handleRemarkChangeDragDrop(e.target.value, index)}
                        fullWidth
                      />
                    </Grid>

                    {/* View and Delete Icons */}
                    <Grid
                      item
                      md={4}
                      sm={3}
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button
                        sx={{
                          padding: "6px",
                          minWidth: "36px",
                          borderRadius: "50%",
                          ":hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontSize: "18px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "6px",
                          minWidth: "36px",
                          borderRadius: "50%",
                          ":hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <FaTrash
                          style={{ fontSize: "18px", color: "#a73131" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode of Payments<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={vendorDetails?.modeofpayments?.length > 0 ? vendorDetails?.modeofpayments?.map(data => ({
                      label: data,
                      value: data,
                    })) : modeofpayments}
                    placeholder="Please Choose Mode Of Payments"
                    value={{
                      label: vendor.modeofpayments,
                      value: vendor.modeofpayments,
                    }}
                    onChange={(e) => {
                      setVendor({ ...vendor, modeofpayments: e.value });
                      setmodeofpay([]);
                    }}
                  />
                </FormControl>
                &emsp;
                <Button
                  variant="contained"
                  color="success"
                  onClick={handlemodeofpay}
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
              {modeofpay.includes("Cash") && (
                <>
                  <br />
                  {/* <Grid container spacing={2}> */}
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cash <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        readOnly={true}
                        value={"Cash"}
                        onChange={(e) => { }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("Cash")}
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
                  {/* </Grid> */}
                </>
              )}
              <br />
              <br />
              {modeofpay.includes("Bank Transfer") && (
                <>
                  {/* <Grid container spacing={2}> */}
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Bank Details
                    </Typography>
                  </Grid>
                  {/* </Grid> */}
                  <br />
                  {/* <Grid container spacing={2}> */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Bank Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={accounttypes}
                        placeholder="Please Choose Bank Name"
                        value={{
                          label: vendor.bankname,
                          value: vendor.bankname,
                        }}
                        onChange={(e) => {
                          setVendor({ ...vendor, bankname: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Bank Branch Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.bankbranchname}
                        placeholder="Please Enter Bank Branch Name"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              bankbranchname: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Account Holder Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.accountholdername}
                        placeholder="Please Enter Account Holder Name"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              accountholdername: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Account Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        value={vendor.accountnumber}
                        placeholder="Please Enter Account Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              accountnumber: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        IFSC Code<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.ifsccode}
                        placeholder="Please Enter IFSC Code"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({ ...vendor, ifsccode: inputvalue });
                          }
                        }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("Bank Transfer")}
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
                  {/* </Grid> */}
                </>
              )}
              <br /> <br />
              {modeofpay.includes("UPI") && (
                <>
                  {/* <Grid container spacing={2}> */}
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      UPI Details
                    </Typography>
                  </Grid>
                  {/* </Grid> */}
                  <br />
                  {/* <Grid container spacing={2}> */}
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        UPI Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        value={vendor.upinumber}
                        placeholder="Please Enter UPI Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({ ...vendor, upinumber: inputvalue });
                          }
                        }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("UPI")}
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
                  {/* </Grid> */}
                </>
              )}
              <br /> <br />
              {modeofpay.includes("Card") && (
                <>
                  {/* <Grid container spacing={2}> */}
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Card Details
                    </Typography>
                  </Grid>
                  {/* </Grid> */}
                  <br />
                  {/* <Grid container spacing={2}> */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Card Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        value={vendor.cardnumber}
                        placeholder="Please Enter Card Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({ ...vendor, cardnumber: inputvalue });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Card Holder Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.cardholdername}
                        placeholder="Please Enter Card Holder Name"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              cardholdername: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Card Transaction Number
                        <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.cardtransactionnumber}
                        placeholder="Please Enter Card Transaction Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              cardtransactionnumber: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Card Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={cardtypes}
                        placeholder="Please Select Card Type"
                        value={{
                          label: vendor.cardtype,
                          value: vendor.cardtype,
                        }}
                        onChange={(e) => {
                          setVendor({ ...vendor, cardtype: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <Typography>
                      Expire At<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item md={6} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={monthsOption}
                            placeholder="Month"
                            id="select7"
                            value={{
                              label: vendor.cardmonth,
                              value: vendor.cardmonth,
                            }}
                            onChange={(e) => {
                              setVendor({ ...vendor, cardmonth: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={yearsOption}
                            placeholder="Year"
                            value={{
                              label: vendor.cardyear,
                              value: vendor.cardyear,
                            }}
                            id="select8"
                            onChange={(e) => {
                              setVendor({ ...vendor, cardyear: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Security Code<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={vendor.cardsecuritycode}
                        sx={userStyle.input}
                        placeholder="Please Enter Security Code"
                        onChange={(e) => {
                          setVendor({
                            ...vendor,
                            cardsecuritycode: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("Card")}
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                    {/* </Grid> */}
                  </Grid>
                </>
              )}
              <br />
              {modeofpay.includes("Cheque") && (
                <>
                  {/* <Grid container spacing={2}> */}
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Cheque Details
                    </Typography>
                  </Grid>
                  {/* </Grid> */}
                  <br />
                  {/* <Grid container spacing={2}> */}
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Cheque Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        value={vendor.chequenumber}
                        placeholder="Please Enter Cheque Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              chequenumber: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("Cheque")}
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
                  {/* </Grid> */}
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item md={3} sm={3} xs={12}>
                <LoadingButton
                  onClick={handleSubmit}
                  // disabled={isBtn}
                  sx={buttonStyles.buttonsubmit}
                  loading={payNowSubmitLoader}
                  variant="contained"
                >
                  Submit
                </LoadingButton>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <Button sx={buttonStyles.btncancel}
                  onClick={handleCloseview}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      <Dialog
        open={openviewalertvendor}
        onClose={handleClickOpenviewalertvendor}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <AddExpensePopup
          setVendorAuto={setVendorAuto}
          handleCloseviewalertvendor={handleCloseviewalertvendor}
          expenseCatePop={expenseCatePop}
          expenseSubCatePop={expenseSubCatePop}
          expenseDatePop={expenseDatePop}
          reminderId={reminderId}
        />
      </Dialog>

      <Dialog
        open={openviewalertExpEdit}
        onClose={handleClickOpenviewalertExp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <EditExpensePopup
          setExpenseEditAuto={setExpenseEditAuto}
          handleCloseviewalertExp={handleCloseviewalertExp}
          expenseEditId={expenseEditId}
        />
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={documentsList ?? []}
        filename={"AllRemainder"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />


      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />


      {/* UPLOAD IMAGE DIALOG */}
      <Dialog
        open={uploadPopupOpen}

        onClose={handleUploadPopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "95px" }}
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Attachments
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 1MB
              </Typography>
              <div onDragOver={handleDragOver} onDrop={handleDrop}>
                {previewURL && refImageDrag.length > 0 ? (
                  <>
                    {refImageDrag.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button
                          onClick={() => handleRemoveFile(index)}
                          style={{ marginTop: "0px", color: "red" }}
                        >
                          X
                        </Button>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon /> Drag and drop
                    </div>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      // accept="image/*"
                      hidden
                      onChange={handleInputChange}
                    />
                  </Button>
                  {/* &ensp;
                  <Button
                    variant="contained"
                    onClick={showWebcam}
                    sx={userStyle.uploadbtn}
                  >
                    Webcam
                  </Button> */}
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true &&
                capturedImages.map((image, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={12}>
                      <Box
                        style={{
                          isplay: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "37px",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          height={50}
                          style={{ maxWidth: "-webkit-fill-available" }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {" "}
                        {image.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={12}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(image)}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "12px",
                              color: "#357AE8",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036",
                            },
                          }}
                          onClick={() => removeCapturedImage(index)}
                        >
                          <FaTrash
                            style={{
                              color: "#a73131",
                              fontSize: "12px",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              {refImage?.length > 0 && refImage?.map((data, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : ( */}
                      <img
                        className={classes.preview}
                        src={getFileIcon(data.file.name)}
                        height="10"
                        alt="file icon"
                      />
                      {/* )} */}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {data.file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreview(data.file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpen}
        onClose={webcamClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name="create"
            getImg={getImg}
            setGetImg={setGetImg}
            valNum={valNum}
            setValNum={setValNum}
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            setRefImage={setRefImage}
            setRefImageDrag={setRefImageDrag}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStore}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamClose}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
export default AllReminder;