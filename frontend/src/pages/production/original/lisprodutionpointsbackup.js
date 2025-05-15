import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  InputAdornment,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from '@mui/material';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { MultiSelect } from "react-multi-select-component";
import { userStyle } from '../../../pageStyle';
import { handleApiError } from '../../../components/Errorhandling';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ExportXL, ExportCSV } from '../../../components/Export';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import axios from '../../../axiosInstance';
import axios from 'axios';
import StyledDataGrid from '../../../components/TableStyle';
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import moment from 'moment-timezone';
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from 'react-to-print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from 'file-saver';
import Selects from 'react-select';
import * as XLSX from 'xlsx';
import LoadingButton from "@mui/lab/LoadingButton";
import { htmlToText } from 'html-to-text';
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import AlertDialog from "../../../components/Alert";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar.js";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import domtoimage from 'dom-to-image';

function ListProductionPoints() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");

  //auto select all dropdowns
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);


  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const ValueCompany = valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany;
  const ValueBranch = valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch;
  const ValueUnit = valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit;
  const ValueTeam = valueTeamCat?.length > 0 ? valueTeamCat : [];
  const ValueEmployee = valueEmployeeCat?.length > 0 ? valueEmployeeCat : [];


  const handleExportXL = async (isfilter) => {
    if (isfilter === "filtered") {
      // Define headers
      const headers = [
        "EmployeeCode", "EmployeeName", "Company", "Branch",
        "Unit", "Team", "Date", "Exper", "Target",
        "Weekoff", "Production", "Manual", "NonProduction", "Point", "AllowancePoint", "NonAllowancePoint", "AvgPoint"
      ];


      // Transform data
      const excelData = clientUserIDArray.map((entry) => [
        entry.name, // Category Name
        entry.empcode,   // Subcategory
        entry.companyname,    // IP Address
        entry.branch,          // Type
        entry.unit,    // IP Details
        entry.team,        // Subnet
        entry.date,       // Gateway
        entry.exper,          // DNS1
        entry.target,          // DNS2
        entry.weekoff,          // DNS3
        entry.production,          // DNS4
        entry.manual,          // DNS5
        entry.nonproduction,     // Available
        entry.point,      // Starting
        entry.allowancepoint,       // Ending
        entry.nonallowancepoint,        // Ending
        entry.avgpoint         // Ending
      ]);

      // Combine headers and data
      const finalData = [headers, ...excelData];

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(finalData);

      // Create workbook and export
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Save file
      XLSX.writeFile(wb, "ListProductionPoints.xlsx");
      setIsFilterOpen(false);
    } else if (isfilter === "overall") {
      let result = [];
      setExportLoading(true);

      let response = await axios.post(
        SERVICE.PRODUCTION_UPLOAD_POINTS_FILTER_EXCEL, {

        company: ValueCompany,
        branch: ValueBranch,
        unit: ValueUnit,
        team: ValueTeam,
        username: ValueEmployee,
        fromdate: filterUser?.fromdate,
        todate: filterUser?.todate,
        // ✅ Ensure Axios returns a Blob
      }, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
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
      a.download = "ListProductionPoints.xlsx";
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
        "EmployeeCode", "EmployeeName", "Company", "Branch",
        "Unit", "Team", "Date", "Exper", "Target",
        "Weekoff", "Production", "Manual", "NonProduction", "Point", "AllowancePoint", "NonAllowancePoint", "AvgPoint"
      ];


      // Transform data
      const excelData = clientUserIDArray.map((entry) => [
        entry.name, // Category Name
        entry.empcode,   // Subcategory
        entry.companyname,    // IP Address
        entry.branch,          // Type
        entry.unit,    // IP Details
        entry.team,        // Subnet
        entry.date,       // Gateway
        entry.exper,          // DNS1
        entry.target,          // DNS2
        entry.weekoff,          // DNS3
        entry.production,          // DNS4
        entry.manual,          // DNS5
        entry.nonproduction,     // Available
        entry.point,      // Starting
        entry.allowancepoint,       // Ending
        entry.nonallowancepoint,        // Ending
        entry.avgpoint         // Ending
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
      link.download = "ListProductionPoints.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (isfilter === "overall") {
      let result = [];
      setExportLoading(true);

      try {
        let response = await axios.post(
          SERVICE.PRODUCTION_UPLOAD_POINTS_FILTER_CSV,
          {
            company: ValueCompany,
            branch: ValueBranch,
            unit: ValueUnit,
            team: ValueTeam,
            username: ValueEmployee,
            fromdate: filterUser?.fromdate,
            todate: filterUser?.todate,
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
        a.download = "Listproductionpoints.csv"; // File name
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


        // pdfMake.createPdf(docDefinition).download("ListProductionPoints.pdf"); // Trigger downloa
        const headers = [
          "EmployeeCode", "EmployeeName", "Company", "Branch",
          "Unit", "Team", "Date", "Exper", "Target",
          "Weekoff", "Production", "Manual", "NonProduction", "Point", "AllowancePoint", "NonAllowancePoint", "AvgPoint"
        ];

        // Transform data
        const excelData = clientUserIDArray.map((entry) => [
          entry.name || "", // Category Name
          entry.empcode || "",   // Subcategory
          entry.companyname || "",    // IP Address
          entry.branch || "",          // Type
          entry.unit || "",    // IP Details
          entry.team || "",        // Subnet
          entry.date || "",       // Gateway
          entry.exper || "",          // DNS1
          entry.target || "",          // DNS2
          entry.weekoff || "",          // DNS3
          entry.production || "",          // DNS4
          entry.manual || "",          // DNS5
          entry.nonproduction || "",     // Available
          entry.point || "",      // Starting
          entry.allowancepoint || "",       // Ending
          entry.nonallowancepoint || "",        // Ending
          entry.avgpoint || ""       // Ending
        ]);

        // Combine headers and data
        const tableData = [headers, ...excelData];
        console.log(tableData, "tableData")

        // const docDefinition = {
        //   pageSize: "A4",
        //   pageOrientation: "landscape", // Landscape mode
        //   content: [
        //     { text: "Production Report", style: "header", alignment: "center" },
        //     { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "right" },
        //     "\n",
        //     {
        //       table: {
        //         headerRows: 1,
        //         // widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", 
        //         //  "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
        //         widths: [5, 10, 4, 5, 5,5, 7,4, 4,7, 
        //          6, 6, 6, 6, 6, 6, 6],
        //         body: tableData,
        //       },
        //       layout: "lightHorizontalLines", // Table styling
        //     },
        //   ],
        //   styles: {
        //     header: { fontSize: 14, bold: true },
        //     subheader: { fontSize: 9, italics: true,wrapText:true },
        //   },
        //   defaultStyle: { fontSize: 8 ,wrapText:true }, // Reduce font size
        // };


        const docDefinition = {
          pageSize: 'A3', // Larger page size (A4 might be too small)
          pageOrientation: 'landscape', // Landscape mode
          content: [
            { text: "Production Report", style: "header", alignment: "center" },
            { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "right" },
            "\n",
            {
              table: {
                headerRows: 1,
                keepWithHeaderRows: 1, // Ensure headers stay with the body
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: tableData, // Include your table data here
              },
              layout: "lightHorizontalLines", // Table styling
            },
          ],
          styles: {
            header: { fontSize: 14, bold: true },
            subheader: { fontSize: 9, italics: true, wrapText: true },
          },
          defaultStyle: { fontSize: 8, wrapText: true }, // Reduce font size for better fit
        };




        pdfMake.createPdf(docDefinition).download("ListProductionPoints.pdf");
        setIsPdfFilterOpen(false);
      } catch (err) {
        setExportLoading(false);
        console.log(err);
      }
    } else if (isfilter === "overall") {
      setExportLoading(true);
      let result = [];

      let response = await axios.post(
        SERVICE.PRODUCTION_UPLOAD_POINTS_FILTER_PDF,

        {

          company: ValueCompany,
          branch: ValueBranch,
          unit: ValueUnit,
          team: ValueTeam,
          username: ValueEmployee,
          fromdate: filterUser?.fromdate,
          todate: filterUser?.todate,
          // ✅ Ensure Axios returns a Blob
        }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        responseType: "blob",
      }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ListProductionPoints.pdf";
      link.click();
      URL.revokeObjectURL(link.href);
      setExportLoading(false);
      setIsFilterOpen(false);
    }
    handleClosePdfFilterMod()
  };




  const [fileFormat, setFormat] = useState("");


  const gridRef = useRef(null);
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

  const [loaders, setLoaders] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [singleFile, setSingleFile] = useState({});
  const [isBoxFocused, setIsBoxFocused] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  const [selectedEmp, setSelectedEmp] = useState([]);
  const [clientUserID, setClientUserID] = useState({
    projectvendor: 'Please Select Project Vendor',
    userid: '',
    password: '',
  });
  const [clientUserIDEdit, setClientUserIDEdit] = useState({
    projectvendor: 'Please Select Project Vendor',
    userid: '',
    password: '',
  });




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
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [clientUserIDArray, setClientUserIDArray] = useState([]);
  const [productionPoints, setProductionPoints] = useState([]);
  const [projectVendorOption, setProjectVendorOption] = useState([]);
  const { isUserRoleAccess, allUsersData, isUserRoleCompare, isAssignBranch, allUsersLimit, alldepartment, allTeam, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);



  const daysoptions = [
    { label: "Yesterday", value: "Yesterday" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Custom Fields", value: "Custom Fields" },
  ]
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  const [filterUser, setFilterUser] = useState({
    fromdate: today,
    todate: today,
    day: "Today"
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
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
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


  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);




  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteClientUserID, setDeleteClientUserID] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [clientUserIDData, setClientUserIDData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allClientUserIDEdit, setAllClientUserIDEdit] = useState([]);
  const [copiedData, setCopiedData] = useState('');
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);

  const getDownloadFile = async (document) => {
    const readExcel = (base64Data) => {
      return new Promise((resolve, reject) => {
        const bufferArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0)).buffer;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      });
    };

    const fileExtension = getFileExtension(document.name);

    if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
      readExcel(document.data)
        .then((excelData) => {
          const htmlTable = generateHtmlTable(excelData);
          const newTab = window.open();
          newTab.document.write(htmlTable);
        })
        .catch((error) => { });
    }

    // Helper function to extract file extension from a filename
    function getFileExtension(filename) {
      return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
    }

    // Helper function to generate an HTML table from Excel data
    function generateHtmlTable(data) {
      const headers = Object.keys(data[0]);

      const tableHeader = `<tr>${headers.map((header) => `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`).join('')}</tr>`;

      const tableRows = data.map((row, index) => {
        const rowStyle = index % 2 === 0 ? 'background-color: #f9f9f9;' : '';
        const cells = headers.map((header) => `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`).join('');
        return `<tr>${cells}</tr>`;
      });

      return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join('')}</table>`;
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    empcode: true,
    companyname: true,
    branch: true,
    unit: true,
    team: true,
    date: true,
    exper: true,
    target: true,
    weekoff: true,
    production: true,
    manual: true,
    nonproduction: true,
    point: true,
    allowancepoint: true,
    nonallowancepoint: true,
    avgpoint: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);



  useEffect(() => {
    if (items?.length > 0) {
      fetchProductionLists();
    }
  }, [page, pageSize, searchQuery]);


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
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
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPasswordEdit = () => setShowPasswordEdit((show) => !show);
  const handleMouseDownPasswordEdit = (event) => {
    event.preventDefault();
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
  // page refersh reload password
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage('');
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
  const id = open ? 'simple-popover' : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
  };
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [pageNumbers, setPageNumbers] = useState([]);
  //get all client user id.

  const fetchProductionLists = async () => {
    setLoaders(true)
    try {
      let res_freq = await axios.post(SERVICE.PRODUCTION_UPLOAD_POINTS_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: ValueCompany,
        branch: ValueBranch,
        unit: ValueUnit,
        team: ValueTeam,
        username: ValueEmployee,
        fromdate: filterUser?.fromdate,
        todate: filterUser?.todate,
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
      });

      let final = res_freq.data.result;

      let subcates = final.map((d, index) => {

        return {
          ...d,
          id: d.id,
          serialNumber: (page - 1) * pageSize + index + 1,
          date: moment(d.date).format("DD-MM-YYYY")
        };
      });
      console.log(subcates, "subcates")
      let subcatescount = res_freq?.data?.totalCount;
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
      setClientUserIDArray(subcates);

      setLoaders(false)
    } catch (err) {
      setLoaders(false)
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getCode = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DAY_POINTS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSingleFile(res?.data?.sdaypointsupload);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const gridRefTableImg = useRef(null);

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'List Productions Points.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };
  // pdf.....
  const columns = [
    { title: 'Sno', field: 'serialNumber' },
    { title: 'Employee Code', field: 'empcode' },
    { title: 'Employee Name', field: 'name' },
    { title: 'Branch', field: 'branch' },
    { title: 'Company Name', field: 'companyname' },
    { title: 'Unit', field: 'unit' },
    { title: 'Team', field: 'team' },
    { title: 'Date', field: 'date' },
    { title: 'Exper', field: 'exper' },
    { title: 'Target', field: 'target' },
    { title: 'Week Off', field: 'weekoff' },
    { title: 'Production', field: 'production' },
    { title: 'Manual', field: 'manual' },
    { title: 'Non-Production', field: 'nonproduction' },
    { title: 'Point', field: 'point' },
    { title: 'Allowance Point', field: 'allowancepoint' },
    { title: 'Non-allowance Points', field: 'nonallowancepoint' },
    { title: 'Average Points', field: 'avgpoint' },
  ];
  //  pdf download functionality
  const downloadPdf1 = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    doc.autoTable({
      theme: 'grid',
      styles: {
        fontSize: 6,
        cellWidth: 'auto',
      },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: items,
    });
    doc.save('List_Production_Points.pdf');
  };
  // Excel
  const fileName = 'List_Production_Points';
  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = clientUserIDArray.map((item, index) => ({
      Sno: index + 1,
      EmployeeCode: item.empcode,
      EmployeeName: item.name,
      Company: item.companyname,
      Branch: item.branch,
      Unit: item.unit,
      Team: item.team,
      Date: moment(item.date).format('DD-MM-YYYY'),
      Exper: item.exper,
      Target: item.target,
      Weekoff: item.weekoff,
      Production: item.production,
      Manual: item.manual,
      NonProduction: item.nonproduction,
      Point: item.point,
      AllowancePoint: item.allowancepoint,
      NonAllowancePoint: item.nonallowancepoint,
      AvgPoint: item.avgpoint,
    }));
    setClientUserIDData(data);
  };

  useEffect(() => {
    getexcelDatas();
  }, []);
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'List Production Points',
    pageStyle: 'print',
  });

  //serial no for listing items
  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(clientUserIDArray);
  }, [clientUserIDArray]);

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
  // const searchTerms = searchQuery.toLowerCase().split(' ');

  // Modify the filtering logic to check each term
  // const filteredDatas = items?.filter((item) => {
  //   return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  // });

  // const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  // const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  // const visiblePages = Math.min(totalPages, 3);
  // const firstVisiblePage = Math.max(1, page - 1);
  // const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  // const pageNumbers = [];
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
    //   field: 'checkbox',
    //   headerName: 'Checkbox',
    //   headerStyle: {
    //     fontWeight: 'bold', // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   renderHeader: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   renderCell: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.row.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.row.id)) {
    //           updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.row.id];
    //         }
    //         setSelectedRows(updatedSelectedRows);
    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 50,
    //   hide: !columnVisibility.checkbox,
    //   headerClassName: 'bold-header',
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
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    {
      field: 'empcode',
      headerName: 'Employee Code',
      flex: 0,
      width: 150,
      hide: !columnVisibility.empcode,
      headerClassName: 'bold-header',
    },
    {
      field: 'name',
      headerName: 'Employee Name',
      flex: 0,
      width: 200,
      hide: !columnVisibility.name,
      headerClassName: 'bold-header',
    },
    {
      field: 'companyname',
      headerName: 'Company',
      flex: 0,
      width: 150,
      hide: !columnVisibility.companyname,
      headerClassName: 'bold-header',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: 'bold-header',
    },
    {
      field: 'exper',
      headerName: 'Exper',
      flex: 0,
      width: 100,
      hide: !columnVisibility.exper,
      headerClassName: 'bold-header',
    },
    {
      field: 'target',
      headerName: 'Target',
      flex: 0,
      width: 100,
      hide: !columnVisibility.target,
      headerClassName: 'bold-header',
    },
    {
      field: 'weekoff',
      headerName: 'Week Off',
      flex: 0,
      width: 100,
      hide: !columnVisibility.weekoff,
      headerClassName: 'bold-header',
    },
    {
      field: 'production',
      headerName: 'Production',
      flex: 0,
      width: 100,
      hide: !columnVisibility.production,
      headerClassName: 'bold-header',
    },
    {
      field: 'manual',
      headerName: 'Manual',
      flex: 0,
      width: 100,
      hide: !columnVisibility.manual,
      headerClassName: 'bold-header',
    },
    {
      field: 'nonproduction',
      headerName: 'Non-Production',
      flex: 0,
      width: 100,
      hide: !columnVisibility.nonproduction,
      headerClassName: 'bold-header',
    },
    {
      field: 'point',
      headerName: 'Point',
      flex: 0,
      width: 100,
      hide: !columnVisibility.point,
      headerClassName: 'bold-header',
    },
    {
      field: 'allowancepoint',
      headerName: 'Allowance Point',
      flex: 0,
      width: 100,
      hide: !columnVisibility.allowancepoint,
      headerClassName: 'bold-header',
    },
    {
      field: 'nonallowancepoint',
      headerName: 'Non-allowance Points',
      flex: 0,
      width: 100,
      hide: !columnVisibility.nonallowancepoint,
      headerClassName: 'bold-header',
    },
    {
      field: 'avgpoint',
      headerName: 'Average Points',
      flex: 0,
      width: 100,
      hide: !columnVisibility.avgpoint,
      headerClassName: 'bold-header',
    },

    // {
    //   field: 'actions',
    //   headerName: 'Action',
    //   flex: 0,
    //   width: 250,
    //   minHeight: '40px !important',
    //   sortable: false,
    //   hide: !columnVisibility.actions,
    //   headerClassName: 'bold-header',
    //   renderCell: (params) => (
    //     <Grid sx={{ display: 'flex' }}>
    //       {isUserRoleCompare?.includes('elistproductionpoints') && (
    //         <Button
    //           variant="contained"
    //           sx={userStyle.buttonedit}
    //           onClick={() => {
    //             getCode(params.row.mainid);
    //           }}
    //         >
    //           view
    //         </Button>
    //       )}
    //     </Grid>
    //   ),
    // },
  ];

  // const rowDataTable = clientUserIDArray.map((item, index) => {
  //   return {
  //     ...item

  //     // id: item._id,
  //     // serialNumber: item.serialNumber,
  //     // empcode: item.empcode,
  //     // name: item.name,
  //     // companyname: item.companyname,
  //     // branch: item.branch,
  //     // unit: item.unit,
  //     // team: item.team,
  //     // date: moment(item.date).format('DD-MM-YYYY'),
  //     // exper: item.exper,
  //     // target: item.target,
  //     // weekoff: item.weekoff,
  //     // production: item.production,
  //     // manual: item.manual,
  //     // nonproduction: item.nonproduction,
  //     // point: item.point,
  //     // allowancepoint: item.allowancepoint,
  //     // nonallowancepoint: item.nonallowancepoint,
  //     // avgpoint: item.avgpoint,
  //     // mainid: item.mainid,
  //   };
  // });
  // const rowsWithCheckboxes = rowDataTable.map((row) => ({
  //   ...row,
  //   // Create a custom field for rendering the checkbox
  //   checkbox: selectedRows.includes(row.id),
  // }));
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
        padding: '10px',
        minWidth: '325px',
        '& .MuiDialogContent-root': { padding: '10px 0' },
      }}
    >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }} primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              {' '}
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibility(newColumnVisibility);
              }}
            >
              {' '}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );


  //company multiselect

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setSelectedEmp([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };
  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };
  //branch multiselect

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedEmp([]);
    setSelectedOptionsTeam([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };
  //unit multiselect

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setSelectedEmp([]);

    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };
  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };
  //team multiselect

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    setSelectedEmp([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //employee multiselect

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployee(options);
    setSelectedEmp([]);
  };
  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };


  const handleAutoSelect = async () => {
    // setPageName(!pageName);
    try {
      let selectedValues = accessbranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => u.teamname);

      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        .map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  const handleSubmit = () => {
    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (

      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (

      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (

      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (

      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }

    else if (filterUser.day === "Custom Fields" && filterUser.fromdate === "") {
      setPopupContentMalert("Please Select From Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (filterUser.day === "Custom Fields" && filterUser.todate === "") {
      setPopupContentMalert("Please Select To Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSearchQuery("")
      fetchProductionLists();
    }
  }


  const handleClear = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setClientUserIDArray([])
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);

    setFilterUser({
      fromdate: today,
      todate: today,
      day: "Today"
    });

    setPopupContent('Cleared Successfully');
    // ListPageLoadDataOnprogress([])
    setPopupSeverity("success");
    handleClickOpenPopup();

  }

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersLimit, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  const updateEmployees = (pastedNames) => {
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = allUsersLimit?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch) && valueUnitCat?.includes(comp.unit) && valueTeamCat?.includes(comp.team))?.map((data) => data.companyname.replace(/\s*\.\s*/g, '.').trim());

    const matchedValues = namesArray.filter((name) => availableOptions.includes(name.replace(/\s*\.\s*/g, '.').trim()));

    // Update selected options
    const newOptions = matchedValues.map((value) => ({
      label: value,
      value: value,
    }));

    // setSelectedEmp((prev) => {
    //     const newValues = newOptions.filter((newOpt) => !prev.some((prevOpt) => prevOpt.value === newOpt.value));
    //     return [...prev, ...newValues];
    // });

    setSelectedOptionsEmployee((prev) => {
      const newValues = newOptions.filter((newOpt) => !prev.some((prevOpt) => prevOpt.value === newOpt.value));
      return [...prev, ...newValues];
    });
    // Update other states...
    setValueEmployeeCat((prev) => [...new Set([...prev, ...matchedValues])]);
  };

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    // Process the pasted text
    const pastedNames = pastedText
      .split(/[\n,]+/)
      .map((name) => name.trim())
      .filter((name) => name !== '');
    console.log(pastedNames, "pastedNames")

    // Update the state
    updateEmployees(pastedNames);

    // Clear the search input after paste
    setSearchInputValue('');

    // Refocus the element
    e.target.focus();
  };

  // Handle clicks outside the Box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const boxElement = document.getElementById('paste-box'); // Add an ID to the Box
      if (boxElement && !boxElement.contains(e.target)) {
        setIsBoxFocused(false); // Reset focus state if clicking outside the Box
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedEmp((current) => current.filter((emp) => emp.value !== value));
    setValueEmployeeCat((current) => current.filter((empValue) => empValue !== value));
  };


  return (
    <Box>
      <Headtitle title={'LIST PRODUCTION POINTS'} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>List Production Points</Typography>
      <br /> <br />
      {/* ****** Table Start ****** */}

      <>
        {isUserRoleCompare?.includes('llistproductionpoints') && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>List Production Points</Typography>
              </Grid>

              <Grid container spacing={2}>

                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={accessbranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
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
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>

                {/* Branch Unit Team */}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
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
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            valueCompanyCat?.includes(comp.company) &&
                            valueBranchCat?.includes(comp.branch)
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
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
                      value={selectedOptionsUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (u) =>
                            valueCompanyCat?.includes(u.company) &&
                            valueBranchCat?.includes(u.branch) &&
                            valueUnitCat?.includes(u.unit)
                        )
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedOptionsTeam}
                      onChange={(e) => {
                        handleTeamChange(e);
                      }}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>


                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <div onPaste={handlePasteForEmp} style={{ position: 'relative' }}>
                      <MultiSelect
                        options={allUsersData
                          ?.filter(
                            (u) =>
                              valueCompanyCat?.includes(u.company) &&
                              valueBranchCat?.includes(u.branch) &&
                              valueUnitCat?.includes(u.unit) &&
                              valueTeamCat?.includes(u.team) &&
                              u.workmode !== "Internship"
                          )
                          .map((u) => ({
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        value={selectedOptionsEmployee}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Employee"
                      />
                    </div>
                  </FormControl>
                </Grid>

                <Grid item md={9} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControl fullWidth size="small">
                    <Typography>Selected Employees</Typography>
                    <Box
                      id="paste-box"
                      tabIndex={0}
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: '3.75px',
                        height: '110px',
                        overflow: 'auto',
                        '& .MuiChip-clickable': {
                          margin: '1px',
                          cursor: 'pointer',
                          userSelect: 'none',
                          background: '#e0e0e0',
                        },
                      }}
                      onPaste={handlePasteForEmp}
                      onFocus={() => setIsBoxFocused(true)}
                      onBlur={(e) => {
                        if (isBoxFocused) {
                          e.target.focus();
                        }
                      }}
                    >
                      {valueEmployeeCat.map((value) => (
                        <Chip key={value} label={value} clickable sx={{ margin: 2, backgroundColor: '#FFF' }} onDelete={(e) => handleDelete(e, value)} onClick={() => console.log('clicked chip')} />
                      ))}
                    </Box>
                  </FormControl>
                </Grid>


                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography sx={{ fontWeight: "500" }}>
                      Days
                    </Typography>
                    <Selects
                      options={daysoptions}
                      // styles={colourStyles}
                      value={{ label: filterUser.day, value: filterUser.day }}
                      onChange={(e) => {
                        handleChangeFilterDate(e);
                        setFilterUser((prev) => ({ ...prev, day: e.value }))
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      From Date
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
                      To Date
                    </Typography>
                    <OutlinedInput
                      id="to-date"
                      type="date"
                      value={filterUser.todate}
                      disabled={filterUser.day !== "Custom Fields"}
                      onChange={(e) => {
                        const selectedToDate = new Date(e.target.value);
                        const selectedFromDate = new Date(filterUser.fromdate);
                        const formattedDatePresent = new Date() // Assuming you have a function to format the current date
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
                <Grid item md={3} xs={12} sm={6} mt={3}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      // loading={filterLoader}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Filter
                    </LoadingButton>

                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </div>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
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
                      sx={{ width: '77px' }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={clientUserIDArray?.length}>All</MenuItem> */}
                    </Select>
                  </Box>
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={12}
                  sm={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    {isUserRoleCompare?.includes('excellistproductionpoints') && (
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
                        </Button>                        </>
                    )}
                    {isUserRoleCompare?.includes('csvlistproductionpoints') && (
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
                        </Button>                        </>
                    )}
                    {isUserRoleCompare?.includes('printlistproductionpoints') && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes('pdfclientuserid') && (
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
                    {isUserRoleCompare?.includes('imagelistproductionpoints') && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {' '}
                        <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
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
                    maindatas={clientUserIDArray}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={clientUserIDArray}
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
              <br />
              <br />


              {loaders ? (
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


                  <Box
                    style={{
                      // height: 300,

                      width: "100%",
                      // overflowY: "hidden", // Hide the y-axis scrollbar
                    }}
                    className="ag-theme-quartz"
                    ref={gridRefTableImg}
                  >
                    {/* <StyledDataGrid
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
                  /> */}
                    <AgGridReact
                      rowData={items}
                      columnDefs={columnDataTable}
                      defaultColDef={{
                        flex: 1,
                        resizable: true,
                        filter: true,
                        // ...headerStyle,
                      }}
                      // ref={gridRefTableImg} // Triggers when cell editing is complete.
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
                  {/* <Box style={userStyle.dataTablestyle}>
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
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
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
                </Box> */}

                  <Box style={userStyle.dataTablestyle}>
                    <Box>
                      Showing {clientUserIDArray.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
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
        {/* Manage Column */}
        <Popover
          id={id}
          open={isManageColumnsOpen}
          anchorEl={anchorEl}
          onClose={handleCloseManageColumns}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {manageColumnsContent}
        </Popover>
      </>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Exper</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Week Off</TableCell>
              <TableCell>Production</TableCell>
              <TableCell>Manual</TableCell>
              <TableCell>Non-Production</TableCell>
              <TableCell>Point</TableCell>
              <TableCell>Allowance Point</TableCell>
              <TableCell>Non-allowance Points</TableCell>
              <TableCell>Average Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {clientUserIDArray &&
              clientUserIDArray.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.companyname}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{moment(row.date).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{row.exper}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell>{row.weekoff}</TableCell>
                  <TableCell>{row.production}</TableCell>
                  <TableCell>{row.manual}</TableCell>
                  <TableCell>{row.nonproduction}</TableCell>
                  <TableCell>{row.point}</TableCell>
                  <TableCell>{row.allowancepoint}</TableCell>
                  <TableCell>{row.nonallowancepoint}</TableCell>
                  <TableCell>{row.avgpoint}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: '7px 13px',
                color: 'white',
                background: 'rgb(25, 118, 210)',
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Bulk delete ALERT DIALOG */}
      <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '70px', color: 'orange' }} />
          <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
            {' '}
            OK{' '}
          </Button>
        </DialogActions>
      </Dialog>
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Production Points</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              {/* <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">File Name</Typography>
                  <Typography>{singleFile?.filename}</Typography>
                </FormControl>
              </Grid> */}
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{moment(singleFile?.date).format('DD-MM-YYYY')} </Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} sm={6} xs={12}>
                <Typography variant="h6">File Name</Typography>
                {singleFile?.document?.map((file, fileIndex) => (
                  <Grid container key={fileIndex}>
                    <Grid item md={8} sm={10} xs={10}>
                      <Typography>{file.name}</Typography>
                    </Grid>
                    <Grid item md={2} sm={10} xs={10}>
                      <a
                        style={{
                          minWidth: '0px',
                          textDecoration: 'none',
                          color: '#357AE8',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `data:application/octet-stream;base64,${file.data}`;
                          link.download = file.name;
                          link.click();
                        }}
                      >
                        Download
                      </a>
                    </Grid>
                    <Grid item md={1} sm={2} xs={2}></Grid>
                    <Grid item md={1} sm={2} xs={2}>
                      <VisibilityOutlinedIcon
                        style={{
                          fontsize: 'large',
                          color: '#357AE8',
                          cursor: 'pointer',
                        }}
                        onClick={() => getDownloadFile(file)}
                      />
                    </Grid>
                  </Grid>
                ))}
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
      <br />


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
    </Box>
  );
}

export default ListProductionPoints;