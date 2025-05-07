import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Radio, RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import { ExportCSV, ExportXL } from "../../../components/Export";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext.js";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice.js";

import jsPDF from "jspdf";
import "jspdf-autotable";
function EmployeeMissingField() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const fileName = "EmployeeMissingField"
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
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Employee Code",
    "Employee Name",
    "Personal Info",
    "Login & Boarding Details",
    "Address",
    "Document",
    "Work Histroy",
    "Bank Details",
    "User Access",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "team",
    "empcode",
    "companyname",
    "personalinfoemptyfields",
    "boardingdetails",
    "address",
    "document",
    "workhistory",
    "bankdetails",
    "useraccess",
  ];



  let personalInformation = {
    firstname: "First Name",
    lastname: "Last Name",
    legalname: "Legal Name",
    callingname: "Calling Name",
    religion: "Religion",
    prefix: "Prefix",
    fathername: "Father Name",
    mothername: "Mother Name",
    gender: "Gender",
    maritalstatus: "Marital Status",
    dom: "Date Of Marriage",
    dob: "Date Of Birth",
    bloodgroup: "Blood Group",
    location: "Location",
    email: "Email",
    contactpersonal: "Contact No (Personal)",
    contactfamily: "Contact No (Family)",
    emergencyno: "Emergency No",
    aadhar: "Aadhar no",
    panno: "PAN No",
    panstatus: "PAN Status",
    panrefno: "PAN Ref No",
    profileimage: "Profile Image",
  };

  let boardingdetails = {
    dot: "Date of Training",
    doj: "Date of Joining",
    companyemail: "Company Email",
    referencetodo: "Reference Details",
    username: "Login Name",
    password: "Password",
    companyname: "Company Name",
    workmode: "Work Mode",
    // role: "Role",
    company: "Company",
    branch: "Branch",
    unit: "Unit",
    floor: "Floor",
    area: "Area",
    department: "Department",
    team: "Team",
    designation: "Designation",
    shifttiming: "Shift",
    shifttype: "Shift Type",
    shiftgrouping: "Shift Grouping",
    reportingto: "Reporting To",
    workstationprimary: "Work Station (Primary)",
    workstationsecondary: "Work Station (Secondary)",
    workstationinput: "Work Station (WFH)",
    // workstationofficestatus
    weekoff: "Week Off",
    empcode: "Employee Code",
    status: "Boarding Information Status",
    employeecount: "System Count",
    //intern details
    intStartDate: "Intern Start Date",
    intEndDate: "Intern End Date",
    modeOfInt: "Mode of Intern",
    intDuration: "Intern Duration",
  };

  let address = {
    pdoorno: "Permanent Address Door/Flat No",
    pstreet: "Permanent Address Street/Block",
    parea: "Permanent Address Area/village",
    plandmark: "Permanent Address Landmark",
    ptaluk: "Permanent Address Taluk",
    ppost: "Permanent Address Post",
    ppincode: "Permanent Address Pin Code",
    pcountry: "Permanent Address Country",
    pstate: "Permanent Address State",
    pcity: "Permanent Address City",

    cdoorno: "Current Address Door/Flat No",
    cstreet: "Current Address Street/Block",
    carea: "Current Address Area/village",
    clandmark: "Current Address Landmark",
    ctaluk: "Current Address Taluk",
    cpost: "Current Address Post",
    cpincode: "Current Address Pin Code",
    ccountry: "Current Address Country",
    cstate: "Current Address State",
    ccity: "Current Address City",
  };

  let documents = {
    employeedocuments: "Employee Documents",
    eduTodo: "Education Details",
  };
  let workhistory = {
    addAddQuaTodo: "Additional qualification",
    workhistTodo: "Work History",
  };

  let lastpage = {
    bankdetails: "Bank Details",

    boardingLog: "Boarding Log",
    assignExpLog: "Exp Log Details",

    departmentlog: "Department Log",

    designationlog: "Designation Log",

    processlog: "Process Log",

  };
  let useraccess = {
    assignbranch: "Accessible Company/Branch/Unit",
    rocketchatid: "Rocket Chat",

  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [teamsArray, setTeamsArray] = useState([]);
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
      pagename: String("Employee MissingField List"),
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

  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    // checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    workmode: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  useEffect(() => {
    addSerialNumber(teamsArray);
  }, [teamsArray]);

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window?.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  //Delete model

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  // Manage Columns
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

  const [openMissingFields, setOpenMissingFields] = useState(false);
  const handleOpenMissingField = () => {
    setOpenMissingFields(true);
  };
  const handleCloseMissingField = () => {
    setOpenMissingFields(false);
  };
  const [missingFields, setMissingFields] = useState([]);
  const [rowId, setRowId] = useState("");
  const [candidateName, setCandidateName] = useState({});
  const fetchEmployeeMissingField = async (id, row) => {
    setRowId(id);
    try {
      let response = await axios.get(
        `${SERVICE.EMPLOYEE_MISSINGFIELDS}/?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setMissingFields(response?.data?.emptyFields);
      setCandidateName({
        name: row.companyname,
        empcode: row.empcode,
      });
      handleOpenMissingField();
      setRowId("");
    } catch (err) {
      setRowId("");
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
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

  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Employee Missing Field.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "EmployeeMissingField",
    pageStyle: "print",
  });

  const addSerialNumber = (datas) => {


    setItems(datas); // Update state with processed items
  };
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
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  // const filteredData = filteredDatas?.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );
  // const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  // const visiblePages = Math.min(totalPages, 3);
  // const firstVisiblePage = Math.max(1, page - 1);
  // const lastVisiblePage = Math.min(
  //   firstVisiblePage + visiblePages - 1,
  //   totalPages
  // );
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
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 140,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 160,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 120,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 160,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      pinned: "left",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 130,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vemployeemissingfieldlist") && (
            <>
              <LoadingButton
                loading={rowId == params.data.id}
                variant="contained"
                size="small"
                sx={{
                  height: "30px",
                  width: "120px",
                  fontSize: "0.75rem",
                  padding: "5px 10px",
                  minWidth: "unset",
                }}
                onClick={(e) => {
                  fetchEmployeeMissingField(params.data.id, params?.data);
                }}
              >
                view
              </LoadingButton>
            </>
          )}
        </Grid>
      ),
    },
  ];
  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      companyname: item.companyname,
      emptyfields: item.emptyfields,
      workmode: item.workmode,
    };
  });
  const rowDataTableExport = filteredDatas.map((item, index) => {
    return {
      "S.No": item.serialNumber,
      "Employee Name": item.companyname,
      "Employee Code": item.empcode,
      Company: item.company,
      Branch: item.branch,
      Unit: item.unit,
      Team: item.team,
      workmode: item.workmode,
      "Personal Info": item?.personalinfoemptyfields,
      "Login & Boarding Details": item?.boardingdetails,
      "Address": item?.address,
      "Document": item?.document,
      "Work Histroy": item?.workhistory,
      "Bank Details": item?.bankdetails,
      "User Access": item?.useraccess,
    };
  });


  const columns = [
    { title: "S.No", field: "S.No" },
    { title: "Company", field: "Company" },
    { title: "Branch", field: "Branch" },
    { title: "Unit", field: "Unit" },
    { title: "Team", field: "Team" },
    { title: "Work Mode", field: "workmode" },
    { title: "Employee Code", field: "Employee Code" },
    { title: "Employee Name", field: "Employee Name" },
    { title: "Personal Info", field: "Personal Info" },
    { title: "Login & Boarding Details", field: "Login & Boarding Details" },
    { title: "Address", field: "Address" },
    { title: "Document", field: "Document" },
    { title: "Work Histroy", field: "Work Histroy" },
    { title: "Bank Details", field: "Bank Details" },
    { title: "User Access", field: "User Access" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();

    const columnsWithSerial = [
      // Serial number column
      { title: "S.No", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Add a serial number to each row
    const itemsWithSerial = rowDataTableExport

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      // columns: columns?.map((col) => ({ ...col, dataKey: col.field })),
      // body: items,
      columns: columnsWithSerial,
      body: itemsWithSerial,
    });
    doc.save("Employee Missing Field.pdf");
  };
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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
              {" "}
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
          valueTeamCat?.includes(comp.team)
        // &&
        // comp.workmode !== "Internship"
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
    setValueEmp([]);
    setEmployeeOptions([]);
    setTeamsArray([]);

    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });


    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);
    setTeamsArray([]);


    setTotalDatas(0);
    setTotalPages(0);
    setPageSize(10);
    setPage(1);

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
    //  setPopupSeverityMalert("warning");
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
      setFilterClicked(true);
      fetchListData(true);
    }
  };

  const [advancedFilter, setAdvancedFilter] = useState(null);


  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);

  // Search bar
  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
  };

  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

  const handleAddFilter = () => {
    if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
      setAdditionalFilters([
        ...additionalFilters,
        { column: selectedColumn, condition: selectedCondition, value: filterValue }
      ]);
      setSelectedColumn("");
      setSelectedCondition("Contains");
      setFilterValue("");
    }
  };
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debounced query after the timeout
    }, 300); // Debounce delay in milliseconds (adjust as needed)

    return () => {
      clearTimeout(handler); // Clear the timeout if searchQuery changes within the delay
    };
  }, [searchQuery]);
  const [filterClicked, setFilterClicked] = useState(false)

  useEffect(() => {
    if (filterClicked) {
      fetchListData(filterClicked);
    }
  }, [page, pageSize, debouncedQuery])
  const fetchListData = async (clicked) => {

    try {
      if (clicked) {


        setPageName(!pageName);
        setFilterLoader(true);
        setTableLoader(true);

        const queryParams = {
          page: Number(page),
          pageSize: Number(pageSize),
        };

        const allFilters = [
          ...additionalFilters,
          { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {

          queryParams.allFilters = allFilters
          queryParams.logicOperator = logicOperator;
        } else if (debouncedQuery) {
          queryParams.searchQuery = debouncedQuery;  // Use searchQuery for regular search
        }


        let datas = await axios.post(SERVICE.USERNEWFILTER_MISSINGFIELD, {
          companyname:
            valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,

          branchname:
            valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
          unitname: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
          teamname: valueTeamCat,
          employeename: valueEmployeeCat,
          departmentname: valueDepartmentCat,
          ...queryParams,
        });

        const ans = datas?.data?.results?.length > 0 ? datas?.data?.results : []



        setTotalDatas(ans?.length > 0 ? datas?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? datas?.data?.totalPages : 0);
        setPageSize((data) => { return ans?.length > 0 ? data : 10 });
        setPage((data) => { return ans?.length > 0 ? data : 1 });
        const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
          fullname: `${item.prefix ? item.prefix + "." : ""}${item.fullname}`, // Handle prefix

          mobile: item.mobile,
          email: item.email,

          dateofbirth: item?.dateofbirth
            ? moment(item?.dateofbirth).format("DD-MM-YYYY") // Format date of birth
            : "",

          qualification: item?.educationdetails
            ?.map(
              (t, i) =>
                `${i + 1}. ${t.categoryedu || ""} - ${t.subcategoryedu || ""} - ${t.specialization || ""
                }`
            )
            .join(", "), // Convert array to string

          skill: Array.isArray(item?.skill)
            ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d)).join(", ") // Join skills
            : [],

          experience: `${item?.experience || ""} ${item?.experienceestimation ?? "Years"
            }`, // Format experience

          // emptyfields: item?.emptyfields
          //   ?.filter((field) => field !== "updatedby" && field !== "__v" && field !== "role")
          //   .map(field => `${field.charAt(0).toUpperCase() + field.slice(1)}`)?.join(", "),

          personalinfoemptyfields: item?.emptyfields
            ?.filter((field) => personalInformation.hasOwnProperty(field))
            .map((field) => personalInformation[field])
            ?.join(", "),

          boardingdetails: item?.emptyfields
            ?.filter((field) => boardingdetails.hasOwnProperty(field))
            .map((field) => boardingdetails[field])
            ?.join(", "),

          address: item?.emptyfields
            ?.filter((field) => address.hasOwnProperty(field))
            .map((field) => address[field])
            ?.join(", "),

          document: item?.emptyfields
            ?.filter((field) => documents.hasOwnProperty(field))
            .map((field) => documents[field])
            ?.join(", "),

          workhistory: item?.emptyfields
            ?.filter((field) => workhistory.hasOwnProperty(field))
            .map((field) => workhistory[field])
            ?.join(", "),

          bankdetails: item?.emptyfields
            ?.filter((field) => lastpage.hasOwnProperty(field))
            .map((field) => lastpage[field])
            ?.join(", "),
          // workmode: item?.emptyfields
          //   ?.filter((field) => workmode.hasOwnProperty(field))
          //   .map((field) => workmode[field])
          //   ?.join(", "),
          useraccess: item?.emptyfields
            ?.filter((field) => useraccess.hasOwnProperty(field))
            .map((field) => useraccess[field])
            ?.join(", "),
        }));
        setTeamsArray(itemsWithSerialNumber);


        setFilterLoader(false);
        setTableLoader(false);
      }
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




  const handleResetSearch = async () => {
    setPageName(!pageName)
    setFilterLoader(true);
    setTableLoader(true);

    // Reset all filters and pagination state
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const allFilters = [];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (debouncedQuery) {
      queryParams.searchQuery = debouncedQuery;  // Use searchQuery for regular search
    }


    try {
      let res_status = await axios.post(SERVICE.USERNEWFILTER_MISSINGFIELD, {
        companyname:
          valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,

        branchname:
          valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
        unitname: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
        teamname: valueTeamCat,
        employeename: valueEmployeeCat,
        departmentname: valueDepartmentCat,
        ...queryParams,
      });

      const ans = res_status?.data?.results?.length > 0 ? res_status?.data?.results : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,

        fullname: `${item.prefix ? item.prefix + "." : ""}${item.fullname}`, // Handle prefix

        mobile: item.mobile,
        email: item.email,

        dateofbirth: item?.dateofbirth
          ? moment(item?.dateofbirth).format("DD-MM-YYYY") // Format date of birth
          : "",

        qualification: item?.educationdetails
          ?.map(
            (t, i) =>
              `${i + 1}. ${t.categoryedu || ""} - ${t.subcategoryedu || ""} - ${t.specialization || ""
              }`
          )
          .join(", "), // Convert array to string

        skill: Array.isArray(item?.skill)
          ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d)).join(", ") // Join skills
          : [],

        experience: `${item?.experience || ""} ${item?.experienceestimation ?? "Years"
          }`, // Format experience

        // emptyfields: item?.emptyfields
        //   ?.filter((field) => field !== "updatedby" && field !== "__v" && field !== "role")
        //   .map(field => `${field.charAt(0).toUpperCase() + field.slice(1)}`)?.join(", "),

        personalinfoemptyfields: item?.emptyfields
          ?.filter((field) => personalInformation.hasOwnProperty(field))
          .map((field) => personalInformation[field])
          ?.join(", "),

        boardingdetails: item?.emptyfields
          ?.filter((field) => boardingdetails.hasOwnProperty(field))
          .map((field) => boardingdetails[field])
          ?.join(", "),

        address: item?.emptyfields
          ?.filter((field) => address.hasOwnProperty(field))
          .map((field) => address[field])
          ?.join(", "),

        document: item?.emptyfields
          ?.filter((field) => document.hasOwnProperty(field))
          .map((field) => document[field])
          ?.join(", "),

        workhistory: item?.emptyfields
          ?.filter((field) => workhistory.hasOwnProperty(field))
          .map((field) => workhistory[field])
          ?.join(", "),

        bankdetails: item?.emptyfields
          ?.filter((field) => lastpage.hasOwnProperty(field))
          .map((field) => lastpage[field])
          ?.join(", "),
        // workmode: item?.emptyfields
        //   ?.filter((field) => workmode.hasOwnProperty(field))
        //   .map((field) => workmode[field])
        //   ?.join(", "),
        useraccess: item?.emptyfields
          ?.filter((field) => useraccess.hasOwnProperty(field))
          .map((field) => useraccess[field])
          ?.join(", "),
      }));


      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setTeamsArray(itemsWithSerialNumber);

      setFilterLoader(false);
      setTableLoader(false);

    } catch (err) {
      setFilterLoader(false);
      setTableLoader(false); handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }

  }

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
            selectedTeam?.includes(u.team)
          //  &&
          // u.workmode !== "Internship"
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
            selectedTeam?.includes(u.team)
          // &&
          // u.workmode !== "Internship"
        )
        .map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map(a => a.value));
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
      <Headtitle title={"EMPLOYEE MISSING FIELDS"} />

      <PageHeading
        title="Employee Missing Field"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee details"
        subsubpagename="Employee MissingField List"
      />
      <br />
      {isUserRoleCompare?.includes("lemployeemissingfieldlist") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Employee Missing Fields
                  </Typography>
                </Grid>
              </Grid>
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
                                valueTeamCat?.includes(u.team)
                              //  &&
                              // u.workmode !== "Internship"
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
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lemployeemissingfieldlist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Employee Missing Fields
              </Typography>
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
                    {/* <MenuItem value={100}>100</MenuItem> */}
                    {/* <MenuItem value={teamsArray?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes(
                    "excelemployeemissingfieldlist"
                  ) && (
                      <>
                        {/* <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            setFormat("xl");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button> */}
                        <ExportXL csvData={rowDataTableExport} fileName={fileName} />
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "csvemployeemissingfieldlist"
                  ) && (
                      <>
                        {/* <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            setFormat("csv");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileCsv />
                          &ensp;Export to CSV&ensp;
                        </Button> */}
                        <ExportCSV csvData={rowDataTableExport} fileName={fileName} />
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "printemployeemissingfieldlist"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "pdfemployeemissingfieldlist"
                  ) && (
                      <>
                        {/* <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button> */}
                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "imageemployeemissingfieldlist"
                  ) && (
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
              <Grid item md={2} xs={12} sm={12}>
                {/* <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={teamsArray}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={teamsArray}
                /> */}
                <FormControl fullWidth size="small">
                  <OutlinedInput size="small"
                    id="outlined-adornment-weight"
                    startAdornment={
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        {advancedFilter && (
                          <IconButton onClick={handleResetSearch}>
                            <MdClose />
                          </IconButton>
                        )}
                        <Tooltip title="Show search options">
                          <span>
                            <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                          </span>
                        </Tooltip>
                      </InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{ 'aria-label': 'weight', }}
                    type="text"
                    value={getSearchDisplay()}
                    onChange={handleSearchChange}
                    placeholder="Type to search..."
                    disabled={!!advancedFilter}
                  />
                </FormControl>

              </Grid>
            </Grid>  <br />
            <Popover
              id={idSearch}
              open={openSearch}
              anchorEl={anchorElSearch}
              onClose={handleCloseSearch}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
              <Box style={{ padding: "10px", maxWidth: '450px' }}>
                <Typography variant="h6">Advance Search</Typography>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseSearch}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent sx={{ width: "100%" }}>
                  <Box sx={{
                    width: '350px',
                    maxHeight: '400px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <Box sx={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      // paddingRight: '5px'
                    }}>
                      <Grid container spacing={1}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography>Columns</Typography>
                          <Select fullWidth size="small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: "auto",
                                },
                              },
                            }}
                            style={{ minWidth: 150 }}
                            value={selectedColumn}
                            onChange={(e) => setSelectedColumn(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>Select Column</MenuItem>
                            {filteredSelectedColumn.map((col) => (
                              <MenuItem key={col.field} value={col.field}>
                                {col.headerName}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography>Operator</Typography>
                          <Select fullWidth size="small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: "auto",
                                },
                              },
                            }}
                            style={{ minWidth: 150 }}
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                            disabled={!selectedColumn}
                          >
                            {conditions.map((condition) => (
                              <MenuItem key={condition} value={condition}>
                                {condition}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography>Value</Typography>
                          <TextField fullWidth size="small"
                            value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                            placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-disabled': {
                                backgroundColor: 'rgb(0 0 0 / 26%)',
                              },
                              '& .MuiOutlinedInput-input.Mui-disabled': {
                                cursor: 'not-allowed',
                              },
                            }}
                          />
                        </Grid>
                        {additionalFilters.length > 0 && (
                          <>
                            <Grid item md={12} sm={12} xs={12}>
                              <RadioGroup
                                row
                                value={logicOperator}
                                onChange={(e) => setLogicOperator(e.target.value)}
                              >
                                <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                <FormControlLabel value="OR" control={<Radio />} label="OR" />
                              </RadioGroup>
                            </Grid>
                          </>
                        )}
                        {additionalFilters.length === 0 && (
                          <Grid item md={4} sm={12} xs={12} >
                            <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                              Add Filter
                            </Button>
                          </Grid>
                        )}

                        <Grid item md={2} sm={12} xs={12}>
                          <Button variant="contained" onClick={() => {
                            fetchListData(filterClicked);
                            setIsSearchActive(true);
                            setAdvancedFilter([
                              ...additionalFilters,
                              { column: selectedColumn, condition: selectedCondition, value: filterValue }
                            ])
                          }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                            Search
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </DialogContent>
              </Box>
            </Popover>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
            {tableLoader ? (
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
            ) : (
              <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefTableImg} >


                <AggridTableForPaginationTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}

                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}


                  totalDatas={totalDatas}

                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}

                  gridRefTableImg={gridRefTableImg}
                  itemsList={teamsArray}
                />
              </Box>
            )}
          </Box>
          {/* ****** Table End ****** */}
        </>
      )}
      <Dialog
        open={openMissingFields}
        onClose={handleCloseMissingField}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{ marginTop: "50px" }}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Employee Missing Fields
            </Typography>
            <br /> <br />
            <Grid sx={{ display: "flex", justifyContent: "around" }}>
              <Grid>
                <Typography sx={userStyle.SubHeaderText}>
                  Employee Name: {candidateName?.name}
                </Typography>
              </Grid>
              &nbsp; &nbsp;
              <Grid>
                <Typography sx={userStyle.SubHeaderText}>
                  Employee Code: {candidateName?.empcode}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              {
                [
                  { title: "Personal Info", data: personalInformation },
                  { title: "Login & Boarding Details", data: boardingdetails },
                  { title: "Address", data: address },
                  { title: "Document", data: document },
                  { title: "Work History", data: workhistory },
                  { title: "Bank Details", data: lastpage },
                  { title: "User Access", data: useraccess },
                ]
                  .map(({ title, data }, index) => {
                    const filteredFields = missingFields.filter(
                      (field) =>
                        data[field] && !["updatedby", "__v"].includes(field)
                    );

                    // Only return Accordion if there are filtered fields
                    if (filteredFields.length > 0) {
                      return (
                        <Grid
                          item
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          key={`accordion-${index}`}
                        >
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={`panel${index + 1}-content`}
                              id={`panel${index + 1}-header`}
                              sx={userStyle.HeaderText}
                            >
                              {title}
                            </AccordionSummary>
                            <AccordionDetails>
                              {filteredFields.map((field, fieldIndex) => (
                                <p
                                  style={{ fontFamily: "sans-serif" }}
                                  key={`missing-${fieldIndex}`}
                                >
                                  {data[field]}
                                </p>
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      );
                    }

                    return null; // Don't render Accordion if no missing fields
                  })
                  .filter(Boolean) /* This filter removes any null elements */
              }
            </Grid>
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
                onClick={handleCloseMissingField}
                sx={buttonStyles.btncancel}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* ****** Table End ****** */}
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
      <br />

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell>Sno</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Work Mode</TableCell>
              <TableCell>Personal Info</TableCell>
              <TableCell>Login & Boarding Details</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Document</TableCell>
              <TableCell>Work Histroy</TableCell>
              <TableCell>Bank Details</TableCell>
              <TableCell>User Access</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowDataTableExport &&
              rowDataTableExport.map((row, index) => (
                <>
                  <TableRow key={index}>
                    <TableCell>{row["S.No"]}</TableCell>
                    <TableCell>{row["Employee Name"]}</TableCell>
                    <TableCell>{row["Employee Code"]}</TableCell>
                    <TableCell>{row.Company}</TableCell>
                    <TableCell>{row.Branch}</TableCell>
                    <TableCell>{row.Unit}</TableCell>
                    <TableCell>{row.Team}</TableCell>
                    <TableCell>{row.workmode}</TableCell>
                    <TableCell>{row["Personal Info"]}</TableCell>
                    <TableCell>{row["Login & Boarding Details"]}</TableCell>
                    <TableCell>{row["Address"]}</TableCell>
                    <TableCell>{row["Document"]}</TableCell>
                    <TableCell>{row["Work Histroy"]}</TableCell>
                    <TableCell>{row["Bank Details"]}</TableCell>
                    <TableCell>{row["User Access"]}</TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      {/* <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={teamsArray ?? []}
        filename={"EmployeeMissingField"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      /> */}
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default EmployeeMissingField;