import BlockIcon from "@mui/icons-material/Block";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ErrorIcon from "@mui/icons-material/Error";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import PauseIcon from "@mui/icons-material/Pause";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import CandidateStatusTable from "./CandidateStatusTable";

import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";

import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function EmployeeDetailStatus() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

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

  let exportColumnNames = [
    "Staus",
    "CurrentStaus",
    "Company",
    "Branch",
    "Unit",
    "Team", "WorkMode",
    "Empcode",
    "Name",
  ];
  let exportRowValues = [
    "resonablestatus",
    "userstatus",
    "company",
    "branch",
    "unit",
    "team", "workmode",
    "empcode",
    "companyname",
  ];

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
    pageName,
    setPageName,
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

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Employee Status"),
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
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


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, `${tableName} Detail Status.png`);
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
      : `Please Select ${selectedUserType} ${selectedUserType !== "Candidate" && checked ? "Current" : ""
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
    team: true, workmode: true,
    empcode: true,
    companyname: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

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

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${tableName} Detail Status`,
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(employees);
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
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "resonablestatus",
      headerName: "Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.resonablestatus,
      headerClassName: "bold-header",
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <>
          {params?.data?.resonablestatus && (
            <StatusButton status={params.data.resonablestatus} />
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
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => renderStatus(params?.data.userstatus),
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
      field: "workmode",
      headerName: "WorkMode",
      flex: 0,
      width: 150,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.empcode} />
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vemployeestatus") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                window.open(
                  `/view/${params.data.id}/${tableName === "Employee" ? "employeestatus" : "internstatus"
                  }`,
                  "_blank"
                );
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
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
      workmode: item.workmode,
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
    departmentanddesignationgroupingsall,
    setDepartmentanddesignationgroupingsall,
  ] = useState([]);
  const fetchDeptandDesignationGrouping = async () => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [filteredTeam, setFilteredTeam] = useState([]);
  const [designations, setDesignations] = useState([]);
  const filterTeam = async (selectedUnits, selecteddesignation) => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchDesignationDropdowns = async () => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //add function
  const sendRequest = async () => {
    setLoader(true);

    setisBtnFilter(true);
    setPageName(!pageName);
    try {
      setSearchQuery("");
      setSearchedString("");
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
        let data = res?.data?.candidates?.filter((item) =>
          accessbranch.some(
            (branch) =>
              branch.company === item.company && branch.branch === item.branch
          )
        );
        setCandidateDatas(data);

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

        let ans = subprojectscreate?.data?.filterallDatauser?.filter((item) =>
          accessbranch.some(
            (branch) =>
              branch.company === item.company &&
              branch.branch === item.branch &&
              branch.unit === item.unit
          )
        );

        setTableName(subprojectscreate?.data?.tableName);

        setEmployees(ans?.map((item, index) => ({
          _id: item?._id,
          serialNumber: index + 1,
          resonablestatus:
            item?.resonablestatus === undefined ? "Live" : item?.resonablestatus,
          company: item?.company,
          userstatus: item.userstatus,
          branch: item?.branch,
          unit: item?.unit,
          team: item?.team,
          workmode: item?.workmode,
          empcode: item?.empcode,
          companyname: item?.companyname,
        })));
        setCandidateDatas([]);
        setisBtnFilter(false);
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
      setisBtnFilter(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      setPopupContentMalert("Please Select Any One Field!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedUserType === "Candidate" &&
      selectedOptionsCate.length === 0
    ) {
      setPopupContentMalert("Please Select Candidate Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
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
    setFilteredRowData([])
    setFilteredChanges(null)
    setTableName("Employee");
    setSelectedUserType("Employee");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={`${tableName} Detail Status`} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title={`${tableName} Detail Status`}
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Status Details"
        subsubpagename="Employee Status"
      />

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
                            options={accessbranch
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
                            options={accessbranch
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
                    {checked && selectedUserType !== "Candidate" ?
                      <Selects
                        maxMenuHeight={300}
                        options={statusDropDown}
                        value={selectedOptionsCate}
                        onChange={(e) => {
                          setValueCate([e.value]);
                          setSelectedOptionsCate(e);
                        }}
                      /> : <MultiSelect
                        options={statusDropDown}
                        value={selectedOptionsCate}
                        onChange={handleCategoryChange}
                        valueRenderer={customValueRendererCate}
                        labelledBy="Please Select Employee Status"
                      />}

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
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                    disabled={isBtnFilter}
                  >
                    Filter
                  </Button>

                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
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
                          <MenuItem value={employees?.length}>All</MenuItem>
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
                      <AggregatedSearchBar
                        columnDataTable={columnDataTable}
                        setItems={setItems}
                        addSerialNumber={addSerialNumber}
                        setPage={setPage}
                        maindatas={employees}
                        setSearchedString={setSearchedString}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        paginated={false}
                        totalDatas={employees}
                      />
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
                    itemsList={employees}
                  />
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

      {/* EXTERNAL COMPONENTS -------------- START */}
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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={employees ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default EmployeeDetailStatus;
