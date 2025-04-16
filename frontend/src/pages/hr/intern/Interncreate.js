import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  FormGroup,
  InputLabel,
  Dialog,
  DialogContent,
  InputAdornment,
  Select,
  Checkbox,
  DialogActions,
  FormControl,
  Grid,
  TextareaAutosize,
  Paper,
  Divider,
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
  Modal,
} from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import StyledDataGrid from "../../../components/TableStyle";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SERVICE } from "../../../services/Baseservice";
import { Link, useNavigate } from "react-router-dom";
import Webcamimage from "../employees/Webcamprofile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import axios from "axios";
import Selects from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus, FaEdit } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "jspdf-autotable";
import { Country, State, City } from "country-state-city";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import "../employees/MultistepForm.css";
import { FaArrowAltCircleRight } from "react-icons/fa";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Headtitle from "../../../components/Headtitle";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import html2canvas from "html2canvas";
import LoadingButton from "@mui/lab/LoadingButton";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function Interncreate() {
  const currentYear = new Date().getFullYear();
  const maxDate = `${currentYear - 16}-12-31`;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [empcodelimited, setEmpCodeLimited] = useState([]);
  const [selectedBranchstatus, setSelectedBranchstatus] = useState(false);
  const [monthSets, setMonthsets] = useState([]);
  const [isArea, setIsArea] = useState(false);

  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedUnitCode, setSelectedUnitCode] = useState("");
  const [salaryfix, setSalaryFix] = useState([]);

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

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

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

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const extractNumbers = (str) => {
    const numbers = str?.match(/\d+/g);
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

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

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
              getCode(
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

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  const [selectedWorkStation, setSelectedWorkStation] = useState("");
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );
  let [valueWorkStation, setValueWorkStation] = useState("");

  const timer = useRef();

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);
  const [accessibleErrors, setAccessibleErrors] = useState({});
  const handleButtonClick = (e) => {
    e.preventDefault();
    const newErrorsLog = {};
    const missingFieldsthree = [];

    const isValidObject = (obj) => {
      for (let key in obj) {
        if (
          obj[key] === "" ||
          obj[key] === undefined ||
          obj[key] === null ||
          obj[key] === "Please Select Account Type"
        ) {
          return false;
        }
      }
      return true;
    };

    const areAllObjectsValid = (arr) => {
      for (let obj of arr) {
        if (!isValidObject(obj)) {
          return false;
        }
      }
      return true;
    };

    const exists = bankTodo.some(
      (obj, index, arr) =>
        arr.findIndex((item) => item.accountnumber === obj.accountnumber) !==
        index
    );

    const activeexists = bankTodo.filter(
      (data) => data.accountstatus === "Active"
    );

    if (bankTodo?.length > 0 && !areAllObjectsValid(bankTodo)) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please fill all the Fields in Bank Details Todo!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (bankTodo?.length > 0 && exists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Duplicate account number found!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (activeexists?.length > 1) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Only one active account is allowed at a time.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      newErrorsLog.accountstatus = (
        <Typography style={{ color: "red" }}>
          Only one active account is allowed at a time.
        </Typography>
      );
      missingFieldsthree.push("Only one active account is allowed");
    }

    const accessibleTodoexists = accessibleTodo.some(
      (obj, index, arr) =>
        arr.findIndex(
          (item) =>
            item.fromcompany === obj.fromcompany &&
            item.frombranch === obj.frombranch &&
            item.fromunit === obj.fromunit
        ) !== index
    );
    if (accessibleTodo?.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Add Accessible Company/Branch/Unit.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      newErrorsLog.accessiblecompany = (
        <Typography style={{ color: "red" }}>
          Company must be required
        </Typography>
      );
      missingFieldsthree.push("Company");
    } else if (
      accessibleTodo?.some(
        (data) =>
          data?.fromcompany === "Please Select Company" ||
          data?.frombranch === "Please Select Branch" ||
          data?.fromunit === "Please Select Unit"
      )
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Fill All the fields in Accessible Company/Branch/Unit Todo.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      newErrorsLog.accessiblecompany = (
        <Typography style={{ color: "red" }}>
          Company must be required
        </Typography>
      );
      missingFieldsthree.push("Company");
    } else if (accessibleTodoexists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Duplicate Accessible Company/Branch/Unit.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      newErrorsLog.accessiblecompany = (
        <Typography style={{ color: "red" }}>
          Company must be required
        </Typography>
      );
      missingFieldsthree.push("Company");
    }

    if (
      loginNotAllot.process === "Please Select Process" ||
      loginNotAllot.process === "" ||
      loginNotAllot.process == undefined
    ) {
      newErrorsLog.process = (
        <Typography style={{ color: "red" }}>
          Process must be required
        </Typography>
      );
      missingFieldsthree.push("Process");
    }
    if (
      loginNotAllot.time === "Hrs" ||
      loginNotAllot.timemins === "Mins" ||
      (loginNotAllot.time === "00" && loginNotAllot.timemins === "00")
    ) {
      newErrorsLog.duration = (
        <Typography style={{ color: "red" }}>
          Duration must be required
        </Typography>
      );
      missingFieldsthree.push("Duration");
    }

    if (
      formValue.startDate === "" ||
      formValue.startDate === "Please Select Date" ||
      !formValue.startDate
    ) {
      newErrorsLog.startdate = (
        <Typography style={{ color: "red" }}>Date must be required</Typography>
      );
      missingFieldsthree.push("Date");
    }

    if (salarySetUpForm.mode === "Manual" && formValue.gross === "") {
      newErrorsLog.grosssalary = (
        <Typography style={{ color: "red" }}>
          Please Enter Gross amount
        </Typography>
      );
    }

    setAccessibleErrors(newErrorsLog);

    // If there are missing fields, show an alert with the list of them
    if (missingFieldsthree.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p
            style={{ fontSize: "20px", fontWeight: 900 }}
          >{`Please fill in the following fields: ${missingFieldsthree.join(
            ", "
          )}`}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      if (
        Object.keys(newErrorsLog).length === 0 &&
        (bankTodo?.length === 0 ||
          (bankTodo?.length > 0 && areAllObjectsValid(bankTodo) && !exists))
      ) {
        handleSubmitMulti(e);
      }
    }
  };

  const ShiftModeOptions = [
    { label: "Shift", value: "Shift" },
    { label: "Week Off", value: "Week Off" },
  ];

  const [shifts, setShifts] = useState([]);

  const [todo, setTodo] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editTodoBackup, setEditTodoBackup] = useState(null);

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

  // const handleAddTodo = (value) => {
  //   if (value === "Standard") {
  //     setTodo([]);
  //   }
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
    if (employee.shifttype === "Please Select Shift Type") {
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
      if (employee.shifttype === "Daily") {
        if (employee.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (employee.shifttiming === "Please Select Shift") {
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
              ? employee.shiftgrouping
              : "",
            shifttiming: !valueCate.includes(day) ? employee.shifttiming : "",
          }));
          setTodo(newTodoList);
        }
      }

      if (employee.shifttype === "1 Week Rotation") {
        if (employee.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (employee.shifttiming === "Please Select Shift") {
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
                    ? employee.shiftgrouping
                    : "",
                  shifttiming: !valueCate.includes(day)
                    ? employee.shifttiming
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
                    ? employee.shiftgrouping
                    : "",
                  shifttiming: !valueCate.includes(day)
                    ? employee.shifttiming
                    : "",
                }))
              : []), // Return an empty array if "2nd Week" is not in valueCateWeeks
          ];

          setTodo((prev) => [...prev, ...newTodoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }

      if (employee.shifttype === "2 Week Rotation") {
        if (employee.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (employee.shifttiming === "Please Select Shift") {
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
                ? employee.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day) ? employee.shifttiming : "",
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

      if (employee.shifttype === "1 Month Rotation") {
        if (employee.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (employee.shifttiming === "Please Select Shift") {
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
                ? employee.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day) ? employee.shifttiming : "",
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

  const [step, setStep] = useState(1);
  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess, isUserRoleCompare } = useContext(
    UserRoleAccessContext
  );
  // for status
  const statusOptions = [
    { label: "Users Purpose", value: "Users Purpose" },
    { label: "Enquiry Only", value: "Enquiry Purpose" },
  ];
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
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    let showAlert = false;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const file = files[i];
      if (file.size > maxFileSize) {
        showAlert = true;
        continue; // Skip this file and continue with the next one
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFiles((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: fileNames === "Please Select File Name" ? "" : fileNames,
          },
        ]);
      };
    }
    setfileNames("Please Select File Name");
    if (showAlert) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"File size is greater than 1MB, please upload a file below 1MB."}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  const handleFileDelete = (index) => {
    setFiles((prevFiles) => prevFiles?.filter((_, i) => i !== index));
  };

  const handleRemarkChange = (index, remark) => {
    setFiles((prevFiles) =>
      prevFiles?.map((file, i) => (i === index ? { ...file, remark } : file))
    );
  };

  const [errmsg, setErrmsg] = useState("");
  const [status, setStatus] = useState("");

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [employee, setEmployee] = useState({
    wordcheck: false,
    autogeneratepassword: false,
    ifoffice: false,
    type: "Please Select Type",
    salaryrange: "Please Select Salary Range",
    prefix: "Mr",
    firstname: "",
    lastname: "",
    legalname: "",
    callingname: "",
    shifttype: "Please Select Shift Type",
    shiftmode: "Please Select Shift Mode",
    shiftgrouping: "Please Select Shift Grouping",
    shifttiming: "Please Select Shift",
    fathername: "",
    mothername: "",
    username: "",
    gender: "",
    maritalstatus: "",
    dom: "",
    dob: "",
    bloodgroup: "",
    profileimage: "",
    location: "",
    email: "",
    companyemail: "",
    contactpersonal: "",
    contactfamily: "",
    emergencyno: "",
    doj: "",
    dot: "",
    name: "",
    contactno: "",
    details: "",
    password: "",
    companyname: "",
    workstation: "",
    area: "",
    pdoorno: "",
    pstreet: "",
    parea: "",
    plandmark: "",
    ptaluk: "",
    ppincode: "",
    pcountry: "",
    pstate: "",
    pcity: "",
    ppost: "",
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
    floor: "",
    department: "",
    team: "",
    designation: "",
    employeecount: "",

    reportingto: "",
    empcode: "",
    remark: "",
    aadhar: "",
    panno: "",
    panstatus: "Have PAN",
    panrefno: "",
    draft: "",
    status: "",
    statuss: false,
    percentage: "",
    intStartDate: "",
    intCourse: "",
    intEndDate: "",
    modeOfInt: "",
    intDuration: "",
    bankname: "ICICI BANK - ICICI",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    weekoff: "",
    enquirystatus: "Please Select Status",
    workmode: "Internship",

    //newly added
    categoryedu: "Please Select Category",
    subcategoryedu: "Please Select Sub Category",
    specialization: "Please Select Specialization",
    accounttype: "Please Select Account Type",
    accountstatus: "In-Active",
    // starttime: currentDateTime.toTimeString().split(" ")[0],
    enddate: "present",
    endtime: "present",
    time: getCurrentTime(),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => event.preventDefault();

  // const generatePassword = () => {
  //   let autodate = employee.dob.split('-')
  //   let autodatetwo = `${autodate[2]}${autodate[1]}${autodate[0]}`
  //   const randomPassword = `${employee.legalname?.toLowerCase().slice(0, 6)}@${autodatetwo}`;
  //   setEmployee({ ...employee, password: randomPassword, autogeneratepassword: true });
  // };
  const generatePassword = () => {
    let autodate = employee.dob.split("-");
    let autodatetwo = `${autodate[2]}${autodate[1]}${autodate[0]}`;
    let legalNamePart = employee.legalname?.toLowerCase();
    if (legalNamePart.length > 6) {
      legalNamePart = legalNamePart.slice(0, 6);
    }
    const randomPassword = `${legalNamePart}@${autodatetwo}`;
    setEmployee({
      ...employee,
      password: randomPassword,
      autogeneratepassword: true,
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      generatePassword();
    } else {
      setEmployee({ ...employee, password: "", autogeneratepassword: false });
    }
  };

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

  const location = useLocation();
  const migrateData = location.state?.migrateData;
  const { from } = useParams();

  const [overallgrosstotal, setoverallgrosstotal] = useState("");
  const [modeexperience, setModeexperience] = useState("");
  const [targetexperience, setTargetexperience] = useState("");
  const [targetpts, setTargetpts] = useState("");

  const fetchUserDefaultDatas = async () => {
    let migeduall = [];
    let migworkll = [];
    let migallf = [];
    let migallfiles = [];
    try {
      let req = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const branchCode = req?.data?.branch?.filter(
        (item) => item.name == migrateData?.branch
      );
      setSelectedBranchCode(branchCode[0]?.code?.slice(0, 2));
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    } finally {
      setEmployee((prev) => ({
        ...prev,
        prefix: migrateData?.prefix,
        firstname: migrateData?.firstname?.toUpperCase(),
        lastname: migrateData?.lastname?.toUpperCase(),
        legalname: migrateData?.fullname,
        callingname: migrateData?.fullname,
        gender:
          migrateData?.gender === "Other" ? "Others" : migrateData?.gender,
        dob: moment(migrateData?.dateofbirth).format("YYYY-MM-DD"),
        age: calculateAge(migrateData?.dateofbirth),
        email: String(migrateData?.email),
        contactpersonal: String(migrateData?.mobile) ?? "",
        aadhar: String(migrateData?.adharnumber) ?? "",
        panno: String(migrateData?.pannumber) ?? "",
        panstatus: String(migrateData?.pannumber) ? "Have PAN" : "Yet to Apply",
        department: employee?.department ?? "",
      }));
      console.log(migrateData, "mig");
      migeduall = migrateData?.educationdetails?.map((data, index) => {
        return {
          ...data,
          categoryedu: data.categoryedu,
          subcategoryedu: data.subcategoryedu,
          specialization: data.specialization,
          institution: data.school,
          passedyear: data.fromduration + "-" + data.toduration,
          cgpa: 0,
        };
      });
      migworkll = migrateData?.experiencedetails?.map((data, index) => {
        return {
          ...data,
          empNameTodo: data.company,
          desigTodo: data.occupation,
          joindateTodo: data.fromduration,
          leavedateTodo: data.toduration,
          dutiesTodo: data.summary,
          reasonTodo: "",
        };
      });
      migallf = [...migrateData?.resumefile, ...migrateData?.candidatedatafile];
      migallfiles = migallf?.map((data, index) => {
        return {
          ...data,
          data: data.data,
          name: data.name,
          remark: data.candidatefilename ? data.candidatefilename : data.remark,
        };
      });
      setSelectedCompany(migrateData?.company);
      setSelectedBranch(migrateData?.branch);
      setSelectedUnit(migrateData?.unit);
      setSelectedTeam(migrateData?.team);
      setSelectedDesignation(employee?.designation);
      setIsValidEmail(true);
      setFirst(migrateData?.firstname.toLowerCase().split(" ").join(""));
      setSecond(migrateData?.lastname.toLowerCase().split(" ").join(""));
      setEduTodo(migeduall);
      setFiles(migallfiles);
      setWorkhistTodo(migworkll);
      setAssignExperience({
        ...assignExperience,
        assignExpMode: String(migrateData?.assignExpMode),
        assignExpvalue: String(migrateData?.assignExpvalue),
      });
      setLoginNotAllot({
        ...loginNotAllot,
        process: String(migrateData?.process),
      });
      setoverallgrosstotal(String(migrateData?.overallgrosstotal));
      setTargetpts(String(migrateData?.targetpts));
      setModeexperience(migrateData?.assignExpvalue);
      setTargetexperience(migrateData?.assignExpvalue);
    }
  };
  useEffect(() => {
    if (migrateData && from) {
      fetchUserDefaultDatas();
    }
  }, []);

  const [errors, setErrors] = useState({});
  const [errorsLog, setErrorsLog] = useState({});
  const [ShiftGroupingOptions, setShiftGroupingOptions] = useState([]);
  const ShiftTypeOptions = [
    { label: "Standard", value: "Standard" },
    { label: "Daily", value: "Daily" },
    { label: "1 Week Rotation (2 Weeks)", value: "1 Week Rotation" },
    { label: "2 Week Rotation (Monthly)", value: "2 Week Rotation" },
    { label: "1 Month Rotation (2 Month)", value: "1 Month Rotation" },
  ];

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);

  const fetchCategoryBased = async (e) => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.educationcategory.filter((data) => {
        return data.categoryname === e.value;
      });

      let get =
        data_set?.length > 0
          ? data_set[0].subcategoryname.map((data) => ({
              label: data,
              value: data,
            }))
          : [];

      setSubcategorys(get);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchCategoryEducation = async () => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_category.data.educationcategory.map(
        (d) => d.categoryname
      );
      let filter_opt = [...new Set(data_set)];

      setCategorys(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchEducation = async (e) => {
    try {
      let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res.data.educationspecilizations.filter((data) => {
        return (
          data.category.includes(employee.categoryedu) &&
          data.subcategory.includes(e.value)
        );
      });

      let result =
        data_set?.length > 0
          ? data_set[0].specilizationgrp.map((data) => ({
              label: data.label,
              value: data.label,
            }))
          : [];

      setEducationsOpt(result);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  // Country city state datas
  const [selectedCountryp, setSelectedCountryp] = useState(
    Country.getAllCountries().find((country) => country.name === "India")
  );
  const [selectedStatep, setSelectedStatep] = useState(
    State.getStatesOfCountry(selectedCountryp?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    )
  );
  const [selectedCityp, setSelectedCityp] = useState(
    City.getCitiesOfState(
      selectedStatep?.countryCode,
      selectedStatep?.isoCode
    ).find((city) => city.name === "Tiruchirappalli")
  );

  const [selectedCountryc, setSelectedCountryc] = useState(
    Country.getAllCountries().find((country) => country.name === "India")
  );
  const [selectedStatec, setSelectedStatec] = useState(
    State.getStatesOfCountry(selectedCountryc?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    )
  );
  const [selectedCityc, setSelectedCityc] = useState(
    City.getCitiesOfState(
      selectedStatec?.countryCode,
      selectedStatec?.isoCode
    ).find((city) => city.name === "Tiruchirappalli")
  );

  const [companies, setCompanies] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [floorNames, setFloorNames] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [department, setDepartment] = useState([]);
  const [team, setTeam] = useState([]);
  const [unitNames, setUnitNames] = useState([]);
  const [designation, setDesignation] = useState();
  const [name, setUserNameEmail] = useState("");
  const [month, setMonth] = useState("");
  const [email, setEmail] = useState("");
  const [message, setUserPassword] = useState("");
  const [userName, setUserName] = useState({
    fname: "",
    length: "",
  });
  const [empCode, setEmpCode] = useState([]);
  const [allUsersLoginName, setAllUsersLoginName] = useState([]);
  const [branchCodeGen, setBranchCodeGen] = useState("");
  const [isFormComplete, setIsFormComplete] = useState("incomplete");
  let sno = 1;

  const [errorstodo, setErrorstodo] = useState({});

  //ADDICTIONAL QUALIFICATION SECTION FUNCTIONALITY
  const [institution, setInstitution] = useState("");
  const [passedyear, setPassedyear] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [eduTodo, setEduTodo] = useState([]);

  const [addQual, setAddQual] = useState("");
  const [addInst, setAddInst] = useState("");
  const [duration, setDuration] = useState("");
  const [remarks, setRemarks] = useState("");
  const [addAddQuaTodo, setAddQuaTodo] = useState([]);

  const [empNameTodo, setEmpNameTodo] = useState("");
  const [desigTodo, setDesigTodo] = useState("");
  const [joindateTodo, setJoindateTodo] = useState("");
  const [leavedateTodo, setLeavedateTodo] = useState("");
  const [dutiesTodo, setDutiesTodo] = useState("");
  const [reasonTodo, setReasonTodo] = useState("");
  const [workhistTodo, setWorkhistTodo] = useState([]);
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  //crop image
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef(null);

  const [skillSet, setSkillSet] = useState("");

  const [getDepartment, setGetDepartment] = useState("Internship");
  const [modeInt, setModeInt] = useState("");
  const [internCourseNames, setInternCourseNames] = useState();
  const [internCodeGen, setInternCodeGen] = useState("");
  const [reportingtonames, setreportingtonames] = useState([]);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
  const [enableWorkstation, setEnableWorkstation] = useState(false);
  const [enableLoginName, setEnableLoginName] = useState(true);
  const [overllsettings, setOverallsettings] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [ismigrate, setIsmigrate] = useState("migrate");

  const getCode = (totalValue, code, experience, targetpoints) => {
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

    setModeexperience(experience);
    setTargetexperience(experience);
    handleCloseModEditAllot();
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
  });

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
  const [specificDates, setSpecificDates] = useState([]);

  const [expDateOptions, setExpDateOptions] = useState([]);

  useEffect(() => {
    let foundData = expDptDates.find(
      (item) =>
        item.department === employee.department &&
        new Date(employee?.doj) >= new Date(item.fromdate) &&
        new Date(employee?.doj) <= new Date(item.todate)
    );

    if (foundData) {
      let filteredDatas = expDptDates
        .filter(
          (d) =>
            d.department === employee.department &&
            new Date(d.fromdate) >= new Date(foundData.fromdate)
        )
        .map((data) => ({
          label: data.fromdate,
          value: data.fromdate,
        }));

      setExpDateOptions(filteredDatas);
    } else {
      console.log("No data found for the given conditions.");
    }
  }, [expDptDates, employee.department]);

  // Process allot add  details

  const [loginNotAllot, setLoginNotAllot] = useState({
    process: "Please Select Process",
    processtype: "Primary",
    processduration: "Full",
    time: "Hrs",
    timemins: "Mins",
  });

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
        company: selectedCompany,
        branch: selectedBranch,
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

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
    fetchShiftDropdowns();
  }, []);

  useEffect(() => {
    fetchSalarySlabs();
    fetchTargetpoints();
  }, [assignExperience, loginNotAllot.process]);

  useEffect(() => {
    processTeamDropdowns();
  }, [selectedTeam]);

  let today1 = new Date();
  var mm = String(today1.getMonth() + 1).padStart(2, "0");
  var yyyy = today1.getFullYear();
  let curMonStartDate = yyyy + "-" + mm + "-01";
  let findexp = monthSets.find(
    (d) =>
      d.department === employee.department &&
      new Date(employee?.doj) >= new Date(d.fromdate) &&
      new Date(employee?.doj) <= new Date(d.todate)
  );
  let findDate = findexp ? findexp.fromdate : curMonStartDate;

  const handleSalaryfix = (
    process,
    updatedate,
    doj,
    assignExpMode,
    assignExpvalue,
    assignEndExpvalue,
    assignEndExpDate,
    assignEndTarvalue,
    assignEndTarDate
  ) => {
    let modevalue =
      new Date(today1) > new Date(updatedate) &&
      ((assignExpMode === "Add" && assignExpvalue !== "") ||
        (assignExpMode === "Minus" && assignExpvalue !== "") ||
        (assignExpMode === "Fix" && assignExpvalue !== "") ||
        (assignEndExpvalue === "Yes" && assignEndExpDate !== "") ||
        assignEndTarvalue === "Yes" ||
        assignEndTarDate !== "");

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

    let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
    if (modevalue) {
      //findexp end difference yes/no
      if (assignEndExpvalue === "Yes") {
        differenceInMonthsexp = calculateMonthsBetweenDates(
          doj,
          assignEndExpDate
        );
        differenceInMonthsexp =
          differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
        if (assignExpMode === "Add") {
          differenceInMonthsexp += parseInt(assignExpvalue);
        } else if (assignExpMode === "Minus") {
          differenceInMonthsexp -= parseInt(assignExpvalue);
        } else if (assignExpMode === "Fix") {
          differenceInMonthsexp = parseInt(assignExpvalue);
        }
      } else {
        differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
        differenceInMonthsexp =
          differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;

        if (assignExpMode === "Add") {
          differenceInMonthsexp += parseInt(assignExpvalue);
        } else if (assignExpMode === "Minus") {
          differenceInMonthsexp -= parseInt(assignExpvalue);
        } else if (assignExpMode === "Fix") {
          differenceInMonthsexp = parseInt(assignExpvalue);
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
        }
      }

      //findtar end difference yes/no
      if (modevalue.endtar === "Yes") {
        differenceInMonthstar = calculateMonthsBetweenDates(
          doj,
          assignEndTarDate
        );
        differenceInMonthstar =
          differenceInMonthstar < 1 ? 0 : differenceInMonthstar;

        if (assignExpMode === "Add") {
          differenceInMonthstar += parseInt(assignExpvalue);
        } else if (assignExpMode === "Minus") {
          differenceInMonthstar -= parseInt(assignExpvalue);
        } else if (assignExpMode === "Fix") {
          differenceInMonthstar = parseInt(assignExpvalue);
        }
      } else {
        differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
        differenceInMonthstar =
          differenceInMonthstar < 1 ? 0 : differenceInMonthstar;

        if (assignExpMode === "Add") {
          differenceInMonthstar += parseInt(assignExpvalue);
        } else if (assignExpMode === "Minus") {
          differenceInMonthstar -= parseInt(assignExpvalue);
        } else if (assignExpMode === "Fix") {
          differenceInMonthstar = parseInt(assignExpvalue);
        } else {
          differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
        }
      }

      differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
      differenceInMonths = differenceInMonths < 1 ? 0 : differenceInMonths;

      if (assignExpMode === "Add") {
        differenceInMonths += parseInt(assignExpvalue);
      } else if (assignExpMode === "Minus") {
        differenceInMonths -= parseInt(assignExpvalue);
      } else if (assignExpMode === "Fix") {
        differenceInMonths = parseInt(assignExpvalue);
      } else {
        // differenceInMonths = parseInt(assignExpvalue);
        differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
      }
    } else {
      differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
      differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
      differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
    }

    let getprocessCode = process;

    let processexp = doj
      ? getprocessCode +
        (differenceInMonths < 1
          ? "00"
          : differenceInMonths <= 9
          ? `0${differenceInMonths}`
          : differenceInMonths)
      : "00";

    let findSalDetails = salSlabs.find(
      (d) =>
        d.company == selectedCompany &&
        d.branch == selectedBranch &&
        d.salarycode == processexp
    );

    let findSalDetailsTar = tarPoints.find(
      (d) =>
        d.branch === selectedBranch &&
        d.company === selectedCompany &&
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

    let Modeexp = doj ? (differenceInMonths > 0 ? differenceInMonths : 0) : "";
    let Tarexp = doj
      ? differenceInMonthstar > 0
        ? differenceInMonthstar
        : 0
      : "";
    setoverallgrosstotal(grosstotal);

    setModeexperience(Modeexp);
    setTargetexperience(Tarexp);
    setTargetpts(targetpoints);
  };

  //GET PROCESS CODE FUNCTION

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

  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos.length > 0
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

  const [empsettings, setEmpsettings] = useState(false);
  const [companyEmailDomain, setCompanyEmailDomain] = useState("");
  useEffect(() => {
    // Split the domain names into an array and trim any whitespace
    const domainsArray = companyEmailDomain
      ?.split(",")
      .map((domain) => domain.trim());

    let usernames = (
      enableLoginName ? String(third) : employee.username
    ).toLowerCase();
    // Check if the domainsArray has any domains
    const companyEmails =
      domainsArray.length > 0
        ? domainsArray.map((domain) => `${usernames}@${domain}`).join(",")
        : "";

    setEmployee({
      ...employee,
      companyemail: companyEmails,
    });
  }, [enableLoginName, third, employee.username]);
  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filter = res?.data?.overallsettings[0].todos.filter(
        (item) =>
          item.branch.includes(selectedBranch) &&
          item.company == selectedCompany
      );
      setOverallsettings(filter);
      setEmpsettings(res?.data?.overallsettings[0].empdigits);
      let lastObject =
        res?.data?.overallsettings[res?.data?.overallsettings?.length - 1];
      setCompanyEmailDomain(lastObject?.emaildomain || "");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //change form
  const handlechangepassedyear = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 4);
    if (regex.test(inputValue) || inputValue === "") {
      setPassedyear(inputValue);
    }
  };

  //change form
  const handlechangecgpa = (e) => {
    const regex = /^[0-9]*\.?[0-9]*$/; // Updated regular expression to accept decimal values
    const inputValue = e.target.value.slice(0, 5); // Adjusted slice limit to accommodate decimal point and one digit after it
    if (regex.test(inputValue) || inputValue === "") {
      setCgpa(inputValue);
    }
  };

  //change form
  const handlechangeppincode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, ppincode: inputValue });
    }
  };

  //change form
  const handlechangecpincode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, cpincode: inputValue });
    }
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  //Submit function for TODO Education
  const handleSubmittodo = (e) => {
    const errorstodo = {};
    const Nameismatch = eduTodo.some(
      (data, index) =>
        data.categoryedu == employee.categoryedu &&
        data.subcategoryedu == employee.subcategoryedu &&
        data.specialization == employee.specialization &&
        data.institution == institution &&
        data.passedyear == passedyear &&
        data.cgpa == cgpa
    );
    e.preventDefault();
    if (
      employee.categoryedu == "Please Select Category" ||
      employee.subcategoryedu == "Please Select Sub Category" ||
      employee.specialization == "Please Select Specialization" ||
      institution == "" ||
      passedyear == "" ||
      cgpa == ""
    ) {
      errorstodo.qualification = (
        <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
      );
      setErrorstodo(errorstodo);
    } else if (
      employee.categoryedu !== "Please Select Category" &&
      employee.subcategoryedu !== "Please Select Sub Category" &&
      employee.specialization !== "Please Select Specialization" &&
      institution !== "" &&
      passedyear !== "" &&
      passedyear?.length !== 4 &&
      cgpa !== ""
    ) {
      errorstodo.qualification = (
        <Typography style={{ color: "red" }}>
          Please Enter Valid Passed Year
        </Typography>
      );
      setErrorstodo(errorstodo);
    } else if (Nameismatch) {
      errorstodo.qualification = (
        <Typography style={{ color: "red" }}>Already Added!</Typography>
      );
      setErrorstodo(errorstodo);
    } else {
      setEduTodo([
        ...eduTodo,
        {
          categoryedu: employee.categoryedu,
          subcategoryedu: employee.subcategoryedu,
          specialization: employee.specialization,
          institution,
          passedyear,
          cgpa,
        },
      ]);
      setErrorstodo("");
      setEmployee((prev) => ({
        ...prev,
        categoryedu: "Please Select Category",
        subcategoryedu: "Please Select Sub Category",
        specialization: "Please Select Specialization",
      }));
      setInstitution("");
      setPassedyear("");
      setCgpa("");
      setSubcategorys([]);
      setEducationsOpt([]);
    }
  };

  //Delete for Education
  const handleDelete = (index) => {
    const newTodos = [...eduTodo];
    newTodos.splice(index, 1);
    setEduTodo(newTodos);
  };

  //Submit function for Additional Qualification
  const handleSubmitAddtodo = (e) => {
    const errorstodo = {};
    const Namematch = addAddQuaTodo.some(
      (data, index) =>
        data.addQual == addQual &&
        data.addInst == addInst &&
        data.duration == duration &&
        data.remarks == remarks
    );
    e.preventDefault();
    if (addQual == "" || addInst == "" || duration == "") {
      errorstodo.addQual = (
        <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
      );
      setErrorstodo(errorstodo);
    } else if (Namematch) {
      errorstodo.addQual = (
        <Typography style={{ color: "red" }}>Already Added!</Typography>
      );
      setErrorstodo(errorstodo);
    } else {
      setAddQuaTodo([
        ...addAddQuaTodo,
        { addQual, addInst, duration, remarks },
      ]);
      setErrorstodo("");
      setAddQual("");
      setAddInst("");
      setDuration("");
      setRemarks("");
    }
  };
  //Delete for Additional Qualification
  const handleAddDelete = (index) => {
    const newTodosed = [...addAddQuaTodo];
    newTodosed.splice(index, 1);
    setAddQuaTodo(newTodosed);
  };

  //Submit function for Work History
  const handleSubmitWorkSubmit = (e) => {
    e.preventDefault();

    const errorstodo = {};

    // Check if empNameTodo already exists in workhistTodo
    const isDuplicate = workhistTodo?.some(
      (entry) =>
        entry.empNameTodo?.toLowerCase() === empNameTodo?.toLowerCase() &&
        entry.desigTodo?.toLowerCase() === desigTodo?.toLowerCase() &&
        entry.joindateTodo === joindateTodo &&
        entry.leavedateTodo === leavedateTodo &&
        entry.reasonTodo?.toLowerCase() === reasonTodo?.toLowerCase()
    );

    // Check if all fields are filled
    if (
      empNameTodo === "" ||
      desigTodo === "" ||
      joindateTodo === "" ||
      leavedateTodo === "" ||
      dutiesTodo === "" ||
      reasonTodo === ""
    ) {
      errorstodo.empNameTodo = (
        <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
      );
    } else if (isDuplicate) {
      errorstodo.empNameTodo = (
        <Typography style={{ color: "red" }}>Already Added!</Typography>
      );
    }

    setErrorstodo(errorstodo);

    if (Object.keys(errorstodo)?.length === 0) {
      setWorkhistTodo([
        ...workhistTodo,
        {
          empNameTodo,
          desigTodo,
          joindateTodo,
          leavedateTodo,
          dutiesTodo,
          reasonTodo,
        },
      ]);
      setErrorstodo("");

      setEmpNameTodo("");
      setDesigTodo("");
      setJoindateTodo("");
      setLeavedateTodo("");
      setDutiesTodo("");
      setReasonTodo("");
    }
  };
  //Delete for Work History
  const handleWorkHisDelete = (index) => {
    const newWorkHisTodo = [...workhistTodo];
    newWorkHisTodo.splice(index, 1);
    setWorkhistTodo(newWorkHisTodo);
  };

  //month Calaculation
  const calMonth = () => {
    let date = new Date(employee?.doj).getTime();
    let calculatedMonth = Math.floor(
      (new Date().getTime() - date) / (1000 * 60 * 60 * 24 * 30.44)
    );
    setMonth(calculatedMonth > 0 ? calculatedMonth : 0);
  };

  // Unit Dropdowns
  const fetchUnitNames = async () => {
    try {
      let req = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUnitNames(req?.data?.units);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //SkillSet DropDowns

  const fetchSkillSet = async () => {
    try {
      let req = await axios.get(SERVICE.SKILLSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSkillSet(req?.data?.skillsets);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const usernameaddedby = isUserRoleAccess?.username;

  // Image Upload
  function handleChangeImage(e) {
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    if (e.target.files[0]?.size < maxFileSize) {
      let profileimage = document.getElementById("profileimage");
      var path = (window.URL || window.webkitURL).createObjectURL(
        profileimage.files[0]
      );
      toDataURL(path, function (dataUrl) {
        profileimage.setAttribute("value", String(dataUrl));
        setEmployee({ ...employee, profileimage: String(dataUrl) });
        return dataUrl;
      });
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"File size is greater than 1MB, please upload a file below 1MB."}
          </p>
        </>
      );
      handleClickOpenerr();
    }
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

  //image cropping
  const handleFileSelect = (acceptedFiles) => {
    setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
  };
  const handleCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
  };

  const handleClearImage = () => {
    setGetImg(null);
    setCroppedImage(null);
    setEmployee({ ...employee, profileimage: "" });
  };

  //ERROR MESSAGESE
  const ShowErrMess = () => {
    if (first.length == "" || second.length == 0) {
      setErrmsg("Unavailable");
    } else if (third.length >= 1) {
      setErrmsg("Available");
    }
  };
  const [lastWorkStationCode, setLastWorkStationCode] = useState(0);
  // get settings data
  const fetchUserDatas = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let ALLusers = req?.data?.users.filter((item) => {
        if (item?.workmode != "Internship" && item.branch == selectedBranch) {
          return item;
        }
      });
      setEmpCode(ALLusers);

      let lastwscode;
      let lastworkstation = req?.data?.users
        .filter(
          (item) =>
            // item?.workmode !== "Internship" &&
            item.company === selectedCompany &&
            item.branch === selectedBranch &&
            item.unit === selectedUnit
        )
        .filter((item) => /_[0-9]+_/.test(item?.workstationinput));
      // .filter((item) =>
      //   /^[A-Za-z0-9]{5}_\d{2}_[A-Za-z0-9]{6}$/.test(item?.workstationinput)
      // );

      if (lastworkstation.length === 0) {
        setLastWorkStationCode(0);
        lastwscode = 0;
      } else {
        let highestWorkstation = lastworkstation.reduce(
          (max, item) => {
            const num = parseInt(item.workstationinput.split("_")[1]);
            return num > max.num ? { num, item } : max;
          },
          { num: 0, item: null }
        ).num;

        setLastWorkStationCode(highestWorkstation.toString().padStart(2, "0"));
        lastwscode = highestWorkstation.toString().padStart(2, "0");
      }

      let autoWorkStation = `W${selectedBranchCode?.toUpperCase()}${selectedUnitCode?.toUpperCase()}_${
        lastwscode === 0
          ? "01"
          : (Number(lastwscode) + 1).toString().padStart(2, "0")
      }_${(enableLoginName
        ? String(third)
        : employee?.username
      )?.toUpperCase()}`;

      setPrimaryWorkStationInput(autoWorkStation);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [empcodelimitedAll, setEmpCodeLimitedAll] = useState([]);
  // get settings data
  const fetchUserDatasLimitedEmpcodeCreate = async () => {
    try {
      let req = await axios.post(SERVICE.USERS_LIMITED_EMPCODE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: selectedBranch,
      });

      let ALLusers = req?.data?.userscreate;
      const lastThreeDigitsArray = ALLusers.map((employee) =>
        employee.empcode.slice(-3)
      );
      setEmpCodeLimited(lastThreeDigitsArray);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchUserDatasLimitedEmpcodeAll = async () => {
    try {
      let req = await axios.post(SERVICE.USERS_LIMITED_EMPCODE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: "",
      });

      let ALLusers = req?.data?.users;

      const allDigitsArray = ALLusers?.filter(
        (data) => data?.empcode !== ""
      )?.map((employee) => employee?.empcode);

      setEmpCodeLimitedAll(allDigitsArray);

      // setEmpCode(ALLusers);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //getting branch code autogenarate function prefix
  const fetchInternCode = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let branchcode = req.data.users?.filter((data) => {
        if (data?.workmode == "Internship" && data?.wordcheck == false) {
          return data;
        }
      });
      setInternCodeGen(branchcode);
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

  //change form
  const handlechangecontactpersonal = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, contactpersonal: inputValue });
    }
  };

  const handlechangecontactfamily = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, contactfamily: inputValue });
    }
  };

  const handlechangeemergencyno = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, emergencyno: inputValue });
    }
  };

  const handlechangeaadhar = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 12);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, aadhar: inputValue });
    }
  };
  const [referenceTodoError, setReferenceTodoError] = useState({});
  const [referenceTodo, setReferenceTodo] = useState([]);
  const [singleReferenceTodo, setSingleReferenceTodo] = useState({
    name: "",
    relationship: "",
    occupation: "",
    contact: "",
    details: "",
  });

  const addReferenceTodoFunction = () => {
    const isNameMatch = referenceTodo?.some(
      (item) => item.name === singleReferenceTodo.name
    );
    const newErrorsLog = {};

    if (singleReferenceTodo.name === "") {
      newErrorsLog.name = (
        <Typography style={{ color: "red" }}>Name must be required</Typography>
      );
    } else if (isNameMatch) {
      newErrorsLog.duplicate = (
        <Typography style={{ color: "red" }}>
          Reference Already Exist!
        </Typography>
      );
    }

    if (
      singleReferenceTodo.contact !== "" &&
      singleReferenceTodo.contact?.length !== 10
    ) {
      newErrorsLog.contactno = (
        <Typography style={{ color: "red" }}>
          Contack No must be 10 digits required
        </Typography>
      );
    }
    if (singleReferenceTodo !== "" && Object.keys(newErrorsLog).length === 0) {
      setReferenceTodo([...referenceTodo, singleReferenceTodo]);
      setSingleReferenceTodo({
        name: "",
        relationship: "",
        occupation: "",
        contact: "",
        details: "",
      });
    }
    setReferenceTodoError(newErrorsLog);
  };
  const deleteReferenceTodo = (index) => {
    const newTasks = [...referenceTodo];
    newTasks.splice(index, 1);
    setReferenceTodo(newTasks);
    // handleCloseMod();
  };

  const handlechangereferencecontactno = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value?.slice(0, 10);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      setSingleReferenceTodo({ ...singleReferenceTodo, contact: inputValue });
    }
  };

  // auto id for employee code
  let date = employee?.doj?.split("-") ?? [];
  let dateJoin = "";

  if (date.length === 3) {
    let year = date[0] ? date[0].slice(-2) : "";
    let month = date[1] ?? "";
    let day = date[2] ?? "";
    dateJoin = year + month + day;
  } else {
    dateJoin = "";
  }

  let newval =
    empsettings === true && overllsettings.length > 0
      ? branchCodeGen.toUpperCase() +
        dateJoin +
        overllsettings[0]?.empcodedigits
      : branchCodeGen.toUpperCase() + dateJoin + "001";

  let lastEmpCode;

  const currDate = new Date();
  var currDay = String(currDate.getDate()).padStart(2, "0");
  var currMonth = String(currDate.getMonth() + 1).padStart(2, "0");
  const currYear = currDate.getFullYear().toString().slice(2, 5);
  // let newval1 = "HIAIPUT-23076";
  let newval1 = `${selectedBranchCode.toString()}INT${dateJoin}0001`;

  if (getDepartment == "Internship") {
    internCodeGen &&
      internCodeGen.forEach(() => {
        let strings = `${selectedBranchCode.toString()}INT${dateJoin}`;

        let refNo = internCodeGen[internCodeGen.length - 1]?.empcode;
        lastEmpCode =
          internCodeGen[internCodeGen.length - 1]?.empcode.slice(-3);
        let digits = (internCodeGen.length + 1).toString();
        const stringLength = refNo.length;
        let lastChar = refNo.charAt(stringLength - 1);
        let getlastBeforeChar = refNo.charAt(stringLength - 2);
        let getlastThreeChar = refNo.charAt(stringLength - 3);
        let lastBeforeChar = refNo.slice(-2);
        let lastThreeChar = refNo.slice(-3);
        let lastDigit = refNo.slice(-4);
        let refNOINC = parseInt(lastChar) + 1;
        let refLstTwo = parseInt(lastBeforeChar) + 1;
        let refLstThree = parseInt(lastThreeChar) + 1;
        let refLstDigit = parseInt(lastDigit) + 1;
        if (
          digits.length < 4 &&
          getlastBeforeChar == 0 &&
          getlastThreeChar == 0
        ) {
          refNOINC = ("000" + refNOINC).substr(-4);
          newval1 = strings + refNOINC;
        } else if (
          digits.length < 4 &&
          getlastBeforeChar > 0 &&
          getlastThreeChar == 0
        ) {
          refNOINC = ("00" + refLstTwo).substr(-4);
          newval1 = strings + refNOINC;
        } else if (digits.length < 4 && getlastThreeChar > 0) {
          refNOINC = ("0" + refLstThree).substr(-4);
          newval1 = strings + refNOINC;
        } else {
          refNOINC = refLstDigit.substr(-4);
          newval1 = strings + refNOINC;
        }
      });
  } else if (empCode.length > 0) {
    empCode &&
      empCode.forEach(() => {
        //   const result = empCode.reduce((maxEmployee, currentEmployee) => {
        //     const lastThreeDigitsMax = parseInt(maxEmployee.empcode.slice(-3));
        //     const lastThreeDigitsCurrent = parseInt(currentEmployee.empcode.slice(-3));
        //     return lastThreeDigitsMax > lastThreeDigitsCurrent ? maxEmployee : currentEmployee;
        //   }, empCode[0]);
        const numericEmpCode = empCode.filter(
          (employee) => !isNaN(parseInt(employee.empcode.slice(-3)))
        );

        const result = numericEmpCode.reduce((maxEmployee, currentEmployee) => {
          const lastThreeDigitsMax = parseInt(maxEmployee?.empcode.slice(-3));
          const lastThreeDigitsCurrent = parseInt(
            currentEmployee?.empcode?.slice(-3)
          );
          return lastThreeDigitsMax > lastThreeDigitsCurrent
            ? maxEmployee
            : currentEmployee;
        }, numericEmpCode[0]);

        let strings = branchCodeGen?.toUpperCase() + dateJoin;
        let refNoold = result?.empcode;

        let refNo =
          overllsettings?.length > 0 &&
          empsettings === true &&
          Number(overllsettings[0]?.empcodedigits) >
            Number(result?.empcode.slice(-3))
            ? branchCodeGen.toUpperCase() +
              dateJoin +
              Number(overllsettings[0]?.empcodedigits - 1)
            : refNoold;
        let digits = (empCode.length + 1).toString();
        const stringLength = refNo?.length;
        let getlastBeforeChar = refNo?.charAt(stringLength - 2);
        let getlastThreeChar = refNo?.charAt(stringLength - 3);
        let lastChar = refNo?.slice(-1);
        let lastBeforeChar = refNo?.slice(-2);
        let lastDigit = refNo?.slice(-3);
        let refNOINC = parseInt(lastChar) + 1;
        let refLstTwo = parseInt(lastBeforeChar) + 1;
        let refLstDigit = parseInt(lastDigit) + 1;
        if (
          digits.length < 4 &&
          getlastBeforeChar === "0" &&
          getlastThreeChar === "0"
        ) {
          refNOINC = "00" + refNOINC;
          newval = strings + refNOINC;
        } else if (
          digits.length < 4 &&
          getlastThreeChar === "0" &&
          getlastBeforeChar > "0"
        ) {
          refNOINC = "0" + refLstTwo;
          newval = strings + refNOINC;
        } else {
          refNOINC = refLstDigit;
          newval = strings + refNOINC;
        }
      });
  } else if (
    empCode?.length === 0 &&
    overllsettings?.length > 0 &&
    empsettings === true
  ) {
    newval =
      branchCodeGen?.toUpperCase() +
      dateJoin +
      overllsettings[0]?.empcodedigits;
  } else if (empCode?.length === 0 && overllsettings?.length == 0) {
    // Handle any other conditions or set a default value for newval

    newval = branchCodeGen?.toUpperCase() + dateJoin + "001";
  }

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const fetchBranchCode = async () => {
    try {
      var response = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let branchcode =
        response.data.branch.length > 0 &&
        response.data.branch.filter((data) => {
          if (selectedBranch === data?.name) {
            setBranchCodeGen(data?.code);
          }
        });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Branch Dropdowns
  const fetchbranchNames = async () => {
    try {
      let req = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBranchNames(req?.data?.branch);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Floor Dropdowns
  const fetchfloorNames = async () => {
    try {
      let req = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFloorNames(req?.data?.floors);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchareaNames = async (e) => {
    try {
      let req = await axios.post(SERVICE.MANPOWERAREAFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(selectedCompany),
        floor: String(e),
        branch: String(selectedBranch),
      });

      let result = req?.data?.allareas
        ?.map((item) => {
          return item.area.map((data) => {
            return data;
          });
        })
        .flat();

      setAreaNames(result);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Departments Dropdowns
  const fetchDepartments = async () => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartment(req?.data?.departmentdetails);
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
      setInternCourseNames(req?.data?.internCourses);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Team Dropdowns
  const fetchteamdropdowns = async () => {
    try {
      let req = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeam(req?.data?.teamsdetails);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Designation Dropdowns
  const fetchDptDesignation = async (value) => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENTANDDESIGNATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = req?.data?.departmentanddesignationgroupings.filter(
        (data, index) => {
          return value === data.department;
        }
      );

      setDesignation(result);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [designationsFileNames, setDesignationsFileNames] = useState([]);
  const [fileNames, setfileNames] = useState("Please Select File Name");

  //get all Areas.
  const fetchCandidatedocumentdropdowns = async (name) => {
    try {
      let res_candidate = await axios.get(SERVICE.CANDIDATEDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_candidate.data.candidatedocuments.filter(
        (data) => data.designation === name
      );

      const desigall = [
        ...data_set.map((d) => ({
          ...d,
          label: d.candidatefilename,
          value: d.candidatefilename,
        })),
      ];

      setDesignationsFileNames([
        ...desigall,
        { label: "Other", value: "Other" },
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Designation Dropdowns
  const fetchDesignation = async () => {
    try {
      let req = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignation(req?.data?.designation);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [shifttiming, setShiftTiming] = useState();

  // Shift Dropdowns
  const fetchShiftDropdowns = async () => {
    try {
      let req = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftTiming(req?.data?.shifts);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
        if (first + second === data.username) {
          setThird(
            first +
              second.slice(0, 1) +
              new Date(employee.dob ? employee.dob : "").getDate()
          );
          setUserNameEmail(
            first +
              second.slice(0, 1) +
              new Date(employee.dob ? employee.dob : "").getDate()
          );
        } else if (
          first + second + new Date(employee.dob).getDate() ==
          data.username
        ) {
          setThird(
            first +
              second.slice(0, 1) +
              new Date(employee.dob ? employee.dob : "").getMonth()
          );
          setUserNameEmail(
            first +
              second.slice(0, 1) +
              new Date(employee.dob ? employee.dob : "").getMonth()
          );
        } else if (first + second.slice(0, 1) === data.username) {
          setThird(first + second.slice(0, 2));
          setUserNameEmail(first + second.slice(0, 2));
        } else if (first + second.slice(0, 2) === data.username) {
          setThird(first + second.slice(0, 3));
          setUserNameEmail(first + second.slice(0, 3));
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
  //fetching companies
  const fetchCompanies = async () => {
    try {
      let productlist = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompanies(productlist?.data?.companies);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const backPage = useNavigate();

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };
  // let capture = isWebcamCapture === true ? getImg : croppedImage;

  // let capture = isWebcamCapture == true ? getImg : croppedImage ;
  // let final = capture ? capture : empaddform.profileimage;

  const handleCompanyChange = (event) => {
    const selectedCompany = event.value;
    setSelectedCompany(selectedCompany);
    setSelectedBranch("");
    setSelectedUnit("");
    setSelectedTeam("");
    setSelectedWorkStation("");
    setAreaNames([]);
    setEmployee({ ...employee, floor: "", area: "" });
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);
    setAccessible({
      ...accessible,
      company: selectedCompany,
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      companycode: event.code,
      branchcode: "",
      unitcode: "",
      branchemail: "",
      branchaddress: "",
      branchstate: "",
      branchcity: "",
      branchcountry: "",
      branchpincode: "",
    });
  };

  const handleBranchChange = (event) => {
    const selectedBranch = event.value;
    const branchCode = filteredBranches.filter(
      (item) => item.name === event.value
    );
    setSelectedBranchCode(branchCode[0]?.code.slice(0, 2));
    // Now you have both the name and code, you can use them as needed
    setSelectedBranchstatus(!selectedBranchstatus);
    setSelectedBranch(selectedBranch);
    setSelectedUnit("");
    setSelectedTeam("");
    setSelectedWorkStation("");
    setAreaNames([]);
    setEmployee({ ...employee, floor: "", area: "" });
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);
    setAccessible({
      ...accessible,
      branch: selectedBranch,
      unit: "Please Select Unit",
      branchcode: event.code,
      branchemail: event.email,
      branchaddress: event.address,
      branchstate: event.state,
      branchcity: event.city,
      branchcountry: event.country,
      branchpincode: event.pincode,
      unitcode: "",
    });
  };

  const handleUnitChange = (event) => {
    const selectedUnit = event.value;
    const unitCode = filteredUnits.filter((item) => item.name === event.value);
    setSelectedUnitCode(unitCode[0]?.code.slice(0, 2));

    setSelectedUnit(selectedUnit);
    setSelectedTeam("");
    setSelectedWorkStation("");
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);
    setAccessible({
      ...accessible,
      unit: selectedUnit,
      unitcode: event.code,
    });
  };

  const handleTeamChange = (event) => {
    const selectedTeam = event.value;
    handleSalaryfix(
      loginNotAllot.process,
      assignExperience.updatedate,
      employee?.doj,
      assignExperience.assignExpMode,
      assignExperience.assignExpvalue,

      assignExperience.assignEndExpvalue,
      assignExperience.assignEndExpDate,
      assignExperience.assignEndTarvalue,
      assignExperience.assignEndTarDate
      //  assignExperience.assignEndTar
    );
    setSelectedTeam(selectedTeam);
    // setLoginNotAllot({
    //   ...loginNotAllot,
    //   process: "Please Select Process",
    // });

    // setAssignExperience({
    //   ...assignExperience,
    //   assignExpMode: "Auto Increment",
    // });
    fetchSuperVisorDropdowns(selectedTeam);
    setEmployee((prev) => ({
      ...prev,
      reportingto: "",
    }));
  };

  const [roles, setRoles] = useState([]);

  const fetchDesignationgroup = async (e) => {
    try {
      let res_designationgroup = await axios.get(SERVICE.DESIGNATIONGRP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_designation = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getGroupName = res_designation?.data?.designation
        .filter((data) => {
          return data.name === e.value;
        })
        .map((item) => item.group);

      let getRoles = res_designationgroup?.data?.desiggroup
        ?.filter((data) => {
          return getGroupName.includes(data.name);
        })
        .flatMap((data) => data.roles);

      let uniqueRoles = [...new Set(getRoles)];
      setRoles(uniqueRoles);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleDesignationChange = (event) => {
    const selectedDesignation = event.value;
    setSelectedDesignation(selectedDesignation);
    fetchDesignationgroup(event);
    fetchCandidatedocumentdropdowns(selectedDesignation);
    setEmployee((prev) => ({
      ...prev,
      employeecount: event?.systemcount ?? "",
    }));
  };

  const filteredBranches = branchNames?.filter(
    (b) => b.company === selectedCompany
  );

  const filteredUnits = unitNames?.filter((u) => u.branch === selectedBranch);

  const filteredTeams = team?.filter(
    (t) =>
      t.unit === selectedUnit &&
      t.branch === selectedBranch &&
      t.department === employee.department
  );

  const filteredDesignation = designation?.filter(
    (d) => d.branch === selectedBranch
  );
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Please Select Primary Work Station"
  );

  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");

  useEffect(() => {
    var filteredWorks;
    if (selectedUnit === "" && employee.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) => u.company === selectedCompany && u.branch === selectedBranch
      );
    } else if (selectedUnit === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === selectedCompany &&
          u.branch === selectedBranch &&
          u.floor === employee.floor
      );
    } else if (employee.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === selectedCompany &&
          u.branch === selectedBranch &&
          u.unit === selectedUnit
      );
    } else {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === selectedCompany &&
          u.branch === selectedBranch &&
          u.unit === selectedUnit &&
          u.floor === employee.floor
      );
    }
    // const result = filteredWorks.flatMap((item) => {
    //   return item.combinstation.flatMap((combinstationItem) => {
    //     return combinstationItem.subTodos.length > 0
    //       ? combinstationItem.subTodos.map((subTodo) => subTodo.subcabinname)
    //       : [combinstationItem.cabinname];
    //   });
    // });
    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos.length > 0
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
  }, [selectedCompany, selectedBranch, selectedUnit, employee.floor]);

  // company multi select
  const handleEmployeesChange = (options) => {
    setValueWorkStation(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsWorkStation(options);
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
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  useEffect(() => {
    fetchCompanies();
    // fetchRoleDropdown();
    fetchfloorNames();
    fetchDepartments();
    ShiftDropdwonsSecond();
    ShiftGroupingDropdwons();
    fetchteamdropdowns();
    fetchInternCourses();
    fetchDesignation();
    fetchSkillSet();
    fetchbranchNames();
    fetchUnitNames();
    fetchWorkStation();
    fetchUserDatasLimitedEmpcodeCreate();
    fetchUserDatasLimitedEmpcodeAll();
    fetchDepartmentMonthsets();
  }, []);

  useEffect(() => {
    fetchInternCode();
    fetchUserName();
    calMonth();
    fetchUserDatas();
    fetchCategoryEducation();
    fetchOverAllSettings();
  }, []);

  useEffect(() => {
    fetchUserDatasLimitedEmpcodeCreate();
    fetchUserDatas();
  }, [selectedBranch, selectedBranchstatus, selectedUnit]);

  useEffect(() => {
    calMonth();
  }, [employee?.doj]);

  useEffect(() => {
    fetchBranchCode();
  }, [selectedBranch]);

  useEffect(() => {
    ShowErrMess();
    fetchUserName();
    setThird(first + second.slice(0, 1));
    setUserNameEmail(first + second.slice(0, 1));
  }, [first, second, name]);

  // let companycaps =
  //   employee.firstname.toUpperCase() + "." + employee.lastname.toUpperCase();
  // pecentage completion
  const [companycaps, setcompanycaps] = useState("");

  function checkFormCompletion() {
    if (
      third !== "" &&
      employee.password !== "" &&
      employee.firstname !== "" &&
      employee.lastname !== "" &&
      employee.legalname !== "" &&
      employee.callingname !== "" &&
      employee.fathername !== "" &&
      employee.mothername !== "" &&
      employee.gender !== "" &&
      employee.maritalstatus !== "" &&
      employee.maritalstatus === "Married" &&
      employee.dom !== "" &&
      employee.dob !== "" &&
      employee.bloodgroup !== "" &&
      croppedImage !== "" &&
      employee.location !== "" &&
      employee.email !== "" &&
      employee.companyemail !== "" &&
      employee.contactpersonal !== "" &&
      employee.contactfamily !== "" &&
      employee.emergencyno !== "" &&
      employee?.doj !== "" &&
      employee.dot !== "" &&
      employee.contactno !== "" &&
      employee.details !== "" &&
      selectedCompany !== "" &&
      employee.pdoorno !== "" &&
      employee.pstreet !== "" &&
      employee.parea !== "" &&
      employee.plandmark !== "" &&
      employee.ptaluk !== "" &&
      employee.ppincode !== "" &&
      selectedCountryp.name !== "" &&
      selectedStatep.name !== "" &&
      selectedCityp.name !== "" &&
      (!employee.samesprmnt ? employee.cdoorno : employee.pdoorno !== "") &&
      (!employee.samesprmnt ? employee.cstreet : employee.pstreet !== "") &&
      (!employee.samesprmnt ? employee.carea : employee.parea !== "") &&
      (!employee.samesprmnt ? employee.clandmark : employee.plandmark !== "") &&
      (!employee.samesprmnt ? employee.ctaluk : employee.ptaluk !== "") &&
      (!employee.samesprmnt ? employee.cpost : employee.ppost !== "") &&
      (!employee.samesprmnt ? employee.cpincode : employee.ppincode !== "") &&
      (!employee.samesprmnt
        ? selectedCountryc.name
        : selectedCountryp.name !== "") &&
      (!employee.samesprmnt
        ? selectedStatec.name
        : selectedStatep.name !== "") &&
      (!employee.samesprmnt ? selectedCityp.name : selectedCityc.name !== "") &&
      selectedBranch !== "" &&
      // selectedWorkStation !== "" &&
      selectedOptionsWorkStation.length > 0 &&
      employee.floor !== "" &&
      employee.department !== "" &&
      selectedTeam !== "" &&
      employee.designation !== "" &&
      employee.employeecount !== "" &&
      employee.shifttiming !== "" &&
      employee.reportingto !== "" &&
      newval !== "" &&
      files.length > 0 &&
      employee.prefix !== "" &&
      employee.ppost !== "" &&
      companycaps !== "" &&
      addAddQuaTodo.length > 0 &&
      eduTodo.length > 0 &&
      workhistTodo.length > 0 &&
      employee.aadhar !== "" &&
      employee.panno !== "" &&
      selectedUnit !== ""
    ) {
      setIsFormComplete("complete");
    } else {
      setIsFormComplete("incomplete");
    }
  }

  let conditions = [
    third !== "",
    employee.password !== "",
    employee.firstname !== "",
    employee.lastname !== "",
    employee.legalname !== "",
    employee.callingname !== "",
    employee.fathername !== "",
    employee.mothername !== "",
    employee.gender !== "",
    employee.maritalstatus !== "",
    employee.maritalstatus === "Married" &&
      employee.dom !== "" &&
      employee.dob !== "",
    employee.bloodgroup !== "",
    employee.profileimage !== "",
    employee.location !== "",
    employee.email !== "",
    employee.companyemail !== "",
    employee.contactpersonal !== "",
    employee.contactfamily !== "",
    employee.emergencyno !== "",
    employee?.doj !== "",
    employee.dot !== "",
    employee.contactno !== "",
    employee.details !== "",
    selectedCompany !== "",
    employee.pdoorno !== "",
    employee.pstreet !== "",
    employee.parea !== "",
    employee.plandmark !== "",
    employee.ptaluk !== "",
    employee.ppincode !== "",
    employee.ppost !== "",
    selectedCountryp.name !== "",
    selectedStatep.name !== "",
    selectedCityp.name !== "",
    !employee.samesprmnt ? employee.cdoorno : employee.pdoorno !== "",
    !employee.samesprmnt ? employee.cstreet : employee.pstreet !== "",
    !employee.samesprmnt ? employee.carea : employee.parea !== "",
    !employee.samesprmnt ? employee.clandmark : employee.plandmark !== "",
    !employee.samesprmnt ? employee.ctaluk : employee.ptaluk !== "",
    !employee.samesprmnt ? employee.cpost : employee.ppost !== "",
    !employee.samesprmnt ? employee.cpincode : employee.ppincode !== "",
    !employee.samesprmnt ? selectedCountryc.name : selectedCountryp.name !== "",
    !employee.samesprmnt ? selectedStatec.name : selectedStatep.name !== "",
    !employee.samesprmnt ? selectedCityc.name : selectedCityp.name !== "",
    selectedBranch !== "",
    // selectedWorkStation !== "",
    selectedOptionsWorkStation.length > 0,
    employee.floor !== "",
    employee.department !== "",
    selectedTeam !== "",
    employee.designation !== "",
    employee.employeecount !== "",
    employee.shifttiming !== "",
    employee.reportingto !== "",
    newval !== "",
    files.length > 0,
    employee.prefix !== "",

    companycaps !== "",
    addAddQuaTodo.length > 0,
    eduTodo.length > 0,
    workhistTodo.length > 0,
    employee.aadhar !== "",
    employee.panno !== "",
    selectedUnit !== "",
  ];

  const result = conditions.reduce(
    (acc, val) => {
      acc[val]++;
      return acc;
    },
    { true: 0, false: 0 }
  );

  const totalFields = 60;
  const filledFields = Object.values(employee).filter(
    (value) => value !== ""
  ).length;

  const completionPercentage = (result.true / totalFields) * 100;

  useEffect(() => {
    checkFormCompletion();
  }, []);

  const [nextBtnLoading, setNextBtnLoading] = useState(false);

  function AadharValidate(aadhar) {
    var adharcardTwelveDigit = /^\d{12}$/;
    var adharSixteenDigit = /^\d{16}$/;

    if (aadhar !== "" && aadhar !== undefined) {
      if (
        aadhar?.match(adharcardTwelveDigit) ||
        aadhar?.match(adharSixteenDigit)
      ) {
        if (aadhar[0] !== "0" && aadhar[0] !== "1") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function PanValidate(pan) {
    let panregex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (pan !== "") {
      if (pan?.match(panregex)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const draftduplicateCheck = async () => {
    try {
      const newErrors = {};
      const missingFields = [];

      // Check the validity of field1

      if (!employee.firstname) {
        newErrors.firstname = (
          <Typography style={{ color: "red" }}>
            First name must be required
          </Typography>
        );
        missingFields.push("First Name");
      }

      if (!employee.lastname) {
        newErrors.lastname = (
          <Typography style={{ color: "red" }}>
            {" "}
            Last Name be required{" "}
          </Typography>
        );
      } else if (employee.lastname.length < 3) {
        newErrors.lastname = (
          <Typography style={{ color: "red" }}>
            {" "}
            Last Name must be 3 characters!{" "}
          </Typography>
        );
        missingFields.push("Last Name");
      }

      // if (employeenameduplicate && employee.firstname && employee.lastname) {
      //   newErrors.duplicatefirstandlastname = (
      //     <Typography style={{ color: "red" }}>
      //       First name and Last name already exist
      //     </Typography>
      //   );
      // }

      if (!employee.legalname) {
        newErrors.legalname = (
          <Typography style={{ color: "red" }}>
            Legal name must be required
          </Typography>
        );
        missingFields.push("Legal Name");
      }
      if (!employee.callingname) {
        newErrors.callingname = (
          <Typography style={{ color: "red" }}>
            Calling Name must be required
          </Typography>
        );
        missingFields.push("Calling Name");
      }
      if (
        employee.callingname !== "" &&
        employee.legalname !== "" &&
        employee.callingname?.toLowerCase() ===
          employee.legalname?.toLowerCase()
      ) {
        newErrors.callingname = (
          <Typography style={{ color: "red" }}>
            Legal Name and Calling Name can't be same
          </Typography>
        );
        missingFields.push("Legal Name and Calling Name can't be same");
      }

      if (!employee.email) {
        newErrors.email = (
          <Typography style={{ color: "red" }}>
            Email must be required
          </Typography>
        );
        missingFields.push("Email");
      } else if (!isValidEmail) {
        newErrors.email = (
          <Typography style={{ color: "red" }}>
            Please enter valid email
          </Typography>
        );
        missingFields.push("Enter valid Email");
      }

      if (!employee.emergencyno) {
        newErrors.emergencyno = (
          <Typography style={{ color: "red" }}>
            Emergency no must be required
          </Typography>
        );
        missingFields.push("Emergency No");
      } else if (employee.emergencyno.length !== 10) {
        newErrors.emergencyno = (
          <Typography style={{ color: "red" }}>
            Emergency no must be 10 digits required
          </Typography>
        );
        missingFields.push("Enter valid Emergency No");
      }
      if (employee.maritalstatus === "Married" && !employee.dom) {
        newErrors.dom = (
          <Typography style={{ color: "red" }}>DOM must be required</Typography>
        );
        missingFields.push("Date of Marriage ");
      }
      if (employee.contactfamily === "") {
        newErrors.contactfamily = (
          <Typography style={{ color: "red" }}>
            Contact(Family) no must be required
          </Typography>
        );
        missingFields.push("Contact(Family)");
      }
      if (
        employee.contactfamily !== "" &&
        employee.contactfamily.length !== 10
      ) {
        newErrors.contactfamily = (
          <Typography style={{ color: "red" }}>
            Contact(Family) no must be 10 digits required
          </Typography>
        );
        missingFields.push("Enter valid Contact(Family) No");
      }
      if (employee.contactpersonal === "") {
        newErrors.contactpersonal = (
          <Typography style={{ color: "red" }}>
            Contact(personal) no must be required
          </Typography>
        );
        missingFields.push("Contact(personal)");
      }
      if (
        employee.contactpersonal !== "" &&
        employee.contactpersonal.length !== 10
      ) {
        newErrors.contactpersonal = (
          <Typography style={{ color: "red" }}>
            Contact(personal) no must be 10 digits required
          </Typography>
        );
        missingFields.push("Enter valid Contact(personal)");
      }

      if (employee?.panno !== "" && employee?.panno?.length !== 10) {
        newErrors.panno = (
          <Typography style={{ color: "red" }}>
            PAN No must be 10 digits required
          </Typography>
        );
        missingFields.push("PAN No");
      }

      if (employee?.panno === "" && employee?.panstatus === "Have PAN") {
        newErrors.panno = (
          <Typography style={{ color: "red" }}>
            PAN No must be required
          </Typography>
        );
        missingFields.push("PAN Card Status");
      } else if (
        !PanValidate(employee?.panno) &&
        employee?.panstatus === "Have PAN"
      ) {
        newErrors.panno = (
          <Typography style={{ color: "red" }}>
            Please Enter Valid PAN Number
          </Typography>
        );
        missingFields.push("Enter valid PAN No");
      }

      if (employee?.panrefno === "" && employee?.panstatus === "Applied") {
        newErrors.panrefno = (
          <Typography style={{ color: "red" }}>
            Application Reference No must be required
          </Typography>
        );
        missingFields.push("Enter valid Application Reference");
      }

      if (!employee.dob) {
        newErrors.dob = (
          <Typography style={{ color: "red" }}>DOB must be required</Typography>
        );
        missingFields.push("Date of Birth");
      }

      if (!employee?.aadhar) {
        newErrors.aadhar = (
          <Typography style={{ color: "red" }}>
            {" "}
            Aadhar must be required{" "}
          </Typography>
        );
        missingFields.push("Aadhar No");
      } else if (employee?.aadhar?.length < 12) {
        newErrors.aadhar = (
          <Typography style={{ color: "red" }}>
            {" "}
            Please Enter valid Aadhar Number{" "}
          </Typography>
        );
        missingFields.push("Enter valid Aadhar No");
      } else if (!AadharValidate(employee?.aadhar)) {
        newErrors.aadhar = (
          <Typography style={{ color: "red" }}>
            {" "}
            Please Enter valid Aadhar Number{" "}
          </Typography>
        );
        missingFields.push("Enter valid Aadhar No");
      }

      setErrors(newErrors);

      // If there are missing fields, show an alert with the list of them
      if (missingFields.length > 0) {
        // alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p
              style={{ fontSize: "20px", fontWeight: 900 }}
            >{`Please fill in the following fields: ${missingFields.join(
              ", "
            )}`}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        if (Object.keys(newErrors).length === 0) {
          setNextBtnLoading(true);
          let res = await axios.post(SERVICE.DRAFTDUPLICATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            firstname: employee.firstname,
            lastname: employee.lastname,
            legalname: employee.legalname,
            dob: employee.dob,
            aadhar: employee.aadhar,
            emergencyno: employee.emergencyno,
            fromwhere: "Intern",
          });

          if (res?.data?.success) {
            function cleanString(str) {
              // Trim spaces, then remove all dots
              const trimmed = str.trim();
              // const cleaned = trimmed.replace(/\./g, '');
              const cleaned = trimmed.replace(/[^a-zA-Z0-9 ]/g, "");

              // Return the cleaned string, or the original string if empty
              return cleaned.length > 0 ? cleaned : str;
            }

            let companynamecheck = await axios.post(
              SERVICE.COMPANYNAME_DUPLICATECHECK_CREATE,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                firstname: employee.firstname,
                lastname: employee.lastname,
                dob: employee.dob,
                // employeename: `${employee.firstname?.toUpperCase()}.${employee.lastname?.toUpperCase()}`,
                employeename: `${cleanString(
                  employee.firstname?.toUpperCase().trim()
                )}.${cleanString(employee.lastname?.toUpperCase().trim())}`,
              }
            );

            // companycaps = companynamecheck?.data?.uniqueCompanyName;
            setcompanycaps(companynamecheck?.data?.uniqueCompanyName);

            nextStep(false);
            setNextBtnLoading(false);
          }
        }
      }
    } catch (err) {
      setNextBtnLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Add employee details to the database
  const sendRequest = async () => {
    setLoading(true);
    setUserNameEmail(third);
    try {
      let hierarchyCheck = await axios.post(SERVICE.CHECKHIERARCHYADDNEWEMP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(selectedCompany),
        department: String(employee.department),
        designation: String(selectedDesignation),
        branch: String(selectedBranch),
        // workstation: String(selectedWorkStation),
        team: String(selectedTeam),
        unit: String(selectedUnit),
      });
      let hierarchyData = hierarchyCheck.data.resultString;

      if (hierarchyData && hierarchyData.length > 0) {
        function findUniqueEntries(array) {
          const seen = new Map();
          array.forEach((obj) => {
            const key = `${obj.company}-${obj.designationgroup}-${obj.department}-${obj.unit}-${obj.supervisorchoose[0]}-${obj.level}-${obj.mode}-${obj.branch}-${obj.team}`;
            if (!seen.has(key)) {
              seen.set(key, obj);
            }
          });
          return Array.from(seen.values());
        }

        // Find unique entries in the array
        const uniqueEntries = findUniqueEntries(hierarchyData);

        if (uniqueEntries.length > 0) {
          for (const item of uniqueEntries) {
            const res_queue = await axios.post(SERVICE.HIRERARCHI_CREATE, {
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
              employeename: String(companycaps),
              access: "all",
              action: Boolean(true),
              empbranch: String(selectedBranch),
              empunit: String(selectedUnit),
              empcode: String(
                employee.wordcheck === false
                  ? getDepartment === "Internship"
                    ? newval1
                    : newval
                  : employee.empcode
              ),

              empteam: String(selectedTeam),
              addedby: [
                {
                  name: String(usernameaddedby),
                  date: String(new Date()),
                },
              ],
            });
          }
        } else {
          console.log("no update");
        }
      }
      const currentDate = moment();

      let employees_data = await axios.post(SERVICE.USER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        candidateid: migrateData?.id ? String(migrateData?.id) : "",
        firstname: String(employee.firstname),
        lastname: String(employee.lastname),
        legalname: String(employee.legalname),
        callingname: String(employee.callingname),
        prefix: String(employee.prefix),
        fathername: String(employee.fathername),
        mothername: String(employee.mothername),
        gender: String(employee.gender),
        maritalstatus: String(employee.maritalstatus),
        dom: String(employee.dom),
        dob: String(employee.dob),
        bloodgroup: String(employee.bloodgroup),

        location: String(employee.location),
        email: String(employee.email),
        companyemail: String(employee.companyemail),
        contactpersonal: String(employee.contactpersonal),
        contactfamily: String(employee.contactfamily),
        emergencyno: String(employee.emergencyno),
        doj: String(employee?.doj),
        dot: String(employee.dot),
        aadhar: String(employee.aadhar),
        panno: String(employee.panstatus === "Have PAN" ? employee.panno : ""),
        panstatus: String(employee.panstatus),
        panrefno: String(
          employee.panstatus === "Applied" ? employee.panrefno : ""
        ),

        referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
        contactno: String(employee.contactno),
        details: String(employee.details),
        username: enableLoginName ? String(third) : employee.username,
        usernameautogenerate: Boolean(enableLoginName),
        workmode: String("Internship"),
        password: String(employee.password),
        autogeneratepassword: Boolean(employee.autogeneratepassword),
        originalpassword: String(employee.password),
        companyname: String(companycaps),
        company: String(selectedCompany),
        role: roles,
        branch: String(selectedBranch),
        unit: String(selectedUnit),
        floor: String(employee.floor),
        area: String(employee.area),
        department: String(employee.department),
        team: String(selectedTeam),
        designation: String(selectedDesignation),
        employeecount: String(employee?.employeecount),
        systemmode: "Active",
        shifttiming: String(employee.shifttiming),
        shifttype: String(employee.shifttype),
        shiftgrouping: String(employee.shiftgrouping),

        reportingto: String(employee.reportingto),
        enableworkstation:
          employee.workmode !== "Remote"
            ? Boolean(enableWorkstation)
            : Boolean(false),
        workstation:
          employee.workmode !== "Remote"
            ? valueWorkStation.length === 0
              ? primaryWorkStation
              : [primaryWorkStation, ...valueWorkStation]
            : [primaryWorkStation, ...valueWorkStation],
        workstationinput: String(
          employee.workmode === "Remote" || employee.ifoffice
            ? primaryWorkStationInput
            : ""
        ),
        workstationofficestatus: Boolean(employee.ifoffice),

        empcode: String(
          employee.wordcheck === false
            ? getDepartment === "Internship"
              ? newval1
              : newval
            : employee.empcode
        ),
        wordcheck: Boolean(employee.wordcheck),
        intStartDate: String(employee.intStartDate),
        intEndDate: String(employee.intEndDate),
        modeOfInt: String(employee.modeOfInt),
        intDuration: String(employee.intDuration),
        intCourse: String(employee.intCourse),

        pdoorno: String(employee.pdoorno),
        pstreet: String(employee.pstreet),
        parea: String(employee.parea),
        plandmark: String(employee.plandmark),
        ptaluk: String(employee.ptaluk),
        ppost: String(employee.ppost),
        ppincode: String(employee.ppincode),

        pcountry: String(
          selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
        ),
        pstate: String(
          selectedStatep?.name == undefined ? "" : selectedStatep?.name
        ),
        pcity: String(
          selectedCityp?.name == undefined ? "" : selectedCityp?.name
        ),

        samesprmnt: Boolean(employee.samesprmnt),
        cdoorno: String(
          !employee.samesprmnt ? employee.cdoorno : employee.pdoorno
        ),
        cstreet: String(
          !employee.samesprmnt ? employee.cstreet : employee.pstreet
        ),
        carea: String(!employee.samesprmnt ? employee.carea : employee.parea),
        clandmark: String(
          !employee.samesprmnt ? employee.clandmark : employee.plandmark
        ),
        ctaluk: String(
          !employee.samesprmnt ? employee.ctaluk : employee.ptaluk
        ),
        cpost: String(!employee.samesprmnt ? employee.cpost : employee.ppost),
        cpincode: String(
          !employee.samesprmnt ? employee.cpincode : employee.ppincode
        ),

        ccountry: String(
          !employee.samesprmnt ? selectedCountryc?.name : selectedCountryp?.name
        ),
        cstate: String(
          !employee.samesprmnt ? selectedStatec?.name : selectedStatep?.name
        ),
        ccity: String(
          !employee.samesprmnt ? selectedCityc?.name : selectedCityp?.name
        ),

        bankdetails: bankTodo,

        eduTodo: [...eduTodo],
        addAddQuaTodo: [...addAddQuaTodo],
        workhistTodo: [...workhistTodo],
        status: isFormComplete,
        experience: month,
        clickedGenerate: String("Clicked"),
        percentage: completionPercentage,
        enquirystatus: String(
          employee.enquirystatus === "Please Select Status"
            ? "Users Purpose"
            : employee.enquirystatus
        ),

        assignExpLog: [
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
            type: String(""),
            updatename: String(""),
            salarycode: String(""),
            basic: String("0"),
            hra: String("0"),
            conveyance: String("0"),
            gross: String("0"),
            medicalallowance: String("0"),
            productionallowance: String("0"),
            otherallowance: String("0"),
            productionallowancetwo: String("0"),
            pfdeduction: false,
            esideduction: false,
            ctc: String(""),
            date: String(new Date()),
          },
          {
            expmode: salarySetUpForm.mode,
            salarycode: salarySetUpForm.salarycode,
            endexp: "No",
            endexpdate: "",
            endtar: "No",
            endtardate: "",
            basic: String(formValue.basic),
            hra: String(formValue.hra),
            conveyance: String(formValue.conveyance),
            gross: String(formValue.gross),
            medicalallowance: String(formValue.medicalallowance),
            productionallowance: String(formValue.productionallowance),
            otherallowance: String(formValue.otherallowance),
            productionallowancetwo: String(formValue.productionallowancetwo),
            pfdeduction: Boolean(formValue.pfdeduction),
            esideduction: Boolean(formValue.esideduction),
            ctc: String(Ctc),
            updatedate: String(formValue.startDate),
            updatename: String(companycaps),
            date: String(new Date()),
            startmonth: String(formValue?.startmonth),
            startyear: String(formValue?.startyear),
          },
        ],

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
        // type: String(assignExperience.assignExptype + "-" + assignExperience.assignTartype),
        date: String(new Date()),

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

        departmentlog: [
          {
            userid: String(
              employee.wordcheck === false
                ? getDepartment === "Internship"
                  ? newval1
                  : newval
                : employee.empcode
            ),
            username: String(companycaps),
            department: String(employee.department),
            startdate: String(employee?.doj),
            time: String(getCurrentTime()),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            status: Boolean(employee.statuss),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            companyname: String(selectedCompany),
            logeditedby: [],
          },
        ],

        designationlog: [
          {
            username: String(companycaps),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            companyname: String(selectedCompany),
            logeditedby: [],
            designation: String(selectedDesignation),
            startdate: String(employee?.doj),
            time: String(getCurrentTime()),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
          },
        ],
        processlog: [
          {
            company: String(selectedCompany),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            empname: String(companycaps),
            process: String(loginNotAllot.process),
            processduration: String(loginNotAllot.processduration),
            processtype: String(loginNotAllot.processtype),
            date: String(employee?.doj),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            logeditedby: [],
            time: `${loginNotAllot.time}:${loginNotAllot?.timemins}`,
          },
        ],
        boardingLog: [
          {
            username: String(companycaps),
            company: String(selectedCompany),
            startdate: String(employee?.doj),
            time: moment().format("HH:mm"),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            logcreation: String("user"),
            shifttype: String(employee.shifttype),
            shifttiming: String(employee.shifttiming),
            shiftgrouping: String(employee.shiftgrouping),
            weekoff: [...valueCate],
            todo: employee.shifttype === "Standard" ? [] : [...todo],
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            logeditedby: [],
            ischangecompany: true,
            ischangebranch: true,
            ischangeunit: true,
            ischangeteam: true,
          },
        ],

        addedby: [
          {
            name: String(usernameaddedby),
            date: String(new Date()),
          },
        ],
      });

      let employeeDocuments = await axios.post(
        SERVICE.EMPLOYEEDOCUMENT_CREATE,
        {
          profileimage: croppedImage
            ? String(croppedImage)
            : employee.profileimage,
          files: [...files],
          commonid: employees_data?.data?.user?._id,
          empcode: String(
            employee.wordcheck === false
              ? getDepartment === "Internship"
                ? newval1
                : newval
              : employee.empcode
          ),
          companyname: String(companycaps),
          type: String("Internship"),
          addedby: [
            {
              name: String(usernameaddedby),
              date: String(new Date()),
            },
          ],
        }
      );

      await Promise.all(
        accessibleTodo?.map(async (data) => {
          await axios.post(
            SERVICE.ASSIGNBRANCH_CREATE,
            {
              fromcompany: data.fromcompany,
              frombranch: data.frombranch,
              fromunit: data.fromunit,
              company: selectedCompany,
              branch: selectedBranch,
              unit: selectedUnit,
              companycode: data.companycode,
              branchcode: data.branchcode,
              branchemail: data.branchemail,
              branchaddress: data.branchaddress,
              branchstate: data.branchstate,
              branchcity: data.branchcity,
              branchcountry: data.branchcountry,
              branchpincode: data.branchpincode,
              unitcode: data.unitcode,
              employee: companycaps,
              employeecode: String(
                employee.wordcheck === false
                  ? getDepartment === "Internship"
                    ? newval1
                    : newval
                  : employee.empcode
              ),
              addedby: [
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
            }
          );
        })
      );

      if (migrateData && from) {
        let updatedData = await axios.put(
          `${SERVICE.CANDIDATES_SINGLE}/${migrateData.id}`,
          {
            finalstatus: "Added",
          }
        );
      }

      const response = await fetch(SERVICE.EMAIL_SENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          message,
          email,
          company: selectedCompany,
        }),
      });
      if (response.ok) {
        setStatus("Email sent successfully");
      } else {
        setStatus("Error sending email");
      }

      //birthday mail
      const birthdayresponse = await fetch(SERVICE.BIRTHDAYEMAIL_SENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          date: moment(employee.dob)
            .year(currentDate.year())
            .format("YYYY-MM-DD"),
          time: "06:00",
          name,
          company: selectedCompany,
        }),
      });

      //work anniversary
      const weddingresponse = await fetch(SERVICE.WORKANNIVERSARYEMAIL_SENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          date: moment(employee?.doj)
            .year(currentDate.year())
            .format("YYYY-MM-DD"),
          time: "06:00",
          name,
          company: selectedCompany,
        }),
      });
      if (weddingresponse.ok) {
        setStatus("Work Anniversary Email sent successfully");
      } else {
        setStatus("Error sending email");
      }

      //WEDIING EMAIL
      if (employee.maritalstatus === "Married") {
        const weddingresponse = await fetch(SERVICE.WEDDINGEMAIL_SENT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            date: moment(employee.dom)
              .year(currentDate.year())
              .format("YYYY-MM-DD"),
            time: "06:00",
            name,
            company: selectedCompany,
          }),
        });
        if (weddingresponse.ok) {
          setStatus("Wedding Anniversary Email sent successfully");
        } else {
          setStatus("Error sending email");
        }
      }
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();

      if (employee.enquirystatus === "Enquiry Purpose") {
        backPage("/enquirypurposelist");
      } else {
        backPage("/internlist");
      }
      setLoading(false);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //Add employee details to the the Draft database
  const SendDraftRequest = async () => {
    let trimmedWorkstation =
      primaryWorkStation == "Please Select Primary Work Station"
        ? []
        : primaryWorkStation;
    try {
      let employees_draft = await axios.post(SERVICE.DRAFT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        firstname: String(employee.firstname),
        lastname: String(employee.lastname),
        legalname: String(employee.legalname),
        callingname: String(employee.callingname),
        prefix: String(employee.prefix),
        fathername: String(employee.fathername),
        mothername: String(employee.mothername),
        gender: String(employee.gender),
        maritalstatus: String(employee.maritalstatus),
        dom: String(employee.dom),
        dob: String(employee.dob),
        bloodgroup: String(employee.bloodgroup),
        accessibletodo: accessibleTodo,
        profileimage: croppedImage
          ? String(croppedImage)
          : employee.profileimage,

        location: String(employee.location),
        email: String(employee.email),
        companyemail: String(employee.companyemail),
        contactpersonal: String(employee.contactpersonal),
        contactfamily: String(employee.contactfamily),
        emergencyno: String(employee.emergencyno),
        doj: String(employee?.doj),
        dot: String(employee.dot),
        aadhar: String(employee.aadhar),
        panno: String(employee.panstatus === "Have PAN" ? employee.panno : ""),
        panstatus: String(employee.panstatus),
        panrefno: String(
          employee.panstatus === "Applied" ? employee.panrefno : ""
        ),

        referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
        contactno: String(employee.contactno),
        details: String(employee.details),
        username: enableLoginName ? String(third) : employee.username,
        usernameautogenerate: Boolean(enableLoginName),
        workmode: String("Internship"),
        password: String(employee.password),
        autogeneratepassword: Boolean(employee.autogeneratepassword),
        originalpassword: String(employee.password),
        companyname: String(companycaps),
        company: String(selectedCompany),
        role: roles,
        branch: String(selectedBranch),
        unit: String(selectedUnit),
        floor: String(employee.floor),
        area: String(employee.area),
        department: String(employee.department),
        team: String(selectedTeam),
        designation: String(selectedDesignation),
        employeecount: String(employee?.employeecount),
        systemmode: "Active",
        shifttiming: String(employee.shifttiming),
        shifttype: String(employee.shifttype),
        shiftgrouping: String(employee.shiftgrouping),
        files: [...files],

        reportingto: String(employee.reportingto),
        enableworkstation:
          employee.workmode !== "Remote"
            ? Boolean(enableWorkstation)
            : Boolean(false),
        workstation:
          employee.workmode !== "Remote"
            ? valueWorkStation.length === 0
              ? trimmedWorkstation
              : [primaryWorkStation, ...valueWorkStation]
            : [primaryWorkStation, ...valueWorkStation],
        workstationinput: String(
          employee.workmode === "Remote" || employee.ifoffice
            ? primaryWorkStationInput
            : ""
        ),
        workstationofficestatus: Boolean(employee.ifoffice),
        empcode: String(
          employee.wordcheck === false
            ? getDepartment === "Internship"
              ? newval1
              : newval
            : employee.empcode
        ),
        wordcheck: Boolean(employee.wordcheck),
        intStartDate: String(employee.intStartDate),
        intEndDate: String(employee.intEndDate),
        modeOfInt: String(employee.modeOfInt),
        intDuration: String(employee.intDuration),
        intCourse: String(employee.intCourse),

        pdoorno: String(employee.pdoorno),
        pstreet: String(employee.pstreet),
        parea: String(employee.parea),
        plandmark: String(employee.plandmark),
        ptaluk: String(employee.ptaluk),
        ppost: String(employee.ppost),
        ppincode: String(employee.ppincode),

        pcountry: String(
          selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
        ),
        pstate: String(
          selectedStatep?.name == undefined ? "" : selectedStatep?.name
        ),
        pcity: String(
          selectedCityp?.name == undefined ? "" : selectedCityp?.name
        ),

        samesprmnt: Boolean(employee.samesprmnt),
        cdoorno: String(
          !employee.samesprmnt ? employee.cdoorno : employee.pdoorno
        ),
        cstreet: String(
          !employee.samesprmnt ? employee.cstreet : employee.pstreet
        ),
        carea: String(!employee.samesprmnt ? employee.carea : employee.parea),
        clandmark: String(
          !employee.samesprmnt ? employee.clandmark : employee.plandmark
        ),
        ctaluk: String(
          !employee.samesprmnt ? employee.ctaluk : employee.ptaluk
        ),
        cpost: String(!employee.samesprmnt ? employee.cpost : employee.ppost),
        cpincode: String(
          !employee.samesprmnt ? employee.cpincode : employee.ppincode
        ),

        ccountry: String(
          !employee.samesprmnt ? selectedCountryc?.name : selectedCountryp?.name
        ),
        cstate: String(
          !employee.samesprmnt ? selectedStatec?.name : selectedStatep?.name
        ),
        ccity: String(
          !employee.samesprmnt ? selectedCityc?.name : selectedCityp?.name
        ),

        fromwhere: String("Intern"),

        bankdetails: bankTodo,

        eduTodo: [...eduTodo],
        addAddQuaTodo: [...addAddQuaTodo],
        workhistTodo: [...workhistTodo],
        status: isFormComplete,
        experience: month,
        clickedGenerate: String("Clicked"),
        percentage: completionPercentage,
        enquirystatus: String(
          employee.enquirystatus === "Please Select Status"
            ? "Users Purpose"
            : employee.enquirystatus
        ),

        assignExpLog: [
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
            type: String(""),
            updatename: String(""),
            salarycode: String(""),
            basic: String("0"),
            hra: String("0"),
            conveyance: String("0"),
            gross: String("0"),
            medicalallowance: String("0"),
            productionallowance: String("0"),
            otherallowance: String("0"),
            productionallowancetwo: String("0"),
            pfdeduction: false,
            esideduction: false,
            ctc: String(""),
            date: String(new Date()),
          },
          {
            expmode: salarySetUpForm.mode,
            salarycode: salarySetUpForm.salarycode,
            endexp: "No",
            endexpdate: "",
            endtar: "No",
            endtardate: "",
            basic: String(formValue.basic),
            hra: String(formValue.hra),
            conveyance: String(formValue.conveyance),
            gross: String(formValue.gross),
            medicalallowance: String(formValue.medicalallowance),
            productionallowance: String(formValue.productionallowance),
            otherallowance: String(formValue.otherallowance),
            productionallowancetwo: String(formValue.productionallowancetwo),
            pfdeduction: Boolean(formValue.pfdeduction),
            esideduction: Boolean(formValue.esideduction),
            ctc: String(Ctc),
            updatedate: String(formValue.startDate),
            updatename: String(companycaps),
            date: String(new Date()),
            startmonth: String(formValue?.startmonth),
            startyear: String(formValue?.startyear),
          },
        ],

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
        departmentlog: [
          {
            userid: String(
              employee.wordcheck === false
                ? getDepartment === "Internship"
                  ? newval1
                  : newval
                : employee.empcode
            ),
            username: String(companycaps),
            department: String(employee.department),
            startdate: String(employee?.doj),
            time: String(getCurrentTime()),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            status: Boolean(employee.statuss),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            companyname: String(selectedCompany),
            logeditedby: [],
          },
        ],

        designationlog: [
          {
            username: String(companycaps),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            companyname: String(selectedCompany),
            logeditedby: [],
            designation: String(selectedDesignation),
            startdate: String(employee?.doj),
            time: String(getCurrentTime()),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
          },
        ],
        processlog: [
          {
            company: String(selectedCompany),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            empname: String(companycaps),
            process: String(loginNotAllot.process),
            processduration: String(loginNotAllot.processduration),
            processtype: String(loginNotAllot.processtype),
            date: String(employee?.doj),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            logeditedby: [],
            time: `${loginNotAllot.time}:${loginNotAllot?.timemins}`,
          },
        ],
        boardingLog: [
          {
            username: String(companycaps),
            company: String(selectedCompany),
            startdate: String(employee?.doj),
            time: moment().format("HH:mm"),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            logcreation: String("user"),
            shifttype: String(employee.shifttype),
            shifttiming: String(employee.shifttiming),
            shiftgrouping: String(employee.shiftgrouping),
            weekoff: [...valueCate],
            todo: employee.shifttype === "Standard" ? [] : [...todo],
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            logeditedby: [],
            ischangecompany: true,
            ischangebranch: true,
            ischangeunit: true,
            ischangeteam: true,
          },
        ],
        employee: [
          {
            username: String(companycaps),
            company: String(selectedCompany),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            shifttiming: String(employee.shifttiming),
            shiftgrouping: String(employee.shiftgrouping),
            process: String(
              loginNotAllot.process === "Please Select Process"
                ? ""
                : loginNotAllot.process
            ),
            startdate: formattedDate,
            time: String(getCurrentTime()),
          },
        ],

        addedby: [
          {
            name: String(usernameaddedby),
            date: String(new Date()),
          },
        ],
      });

      backPage("/interndraftlist");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const nextStep = (employeenameduplicate) => {
    const newErrors = {};

    // Check the validity of field1

    if (!employee.firstname) {
      newErrors.firstname = (
        <Typography style={{ color: "red" }}>
          First name must be required
        </Typography>
      );
    }

    if (!employee.lastname) {
      newErrors.lastname = (
        <Typography style={{ color: "red" }}>
          {" "}
          Last Name be required{" "}
        </Typography>
      );
    } else if (employee.lastname.length < 3) {
      newErrors.lastname = (
        <Typography style={{ color: "red" }}>
          {" "}
          Last Name must be 3 characters!{" "}
        </Typography>
      );
    }
    if (!employee.legalname) {
      newErrors.legalname = (
        <Typography style={{ color: "red" }}>
          Legal name must be required
        </Typography>
      );
    }
    if (!employee.callingname) {
      newErrors.callingname = (
        <Typography style={{ color: "red" }}>
          Calling name must be required
        </Typography>
      );
    }
    if (
      employee.callingname !== "" &&
      employee.legalname !== "" &&
      employee.callingname?.toLowerCase() === employee.legalname?.toLowerCase()
    ) {
      newErrors.callingname = (
        <Typography style={{ color: "red" }}>
          Legal Name and Calling Name can't be same
        </Typography>
      );
    }

    // if (employeenameduplicate && employee.firstname && employee.lastname) {
    //   newErrors.duplicatefirstandlastname = (
    //     <Typography style={{ color: "red" }}>
    //       First name and Last name already exist
    //     </Typography>
    //   );
    // }

    if (!employee.email) {
      newErrors.email = (
        <Typography style={{ color: "red" }}>Email must be required</Typography>
      );
    } else if (!isValidEmail) {
      newErrors.email = (
        <Typography style={{ color: "red" }}>
          Please enter valid email
        </Typography>
      );
    }

    if (employee.maritalstatus === "Married" && !employee.dom) {
      newErrors.dom = (
        <Typography style={{ color: "red" }}>DOM must be required</Typography>
      );
    }
    if (!employee.emergencyno) {
      newErrors.emergencyno = (
        <Typography style={{ color: "red" }}>
          Emergency no must be required
        </Typography>
      );
    } else if (employee.emergencyno.length !== 10) {
      newErrors.emergencyno = (
        <Typography style={{ color: "red" }}>
          Emergency no must be 10 digits required
        </Typography>
      );
    }
    if (employee.contactfamily === "") {
      newErrors.contactfamily = (
        <Typography style={{ color: "red" }}>
          Contact(Family) no must be required
        </Typography>
      );
    }
    if (employee.contactfamily !== "" && employee.contactfamily.length !== 10) {
      newErrors.contactfamily = (
        <Typography style={{ color: "red" }}>
          Contact(Family) no must be 10 digits required
        </Typography>
      );
    }
    if (employee.contactpersonal === "") {
      newErrors.contactpersonal = (
        <Typography style={{ color: "red" }}>
          Contact(personal) no must be required
        </Typography>
      );
    }
    if (
      employee.contactpersonal !== "" &&
      employee.contactpersonal.length !== 10
    ) {
      newErrors.contactpersonal = (
        <Typography style={{ color: "red" }}>
          Contact(personal) no must be 10 digits required
        </Typography>
      );
    }
    if (employee?.panno !== "" && employee?.panno?.length !== 10) {
      newErrors.panno = (
        <Typography style={{ color: "red" }}>
          PAN No no must be 10 digits required
        </Typography>
      );
    }

    if (employee?.panno === "" && employee?.panstatus === "Have PAN") {
      newErrors.panno = (
        <Typography style={{ color: "red" }}>
          PAN No must be required
        </Typography>
      );
    } else if (
      !PanValidate(employee?.panno) &&
      employee?.panstatus === "Have PAN"
    ) {
      newErrors.panno = (
        <Typography style={{ color: "red" }}>
          Please Enter Valid PAN Number
        </Typography>
      );
    }

    if (employee?.panrefno === "" && employee?.panstatus === "Applied") {
      newErrors.panrefno = (
        <Typography style={{ color: "red" }}>
          Application Reference No must be required
        </Typography>
      );
    }

    if (!employee.dob) {
      newErrors.dob = (
        <Typography style={{ color: "red" }}>DOB must be required</Typography>
      );
    }

    if (!employee.aadhar) {
      newErrors.aadhar = (
        <Typography style={{ color: "red" }}>
          {" "}
          Aadhar must be required{" "}
        </Typography>
      );
    } else if (employee.aadhar.length < 12) {
      newErrors.aadhar = (
        <Typography style={{ color: "red" }}>
          {" "}
          Please Enter valid Aadhar Number{" "}
        </Typography>
      );
    } else if (!AadharValidate(employee.aadhar)) {
      newErrors.aadhar = (
        <Typography style={{ color: "red" }}>
          {" "}
          Please Enter valid Aadhar Number{" "}
        </Typography>
      );
    }
    // setStep(step + 1);
    setErrors(newErrors);

    // If there are no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      setStep(step + 1);
    }
  };

  const [finderrorindex, setFinderrorindex] = useState([]);
  const [finderrorindexgrp, setFinderrorindexgrp] = useState([]);
  const [finderrorindexshift, setFinderrorindexshift] = useState([]);

  //login detail validation
  const nextStepLog = () => {
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

    let firstShift = todo?.filter((data) => data?.shiftmode !== "Week Off");

    if (firstShift?.length > 0) {
      let shifthoursA = shifttiming?.find(
        (data) => data?.name === firstShift[0]?.shifttiming
      );
      if (shifthoursA) {
        setLoginNotAllot({
          ...loginNotAllot,
          time: shifthoursA?.shifthours?.split(":")[0],
          timemins: shifthoursA?.shifthours?.split(":")[1],
        });
      }
    }

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

    const newErrorsLog = {};
    const missingFieldstwo = [];

    if (!enableLoginName && employee.username === "") {
      newErrorsLog.username = (
        <Typography style={{ color: "red" }}>
          username must be required
        </Typography>
      );
      missingFieldstwo.push("User Name");
    } else if (
      !enableLoginName &&
      allUsersLoginName.includes(employee.username)
    ) {
      newErrorsLog.username = (
        <Typography style={{ color: "red" }}>username already exist</Typography>
      );
      missingFieldstwo.push("User Already Exists");
    }
    // Check the validity of field1
    if (!employee.password) {
      newErrorsLog.password = (
        <Typography style={{ color: "red" }}>
          Password name must be required
        </Typography>
      );
      missingFieldstwo.push("Password");
    }

    if (!selectedCompany) {
      newErrorsLog.company = (
        <Typography style={{ color: "red" }}>
          Company must be required
        </Typography>
      );
      missingFieldstwo.push("Company");
    }

    if (!selectedBranch) {
      newErrorsLog.branch = (
        <Typography style={{ color: "red" }}>
          Branch must be required
        </Typography>
      );
      missingFieldstwo.push("Branch");
    }

    if (!newval && employee.wordcheck === false) {
      newErrorsLog.empcode = (
        <Typography style={{ color: "red" }}>
          EmpCode must be required
        </Typography>
      );
      missingFieldstwo.push("Work Mode");
    }

    if (employee.empcode === "" && employee.wordcheck === true) {
      newErrorsLog.empcode = (
        <Typography style={{ color: "red" }}>
          EmpCode must be required
        </Typography>
      );
      missingFieldstwo.push("Empcode");
    }

    if (
      (employee.wordcheck === false && empcodelimitedAll?.includes(newval)) ||
      (employee.wordcheck === true &&
        empcodelimitedAll?.includes(employee.empcode))
    ) {
      newErrorsLog.empcode = (
        <Typography style={{ color: "red" }}>Empcode Already Exist</Typography>
      );
      missingFieldstwo.push("Empcode Already Exist");
    }

    if (!selectedUnit) {
      newErrorsLog.unit = (
        <Typography style={{ color: "red" }}>Unit must be required</Typography>
      );
      missingFieldstwo.push("Unit");
    }
    if (!selectedTeam) {
      newErrorsLog.team = (
        <Typography style={{ color: "red" }}>Team must be required</Typography>
      );
      missingFieldstwo.push("Team");
    }
    if (!selectedDesignation) {
      newErrorsLog.designation = (
        <Typography style={{ color: "red" }}>
          Designation must be required
        </Typography>
      );
      missingFieldstwo.push("Designation");
    }

    if (employee?.employeecount === "" || employee?.employeecount === "0") {
      newErrorsLog.systemcount = (
        <Typography style={{ color: "red" }}>
          System Count must be required
        </Typography>
      );
      missingFieldstwo.push("System Count");
    }

    if (!employee.department) {
      newErrorsLog.department = (
        <Typography style={{ color: "red" }}>
          Department must be required
        </Typography>
      );
      missingFieldstwo.push("Department");
    }
    if (employee.shifttype === "Please Select Shift Type") {
      newErrorsLog.shifttype = (
        <Typography style={{ color: "red" }}>
          Shifttype must be required
        </Typography>
      );
      missingFieldstwo.push("Shift Type");
    }

    if (employee.shifttype === "Standard") {
      if (employee.shiftgrouping === "Please Select Shift Grouping") {
        newErrorsLog.shiftgrouping = (
          <Typography style={{ color: "red" }}>
            Shiftgrouping must be required
          </Typography>
        );
        missingFieldstwo.push("Shift Grouping");
      } else if (employee.shifttiming === "Please Select Shift") {
        newErrorsLog.shifttiming = (
          <Typography style={{ color: "red" }}>
            Shifttiming must be required
          </Typography>
        );
        missingFieldstwo.push("Shift");
      }
    }

    let oneweekrotation = weekoptions2weeks?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;
    let twoweekrotation = weekoptions1month?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;
    let onemonthrotation = weekoptions2months?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;

    if (employee.shifttype === "1 Week Rotation" && oneweekrotation > 0) {
      newErrorsLog.shiftweeks = (
        <Typography style={{ color: "red" }}>
          Please Add all the weeks in the todo
        </Typography>
      );
      missingFieldstwo.push("Shift Weeks");
    } else if (
      employee.shifttype === "2 Week Rotation" &&
      twoweekrotation > 0
    ) {
      newErrorsLog.shiftweeks = (
        <Typography style={{ color: "red" }}>
          Please Add all the weeks in the todo
        </Typography>
      );
      missingFieldstwo.push("Shift Weeks");
    } else if (
      employee.shifttype === "1 Month Rotation" &&
      onemonthrotation > 0
    ) {
      newErrorsLog.shiftweeks = (
        <Typography style={{ color: "red" }}>
          Please Add all the weeks in the todo
        </Typography>
      );
      missingFieldstwo.push("Shift Weeks");
    }

    if (
      (employee.shifttype === "Daily" ||
        employee.shifttype === "1 Week Rotation" ||
        employee.shifttype === "2 Week Rotation" ||
        employee.shifttype === "1 Month Rotation") &&
      checkShiftMode.length > 0
    ) {
      newErrorsLog.checkShiftMode = (
        <Typography style={{ color: "red" }}>
          Shift Mode must be required
        </Typography>
      );
      missingFieldstwo.push("Shift Mode");
    }
    if (
      (employee.shifttype === "Daily" ||
        employee.shifttype === "1 Week Rotation" ||
        employee.shifttype === "2 Week Rotation" ||
        employee.shifttype === "1 Month Rotation") &&
      checkShiftGroup.length > 0
    ) {
      newErrorsLog.checkShiftGroup = (
        <Typography style={{ color: "red" }}>
          Shift Group must be required
        </Typography>
      );
      missingFieldstwo.push("Shift Group");
    }

    if (
      (employee.shifttype === "Daily" ||
        employee.shifttype === "1 Week Rotation" ||
        employee.shifttype === "2 Week Rotation" ||
        employee.shifttype === "1 Month Rotation") &&
      checkShift.length > 0
    ) {
      newErrorsLog.checkShift = (
        <Typography style={{ color: "red" }}>Shift must be required</Typography>
      );
      missingFieldstwo.push("Shift");
    }

    if (!employee.reportingto) {
      newErrorsLog.reportingto = (
        <Typography style={{ color: "red" }}>
          Reporting must be required
        </Typography>
      );
      missingFieldstwo.push("Reporting To");
    }
    if (getDepartment !== "Internship" && !selectedTeam) {
      newErrorsLog.team = (
        <Typography style={{ color: "red" }}>Please select Team</Typography>
      );
      missingFieldstwo.push("Select Team");
    }

    if (employee.shiftgrouping == "" || employee.shiftgrouping == undefined) {
      newErrorsLog.shiftgrouping = (
        <Typography style={{ color: "red" }}>
          Please Select ShiftGroup
        </Typography>
      );
      missingFieldstwo.push("Select Shift Group");
    }

    // if (
    //   employee.shifttiming == "" ||
    //   employee.shifttiming == undefined ||
    //   employee.shifttiming == "Please Select Shift"
    // ) {
    //   newErrorsLog.shifttiming = (
    //     <Typography style={{ color: "red" }}>
    //       Please select Shifttime
    //     </Typography>
    //   );
    // }

    if (employee.ifoffice === true && primaryWorkStationInput === "") {
      newErrorsLog.primaryworkstationinput = (
        <Typography style={{ color: "red" }}>
          Work Station (WFH) must be required
        </Typography>
      );
      missingFieldstwo.push("Work Station(WFH)");
    }

    if (
      employee.enquirystatus === "Please Select Status" &&
      (isUserRoleAccess.role.includes("Manager") ||
        isUserRoleCompare.includes("lassignenquierypurpose"))
    ) {
      newErrorsLog.enquirystatus = (
        <Typography style={{ color: "red" }}>
          Status must be required
        </Typography>
      );
      missingFieldstwo.push("Status");
    }

    // if (!employee.companyemail) {
    //   newErrorsLog.companyemail = (
    //     <Typography style={{ color: "red" }}>
    //       Company Email must be required
    //     </Typography>
    //   );
    // } else
    // if (!validateEmail(employee.companyemail) && employee.companyemail) {
    //   newErrorsLog.companyemail = (
    //     <Typography style={{ color: "red" }}>
    //       Please enter valid Company Email
    //     </Typography>
    //   );
    //   missingFieldstwo.push("Enter Valid Company Email");
    // }

    if (!employee?.doj) {
      newErrorsLog.doj = (
        <Typography style={{ color: "red" }}>DOJ must be required</Typography>
      );
      missingFieldstwo.push("DOJ");
    }

    // setStep(step + 1);
    setErrorsLog({ ...newErrorsLog, ...todo });

    if (missingFieldstwo.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p
            style={{ fontSize: "20px", fontWeight: 900 }}
          >{`Please fill in the following fields: ${missingFieldstwo.join(
            ", "
          )}`}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      // If there are no errors, submit the form
      if (Object.keys(newErrorsLog).length === 0) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmitMulti = (e) => {
    e.preventDefault();

    const newErrorsLog = {};

    // Check the validity of field1
    // if (!assignExperience.updatedate) {
    //   newErrorsLog.updatedate = (
    //     <Typography style={{ color: "red" }}>Please Select Date</Typography>
    //   );
    // }
    if (
      assignExperience.assignExpMode !== "Auto Increment" &&
      assignExperience.assignExpvalue === ""
    ) {
      newErrorsLog.value = (
        <Typography style={{ color: "red" }}>Please Enter Value</Typography>
      );
    }
    if (
      assignExperience.assignEndExpvalue === "Yes" &&
      assignExperience.assignEndExpDate === ""
    ) {
      newErrorsLog.endexpdate = (
        <Typography style={{ color: "red" }}>
          Please Select EndExp Date
        </Typography>
      );
    }
    if (
      assignExperience.assignEndTarvalue === "Yes" &&
      assignExperience.assignEndTarDate === ""
    ) {
      newErrorsLog.endtardate = (
        <Typography style={{ color: "red" }}>
          Please Select EndTar Date
        </Typography>
      );
    }
    setErrorsLog(newErrorsLog);

    // If there are no errors, submit the form
    if (Object.keys(newErrorsLog).length === 0) {
      sendRequest();
    }
  };

  //Submit Button For Add Employee draft section
  const handleDraftSubmit = (e) => {
    e.preventDefault();
    SendDraftRequest();
  };

  const renderStepOne = () => {
    return (
      <>
        <Headtitle title={"INTERN CREATE"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            alignItems="center"
          ></Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Typography sx={userStyle.SubHeaderText}>
                Personal Information{" "}
              </Typography>
              <br />
              <br />
              <>
                <Grid container spacing={2}>
                  <Grid item md={6} sm={6} xs={12}>
                    <Typography>
                      First Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid container sx={{ display: "flex" }}>
                      <Grid item md={3} sm={3} xs={3}>
                        <FormControl size="small" fullWidth>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            placeholder="Mr."
                            value={employee.prefix}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                prefix: e.target.value,
                              });
                            }}
                          >
                            <MenuItem value="Mr">Mr</MenuItem>
                            <MenuItem value="Ms">Ms</MenuItem>
                            <MenuItem value="Mrs">Mrs</MenuItem>
                          </Select>
                        </FormControl>
                        {errors.prefix && <div>{errors.prefix}</div>}
                      </Grid>
                      <Grid item md={9} sm={9} xs={9}>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="First Name"
                            value={employee.firstname}
                            onChange={(e) => {
                              function cleanString(str) {
                                const trimmed = str.trim();
                                const cleaned = trimmed.replace(
                                  /[^a-zA-Z0-9 ]/g,
                                  ""
                                );

                                return cleaned;
                              }
                              fetchUserName();
                              setFirst(
                                e.target.value.toLowerCase().split(" ").join("")
                              );
                              setEmployee({
                                ...employee,
                                firstname: cleanString(
                                  e.target.value.toUpperCase()
                                ),
                                prefix: employee.prefix,
                              });
                            }}
                          />
                        </FormControl>
                        {errors.firstname && <div>{errors.firstname}</div>}
                        {errors.duplicatefirstandlastname && (
                          <div>{errors.duplicatefirstandlastname}</div>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Last Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Last Name"
                        value={employee.lastname}
                        onChange={(e) => {
                          function cleanString(str) {
                            // Trim spaces, then remove all dots
                            const trimmed = str.trim();
                            const cleaned = trimmed.replace(
                              /[^a-zA-Z0-9 ]/g,
                              ""
                            );

                            return cleaned;
                          }
                          fetchUserName();
                          setSecond(
                            e.target.value.toLowerCase().split(" ").join("")
                          );
                          setUserName({
                            ...userName,
                            fname:
                              employee.firstname.toLowerCase() +
                              e.target.value.slice(0, 1).toLowerCase(),
                            length: employee.lastname.slice(0, 1).length,
                          });
                          setEmployee({
                            ...employee,
                            lastname: cleanString(e.target.value.toUpperCase()),
                          });
                        }}
                      />
                    </FormControl>
                    {errors.lastname && <div>{errors.lastname}</div>}
                    {errors.duplicatefirstandlastname && (
                      <div>{errors.duplicatefirstandlastname}</div>
                    )}
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Legal Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Legal Name"
                        value={employee.legalname}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            legalname: e.target.value,
                            //callingname: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                    {errors.legalname && <div>{errors.legalname}</div>}
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Calling Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Calling Name"
                        value={employee.callingname}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            callingname: e.target.value.replace(/\s/g, ""),
                          });
                        }}
                      />
                    </FormControl>
                    {errors.callingname && <div>{errors.callingname}</div>}
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Father Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Father Name"
                        value={employee.fathername}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            fathername: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Mother Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Mother Name"
                        value={employee.mothername}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            mothername: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={9} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Gender</Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Others", value: "Others" },
                              { label: "Female", value: "Female" },
                              { label: "Male", value: "Male" },
                            ]}
                            value={{
                              label:
                                employee.gender === "" ||
                                employee.gender == undefined
                                  ? "Select Gender"
                                  : employee.gender,
                              value:
                                employee.gender === "" ||
                                employee.gender == undefined
                                  ? "Select Gender"
                                  : employee.gender,
                            }}
                            onChange={(e) => {
                              setEmployee({ ...employee, gender: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Marital Status</Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Single", value: "Single" },
                              { label: "Married", value: "Married" },
                              { label: "Divorced", value: "Divorced" },
                            ]}
                            value={{
                              label:
                                employee.maritalstatus === "" ||
                                employee.maritalstatus == undefined
                                  ? "Select Marital Status"
                                  : employee.maritalstatus,
                              value:
                                employee.maritalstatus === "" ||
                                employee.maritalstatus == undefined
                                  ? "Select Marital Status"
                                  : employee.maritalstatus,
                            }}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                maritalstatus: e.value,
                                dom: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {employee.maritalstatus === "Married" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Date Of Marriage<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              value={employee.dom}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
                                  dom: e.target.value,
                                });
                              }}
                              type="date"
                              size="small"
                              name="dom"
                            />
                          </FormControl>
                          {errors.dom && <div>{errors.dom}</div>}
                        </Grid>
                      )}
                      <Grid item md={2.7} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Date Of Birth<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            value={employee.dob}
                            onChange={(e) => {
                              let age = calculateAge(e.target.value);
                              setEmployee({
                                ...employee,
                                dob: e.target.value,
                                age,
                              });
                            }}
                            type="date"
                            size="small"
                            name="dob"
                            inputProps={{ max: maxDate }}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        </FormControl>
                        {errors.dob && <div>{errors.dob}</div>}
                      </Grid>
                      <Grid item md={1.5} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Age</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            value={employee.dob === "" ? "" : employee?.age}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Blood Group</Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "A-ve-", value: "A-ve-" },
                              { label: "A+ve-", value: "A+ve-" },
                              { label: "B+ve", value: "B+ve" },
                              { label: "B-ve", value: "B-ve" },
                              { label: "O+ve", value: "O+ve" },
                              { label: "O-ve", value: "O-ve" },
                              { label: "AB+ve", value: "AB+ve" },
                              { label: "AB-ve", value: "AB-ve" },
                              { label: "A1+ve", value: "A1+ve" },
                              { label: "A1-ve", value: "A1-ve" },
                              { label: "A2+ve", value: "A2+ve" },
                              { label: "A2-ve", value: "A2-ve" },
                              { label: "A1B+ve", value: "A1B+ve" },
                              { label: "A1B-ve", value: "A1B-ve" },
                              { label: "A2B+ve", value: "A2B+ve" },
                              { label: "A2B-ve", value: "A2B-ve" },
                            ]}
                            value={{
                              label:
                                employee.bloodgroup === "" ||
                                employee.bloodgroup == undefined
                                  ? "Select Blood Group"
                                  : employee.bloodgroup,
                              value:
                                employee.bloodgroup === "" ||
                                employee.bloodgroup == undefined
                                  ? "Select Blood Group"
                                  : employee.bloodgroup,
                            }}
                            onChange={(e) => {
                              setEmployee({ ...employee, bloodgroup: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Email<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <TextField
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={employee.email}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                email: e.target.value,
                              });
                              setIsValidEmail(validateEmail(e.target.value));
                              setEmail(e.target.value);
                            }}
                            InputProps={{
                              inputProps: {
                                pattern: /^\S+@\S+\.\S+$/,
                              },
                            }}
                          />
                        </FormControl>
                        {errors.email && <div>{errors.email}</div>}
                      </Grid>

                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Location</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Location"
                            value={employee.location}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                location: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Contact No (personal)
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            placeholder="Contact No (personal)"
                            value={employee.contactpersonal}
                            onChange={(e) => {
                              handlechangecontactpersonal(e);
                            }}
                          />
                        </FormControl>
                        {errors.contactpersonal && (
                          <div>{errors.contactpersonal}</div>
                        )}
                      </Grid>
                      {/* </Grid>
                      <Grid container spacing={2}> */}
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Contact No (Family)<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            placeholder="Contact No (Family)"
                            value={employee.contactfamily}
                            onChange={(e) => {
                              handlechangecontactfamily(e);
                            }}
                          />
                        </FormControl>
                        {errors.contactfamily && (
                          <div>{errors.contactfamily}</div>
                        )}
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Emergency No<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="Number"
                            sx={userStyle.input}
                            placeholder="Emergency No (Emergency)"
                            value={employee.emergencyno}
                            onChange={(e) => {
                              handlechangeemergencyno(e);
                            }}
                          />
                        </FormControl>
                        {errors.emergencyno && <div>{errors.emergencyno}</div>}
                      </Grid>
                      {/* </Grid>
                      <Grid container spacing={2}> */}

                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Aadhar No<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="Number"
                            sx={userStyle.input}
                            placeholder="Aadhar No"
                            value={employee.aadhar}
                            onChange={(e) => {
                              handlechangeaadhar(e);
                            }}
                          />
                        </FormControl>
                        {errors.aadhar && <div>{errors.aadhar}</div>}
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            PAN Card Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Have PAN", value: "Have PAN" },
                              { label: "Applied", value: "Applied" },
                              { label: "Yet to Apply", value: "Yet to Apply" },
                            ]}
                            value={{
                              label:
                                employee.panstatus === "" ||
                                employee.panstatus == undefined
                                  ? "Select PAN Status"
                                  : employee.panstatus,
                              value:
                                employee.panstatus === "" ||
                                employee.panstatus == undefined
                                  ? "Select PAN Status"
                                  : employee.panstatus,
                            }}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                panstatus: e.value,
                                panno: "",
                                panrefno: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {employee?.panstatus === "Have PAN" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              PAN No<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="PAN No"
                              value={employee.panno}
                              onChange={(e) => {
                                if (e.target.value.length < 11) {
                                  setEmployee({
                                    ...employee,
                                    panno: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          {errors.panno && <div>{errors.panno}</div>}
                        </Grid>
                      )}
                      {employee?.panstatus === "Applied" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Application Ref No
                              <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Application Ref No"
                              value={employee.panrefno}
                              onChange={(e) => {
                                if (e.target.value.length < 16) {
                                  setEmployee({
                                    ...employee,
                                    panrefno: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          {errors.panrefno && <div>{errors.panrefno}</div>}
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>

                    {croppedImage && (
                      <>
                        <img
                          style={{ height: 120 }}
                          src={croppedImage}
                          alt=""
                        />
                      </>
                    )}
                    <div>
                      {employee.profileimage && !croppedImage ? (
                        <>
                          <Cropper
                            style={{ height: 120, width: "100%" }}
                            aspectRatio={1 / 1}
                            // src={selectedFile}
                            src={employee.profileimage}
                            ref={cropperRef}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              marginTop: "10px",
                              gap: "10px",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={userStyle.uploadbtn}
                                onClick={handleCrop}
                              >
                                Crop Image
                              </Typography>
                            </Box>
                            <Box>
                              <Button
                                variant="outlined"
                                sx={userStyle.btncancel}
                                onClick={handleClearImage}
                              >
                                Clear
                              </Button>
                            </Box>
                          </Box>
                        </>
                      ) : (
                        <>
                          {employee.profileimage === "" && (
                            <Grid container sx={{ display: "flex" }}>
                              <Grid item md={4} sm={4}>
                                <section>
                                  {/* Input element for selecting files */}
                                  <input
                                    type="file"
                                    accept="image/*" // Limit to image files if needed
                                    id="profileimage"
                                    onChange={handleChangeImage}
                                    style={{ display: "none" }} // Hide the input element
                                  />
                                  <label htmlFor="profileimage">
                                    <Typography sx={userStyle.uploadbtn}>
                                      Upload
                                    </Typography>
                                  </label>
                                  <br />
                                </section>
                              </Grid>
                              <Grid item md={4} sm={4}>
                                <Button
                                  onClick={showWebcam}
                                  variant="contained"
                                  sx={userStyle.uploadbtn}
                                >
                                  <CameraAltIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                          {employee.profileimage && (
                            <>
                              <Grid item md={4} sm={4}>
                                <Button
                                  variant="outlined"
                                  sx={userStyle.btncancel}
                                  onClick={handleClearImage}
                                >
                                  Clear
                                </Button>
                              </Grid>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </>
              <br />
            </Box>
          </Grid>

          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <LoadingButton
                size="small"
                variant="contained"
                loading={nextBtnLoading}
                color="primary"
                onClick={draftduplicateCheck}
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Next
              </LoadingButton>
              <Link
                to="/internlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>{" "}
              {employee.firstname !== "" &&
                employee.lastname !== "" &&
                employee.legalname !== "" &&
                employee.dob !== "" &&
                employee.aadhar !== "" &&
                employee.emergencyno !== "" && (
                  <Button
                    size="small"
                    sx={{
                      ...userStyle.btncancel,
                      textTransform: "capitalize",
                      width: "73px",
                    }}
                    onClick={(e) => {
                      handleDraftSubmit(e);
                    }}
                  >
                    {" "}
                    Draft{" "}
                  </Button>
                )}
            </Box>
          </Grid>
        </Grid>

        <Dialog
          open={isWebcamOpen}
          onClose={webcamClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
            <Webcamimage getImg={getImg} setGetImg={setGetImg} />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              onClick={webcamDataStore}
            >
              OK
            </Button>
            <Button variant="contained" color="error" onClick={webcamClose}>
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const renderStepTwo = () => {
    return (
      <>
        <Headtitle title={"INTERN CREATE"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Reference Details{" "}
                </Typography>
                <br />
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={2.3} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Reference Name"
                      value={singleReferenceTodo.name}
                      onChange={(e) => {
                        setSingleReferenceTodo({
                          ...singleReferenceTodo,
                          name: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {referenceTodoError.name && (
                    <div>{referenceTodoError.name}</div>
                  )}
                  {referenceTodoError.duplicate && (
                    <div>{referenceTodoError.duplicate}</div>
                  )}
                </Grid>
                <Grid item md={2.3} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Relationship</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Relationship"
                      value={singleReferenceTodo.relationship}
                      onChange={(e) => {
                        setSingleReferenceTodo({
                          ...singleReferenceTodo,
                          relationship: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.3} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Occupation</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Occupation"
                      value={singleReferenceTodo.occupation}
                      onChange={(e) => {
                        setSingleReferenceTodo({
                          ...singleReferenceTodo,
                          occupation: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.3} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Contact</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Contact No"
                      value={singleReferenceTodo.contact}
                      onChange={(e) => {
                        handlechangereferencecontactno(e);
                      }}
                    />
                  </FormControl>
                  {referenceTodoError.contactno && (
                    <div>{referenceTodoError.contactno}</div>
                  )}
                </Grid>
                <Grid item md={2.3} sm={12} xs={12}>
                  <FormControl fullWidth>
                    <Typography>Details</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={singleReferenceTodo.details}
                      onChange={(e) => {
                        setSingleReferenceTodo({
                          ...singleReferenceTodo,
                          details: e.target.value,
                        });
                      }}
                      placeholder="Reference Details"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.5} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: "30px",
                      minWidth: "20px",
                      padding: "19px 13px",
                      marginTop: "25px",
                    }}
                    onClick={addReferenceTodoFunction}
                  >
                    <FaPlus />
                  </Button>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  {" "}
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 700 }}
                      aria-label="customized table"
                      id="usertable"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                          <StyledTableCell>SNo</StyledTableCell>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Relationship</StyledTableCell>
                          <StyledTableCell>Occupation</StyledTableCell>
                          <StyledTableCell>Contact</StyledTableCell>
                          <StyledTableCell>Details</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody align="left">
                        {referenceTodo?.length > 0 ? (
                          referenceTodo?.map((row, index) => (
                            <StyledTableRow>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>{row.name}</StyledTableCell>
                              <StyledTableCell>
                                {row.relationship}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.occupation}
                              </StyledTableCell>
                              <StyledTableCell>{row.contact}</StyledTableCell>
                              <StyledTableCell>{row.details}</StyledTableCell>
                              <StyledTableCell>
                                <CloseIcon
                                  sx={{ color: "red", cursor: "pointer" }}
                                  onClick={() => {
                                    // handleClickOpen(index);
                                    // setDeleteIndex(index);
                                    deleteReferenceTodo(index);
                                  }}
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            {" "}
                            <StyledTableCell colSpan={8} align="center">
                              No Data Available
                            </StyledTableCell>{" "}
                          </StyledTableRow>
                        )}
                        <StyledTableRow></StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>{" "}
              <br />
            </Box>
            <br />
            <Box sx={userStyle.selectcontainer}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Login Details{" "}
                </Typography>
                <br />
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  {enableLoginName ? (
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Login Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Login Name"
                        value={third}
                        readOnly
                      />
                    </FormControl>
                  ) : (
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Login Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Login Name"
                        value={employee.username}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            username: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  )}
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={enableLoginName} />}
                      onChange={(e) => {
                        setEnableLoginName(!enableLoginName);
                      }}
                      label="Auto Generate"
                    />
                  </FormGroup>
                  {errmsg && enableLoginName && (
                    <div
                      className="alert alert-danger"
                      style={{ color: "green" }}
                    >
                      <Typography
                        color={errmsg == "Unavailable" ? "error" : "success"}
                        sx={{ margin: "5px" }}
                      >
                        <em>{errmsg}</em>
                      </Typography>
                    </div>
                  )}
                  {!enableLoginName && errorsLog.username && (
                    <div>{errorsLog.username}</div>
                  )}
                </Grid>

                {/* // Password input field */}
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Password <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={employee.password}
                      onChange={(e) => {
                        setEmployee({ ...employee, password: e.target.value });
                        setUserPassword(e.target.value);
                      }}
                      readOnly={employee.autogeneratepassword}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={employee.autogeneratepassword} />
                        }
                        onChange={handleCheckboxChange}
                        label="Auto Generate"
                      />
                    </FormGroup>
                  </Grid>
                  {errorsLog.password && <div>{errorsLog.password}</div>}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Company Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="company name"
                      value={companycaps}
                      readOnly
                    />
                  </FormControl>
                </Grid>
              </Grid>{" "}
              <br />
            </Box>
            <br />
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>
                    Boarding Information
                  </Typography>
                </Grid>
              </Grid>{" "}
              <br />
              <Grid container spacing={2}>
                {isUserRoleAccess.role.includes("Manager") ? (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={statusOptions}
                        placeholder="Please Select Status"
                        value={{
                          label: employee.enquirystatus,
                          value: employee.enquirystatus,
                        }}
                        onChange={(e) => {
                          setEmployee((prev) => ({
                            ...prev,
                            enquirystatus: e.value,
                          }));
                        }}
                      />
                    </FormControl>
                    {errorsLog.enquirystatus && (
                      <div>{errorsLog.enquirystatus}</div>
                    )}
                  </Grid>
                ) : isUserRoleCompare.includes("lassignenquierypurpose") ? (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={statusOptions}
                        placeholder="Please Select Status"
                        value={{
                          label: employee.enquirystatus,
                          value: employee.enquirystatus,
                        }}
                        onChange={(e) => {
                          setEmployee((prev) => ({
                            ...prev,
                            enquirystatus: e.value,
                          }));
                        }}
                      />
                    </FormControl>
                    {errorsLog.enquirystatus && (
                      <div>{errorsLog.enquirystatus}</div>
                    )}
                  </Grid>
                ) : (
                  ""
                )}
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      DOJ<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={employee?.doj}
                      onChange={(e) => {
                        handleSalaryfix(
                          loginNotAllot.process,
                          e.target.value,
                          e.target.value,
                          assignExperience.assignExpMode,
                          assignExperience.assignExpvalue,

                          assignExperience.assignEndExpvalue,
                          assignExperience.assignEndExpDate,
                          assignExperience.assignEndTarvalue,
                          assignExperience.assignEndTarDate
                          //  assignExperience.assignEndTar
                        );
                        setEmployee({ ...employee, doj: e.target.value });
                        setAssignExperience((prev) => ({
                          ...prev,
                          updatedate: e.target.value,
                          assignEndExpDate: "",
                          assignEndTarDate: "",
                          // assignExpMode: "Auto Increment",
                        }));
                        // setLoginNotAllot({
                        //   ...loginNotAllot,
                        //   process: "Please Select Process",
                        // });
                      }}
                    />
                    {errorsLog.doj && <div>{errorsLog.doj}</div>}
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company Email</Typography>
                    <TextField
                      id="email"
                      type="email"
                      placeholder="Company Email"
                      value={employee.companyemail}
                      // onChange={(e) => {
                      //   setEmployee({
                      //     ...employee,
                      //     companyemail: e.target.value,
                      //   });
                      // }}
                      // InputProps={{
                      //   inputProps: {
                      //     pattern: /^\S+@\S+\.\S+$/,
                      //   },
                      // }}
                      readOnly
                    />
                  </FormControl>
                  {errorsLog.companyemail && (
                    <div>{errorsLog.companyemail}</div>
                  )}
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={companies?.map((data) => ({
                        label: data.name,
                        value: data.name,
                        code: data.code,
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          selectedCompany === "" || selectedCompany == undefined
                            ? "Please Select Company"
                            : selectedCompany,
                        value:
                          selectedCompany === "" || selectedCompany == undefined
                            ? "Please Select Company"
                            : selectedCompany,
                      }}
                      onChange={handleCompanyChange}
                    />
                  </FormControl>
                  {errorsLog.company && <div>{errorsLog.company}</div>}
                </Grid>{" "}
                <br />
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>

                    <Selects
                      options={filteredBranches?.map((data) => ({
                        label: data.name,
                        value: data.name,
                        ...data,
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          selectedBranch === "" || selectedBranch == undefined
                            ? "Please Select Branch"
                            : selectedBranch,
                        value:
                          selectedBranch === "" || selectedBranch == undefined
                            ? "Please Select Branch"
                            : selectedBranch,
                      }}
                      onChange={handleBranchChange}
                    />
                  </FormControl>
                  {errorsLog.branch && <div>{errorsLog.branch}</div>}
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={filteredUnits?.map((data) => ({
                        label: data.name,
                        value: data.name,
                        code: data.code,
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          selectedUnit === "" || selectedUnit == undefined
                            ? "Please Select Unit"
                            : selectedUnit,
                        value:
                          selectedUnit === "" || selectedUnit == undefined
                            ? "Please Select Unit"
                            : selectedUnit,
                      }}
                      onChange={handleUnitChange}
                    />
                  </FormControl>
                  {errorsLog.unit && <div>{errorsLog.unit}</div>}
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={department?.map((data) => ({
                        label: data?.deptname,
                        value: data?.deptname,
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          employee?.department === "" ||
                          employee?.department == undefined
                            ? "Please Select Department"
                            : employee?.department,
                        value:
                          employee?.department === "" ||
                          employee?.department == undefined
                            ? "Please Select Department"
                            : employee?.department,
                      }}
                      onChange={(e) => {
                        fetchDptDesignation(e.value);
                        setEmployee({ ...employee, department: e.value });
                        setSelectedDesignation("");
                        setSelectedTeam("");
                        setAssignExperience((prev) => ({
                          ...prev,
                          assignEndExpDate: "",
                          assignEndTarDate: "",
                        }));
                      }}
                    />
                  </FormControl>
                  {errorsLog.department && <div>{errorsLog.department}</div>}
                </Grid>
                <>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={filteredTeams?.map((data) => ({
                          label: data?.teamname,
                          value: data?.teamname,
                        }))}
                        styles={colourStyles}
                        value={{
                          label:
                            selectedTeam === "" || selectedTeam == undefined
                              ? "Please Select Team"
                              : selectedTeam,
                          value:
                            selectedTeam === "" || selectedTeam == undefined
                              ? "Please Select Team"
                              : selectedTeam,
                        }}
                        onChange={handleTeamChange}
                      />
                    </FormControl>
                    {errorsLog.team && <div>{errorsLog.team}</div>}
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Floor</Typography>
                      <Selects
                        options={floorNames
                          ?.filter((u) => u.branch === selectedBranch)
                          ?.map((data) => ({
                            label: data.name,
                            value: data.name,
                          }))}
                        styles={colourStyles}
                        value={{
                          label:
                            employee?.floor === "" ||
                            employee?.floor == undefined
                              ? "Please Select Floor"
                              : employee?.floor,
                          value:
                            employee?.floor === "" ||
                            employee?.floor == undefined
                              ? "Please Select Floor"
                              : employee?.floor,
                        }}
                        onChange={(e) => {
                          fetchareaNames(e.value);
                          setEmployee({
                            ...employee,
                            floor: e.value,
                            area: "",
                          });
                          setPrimaryWorkStation(
                            "Please Select Primary Work Station"
                          );
                          setSelectedOptionsWorkStation([]);
                          setValueWorkStation([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Area</Typography>
                      <Selects
                        options={areaNames?.map((data) => ({
                          label: data,
                          value: data,
                        }))}
                        styles={colourStyles}
                        value={{
                          label:
                            employee?.area === "" || employee?.area == undefined
                              ? "Please Select Area"
                              : employee?.area,
                          value:
                            employee?.area === "" || employee?.area == undefined
                              ? "Please Select Area"
                              : employee?.area,
                        }}
                        onChange={(e) => {
                          setEmployee({ ...employee, area: e.value });
                          setPrimaryWorkStation(
                            "Please Select Primary Work Station"
                          );
                          setSelectedOptionsWorkStation([]);
                          setValueWorkStation([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Designation <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={designation?.map((d) => ({
                          label: d.name || d.designation,
                          value: d.name || d.designation,
                          systemcount: d?.systemcount || "",
                        }))}
                        styles={colourStyles}
                        value={{
                          label:
                            selectedDesignation === "" ||
                            selectedDesignation == undefined
                              ? "Please Select Designation"
                              : selectedDesignation,
                          value:
                            selectedDesignation === "" ||
                            selectedDesignation == undefined
                              ? "Please Select Designation"
                              : selectedDesignation,
                        }}
                        onChange={handleDesignationChange}
                      />
                    </FormControl>
                    {errorsLog.designation && (
                      <div>{errorsLog.designation}</div>
                    )}
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        System Count <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        size="small"
                        placeholder="System Count"
                        value={employee.employeecount}
                        onChange={(e) => {
                          setEmployee((prev) => ({
                            ...prev,
                            employeecount: e.target.value.replace(
                              /[^0-9.;\s]/g,
                              ""
                            ),
                          }));
                        }}
                      />
                    </FormControl>
                    {errorsLog.systemcount && (
                      <div>{errorsLog.systemcount}</div>
                    )}
                  </Grid>
                </>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Work Mode</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={employee.workmode}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Mode of Intern</Typography>

                      <Selects
                        options={[
                          { label: "Online", value: "Online" },
                          { label: "Offline", value: "Offline" },
                        ]}
                        styles={colourStyles}
                        value={{
                          label:
                            employee?.modeOfInt === "" ||
                            employee?.modeOfInt == undefined
                              ? "Please Select Mode Of Intern"
                              : employee?.modeOfInt,
                          value:
                            employee?.modeOfInt === "" ||
                            employee?.modeOfInt == undefined
                              ? "Please Select Mode Of Intern"
                              : employee?.modeOfInt,
                        }}
                        onChange={(e, i) => {
                          setEmployee({ ...employee, modeOfInt: e.value });
                          setModeInt(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {modeInt === "Offline" ? (
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Duration</Typography>

                        <Selects
                          options={[
                            { label: "Part-time", value: "Part-time" },
                            { label: "Full-time", value: "Full-time" },
                          ]}
                          styles={colourStyles}
                          value={{
                            label:
                              employee?.intDuration === "" ||
                              employee?.intDuration == undefined
                                ? "Please Select Duration"
                                : employee?.intDuration,
                            value:
                              employee?.intDuration === "" ||
                              employee?.intDuration == undefined
                                ? "Please Select Duration"
                                : employee?.intDuration,
                          }}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              intDuration: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ) : (
                    ""
                  )}
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Intern Course</Typography>

                      <Selects
                        options={internCourseNames?.map((data) => ({
                          label: data?.name,
                          value: data?.name,
                        }))}
                        styles={colourStyles}
                        value={{
                          label:
                            employee?.intCourse === "" ||
                            employee?.intCourse == undefined
                              ? "Please Select Intern Course"
                              : employee?.intCourse,
                          value:
                            employee?.intCourse === "" ||
                            employee?.intCourse == undefined
                              ? "Please Select Intern Course"
                              : employee?.intCourse,
                        }}
                        onChange={(e, i) => {
                          setEmployee({ ...employee, intCourse: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Intern start date</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={employee.intStartDate}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                intStartDate: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Intern end date</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={employee.intEndDate}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                intEndDate: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>
                    Shift Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={ShiftTypeOptions}
                      label="Please Select Shift Type"
                      value={{
                        label: employee.shifttype,
                        value: employee.shifttype,
                      }}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          shifttype: e.value,
                          shiftgrouping: "Please Select Shift Grouping",
                          shifttiming: "Please Select Shift",
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
                {employee.shifttype === "Standard" ? (
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
                            label: employee.shiftgrouping,
                            value: employee.shiftgrouping,
                          }}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              shiftgrouping: e.value,
                              shifttiming: "Please Select Shift",
                            });
                            ShiftDropdwonsSecond(e.value);
                          }}
                        />
                      </FormControl>
                      {errorsLog.shiftgrouping && (
                        <div>{errorsLog.shiftgrouping}</div>
                      )}
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
                            label: employee.shifttiming,
                            value: employee.shifttiming,
                          }}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              shifttiming: e.value,
                            });
                            let shifthoursA = shifttiming?.find(
                              (data) => data?.name === e.value
                            );
                            setLoginNotAllot({
                              ...loginNotAllot,
                              time: shifthoursA?.shifthours?.split(":")[0],
                              timemins: shifthoursA?.shifthours?.split(":")[1],
                            });
                          }}
                        />
                      </FormControl>
                      {errorsLog.shifttiming && (
                        <div>{errorsLog.shifttiming}</div>
                      )}
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
                  {employee.shifttype === "Daily" ? (
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
                                  employee.shiftgrouping === "" ||
                                  employee.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : employee.shiftgrouping,
                                value:
                                  employee.shiftgrouping === "" ||
                                  employee.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : employee.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
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
                                  employee.shifttiming === "" ||
                                  employee.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : employee.shifttiming,
                                value:
                                  employee.shifttiming === "" ||
                                  employee.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : employee.shifttiming,
                              }}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
                                  shifttiming: e.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          md={3.5}
                          sm={6}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
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
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
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

                  {employee.shifttype === "1 Week Rotation" ? (
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
                                  employee.shiftgrouping === "" ||
                                  employee.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : employee.shiftgrouping,
                                value:
                                  employee.shiftgrouping === "" ||
                                  employee.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : employee.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
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
                                  employee.shifttiming === "" ||
                                  employee.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : employee.shifttiming,
                                value:
                                  employee.shifttiming === "" ||
                                  employee.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : employee.shifttiming,
                              }}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
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
                                  (item) =>
                                    !todo?.some((val) => val?.week === item)
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
                          {errorsLog.shiftweeks && (
                            <div>{errorsLog.shiftweeks}</div>
                          )}
                        </Grid>
                        <Grid
                          item
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
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
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
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

                  {employee.shifttype === "2 Week Rotation" ? (
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
                                  employee.shiftgrouping === "" ||
                                  employee.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : employee.shiftgrouping,
                                value:
                                  employee.shiftgrouping === "" ||
                                  employee.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : employee.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
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
                                  employee.shifttiming === "" ||
                                  employee.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : employee.shifttiming,
                                value:
                                  employee.shifttiming === "" ||
                                  employee.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : employee.shifttiming,
                              }}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
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
                                  (item) =>
                                    !todo?.some((val) => val?.week === item)
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
                          {errorsLog.shiftweeks && (
                            <div>{errorsLog.shiftweeks}</div>
                          )}
                        </Grid>
                        <Grid
                          item
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
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
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
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

                  {employee.shifttype === "1 Month Rotation" ? (
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
                                  employee.shiftgrouping === "" ||
                                  employee.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : employee.shiftgrouping,
                                value:
                                  employee.shiftgrouping === "" ||
                                  employee.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : employee.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
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
                                  employee.shifttiming === "" ||
                                  employee.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : employee.shifttiming,
                                value:
                                  employee.shifttiming === "" ||
                                  employee.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : employee.shifttiming,
                              }}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
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
                                  (item) =>
                                    !todo?.some((val) => val?.week === item)
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
                          {errorsLog.shiftweeks && (
                            <div>{errorsLog.shiftweeks}</div>
                          )}
                        </Grid>
                        <Grid
                          item
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
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
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
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
                  {/* {employee.shifttype === "Daily" ? (
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
                              {errorsLog.checkShiftMode &&
                                finderrorindex.includes(index) && (
                                  <div>{errorsLog.checkShiftMode}</div>
                                )}
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
                                  {errorsLog.checkShiftGroup &&
                                    finderrorindexgrp.includes(index) && (
                                      <div>{errorsLog.checkShiftGroup}</div>
                                    )}
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
                                  {errorsLog.checkShift &&
                                    finderrorindexshift.includes(index) && (
                                      <div>{errorsLog.checkShift}</div>
                                    )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {employee.shifttype === "1 Week Rotation" ? (
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
                              {errorsLog.checkShiftMode &&
                                finderrorindex.includes(index) && (
                                  <div>{errorsLog.checkShiftMode}</div>
                                )}
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
                                  {errorsLog.checkShiftGroup &&
                                    finderrorindexgrp.includes(index) && (
                                      <div>{errorsLog.checkShiftGroup}</div>
                                    )}
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
                                  {errorsLog.checkShift &&
                                    finderrorindexshift.includes(index) && (
                                      <div>{errorsLog.checkShift}</div>
                                    )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {employee.shifttype === "2 Week Rotation" ? (
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
                              {errorsLog.checkShiftMode &&
                                finderrorindex.includes(index) && (
                                  <div>{errorsLog.checkShiftMode}</div>
                                )}
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
                                  {errorsLog.checkShiftGroup &&
                                    finderrorindexgrp.includes(index) && (
                                      <div>{errorsLog.checkShiftGroup}</div>
                                    )}
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
                                  {errorsLog.checkShift &&
                                    finderrorindexshift.includes(index) && (
                                      <div>{errorsLog.checkShift}</div>
                                    )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {employee.shifttype === "1 Month Rotation" ? (
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
                              {errorsLog.checkShiftMode &&
                                finderrorindex.includes(index) && (
                                  <div>{errorsLog.checkShiftMode}</div>
                                )}
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
                                  {errorsLog.checkShiftGroup &&
                                    finderrorindexgrp.includes(index) && (
                                      <div>{errorsLog.checkShiftGroup}</div>
                                    )}
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
                                  {errorsLog.checkShift &&
                                    finderrorindexshift.includes(index) && (
                                      <div>{errorsLog.checkShift}</div>
                                    )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null} */}
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
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
                        label:
                          employee?.reportingto === "" ||
                          employee?.reportingto == undefined
                            ? "Please Select Reporting To"
                            : employee?.reportingto,
                        value:
                          employee?.reportingto === "" ||
                          employee?.reportingto == undefined
                            ? "Please Select Reporting To"
                            : employee?.reportingto,
                      }}
                      onChange={(e) => {
                        setEmployee({ ...employee, reportingto: e.value });
                      }}
                    />
                  </FormControl>
                  {errorsLog.reportingto && <div>{errorsLog.reportingto}</div>}
                </Grid>
                <Grid item md={1.5} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Prev EmpCode</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="EmpCode"
                      value={lastEmpCode ?? "000"}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3.5} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      EmpCode <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="EmpCode"
                      value={
                        employee.wordcheck === false
                          ? newval1
                          : employee.empcode
                      }
                      onChange={(e) => {
                        const inputText = e.target.value;
                        setEmployee({ ...employee, empcode: inputText });
                      }}
                    />
                  </FormControl>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={employee.wordcheck === true} />
                        }
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            wordcheck: !employee.wordcheck,
                          });
                        }}
                        label="Enable Empcode"
                      />
                    </FormGroup>
                  </Grid>
                  {errorsLog.empcode && <div>{errorsLog.empcode}</div>}
                </Grid>
                {employee.workmode !== "Remote" ? (
                  <>
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
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>If Office</Typography>
                      </FormControl>
                      <Grid>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox checked={employee.ifoffice === true} />
                            }
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                ifoffice: !employee.ifoffice,
                              });
                              setPrimaryWorkStation(
                                "Please Select Primary Work Station"
                              );
                              // setPrimaryWorkStationInput("");
                            }}
                            label="Work Station Other"
                          />
                        </FormGroup>
                      </Grid>
                      {errorsLog.ifoffice && <div>{errorsLog.ifoffice}</div>}
                    </Grid>
                    {employee.ifoffice === true && (
                      <>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>
                              Work Station (WFH)
                              <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Work Station"
                              value={primaryWorkStationInput}
                              readOnly
                            />
                          </FormControl>
                          {errorsLog.primaryworkstationinput && (
                            <div>{errorsLog.primaryworkstationinput}</div>
                          )}
                        </Grid>
                      </>
                    )}
                  </>
                ) : (
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Work Station</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value="WFH"
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Box>
            <br />
          </Grid>

          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                onClick={prevStep}
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Previous
              </Button>
              <Button
                className="next"
                variant="contained"
                size="small"
                onClick={nextStepLog}
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Next
              </Button>
              <Link
                to="/internlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>{" "}
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderStepThree = () => {
    return (
      <>
        <Headtitle title={"INTERN CREATE"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Permanent Address <b style={{ color: "red" }}>*</b>
              </Typography>
              <br />
              <br />

              <>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Door/Flat No</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Door/Flat No"
                        value={employee.pdoorno}
                        onChange={(e) => {
                          setEmployee({ ...employee, pdoorno: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Street/Block</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Street/Block"
                        value={employee.pstreet}
                        onChange={(e) => {
                          setEmployee({ ...employee, pstreet: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Area/village</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Area/Village"
                        value={employee.parea}
                        onChange={(e) => {
                          setEmployee({ ...employee, parea: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Landmark</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Landmark"
                        value={employee.plandmark}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            plandmark: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <br />
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Taluk</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Taluk"
                        value={employee.ptaluk}
                        onChange={(e) => {
                          setEmployee({ ...employee, ptaluk: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Post</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Post"
                        value={employee.ppost}
                        onChange={(e) => {
                          setEmployee({ ...employee, ppost: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Pincode</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Pincode"
                        value={employee.ppincode}
                        onChange={(e) => {
                          handlechangeppincode(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Country</Typography>
                      <Selects
                        options={Country.getAllCountries()}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        styles={colourStyles}
                        value={selectedCountryp}
                        onChange={(item) => {
                          setSelectedCountryp(item);
                          setSelectedStatep("");
                          setSelectedCityp("");
                          setEmployee((prevSupplier) => ({
                            ...prevSupplier,
                            pcountry: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>State</Typography>
                      <Selects
                        options={State?.getStatesOfCountry(
                          selectedCountryp?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedStatep}
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedStatep(item);
                          setSelectedCityp("");
                          setEmployee((prevSupplier) => ({
                            ...prevSupplier,
                            pstate: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>City</Typography>
                      <Selects
                        options={City.getCitiesOfState(
                          selectedStatep?.countryCode,
                          selectedStatep?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCityp}
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedCityp(item);
                          setEmployee((prevSupplier) => ({
                            ...prevSupplier,
                            pcity: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    {" "}
                    Current Address<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={employee.samesprmnt}
                        onChange={(e) =>
                          setEmployee({
                            ...employee,
                            samesprmnt: !employee.samesprmnt,
                          })
                        }
                      />
                    }
                    label="Same as permanent Address"
                  />
                </Grid>
              </Grid>
              <br />
              <br />
              {!employee.samesprmnt ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Door/Flat No</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Door/Flat No"
                          value={employee.cdoorno}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              cdoorno: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Street/Block</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Street/Block"
                          value={employee.cstreet}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              cstreet: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Area/village</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Area/Village"
                          value={employee.carea}
                          onChange={(e) => {
                            setEmployee({ ...employee, carea: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Landmark</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Landmark"
                          value={employee.clandmark}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              clandmark: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Taluk</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Taluk"
                          value={employee.ctaluk}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              ctaluk: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Post</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Post"
                          value={employee.cpost}
                          onChange={(e) => {
                            setEmployee({ ...employee, cpost: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Pincode</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Pincode"
                          value={employee.cpincode}
                          onChange={(e) => {
                            handlechangecpincode(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Country</Typography>
                        <Selects
                          options={Country.getAllCountries()}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCountryc}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCountryc(item);
                            setSelectedStatec("");
                            setSelectedCityc("");
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              ccountry: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>State</Typography>
                        <Selects
                          options={State?.getStatesOfCountry(
                            selectedCountryc?.isoCode
                          )}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedStatec}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedStatec(item);
                            setSelectedCityc("");
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              cstate: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>City</Typography>
                        <Selects
                          options={City.getCitiesOfState(
                            selectedStatec?.countryCode,
                            selectedStatec?.isoCode
                          )}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCityc}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCityc(item);
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              ccity: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                // else condition starts here
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Door/Flat No</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Door/Flat No"
                          value={employee.pdoorno}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Street/Block</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Street/Block"
                          value={employee.pstreet}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Area/village</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Area/Village"
                          value={employee.parea}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Landmark</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Landmark"
                          value={employee.plandmark}
                        />
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Taluk</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Taluk"
                          value={employee.ptaluk}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Post</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Post"
                          value={employee.ppost}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Pincode</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Pincode"
                          value={employee.ppincode}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Country</Typography>
                        <Selects
                          options={Country.getAllCountries()}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCountryp}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCountryp(item);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>State</Typography>
                        <Selects
                          options={State?.getStatesOfCountry(
                            selectedCountryp?.isoCode
                          )}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedStatep}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedStatep(item);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>City</Typography>
                        <Selects
                          options={City.getCitiesOfState(
                            selectedStatep?.countryCode,
                            selectedStatep?.isoCode
                          )}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCityp}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCityp(item);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
            <br />
          </Grid>

          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                onClick={prevStep}
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Previous
              </Button>
              <Button
                className="next"
                variant="contained"
                size="small"
                onClick={() => {
                  nextStep(false);
                }}
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Next
              </Button>

              <Link
                to="/internlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                size="small"
                sx={{
                  ...userStyle.btncancel,
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
              >
                {" "}
                Draft{" "}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderStepFour = () => {
    return (
      <>
        <Headtitle title={"INTERN CREATE"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Document</Typography>
              </Grid>
              <>
                <Grid container sx={{ justifyContent: "center" }} spacing={1}>
                  <Selects
                    options={designationsFileNames}
                    styles={colourStyles}
                    value={{
                      label: fileNames,
                      value: fileNames,
                    }}
                    onChange={(e) => {
                      setfileNames(e.value);
                    }}
                  />
                  &nbsp;
                  <Button variant="outlined" component="label">
                    <CloudUploadIcon sx={{ fontSize: "21px" }} /> &ensp;Upload
                    Documents
                    <input
                      hidden
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Grid>
              </>
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Document List{" "}
              </Typography>
              <br />
              <br />
              <br />
              <TableContainer component={Paper}>
                <Table aria-label="simple table" id="branch">
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                      <StyledTableCell align="center">Document</StyledTableCell>
                      <StyledTableCell align="center">Remarks</StyledTableCell>
                      <StyledTableCell align="center">View</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {files &&
                      files?.map((file, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {sno++}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {file.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <FormControl>
                              <OutlinedInput
                                sx={{
                                  height: "30px !important",
                                  background: "white",
                                  border: "1px solid rgb(0 0 0 / 48%)",
                                }}
                                size="small"
                                type="text"
                                value={file.remark}
                                onChange={(event) =>
                                  handleRemarkChange(index, event.target.value)
                                }
                              />
                            </FormControl>
                          </StyledTableCell>

                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            <a
                              style={{ color: "#357ae8" }}
                              href={`data:application/octet-stream;base64,${file.data}`}
                              download={file.name}
                            >
                              Download
                            </a>
                            <a
                              style={{
                                color: "#357ae8",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => renderFilePreview(file)}
                            >
                              View
                            </a>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              onClick={() => handleFileDelete(index)}
                              variant="contained"
                              size="small"
                              sx={{
                                textTransform: "capitalize",
                                minWidth: "0px",
                              }}
                            >
                              <DeleteIcon style={{ fontSize: "20px" }} />
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <br />
            <Box sx={userStyle.container}>
              <Typography sx={userStyle.SubHeaderText}>
                Educational qualification <b style={{ color: "red" }}>*</b>
              </Typography>
              <br />
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Category</Typography>
                    <Selects
                      options={categorys}
                      value={{
                        label: employee.categoryedu,
                        value: employee.categoryedu,
                      }}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          categoryedu: e.value,
                          subcategoryedu: "Please Select Sub Category",
                          specialization: "Please Select Specialization",
                        }));
                        fetchCategoryBased(e);
                        setSubcategorys([]);
                        setEducationsOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub Category</Typography>
                    <Selects
                      options={subcategorys}
                      value={{
                        label: employee.subcategoryedu,
                        value: employee.subcategoryedu,
                      }}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          subcategoryedu: e.value,
                          specialization: "Please Select Specialization",
                        }));
                        fetchEducation(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography> Specialization</Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={educationsOpt}
                      value={{
                        label: employee.specialization,
                        value: employee.specialization,
                      }}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          specialization: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Institution </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={institution}
                      placeholder="Institution"
                      onChange={(e) => setInstitution(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Passed Year </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      placeholder="Passed Year"
                      sx={userStyle.input}
                      value={passedyear}
                      onChange={(e) => handlechangepassedyear(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> CGPA</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      placeholder="CGPA"
                      sx={userStyle.input}
                      value={cgpa}
                      onChange={(e) => handlechangecgpa(e)}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={1} sm={12} xs={12}>
                  <FormControl size="small">
                    <Button
                      variant="contained"
                      color="success"
                      type="button"
                      onClick={handleSubmittodo}
                      sx={userStyle.Todoadd}
                    >
                      <FaPlus />
                    </Button>
                    &nbsp;
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <br />
                  <br />
                  {errorstodo.qualification && (
                    <div>{errorstodo.qualification}</div>
                  )}
                </Grid>
              </Grid>
              <br /> <br />
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Educational Details{" "}
              </Typography>
              <br />
              <br />
              <br />
              {/* ****** Table start ****** */}
              <TableContainer component={Paper}>
                <Table aria-label="simple table" id="branch">
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                      <StyledTableCell align="center">Category</StyledTableCell>
                      <StyledTableCell align="center">
                        Sub Category
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Specialization
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Institution
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Passed Year
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        % or cgpa
                      </StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {eduTodo &&
                      eduTodo?.map((todo, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {eduno++}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {todo.categoryedu}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {todo.subcategoryedu}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {todo.specialization}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.institution}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.passedyear}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.cgpa}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={() => handleDelete(index)}
                                sx={userStyle.Todoadd}
                              >
                                <AiOutlineClose />
                              </Button>
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <br />
            <br />
          </Grid>

          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                onClick={prevStep}
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Previous
              </Button>
              <Button
                className="next"
                variant="contained"
                size="small"
                onClick={() => {
                  nextStep(false);
                }}
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Next
              </Button>

              <Link
                to="/internlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                size="small"
                sx={{
                  ...userStyle.btncancel,
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
              >
                {" "}
                Draft{" "}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };
  const renderStepFive = () => {
    return (
      <>
        <Headtitle title={"INTERN CREATE"} />
        {/* <form onSubmit={ (e) =>  }> */}
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Typography sx={userStyle.SubHeaderText}>
                Additional qualification{" "}
              </Typography>
              <br />
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Addtl. Qualification </Typography>
                    <Selects
                      options={skillSet?.map((data) => ({
                        label: data?.name,
                        value: data?.name,
                      }))}
                      // styles={colourStyles}
                      value={{
                        label:
                          addQual === "" || addQual == undefined
                            ? "Please Select Additional Qualification"
                            : addQual,
                        value:
                          addQual === "" || addQual == undefined
                            ? "Please Select Additional Qualification"
                            : addQual,
                      }}
                      onChange={(e) => {
                        setAddQual(e.value);
                      }}
                    />
                  </FormControl>
                  {errorstodo.addQual && <div>{errorstodo.addQual}</div>}
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Institution </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Institution"
                      value={addInst}
                      onChange={(e) => setAddInst(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Durartion</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Durartion"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Remarks</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} sm={12} xs={12}>
                  <FormControl size="small">
                    <Button
                      variant="contained"
                      color="success"
                      type="button"
                      onClick={handleSubmitAddtodo}
                      sx={userStyle.Todoadd}
                    >
                      <FaPlus />
                    </Button>
                    &nbsp;
                  </FormControl>
                </Grid>
                <br />
              </Grid>
              <br />
              <br />
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Additional Qualification Details{" "}
              </Typography>

              {/* ****** Table start ****** */}
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  id="branch"
                  // ref={tableRef}
                >
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                      <StyledTableCell align="center">
                        Addl. Qualification
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Institution
                      </StyledTableCell>
                      <StyledTableCell align="center">Duration</StyledTableCell>
                      <StyledTableCell align="center">Remarks</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {addAddQuaTodo &&
                      addAddQuaTodo?.map((addtodo, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {skno++}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {addtodo.addQual}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {addtodo.addInst}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {addtodo.duration}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {addtodo.remarks}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={() => handleAddDelete(index)}
                                sx={userStyle.Todoadd}
                              >
                                <AiOutlineClose />
                              </Button>
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <br />
            <Box sx={userStyle.container}>
              <Typography sx={userStyle.SubHeaderText}>Work History</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Employee Name</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Employee Name"
                      value={empNameTodo}
                      onChange={(e) => setEmpNameTodo(e.target.value)}
                    />
                  </FormControl>
                  {errorstodo.empNameTodo && (
                    <div>{errorstodo.empNameTodo}</div>
                  )}
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Designation </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Designation"
                      value={desigTodo}
                      onChange={(e) => {
                        setDesigTodo(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Joined On </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={joindateTodo}
                      onChange={(e) => {
                        setJoindateTodo(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Leave On</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={leavedateTodo}
                      onChange={(e) => setLeavedateTodo(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Duties</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Duties"
                      value={dutiesTodo}
                      onChange={(e) => setDutiesTodo(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={5} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Reason for Leaving</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Reason for Leaving"
                      value={reasonTodo}
                      onChange={(e) => setReasonTodo(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} sm={1} xs={12}>
                  <FormControl size="small">
                    <Button
                      variant="contained"
                      color="success"
                      type="button"
                      onClick={handleSubmitWorkSubmit}
                      sx={userStyle.Todoadd}
                    >
                      <FaPlus />
                    </Button>
                    &nbsp;
                  </FormControl>
                </Grid>
                <br />
              </Grid>
              <br />
              <br />
              <br />
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Work History Details{" "}
              </Typography>
              <br />
              {/* ****** Table start ****** */}
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  id="branch"
                  // ref={tableRef}
                >
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                      <StyledTableCell align="center">
                        Employee Name
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Designation
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Joined On
                      </StyledTableCell>
                      <StyledTableCell align="center">Leave On</StyledTableCell>
                      <StyledTableCell align="center">Duties</StyledTableCell>
                      <StyledTableCell align="center">
                        Reason for Leaving
                      </StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {workhistTodo &&
                      workhistTodo?.map((todo, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {sno++}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {todo.empNameTodo}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.desigTodo}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {moment(todo.joindateTodo).format("DD-MM-YYYY")}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {moment(todo.leavedateTodo).format("DD-MM-YYYY")}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.dutiesTodo}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.reasonTodo}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={() => handleWorkHisDelete(index)}
                                sx={userStyle.Todoadd}
                              >
                                <AiOutlineClose />
                              </Button>
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <br />
          </Grid>

          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                onClick={prevStep}
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Previous
              </Button>
              <Button
                className="next"
                variant="contained"
                size="small"
                onClick={nextStepLog}
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Next
              </Button>

              <Link
                to="/internlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                size="small"
                sx={{
                  ...userStyle.btncancel,
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
              >
                {" "}
                Draft{" "}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  //bankdetails

  //bank name options
  const accounttypes = [
    { value: "ALLAHABAD BANK - AB", label: "ALLAHABAD BANK - AB" },
    { value: "ANDHRA BANK - ADB", label: "ANDHRA BANK - ADB" },
    { value: "AXIS BANK - AXIS", label: "AXIS BANK - AXIS" },
    { value: "STATE BANK OF INDIA - SBI", label: "STATE BANK OF INDIA - SBI" },
    { value: "BANK OF BARODA - BOB", label: "BANK OF BARODA - BOB" },
    { value: "CITY UNION BANK - CUB", label: "CITY UNION BANK - CUB" },
    { value: "UCO BANK - UCO", label: "UCO BANK - UCO" },
    { value: "UNION BANK OF INDIA - UBI", label: "UNION BANK OF INDIA - UBI" },
    { value: "BANK OF INDIA - BOI", label: "BANK OF INDIA - BOI" },
    {
      value: "BANDHAN BANK LIMITED - BBL",
      label: "BANDHAN BANK LIMITED - BBL",
    },
    { value: "CANARA BANK - CB", label: "CANARA BANK - CB" },
    { value: "GRAMIN VIKASH BANK - GVB", label: "GRAMIN VIKASH BANK - GVB" },
    { value: "CORPORATION BANK - CORP", label: "CORPORATION BANK - CORP" },
    { value: "INDIAN BANK - IB", label: "INDIAN BANK - IB" },
    {
      value: "INDIAN OVERSEAS BANK - IOB",
      label: "INDIAN OVERSEAS BANK - IOB",
    },
    {
      value: "ORIENTAL BANK OF COMMERCE - OBC",
      label: "ORIENTAL BANK OF COMMERCE - OBC",
    },
    {
      value: "PUNJAB AND SIND BANK - PSB",
      label: "PUNJAB AND SIND BANK - PSB",
    },
    {
      value: "PUNJAB NATIONAL BANK - PNB",
      label: "PUNJAB NATIONAL BANK - PNB",
    },
    {
      value: "RESERVE BANK OF INDIA - RBI",
      label: "RESERVE BANK OF INDIA - RBI",
    },
    { value: "SOUTH INDIAN BANK - SIB", label: "SOUTH INDIAN BANK - SIB" },
    {
      value: "UNITED BANK OF INDIA - UBI",
      label: "UNITED BANK OF INDIA - UBI",
    },
    {
      value: "CENTRAL BANK OF INDIA - CBI",
      label: "CENTRAL BANK OF INDIA - CBI",
    },
    { value: "VIJAYA BANK - VB", label: "VIJAYA BANK - VB" },
    { value: "DENA BANK - DEN", label: "DENA BANK - DEN" },
    {
      value: "BHARATIYA MAHILA BANK LIMITED - BMB",
      label: "BHARATIYA MAHILA BANK LIMITED - BMB",
    },
    { value: "FEDERAL BANK - FB", label: "FEDERAL BANK - FB" },
    { value: "HDFC BANK - HDFC", label: "HDFC BANK - HDFC" },
    { value: "ICICI BANK - ICICI", label: "ICICI BANK - ICICI" },
    { value: "IDBI BANK - IDBI", label: "IDBI BANK - IDBI" },
    { value: "PAYTM BANK - PAYTM", label: "PAYTM BANK - PAYTM" },
    { value: "FINO PAYMENT BANK - FINO", label: "FINO PAYMENT BANK - FINO" },
    { value: "INDUSIND BANK - IIB", label: "INDUSIND BANK - IIB" },
    { value: "KARNATAKA BANK - KBL", label: "KARNATAKA BANK - KBL" },
    {
      value: "KOTAK MAHINDRA BANK - KOTAK",
      label: "KOTAK MAHINDRA BANK - KOTAK",
    },
    { value: "YES BANK - YES", label: "YES BANK - YES" },
    { value: "SYNDICATE BANK - SYN", label: "SYNDICATE BANK - SYN" },
    { value: "BANK OF MAHARASHTRA - BOM", label: "BANK OF MAHARASHTRA - BOM" },
    { value: "DCB BANK - DCB", label: "DCB BANK - DCB" },
    { value: "IDFC BANK - IDFC", label: "IDFC BANK - IDFC" },
    {
      value: "JAMMU AND KASHMIR BANK - J&K",
      label: "JAMMU AND KASHMIR BANK - J&K",
    },
    { value: "KARUR VYSYA BANK - KVB", label: "KARUR VYSYA BANK - KVB" },
    { value: "RBL BANK - RBL", label: "RBL BANK - RBL" },
    { value: "DHANLAXMI BANK - DLB", label: "DHANLAXMI BANK - DLB" },
    { value: "CSB BANK - CSB", label: "CSB BANK - CSB" },
    {
      value: "TAMILNAD MERCANTILE BANK - TMB",
      label: "TAMILNAD MERCANTILE BANK - TMB",
    },
  ];

  const [bankTodo, setBankTodo] = useState([]);

  const handleBankTodoChange = (index, field, value) => {
    const updatedBankTodo = [...bankTodo];
    updatedBankTodo[index] = { ...updatedBankTodo[index], [field]: value };
    setBankTodo(updatedBankTodo);
  };

  const deleteTodoEdit = (index) => {
    setBankTodo(bankTodo.filter((_, i) => i !== index));
  };

  const [bankUpload, setBankUpload] = useState([]);

  const handleBankDetailsUpload = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    if (file) {
      if (file.size < maxFileSize) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          setBankUpload([
            {
              name: file.name,
              preview: reader.result,
              data: base64String,
            },
          ]);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"File size is greater than 1MB, please upload a file below 1MB."}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleBankTodoChangeProof = (e, index) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    if (file) {
      if (file.size < maxFileSize) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const updatedBankTodo = [...bankTodo];
          const base64String = reader.result.split(",")[1];

          updatedBankTodo[index] = {
            ...updatedBankTodo[index],
            proof: [
              {
                name: file.name,
                preview: reader.result,
                data: base64String,
              },
            ],
          };

          setBankTodo(updatedBankTodo);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"File size is greater than 1MB, please upload a file below 1MB."}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } else {
      console.error("No file selected");
    }
  };

  const handleDeleteProof = (index) => {
    setBankTodo((prevArray) => {
      const newArray = [...prevArray];
      newArray[index].proof = [];
      return newArray;
    });
  };

  const handleBankTodo = () => {
    let newObject = {
      bankname: employee.bankname,
      bankbranchname: employee.bankbranchname,
      accountholdername: employee.accountholdername,
      accountnumber: employee.accountnumber,
      ifsccode: employee.ifsccode,
      accounttype: employee.accounttype,
      accountstatus: employee.accountstatus,
      proof: bankUpload,
    };

    const isValidObject = (obj) => {
      for (let key in obj) {
        if (
          obj[key] === "" ||
          obj[key] === undefined ||
          obj[key] === null ||
          obj[key] === "Please Select Account Type"
        ) {
          return false;
        }
      }
      return true;
    };

    const exists = bankTodo.some(
      (obj) => obj.accountnumber === newObject.accountnumber
    );
    const activeexists = bankTodo.some((obj) => obj.accountstatus === "Active");
    if (!isValidObject(newObject)) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please fill all the Fields!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (exists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Account Number Already Exist!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (employee.accountstatus === "Active" && activeexists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Only one active account is allowed at a time.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      setBankTodo((prevState) => [...prevState, newObject]);
      setEmployee((prev) => ({
        ...prev,
        bankname: "ICICI BANK - ICICI",
        bankbranchname: "",
        accountholdername: "",
        accountnumber: "",
        ifsccode: "",
        accounttype: "Please Select Account Type",
        accountstatus: "In-Active",
      }));
      setBankUpload([]);
    }
  };

  const [bankDetails, setBankDetails] = useState(null);
  const [ifscModalOpen, setIfscModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert small alphabets to capital letters
    const capitalizedValue = value.toUpperCase();

    // Validate input to allow only capital letters and numbers
    const regex = /^[A-Z0-9]*$/;
    if (!regex.test(capitalizedValue)) {
      // If the input contains invalid characters, do not update the state
      return;
    }

    // Validate length of IFSC code (should be 11 characters)
    if (name === "ifscCode" && capitalizedValue.length > 11) {
      // If the IFSC code is longer than 11 characters, truncate it
      setEmployee({
        ...employee,
        [name]: capitalizedValue.slice(0, 11),
      });
    } else {
      setEmployee({
        ...employee,
        [name]: capitalizedValue,
      });
    }
  };

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://ifsc.razorpay.com/${employee.ifscCode}`
      );
      if (response.status === 200) {
        setBankDetails(response.data);
        setLoading(false);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Bank Details Not Found!
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleModalClose = () => {
    setIfscModalOpen(false);
    // setEmployee({
    //   ...employee,
    //   ifscCode: '', // Reset the IFSC code field
    // });
    setBankDetails(null); // Reset bank details
  };

  const handleModalOpen = () => {
    setIfscModalOpen(true);
  };

  // accessibele

  const [accessible, setAccessible] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    responsibleperson: companycaps,
  });

  const typeofaccount = [
    { label: "Savings", value: "Savings" },
    { label: "Salary", value: "Salary" },
  ];

  const accountstatus = [
    { label: "Active", value: "Active" },
    { label: "In-Active", value: "In-Active" },
  ];

  // salary setup start

  const ModeOpt = [
    { label: "Manual", value: "Manual" },
    { label: "Auto", value: "Auto" },
  ];

  const [salarySetUpForm, setSalarysetupForm] = useState({
    mode: "Auto",
    empcode: "",
    employeename: "",
    salarycode: "Please Select Salary Code",
  });
  const [isActive, setIsActive] = useState(false);
  const [Ctc, setCtc] = useState("");
  const [formValue, setFormValue] = useState({
    esideduction: false,
    pfdeduction: false,
  });

  const currentDateAttStatus = new Date();
  const currentYearAttStatus = currentDateAttStatus.getFullYear();
  // get current month in string name
  const monthstring = [
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
  const currentMonthIndex = new Date().getMonth();
  const currentMonthObject = {
    label: monthstring[currentMonthIndex],
    value: currentMonthIndex + 1,
  };
  const currentYearObject = {
    label: currentYearAttStatus,
    value: currentYearAttStatus,
  };
  const years = Array.from(
    new Array(20),
    (val, index) => currentYearAttStatus - 5 + index
  );
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  //get all months
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const [isMonthyear, setIsMonthYear] = useState({
    startMonth: currentMonthObject?.label,
    startMonthValue: currentMonthObject?.value,
    startYear: currentYearObject?.value,
  });

  //change form
  const handleChangeGross = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        gross: inputValue,
        basic: "",
        hra: "",
        conveyance: "",
        medicalallowance: "",
        productionallowance: "",
        productionallowancetwo: "",
        otherallowance: "",
      });
    }
  };

  //change form
  const handleChangeBasic = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        basic: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeHra = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        hra: e.target.value,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeConveyance = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        conveyance: e.target.value,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };
  //change form
  const handleChangeMedAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        medicalallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.basic) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        productionallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllowtwo = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        productionallowancetwo: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.otherallowance),
      });
    }
  };
  //change form
  const handleChangeOtherAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;

    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        otherallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo),
      });
    }
  };
  const [salarySlabOpt, setSalarySlabOpt] = useState([]);

  //get all client user id.
  const fetchProfessionalTax = async (process, salarycode) => {
    try {
      let res_freq = await axios.get(SERVICE.SALARYSLAB_PROCESS_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        process: process,
      });
      const OptSlaball = res_freq?.data?.salaryslab;
      const OptSlab = res_freq?.data?.salaryslab.filter((slab) => {
        return slab.salarycode === salarycode;
      });

      setSalarySlabOpt(OptSlaball);
      setFormValue(OptSlab[0]);
      setCtc(
        OptSlab[0].basic +
          OptSlab[0].hra +
          OptSlab[0].conveyance +
          OptSlab[0].medicalallowance +
          OptSlab[0].productionallowance +
          OptSlab[0].productionallowancetwo +
          OptSlab[0].otherallowance
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Accessible Company/Branch/unit

  const [accessibleTodo, setAccessibleTodo] = useState([]);

  const handleAccessibleBranchTodoChange = (index, changes) => {
    const updatedTodo = [...accessibleTodo];
    updatedTodo[index] = { ...updatedTodo[index], ...changes };
    setAccessibleTodo(updatedTodo);
  };

  const handleAccessibleBranchTodo = () => {
    let newObject = {
      fromcompany: accessible.company,
      frombranch: accessible.branch,
      fromunit: accessible.unit,
      companycode: accessible.companycode,
      branchcode: accessible.branchcode,
      unitcode: accessible.unitcode,
      branchemail: accessible.branchemail,
      branchaddress: accessible.branchaddress,
      branchstate: accessible.branchstate,
      branchcity: accessible.branchcity,
      branchcountry: accessible.branchcountry,
      branchpincode: accessible.branchpincode,

      company: selectedCompany,
      branch: selectedBranch,
      unit: selectedUnit,
      employee: companycaps,
      empcode: String(
        employee.wordcheck === false
          ? getDepartment === "Internship"
            ? newval1
            : newval
          : employee.empcode
      ),
    };

    const exists = accessibleTodo.some(
      (obj) =>
        obj.fromcompany === newObject.fromcompany &&
        obj.frombranch === newObject.frombranch &&
        obj.fromunit === newObject.fromunit
    );
    if (accessible?.company === "Please Select Company") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Company!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (accessible?.branch === "Please Select Branch") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Branch!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (accessible?.branch === "Please Select Unit") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Unit!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (exists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Todo Already Exist!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      setAccessibleTodo((prevState) => [...prevState, newObject]);
      setAccessible({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        responsibleperson: companycaps,
        companycode: "",
        branchcode: "",
        unitcode: "",
        branchemail: "",
        branchaddress: "",
        branchstate: "",
        branchcity: "",
        branchcountry: "",
        branchpincode: "",
      });
    }
  };

  const deleteAccessibleBranchTodo = (index) => {
    setAccessibleTodo(accessibleTodo.filter((_, i) => i !== index));
  };

  const renderStepSix = () => {
    return (
      <>
        <Headtitle title={"INTERN CREATE"} />
        {/* <form onSubmit={ (e) =>  }> */}
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.dialogbox}>
              <Typography sx={userStyle.SubHeaderText}>
                Bank Details{" "}
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Bank Name</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accounttypes}
                      placeholder="Please Choose Bank Name"
                      value={{
                        label: employee.bankname,
                        value: employee.bankname,
                      }}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          bankname: e.value,
                          bankbranchname: "",
                          accountholdername: "",
                          accountnumber: "",
                          ifsccode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch Name
                      <span
                        style={{
                          display: "inline",
                          fontSize: "0.8rem",
                          color: "blue",
                          textDecoration: "underline",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                        onClick={handleModalOpen}
                      >
                        {"(Get By IFSC Code)"}
                      </span>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Bank Branch Name"
                      name="bankbranchname"
                      value={employee.bankbranchname}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          bankbranchname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Account Holder Name</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Account Name"
                      value={employee.accountholdername}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          accountholdername: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Account Number</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Account Number"
                      value={employee.accountnumber}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          accountnumber: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>IFSC Code</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter IFSC Code"
                      value={employee.ifsccode}
                      onChange={(e) => {
                        setEmployee({ ...employee, ifsccode: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Type of Account</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={typeofaccount}
                      placeholder="Please Choose Account Type"
                      value={{
                        label: employee.accounttype,
                        value: employee.accounttype,
                      }}
                      onChange={(e) => {
                        setEmployee({ ...employee, accounttype: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} sm={8} xs={8}>
                  <FormControl fullWidth size="small">
                    <Typography>Status</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accountstatus}
                      placeholder="Please Select Status"
                      value={{
                        label: employee.accountstatus,
                        value: employee.accountstatus,
                      }}
                      onChange={(e) => {
                        setEmployee({ ...employee, accountstatus: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      md={2}
                      sm={8}
                      xs={8}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // marginTop: "10%",
                      }}
                    >
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10%",
                          height: "25px",
                        }}
                      >
                        Upload
                        <input
                          accept="image/*,application/pdf"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            handleBankDetailsUpload(e);
                          }}
                        />
                      </Button>
                    </Grid>
                    {bankUpload?.length > 0 && (
                      <Grid
                        item
                        md={5}
                        sm={8}
                        xs={8}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // marginTop: "10%",
                        }}
                      >
                        {bankUpload?.length > 0 &&
                          bankUpload.map((file) => (
                            <>
                              <Grid container spacing={2}>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                  <Typography
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: "100%",
                                    }}
                                    title={file.name}
                                  >
                                    {file.name}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  />
                                </Grid>
                                <br />
                                <br />
                                <Grid item md={2} sm={1} xs={1}>
                                  <Button
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                      marginTop: "-5px",
                                    }}
                                    onClick={() => setBankUpload([])}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                      </Grid>
                    )}

                    <Grid item md={1} sm={8} xs={8}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleBankTodo}
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
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              {bankTodo.map((data, index) => (
                <div key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${
                        index + 1
                      }`}</Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bank Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={accounttypes}
                          placeholder="Please Select Bank Name"
                          value={{ label: data.bankname, value: data.bankname }}
                          onChange={(e) => {
                            handleBankTodoChange(index, "bankname", e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bank Branch Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={data.bankbranchname}
                          placeholder="Please Enter Bank Branch Name"
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "bankbranchname",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Account Holder Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={data.accountholdername}
                          placeholder="Please Enter Account Holder Name"
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "accountholdername",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Account Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={data.accountnumber}
                          placeholder="Please Enter Account Number"
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "accountnumber",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          IFSC Code<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={data.ifsccode}
                          placeholder="Please Enter IFSC Code"
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "ifsccode",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Type of Account</Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={typeofaccount}
                          placeholder="Please Choose Account Type"
                          value={{
                            label: data.accounttype,
                            value: data.accounttype,
                          }}
                          onChange={(e) => {
                            handleBankTodoChange(index, "accounttype", e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Status</Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={accountstatus}
                          placeholder="Please Choose Status"
                          value={{
                            label: data.accountstatus,
                            value: data.accountstatus,
                          }}
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "accountstatus",
                              e.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                      <Grid container spacing={2}>
                        <Grid
                          item
                          md={2}
                          sm={8}
                          xs={8}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // marginTop: "10%",
                          }}
                        >
                          <Button
                            variant="contained"
                            component="label"
                            size="small"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "10%",
                              height: "25px",
                            }}
                          >
                            Upload
                            <input
                              accept="image/*,application/pdf"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                handleBankTodoChangeProof(e, index);
                              }}
                            />
                          </Button>
                        </Grid>
                        {data?.proof?.length > 0 && (
                          <Grid
                            item
                            md={5}
                            sm={8}
                            xs={8}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // marginTop: "10%",
                            }}
                          >
                            {data?.proof?.length > 0 &&
                              data?.proof.map((file) => (
                                <>
                                  <Grid container spacing={2}>
                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                      <Typography
                                        style={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          maxWidth: "100%",
                                        }}
                                        title={file.name}
                                      >
                                        {file.name}
                                      </Typography>
                                    </Grid>
                                    <Grid item lg={1} md={2} sm={1} xs={1}>
                                      <VisibilityOutlinedIcon
                                        style={{
                                          fontsize: "large",
                                          color: "#357AE8",
                                          cursor: "pointer",
                                          marginLeft: "-7px",
                                        }}
                                        onClick={() => renderFilePreview(file)}
                                      />
                                    </Grid>
                                    <br />
                                    <br />
                                    <Grid item lg={2} md={2} sm={1} xs={1}>
                                      <Button
                                        style={{
                                          fontsize: "large",
                                          color: "#357AE8",
                                          cursor: "pointer",
                                          marginTop: "-5px",
                                        }}
                                        onClick={() => handleDeleteProof(index)}
                                      >
                                        <DeleteIcon />
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              ))}
                          </Grid>
                        )}

                        <Grid item md={1} sm={8} xs={8}>
                          <Button
                            variant="contained"
                            color="error"
                            type="button"
                            onClick={() => deleteTodoEdit(index)}
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
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                </div>
              ))}
            </Box>
            <br />
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={5} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Exp Log Details{" "}
                  </Typography>
                </Grid>
                {migrateData && from && (
                  <Grid item md={3} xs={0} sm={4}>
                    <>
                      <Button
                        // className="next"
                        variant="contained"
                        onClick={() => handleClickOpenEdit()}
                      >
                        Salary Fix
                      </Button>
                    </>
                  </Grid>
                )}
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
                        handleSalaryfix(
                          loginNotAllot.process,
                          e.value,
                          employee?.doj,
                          assignExperience.assignExpMode,
                          assignExperience.assignExpvalue,
                          assignExperience.assignEndExpvalue,
                          assignExperience.assignEndExpDate,
                          assignExperience.assignEndTarvalue,
                          assignExperience.assignEndTarDate
                        );
                        setIsmigrate("");
                        setAssignExperience({
                          ...assignExperience,
                          updatedate: e.value,
                        });
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
                        handleSalaryfix(
                          loginNotAllot.process,
                          assignExperience.updatedate,
                          employee?.doj,
                          e.value,
                          assignExperience.assignExpvalue,

                          assignExperience.assignEndExpvalue,
                          assignExperience.assignEndExpDate,
                          assignExperience.assignEndTarvalue,
                          assignExperience.assignEndTarDate
                          //  assignExperience.assignEndTar
                        );

                        setAssignExperience({
                          ...assignExperience,
                          assignExpMode: e.value,
                          assignExpvalue: e.value === "Auto Increment" ? 0 : "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {assignExperience.assignExpMode === "Please Select Mode" ? (
                  ""
                ) : (
                  <>
                    {assignExperience.assignExpMode === "Exp Stop" ||
                    assignExperience.assignExpMode === "Target Stop" ? (
                      <Grid item md={4} xs={12} sm={4}>
                        <FormControl fullWidth>
                          <Typography>Value (In Months)</Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={valueOpt}
                            value={{
                              label: assignExperience.assignExpvalue,
                              value: assignExperience.assignExpvalue,
                            }}
                            onChange={(e) => {
                              handleSalaryfix(
                                loginNotAllot.process,
                                assignExperience.updatedate,
                                employee?.doj,
                                assignExperience.assignExpMode,
                                e.value,
                                assignExperience.assignEndExpvalue,
                                assignExperience.assignEndExpDate,
                                assignExperience.assignEndTarvalue,
                                assignExperience.assignEndTarDate
                              );
                              setAssignExperience({
                                ...assignExperience,
                                assignExpvalue: e.value,
                              });
                            }}
                          />
                        </FormControl>
                        {errorsLog.value && <div>{errorsLog.value}</div>}
                      </Grid>
                    ) : (
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
                              assignExperience.assignExpMode ===
                              "Auto Increment"
                            }
                            value={assignExperience.assignExpvalue}
                            onChange={(e) => {
                              handleSalaryfix(
                                loginNotAllot.process,
                                assignExperience.updatedate,
                                employee?.doj,
                                assignExperience.assignExpMode,
                                e.target.value,
                                assignExperience.assignEndExpvalue,
                                assignExperience.assignEndExpDate,
                                assignExperience.assignEndTarvalue,
                                assignExperience.assignEndTarDate
                              );
                              setAssignExperience({
                                ...assignExperience,
                                assignExpvalue: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                        {errorsLog.value && <div>{errorsLog.value}</div>}
                      </Grid>
                    )}
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
                      // onChange={(e) => {
                      //   setAssignExperience({
                      //     ...assignExperience,
                      //     assignEndExp: e.value,
                      //   });
                      // }}
                    />
                  </FormControl>
                </Grid>
                {assignExperience.assignEndExp === "Please Select Mode" ? (
                  ""
                ) : (
                  <>
                    {assignExperience.assignEndExp === "Exp Stop" ? (
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
                              handleSalaryfix(
                                loginNotAllot.process,
                                assignExperience.updatedate,
                                employee?.doj,
                                assignExperience.assignExpMode,
                                assignExperience.assignExpvalue,

                                e.value,
                                assignExperience.assignEndExpDate,
                                assignExperience.assignEndTarvalue,
                                assignExperience.assignEndTarDate
                                //  assignExperience.assignEndTar
                              );
                              setAssignExperience({
                                ...assignExperience,
                                assignEndExpvalue: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    ) : (
                      <Grid item md={3} xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                          <Typography>End Tar</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Select"
                            value={
                              assignExperience.assignEndExpvalue ===
                              "Please Select"
                                ? ""
                                : assignExperience.assignEndExpvalue
                            }
                            onChange={(e) => {
                              setAssignExperience({
                                ...assignExperience,
                                assignEndExpvalue: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    )}
                  </>
                )}

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
                          handleSalaryfix(
                            loginNotAllot.process,
                            assignExperience.updatedate,
                            employee?.doj,
                            assignExperience.assignExpMode,
                            assignExperience.assignExpvalue,

                            assignExperience.assignEndExpvalue,
                            e.value,
                            assignExperience.assignEndTarvalue,
                            assignExperience.assignEndTarDate
                            //  assignExperience.assignEndTar
                          );
                          setAssignExperience({
                            ...assignExperience,
                            assignEndExpDate: e.value,
                          });
                        }}
                      />
                      {errorsLog.endexpdate && (
                        <div>{errorsLog.endexpdate}</div>
                      )}
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
                      // onChange={(e) => {
                      //   setAssignExperience({
                      //     ...assignExperience,
                      //     assignExpMode: e.value,
                      //     assignExpvalue: "Please Select Value (In Months)",
                      //     assignExpDate: "",
                      //   });
                      // }}
                    />
                  </FormControl>
                </Grid>
                {assignExperience.assignEndTar === "Please Select Mode" ? (
                  ""
                ) : (
                  <>
                    {assignExperience.assignEndTar === "Target Stop" ? (
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
                              handleSalaryfix(
                                loginNotAllot.process,
                                assignExperience.updatedate,
                                employee?.doj,
                                assignExperience.assignExpMode,
                                assignExperience.assignExpvalue,

                                assignExperience.assignEndExpvalue,
                                assignExperience.assignEndExpDate,
                                e.value,
                                assignExperience.assignEndTarDate
                                //  assignExperience.assignEndTar
                              );
                              setAssignExperience({
                                ...assignExperience,
                                assignEndTarvalue: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    ) : (
                      <Grid item md={3} xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                          <Typography>Value (In Months)</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter "
                            value={
                              assignExperience.assignEndTarvalue ===
                              "Please Select "
                                ? ""
                                : assignExperience.assignEndTarvalue
                            }
                            onChange={(e) => {
                              handleSalaryfix(
                                loginNotAllot.process,
                                assignExperience.updatedate,
                                employee?.doj,
                                assignExperience.assignExpMode,
                                assignExperience.assignExpvalue,

                                assignExperience.assignEndExpvalue,
                                assignExperience.assignEndExpDate,
                                e.target.value,
                                assignExperience.assignEndTarDate
                                //  assignExperience.assignEndTar
                              );
                              setAssignExperience({
                                ...assignExperience,
                                assignEndTarvalue: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    )}
                  </>
                )}

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
                          handleSalaryfix(
                            loginNotAllot.process,
                            assignExperience.updatedate,
                            employee?.doj,
                            assignExperience.assignExpMode,
                            assignExperience.assignExpvalue,

                            assignExperience.assignEndExpvalue,
                            assignExperience.assignEndExpDate,
                            assignExperience.assignEndTarvalue,
                            e.value
                          );
                          setAssignExperience({
                            ...assignExperience,
                            assignEndTarDate: e.value,
                          });
                        }}
                      />
                      {errorsLog.endtardate && (
                        <div>{errorsLog.endtardate}</div>
                      )}
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <br />
            </Box>
            <br />
            <Box sx={userStyle.dialogbox}>
              <>
                <Grid container spacing={1}>
                  <Grid item md={5} xs={0} sm={4}>
                    <Typography sx={userStyle.SubHeaderText}>
                      Salary Setup{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mode<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        styles={colourStyles}
                        options={ModeOpt}
                        value={{
                          label: salarySetUpForm.mode,
                          value: salarySetUpForm.mode,
                        }}
                        onChange={(e) => {
                          setSalarysetupForm({
                            ...salarySetUpForm,
                            mode: e.value,
                            salarycode: e.value == "Manual" ? "MANUAL" : "",
                          });
                          if (e.value === "Auto") {
                            setIsActive(true);
                            setFormValue({
                              ...formValue,
                              gross: "",
                              basic: "",
                              hra: "",
                              conveyance: "",
                              medicalallowance: "",
                              productionallowance: "",
                              productionallowancetwo: "",
                              otherallowance: "",
                            });
                            setCtc("");
                          } else {
                            setIsActive(false);
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={3}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography>
                      Date<b style={{ color: "red" }}>*</b>
                    </Typography>
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
                        options={expDptDates
                          .filter((d) => d.department === employee?.department)
                          .map((item) => ({
                            ...item,
                            label: item.fromdate,
                            value: item.fromdate,
                          }))}
                        value={{
                          label: formValue.startDate ?? "Please Select Date",
                          value: formValue.startDate ?? "Please Select Date",
                        }}
                        onChange={(e) => {
                          const mondatefilter = e?.value?.split("-");
                          const getmonth =
                            mondatefilter[1] === "12"
                              ? "December"
                              : mondatefilter[1] === "11"
                              ? "November"
                              : mondatefilter[1] === "10"
                              ? "October"
                              : mondatefilter[1] === "09"
                              ? "September"
                              : mondatefilter[1] === "9"
                              ? "September"
                              : mondatefilter[1] === "08"
                              ? "August"
                              : mondatefilter[1] === "8"
                              ? "August"
                              : mondatefilter[1] === "07"
                              ? "July"
                              : mondatefilter[1] === "7"
                              ? "July"
                              : mondatefilter[1] === "06"
                              ? "June"
                              : mondatefilter[1] === "6"
                              ? "June"
                              : mondatefilter[1] === "05"
                              ? "May"
                              : mondatefilter[1] === "5"
                              ? "May"
                              : mondatefilter[1] === "04"
                              ? "April"
                              : mondatefilter[1] === "4"
                              ? "April"
                              : mondatefilter[1] === "03"
                              ? "March"
                              : mondatefilter[1] === "3"
                              ? "March"
                              : mondatefilter[1] === "02"
                              ? "February"
                              : mondatefilter[1] === "2"
                              ? "February"
                              : mondatefilter[1] === "01"
                              ? "January"
                              : mondatefilter[1] === "1"
                              ? "January"
                              : "";
                          setFormValue({
                            ...formValue,
                            startmonthlabel: getmonth,
                            startmonth: mondatefilter[1],
                            startyear: mondatefilter[0],
                            startDate: e.value,
                          });
                        }}
                      />
                    </FormControl>
                    {accessibleErrors.startdate && (
                      <div>{accessibleErrors.startdate}</div>
                    )}
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    {salarySetUpForm.mode === "Manual" ? (
                      <FormControl fullWidth size="small">
                        <Typography>
                          Salary Code <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Salary Code"
                          value={salarySetUpForm.salarycode}
                        />
                      </FormControl>
                    ) : (
                      <FormControl fullWidth size="small">
                        <Typography>Salary Code</Typography>
                        <Selects
                          isDisabled
                          options={salarySlabOpt
                            .filter(
                              (item) =>
                                item.processqueue === loginNotAllot.process
                            )
                            .map((sc) => ({
                              ...sc,
                              value: sc.salarycode,
                              label: sc.salarycode,
                            }))}
                          value={{
                            label: salarySetUpForm.salarycode,
                            value: salarySetUpForm.salarycode,
                          }}
                          onChange={(e) => {
                            setSalarysetupForm({
                              ...salarySetUpForm,
                              salarycode: e.value,
                            });
                            fetchProfessionalTax(e.process, e.value);
                          }}
                        />
                      </FormControl>
                    )}
                  </Grid>
                  {/* {salarySetUpForm.mode === "Manual" && ( */}
                  <>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Start Month <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Salary Code"
                          value={formValue.startmonthlabel}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Start Year <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Salary Code"
                          value={formValue.startyear}
                        />
                      </FormControl>
                    </Grid>
                  </>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Gross Salary <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        disabled={salarySetUpForm.mode === "Auto"}
                        placeholder="Please Enter Gross"
                        value={formValue.gross}
                        onChange={handleChangeGross}
                      />
                    </FormControl>
                    {salarySetUpForm.mode === "Manual" &&
                      accessibleErrors.grosssalary && (
                        <div>{accessibleErrors.grosssalary}</div>
                      )}
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Basic</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        disabled={salarySetUpForm.mode === "Auto"}
                        placeholder="Please Enter Basic"
                        value={formValue.basic}
                        onChange={handleChangeBasic}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>HRA</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        disabled={salarySetUpForm.mode === "Auto"}
                        placeholder="Please Enter HRA"
                        value={formValue.hra}
                        onChange={handleChangeHra}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Conveyance</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        disabled={salarySetUpForm.mode === "Auto"}
                        placeholder="Please Enter Conveyance"
                        value={formValue.conveyance}
                        onChange={handleChangeConveyance}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Medical Allowance</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        disabled={salarySetUpForm.mode === "Auto"}
                        placeholder="Please Enter Medical Allowance"
                        value={formValue.medicalallowance}
                        onChange={handleChangeMedAllow}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Production Allowance</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        disabled={salarySetUpForm.mode === "Auto"}
                        placeholder="Please Enter Production Allowance"
                        value={formValue.productionallowance}
                        onChange={handleChangeProdAllow}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Production Allowance 2</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        disabled={salarySetUpForm.mode === "Auto"}
                        placeholder="Please Enter Production Allowance 2"
                        value={formValue.productionallowancetwo}
                        onChange={handleChangeProdAllowtwo}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Other Allowance</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        disabled={salarySetUpForm.mode === "Auto"}
                        placeholder="Please Enter Other Allowance"
                        value={formValue.otherallowance}
                        onChange={handleChangeOtherAllow}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}></Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        sx={{ height: "20", padding: "0  25px" }}
                        checked={formValue.esideduction}
                        disabled={salarySetUpForm.mode === "Auto"}
                        onChange={(e) => {
                          setFormValue({
                            ...formValue,
                            esideduction: e.target.checked,
                          });
                        }}
                      />
                      <Typography>ESI Deduction</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        sx={{ height: "20", padding: "0  25px" }}
                        checked={formValue.pfdeduction}
                        disabled={salarySetUpForm.mode === "Auto"}
                        onChange={(e) => {
                          setFormValue({
                            ...formValue,
                            pfdeduction: e.target.checked,
                          });
                        }}
                      />
                      <Typography>PF Deduction</Typography>
                    </FormControl>
                  </Grid>
                </Grid>
              </>
            </Box>
            <br />

            {/* process details add */}
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={8} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Process Allot{" "}
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Process <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={Array.from(
                        new Set(
                          ProcessOptions?.filter(
                            (comp) => selectedTeam === comp.team
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
                        setIsmigrate("");

                        handleSalaryfix(
                          e.value,
                          assignExperience.updatedate,
                          employee?.doj,
                          assignExperience.assignExpMode,
                          assignExperience.assignExpvalue,

                          assignExperience.assignEndExpvalue,
                          assignExperience.assignEndExpDate,
                          assignExperience.assignEndTarvalue,
                          assignExperience.assignEndTarDate
                          //  assignExperience.assignEndTar
                        );
                        setLoginNotAllot({
                          ...loginNotAllot,
                          process: e.value,
                        });
                      }}
                    />
                  </FormControl>
                  {accessibleErrors.process && (
                    <div>{accessibleErrors.process}</div>
                  )}
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Process Type <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={processTypes}
                      value={{
                        label: loginNotAllot.processtype,
                        value: loginNotAllot.processtype,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          processtype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Process Duration <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={processDuration}
                      value={{
                        label: loginNotAllot.processduration,
                        value: loginNotAllot.processduration,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          processduration: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
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
                    {accessibleErrors.duration && (
                      <div>{accessibleErrors.duration}</div>
                    )}
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Gross Salary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      // placeholder="Please Enter IFSC Code"
                      value={overallgrosstotal}
                      // onChange={(e) => {
                      //   setEmployee({ ...employee, ifsccode: e.target.value });
                      // }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Mode Experience</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      // placeholder="Please Enter IFSC Code"
                      value={modeexperience}
                      // onChange={(e) => {
                      //   setEmployee({ ...employee, ifsccode: e.target.value });
                      // }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
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
                <Grid item md={3} xs={12} sm={6}>
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
              <br />
            </Box>
            <br />
            {/* Accessible Company/Branch/Unit add details */}
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={8} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Accessible Company/Branch/Unit
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={2.8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={companies.map((data) => ({
                        label: data.name,
                        value: data.name,
                        code: data.code,
                      }))}
                      styles={colourStyles}
                      value={{
                        label: accessible.company,
                        value: accessible.company,
                      }}
                      onChange={(e) => {
                        setAccessible({
                          ...accessible,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          companycode: e.code,
                          branchcode: "",
                          unitcode: "",
                          branchemail: "",
                          branchaddress: "",
                          branchstate: "",
                          branchcity: "",
                          branchcountry: "",
                          branchpincode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={branchNames
                        ?.filter((comp) => comp.company === accessible.company)
                        ?.map((data) => ({
                          label: data.name,
                          value: data.name,
                          ...data,
                        }))}
                      styles={colourStyles}
                      value={{
                        label: accessible.branch,
                        value: accessible.branch,
                      }}
                      onChange={(e) => {
                        setAccessible({
                          ...accessible,
                          branch: e.value,
                          unit: "Please Select Unit",
                          branchcode: e.code,
                          branchemail: e.email,
                          branchaddress: e.address,
                          branchstate: e.state,
                          branchcity: e.city,
                          branchcountry: e.country,
                          branchpincode: e.pincode,
                          unitcode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={unitNames
                        ?.filter(
                          (comp) =>
                            // comp.company === accessible.company &&
                            comp.branch === accessible.branch
                        )
                        ?.map((data) => ({
                          label: data.name,
                          value: data.name,
                          code: data.code,
                        }))}
                      styles={colourStyles}
                      value={{ label: accessible.unit, value: accessible.unit }}
                      onChange={(e) => {
                        setAccessible({
                          ...accessible,
                          unit: e.value,
                          unitcode: e.code,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={2.8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Responsible Person</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={companycaps}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.8} sm={8} xs={8}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAccessibleBranchTodo}
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
                </Grid>
              </Grid>
              <br />
              {accessibleTodo?.map((datas, index) => (
                <div key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${
                        index + 1
                      }`}</Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3.7} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={companies.map((data) => ({
                            label: data.name,
                            value: data.name,
                            code: data.code,
                          }))}
                          styles={colourStyles}
                          value={{
                            label: datas.fromcompany,
                            value: datas.fromcompany,
                          }}
                          onChange={(e) => {
                            handleAccessibleBranchTodoChange(index, {
                              fromcompany: e.value,
                              companycode: e.code,
                              frombranch: "Please Select Branch",
                              fromunit: "Please Select Unit",
                              branchcode: "",
                              unitcode: "",
                              branchemail: "",
                              branchaddress: "",
                              branchstate: "",
                              branchcity: "",
                              branchcountry: "",
                              branchpincode: "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.7} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={branchNames
                            ?.filter(
                              (comp) => comp.company === datas.fromcompany
                            )
                            ?.map((data) => ({
                              label: data.name,
                              value: data.name,
                              ...data,
                            }))}
                          styles={colourStyles}
                          value={{
                            label: datas.frombranch,
                            value: datas.frombranch,
                          }}
                          onChange={(e) => {
                            handleAccessibleBranchTodoChange(index, {
                              frombranch: e.value,
                              fromunit: "Please Select Unit",
                              unitcode: "",
                              branchcode: e.code,
                              branchemail: e.email,
                              branchaddress: e.address,
                              branchstate: e.state,
                              branchcity: e.city,
                              branchcountry: e.country,
                              branchpincode: e.pincode,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.7} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={unitNames
                            ?.filter(
                              (comp) =>
                                // comp.company === accessible.company &&
                                comp.branch === datas.frombranch
                            )
                            ?.map((data) => ({
                              label: data.name,
                              value: data.name,
                              code: data.code,
                            }))}
                          styles={colourStyles}
                          value={{
                            label: datas.fromunit,
                            value: datas.fromunit,
                          }}
                          onChange={(e) => {
                            handleAccessibleBranchTodoChange(index, {
                              fromunit: e.value,
                              unitcode: e.code,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={0.9} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={() => deleteAccessibleBranchTodo(index)}
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
                  </Grid>
                  <br />
                </div>
              ))}
              <br />
            </Box>
            <br />
          </Grid>

          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                onClick={prevStep}
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                // sx={buttonSx}
                size="small"
                sx={{
                  ...buttonSx,
                  textTransform: "capitalize",
                  width: "73px",
                }}
                disabled={loading}
                onClick={(e) => {
                  handleButtonClick(e);
                }}
              >
                SUBMIT
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: green[500],
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Button>

              <Link
                to="/internlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                size="small"
                sx={{
                  ...userStyle.btncancel,
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
              >
                {" "}
                Draft{" "}
              </Button>
            </Box>
          </Grid>
        </Grid>

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
                Intern Move to Live
              </Typography>
              <br />
              <Grid container spacing={2}>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      <b>Company</b>{" "}
                    </Typography>
                    <Typography>{selectedCompany} </Typography>
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={migrateData?.company}
                     
                    /> */}
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      <b>Branch</b>{" "}
                    </Typography>
                    <Typography>{selectedBranch} </Typography>
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={migrateData?.branch}
                     
                    /> */}
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      <b>Unit</b>{" "}
                    </Typography>
                    <Typography>{selectedUnit}</Typography>
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={selectedUnit}
                     
                    /> */}
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      <b>Team</b>{" "}
                    </Typography>
                    <Typography>{selectedTeam} </Typography>
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={selectedTeam}
                     
                    /> */}
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      <b>Department</b>{" "}
                    </Typography>
                    <Typography>{employee?.department} </Typography>
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={employee?.department}
                     
                    /> */}
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      <b>Designation</b>{" "}
                    </Typography>
                    <Typography>{selectedDesignation} </Typography>
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={selectedDesignation}
                     
                    /> */}
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
                                (comp) => selectedTeam === comp.team
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
                {/* <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box >
                    {isUserRoleCompare?.includes("excelarea") && (
                      <>
                        <ExportXL csvData={areaData} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvarea") && (
                      <>
                        <ExportCSV csvData={areaData} fileName={fileName} />

                      </>
                    )}
                    {isUserRoleCompare?.includes("printarea") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfarea") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagearea") && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                    )}
                  </Box >
                </Grid> */}
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
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
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
                </>
              )}
            </Box>
          </Dialog>
        </Box>

        <Box>
          <Dialog
            open={isErrorOpen}
            onClose={handleCloseerr}
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
      </>
    );
  };

  const renderIndicator = () => {
    return (
      <ul className="indicatoremployee">
        <li className={step === 1 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Personal Info
        </li>
        <li className={step === 2 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Login & Boarding Details
        </li>
        <li className={step === 3 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Address
        </li>
        <li className={step === 4 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Document
        </li>
        <li className={step === 5 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Work History
        </li>
        <li className={step === 6 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Bank Details
        </li>
      </ul>
    );
  };

  return (
    <div className="multistep-form">
      {renderIndicator()}
      {step === 1 ? renderStepOne() : null}
      {step === 2 ? renderStepTwo() : null}
      {step === 3 ? renderStepThree() : null}
      {step === 4 ? renderStepFour() : null}
      {step === 5 ? renderStepFive() : null}
      {step === 6 ? renderStepSix() : null}

      <Modal
        open={ifscModalOpen}
        onClose={handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={{
            margin: "auto",
            backgroundColor: "white",
            padding: "20px",
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Enter IFSC Code</Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <OutlinedInput
            type="text"
            placeholder="Enter IFSC Code"
            name="ifscCode"
            style={{ height: "30px", margin: "10px" }}
            value={employee.ifscCode}
            onChange={handleInputChange}
          />
          <LoadingButton
            variant="contained"
            loading={loading}
            color="primary"
            sx={{ borderRadius: "20px", marginLeft: "5px" }}
            onClick={fetchBankDetails}
          >
            Get Branch
          </LoadingButton>
          <br />
          {bankDetails && (
            <div>
              <Typography variant="subtitle1">
                Bank Name: {bankDetails.BANK}
              </Typography>
              <Typography variant="subtitle1">
                Branch Name: {bankDetails.BRANCH}
              </Typography>
              <Button
                variant="contained"
                sx={{ borderRadius: "20px", padding: "0 10px" }}
                onClick={(e) => {
                  const matchedBank = accounttypes.find((bank) => {
                    const labelBeforeHyphen = bank.label.split(" - ")[0];

                    return (
                      labelBeforeHyphen.toLowerCase()?.trim() ===
                      bankDetails.BANK.toLowerCase()?.trim()
                    );
                  });
                  setEmployee({
                    ...employee,
                    bankbranchname: String(bankDetails.BRANCH),
                    ifsccode: employee.ifscCode,
                    bankname: matchedBank?.value,
                  });
                  handleModalClose();
                }}
              >
                Submit
              </Button>
              {/* Add more details as needed */}
            </div>
          )}
        </div>
      </Modal>

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
    </div>
  );
}

export default Interncreate;
