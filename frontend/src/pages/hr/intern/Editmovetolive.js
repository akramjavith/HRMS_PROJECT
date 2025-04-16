import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  Dialog,
  DialogContent,
  FormGroup,
  Divider,
  Select,
  DialogActions,
  FormControl,
  Grid,
  Checkbox,
  TextareaAutosize,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemText,
  Popover,
  IconButton,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import Webcamimage from "../employees/Webcamprofile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import axios from "axios";
import Selects from "react-select";
import moment from "moment-timezone";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus, FaEdit } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StyledDataGrid from "../../../components/TableStyle";
import "jspdf-autotable";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";
import { Country, State, City } from "country-state-city";
import Dropzone from "react-dropzone";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import "../employees/MultistepForm.css";
import { FaArrowAltCircleRight } from "react-icons/fa";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import debounce from "lodash.debounce";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Headtitle from "../../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { ThreeDots } from "react-loader-spinner";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function EditMovietolive() {
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

      let autoWorkStation = `W${selectedBranchCode?.toUpperCase()}${selectedUnitCode?.toUpperCase()}_${
        lastwscode === 0
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
  const [maxSelections, setMaxSelections] = useState("");
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Shift Type"}{" "}
          </p>
        </>
      );
      handleClickOpenerr();
      return; // Stop further processing if validation fails
    } else {
      if (boardingDetails.shifttype === "Daily") {
        if (boardingDetails.shiftgrouping === "Please Select Shift Grouping") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (boardingDetails.shifttiming === "Please Select Shift") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Week Off"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
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
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (boardingDetails.shifttiming === "Please Select Shift") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Weeks"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Week Off"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
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
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (boardingDetails.shifttiming === "Please Select Shift") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Weeks"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Week Off"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
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
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (boardingDetails.shifttiming === "Please Select Shift") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Weeks"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Week Off"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      // console.log(res.data?.employeeCode, "res.data?.employeeCode");
      setNewval(res.data?.employeeCode);
      return res.data?.employeeCode || "";
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

  const [dateOfJoining, setDateOfJoining] = useState(date);

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [departmentOption, setDepartmentOption] = useState([]);

  const fetchDepartmentAll = async () => {
    try {
      let res_deptandteam = await axios.get(SERVICE.DEPARTMENT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      setDepartmentOption([
        ...res_deptandteam?.data?.departmentdetails?.map((t) => ({
          ...t,
          label: t.deptname,
          value: t.deptname,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        res_status?.data?.departmentanddesignationgroupings?.map((data) => ({
          ...data,
          label: data.designation,
          value: data.designation,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const { id: newId } = useParams();

  const [updatedBy, setUpdatedBy] = useState([]);

  const [workStationInputOldDatas, setWorkStationInputOldDatas] = useState({});

  const [oldEmpCode, setOldEmpCode] = useState("");
  const getCode = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${newId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
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
        moment().format("YYYY-MM-DD")
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
      fetchSuperVisorDropdowns(res?.data?.suser?.team);
      if (res?.data?.suser?.assignExpLog?.lenth === 0) {
        setAssignExperience({
          ...assignExperience,
          updatedate: res?.data?.suser?.doj,
        });
      } else {
        setAssignExperience({
          ...assignExperience,
          assignExpMode: res?.data?.suser?.assignExpLog[0]?.expmode,
          assignExpvalue: res?.data?.suser?.assignExpLog[0]?.expval,
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
          assignEndTarvalue: res?.data?.suser?.assignExpLog[0]?.endtar,
          assignEndExpvalue: res?.data?.suser?.assignExpLog[0]?.endexp,
          updatedate:
            res?.data?.suser?.assignExpLog[0]?.updatedate !== ""
              ? moment(res?.data?.suser?.assignExpLog[0]?.updatedate).format(
                  "YYYY-MM-DD"
                )
              : "",
        });
      }

      setGettingOldDatas(res?.data?.suser);
      const userdata = {
        ...boardingDetails,
        company: res?.data?.suser?.company,
        companyname: res?.data?.suser?.companyname,
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
        department:
          res?.data?.suser?.department === "" ||
          res?.data?.suser?.department === undefined
            ? "Please Select Department"
            : res?.data?.suser?.department,
        team:
          res?.data?.suser?.team === "" || res?.data?.suser?.team === undefined
            ? "Please Select Team"
            : res?.data?.suser?.team,
        designation:
          res?.data?.suser?.designation === "" ||
          res?.data?.suser?.designation === undefined
            ? "Please Select Designation"
            : res?.data?.suser?.designation,
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
      setMaxSelections(employeeCount);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
        process: loginNotAllot.process,
        amountvalue: employee.amountvalue,
        fromamount: employee.from,
        toamount: employee.to,
      });
      setSalaryFix(res?.data?.result);
      setIsArea(false);
    } catch (err) {
      setIsArea(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handlesalary = (e) => {
    e.preventDefault();
    try {
      if (employee.type === "Please Select Type") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <Typography style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              Please Select Type{" "}
            </Typography>
          </>
        );
        handleClickOpenerr();
      } else if (
        employee.type === "Amount Wise" &&
        employee.salaryrange === "Please Select Salary Range"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Salary Range"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        employee.type === "Process Wise" &&
        loginNotAllot.process === "Please Select Process"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Process"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (employee.salaryrange === "Between" && employee.from === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter From"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (employee.salaryrange === "Between" && employee.to === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter To"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        (employee.salaryrange === "Less Than" ||
          employee.salaryrange === "Greater Than" ||
          employee.salaryrange === "Exact") &&
        employee.amountvalue === ""
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Amount Value"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        SalaryFixFilter();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCodesalary = (totalValue, code, experience, targetpoints) => {
    setAssignExperience({
      ...assignExperience,
      assignExpMode: "Add",
      assignExpvalue: experience,
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
          dateOfJoining,
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
          dateOfJoining,
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
            dateOfJoining,
            findDate
          );
        }
      }

      //findtar end difference yes/no
      if (modevalue.endtar === "Yes") {
        differenceInMonthstar = calculateMonthsBetweenDates(
          dateOfJoining,
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
          dateOfJoining,
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
            dateOfJoining,
            findDate
          );
        }
      }

      differenceInMonths = calculateMonthsBetweenDates(dateOfJoining, findDate);
      differenceInMonths = differenceInMonths < 1 ? 0 : differenceInMonths;
      if (assignExperience.assignExpMode === "Add") {
        differenceInMonths += parseInt(assignExperience.assignExpvalue);
      } else if (assignExperience.assignExpMode === "Minus") {
        differenceInMonths -= parseInt(assignExperience.assignExpvalue);
      } else if (assignExperience.assignExpMode === "Fix") {
        differenceInMonths = parseInt(assignExperience.assignExpvalue);
      } else {
        differenceInMonths = calculateMonthsBetweenDates(
          dateOfJoining,
          findDate
        );
      }
    } else {
      differenceInMonthsexp = calculateMonthsBetweenDates(
        dateOfJoining,
        findDate
      );
      differenceInMonthstar = calculateMonthsBetweenDates(
        dateOfJoining,
        findDate
      );
      differenceInMonths = calculateMonthsBetweenDates(dateOfJoining, findDate);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      result.flat()?.map((d) => ({
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
        if (res?.data?.suser?.designationlog?.length === 0) {
          setDesignationLog([
            {
              branch: res?.data?.suser.branch,
              designation: res?.data?.suser.designation,
              startdate: formattedDate,
              team: res?.data?.suser.team,
              unit: res?.data?.suser.unit,
              username: res?.data?.suser.companyname,
              _id: res?.data?.suser._id,
            },
          ]);
        } else {
          setDesignationLog(res?.data?.suser?.designationlog);
        }
        if (res?.data?.suser?.departmentlog?.length === 0) {
          setDepartmentLog([
            {
              branch: res?.data?.suser?.branch,
              department: res?.data?.suser?.department,
              startdate: formattedDate,
              team: res?.data?.suser?.team,
              unit: res?.data?.suser?.unit,
              username: res?.data?.suser?.companyname,
              _id: res?.data?.suser?._id,
            },
          ]);
        } else {
          setDepartmentLog(res?.data?.suser?.departmentlog);
        }

        // boarding log
        if (res?.data?.suser?.boardingLog?.length === 0) {
          setBoardingLog([
            {
              company: res?.data?.suser?.company,
              branch: res?.data?.suser?.branch,
              department: res?.data?.suser?.department,
              startdate: formattedDate,
              team: res?.data?.suser?.team,
              unit: res?.data?.suser?.unit,
              shifttiming: res?.data?.suser?.shifttiming,
              shiftgrouping: res?.data?.suser?.shiftgrouping,
              process: res?.data?.suser?.process,
              username: res?.data?.suser?.companyname,
              _id: res?.data?.suser?._id,
            },
          ]);
        } else {
          setBoardingLog(res?.data?.suser?.boardingLog);
        }

        // process log
        if (res?.data?.suser?.processlog?.length === 0) {
          setProcessLog([
            {
              company: res?.data?.suser?.company,
              branch: res?.data?.suser?.branch,
              department: res?.data?.suser?.department,
              startdate: formattedDate,
              team: res?.data?.suser?.team,
              unit: res?.data?.suser?.unit,
              shifttiming: res?.data?.suser?.shifttiming,
              shiftgrouping: res?.data?.suser?.shiftgrouping,
              process: res?.data?.suser?.process,
              username: res?.data?.suser?.companyname,
              _id: res?.data?.suser?._id,
            },
          ]);
        } else {
          setProcessLog(res?.data?.suser?.processlog);
        }

        setPrimaryWorkStation(res?.data?.suser?.workstation[0]);
        const employeeCount = res?.data?.suser?.employeecount || 0;
        setMaxSelections(employeeCount);
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };
    rowData();
  }, []);

  // company multi select
  const handleEmployeesChange = (options) => {
    // If employeecount is greater than 0, limit the selections
    if (maxSelections > 0) {
      // Limit the selections to the maximum allowed
      options = options?.slice(0, maxSelections - 1);
    }

    // Update the disabled property based on the current selections and employeecount
    const updatedOptions = filteredWorkStation.map((option) => ({
      ...option,
      disabled:
        maxSelections - 1 > 0 &&
        options.length >= maxSelections - 1 &&
        !options.find(
          (selectedOption) => selectedOption.value === option.value
        ),
    }));

    setValueWorkStation(options.map((a, index) => a.value));
    setSelectedOptionsWorkStation(options);
    setFilteredWorkStation(updatedOptions);
  };
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

  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
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
        result.flat()?.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
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
  const [newHierarchyData, setNewHierarchyData] = useState([]);
  const [getingOlddatas, setGettingOldDatas] = useState([]);
  const [lastUpdatedData, setLastUpdatedData] = useState([]);

  const checkHierarchyName = async (newValue, type) => {
    try {
      if (
        type === "Designation"
          ? newValue != getingOlddatas?.designation
          : newValue != getingOlddatas?.team
      ) {
        let res = await axios.post(SERVICE.HIERARCHI_TEAM_DESIGNATION_CHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldname: getingOlddatas,
          newname: newValue,
          type: type,
          username: getingOlddatas.companyname,
        });

        setOldHierarchyData(res?.data?.hierarchyold);
        setNewHierarchyData(res?.data?.hierarchyfindchange);
        setOldHierarchyDataSupervisor(res?.data?.hierarchyoldsupervisor);
        setLastUpdatedData(type);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchSuperVisorDropdowns = async (team) => {
    let res = await axios.post(SERVICE.HIERARCHY_REPORTING_TO, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      team: team,
    });

    const resultUsers =
      res?.data?.result?.length > 0
        ? res?.data?.result[0]?.result?.supervisorchoose
        : [];
    setreportingtonames(resultUsers);
  };
  const backPage = useNavigate();

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    // const changeddptlog1st = userUpdate?.departmentlog?.slice(0, 1);
    // const changedptlogwiout1st = userUpdate?.departmentlog?.slice(1);
    // const finaldot = [
    //   {
    //     ...changeddptlog1st[0],
    //     department: String(boardingDetails.department),
    //     startdate: String(dateOfJoining),
    //     time: moment().format("HH:mm"),
    //     branch: String(boardingDetails.branch),
    //     unit: String(boardingDetails.unit),
    //     team: String(boardingDetails.team),
    //   },
    //   ...changedptlogwiout1st,
    // ];

    // // designation log details
    // const changeddeslog1st = userUpdate?.designationlog?.slice(0, 1);
    // const changedeslogwiout1st = userUpdate?.designationlog?.slice(1);
    // const finaldesignationlog = [
    //   {
    //     ...changeddeslog1st[0],
    //     designation: String(boardingDetails.designation),
    //     startdate: String(dateOfJoining), // Fixed the field names
    //     time: moment().format("HH:mm"),
    //     branch: String(boardingDetails.branch), // Fixed the field names
    //     unit: String(boardingDetails.unit),
    //     team: String(boardingDetails.team),
    //   },
    //   ...changedeslogwiout1st,
    // ];

    // // boarding log details
    // const changedboardlog1st = userUpdate?.boardingLog?.slice(0, 1);
    // const changeboardinglogwiout1st = userUpdate?.boardingLog?.slice(1);
    // const finalboardinglog = [
    //   {
    //     ...changedboardlog1st[0],
    //     company: String(boardingDetails?.company),
    //     startdate: String(dateOfJoining),
    //     time: moment().format("HH:mm"),
    //     branch: String(boardingDetails?.branch),
    //     unit: String(boardingDetails?.unit),
    //     team: String(boardingDetails?.team),
    //     shifttype: String(boardingDetails.shifttype),
    //     shifttiming: String(boardingDetails.shifttiming),
    //     shiftgrouping: String(boardingDetails.shiftgrouping),
    //     weekoff: [...valueCate],
    //     todo: boardingDetails.shifttype === "Standard" ? [] : [...todo],
    //   },
    //   ...changeboardinglogwiout1st,
    // ];

    // // process log details
    // const changedprocesslog1st = userUpdate.processlog?.slice(0, 1);
    // const changeprocesslogwiout1st = userUpdate.processlog?.slice(1);
    // const finalprocesslog = [
    //   {
    //     ...changedprocesslog1st[0],
    //     ompany: String(boardingDetails.company),
    //     branch: String(boardingDetails.branch),
    //     unit: String(boardingDetails.unit),
    //     team: String(boardingDetails.team),
    //     shifttiming: String(boardingDetails.shifttiming),
    //     shiftgrouping: String(boardingDetails.shiftgrouping),
    //     process: String(
    //       loginNotAllot.process === "" || loginNotAllot.process == undefined
    //         ? ""
    //         : loginNotAllot.process
    //     ),
    //     processduration: String(
    //       loginNotAllot.processduration === "" ||
    //         loginNotAllot.processduration == undefined
    //         ? ""
    //         : loginNotAllot.processduration
    //     ),
    //     processtype: String(
    //       loginNotAllot.processtype === "" ||
    //         loginNotAllot.processtype == undefined
    //         ? ""
    //         : loginNotAllot.processtype
    //     ),

    //     startdate: dateOfJoining,
    //     time: String(loginNotAllot.time),
    //   },
    //   ...changeprocesslogwiout1st,
    // ];

    // //Experience log
    // const changedassignexplog1st = userUpdate?.assignExpLog?.slice(0, 1);
    // const changeassignexplogwiout1st = userUpdate?.assignExpLog?.slice(1);
    // const finalassignexplog = [
    //   {
    //     ...changedassignexplog1st[0],
    //     expmode: String(assignExperience.assignExpMode),
    //     expval: String(assignExperience.assignExpvalue),

    //     endexp: String(assignExperience.assignEndExpvalue),
    //     endexpdate:
    //       assignExperience.assignEndExpvalue === "Yes"
    //         ? String(assignExperience.assignEndExpDate)
    //         : "",
    //     endtar: String(assignExperience.assignEndTarvalue),
    //     endtardate:
    //       assignExperience.assignEndTarvalue === "Yes"
    //         ? String(assignExperience.assignEndTarDate)
    //         : "",
    //     updatedate: String(assignExperience.updatedate),
    //     date: String(dateOfJoining),
    //   },
    //   ...changeassignexplogwiout1st,
    // ];

    //correct
    // departmentlog details
    const changeddptlog1st = departmentLog?.slice(0, 1) || [];
    const changedptlogwiout1st = departmentLog?.slice(1) || [];
    const finaldot = [
      {
        ...changeddptlog1st[0],
        userid: String(userUpdate.wordcheck ? employeecodenew : newval),
        username: String(boardingDetails.companyname),
        department: String(boardingDetails.department),
        startdate: String(dateOfJoining),
        companyname: String(boardingDetails.company),
        branch: String(boardingDetails.branch),
        unit: String(boardingDetails.unit),
        team: String(boardingDetails.team),
        status: Boolean(boardingDetails.statuss),
        logeditedby: [],
        updateddatetime: String(new Date()),
        updatedusername: String(isUserRoleAccess.companyname),
      },
      ...changedptlogwiout1st,
    ];

    // designation log details
    const changeddeslog1st = designationLog?.slice(0, 1) || [];
    const changedeslogwiout1st = designationLog?.slice(1) || [];
    const finaldesignationlog = [
      {
        ...changeddeslog1st[0],
        designation: String(boardingDetails.designation),
        username: String(boardingDetails.companyname),
        companyname: String(boardingDetails.company),
        startdate: String(dateOfJoining),
        time: moment().format("HH:mm"),
        branch: String(boardingDetails.branch),
        unit: String(boardingDetails.unit),
        team: String(boardingDetails.team),
        logeditedby: [],
        updateddatetime: String(new Date()),
        updatedusername: String(isUserRoleAccess.companyname),
      },
      ...changedeslogwiout1st,
    ];

    // boarding log details
    let trimmedWorkstation =
      primaryWorkStation == "Please Select Primary Work Station"
        ? []
        : primaryWorkStation;
    const changedboardlog1st = boardingLog?.slice(0, 1) || [];
    const changeboardinglogwiout1st = boardingLog?.slice(1) || [];
    const finalboardinglog = [
      {
        ...changedboardlog1st[0],
        username: employee.companyname,
        company: String(boardingDetails.company),
        startdate: String(dateOfJoining),
        time: moment().format("HH:mm"),
        branch: String(boardingDetails.branch),
        unit: String(boardingDetails.unit),
        team: String(boardingDetails.team),
        ischangecompany: true,
        ischangebranch: true,
        ischangeunit: true,
        ischangeteam: true,
        logeditedby: [],
        updateddatetime: String(new Date()),
        updatedusername: String(isUserRoleAccess.companyname),
        shifttype: String(boardingDetails.shifttype),
        shifttiming: String(boardingDetails.shifttiming),
        shiftgrouping: String(boardingDetails.shiftgrouping),
        logcreation: String("user"),
        weekoff: [...valueCate],
        todo: boardingDetails.shifttype === "Standard" ? [] : [...todo],
        floor: String(boardingDetails.floor),
        area: String(boardingDetails.area),
        workstation:
          boardingDetails.workmode !== "Remote"
            ? valueWorkStation.length === 0
              ? trimmedWorkstation
              : [primaryWorkStation, ...valueWorkStation]
            : [primaryWorkStation, ...valueWorkStation],
      },
      ...changeboardinglogwiout1st,
    ];

    // process log details
    const changedprocesslog1st = processLog?.slice(0, 1) || [];
    const changeprocesslogwiout1st = processLog?.slice(1) || [];
    const finalprocesslog = [
      {
        ...changedprocesslog1st[0],
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
        logeditedby: [],
        updateddatetime: String(new Date()),
        updatedusername: String(isUserRoleAccess.companyname),
        time: `${loginNotAllot.time}:${loginNotAllot?.timemins}`,
      },
      ...changeprocesslogwiout1st,
    ];

    //Experience log
    const changedassignexplog1st = employee?.assignExpLog?.slice(0, 1) || [];
    const changeassignexplogwiout1st = employee?.assignExpLog?.slice(1) || [];
    const finalassignexplog = [
      {
        ...changedassignexplog1st[0],
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
      },
      ...changeassignexplogwiout1st,
    ];
    try {
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

      let res = await axios.put(
        `${SERVICE.UPDATE_INTERN}/${newId}`,
        {
          company: String(boardingDetails.company),
          branch: String(boardingDetails.branch),
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
          wordcheck: Boolean(userUpdate.wordcheck),
          empcode: String(userUpdate.wordcheck ? employeecodenew : newEmpCode),

          workstation:
            boardingDetails.workmode !== "Remote"
              ? valueWorkStation.length === 0
                ? primaryWorkStation
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

      if (oldHierarchyData?.length > 0 && newHierarchyData?.length > 0) {
        //setting New EmployeeNames into the another
        const newEmployeenames = [
          ...newHierarchyData[0].employeename,
          employee?.companyname,
        ];

        let res = await axios.post(
          `${SERVICE.HIRERARCHI_CREATE}`,
          {
            company: String(newHierarchyData[0].company),
            designationgroup:
              lastUpdatedData === "Designation"
                ? designationGroup
                : String(newHierarchyData[0].designationgroup),
            department: String(newHierarchyData[0].department),
            branch: String(newHierarchyData[0].branch),
            unit: String(newHierarchyData[0].unit),
            team: String(newHierarchyData[0].team),
            supervisorchoose: String(newHierarchyData[0].supervisorchoose),
            mode: String(newHierarchyData[0].mode),
            level: String(newHierarchyData[0].level),
            control: String(newHierarchyData[0].control),
            employeename: userUpdate.companyname,
            access: newHierarchyData[0].access,
            action: Boolean(true),
            empbranch: newHierarchyData[0].empbranch,
            empunit: newHierarchyData[0].empunit,
            empcode: getingOlddatas.empcode,
            empteam:
              lastUpdatedData === "Designation"
                ? newHierarchyData[0].empteam
                : employee.team,
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
          }
        );

        //Removing Name From the Old one
        let oldHierarchy = oldHierarchyData?.map((data) => {
          let oldemployeename = data.employeename?.filter(
            (ite) => ite != employee?.companyname
          );
          if (oldemployeename?.length > 1) {
            let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              employeename: oldemployeename,
            });
          } else {
            let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            });
          }
        });
      }
      if (
        oldHierarchyDataSupervisor?.length > 0 &&
        newHierarchyData?.length > 0
      ) {
        //setting New EmployeeNames into the another
        const newEmployeenames = oldHierarchyDataSupervisor?.map((data) =>
          axios.post(
            `${SERVICE.HIRERARCHI_CREATE}`,
            {
              company: String(newHierarchyData[0].company),
              designationgroup:
                lastUpdatedData === "Designation"
                  ? designationGroup
                  : String(newHierarchyData[0].designationgroup),
              department: String(newHierarchyData[0].department),
              branch: String(newHierarchyData[0].branch),
              unit: String(newHierarchyData[0].unit),
              team: String(newHierarchyData[0].team),
              supervisorchoose: String(newHierarchyData[0].supervisorchoose),
              mode: String(newHierarchyData[0].mode),
              level: String(newHierarchyData[0].level),
              control: String(newHierarchyData[0].control),
              employeename: data.employeename,
              access: newHierarchyData[0].access,
              action: Boolean(true),
              empbranch: newHierarchyData[0].empbranch,
              empunit: newHierarchyData[0].empunit,
              empcode: data.empcode,
              empteam:
                lastUpdatedData === "Designation"
                  ? newHierarchyData[0].empteam
                  : employee.team,
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
            }
          )
        );

        //Removing Name From the Old one
        let oldHierarchy = oldHierarchyDataSupervisor?.map((data) => {
          let oldemployeename = data.supervisorchoose?.filter(
            (ite) => ite != employee?.companyname
          );
          if (oldemployeename?.length > 1) {
            let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              supervisorchoose: oldemployeename,
            });
          } else {
            let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            });
          }
        });
      }

      await axios.put(
        `${SERVICE.EMPLOYEECODEOVERALLUPDATE}`,
        {
          oldempcode: oldEmpCode,
          newempcode: String(
            userUpdate.wordcheck ? employeecodenew : newEmpCode
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          onUploadProgress: handleUploadProgress,
        }
      );

      setDateOfJoining(date);
      setEmployeecodenew("");
      setOpenPopupUpload(false);
      // handleCloseModEdit();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      await fetchEmployee();
      backPage("/internlist");
    } catch (err) {
      console.log(err);
      setOpenPopupUpload(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const nextStep = () => {
    // Check the validity of field1

    if (loginNotAllot.process === "Please Select Process") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      loginNotAllot.time === "Hrs" ||
      loginNotAllot.time === "" ||
      loginNotAllot.time == undefined ||
      loginNotAllot.timemins === "" ||
      loginNotAllot.timemins == undefined ||
      loginNotAllot.timemins === "Mins" ||
      (loginNotAllot.time === "00" && loginNotAllot.timemins === "00")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Duration"}
          </p>
        </>
      );
      handleClickOpenerr();
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

    if (boardingDetails?.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingDetails?.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingDetails?.unit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingDetails?.team === "Please Select Team") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingDetails?.team === "Please Select Floor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Floor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingDetails?.department === "Please Select Department") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Department"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingDetails?.designation === "Please Select Designation") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingDetails?.shifttype === "Please Select Shift Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Shift Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingDetails.shifttype === "Standard" &&
      boardingDetails.shiftgrouping === "Please Select Shift Grouping"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" ShiftGrouping must be required"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingDetails.shifttype === "Standard" &&
      boardingDetails.shifttiming === "Please Select Shift"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Shifttiming must be required"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingDetails.shifttype === "1 Week Rotation" &&
      oneweekrotation > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Please Add all the weeks in the todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingDetails.shifttype === "2 Week Rotation" &&
      twoweekrotation > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Please Add all the weeks in the todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingDetails.shifttype === "1 Month Rotation" &&
      onemonthrotation > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Please Add all the weeks in the todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (boardingDetails.shifttype === "Daily" ||
        boardingDetails.shifttype === "1 Week Rotation" ||
        boardingDetails.shifttype === "2 Week Rotation" ||
        boardingDetails.shifttype === "1 Month Rotation") &&
      checkShiftMode.length > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Shift Mode must be required"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (boardingDetails.shifttype === "Daily" ||
        boardingDetails.shifttype === "1 Week Rotation" ||
        boardingDetails.shifttype === "2 Week Rotation" ||
        boardingDetails.shifttype === "1 Month Rotation") &&
      checkShiftGroup.length > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Shift Group must be required"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (boardingDetails.shifttype === "Daily" ||
        boardingDetails.shifttype === "1 Week Rotation" ||
        boardingDetails.shifttype === "2 Week Rotation" ||
        boardingDetails.shifttype === "1 Month Rotation") &&
      checkShift.length > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Shift must be required"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingDetails?.reportingto === "Please Select Reporting To") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Reporting To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      // boardingDetails.workmode === "" ||
      boardingDetails.workmode === "Please Select Work Mode"
      // boardingDetails.workmode === "Internship"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Work Mode"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (!internStatusUpdate.wordcheck && empcodelimitedAll?.includes(newval)) ||
      (internStatusUpdate.wordcheck &&
        empcodelimitedAll?.includes(employeecodenew))
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Empcode Already Exists"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (internStatusUpdate.wordcheck && employeecodenew === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter EmpCode"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmitMulti = (e) => {
    e.preventDefault();
    if (
      assignExperience.assignExpMode === "Add" ||
      assignExperience.assignExpMode === "Minus" ||
      assignExperience.assignExpMode === "Fix"
    ) {
      if (assignExperience.assignExpvalue == "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Value "}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        sendEditRequest();
      }
    } else {
      sendEditRequest();
    }
  };

  const renderStepTwo = () => {
    return (
      <>
        <Headtitle title={"INTERN EDIT"} />

        <Box sx={userStyle.dialogbox}>
          <Typography sx={userStyle.importheadtext}>
            Boarding Information
          </Typography>

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
                      dateOfJoining
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
                        u.branch === boardingDetails.branch
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
                    checkHierarchyName(e.value, "Team");
                    setLoginNotAllot({
                      ...loginNotAllot,
                      process: "Please Select Process",
                    });
                    fetchSuperVisorDropdowns(e.value);
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
              <FormControl fullWidth size="small">
                <Typography>
                  Department <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={departmentOption}
                  placeholder="Please Select Department"
                  value={{
                    label: boardingDetails.department,
                    value: boardingDetails.department,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      department: e.value,
                      designation: "Please Select Designation",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Designation <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={designation?.filter(
                    (item) => item.department === boardingDetails.department
                  )}
                  placeholder="Please Select Designation"
                  value={{
                    label: boardingDetails.designation,
                    value: boardingDetails.designation,
                  }}
                  onChange={(e) => {
                    setBoardingDetails({
                      ...boardingDetails,
                      designation: e.value,
                    });
                    checkHierarchyName(e.value, "Designation");
                  }}
                />
              </FormControl>
            </Grid>

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
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Confirm button */}
                              <Button onClick={handleUpdateTodocheck}>
                                <CheckCircleIcon
                                  style={{
                                    fontSize: "1.5rem",
                                    color: "#216d21",
                                  }}
                                />
                              </Button>
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
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Confirm button */}
                              <Button onClick={handleUpdateTodocheck}>
                                <CheckCircleIcon
                                  style={{
                                    fontSize: "1.5rem",
                                    color: "#216d21",
                                  }}
                                />
                              </Button>
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
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Confirm button */}
                              <Button onClick={handleUpdateTodocheck}>
                                <CheckCircleIcon
                                  style={{
                                    fontSize: "1.5rem",
                                    color: "#216d21",
                                  }}
                                />
                              </Button>
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
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              {/* Confirm button */}
                              <Button onClick={handleUpdateTodocheck}>
                                <CheckCircleIcon
                                  style={{
                                    fontSize: "1.5rem",
                                    color: "#216d21",
                                  }}
                                />
                              </Button>
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
                    options={filteredWorkStation}
                    label="Please Select Shift"
                    value={{
                      label: primaryWorkStation,
                      value: primaryWorkStation,
                    }}
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
                    options={allWorkStationOpt.filter(
                      (item) => item.value !== primaryWorkStation
                    )}
                    value={selectedOptionsWorkStation}
                    onChange={handleEmployeesChange}
                    valueRenderer={customValueRendererEmployees}
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
            <Grid item md={4} xs={12} sm={12}>
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
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
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
                    // value={employee.empcode}
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
                    value={newval}
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
            <Link
              to="/internlist"
              style={{
                textDecoration: "none",
                color: "white",
                float: "right",
              }}
            >
              <Button sx={userStyle.btncancel}>Cancel</Button>
            </Link>
          </Box>
          <Box>
            <Button className="next" variant="contained" onClick={nextStepLog}>
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
        <Headtitle title={"INTERN EDIT"} />
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
            <Button className="prev" variant="contained" onClick={prevStep}>
              Previous
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            {/* <Link to="/list"><Button sx={userStyle.btncancel} > Cancel </Button></Link> */}
            <Link
              to="/internlist"
              style={{
                textDecoration: "none",
                color: "white",
                float: "right",
              }}
            >
              <Button sx={userStyle.btncancel}>Cancel</Button>
            </Link>
            <Button className="next" variant="contained" onClick={nextStep}>
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

  const renderStepSix = () => {
    return (
      <>
        <Headtitle title={"INTERN EDIT"} />
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
                      value={assignExperience.assignExpvalue}
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
            <Button className="prev" variant="contained" onClick={prevStep}>
              Previous
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            {/* <Button sx={userStyle.btncancel} onClick={(e)=>{handleDraftSubmit(e);}} > Draft </Button> */}
            <Link to="/internlist">
              <Button sx={userStyle.btncancel}> Cancel </Button>
            </Link>
            <LoadingButton
              onClick={(e) => {
                handleButtonClick(e);
              }}
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
          &ensp;Process Allot
        </li>
        <li className={step === 3 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Assign Experience
        </li>
      </ul>
    );
  };

  return (
    <div className="multistep-form">
      {renderIndicator()}
      {step === 1 ? renderStepTwo() : null}
      {step === 2 ? renderStepThree() : null}
      {step === 3 ? renderStepSix() : null}

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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
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
                <Button variant="contained" onClick={handlesalary}>
                  Filter
                </Button>
              </Grid>
              <Grid item md={4} xs={4} sm={4}>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
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
      <LoadingBackdrop open={isLoading} />
    </div>
  );
}

export default EditMovietolive;
