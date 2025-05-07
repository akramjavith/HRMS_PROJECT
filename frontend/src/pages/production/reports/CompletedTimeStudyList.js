import React, { useState, useEffect, useRef, useCallback, useContext, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, OutlinedInput, TextareaAutosize, TableBody, TableRow, Chip, TableCell, Select, Paper, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import axios from "axios";
import Selects from "react-select";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import ImageIcon from "@mui/icons-material/Image";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from "dom-to-image";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import Webcamimage from "../../asset/Webcameimageasset";
// import ExportData from "../../../components/ExportData";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LoadingButton from "@mui/lab/LoadingButton";
import { AgGridReact } from "ag-grid-react";

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

// Assuming this is your main component and you're using forwardRef
const CompletedManualEntryTimeStudyList = forwardRef(({ selectedProject, selectedVendor, selectedOptionsCategory, selectedOptionsSubCategory, selectedOptionsLoginid, loginAllotFilter, overallState }, ref) => {
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
  const [projmaster, setProjmaster] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [loading, setLoading] = useState(false);

  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

  //    today date fetching
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  // today = yyyy + "-" + mm + "-" + dd;
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  let exportColumnNames = ["Vendor", "From Date", "Date", "Time", "Category", "SubCategory", "Identifier", "Login Id", "Section", "Flag Count", "Doc Number", "Doc Link", "Start Date Mode", "Start Date", "Start Time", "Status Mode", "Total Pages", "Pending Pages", "Start Page", "Remarks/Notes"];
  let exportRowValues = ["vendor", "datemode", "fromdate", "time", "filename", "category", "unitid", "user", "section", "flagcount", "docnumber", "doclink", "startmode", "startdate", "starttime", "statusmode", "totalpages", "pendingpages", "startpage", "notes"];

  let nameedit = "edit";
  const classes = useStyles();
  const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);
  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const gridRef = useRef(null);

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
    setloadingdeloverall(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const statuschange = [
    { label: "Completed", value: "Completed" },
    { label: "In Complete", value: "In Complete" },
    { label: "Partial Complete", value: "Partial Complete" },
    { label: "Started", value: "Started" },
    { label: "Stop", value: "Stop" },
    { label: "Pause", value: "Pause" },
    { label: "Reject", value: "Reject" },
    { label: "Cancel", value: "Cancel" },
  ];

  // Calculate the date two months ago
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  const ddPast = String(twoMonthsAgo.getDate()).padStart(2, "0");
  const mmPast = String(twoMonthsAgo.getMonth() + 1).padStart(2, "0");
  const yyyyPast = twoMonthsAgo.getFullYear();
  const formattedTwoMonthsAgo = `${yyyyPast}-${mmPast}-${ddPast}`;

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const minDate = new Date(formattedTwoMonthsAgo);
    const maxDate = new Date(formattedToday);

    if (ProducionIndividual.datemode === "Manual") {
      if (selectedDate >= minDate && selectedDate <= maxDate) {
        setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
      } else {
        setPopupContent("Please select a date within the past two months and not in the future");
        setPopupSeverity("warning");
        handleClickOpenPopup();
      }
    } else {
      setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
    }
  };

  const handleDateChangeEdit = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date(); // Current date and time

    // Ensure only date comparison without time
    const fromDate = new Date(ProducionIndividualChange.startdate || currentDate);
    fromDate.setHours(0, 0, 0, 0); // Reset time portion to midnight
    selectedDate.setHours(0, 0, 0, 0); // Reset time portion to midnight
    currentDate.setHours(0, 0, 0, 0); // Reset time portion to midnight

    if (ProducionIndividualChange.enddatemode === "Manual") {
      if (selectedDate < fromDate) {
        // setPopupContent("End Date should be after or equal to Start Date!");
        // setPopupSeverity("warning");
        // handleClickOpenPopup();

        setPopupContentMalert("End Date should be after or equal to Start Date !");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
        setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: "", time: "" });
      } else if (selectedDate >= fromDate) {
        setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: e.target.value, time: "" });
      } else {
        // setPopupContent("End Date cannot be in the past!");
        // setPopupSeverity("warning");
        // handleClickOpenPopup();

        setPopupContentMalert("End Date cannot be in the past!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      }
    } else {
      setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: e.target.value });
    }
  };

  let now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  let currtime = `${hours}:${minutes}`;

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [ProducionIndividual, setProducionIndividual] = useState({
    vendor: "Please Select Vendor",
    fromdate: formattedToday,
    time: currtime,
    datemode: "Auto",
    datetimezone: "",
    category: "Please Select Subcategory",
    filename: "Please Select Category",
    unitid: "",
    alllogin: "Please Select AllLogin",
    user: "Please Select Loginid",
    mode: "",
    docnumber: "",
    doclink: "",
    statusmode: "Please Select Status",
    flagcount: 0,
    section: "1",
    addedby: "",
    updatedby: "",
    pendingpages: "",
    notes: "",
    totalpages: 0,
    completepages: 0,
    startpage: "Please Select Start Page",
    reason: "",
    startdate: formattedToday,
    starttime: currtime,
    startdatemode: "Auto",
  });

  const [ProducionIndividualChange, setProducionIndividualChange] = useState({
    vendor: "Please Select Vendor",
    fromdate: formattedToday,
    time: currtime,
    datemode: "Auto",
    datetimezone: "",
    category: "Please Select Subcategory",
    filename: "Please Select Category",
    unitid: "",
    alllogin: "Please Select AllLogin",
    user: "Please Select Loginid",
    mode: "",
    docnumber: "",
    doclink: "",
    statusmode: "Please Select Status",
    flagcount: "",
    section: "1",
    pendingpages: "",
    // addedby: "", updatedby: "",
    totalpages: "",
    completepages: "",
    startpage: "Please Select Start Page",
    reason: "",
    startdate: formattedToday,
    starttime: currtime,
    startdatemode: "Auto",
    enddatemode: "",
    notes: "",
    remarks: "",
  });

  const handleChangephonenumberflagChange = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      let difference = Number(ProducionIndividualChange.totalpages) - Number(inputValue);
      // Check if the input value exceeds totalpages
      const getstpage = Array.from({ length: inputValue - 0 }, (_, index) => {
        const startPageNumber = Number(inputValue) + index;
        return startPageNumber;
      });
      if (parseInt(inputValue) > parseInt(ProducionIndividualChange.totalpages)) {
        // alert("Completed pages cannot be greater than total pages.");

        setPopupContent("Completed pages cannot be greater than total pages");
        setPopupSeverity("warning");
        handleClickOpenPopup();
      } else {
        // Update the state with the valid numeric value
        setProducionIndividualChange({ ...ProducionIndividualChange, flagcount: inputValue, startpage: getstpage[0], pendingpages: difference });
      }
    }
  };

  const handleChangephonenumbertotalChange = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      let difference = Number(inputValue) - Number(0);
      const getstpage = Array.from({ length: inputValue - 0 }, (_, index) => {
        const startPageNumber = Number(0) + 1 + index;
        return startPageNumber;
      });
      setProducionIndividualChange({ ...ProducionIndividualChange, totalpages: inputValue, startpage: getstpage[0], flagcount: 0, pendingpages: difference });
    }
  };

  const [productionedit, setProductionEdit] = useState({
    vendor: "Please Select Vendor",
    fromdate: "",
    time: "",
    datemode: "",
    datetimezone: "",
    category: "Please Select Subcategory",
    filename: "Please Select Category",
    unitid: "",
    alllogin: "Please Select AllLogin",
    user: "Please Select Loginid",
    docnumber: "",
    doclink: "",
    flagcount: "",
    section: "",
  });
  const { isUserRoleCompare, isUserRoleAccess, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [canvasState, setCanvasState] = useState(false);

  const gridApi = useRef(null);
  const columnApi = useRef(null);
  let minRowHeight = 25;
  let currentRowHeight;
  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
    columnApi.current = params.columnApi;
    // minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
    // currentRowHeight = minRowHeight;
  }, []);

  let datemodes =
    isUserRoleCompare.includes("lproductionindividualusers") || isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("Director") || isUserRoleAccess.role.includes("Admin") || isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("ADMIN")
      ? [
        { label: "Auto", value: "Auto" },
        { label: "Manual", value: "Manual" },
      ]
      : [{ label: "Auto", value: "Auto" }];

  const [exportLoading, setExportLoading] = useState(false);

  const handleExportXL = async (isfilter) => {
    if (isfilter === "filtered") {
      // Define headers
      let headers = ["Vendor", "Date mODE", "Date", "Time", "Category", "SubCategory", "Identifier", "Login Id", "Section", "Flag Count", "Doc Number", "Doc Link", "Start Date Mode", "Start Date", "Start Time", "Status Mode", "Total Pages", "Pending Pages", "Start Page", "Remarks/Notes"];

      // Transform data
      const excelData = projmaster.map((entry) => [
        entry.vendor, // Category Name
        entry.datemode, // Subcategory
        entry.fromdate, // IP Address
        entry.time, // Type
        entry.filename, // IP Details
        entry.category, // Subnet
        entry.unitid, // Gateway
        entry.user, // DNS1
        entry.section, // DNS2
        entry.flagcount, // DNS3
        entry.docnumber, // DNS4
        entry.doclink, // DNS5
        entry.startmode, // Available
        entry.startdate, // Starting
        entry.starttime, // Ending
        entry.statusmode, // Ending
        entry.totalpages, // Ending
        entry.pendingpages, // Ending
        entry.startpage, // Ending
        entry.notes, // Ending
      ]);

      // Combine headers and data
      const finalData = [headers, ...excelData];

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(finalData);

      // Create workbook and export
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Save file
      XLSX.writeFile(wb, "TimeStudy.xlsx");
      setIsFilterOpen(false);
    } else if (isfilter === "overall") {
      let result = [];
      setExportLoading(true);

      let resultvendor = [];
      selectedProject
        .map((d) => d.value)
        .forEach((proj) => {
          selectedVendor
            .map((d) => d.value)
            .forEach((vend) => {
              resultvendor.push(`${proj}-${vend}`);
            });
        });
      let projvendor = [...new Set(resultvendor)];
      const isRoleManager = ["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((rl) => isUserRoleAccess.role.includes(rl));

      let response = await axios.post(
        SERVICE.PRODUCTION_MANUALSTUDY_EXCELDOWNLOAD,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          vendor: projvendor,
          filename: selectedOptionsCategory.map((item) => item.value),
          category: selectedOptionsSubCategory.map((item) => item.value),
          user: isRoleManager && selectedOptionsLoginid.length === 0 ? [] : selectedOptionsLoginid.map((item) => item.value) === 0 ? loginAllotFilter.map((item) => item.value) : selectedOptionsLoginid.map((item) => item.value),
          fromdate: overallState.fromdate,
          status: ["Completed"],
          // ✅ Ensure Axios returns a Blob
        },
        {
          responseType: "blob",
        }
      );
      console.log(response, "response");
      // Create a Blob from the response
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "TimeStudy.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Assuming response.data is the binary data for the Excel file

      setExportLoading(false);
      setIsFilterOpen(false);
    }
  };

  const downloadCSV = async (isfilter) => {
    if (isfilter === "filtered") {
      let headers = ["Vendor", "From Date", "Date", "Time", "Category", "SubCategory", "Identifier", "Login Id", "Section", "Flag Count", "Doc Number", "Doc Link", "Start Date Mode", "Start Date", "Start Time", "Status Mode", "Total Pages", "Pending Pages", "Start Page", "Remarks/Notes"];

      // Transform data
      const excelData = projmaster.map((entry) => [
        entry.vendor, // Category Name
        entry.datemode, // Subcategory
        entry.fromdate, // IP Address
        entry.time, // Type
        entry.filename, // IP Details
        entry.category, // Subnet
        entry.unitid, // Gateway
        entry.user, // DNS1
        entry.section, // DNS2
        entry.flagcount, // DNS3
        entry.docnumber, // DNS4
        entry.doclink, // DNS5
        entry.startmode, // Available
        entry.startdate, // Starting
        entry.starttime, // Ending
        entry.statusmode, // Ending
        entry.totalpages, // Ending
        entry.pendingpages, // Ending
        entry.startpage, // Ending
        entry.notes, // Ending
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
      link.download = "TimeStudy.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (isfilter === "overall") {
      let result = [];
      setExportLoading(true);
      let resultvendor = [];
      selectedProject
        .map((d) => d.value)
        .forEach((proj) => {
          selectedVendor
            .map((d) => d.value)
            .forEach((vend) => {
              resultvendor.push(`${proj}-${vend}`);
            });
        });
      let projvendor = [...new Set(resultvendor)];
      const isRoleManager = ["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((rl) => isUserRoleAccess.role.includes(rl));
      try {
        let response = await axios.post(
          SERVICE.PRODUCTION_MANUALSTUDY_CSVDOWNLOAD,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            vendor: projvendor,
            filename: selectedOptionsCategory.map((item) => item.value),
            category: selectedOptionsSubCategory.map((item) => item.value),
            user: isRoleManager && selectedOptionsLoginid.length === 0 ? [] : selectedOptionsLoginid.map((item) => item.value) === 0 ? loginAllotFilter.map((item) => item.value) : selectedOptionsLoginid.map((item) => item.value),
            fromdate: overallState.fromdate,
            status: ["Completed"],
            // ✅ Ensure Axios returns a Blob
          },
          {
            responseType: "blob",
          }
        );
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "TimeStudy.csv"; // File name
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
  };

  const downloadPdf = async (isfilter) => {
    if (isfilter === "filtered") {
      try {
        let headers = ["Vendor", "From Date", "Date", "Time", "Category", "SubCategory", "Identifier", "Login Id", "Section", "Flag Count", "Doc Number", "Doc Link", "Start Date Mode", "Start Date", "Start Time", "Status Mode", "Total Pages", "Pending Pages", "Start Page", "Remarks/Notes"];

        // Transform data
        const excelData = projmaster.map((entry) => [
          entry.vendor, // Category Name
          entry.datemode, // Subcategory
          entry.fromdate, // IP Address
          entry.time, // Type
          entry.filename, // IP Details
          entry.category, // Subnet
          entry.unitid, // Gateway
          entry.user, // DNS1
          entry.section, // DNS2
          entry.flagcount, // DNS3
          entry.docnumber, // DNS4
          entry.doclink, // DNS5
          entry.startmode, // Available
          entry.startdate, // Starting
          entry.starttime, // Ending
          entry.statusmode, // Ending
          entry.totalpages, // Ending
          entry.pendingpages, // Ending
          entry.startpage, // Ending
          entry.notes, // Ending
        ]);

        // Combine headers and data
        const tableData = [headers, ...excelData];

        const docDefinition = {
          pageSize: "A4",
          pageOrientation: "landscape", // Landscape mode
          content: [
            { text: "projmaster", style: "header", alignment: "center" },
            { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "right" },
            "\n",
            {
              table: {
                headerRows: 1,
                widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
                body: tableData,
              },
              layout: "lightHorizontalLines", // Table styling
            },
          ],
          styles: {
            header: { fontSize: 14, bold: true },
            subheader: { fontSize: 10, italics: true },
          },
          defaultStyle: { fontSize: 8 }, // Reduce font size
        };

        pdfMake.createPdf(docDefinition).download("TimeStudy.pdf"); // Trigger downloa
        setIsPdfFilterOpen(false);
      } catch (err) {
        console.log(err);
      }
    } else if (isfilter === "overall") {
      setExportLoading(true);
      let result = [];
      let resultvendor = [];
      selectedProject
        .map((d) => d.value)
        .forEach((proj) => {
          selectedVendor
            .map((d) => d.value)
            .forEach((vend) => {
              resultvendor.push(`${proj}-${vend}`);
            });
        });
      let projvendor = [...new Set(resultvendor)];
      const isRoleManager = ["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((rl) => isUserRoleAccess.role.includes(rl));
      let response = await axios.post(
        SERVICE.PRODUCTION_MANUALSTUDY_PDFDOWNLOAD,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          vendor: projvendor,
          filename: selectedOptionsCategory.map((item) => item.value),
          category: selectedOptionsSubCategory.map((item) => item.value),
          user: isRoleManager && selectedOptionsLoginid.length === 0 ? [] : selectedOptionsLoginid.map((item) => item.value) === 0 ? loginAllotFilter.map((item) => item.value) : selectedOptionsLoginid.map((item) => item.value),
          fromdate: overallState.fromdate,
          status: ["Completed"],
          // ✅ Ensure Axios returns a Blob
        },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "TimeStudy.pdf";
      link.click();
      URL.revokeObjectURL(link.href);
      setExportLoading(false);
      setIsFilterOpen(false);
    }
  };

  //image

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Production Manual Entry.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
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

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    vendor: true,
    datemode: true,
    fromdate: true,
    time: true,
    filename: true,
    category: true,
    unitid: true,
    user: true,
    section: true,
    flagcount: true,
    alllogin: true,
    docnumber: true,
    doclink: true,
    approvalstatus: true,
    lateentrystatus: true,
    startmode: true,
    startdate: true,
    starttime: true,
    status: true,
    totalpages: true,
    pendingpages: true,
    startpage: true,
    reason: true,
    statusmode: true,
    enddate: true,
    endtime: true,
    notes: true,
    actions: true,
    actionsstatus: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.smanualclientoinfo);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    try {
      await axios.delete(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchEmployee();

      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delProjectcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      await fetchEmployee();

      handleCloseModcheckbox();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const editSubmit = async () => {
    if (ProducionIndividualChange.statusmode === "Please Select Status") {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (ProducionIndividualChange.statusmode === "Completed" || ProducionIndividualChange.statusmode === "In Complete" || ProducionIndividualChange.statusmode === "Partial Complete" || ProducionIndividualChange.statusmode === "Started" || ProducionIndividualChange.statusmode === "Stop" || ProducionIndividualChange.statusmode === "Pause") {
      if (ProducionIndividualChange.fromdate === "") {
        setPopupContentMalert("Please Select End Date!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.time === "") {
        setPopupContentMalert("Please Select End Time!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.totalpages === "" || ProducionIndividualChange.totalpages === 0) {
        setPopupContentMalert("Please Enter Total Pages!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.statusmode === "Completed" && (ProducionIndividualChange.flagcount === 0 || ProducionIndividualChange.flagcount === "")) {
        setPopupContentMalert("Please Enter Completed Pages!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.statusmode === "Completed" && ProducionIndividualChange.flagcount !== ProducionIndividualChange.totalpages) {
        setPopupContentMalert("Completed Pages and Total pages count didn't match!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.pendingpages === "") {
        setPopupContentMalert("Please Enter Pending Pages!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.startdatemode === "") {
        setPopupContentMalert("Please Select Start Date Mode!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.statusmode === "Completed" && ProducionIndividualChange.notes === "") {
        setPopupContentMalert("Please Enter Notes!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.statusmode === "Completed" && ProducionIndividualChange.remarks === "") {
        setPopupContentMalert("Please Enter Remarks!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.startdate === ProducionIndividualChange.fromdate && ProducionIndividualChange.starttime === ProducionIndividualChange.time) {
        setPopupContentMalert("End Date/Time End Date must be greater than Start Date/Time!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        sendEditRequest();
      }
    } else if (ProducionIndividualChange.statusmode === "Reject" || ProducionIndividualChange.statusmode === "Cancel") {
      if (ProducionIndividualChange.reason === "") {
        setPopupContentMalert("Please Enter Reason!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        sendEditRequest();
      }
    }
  };

  // get single row view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProductionEdit(res?.data?.smanualclientoinfo);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProducionIndividualChange(res?.data?.smanualclientoinfo);
      setAllUploadedFilesedit(res?.data?.smanualclientoinfo.files);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProducionIndividualChange(res?.data?.smanualclientoinfo);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = ProducionIndividualChange?.updatedby;
  let addedby = ProducionIndividualChange?.addedby;

  let projectsid = ProducionIndividualChange._id;

  // console.log(ProducionIndividualChange.reason, "reason")

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      if (ProducionIndividualChange?.statusmode === "Reject" || ProducionIndividualChange?.statusmode === "Cancel") {
        let res = await axios.put(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          reason: String(ProducionIndividualChange.reason),
          statusmode: String(ProducionIndividualChange.statusmode),
        });
      } else {
        let res = await axios.put(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          fromdate: String(ProducionIndividualChange.fromdate),
          time: String(ProducionIndividualChange.time),
          statusmode: String(ProducionIndividualChange.statusmode),
          enddatemode: String(ProducionIndividualChange.enddatemode),
          totalpages: String(ProducionIndividualChange.totalpages),
          flagcount: String(ProducionIndividualChange.flagcount),
          pendingpages: Number(ProducionIndividualChange.pendingpages),
          startpage: String(ProducionIndividualChange.startpage),
          reason: String(ProducionIndividualChange.reason),
          remarks: String(ProducionIndividualChange.remarks),
          notes: String(ProducionIndividualChange.notes),
          files: allUploadedFilesedit.concat(refImageedit, refImageDragedit, capturedImagesedit),
        });
      }
      await fetchEmployee();

      handleCloseModEdit();
      setPopupContent("Changed Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production_Individual",
    pageStyle: "print",
  });

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [pageNumbers, setPageNumbers] = useState([]);

  const fetchEmployee = async () => {
    setLoading(true);

    try {
      let resultvendor = [];
      selectedProject
        .map((d) => d.value)
        .forEach((proj) => {
          selectedVendor
            .map((d) => d.value)
            .forEach((vend) => {
              resultvendor.push(`${proj}-${vend}`);
            });
        });
      let projvendor = [...new Set(resultvendor)];
      const isRoleManager = ["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((rl) => isUserRoleAccess.role.includes(rl));

      let res_employee = await axios.post(SERVICE.TIMESTULDY_COMPLETED_LIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendor: projvendor,
        filename: selectedOptionsCategory.map((item) => item.value),
        category: selectedOptionsSubCategory.map((item) => item.value),
        user: isRoleManager && selectedOptionsLoginid.length === 0 ? [] : selectedOptionsLoginid.map((item) => item.value) === 0 ? loginAllotFilter.map((item) => item.value) : selectedOptionsLoginid.map((item) => item.value),
        fromdate: overallState.fromdate,
        status: ["Completed"],
        page: Number(page),
        pageSize: Number(pageSize),
        searchTerm: searchQuery,
      });

      let final = res_employee.data.manualclientinfo;

      let subcates = final.map((d, index) => {
        return {
          ...d,
          id: d._id,
          serialNumber: (page - 1) * pageSize + index + 1,
        };
      });
      let subcatescount = res_employee?.data?.totalCount;

      setTotalCount(subcatescount);
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + 3 - 1, Math.ceil(subcatescount / pageSize));

      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }

      setPageNumbers(newPageNumbers);
      setProjmaster(subcates);
      setLoading(false);
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery]);

  useImperativeHandle(ref, () => ({
    // Here you can define the function you want to expose to the parent
    someChildFunction: () => {
      fetchEmployee();
    },
    anotherChildFunction: () => {
      console.log("Another child function");
    },
  }));

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const headerStyle = { wrapText: true, autoHeaderHeight: true };
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "", // Default header name
      headerStyle: {
        fontWeight: "bold",
      },
      sortable: false,
      width: 70,
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      ...headerStyle,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
    },

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      ...headerStyle,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "vendor", headerName: "Vendor", flex: 0, width: 160, hide: !columnVisibility.vendor, headerClassName: "bold-header", ...headerStyle },
    { field: "datemode", headerName: "Date Mode", flex: 0, width: 100, hide: !columnVisibility.datemode, headerClassName: "bold-header", ...headerStyle },
    { field: "fromdate", headerName: "Date", flex: 0, width: 120, hide: !columnVisibility.fromdate, headerClassName: "bold-header", ...headerStyle },
    { field: "time", headerName: "Time", flex: 0, width: 130, hide: !columnVisibility.time, headerClassName: "bold-header", ...headerStyle },
    { field: "filename", headerName: "Category", flex: 0, width: 220, hide: !columnVisibility.filename, headerClassName: "bold-header", ...headerStyle },
    { field: "category", headerName: "SubCategory", flex: 0, width: 300, hide: !columnVisibility.category, headerClassName: "bold-header", ...headerStyle },
    { field: "unitid", headerName: "Identifier", flex: 0, width: 170, hide: !columnVisibility.unitid, headerClassName: "bold-header", ...headerStyle },
    { field: "user", headerName: "Login Id", flex: 0, width: 130, hide: !columnVisibility.user, headerClassName: "bold-header", ...headerStyle },
    { field: "section", headerName: "Section", flex: 0, width: 100, hide: !columnVisibility.section, headerClassName: "bold-header", ...headerStyle },
    { field: "flagcount", headerName: "Flag Count", flex: 0, width: 100, hide: !columnVisibility.flagcount, headerClassName: "bold-header", ...headerStyle },
    { field: "alllogin", headerName: "All Login", flex: 0, width: 130, hide: !columnVisibility.alllogin, headerClassName: "bold-header", ...headerStyle },
    { field: "docnumber", headerName: "Doc Number", flex: 0, width: 170, hide: !columnVisibility.docnumber, headerClassName: "bold-header", ...headerStyle },
    { field: "doclink", headerName: "Doc Link", flex: 0, width: 170, hide: !columnVisibility.doclink, headerClassName: "bold-header", ...headerStyle },

    { field: "startmode", headerName: "Start Mode", flex: 0, width: 130, hide: !columnVisibility.startmode, headerClassName: "bold-header", ...headerStyle },
    { field: "startdate", headerName: "Start Date", flex: 0, width: 130, hide: !columnVisibility.startdate, headerClassName: "bold-header", ...headerStyle },
    { field: "starttime", headerName: "Start Time", flex: 0, width: 130, hide: !columnVisibility.starttime, headerClassName: "bold-header", ...headerStyle },
    { field: "statusmode", headerName: "Status Mode", flex: 0, width: 130, hide: !columnVisibility.statusmode, headerClassName: "bold-header", ...headerStyle },

    { field: "totalpages", headerName: "Total Pages", flex: 0, width: 110, hide: !columnVisibility.totalpages, headerClassName: "bold-header", ...headerStyle },
    { field: "pendingpages", headerName: "Pending Pages", flex: 0, width: 110, hide: !columnVisibility.pendingpages, headerClassName: "bold-header", ...headerStyle },
    { field: "startpage", headerName: "Start Page", flex: 0, width: 110, hide: !columnVisibility.startpage, headerClassName: "bold-header", ...headerStyle },
    { field: "notes", headerName: "Remark/Notes", flex: 0, width: 130, hide: !columnVisibility.notes, headerClassName: "bold-header", ...headerStyle },

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
        <Grid sx={{ display: "flex", alignItems: "baseline" }}>
          {params.data.statusmode === "In Complete" || params.data.statusmode === "Partial Complete" ? (
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              Pending{" "}
            </Button>
          ) : params.data.statusmode === "Pause" ? (
            <Button
              variant="contained"
              size="small"
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              Pause{" "}
            </Button>
          ) : params.data.statusmode === "Stop" ? (
            <Button
              variant="contained"
              size="small"
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              Restart{" "}
            </Button>
          ) : params.data.statusmode === "Started" ? (
            <Button
              variant="contained"
              size="small"
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              In Progress{" "}
            </Button>
          ) : (
            ""
          )}

          {isUserRoleCompare?.includes("dmanualentrytimestudylist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vmanualentrytimestudylist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("imanualentrytimestudylist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = projmaster.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      vendor: item.vendor,
      datemode: item.datemode,
      fromdate: item.fromdate,
      time: item.time,
      filename: item.filename,
      category: item.category,
      unitid: item.unitid,
      user: item.user,
      section: item.section,
      flagcount: item.flagcount,
      alllogin: item.alllogin,
      docnumber: item.docnumber,
      doclink: item.doclink,
      approvalstatus: item.approvalstatus,
      lateentrystatus: item.lateentrystatus,
      startmode: item.startmode,
      startdate: item.startdate,
      starttime: item.starttime,
      statusmode: item.statusmode,
      totalpages: item.totalpages,
      flagcount: item.flagcount,
      startpage: item.startpage,
      pendingpages: item.pendingpages,
      reason: item.reason,
      enddate: item.enddate,
      endtime: item.endtime,
      notes: item.notes,
    };
  });

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

  const [fileFormat, setFormat] = useState("");

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Production Manual Entry"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };

  useEffect(() => {
    getapi();
  }, []);

  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [refImageDragedit, setRefImageDragedit] = useState([]);
  const [valNumedit, setValNumedit] = useState(0);
  const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
  const [capturedImagesedit, setCapturedImagesedit] = useState([]);
  const [getImgedit, setGetImgedit] = useState(null);
  const webcamOpenedit = () => {
    setIsWebcamOpenedit(true);
  };
  const webcamCloseedit = () => {
    setIsWebcamOpenedit(false);
    setGetImgedit("");
  };
  const webcamDataStoreedit = () => {
    webcamCloseedit();
    setGetImgedit("");
  };
  const showWebcamedit = () => {
    webcamOpenedit();
  };
  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
  const handleClickUploadPopupOpenedit = () => {
    setUploadPopupOpenedit(true);
  };
  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };
  const handleInputChangeedit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImageedit];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageedit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  let combinedArray = allUploadedFilesedit.concat(refImageedit, refImageDragedit, capturedImagesedit);
  let uniqueValues = {};
  let resultArray = combinedArray.filter((item) => {
    if (!uniqueValues[item.name]) {
      uniqueValues[item.name] = true;
      return true;
    }
    return false;
  });

  //first deletefile
  const handleDeleteFileedit = (index) => {
    const newSelectedFiles = [...refImageedit];
    newSelectedFiles.splice(index, 1);
    setRefImageedit(newSelectedFiles);
  };

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const resetImageedit = () => {
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };
  const handleDragOveredit = (event) => { };
  const handleDropedit = (event) => {
    event.preventDefault();
    previewFileedit(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDragedit];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFilesDrag.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageDragedit(newSelectedFilesDrag);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const handleUploadOverAlledit = () => {
    setUploadPopupOpenedit(false);
  };
  const previewFileedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLedit(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFileedit = (index) => {
    const newSelectedFiles = [...refImageDragedit];
    newSelectedFiles.splice(index, 1);
    setRefImageDragedit(newSelectedFiles);
  };

  return (
    <Box>
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmanualentrytimestudylist") && (
        <>
          <Box>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
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
                    <MenuItem value={totalCount}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelmanualentrytimestudylist") && (
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
                  {isUserRoleCompare?.includes("csvmanualentrytimestudylist") && (
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
                  {isUserRoleCompare?.includes("printmanualentrytimestudylist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfmanualentrytimestudylist") && (
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
                  {isUserRoleCompare?.includes("imagemanualentrytimestudylist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={projmaster} setPage={setPage} maindatas={projmaster} setSearchedString={setSearchedString} searchQuery={searchQuery} setSearchQuery={setSearchQuery} paginated={false} totalDatas={projmaster} />
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
            {isUserRoleCompare?.includes("bdmanualentrytimestudylist") && (
              <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
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
            {loading ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    // height: 300,
                    width: "100%",
                    // overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                  className="ag-theme-quartz"
                // ref={gridRefImg}
                >
                  <AgGridReact
                    rowData={projmaster}
                    columnDefs={columnDataTable}
                    defaultColDef={{
                      flex: 1,
                      resizable: true,
                      filter: true,
                      // ...headerStyle,
                    }}
                    ref={gridRef} // Triggers when cell editing is complete.
                    suppressRowClickSelection={true}
                    rowSelection="multiple"
                    onGridReady={onGridReady}
                    onSelectionChanged={(event) => {
                      const selectedRowsData = event.api.getSelectedRows();
                      // setSelectedRows(selectedRowsData);
                      setSelectedRows(selectedRowsData.map((item) => item._id));
                    }}
                    domLayout="autoHeight"
                    getRowId={(params) => params.data.id}
                    getRowNodeId={(data) => data.id}
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {projmaster.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
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
            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}

      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseMod}
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
            <Button autoFocus variant="contained" color="error" onClick={(e) => delProject(projectid)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}
        <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>Production Manual Entry Info</Typography>
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
                <TableCell> SI.No</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Date Mode</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Identifier</TableCell>
                <TableCell>Login ID</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Flag Count</TableCell>
                <TableCell>All Login</TableCell>
                <TableCell>Doc Number</TableCell>
                <TableCell>Doc Link</TableCell>
                <TableCell>Start Mode</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Status Mode</TableCell>
                <TableCell>Total Pages</TableCell>
                <TableCell>Pending Pages</TableCell>
                <TableCell>Start Page</TableCell>
                <TableCell>Remarks/Notes</TableCell>
                <TableCell>Approval Status</TableCell>
                <TableCell>Late Entry Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.datemode}</TableCell>
                    <TableCell>{moment(row.fromdate).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.unitid}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.section}</TableCell>
                    <TableCell>{row.flagcount}</TableCell>
                    <TableCell>{row.alllogin}</TableCell>
                    <TableCell>{row.docnumber}</TableCell>
                    <TableCell>{row.doclink}</TableCell>
                    <TableCell>{row.startmode}</TableCell>
                    <TableCell>{row.startdate}</TableCell>
                    <TableCell>{row.starttime}</TableCell>
                    <TableCell>{row.statusmode}</TableCell>
                    <TableCell>{row.totalpages}</TableCell>
                    <TableCell>{row.pendingpages}</TableCell>
                    <TableCell>{row.startpage}</TableCell>
                    <TableCell>{row.notes}</TableCell>
                    <TableCell>{row.approvalstatus}</TableCell>
                    <TableCell>{row.lateentrystatus}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          style={{
            display: canvasState === false ? "none" : "block",
          }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="excelcanvastable" ref={gridRef}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Project Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: "95px" }}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Production Manual Entry</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Vendor</b>
                  </Typography>
                  <Typography>{productionedit.vendor}</Typography>
                </FormControl>
              </Grid>
              {productionedit?.creationstatus != "" || undefined ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Start Date Mode</b>
                      </Typography>
                      <Typography>{productionedit.startmode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={6} xs={12}>
                        <Typography>
                          <b> Start Date</b>
                        </Typography>
                        <Typography>{moment(productionedit.startdate).format("DD/MM/YYYY")}</Typography>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            <b> Start Time</b>
                          </Typography>
                          <Typography>{productionedit.starttime}</Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Date Mode</b>
                      </Typography>
                      <Typography>{productionedit.datemode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={6} xs={12}>
                        <Typography>
                          <b> Date</b>
                        </Typography>
                        <Typography>{moment(productionedit.fromdate).format("DD/MM/YYYY")}</Typography>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            <b> Time</b>
                          </Typography>
                          <Typography>{productionedit.time}</Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Category</b>
                  </Typography>
                  <Typography>{productionedit.filename}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Sub Category</b>
                  </Typography>
                  <Typography>{productionedit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Identifier</b>
                  </Typography>
                  <Typography>{productionedit.unitid}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Login Id</b>
                  </Typography>
                  <Typography>{productionedit.user}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> All Login</b>
                  </Typography>
                  <Typography>{productionedit.alllogin}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Section</b>
                  </Typography>
                  <Typography>{productionedit.section}</Typography>
                </FormControl>
              </Grid>
              {productionedit?.creationstatus && (
                <>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Total Pages</b>
                      </Typography>
                      <Typography>{productionedit.totalpages}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Completed Pages</b>
                      </Typography>
                      <Typography>{productionedit.flagcount}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Pending Pages</b>
                      </Typography>
                      <Typography>{productionedit.pendingpages}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Start Page</b>
                      </Typography>
                      <Typography>{productionedit.startpage}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Status</b>
                      </Typography>
                      <Typography>{productionedit.statusmode}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Doc Number</b>
                  </Typography>
                  <Typography>{productionedit.docnumber}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Doc Link</b>
                  </Typography>
                  <Typography>{productionedit.doclink}</Typography>
                </FormControl>
              </Grid>
              {productionedit?.statusmode === "Completed" && (
                <>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> End Date Mode</b>
                      </Typography>
                      <Typography>{productionedit.enddatemode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={6} xs={12}>
                        <Typography>
                          <b> End Date</b>
                        </Typography>
                        <Typography>{moment(productionedit.fromdate).format("DD/MM/YYYY")}</Typography>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            <b> End Time</b>
                          </Typography>
                          <Typography>{productionedit.time}</Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Remarks</b>
                      </Typography>
                      <Typography>{productionedit.remarks}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Notes</b>
                      </Typography>
                      <Typography>{productionedit.notes}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography>
                      <b> Attachments</b>
                    </Typography>
                    {productionedit?.files?.map((file, index) => (
                      <>
                        <Grid container>
                          <Grid item md={2} sm={2} xs={2}>
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {file.type.includes("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  height={50}
                                  style={{
                                    maxWidth: "-webkit-fill-available",
                                  }}
                                />
                              ) : (
                                <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                              )}
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={8}
                            sm={8}
                            xs={8}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2"> {file.name} </Typography>
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
                                onClick={() => renderFilePreviewedit(file)}
                              >
                                <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8" }} />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}>
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
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              ok
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
            <Button autoFocus variant="contained" color="error" onClick={delProjectcheckbox}>
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
            overflow: "auto",
            "& .MuiPaper-root": {
              overflow: "auto",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Change Status <b style={{ color: "red" }}>Start Date&Time : {moment(ProducionIndividualChange.startdate).format("DD/MM/YYYY") + " " + ProducionIndividualChange.starttime}</b>{" "}
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Status <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={statuschange}
                      styles={colourStyles}
                      value={{ label: ProducionIndividualChange.statusmode, value: ProducionIndividualChange.statusmode }}
                      onChange={(e) => {
                        setProducionIndividualChange({ ...ProducionIndividualChange, statusmode: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                {(ProducionIndividualChange.statusmode === "Completed" ||
                  ProducionIndividualChange.statusmode === "In Complete" ||
                  ProducionIndividualChange.statusmode === "Partial Complete" ||
                  ProducionIndividualChange.statusmode === "Started" ||
                  ProducionIndividualChange.statusmode === "Stop" ||
                  ProducionIndividualChange.statusmode === "Pause") && (
                    <>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            End Date Mode <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={datemodes}
                            styles={colourStyles}
                            value={{ label: ProducionIndividualChange.enddatemode, value: ProducionIndividualChange.enddatemode }}
                            onChange={(e) => {
                              let now = new Date();
                              const hours = String(now.getHours()).padStart(2, "0");
                              const minutes = String(now.getMinutes()).padStart(2, "0");
                              let currtime = `${hours}:${minutes}`;
                              //    today date fetching
                              let today = new Date();
                              var dd = String(today.getDate()).padStart(2, "0");
                              var mm = String(today.getMonth() + 1).padStart(2, "0");
                              var yyyy = today.getFullYear();
                              // today = yyyy + "-" + mm + "-" + dd;
                              const formattedToday = `${yyyy}-${mm}-${dd}`;

                              setProducionIndividualChange({ ...ProducionIndividualChange, enddatemode: e.value, time: e.value === "Auto" ? currtime : "", fromdate: e.value === "Auto" ? formattedToday : "" });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <Grid container spacing={2}>
                          <Grid item md={6} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                End Date <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput id="component-outlinedname" type="date" disabled={ProducionIndividualChange.enddatemode === "Auto"} value={ProducionIndividualChange.fromdate} onChange={handleDateChangeEdit} />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                End Time <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlinedname"
                                type="time"
                                disabled={ProducionIndividualChange.enddatemode === "Auto"}
                                value={ProducionIndividualChange.time}
                                onChange={(e) => {
                                  const selectedEndTime = e.target.value; // End time from input

                                  // Parse the start and end times into hours and minutes
                                  const [startHours, startMinutes] = ProducionIndividualChange.starttime === "" ? currtime?.split(":")?.map(Number) : ProducionIndividualChange.starttime?.split(":")?.map(Number);
                                  const [endHours, endMinutes] = selectedEndTime.split(":").map(Number);

                                  // Parse start date and end date
                                  const startDate = new Date(ProducionIndividualChange.startdate || new Date()); // Start date
                                  const endDate = new Date(ProducionIndividualChange.fromdate || new Date()); // End date

                                  // Set time for startDate and endDate to be the hours and minutes from inputs
                                  startDate.setHours(startHours, startMinutes, 0, 0); // Set start time
                                  endDate.setHours(endHours, endMinutes, 0, 0); // Set end time

                                  // Compare if the end date-time is before or equal to start date-time
                                  if (endDate <= startDate) {
                                    setPopupContent("End date and time should be after the start date and time!");
                                    setPopupSeverity("warning");
                                    handleClickOpenPopup();
                                    setProducionIndividualChange({ ...ProducionIndividualChange, time: "" });
                                  } else {
                                    setProducionIndividualChange({ ...ProducionIndividualChange, time: selectedEndTime });
                                  }
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Pages <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Total Pages" value={ProducionIndividualChange.totalpages} onChange={(e) => handleChangephonenumbertotalChange(e)} />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Completed Pages <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Completed Pages" value={ProducionIndividualChange.flagcount} onChange={(e) => handleChangephonenumberflagChange(e)} />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Pending Pages <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Flag Count" value={ProducionIndividualChange.pendingpages} />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Start Page <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput id="component-outlinedname" type="text" value={ProducionIndividualChange.startpage} />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={6}>
                        <Typography>Attachment</Typography>
                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                          <Button variant="contained" onClick={handleClickUploadPopupOpenedit}>
                            Upload
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item md={6} xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Typography>
                            Remarks<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={ProducionIndividualChange.remarks}
                            onChange={(e) => {
                              setProducionIndividualChange({ ...ProducionIndividualChange, remarks: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Typography>
                            Notes<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={ProducionIndividualChange.notes}
                            onChange={(e) => {
                              setProducionIndividualChange({ ...ProducionIndividualChange, notes: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                {(ProducionIndividualChange.statusmode === "Reject" || ProducionIndividualChange.statusmode === "Cancel") && (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth>
                        <Typography>
                          Reason<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={ProducionIndividualChange.reason}
                          onChange={(e) => {
                            setProducionIndividualChange({ ...ProducionIndividualChange, reason: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      {/* UPLOAD IMAGE DIALOG EDIT */}
      <Dialog open={uploadPopupOpenedit} onClose={handleUploadPopupCloseedit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: "95px" }}>
        <DialogTitle id="customized-dialog-title1" sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}>
          Upload Image Edit
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              {/* {showDragField ? ( */}
              <div onDragOver={handleDragOveredit} onDrop={handleDropedit}>
                {previewURLedit && refImageDragedit.length > 0 ? (
                  <>
                    {refImageDragedit.map((file, index) => (
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
                        <Button onClick={() => handleRemoveFileedit(index)} style={{ marginTop: "0px", color: "red" }}>
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
              {/* ) : null} */}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button variant="contained" component="label" sx={userStyle.uploadbtn}>
                    {" "}
                    Upload
                    <input type="file" multiple id="productimage" accept="image/*" hidden onChange={handleInputChangeedit} />
                  </Button>
                  &ensp;
                  <Button variant="contained" onClick={showWebcamedit} sx={userStyle.uploadbtn}>
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {resultArray?.map((file, index) => (
                <>
                  <Grid container>
                    <Grid item md={2} sm={2} xs={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {file.type.includes("image/") ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            height={50}
                            style={{
                              maxWidth: "-webkit-fill-available",
                            }}
                          />
                        ) : (
                          <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                        )}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={8}
                      sm={8}
                      xs={8}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2"> {file.name} </Typography>
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
                          onClick={() => renderFilePreviewedit(file)}
                        >
                          <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8" }} />
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
                          onClick={() => {
                            handleDeleteFileedit(index);
                          }}
                        >
                          <FaTrash style={{ color: "#a73131", fontSize: "12px" }} />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAlledit} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImageedit} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog open={isWebcamOpenedit} onClose={webcamCloseedit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage name={nameedit} getImgedit={getImgedit} setGetImgedit={setGetImgedit} valNumedit={valNumedit} setValNumedit={setValNumedit} capturedImagesedit={capturedImagesedit} setCapturedImagesedit={setCapturedImagesedit} setRefImageedit={setRefImageedit} setRefImageDragedit={setRefImageDragedit} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStoreedit}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamCloseedit}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

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

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} id="ManualEntry" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Date Mode</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>SubCategory </TableCell>
              <TableCell>Identifier </TableCell>
              <TableCell>Login Id </TableCell>
              <TableCell>Section </TableCell>
              <TableCell>Flag Count </TableCell>
              <TableCell>All Login </TableCell>
              <TableCell>Doc Number </TableCell>
              <TableCell>Doc Link </TableCell>
              <TableCell>Start Mode </TableCell>
              <TableCell>Start Date </TableCell>
              <TableCell>Start Time </TableCell>
              <TableCell>Status Mode </TableCell>
              <TableCell>Total Pages </TableCell>
              <TableCell>Pending Pages </TableCell>
              <TableCell>Start Page </TableCell>
              <TableCell>Remark/Notes </TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {projmaster &&
              projmaster.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell>{row.datemode}</TableCell>
                  <TableCell>{row.fromdate}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.filename}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.unitid}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{row.section}</TableCell>
                  <TableCell>{row.flagcount}</TableCell>
                  <TableCell>{row.alllogin}</TableCell>
                  <TableCell>{row.docnumber}</TableCell>
                  <TableCell>{row.doclink}</TableCell>
                  <TableCell>{row.startmode}</TableCell>
                  <TableCell>{row.startdate}</TableCell>
                  <TableCell>{row.starttime}</TableCell>
                  <TableCell>{row.statusmode}</TableCell>
                  <TableCell>{row.totalpages}</TableCell>
                  <TableCell>{row.pendingpages}</TableCell>
                  <TableCell>{row.startpage}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

export default CompletedManualEntryTimeStudyList;
