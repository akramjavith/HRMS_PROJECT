import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
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
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice.js";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";

function EmployeeMissingField() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
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
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Emp Code",
    "Name",
    // "Employee Missing Field",
    "Personal Info",
    "Login & Boarding Details",
    "Address",
    "Document",
    "Work Histroy",
    "Bank Details",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "team",
    "empcode",
    "companyname",
    // "emptyfields",
    "personalinfoemptyfields",
    "boardingdetails",
    "address",
    "document",
    "workhistory",
    "bankdetails",
  ];

  let personalInformation = {
    firstname: "First Name",
    lastname: "Last Name",
    legalname: "Legal Name",
    callingname: "Calling Name",
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

  let document = {
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
    assignbranch: "Accessible Company/Branch/Unit",

  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [teamsArray, setTeamsArray] = useState([]);
  const { isUserRoleCompare, isAssignBranch, allTeam, allUsersData } = useContext(UserRoleAccessContext);
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
    checkbox: true,
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
  const [participantsOption, setParticipantsOption] = useState([]);
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const [valueCate, setValueCate] = useState("");

  const handleCompanyChangeValue = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setSelectedOptionsUnit([])
    setSelectedOptionsTeam([])
    setSelectedOptionsBranch([])
    setValueBranchCat([])
    setValueUnitCat([])
    setValueTeamCat([])
    setValueCate([])
  };

  const handleBranchChangeValue = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setSelectedOptionsUnit([])
    setSelectedOptionsTeam([])
    setValueUnitCat([])
    setValueTeamCat([])
    setValueCate([])
  };

  const handleUnitChangeValue = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setSelectedOptionsTeam([])
    setValueTeamCat([])
    setValueCate([])
  };

  const handleTeamChangeValue = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    handleTeamChange(options);
    setValueCate([])
  };

  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = isAssignBranch
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
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);

      let selectedUser = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));
      setSelectedOptionsCate(selectedUser);
      setParticipantsOption(selectedUser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

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
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };


  const handleTeamChange = async (e) => {

    try {
      let res_location = await axios.get(SERVICE.USERALLLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filteredData = res_location?.data?.users?.filter((data) => {
        return selectedOptionsCompany?.some((comp) => comp?.value === data.company) &&
          selectedOptionsBranch?.some((bran) => bran?.value === data.branch) &&
          selectedOptionsUnit?.some((unit) => unit?.value === data.unit) &&
          e?.some((team) => team?.value === data.team)
      }).map((item) => ({ label: item.companyname, value: item.companyname }));

      setParticipantsOption(filteredData);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };
  const customValueRendererCate = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employees";
  };

  const handleclear = async () => {
    setValueCompanyCat([])
    setValueBranchCat([])
    setValueUnitCat([])
    setValueTeamCat([])
    setValueCate([])
    setSelectedOptionsCompany([])
    setSelectedOptionsBranch([])
    setSelectedOptionsUnit([])
    setSelectedOptionsTeam([])
    setParticipantsOption([]);
    setSelectedOptionsCate([]);
    setTeamsArray([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  useEffect(() => {
    addSerialNumber();
  }, [teamsArray]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
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

  const handleFilter = async (e, from) => {
    e.preventDefault();
    if (selectedOptionsCompany?.length === 0) {

      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setLoader(true);

      try {

        let datas = await axios.post(SERVICE.USERNEWFILTER_MISSINGFIELD, {
          companyname: valueCompanyCat,
          branchname: valueBranchCat,
          unitname: valueUnitCat,
          teamname: valueTeamCat,
          employeename: valueCate
        })

        if (datas?.data?.results?.length > 0) {
          setTeamsArray(datas?.data?.results);

        } else {
          setTeamsArray([]);
        }
        setLoader(false)

      } catch (err) {
        setTeamsArray([]); setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
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
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "EmployeeMissingField.png");
        });
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


  const addSerialNumber = () => {

    const itemsWithSerialNumber = teamsArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1, // Add serial number

      fullname: `${item.prefix ? item.prefix + '.' : ''}${item.fullname}`, // Handle prefix

      mobile: item.mobile,
      email: item.email,

      dateofbirth: item?.dateofbirth
        ? moment(item?.dateofbirth).format("DD-MM-YYYY") // Format date of birth
        : "",

      qualification: item?.educationdetails
        ?.map((t, i) =>
          `${i + 1}. ${t.categoryedu || ''} - ${t.subcategoryedu || ''} - ${t.specialization || ''}`
        )
        .join(', '), // Convert array to string

      skill: Array.isArray(item?.skill)
        ? item.skill.map(d => (Array.isArray(d) ? d.join(",") : d)).join(', ') // Join skills
        : [],

      experience: `${item?.experience || ''} ${item?.experienceestimation ?? 'Years'}`, // Format experience

      // emptyfields: item?.emptyfields
      //   ?.filter((field) => field !== "updatedby" && field !== "__v" && field !== "role")
      //   .map(field => `${field.charAt(0).toUpperCase() + field.slice(1)}`)?.join(", "),

      personalinfoemptyfields: item?.emptyfields?.filter((field) => personalInformation.hasOwnProperty(field))
        .map((field) => personalInformation[field])?.join(", "),

      boardingdetails: item?.emptyfields?.filter((field) => boardingdetails.hasOwnProperty(field))
        .map((field) => boardingdetails[field])?.join(", "),

      address: item?.emptyfields?.filter((field) => address.hasOwnProperty(field))
        .map((field) => address[field])?.join(", "),

      document: item?.emptyfields?.filter((field) => document.hasOwnProperty(field))
        .map((field) => document[field])?.join(", "),

      workhistory: item?.emptyfields?.filter((field) => workhistory.hasOwnProperty(field))
        .map((field) => workhistory[field])?.join(", "),

      bankdetails: item?.emptyfields?.filter((field) => lastpage.hasOwnProperty(field))
        .map((field) => lastpage[field])?.join(", "),
    }));

    setItems(itemsWithSerialNumber); // Update state with processed items
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
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 160,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vemployeemissingfieldlist") && (
            <>
              <LoadingButton
                loading={rowId == params.row.id}
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
                  fetchEmployeeMissingField(params.row.id, params?.row);
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      companyname: item.companyname,
      emptyfields: item.emptyfields
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

  return (
    <Box>
      <Headtitle title={"EMPLOYEE MISSING FIELDS"} />
      <Typography sx={userStyle.HeaderText}>
        Manage Employee Missing Field
      </Typography>
      <br /> <br />
      <Box sx={userStyle.dialogbox}>
        <>
          <Grid container spacing={2} sx={{ display: 'flex' }}>
            <Grid item xs={10}>
              <Typography sx={userStyle.importheadtext}>Employee Missing Fields</Typography>
            </Grid>

          </Grid><br />
          <Grid container spacing={2}>
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
                            i.label === item.label && i.value === item.value
                        ) === index
                      );
                    })}
                  value={selectedOptionsCompany}
                  onChange={(e) => {
                    handleCompanyChangeValue(e);
                    setParticipantsOption([]);
                    setSelectedOptionsCate([]);
                  }}
                  valueRenderer={customValueRendererCompany}
                  labelledBy="Please Select Company"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Branch
                </Typography>
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
                            i.label === item.label && i.value === item.value
                        ) === index
                      );
                    })}
                  value={selectedOptionsBranch}
                  onChange={(e) => {
                    handleBranchChangeValue(e);
                    setParticipantsOption([]);
                    setSelectedOptionsCate([]);
                  }}
                  valueRenderer={customValueRendererBranch}
                  labelledBy="Please Select Branch"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Unit
                </Typography>
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
                            i.label === item.label && i.value === item.value
                        ) === index
                      );
                    })}
                  value={selectedOptionsUnit}
                  onChange={(e) => {
                    handleUnitChangeValue(e);
                    setParticipantsOption([]);
                    setSelectedOptionsCate([]);
                  }}
                  valueRenderer={customValueRendererUnit}
                  labelledBy="Please Select Unit"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Team
                </Typography>
                <MultiSelect
                  options={allTeam
                    ?.filter((comp) => {
                      let compdatas = selectedOptionsCompany?.map(
                        (item) => item?.value
                      );
                      let branchdatas = selectedOptionsBranch?.map(
                        (item) => item?.value
                      );
                      let unitdatas = selectedOptionsUnit?.map(
                        (item) => item?.value
                      );
                      return (
                        compdatas?.includes(comp.company) &&
                        branchdatas?.includes(comp.branch) &&
                        unitdatas?.includes(comp.unit)
                      );
                    })
                    ?.map((data) => ({
                      label: data.teamname,
                      value: data.teamname,
                    }))
                    .filter((item, index, self) => {
                      return (
                        self.findIndex(
                          (i) =>
                            i.label === item.label && i.value === item.value
                        ) === index
                      );
                    })}
                  value={selectedOptionsTeam}
                  onChange={(e) => {
                    handleTeamChangeValue(e);
                    setSelectedOptionsCate([]);
                  }}
                  valueRenderer={customValueRendererTeam}
                  labelledBy="Please Select Team"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Employee
                </Typography>
                <MultiSelect
                  options={participantsOption}
                  value={selectedOptionsCate}
                  onChange={(e) => {
                    handleCategoryChange(e);
                  }}
                  valueRenderer={customValueRendererCate}
                  labelledBy="Please Select Employees"
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <Grid container>
            <Grid item md={3} xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFilter}
              >
                {" "}
                Filter{" "}
              </Button>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Button sx={userStyle.btncancel} onClick={handleclear}>
                {" "}
                Clear{" "}
              </Button>
            </Grid>
          </Grid>
        </>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lemployeemissingfieldlist") && (
        <>
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
                      <MenuItem value={100}>100</MenuItem>
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
                    {isUserRoleCompare?.includes(
                      "csvemployeemissingfieldlist"
                    ) && (
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
              <br />
              <br />
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                  {filteredDatas?.length} entries
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
              {/* ****** Table End ****** */}
            </Box>
          )}
        </>
      )}
      <Dialog
        open={openMissingFields}
        onClose={handleCloseMissingField}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
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
              <Button variant="contained" onClick={handleCloseMissingField}>
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
        filteredDataTwo={filteredData ?? []}
        itemsTwo={items ?? []}
        filename={"EmployeeMissingField"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default EmployeeMissingField;