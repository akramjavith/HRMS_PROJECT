import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LoadingButton from "@mui/lab/LoadingButton";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import * as faceapi from "face-api.js";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextField,
  Typography
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import "jspdf-autotable";
import debounce from "lodash.debounce";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaArrowAltCircleRight, FaEdit, FaPlus } from "react-icons/fa";
import "react-image-crop/dist/ReactCrop.css";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Resizable from "react-resizable";
import { Link, useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import "../employees/MultistepForm.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  religionOptions
} from "../../../components/Componentkeyword";
import { ConfirmationPopup } from "../../../components/DeleteConfirmation";
function EditMovietolive() {
  const backPage = useNavigate();
  const [popup, setPopup] = useState({
    open: false,
    action: "",
  });

  const handleOpenConfirmationPopup = (action) => {
    setPopup({
      open: true,
      action,
    });
  };

  const handleCloseConfirmationPopup = () => {
    setPopup({ open: false, action: "" });
  };

  const handleConfirm = (e) => {
    handleCloseConfirmationPopup();
    if (popup.action === "submit") {
      console.log("Submitting...");
      handleButtonClick(e);
    } else if (popup.action === "draft") {
      console.log("Saving as draft...");
      // handleDraftSubmit(e);
    } else if (popup.action === "cancel") {
      console.log("Cancelling...");
      backPage("/internlist");
    }
  };
  const [oldUserCompanyname, setOldUserCompanyname] = useState("")
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setUpdateLoader(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    // setUpdateLoader(false);
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    // setUpdateLoader(false);
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    // setUpdateLoader(false);
    setOpenPopup(false);
  };


  const [boardingDetails, setBoardingDetails] = useState({
    status: "Please Select Status",
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    department: "Please Select Department",
    team: "Please Select Team",
    designation: "Please Select Designation",
    shifttype: "Please Select Shift Type",
    shiftmode: "Please Select Shift Mode",
    shiftgrouping: "Please Select Shift Grouping",
    shifttiming: "Please Select Shift",
    reportingto: "Please Select Reporting To",
    workmode: "Please Select Work Mode",
  });

  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess, alldesignation, allUsersData, buttonStyles } = useContext(UserRoleAccessContext);
  const [step, setStep] = useState(1);
  const id = useParams().id;

  const [shifts, setShifts] = useState([]);
  const ShiftModeOptions = [
    { label: "Shift", value: "Shift" },
    { label: "Week Off", value: "Week Off" },
  ];

  const Typeoptions = [
    { label: "Amount Wise", value: "Amount Wise" },
    { label: "Process Wise", value: "Process Wise" },
  ];

  const salaryrangeoptions = [
    { label: "Less Than", value: "Less Than" },
    { label: "Greater Than", value: "Greater Than" },
    { label: "Between", value: "Between" },
    { label: "Exact", value: "Exact" },
  ];

  const [isErrorOpenNew, setIsErrorOpenNew] = useState(false);
  const [showAlertNew, setShowAlertNew] = useState("");
  const handleClickOpenerrNew = () => {
    setIsErrorOpenNew(true);
    setLoading(false);
  };


  const handleCloseerrNew = () => {
    setIsErrorOpenNew(false);

    backPage("/internlist");

  };

  const [isArea, setIsArea] = useState(false);
  const gridRef = useRef(null);

  const [salaryfix, setSalaryFix] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const extractNumbers = (str) => {
    const numbers = str.match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
  };

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
  const idopen = open ? "simple-popover" : undefined;

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
    totalValue: true,
    // checkbox: true,
    experience: true,
    salarycode: true,
    targetpoints: true,
    statusallot: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const extractText = (str) => {
    return str.replace(/\d+/g, "");
  };

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = salaryfix?.map((item, index) => ({
      ...item,
      experience: extractNumbers(item.salarycode),
      code: extractText(item.salarycode),
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [salaryfix]);

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

  const LoadingBackdrop = ({ open }) => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="pulsating-circle">
          <CircularProgress color="inherit" className="loading-spinner" />
        </div>
        <Typography
          variant="h6"
          sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
        >
          Please Wait...
        </Typography>
      </Backdrop>
    );
  };

  const [mailDetails, setMailDetails] = useState({
    username: "",
    quota: "1000",
    originalpassword: "",
    companyname: "",
    companyemail: ""
  })

  const [isLoading, setIsLoading] = useState(true);

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

  const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "totalValue",
      headerName: "Salary Amount",
      flex: 0,
      width: 100,
      hide: !columnVisibility.totalValue,
      headerClassName: "bold-header",
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 200,
      hide: !columnVisibility.experience,
      headerClassName: "bold-header",
    },
    {
      field: "salarycode",
      headerName: "Process Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.salarycode,
      headerClassName: "bold-header",
    },
    {
      field: "targetpoints",
      headerName: "Target Points",
      flex: 0,
      width: 200,
      hide: !columnVisibility.targetpoints,
      headerClassName: "bold-header",
    },

    {
      field: "statusallot",
      headerName: "Status",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.statusallot,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Button
            variant="contained"
            onClick={() => {
              getCodesalary(
                params.row.totalValue,
                params.row.code,
                params.row.experience,
                params.row.targetpoints
              );
            }}
          >
            Allot
          </Button>
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      totalValue: item.totalValue,
      experience: item.experience,
      salarycode: item.salarycode,
      targetpoints: item.targetPointsValue,
      code: item.code,
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
              // secondary={column.headerName }
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

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setEmployee({
      ...employee,
      type: "Please Select Type",
      salaryrange: "Please Select Salary Range",
      amountvalue: "",
      from: "",
      to: "",
    });

    setIsArea(false);
    setLoginNotAllot({
      ...loginNotAllot,
      process: "Please Select Process",
    });

    setSalaryFix([]);
    setIsEditOpen(false);
  };

  const handleCloseModEditAllot = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setEmployee({
      ...employee,
      type: "Please Select Type",
      salaryrange: "Please Select Salary Range",
      amountvalue: "",
      from: "",
      to: "",
    });
    setIsArea(false);
    setSalaryFix([]);
    setIsEditOpen(false);
  };

  const [assignExperience, setAssignExperience] = useState({
    assignExpMode: "Auto Increment",
    assignExpvalue: 0,
    assignEndExpDate: "",
    assignEndTarDate: "",
    assignEndExp: "Exp Stop",
    assignEndExpvalue: "No",
    assignEndTar: "Target Stop",
    assignEndTarvalue: "No",
    updatedate: "",
    assignTartype: "Department Month Set",
    assignExptype: "Department Month Set",
    grosssalary: "",
    modeexperience: "",
    targetexperience: "",
    endexp: "",
    endexpdate: "",
    endtar: "",
    endtardate: "",
    updatedate: "",
  });

  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedUnitCode, setSelectedUnitCode] = useState("");

  // Process allot add  details

  const [loginNotAllot, setLoginNotAllot] = useState({
    process: "Please Select Process",
    processtype: "Primary",
    processduration: "Full",

    time: "Hrs",
    timemins: "Mins",
  });

  useEffect(() => {
    workStationAutoGenerate();
  }, [
    boardingDetails?.company,
    boardingDetails?.branch,
    boardingDetails?.unit,
    boardingDetails.workmode,
    boardingDetails?.username,
    boardingDetails?.ifoffice,
    selectedBranchCode,
    selectedUnitCode,
  ]);

  const workStationAutoGenerate = async () => {
    try {
      let lastwscode;
      let lastworkstation = repotingtonames
        .filter(
          (item) =>
            // item?.workmode !== "Internship" &&
            item.company === boardingDetails?.company &&
            item.branch === boardingDetails?.branch &&
            item.unit === boardingDetails?.unit
        )
        ?.filter((item) => /_[0-9]+_/.test(item?.workstationinput));

      if (lastworkstation.length === 0) {
        lastwscode = 0;
      } else {
        let highestWorkstation = lastworkstation.reduce(
          (max, item) => {
            const num = parseInt(item.workstationinput.split("_")[1]);
            return num > max.num ? { num, item } : max;
          },
          { num: 0, item: null }
        ).num;

        lastwscode = highestWorkstation.toString().padStart(2, "0");
      }

      let autoWorkStation = `W${selectedBranchCode?.toUpperCase()}${selectedUnitCode?.toUpperCase()}_${lastwscode === 0
        ? "01"
        : (Number(lastwscode) + 1).toString().padStart(2, "0")
        }_${boardingDetails?.username?.toUpperCase()}`;

      if (
        workStationInputOldDatas?.company === boardingDetails?.company &&
        workStationInputOldDatas?.branch === boardingDetails?.branch &&
        workStationInputOldDatas?.unit === boardingDetails?.unit
        //  &&
        // workStationInputOldDatas?.workmode === boardingDetails.workmode
      ) {
        setPrimaryWorkStationInput(
          workStationInputOldDatas?.workstationinput === "" ||
            workStationInputOldDatas?.workstationinput == undefined
            ? autoWorkStation
            : workStationInputOldDatas?.workstationinput
        );
      } else {
        setPrimaryWorkStationInput(autoWorkStation);
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

  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");
  const [newstate, setnewstate] = useState(false);

  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Please Select Primary Work Station"
  );
  const [selectedWorkStation, setSelectedWorkStation] = useState("");
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
  const [enableWorkstation, setEnableWorkstation] = useState(false);
  const [enableLoginName, setEnableLoginName] = useState(true);
  const [valueWorkStation, setValueWorkStation] = useState([]);
  const [empcodelimited, setEmpCodeLimited] = useState([]);
  const [overllsettings, setOverallsettings] = useState([]);
  const [employeecodenew, setEmployeecodenew] = useState("");
  const [checkcode, setCheckcode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [maxSelections, setMaxSelections] = useState(0);
  const [maxWfhSelections, setWfhSelections] = useState(0);
  const timer = useRef();
  const [userUpdate, setUserUpdate] = useState([]);
  const [empsettings, setEmpsettings] = useState(false);
  const [branchCodeGen, setBranchCodeGen] = useState("");
  // let branchCodeGen = "";
  const [overllsettingsDefault, setOverallsettingsDefault] = useState({});
  const [empCode, setEmpCode] = useState([]);
  const [checkemployeelist, setcheckemployeelist] = useState(false);
  const [employees, setEmployees] = useState([]);

  const [finderrorindex, setFinderrorindex] = useState([]);
  const [finderrorindexgrp, setFinderrorindexgrp] = useState([]);
  const [finderrorindexshift, setFinderrorindexshift] = useState([]);

  //state and method to show current date onload
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  var hourss =
    today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
  var minutess =
    today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes;
  var secondss =
    today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds;
  var time = hourss + ":" + minutess + ":" + secondss;

  const ShiftTypeOptions = [
    { label: "Standard", value: "Standard" },
    { label: "Daily", value: "Daily" },
    { label: "1 Week Rotation (2 Weeks)", value: "1 Week Rotation" },
    { label: "2 Week Rotation (Monthly)", value: "2 Week Rotation" },
    { label: "1 Month Rotation (2 Month)", value: "1 Month Rotation" },
  ];

  const [todo, setTodo] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editTodoBackup, setEditTodoBackup] = useState(null);

  // const handleAddTodo = (value) => {
  //   if (value === "Daily") {
  //     const days = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const week = "1st Week";
  //     const newTodoList = days.map((day, index) => ({
  //       day,
  //       daycount: index + 1,
  //       week,
  //       shiftmode: "Please Select Shift Mode",
  //       shiftgrouping: "Please Select Shift Grouping",
  //       shifttiming: "Please Select Shift",
  //     }));
  //     setTodo(newTodoList);
  //   }

  //   if (value === "1 Week Rotation") {
  //     const days1 = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const days2 = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const week1 = "1st Week";
  //     const week2 = "2nd Week";
  //     const newTodoList = [
  //       ...days1.map((day, index) => ({
  //         day,
  //         daycount: index + 1,
  //         week: week1,
  //         shiftmode: "Please Select Shift Mode",
  //         shiftgrouping: "Please Select Shift Grouping",
  //         shifttiming: "Please Select Shift",
  //       })),
  //       ...days2.map((day, index) => ({
  //         day,
  //         daycount: index + 8,
  //         week: week2,
  //         shiftmode: "Please Select Shift Mode",
  //         shiftgrouping: "Please Select Shift Grouping",
  //         shifttiming: "Please Select Shift",
  //       })),
  //     ];
  //     setTodo(newTodoList);
  //   }

  //   if (value === "2 Week Rotation") {
  //     const daysInMonth = 42; // You may need to adjust this based on the actual month
  //     const days = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const weeks = [
  //       "1st Week",
  //       "2nd Week",
  //       "3rd Week",
  //       "4th Week",
  //       "5th Week",
  //       "6th Week",
  //     ]; // You may need to adjust this based on the actual month

  //     let todoList = [];
  //     let currentWeek = 1;
  //     let currentDayCount = 1;
  //     let currentDayIndex = 0;

  //     for (let i = 1; i <= daysInMonth; i++) {
  //       const day = days[currentDayIndex];
  //       const week = weeks[currentWeek - 1];

  //       todoList.push({
  //         day,
  //         daycount: currentDayCount,
  //         week,
  //         shiftmode: "Please Select Shift Mode",
  //         shiftgrouping: "Please Select Shift Grouping",
  //         shifttiming: "Please Select Shift",
  //       });

  //       currentDayIndex = (currentDayIndex + 1) % 7;
  //       currentDayCount++;
  //       if (currentDayIndex === 0) {
  //         currentWeek++;
  //       }
  //     }

  //     setTodo(todoList);
  //   }

  //   if (value === "1 Month Rotation") {
  //     const daysInMonth = 84; // You may need to adjust this based on the actual month
  //     const days = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const weeks = [
  //       "1st Week",
  //       "2nd Week",
  //       "3rd Week",
  //       "4th Week",
  //       "5th Week",
  //       "6th Week",
  //       "7th Week",
  //       "8th Week",
  //       "9th Week",
  //       "10th Week",
  //       "11th Week",
  //       "12th Week",
  //     ]; // You may need to adjust this based on the actual month

  //     let todoList = [];
  //     let currentWeek = 1;
  //     let currentDayCount = 1;
  //     let currentDayIndex = 0;

  //     for (let i = 1; i <= daysInMonth; i++) {
  //       const day = days[currentDayIndex];
  //       const week = weeks[currentWeek - 1];

  //       todoList.push({
  //         day,
  //         daycount: currentDayCount,
  //         week,
  //         shiftmode: "Please Select Shift Mode",
  //         shiftgrouping: "Please Select Shift Grouping",
  //         shifttiming: "Please Select Shift",
  //       });

  //       currentDayIndex = (currentDayIndex + 1) % 7;
  //       currentDayCount++;
  //       if (currentDayIndex === 0) {
  //         currentWeek++;
  //       }
  //     }

  //     setTodo(todoList);
  //   }
  // };

  const weekoptions2weeks = ["1st Week", "2nd Week"];
  const weekoptions1month = [
    "1st Week",
    "2nd Week",
    "3rd Week",
    "4th Week",
    "5th Week",
    "6th Week",
  ];
  const weekoptions2months = [
    "1st Week",
    "2nd Week",
    "3rd Week",
    "4th Week",
    "5th Week",
    "6th Week",
    "7th Week",
    "8th Week",
    "9th Week",
    "10th Week",
    "11th Week",
    "12th Week",
  ];

  // for attendance mode
  const attModeOptions = [
    { label: "Domain", value: "Domain" },
    { label: "Hrms-Self", value: "Hrms-Self" },
    { label: "Hrms-Manual", value: "Hrms-Manual" },
    { label: "Biometric", value: "Biometric" },
    { label: "Production", value: "Production" },
  ];

  const [selectedAttMode, setSelectedAttMode] = useState([]);
  const [valueAttMode, setValueAttMode] = useState([]);
  //att mode multiselect
  const handleAttModeChange = (options) => {
    setSelectedAttMode(options);
    setValueAttMode(options.map((a, index) => {
      return a.value;
    }))
  };

  const customValueRendererAttMode = (valueCompany, _attmode) => {
    return valueCompany?.length
      ? valueCompany.map(({ label }) => label)?.join(", ")
      : "Please Select Attendance Mode";
  };

  const [selectedOptionsCateWeeks, setSelectedOptionsCateWeeks] = useState([]);
  let [valueCateWeeks, setValueCateWeeks] = useState("");

  const handleWeeksChange = (options) => {
    setValueCateWeeks(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCateWeeks(options);
  };

  const customValueRendererCateWeeks = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Weeks";
  };

  const handleAddTodo = () => {
    if (boardingDetails.shifttype === "Please Select Shift Type") {

      setPopupContentMalert("Please Select Shift Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Stop further processing if validation fails
    } else {
      if (boardingDetails.shifttype === "Daily") {
        if (boardingDetails.shiftgrouping === "Please Select Shift Grouping") {

          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (boardingDetails.shifttiming === "Please Select Shift") {

          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {

          setPopupContentMalert("Please Select Week Off!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else {
          const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const week = "1st Week";
          const newTodoList = days.map((day, index) => ({
            day,
            daycount: index + 1,
            week,
            shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
            shiftgrouping: !valueCate.includes(day)
              ? boardingDetails.shiftgrouping
              : "",
            shifttiming: !valueCate.includes(day)
              ? boardingDetails.shifttiming
              : "",
          }));
          setTodo(newTodoList);
        }
      }

      if (boardingDetails.shifttype === "1 Week Rotation") {
        if (boardingDetails.shiftgrouping === "Please Select Shift Grouping") {

          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (boardingDetails.shifttiming === "Please Select Shift") {

          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {

          setPopupContentMalert("Please Select Weeks!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {

          setPopupContentMalert("Please Select Week Off!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else {
          const days1 = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const days2 = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const newTodoList = [
            // Check if "1st Week" is in valueCateWeeks and map days1 if true
            ...(valueCateWeeks.includes("1st Week")
              ? days1.map((day, index) => ({
                day,
                daycount: index + 1,
                week: "1st Week", // Replacing week1 with "1st Week"
                shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
                shiftgrouping: !valueCate.includes(day)
                  ? boardingDetails.shiftgrouping
                  : "",
                shifttiming: !valueCate.includes(day)
                  ? boardingDetails.shifttiming
                  : "",
              }))
              : []), // Return an empty array if "1st Week" is not in valueCateWeeks

            // Check if "2nd Week" is in valueCateWeeks and map days2 if true
            ...(valueCateWeeks.includes("2nd Week")
              ? days2.map((day, index) => ({
                day,
                daycount: index + 8,
                week: "2nd Week", // Replacing week2 with "2nd Week"
                shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
                shiftgrouping: !valueCate.includes(day)
                  ? boardingDetails.shiftgrouping
                  : "",
                shifttiming: !valueCate.includes(day)
                  ? boardingDetails.shifttiming
                  : "",
              }))
              : []), // Return an empty array if "2nd Week" is not in valueCateWeeks
          ];

          setTodo((prev) => [...prev, ...newTodoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }

      if (boardingDetails.shifttype === "2 Week Rotation") {
        if (boardingDetails.shiftgrouping === "Please Select Shift Grouping") {

          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (boardingDetails.shifttiming === "Please Select Shift") {

          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {

          setPopupContentMalert("Please Select Weeks!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {

          setPopupContentMalert("Please Select Week Off!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else {
          const daysInMonth = valueCateWeeks?.length * 7;
          const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const weeks = [...valueCateWeeks]; // You may need to adjust this based on the actual month

          let todoList = [];
          let currentWeek = 1;
          let currentDayCount = 1;
          let currentDayIndex = 0;

          for (let i = 1; i <= daysInMonth; i++) {
            const day = days[currentDayIndex];
            const week = weeks[currentWeek - 1];

            todoList.push({
              day,
              daycount: currentDayCount,
              week,
              shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
              shiftgrouping: !valueCate.includes(day)
                ? boardingDetails.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day)
                ? boardingDetails.shifttiming
                : "",
            });

            currentDayIndex = (currentDayIndex + 1) % 7;
            currentDayCount++;
            if (currentDayIndex === 0) {
              currentWeek++;
            }
          }
          setTodo((prev) => [...prev, ...todoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }

      if (boardingDetails.shifttype === "1 Month Rotation") {
        if (boardingDetails.shiftgrouping === "Please Select Shift Grouping") {

          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (boardingDetails.shifttiming === "Please Select Shift") {

          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {

          setPopupContentMalert("Please Select Weeks!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {

          setPopupContentMalert("Please Select Week Off!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else {
          const daysInMonth = valueCateWeeks?.length * 7;
          const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const weeks = [...valueCateWeeks]; // You may need to adjust this based on the actual month

          let todoList = [];
          let currentWeek = 1;
          let currentDayCount = 1;
          let currentDayIndex = 0;

          for (let i = 1; i <= daysInMonth; i++) {
            const day = days[currentDayIndex];
            const week = weeks[currentWeek - 1];

            todoList.push({
              day,
              daycount: currentDayCount,
              week,
              shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
              shiftgrouping: !valueCate.includes(day)
                ? boardingDetails.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day)
                ? boardingDetails.shifttiming
                : "",
            });

            currentDayIndex = (currentDayIndex + 1) % 7;
            currentDayCount++;
            if (currentDayIndex === 0) {
              currentWeek++;
            }
          }

          setTodo((prev) => [...prev, ...todoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }
    }
  };

  // Function to handle editing start
  const handleEditTodocheck = (index) => {
    // Backup the current values before editing
    setEditTodoBackup(todo[index]);
    setEditingIndexcheck(index); // Set the index of the current todo being edited
  };

  // Function to handle confirming the changes
  const handleUpdateTodocheck = () => {
    // Confirm the changes and update the todo list
    setEditingIndexcheck(null); // Reset the editing state
  };

  // Function to handle canceling the changes
  const handleCancelEdit = () => {
    // Revert to the original todo state if editing is canceled
    const updatedTodos = [...todo];
    updatedTodos[editingIndexcheck] = editTodoBackup;
    setTodo(updatedTodos); // Restore original values
    setEditingIndexcheck(null); // Reset the editing state
    setEditTodoBackup(null); // Clear the backup
  };

  function multiInputs(referenceIndex, reference, inputvalue) {
    // Update isSubCategory state
    if (reference === "shiftmode") {
      let updatedShiftMode = todo?.map((value, index) => {
        if (referenceIndex === index) {
          return {
            ...value,
            shiftmode: inputvalue,
            shiftgrouping: "Please Select Shift Grouping",
            shifttiming: "Please Select Shift",
          };
        } else {
          return value;
        }
      });
      setTodo(updatedShiftMode);
    }

    // Update isSubCategory state
    if (reference === "shiftgrouping") {
      let updatedShiftGroup = todo?.map((value, index) => {
        if (referenceIndex === index) {
          return {
            ...value,
            shiftgrouping: inputvalue,
            shifttiming: "Please Select Shift",
          };
        } else {
          return value;
        }
      });
      setTodo(updatedShiftGroup);
    }

    // Update isSubCategory state
    if (reference === "shifttiming") {
      let updatedShiftTime = todo?.map((value, index) => {
        if (referenceIndex === index) {
          return { ...value, shifttiming: inputvalue };
        } else {
          return value;
        }
      });
      setTodo(updatedShiftTime);
    }
  }

  const AsyncShiftTimingSelects = ({
    todo,
    index,
    auth,
    multiInputs,
    colourStyles,
  }) => {
    const fetchShiftTimings = async () => {
      let ansGet = todo.shiftgrouping;
      let answerFirst = ansGet?.split("_")[0];
      let answerSecond = ansGet?.split("_")[1];

      let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const shiftGroup = res?.data?.shiftgroupings.filter(
        (data) =>
          data.shiftday === answerFirst && data.shifthours === answerSecond
      );

      const options =
        shiftGroup?.length > 0
          ? shiftGroup
            .flatMap((data) => data.shift)
            .map((u) => ({
              ...u,
              label: u,
              value: u,
            }))
          : [];

      return options;
    };

    const [shiftTimings, setShiftTimings] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const options = await fetchShiftTimings();
        setShiftTimings(options);
      };
      fetchData();
    }, [todo.shiftgrouping, auth.APIToken]);

    return (
      <Selects
        size="small"
        options={shiftTimings}
        styles={colourStyles}
        value={{ label: todo.shifttiming, value: todo.shifttiming }}
        onChange={(selectedOption) =>
          multiInputs(index, "shifttiming", selectedOption.value)
        }
      />
    );
  };

  const ShiftDropdwonsSecond = async (e) => {
    try {
      let ansGet = e;
      let answerFirst = ansGet?.split("_")[0];
      let answerSecond = ansGet?.split("_")[1];

      let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const shiftGroup = res?.data?.shiftgroupings.filter(
        (data) =>
          data.shiftday === answerFirst && data.shifthours === answerSecond
      );
      const shiftFlat =
        shiftGroup?.length > 0 ? shiftGroup?.flatMap((data) => data.shift) : [];

      setShifts(
        shiftFlat.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const ShiftGroupingDropdwons = async () => {
    try {
      let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftGroupingOptions(
        res?.data?.shiftgroupings.map((data) => ({
          ...data,
          label: data.shiftday + "_" + data.shifthours,
          value: data.shiftday + "_" + data.shifthours,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const EmployeeCodeAutoGenerate = async (company, branch, branchcode, doj) => {
    try {
      let res = await axios.post(SERVICE.EMPLOYEECODE_AUTOGENERATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company,
        branch: branch,
        branchcode: branchcode.substring(0, 2),
        doj: doj,
      });
      setNewval(res.data?.employeeCode);
      setPrevEmpCode(res.data?.prevEmployeeCode);
      return res.data?.employeeCode || "";
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const debouncedEmployeeCodeAutoGenerate = debounce(
    (company, branch, branchcode, doj) => {
      EmployeeCodeAutoGenerate(company, branch, branchcode, doj);
    },
    300 // 300ms delay
  );

  const [date, setDate] = useState(formattedDate);

  const [internStatusUpdate, setInternStatusUpdate] = useState({
    workmode: "Please Select Work Mode",
    doj: date,
    empcode: "",
    wordcheck: false,
  });

  const [dateOfJoining, setDateOfJoining] = useState("");
  const [dateOfTraining, setDateOfTraining] = useState("");

  let autodate = dateOfJoining.split("-");
  let dateJoin = autodate[0]?.slice(-2) + autodate[1] + autodate[2];

  const [companyOption, setCompanyOption] = useState([]);

  const fetchCompany = async () => {
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompanyOption([
        ...res?.data?.companies?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchQuota = async () => {
    try {
      let res = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMailDetails((prev) => ({ ...prev, quota: res?.data?.overallsettings[res?.data?.overallsettings?.length - 1]?.quotainmb }))
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [branchNames, setBranchNames] = useState([]);

  const [branchOption, setBranchOption] = useState([]);

  // Branch Dropdowns
  const fetchbranchNames = async (selectedBranch, selectedCompany) => {
    try {
      let req = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBranchNames(req?.data?.branch);
      const branchCode = req?.data?.branch?.filter(
        (item) =>
          item.name === selectedBranch && item.company === selectedCompany
      );
      setBranchCodeGen(branchCode[0]?.code);
      // branchCodeGen = branchCode[0]?.code

      setSelectedBranchCode(branchCode[0]?.code?.slice(0, 2));

      const branchdata = req.data.branch.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setBranchOption(branchdata);
      await fetchUserDatasOnChange(selectedBranch, selectedCompany);
      return branchCode[0]?.code;
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchbranchNamesOnChange = async (selectedBranch, selectedCompany) => {
    try {
      const branchCode = branchNames?.filter(
        (item) =>
          item.name === selectedBranch && item.company === selectedCompany
      );
      setBranchCodeGen(branchCode[0]?.code);
      // branchCodeGen = branchCode[0]?.code

      setSelectedBranchCode(branchCode[0]?.code?.slice(0, 2));
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [unitsOption, setUnitsOption] = useState([]);
  const fetchUnit = async () => {
    try {
      let res_category = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const units = res_category.data.units.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setUnitsOption(units);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchUnitCode = async (branch, unit) => {
    try {
      let res_category = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const unitCodes = res_category.data.units.filter(
        (item) => item.branch === branch && item?.name === unit
      );
      setSelectedUnitCode(unitCodes[0]?.code?.slice(0, 2));
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [teamsOption, setTeamsOption] = useState([]);
  const fetchTeam = async () => {
    try {
      let res_category = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const teams = res_category.data.teamsdetails.map((d) => ({
        ...d,
        label: d.teamname,
        value: d.teamname,
      }));

      setTeamsOption(teams);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [floorOption, setFloorOption] = useState([]);
  //get all floor.
  const fetchFloorAll = async () => {
    try {
      let res_location = await axios.get(SERVICE.FLOOR, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setFloorOption([
        ...res_location?.data?.floors?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [areaOption, setAreaOption] = useState([]);
  //get locations
  const fetchAreaGrouping = async () => {
    try {
      let res_location = await axios.get(SERVICE.AREAGROUPING, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setAreaOption(
        res_location?.data?.areagroupings?.filter(
          (data) => data.boardingareastatus
        )
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [departmentOption, setDepartmentOption] = useState([]);

  const fetchDepartmentAll = async () => {
    try {
      let res_deptandteam = await axios.get(SERVICE.DEPARTMENT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      let filteredDepartments = res_deptandteam?.data?.departmentdetails?.filter(
        obj => !obj.deptname.toLowerCase().includes("intern")
      );
      setDepartmentOption(
        filteredDepartments?.length > 0 &&
        filteredDepartments?.map((d) => ({
          ...d,
          label: d.deptname,
          value: d.deptname,
        }))
      );


    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all employees list details
  const fetchEmployee = async () => {
    try {
      let res_employee = await axios.get(SERVICE.ALL_INTERNS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEmployees(res_employee?.data?.allinterns);
      setcheckemployeelist(true);
    } catch (err) {
      setcheckemployeelist(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchUser = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setreportingtonames(req?.data?.users);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // const [empcodelimited, setEmpCodeLimited] = useState([]);
  // get settings data
  const fetchUserDatasLimitedEmpcodeCreate = async (selectedBranch) => {
    try {
      let req = await axios.post(SERVICE.USERS_LIMITED_EMPCODE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: selectedBranch,
      });

      let ALLusers = req?.data?.userscreate;
      const lastThreeDigitsArray = ALLusers.map((employee) =>
        employee.empcode?.slice(-3)
      );
      setEmpCodeLimited(lastThreeDigitsArray);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [designation, setDesignation] = useState([]);

  const fetchDepartmentandesignation = async () => {
    try {
      let res_status = await axios.get(
        SERVICE.DEPARTMENTANDDESIGNATIONGROUPING,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDesignation(
        res_status?.data?.departmentanddesignationgroupings?.map((d) => ({
          ...d,
          label: d.name || d.designation,
          value: d.name || d.designation,
          systemcount: d?.systemcount || "",
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const { id: newId } = useParams();

  const [updatedBy, setUpdatedBy] = useState([]);

  const [workStationInputOldDatas, setWorkStationInputOldDatas] = useState({});

  const [oldEmpCode, setOldEmpCode] = useState("");
  const [domainsList, setDomainsList] = useState("");
  const [documentID, setDocumentID] = useState("");
  const getCode = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${newId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filtered = res?.data?.suser?.companyemail?.includes(",")
        ? res?.data?.suser?.companyemail?.split(",").map((data) => {
          return data.split('@')[1];
        }).join(",")  // Joining with commas to return a string
        : res?.data?.suser?.companyemail?.split('@')[1];

      setDomainsList(filtered)
      setMailDetails((prev) => ({
        ...prev,
        username: res?.data?.suser?.username,
        originalpassword: res?.data?.suser?.originalpassword,
        companyname: res?.data?.suser?.companyname,
        companyemail: res?.data?.suser?.companyemail,
      }));
      setOldUserCompanyname(res?.data?.suser)
      setEmployeecodenew(res?.data?.suser?.wordcheck ? res?.data?.suser?.empcode : "")
      setDateOfTraining(res?.data?.suser?.dot || formattedDate)
      setDateOfJoining("")
      setCreateRocketChat({
        create: res?.data?.suser?.rocketchatid ? true : false,
        email: res?.data?.suser?.rocketchatemail ?? "",
        roles: res?.data?.suser?.rocketchatroles ? res?.data?.suser?.rocketchatroles?.map((data) => ({
          label: data,
          value: data,
        })) : []
      })
      setWorkStationInputOldDatas({
        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        workmode: res?.data?.suser?.workmode,
        ifoffice: res?.data?.suser?.workstationofficestatus,
        workstationinput: res?.data?.suser?.workstationinput,
      });
      let branchCodes = await fetchbranchNames(
        res?.data?.suser?.branch,
        res?.data?.suser?.company
      );
      await EmployeeCodeAutoGenerate(
        res?.data?.suser?.company,
        res?.data?.suser?.branch,
        branchCodes,
        res?.data?.suser?.doj || formattedDate
      );
      setOldEmpCode(res?.data?.suser?.empcode);
      setTodo(
        res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog.length - 1]
          .todo
      );
      setoverallgrosstotal(res?.data?.suser.grosssalary);
      setModeexperience(res?.data?.suser.modeexperience);
      setTargetexperience(res?.data?.suser.targetexperience);
      setTargetpts(res?.data?.suser.targetpts);
      setLoginNotAllot(res?.data?.suser);
      setnewstate(!newstate);
      let responsenew = await axios.post(
        SERVICE.EMPLOYEEDOCUMENT_SINGLEWITHALLBYCOMMONID,
        {
          commonid: newId,
        }
      );

      setDocumentID(responsenew?.data?.semployeedocument?._id || "");
      let isThere = res?.data?.suser?.attendancemode ? res?.data?.suser?.attendancemode?.map((data) => ({
        ...data,
        label: data,
        value: data
      })) : [];
      setSelectedAttMode(isThere);
      setValueAttMode(res?.data?.suser?.attendancemode ? res?.data?.suser?.attendancemode.map(data => data) : []);
      fetchSuperVisorDropdowns(res?.data?.suser?.team, res?.data?.suser);
      if (res?.data?.suser?.assignExpLog?.lenth === 0) {
        setAssignExperience({
          ...assignExperience,
          updatedate: res?.data?.suser?.doj,
        });
      } else {
        setAssignExperience({
          ...assignExperience,
          assignExpMode: res?.data?.suser?.assignExpLog[0]?.expmode || "Auto Increment",
          assignExpvalue: res?.data?.suser?.assignExpLog[0]?.expval || "0",
          assignEndExpDate:
            res?.data?.suser?.assignExpLog[0]?.endexpdate !== ""
              ? moment(res?.data?.suser?.assignExpLog[0]?.endexpdate).format(
                "YYYY-MM-DD"
              )
              : "",
          assignEndTarDate:
            res?.data?.suser?.assignExpLog[0]?.endtardate !== ""
              ? moment(res?.data?.suser?.assignExpLog[0]?.endtardate).format(
                "YYYY-MM-DD"
              )
              : "",
          assignEndTarvalue: res?.data?.suser?.assignExpLog[0]?.endtar || "",
          assignEndExpvalue: res?.data?.suser?.assignExpLog[0]?.endexp || "",
          updatedate:
            res?.data?.suser?.assignExpLog[0]?.updatedate !== ""
              ? moment(res?.data?.suser?.assignExpLog[0]?.updatedate).format(
                "YYYY-MM-DD"
              )
              : "",
        });
      }
      let req_designation = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const groupname = req_designation?.data?.designation?.find(
        (data) => data.name === res?.data?.suser?.designation
      );

      setDesignationGroup(groupname ? groupname?.group : "");

      setGettingOldDatas(res?.data?.suser);
      setSelectedDesignation(res?.data?.suser?.designation);
      let designationGrpName = alldesignation?.find(
        (data) => res?.data?.suser?.designation === data?.name
      )?.group;
      setOldDesignationGroup(designationGrpName);
      setNewDesignationGroup(designationGrpName);
      let allDesignations = alldesignation
        ?.filter((data) => designationGrpName === data?.group)
        ?.map((item) => item?.name);
      setOldDesignation(res?.data?.suser?.designation);
      setDesignationsName(allDesignations);
      let res_DATA = await axios.get(SERVICE.HIRERARCHI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setHierarchyall(res_DATA?.data?.hirerarchi);

      const fitleredUsers = [
        ...allUsersData?.map((d) => ({
          // ...d,
          label: d.companyname,
          value: d.companyname,
          designation: d?.designation,
        })),
      ];
      setUsers(fitleredUsers);




      const userdata = {
        ...boardingDetails,
        company: res?.data?.suser?.company,
        companyname: res?.data?.suser?.companyname,
        employeecount: res?.data?.suser?.employeecount || 0,
        branch: res?.data?.suser?.branch,
        shifttype: res?.data?.suser?.shifttype,
        branchcode: branchCodes,
        unit:
          res?.data?.suser?.unit === "" || res?.data?.suser?.unit === undefined
            ? "Please Select Unit"
            : res?.data?.suser?.unit,
        floor:
          res?.data?.suser?.floor === "" ||
            res?.data?.suser?.floor === undefined
            ? "Please Select Floor"
            : res?.data?.suser?.floor,
        area:
          res?.data?.suser?.area === "" || res?.data?.suser?.area === undefined
            ? "Please Select Area"
            : res?.data?.suser?.area,
        department: "Please Select Department",
        olddepartment: res?.data?.suser?.department,
        oldteam: res?.data?.suser?.team,
        olddesignation: res?.data?.suser?.designation,
        team: "Please Select Team",
        designation: "Please Select Designation",
        shiftgrouping:
          res?.data?.suser?.shiftgrouping === "" ||
            res?.data?.suser?.shiftgrouping === undefined
            ? "Please Select Shift Grouping"
            : res?.data?.suser?.shiftgrouping,
        shifttiming:
          res?.data?.suser?.shifttiming === "" ||
            res?.data?.suser?.shifttiming === undefined
            ? "Please Select Shift Timing"
            : res?.data?.suser?.shifttiming,
        reportingto:
          res?.data?.suser?.reportingto === "" ||
            res?.data?.suser?.reportingto === undefined
            ? "Please Select Reporting To"
            : res?.data?.suser?.reportingto,
        ifoffice: res?.data?.suser?.workstationofficestatus,
        username: res?.data?.suser?.username,
        companyemail: res?.data?.suser?.companyemail || "",
        rocketchatid: res?.data?.suser?.rocketchatid || "",
        rocketchatemail: res?.data?.suser?.rocketchatemail || "",
        rocketchatroles: res?.data?.suser?.rocketchatroles || [],
        rocketchatteamid: res?.data?.suser?.rocketchatteamid || [],
        rocketchatchannelid: res?.data?.suser?.rocketchatchannelid || [],
        prod: true,
        originalpassword: res?.data?.suser?.originalpassword,
        callingname: res?.data?.suser?.callingname,
        religion: res?.data?.suser?.religion || "",
      };
      setBoardingDetails(userdata);

      await fetchUnitCode(res?.data?.suser?.branch, res?.data?.suser?.unit);
      // await fetchUserDatasOnChange(res?.data?.suser?.branch, res?.data?.suser?.company);
      // await fetchOverAllSettings(res?.data?.suser?.company, res?.data?.suser?.branch);
      ShiftDropdwonsSecond(res?.data?.suser?.shiftgrouping);
      setValueCate(res?.data?.suser?.boardingLog[0]?.weekoff);
      setSelectedOptionsCate([
        ...res?.data?.suser?.boardingLog[0]?.weekoff.map((t) => ({
          label: t,
          value: t,
        })),
      ]);
      setUserUpdate(res?.data?.suser);
      setUpdatedBy(res?.data?.suser?.updatedby);
      setInternStatusUpdate(res?.data?.suser);
      setPrimaryWorkStation(res?.data?.suser?.workstation[0]);
      const employeeCount = res?.data?.suser.employeecount || 0;
      const wfhcount = res?.data?.suser?.wfhcount || 0;
      setMaxSelections(Number(employeeCount) + Number(wfhcount));
      setWfhSelections(Number(wfhcount));
      setSelectedWorkStation(
        res?.data?.suser?.workstation?.slice(
          1,
          res?.data?.suser?.workstation?.length
        )
      );
      setSelectedOptionsWorkStation(
        Array.isArray(res?.data?.suser?.workstation)
          ? res?.data?.suser?.workstation
            ?.slice(1, res?.data?.suser?.workstation?.length)
            ?.map((x) => ({
              ...x,
              label: x,
              value: x,
            }))
          : []
      );
      // const branchCode = branchNames?.filter(
      //   (item) => item.name === res?.data?.suser?.branch
      // );

      // setBranchCodeGen(branchCode[0]?.code);
      await fetchUserDatasLimitedEmpcodeCreate(res?.data?.suser?.branch);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };



  const DesignGroupChange = async (selectedDesignation) => {
    let req_designation = await axios.get(SERVICE.DESIGNATION, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const groupname = req_designation?.data?.designation?.find(
      (data) => data.name === selectedDesignation
    );
    setNewDesignationGroup(groupname?.group);
    setDesignationGroup(groupname ? groupname?.group : "");
  }
  useEffect(() => {
    getCode();
  }, []);

  // useEffect(() => {
  //   fetchUserDatasOnChange();
  // }, [branchNames, boardingDetails]);

  useEffect(() => {
    fetchEmployee();
    fetchUser();
    fetchWorkStation();
    fetchCompany();
    fetchUnit();
    fetchTeam();
    fetchFloorAll();
    fetchAreaGrouping();
    fetchDepartmentAll();
    fetchDepartmentandesignation();
    ShiftGroupingDropdwons();
    fetchQuota();
    // fetchUserDatasOnChange(
    //   boardingDetails.branch,
    //   boardingDetails.company
    // );
    fetchOverAllSettings(boardingDetails.company, boardingDetails.branch);
  }, [boardingDetails]);

  const [employee, setEmployee] = useState({
    wordcheck: false,
    type: "Please Select Type",
    salaryrange: "Please Select Salary Range",
    amountvalue: "",
    from: "",
    to: "",
    prefix: "Mr",
    firstname: "",
    lastname: "",
    legalname: "",
    fathername: "",
    mothername: "",
    gender: "",
    maritalstatus: "",
    dom: "",
    dob: "",
    bloodgroup: "",
    profileimage: "",
    location: "",
    email: "",
    contactpersonal: "",
    contactfamily: "",
    emergencyno: "",
    doj: "",
    dot: "",
    name: "",
    contactno: "",
    details: "",
    username: "",
    password: "",
    companyname: "",
    pdoorno: "",
    pstreet: "",
    parea: "",
    plandmark: "",
    ptaluk: "",
    ppost: "",
    ppincode: "",
    pcountry: "",
    pstate: "",
    pcity: "",
    cdoorno: "",
    cstreet: "",
    carea: "",
    clandmark: "",
    ctaluk: "",
    cpost: "",
    cpincode: "",
    ccountry: "",
    cstate: "",
    ccity: "",
    branch: "",
    workstation: "",
    weekoff: "",
    unit: "",
    floor: "",
    department: "",
    team: "",
    designation: "",
    shifttiming: "",
    reportingto: "",
    empcode: "",
    remark: "",
    aadhar: "",
    panno: "",
    draft: "",
    intStartDate: "",
    intEndDate: "",
    intCourse: "",
    bankname: "ICICI BANK LTD",
    workmode: "Please Select Work Mode",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",

    categoryedu: "Please Select Category",
    subcategoryedu: "Please Select Sub Category",
    specialization: "Please Select Specialization",
  });

  const handleClear = (e) => {
    e.preventDefault();
    setEmployee({
      ...employee,
      type: "Please Select Type",
      salaryrange: "Please Select Salary Range",
      amountvalue: "",
      from: "",
      to: "",
    });
    setLoginNotAllot({
      ...loginNotAllot,
      process: "Please Select Process",
    });
    setIsArea(false);
    setSalaryFix([]);
  };

  const [ShiftGroupingOptions, setShiftGroupingOptions] = useState([]);
  const [allUsersLoginName, setAllUsersLoginName] = useState([]);

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);

  const processTypes = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
  ];

  const processDuration = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
  }, []);

  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };
  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };

  const [ProcessOptions, setProcessOptions] = useState([]);

  const SalaryFixFilter = async () => {
    setIsArea(true);
    try {
      let res = await axios.post(SERVICE.SALARY_FIX_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: boardingDetails.company,
        branch: boardingDetails.branch,
        salaryrange: employee.salaryrange,
        type: employee.type,
        process: employee.type == "Amount Wise" ? "" : loginNotAllot.process,
        amountvalue: employee.amountvalue,
        fromamount: employee.from,
        toamount: employee.to,
      });
      setSalaryFix(res?.data?.result);
      setIsArea(false);
    } catch (err) {
      setIsArea(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handlesalary = (e) => {
    e.preventDefault();
    try {
      if (employee.type === "Please Select Type") {

        setPopupContentMalert("Please Select Type!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        employee.type === "Amount Wise" &&
        employee.salaryrange === "Please Select Salary Range"
      ) {

        setPopupContentMalert("Please Select Salary Range!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        employee.type === "Process Wise" &&
        loginNotAllot.process === "Please Select Process"
      ) {

        setPopupContentMalert("Please Select Process!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (employee.salaryrange === "Between" && employee.from === "") {

        setPopupContentMalert("Please Enter From!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (employee.salaryrange === "Between" && employee.to === "") {

        setPopupContentMalert("Please Enter To!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (employee.salaryrange === "Between" && employee.from >= employee.to) {

        setPopupContentMalert("To Amount must be greater than from!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (
        (employee.salaryrange === "Less Than" ||
          employee.salaryrange === "Greater Than" ||
          employee.salaryrange === "Exact") &&
        employee.amountvalue === ""
      ) {

        setPopupContentMalert("Please Enter Amount Value!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        SalaryFixFilter();
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

  const getCodesalary = (totalValue, code, experience, targetpoints) => {
    setAssignExperience({
      ...assignExperience,
      assignExpMode: "Add",
      assignExpvalue: experience?.length > 0 ? experience[0] : 0,
    });
    setLoginNotAllot({
      ...loginNotAllot,
      process: code,
    });
    setoverallgrosstotal(totalValue);
    setTargetpts(targetpoints);
    setnewstate(!newstate);
    handleCloseModEditAllot();
  };

  const processTeamDropdowns = async () => {
    try {
      let res_freq = await axios.get(
        SERVICE.ALL_PROCESS_AND_TEAM_FILTER_LIMITED,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const companyall = res_freq?.data?.processteam;
      setProcessOptions(companyall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [salSlabs, setsalSlabs] = useState([]);

  const [tarPoints, setTarpoints] = useState([]);
  //get all employees list details
  const fetchTargetpoints = async () => {
    try {
      let res_employee = await axios.get(SERVICE.TARGETPOINTS_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTarpoints(res_employee?.data?.targetpoints);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchSalarySlabs = async () => {
    try {
      let res_employee = await axios.get(SERVICE.SALARYSLAB_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setsalSlabs(res_employee?.data?.salaryslab);
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
    fetchSalarySlabs();
  }, [id, boardingDetails.company, boardingDetails.branch]);

  useEffect(() => {
    fetchTargetpoints();
  }, [id]);

  useEffect(() => {
    processTeamDropdowns();
  }, [boardingDetails.team]);

  const [overallgrosstotal, setoverallgrosstotal] = useState("");
  const [modeexperience, setModeexperience] = useState("");
  const [targetexperience, setTargetexperience] = useState("");
  const [targetpts, setTargetpts] = useState("");

  useEffect(() => {
    let today1 = new Date();
    var mm = String(today1.getMonth() + 1).padStart(2, "0");
    var yyyy = today1.getFullYear();
    let curMonStartDate = yyyy + "-" + mm + "-01";

    let modevalue = new Date(today1) > new Date(assignExperience.updatedate);

    // let findexp = monthSets.find((d) => d.department === item.department);

    let findexp = monthSets.find(
      (d) => d.department === boardingDetails.department
    );
    let findDate = findexp ? findexp.fromdate : curMonStartDate;

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

    let differenceInMonths = 0;
    let differenceInMonthsexp = 0;
    let differenceInMonthstar = 0;
    if (modevalue) {
      //findexp end difference yes/no
      if (assignExperience.assignEndExpvalue === "Yes") {
        differenceInMonthsexp =
          differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
        differenceInMonthsexp = calculateMonthsBetweenDates(
          assignExperience.updatedate,
          assignExperience.assignEndExpDate
        );
        if (assignExperience.assignEndExp === "Add") {
          differenceInMonthsexp += parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignEndExp === "Minus") {
          differenceInMonthsexp -= parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignEndExp === "Fix") {
          differenceInMonthsexp = parseInt(assignExperience.assignExpvalue);
        }
      } else {
        differenceInMonthsexp = calculateMonthsBetweenDates(
          assignExperience.updatedate,
          findDate
        );
        differenceInMonthsexp =
          differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
        if (assignExperience.assignEndExp === "Add") {
          differenceInMonthsexp += parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignEndExp === "Minus") {
          differenceInMonthsexp -= parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignEndExp === "Fix") {
          differenceInMonthsexp = parseInt(assignExperience.assignExpvalue);
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(
            assignExperience.updatedate,
            findDate
          );
        }
      }

      //findtar end difference yes/no
      if (modevalue.endtar === "Yes") {
        differenceInMonthstar = calculateMonthsBetweenDates(
          assignExperience.updatedate,
          assignExperience.assignEndExpvalue
        );
        differenceInMonthstar =
          differenceInMonthstar < 1 ? 0 : differenceInMonthstar;
        if (assignExperience.assignExpMode === "Add") {
          differenceInMonthstar += parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignExpMode === "Minus") {
          differenceInMonthstar -= parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignExpMode === "Fix") {
          differenceInMonthstar = parseInt(assignExperience.assignExpvalue);
        }
      } else {
        differenceInMonthstar = calculateMonthsBetweenDates(
          assignExperience.updatedate,
          findDate
        );
        differenceInMonthstar =
          differenceInMonthstar < 1 ? 0 : differenceInMonthstar;
        if (assignExperience.assignExpMode === "Add") {
          differenceInMonthstar += parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignExpMode === "Minus") {
          differenceInMonthstar -= parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignExpMode === "Fix") {
          differenceInMonthstar = parseInt(assignExperience.assignExpvalue);
        } else {
          // differenceInMonths = parseInt(assignExperience.assignExpvalue);
          differenceInMonthstar = calculateMonthsBetweenDates(
            assignExperience.updatedate,
            findDate
          );
        }
      }

      differenceInMonths = calculateMonthsBetweenDates(assignExperience.updatedate, findDate);
      differenceInMonths = differenceInMonths < 1 ? 0 : differenceInMonths;
      if (assignExperience.assignExpMode === "Add") {
        differenceInMonths += parseInt(assignExperience.assignExpvalue);
      } else if (assignExperience.assignExpMode === "Minus") {
        differenceInMonths -= parseInt(assignExperience.assignExpvalue);
      } else if (assignExperience.assignExpMode === "Fix") {
        differenceInMonths = parseInt(assignExperience.assignExpvalue);
      } else {
        differenceInMonths = calculateMonthsBetweenDates(
          assignExperience.updatedate,
          findDate
        );
      }
    } else {
      differenceInMonthsexp = calculateMonthsBetweenDates(
        assignExperience.updatedate,
        findDate
      );
      differenceInMonthstar = calculateMonthsBetweenDates(
        assignExperience.updatedate,
        findDate
      );
      differenceInMonths = calculateMonthsBetweenDates(assignExperience.updatedate, findDate);
    }

    let getprocessCode = loginNotAllot.process;

    let processexp = dateOfJoining
      ? getprocessCode +
      (differenceInMonths < 1
        ? "00"
        : differenceInMonths <= 9
          ? `0${differenceInMonths}`
          : differenceInMonths)
      : "00";

    let findSalDetails = salSlabs.find(
      (d) =>
        d.company == boardingDetails.company &&
        d.branch == boardingDetails.branch &&
        d.salarycode == processexp
    );

    let findSalDetailsTar = tarPoints.find(
      (d) =>
        d.company === boardingDetails.company &&
        d.branch == boardingDetails.branch &&
        d.processcode === processexp
    );
    let targetpoints = findSalDetailsTar ? findSalDetailsTar.points : "";

    let grosstotal = findSalDetails
      ? Number(findSalDetails.basic) +
      Number(findSalDetails.hra) +
      Number(findSalDetails.conveyance) +
      Number(findSalDetails.medicalallowance) +
      Number(findSalDetails.productionallowance) +
      Number(findSalDetails.otherallowance)
      : "";

    let Modeexp = dateOfJoining
      ? differenceInMonths > 0
        ? differenceInMonths
        : 0
      : "";
    let Tarexp = dateOfJoining
      ? differenceInMonthstar > 0
        ? differenceInMonthstar
        : 0
      : "";

    setoverallgrosstotal(grosstotal);
    setModeexperience(Modeexp);
    setTargetexperience(Tarexp);
    setTargetpts(targetpoints);
  }, [newstate]);

  const valueOpt = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const mode = ["Auto Increment", "Add", "Minus", "Fix"];
  const modetar = ["Target Stop"];
  const modeexp = ["Exp Stop"];

  const modeOption = mode.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));

  const modeOptiontar = modetar.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));

  const modeOptionexp = modeexp.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));
  const [expDptDates, setExpDptDates] = useState([]);
  const [monthSets, setMonthsets] = useState([]);
  const [specificDates, setSpecificDates] = useState([]);

  const [expDateOptions, setExpDateOptions] = useState([]);

  useEffect(() => {
    let foundData = expDptDates.find(
      (item) =>
        item.department === boardingDetails.department &&
        new Date(dateOfJoining) >= new Date(item.fromdate) &&
        new Date(dateOfJoining) <= new Date(item.todate)
    );

    if (foundData) {
      let filteredDatas = expDptDates
        .filter(
          (d) =>
            d.department === boardingDetails.department &&
            new Date(d.fromdate) >= new Date(foundData.fromdate)
        )
        .map((data) => ({
          label: data.fromdate,
          value: data.fromdate,
        }));

      setExpDateOptions(filteredDatas);
      setAssignExperience((prev) => ({
        ...prev,
        assignEndExpDate: filteredDatas[0]?.value,
        assignEndTarDate: filteredDatas[0]?.value,
        // updatedate: filteredDatas[0]?.value
      }));
    } else {
      console.log("No data found for the given conditions.");
    }
  }, [expDptDates, employee, userUpdate, dateOfJoining]);

  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    const now = new Date();
    let today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var currentyear = today.getFullYear();

    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let currentmonth = months[mm - 1];

    try {
      let res_employee = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filteredMonthsets = res_employee.data.departmentdetails.filter(
        (item) => item.year == currentyear && item.monthname == currentmonth
      );
      let filteredMonthsetsDATES = res_employee.data.departmentdetails.filter(
        (item) => item.fromdate
      );
      setExpDptDates(res_employee.data.departmentdetails);
      setMonthsets(res_employee.data.departmentdetails);
      setSpecificDates(filteredMonthsetsDATES);
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
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleSubmitMulti(e);
  };
  const [newval, setNewval] = useState("");
  const [prevEmpCode, setPrevEmpCode] = useState("");

  // let newval =
  //   empsettings === true && overllsettings?.length > 0
  //     ? (branchCodeGen?.toUpperCase() || "") +
  //       (dateJoin === undefined ? "" : dateJoin) +
  //       overllsettings[0]?.empcodedigits
  //     : (branchCodeGen?.toUpperCase() || "") +
  //       (dateJoin === undefined ? "" : dateJoin) +
  //       "001";
  // console.log(empCode, "empCode");
  // if (empCode?.length > 0) {
  //   empCode &&
  //     empCode.forEach(() => {
  //       const numericEmpCode = empCode.filter(
  //         (employee) => !isNaN(parseInt(employee.empcode?.slice(-3)))
  //       );

  //       const result = numericEmpCode.reduce((maxEmployee, currentEmployee) => {
  //         const lastThreeDigitsMax = parseInt(maxEmployee?.empcode?.slice(-3));
  //         const lastThreeDigitsCurrent = parseInt(
  //           currentEmployee?.empcode?.slice(-3)
  //         );
  //         return lastThreeDigitsMax > lastThreeDigitsCurrent
  //           ? maxEmployee
  //           : currentEmployee;
  //       }, numericEmpCode[0]);
  //       console.log(result, "result");

  //       let strings = (branchCodeGen?.toUpperCase() || "") + (dateJoin || "");
  //       let refNoold = result?.empcode;
  //       let refNo =
  //         overllsettings?.length > 0 &&
  //         empsettings === true &&
  //         Number(overllsettings[0]?.empcodedigits) >
  //           Number(result?.empcode?.slice(-3))
  //           ? (branchCodeGen?.toUpperCase() || "") +
  //             (dateJoin || "") +
  //             (Number(overllsettings[0]?.empcodedigits) - 1)
  //           : refNoold;

  //       let digits = (empCode?.length + 1).toString();
  //       const stringLength = refNo?.length;
  //       let getlastBeforeChar = refNo?.charAt(stringLength - 2);
  //       let getlastThreeChar = refNo?.charAt(stringLength - 3);
  //       let lastChar = refNo?.slice(-1);
  //       let lastBeforeChar = refNo?.slice(-2);
  //       let lastDigit = refNo?.slice(-3);
  //       let refNOINC = parseInt(lastChar) + 1;
  //       let refLstTwo = parseInt(lastBeforeChar) + 1;
  //       let refLstDigit = parseInt(lastDigit) + 1;

  //       if (
  //         digits?.length < 4 &&
  //         getlastBeforeChar === "0" &&
  //         getlastThreeChar === "0"
  //       ) {
  //         refNOINC = "00" + refNOINC;
  //         newval = strings + refNOINC;
  //       } else if (
  //         digits?.length < 4 &&
  //         getlastThreeChar === "0" &&
  //         getlastBeforeChar > "0"
  //       ) {
  //         refNOINC = "0" + refLstTwo;
  //         newval = strings + refNOINC;
  //       } else {
  //         refNOINC = refLstDigit;
  //         newval = strings + refNOINC;
  //       }
  //     });
  // } else if (
  //   empCode?.length === 0 &&
  //   overllsettings?.length > 0 &&
  //   empsettings === true
  // ) {
  //   newval =
  //     (branchCodeGen?.toUpperCase() || "") +
  //     (dateJoin || "") +
  //     overllsettings[0]?.empcodedigits;
  // } else if (empCode?.length === 0 && overllsettings?.length == 0) {
  //   newval =
  //     (branchCodeGen?.toUpperCase() || "") +
  //     (dateJoin === undefined ? "" : dateJoin) +
  //     "001";
  // }

  const fetchUserDatasOnChange = async (branch, company) => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ALLusers = req?.data?.users.filter((item) => {
        if (item?.workmode != "Internship" && item.branch == branch) {
          return item;
        }
      });

      let filteredsssssData = overllsettingsDefault?.todos?.filter(
        (item) => item.branch.includes(branch) && item.company == company
      );
      setOverallsettings(filteredsssssData);

      // const branchCode = branchNames?.filter((item) => item.name === branch);

      // setBranchCodeGen(branchCode[0]?.code);
      // console.log(ALLusers, "allusers");
      setEmpCode(ALLusers);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const workmodeOptions = [
    { label: "Remote", value: "Remote" },
    { label: "Office", value: "Office" },
  ];

  useEffect(() => {
    var filteredWorks;
    if (userUpdate.unit === "" && userUpdate.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === userUpdate.company && u.branch === userUpdate.branch
      );
    } else if (userUpdate.unit === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === userUpdate.company &&
          u.branch === userUpdate.branch &&
          u.floor === userUpdate.floor
      );
    } else if (userUpdate.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === userUpdate.company &&
          u.branch === userUpdate.branch &&
          u.unit === userUpdate.unit
      );
    } else {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === userUpdate.company &&
          u.branch === userUpdate.branch &&
          u.unit === userUpdate.unit &&
          u.floor === userUpdate.floor
      );
    }
    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos?.length > 0
          ? combinstationItem.subTodos.map(
            (subTodo) =>
              subTodo.subcabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")"
          )
          : [
            combinstationItem.cabinname +
            "(" +
            item.branch +
            "-" +
            item.floor +
            ")",
          ];
      });
    });
    setFilteredWorkStation(
      result.flat()?.filter((d) => !allAssignedWorkStations.includes(d))?.map((d) => ({
        ...d,
        label: d,
        value: d,
      }))
    );
  }, [userUpdate]);

  const [designationLog, setDesignationLog] = useState([]);

  const [departmentLog, setDepartmentLog] = useState([]);

  const [boardingLog, setBoardingLog] = useState([]);

  const [processLog, setProcessLog] = useState([]);

  useEffect(() => {
    const rowData = async () => {
      try {
        let res = await axios.get(`${SERVICE.USER_SINGLE}/${newId}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        // if (res?.data?.suser?.designationlog?.length === 0) {
        //   setDesignationLog([
        //     {
        //       branch: res?.data?.suser.branch,
        //       designation: res?.data?.suser.designation,
        //       startdate: formattedDate,
        //       team: res?.data?.suser.team,
        //       unit: res?.data?.suser.unit,
        //       username: res?.data?.suser.companyname,
        //       _id: res?.data?.suser._id,
        //     },
        //   ]);
        // } else {
        setDesignationLog(res?.data?.suser?.designationlog || []);
        // }
        // if (res?.data?.suser?.departmentlog?.length === 0) {
        //   setDepartmentLog([
        //     {
        //       branch: res?.data?.suser?.branch,
        //       department: res?.data?.suser?.department,
        //       startdate: formattedDate,
        //       team: res?.data?.suser?.team,
        //       unit: res?.data?.suser?.unit,
        //       username: res?.data?.suser?.companyname,
        //       _id: res?.data?.suser?._id,
        //     },
        //   ]);
        // } else {
        setDepartmentLog(res?.data?.suser?.departmentlog || []);
        // }

        // boarding log
        // if (res?.data?.suser?.boardingLog?.length === 0) {
        //   setBoardingLog([
        //     {
        //       company: res?.data?.suser?.company,
        //       branch: res?.data?.suser?.branch,
        //       department: res?.data?.suser?.department,
        //       startdate: formattedDate,
        //       team: res?.data?.suser?.team,
        //       unit: res?.data?.suser?.unit,
        //       shifttiming: res?.data?.suser?.shifttiming,
        //       shiftgrouping: res?.data?.suser?.shiftgrouping,
        //       process: res?.data?.suser?.process,
        //       username: res?.data?.suser?.companyname,
        //       _id: res?.data?.suser?._id,
        //     },
        //   ]);
        // } else {
        setBoardingLog(res?.data?.suser?.boardingLog || []);
        // }

        // process log
        // if (res?.data?.suser?.processlog?.length === 0) {
        //   setProcessLog([
        //     {
        //       company: res?.data?.suser?.company,
        //       branch: res?.data?.suser?.branch,
        //       department: res?.data?.suser?.department,
        //       startdate: formattedDate,
        //       team: res?.data?.suser?.team,
        //       unit: res?.data?.suser?.unit,
        //       shifttiming: res?.data?.suser?.shifttiming,
        //       shiftgrouping: res?.data?.suser?.shiftgrouping,
        //       process: res?.data?.suser?.process,
        //       username: res?.data?.suser?.companyname,
        //       _id: res?.data?.suser?._id,
        //     },
        //   ]);
        // } else {
        setProcessLog(res?.data?.suser?.processlog || []);
        // }

        setPrimaryWorkStation(res?.data?.suser?.workstation[0]);
        const employeeCount = res?.data?.suser?.employeecount || 0;
        // setMaxSelections(employeeCount);
      } catch (err) {
        handleApiError(
          err,
          setPopupContentMalert,
          setPopupSeverityMalert,
          handleClickOpenPopupMalert
        );
      }
    };
    rowData();
  }, []);
  const handleEmployeesChange = (options) => {

    const maxOptions = Number(maxSelections) - 1;

    // Restrict selection to maxOptions
    if (options.length <= maxOptions) {
      setValueWorkStation(
        options.map((a) => a.value)
      );
      setSelectedOptionsWorkStation(options);
    }
  };
  // company multi select
  // const handleEmployeesChange = (options) => {
  //   // If employeecount is greater than 0, limit the selections
  //   if (maxSelections > 0) {
  //     // Limit the selections to the maximum allowed
  //     options = options?.slice(0, maxSelections - 1);
  //   }

  //   // Update the disabled property based on the current selections and employeecount
  //   const updatedOptions = filteredWorkStation.map((option) => ({
  //     ...option,
  //     disabled:
  //       maxSelections - 1 > 0 &&
  //       options.length >= maxSelections - 1 &&
  //       !options.find(
  //         (selectedOption) => selectedOption.value === option.value
  //       ),
  //   }));

  //   setValueWorkStation(options.map((a, index) => a.value));
  //   setSelectedOptionsWorkStation(options);
  //   setFilteredWorkStation(updatedOptions);
  // };
  const customValueRendererEmployees = (
    valueWorkStation,
    _filteredWorkStation
  ) => {
    return valueWorkStation.length ? (
      valueWorkStation.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Secondary Work Station
      </span>
    );
  };
  const [allAssignedWorkStations, setAllAssignedWorkStations] = useState([]);
  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const aggregationPipeline = [
        {
          $match: {
            $expr: {
              $ne: [{ $toString: "$_id" }, newId]
            }
          }
        },
        {
          $project: {
            workstation: 1, // Include only the workstation field
          },
        },
        {
          $unwind: "$workstation", // Unwind the workstation array into separate documents
        },
        {
          $group: {
            _id: null, // Group all documents together
            allWorkstations: { $addToSet: "$workstation" }, // Combine all unique workstation values into a single array
          },
        },
      ];
      let response = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      const allWorkstations = response.data?.users?.[0]?.allWorkstations || [];
      setAllAssignedWorkStations(allWorkstations);
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos?.length > 0
            ? combinstationItem.subTodos.map(
              (subTodo) =>
                subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"
            )
            : [
              combinstationItem.cabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")",
            ];
        });
      });
      setWorkStationOpt(res?.data?.locationgroupings);
      setAllWorkStationOpt(
        result.flat()?.filter((d) => !allWorkstations.includes(d))?.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [empcodelimitedAll, setEmpCodeLimitedAll] = useState([]);

  const fetchUserDatasLimitedEmpcode = async () => {
    try {
      let req = await axios.post(SERVICE.USERS_LIMITED_EMPCODE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: id,
      });

      let ALLusers = req?.data?.users;
      const lastThreeDigitsArray = ALLusers.map((employee) =>
        employee.empcode?.slice(-3)
      );
      setEmpCodeLimited(lastThreeDigitsArray);
      const allDigitsArray = ALLusers?.filter(
        (data) => data?._id !== id && data?.empcode !== ""
      )?.map((employee) => employee?.empcode);

      setEmpCodeLimitedAll(allDigitsArray);

      // setEmpCode(ALLusers);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchOverAllSettings = async (comp, branc) => {
    try {
      let res = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverallsettingsDefault(res?.data?.overallsettings[0]);
      let filter = res?.data?.overallsettings[0].todos.filter(
        (item) => item.branch.includes(branc) && item.company == comp
      );
      setOverallsettings(filter);
      setEmpsettings(res?.data?.overallsettings[0].empdigits);
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
    fetchUserDatasLimitedEmpcode();
    fetchDepartmentMonthsets();
  }, []);

  // days
  const weekdays = [
    { label: "None", value: "None" },
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  // week off details
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  // SELECT DROPDOWN STYLES
  const colourStyles = {
    menuList: (styles) => ({
      ...styles,
      background: "white",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      // color:'black',
      color: isFocused
        ? "rgb(255 255 255, 0.5)"
        : isSelected
          ? "white"
          : "black",
      background: isFocused
        ? "rgb(25 118 210, 0.7)"
        : isSelected
          ? "rgb(25 118 210, 0.5)"
          : null,
      zIndex: 1,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  let skno = 1;
  let eduno = 1;

  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;

    for (let i = 0; i < files?.length; i++) {
      const reader = new FileReader();
      const file = files[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFiles((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            type: file.type, // Include the file type
            data: reader.result.split(",")[1],
            remark: "",
          },
        ]);
      };
    }
  };

  const [errmsg, setErrmsg] = useState("");

  const [errorsLog, setErrorsLog] = useState({});


  // const [designation, setDesignation] = useState([]);
  const [shifttiming, setShiftTiming] = useState([]);
  const [usernameaddedby, setUsernameaddedby] = useState("");

  const [file, setFile] = useState("");

  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  const [qualinames, setQualinames] = useState("");
  const [skillSet, setSkillSet] = useState("");
  const [repotingtonames, setrepotingtonames] = useState([]);
  const [internCourseNames, setInternCourseNames] = useState();

  const [designationGroup, setDesignationGroup] = useState("");
  const [oldHierarchyData, setOldHierarchyData] = useState([]);
  const [oldHierarchyDataSupervisor, setOldHierarchyDataSupervisor] = useState(
    []
  );
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [olddesignation, setOldDesignation] = useState("");
  const changeTo = [{ label: "Replace", value: "Replace" }];
  const [changeToDesign, setChangeToDesign] = useState("Replace");
  const [superVisorChoosen, setSuperVisorChoosen] = useState(
    "Please Select Supervisor"
  );
  const [newHierarchyData, setNewHierarchyData] = useState([]);
  const [getingOlddatas, setGettingOldDatas] = useState([]);
  const [lastUpdatedData, setLastUpdatedData] = useState([]);
  const [hierarchyall, setHierarchyall] = useState([]);
  const [users, setUsers] = useState([]);
  const [designationsName, setDesignationsName] = useState([]);
  const [teamDesigChange, setTeamDesigChange] = useState("");
  const [oldUpdatedData, setOldUpdatedData] = useState([]);
  const [newUpdatingData, setNewUpdatingData] = useState([]);
  const [oldEmployeeHierData, setOldEmployeeHierData] = useState([]);
  const [userReportingToChange, setUserReportingToChange] = useState([]);
  const [oldDesignationGroup, setOldDesignationGroup] = useState("");
  const [newDesignationGroup, setNewDesignationGroup] = useState("");
  const [designationdatasEdit, setDesignationdatasEdit] = useState([]);
  const [newDesignatonChoosed, setnewDesignationChoosed] = useState("");
  const [oldTeamData, setOldTeamData] = useState([]);
  const [oldTeamSupervisor, setoldTeamSupervisor] = useState(false);
  const [newUpdateDataAll, setNewUpdateDataAll] = useState([]);
  const [newDataTeamWise, setNewDataTeamWise] = useState([]);
  const identifySuperVisor =
    hierarchyall
      ?.map((item) => item.supervisorchoose[0])
      ?.includes(getingOlddatas?.companyname) &&
    !designationsName?.includes(selectedDesignation);


  function getUniqueData(dataArray) {
    const uniqueData = [];
    const seen = new Set();

    for (const item of dataArray) {
      // Sort supervisorchoose array for consistent uniqueness checks
      const supervisorKey = item.supervisorchoose ? [...item.supervisorchoose].sort().join(",") : "";

      // Create a unique key based on (team, designation, supervisorchoose)
      const key = `${item.team}-${item.designation}-${supervisorKey}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(item);
      }
    }

    return uniqueData;
  }

  const fetchSuperVisorChangingHierarchy = async (value, page) => {
    // console.log(value , page , 'value , page')
    if (olddesignation !== value && page === "Designation") {
      let designationGrpName = alldesignation?.find(
        (data) => value === data?.name
      )?.group;
      let res = await axios.post(SERVICE.HIERARCHY_DEISGNATIONLOG_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        olddesig: oldDesignationGroup,
        designation: value,
        desiggroup: designationGrpName,
        user: getingOlddatas,
        company: boardingDetails.company,
        branch: boardingDetails.branch,
        unit: boardingDetails.unit,
        department: boardingDetails.department,
        team: boardingDetails.team,
      });
      const oldData = res?.data?.olddata?.length > 0 ? res?.data?.olddata : [];
      const newdata = res?.data?.newdata?.length > 0 ? res?.data?.newdata : [];
      const oldDataEmp =
        res?.data?.olddataEmp?.length > 0 ? res?.data?.olddataEmp : [];
      // console.log(oldData , newdata , oldDataEmp)
      setOldUpdatedData(oldData);
      setNewUpdatingData(newdata);
      setOldEmployeeHierData(oldDataEmp);
      setOldTeamData([]);
      setNewUpdateDataAll([]);
      setNewDataTeamWise([])
    }
    if (getingOlddatas?.team !== value && page === "Team") {
      let designationGrpName = alldesignation?.find(
        (data) => getingOlddatas?.designation === data?.name
      )?.group;
      let res = await axios.post(SERVICE.HIERARCHY_PROCESSALOOT_TEAM_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldteam: getingOlddatas?.team,
        team: value,
        user: getingOlddatas,
        desiggroup: designationGrpName
      });
      const oldData = res?.data?.olddata?.length > 0 ? getUniqueData(res?.data?.olddata) : [];
      const newDataAll =
        res?.data?.newdata[0]?.all?.length > 0
          ? getUniqueData(res?.data?.newdata[0]?.all)
          : [];
      const newDataRemaining =
        res?.data?.newdata[0]?.team?.length > 0
          ? getUniqueData(res?.data?.newdata[0]?.team)
          : [];
      const newDataAllSupervisor =
        res?.data?.supData?.length > 0 ? getUniqueData(res?.data?.supData) : [];

      setoldTeamSupervisor(newDataAllSupervisor)
      setOldTeamData(oldData);
      setNewUpdateDataAll(newDataAll);
      setNewDataTeamWise(newDataRemaining)
      setOldEmployeeHierData([]);
      setOldUpdatedData([]);
      setNewUpdatingData([]);
    }

  };


  const fetchReportingToUserHierarchy = async (value, page) => {
    if (page === "Designation" && getingOlddatas?.designation !== value) {
      let designationGrpName = alldesignation?.find(
        (data) => value === data?.name
      )?.group;
      let res = await axios.post(
        SERVICE.REPORTINGTO_DESIGNATION_USER_HIERARCHY_RELATION,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          olddesig: oldDesignationGroup,
          designation: value,
          desiggroup: designationGrpName,
          user: getingOlddatas,
          company: boardingDetails.company,
          branch: boardingDetails.branch,
          unit: boardingDetails.unit,
          department: boardingDetails.department,
          team: boardingDetails.team,
        }
      );
      const userResponse =
        res?.data?.newdata[0]?.result?.length > 0
          ? res?.data?.newdata[0]?.result
          : [];
      setUserReportingToChange(userResponse);
    }
    if (page === "Team" && getingOlddatas?.team !== value) {
      let designationGrpName = alldesignation?.find(
        (data) => value === data?.name
      )?.group;
      let res = await axios.post(
        SERVICE.REPORTINGTO_DESIGNATION_USER_HIERARCHY_RELATION,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          olddesig: oldDesignationGroup,
          designation: value,
          desiggroup: designationGrpName,
          user: getingOlddatas,
          company: boardingDetails.company,
          branch: boardingDetails.branch,
          unit: boardingDetails.unit,
          department: boardingDetails.department,
          team: boardingDetails.team,
        }
      );
      const userResponse =
        res?.data?.newdata[0]?.result?.length > 0
          ? res?.data?.newdata[0]?.result
          : [];
      setUserReportingToChange(userResponse);
    }
    else {
      setUserReportingToChange([]);
    }

  }





  //Qulalification Dropdowns
  const fetchqualification = async () => {
    try {
      let req = await axios.get(SERVICE.QUALIFICATIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setQualinames(
        req.data.qualificationdetails?.length > 0 &&
        req.data.qualificationdetails.map((d) => ({
          ...d,
          label: d.qualiname,
          value: d.qualiname,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [getunitname, setgetunitname] = useState("");
  let branch = getunitname ? getunitname : employee.branch;

  //SkillSet DropDowns

  const fetchSkillSet = async () => {
    try {
      let req = await axios.get(SERVICE.SKILLSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSkillSet(
        req.data.skillsets?.length > 0 &&
        req.data.skillsets.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
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
    const loadModels = async () => {
      const modelUrl = SERVICE.FACEDETECTLOGINMODEL;

      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);

    };
    loadModels();
    console.log(window.location.origin, "window.location.origin");
  }, []);
  // Image Upload
  const [btnUpload, setBtnUpload] = useState(false);
  // Image Upload
  function handleChangeImage(e) {
    let profileimage = document.getElementById("profileimage");
    var path = (window.URL || window.webkitURL).createObjectURL(
      profileimage.files[0]
    );
    toDataURL(path, function (dataUrl) {
      profileimage.setAttribute("value", String(dataUrl));
      setBoardingDetails({ ...employee, profileimage: String(dataUrl) });
      return dataUrl;
    });
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Floor Dropdowns
  const fetchUsernames = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setrepotingtonames(req.data.users);
      setAllUsersLoginName(
        req?.data?.users
          ?.filter((item) => item._id !== id)
          ?.map((user) => user.username)
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Shift Dropdowns
  const fetchShiftDropdowns = async () => {
    try {
      let req = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftTiming(
        req.data.shifts?.length > 0 &&
        req.data.shifts.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [name, setUserNameEmail] = useState("");
  const [reportingtonames, setreportingtonames] = useState([]);
  // User Name Functionality
  const fetchUserName = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setreportingtonames(req.data.users);
      req.data.users.filter((data) => {
        if (data._id !== id) {
          if (first + second === data.username) {
            setThird(
              first +
              second?.slice(0, 1) +
              new Date(employee.dob ? employee.dob : "").getDate()
            );
            setUserNameEmail(
              first +
              second?.slice(0, 1) +
              new Date(employee.dob ? employee.dob : "").getDate()
            );
          } else if (
            first + second + new Date(employee.dob).getDate() ==
            data.username
          ) {
            setThird(
              first +
              second?.slice(0, 1) +
              new Date(employee.dob ? employee.dob : "").getMonth()
            );
            setUserNameEmail(
              first +
              second?.slice(0, 1) +
              new Date(employee.dob ? employee.dob : "").getMonth()
            );
          } else if (first + second?.slice(0, 1) === data.username) {
            setThird(first + second?.slice(0, 2));
            setUserNameEmail(first + second?.slice(0, 2));
          } else if (first + second?.slice(0, 2) === data.username) {
            setThird(first + second?.slice(0, 3));
            setUserNameEmail(first + second?.slice(0, 3));
          }
        }
      });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchSuperVisorDropdowns = async (team, user) => {
    let res = await axios.post(SERVICE.HIERARCHY_REPORTING_TO, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      team: team,
      company: user?.company,
      branch: user?.branch,
      unit: user?.unit,

    });

    const resultUsers =
      res?.data?.result?.length > 0
        ? res?.data?.result[0]?.result?.supervisorchoose?.filter(data => data !== user?.companyname)
        : [];
    setreportingtonames(resultUsers);
  };

  //webcam

  //id for login

  let loginid = localStorage.LoginUserId;
  //get user row  edit  function
  const getusername = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let user =
        res.data.users?.length > 0 &&
        res.data.users.filter((data) => {
          if (loginid === data?._id) {
            setUsernameaddedby(data?.username);
            return data;
          }
        });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Itern Courses Dropdowns
  const fetchInternCourses = async () => {
    try {
      let req = await axios.get(SERVICE.INTERNCOURSE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setInternCourseNames(
        req.data.internCourses?.length > 0 &&
        req.data.internCourses.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchShiftDropdowns();
    fetchWorkStation();
    fetchqualification();
    fetchSkillSet();
    fetchInternCourses();
    fetchUsernames();
  }, []);

  useEffect(() => {
    ShiftGroupingDropdwons();
    getusername();
  }, []);

  useEffect(() => {
    ShowErrMess();
    fetchUserName();
    setThird(first + second?.slice(0, 1));
    setUserNameEmail(first + second?.slice(0, 1));
  }, [first, second, name]);

  //ERROR MESSAGESE
  const ShowErrMess = () => {
    if (first?.length == "" || second?.length == 0) {
      setErrmsg("Unavailable");
    } else if (third?.length >= 1) {
      setErrmsg("Available");
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [openPopupUpload, setOpenPopupUpload] = useState(false);

  const LoadingDialog = ({ open, onClose, progress }) => {
    const dialogStyles = {
      padding: "24px",
      textAlign: "center",
    };

    const dialogTitleStyles = {
      fontWeight: "bold",
      fontSize: "1.5rem",
      color: "#3f51b5", // Primary color
    };

    const dialogContentStyles = {
      padding: "16px",
    };

    const progressStyles = {
      marginTop: "16px",
      height: "10px",
      borderRadius: "5px",
    };

    const progressTextStyles = {
      marginTop: "8px",
      fontWeight: "bold",
      color: "#4caf50", // Success color
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle style={dialogTitleStyles}>Updating...</DialogTitle>
        <DialogContent style={dialogContentStyles}>
          <Typography>
            Please wait while we update the employee code across all pages.
          </Typography>
          <LinearProgress
            style={progressStyles}
            variant="determinate"
            value={progress}
          />
          <Typography style={progressTextStyles}>{progress}%</Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    );
  };
  const sendEditRequest = async () => {
    let newEmpCode = await EmployeeCodeAutoGenerate(
      boardingDetails.company,
      boardingDetails.branch,
      boardingDetails.branchcode,
      dateOfJoining
    );
    setOpenPopupUpload(true);


    try {

      // departmentlog details
      const finaldot = [
        ...(departmentLog || []),
        {
          userid: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
          username: boardingDetails?.username,
          department: String(boardingDetails.department),
          startdate: String(dateOfJoining),
          time: moment().format("HH:mm"),
          branch: String(boardingDetails.branch),
          companyname: String(boardingDetails.company),
          unit: String(boardingDetails.unit),
          team: String(boardingDetails.team),
          status: Boolean(boardingDetails.status),
          updatedusername: String(isUserRoleAccess.companyname),
          updateddatetime: String(new Date()),
          logeditedby: [],
          movetolive: true,
        },
      ];

      // designation log details

      const finaldesignationlog = [
        ...(designationLog || []),
        {
          username: String(boardingDetails.companyname),
          companyname: String(boardingDetails.company),
          designation: String(boardingDetails.designation),
          startdate: String(dateOfJoining), // Fixed the field names
          time: moment().format("HH:mm"),
          branch: String(boardingDetails.branch), // Fixed the field names
          unit: String(boardingDetails.unit),
          team: String(boardingDetails.team),
          updatedusername: String(isUserRoleAccess.companyname),
          updateddatetime: String(new Date()),
          movetolive: true,
        },
      ];

      // boarding log details
      let trimmedWorkstation =
        primaryWorkStation == "Please Select Primary Work Station"
          ? []
          : primaryWorkStation;
      const finalboardinglog = [
        ...(boardingLog || []),
        {
          username: String(boardingDetails.companyname),
          company: String(boardingDetails.company),
          startdate: String(dateOfJoining), // Fixed the field names
          time: moment().format("HH:mm"),
          branch: String(boardingDetails.branch), // Fixed the field names
          unit: String(boardingDetails.unit),
          team: String(boardingDetails.team),
          floor: String(
            boardingDetails.floor === "Please Select Floor"
              ? ""
              : boardingDetails.floor
          ),
          area: String(
            boardingDetails.area === "Please Select Area"
              ? ""
              : boardingDetails.area
          ),
          workmode: String(boardingDetails.workmode),
          workstationofficestatus: Boolean(boardingDetails.ifoffice),
          workstationinput: String(
            boardingDetails.workmode === "Remote" || boardingDetails.ifoffice
              ? primaryWorkStationInput
              : ""
          ),
          workstation:
            boardingDetails.workmode !== "Remote"
              ? valueWorkStation.length === 0
                ? trimmedWorkstation
                : [primaryWorkStation, ...valueWorkStation]
              : [primaryWorkStation, ...valueWorkStation],
          ischangecompany:
            boardingDetails.company === boardingLog[boardingLog?.length - 1].company
              ? Boolean(false)
              : Boolean(true),
          ischangebranch:
            boardingDetails.company === boardingLog[boardingLog?.length - 1].company
              ? boardingDetails.branch === boardingLog[boardingLog?.length - 1].branch
                ? Boolean(false)
                : Boolean(true)
              : Boolean(true),
          ischangeunit:
            boardingDetails.branch === boardingLog[boardingLog?.length - 1].branch
              ? boardingDetails.unit === boardingLog[boardingLog?.length - 1].unit
                ? Boolean(false)
                : Boolean(true)
              : Boolean(true),
          ischangeteam:
            boardingDetails.unit === boardingLog[boardingLog?.length - 1].unit
              ? boardingDetails.team === boardingLog[boardingLog?.length - 1].team
                ? Boolean(false)
                : Boolean(true)
              : Boolean(true),
          ischangefloor:
            boardingDetails.company === boardingLog[boardingLog?.length - 1].company
              ? boardingDetails.branch === boardingLog[boardingLog?.length - 1].branch
                ? Boolean(false)
                : Boolean(true)
              : Boolean(true),
          ischangearea:
            boardingDetails.company === boardingLog[boardingLog?.length - 1].company
              ? boardingDetails.branch === boardingLog[boardingLog?.length - 1].branch
                ? boardingDetails.floor === boardingLog[boardingLog?.length - 1].floor
                  ? Boolean(false)
                  : Boolean(true)
                : Boolean(true)
              : Boolean(true),
          ischangeworkstation:
            boardingDetails.company === boardingLog[boardingLog?.length - 1].company
              ? boardingDetails.branch === boardingLog[boardingLog?.length - 1].branch
                ? boardingDetails.unit === boardingLog[boardingLog?.length - 1].unit
                  ? boardingDetails.floor === boardingLog[boardingLog?.length - 1].floor
                    ? Boolean(false)
                    : Boolean(true)
                  : Boolean(true)
                : Boolean(true)
              : Boolean(true),
          logcreation: "user",
          ischangeworkmode: boardingDetails.workmode === boardingLog[boardingLog?.length - 1].workmode ? false : true,
          updatedusername: String(isUserRoleAccess.companyname),
          updateddatetime: String(new Date()),
          shifttype: String(boardingDetails.shifttype),
          shifttiming: String(boardingDetails.shifttiming),
          shiftgrouping: String(boardingDetails.shiftgrouping),
          weekoff: [...valueCate],
          todo: boardingDetails.shifttype === "Standard" ? [] : [...todo],
          logeditedby: [],
          movetolive: true,
        },
      ];

      // process log details

      const finalprocesslog = [
        ...(processLog || []),
        {
          company: String(boardingDetails.company),
          branch: String(boardingDetails.branch),
          unit: String(boardingDetails.unit),
          team: String(boardingDetails.team),
          process: String(
            loginNotAllot.process === "" || loginNotAllot.process == undefined
              ? ""
              : loginNotAllot.process
          ),
          processduration: String(
            loginNotAllot.processduration === "" ||
              loginNotAllot.processduration == undefined
              ? ""
              : loginNotAllot.processduration
          ),
          processtype: String(
            loginNotAllot.processtype === "" ||
              loginNotAllot.processtype == undefined
              ? ""
              : loginNotAllot.processtype
          ),

          date: String(dateOfJoining),
          logeditedby: [],
          updateddatetime: String(new Date()),
          updatedusername: String(isUserRoleAccess.companyname),
          time: `${loginNotAllot.time}:${loginNotAllot?.timemins}`,
          movetolive: true,
        },
      ];

      //Experience log

      const finalassignexplog = [
        ...(employee?.assignExpLog || []),
        {

          expmode: String(assignExperience.assignExpMode),
          expval: String(assignExperience.assignExpvalue),

          endexp: String(assignExperience.assignEndExpvalue),
          endexpdate:
            assignExperience.assignEndExpvalue === "Yes"
              ? String(assignExperience.assignEndExpDate)
              : "",
          endtar: String(assignExperience.assignEndTarvalue),
          endtardate:
            assignExperience.assignEndTarvalue === "Yes"
              ? String(assignExperience.assignEndTarDate)
              : "",
          updatedate: String(assignExperience.updatedate),
          date: String(dateOfJoining),
          movetolive: true,
        },
      ];
      // State for tracking overall upload progress
      let totalLoaded = 0;
      let totalSize = 0;

      const handleUploadProgress = (progressEvent) => {
        if (progressEvent.event.lengthComputable) {
          console.log(
            `Progress Event - Loaded: ${progressEvent.loaded}, Total: ${progressEvent.total}`
          );
          updateTotalProgress(progressEvent.loaded, progressEvent.total);
        } else {
          console.log("Unable to compute progress information.");
        }
      };

      const updateTotalProgress = (loaded, size) => {
        totalLoaded += loaded;
        totalSize += size;
        if (totalSize > 0) {
          const percentCompleted = Math.round((totalLoaded * 100) / totalSize);
          setUploadProgress(percentCompleted);
          console.log(`Total Upload Progress: ${percentCompleted}%`);
        } else {
          console.log("Total size is zero, unable to compute progress.");
        }
      };
      await axios.post(
        `${SERVICE.UPDATE_LOGINALLOT_MOVETOLIVE}`,
        {
          empname: getingOlddatas.companyname,
          company: boardingDetails.company,
          branch: boardingDetails.branch,
          unit: boardingDetails.unit,
          team: boardingDetails.team,
          date: dateOfJoining,
          time: moment().format("HH:mm"),

        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          onUploadProgress: handleUploadProgress,
        }
      );


      let rocketchatshiftgrouping = [];
      let rocketchatshift = [];
      // Check if the user's boardingLog exists and has entries
      if (finalboardinglog && finalboardinglog.length > 0) {
        const lastBoardingLog = finalboardinglog[finalboardinglog.length - 1];

        // If shifttype is "Standard", push shiftgrouping and shifttiming values
        if (lastBoardingLog.shifttype === "Standard") {
          if (lastBoardingLog.shiftgrouping) {
            rocketchatshiftgrouping.push(lastBoardingLog.shiftgrouping);
          }
          if (lastBoardingLog.shifttiming) {
            rocketchatshift.push(lastBoardingLog.shifttiming);
          }
        } else if (lastBoardingLog.shifttype !== "Standard") {
          // If shifttype is not "Standard", check the todo array
          const boardtodo = lastBoardingLog.todo;

          if (boardtodo && boardtodo.length > 0) {
            // Iterate over the todo array and push shiftgrouping and shifttiming
            boardtodo.forEach(item => {
              if (item.shiftgrouping) {
                rocketchatshiftgrouping.push(item.shiftgrouping);
              }
              if (item.shifttiming) {
                rocketchatshift.push(item.shifttiming);
              }
            });
          }
        }
      }
      let res = await axios.put(
        `${SERVICE.UPDATE_INTERN}/${newId}`,
        {
          username: boardingDetails?.username,
          companyname: boardingDetails?.companyname,
          rocketchatemail: createRocketChat?.email,
          rocketchatid: boardingDetails?.rocketchatid || "",
          rocketchatroles: createRocketChat?.create ? createRocketChat?.roles?.map(data => data?.value) : [],
          rocketchatteamid: boardingDetails?.rocketchatteamid || [],
          rocketchatchannelid: boardingDetails?.rocketchatchannelid || [],
          rocketchatshiftgrouping,
          rocketchatshift,
          dot: dateOfTraining,
          religion: String(boardingDetails.religion),
          company: String(boardingDetails.company),
          branch: String(boardingDetails.branch),
          unit: String(boardingDetails.unit),
          team: String(boardingDetails.team),
          employeecount: String(boardingDetails?.employeecount || ""),
          floor: String(
            boardingDetails.floor === "Please Select Floor"
              ? ""
              : boardingDetails.floor
          ),
          area: String(
            boardingDetails.area === "Please Select Area"
              ? ""
              : boardingDetails.area
          ),
          department: String(boardingDetails.department),
          designation: String(boardingDetails.designation),
          shiftgrouping: String(boardingDetails.shiftgrouping),
          shifttiming: String(boardingDetails.shifttiming),
          shifttype: String(boardingDetails.shifttype),
          reportingto: String(boardingDetails.reportingto),
          boardingLog: finalboardinglog,

          internstatus: String("Moved"),
          doj: String(dateOfJoining),
          workmode: String(boardingDetails.workmode),
          wordcheck: Boolean(internStatusUpdate.wordcheck),
          empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),

          workstation:
            boardingDetails.workmode !== "Remote"
              ? valueWorkStation.length === 0
                ? trimmedWorkstation
                : [primaryWorkStation, ...valueWorkStation]
              : [primaryWorkStation, ...valueWorkStation],
          workstationinput: String(
            boardingDetails.workmode === "Remote" || boardingDetails.ifoffice
              ? primaryWorkStationInput
              : ""
          ),

          workstationofficestatus: Boolean(boardingDetails.ifoffice),

          designationlog: finaldesignationlog,

          departmentlog: finaldot,
          processlog: finalprocesslog,
          assignExpLog: finalassignexplog,

          assignExpMode: String(assignExperience.assignExpMode),

          assignExpvalue: String(assignExperience.assignExpvalue),

          endexp: String(assignExperience.assignEndExpvalue),
          endexpdate:
            assignExperience.assignEndExpvalue === "Yes"
              ? String(assignExperience.assignEndExpDate)
              : "",
          endtar: String(assignExperience.assignEndTarvalue),
          endtardate:
            assignExperience.assignEndTarvalue === "Yes"
              ? String(assignExperience.assignEndTarDate)
              : "",
          updatedate: String(assignExperience.updatedate),

          process: String(loginNotAllot.process),
          processduration: String(loginNotAllot.processduration),
          processtype: String(loginNotAllot.processtype),
          date: formattedDate,
          time: String(loginNotAllot.time),
          timemins: String(loginNotAllot.timemins),

          grosssalary: String(overallgrosstotal),
          modeexperience: String(modeexperience),
          targetexperience: String(targetexperience),
          targetpts: String(targetpts),
          attendancemode: [...valueAttMode],
          updatedby: [
            ...updatedBy,
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          onUploadProgress: handleUploadProgress,
        }
      );
      if (!boardingDetails?.rocketchatid && createRocketChat?.create) {
        await axios.post(`${SERVICE.CREATE_ROCKETCHAT_USER_INEDIT}`,
          {


            createrocketchat: Boolean(createRocketChat?.create),
            rocketchatemail: String(createRocketChat?.create ? createRocketChat?.email : ""),
            rocketchatroles: createRocketChat?.create ? createRocketChat?.roles?.map(data => data?.value) : [],
            username: boardingDetails?.username,
            companyname: boardingDetails?.companyname,
            password: String(boardingDetails.originalpassword),
            callingname: String(boardingDetails.callingname),
            employeeid: newId,
            company: String(boardingDetails.company),
            branch: String(boardingDetails.branch),
            unit: String(boardingDetails.unit),
            team: String(boardingDetails.team),
            department: String(boardingDetails.department),
            designation: String(boardingDetails.designation),
            process: String(loginNotAllot.process),
            workmode: String(boardingDetails.workmode),
            rocketchatshiftgrouping,
            rocketchatshift,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            onUploadProgress: handleUploadProgress,
          });
      }
      if (documentID) {
        let employeeDocuments = await axios.put(
          `${SERVICE.EMPLOYEEDOCUMENT_SINGLE}/${documentID}`,
          {
            empcode:
              String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
            type: String("Employee"),
            updatedby: [
              ...updatedBy,
              {
                name: String(isUserRoleAccess?.username),
                date: String(new Date()),
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            onUploadProgress: handleUploadProgress,
          }
        );

      }


      if (identifySuperVisor) {
        // Changing the old Supervisor to to new Group
        if (newUpdatingData?.length > 0) {
          const primaryDep = newUpdatingData[0]?.primaryDep;
          const secondaryDep = newUpdatingData[0]?.secondaryDep;
          const tertiary = newUpdatingData[0]?.tertiaryDep;
          const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
          const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
          const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
          const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
          const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
          const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;

          if (
            [
              primaryDep,
              secondaryDep,
              tertiary,
              primaryDepAll,
              secondaryDepAll,
              tertiaryAll,
              primaryWithoutDep,
              secondaryWithoutDep,
              tertiaryWithoutDep,
            ].some((dep) => dep?.length > 0) &&
            userReportingToChange?.length > 0
          ) {
            const supervisor = userReportingToChange[0]?.supervisorchoose;
            let res = await axios.put(
              `${SERVICE.UPDATE_INTERN}/${newId}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                reportingto: String(supervisor[0]),
                updatedby: [
                  ...updatedBy,
                  {
                    name: String(isUserRoleAccess.companyname),
                    date: String(new Date()),
                  },
                ],
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                onUploadProgress: handleUploadProgress,
              });
          }

          if (primaryDep?.length > 0) {
            const uniqueEntries = primaryDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    pagecontrols: data?.pagecontrols,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (secondaryDep?.length > 0) {
            const uniqueEntries = secondaryDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    pagecontrols: data?.pagecontrols,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (tertiary?.length > 0) {
            const uniqueEntries = tertiary?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    pagecontrols: data?.pagecontrols,
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (primaryDepAll?.length > 0) {
            const uniqueEntries = primaryDepAll?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    pagecontrols: data?.pagecontrols,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (secondaryDepAll?.length > 0) {
            const uniqueEntries = secondaryDepAll?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    pagecontrols: data?.pagecontrols,
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (tertiaryAll?.length > 0) {
            const uniqueEntries = tertiaryAll?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    pagecontrols: data?.pagecontrols,
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (primaryWithoutDep?.length > 0) {
            const uniqueEntries = primaryWithoutDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.department === item.department &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data?.pagecontrols,
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (secondaryWithoutDep?.length > 0) {
            const uniqueEntries = secondaryWithoutDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.department === item.department &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    pagecontrols: data?.pagecontrols,
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (tertiaryWithoutDep?.length > 0) {
            const uniqueEntries = tertiaryWithoutDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.department === item.department &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {


                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    pagecontrols: data?.pagecontrols,
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
        }
        //Removing old supervisor to new supervisor
        if (oldUpdatedData?.length > 0) {
          oldUpdatedData?.map(async (data, index) => {
            axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {

              supervisorchoose: superVisorChoosen,
            },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                onUploadProgress: handleUploadProgress,
              });
          });
        }
        // Changing Employee from one deignation to another ==>> Replace
        if (oldEmployeeHierData?.length > 0 && newUpdatingData?.length > 0) {
          let ans = oldEmployeeHierData?.map((data) => {
            axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                onUploadProgress: handleUploadProgress,
              });
          });
        }
      }
      // Only for Employees
      if (!identifySuperVisor) {
        if (oldEmployeeHierData?.length > 0) {
          let ans = oldEmployeeHierData?.map((data) => {
            axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                onUploadProgress: handleUploadProgress,
              });
          });
        }
        if (newUpdatingData?.length > 0) {
          const primaryDep = newUpdatingData[0]?.primaryDep;
          const secondaryDep = newUpdatingData[0]?.secondaryDep;
          const tertiary = newUpdatingData[0]?.tertiaryDep;
          const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
          const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
          const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
          const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
          const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
          const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;
          if (
            [
              primaryDep,
              secondaryDep,
              tertiary,
              primaryDepAll,
              secondaryDepAll,
              tertiaryAll,
              primaryWithoutDep,
              secondaryWithoutDep,
              tertiaryWithoutDep,
            ].some((dep) => dep?.length > 0) &&
            userReportingToChange?.length > 0
          ) {
            const supervisor = userReportingToChange[0]?.supervisorchoose;
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${id}`, {

              reportingto: String(supervisor[0]),
              updatedby: [
                ...updatedBy,
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                onUploadProgress: handleUploadProgress,
              });
          }

          if (primaryDep?.length > 0) {
            const uniqueEntries = primaryDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    pagecontrols: data?.pagecontrols,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (secondaryDep?.length > 0) {
            const uniqueEntries = secondaryDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
                  {

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: getingOlddatas.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: boardingDetails?.branch,
                    empunit: boardingDetails?.unit,
                    empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                    empteam: boardingDetails?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                    onUploadProgress: handleUploadProgress,
                  })
            );
          }
          if (tertiary?.length > 0) {
            const uniqueEntries = tertiary?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  company: String(data?.company),
                  designationgroup: designationGroup,
                  department: String(data?.department),
                  branch: String(data?.branch),
                  unit: String(data?.unit),
                  team: String(data?.team),
                  supervisorchoose: String(data.supervisorchoose),
                  mode: String(data.mode),
                  level: String(data.level),
                  control: String(data.control),
                  employeename: getingOlddatas.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: boardingDetails?.branch,
                  empunit: boardingDetails?.unit,
                  empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                  empteam: boardingDetails?.team,
                  pagecontrols: data?.pagecontrols,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
            );
          }
          if (primaryDepAll?.length > 0) {
            const uniqueEntries = primaryDepAll?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  company: String(data?.company),
                  designationgroup: designationGroup,
                  department: String(data?.department),
                  branch: String(data?.branch),
                  unit: String(data?.unit),
                  team: String(data?.team),
                  supervisorchoose: String(data.supervisorchoose),
                  mode: String(data.mode),
                  level: String(data.level),
                  control: String(data.control),
                  employeename: getingOlddatas.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: boardingDetails?.branch,
                  empunit: boardingDetails?.unit,
                  pagecontrols: data?.pagecontrols,
                  empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                  empteam: boardingDetails?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
            );
          }
          if (secondaryDepAll?.length > 0) {
            const uniqueEntries = secondaryDepAll?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  company: String(data?.company),
                  designationgroup: designationGroup,
                  department: String(data?.department),
                  branch: String(data?.branch),
                  unit: String(data?.unit),
                  team: String(data?.team),
                  supervisorchoose: String(data.supervisorchoose),
                  mode: String(data.mode),
                  level: String(data.level),
                  control: String(data.control),
                  employeename: getingOlddatas.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: boardingDetails?.branch,
                  empunit: boardingDetails?.unit,
                  empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                  empteam: boardingDetails?.team,
                  pagecontrols: data?.pagecontrols,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
            );
          }
          if (tertiaryAll?.length > 0) {
            const uniqueEntries = tertiaryAll?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.company === item.company &&
                    t.branch === item.branch &&
                    t.unit === item.unit &&
                    t.team === item.team &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  company: String(data?.company),
                  designationgroup: designationGroup,
                  department: String(data?.department),
                  branch: String(data?.branch),
                  unit: String(data?.unit),
                  team: String(data?.team),
                  supervisorchoose: String(data.supervisorchoose),
                  mode: String(data.mode),
                  level: String(data.level),
                  control: String(data.control),
                  pagecontrols: data?.pagecontrols,
                  employeename: getingOlddatas.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: boardingDetails?.branch,
                  empunit: boardingDetails?.unit,
                  empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                  empteam: boardingDetails?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
            );
          }
          if (primaryWithoutDep?.length > 0) {
            const uniqueEntries = primaryWithoutDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.department === item.department &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  company: String(data?.company),
                  designationgroup: designationGroup,
                  department: String(data?.department),
                  branch: String(data?.branch),
                  unit: String(data?.unit),
                  team: String(data?.team),
                  supervisorchoose: String(data.supervisorchoose),
                  mode: String(data.mode),
                  level: String(data.level),
                  pagecontrols: data?.pagecontrols,
                  control: String(data.control),
                  employeename: getingOlddatas.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: boardingDetails?.branch,
                  empunit: boardingDetails?.unit,
                  empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                  empteam: boardingDetails?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
            );
          }
          if (secondaryWithoutDep?.length > 0) {
            const uniqueEntries = secondaryWithoutDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.department === item.department &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  company: String(data?.company),
                  designationgroup: designationGroup,
                  department: String(data?.department),
                  branch: String(data?.branch),
                  unit: String(data?.unit),
                  team: String(data?.team),
                  supervisorchoose: String(data.supervisorchoose),
                  mode: String(data.mode),
                  level: String(data.level),
                  pagecontrols: data?.pagecontrols,
                  control: String(data.control),
                  employeename: getingOlddatas.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: boardingDetails?.branch,
                  empunit: boardingDetails?.unit,
                  empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                  empteam: boardingDetails?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
            );
          }
          if (tertiaryWithoutDep?.length > 0) {
            const uniqueEntries = tertiaryWithoutDep?.filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.department === item.department &&
                    t.supervisorchoose?.length ===
                    item.supervisorchoose?.length &&
                    t.supervisorchoose?.every((dta) =>
                      item.supervisorchoose.includes(dta)
                    )
                )
            );

            let answer = uniqueEntries?.map(
              async (data) =>
                await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  company: String(data?.company),
                  designationgroup: designationGroup,
                  department: String(data?.department),
                  branch: String(data?.branch),
                  unit: String(data?.unit),
                  team: String(data?.team),
                  supervisorchoose: String(data.supervisorchoose),
                  mode: String(data.mode),
                  level: String(data.level),
                  pagecontrols: data?.pagecontrols,
                  control: String(data.control),
                  employeename: getingOlddatas.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: boardingDetails?.branch,
                  empunit: boardingDetails?.unit,
                  empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
                  empteam: boardingDetails?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
            );
          }
        }
      }
      // Deleting the Old Data of TEAM MATCHED
      if (oldTeamData?.length > 0) {
        let ans = oldTeamData?.map(data => {
          axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              onUploadProgress: handleUploadProgress,
            });
        })

      }
      // // Adding NEW TEAM TO ALL Conditon Employee
      // if (newUpdateDataAll?.length > 0) {
      //   let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
      //     {


      //       company: String(newUpdateDataAll[0].company),
      //       designationgroup: String(newUpdateDataAll[0]?.designationgroup),
      //       department: String(newUpdateDataAll[0].department),
      //       branch: String(newUpdateDataAll[0].branch),
      //       unit: String(newUpdateDataAll[0].unit),
      //       team: String(newUpdateDataAll[0]?.team),
      //       supervisorchoose: String(newUpdateDataAll[0].supervisorchoose),
      //       mode: String(newUpdateDataAll[0].mode),
      //       level: String(newUpdateDataAll[0].level),
      //       control: String(newUpdateDataAll[0].control),


      //       employeename: getingOlddatas?.companyname,
      //       access: newUpdateDataAll[0].access,
      //       action: Boolean(true),
      //       empbranch: boardingDetails?.branch,
      //       empunit: boardingDetails?.unit,
      //       empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
      //       empteam: boardingDetails?.team,
      //       pagecontrols: newUpdateDataAll[0].pagecontrols,
      //       addedby: [
      //         {
      //           name: String(isUserRoleAccess?.username),
      //           date: String(new Date()),
      //         },
      //       ],
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },
      //       onUploadProgress: handleUploadProgress,
      //     });
      // }

      // // Adding NEW TEAM TO ACTUAL TEAM WISE DATA  Conditon Employee
      // if (newDataTeamWise?.length > 0) {
      //   let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`,
      //     {


      //       company: String(newDataTeamWise[0]?.company),
      //       designationgroup: String(newDataTeamWise[0]?.designationgroup),
      //       department: String(newDataTeamWise[0]?.department),
      //       branch: String(newDataTeamWise[0]?.branch),
      //       unit: String(newDataTeamWise[0]?.unit),
      //       team: String(newDataTeamWise[0]?.team),
      //       supervisorchoose: String(newDataTeamWise[0].supervisorchoose),
      //       mode: String(newDataTeamWise[0].mode),
      //       level: String(newDataTeamWise[0].level),
      //       control: String(newDataTeamWise[0].control),
      //       employeename: getingOlddatas?.companyname,
      //       access: newDataTeamWise[0].access,
      //       action: Boolean(true),
      //       empbranch: boardingDetails?.branch,
      //       empunit: boardingDetails?.unit,
      //       empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
      //       empteam: boardingDetails?.team,
      //       pagecontrols: newDataTeamWise[0].pagecontrols,
      //       addedby: [
      //         {
      //           name: String(isUserRoleAccess?.username),
      //           date: String(new Date()),
      //         },
      //       ],
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },
      //       onUploadProgress: handleUploadProgress,
      //     });
      // }

      async function addNewTeams(dataArray) {
        await Promise.all(
          dataArray.map(async (item) => {
            await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              company: String(item.company),
              designationgroup: String(item.designationgroup),
              department: String(item.department),
              branch: String(item.branch),
              unit: String(item.unit),
              team: String(item.team),
              supervisorchoose: String(item.supervisorchoose),
              mode: String(item.mode),
              level: String(item.level),
              control: String(item.control),
              pagecontrols: item.pagecontrols,
              access: item.access,

              employeename: getingOlddatas?.companyname,
              action: Boolean(true),
              empbranch: boardingDetails?.branch,
              empunit: boardingDetails?.unit,
              empcode: String(internStatusUpdate.wordcheck ? employeecodenew : newEmpCode),
              empteam: boardingDetails?.team,
              addedby: [
                {
                  name: String(isUserRoleAccess?.username),
                  date: String(new Date()),
                },
              ],


            });
          })
        );
      }
      // Execute the operations
      if (newUpdateDataAll.length > 0) {
        await addNewTeams(newUpdateDataAll);
      }

      if (newDataTeamWise.length > 0) {
        await addNewTeams(newDataTeamWise);
      }





      await axios.put(
        `${SERVICE.EMPLOYEECODEOVERALLUPDATE}`,
        {
          oldempcode: oldEmpCode,
          newempcode: String(
            internStatusUpdate.wordcheck ? employeecodenew : newEmpCode
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          onUploadProgress: handleUploadProgress,
        }
      );

      try {
        let domainUpdate = await axios.post(
          SERVICE.CREATEPOSTFIXMAILUSERBYEMPLOYEE,
          {
            username: mailDetails?.username,
            password: mailDetails?.originalpassword,
            name: mailDetails?.companyname,
            maildir: mailDetails?.username,
            quota: mailDetails?.quota ?? "1000",
            domain: domainsList,
            local_part: mailDetails?.username,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            onUploadProgress: handleUploadProgress,
          }
        );

        // Check response status and display corresponding notifications
        if (domainUpdate.status === 201) {
          // Show success toast if response code is 201
          toast.success(domainUpdate?.data?.message);
        } else {
          toast.error(domainUpdate?.data?.message);
        }
      } catch (error) {
        console.log(error)
        // If response code is 400, show an alert with the error message
        if (error.response && error.response.status === 400) {
          toast.error(`Error: ${error.response.data.message || 'Bad request'}`);
        } else {
          // General error handling for other status codes
          toast.error('Failed to create user. Please try again.');
        }
      }

      setDateOfJoining(date);
      setEmployeecodenew("");
      setOpenPopupUpload(false);
      // handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      backPage("/internlist");
      // await fetchEmployee();

    } catch (err) {
      console.log(err);
      setOpenPopupUpload(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const nextStep = () => {
    // Check the validity of field1

    if (loginNotAllot.process === "Please Select Process") {

      setPopupContentMalert("Please Select Process!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      loginNotAllot.time === "Hrs" ||
      loginNotAllot.time === "" ||
      loginNotAllot.time == undefined ||
      loginNotAllot.timemins === "" ||
      loginNotAllot.timemins == undefined ||
      loginNotAllot.timemins === "Mins" ||
      (loginNotAllot.time === "00" && loginNotAllot.timemins === "00")
    ) {

      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setStep(step + 1);
    }
  };

  //login detail validation
  const nextStepLog = (e) => {
    e.preventDefault();
    const checkShiftMode = todo?.filter(
      (d) => d.shiftmode === "Please Select Shift Mode"
    );
    const checkShiftGroup = todo?.filter(
      (d) =>
        d.shiftmode === "Shift" &&
        d.shiftgrouping === "Please Select Shift Grouping"
    );
    const checkShift = todo?.filter(
      (d) => d.shiftmode === "Shift" && d.shifttiming === "Please Select Shift"
    );

    let value = todo.reduce((indexes, obj, index) => {
      if (obj.shiftmode === "Please Select Shift Mode") {
        // Check if the object has the 'name' property
        indexes.push(index);
      }
      return indexes;
    }, []);

    setFinderrorindex(value);

    let valuegrp = todo.reduce((indexes, obj, index) => {
      if (
        obj.shiftmode === "Shift" &&
        obj.shiftgrouping === "Please Select Shift Grouping"
      ) {
        // Check if the object has the 'name' property
        indexes.push(index);
      }
      return indexes;
    }, []);

    setFinderrorindexgrp(valuegrp);

    let valuegrpshift = todo.reduce((indexes, obj, index) => {
      if (
        obj.shiftmode === "Shift" &&
        obj.shifttiming === "Please Select Shift"
      ) {
        // Check if the object has the 'name' property
        indexes.push(index);
      }
      return indexes;
    }, []);

    setFinderrorindexshift(valuegrpshift);

    let oneweekrotation = weekoptions2weeks?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;
    let twoweekrotation = weekoptions1month?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;
    let onemonthrotation = weekoptions2months?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;




    const primaryDep = newUpdatingData[0]?.primaryDep;
    const secondaryDep = newUpdatingData[0]?.secondaryDep;
    const tertiary = newUpdatingData[0]?.tertiaryDep;
    const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
    const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
    const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
    const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
    const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
    const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;




    if (boardingDetails?.company === "Please Select Company") {

      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.branch === "Please Select Branch") {

      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.unit === "Please Select Unit") {

      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.department === "Please Select Department") {

      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.team === "Please Select Team") {

      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (boardingDetails?.designation === "Please Select Designation") {

      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (
      changeToDesign === "Replace" &&
      identifySuperVisor &&
      superVisorChoosen === "Please Select Supervisor"
    ) {

      setPopupContentMalert("Please Select Supervisor 1!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (teamDesigChange === 'Designation' &&
      (changeToDesign === "Replace" && oldEmployeeHierData?.length > 0 && (primaryDep?.length < 1 &&
        secondaryDep?.length < 1 &&
        tertiary?.length < 1 &&
        primaryDepAll?.length < 1 &&
        secondaryDepAll?.length < 1 &&
        tertiaryAll?.length < 1 &&
        primaryWithoutDep?.length < 1 &&
        secondaryWithoutDep?.length < 1 &&
        tertiaryWithoutDep?.length < 1
      ))) {
      setPopupContentMalert("These Employee's Designation is not matched in hierarchy ,Add Hierarchy and update!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (teamDesigChange === 'Team' && oldTeamData?.length > 0 && (newUpdateDataAll?.length < 1 && newDataTeamWise?.length < 1)) {
      setPopupContentMalert("This Employee is not allowed to Change Team with their Designation , Create in Hierarchy First!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (teamDesigChange === 'Team' && oldTeamSupervisor?.length > 0) {
    //   setPopupContentMalert("This Employee is supervisor in hierarchy , So not allowed to Change Team!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }

    else if (
      (boardingDetails?.employeecount === "" ||
        boardingDetails?.employeecount === "0" ||
        !boardingDetails?.employeecount)
      && boardingDetails?.prod
    ) {
      setPopupContentMalert(" System Count must be required!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedAttMode.length === 0) {

      setPopupContentMalert("Please Select Attendance Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.shifttype === "Please Select Shift Type") {

      setPopupContentMalert("Please Select Shift Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      boardingDetails.shifttype === "Standard" &&
      boardingDetails.shiftgrouping === "Please Select Shift Grouping"
    ) {

      setPopupContentMalert("ShiftGrouping must be required!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      boardingDetails.shifttype === "Standard" &&
      boardingDetails.shifttiming === "Please Select Shift"
    ) {

      setPopupContentMalert("Shifttiming must be required!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      boardingDetails.shifttype === "Daily" &&
      todo.length === 0
    ) {

      setPopupContentMalert("Please Add all the weeks in the todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      boardingDetails.shifttype === "1 Week Rotation" &&
      oneweekrotation > 0
    ) {

      setPopupContentMalert("Please Add all the weeks in the todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      boardingDetails.shifttype === "2 Week Rotation" &&
      twoweekrotation > 0
    ) {

      setPopupContentMalert("Please Add all the weeks in the todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      boardingDetails.shifttype === "1 Month Rotation" &&
      onemonthrotation > 0
    ) {

      setPopupContentMalert("Please Add all the weeks in the todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (boardingDetails.shifttype === "Daily" ||
        boardingDetails.shifttype === "1 Week Rotation" ||
        boardingDetails.shifttype === "2 Week Rotation" ||
        boardingDetails.shifttype === "1 Month Rotation") &&
      checkShiftMode.length > 0
    ) {

      setPopupContentMalert("Shift Mode must be required!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (boardingDetails.shifttype === "Daily" ||
        boardingDetails.shifttype === "1 Week Rotation" ||
        boardingDetails.shifttype === "2 Week Rotation" ||
        boardingDetails.shifttype === "1 Month Rotation") &&
      checkShiftGroup.length > 0
    ) {

      setPopupContentMalert("Shift Group must be required!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (boardingDetails.shifttype === "Daily" ||
        boardingDetails.shifttype === "1 Week Rotation" ||
        boardingDetails.shifttype === "2 Week Rotation" ||
        boardingDetails.shifttype === "1 Month Rotation") &&
      checkShift.length > 0
    ) {

      setPopupContentMalert("Shift must be required!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.reportingto === "Please Select Reporting To") {

      setPopupContentMalert("Please Select Reporting To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      // boardingDetails.workmode === "" ||
      boardingDetails.workmode === "Please Select Work Mode"
      // boardingDetails.workmode === "Internship"
    ) {

      setPopupContentMalert("Please Select Work Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      !boardingDetails.religion
    ) {

      setPopupContentMalert("Please Select Religion!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      !dateOfTraining || dateOfTraining === ""
    ) {

      setPopupContentMalert("Please Select DOT!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      !dateOfJoining || dateOfJoining === ""
    ) {

      setPopupContentMalert("Please Select DOJ!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      dateOfTraining === dateOfJoining
    ) {
      setPopupContentMalert("DOT and DOJ cannot be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (!internStatusUpdate.wordcheck && empcodelimitedAll?.includes(newval)) ||
      (internStatusUpdate.wordcheck &&
        empcodelimitedAll?.includes(employeecodenew))
    ) {

      setPopupContentMalert("Empcode Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (internStatusUpdate.wordcheck && employeecodenew === "") {

      setPopupContentMalert("Please Enter EmpCode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      internStatusUpdate.wordcheck === true &&
      employeecodenew?.toLowerCase() === newval?.toLowerCase()
    ) {

      setPopupContentMalert("Empcode Auto and Manual Cant be Same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmitMulti = async (e) => {
    e.preventDefault();

    const primaryDep = newUpdatingData[0]?.primaryDep;
    const secondaryDep = newUpdatingData[0]?.secondaryDep;
    const tertiary = newUpdatingData[0]?.tertiaryDep;
    const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
    const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
    const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
    const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
    const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
    const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;

    if (
      changeToDesign === "Replace" &&
      identifySuperVisor &&
      superVisorChoosen === "Please Select Supervisor"
    ) {

      setPopupContentMalert("Please Select Supervisor 2!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    if (teamDesigChange === 'Designation' &&
      (changeToDesign === "Replace" && oldEmployeeHierData?.length > 0 && (primaryDep?.length < 1 &&
        secondaryDep?.length < 1 &&
        tertiary?.length < 1 &&
        primaryDepAll?.length < 1 &&
        secondaryDepAll?.length < 1 &&
        tertiaryAll?.length < 1 &&
        primaryWithoutDep?.length < 1 &&
        secondaryWithoutDep?.length < 1 &&
        tertiaryWithoutDep?.length < 1
      ))) {

      setPopupContentMalert("These Employee's Designation is not matched in hierarchy ,Add Hierarchy and update!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    if (teamDesigChange === 'Team' && oldTeamData?.length > 0 && (newUpdateDataAll?.length < 1 && newDataTeamWise?.length < 1)) {

      setPopupContentMalert("This Employee is not allowed to Change Team with their Designation , Create in Hierarchy First!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    // if (teamDesigChange === 'Team' && oldTeamSupervisor?.length > 0) {

    //   setPopupContentMalert("This Employee is supervisor in hierarchy , So not allowed to Change Team!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    //   return;
    // }



    if (createRocketChat?.create && createRocketChat?.email === "") {

      setPopupContentMalert("Please Select Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    if (createRocketChat?.create && createRocketChat?.roles?.length === 0) {

      setPopupContentMalert("Please Select Role!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }

    if (
      (assignExperience.assignExpMode === "Add" ||
        assignExperience.assignExpMode === "Minus" ||
        assignExperience.assignExpMode === "Fix") && !assignExperience.assignExpvalue
    ) {

      setPopupContentMalert("Please Enter Value!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }


    if (loginNotAllot.process === "Please Select Process") {

      setPopupContentMalert("Please Select Process!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    if (
      loginNotAllot.time === "Hrs" ||
      loginNotAllot.time === "" ||
      loginNotAllot.time == undefined ||
      loginNotAllot.timemins === "" ||
      loginNotAllot.timemins == undefined ||
      loginNotAllot.timemins === "Mins" ||
      (loginNotAllot.time === "00" && loginNotAllot.timemins === "00")
    ) {

      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }

    sendEditRequest();

  };

  const renderStepTwo = () => {
    return (
      <>
        <Headtitle title={"INTERN MOVE TO LIVE"} />

        <Box sx={userStyle.dialogbox}>
          <Typography sx={userStyle.SubHeaderText} onClick={() => { console.log(mailDetails) }}>
            Boarding Information
          </Typography>
          <br />
          <br />
          <Typography sx={userStyle.importheadtext}>
            Employee Name : <b>{getingOlddatas.companyname}</b>

          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Company <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={companyOption}
                  placeholder="Please Select Company"
                  value={{
                    label: boardingDetails.company,
                    value: boardingDetails.company,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      company: e.value,
                      branch: "Please Select Branch",
                      unit: "Please Select Unit",
                      floor: "Please Select Floor",
                      area: "Please Select Area",
                      team: "Please Select Team",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Branch <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={branchOption
                    ?.filter((u) => u.company === boardingDetails.company)
                    .map((u) => ({
                      ...u,
                      label: u.name,
                      value: u.name,
                      code: u.code,
                    }))}
                  placeholder="Please Select Company"
                  value={{
                    label: boardingDetails.branch,
                    value: boardingDetails.branch,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      branch: e.value,
                      branchcode: e.code,
                      unit: "Please Select Unit",
                      floor: "Please Select Floor",
                      area: "Please Select Area",
                      team: "Please Select Team",
                    });
                    setSelectedBranchCode(e?.code?.slice(0, 2));
                    // fetchUserDatasOnChange(e.value, boardingDetails.company);
                    fetchbranchNamesOnChange(e.value, boardingDetails.company);
                    debouncedEmployeeCodeAutoGenerate(
                      boardingDetails.company,
                      e.value,
                      e.code,
                      dateOfJoining || formattedDate
                    );
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Unit <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={unitsOption
                    ?.filter((u) => u.branch === boardingDetails.branch)
                    .map((u) => ({
                      ...u,
                      label: u.name,
                      value: u.name,
                    }))}
                  placeholder="Please Select Unit"
                  value={{
                    label: boardingDetails.unit,
                    value: boardingDetails.unit,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      unit: e.value,
                      floor: "Please Select Floor",
                      area: "Please Select Area",
                      team: "Please Select Team",
                    });
                    setSelectedUnitCode(e?.code?.slice(0, 2));
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Old Department
              </Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput value={boardingDetails?.olddepartment} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Department <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={departmentOption}
                  placeholder="Please Select Department"
                  value={{
                    label:
                      boardingDetails?.department === "" ||
                        boardingDetails?.department == undefined
                        ? "Please Select Department"
                        : boardingDetails?.department,
                    value:
                      boardingDetails?.department === "" ||
                        boardingDetails?.department == undefined
                        ? "Please Select Department"
                        : boardingDetails?.department,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      department: e.value,
                      designation: "Please Select Designation", team: "Please Select Team",
                      prod: e.prod, employeecount: "0", reportingto: "Please Select Reporting To"
                    });
                    setSelectedDesignation("")
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Old Team
              </Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput value={boardingDetails?.oldteam} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Team <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={teamsOption
                    ?.filter(
                      (u) =>
                        u.unit === boardingDetails.unit &&
                        u.branch === boardingDetails.branch &&
                        u.department === boardingDetails.department
                    )
                    .map((u) => ({
                      ...u,
                      label: u.teamname,
                      value: u.teamname,
                    }))}
                  placeholder="Please Select Unit"
                  value={{
                    label: boardingDetails.team,
                    value: boardingDetails.team,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      team: e.value,
                      floor: "Please Select Floor",
                      area: "Please Select Area",
                      reportingto: "Please Select Reporting To",
                    });
                    setTeamDesigChange("Team");
                    fetchSuperVisorChangingHierarchy(e.value, "Team")
                    fetchReportingToUserHierarchy(e.value, "Team")
                    // checkHierarchyName(e.value, "Team");
                    setLoginNotAllot({
                      ...loginNotAllot,
                      process: "Please Select Process",
                    });
                    fetchSuperVisorDropdowns(e.value, oldUserCompanyname);
                    setAssignExperience({
                      ...assignExperience,
                      assignExpMode: "Auto Increment",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Floor</Typography>
                <Selects
                  maxMenuHeight={300}
                  options={floorOption
                    ?.filter((u) => u.branch === boardingDetails.branch)
                    .map((u) => ({
                      ...u,
                      label: u.name,
                      value: u.name,
                    }))}
                  placeholder="Please Select Floor"
                  value={{
                    label: boardingDetails.floor,
                    value: boardingDetails.floor,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      floor: e.value,
                      area: "Please Select Area",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Area</Typography>
                <Selects
                  maxMenuHeight={300}
                  options={[
                    ...new Set(
                      areaOption
                        .filter(
                          (u) =>
                            u.branch === boardingDetails.branch &&
                            u.unit === boardingDetails.unit &&
                            u.floor === boardingDetails.floor
                        )
                        .flatMap((item) => item.area)
                    ),
                  ].map((location) => ({
                    label: location,
                    value: location,
                  }))}
                  placeholder="Please Select Floor"
                  value={{
                    label: boardingDetails.area,
                    value: boardingDetails.area,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      area: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>


            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Old Designation
              </Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput value={olddesignation} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Old Designation Group
              </Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput value={oldDesignationGroup} />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  New Designation <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={designation?.filter(
                    (item) => item.department === boardingDetails.department
                  )}
                  placeholder="Please Select Designation"
                  value={{
                    value: boardingDetails.designation ? boardingDetails.designation : "Please Select Designation",
                    label: boardingDetails.designation ? boardingDetails.designation : "Please Select Designation",
                  }}
                  onChange={(e) => {
                    let count = e?.systemcount;
                    setBoardingDetails({
                      ...boardingDetails,
                      designation: e.value,
                      employeecount: count,
                    });
                    setTeamDesigChange("Designation");
                    fetchSuperVisorChangingHierarchy(e.value, "Designation")
                    fetchReportingToUserHierarchy(e.value, "Designation")
                    DesignGroupChange(e.value);
                    setSelectedDesignation(e.value);

                    setMaxSelections(maxWfhSelections + Number(count));
                    setPrimaryWorkStation("Please Select Primary Work Station");
                    setSelectedOptionsWorkStation([]);
                    setValueWorkStation([]);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                New Designation Group
              </Typography>
              <FormControl fullWidth size="small">
                <OutlinedInput value={newDesignationGroup} />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  System Count {boardingDetails?.prod && (<b style={{ color: "red" }}>*</b>)}
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  size="small"
                  placeholder="System Count"
                  value={boardingDetails.employeecount}
                  readOnly={!boardingDetails.prod}
                  onChange={(e) => {
                    let count = e.target.value.replace(
                      /[^0-9.;\s]/g,
                      ""
                    )
                    setBoardingDetails((prev) => ({
                      ...prev,
                      employeecount: count,
                    }));
                    setPrimaryWorkStation("Please Select Primary Work Station");
                    setSelectedOptionsWorkStation([]);
                    setValueWorkStation([]);
                    setMaxSelections(maxWfhSelections + Number(count));
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Attendance Mode<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={attModeOptions}
                  value={selectedAttMode}
                  onChange={(e) => { handleAttModeChange(e); }}
                  valueRenderer={customValueRendererAttMode}
                  labelledBy="Please Select Attendance Mode"
                />
              </FormControl>
              {errorsLog.attmode && (
                <div>{errorsLog.attmode}</div>
              )}
            </Grid>

            {hierarchyall
              ?.map((item) => item.supervisorchoose[0])
              ?.includes(getingOlddatas?.companyname) &&
              !designationsName?.includes(selectedDesignation) && (
                <>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Change To<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={changeTo}
                        value={{
                          label: changeToDesign,
                          value: changeToDesign,
                        }}
                        onChange={(e) => {
                          setChangeToDesign(e.value);
                          setSuperVisorChoosen("Please Select Supervisor");
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {changeToDesign === "Replace" && (
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Choose SuperVisor{" "}
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={users?.filter(
                            (data) =>
                              data?.designation === selectedDesignation
                          )}
                          value={{
                            label: superVisorChoosen,
                            value: superVisorChoosen,
                          }}
                          onChange={(e) => {
                            setSuperVisorChoosen(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </>
              )}

            <Grid item md={4} sm={6} xs={12}>
              <Typography>
                Shift Type<b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  options={ShiftTypeOptions}
                  label="Please Select Shift Type"
                  value={{
                    label: boardingDetails.shifttype,
                    value: boardingDetails.shifttype,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      shifttype: e.value,
                    });
                    // handleAddTodo(e.value);
                    setTodo([]);
                    setValueCate([]);
                    setSelectedOptionsCate([]);
                    setValueCateWeeks([]);
                    setSelectedOptionsCateWeeks([]);
                    setShifts([])
                  }}
                />
              </FormControl>
              {errorsLog.shifttype && <div>{errorsLog.shifttype}</div>}
            </Grid>
            {boardingDetails.shifttype === "Standard" ? (
              <>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>
                    Shift Grouping<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={ShiftGroupingOptions}
                      label="Please Select Shift Group"
                      value={{
                        label: boardingDetails.shiftgrouping,
                        value: boardingDetails.shiftgrouping,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          shiftgrouping: e.value,
                          shifttiming: "Please Select Shift",
                        });
                        ShiftDropdwonsSecond(e.value);
                      }}
                    />
                  </FormControl>
                  {/* {errorsLog.shiftgrouping && <div>{errorsLog.shiftgrouping}</div>} */}
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>
                    Shift<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      size="small"
                      options={shifts}
                      styles={colourStyles}
                      value={{
                        label: boardingDetails.shifttiming,
                        value: boardingDetails.shifttiming,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          shifttiming: e.value,
                        });
                      }}
                    />
                  </FormControl>
                  {/* {errorsLog.shifttiming && <div>{errorsLog.shifttiming}</div>} */}
                </Grid>
                <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>Week Off</Typography>
                    <MultiSelect
                      size="small"
                      options={weekdays}
                      value={selectedOptionsCate}
                      onChange={handleCategoryChange}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Days"
                    />
                  </FormControl>
                </Grid>
              </>
            ) : null}

            <Grid item md={12} sm={12} xs={12}>
              {boardingDetails.shifttype === "Daily" ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3.5} sm={6} xs={12}>
                      <Typography>
                        Shift Grouping<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          options={ShiftGroupingOptions}
                          label="Please Select Shift Group"
                          value={{
                            label:
                              boardingDetails.shiftgrouping === "" ||
                                boardingDetails.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingDetails.shiftgrouping,
                            value:
                              boardingDetails.shiftgrouping === "" ||
                                boardingDetails.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingDetails.shiftgrouping,
                          }}
                          onChange={(e) => {
                            setBoardingDetails({
                              ...boardingDetails,
                              shiftgrouping: e.value,
                              shifttiming: "Please Select Shift",
                            });
                            ShiftDropdwonsSecond(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.5} sm={6} xs={12}>
                      <Typography>
                        Shift<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          size="small"
                          options={shifts}
                          styles={colourStyles}
                          value={{
                            label:
                              boardingDetails.shifttiming === "" ||
                                boardingDetails.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingDetails.shifttiming,
                            value:
                              boardingDetails.shifttiming === "" ||
                                boardingDetails.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingDetails.shifttiming,
                          }}
                          onChange={(e) => {
                            setBoardingDetails({
                              ...boardingDetails,
                              shifttiming: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.5} sm={6} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Week Off<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={weekdays}
                          value={selectedOptionsCate}
                          onChange={handleCategoryChange}
                          valueRenderer={customValueRendererCate}
                          labelledBy="Please Select Days"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1} sm={12} xs={12}>
                      <Button
                        variant="contained"
                        style={{
                          height: "30px",
                          minWidth: "20px",
                          padding: "19px 13px",
                          color: "white",
                          background: "rgb(25, 118, 210)",
                          marginTop: "25px",
                        }}
                        onClick={handleAddTodo}
                      >
                        <FaPlus style={{ fontSize: "15px" }} />
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                  {todo.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Day</Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Week</Typography>
                      </Grid>
                      <Grid item md={2} sm={12} xs={12}>
                        <Typography>
                          Shift Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={2} sm={12} xs={12}>
                        <Typography>
                          Shift Grouping<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={2.5} sm={12} xs={12}>
                        <Typography>
                          Shift<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {todo?.length > 0 &&
                    todo.map((todo, index) => (
                      <div key={index}>
                        {editingIndexcheck === index ? (
                          <Grid container spacing={1}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.day}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.week}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={4} xs={4}>
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftModeOptions}
                                  value={{
                                    label: todo.shiftmode,
                                    value: todo.shiftmode,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftmode",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Shift" ?
                              <>
                                <Grid item md={2} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftGroupingOptions}
                                      value={{
                                        label: todo.shiftgrouping,
                                        value: todo.shiftgrouping,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftgrouping",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={2.5} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <AsyncShiftTimingSelects
                                      todo={todo}
                                      index={index}
                                      auth={auth}
                                      multiInputs={multiInputs}
                                      colourStyles={colourStyles}
                                    />
                                  </FormControl>
                                </Grid></> : <>
                                <Grid item md={2} sm={4} xs={4}></Grid>
                                <Grid item md={2.5} sm={4} xs={4}></Grid>
                              </>}
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Confirm button */}
                              {(todo.shiftmode === "Shift" && (todo.shiftgrouping === "Please Select Shift Grouping" || todo.shifttiming === "Please Select Shift")) ? null :
                                <Button onClick={handleUpdateTodocheck}>
                                  <CheckCircleIcon
                                    style={{
                                      fontSize: "1.5rem",
                                      color: "#216d21",
                                    }}
                                  />
                                </Button>
                              }
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Cancel button */}
                              <Button onClick={handleCancelEdit}>
                                <CancelIcon
                                  style={{ fontSize: "1.5rem", color: "red" }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={1}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.day}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.week}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.shiftmode}
                              </Typography>
                            </Grid>
                            {todo.shiftmode === "Shift" ? <>
                              <Grid item md={2} sm={6} xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {todo.shiftgrouping ===
                                    "Please Select Shift Grouping"
                                    ? ""
                                    : todo.shiftgrouping}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={6} xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {todo.shifttiming === "Please Select Shift"
                                    ? ""
                                    : todo.shifttiming}
                                </Typography>
                              </Grid>
                            </> : <>
                              <Grid item md={2} sm={6} xs={12}></Grid>
                              <Grid item md={2} sm={6} xs={12}></Grid>
                            </>}
                            <Grid item md={1} sm={6} xs={6}>
                              {/* Edit button */}
                              <Button
                                onClick={() => handleEditTodocheck(index)}
                              >
                                <FaEdit
                                  style={{
                                    color: "#1976d2",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                        <br />
                      </div>
                    ))}
                </>
              ) : null}

              {boardingDetails.shifttype === "1 Week Rotation" ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3.5} sm={6} xs={12}>
                      <Typography>
                        Shift Grouping<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          options={ShiftGroupingOptions}
                          label="Please Select Shift Group"
                          value={{
                            label:
                              boardingDetails.shiftgrouping === "" ||
                                boardingDetails.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingDetails.shiftgrouping,
                            value:
                              boardingDetails.shiftgrouping === "" ||
                                boardingDetails.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingDetails.shiftgrouping,
                          }}
                          onChange={(e) => {
                            setBoardingDetails({
                              ...boardingDetails,
                              shiftgrouping: e.value,
                              shifttiming: "Please Select Shift",
                            });
                            ShiftDropdwonsSecond(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.5} sm={6} xs={12}>
                      <Typography>
                        Shift<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          size="small"
                          options={shifts}
                          styles={colourStyles}
                          value={{
                            label:
                              boardingDetails.shifttiming === "" ||
                                boardingDetails.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingDetails.shifttiming,
                            value:
                              boardingDetails.shifttiming === "" ||
                                boardingDetails.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingDetails.shifttiming,
                          }}
                          onChange={(e) => {
                            setBoardingDetails({
                              ...boardingDetails,
                              shifttiming: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Weeks <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={weekoptions2weeks
                            ?.filter(
                              (item) => !todo?.some((val) => val?.week === item)
                            )
                            ?.map((data) => ({
                              label: data,
                              value: data,
                            }))}
                          value={selectedOptionsCateWeeks}
                          onChange={handleWeeksChange}
                          valueRenderer={customValueRendererCateWeeks}
                          labelledBy="Please Select Weeks"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Week Off<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={weekdays}
                          value={selectedOptionsCate}
                          onChange={handleCategoryChange}
                          valueRenderer={customValueRendererCate}
                          labelledBy="Please Select Days"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1} sm={12} xs={12}>
                      <Button
                        variant="contained"
                        style={{
                          height: "30px",
                          minWidth: "20px",
                          padding: "19px 13px",
                          color: "white",
                          background: "rgb(25, 118, 210)",
                          marginTop: "25px",
                        }}
                        onClick={handleAddTodo}
                      >
                        <FaPlus style={{ fontSize: "15px" }} />
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                  {todo.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Day</Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Week</Typography>
                      </Grid>
                      <Grid item md={2} sm={12} xs={12}>
                        <Typography>
                          Shift Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={2} sm={12} xs={12}>
                        <Typography>
                          Shift Grouping<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={2.5} sm={12} xs={12}>
                        <Typography>
                          Shift<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {todo?.length > 0 &&
                    todo.map((todo, index) => (
                      <div key={index}>
                        {editingIndexcheck === index ? (
                          <Grid container spacing={1}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.day}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.week}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={4} xs={4}>
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftModeOptions}
                                  value={{
                                    label: todo.shiftmode,
                                    value: todo.shiftmode,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftmode",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Shift" ?
                              <>
                                <Grid item md={2} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftGroupingOptions}
                                      value={{
                                        label: todo.shiftgrouping,
                                        value: todo.shiftgrouping,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftgrouping",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={2.5} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <AsyncShiftTimingSelects
                                      todo={todo}
                                      index={index}
                                      auth={auth}
                                      multiInputs={multiInputs}
                                      colourStyles={colourStyles}
                                    />
                                  </FormControl>
                                </Grid></> : <>
                                <Grid item md={2} sm={4} xs={4}></Grid>
                                <Grid item md={2.5} sm={4} xs={4}></Grid>
                              </>}
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Confirm button */}
                              {(todo.shiftmode === "Shift" && (todo.shiftgrouping === "Please Select Shift Grouping" || todo.shifttiming === "Please Select Shift")) ? null :
                                <Button onClick={handleUpdateTodocheck}>
                                  <CheckCircleIcon
                                    style={{
                                      fontSize: "1.5rem",
                                      color: "#216d21",
                                    }}
                                  />
                                </Button>
                              }
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Cancel button */}
                              <Button onClick={handleCancelEdit}>
                                <CancelIcon
                                  style={{ fontSize: "1.5rem", color: "red" }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={1}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.day}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.week}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.shiftmode}
                              </Typography>
                            </Grid>
                            {todo.shiftmode === "Shift" ? <>
                              <Grid item md={2} sm={6} xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {todo.shiftgrouping ===
                                    "Please Select Shift Grouping"
                                    ? ""
                                    : todo.shiftgrouping}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={6} xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {todo.shifttiming === "Please Select Shift"
                                    ? ""
                                    : todo.shifttiming}
                                </Typography>
                              </Grid>
                            </> : <>
                              <Grid item md={2} sm={6} xs={12}></Grid>
                              <Grid item md={2} sm={6} xs={12}></Grid>
                            </>}
                            <Grid item md={1} sm={6} xs={6}>
                              {/* Edit button */}
                              <Button
                                onClick={() => handleEditTodocheck(index)}
                              >
                                <FaEdit
                                  style={{
                                    color: "#1976d2",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                        <br />
                      </div>
                    ))}
                </>
              ) : null}

              {boardingDetails.shifttype === "2 Week Rotation" ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3.5} sm={6} xs={12}>
                      <Typography>
                        Shift Grouping<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          options={ShiftGroupingOptions}
                          label="Please Select Shift Group"
                          value={{
                            label:
                              boardingDetails.shiftgrouping === "" ||
                                boardingDetails.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingDetails.shiftgrouping,
                            value:
                              boardingDetails.shiftgrouping === "" ||
                                boardingDetails.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingDetails.shiftgrouping,
                          }}
                          onChange={(e) => {
                            setBoardingDetails({
                              ...boardingDetails,
                              shiftgrouping: e.value,
                              shifttiming: "Please Select Shift",
                            });
                            ShiftDropdwonsSecond(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.5} sm={6} xs={12}>
                      <Typography>
                        Shift<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          size="small"
                          options={shifts}
                          styles={colourStyles}
                          value={{
                            label:
                              boardingDetails.shifttiming === "" ||
                                boardingDetails.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingDetails.shifttiming,
                            value:
                              boardingDetails.shifttiming === "" ||
                                boardingDetails.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingDetails.shifttiming,
                          }}
                          onChange={(e) => {
                            setBoardingDetails({
                              ...boardingDetails,
                              shifttiming: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Weeks <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={weekoptions1month
                            ?.filter(
                              (item) => !todo?.some((val) => val?.week === item)
                            )
                            ?.map((data) => ({
                              label: data,
                              value: data,
                            }))}
                          value={selectedOptionsCateWeeks}
                          onChange={handleWeeksChange}
                          valueRenderer={customValueRendererCateWeeks}
                          labelledBy="Please Select Weeks"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Week Off<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={weekdays}
                          value={selectedOptionsCate}
                          onChange={handleCategoryChange}
                          valueRenderer={customValueRendererCate}
                          labelledBy="Please Select Days"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1} sm={12} xs={12}>
                      <Button
                        variant="contained"
                        style={{
                          height: "30px",
                          minWidth: "20px",
                          padding: "19px 13px",
                          color: "white",
                          background: "rgb(25, 118, 210)",
                          marginTop: "25px",
                        }}
                        onClick={handleAddTodo}
                      >
                        <FaPlus style={{ fontSize: "15px" }} />
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                  {todo.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Day</Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Week</Typography>
                      </Grid>
                      <Grid item md={2} sm={12} xs={12}>
                        <Typography>
                          Shift Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={2} sm={12} xs={12}>
                        <Typography>
                          Shift Grouping<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={2.5} sm={12} xs={12}>
                        <Typography>
                          Shift<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {todo?.length > 0 &&
                    todo.map((todo, index) => (
                      <div key={index}>
                        {editingIndexcheck === index ? (
                          <Grid container spacing={1}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.day}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.week}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={4} xs={4}>
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftModeOptions}
                                  value={{
                                    label: todo.shiftmode,
                                    value: todo.shiftmode,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftmode",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Shift" ?
                              <>
                                <Grid item md={2} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftGroupingOptions}
                                      value={{
                                        label: todo.shiftgrouping,
                                        value: todo.shiftgrouping,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftgrouping",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={2.5} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <AsyncShiftTimingSelects
                                      todo={todo}
                                      index={index}
                                      auth={auth}
                                      multiInputs={multiInputs}
                                      colourStyles={colourStyles}
                                    />
                                  </FormControl>
                                </Grid></> : <>
                                <Grid item md={2} sm={4} xs={4}></Grid>
                                <Grid item md={2.5} sm={4} xs={4}></Grid>
                              </>}
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Confirm button */}
                              {(todo.shiftmode === "Shift" && (todo.shiftgrouping === "Please Select Shift Grouping" || todo.shifttiming === "Please Select Shift")) ? null :
                                <Button onClick={handleUpdateTodocheck}>
                                  <CheckCircleIcon
                                    style={{
                                      fontSize: "1.5rem",
                                      color: "#216d21",
                                    }}
                                  />
                                </Button>
                              }
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Cancel button */}
                              <Button onClick={handleCancelEdit}>
                                <CancelIcon
                                  style={{ fontSize: "1.5rem", color: "red" }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={1}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.day}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.week}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.shiftmode}
                              </Typography>
                            </Grid>
                            {todo.shiftmode === "Shift" ? <>
                              <Grid item md={2} sm={6} xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {todo.shiftgrouping ===
                                    "Please Select Shift Grouping"
                                    ? ""
                                    : todo.shiftgrouping}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={6} xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {todo.shifttiming === "Please Select Shift"
                                    ? ""
                                    : todo.shifttiming}
                                </Typography>
                              </Grid>
                            </> : <>
                              <Grid item md={2} sm={6} xs={12}></Grid>
                              <Grid item md={2} sm={6} xs={12}></Grid>
                            </>}
                            <Grid item md={1} sm={6} xs={6}>
                              {/* Edit button */}
                              <Button
                                onClick={() => handleEditTodocheck(index)}
                              >
                                <FaEdit
                                  style={{
                                    color: "#1976d2",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                        <br />
                      </div>
                    ))}
                </>
              ) : null}

              {boardingDetails.shifttype === "1 Month Rotation" ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3.5} sm={6} xs={12}>
                      <Typography>
                        Shift Grouping<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          options={ShiftGroupingOptions}
                          label="Please Select Shift Group"
                          value={{
                            label:
                              boardingDetails.shiftgrouping === "" ||
                                boardingDetails.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingDetails.shiftgrouping,
                            value:
                              boardingDetails.shiftgrouping === "" ||
                                boardingDetails.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingDetails.shiftgrouping,
                          }}
                          onChange={(e) => {
                            setBoardingDetails({
                              ...boardingDetails,
                              shiftgrouping: e.value,
                              shifttiming: "Please Select Shift",
                            });
                            ShiftDropdwonsSecond(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.5} sm={6} xs={12}>
                      <Typography>
                        Shift<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          size="small"
                          options={shifts}
                          styles={colourStyles}
                          value={{
                            label:
                              boardingDetails.shifttiming === "" ||
                                boardingDetails.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingDetails.shifttiming,
                            value:
                              boardingDetails.shifttiming === "" ||
                                boardingDetails.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingDetails.shifttiming,
                          }}
                          onChange={(e) => {
                            setBoardingDetails({
                              ...boardingDetails,
                              shifttiming: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Weeks <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={weekoptions2months
                            ?.filter(
                              (item) => !todo?.some((val) => val?.week === item)
                            )
                            ?.map((data) => ({
                              label: data,
                              value: data,
                            }))}
                          value={selectedOptionsCateWeeks}
                          onChange={handleWeeksChange}
                          valueRenderer={customValueRendererCateWeeks}
                          labelledBy="Please Select Weeks"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Week Off<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={weekdays}
                          value={selectedOptionsCate}
                          onChange={handleCategoryChange}
                          valueRenderer={customValueRendererCate}
                          labelledBy="Please Select Days"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1} sm={12} xs={12}>
                      <Button
                        variant="contained"
                        style={{
                          height: "30px",
                          minWidth: "20px",
                          padding: "19px 13px",
                          color: "white",
                          background: "rgb(25, 118, 210)",
                          marginTop: "25px",
                        }}
                        onClick={handleAddTodo}
                      >
                        <FaPlus style={{ fontSize: "15px" }} />
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                  {todo.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Day</Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Week</Typography>
                      </Grid>
                      <Grid item md={2} sm={12} xs={12}>
                        <Typography>
                          Shift Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={2} sm={12} xs={12}>
                        <Typography>
                          Shift Grouping<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={2.5} sm={12} xs={12}>
                        <Typography>
                          Shift<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {todo?.length > 0 &&
                    todo.map((todo, index) => (
                      <div key={index}>
                        {editingIndexcheck === index ? (
                          <Grid container spacing={1}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.day}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.week}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={4} xs={4}>
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftModeOptions}
                                  value={{
                                    label: todo.shiftmode,
                                    value: todo.shiftmode,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftmode",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Shift" ?
                              <>
                                <Grid item md={2} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftGroupingOptions}
                                      value={{
                                        label: todo.shiftgrouping,
                                        value: todo.shiftgrouping,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftgrouping",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={2.5} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <AsyncShiftTimingSelects
                                      todo={todo}
                                      index={index}
                                      auth={auth}
                                      multiInputs={multiInputs}
                                      colourStyles={colourStyles}
                                    />
                                  </FormControl>
                                </Grid></> : <>
                                <Grid item md={2} sm={4} xs={4}></Grid>
                                <Grid item md={2.5} sm={4} xs={4}></Grid>
                              </>}
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Confirm button */}
                              {(todo.shiftmode === "Shift" && (todo.shiftgrouping === "Please Select Shift Grouping" || todo.shifttiming === "Please Select Shift")) ? null :
                                <Button onClick={handleUpdateTodocheck}>
                                  <CheckCircleIcon
                                    style={{
                                      fontSize: "1.5rem",
                                      color: "#216d21",
                                    }}
                                  />
                                </Button>
                              }
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Cancel button */}
                              <Button onClick={handleCancelEdit}>
                                <CancelIcon
                                  style={{ fontSize: "1.5rem", color: "red" }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={1}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.day}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.week}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={6} xs={12}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {todo.shiftmode}
                              </Typography>
                            </Grid>
                            {todo.shiftmode === "Shift" ? <>
                              <Grid item md={2} sm={6} xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {todo.shiftgrouping ===
                                    "Please Select Shift Grouping"
                                    ? ""
                                    : todo.shiftgrouping}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={6} xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                >
                                  {todo.shifttiming === "Please Select Shift"
                                    ? ""
                                    : todo.shifttiming}
                                </Typography>
                              </Grid>
                            </> : <>
                              <Grid item md={2} sm={6} xs={12}></Grid>
                              <Grid item md={2} sm={6} xs={12}></Grid>
                            </>}
                            <Grid item md={1} sm={6} xs={6}>
                              {/* Edit button */}
                              <Button
                                onClick={() => handleEditTodocheck(index)}
                              >
                                <FaEdit
                                  style={{
                                    color: "#1976d2",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                        <br />
                      </div>
                    ))}
                </>
              ) : null}

              {/* {boardingDetails.shifttype === "Daily" ? (
                <>
                  {todo.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Day</Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Week</Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift Grouping<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {todo &&
                    todo?.map((todo, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={index}
                        sx={{ paddingTop: "5px" }}
                      >
                        <Grid item md={1.5} sm={6} xs={12}>
                          <Typography>{todo.day}</Typography>
                        </Grid>
                        <Grid item md={1.5} sm={6} xs={12}>
                          <Typography>{todo.week}</Typography>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Selects
                              size="small"
                              options={ShiftModeOptions}
                              value={{
                                label: todo.shiftmode,
                                value: todo.shiftmode,
                              }}
                              onChange={(selectedOption) =>
                                multiInputs(
                                  index,
                                  "shiftmode",
                                  selectedOption.value
                                )
                              }
                            />
                          </FormControl>
                         
                        </Grid>
                        {todo.shiftmode === "Week Off" ? (
                          <Grid item md={6} sm={6} xs={12}></Grid>
                        ) : (
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftGroupingOptions}
                                  value={{
                                    label: todo.shiftgrouping,
                                    value: todo.shiftgrouping,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftgrouping",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                             
                            </Grid>
                            <Grid item md={3} xs={6} sm={6}>
                              <FormControl fullWidth size="small">

                                <AsyncShiftTimingSelects
                                  todo={todo}
                                  index={index}
                                  auth={auth}
                                  multiInputs={multiInputs}
                                  colourStyles={colourStyles}
                                />
                              </FormControl>
                              
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ))}
                </>
              ) : null}

              {boardingDetails.shifttype === "1 Week Rotation" ? (
                <>
                  {todo.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Day</Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Week</Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift Grouping<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {todo &&
                    todo?.map((todo, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid item md={1.5} sm={6} xs={12}>
                          <Typography>{todo.day}</Typography>
                        </Grid>
                        <Grid item md={1.5} sm={6} xs={12}>
                          <Typography>{todo.week}</Typography>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Selects
                              size="small"
                              options={ShiftModeOptions}
                              value={{
                                label: todo.shiftmode,
                                value: todo.shiftmode,
                              }}
                              onChange={(selectedOption) =>
                                multiInputs(
                                  index,
                                  "shiftmode",
                                  selectedOption.value
                                )
                              }
                            />
                          </FormControl>
                         
                        </Grid>
                        {todo.shiftmode === "Week Off" ? (
                          <Grid item md={6} sm={6} xs={12}></Grid>
                        ) : (
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftGroupingOptions}
                                  value={{
                                    label: todo.shiftgrouping,
                                    value: todo.shiftgrouping,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftgrouping",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                             
                            </Grid>
                            <Grid item md={3} xs={6} sm={6}>
                              <FormControl fullWidth size="small">

                                <AsyncShiftTimingSelects
                                  todo={todo}
                                  index={index}
                                  auth={auth}
                                  multiInputs={multiInputs}
                                  colourStyles={colourStyles}
                                />
                              </FormControl>
                              
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ))}
                </>
              ) : null}

              {boardingDetails.shifttype === "2 Week Rotation" ? (
                <>
                  {todo.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Day</Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Week</Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift Grouping<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {todo &&
                    todo?.map((todo, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid item md={1.5} sm={6} xs={12}>
                          <Typography>{todo.day}</Typography>
                        </Grid>
                        <Grid item md={1.5} sm={6} xs={12}>
                          <Typography>{todo.week}</Typography>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Selects
                              size="small"
                              options={ShiftModeOptions}
                              value={{
                                label: todo.shiftmode,
                                value: todo.shiftmode,
                              }}
                              onChange={(selectedOption) =>
                                multiInputs(
                                  index,
                                  "shiftmode",
                                  selectedOption.value
                                )
                              }
                            />
                          </FormControl>
                         
                        </Grid>
                        {todo.shiftmode === "Week Off" ? (
                          <Grid item md={6} sm={6} xs={12}></Grid>
                        ) : (
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftGroupingOptions}
                                  value={{
                                    label: todo.shiftgrouping,
                                    value: todo.shiftgrouping,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftgrouping",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                             
                            </Grid>
                            <Grid item md={3} xs={6} sm={6}>
                              <FormControl fullWidth size="small">

                                <AsyncShiftTimingSelects
                                  todo={todo}
                                  index={index}
                                  auth={auth}
                                  multiInputs={multiInputs}
                                  colourStyles={colourStyles}
                                />
                              </FormControl>
                              
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ))}
                </>
              ) : null}

              {boardingDetails.shifttype === "1 Month Rotation" ? (
                <>
                  {todo.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Day</Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>Week</Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift Grouping<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          Shift<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {todo &&
                    todo?.map((todo, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid item md={1.5} sm={6} xs={12}>
                          <Typography>{todo.day}</Typography>
                        </Grid>
                        <Grid item md={1.5} sm={6} xs={12}>
                          <Typography>{todo.week}</Typography>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Selects
                              size="small"
                              options={ShiftModeOptions}
                              value={{
                                label: todo.shiftmode,
                                value: todo.shiftmode,
                              }}
                              onChange={(selectedOption) =>
                                multiInputs(
                                  index,
                                  "shiftmode",
                                  selectedOption.value
                                )
                              }
                            />
                          </FormControl>
                         
                        </Grid>
                        {todo.shiftmode === "Week Off" ? (
                          <Grid item md={6} sm={6} xs={12}></Grid>
                        ) : (
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftGroupingOptions}
                                  value={{
                                    label: todo.shiftgrouping,
                                    value: todo.shiftgrouping,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftgrouping",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={3} xs={6} sm={6}>
                              <FormControl fullWidth size="small">

                                <AsyncShiftTimingSelects
                                  todo={todo}
                                  index={index}
                                  auth={auth}
                                  multiInputs={multiInputs}
                                  colourStyles={colourStyles}
                                />
                              </FormControl>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ))}
                </>
              ) : null} */}
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Reporting To <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  labelId="demo-select-small"
                  id="demo-select-small"
                  options={
                    reportingtonames &&
                    reportingtonames?.map((row) => ({
                      label: row,
                      value: row,
                    }))
                  }
                  value={{
                    label: boardingDetails.reportingto,
                    value: boardingDetails.reportingto,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      reportingto: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Work Mode <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={workmodeOptions}
                  placeholder="Please Select Work Mode"
                  value={{
                    label:
                      boardingDetails.workmode === "Internship"
                        ? "Please Select Work Mode"
                        : boardingDetails.workmode,
                    value:
                      boardingDetails.workmode === "Internship"
                        ? "Please Select Work Mode"
                        : boardingDetails.workmode,
                  }}
                  onChange={(e) => {
                    setBoardingDetails((prev) => ({
                      ...boardingDetails,
                      workmode: e.value,
                      ifoffice: false,
                    }));
                    setSelectedOptionsWorkStation([]);
                    setValueWorkStation([]);
                    setPrimaryWorkStation("Please Select Primary Work Station");
                    // fetchUserDatasOnChange(
                    //   boardingDetails.branch,
                    //   boardingDetails.company
                    // );
                  }}
                />
              </FormControl>
            </Grid>

            <>
              {" "}
              <Grid item md={4} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>Work Station (Primary)</Typography>
                  <Selects
                    options={filteredWorkStation.filter((item, index, self) => {
                      return (
                        index ===
                        self.findIndex(
                          (i) => i.value === item.value
                        )
                      );
                    })}
                    label="Please Select Shift"
                    value={{
                      label: primaryWorkStation ? primaryWorkStation : "Please Select Primary Work Station",
                      value: primaryWorkStation ? primaryWorkStation : "Please Select Primary Work Station",
                    }}
                    isDisabled={maxSelections === 0}
                    onChange={(e) => {
                      setPrimaryWorkStation(e.value);
                      setSelectedOptionsWorkStation([]);
                      setValueWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>Work Station (Secondary)</Typography>
                  <MultiSelect
                    size="small"
                    options={allWorkStationOpt.filter((item, index, self) => {
                      return (
                        index ===
                        self.findIndex(
                          (i) => i.value === item.value
                        ) && item.value !== primaryWorkStation
                      );
                    })}
                    value={selectedOptionsWorkStation}
                    onChange={handleEmployeesChange}
                    valueRenderer={customValueRendererEmployees}
                    disabled={maxSelections === 0 || Number(maxSelections) < 1 || primaryWorkStation === "Please Select Primary Work Station" || primaryWorkStation === "" || !primaryWorkStation}

                  />
                </FormControl>
              </Grid>
            </>
            {boardingDetails.workmode === "Office" && (
              <>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>If Office</Typography>
                  </FormControl>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={boardingDetails.ifoffice === true}
                          />
                        }
                        onChange={(e) => {
                          setBoardingDetails({
                            ...boardingDetails,
                            ifoffice: !boardingDetails.ifoffice,
                            workstationofficestatus: !boardingDetails.ifoffice,
                          });
                        }}
                        label="Work Station Other"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </>
            )}
            {(boardingDetails.workmode === "Remote" ||
              boardingDetails?.ifoffice) &&
              boardingDetails?.workmode !== "Internship" && (
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Work Station (WFH)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Work Station"
                      value={primaryWorkStationInput}
                      // onChange={(e) => {
                      //   setPrimaryWorkStationInput(e.target.value);
                      // }}
                      readOnly
                    />
                  </FormControl>
                </Grid>
              )}

            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Religion <b style={{ color: "red" }}>*</b></Typography>

                <Selects
                  maxMenuHeight={300}
                  options={religionOptions}
                  value={{
                    label:
                      boardingDetails.religion === "" ||
                        boardingDetails.religion == undefined
                        ? "Select Religion"
                        : boardingDetails.religion,
                    value:
                      boardingDetails.religion === "" ||
                        boardingDetails.religion == undefined
                        ? "Select Religion"
                        : boardingDetails.religion,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({ ...boardingDetails, religion: e.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Dot<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={dateOfTraining}
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setDateOfTraining(e.target.value);
                      setDateOfJoining("");
                    }
                  }}

                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Doj<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={dateOfJoining}
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setDateOfJoining(e.target.value);
                      setAssignExperience({
                        ...assignExperience,
                        updatedate: e.target.value,
                        assignEndExpDate: "",
                        assignEndTarDate: "",
                        assignExpMode: "Auto Increment",
                      });
                      setLoginNotAllot({
                        ...loginNotAllot,
                        process: "Please Select Process",
                      });
                      setnewstate(!newstate);
                      // EmployeeCodeAutoGenerate(
                      //   boardingDetails.company,
                      //   boardingDetails.branch,
                      //   boardingDetails.branchcode,
                      //   e.target.value
                      // );
                      // Format the picked date to YYMMDD format
                      const formattedDate = moment(e.target.value).format(
                        "YYMMDD"
                      );

                      // Extract the branch code (first 2 characters) and the rest of the code (after the date)
                      const branchCode = newval.slice(0, 2); // First 2 characters for branch code
                      const restOfCode = newval.slice(8); // Characters after the date part

                      // Construct the new employee code with the updated date
                      const updatedEmployeeCode = `${branchCode}${formattedDate}${restOfCode}`;

                      // Update the state with the new employee code
                      setNewval(updatedEmployeeCode);
                    }
                  }}
                  inputProps={{
                    min: dateOfTraining, // Set the minimum date to today
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={12} xs={12}>
              <FormControl size="small" fullWidth>
                <Typography>Prev EmpCode</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="EmpCode"
                  value={prevEmpCode ?? "000"}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              {internStatusUpdate.wordcheck ? (
                <FormControl size="small" fullWidth>
                  <Typography>
                    EmpCode(Manual) <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    // disabled
                    placeholder="EmpCode"
                    value={employeecodenew}
                    onChange={(e) => {
                      setEmployeecodenew(e.target.value);
                    }}
                  />
                </FormControl>
              ) : (
                <FormControl size="small" fullWidth>
                  <Typography>
                    EmpCode(Auto) <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="EmpCode"
                    value={dateOfJoining === "" ? "" : newval}
                  />
                </FormControl>
              )}
              <Grid>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={userUpdate.wordcheck}
                        checked={internStatusUpdate.wordcheck}
                        onChange={(e) => {
                          setInternStatusUpdate({
                            ...internStatusUpdate,
                            wordcheck: !internStatusUpdate.wordcheck,
                          });
                        }}
                      />
                    }
                    label="Enable Empcode"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px 0px",
          }}
        >
          <Box>
            {/* <Link
              to="/internlist"
              style={{
                textDecoration: "none",
                color: "white",
                float: "right",
              }}
            > */}
            <Button sx={buttonStyles.btncancel} onClick={(e) => {
              handleOpenConfirmationPopup("cancel");
            }}>Cancel</Button>
            {/* </Link> */}
          </Box>
          <Box>
            <Button className="next" variant="contained" onClick={nextStepLog}
              sx={buttonStyles?.buttonsubmit}>
              Next
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  const renderStepThree = () => {
    return (
      <>
        <Headtitle title={"INTERN MOVE TO LIVE"} />
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>
            {" "}
            Process Allot <b style={{ color: "red" }}>*</b>
          </Typography>
          <br />
          <br />

          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Process <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  options={Array.from(
                    new Set(
                      ProcessOptions?.filter(
                        (comp) => boardingDetails.team === comp.team
                      )?.map((com) => com.process)
                    )
                  ).map((name) => ({
                    label: name,
                    value: name,
                  }))}
                  value={{
                    label: loginNotAllot.process,
                    value: loginNotAllot.process,
                  }}
                  onChange={(e) => {
                    setLoginNotAllot({
                      ...loginNotAllot,
                      process: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Process Type <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  options={processTypes}
                  value={{
                    label: loginNotAllot?.processtype,
                    value: loginNotAllot?.processtype,
                  }}
                  onChange={(e) => {
                    setLoginNotAllot({
                      ...loginNotAllot,
                      processtype: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Process Duration <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  options={processDuration}
                  value={{
                    label: loginNotAllot?.processduration,
                    value: loginNotAllot?.processduration,
                  }}
                  onChange={(e) => {
                    setLoginNotAllot({
                      ...loginNotAllot,
                      processduration: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Duration <b style={{ color: "red" }}>*</b>
              </Typography>
              <Grid container spacing={1}>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={300}
                      options={hrsOption}
                      placeholder="Hrs"
                      value={{
                        label: loginNotAllot.time,
                        value: loginNotAllot.time,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          time: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={300}
                      options={minsOption}
                      placeholder="Mins"
                      value={{
                        label: loginNotAllot.timemins,
                        value: loginNotAllot.timemins,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          timemins: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Gross Salary</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={overallgrosstotal}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Mode Experience</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={modeexperience}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Target Experience</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  // placeholder="Please Enter IFSC Code"
                  value={targetexperience}
                // onChange={(e) => {
                //   setEmployee({ ...employee, ifsccode: e.target.value });
                // }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Target Points</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  // placeholder="Please Enter IFSC Code"
                  value={targetpts}
                // onChange={(e) => {
                //   setEmployee({ ...employee, ifsccode: e.target.value });
                // }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px 0px",
          }}
        >
          <Box>
            <Button className="prev" variant="contained" onClick={prevStep} sx={buttonStyles?.buttonsubmit}>
              Previous
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            {/* <Link to="/list"><Button sx={userStyle.btncancel} > Cancel </Button></Link> */}
            {/* <Link
              to="/internlist"
              style={{
                textDecoration: "none",
                color: "white",
                float: "right",
              }}
            > */}
            <Button sx={buttonStyles.btncancel} onClick={(e) => {
              handleOpenConfirmationPopup("cancel");
            }}>Cancel</Button>
            {/* </Link> */}
            <Button className="next" variant="contained" onClick={nextStep} sx={buttonStyles?.buttonsubmit}>
              Next
            </Button>

            {/* <Button
              variant="contained"
              sx={buttonSx}
              disabled={loading}
              onClick={(e) => {
                handleButtonClick(e);
              }}
            >
              SUBMIT
            </Button> */}
            {/* <LoadingButton
              onClick={(e) => {
                handleButtonClick(e);
              }}
              loading={loading}
              loadingPosition="start"
              variant="contained"
            >
              <span>SUBMIT</span>
            </LoadingButton> */}
          </Box>
        </Box>
      </>
    );
  };

  //rocket chat start
  const [createRocketChat, setCreateRocketChat] = useState({
    create: false,
    email: "",
    roles: [{
      label: "user",
      value: "user",
    }]
  });
  useEffect(() => {
    fetchRockeChatRoles()
  }, [])
  const [rocketChatRolesOptions, setRocketChatRolesOptions] = useState([])
  const fetchRockeChatRoles = async () => {
    try {
      let response = await axios.get(SERVICE.GET_ROCKETCHAT_ROLES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setRocketChatRolesOptions(response?.data?.rocketchatRoles?.map((data) => ({
        value: data?._id,
        label: data?._id,
      })));
    } catch (err) {
      console.log(err);
      let error = err.response?.data?.message;
      if (error) {
        // setPopupContentMalert(error);
        // setPopupSeverityMalert("error");
        // handleClickOpenPopupMalert();
      } else {
        handleApiError(
          err,
          setPopupContentMalert,
          setPopupSeverityMalert,
          handleClickOpenPopupMalert
        );
      }
    }
  };

  const handleRocketchatRoleChange = (options) => {
    setCreateRocketChat((prev) => ({ ...prev, roles: options }))
  };

  const customValueRendererRocketchatRole = (valueRocketchatTeamCat, _categoryname) => {
    return valueRocketchatTeamCat?.length
      ? valueRocketchatTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Role";
  };

  const renderStepSix = () => {
    return (
      <>
        <Headtitle title={"INTERN MOVE TO LIVE"} />
        <br />

        <Box sx={userStyle.dialogbox}>
          <Grid container spacing={1}>
            <Grid item md={5} xs={0} sm={4}>
              <Typography sx={userStyle.SubHeaderText}>
                Exp Log Details{" "}
              </Typography>
            </Grid>

            <Grid item md={3} xs={0} sm={4}>
              <>
                <Button
                  className="next"
                  variant="contained"
                  onClick={handleClickOpenEdit}
                >
                  Salary Fix
                </Button>
              </>
            </Grid>

            <Grid item md={1} xs={12} sm={4} marginTop={1}>
              <Typography>
                Date <b style={{ color: "red" }}>*</b>
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={4}>
              <FormControl fullWidth>
                <Selects
                  maxMenuHeight={250}
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      maxHeight: 200, // Adjust the max height of the menu base
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: 200, // Adjust the max height of the menu option list
                    }),
                  }}
                  options={expDateOptions}
                  value={{
                    label: assignExperience.updatedate,
                    value: assignExperience.updatedate,
                  }}
                  onChange={(e) => {
                    setAssignExperience({
                      ...assignExperience,
                      updatedate: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
              {errorsLog.updatedate && <div>{errorsLog.updatedate}</div>}
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={1}>
            <Grid item md={4} xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography>Mode Val</Typography>
                <Selects
                  maxMenuHeight={250}
                  options={modeOption}
                  value={{
                    label: assignExperience.assignExpMode,
                    value: assignExperience.assignExpMode,
                  }}
                  onChange={(e) => {
                    setAssignExperience({
                      ...assignExperience,
                      assignExpMode: e.value,
                      assignExpvalue: e.value === "Auto Increment" ? 0 : "",
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>
            {assignExperience.assignExpMode === "Please Select Mode" ? (
              ""
            ) : (
              <>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Value (In Months){" "}
                      {assignExperience.assignExpMode === "Add" ||
                        assignExperience.assignExpMode === "Minus" ||
                        assignExperience.assignExpMode === "Fix" ? (
                        <b style={{ color: "red" }}>*</b>
                      ) : (
                        ""
                      )}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Value (In Months)"
                      disabled={
                        assignExperience.assignExpMode === "Auto Increment"
                      }
                      value={assignExperience.assignExpMode === "Auto Increment" ? "0" : assignExperience.assignExpvalue}
                      onChange={(e) => {
                        setAssignExperience({
                          ...assignExperience,
                          assignExpvalue: e.target.value,
                        });
                        setnewstate(!newstate);
                      }}
                    />
                  </FormControl>
                  {errorsLog.value && <div>{errorsLog.value}</div>}
                </Grid>
              </>
            )}
          </Grid>
          <br />
          <Grid container spacing={1}>
            <Grid item md={3} xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography>Mode Exp</Typography>
                <Selects
                  maxMenuHeight={250}
                  options={modeOptionexp}
                  value={{
                    label: assignExperience.assignEndExp,
                    value: assignExperience.assignEndExp,
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography>End Exp</Typography>
                <Selects
                  maxMenuHeight={250}
                  options={valueOpt}
                  value={{
                    label: assignExperience.assignEndExpvalue,
                    value: assignExperience.assignEndExpvalue,
                  }}
                  onChange={(e) => {
                    setAssignExperience({
                      ...assignExperience,
                      assignEndExpvalue: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>

            {assignExperience.assignEndExpvalue === "Yes" ? (
              <>
                <Grid item md={3} xs={12} sm={4}>
                  <Typography>
                    End Exp Date{" "}
                    {assignExperience.assignEndExpvalue === "Yes" ? (
                      <b style={{ color: "red" }}>*</b>
                    ) : (
                      ""
                    )}
                  </Typography>
                  <Selects
                    maxMenuHeight={250}
                    menuPlacement="top"
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: 200, // Adjust the max height of the menu base
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 200, // Adjust the max height of the menu option list
                      }),
                    }}
                    options={expDateOptions}
                    value={{
                      label: assignExperience.assignEndExpDate,
                      value: assignExperience.assignEndExpDate,
                    }}
                    onChange={(e) => {
                      setAssignExperience({
                        ...assignExperience,
                        assignEndExpDate: e.value,
                      });
                      setnewstate(!newstate);
                    }}
                  />
                  {errorsLog.endexpdate && <div>{errorsLog.endexpdate}</div>}
                </Grid>
              </>
            ) : null}
          </Grid>
          <br />
          <Grid container spacing={1}>
            <Grid item md={3} xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography>Mode Target</Typography>
                <Selects
                  maxMenuHeight={250}
                  options={modeOptiontar}
                  value={{
                    label: assignExperience.assignEndTar,
                    value: assignExperience.assignEndTar,
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography>End Tar</Typography>
                <Selects
                  maxMenuHeight={250}
                  options={valueOpt}
                  value={{
                    label: assignExperience.assignEndTarvalue,
                    value: assignExperience.assignEndTarvalue,
                  }}
                  onChange={(e) => {
                    setAssignExperience({
                      ...assignExperience,
                      assignEndTarvalue: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>

            {assignExperience.assignEndTarvalue === "Yes" ? (
              <>
                <Grid item md={3} xs={12} sm={4}>
                  <Typography>
                    End Tar Date{" "}
                    {assignExperience.assignEndTarvalue === "Yes" ? (
                      <b style={{ color: "red" }}>*</b>
                    ) : (
                      ""
                    )}
                  </Typography>

                  <Selects
                    maxMenuHeight={250}
                    menuPlacement="top"
                    options={expDateOptions}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: 200, // Adjust the max height of the menu base
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 200, // Adjust the max height of the menu option list
                      }),
                    }}
                    value={{
                      label: assignExperience.assignEndTarDate,
                      value: assignExperience.assignEndTarDate,
                    }}
                    onChange={(e) => {
                      setAssignExperience({
                        ...assignExperience,
                        assignEndTarDate: e.value,
                      });
                      setnewstate(!newstate);
                    }}
                  />
                  {errorsLog.endtardate && <div>{errorsLog.endtardate}</div>}
                </Grid>
              </>
            ) : null}
          </Grid>
          <br />

          <Grid container spacing={1} marginTop={1}>
            <Grid container spacing={1}>
              <Grid item md={8} xs={0} sm={4}>
                <Typography sx={userStyle.SubHeaderText}>
                  Connects
                </Typography>
                <p style={{ fontSize: "small" }}>
                  {`(Once an account is created, the "Create Account" checkbox cannot be unchecked.)`}
                </p>

              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    &nbsp;
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox onChange={(e) => {
                        setCreateRocketChat((prev) => ({
                          ...prev, create: e.target.checked, roles: [{
                            label: "user",
                            value: "user",
                          }], email: boardingDetails?.companyemail?.split(",")?.length > 0 ? boardingDetails?.companyemail?.split(",")[0] : ""
                        }))
                      }} disabled={!!boardingDetails?.rocketchatid} />
                    }
                    label="Create Account"
                  />
                </FormControl>
              </Grid>
              {createRocketChat?.create && <>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Email<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={boardingDetails?.companyemail?.split(",")?.length > 0 ? boardingDetails.companyemail?.split(",")?.map(data => ({
                        label: data,
                        value: data,
                      })) : []}
                      placeholder="Please Select Email"
                      value={{
                        label: !createRocketChat?.email ? "Please Select Email" : createRocketChat?.email,
                        value: !createRocketChat?.email ? "Please Select Email" : createRocketChat?.email,
                      }}
                      onChange={(e) => {
                        setCreateRocketChat((prev) => ({ ...prev, email: e.value }))
                      }}
                    />
                    {errorsLog.rocketchatemail && (
                      <div>{errorsLog.rocketchatemail}</div>
                    )}
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Role<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={rocketChatRolesOptions}
                      value={createRocketChat?.roles}
                      onChange={(e) => {
                        handleRocketchatRoleChange(e);
                      }}
                      valueRenderer={customValueRendererRocketchatRole}
                      labelledBy="Please Select Role"
                    />
                    {errorsLog.rocketchatrole && (
                      <div>{errorsLog.rocketchatrole}</div>
                    )}
                  </FormControl>
                </Grid>
              </>}

            </Grid>
          </Grid>
          <br />
        </Box>

        <br />
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>
            {" "}
            Process Allot <b style={{ color: "red" }}>*</b>
          </Typography>
          <br />
          <br />

          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Process <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  options={Array.from(
                    new Set(
                      ProcessOptions?.filter(
                        (comp) => boardingDetails.team === comp.team
                      )?.map((com) => com.process)
                    )
                  ).map((name) => ({
                    label: name,
                    value: name,
                  }))}
                  value={{
                    label: loginNotAllot.process,
                    value: loginNotAllot.process,
                  }}
                  onChange={(e) => {
                    setLoginNotAllot({
                      ...loginNotAllot,
                      process: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Process Type <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  options={processTypes}
                  value={{
                    label: loginNotAllot?.processtype,
                    value: loginNotAllot?.processtype,
                  }}
                  onChange={(e) => {
                    setLoginNotAllot({
                      ...loginNotAllot,
                      processtype: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Process Duration <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  options={processDuration}
                  value={{
                    label: loginNotAllot?.processduration,
                    value: loginNotAllot?.processduration,
                  }}
                  onChange={(e) => {
                    setLoginNotAllot({
                      ...loginNotAllot,
                      processduration: e.value,
                    });
                    setnewstate(!newstate);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Duration <b style={{ color: "red" }}>*</b>
              </Typography>
              <Grid container spacing={1}>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={300}
                      options={hrsOption}
                      placeholder="Hrs"
                      value={{
                        label: loginNotAllot.time,
                        value: loginNotAllot.time,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          time: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={300}
                      options={minsOption}
                      placeholder="Mins"
                      value={{
                        label: loginNotAllot.timemins,
                        value: loginNotAllot.timemins,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          timemins: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Gross Salary</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={overallgrosstotal}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Mode Experience</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={modeexperience}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Target Experience</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  // placeholder="Please Enter IFSC Code"
                  value={targetexperience}
                // onChange={(e) => {
                //   setEmployee({ ...employee, ifsccode: e.target.value });
                // }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Target Points</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  // placeholder="Please Enter IFSC Code"
                  value={targetpts}
                // onChange={(e) => {
                //   setEmployee({ ...employee, ifsccode: e.target.value });
                // }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <br />
        {/* </Box><br /> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px 0px",
          }}
        >
          <Box>
            <Button className="prev" variant="contained" onClick={prevStep} sx={buttonStyles?.buttonsubmit}>
              Previous
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            {/* <Button sx={userStyle.btncancel} onClick={(e)=>{handleDraftSubmit(e);}} > Draft </Button> */}
            {/* <Link to="/internlist"> */}
            <Button sx={buttonStyles.btncancel} onClick={(e) => {
              handleOpenConfirmationPopup("cancel");
            }}> Cancel </Button>
            {/* </Link> */}
            <LoadingButton

              onClick={(e) => {
                // handleButtonClick(e);
                handleOpenConfirmationPopup("submit");
              }}
              sx={buttonStyles?.buttonsubmit}
              loading={loading}
              loadingPosition="start"
              variant="contained"
            >
              <span>UPDATE</span>
            </LoadingButton>
          </Box>
        </Box>
      </>
    );
  };

  const renderIndicator = () => {
    return (
      <ul className="indicatoremployee">
        <li className={step === 1 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Boarding Update
        </li>
        <li className={step === 2 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp; Assign Experience && Process Allot
        </li>

      </ul>
    );
  };

  return (
    <div className="multistep-form">
      {renderIndicator()}
      {step === 1 ? renderStepTwo() : null}
      {/* {step === 2 ? renderStepThree() : null} */}
      {step === 2 ? renderStepSix() : null}

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
            <Button variant="contained" color="error" onClick={handleCloseerr} sx={buttonStyles?.buttonsubmit}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        {/* edit model */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          fullWidth={true}
          maxWidth="lg"
          sx={{ marginTop: "50px" }}
        >
          {/* <Box sx={userStyle.dialogbox}> */}
          <Box sx={{ padding: "20px" }}>
            <Typography sx={userStyle.HeaderText}>
              Employee Move to Live
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Company</b>{" "}
                  </Typography>
                  <Typography>{boardingDetails.company} </Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Branch</b>{" "}
                  </Typography>
                  <Typography>{boardingDetails.branch} </Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Unit</b>{" "}
                  </Typography>
                  <Typography>{boardingDetails.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Team</b>{" "}
                  </Typography>
                  <Typography>{boardingDetails.team} </Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Department</b>{" "}
                  </Typography>
                  <Typography>{boardingDetails.department} </Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b>Designation</b>{" "}
                  </Typography>
                  <Typography>{boardingDetails.designation} </Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Type<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={Typeoptions}
                    value={{
                      label: employee.type,
                      value: employee.type,
                    }}
                    onChange={(e) => {
                      setEmployee({
                        ...employee,
                        type: e.value,
                        salaryrange: "Please Select Salary Range",
                      });
                      setLoginNotAllot({
                        ...loginNotAllot,
                        process: "Please Select Process",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {employee.type === "Amount Wise" && (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} xs={6} sm={6}>
                        <Typography>
                          Salary Range<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Selects
                            options={salaryrangeoptions}
                            value={{
                              label: employee.salaryrange,
                              value: employee.salaryrange,
                            }}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                salaryrange: e.value,
                                from: "",
                                to: "",
                                amountvalue: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>

                      {employee.salaryrange === "Between" ? (
                        <>
                          <Grid item md={3} xs={3} sm={3}>
                            <Typography>
                              From<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <FormControl fullWidth size="small">
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                size="small"
                                value={employee.from}
                                onChange={(e) => {
                                  setEmployee({
                                    ...employee,
                                    from: e.target.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item md={3} xs={3} sm={3}>
                            <Typography>
                              To<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <FormControl fullWidth size="small">
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                size="small"
                                value={employee.to}
                                onChange={(e) => {
                                  setEmployee({
                                    ...employee,
                                    to: e.target.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      ) : (
                        <Grid item md={6} xs={6} sm={6}>
                          <Typography>
                            Amount Value<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            size="small"
                            value={employee.amountvalue}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                amountvalue: e.target.value,
                              });
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </>
              )}
              {employee.type === "Process Wise" && (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      Process<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        options={Array.from(
                          new Set(
                            ProcessOptions?.filter(
                              (comp) => boardingDetails.team === comp.team
                            )?.map((com) => com.process)
                          )
                        ).map((name) => ({
                          label: name,
                          value: name,
                        }))}
                        value={{
                          label: loginNotAllot.process,
                          value: loginNotAllot.process,
                        }}
                        onChange={(e) => {
                          setLoginNotAllot({
                            ...loginNotAllot,
                            process: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={4} sm={4}>
                <Button variant="contained" onClick={handlesalary} sx={buttonStyles?.buttonsubmit}>
                  Filter
                </Button>
              </Grid>
              <Grid item md={4} xs={4} sm={4}>
                <Button onClick={handleClear} sx={buttonStyles.btncancel} >
                  Clear
                </Button>
              </Grid>
              <Grid item md={4} xs={4} sm={4}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCloseModEdit}
                >
                  {" "}
                  Close{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <br />
          <Divider></Divider>
          <Box sx={{ padding: "20px" }}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>List</Typography>
            </Grid>
            <br />
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    size="small"
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
                    <MenuItem value={salaryfix?.length}>All</MenuItem>
                  </Select>
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
              id={idopen}
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
            <br />
            <br />
            {isArea ? (
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
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
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
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
            )}
          </Box>
        </Dialog>
      </Box>
      <LoadingDialog
        open={openPopupUpload}
        onClose={() => setOpenPopupUpload(false)}
        progress={uploadProgress}
      />
      <ToastContainer />
      <LoadingBackdrop open={isLoading} />
      <Box>
        <Dialog
          open={isErrorOpenNew}
          onClose={handleCloseerrNew}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertNew}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerrNew} sx={buttonStyles?.buttonsubmit}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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

      <ConfirmationPopup
        open={popup.open}
        onClose={handleCloseConfirmationPopup}
        onConfirm={handleConfirm}
        title={
          popup.action === "submit"
            ? "Are you sure? Do you want to Submit?"
            : popup.action === "draft"
              ? "Are you sure? Do you want to save as Draft?"
              : "Are you sure? Do you want to Cancel?"
        }
        description={
          popup.action === "submit"
            ? "This action will finalize and submit your data."
            : popup.action === "draft"
              ? "This action will save your progress as a draft."
              : "This action will cancel your progress."
        }
        confirmButtonText={
          popup.action === "submit"
            ? "Submit"
            : popup.action === "draft"
              ? "Save Draft"
              : "Yes"
        }
        cancelButtonText="No"
        icon={
          popup.action === "submit"
            ? "success"
            : popup.action === "draft"
              ? "warning"
              : "error"
        }
        iconColor={
          popup.action === "submit"
            ? "green"
            : popup.action === "draft"
              ? "orange"
              : "red"
        }
        confirmButtonColor={
          popup.action === "submit"
            ? "success"
            : popup.action === "draft"
              ? "warning"
              : "error"
        }
      />
    </div>
  );
}

export default EditMovietolive;