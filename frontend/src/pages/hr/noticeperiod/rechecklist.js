import React, { useState, useEffect, useRef, useContext, gridRef } from "react";
import {
  Box,
  Typography,
  Checkbox,
  DialogContent,
  Select,
  Dialog,
  OutlinedInput,
  FormControl,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
  MenuItem,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  List,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import moment from "moment";


function Rechecklist() {
  const gridRef = useRef(null);
  const [employees, setEmployees] = useState([]);
  const { isUserRoleAccess, isUserRoleCompare } = useContext(
    UserRoleAccessContext
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth, setAuth } = useContext(AuthContext);
  const [getrowid, setRowGetid] = useState([]);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "RecheckList.png");
        });
      });
    }
  };

  const [empaddform, setEmpaddform] = useState({
    branch: "",
    floor: "",
    department: "",
    company: "",
    unit: "",
    team: "",
    designation: "",
    shifttiming: "",
    reportingto: "",
  });
  // const [selectedbranch, setselectedbranch] = useState([]);
  const [exceldata, setexceldata] = useState([]);
  const [file, setFile] = useState("");

  const [isBoarding, setIsBoarding] = useState(false);

  let username = isUserRoleAccess.name;
  const id = useParams().id;
  const [copiedData, setCopiedData] = useState("");

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
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

  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

  // page refersh reload
  const handleCloseFilterMod2 = () => {
    setIsFilterOpen2(false);
  };

  const handleClosePdfFilterMod2 = () => {
    setIsPdfFilterOpen2(false);
  };


  const open = Boolean(anchorEl);
  const ids = open ? "simple-popover" : undefined;

  const [selectedRows, setSelectedRows] = useState([]);

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empname: true,
    empcode: true,
    department: true,
    noticedate: true,
    reason: true,
    files: true,
    status: true,
    releasedate: true,
    reasonleavingname: true,
  };

  // Show all columns
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const getRowClassNameAll = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

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

  const getCode = async (e) => {
    try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //get all employees list details
  const fetchNoticeperiodlist = async () => {
    try {
      let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) => data.recheckStatus === "true"
      );
      setIsBoarding(true);
      setEmployees(ans);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [employeesArray, setEmployeesArray] = useState([])

  const fetchNoticeperiodlistArray = async () => {
    try {
      let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) => data.recheckStatus === "true"
      );
      setIsBoarding(true);
      setEmployeesArray(ans);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchNoticeperiodlistArray()
  }, [isFilterOpen2])
  //id for login...;
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  //get single row to edit....
  const fileData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      renderFilePreview(res?.data?.snoticeperiodapply.files[0]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get single row to edit....
  const fileDataDownload = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFile(res?.data?.snoticeperiodapply.files[0]);
      res?.data?.snoticeperiodapply.files.forEach((file) => {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${file.base64}`;
        link.download = file.name;
        link.click();
      });
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Name", field: "empname" },
    { title: "Empcode", field: "empcode" },
    { title: "Team", field: "team" },
    { title: "Department", field: "department" },
    { title: "Date", field: "noticedate" },
    { title: "Reason", field: "reasonleavingname" },
    { title: "Status", field: "status" },
    { title: "Release Date", field: "approvenoticereq" },
  ];
  const downloadPdf2 = (isfilter) => {

    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({
        ...row,
        serialNumber: serialNumberCounter++,
        approvenoticereq: row.releasedate
      })) :
      employeesArray.map(row => ({
        ...row,
        serialNumber: serialNumberCounter++,
        noticedate: moment(row.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(row.approvenoticereq).format("DD-MM-YYYY")
      }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto"
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("RecheckList.pdf");
  };


  // Excel
  const fileName = "RecheckList";
  let excelno = 1;

  // get particular columns for export excel
  const getexcelDatas = async () => {
    try {
      let response = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = response?.data?.noticeperiodapply.filter(
        (data) => data.recheckStatus === "true"
      );
      var data =
        ans.length > 0 &&
        ans.map((t) => ({
          Sno: excelno++,
          Branch: t.branch,
          Company: t.company,
          unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          date: t.noticedate,
          Reason: t.reasonleavingname,
          Status: t.status,
          Releasedate: t.approvenoticereq,
        }));
      setexceldata(data);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Recheck List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchNoticeperiodlist();
  }, []);

  useEffect(() => {
    getexcelDatas();
  }, [employees]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const handleSorting = (column) => {
    const direction =
      sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
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
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(employees.length / pageSize);

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

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  // Table start colum and row
  // Define columns for the DataGrid
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
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
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
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empname,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 150,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 200,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "noticedate",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.noticedate,
      headerClassName: "bold-header",
    },
    {
      field: "reasonleavingname",
      headerName: "Reason",
      flex: 0,
      width: 100,
      hide: !columnVisibility.approvenoticereq,
      headerClassName: "bold-header",
    },
    {
      field: "files",
      headerName: "Document",
      flex: 0,
      width: 200,
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <a
            onClick={() => {
              fileData(params.row.id);
            }}
            style={{ minWidth: "0px", color: "#357AE8", cursor: "pointer" }}
          >
            View
          </a>
          <a
            // style={{ color: "#357AE8", marginLeft: "60px", marginTop: "0px" }}
            style={{
              minWidth: "0px",
              textDecoration: "none",
              color: "#357AE8",
              cursor: "pointer",
            }}
            
            onClick={() => {
              fileDataDownload(params.row.id);
            }}
          // download={file.name}
          >
            Download
          </a>
        </Grid>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            background:
              params.row.status === "Approved"
                ? "green"
                : params.row.status === "Reject"
                  ? "red"
                  : params.row.status === "Recheck"
                    ? "blue"
                    : params.row.status === "Applied"
                      ? "yellow"
                      : params.row.status,
            color: params.row.status === "Applied" ? "black" : "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
          }}
        >
          {params.row.status}
        </Button>
      ),
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
    },

    {
      field: "releasedate",
      headerName: "Release Date",
      flex: 0,
      width: 200,
      hide: !columnVisibility.releasedate,
      headerClassName: "bold-header",
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((notice, index) => {
    return {
      id: notice._id,
      serialNumber: notice.serialNumber,
      company: notice.company,
      branch: notice.branch,
      unit: notice.unit,
      empname: notice.empname,
      empcode: notice.empcode,
      team: notice.team,
      department: notice.department,
      noticedate: moment(notice.noticedate).format("DD-MM-YYYY"),
      reasonleavingname: notice.reasonleavingname,
      document: notice.document,
      status: "Recheck",
      releasedate: moment(notice.approvenoticereq).format("DD-MM-YYYY"),
    };
  });

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
      sx={{
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
          {filteredColumns?.map((column) => (
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
    </Box>
  );
  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeight = () => {
    if (pageSize === "All") {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatas.length);
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${visibleRows > 0
        ? visibleRows * rowHeight + extraSpace
        : scrollbarWidth + extraSpace
        }px`;
    }
  };


  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const handleExportXL2 = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          "Sno": index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: t.noticedate,
          Reason: t.reasonleavingname,
          Status: t.status,
          Releasedate: t.releasedate,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employeesArray.map((t, index) => ({
          "Sno": index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: moment(t.noticedate).format("DD/MM/YYYY"),
          Reason: t.reasonleavingname,
          status:
            t.approvedStatus === "true"
              ? "Approved"
              : t.rejectStatus === "true"
                ? "Reject"
                : t.recheckStatus === "true"
                  ? "Recheck"
                  : t.status,
          Releasedate: moment(t.approvenoticereq).format("DD-MM-YYYY"),


        })),
        fileName,
      );

    }

    setIsFilterOpen2(false)
  };


  return (
    <Box>
      {/* ****** Header Content ****** */}
      <br />
      {isUserRoleCompare?.includes("lnoticeperiodstatus") && (
        <>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Recheck List
                </Typography>
              </Grid>
            </Grid>
            {!isBoarding ? (
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
                <br />
                <br />
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes("csvnoticeperiodstatus") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen2(true)
                          fetchNoticeperiodlistArray()
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("excelnoticeperiodstatus") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen2(true)
                          fetchNoticeperiodlistArray()
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printnoticeperiodstatus") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfnoticeperiodstatus") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen2(true)
                            fetchNoticeperiodlistArray()
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagenoticeperiodstatus") && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <br />
                {/* added to the pagination grid */}
                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label htmlFor="pageSizeSelect">Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={employees.length}>All</MenuItem> */}
                    </Select>
                  </Box>
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
                <br />
                {/* ****** Table Grid Container ****** */}
                <Grid container>
                  <Grid md={4} sm={2} xs={1}></Grid>
                  <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
                <Button
                  sx={userStyle.buttongrp}
                  onClick={() => {
                    handleShowAllColumns();
                    setColumnVisibility(initialColumnVisibility);
                  }}
                >
                  Show All Columns
                </Button>
                &ensp;
                <Button
                  sx={userStyle.buttongrp}
                  onClick={handleOpenManageColumns}
                >
                  Manage Columns
                </Button>
                <br />
                <br />
                {/* {isLoader ? ( */}
                <>
                  <Box style={{ width: "100%", overflowY: "hidden" }}>
                    <StyledDataGrid
                      rows={rowDataTable}
                      columns={columnDataTable.filter(
                        (column) => columnVisibility[column.field]
                      )}
                      autoHeight={true}
                      ref={gridRef}
                      density="compact"
                      hideFooter
                      checkboxSelection={columnVisibility.checkboxSelection}
                      getRowClassName={getRowClassNameAll}
                      disableRowSelectionOnClick
                      unstable_cellSelection
                      onClipboardCopy={(copiedString) =>
                        setCopiedData(copiedString)
                      }
                      unstable_ignoreValueFormatterDuringExport
                    />
                  </Box>
                  <br />
                  <Box style={userStyle.dataTablestyle}>
                    <Box>
                      Showing{" "}
                      {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                      to {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                      {filteredDatas.length} entries
                    </Box>
                    <Box>
                      <Button
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        sx={userStyle.paginationbtn}
                      >
                        <FirstPageIcon />
                      </Button>
                      <Button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        sx={userStyle.paginationbtn}
                      >
                        <NavigateBeforeIcon />
                      </Button>
                      {pageNumbers?.map((pageNumber) => (
                        <Button
                          key={pageNumber}
                          sx={userStyle.paginationbtn}
                          onClick={() => handlePageChange(pageNumber)}
                          className={page === pageNumber ? "active" : ""}
                          disabled={page === pageNumber}
                        >
                          {pageNumber}
                        </Button>
                      ))}
                      {lastVisiblePage < totalPages && <span>...</span>}
                      <Button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        sx={userStyle.paginationbtn}
                      >
                        <NavigateNextIcon />
                      </Button>
                      <Button
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                        sx={userStyle.paginationbtn}
                      >
                        <LastPageIcon />
                      </Button>
                    </Box>
                  </Box>{" "}
                  <br /> <br />
                  {pageSize != 1 ? (
                    <Grid>
                     
                      <br />
                      <br />
                      {/* Manage Column */}
                      <Popover
                        id={ids}
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
                    </Grid>
                  ) : null}
                </>
              </>
            )}
          </Box>
        </>
      )}
      <br />
      {/* ****** Table End ****** */}

      {/*Export XL Data  */}
      <Dialog open={isFilterOpen2} onClose={handleCloseFilterMod2} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod2}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          {fileFormat === 'xl' ?
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
            : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL2("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL2("overall")
              // fetchBoardinglogArray()
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen2} onClose={handleClosePdfFilterMod2} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod2}
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
              downloadPdf2("filtered")
              setIsPdfFilterOpen2(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf2("overall")
              setIsPdfFilterOpen2(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit </StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Reason</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Releasedate</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell> {row.unit}</StyledTableCell>
                  <StyledTableCell>{row.empname}</StyledTableCell>
                  <StyledTableCell>{row.empcode}</StyledTableCell>
                  <StyledTableCell>{row.team}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.noticedate}</StyledTableCell>
                  <StyledTableCell>{row.reasonleavingname}</StyledTableCell>
                  <StyledTableCell>{"Recheck"}</StyledTableCell>
                  <StyledTableCell>{row.approvenoticereq}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
export default Rechecklist;
