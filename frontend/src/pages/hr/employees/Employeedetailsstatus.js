import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
  Select,
  OutlinedInput,
  FormControl,
  MenuItem,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  Tooltip,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import StyledDataGrid from "../../../components/TableStyle";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Headtitle from "../../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CandidateStatusTable from "./CandidateStatusTable";
import FormControlLabel from "@mui/material/FormControlLabel";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PauseIcon from "@mui/icons-material/Pause";
import BlockIcon from "@mui/icons-material/Block";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";

function EmployeeDetailStatus() {
  const [employees, setEmployees] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("Employee");
  const [tableName, setTableName] = useState("Employee");
  const [candidateDatas, setCandidateDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    isAssignBranch,
    allUsersData,
    allUnit,
    allTeam,
    allCompany,
    allBranchs,
  } = useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth, setAuth } = useContext(AuthContext);
  const [isBtnFilter, setisBtnFilter] = useState(false);

  const [loader, setLoader] = useState(false);

  let username = isUserRoleAccess.username;

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, `${tableName} Detail Status.png`);
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState([]);

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _controls) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : `Please Select ${selectedUserType} ${
          selectedUserType !== "Candidate" && checked ? "Current" : ""
        } Status`;
  };

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (selectedUserType === "Candidate") {
      if (event.target.checked) {
        setStatusDropDown(finalStatusList);
      } else {
        setStatusDropDown(candidateStatus);
      }
    } else {
      if (event.target.checked) {
        setStatusDropDown(empcurrenttstatus);
      } else {
        setStatusDropDown(
          selectedUserType === "Employee"
            ? empintstatus
            : [...empintstatus, ...intstatus]
        );
      }
    }

    setValueCate([]);
    setSelectedOptionsCate([]);
  };

  // Status
  const empintstatus = [
    { label: "Live", value: "Live" },
    { label: "Absconded", value: "Absconded" },
    { label: "Releave Employee", value: "Releave Employee" },
    { label: "Hold", value: "Hold" },
    { label: "Terminate", value: "Terminate" },
  ];
  const intstatus = [
    { label: "Not Joined", value: "Not Joined" },
    { label: "Rejected", value: "Rejected" },
    { label: "Closed", value: "Closed" },
    { label: "Postponed", value: "Postponed" },
  ];
  const empcurrenttstatus = [
    { label: "Live", value: "Live" },
    { label: "Long Absent", value: "Long Absent" },
    { label: "Long Leave", value: "Long Leave" },
    { label: "Notice Period Applied", value: "Notice Period Applied" },
    { label: "Notice Period Approved", value: "Notice Period Approved" },
    { label: "Exit Confirmed", value: "Exit Confirmed" },
  ];

  let finalStatusList = [
    { label: "Hired", value: "Hired" },
    { label: "Rejected", value: "Rejected" },
    { label: "Hold", value: "Hold" },
  ];

  let candidateStatus = [
    { label: "Applied", value: "Applied" },
    { label: "Rejected", value: "Rejected" },
    { label: "On Hold", value: "On Hold" },
    { label: "Selected", value: "Selected" },
    { label: "Screened", value: "Screened" },
    { label: "First No Response", value: "First No Response" },
    { label: "Second No Response", value: "Second No Response" },
    { label: "No Response", value: "No Response" },
    { label: "Not Interested", value: "Not Interested" },
    { label: "Got Other Job", value: "Got Other Job" },
    { label: "Already Joined", value: "Already Joined" },
    { label: "Duplicate Candidate", value: "Duplicate Candidate" },
    { label: "Profile Not Eligible", value: "Profile Not Eligible" },
  ];

  const [statusDropDown, setStatusDropDown] = useState(empintstatus);

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

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Function to render the status with icons and buttons
  const renderStatus = (status) => {
    const iconProps = {
      size: "small",
      style: { marginRight: 4 },
    };

    let icon = <InfoIcon {...iconProps} />;
    let color = "#ccc"; // Default color

    switch (status) {
      case "Exit Confirmed":
        icon = <CancelIcon {...iconProps} />;
        color = "#f44336"; // Blue
        break;
      case "Notice Period Applied":
      case "Notice Period Applied and Long Leave":
      case "Notice Period Applied and Long Absent":
        icon = <PauseCircleOutlineIcon {...iconProps} />;
        color = "#1976d2"; // Blue
        break;
      case "Notice Period Approved":
      case "Notice Period Approved and Long Leave":
      case "Notice Period Approved and Long Absent":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "#4caf50"; // Green
        break;
      case "Notice Period Cancelled":
      case "Notice Period Cancelled and Long Leave":
      case "Notice Period Cancelled and Long Absent":
        icon = <ErrorIcon {...iconProps} />;
        color = "#9c27b0"; // Purple
        break;
      case "Notice Period Continue":
      case "Notice Period Continue and Long Leave":
      case "Notice Period Continue and Long Absent":
        icon = <WarningIcon {...iconProps} />;
        color = "#ff9800"; // Orange
        break;
      case "Notice Period Rejected":
      case "Notice Period Rejected and Long Leave":
      case "Notice Period Rejected and Long Absent":
        icon = <ErrorIcon {...iconProps} />;
        color = "#f44336"; // Red
        break;
      case "Notice Period Recheck":
      case "Notice Period Recheck and Long Leave":
      case "Notice Period Recheck and Long Absent":
        icon = <InfoIcon {...iconProps} />;
        color = "#00acc1"; // Cyan
        break;
      case "Long Leave":
        icon = <PauseCircleOutlineIcon {...iconProps} />;
        color = "#1976d2"; // Blue
        break;
      case "Long Absent":
        icon = <ErrorIcon {...iconProps} />;
        color = "#f44336"; // Red
        break;
      case "Live":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "#4caf50"; // Green
        break;
      default:
        icon = <InfoIcon {...iconProps} />;
        color = "#ccc"; // Default gray
    }

    return (
      <Tooltip title={status} arrow>
        <Button
          variant="contained"
          startIcon={icon}
          sx={{
            fontSize: "0.75rem",
            padding: "2px 6px",
            cursor: "default",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
            minWidth: "100px",
            display: "flex",
            justifyContent: "flex-start",
            backgroundColor: color,
            "&:hover": {
              backgroundColor: color,
              overflow: "visible",
              whiteSpace: "normal",
              maxWidth: "none",
            },
          }}
          disableElevation
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              lineHeight: 1.2,
            }}
          >
            {status}
          </Typography>
        </Button>
      </Tooltip>
    );
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    resonablestatus: true,
    userstatus: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Excel
  const fileName = `${tableName} Detail Status`;
  const [isClearOpenalert, setClearOpenalert] = useState(false);

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
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable.map((item, index) => {
          return {
            "S.No": index + 1,
            Staus: item.resonablestatus,
            CurrentStaus: item.userstatus,
            Company: item.company,
            Branch: item.branch,
            Unit: item.unit,
            Team: item.team,
            Empcode: item.empcode,
            Name: item.companyname,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          "S.No": index + 1,
          Staus: item.resonablestatus,
          CurrentStaus: item.userstatus,
          Company: item.company,
          Branch: item.branch,
          Unit: item.unit,
          Team: item.team,
          Empcode: item.empcode,
          Name: item.companyname,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Status", field: "status" },
    { title: "Current Status", field: "userstatus" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Emp Code", field: "empcode" },
    { title: "Name", field: "companyname" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((item, index) => {
            return {
              serialNumber: index + 1,
              status: item.resonablestatus,
              userstatus: item.userstatus,
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              team: item.team,
              empcode: item.empcode,
              companyname: item.companyname,
            };
          })
        : items?.map((item, index) => ({
            serialNumber: index + 1,
            status: item.resonablestatus,
            userstatus: item.userstatus,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            companyname: item.companyname,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save(`${tableName} Detail Status.pdf`);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${tableName} Detail Status`,
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      _id: item?._id,
      serialNumber: index + 1,
      resonablestatus:
        item?.resonablestatus === undefined ? "Live" : item?.resonablestatus,
      company: item?.company,
      userstatus: item.userstatus,
      branch: item?.branch,
      unit: item?.unit,
      team: item?.team,
      empcode: item?.empcode,
      companyname: item?.companyname,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);
  useEffect(() => {
    fetchDeptandDesignationGrouping();
    fetchDesignationDropdowns();
  }, []);

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

  const renderStatusIconAndColor = (status) => {
    const iconProps = {
      size: "small",
      style: { marginRight: 4 },
    };

    let icon = <InfoIcon {...iconProps} />;
    let color = "#ccc"; // Default color
    let textcolor = "white";
    // Default color

    switch (status) {
      case "Releave Employee":
        icon = <ExitToAppIcon {...iconProps} />;
        color = "blue";
        break;
      case "Absconded":
        icon = <DirectionsRunIcon {...iconProps} />;
        color = "#ff5722"; // Deep Orange
        break;
      case "Hold":
        icon = <PauseIcon {...iconProps} />;
        color = "red";
        break;
      case "Terminate":
        icon = <BlockIcon {...iconProps} />;
        color = "orange";
        break;
      case "Rejoined":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "yellow";
        textcolor = "black";

        break;
      case "Not Joined":
        icon = <PersonOffIcon {...iconProps} />;
        color = "#9e9e9e"; // Grey
        break;
      case "Rejected":
        icon = <ThumbDownIcon {...iconProps} />;
        color = "#e91e63"; // Pink
        break;
      case "Closed":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "red"; // Green
        break;
      case "Postponed":
        icon = <EventBusyIcon {...iconProps} />;
        color = "#3f51b5"; // Indigo
        break;
      case "Live":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "#4caf50"; // Green
        break;
      default:
        icon = <InfoIcon {...iconProps} />;
        color = "#ccc"; // Default color
    }

    return { icon, color, textcolor };
  };

  const StatusButton = ({ status }) => {
    const { icon, color, textcolor } = renderStatusIconAndColor(status);

    return (
      <Tooltip title={status} arrow>
        <Button
          variant="contained"
          startIcon={icon}
          sx={{
            fontSize: "0.75rem",
            padding: "2px 6px",
            cursor: "default",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
            minWidth: "100px",
            display: "flex",
            justifyContent: "flex-start",
            color: textcolor,
            backgroundColor: color,
            "&:hover": {
              backgroundColor: color,
              overflow: "visible",
              whiteSpace: "normal",
              maxWidth: "none",
            },
          }}
          disableElevation
        >
          {status}
        </Button>
      </Tooltip>
    );
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
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "resonablestatus",
      headerName: "Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.resonablestatus,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <>
          {params?.row?.resonablestatus && (
            <StatusButton status={params.row.resonablestatus} />
          )}
        </>
      ),
    },
    {
      field: "userstatus",
      headerName: "Current Status",
      flex: 0,
      width: 180,
      minHeight: "40px",
      renderCell: (params) => renderStatus(params?.row.userstatus),
      hide: !columnVisibility.userstatus,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 200,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 200,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 150,
      hide: !columnVisibility.unit,
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
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Emp Code!");
              }}
              options={{ message: "Copied Emp Code!" }}
              text={params?.row?.empcode}
            >
              <ListItemText primary={params?.row?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Name!");
              }}
              options={{ message: "Copied Name!" }}
              text={params?.row?.companyname}
            >
              <ListItemText primary={params?.row?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 130,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,

      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vemployeestatus") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                window.open(
                  `/view/${params.row.id}/${
                    tableName === "Employee" ? "employeestatus" : "internstatus"
                  }`,
                  "_blank"
                );
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
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
      resonablestatus: item.resonablestatus,
      userstatus: item.userstatus,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      companyname: item.companyname,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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

  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  const [selectedOptionsDesignation, setSelectedOptionsDesignation] = useState(
    []
  );
  let [valueDesignationCat, setValueDesignationCat] = useState([]);

  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    // fetchBranchAll(options)
  };

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    // fetchUnitAll(options)
  };

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    // fetchTeamAll(options)
    filterTeam(options);
  };
  const handleDesignationChange = (options) => {
    let opt = options.map((a, index) => {
      return a.value;
    });

    setValueDesignationCat(opt);
    setSelectedOptionsDesignation(options);
    // fetchTeamAll(options)
    filterTeam(selectedOptionsUnit, opt);
  };

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };
  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };
  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };
  const customValueRendererDesignation = (
    valueDesignationCat,
    _categoryname
  ) => {
    return valueDesignationCat?.length
      ? valueDesignationCat.map(({ label }) => label)?.join(", ")
      : "Please Select Designation";
  };
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };
  const [
    departmentanddesignationgroupings,
    setDepartmentanddesignationgroupings,
  ] = useState([]);
  const [
    departmentanddesignationgroupingsall,
    setDepartmentanddesignationgroupingsall,
  ] = useState([]);
  const fetchDeptandDesignationGrouping = async () => {
    try {
      let res_status = await axios.get(
        SERVICE.DEPARTMENTANDDESIGNATIONGROUPING,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let filterdept = res_status?.data?.departmentanddesignationgroupings;
      // ?.filter((data) => data?.designation === designation)
      // ?.map((item) => item.department);
      setDepartmentanddesignationgroupingsall(filterdept);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [filteredTeam, setFilteredTeam] = useState([]);
  const [designations, setDesignations] = useState([]);
  const filterTeam = async (selectedUnits, selecteddesignation) => {
    try {
      if (selectedUserType === "Employee") {
        setFilteredTeam(
          Array.from(
            new Set(
              allTeam
                ?.filter(
                  (comp) =>
                    selectedOptionsBranch
                      .map((item) => item.value)
                      .includes(comp.branch) &&
                    selectedUnits.map((item) => item.value).includes(comp.unit)
                )
                ?.map((com) => com.teamname)
            )
          ).map((teamname) => ({
            label: teamname,
            value: teamname,
          }))
        );
      } else {
        let filterdept = departmentanddesignationgroupingsall
          ?.filter((data) => selecteddesignation?.includes(data?.designation))
          ?.map((item) => item.department);
        console.log(filterdept);
        setFilteredTeam(
          Array.from(
            new Set(
              allTeam
                ?.filter(
                  (comp) =>
                    selectedOptionsBranch
                      .map((item) => item.value)
                      .includes(comp.branch) &&
                    selectedUnits
                      .map((item) => item.value)
                      .includes(comp.unit) &&
                    filterdept?.includes(comp.department)
                )
                ?.map((com) => com.teamname)
            )
          ).map((teamname) => ({
            label: teamname,
            value: teamname,
          }))
        );
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchDesignationDropdowns = async () => {
    try {
      let res_category = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const desigall = [
        ...res_category?.data?.designation.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setDesignations(desigall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //add function
  const sendRequest = async () => {
    setLoader(true);

    setisBtnFilter(true);
    try {
      if (selectedUserType === "Candidate") {
        let res = await axios.post(
          SERVICE.CANDIDATESTATUS_FILTER,
          {
            overallstatus: valueCate,
            checked,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        setTableName("Candidate");
        setCandidateDatas(res?.data?.candidates);
        setEmployees([]);
        setisBtnFilter(false);
        setLoader(false);
      } else {
        let subprojectscreate = await axios.post(SERVICE.GETFILTEREUSERDATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: valueCompanyCat,
          branch: valueBranchCat,
          unit: valueUnitCat,
          team: valueTeamCat,
          status: valueCate,
          isCurrentStatus: checked,
          filterin: selectedUserType,
        });

        let ans = subprojectscreate?.data?.filterallDatauser;

        setTableName(subprojectscreate?.data?.tableName);

        setEmployees(ans);
        setCandidateDatas([]);
        setisBtnFilter(false);
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
      setisBtnFilter(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    // setIsActive(true)
    if (
      (selectedUserType === "Employee" || selectedUserType === "Internship") &&
      selectedOptionsCompany.length === 0 &&
      selectedOptionsBranch.length === 0 &&
      selectedOptionsUnit.length === 0 &&
      selectedOptionsTeam.length === 0 &&
      selectedOptionsCate.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Any One Field"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      selectedUserType === "Candidate" &&
      selectedOptionsCate.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Candidate Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsCompany([]);
    setValueCompanyCat([]);
    setValueBranchCat([]);
    setValueUnitCat([]);
    setSelectedOptionsDesignation([]);
    setValueDesignationCat([]);
    setValueTeamCat([]);
    setSelectedOptionsCate([]);
    setValueCate([]);
    setEmployees([]);
    setCandidateDatas([]);
    setStatusDropDown(empintstatus);
    setChecked(false);
    setTableName("Employee");
    setSelectedUserType("Employee");
    setClearOpenalert(true);
    setTimeout(() => {
      setClearOpenalert(false);
      // setisBtnClear(false)
    }, 1000);
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={`${tableName} Detail Status`} />
      {/* ****** Header Content ****** */}
      <Typography
        sx={userStyle.HeaderText}
      >{`${tableName} Detail Status`}</Typography>

      {isUserRoleCompare?.includes("aemployeestatus") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>
                    {`${tableName} Detail Status`}
                  </Typography>
                </Grid>

                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>User Type Filter</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={[
                        { label: "Employee", value: "Employee" },
                        { label: "Internship", value: "Internship" },
                        { label: "Candidate", value: "Candidate" },
                      ]}
                      value={{
                        label: selectedUserType,
                        value: selectedUserType,
                      }}
                      onChange={(e) => {
                        setSelectedUserType(e.value);

                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);

                        setSelectedOptionsBranch([]);
                        setValueBranchCat([]);
                        setValueUnitCat([]);
                        setValueTeamCat([]);
                        setSelectedOptionsUnit([]);
                        setSelectedOptionsTeam([]);
                        setSelectedOptionsDesignation([]);
                        setValueDesignationCat([]);
                        setSelectedOptionsCate([]);
                        setValueCate([]);
                        setChecked(false);
                        if (e.value === "Candidate") {
                          setStatusDropDown(candidateStatus);
                        } else {
                          setStatusDropDown(
                            e.value === "Employee"
                              ? empintstatus
                              : [...empintstatus, ...intstatus]
                          );
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                {(selectedUserType === "Employee" ||
                  selectedUserType === "Internship") && (
                  <>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={isAssignBranch
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
                            setSelectedOptionsBranch([]);
                            setValueBranchCat([]);
                            setValueUnitCat([]);
                            setValueTeamCat([]);
                            setSelectedOptionsUnit([]);
                            setSelectedOptionsTeam([]);
                            setSelectedOptionsCate([]);
                            setValueCate([]);
                            setSelectedOptionsDesignation([]);
                            setValueDesignationCat([]);
                          }}
                          valueRenderer={customValueRendererCompany}
                          labelledBy="Please Select Company"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>Branch</Typography>
                        <MultiSelect
                          options={isAssignBranch
                            ?.filter((comp) => {
                              let datas = selectedOptionsCompany?.map(
                                (item) => item?.value
                              );
                              return datas?.includes(comp.company);
                            })
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
                            setSelectedOptionsTeam([]);
                            setSelectedOptionsUnit([]);
                            setValueUnitCat([]);
                            setSelectedOptionsDesignation([]);
                            setValueDesignationCat([]);
                            setValueTeamCat([]);
                            setSelectedOptionsCate([]);
                            setValueCate([]);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>Unit</Typography>
                        <MultiSelect
                          options={isAssignBranch
                            ?.filter((comp) => {
                              let compdatas = selectedOptionsCompany?.map(
                                (item) => item?.value
                              );
                              let branchdatas = selectedOptionsBranch?.map(
                                (item) => item?.value
                              );
                              return (
                                compdatas?.includes(comp.company) &&
                                branchdatas?.includes(comp.branch)
                              );
                            })
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
                            setValueTeamCat([]);
                            setSelectedOptionsTeam([]);
                            setSelectedOptionsCate([]);
                            setValueCate([]);
                            setSelectedOptionsDesignation([]);
                            setValueDesignationCat([]);
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                    {selectedUserType === "Internship" && (
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>Designation</Typography>
                          <MultiSelect
                            options={designations}
                            value={selectedOptionsDesignation}
                            onChange={(e) => {
                              handleDesignationChange(e);
                              setValueTeamCat([]);
                              setSelectedOptionsTeam([]);
                              setSelectedOptionsCate([]);
                              setValueCate([]);
                            }}
                            valueRenderer={customValueRendererDesignation}
                            labelledBy="Please Select Designation"
                          />
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>Team</Typography>
                        <MultiSelect
                          // options={allTeam
                          //   ?.filter((comp) => {
                          //     let compdatas = selectedOptionsCompany?.map(
                          //       (item) => item?.value
                          //     );
                          //     let branchdatas = selectedOptionsBranch?.map(
                          //       (item) => item?.value
                          //     );
                          //     let unitdatas = selectedOptionsUnit?.map(
                          //       (item) => item?.value
                          //     );
                          //     return (
                          //       compdatas?.includes(comp.company) &&
                          //       branchdatas?.includes(comp.branch) &&
                          //       unitdatas?.includes(comp.unit)
                          //     );
                          //   })
                          //   ?.map((data) => ({
                          //     label: data.teamname,
                          //     value: data.teamname,
                          //   }))
                          //   .filter((item, index, self) => {
                          //     return (
                          //       self.findIndex(
                          //         (i) =>
                          //           i.label === item.label &&
                          //           i.value === item.value
                          //       ) === index
                          //     );
                          //   })}
                          options={filteredTeam}
                          value={selectedOptionsTeam}
                          onChange={(e) => {
                            handleTeamChange(e);
                            setSelectedOptionsCate([]);
                            setValueCate([]);
                          }}
                          valueRenderer={customValueRendererTeam}
                          labelledBy="Please Select Team"
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {selectedUserType}{" "}
                      {selectedUserType !== "Candidate" && checked
                        ? "Current "
                        : ""}
                      Status
                      {selectedUserType === "Candidate" && (
                        <b style={{ color: "red" }}>*</b>
                      )}
                    </Typography>
                    <MultiSelect
                      options={statusDropDown}
                      value={selectedOptionsCate}
                      onChange={handleCategoryChange}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Employee Status"
                    />
                  </FormControl>
                  {selectedUserType === "Candidate" && (
                    <FormControlLabel
                      control={
                        <Checkbox checked={checked} onChange={handleChange} />
                      }
                      label="For Final Status"
                    />
                  )}
                  {selectedUserType !== "Candidate" && (
                    <FormControlLabel
                      control={
                        <Checkbox checked={checked} onChange={handleChange} />
                      }
                      label={`${selectedUserType} Current Status`}
                    />
                  )}
                </Grid>
              </Grid>
              <br /> <br />
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isBtnFilter}
                  >
                    Filter
                  </Button>

                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      <br />

      {loader ? (
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
        <>
          {isUserRoleCompare?.includes("lemployeestatus") && (
            <>
              {tableName === "Candidate" ? (
                <CandidateStatusTable candidateDatas={candidateDatas} />
              ) : (
                <Box sx={userStyle.container}>
                  {/* ******************************************************EXPORT Buttons****************************************************** */}
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      {`${tableName} Detail Status`}
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
                          {/* <MenuItem value={(employees?.length)}>All</MenuItem> */}
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
                        {isUserRoleCompare?.includes("excelemployeestatus") && (
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
                        {isUserRoleCompare?.includes("csvemployeestatus") && (
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
                        {isUserRoleCompare?.includes("printemployeestatus") && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleprint}
                            >
                              &ensp;
                              <FaPrint />
                              &ensp;Print&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("pdfemployeestatus") && (
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
                        {isUserRoleCompare?.includes("imageemployeestatus") && (
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleCaptureImage}
                          >
                            {" "}
                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                            &ensp;Image&ensp;{" "}
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
                  <Button
                    sx={userStyle.buttongrp}
                    onClick={handleShowAllColumns}
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
                  &ensp;
                  <br />
                  <br />
                  <Box
                    style={{
                      width: "100%",
                      overflowY: "hidden", // Hide the y-axis scrollbar
                    }}
                  >
                    <StyledDataGrid
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
                  </Box>
                </Box>
              )}
            </>
          )}
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

      <Box>
        <Dialog
          // open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6"></Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Clear DIALOG */}
      <Dialog
        open={isClearOpenalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            padding: "37px 23px",
            width: "350px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Cleared Successfully👍</b>
          </Typography>
        </DialogContent>
      </Dialog>

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

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Status </StyledTableCell>
              <StyledTableCell>Current Status </StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Name </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell> {row.resonablestatus}</StyledTableCell>
                  <StyledTableCell> {row.userstatus}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell>{row.unit} </StyledTableCell>
                  <StyledTableCell>{row.team} </StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
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
          {fileFormat === "xl" ? (
            <>
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

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
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

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
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
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmployeeDetailStatus;