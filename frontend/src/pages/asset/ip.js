import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer, InputAdornment,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import StyledDataGrid from "../../components/TableStyle";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from "file-saver";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PageHeading from "../../components/PageHeading";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTable.js";

function ManageIP() {

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setloadingdeloverall(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setloadingdeloverall(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
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
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [pageNumbers, setPageNumbers] = useState([]);

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);


  const [ipmasters, setIpmasters] = useState([]);

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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  let exportColumnNames = [
    'Category', 'Subcategory',
    'IP Address', 'IP Details',
    'Subnet Mask', 'Gateway',
    'DNS 1', 'DNS 2',
    'DNS 3', 'DNS 4',
    'DNS 5', 'Available',
    'Starting', 'Ending'
  ];
  let exportRowValues = [
    'categoryname', 'subcategoryname',
    'ipaddress', 'ipdetails',
    'subnet', 'gateway',
    'dns1', 'dns2',
    'dns3', 'dns4',
    'dns5', 'available',
    'starting', 'ending'
  ];




  const [selectedRowsCat, setSelectedRowsCat] = useState([]);

  const [overalldeletecheck, setOveraldeletecheck] = useState([]);
  const [overalldeletecheckip, setOveraldeletecheckip] = useState([]);

  const [ipmaster, setIpmaster] = useState({
    categoryname: {
      label: "Please Select Category Name",
      value: "Please Select Category Name",
    },
    subcategoryname: {
      label: "Please Select SubCategory Name",
      value: "Please Select SubCategory Name",
    },
    ipaddress: "",
    type: "Please Select Type",
    subnet: "",
    ipdetails: "",
    gateway: "",
    dns1: "",
    dns2: "",
    dns3: "",
    dns4: "",
    dns5: "",
    available: "",
    starting: "",
    ending: "",

    ipsecsecretpassword: "",
  });
  const [loadingdeloverall, setloadingdeloverall] = useState(false);
  const [ipmasterEdit, setIpmasterEdit] = useState({
    categoryname: "",
    subcategoryname: "",
    ipaddress: "",
    type: "Please Select Type",
    subnet: "",
    ipdetails: "",
    gateway: "",
    dns1: "",
    dns2: "",
    dns3: "",
    dns4: "",
    dns5: "",
    available: "",
    starting: "",
    ending: "",

    ipsecsecretpassword: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleCompare, isUserRoleAccess, buttonStyles, pageName, setPageName, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  const accessbranch = isAssignBranch
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))

  const [reasonmasterCheck, setReasonmastercheck] = useState(false);

  const gridRef = useRef(null);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setsSubCategoryOptions] = useState([]);

  const fetchCategory = async () => {
    try {
      let response = await axios.get(`${SERVICE.IPCATEGORY}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions([
        ...response?.data?.ipcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };
  const fetchSubCategory = async (e) => {
    try {
      let response = await axios.post(`${SERVICE.IP_SUBCAT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: String(e),
      });
      let subcatOpt = response?.data?.subcatip
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat();
      setsSubCategoryOptions(subcatOpt);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  //image

  const handleExportXL = async (isfilter) => {
    if (isfilter === "filtered") {
      // Define headers
      const headers = [
        "Category Name", "Subcategory", "IP Address", "Type",
        "IP Details", "Subnet", "Gateway", "DNS1", "DNS2",
        "DNS3", "DNS4", "DNS5", "Available", "Starting", "Ending"
      ];


      // Transform data
      const excelData = ipmasters.map((entry) => [
        entry.categoryname, // Category Name
        entry.subcategoryname,   // Subcategory
        entry.ipaddress,    // IP Address
        entry.type,          // Type
        entry.ipdetails,    // IP Details
        entry.subnet,        // Subnet
        entry.gateway,       // Gateway
        entry.dns1,          // DNS1
        entry.dns2,          // DNS2
        entry.dns3,          // DNS3
        entry.dns4,          // DNS4
        entry.dns5,          // DNS5
        entry.available,     // Available
        entry.starting,      // Starting
        entry.ending         // Ending
      ]);

      // Combine headers and data
      const finalData = [headers, ...excelData];

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(finalData);

      // Create workbook and export
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Save file
      XLSX.writeFile(wb, "IpMaster.xlsx");
      setIsFilterOpen(false);
    } else if (isfilter === "overall") {
      let result = [];
      setExportLoading(true);

      let response = await axios.get(
        SERVICE.IP_MASTER_UPLOAD_EXCELDOWNLOAD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        responseType: "blob", // ✅ Ensure Axios returns a Blob
      }
      );
      console.log(response, "response");
      // if (!response.ok) throw new Error("Failed to download file");

      // Create a Blob from the response
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "IpMaster.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setExportLoading(false);
      setIsFilterOpen(false);
    }
  };

  const downloadCSV = async (isfilter) => {
    if (isfilter === "filtered") {
      const headers = [
        "Category Name", "Subcategory", "IP Address", "Type",
        "IP Details", "Subnet", "Gateway", "DNS1", "DNS2",
        "DNS3", "DNS4", "DNS5", "Available", "Starting", "Ending"
      ];

      // Transform data
      const excelData = ipmasters.map((entry) => [
        entry.categoryname, // Category Name
        entry.subcategoryname,   // Subcategory
        entry.ipaddress,    // IP Address
        entry.type,          // Type
        entry.ipdetails,    // IP Details
        entry.subnet,        // Subnet
        entry.gateway,       // Gateway
        entry.dns1,          // DNS1
        entry.dns2,          // DNS2
        entry.dns3,          // DNS3
        entry.dns4,          // DNS4
        entry.dns5,          // DNS5
        entry.available,     // Available
        entry.starting,      // Starting
        entry.ending         // Ending
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
      link.download = "IpMaster.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (isfilter === "overall") {
      let result = [];
      setExportLoading(true);

      try {
        let response = await axios.get(
          SERVICE.IP_MASTER_UPLOAD_CSVDOWNLOAD,
          {

          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            responseType: "blob", // ✅ Ensure Axios returns a Blob
          }
        );
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "IpMaster.csv"; // File name
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
        const headers = [
          "Category Name", "Subcategory", "IP Address", "Type",
          "IP Details", "Subnet", "Gateway", "DNS1", "DNS2",
          "DNS3", "DNS4", "DNS5", "Available", "Starting", "Ending"
        ];

        // Transform data
        const excelData = ipmasters.map((entry) => [
          entry.categoryname, // Category Name
          entry.subcategoryname,   // Subcategory
          entry.ipaddress,    // IP Address
          entry.type,          // Type
          entry.ipdetails,    // IP Details
          entry.subnet,        // Subnet
          entry.gateway,       // Gateway
          entry.dns1,          // DNS1
          entry.dns2,          // DNS2
          entry.dns3,          // DNS3
          entry.dns4,          // DNS4
          entry.dns5,          // DNS5
          entry.available,     // Available
          entry.starting,      // Starting
          entry.ending         // Ending
        ]);


        // Combine headers and data
        const tableData = [headers, ...excelData];

        const docDefinition = {
          pageSize: "A4",
          pageOrientation: "landscape", // Landscape mode
          content: [
            { text: "IpMasters", style: "header", alignment: "center" },
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

        pdfMake.createPdf(docDefinition).download("IpMaster.pdf"); // Trigger downloa
        setIsPdfFilterOpen(false);
      } catch (err) {
        console.log(err);
      }
    } else if (isfilter === "overall") {
      setExportLoading(true);
      let result = [];

      let response = await axios.get(
        SERVICE.IP_MASTER_UPLOAD_PDFDOWNLOAD,

        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          responseType: "blob", // ✅ Ensure Axios returns a Blob
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "IpMaster.pdf";
      link.click();
      URL.revokeObjectURL(link.href);
      setExportLoading(false);
      setIsFilterOpen(false);
    }
  };


  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Ip Master.png");
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
    setloadingdeloverall(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setSelectedRows([]);
    setisCheckOpen(false);
    setSelectAllChecked(false);
  };

  //check delete model
  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => {
    setisCheckOpenbulk(true);
  };
  const handlebulkCloseCheck = () => {
    setSelectedRows([]);
    setSelectedRowsCat([]);
    setisCheckOpenbulk(false);
    setSelectAllChecked(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [checkUnit, setCheckUnit] = useState([]);
  const [checkassign, setCheckAssign] = useState([]);

  const handleClickOpenalert = async () => {
    setIsHandleChange(true);
    let value = [...new Set(selectedRowsCat.flat())];
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      let resdev = await axios.post(SERVICE.OVERALL_DELETE_PASSWORDIPMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkunit: value,
      });
      // setCheckUnit(resdev?.data?.ipcat);
      let iparray = resdev?.data?.ipcatmaster.map((d) => d.ipconfig).flat();

      // setCheckAssign(iparray)
      if (resdev?.data?.ipcat?.length > 0 || iparray?.length > 0) {
        setCheckUnit([]);
        setCheckAssign([]);
        // handleClickOpenCheck();
        handleClickOpenCheckbulk();
        setOveraldeletecheck(resdev?.data?.ipcat);
        setOveraldeletecheckip(iparray);
      } else {
        setIsDeleteOpencheckbox(true);
      }
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
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };


  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    categoryname: true,
    subcategoryname: true,
    type: true,
    ipaddress: true,
    subnet: true,
    ipdetails: true,
    gateway: true,
    dns1: true,
    dns2: true,
    dns4: true,
    dns5: true,
    available: true,
    starting: true,
    ending: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteType, setDeleteType] = useState("");

  const rowData = async (id, assignedip) => {
    setPageName(!pageName)
    try {
      const [res, resdev] = await Promise.all([
        axios.get(`${SERVICE.IPMASTER_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.OVERALL_DELETE_PASSWORDIPMASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkunit: assignedip.map((d) => d.ipaddress),
        })
      ])
      setDeleteType(res?.data?.sipmaster);

      setCheckUnit(resdev?.data?.ipcat);
      let iparray = resdev?.data?.ipcatmaster.map((d) => d.ipconfig).flat();
      setOveraldeletecheck([]);
      setOveraldeletecheckip([]);
      setCheckAssign(iparray);
      if (resdev?.data?.ipcat?.length > 0 || iparray?.length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  // Alert delete popup
  let Typesid = deleteType?._id;
  const delReason = async (e) => {
    setPageName(!pageName)
    try {
      if (Typesid) {
        await axios.delete(`${SERVICE.IPMASTER_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchIpMaster();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  const delReasoncheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.IPMASTER_SINGLE}/${item}`, {
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

      await fetchIpMaster();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  const delReasoncheckboxWithoutLink = async () => {
    setPageName(!pageName)
    try {
      // selectedRows?.map((item) => {
      //     let res = axios.delete(`${SERVICE.VENDORMASTER_SINGLE}/${item}`, {
      //         headers: {
      //             'Authorization': `Bearer ${auth.APIToken}`
      //         },
      //     });
      // })
      let filtered = ipmasters.filter(
        (d) =>
          !d.ipconfig.some((item) =>
            overalldeletecheck.map((d) => d.assignedip).includes(item.ipaddress)
          )
      );
      let filterip = filtered.filter(
        (d) =>
          !d.ipconfig.some((item) =>
            overalldeletecheckip
              .map((d) => d.ipaddress)
              .includes(item.ipaddress)
          )
      );
      const deletePromises = filterip?.map((item) => {
        return axios.delete(`${SERVICE.IPMASTER_SINGLE}/${item._id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handlebulkCloseCheck();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchIpMaster();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [typemaster, setTypemaster] = useState("");

  const [categorysEdit, setCategorysEdit] = useState([]);
  const [subcategorysEdit, setSubcategorysEdit] = useState([]);
  const [typemasterEdit, setTypemasterEdit] = useState("");

  const fetchCategoryTicket = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.ticketcategory.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        })),
      ];

      setCategorys(categoryall);
      setCategorysEdit(categoryall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  const fetchCategoryBased = async (e) => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.ticketcategory
        .filter((data) => {
          return e.value === data.categoryname;
        })
        .map((data) => data.subcategoryname);
      let ans = [].concat(...data_set);

      setSubcategorys(
        ans.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );

      setSubcategorysEdit(
        ans.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  const fetchTypemaster = async (e) => {
    try {
      let res_type = await axios.get(SERVICE.TYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_type.data.typemasters
        .filter((d) => d.subcategorytype === e.value)
        .map((item) => item.nametype);

      let typename = result.length > 0 ? result[0] : "";
      setTypemaster(typename);
      setTypemasterEdit(typename);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  const [multiip, setMultiip] = useState([]);
  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    // let dif = ipmaster.ending - ipmaster.starting

    // Convert the IP addresses to arrays of integers
    const ip1Array = ipmaster.starting.split(".").map(Number);
    const ip2Array = ipmaster.ending.split(".").map(Number);

    // Calculate the absolute difference between corresponding octets
    const differenceArray = ip2Array.map((octet, index) =>
      Math.abs(octet - ip1Array[index])
    );

    // Sum the differences to get the total difference
    const dif = differenceArray.reduce(
      (sum, difference) => sum + difference,
      0
    );

    let categoryname = ipmaster.categoryname.value;
    let subcategoryname = ipmaster.subcategoryname.value;
    // let ipaddressname = ipmaster.ipaddress
    let subnet = ipmaster.subnet;
    let ipdetails = ipmaster.ipdetails;
    let gateway = ipmaster.gateway;
    let dns1 = ipmaster.dns1;
    let ipstarting = ipmaster.starting;

    const result = [];
    for (let i = 0; i <= dif; i++) {
      const ipaddress = incrementIpAddress(ipstarting, i);
      result.push({
        categoryname,
        subcategoryname,
        ipaddress,
        subnet,
        ipdetails,
        gateway,
        dns1,
      });
    }
    function incrementIpAddress(ip, increment) {
      const ipParts = ip.split(".").map((part) => parseInt(part));
      ipParts[3] += increment;
      // Ensure the IP parts stay within the valid range (0-255)
      for (let i = 3; i >= 1; i--) {
        if (ipParts[i] > 255) {
          ipParts[i] %= 256;
          ipParts[i - 1]++;
        }
      }
      return ipParts.join(".");
    }

    try {
      if (ipmaster.type == "Single") {
        let subprojectscreate = await axios.post(SERVICE.IPMASTER_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          categoryname: String(ipmaster.categoryname.value),
          subcategoryname: String(ipmaster.subcategoryname.value),
          ipaddress: String(ipmaster.ipaddress),
          type: String(ipmaster.type),
          subnet: String(ipmaster.subnet),
          ipdetails: String(ipmaster.ipdetails),
          gateway: String(ipmaster.gateway),
          dns1: String(ipmaster.dns1),
          dns2: String(ipmaster.dns2),
          dns3: String(ipmaster.dns3),
          dns4: String(ipmaster.dns4),
          dns5: String(ipmaster.dns5),
          ipsecsecretpassword: String(ipmaster.ipsecsecretpassword),
          available: "",
          starting: "",
          ending: "",
          ipconfig: [
            {
              categoryname: String(ipmaster.categoryname.value),
              subcategoryname: String(ipmaster.subcategoryname.value),
              ipaddress: String(ipmaster.ipaddress),
              type: String(ipmaster.type),
              subnet: String(ipmaster.subnet),
              ipdetails: String(ipmaster.ipdetails),
              gateway: String(ipmaster.gateway),
              dns1: String(ipmaster.dns1),
            },
          ],

          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        setPopupContent("Added Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } else {
        let subprojectscreate = await axios.post(SERVICE.IPMASTER_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          categoryname: String(ipmaster.categoryname.value),
          subcategoryname: String(ipmaster.subcategoryname.value),
          ipaddress: String(ipmaster.ipaddress),
          type: String(ipmaster.type),
          subnet: String(ipmaster.subnet),
          ipdetails: String(ipmaster.ipdetails),
          gateway: String(ipmaster.gateway),
          dns1: String(ipmaster.dns1),
          dns2: String(ipmaster.dns2),
          dns3: String(ipmaster.dns3),
          dns4: String(ipmaster.dns4),
          dns5: String(ipmaster.dns5),
          available: String(ipmaster.available),
          starting: String(ipmaster.starting),
          ending: String(ipmaster.ending),
          ipsecsecretpassword: String(ipmaster.ipsecsecretpassword),

          ipconfig: [...result],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      await fetchIpMaster();
      setIpmaster({
        ...ipmaster,
        ipaddress: "",
        type: "Please Select Type",
        subnet: "",
        ipdetails: "",
        gateway: "",
        dns1: "",
        dns2: "",
        dns3: "",
        dns4: "",
        dns5: "",
        available: "",
        starting: "",
        ending: "",
        ipsecsecretpassword: "",
      });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    e.preventDefault();

    const isNameMatchduplicatip = ipmasters.some(
      (item) =>
        item.categoryname.toLowerCase() ===
        (ipmaster?.categoryname?.value).toLowerCase() &&
        item.subcategoryname.toLowerCase() ===
        ipmaster.subcategoryname.value.toLowerCase() &&
        item.ipaddress === ipmaster.ipaddress &&
        item.subnet === ipmaster.subnet &&
        item.ipdetails === ipmaster.ipdetails &&
        item.gateway === ipmaster.gateway
    );

    function ipToInt(ip) {
      return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0);
    }

    const ipnew = ipmaster.ipaddress;
    const ipfrom = ipmaster.starting;
    const ipto = ipmaster.starting;

    const ipnewInt = ipToInt(ipnew);
    const ipfromInt = ipToInt(ipfrom);
    const iptoInt = ipToInt(ipto);

    const isBetween = ipnewInt >= ipfromInt && ipnewInt <= iptoInt;


    const isTypeMulti = ipmasters.some(item =>
      item.type === "Multi" &&
      item.categoryname.toLowerCase() ===
      (ipmaster?.categoryname.value).toLowerCase() &&
      item.subcategoryname.toLowerCase() ===
      (ipmaster.subcategoryname.value).toLowerCase()
      &&
      ipToInt(ipmaster.ipaddress) >= ipToInt(item.starting) && ipToInt(ipmaster.ipaddress) <= ipToInt(item.ending)


    )

    const isTypeSingle = ipmasters.some(item =>
      item.type === "Single" &&
      item.categoryname.toLowerCase() ===
      (ipmaster?.categoryname.value).toLowerCase() &&
      item.subcategoryname.toLowerCase() ===
      (ipmaster.subcategoryname.value).toLowerCase()
      &&
      ipToInt(item.ipaddress) == ipToInt(ipmaster.ipaddress)


    )

    const isNameMatch = ipmasters.some(
      (item) =>
        item.categoryname.toLowerCase() ===
        (ipmaster?.categoryname?.value).toLowerCase() &&
        item.subcategoryname.toLowerCase() ===
        ipmaster.subcategoryname.value.toLowerCase() &&
        item.ipaddress === ipmaster.ipaddress &&
        item.subnet === ipmaster.subnet &&
        item.ipdetails === ipmaster.ipdetails &&
        item.gateway === ipmaster.gateway
    );
    const isNameMatchMulti = ipmasters.some(
      (item) =>
        item.categoryname.toLowerCase() ===
        (ipmaster?.categoryname?.value).toLowerCase() &&
        item.subcategoryname.toLowerCase() ===
        ipmaster.subcategoryname.value.toLowerCase() &&
        item.ipaddress === ipmaster.ipaddress &&
        item.subnet === ipmaster.subnet &&
        item.ipdetails === ipmaster.ipdetails &&
        item.gateway === ipmaster.gateway &&
        item.available === ipmaster.available &&
        item.starting === ipmaster.starting &&
        item.ending === ipmaster.ending
    );

    if (ipmaster?.categoryname?.value === "Please Select Category Name") {

      setPopupContentMalert("Please Select Category Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ipmaster.subcategoryname.value === "Please Select SubCategory Name"
    ) {
      setPopupContentMalert("Please Select SubCategory Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ipmaster.ipaddress === "") {
      setPopupContentMalert("Please Enter IP Address!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ipmaster.type === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ipmaster.ipdetails === "") {
      setPopupContentMalert("Please Enter IP Details!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ipmaster.subnet === "") {
      setPopupContentMalert("Please Enter Subnet Mask!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ipmaster.gateway === "") {
      setPopupContentMalert("Please Enter GateWay!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ipmaster.type === "Multi" && ipmaster.available === "") {
      setPopupContentMalert("Please Enter Available!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ipmaster.type === "Multi" && ipmaster.starting === "") {
      setPopupContentMalert("Please Enter Starting!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ipmaster.type === "Multi" && ipmaster.ending === "") {
      setPopupContentMalert("Please Enter Ending!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch && ipmaster.type === "Single") {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatchMulti && ipmaster.type === "Multi") {
      setPopupContentMalert("Already same category,subcategory,ipaddress,type,subnet mask,ipdetails,gateway,available ip,starting ip,ending ip Added"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ipmaster.type === "Multi" &&
      ipmaster.starting >= ipmaster.ending
    ) {
      setPopupContentMalert("Ending must be greater than starting !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isTypeMulti) {
      setPopupContentMalert("IP Already Exist !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isTypeSingle) {
      setPopupContentMalert("IP Already Exist !");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleClear = async (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setIpmaster({
      categoryname: {
        label: "Please Select Category Name",
        value: "Please Select Category Name",
      },
      subcategoryname: {
        label: "Please Select SubCategory Name",
        value: "Please Select SubCategory Name",
      },
      ipaddress: "",
      type: "Please Select Type",
      subnet: "",
      ipdetails: "",
      gateway: "",
      dns1: "",
      dns2: "",
      dns3: "",
      dns4: "",
      dns5: "",
      available: "",
      starting: "",
      ending: "",
      ipsecsecretpassword: "",
    });
    setTypemaster("");
    setsSubCategoryOptions([]);
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
      let res = await axios.get(`${SERVICE.IPMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      fetchSubCategory(res?.data.sipmaster.categoryname);
      setIpmasterEdit(res?.data?.sipmaster);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.IPMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setIpmasterEdit(res?.data?.sipmaster);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.IPMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setIpmasterEdit(res?.data?.sipmaster);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  useEffect(() => {
    fetchCategoryTicket();
  }, []);

  //Project updateby edit page...
  let updateby = ipmasterEdit?.updatedby;
  let addedby = ipmasterEdit?.addedby;

  let subprojectsid = ipmasterEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    const ip1Array = ipmasterEdit.starting.split(".").map(Number);
    const ip2Array = ipmasterEdit.ending.split(".").map(Number);

    // Calculate the absolute difference between corresponding octets
    const differenceArray = ip2Array.map((octet, index) =>
      Math.abs(octet - ip1Array[index])
    );

    // Sum the differences to get the total difference
    const dif = differenceArray.reduce(
      (sum, difference) => sum + difference,
      0
    );

    let categoryname =
      ipmasterEdit.categoryname === String(ipmasterEdit.categoryname)
        ? String(ipmasterEdit.categoryname)
        : String(ipmasterEdit.categoryname);
    let subcategoryname =
      ipmasterEdit.subcategoryname === String(ipmasterEdit.subcategoryname)
        ? String(ipmasterEdit.subcategoryname)
        : String(ipmasterEdit.subcategoryname);
    let subnet = ipmasterEdit.subnet;
    let ipdetails = ipmasterEdit.ipdetails;
    let gateway = ipmasterEdit.gateway;
    let dns1 = ipmasterEdit.dns1;
    let ipstarting = ipmasterEdit.starting;

    const result = [];
    for (let i = 0; i <= dif; i++) {
      const ipaddress = incrementIpAddress(ipstarting, i);
      result.push({
        categoryname,
        subcategoryname,
        ipaddress,
        subnet,
        ipdetails,
        gateway,
        dns1,
      });
    }

    function incrementIpAddress(ip, increment) {
      const ipParts = ip.split(".").map((part) => parseInt(part));
      ipParts[3] += increment;
      // Ensure the IP parts stay within the valid range (0-255)
      for (let i = 3; i >= 1; i--) {
        if (ipParts[i] > 255) {
          ipParts[i] %= 256;
          ipParts[i - 1]++;
        }
      }
      return ipParts.join(".");
    }

    try {
      if (ipmasterEdit.type == "Single") {
        let res = await axios.put(
          `${SERVICE.IPMASTER_SINGLE}/${subprojectsid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryname:
              ipmasterEdit.categoryname === String(ipmasterEdit.categoryname)
                ? String(ipmasterEdit.categoryname)
                : String(ipmasterEdit.categoryname),
            subcategoryname:
              ipmasterEdit.subcategoryname ===
                String(ipmasterEdit.subcategoryname)
                ? String(ipmasterEdit.subcategoryname)
                : String(ipmasterEdit.subcategoryname),
            ipaddress: String(ipmasterEdit.ipaddress),
            type: String(ipmasterEdit.type),
            ipdetails: String(ipmasterEdit.ipdetails),
            subnet: String(ipmasterEdit.subnet),
            gateway: String(ipmasterEdit.gateway),
            dns1: String(ipmasterEdit.dns1),
            dns2: String(ipmasterEdit.dns2),
            dns3: String(ipmasterEdit.dns3),
            dns4: String(ipmasterEdit.dns4),
            dns5: String(ipmasterEdit.dns5),
            ipsecsecretpassword: String(ipmasterEdit.ipsecsecretpassword),
            available: "",
            starting: "",
            ending: "",
            ipconfig: [
              {
                categoryname:
                  ipmasterEdit.categoryname ===
                    String(ipmasterEdit.categoryname)
                    ? String(ipmasterEdit.categoryname)
                    : String(ipmasterEdit.categoryname),
                subcategoryname:
                  ipmasterEdit.subcategoryname ===
                    String(ipmasterEdit.subcategoryname)
                    ? String(ipmasterEdit.subcategoryname)
                    : String(ipmasterEdit.subcategoryname),
                ipaddress: String(ipmasterEdit.ipaddress),
                type: String(ipmasterEdit.type),
                subnet: String(ipmasterEdit.subnet),
                ipdetails: String(ipmasterEdit.ipdetails),
                gateway: String(ipmasterEdit.gateway),
                dns1: String(ipmasterEdit.dns1),
              },
            ],
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }
        );
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } else {
        let res = await axios.put(
          `${SERVICE.IPMASTER_SINGLE}/${subprojectsid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            categoryname:
              ipmasterEdit.categoryname === String(ipmasterEdit.categoryname)
                ? String(ipmasterEdit.categoryname)
                : String(ipmasterEdit.categoryname),
            subcategoryname:
              ipmasterEdit.subcategoryname ===
                String(ipmasterEdit.subcategoryname)
                ? String(ipmasterEdit.subcategoryname)
                : String(ipmasterEdit.subcategoryname),
            ipaddress: String(ipmasterEdit.ipaddress),
            type: String(ipmasterEdit.type),
            subnet: String(ipmasterEdit.subnet),
            ipdetails: String(ipmasterEdit.ipdetails),
            gateway: String(ipmasterEdit.gateway),
            dns1: String(ipmasterEdit.dns1),
            dns2: String(ipmasterEdit.dns2),
            dns3: String(ipmasterEdit.dns3),
            dns4: String(ipmasterEdit.dns4),
            dns5: String(ipmasterEdit.dns5),
            available: String(ipmasterEdit.available),
            starting: String(ipmasterEdit.starting),
            ending: String(ipmasterEdit.ending),
            ipsecsecretpassword: String(ipmasterEdit.ipsecsecretpassword),

            ipconfig: [...result],

            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }
        );
      }
      await fetchIpMaster();
      // await fetchipmasterAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };
  //
  const editSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    // fetchipmasterAll();

    const isNameMatch = ipduplicate.some(
      (item) =>
        item.categoryname.toLowerCase() ===
        (ipmasterEdit?.categoryname).toLowerCase() &&
        item.subcategoryname.toLowerCase() ===
        ipmasterEdit.subcategoryname.toLowerCase() &&
        item.ipaddress === ipmasterEdit.ipaddress &&
        item.subnet === ipmasterEdit.subnet &&
        item.ipdetails === ipmasterEdit.ipdetails &&
        item.gateway === ipmasterEdit.gateway
    );
    const isNameMatchMulti = ipduplicate.some(
      (item) =>
        item.categoryname.toLowerCase() ===
        (ipmasterEdit?.categoryname).toLowerCase() &&
        item.subcategoryname.toLowerCase() ===
        ipmasterEdit.subcategoryname.toLowerCase() &&
        item.ipaddress === ipmasterEdit.ipaddress &&
        item.subnet === ipmasterEdit.subnet &&
        item.ipdetails === ipmasterEdit.ipdetails &&
        item.gateway === ipmasterEdit.gateway &&
        item.available === ipmasterEdit.available &&
        item.starting === ipmasterEdit.starting &&
        item.ending === ipmasterEdit.ending
    );



    let assignedlist = ipmasterEdit?.ipconfig
      .filter((item) => item.status == "assigned")
      .map((item) => item.ipaddress);
    if (ipmasterEdit?.categoryname === "Please Select Category Name") {

      setPopupContent("Please Select Category Name");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (
      ipmasterEdit.subcategoryname === "Please Select SubCategory Name"
    ) {

      setPopupContent("Please Select SubCategory Name");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (ipmasterEdit.ipaddress === "") {

      setPopupContent("Please Enter IP Address");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (ipmasterEdit.type === "Please Select Type") {

      setPopupContent("Please Select Type");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (ipmasterEdit.ipdetails === "") {

      setPopupContent("Please Enter IP Details");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (ipmasterEdit.subnet === "") {

      setPopupContent("Please Enter Subnet Mask");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (ipmasterEdit.gateway === "") {

      setPopupContent("Please Enter Gateway");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (ipmasterEdit.type === "Multi" && ipmasterEdit.available === "") {

      setPopupContent("Please Enter Available");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (ipmasterEdit.type === "Multi" && ipmasterEdit.starting === "") {

      setPopupContent("Please Enter Starting");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (ipmasterEdit.type === "Multi" && ipmasterEdit.ending === "") {

      setPopupContent("Please Enter Ending");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (
      ipmasterEdit.type === "Multi" &&
      Number(ipmasterEdit.starting) >= Number(ipmasterEdit.ending)
    ) {

      setPopupContent("Ending must be greater than starting");
      setPopupSeverity("info");
      handleClickOpenPopup();
    } else if (isNameMatch && ipmasterEdit.type === "Single") {

      setPopupContent("Already same Category,SubCategory,IP Address,type,Subnet Mask,IP Details,Gateway Mask Added");
      setPopupSeverity("info");
      handleClickOpenPopup();

    } else if (isNameMatchMulti && ipmasterEdit.type === "Multi") {

      setPopupContent("Already same category,subcategory,ipaddress,type,ipdetails,subnet mask,gateway,available ip,starting ip,ending ip Added"
      );
      setPopupSeverity("info");
      handleClickOpenPopup();

    } else if (
      ipmasterEdit.type === "Multi" &&
      ipmasterEdit.starting >= ipmasterEdit.ending
    ) {

      setPopupContent("Ending must be greater than starting"
      );
      setPopupSeverity("info");
      handleClickOpenPopup();

    } else if (assignedlist.length > 0) {

      setPopupContent("These IP's Are Assigned"
      );
      setPopupSeverity("info");
      handleClickOpenPopup();

    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchIpMaster = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.post(SERVICE.IPMASTER_PAGINATION_LIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: page,
        pageSize: pageSize,
        searchTerm: searchQuery,
      });
      setReasonmastercheck(true);
      // setIpmasters(res_vendor?.data?.ipmaster?.map((item, index) => ({
      //   ...item,
      //   id: item._id,
      //   serialNumber: index + 1,
      // })));

      let final = res_vendor.data.result;

      let subcates = final.map((d, index) => {

        return {
          ...d,
          id: d._id,
          serialNumber: (page - 1) * pageSize + index + 1,
        };
      });
      let subcatescount = res_vendor?.data?.totalCount;
      setTotalCount(subcatescount);
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + 3 - 1, Math.ceil(subcatescount / pageSize));
      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }
      setPageNumbers(newPageNumbers);
      console.log(subcates, "subcates")
      setIpmasters(subcates);

    } catch (err) {
      setReasonmastercheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };
  const [ipduplicate, setDuplicate] = useState("");
  //get all Sub vendormasters.
  const fetchipmasterAll = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.IPMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // assignbranch: accessbranch,
      });
      setDuplicate(
        res_vendor?.data?.ipmaster.filter(
          (item) => item._id !== ipmasterEdit._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      ;
    }
  };

  // Excel
  const fileName = "Ip Master";

  const [typeData, setTypeData] = useState([]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "IP",
    pageStyle: "print",
  });

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  useEffect(() => {
    fetchIpMaster();
    // fetchipmasterAll();
  }, [page, pageSize, searchQuery]);

  // useEffect(() => {
  //   fetchipmasterAll();
  // }, [isEditOpen, ipmasterEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(ipmasters);
  }, [ipmasters]);

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

  // const totalPages = Math.ceil(filteredDatas.length / pageSize);

  // const visiblePages = Math.min(totalPages, 3);

  // const firstVisiblePage = Math.max(1, page - 1);
  // const lastVisiblePage = Math.min(
  //   firstVisiblePage + visiblePages - 1,
  //   totalPages
  // );

  // const pageNumbers = [];

  // const indexOfLastItem = page * pageSize;
  // const indexOfFirstItem = indexOfLastItem - pageSize;

  // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
  //   pageNumbers.push(i);
  // }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [

    // {
    //   field: "checkbox",
    //   headerName: "Checkbox",
    //   headerStyle: {
    //     fontWeight: "bold",
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (ipmasters.length === 0) {
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //           setSelectedRowsCat([]);
    //         } else {
    //           const allRowIds = ipmasters.map((row) => row.id);
    //           const allRowIdsCat = ipmasters.map((row) =>
    //             row.ipconfig.map((d) => d.ipaddress)
    //           );
    //           setSelectedRows(allRowIds);
    //           setSelectedRowsCat(allRowIdsCat);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),
    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         let updatedSelectedRowsCat;

    //         if (selectedRows.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRows.filter(
    //             (selectedId) => selectedId !== params.data.id
    //           );
    //           updatedSelectedRowsCat = selectedRowsCat.filter(
    //             (selectedId) =>
    //               selectedId !== params.data.ipconfig.map((d) => d.ipaddress)
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.data.id];
    //           updatedSelectedRowsCat = [
    //             ...selectedRowsCat,
    //             params.data.ipconfig.map((d) => d.ipaddress),
    //           ];
    //         }
    //         setSelectedRows(updatedSelectedRows);
    //         setSelectedRowsCat(updatedSelectedRowsCat);

    //         setSelectAllChecked(
    //           updatedSelectedRows.length === filteredData.length
    //         );
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 90,
    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },
    {
      field: "checkbox",
      headerName: "", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "categoryname",
      headerName: "Category",
      flex: 0,
      width: 140,
      hide: !columnVisibility.categoryname,
      headerClassName: "bold-header",
    },
    {
      field: "subcategoryname",
      headerName: "Subcategory",
      flex: 0,
      width: 140,
      hide: !columnVisibility.subcategoryname,
      headerClassName: "bold-header",
    },
    {
      field: "ipaddress",
      headerName: "Ip Address",
      flex: 0,
      width: 140,
      hide: !columnVisibility.ipaddress,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 140,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "ipdetails",
      headerName: "IP Details",
      flex: 0,
      width: 140,
      hide: !columnVisibility.ipdetails,
      headerClassName: "bold-header",
    },
    {
      field: "subnet",
      headerName: "Subnet Mask",
      flex: 0,
      width: 140,
      hide: !columnVisibility.subnet,
      headerClassName: "bold-header",
    },
    {
      field: "gateway",
      headerName: "Gateway",
      flex: 0,
      width: 140,
      hide: !columnVisibility.gateway,
      headerClassName: "bold-header",
    },
    {
      field: "dns1",
      headerName: "DNS 1",
      flex: 0,
      width: 140,
      hide: !columnVisibility.dns1,
      headerClassName: "bold-header",
    },
    {
      field: "dns2",
      headerName: "DNS 2",
      flex: 0,
      width: 140,
      hide: !columnVisibility.dns2,
      headerClassName: "bold-header",
    },
    {
      field: "dns3",
      headerName: "DNS 3",
      flex: 0,
      width: 140,
      hide: !columnVisibility.dns3,
      headerClassName: "bold-header",
    },
    {
      field: "dns4",
      headerName: "DNS 4",
      flex: 0,
      width: 140,
      hide: !columnVisibility.dns4,
      headerClassName: "bold-header",
    },
    {
      field: "dns5",
      headerName: "DNS 5",
      flex: 0,
      width: 140,
      hide: !columnVisibility.dns5,
      headerClassName: "bold-header",
    },
    {
      field: "available",
      headerName: "Available IP",
      flex: 0,
      width: 140,
      hide: !columnVisibility.available,
      headerClassName: "bold-header",
    },
    {
      field: "starting",
      headerName: "Starting IP",
      flex: 0,
      width: 140,
      hide: !columnVisibility.starting,
      headerClassName: "bold-header",
    },
    {
      field: "ending",
      headerName: "Ending IP",
      flex: 0,
      width: 140,
      hide: !columnVisibility.ending,
      headerClassName: "bold-header",
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
        <Grid sx={{ display: "flex" }}>
          {/* {isUserRoleCompare?.includes("eipmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )} */}
          {isUserRoleCompare?.includes("dipmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.ipconfig);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vipmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpenview();
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iipmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpeninfo();
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


  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  // Function to filter columns based on search query
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
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );


  const [ipAddress, setIPAddress] = useState("");


  const modeopt = [
    { label: "Single", value: "Single" },
    { label: "Multi", value: "Multi" },
  ];

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("IP Master"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }

  useEffect(() => {
    getapi();
  }, []);

  return (
    <Box>
      <Headtitle title={"IP"} />
      {/* <Typography sx={userStyle.HeaderText}>Manage Ip</Typography> */}
      <PageHeading
        title="IP Master"
        modulename="Network Administration"
        submodulename="IP"
        mainpagename="IP Master"
        subpagename=""
        subsubpagename=""
      />



      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("aipmaster") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Ip</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      id="component-outlined"
                      type="text"
                      options={categoryOptions}
                      styles={colourStyles}
                      placeholder="Please Enter Category  Name"
                      value={{
                        label: ipmaster?.categoryname.label,
                        value: ipmaster?.categoryname.value,
                      }}
                      onChange={(e) => {
                        fetchSubCategory(e.value);
                        setIpmaster({
                          ...ipmaster,
                          categoryname: {
                            label: e.label,
                            value: e.value,
                          },
                          subcategoryname: {
                            label: "Please Select SubCategory Name",
                            value: "Please Select SubCategory Name",
                          },
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      id="component-outlined"
                      type="text"
                      styles={colourStyles}
                      options={subCategoryOptions}
                      value={{
                        label: ipmaster?.subcategoryname.label,
                        value: ipmaster?.subcategoryname.value,
                      }}
                      placeholder="Please Select SubCategory Name"
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          subcategoryname: {
                            label: e.label,
                            value: e.value,
                          },
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      IP Address<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.ipaddress}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          ipaddress: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={modeopt}
                      styles={colourStyles}
                      value={{ label: ipmaster.type, value: ipmaster.type }}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          type: e.value,
                          available: "",
                          starting: "",
                          ending: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      IP Details<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.ipdetails}
                      placeholder="Please Enter IP Details"
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          ipdetails: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>IP Sec Secret Password</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.ipsecsecretpassword}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          ipsecsecretpassword: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Subnet Mask<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.subnet}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          subnet: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Gateway<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.gateway}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          gateway: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DNS 1</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.dns1}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          dns1: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DNS 2</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.dns2}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          dns2: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DNS 3</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.dns3}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          dns3: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DNS 4</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.dns4}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          dns4: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DNS 5</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={ipmaster.dns5}
                      onChange={(e) => {
                        setIpmaster({
                          ...ipmaster,
                          dns5: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {ipmaster.type === "Multi" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Available IP<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={ipmaster.available}
                          onChange={(e) => {
                            setIpmaster({
                              ...ipmaster,
                              available: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Starting IP<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={ipmaster.starting}
                          onChange={(e) => {
                            setIpmaster({
                              ...ipmaster,
                              starting: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Ending IP<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={ipmaster.ending}
                          onChange={(e) => {
                            setIpmaster({
                              ...ipmaster,
                              ending: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item lg={1} md={2} sm={2} xs={6} >
                  <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                    <LoadingButton
                      onClick={handleSubmit}
                      loading={loadingdeloverall}
                      sx={buttonStyles.buttonsubmit}
                      loadingPosition="end"
                      variant="contained"
                    >
                      Create
                    </LoadingButton>
                  </Box>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={6} >
                  <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      Clear
                    </Button>
                  </Box>
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
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>Edit IP</Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        id="component-outlined"
                        type="text"
                        options={categoryOptions}
                        styles={colourStyles}
                        placeholder="Please Enter Category  Name"
                        value={{
                          label: ipmasterEdit?.categoryname,
                          value: ipmasterEdit?.categoryname,
                        }}
                        onChange={(e) => {
                          fetchSubCategory(e.value);
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            categoryname: e.value,
                            subcategoryname: "Please Select SubCategory Name",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        id="component-outlined"
                        type="text"
                        styles={colourStyles}
                        options={subCategoryOptions}
                        value={{
                          label: ipmasterEdit?.subcategoryname,
                          value: ipmasterEdit?.subcategoryname,
                        }}
                        placeholder="Please Select SubCategory Name"
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            subcategoryname: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        IP Address<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.ipaddress}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            ipaddress: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={modeopt}
                        styles={colourStyles}
                        value={{
                          label: ipmasterEdit.type,
                          value: ipmasterEdit.type,
                        }}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            type: e.value,
                            available: "",
                            starting: "",
                            ending: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        IP Details<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter IP Details"
                        value={ipmasterEdit.ipdetails}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            ipdetails: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>IP Sec Secret Password</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.ipsecsecretpassword}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            ipsecsecretpassword: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Subnet Mask<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.subnet}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            subnet: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Gateway<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.gateway}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            gateway: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>DNS 1</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.dns1}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            dns1: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>DNS 2</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.dns2}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            dns2: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>DNS 3</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.dns3}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            dns3: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>DNS 4</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.dns4}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            dns4: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>DNS 5</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ipmasterEdit.dns5}
                        onChange={(e) => {
                          setIpmasterEdit({
                            ...ipmasterEdit,
                            dns5: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {ipmasterEdit.type === "Multi" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Available IP<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={ipmasterEdit.available}
                            onChange={(e) => {
                              setIpmasterEdit({
                                ...ipmasterEdit,
                                available: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Starting<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={ipmasterEdit.starting}
                            onChange={(e) => {
                              setIpmasterEdit({
                                ...ipmasterEdit,
                                starting: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Ending<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={ipmasterEdit.ending}
                            onChange={(e) => {
                              setIpmasterEdit({
                                ...ipmasterEdit,
                                ending: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
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
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lipmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>IP List</Typography>
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
                    {/* <MenuItem value={ipmasters?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelipmaster") && (
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
                  {isUserRoleCompare?.includes("csvipmaster") && (
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
                  {isUserRoleCompare?.includes("printipmaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfipmaster") && (
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
                  {isUserRoleCompare?.includes("imageipmaster") && (
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
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={ipmasters}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={ipmasters}
                />
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
            {isUserRoleCompare?.includes("bdipmaster") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!reasonmasterCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress color="inherit" />  */}
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
                {/* <Box style={{ width: "100%", overflowY: "hidden" }}>
                  <>
                    <AggridTable
                      ipmasters={ipmasters}
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
                      // totalDatas={totalDatas}
                      searchQuery={searchedString}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                      itemsList={ipmasters}
                    />
                  </>
                </Box> */}
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
                    rowData={items}
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
                      setSelectedRows(selectedRowsData.map((item) => item._id))
                    }}
                    domLayout="autoHeight"
                    getRowId={(params) => params.data.id}
                    getRowNodeId={(data) => data.id}
                  />

                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {ipmasters.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
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


      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpen}
          onClose={handleCloseMod}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delReason(Typesid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>IP Info</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
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
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
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
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
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
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
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
                <Button variant="contained" onClick={handleCloseinfo}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ width: "750px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View IP</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category</Typography>
                  <Typography>{ipmasterEdit.categoryname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subcategory</Typography>
                  <Typography>{ipmasterEdit.subcategoryname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">IP Address</Typography>
                  <Typography>{ipmasterEdit.ipaddress}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{ipmasterEdit.type}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">IP Details</Typography>
                  <Typography>{ipmasterEdit.ipdetails}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">IP Sec Secret Password</Typography>
                  <Typography>{ipmasterEdit.ipsecsecretpassword}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subnet Mask</Typography>
                  <Typography>{ipmasterEdit.subnet}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Gateway</Typography>
                  <Typography>{ipmasterEdit.gateway}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">DNS 1</Typography>
                  <Typography>{ipmasterEdit.dns1}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">DNS 2</Typography>
                  <Typography>{ipmasterEdit.dns2}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">DNS 3</Typography>
                  <Typography>{ipmasterEdit.dns3}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">DNS 4</Typography>
                  <Typography>{ipmasterEdit.dns4}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">DNS 5</Typography>
                  <Typography>{ipmasterEdit.dns5}</Typography>
                </FormControl>
              </Grid>
              {ipmasterEdit.type === "Multi" && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Available IP</Typography>
                      <Typography>{ipmasterEdit.available}</Typography>
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Starting IP</Typography>
                      <Typography>{ipmasterEdit.starting}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Ending IP</Typography>
                      <Typography>{ipmasterEdit.ending}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
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
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
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
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delReasoncheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog
              open={isCheckOpen}
              onClose={handleCloseCheck}
              aria-labelledby="alert-dialog-title"
              maxWidth="sm"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "80px", color: "orange" }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "black", textAlign: "center" }}
                >
                  {checkUnit?.length > 0 && checkassign?.length > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>
                        {`${[...new Set(checkUnit.map((d) => d.assignedip))]} `}{" "}
                      </span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Password </span>
                      <span style={{ fontWeight: "700", color: "#777" }}>
                        {" "}
                        {`${[
                          ...new Set(checkassign.map((d) => d.ipaddress)),
                        ]} `}
                      </span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}> Assinged IP</span>
                    </>
                  ) : checkUnit?.length > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${[
                        ...new Set(checkUnit.map((d) => d.assignedip)),
                      ]} `}</span>{" "}
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Password</span>
                    </>
                  ) : checkassign && checkassign?.length > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${[
                        ...new Set(checkassign.map((d) => d.ipaddress)),
                      ]} `}</span>{" "}
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Assigned IP</span>
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseCheck}
                  autoFocus
                  variant="contained"
                  color="error"
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>

        {/* ALERT DIALOG */}
        <Dialog
          open={isbulkCheckOpen}
          onClose={handlebulkCloseCheck}
          aria-labelledby="alert-dialog-title"
          maxWidth="sm"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              {(overalldeletecheck?.length > 0 ||
                overalldeletecheckip?.length > 0) && (
                  <>
                    <span style={{ fontWeight: "700", color: "#777" }}>
                      {[
                        ...new Set(
                          overalldeletecheck.map((item) => item.assignedip)
                        ),
                      ].join(", ")}
                      {overalldeletecheck.length > 0 && overalldeletecheckip.length > 0 && ", "}
                      {[
                        ...new Set(
                          overalldeletecheckip.map((item) => item.ipaddress)
                        ),
                      ].join(", ")}
                    </span>  was linked in  <span style={{ fontWeight: "700" }}>
                      {[
                        ...new Set(
                          overalldeletecheck.map((item) => item.assignedip)
                        ),
                      ].length > 0 &&
                        [
                          ...new Set(
                            overalldeletecheckip.map((item) => item.ipaddress)
                          ),
                        ].length > 0
                        ? "Password & Assigned IP"
                        : [
                          ...new Set(
                            overalldeletecheck.map((item) => item.assignedip)
                          ),
                        ].length > 0
                          ? "Password"
                          : "Assigned IP"}
                    </span>
                    {(overalldeletecheck.length > 0
                      ? ipmasters.filter(
                        (d) =>
                          selectedRows.includes(d._id) &&
                          !d.ipconfig.some((item) =>
                            overalldeletecheck
                              .map((d) => d.assignedip)
                              .includes(item.ipaddress)
                          )
                      ).length > 0
                      : true) &&
                      (overalldeletecheckip.length > 0
                        ? ipmasters.filter(
                          (d) =>
                            selectedRows.includes(d._id) &&
                            !d.ipconfig.some((item) =>
                              overalldeletecheckip
                                .map((d) => d.ipaddress)
                                .includes(item.ipaddress)
                            )
                        ).length > 0
                        : true) && (
                        <Typography>Do you want to delete others?...</Typography>
                      )}
                  </>
                )}
            </Typography>
          </DialogContent>
          <DialogActions>
            {(overalldeletecheck.length > 0 &&
              ipmasters.filter(
                (d) =>
                  selectedRows.includes(d._id) &&
                  !d.ipconfig.some((item) =>
                    overalldeletecheck
                      .map((d) => d.assignedip)
                      .includes(item.ipaddress)
                  )
              ).length === 0) ||
              (overalldeletecheckip.length > 0 &&
                ipmasters.filter(
                  (d) =>
                    selectedRows.includes(d._id) &&
                    !d.ipconfig.some((item) =>
                      overalldeletecheckip
                        .map((d) => d.ipaddress)
                        .includes(item.ipaddress)
                    )
                ).length === 0) ? (
              <Button
                onClick={handlebulkCloseCheck}
                autoFocus
                variant="contained"
                color="error"
              >
                {" "}
                OK{" "}
              </Button>
            ) : (
              ""
            )}

            {(
              overalldeletecheck.length > 0 && overalldeletecheckip.length > 0
                ? ipmasters.filter(
                  (d) =>
                    selectedRows.includes(d._id) &&
                    !d.ipconfig.some(
                      (item) =>
                        overalldeletecheckip
                          .map((d) => d.ipaddress)
                          .includes(item.ipaddress) ||
                        overalldeletecheck
                          .map((d) => d.assignedip)
                          .includes(item.ipaddress)
                    )
                ).length > 0
                : overalldeletecheck.length > 0
                  ? ipmasters.filter(
                    (d) =>
                      selectedRows.includes(d._id) &&
                      !d.ipconfig.some((item) =>
                        overalldeletecheck
                          .map((d) => d.assignedip)
                          .includes(item.ipaddress)
                      )
                  ).length > 0
                  : ipmasters.filter(
                    (d) =>
                      selectedRows.includes(d._id) &&
                      !d.ipconfig.some((item) =>
                        overalldeletecheckip
                          .map((d) => d.ipaddress)
                          .includes(item.ipaddress)
                      )
                  ).length > 0
            ) ? (
              <>
                <Button
                  onClick={delReasoncheckboxWithoutLink}
                  variant="contained"
                >
                  {" "}
                  Yes{" "}
                </Button>
                <Button
                  onClick={handlebulkCloseCheck}
                  autoFocus
                  variant="contained"
                  color="error"
                >
                  {" "}
                  Cancel{" "}
                </Button>
              </>
            ) : (
              ""
            )}
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
              wordBreak: "break-all",
            }}
          >
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
              //   handleExportXL("overall");
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
      {/* <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        // filteredDataTwo={filteredData ?? []}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : ipmaster) ?? []}
        itemsTwo={ipmasters ?? []}
        filename={"IP Master"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      /> */}
    </Box>
  );
}

export default ManageIP;