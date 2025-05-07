import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import WarningIcon from "@mui/icons-material/Warning";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, Chip, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Popover, Select, TextField, Tooltip, Typography, } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaBox, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext, } from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import domtoimage from 'dom-to-image';

function Internlivelist() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setFilterLoader(false);
    setTableLoader(false);
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

  const [employees, setEmployees] = useState([]);
  const [deleteuser, setDeleteuser] = useState([]);
  const [useredit, setUseredit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allTeam,
    pageName,
    setPageName,
    buttonStyles,
    allUsersData,
    allUsersLimit
  } = useContext(UserRoleAccessContext);
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
      pagename: String("Intern Live List"),
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

  const [checkemployeelist, setcheckemployeelist] = useState(false);
  const { auth } = useContext(AuthContext);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Intern Live List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  let exportColumnNames = [
    "Status",
    "Empcode",
    "Employee Name",
    "Username",
    "Email",
    "Branch",
    "Unit",
    "Team",
    "Experience",
    "Doj",
    "Work Mode",
  ];
  let exportRowValues = [
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
    "workmode",
  ];

  const [fileFormat, setFormat] = useState("");
  const fileName = "Intern_live_list";

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
    workmode: true,
    checkbox: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  let userid = deleteuser?._id;

  let userId = localStorage?.LoginUserId;

  //get all employees list details
  const fetchEmployee = async () => {
    try {
      let res = await axios.post(SERVICE.USERSWITHSTATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        pageName: "Internship",
      });
      setEmployees(res?.data?.allusers);
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

  let updateby = useredit?.updatedby;
  let addedby = useredit?.addedby;

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Intern_live_list",
    pageStyle: "print",
  });

  // useEffect(() => {
  // fetchEmployee();
  // }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => {
      let lastExpLog =
        item?.assignExpLog?.length > 0
          ? item?.assignExpLog[item?.assignExpLog?.length - 1]
          : "";
      return {
        ...item,
        serialNumber: item.serialNumber,
        dob: moment(item.dob).format("DD/MM/YYYY"),
        doj: moment(item.doj).format("DD/MM/YYYY"),
        expmode: lastExpLog ? lastExpLog.expmode : "",
        expval: lastExpLog ? lastExpLog.expval : "",
        endexp: lastExpLog ? lastExpLog.endexp : "",
        endexpdate: lastExpLog ? lastExpLog.endexpdate : "",
        endtar: lastExpLog ? lastExpLog.endtar : "",
        endtardate: lastExpLog ? lastExpLog.endtardate : "",
        experience:
          (new Date().getFullYear() - new Date(item.doj).getFullYear()) * 12 +
            new Date().getMonth() -
            new Date(item.doj).getMonth() -
            (new Date(item.doj).getDate() > 2 ||
              new Date(item.doj).getDate() !== 1
              ? 1
              : 0) ==
            -1
            ? 0
            : (new Date().getFullYear() - new Date(item.doj).getFullYear()) *
            12 +
            new Date().getMonth() -
            new Date(item.doj).getMonth() -
            (new Date(item.doj).getDate() > 2 ||
              new Date(item.doj).getDate() !== 1
              ? 1
              : 0),
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employees);
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

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
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold",
    //   },
    //   sortable: false,
    //   width: 90,
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    //   pinned: "left",
    // },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      pinned: "left",

      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => renderStatus(params?.data.status),
      hide: !columnVisibility.status,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
      pinned: "left",
    },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
      pinned: "left",
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
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.workmode,
    },
  ];

  // Create a data data object for the DataGrid
  const rowDataTable = filteredData.map((item) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      status: item.status,
      empcode: item.empcode,
      firstname: item.firstname,
      lastname: item.lastname,
      legalname: item.legalname,
      Fathername: item.fathername,
      Mothername: item.mothername,
      nexttime: item.nexttime,
      companyname: item.companyname,
      username: item.username,
      email: item.email,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      workmode: item.workmode,
      shift: item.shift,
      maritalstatus: item.maritalstatus,
      gender: item.gender,
      bloodgroup: item.bloodgroup,
      location: item.location,

      contactpersonal: item.contactpersonal,
      contactfamily: item.contactfamily,
      emergencyno: item.emergencyno,

      contactno: item.contactno,
      details: item.details,
      pdoorno: item.pdoorno,
      pstreet: item.pstreet,
      parea: item.parea,
      plandmark: item.plandmark,
      ptaluk: item.ptaluk,
      ppincode: item.ppincode,
      pcountry: item.pcountry,
      pstate: item.pstate,
      pcity: item.pcity,
      cdoorno: item.cdoorno,
      cstreet: item.cstreet,
      carea: item.carea,
      clandmark: item.clandmark,
      ctaluk: item.ctaluk,
      cpost: item.cpost,
      cpincode: item.cpincode,
      ccountry: item.ccountry,
      cstate: item.cstate,
      ccity: item.ccity,
      floor: item.floor,
      department: item.department,
      shifttiming: item.shifttiming,
      reportingto: item.reportingto,
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
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

  //FILTER START
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
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
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const EmployeeStatusOptions = [
    { label: "Live Employee", value: "Live Employee" },
    { label: "Releave Employee", value: "Releave Employee" },
    { label: "Absconded", value: "Absconded" },
    { label: "Hold", value: "Hold" },
    { label: "Terminate", value: "Terminate" },
  ];
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

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
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };
  //employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state


  const [searchInputValue, setSearchInputValue] = useState('');

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Process the pasted text
    const pastedNames = pastedText
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name !== "");

    // Update the state
    updateEmployees(pastedNames);

    // Clear the search input after paste
    setSearchInputValue('');

    // Refocus the element
    e.target.focus();
  };
  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);


  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = allUsersData
      ?.filter(
        (comp) =>
          valueCompanyCat?.includes(comp.company) &&
          valueBranchCat?.includes(comp.branch) &&
          valueUnitCat?.includes(comp.unit) &&
          valueTeamCat?.includes(comp.team) &&
          comp.workmode === "Internship"
      )
      ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

    const matchedValues = namesArray.filter((name) =>
      availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
    );

    // Update selected options
    const newOptions = matchedValues.map(value => ({
      label: value,
      value: value
    }));

    setSelectedOptionsEmployee(prev => {
      const newValues = newOptions.filter(
        newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
      );
      return [...prev, ...newValues];
    });

    // Update other states...
    setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
    setValueEmployeeCat(prev => [...new Set([...prev, ...matchedValues])]);
  };
  // Handle clicks outside the Box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
      if (boxElement && !boxElement.contains(e.target)) {
        setIsBoxFocused(false); // Reset focus state if clicking outside the Box
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedOptionsEmployee((current) => current.filter(emp => emp.value !== value));
    setValueEmp((current) => current.filter(empValue => empValue !== value));
    setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
  };

  //MULTISELECT ONCHANGE END
  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]); setEmployeeOptions([]);
    setEmployees([]);

    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [filterLoader, setFilterLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const handleFilter = () => {
    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   filterState?.employeestatus === "Please Select Employee Status" ||
    //   filterState?.employeestatus === ""
    // ) {
    //   setPopupContentMalert("Please Select Employee Status!");
    //   setPopupSeverityMalert("warning");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      fetchListData();
    }
  };

  const fetchListData = async () => {
    setPageName(!pageName);
    setFilterLoader(true);
    setTableLoader(true);
    try {
      let response = await axios.post(
        SERVICE.USERSWITHSTATUS,
        {
          pageName: "Internship",
          company:
            valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
          branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
          unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
          team: valueTeamCat,
          department: valueDepartmentCat,
          employee: valueEmployeeCat,
          profileimage: false,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setEmployees(response.data.allusers?.map((item, index) => ({ ...item, serialNumber: index + 1 })));

      setFilterLoader(false);
      setTableLoader(false);
    } catch (err) {
      console.log(err);
      setFilterLoader(true);
      setTableLoader(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //auto select all dropdowns
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const handleAutoSelect = async () => {
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
            u.workmode === "Internship"
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
            u.workmode === "Internship"
        )
        .map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map((item) => item?.value));

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

  //FILTER END

  return (
    <Box>
      <Headtitle title={"INTERN LIVE LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Intern Live Details"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Intern details"
        subsubpagename="Intern Live List"
      />
      {isUserRoleCompare?.includes("linternlivelist") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Intern Live List Filter
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={TypeOptions}
                      styles={colourStyles}
                      value={{
                        label: filterState.type ?? "Please Select Type",
                        value: filterState.type ?? "Please Select Type",
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          type: e.value,
                        }));
                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);
                        setValueBranchCat([]);
                        setSelectedOptionsBranch([]);
                        setValueUnitCat([]);
                        setSelectedOptionsUnit([]);
                        setValueTeamCat([]);
                        setSelectedOptionsTeam([]);
                        setValueDepartmentCat([]);
                        setSelectedOptionsDepartment([]);
                        setValueEmployeeCat([]);
                        setSelectedOptionsEmployee([]);
                        setValueEmp([]);
                      }}
                    />
                  </FormControl>
                </Grid>
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
                                i.label === item.label && i.value === item.value
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

                {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
                          setValueBranchCat([]);
                          setSelectedOptionsBranch([]);
                          setValueUnitCat([]);
                          setSelectedOptionsUnit([]);
                          setValueTeamCat([]);
                          setSelectedOptionsTeam([]);
                          setValueDepartmentCat([]);
                          setSelectedOptionsDepartment([]);
                          setValueEmployeeCat([]);
                          setSelectedOptionsEmployee([]);
                        }}
                      />
                    </FormControl>
                  </Grid> */}

                {["Individual", "Team"]?.includes(filterState.type) ? (
                  <>
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
                  </>
                ) : ["Department"]?.includes(filterState.type) ? (
                  <>
                    {/* Department */}
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={departmentOptions}
                          value={selectedOptionsDepartment}
                          onChange={(e) => {
                            handleDepartmentChange(e);
                          }}
                          valueRenderer={customValueRendererDepartment}
                          labelledBy="Please Select Department"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Branch"]?.includes(filterState.type) ? (
                  <>
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
                  </>
                ) : ["Unit"]?.includes(filterState.type) ? (
                  <>
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
                          Unit <b style={{ color: "red" }}>*</b>
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
                  </>
                ) : (
                  ""
                )}
                {["Individual"]?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <div
                        onPaste={handlePasteForEmp}
                        style={{ position: 'relative' }}
                      >
                        <MultiSelect
                          options={allUsersData
                            ?.filter(
                              (u) =>
                                valueCompanyCat?.includes(u.company) &&
                                valueBranchCat?.includes(u.branch) &&
                                valueUnitCat?.includes(u.unit) &&
                                valueTeamCat?.includes(u.team) &&
                                u.workmode === "Internship"
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
                          // Add these props if your MultiSelect supports them
                          inputValue={searchInputValue} // Add this state if needed
                          onInputChange={(newValue) => setSearchInputValue(newValue)}
                        />
                      </div>
                    </FormControl>
                  </Grid>
                )}
                {["Individual"]?.includes(filterState.type) &&
                  <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Selected Employees</Typography>
                      <div
                        id="paste-box" // Add an ID to the Box
                        tabIndex={0} // Make the div focusable
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '3.75px',
                          height: '110px',
                          overflow: 'auto',
                        }}
                        onPaste={handlePasteForEmp}
                        onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                        onBlur={(e) => {
                          if (isBoxFocused) {
                            e.target.focus(); // Refocus only if the Box was previously focused
                          }
                        }}
                      >
                        {valueEmp.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            clickable
                            sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                            onDelete={(e) => handleDelete(e, value)}
                            onClick={() => console.log("clicked chip")}
                          />
                        ))}
                      </div>
                    </FormControl>
                  </Grid>
                }
                <Grid item md={3} xs={12} sm={6} mt={3}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      onClick={handleFilter}
                      loading={filterLoader}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Filter
                    </LoadingButton>

                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("linternlivelist") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Intern Live List
                </Typography>
              </Grid>
            </Grid>
            <Box>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
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
                      <MenuItem value={employees?.length}>All</MenuItem>
                    </Select>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                  <Box>
                    {isUserRoleCompare?.includes("excelinternlivelist") && (
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
                    {isUserRoleCompare?.includes("csvinternlivelist") && (
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
                    {isUserRoleCompare?.includes("printinternlivelist") && (
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
                    {isUserRoleCompare?.includes("pdfinternlivelist") && (
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
                    {isUserRoleCompare?.includes("imageinternlivelist") && (
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
              </Grid> <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
              {!tableLoader ? (
                <>
                  <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefTableImg} >
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
                      gridRefTableImg={gridRefTableImg}
                      paginated={false}
                      filteredDatas={filteredDatas}
                      // totalDatas={totalDatas}
                      searchQuery={searchedString}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      itemsList={employees}
                    />
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

      {/* ****** Table End ****** */}

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
    </Box>
  );
}

export default Internlivelist;
