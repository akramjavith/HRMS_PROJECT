import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import WarningIcon from "@mui/icons-material/Warning";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import AlertDialog from "../../../components/Alert";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import EmployeeExportData from "../../../components/EmployeeExport";
import InfoPopup from "../../../components/InfoPopup.js";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import jsPDF from "jspdf";

const LoadingBackdrop = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        position: "fixed", // Changed to absolute
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1000,
      }}
      open={open}
    >
      <div className="pulsating-circle">
        <CircularProgress color="inherit" className="loading-spinner" />
      </div>
      <Typography
        variant="h6"
        sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
      >
        Loading, please wait...
      </Typography>
    </Backdrop>
  );
};

function EmployeeList() {
  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };
  const [isLoading, setIsLoading] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const [employees, setEmployees] = useState([]);
  const [employeesExcel, setEmployeesExcel] = useState([]);
  const [deleteuser, setDeleteuser] = useState([]);
  const [useredit, setUseredit] = useState([]);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const [checkemployeelist, setcheckemployeelist] = useState(false);
  const { auth } = useContext(AuthContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Employee List.png");
        });
      });
    }
  };
  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => {
    setisDeleteOpen(true);
  };
  const handleCloseDel = () => {
    setisDeleteOpen(false);
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
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
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
    actions: true,
    serialNumber: true,
    status: true,
    percentage: true,
    empcode: true,
    companyname: true,
    username: true,
    email: true,
    branch: true,
    unit: true,
    team: true,
    shift: true,
    experience: true,
    doj: true,
    expmode: true,
    expval: true,
    endexp: true,
    endexpdate: true,
    endtar: true,
    endtardate: true,
    checkbox: true,
    profileimage: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  let userid = deleteuser?._id;
  //set function to get particular row
  const [checkProject, setCheckProject] = useState();
  const [checkTask, setCheckTask] = useState();
  const rowData = async (id, username) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteuser(res?.data?.suser);
      let resdev = await axios.post(SERVICE.USERPROJECTCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkprojectouser: String(username),
      });
      setCheckProject(resdev?.data?.projects);
      let restask = await axios.post(SERVICE.USERTTASKCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkusertotask: String(username),
      });
      setCheckTask(restask?.data?.tasks);
      if (
        resdev?.data?.projects?.length > 0 ||
        restask?.data?.tasks?.length > 0
      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpendel();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchEmployee = async () => {
    console.time("fetchEmployee"); // Start the timer for fetchEmployee
    try {
      // Fetch both employee data and profile images in parallel
      const [resEmployee, resImages] = await Promise.all([
        axios.post(
          SERVICE.USERSWITHSTATUS,
          { pageName: "Employee" },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),
        axios.get(SERVICE.GETPROFILES, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      // Extract employee data and profile images
      const employees = resEmployee?.data?.allusers || [];
      const empDocs = resImages?.data?.alldocuments || [];
      // Create a Map for profile images for quick lookups
      const profileImageMap = new Map(
        empDocs.map((item) => [item?.commonid, item?.profileimage || ""])
      );
      // Merge employee data with profile images
      const showData = employees.map((data) => ({
        ...data,
        profileimage: profileImageMap.get(data?._id) || "",
      }));
      setcheckemployeelist(true);
      setEmployees(showData);
      console.timeEnd("fetchEmployee"); // End the timer for fetchEmployee
    } catch (err) {
      setcheckemployeelist(true);
      const messages = err?.response?.data?.message || "Something went wrong!";
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
        </>
      );
      handleClickOpenerr();
    }
  };
  const delAddemployee = async () => {
    try {
      let del = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchEmployee();
      setPage(1);
      handleCloseDel();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUseredit(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  let updateby = useredit?.updatedby;
  let addedby = useredit?.addedby;
  //------------------------------------------------------
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  console.log(isFilterOpen);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
    setIsLoading(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const calculateExperience = (doj) => {
    const startDate = new Date(doj);
    const currentDate = new Date();
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += currentDate.getMonth();
    return Math.max(0, months);
  };
  const exportColumnNames = [
    "S.No",
    "Status",
    "Empcode",
    "Employee Name",
    "Username",
    "Email",
    "Branch",
    "Unit",
    "Team",
    "Experience",
    "DOJ",
    "Image",
  ];
  const exportRowValues = [
    "serialNumber",
    "status",
    "empcode",
    "companyname",
    "username",
    "email",
    "branch",
    "unit",
    "team",
    "experience",
    "doj",
    "imageBase64",
  ];
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Employeelist",
    pageStyle: "print",
  });
  useEffect(() => {
    fetchEmployee();
  }, []);
  const [items, setItems] = useState([]);
  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => {
      const lastExpLog =
        item?.assignExpLog?.length > 0
          ? item.assignExpLog[item.assignExpLog.length - 1]
          : {};
      return {
        ...item,
        _id: item._id,
        serialNumber: index + 1,
        status: item.status || "",
        empcode: item.empcode || "",
        companyname: item.companyname || "",
        username: item.username || "",
        email: item.email || "",
        branch: item.branch || "",
        unit: item.unit || "",
        team: item.team || "",
        experience: calculateExperience(item.doj),
        doj: item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
        dob: item.dob ? moment(item.dob).format("DD-MM-YYYY") : "",
        dot: item.dot ? moment(item.dob).format("DD-MM-YYYY") : "",
        dom: item.dom ? moment(item.dom).format("DD-MM-YYYY") : "",
        mode: lastExpLog.expmode || "",
        value: lastExpLog.expval || "",
        endexp: lastExpLog.endexp || "",
        endexpdate: lastExpLog.endexpdate
          ? moment(lastExpLog.endexpdate).format("DD-MM-YYYY")
          : "",
        endtar: lastExpLog.endtar || "",
        endtardate: lastExpLog.endtardate
          ? moment(lastExpLog.endtardate).format("DD-MM-YYYY")
          : "",
        profileimage: item?.profileimage,
      };
    });
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber();
  }, [employees]);
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
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
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
            if (rowDataTable?.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable?.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows?.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows?.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData?.length
            );
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
      headerName: "S.No",
      flex: 0,
      width: 90,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      renderCell: (params) => renderStatus(params?.row.status),
      hide: !columnVisibility.status,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
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
                handleCopy("Copied Empcode!");
              }}
              options={{ message: "Copied Empcode!" }}
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
      headerName: "Employee Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
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
                handleCopy("Copied Employee Name!");
              }}
              options={{ message: "Copied Employee Name!" }}
              text={params?.row?.companyname}
            >
              <ListItemText primary={params?.row?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.username,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.email,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.team,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "doj",
      headerName: "Doj",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.doj,
    },
    {
      field: "expmode",
      headerName: "Mode",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.expmode,
    },
    {
      field: "expval",
      headerName: "Value",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.expval,
    },
    {
      field: "endexp",
      headerName: "End Exp",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.endexp,
    },
    {
      field: "endexpdate",
      headerName: "End-Exp Date",
      flex: 0,
      width: 110,
      minHeight: "40px",
      hide: !columnVisibility.endexpdate,
    },
    {
      field: "endtar",
      headerName: "End Tar",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.endtardate,
    },
    {
      field: "endtardate",
      headerName: "End-Tar Date",
      flex: 0,
      width: 110,
      minHeight: "40px",
      hide: !columnVisibility.endtardate,
    },
    {
      field: "profileimage",
      headerName: "Profile",
      flex: 0,
      width: 100,
      hide: !columnVisibility.profileimage,
      headerClassName: "bold-header",
      renderCell: (params) => {
        return params.value !== "" ? (
          <img
            src={params.value}
            alt="Profile"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <></>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 200,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <>
          {!isUserRoleCompare.includes("Manager") ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes("elist") && (
                    <a
                      href={`/edit/${params.row.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        style={userStyle.actionbutton}
                      >
                        <EditIcon style={{ fontSize: "20px" }} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("dlist") && (
                    <Link to="">
                      <Button
                        size="small"
                        variant="outlined"
                        style={userStyle.actionbutton}
                        onClick={(e) => {
                          rowData(params.row.id, params.row.username);
                        }}
                      >
                        <DeleteIcon style={{ fontSize: "20px" }} />
                      </Button>
                    </Link>
                  )}
                  {isUserRoleCompare?.includes("vlist") && (
                    <a
                      href={`/view/${params.row.id}/employee`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        style={userStyle.actionbutton}
                      >
                        <VisibilityIcon style={{ fontSize: "20px" }} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("ilist") && (
                    <Link to="">
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          getinfoCode(params.row.id);
                        }}
                      >
                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
                      </Button>
                    </Link>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("vlist") && (
                  <Link
                    to={`/view/${params.row.id}`}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      style={userStyle.actionbutton}
                    >
                      <VisibilityIcon style={{ fontSize: "20px" }} />
                    </Button>
                  </Link>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];
  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      status: item.status,
      empcode: item.empcode,
      nexttime: item.nexttime,
      companyname: item.companyname,
      username: item.username,
      email: item.email,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      shift: item.shift,
      profileimage: item.profileimage,
      experience: item?.experience,
      expmode: item?.mode,
      expval: item?.value,
      endexp: item?.endexp,
      endexpdate: item?.endexpdate,
      endtar: item?.endtar,
      endtardate: item?.endtardate,
      doj: item?.doj,
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

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable?.filter((column) =>
    column?.headerName
      ?.toLowerCase()
      ?.includes(searchQueryManage?.toLowerCase())
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
          {filteredColumns?.map((column) => (
            <ListItem key={column?.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column?.field]}
                    onChange={() => toggleColumnVisibility(column?.field)}
                  />
                }
                secondary={column?.headerName}
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
    </div>
  );

  const downloadPdf = async (isfilter) => {
    try {
      const doc = new jsPDF({ orientation: "landscape" });

      // Define the table headers
      const headers = [
        "SNo",
        "Name of the Employee",
        "Employee Identification No",
        "Gender",
        "Father/Spouse Name",
        "Date of Birth",
        "Date of entry into Service",
        "Designation",
        "Present Address",
        "Permanent Address",
        "Employee PF No",
        "Employee ESIC No",
        "Aadhar No",
        "Date on which completion of 480 days of services",
        "Date on which made permanent",
        "Period of suspension if any",
        "Bank A/c No, Name of the Bank, Bank IFSC",
        "Mobile No",
        "e-mail",
        "Specimen Signature/Thumb impression",
        "Date of Exit",
        "Reason For Exit",
        "Remarks",
        "Photo",
      ];

      // Function to generate table data
      const generateTableData = (rowData) => {
        return rowData.map((row, index) => [
          index + 1,
          row.username,
          row.empcode,
          row.gender,
          row.fathername,
          row.dob,
          row.entryDate,
          row.designation,
          `${row.pdoorno},${row.pstreet},${row.parea},${row.pcity},${row.pstate},${row.ppincode}`,
          `${row.cdoorno},${row.cstreet},${row.carea},${row.ccity},${row.cstate},${row.cpincode}`,
          row.pfNo,
          row.esicNo,
          row.aadhar,
          row.completion480Days,
          row.permanentDate,
          row.suspensionPeriod,
          row.bankDetails,
          row.emergencyno,
          row.email,
          row.specimenSignature,
          row.exitDate,
          row.exitReason,
          row.remarks,
          // Store the base64 image string with index
          row.profileimage && { imageBase64: row.profileimage, index: index },
        ]);
      };

      // Prepare data based on filter
      let tableData = [];
      if (isfilter === "filtered") {
        tableData = generateTableData(filteredData);
      } else {
        tableData = generateTableData(rowDataTable);
      }

      const addHeader = () => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("FORM-U", 130, 10);
        doc.text("EMPLOYEE REGISTER", 115, 15);
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text("[See sub-rule(1) of rule(16)]", 125, 18);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(
          "TTS BUSINESS SERVICES PRIVATE LIMITED, NO 39, VAIGANALLUR AGRAHARAM, KULITHALAI-639104",
          65,
          25
        );
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Name and Address of the Establishment:", 5, 25);
        doc.text("Register Certificate No:", 5, 30);
      };
      console.log(tableData);

      const loadImage = (imageBase64) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imageBase64;
        });
      };

      const loadedImages = await Promise.all(
        tableData.map((row, index) => {
          console.log(row[row.length - 1].imageBase64);
          if (row[row.length - 1].imageBase64) {
            console.log(
              loadImage(row[row.length - 1].imageBase64).then((img) => ({
                img,
                index,
              }))
            );
            return loadImage(row[row.length - 1].imageBase64).then((img) => ({
              img,
              index,
            }));
          } else {
            return { index };
          }
        })
      );

      console.log(loadedImages);
      const rowHeight = 10; // Set desired row height

      const addTable = async () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 5; // Left and right margin
        const availableWidth = pageWidth - margin * 2; // Available width for the table
        const columnCount = headers.length;
        const columnWidth = availableWidth / columnCount; // Distribute the available width equally among columns

        doc.autoTable({
          theme: "grid",
          styles: { fontSize: 5, cellPadding: 0.5, minCellHeight: 1 },
          headStyles: {
            fontSize: 5,
            fillColor: [25, 118, 210],
            textColor: [255, 255, 255],
            halign: "center",
            valign: "middle",
          },
          head: [headers],
          body: tableData, // Exclude the image column from data
          startY: 40,
          margin: { top: 20, left: margin, right: margin, bottom: 10 },
          columnStyles: {
            0: { cellWidth: 5 }, // SNo
            1: { cellWidth: columnWidth }, // Name of the Employee
            2: { cellWidth: columnWidth }, // Employee Identification No
            3: { cellWidth: columnWidth }, // Gender
            4: { cellWidth: columnWidth }, // Father/Spouse Name
            5: { cellWidth: columnWidth }, // Date of Birth
            6: { cellWidth: columnWidth }, // Date of entry into Service
            7: { cellWidth: columnWidth }, // Designation
            8: { cellWidth: columnWidth }, // Present Address
            9: { cellWidth: columnWidth }, // Permanent Address
            10: { cellWidth: columnWidth }, // Employee PF No
            11: { cellWidth: columnWidth }, // Employee ESIC No
            12: { cellWidth: columnWidth }, // Aadhar No
            13: { cellWidth: columnWidth }, // Date on which completion of 480 days of services
            14: { cellWidth: columnWidth }, // Date on which made permanent
            15: { cellWidth: columnWidth }, // Period of suspension if any
            16: { cellWidth: columnWidth }, // Bank A/c No, Name of the Bank, Bank IFSC
            17: { cellWidth: columnWidth }, // Mobile No
            18: { cellWidth: columnWidth }, // e-mail
            19: { cellWidth: columnWidth }, // Specimen Signature/Thumb impression
            20: { cellWidth: columnWidth }, // Date of Exit
            21: { cellWidth: columnWidth }, // Reason For Exit
            22: { cellWidth: columnWidth }, // Remarks
            23: { cellWidth: columnWidth }, // Photo
          },
          pageBreak: "auto",
          rowPageBreak: "auto",
          showHead: "everyPage",
          bodyStyles: { valign: "middle" },
          didDrawCell: (data) => {
            console.log(data);
            // Ensure that the cell belongs to the body section and it's the image column
            if (
              data.section === "body" &&
              data.column.index === headers.length - 1
            ) {
              const imageInfo = loadedImages.find(
                (image) => image?.index === data.row.index
              );
              console.log(imageInfo);
              if (imageInfo?.img) {
                const imageHeight = 10; // Desired image height
                const imageWidth = 10; // Desired image width
                const xOffset = (data.cell.width - imageWidth) / 2; // Center the image horizontally
                const yOffset = (rowHeight - imageHeight) / 2; // Center the image vertically

                doc.addImage(
                  imageInfo.img,
                  "PNG",
                  data.cell.x + xOffset,
                  data.cell.y + yOffset,
                  imageWidth,
                  imageHeight
                );

                // Adjust cell styles to increase height
                data.cell.height = rowHeight; // Set custom height
              } else {
                // Clear cell content if no image
                data.cell.text = ""; // Clear the cell text
              }
            }
          },
          didDrawPage: (data) => {
            const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
            const totalPages = Math.ceil(tableData.length / 10);
            if (pageNumber < totalPages) {
              doc.addPage({ orientation: "landscape" });
              addHeader();
            }
          },
        });
      };

      addHeader();
      await addTable();
      doc.save("Labour Office.pdf");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box>
        <NotificationContainer />
        <Headtitle title={"EMPLOYEE LIST"} />
        {/* ****** Header Content ****** */}
        <Typography sx={userStyle.HeaderText}>Employee Details</Typography>
        <br />
        {isUserRoleCompare?.includes("llist") && (
          <>
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Employees List
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {isUserRoleCompare?.includes("alist") && (
                    <>
                      <Link
                        to="/addemployee"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          float: "right",
                        }}
                      >
                        <Button variant="contained">ADD</Button>
                      </Link>
                    </>
                  )}
                </Grid>
              </Grid>
              <br />
              <br />
              <Box>
                {checkemployeelist ? (
                  <>
                    <Grid container sx={{ justifyContent: "center" }}>
                      <Grid>
                        {isUserRoleCompare?.includes("excellist") && (
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
                        {isUserRoleCompare?.includes("csvlist") && (
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
                        {isUserRoleCompare?.includes("printlist") && (
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
                        {isUserRoleCompare?.includes("pdflist") && (
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
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={() => {
                                downloadPdf("filtered");
                                // setIsPdfFilterOpen(true);
                              }}
                            >
                              <FaFilePdf />
                              &ensp;Labour Office PDF&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("imagelist") && (
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
                    <br />
                    <Grid container spacing={1}>
                      <Grid item md={6} xs={12} sm={12}>
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
                            onClick={handleShowAllColumns}
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
                        rowHeight={100}
                      />
                    </Box>
                    <br />
                    <Box style={userStyle.dataTablestyle}>
                      <Box>
                        Showing{" "}
                        {filteredData.length > 0
                          ? (page - 1) * pageSize + 1
                          : 0}{" "}
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
                  </>
                ) : (
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
                )}
              </Box>
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
        {/* Check Modal */}
        <Box>
          <>
            <Box>
              {/* ALERT DIALOG */}
              <Dialog
                open={isCheckOpen}
                onClose={handleCloseCheck}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent
                  sx={{
                    width: "350px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "80px", color: "orange" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "black", textAlign: "center" }}
                  >
                    {checkProject?.length > 0 && checkTask?.length > 0 ? (
                      <>
                        <span
                          style={{ fontWeight: "700", color: "#777" }}
                        >{`${deleteuser?.username} `}</span>
                        was linked in{" "}
                        <span style={{ fontWeight: "700" }}>
                          Project & Task
                        </span>{" "}
                      </>
                    ) : checkProject?.length > 0 ? (
                      <>
                        <span
                          style={{ fontWeight: "700", color: "#777" }}
                        >{`${deleteuser?.username} `}</span>{" "}
                        was linked in{" "}
                        <span style={{ fontWeight: "700" }}>Project</span>
                      </>
                    ) : checkTask?.length > 0 ? (
                      <>
                        <span
                          style={{ fontWeight: "700", color: "#777" }}
                        >{`${deleteuser?.username} `}</span>{" "}
                        was linked in{" "}
                        <span style={{ fontWeight: "700" }}>Task</span>
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
        </Box>
        {/* ALERT DIALOG */}
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
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <DeleteConfirmation
          open={isDeleteOpen}
          onClose={handleCloseDel}
          onConfirm={delAddemployee}
          title="Are you sure?"
          confirmButtonText="Yes"
          cancelButtonText="Cancel"
        />
        <AlertDialog
          openPopup={openPopup}
          handleClosePopup={handleClosePopup}
          popupContent={popupContent}
          popupSeverity={popupSeverity}
        />
        <EmployeeExportData
          isFilterOpen={isFilterOpen}
          handleCloseFilterMod={handleCloseFilterMod}
          fileFormat={fileFormat}
          setIsFilterOpen={setIsFilterOpen}
          isPdfFilterOpen={isPdfFilterOpen}
          setIsPdfFilterOpen={setIsPdfFilterOpen}
          handleClosePdfFilterMod={handleClosePdfFilterMod}
          filteredDataTwo={filteredData ?? []}
          itemsTwo={items ?? []}
          filename={"Employees List"}
          exportColumnNames={exportColumnNames}
          exportRowValues={exportRowValues}
          componentRef={componentRef}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
        <InfoPopup
          openInfo={openInfo}
          handleCloseinfo={handleCloseinfo}
          heading="Employee Details Info"
          addedby={addedby}
          updateby={updateby}
        />
      </Box>
      <LoadingBackdrop open={isLoading} />
    </>
  );
}

export default EmployeeList;
