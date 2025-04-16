import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import {
  Box, InputAdornment,
  Typography, FormControlLabel, Tooltip,
  OutlinedInput,
  TableBody,
  InputLabel,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover, RadioGroup, Radio,
  Checkbox,
  TextField,
  IconButton,
  TextareaAutosize,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import StyledDataGrid from "../../components/TableStyle";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Selects from "react-select";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";

function Maintentance() {
  const [maintentance, setMaintentance] = useState([]);
  const [maintentanceoverall, setMaintentanceOverall] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);


  const fetchMaintentanceOverall = async () => {
    try {
      let res = await axios.get(SERVICE.MAINTENANCE_EXCEL_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // console.log(res.data.maintenances, "abce")

      setMaintentanceOverall(res.data.maintenances?.map((item, index) => ({
        ...item,
        id: item._id,
        assetmaterial: item.assetmaterial,
        schedule: item.schedule,
        duration: item.duration,
        schedulestatus: item.schedulestatus,
        taskassign: item.taskassign,
        breakup: item.breakup,
        breakupcount: item.breakupcount,
        frequency: item.frequency,
        required: item?.required.join(","),
        timetodo:
          item?.timetodo?.length > 0
            ? item?.timetodo
              ?.map(
                (t, i) =>
                  `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
              )
              .toString()
            : "",
        weekdays:
          item?.weekdays?.length > 0
            ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
            : "",
        annumonth:
          item?.frequency === "Annually"
            ? `${item?.annumonth} month ${item?.annuday} days`
            : "",
        monthdate: item?.monthdate,
      })));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  useEffect(() => {
    fetchMaintentanceOverall();
  }, [])

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
    setBtnLoad(false);
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
    "Floor",
    "Area",
    "Location",
    "AssetMaterial",
    "AssetMaterialCode",
    "Maintenance Details",
    "Maintenance Frequency",
    "Schedule",
    "Duration",
    "Breakupcount",
    "Breakup",
    "Required",
    "Companys",
    "Branchs",
    "Units",
    "Team",
    "Employeename",
    "Vendor Group",
    "Vendor",
    "Address",
    "Phone",
    "Email",
    "Otherno",
    "Priority",
    // "Description",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "assetmaterial",
    "assetmaterialcode",
    "maintenancedetails",
    "frequency",
    "schedule",
    "duration",
    "breakupcount",
    "breakup",
    "required",
    "companyto",
    "branchto",
    "unitto",
    "teamto",
    "employeenameto",
    "vendorgroup",
    "vendor",
    "address",
    "phone",
    "emailid",
    "phonenumberone",
    "priority",
    // "description",
  ];



  const [overallFilterdataAll, setOverallFilterdataAll] = useState([]);
  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // console.log(overallFilterdataAll.length, overallFilterdata.length, "data")

  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState([]);
  //  const [filteredRowData, setFilteredRowData] = useState([]);
  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions




  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Maintenance Master"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }

  useEffect(() => {
    getapi();
  }, []);




  const [loader, setLoader] = useState(false)
  const gridRef = useRef(null);
  const [btnLoad, setBtnLoad] = useState(false);
  const [agenda, setAgenda] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");
  const scheduleOption = [
    { label: "Time Based", value: "Time Based" },
    { label: "Any Time", value: "Any Time" },
  ];
  const [selectedBranchTo, setSelectedBranchTo] = useState([]);
  const [selectedUnitTo, setSelectedUnitTo] = useState([]);
  const [selectedTeamTo, setSelectedTeamTo] = useState([]);
  const [selectedEmployeeTo, setSelectedEmployeeTo] = useState([]);

  const [selectedBranchToEdit, setSelectedBranchToEdit] = useState([]);
  const [selectedUnitToEdit, setSelectedUnitToEdit] = useState([]);
  const [selectedTeamToEdit, setSelectedTeamToEdit] = useState([]);
  const [selectedEmployeeToEdit, setSelectedEmployeeToEdit] = useState([]);
  const [bnuserto, setbnusersto] = useState([]);
  const [unituserto, setunitusersto] = useState([]);
  const [concReqs, setConcReqs] = useState("");

  //branchto multiselect dropdown changes
  const handleBranchChangeTo = (options) => {
    setSelectedBranchTo(options);
    setSelectedUnitTo([]);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);

    let result = options.map((item) => item.value);

    setbnusersto(result);
  };
  const customValueRendererBranchTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //unitto multiselect dropdown changes
  const handleUnitChangeTo = (options) => {
    let result = options.map((item) => item.value);

    setunitusersto(result);
    setSelectedUnitTo(options);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);
  };
  const customValueRendererUnitTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChangeTo = (options) => {
    setSelectedTeamTo(options);
  };
  const customValueRendererTeamTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeTo = (options) => {
    setSelectedEmployeeTo(options);
  };
  const customValueRendererEmployeeTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };

  //branchto multiselect dropdown changes
  const handleBranchChangeToEdit = (options) => {
    let result = options.map((item) => item.value);

    setbnusersto(result);
    setSelectedBranchToEdit(options);
    setSelectedUnitToEdit([]);
    setSelectedTeamToEdit([]);

    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererBranchToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //unitto multiselect dropdown changes
  const handleUnitChangeToEdit = (options) => {
    let result = options.map((item) => item.value);

    setunitusersto(result);
    setSelectedUnitToEdit(options);
    setSelectedTeamToEdit([]);
    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererUnitToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChangeToEdit = (options) => {
    setSelectedTeamToEdit(options);
    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererTeamToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeToEdit = (options) => {
    setSelectedEmployeeToEdit(options);
  };
  const customValueRendererEmployeeToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select To Employee Name";
  };

  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
  const [floors, setFloors] = useState([]);

  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);

  const frequencyOption = [
    { label: "Daily", value: "Daily" },
    { label: "Day Wise", value: "Day Wise" },
    { label: "Date Wise", value: "Date Wise" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ];

  const weekdays = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  const [vendorGroup, setVendorGroup] = useState("Choose Vendor Group");
  const [vendorGroupOpt, setVendorGroupopt] = useState([]);
  const [vendorOverall, setVendorOverall] = useState([]);
  const [vendorOpt, setVendoropt] = useState([]);
  const [vendor, setVendor] = useState("Choose Vendor");

  const [taskDesignationGrouping, setTaskDesignationGrouping] = useState({
    schedulestatus: "Active",
    taskassign: "Individual",
  });

  const [vendorGroupEdit, setVendorGroupEdit] = useState("Choose Vendor Group");
  const [vendorOptEdit, setVendoroptEdit] = useState([]);
  const [vendorEdit, setVendorEdit] = useState("Choose Vendor");

  const fetchVendor = async () => {
    try {
      let res1 = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {

          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const allGroup = Array.from(
        new Set(res1?.data?.vendorgrouping.map((d) => d.name))
      ).map((item) => {
        return {
          label: item,
          value: item,
        };
      });

      setVendorGroupopt(allGroup);
      setVendorOverall(res1?.data?.vendorgrouping);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const handleChangeGroupName = async (e) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

    let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const all = [
      ...res?.data?.vendordetails.map((d) => ({
        ...d,
        label: d.vendorname,
        value: d.vendorname,
      })),
    ];

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });

    setVendoropt(final);
  };

  const handleChangeGroupNameEdit = async (e) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

    let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const all = [
      ...res?.data?.vendordetails.map((d) => ({
        ...d,
        label: d.vendorname,
        value: d.vendorname,
      })),
    ];

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });

    setVendoroptEdit(final);
  };

  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([
    { label: "ALL", value: "ALL" },
  ]);

  const [floorsEdit, setFloorEdit] = useState([]);

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [maintentancemaster, setMaintentancemaster] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    priority: "Please Select Priority",
    schedule: "Please Select Schedule",
    companyres: "Please Select Company",
    branchres: "Please Select Branch",
    unitres: "Please Select Unit",
    resteam: "Please Select Team",
    resperson: "Please Select Employee",
    companyto: "Please Select Company",
    duration: "00:10",
    breakupcount: "1",
    hour: "",
    min: "",
    assetmaterial: "Please Select AssetMaterial",
    assetmaterialcheck: "",
    equipment: "",
    maintenancedetails: "",
    frequency: "Please Select Frequency",
    schedule: "Please Select Schedule",
    maintenancedate: today,
    maintenancetime: "",
    resdepartment: "Please Select Department",
    resteam: "",

    fromdate: "",
    todate: "",
    vendor: "Please Select Vendor",
    address: "",
    phone: "",
    email: "",
    addedby: "",
    updatedby: "",
  });


  const [maintentancemasteredit, setMaintentancemasteredit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    assetmaterial: "Please Select AssetMaterial",
    companyto: "Please Select Company",
    schedule: "Please Select Schedule",
    companyres: "Please Select Company",
    branchres: "Please Select Branch",
    unitres: "Please Select Unit",
    resteam: "Please Select Team",
    resperson: "Please Select Employee",
    priority: "Please Select Priority",
    assetmaterialcheck: "",
    equipment: "",
    maintenancedetails: "",
    frequency: "",
    maintenancedate: "",
    maintenancetime: "",
    resdepartment: "Please Select Department",
    resteam: "",
    resperson: "",
    fromdate: "",
    todate: "",
    vendor: "Please Select Vendor",
    address: "",
    phone: "",
    email: "",
    duration: "00:10",
    breakupcount: "1",
    hour: "",
    min: "",
  });

  const requiredOption = [
    { label: "Photo", value: "Photo" },
    { label: "Documents", value: "Documents" },
    { label: "Screenshot", value: "Screenshot" },
    { label: "Email", value: "Email" },
  ];
  const [selectedRequiredOptionsCate, setSelectedRequiredOptionsCate] =
    useState([]);
  const [requiredValueCate, setRequiredValueCate] = useState("");
  const [selectedRequiredOptionsCateEdit, setSelectedRequiredOptionsCateEdit] =
    useState([]);
  const [requiredValueCateEdit, setRequiredValueCateEdit] = useState("");
  const handleRequiredChange = (options) => {
    setRequiredValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedRequiredOptionsCate(options);
  };
  const customValueRendererRequired = (requiredValueCate, _employeename) => {
    return requiredValueCate.length
      ? requiredValueCate.map(({ label }) => label).join(", ")
      : "Please Select Required";
  };
  const handleRequiredChangeEdit = (options) => {
    setRequiredValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedRequiredOptionsCateEdit(options);
  };
  const customValueRendererRequiredEdit = (
    requiredValueCateEdit,
    _employeename
  ) => {
    return requiredValueCateEdit.length
      ? requiredValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Required";
  };

  const [documentFiles, setdocumentFiles] = useState([]);
  const [documentFilesEdit, setdocumentFilesEdit] = useState([]);

  const handleResumeUpload = (event) => {
    event.preventDefault();
    const resume = event.target.files;
    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setdocumentFiles((prevFiles) => [
        ...prevFiles,
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "Document file",
        },
      ]);
    };
  };

  //Rendering File
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleResumeUploadEdit = (event) => {
    event.preventDefault();
    const resume = event.target.files;
    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setdocumentFilesEdit((prevFiles) => [
        ...prevFiles,
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "Document file",
        },
      ]);
    };
  };

  //Rendering File
  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleFileDeleteEdit = (index) => {
    setdocumentFilesEdit((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  const [materialOpt, setMaterialopt] = useState([]);

  const fetchMaterial = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETMATERIALIP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setMaterialopt(res?.data?.assetmaterialip);
      console.log(res?.data?.assetmaterialip, "assetmaterialip");
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editingIndexcheckEdit, setEditingIndexcheckEdit] = useState(-1);

  const [addReqTodo, setAddReqTodo] = useState([]);
  const [isTodoEdit, setIsTodoEdit] = useState(
    Array(addReqTodo.length).fill(false)
  );

  const [todoSubmit, setTodoSubmit] = useState(false);
  const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([]);
  const [addReqTodoEdit, setAddReqTodoEdit] = useState([]);
  const [isTodoEditPage, setIsTodoEditPage] = useState(
    Array(addReqTodoEdit.length).fill(false)
  );

  const [todoSubmitEdit, setTodoSubmitEdit] = useState(false);
  const [selectedWeeklyOptionsEdit, setSelectedWeeklyOptionsEdit] = useState(
    []
  );

  let [valueWeekly, setValueWeekly] = useState("");
  let [valueWeeklyEdit, setValueWeeklyEdit] = useState("");

  const [hourTodo, setHourTodo] = useState([]);
  const [minutesTodo, setMinutesTodo] = useState([]);
  const [timeTypeTodo, setTimeTypeTodo] = useState([]);
  const [hourTodoEdit, setHourTodoEdit] = useState([]);
  const [minutesTodoEdit, setMinutesTodoEdit] = useState([]);
  const [timeTypeTodoEdit, setTimeTypeTodoEdit] = useState([]);

  const handleUpdateTodocheck = () => {
    const newTodoscheck = [...addReqTodo];
    newTodoscheck[editingIndexcheck].hour = hourTodo;
    newTodoscheck[editingIndexcheck].min = minutesTodo;
    newTodoscheck[editingIndexcheck].timetype = timeTypeTodo;

    setAddReqTodo(newTodoscheck);
    setEditingIndexcheck(-1);
  };
  const handleEditTodocheck = (index) => {
    setEditingIndexcheck(index);
    setHourTodo(addReqTodo[index].hour);
    setMinutesTodo(addReqTodo[index].min);
    setTimeTypeTodo(addReqTodo[index].timetype);
  };

  const handleUpdateTodocheckEdit = () => {
    const newTodoscheck = [...addReqTodoEdit];
    newTodoscheck[editingIndexcheckEdit].hour = hourTodoEdit;
    newTodoscheck[editingIndexcheckEdit].min = minutesTodoEdit;
    newTodoscheck[editingIndexcheckEdit].timetype = timeTypeTodoEdit;
    setAddReqTodoEdit(newTodoscheck);
    setEditingIndexcheckEdit(-1);
  };
  const handleEditTodocheckEdit = (index) => {
    setEditingIndexcheckEdit(index);
    setHourTodoEdit(addReqTodoEdit[index].hour);
    setMinutesTodoEdit(addReqTodoEdit[index].min);
    setTimeTypeTodoEdit(addReqTodoEdit[index].timetype);
  };
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("10");
  const [hoursEdit, setHoursEdit] = useState("00");
  const [minutesEdit, setMinutesEdit] = useState("10");
  const [breakuphours, setbreakupHours] = useState("10");
  const [breakuphoursEdit, setbreakupHoursEdit] = useState("10");

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

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
  }, []);

  const addTodo = () => {
    const result = {
      hour: maintentancemaster?.hour,
      min: maintentancemaster?.min,
      timetype: maintentancemaster?.timetype,
    };
    if (
      maintentancemaster?.hour === "" ||
      maintentancemaster?.min === "" ||
      maintentancemaster?.timetype === ""
    ) {
      setPopupContentMalert("Please Select Hour, Minutes and Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addReqTodo?.some(
        (data) =>
          data?.hour === maintentancemaster?.hour &&
          data?.min === maintentancemaster?.min &&
          data?.timetype === maintentancemaster?.timetype
      )
    ) {
      setPopupContentMalert("Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setAddReqTodo((prevTodos) => [...prevTodos, result]);
      setIsTodoEdit(Array(addReqTodo.length).fill(false));
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...addReqTodo];
    updatedTodos.splice(index, 1);
    setAddReqTodo(updatedTodos);
  };

  const handleWeeklyChange = (options) => {
    setValueWeekly(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedWeeklyOptions(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  const addTodoEdit = () => {
    const result = {
      hour: maintentancemasteredit?.hour,
      min: maintentancemasteredit?.min,
      timetype: maintentancemasteredit?.timetype,
    };

    if (
      maintentancemasteredit?.hour === "" ||
      maintentancemasteredit?.hour === undefined ||
      maintentancemasteredit?.min === "" ||
      maintentancemasteredit?.min === undefined ||
      maintentancemasteredit?.timetype === "" ||
      maintentancemasteredit?.timetype === undefined
    ) {
      setPopupContentMalert("Please Select Hour, Minutes and Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addReqTodoEdit?.some(
        (data) =>
          data?.hour === maintentancemasteredit?.hour &&
          data?.min === maintentancemasteredit?.min &&
          data?.timetype === maintentancemasteredit?.timetype
      )
    ) {
      setPopupContentMalert("Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setAddReqTodoEdit((prevTodos) => [...prevTodos, result]);
      setIsTodoEditPage(Array(addReqTodoEdit.length).fill(false));
    }
  };

  const deleteTodoEdit = (index) => {
    const updatedTodos = [...addReqTodoEdit];
    updatedTodos.splice(index, 1);
    setAddReqTodoEdit(updatedTodos);
  };

  const handleWeeklyChangeEdit = (options) => {
    setValueWeeklyEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedWeeklyOptionsEdit(options);
  };

  const customValueRendererCateEdit = (valueCate, _days) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  const {
    isUserRoleCompare, pageName, setPageName,
    isUserRoleAccess,
    isAssignBranch, buttonStyles,
    allfloor,
    allareagrouping,
    alllocationgrouping,
    allUsersData,
    allUnit,
    allTeam,
    allCompany,
    allBranch,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  // const accessbranch = isAssignBranch
  //   ?.map((data) => ({
  //     branch: data.branch,
  //     company: data.company,
  //     unit: data.unit,
  //     branchto: data.branch,
  //     companyto: data.company,
  //     unitto: data.unit,
  //   }))

  const accessbranch = isAssignBranch
    ?.filter((data) => {
      let fetfinalurl = [];
      // Check if user is a Manager, in which case return all branches
      if (isUserRoleAccess?.role?.includes("Manager")) {
        return true; // Skip filtering, return all data for Manager
      }
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
        data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
      ) {
        fetfinalurl = data.subpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
      ) {
        fetfinalurl = data.mainpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
      ) {
        fetfinalurl = data.submodulenameurl;
      } else if (data?.modulenameurl?.length !== 0) {
        fetfinalurl = data.modulenameurl;
      } else {
        fetfinalurl = [];
      }


      // Check if the pathname exists in the URL
      return fetfinalurl?.includes(window.location.pathname);
    })
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
      branchto: data.branch,
      companyto: data.company,
      unitto: data.unit,
    }));

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [copiedData, setCopiedData] = useState("");


  // image

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Maintenance List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnLoad(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length == 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  const [vendorgetid, setVendorgetid] = useState({
    address: "",
    phonenumber: "",
    emailid: "",
    phonenumberone: "",
  });
  const [vendornameid, setVendornameid] = useState({});
  const [vendorgetidedit, setVendorgetidedit] = useState({
    address: "",
    phonenumber: "",
    emailid: "",
    phonenumberone: "",
  });

  const vendorid = async (value) => {
    try {
      let res = await axios.get(`${SERVICE.ALL_VENDORDETAILS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getdetails = res?.data?.vendordetails.find(
        (item) => item.vendorname == value
      );
      let getvendorinfo = getdetails ? getdetails : {};

      setVendorgetid({
        ...vendorgetid,
        address: getvendorinfo.address,
        phonenumber: getvendorinfo.phonenumber,
        emailid: getvendorinfo.emailid,
        phonenumberone: getvendorinfo.phonenumberone,
      });
      setVendornameid(id);

      setVendorgetidedit({
        ...vendorgetidedit,
        address: getvendorinfo.address,
        phonenumber: getvendorinfo.phonenumber,
        emailid: getvendorinfo.emailid,
        phonenumberone: getvendorinfo.phonenumberone,
      });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

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
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    duration: true,
    breakup: true,
    monthdate: true,
    breakupcount: true,
    required: true,
    area: true,
    location: true,
    assetmaterial: true,
    assetmaterialcode: true,
    maintenancedetails: true,
    frequency: true,
    schedule: true,
    companyto: true,
    branchtolist: true,
    unittolist: true,
    teamtolist: true,
    employeenametolist: true,
    vendor: true,
    priority: true,
    address: true,
    phone: true,
    emailid: true,
    phonenumberone: true,
    timetodo: true,
    weekdays: true,
    annumonth: true,
    monthdate: true,
    vendorgroup: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.MAINTENTANCE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.smaintenance);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {

    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.MAINTENTANCE_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchMaintentanceDelete();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const delProjectcheckbox = async () => {

    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.MAINTENTANCE_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      await fetchMaintentanceDelete();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  //add function
  const sendRequest = async (data) => {
    setPageName(!pageName)

    setBtnLoad(true);
    let branchnamesto = selectedBranchTo.map((item) => item.value);
    let unitnamesto = selectedUnitTo.map((item) => item.value);
    let teamnamesto = selectedTeamTo.map((item) => item.value);
    let employeenamesto = selectedEmployeeTo.map((item) => item.value);

    try {
      let maintenancecreate = await axios.post(SERVICE.MAINTENTANCE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(maintentancemaster.company),
        branch: String(maintentancemaster.branch),
        unit: String(maintentancemaster.unit),
        floor: String(maintentancemaster.floor),
        location: String(maintentancemaster.location),
        area: String(maintentancemaster.area),
        schedulestatus: String(taskDesignationGrouping.schedulestatus),
        taskassign: String(taskDesignationGrouping.taskassign),
        assetmaterial: maintentancemaster.assetmaterial,
        assetmaterialcode: valueAssetCodeCat || [],
        assetmaterialcheck: maintentancemaster.assetmaterialcheck,
        equipment: String(maintentancemaster.equipment),
        maintenancedetails: String(maintentancemaster.maintenancedetails),
        schedule: String(maintentancemaster.schedule),
        frequency: String(maintentancemaster.frequency),
        timetodo: maintentancemaster.schedule === "Time Based" ? data : [],
        monthdate:
          maintentancemaster.frequency === "Monthly" ||
            maintentancemaster.frequency === "Date Wise"
            ? maintentancemaster.monthdate
            : "",
        weekdays:
          maintentancemaster.frequency === "Weekly" ||
            maintentancemaster.frequency === "Day Wise"
            ? valueWeekly
            : [],
        annumonth:
          maintentancemaster.frequency === "Annually"
            ? maintentancemaster.annumonth
            : "",
        annuday:
          maintentancemaster.frequency === "Annually"
            ? maintentancemaster.annuday
            : "",
        duration: String(maintentancemaster.duration),
        breakupcount: String(maintentancemaster.breakupcount),
        breakup: breakuphours,
        required: [...requiredValueCate],
        companyto: String(maintentancemaster.companyto),
        branchto: branchnamesto,
        unitto: unitnamesto,
        taskdetails: "schedule",
        teamto: teamnamesto,
        employeenameto: employeenamesto,
        needvendor: maintentancemaster?.needvendor || "",
        vendorgroup: maintentancemaster?.needvendor === "Yes" ? String(vendorGroup) : "",
        vendor: maintentancemaster?.needvendor === "Yes" ? String(vendor) : "",
        vendorid: maintentancemaster?.needvendor === "Yes" ? String(vendornameid) : "",
        address: maintentancemaster?.needvendor === "Yes" ? String(vendorgetid.address) : "",
        phone: maintentancemaster?.needvendor === "Yes" ? String(vendorgetid.phonenumber) : "",
        emailid: maintentancemaster?.needvendor === "Yes" ? String(vendorgetid.emailid) : "",
        phonenumberone: maintentancemaster?.needvendor === "Yes" ? String(vendorgetid.phonenumberone) : "",
        priority: String(maintentancemaster.priority),
        description: agenda,
        documentfiles: documentFiles,
        maintenancelog: [
          {
            company: String(maintentancemaster.company),
            branch: String(maintentancemaster.branch),
            unit: String(maintentancemaster.unit),
            floor: String(maintentancemaster.floor),
            location: String(maintentancemaster.location),
            area: String(maintentancemaster.area),
            schedulestatus: String(taskDesignationGrouping.schedulestatus),
            taskassign: String(taskDesignationGrouping.taskassign),
            assetmaterial: maintentancemaster.assetmaterial,
            assetmaterialcode: valueAssetCodeCat || [],
            maintenancedetails: String(maintentancemaster.maintenancedetails),
            date: moment(new Date()).format("DD-MM-YYYY hh:mm a"),
          },
        ],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchMaintentance("filtered");
      setBtnLoad(false);
      setMaintentancemaster({
        ...maintentancemaster,
        equipment: "",
        maintenancedetails: "",
        frequency: "Please Select Frequency",
        schedule: "Please Select Schedule",
        maintenancedate: today,
        maintenancetime: "",
        resperson: "",
        fromdate: "",
        todate: "",
        address: "",
        phone: "",
        email: "",
      });
      setHours("00");
      setMinutes("10");
      setAddReqTodo([]);
      setValueWeekly([]);
      setSelectedWeeklyOptions([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setBtnLoad(false);
    } catch (err) {
      setBtnLoad(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)

    e.preventDefault();
    if (maintentancemaster.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      maintentancemaster.assetmaterial === "Please Select AssetMaterial"
    ) {
      setPopupContentMalert("Please Select AssetMaterial!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      valueAssetCodeCat?.length === 0
    ) {
      setPopupContentMalert("Please Select Asset Material Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster.maintenancedetails === "") {
      setPopupContentMalert("Please Select Maintentance Details!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.frequency === "Please Select Frequency") {
      setPopupContentMalert("Please Select Maintenance Frequency!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.schedule === "Please Select Schedule") {
      setPopupContentMalert("Please Select Schedule!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemaster.schedule === "Time Based" &&
      addReqTodo?.length == 0
    ) {
      setPopupContentMalert("Atleast Add One Data in Time todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemaster.schedule === "Time Based" &&
      todoSubmit === true
    ) {
      setPopupContentMalert("Please Update the todo and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (maintentancemaster.frequency === "Monthly" ||
        maintentancemaster.frequency === "Date Wise") &&
      maintentancemaster.monthdate === ""
    ) {
      setPopupContentMalert("Please Select Monthly Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (maintentancemaster.frequency === "Weekly" ||
        maintentancemaster.frequency === "Day Wise") &&
      selectedWeeklyOptions?.length === 0
    ) {
      setPopupContentMalert("Please Select Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemaster.frequency === "Annually" &&
      maintentancemaster.annumonth === ""
    ) {
      setPopupContentMalert("Please Select Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemaster.frequency === "Annually" &&
      maintentancemaster.annuday === ""
    ) {
      setPopupContentMalert("Please Select Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemaster?.duration === undefined ||
      maintentancemaster?.duration === "00:00" ||
      maintentancemaster?.duration?.includes("Mins")
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.breakupcount === "") {
      setPopupContentMalert("Please Enter Breakup count!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.companyto === "Please Select Company") {
      setPopupContentMalert("Please Select Company To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranchTo.length === 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedUnitTo.length === 0) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeamTo.length === 0) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeTo.length === 0) {
      setPopupContentMalert("Please Select Employeename!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (!maintentancemaster?.needvendor) {
      setPopupContentMalert("Please Choose Yes/No, If You Need Vendor or not!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster?.needvendor === "Yes" && (vendorGroup === "" || vendorGroup === "Choose Vendor Group")) {
      setPopupContentMalert("Please Choose Vendor Group!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster?.needvendor === "Yes" && (vendor === "" || vendor === "Choose Vendor")) {
      setPopupContentMalert("Please Choose Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster.priority === "Please Select Priority") {
      setPopupContentMalert("Please Select Priority!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (agenda === "" || agenda === "<p><br></p>") {
      setPopupContentMalert("Please Enter Description!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (maintentancemaster.schedule === "Time Based") {
        addReqTodo?.map((data) => {
          sendRequest(data);
        });
      } else {
        sendRequest();
      }
    }
  };

  const handleclear = (e) => {
    e.preventDefault();

    setMaintentancemaster({
      company: "Please Select Company",
      companyto: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      assetmaterial: "Please Select AssetMaterial",
      equipment: "",
      maintenancedetails: "",
      frequency: "Please Select Frequency",
      maintenancedate: today,
      schedule: "Please Select Schedule",
      maintenancetime: "",
      resdepartment: "Please Select Department",
      priority: "Please Select Priority",
      resteam: "",
      resperson: "",
      fromdate: "",
      todate: "",
      vendor: "Please Select Vendor",
      address: "",
      phone: "",
      otherno: "",
      emailid: "",
      breakupcount: "",
      hour: "",
      min: "",
      timetype: "",
      monthdate: "",
      date: "",
      annumonth: "",
      annuday: "",
    });

    setTaskDesignationGrouping({
      schedulestatus: "Active",
      taskassign: "Individual",
    });
    setLocations([{ label: "ALL", value: "ALL" }]);
    setVendorGroup("Choose Vendor Group");
    setVendor("Choose Vendor");
    setVendoropt([]);
    setdocumentFiles([]);
    setSelectedBranchTo([]);
    setAgenda("")
    setSelectedUnitTo([]);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);
    setSelectedWeeklyOptions([]);
    setValueWeekly([]);
    setAddReqTodo([]);
    setHours("Hrs");
    setMinutes("Mins");
    setFloors([]);
    setAreas([]);
    setVendorgetid({
      address: "",
      phonenumber: "",
      emailid: "",
      phonenumberone: "",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setMaintentancemasteredit({
      branch: "",
      equipment: "",
      maintenancedetails: "",
      frequency: "",
      maintenancedate: today,
      maintenancetime: "",
      resdepartment: "Please Select Department",
      resteam: "",
      resperson: "",
      fromdate: "",
      todate: "",
      vendor: "Please Select Vendor",
      address: "",
      phone: "",
      email: "",
    });
    setVendorgetid({ address: "", phonenumber: "", emailid: "" });
  };

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)

    try {
      let res = await axios.get(`${SERVICE.MAINTENTANCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setVendorEdit(res?.data?.smaintenance?.vendor);
      setVendorGroupEdit(res?.data?.smaintenance?.vendorgroup);
      await handleChangeGroupNameEdit({
        value: res?.data?.smaintenance?.vendorgroup,
      });



      // let findmatchingAsset = materialOpt?.find(data => data?.component?.includes(res?.data?.smaintenance?.assetmaterial));
      // let findMatchingDetails = maintenanceDetails?.filter(data => data?.assetmaterial === findmatchingAsset?.assetmaterial);
      // setMaterialDetailsOptEdit(findMatchingDetails?.length > 0 ? findMatchingDetails?.map(item => ({
      //   label: item?.maintenancedescriptionmaster,
      //   value: item?.maintenancedescriptionmaster,
      // })) : []);

      let assetCode = res?.data?.smaintenance?.assetmaterialcode?.length > 0 ? res?.data?.smaintenance?.assetmaterialcode?.map(data => ({
        label: data,
        value: data,
      })) : [];

      setValueAssetCodeEditCat(
        res?.data?.smaintenance?.assetmaterialcode || []);
      setSelectedOptionsAssetCodeEdit(assetCode);

      let findMatchingDetails = maintenanceDetails?.filter(data => res?.data?.smaintenance?.assetmaterialcode?.includes(data?.assetmaterialcode));
      setMaterialDetailsOptEdit(findMatchingDetails?.length > 0 ? findMatchingDetails?.map(item => ({
        label: item?.maintenancedescriptionmaster,
        value: item?.maintenancedescriptionmaster,
      })) : []);
      setMaintentancemasteredit({
        ...res?.data?.smaintenance,
        needvendor: res?.data?.smaintenance?.vendor ? "Yes" : "No",
        // maintenancedetails: findMatchingDetails
      });



      const [hourscal, minutescal] =
        res?.data?.smaintenance.duration.split(":");
      setHoursEdit(hourscal);
      setMinutesEdit(minutescal);
      setValueWeeklyEdit(res?.data?.smaintenance?.weekdays);

      setRequiredValueCateEdit(res?.data?.smaintenance?.required);
      setbreakupHoursEdit(res?.data?.smaintenance?.breakup);
      setSelectedRequiredOptionsCateEdit([
        ...res?.data?.smaintenance?.required.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      fetchFloor(res?.data?.smaintenance);
      fetchAreaEdit(
        res?.data?.smaintenance?.branch,
        res?.data?.smaintenance?.floor
      );
      fetchAllLocationEdit(
        res?.data?.smaintenance?.branch,
        res?.data?.smaintenance?.floor,
        res?.data?.smaintenance?.area
      );
      setAddReqTodoEdit(res?.data?.smaintenance?.timetodo);
      setdocumentFilesEdit(res?.data?.smaintenance?.documentfiles);

      const answerWeek =
        res?.data?.smaintenance?.weekdays?.length > 0
          ? res?.data?.smaintenance?.weekdays?.map((t) => ({
            ...t,
            label: t,
            value: t,
          }))
          : [];
      setSelectedWeeklyOptionsEdit(answerWeek);
      setSelectedBranchToEdit(
        res?.data?.smaintenance.branchto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setSelectedUnitToEdit(
        res?.data?.smaintenance.unitto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setSelectedTeamToEdit(
        res?.data?.smaintenance.teamto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setSelectedEmployeeToEdit(
        res?.data?.smaintenance.employeenameto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      let resv = await axios.get(`${SERVICE.ALL_VENDORDETAILS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getdetails = resv?.data?.vendordetails.find(
        (item) => item.vendorname == res?.data?.smaintenance.vendor
      );
      let getvendorinfo = getdetails ? getdetails : {};

      setVendorgetidedit({
        ...vendorgetidedit,
        address: getvendorinfo.address,
        phonenumber: getvendorinfo.phonenumber,
        emailid: getvendorinfo.emailid,
        phonenumberone: getvendorinfo.phonenumberone,
      });
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const [maintenanceview, setMaintenanceview] = useState([]);
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)

    try {
      let res = await axios.get(`${SERVICE.MAINTENTANCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMaintentancemasteredit({
        ...res?.data?.smaintenance,
        needvendor: res?.data?.smaintenance?.vendor ? "Yes" : "No"
      });
      setMaintenanceview(res?.data?.smaintenance);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)

    try {
      let res = await axios.get(`${SERVICE.MAINTENTANCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMaintentancemasteredit(res?.data?.smaintenance);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //Project updateby edit page...
  let updateby = maintentancemasteredit?.updatedby;
  let addedby = maintentancemasteredit?.addedby;

  let maintenanceid = maintentancemasteredit?._id;
  let maintenancelog = maintentancemasteredit?.maintenancelog;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)

    let branchnamesto = selectedBranchToEdit.map((item) => item.value);
    let unitnamesto = selectedUnitToEdit.map((item) => item.value);
    let teamnamesto = selectedTeamToEdit.map((item) => item.value);
    let employeenamesto = selectedEmployeeToEdit.map((item) => item.value);
    try {
      let res = await axios.put(
        `${SERVICE.MAINTENTANCE_SINGLE}/${maintenanceid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(maintentancemasteredit.company),
          branch: String(maintentancemasteredit.branch),
          unit: String(maintentancemasteredit.unit),
          floor: String(maintentancemasteredit.floor),
          location: String(maintentancemasteredit.location),
          area: String(maintentancemasteredit.area),
          assetmaterial: maintentancemasteredit.assetmaterial,
          assetmaterialcode: valueAssetCodeEditCat || [],
          assetmaterialcheck: maintentancemasteredit.assetmaterialcheck,
          equipment: String(maintentancemasteredit.equipment),
          maintenancedetails: String(maintentancemasteredit.maintenancedetails),
          frequency: String(maintentancemasteredit.frequency),
          schedule: String(maintentancemasteredit.schedule),
          schedulestatus: String(maintentancemasteredit.schedulestatus),
          taskassign: String(maintentancemasteredit.taskassign),
          timetodo:
            maintentancemasteredit.schedule === "Time Based"
              ? addReqTodoEdit
              : [],
          monthdate:
            maintentancemasteredit.frequency === "Monthly" ||
              maintentancemasteredit.frequency === "Date Wise"
              ? maintentancemasteredit.monthdate
              : "",
          weekdays:
            maintentancemasteredit.frequency === "Weekly" ||
              maintentancemasteredit.frequency === "Day Wise"
              ? valueWeeklyEdit
              : [],
          annumonth:
            maintentancemasteredit.frequency === "Annually"
              ? maintentancemasteredit.annumonth
              : "",
          annuday:
            maintentancemasteredit.frequency === "Annually"
              ? maintentancemasteredit.annuday
              : "",
          duration: String(maintentancemasteredit.duration),
          breakupcount: String(maintentancemasteredit.breakupcount),
          breakup: breakuphoursEdit,
          required: [...requiredValueCateEdit],
          companyto: String(maintentancemasteredit.companyto),
          branchto: branchnamesto,
          unitto: unitnamesto,
          teamto: teamnamesto,
          employeenameto: employeenamesto,
          needvendor: maintentancemasteredit?.needvendor || "",
          vendorgroup: maintentancemasteredit?.needvendor === "Yes" ? String(vendorGroupEdit) : "",
          vendor: maintentancemasteredit?.needvendor === "Yes" ? String(vendorEdit) : "",
          address: maintentancemasteredit?.needvendor === "Yes" ? String(vendorgetidedit.address) : "",
          phone: maintentancemasteredit?.needvendor === "Yes" ? String(vendorgetidedit.phonenumber) : "",
          emailid: maintentancemasteredit?.needvendor === "Yes" ? String(vendorgetidedit.emailid) : "",
          phonenumberone: maintentancemasteredit?.needvendor === "Yes" ? String(vendorgetidedit.phonenumberone) : "",
          description: maintentancemasteredit.description,
          priority: maintentancemasteredit.priority,
          documentfiles: documentFilesEdit,
          maintenancelog: [
            ...maintenancelog,
            {
              company: String(maintentancemasteredit.company),
              branch: String(maintentancemasteredit.branch),
              unit: String(maintentancemasteredit.unit),
              floor: String(maintentancemasteredit.floor),
              location: String(maintentancemasteredit.location),
              area: String(maintentancemasteredit.area),
              schedulestatus: String(maintentancemasteredit.schedulestatus),
              taskassign: String(maintentancemasteredit.taskassign),
              assetmaterial: maintentancemasteredit.assetmaterial,
              assetmaterialcode: valueAssetCodeEditCat || [],
              maintenancedetails: String(
                maintentancemasteredit.maintenancedetails
              ),
              date: moment(new Date()).format("DD-MM-YYYY hh:mm a"),
            },
          ],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchMaintentance("filtered");
      setdocumentFiles([]);
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const editSubmit = (e) => {
    setPageName(!pageName)

    e.preventDefault();
    if (maintentancemasteredit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      maintentancemasteredit.assetmaterial === "Please Select AssetMaterial"
    ) {
      setPopupContentMalert("Please Select AssetMaterial!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      valueAssetCodeEditCat?.length === 0
    ) {
      setPopupContentMalert("Please Select Asset Material Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemasteredit.maintenancedetails === "") {
      setPopupContentMalert("Please Select Maintentance Details!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.frequency === "") {
      setPopupContentMalert("Please Select Maintenance Frequency!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.schedule === "Please Select Schedule") {
      setPopupContentMalert("Please Select Schedule!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemasteredit.schedule === "Time Based" &&
      addReqTodoEdit?.length == 0
    ) {
      setPopupContentMalert("Atleast Add One Data in Time todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemasteredit.schedule === "Time Based" &&
      todoSubmitEdit === true
    ) {
      setPopupContentMalert("Please Update the todo and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (maintentancemasteredit.frequency === "Monthly" ||
        maintentancemasteredit.frequency === "Date Wise") &&
      maintentancemasteredit.monthdate === ""
    ) {
      setPopupContentMalert("Please Select Monthly Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (maintentancemasteredit.frequency === "Weekly" ||
        maintentancemasteredit.frequency === "Day Wise") &&
      selectedWeeklyOptionsEdit?.length === 0
    ) {
      setPopupContentMalert("Please Select Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemasteredit.frequency === "Annually" &&
      maintentancemasteredit.annumonth === ""
    ) {
      setPopupContentMalert("Please Select Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemasteredit.frequency === "Annually" &&
      maintentancemasteredit.annuday === ""
    ) {
      setPopupContentMalert("Please Select Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemasteredit?.duration === undefined ||
      maintentancemasteredit?.duration === "00:00" ||
      maintentancemasteredit?.duration?.includes("Mins")
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.breakupcount === "") {
      setPopupContentMalert("Please Enter Breakup count!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.companyto === "Please Select Company") {
      setPopupContentMalert("Please Select Company To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranchToEdit.length === 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedUnitToEdit.length === 0) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeamToEdit.length === 0) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeToEdit.length === 0) {
      setPopupContentMalert("Please Select Employeename!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    // else if (maintentancemasteredit.vendor === "" || maintentancemasteredit.vendor == "Please Select Vendor") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Vendor"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (
      !maintentancemasteredit?.needvendor
    ) {
      setPopupContentMalert("Please Choose Yes/No, If You Need Vendor or not!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemasteredit?.needvendor === "Yes" &&
      (vendorGroupEdit === "" ||
        vendorGroupEdit === "Choose Vendor Group")
    ) {
      setPopupContentMalert("Please Choose Vendor Group!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemasteredit?.needvendor === "Yes" && (vendorEdit === "" || vendorEdit === "Choose Vendor")) {
      setPopupContentMalert("Please Choose Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemasteredit.priority === "Please Select Priority") {
      setPopupContentMalert("Please Select Priority!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemasteredit.description === "" ||
      maintentancemasteredit.description === "<p><br></p>"
    ) {
      setPopupContentMalert("Please Enter Description!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (isNameMatch) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon
    //                 sx={{ fontSize: "100px", color: "orange" }}
    //             />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //                 {"Name already exits!"}
    //             </p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else {
      sendEditRequest();
    }
  };

  const fetchFloor = async (e) => {
    let result = allfloor.filter(
      (d) => d.branch === e.value || d.branch === e.branch
    );
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloors(floorall);
    setFloorEdit(floorall);
  };
  const fetchArea = async (e) => {
    let result = allareagrouping
      .filter((d) => d.branch === newcheckbranch && d.floor === e)
      .map((data) => data.area);
    let ji = [].concat(...result);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreas(all);
  };

  const fetchLocation = async (e) => {
    let result = alllocationgrouping
      .filter(
        (d) =>
          d.branch === newcheckbranch &&
          d.floor === maintentancemaster.floor &&
          d.area === e
      )
      .map((data) => data.location);
    let ji = [].concat(...result);
    const all = [
      { label: "ALL", value: "ALL" },
      ...ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      })),
    ];
    setLocations(all);
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  const fetchAreaEdit = async (a, e) => {
    let result = allareagrouping
      .filter((d) => d.branch === a && d.floor === e)
      .map((data) => data.area);
    let ji = [].concat(...result);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreasEdit(all);
  };

  //get all Locations edit.
  const fetchAllLocationEdit = async (a, b, c) => {
    let result = alllocationgrouping
      .filter((d) => d.branch === a && d.floor === b && d.area === c)
      .map((data) => data.location);
    let ji = [].concat(...result);
    const all = [
      { label: "ALL", value: "ALL" },
      ...ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      })),
    ];
    setLocationsEdit(all);
  };

  useEffect(() => {
    fetchAllLocationEdit(maintentancemasteredit.branch, maintentancemasteredit.floor, maintentancemasteredit.area);
  }, [isEditOpen, maintentancemasteredit.branch, maintentancemasteredit.floor, maintentancemasteredit.area]);

  //get all project.
  // const fetchMaintentance = async () => {
  //   setPageName(!pageName)

  //   setLoader(true)
  //   const accessmodule = [];

  //   try {
  //     // let res_project = await axios.get(SERVICE.MAINTENTANCE, {
  //     let res_project = await axios.post(SERVICE.MAINTENANCE_ACCESS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },

  //       assignbranch: accessbranch,
  //     });

  //     setMaintentance(res_project?.data?.maintenances?.map((item, index) => ({
  //       ...item,
  //       serialNumber: index + 1,
  //       id: item._id,
  //       assetmaterial: item.assetmaterial,
  //       schedule: item.schedule,
  //       duration: item.duration,
  //       schedulestatus: item.schedulestatus,
  //       taskassign: item.taskassign,
  //       breakup: item.breakup,
  //       breakupcount: item.breakupcount,
  //       frequency: item.frequency,
  //       required: item?.required.join(","),
  //       timetodo:
  //         item?.timetodo?.length > 0
  //           ? item?.timetodo
  //             ?.map(
  //               (t, i) =>
  //                 `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
  //             )
  //             .toString()
  //           : "",
  //       weekdays:
  //         item?.weekdays?.length > 0
  //           ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
  //           : "",
  //       annumonth:
  //         item?.frequency === "Annually"
  //           ? `${item?.annumonth} month ${item?.annuday} days`
  //           : "",
  //       monthdate: item?.monthdate,
  //     })));
  //     setLoader(false)
  //   } catch (err) {
  //     setLoader(false)
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

  //   }

  // }




  const fetchMaintentance = async (e) => {
    setPageName(!pageName)

    setLoader(true)
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
      material: valueAssetMaterial,
      assignbranch: accessbranch,
    };

    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }


    try {
      // let res_project = await axios.get(SERVICE.MAINTENTANCE, {

      if (e === "Filtered") {
        let res_employee = await axios.post(SERVICE.MAINTENANCE_ACCESS, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
        console.log(ans,)
        const ansTotal = res_employee?.data?.totalProjectsdata?.length > 0 ? res_employee?.data?.totalProjectsdata : []
        const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
        }));



        setMaintentance(itemsWithSerialNumber?.map((item, index) => ({
          ...item,
          serialNumber: item.serialNumber,
          id: item._id,
          assetmaterial: item.assetmaterial,
          assetmaterialcode: item?.assetmaterialcode?.join(","),
          schedule: item.schedule,
          duration: item.duration,
          schedulestatus: item.schedulestatus,
          taskassign: item.taskassign,
          breakup: item.breakup,
          breakupcount: item.breakupcount,
          frequency: item.frequency,
          required: item?.required.join(","),
          timetodo:
            item?.timetodo?.length > 0
              ? item?.timetodo
                ?.map(
                  (t, i) =>
                    `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
                )
                .toString()
              : "",
          weekdays:
            item?.weekdays?.length > 0
              ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
              : "",
          annumonth:
            item?.frequency === "Annually"
              ? `${item?.annumonth} month ${item?.annuday} days`
              : "",
          monthdate: item?.monthdate,
        })));


        // setOverallFilterdataAll(itemsWithSerialNumber.map((item, index) => {
        //   return {
        //     ...item,
        //     id: item._id,
        //     serialNumber: item.serialNumber,
        //     assetmaterial: item.assetmaterial,
        //     schedule: item.schedule,
        //     duration: item.duration,
        //     schedulestatus: item.schedulestatus,
        //     taskassign: item.taskassign,
        //     breakup: item.breakup,
        //     breakupcount: item.breakupcount,
        //     frequency: item.frequency,
        //     required: item?.required.join(","),
        //     timetodo:
        //       item?.timetodo?.length > 0
        //         ? item?.timetodo
        //           ?.map(
        //             (t, i) =>
        //               `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
        //           )
        //           .toString()
        //         : "",
        //     weekdays:
        //       item?.weekdays?.length > 0
        //         ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
        //         : "",
        //     annumonth:
        //       item?.frequency === "Annually"
        //         ? `${item?.annumonth} month ${item?.annuday} days`
        //         : "",
        //     monthdate: item?.monthdate,
        //   };
        // }));

        setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
        setPageSize((data) => { return ans?.length > 0 ? data : 10 });
        setPage((data) => { return ans?.length > 0 ? data : 1 });



        setLoader(false)
      }
      else {
        setLoader(false)
      }
    }
    catch (err) {
      setLoader(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }

  }


  const fetchMaintentanceDelete = async () => {
    setPageName(!pageName)

    setLoader(true)
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      assignbranch: accessbranch,
    };

    // const allFilters = [
    //   ...additionalFilters,
    //   { column: "", condition: "", value: "" }
    // ];
    // // Only include advanced filters if they exist, otherwise just use regular searchQuery
    // if (allFilters.length > 0 && selectedColumn !== "") {
    //   queryParams.allFilters = allFilters
    //   queryParams.logicOperator = logicOperator;
    // } else if (searchQuery) {
    //   queryParams.searchQuery = "";
    // }

    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }


    try {
      // let res_project = await axios.get(SERVICE.MAINTENTANCE, {
      let res_employee = await axios.post(SERVICE.MAINTENANCE_ACCESS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const ansTotal = res_employee?.data?.totalProjectsdata?.length > 0 ? res_employee?.data?.totalProjectsdata : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      const itemsWithSerialNumberTotal = ansTotal?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));


      setMaintentance(itemsWithSerialNumber?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        assetmaterial: item.assetmaterial,
        assetmaterialcode: item?.assetmaterialcode?.join(","),
        schedule: item.schedule,
        duration: item.duration,
        schedulestatus: item.schedulestatus,
        taskassign: item.taskassign,
        breakup: item.breakup,
        breakupcount: item.breakupcount,
        frequency: item.frequency,
        required: item?.required.join(","),
        timetodo:
          item?.timetodo?.length > 0
            ? item?.timetodo
              ?.map(
                (t, i) =>
                  `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
              )
              .toString()
            : "",
        weekdays:
          item?.weekdays?.length > 0
            ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
            : "",
        annumonth:
          item?.frequency === "Annually"
            ? `${item?.annumonth} month ${item?.annuday} days`
            : "",
        monthdate: item?.monthdate,
      })));
      setOverallFilterdataAll(itemsWithSerialNumberTotal.map((item, index) => {
        return {
          ...item,
          id: item._id,
          assetmaterial: item.assetmaterial,
          schedule: item.schedule,
          duration: item.duration,
          schedulestatus: item.schedulestatus,
          taskassign: item.taskassign,
          breakup: item.breakup,
          breakupcount: item.breakupcount,
          frequency: item.frequency,
          required: item?.required.join(","),
          timetodo:
            item?.timetodo?.length > 0
              ? item?.timetodo
                ?.map(
                  (t, i) =>
                    `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
                )
                .toString()
              : "",
          weekdays:
            item?.weekdays?.length > 0
              ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
              : "",
          annumonth:
            item?.frequency === "Annually"
              ? `${item?.annumonth} month ${item?.annuday} days`
              : "",
          monthdate: item?.monthdate,
        };
      }));

      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });



      setLoader(false)
    } catch (err) {
      setLoader(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }

  }



  useEffect(() => {
    if (items?.length > 0) {
      fetchMaintentance("Filtered");
    }
  }, [page, pageSize, searchQuery]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Maintenance List",
    pageStyle: "print",
  });

  // serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);

  };

  useEffect(() => {
    addSerialNumber(maintentance);
  }, [maintentance]);

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
    setFilterValue(event.target.value);
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

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // const totalPages = Math.ceil(filteredDatas.length / pageSize);

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


  useEffect(() => {
    // fetchMaintentance();
    fetchVendor();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }

    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRows.filter(
    //             (selectedId) => selectedId !== params.data.id
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.data.id];
    //         }

    //         setSelectedRows(updatedSelectedRows);

    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(
    //           updatedSelectedRows.length === filteredData.length
    //         );
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 90,

    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
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
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !columnVisibility.location,
      headerClassName: "bold-header",
    },
    {
      field: "assetmaterial",
      headerName: "Asset Material",
      flex: 0,
      width: 180,
      hide: !columnVisibility.assetmaterial,
      headerClassName: "bold-header",
    },
    {
      field: "assetmaterialcode",
      headerName: "Asset Material Code",
      flex: 0,
      width: 180,
      hide: !columnVisibility.assetmaterialcode,
      headerClassName: "bold-header",
    },
    {
      field: "maintenancedetails",
      headerName: "Maintenance Details",
      flex: 0,
      width: 200,
      hide: !columnVisibility.maintenancedetails,
      headerClassName: "bold-header",
    },
    {
      field: "frequency",
      headerName: "Period",
      flex: 0,
      width: 120,
      hide: !columnVisibility.frequency,
      headerClassName: "bold-header",
    },
    {
      field: "schedule",
      headerName: "Schedule",
      flex: 0,
      width: 150,
      hide: !columnVisibility.schedule,
      headerClassName: "bold-header",
    },
    {
      field: "companyto",
      headerName: "To Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.companyto,
      headerClassName: "bold-header",
    },
    {
      field: "branchtolist",
      headerName: "To Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branchtolist,
      headerClassName: "bold-header",
    },
    {
      field: "unittolist",
      headerName: "To Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unittolist,
      headerClassName: "bold-header",
    },
    {
      field: "teamtolist",
      headerName: "To Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.teamtolist,
      headerClassName: "bold-header",
    },
    {
      field: "employeenametolist",
      headerName: "To Employee Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.employeenametolist,
      headerClassName: "bold-header",
    },

    {
      field: "vendorgroup",
      headerName: "Vendor Group",
      flex: 0,
      width: 120,
      hide: !columnVisibility.vendorgroup,
      headerClassName: "bold-header",
    },

    {
      field: "vendor",
      headerName: "Vendor",
      flex: 0,
      width: 120,
      hide: !columnVisibility.vendor,
      headerClassName: "bold-header",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0,
      width: 120,
      hide: !columnVisibility.phone,
      headerClassName: "bold-header",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 0,
      width: 120,
      hide: !columnVisibility.address,
      headerClassName: "bold-header",
    },
    {
      field: "emailid",
      headerName: "Email",
      flex: 0,
      width: 120,
      hide: !columnVisibility.emailid,
      headerClassName: "bold-header",
    },
    {
      field: "phonenumberone",
      headerName: "Other No",
      flex: 0,
      width: 120,
      hide: !columnVisibility.phonenumberone,
      headerClassName: "bold-header",
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 0,
      width: 120,
      hide: !columnVisibility.priority,
      headerClassName: "bold-header",
    },
    {
      field: "timetodo",
      headerName: "Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.timetodo,
      headerClassName: "bold-header",
    },
    {
      field: "weekdays",
      headerName: "Days",
      flex: 0,
      width: 150,
      hide: !columnVisibility.weekdays,
      headerClassName: "bold-header",
    },
    {
      field: "monthdate",
      headerName: "Month Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.monthdate,
      headerClassName: "bold-header",
    },
    {
      field: "annumonth",
      headerName: "Annual",
      flex: 0,
      width: 150,
      hide: !columnVisibility.annumonth,
      headerClassName: "bold-header",
    },

    {
      field: "duration",
      headerName: "Duration",
      flex: 0,
      width: 150,
      hide: !columnVisibility.duration,
      headerClassName: "bold-header",
    },
    {
      field: "breakupcount",
      headerName: "Breakup Count",
      flex: 0,
      width: 150,
      hide: !columnVisibility.breakupcount,
      headerClassName: "bold-header",
    },
    {
      field: "breakup",
      headerName: "Breakup",
      flex: 0,
      width: 150,
      hide: !columnVisibility.breakup,
      headerClassName: "bold-header",
    },

    {
      field: "required",
      headerName: "Required",
      flex: 0,
      width: 150,
      hide: !columnVisibility.required,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 450,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("emaintenancemaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dmaintenancemaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vmaintenancemaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("imaintenancemaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
          {isUserRoleCompare?.includes("emaintenancemaster") && (
            <Link
              to={`/asset/maintenanceuserlog/${params.data.id}`}
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button variant="contained">
                <MenuIcon />
              </Button>
            </Link>
          )}
        </Grid>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");


  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      priority: item.priority,
      schedulestatus: item.schedulestatus,
      taskassign: item.taskassign,
      location: item.location,
      assetmaterial: item.assetmaterial,
      equipment: item.equipment,
      maintenancedetails: item.maintenancedetails,
      frequency: item.frequency,
      schedule: item.schedule,
      timetodo: item?.timetodo,
      duration: item.duration,
      breakup: item.breakup,
      breakupcount: item.breakupcount,
      required: item?.required,
      companyto: item.companyto,
      branchto: item.branchto,
      unitto: item.unitto,
      teamto: item.teamto,
      employeenameto: item.employeenameto,
      branchtolist: item.branchto
        ? item.branchto
          ?.map((t, i) => t)
          .join(", ")
          .toString()
        : "",
      unittolist: item.unitto
        ?.map((t, i) => t)
        .join(", ")
        .toString(),
      teamtolist: item.teamto
        ?.map((t, i) => t)
        .join(", ")
        .toString(),
      employeenametolist: item.employeenameto
        ?.map((t, i) => `${i + 1 + "."}` + t)
        .join(", ")
        .toString(),
      vendor: item.vendor,
      address: item.address,
      phone: item.phone,
      emailid: item.emailid,
      phonenumberone: item.phonenumberone,
      weekdays: item?.weekdays,
      annumonth: item?.annumonth,
      monthdate: item.monthdate,
      vendorgroup: item.vendorgroup,
      assetmaterialcode: item.assetmaterialcode
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


  const handleTimeCalculate = (e) => {
    const breakupCount = e ? Number(e) : 1;
    const hourCal = hours !== "Hrs" ? Number(hours) : 0;
    const MinsCal = minutes !== "Mins" ? Number(minutes) : 0;
    const breakUpTime = (hourCal * 60 + MinsCal) / breakupCount;
    setbreakupHours(breakUpTime);
  };

  const handleTimeCalculateEdit = (e) => {
    const breakupCount = e ? Number(e) : 1;
    const hourCal = hoursEdit ? Number(hoursEdit) : 0;
    const MinsCal = minutesEdit ? Number(minutesEdit) : 0;
    const breakUpTime = (hourCal * 60 + MinsCal) / breakupCount;
    setbreakupHoursEdit(breakUpTime);
  };

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

  // Disable the search input if the search is active
  const isSearchDisabled = isSearchActive || additionalFilters.length > 0;

  const handleResetSearch = async () => {
    setLoader(true);

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
      assignbranch: accessbranch,
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
      material: valueAssetMaterial,
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }

    try {
      let res_employee = await axios.post(SERVICE.MAINTENANCE_ACCESS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const ansTotal = res_employee?.data?.totalProjectsdata?.length > 0 ? res_employee?.data?.totalProjectsdata : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      const itemsWithSerialNumberTotal = ansTotal?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));

      setMaintentance(itemsWithSerialNumber?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        assetmaterialcode: item?.assetmaterialcode?.join(","),
      })));
      setFilteredChanges(null);
      setItems(itemsWithSerialNumber.map((item, index) => {
        return {
          ...item,
          id: item._id,
          assetmaterial: item.assetmaterial,
          assetmaterialcode: item?.assetmaterialcode,
          schedule: item.schedule,
          duration: item.duration,
          schedulestatus: item.schedulestatus,
          taskassign: item.taskassign,
          breakup: item.breakup,
          breakupcount: item.breakupcount,
          frequency: item.frequency,
          required: item?.required.join(","),
          timetodo:
            item?.timetodo?.length > 0
              ? item?.timetodo
                ?.map(
                  (t, i) =>
                    `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
                )
                .toString()
              : "",
          weekdays:
            item?.weekdays?.length > 0
              ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
              : "",
          annumonth:
            item?.frequency === "Annually"
              ? `${item?.annumonth} month ${item?.annuday} days`
              : "",
          monthdate: item?.monthdate,
        };
      }))

      setOverallFilterdata(itemsWithSerialNumber.map((item, index) => {
        return {
          ...item,
          id: item._id,
          assetmaterial: item.assetmaterial,
          schedule: item.schedule,
          duration: item.duration,
          schedulestatus: item.schedulestatus,
          taskassign: item.taskassign,
          breakup: item.breakup,
          breakupcount: item.breakupcount,
          frequency: item.frequency,
          required: item?.required.join(","),
          timetodo:
            item?.timetodo?.length > 0
              ? item?.timetodo
                ?.map(
                  (t, i) =>
                    `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
                )
                .toString()
              : "",
          weekdays:
            item?.weekdays?.length > 0
              ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
              : "",
          annumonth:
            item?.frequency === "Annually"
              ? `${item?.annumonth} month ${item?.annuday} days`
              : "",
          monthdate: item?.monthdate,
        };
      }));

      setOverallFilterdataAll(itemsWithSerialNumberTotal.map((item, index) => {
        return {
          ...item,
          id: item._id,
          assetmaterial: item.assetmaterial,
          schedule: item.schedule,
          duration: item.duration,
          schedulestatus: item.schedulestatus,
          taskassign: item.taskassign,
          breakup: item.breakup,
          breakupcount: item.breakupcount,
          frequency: item.frequency,
          required: item?.required.join(","),
          timetodo:
            item?.timetodo?.length > 0
              ? item?.timetodo
                ?.map(
                  (t, i) =>
                    `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`
                )
                .toString()
              : "",
          weekdays:
            item?.weekdays?.length > 0
              ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString()
              : "",
          annumonth:
            item?.frequency === "Annually"
              ? `${item?.annumonth} month ${item?.annuday} days`
              : "",
          monthdate: item?.monthdate,
        };
      }));
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setLoader(false)

      // Trigger a table refresh if necessary
      setPageName((prev) => !prev); // Force re-render
    } catch (err) {
      setLoader(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [maintenanceDetails, setMaintenanceDetails] = useState([]);
  const fetchMaintentanceDetails = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.MAINTENANCEDETAILSMASTER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setMaintenanceDetails(res_vendor?.data?.maintenancedetailsmaster);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  useEffect(() => {
    fetchMaintentanceDetails();
  }, [])

  //Asset Code multiselect
  const [selectedOptionsAssetCode, setSelectedOptionsAssetCode] = useState([]);
  let [valueAssetCodeCat, setValueAssetCodeCat] = useState([]);

  const handleAssetCodeChange = (options) => {
    let datas =
      options.map((a, index) => {
        return a.value;
      })

    setValueAssetCodeCat(datas);
    setSelectedOptionsAssetCode(options);
    AssetMaterialOnchange(datas)
  };

  const customValueRendererAssetCode = (valueAssetCodeCat, _categoryname) => {
    return valueAssetCodeCat?.length
      ? valueAssetCodeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Asset Material Code";
  };


  //Asset Code Edit multiselect
  const [selectedOptionsAssetCodeEdit, setSelectedOptionsAssetCodeEdit] = useState([]);
  let [valueAssetCodeEditCat, setValueAssetCodeEditCat] = useState([]);

  const handleAssetCodeEditChange = (options) => {
    let datas =
      options.map((a, index) => {
        return a.value;
      })
    setValueAssetCodeEditCat(datas);
    setSelectedOptionsAssetCodeEdit(options);
    AssetMaterialOnchangeEdit(datas)
  };

  const customValueRendererAssetCodeEdit = (valueAssetCodeEditCat, _categoryname) => {
    return valueAssetCodeEditCat?.length
      ? valueAssetCodeEditCat.map(({ label }) => label)?.join(", ")
      : "Please Select Asset Material Code";
  };

  const [materialDetailsOpt, setMaterialDetailsOpt] = useState([]);
  const [materialDetailsOptEdit, setMaterialDetailsOptEdit] = useState([]);
  const AssetMaterialOnchange = async (e) => {
    setPageName(!pageName);
    try {
      // Map the `assetmaterial` into a single array
      let findMatchingDetails = maintenanceDetails?.filter(data => e?.includes(data?.assetmaterialcode));
      setMaterialDetailsOpt(findMatchingDetails?.length > 0 ? findMatchingDetails?.map(item => ({
        label: item?.maintenancedescriptionmaster,
        value: item?.maintenancedescriptionmaster,
      })).filter((item, index, self) => {
        return (
          self.findIndex(
            (i) =>
              i.label === item.label &&
              i.value === item.value
          ) === index
        );
      }) : []);
      setMaintentancemaster({
        ...maintentancemaster,
        assetmaterialcheck: "",
        maintenancedetails: ""
      });
      if (findMatchingDetails?.length === 0 && e.length !== 0) {
        setPopupContentMalert(`Please Add Maintenance Details for ${e?.join(",")} in Maintenance Details Master Page!`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }
  const AssetMaterialOnchangeEdit = async (e) => {
    setPageName(!pageName);
    try {
      let findMatchingDetails = maintenanceDetails?.filter(data => e?.includes(data?.assetmaterialcode));
      setMaterialDetailsOptEdit(findMatchingDetails?.length > 0 ? findMatchingDetails?.map(item => ({
        label: item?.maintenancedescriptionmaster,
        value: item?.maintenancedescriptionmaster,
      })).filter((item, index, self) => {
        return (
          self.findIndex(
            (i) =>
              i.label === item.label &&
              i.value === item.value
          ) === index
        );
      }) : []);
      setMaintentancemasteredit({
        ...maintentancemasteredit,
        assetmaterialcheck: "",
        maintenancedetails: ""
      });
      if (findMatchingDetails?.length === 0 && e.length !== 0) {
        setPopupContentMalert(`Please Add Maintenance Details for ${e?.join(",")} in Maintenance Details Master Page!`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }


  //company multiselect
  //team multiselect
  const [materialOptlist, setMaterialoptlist] = useState([]);
  const [selectedOptionsAssetMaterial, setSelectedOptionsAssetMaterial] = useState([]);
  let [valueAssetMaterial, setValueAssetMaterial] = useState([]);
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
    setValueAssetMaterial([]);
    setSelectedOptionsAssetMaterial([]);
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
    setValueAssetMaterial([]);
    setSelectedOptionsAssetMaterial([]);
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
    setValueAssetMaterial([]);
    setSelectedOptionsAssetMaterial([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };



  const handleAssetMaterialChange = (options) => {
    setValueAssetMaterial(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsAssetMaterial(options);
  };

  const customValueRendererAssetMaterial = (valueAssetMaterial, _categoryname) => {
    return valueAssetMaterial?.length
      ? valueAssetMaterial?.map(({ label }) => label)?.join(", ")
      : "Please Select Asset Material";
  };
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName)
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

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  const handleAssetMaterials = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resultall = res?.data?.assetmaterial?.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
        assettype: d.assettype,
        asset: d.assethead,
      }));

      const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });

      setMaterialoptlist(assetmaterialuniqueArray);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    handleAssetMaterials();
  }, []);

  const handleSubmitlist = (e) => {
    e.preventDefault();
    if (selectedOptionsCompany?.length === 0 &&
      selectedOptionsBranch?.length === 0 &&
      selectedOptionsUnit?.length === 0 &&
      selectedOptionsAssetMaterial?.length === 0) {
      setPopupContentMalert("Please Select Any One");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      fetchMaintentance("Filtered");
    }
  };

  const handleClearlist = () => {
    setMaintentance([]);
    setItems([]);
    setPage(1)
    setTotalProjects(0);
    setTotalPages(0);
    setPageSize(10)
    setOverallFilterdata([]);
    setSelectedOptionsCompany([])
    setSelectedOptionsBranch([])
    setSelectedOptionsUnit([])
    setSelectedOptionsAssetMaterial([])
    setValueCompanyCat([])
    setValueBranchCat([])
    setValueUnitCat([])
    setValueAssetMaterial([])
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
  }


  return (
    <Box>
      <Headtitle title={"MAINTENTANCE MASTER"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Maintenance Master</Typography> */}

      <PageHeading
        title="Maintenance Master"
        modulename="Asset"
        submodulename="Maintenance"
        mainpagename="Maintenance Master"
        subpagename=""
        subsubpagename=""
      />

      {isUserRoleCompare?.includes("amaintenancemaster") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Maintenance
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch ? accessbranch
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.company,
                        value: maintentancemaster.company,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOpt([]);
                        setValueAssetCodeCat([]);
                        setSelectedOptionsAssetCode([]);
                        setFloors([]);
                        setAreas([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);

                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) => maintentancemaster.company === comp.company
                        )
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.branch,
                        value: maintentancemaster.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setMaintentancemaster({
                          ...maintentancemaster,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOpt([]);
                        setValueAssetCodeCat([]);
                        setSelectedOptionsAssetCode([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        setAreas([])
                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) =>
                            maintentancemaster.company === comp.company &&
                            maintentancemaster.branch === comp.branch
                        )
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.unit,
                        value: maintentancemaster.unit,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          unit: e.value,
                          workstation: "",
                          assetmaterial: "Please Select AssetMaterial",
                        });
                        setMaterialDetailsOpt([]);
                        setValueAssetCodeCat([]);
                        setSelectedOptionsAssetCode([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.floor,
                        value: maintentancemaster.floor,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,

                          floor: e.value,
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOpt([]);
                        setValueAssetCodeCat([]);
                        setSelectedOptionsAssetCode([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchArea(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={areas}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.area,
                        value: maintentancemaster.area,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          area: e.value,
                          location: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOpt([]);
                        setValueAssetCodeCat([]);
                        setSelectedOptionsAssetCode([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchLocation(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={locations}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.location,
                        value: maintentancemaster.location,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          location: e.value,
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOpt([]);
                        setValueAssetCodeCat([]);
                        setSelectedOptionsAssetCode([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={
                        maintentancemaster.location === "ALL"
                          ? Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    locations
                                      .map((item) => item.value)
                                      .includes(subpro.location) &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    maintentancemaster.company &&
                                    subpro.branch ===
                                    maintentancemaster.branch &&
                                    subpro.unit === maintentancemaster.unit &&
                                    subpro.floor ===
                                    maintentancemaster.floor &&
                                    subpro.area === maintentancemaster.area
                                )
                                // .map((t) => t.component)
                                // .reduce((acc, curr) => acc.concat(curr), [])
                                .map((t) => ({
                                  ...t,
                                  label: t?.assetmaterial,
                                  value: t?.assetmaterial,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    subpro.location ===
                                    maintentancemaster.location &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    maintentancemaster.company &&
                                    subpro.branch ===
                                    maintentancemaster.branch &&
                                    subpro.unit === maintentancemaster.unit &&
                                    subpro.floor ===
                                    maintentancemaster.floor &&
                                    subpro.area === maintentancemaster.area
                                )
                                // .map((t) => t.component)
                                // .reduce((acc, curr) => acc.concat(curr), [])
                                .map((t) => ({
                                  ...t,
                                  label: t?.assetmaterial,
                                  value: t?.assetmaterial,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={{
                        label: maintentancemaster.assetmaterial,
                        value: maintentancemaster.assetmaterial,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          assetmaterial: e.value,
                          assetmaterialcheck: "",
                          maintenancedetails: ""
                        });
                        setMaterialDetailsOpt([]);
                        setValueAssetCodeCat([]);
                        setSelectedOptionsAssetCode([]);
                        // AssetMaterialOnchange(e)
                        // setVendorgetid({ address: "", phonenumber: "", emailid: "", phonenumberone: "" });
                        // setVendornameid({})
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Asset Material Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={
                        maintentancemaster.location === "ALL"
                          ? Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    locations
                                      .map((item) => item.value)
                                      .includes(subpro.location) &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    maintentancemaster.company &&
                                    subpro.branch ===
                                    maintentancemaster.branch &&
                                    subpro.unit === maintentancemaster.unit &&
                                    subpro.floor ===
                                    maintentancemaster.floor &&
                                    subpro.area === maintentancemaster.area &&
                                    subpro.assetmaterial === maintentancemaster.assetmaterial
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
                                .filter(data => maintenanceDetails?.some(item => item?.assetmaterialcode === data))
                                .map((t) => ({
                                  ...t,
                                  label: t,
                                  value: t,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    subpro.location ===
                                    maintentancemaster.location &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    maintentancemaster.company &&
                                    subpro.branch ===
                                    maintentancemaster.branch &&
                                    subpro.unit === maintentancemaster.unit &&
                                    subpro.floor ===
                                    maintentancemaster.floor &&
                                    subpro.area === maintentancemaster.area &&
                                    subpro.assetmaterial === maintentancemaster.assetmaterial
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
                                .filter(data => maintenanceDetails?.some(item => item?.assetmaterialcode === data))
                                .map((t) => ({
                                  ...t,
                                  label: t,
                                  value: t,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={selectedOptionsAssetCode}
                      onChange={(e) => {
                        handleAssetCodeChange(e);
                      }}
                      valueRenderer={customValueRendererAssetCode}
                      labelledBy="Please Select Asset Material Code"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Maintenance Details <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={materialDetailsOpt}
                      value={{
                        label: maintentancemaster.maintenancedetails ? maintentancemaster.maintenancedetails : "Please Select Maintenance Details",
                        value: maintentancemaster.maintenancedetails ? maintentancemaster.maintenancedetails : "Please Select Maintenance Details",
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          maintenancedetails: e.value,
                        });

                      }}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Maintenance Details <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2}
                      value={maintentancemaster.maintenancedetails}
                      placeholder="Please Enter Maintentance Details"
                      readOnly
                    // onChange={(e) => {
                    //   setMaintentancemaster({
                    //     ...maintentancemaster,
                    //     maintenancedetails: e.target.value,
                    //   });
                    // }}
                    />
                  </FormControl>
                </Grid> */}

                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Maintenance Frequency<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>

                        <Selects
                          maxMenuHeight={250}
                          options={frequencyOption}
                          value={{
                            label: maintentancemaster.frequency,
                            value: maintentancemaster.frequency,
                          }}
                          onChange={(e) => {
                            setMaintentancemaster({
                              ...maintentancemaster,
                              frequency: e.value,
                              hour: "",
                              min: "",
                              timetype: "",
                              monthdate: "",
                              date: "",
                              annumonth: "",
                              annuday: "",
                            });
                            setSelectedWeeklyOptions([]);
                            setValueWeekly([]);
                            setAddReqTodo([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Schedule<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={scheduleOption}
                          placeholder="Please Select Schedule"
                          value={{
                            label: maintentancemaster.schedule,
                            value: maintentancemaster.schedule,
                          }}
                          onChange={(e) => {
                            setMaintentancemaster({
                              ...maintentancemaster,
                              schedule: e.value,
                              hour: "",
                              min: "",
                              timetype: "",
                              monthdate: "",
                              date: "",
                              annumonth: "",

                              annuday: "",
                            });
                            setSelectedWeeklyOptions([]);
                            setValueWeekly([]);
                            setAddReqTodo([]);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    {maintentancemaster.schedule === "Time Based" && (
                      <>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>
                              Time<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>

                            <Grid container>
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={maintentancemaster.hour}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={(e) => {
                                      setMaintentancemaster({
                                        ...maintentancemaster,
                                        hour: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"01"}>01</MenuItem>
                                    <MenuItem value={"02"}>02</MenuItem>
                                    <MenuItem value={"03"}>03</MenuItem>
                                    <MenuItem value={"04"}>04</MenuItem>
                                    <MenuItem value={"05"}>05</MenuItem>
                                    <MenuItem value={"06"}>06</MenuItem>
                                    <MenuItem value={"07"}>07</MenuItem>
                                    <MenuItem value={"08"}>08</MenuItem>
                                    <MenuItem value={"09"}>09</MenuItem>
                                    <MenuItem value={"10"}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={maintentancemaster.min}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={(e) => {
                                      setMaintentancemaster({
                                        ...maintentancemaster,
                                        min: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"00"}>00</MenuItem>
                                    <MenuItem value={"01"}>01</MenuItem>
                                    <MenuItem value={"02"}>02</MenuItem>
                                    <MenuItem value={"03"}>03</MenuItem>
                                    <MenuItem value={"04"}>04</MenuItem>
                                    <MenuItem value={"05"}>05</MenuItem>
                                    <MenuItem value={"06"}>06</MenuItem>
                                    <MenuItem value={"07"}>07</MenuItem>
                                    <MenuItem value={"08"}>08</MenuItem>
                                    <MenuItem value={"09"}>09</MenuItem>
                                    <MenuItem value={"10"}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={13}>13</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={16}>16</MenuItem>
                                    <MenuItem value={17}>17</MenuItem>
                                    <MenuItem value={18}>18</MenuItem>
                                    <MenuItem value={19}>19</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={21}>21</MenuItem>
                                    <MenuItem value={22}>22</MenuItem>
                                    <MenuItem value={23}>23</MenuItem>
                                    <MenuItem value={24}>24</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={26}>26</MenuItem>
                                    <MenuItem value={27}>27</MenuItem>
                                    <MenuItem value={28}>28</MenuItem>
                                    <MenuItem value={29}>29</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={31}>31</MenuItem>
                                    <MenuItem value={32}>32</MenuItem>
                                    <MenuItem value={33}>33</MenuItem>
                                    <MenuItem value={34}>34</MenuItem>
                                    <MenuItem value={35}>35</MenuItem>
                                    <MenuItem value={36}>36</MenuItem>
                                    <MenuItem value={37}>37</MenuItem>
                                    <MenuItem value={38}>38</MenuItem>
                                    <MenuItem value={39}>39</MenuItem>
                                    <MenuItem value={40}>40</MenuItem>
                                    <MenuItem value={41}>41</MenuItem>
                                    <MenuItem value={42}>42</MenuItem>
                                    <MenuItem value={43}>43</MenuItem>
                                    <MenuItem value={44}>44</MenuItem>
                                    <MenuItem value={45}>45</MenuItem>
                                    <MenuItem value={46}>46</MenuItem>
                                    <MenuItem value={47}>47</MenuItem>
                                    <MenuItem value={48}>48</MenuItem>
                                    <MenuItem value={49}>49</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={51}>51</MenuItem>
                                    <MenuItem value={52}>52</MenuItem>
                                    <MenuItem value={53}>53</MenuItem>
                                    <MenuItem value={54}>54</MenuItem>
                                    <MenuItem value={55}>55</MenuItem>
                                    <MenuItem value={56}>56</MenuItem>
                                    <MenuItem value={57}>57</MenuItem>
                                    <MenuItem value={58}>58</MenuItem>
                                    <MenuItem value={59}>59</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={maintentancemaster.timetype}
                                    onChange={(e) => {
                                      setMaintentancemaster({
                                        ...maintentancemaster,
                                        timetype: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"AM"}>AM</MenuItem>
                                    <MenuItem value={"PM"}>PM</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </FormControl>
                        </Grid>
                        <Grid item md={0.5} xs={12} sm={12}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={addTodo}
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
                      </>
                    )}
                    {(maintentancemaster.frequency === "Monthly" ||
                      maintentancemaster.frequency === "Date Wise") && (
                        <>
                          <Grid item lg={3} md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                <b>
                                  {" "}
                                  Date<b style={{ color: "red" }}>*</b>{" "}
                                </b>
                              </Typography>

                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={maintentancemaster.monthdate}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => {
                                  setMaintentancemaster({
                                    ...maintentancemaster,
                                    monthdate: e.target.value,
                                  });
                                }}
                              >
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                                <MenuItem value={13}>13</MenuItem>
                                <MenuItem value={14}>14</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={16}>16</MenuItem>
                                <MenuItem value={17}>17</MenuItem>
                                <MenuItem value={18}>18</MenuItem>
                                <MenuItem value={19}>19</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={21}>21</MenuItem>
                                <MenuItem value={22}>22</MenuItem>
                                <MenuItem value={23}>23</MenuItem>
                                <MenuItem value={24}>24</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={26}>26</MenuItem>
                                <MenuItem value={27}>27</MenuItem>
                                <MenuItem value={28}>28</MenuItem>
                                <MenuItem value={29}>29</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={31}>31</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {(maintentancemaster.frequency === "Weekly" ||
                      maintentancemaster.frequency === "Day Wise") && (
                        <>
                          <Grid item lg={3} md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                <b>
                                  {" "}
                                  Days<b style={{ color: "red" }}>*</b>{" "}
                                </b>
                              </Typography>

                              <MultiSelect
                                size="small"
                                options={weekdays}
                                value={selectedWeeklyOptions}
                                onChange={handleWeeklyChange}
                                valueRenderer={customValueRendererCate}
                                labelledBy="Please Select Days"
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {maintentancemaster.frequency === "Annually" && (
                      <>
                        <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b>
                              {" "}
                              Month <b style={{ color: "red" }}>*</b>{" "}
                            </b>
                          </InputLabel>
                          <FormControl size="small" fullWidth>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={maintentancemaster.annumonth}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                    width: 80,
                                  },
                                },
                              }}
                              onChange={(e) => {
                                setMaintentancemaster({
                                  ...maintentancemaster,
                                  annumonth: e.target.value,
                                });
                              }}
                            >
                              <MenuItem value={"01"}>01</MenuItem>
                              <MenuItem value={"02"}>02</MenuItem>
                              <MenuItem value={"03"}>03</MenuItem>
                              <MenuItem value={"04"}>04</MenuItem>
                              <MenuItem value={"05"}>05</MenuItem>
                              <MenuItem value={"06"}>06</MenuItem>
                              <MenuItem value={"07"}>07</MenuItem>
                              <MenuItem value={"08"}>08</MenuItem>
                              <MenuItem value={"09"}>09</MenuItem>
                              <MenuItem value={"10"}>10</MenuItem>
                              <MenuItem value={11}>11</MenuItem>
                              <MenuItem value={12}>12</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b>
                              {" "}
                              Day <b style={{ color: "red" }}>*</b>{" "}
                            </b>
                          </InputLabel>

                          <FormControl size="small" fullWidth>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={maintentancemaster.annuday}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                    width: 80,
                                  },
                                },
                              }}
                              onChange={(e) => {
                                setMaintentancemaster({
                                  ...maintentancemaster,
                                  annuday: e.target.value,
                                });
                              }}
                            >
                              <MenuItem value={"00"}>00</MenuItem>
                              <MenuItem value={"01"}>01</MenuItem>
                              <MenuItem value={"02"}>02</MenuItem>
                              <MenuItem value={"03"}>03</MenuItem>
                              <MenuItem value={"04"}>04</MenuItem>
                              <MenuItem value={"05"}>05</MenuItem>
                              <MenuItem value={"06"}>06</MenuItem>
                              <MenuItem value={"07"}>07</MenuItem>
                              <MenuItem value={"08"}>08</MenuItem>
                              <MenuItem value={"09"}>09</MenuItem>
                              <MenuItem value={"10"}>10</MenuItem>
                              <MenuItem value={11}>11</MenuItem>
                              <MenuItem value={12}>12</MenuItem>
                              <MenuItem value={13}>13</MenuItem>
                              <MenuItem value={14}>14</MenuItem>
                              <MenuItem value={15}>15</MenuItem>
                              <MenuItem value={16}>16</MenuItem>
                              <MenuItem value={17}>17</MenuItem>
                              <MenuItem value={18}>18</MenuItem>
                              <MenuItem value={19}>19</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                              <MenuItem value={21}>21</MenuItem>
                              <MenuItem value={22}>22</MenuItem>
                              <MenuItem value={23}>23</MenuItem>
                              <MenuItem value={24}>24</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={26}>26</MenuItem>
                              <MenuItem value={27}>27</MenuItem>
                              <MenuItem value={28}>28</MenuItem>
                              <MenuItem value={29}>29</MenuItem>
                              <MenuItem value={30}>30</MenuItem>
                              <MenuItem value={31}>31</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Grid item md={6} xs={12} sm={6}>
                    {addReqTodo?.length > 0 && (
                      <ul type="none">
                        {addReqTodo?.map((row, index) => {
                          return (
                            <li key={index}>
                              <Grid container spacing={2}>
                                {editingIndexcheck === index ? (
                                  // index == 0
                                  <>
                                    <Grid
                                      item
                                      lg={8}
                                      md={10}
                                      sm={12}
                                      xs={12}
                                      marginTop={2}
                                    >
                                      <Grid container>
                                        <Grid item xs={3.5} sm={3.5} md={3.5}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={hourTodo}
                                              MenuProps={{
                                                PaperProps: {
                                                  style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                  },
                                                },
                                              }}
                                              onChange={(e) => {
                                                setHourTodo(e.target.value);
                                              }}
                                            >
                                              <MenuItem value={"01"}>
                                                01
                                              </MenuItem>
                                              <MenuItem value={"02"}>
                                                02
                                              </MenuItem>
                                              <MenuItem value={"03"}>
                                                03
                                              </MenuItem>
                                              <MenuItem value={"04"}>
                                                04
                                              </MenuItem>
                                              <MenuItem value={"05"}>
                                                05
                                              </MenuItem>
                                              <MenuItem value={"06"}>
                                                06
                                              </MenuItem>
                                              <MenuItem value={"07"}>
                                                07
                                              </MenuItem>
                                              <MenuItem value={"08"}>
                                                08
                                              </MenuItem>
                                              <MenuItem value={"09"}>
                                                09
                                              </MenuItem>
                                              <MenuItem value={"10"}>
                                                10
                                              </MenuItem>
                                              <MenuItem value={11}>11</MenuItem>
                                              <MenuItem value={12}>12</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                        <Grid item xs={3.5} sm={3.5} md={3.5}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={minutesTodo}
                                              MenuProps={{
                                                PaperProps: {
                                                  style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                  },
                                                },
                                              }}
                                              onChange={(e) => {
                                                setMinutesTodo(e.target.value);
                                              }}
                                            >
                                              <MenuItem value={"00"}>
                                                00
                                              </MenuItem>
                                              <MenuItem value={"01"}>
                                                01
                                              </MenuItem>
                                              <MenuItem value={"02"}>
                                                02
                                              </MenuItem>
                                              <MenuItem value={"03"}>
                                                03
                                              </MenuItem>
                                              <MenuItem value={"04"}>
                                                04
                                              </MenuItem>
                                              <MenuItem value={"05"}>
                                                05
                                              </MenuItem>
                                              <MenuItem value={"06"}>
                                                06
                                              </MenuItem>
                                              <MenuItem value={"07"}>
                                                07
                                              </MenuItem>
                                              <MenuItem value={"08"}>
                                                08
                                              </MenuItem>
                                              <MenuItem value={"09"}>
                                                09
                                              </MenuItem>
                                              <MenuItem value={"10"}>
                                                10
                                              </MenuItem>
                                              <MenuItem value={11}>11</MenuItem>
                                              <MenuItem value={12}>12</MenuItem>
                                              <MenuItem value={13}>13</MenuItem>
                                              <MenuItem value={14}>14</MenuItem>
                                              <MenuItem value={15}>15</MenuItem>
                                              <MenuItem value={16}>16</MenuItem>
                                              <MenuItem value={17}>17</MenuItem>
                                              <MenuItem value={18}>18</MenuItem>
                                              <MenuItem value={19}>19</MenuItem>
                                              <MenuItem value={20}>20</MenuItem>
                                              <MenuItem value={21}>21</MenuItem>
                                              <MenuItem value={22}>22</MenuItem>
                                              <MenuItem value={23}>23</MenuItem>
                                              <MenuItem value={24}>24</MenuItem>
                                              <MenuItem value={25}>25</MenuItem>
                                              <MenuItem value={26}>26</MenuItem>
                                              <MenuItem value={27}>27</MenuItem>
                                              <MenuItem value={28}>28</MenuItem>
                                              <MenuItem value={29}>29</MenuItem>
                                              <MenuItem value={30}>30</MenuItem>
                                              <MenuItem value={31}>31</MenuItem>
                                              <MenuItem value={32}>32</MenuItem>
                                              <MenuItem value={33}>33</MenuItem>
                                              <MenuItem value={34}>34</MenuItem>
                                              <MenuItem value={35}>35</MenuItem>
                                              <MenuItem value={36}>36</MenuItem>
                                              <MenuItem value={37}>37</MenuItem>
                                              <MenuItem value={38}>38</MenuItem>
                                              <MenuItem value={39}>39</MenuItem>
                                              <MenuItem value={40}>40</MenuItem>
                                              <MenuItem value={41}>41</MenuItem>
                                              <MenuItem value={42}>42</MenuItem>
                                              <MenuItem value={43}>43</MenuItem>
                                              <MenuItem value={44}>44</MenuItem>
                                              <MenuItem value={45}>45</MenuItem>
                                              <MenuItem value={46}>46</MenuItem>
                                              <MenuItem value={47}>47</MenuItem>
                                              <MenuItem value={48}>48</MenuItem>
                                              <MenuItem value={49}>49</MenuItem>
                                              <MenuItem value={50}>50</MenuItem>
                                              <MenuItem value={51}>51</MenuItem>
                                              <MenuItem value={52}>52</MenuItem>
                                              <MenuItem value={53}>53</MenuItem>
                                              <MenuItem value={54}>54</MenuItem>
                                              <MenuItem value={55}>55</MenuItem>
                                              <MenuItem value={56}>56</MenuItem>
                                              <MenuItem value={57}>57</MenuItem>
                                              <MenuItem value={58}>58</MenuItem>
                                              <MenuItem value={59}>59</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                        <Grid item xs={3.5} sm={3.5} md={3.5}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={timeTypeTodo}
                                              onChange={(e) => {
                                                setTimeTypeTodo(e.target.value);
                                              }}
                                            >
                                              <MenuItem value={"AM"}>
                                                AM
                                              </MenuItem>
                                              <MenuItem value={"PM"}>
                                                PM
                                              </MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    </Grid>

                                    <Grid item lg={3} md={1} sm={1} xs={1}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={6} sm={6} md={6}>
                                          {/* <Box sx={{ display: "flex", gap: "10px", justifyContent: "space-around", alignItems: "center" }}> */}

                                          <Button
                                            variant="contained"
                                            color="success"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "37px",
                                              padding: "6px 10px",
                                            }}
                                            onClick={() => {
                                              if (
                                                addReqTodo?.some(
                                                  (data, inde) =>
                                                    data?.hour === hourTodo &&
                                                    data?.min === minutesTodo &&
                                                    data?.timetype ===
                                                    timeTypeTodo &&
                                                    index !== inde
                                                )
                                              ) {
                                                setPopupContentMalert(
                                                  "Already Time Added!"
                                                );
                                                setPopupSeverityMalert("info");
                                                handleClickOpenPopupMalert();
                                              } else {
                                                const updatedIsTodoEdit = [
                                                  ...isTodoEdit,
                                                ];
                                                updatedIsTodoEdit[
                                                  index
                                                ] = false;
                                                setIsTodoEdit(
                                                  updatedIsTodoEdit
                                                );
                                                setTodoSubmit(false);
                                                handleUpdateTodocheck();
                                              }
                                            }}
                                          >
                                            <MdOutlineDone
                                              style={{
                                                fontSize: "17px",
                                                fontWeight: "bold",
                                              }}
                                            />
                                          </Button>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                          <Button
                                            variant="contained"
                                            color="error"
                                            type="button"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "37px",
                                              padding: "6px 10px",
                                            }}
                                            onClick={() => {
                                              const updatedIsTodoEdit = [
                                                ...isTodoEdit,
                                              ];
                                              updatedIsTodoEdit[index] = false;
                                              setIsTodoEdit(updatedIsTodoEdit);
                                              setTodoSubmit(false);
                                              setEditingIndexcheck(-1);
                                            }}
                                          >
                                            <AiOutlineClose />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item lg={8} md={10} sm={12} xs={12}>
                                      <Grid container>
                                        <Grid item md={3.5} xs={3.5} sm={3.5}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Hour</Typography>
                                            <OutlinedInput
                                              readOnly
                                              value={row.hour}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={3.5} xs={3.5} sm={3.5}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Minutes</Typography>
                                            <OutlinedInput
                                              readOnly
                                              value={row.min}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={3.5} xs={3.5} sm={3.5}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Type</Typography>
                                            <OutlinedInput
                                              readOnly
                                              value={row.timetype}
                                            />
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid item lg={3} md={1} sm={1} xs={1}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={6} sm={6} md={6}>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "37px",
                                              padding: "6px 10px",
                                            }}
                                            onClick={() => {
                                              const updatedIsTodoEdit = [
                                                ...isTodoEdit,
                                              ];
                                              updatedIsTodoEdit[index] = true;
                                              setIsTodoEdit(updatedIsTodoEdit);
                                              setTodoSubmit(true);
                                              setEditingIndexcheck(index);
                                              handleEditTodocheck(index);
                                            }}
                                          >
                                            <FaEdit />
                                          </Button>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                          <Button
                                            variant="contained"
                                            color="error"
                                            type="button"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "37px",
                                              padding: "6px 10px",
                                            }}
                                            onClick={() => {
                                              deleteTodo(index);
                                            }}
                                          >
                                            <AiOutlineClose />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                              </Grid>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Grid>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{ label: hours, value: hours }}
                          onChange={(e) => {
                            setHours(e.value);
                            setMaintentancemaster({
                              ...maintentancemaster,
                              duration: `${e.value}:${minutes}`,
                              breakupcount: "",
                            });
                            setbreakupHours("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="Mins"
                          value={{ label: minutes, value: minutes }}
                          onChange={(e) => {
                            setMinutes(e.value);
                            setMaintentancemaster({
                              ...maintentancemaster,
                              duration: `${hours}:${e.value}`,
                              breakupcount: "",
                            });
                            setbreakupHours("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Breakup Count<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="Number"
                    sx={userStyle.input}
                    value={maintentancemaster.breakupcount}
                    onChange={(e) => {
                      const ans = e.target.value > 0 ? e.target.value : "";
                      handleTimeCalculate(ans);
                      setMaintentancemaster({
                        ...maintentancemaster,
                        breakupcount: ans,
                      });
                    }}
                  />
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Breakup</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    readOnly
                    value={`${breakuphours} mins`}
                  />
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Required</Typography>
                    <MultiSelect
                      options={requiredOption}
                      value={selectedRequiredOptionsCate}
                      onChange={handleRequiredChange}
                      valueRenderer={customValueRendererRequired}
                      labelledBy="Please Select Required"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch ? accessbranch
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.companyto,
                        value: maintentancemaster.companyto,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          companyto: e.value,
                        });
                        // setSelectedBranchTo([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) => maintentancemaster.companyto === comp.company
                        )
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
                        }) : []}
                      value={selectedBranchTo}
                      onChange={handleBranchChangeTo}
                      valueRenderer={customValueRendererBranchTo}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) =>
                            maintentancemaster.companyto === comp.company &&
                            bnuserto?.includes(comp.branch)
                        )
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
                        }) : []}
                      value={selectedUnitTo}
                      onChange={handleUnitChangeTo}
                      valueRenderer={customValueRendererUnitTo}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>

                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            maintentancemaster.companyto === comp.company &&
                            bnuserto?.includes(comp.branch) &&
                            unituserto?.includes(comp.unit)
                        )
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
                      value={selectedTeamTo}
                      onChange={handleTeamChangeTo}
                      valueRenderer={customValueRendererTeamTo}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        { label: "ALL", value: "ALL" },
                        ...allUsersData
                          ?.filter(
                            (comp) =>
                              maintentancemaster.companyto === comp.company &&
                              selectedBranchTo
                                .map((item) => item.value)
                                .includes(comp.branch) &&
                              selectedUnitTo
                                .map((item) => item.value)
                                .includes(comp.unit) &&
                              selectedTeamTo
                                .map((item) => item.value)
                                .includes(comp.team)
                          )
                          ?.map((com) => ({
                            ...com,
                            label: com.companyname,
                            value: com.companyname,
                          })),
                      ]}
                      value={selectedEmployeeTo}
                      onChange={handleEmployeeChangeTo}
                      valueRenderer={customValueRendererEmployeeTo}
                      labelledBy="Please Select Employeename"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Schedule Status</Typography>
                    <Selects
                      options={[
                        { label: "Active", value: "Active" },
                        { label: "InActive", value: "InActive" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: taskDesignationGrouping.schedulestatus,
                        value: taskDesignationGrouping.schedulestatus,
                      }}
                      onChange={(e) => {
                        setTaskDesignationGrouping({
                          ...taskDesignationGrouping,
                          schedulestatus: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Task Assign</Typography>
                    <Selects
                      options={[
                        { label: "Individual", value: "Individual" },
                        { label: "Team", value: "Team" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: taskDesignationGrouping.taskassign,
                        value: taskDesignationGrouping.taskassign,
                      }}
                      onChange={(e) => {
                        setTaskDesignationGrouping({
                          ...taskDesignationGrouping,
                          taskassign: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Need Vendor<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster?.needvendor ? maintentancemaster?.needvendor : "Please Select Yes/No",
                        value: maintentancemaster?.needvendor ? maintentancemaster?.needvendor : "Please Select Yes/No",
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          needvendor: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {maintentancemaster?.needvendor === "Yes" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Vendor Group Name<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={vendorGroupOpt}
                          styles={colourStyles}
                          value={{ label: vendorGroup, value: vendorGroup }}
                          onChange={(e) => {
                            handleChangeGroupName(e);
                            setVendorGroup(e.value);
                            setVendor("Choose Vendor");
                          }}
                        />
                      </FormControl>
                    </Grid>


                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Vendor<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={vendorOpt}
                          styles={colourStyles}
                          value={{ label: vendor, value: vendor }}
                          onChange={(e) => {
                            setVendor(e.value);
                            vendorid(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <Typography>Address</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={vendorgetid?.address}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Phone </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendorgetid?.phonenumber}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Email </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendorgetid?.emailid}
                          readOnly
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Other No </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendorgetid?.phonenumberone}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                  </>
                )
                }


                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Priority<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "High", value: "High" },
                        { label: "Medium", value: "Medium" },
                        { label: "Low", value: "Low" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.priority,
                        value: maintentancemaster.priority,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          priority: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sx={12}></Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Description<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <ReactQuill
                      style={{ maxHeight: "250px", height: "250px" }}
                      value={agenda}
                      onChange={setAgenda}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }], // Note: Font options should be an array
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [{ align: [] }],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "align",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "video",
                        "Times New Roman",
                      ]}
                    />
                  </FormControl>
                  <br /> <br />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <br /> <br />
                  <Typography variant="h6">Upload Document</Typography>
                  <Grid marginTop={2}>
                    <Button
                      variant="contained"
                      size="small"
                      component="label"
                      sx={{
                        "@media only screen and (max-width:550px)": {
                          marginY: "5px",
                        },
                      }}
                    >
                      Upload
                      <input
                        type="file"
                        id="resume"
                        accept=".xlsx, .xls, .csv, .pdf, .txt, .image , .png , .jpg , .jpeg"
                        name="file"
                        hidden
                        onChange={(e) => {
                          handleResumeUpload(e);
                        }}
                      />
                    </Button>
                    <br />
                    <br />
                    {documentFiles?.length > 0 &&
                      documentFiles?.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={6}>
                              <Typography>{file?.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreview(file)}
                              />
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <Button
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                  marginTop: "-5px",
                                }}
                                onClick={() => handleFileDelete(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <br />

              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <LoadingButton
                    loading={btnLoad}
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                  >
                    Create
                  </LoadingButton>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{ marginTop: "95px" }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Maintenance
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch ? accessbranch
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.company,
                        value: maintentancemasteredit.company,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });

                        setAreasEdit([]);
                        setFloorEdit([]);

                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        setMaterialDetailsOptEdit([]);
                        setValueAssetCodeEditCat([]);
                        setSelectedOptionsAssetCodeEdit([]);
                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company
                        )
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.branch,
                        value: maintentancemasteredit.branch,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOptEdit([]);
                        setValueAssetCodeEditCat([]);
                        setSelectedOptionsAssetCodeEdit([]);
                        setAreasEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        setFloorEdit([]);
                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company &&
                            maintentancemasteredit.branch === comp.branch
                        )
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.unit,
                        value: maintentancemasteredit.unit,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          unit: e.value,
                          workstation: "",
                          assetmaterial: "Please Select AssetMaterial",
                        });
                        setMaterialDetailsOptEdit([]);
                        setValueAssetCodeEditCat([]);
                        setSelectedOptionsAssetCodeEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floorsEdit}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.floor,
                        value: maintentancemasteredit.floor,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          floor: e.value,
                          workstation: "",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOptEdit([]);
                        setValueAssetCodeEditCat([]);
                        setSelectedOptionsAssetCodeEdit([]);
                        setAreasEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        fetchAreaEdit(maintentancemasteredit.branch, e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={areasEdit}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.area,
                        value: maintentancemasteredit.area,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          area: e.value,
                          workstation: "",
                          location: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOptEdit([]);
                        setValueAssetCodeEditCat([]);
                        setSelectedOptionsAssetCodeEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        fetchAllLocationEdit(
                          maintentancemasteredit.branch,
                          maintentancemasteredit.floor,
                          e.value
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={locationsEdit}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.location,
                        value: maintentancemasteredit.location,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          location: e.value,
                          assetmaterial: "Please Select AssetMaterial",
                          maintenancedetails: "",
                        });
                        setMaterialDetailsOptEdit([]);
                        setValueAssetCodeEditCat([]);
                        setSelectedOptionsAssetCodeEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={
                        maintentancemasteredit.location === "ALL"
                          ? Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    locationsEdit
                                      .map((item) => item.value)
                                      .includes(subpro.location) &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    maintentancemasteredit.company &&
                                    subpro.branch ===
                                    maintentancemasteredit.branch &&
                                    subpro.unit ===
                                    maintentancemasteredit.unit &&
                                    subpro.floor ===
                                    maintentancemasteredit.floor &&
                                    subpro.area ===
                                    maintentancemasteredit.area
                                )
                                // .map((t) => t.component)
                                // .reduce((acc, curr) => acc.concat(curr), [])
                                .map((t) => ({
                                  ...t,
                                  label: t?.assetmaterial,
                                  value: t?.assetmaterial,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    subpro.location ===
                                    maintentancemasteredit.location &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    maintentancemasteredit.company &&
                                    subpro.branch ===
                                    maintentancemasteredit.branch &&
                                    subpro.unit ===
                                    maintentancemasteredit.unit &&
                                    subpro.floor ===
                                    maintentancemasteredit.floor &&
                                    subpro.area ===
                                    maintentancemasteredit.area
                                )
                                // .map((t) => t.component)
                                // .reduce((acc, curr) => acc.concat(curr), [])
                                .map((t) => ({
                                  ...t,
                                  label: t?.assetmaterial,
                                  value: t?.assetmaterial,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={{
                        label: maintentancemasteredit.assetmaterial,
                        value: maintentancemasteredit.assetmaterial,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          assetmaterial: e.value,
                          assetmaterialcheck: "",
                          maintenancedetails: ""
                        });
                        setMaterialDetailsOptEdit([]);
                        setValueAssetCodeEditCat([]);
                        setSelectedOptionsAssetCodeEdit([]);
                        // AssetMaterialOnchangeEdit(e)
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Asset Material Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={
                        maintentancemasteredit.location === "ALL"
                          ? Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    locationsEdit
                                      .map((item) => item.value)
                                      .includes(subpro.location) &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    maintentancemasteredit.company &&
                                    subpro.branch ===
                                    maintentancemasteredit.branch &&
                                    subpro.unit ===
                                    maintentancemasteredit.unit &&
                                    subpro.floor ===
                                    maintentancemasteredit.floor &&
                                    subpro.area ===
                                    maintentancemasteredit.area &&
                                    subpro.assetmaterial ===
                                    maintentancemasteredit.assetmaterial
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
                                .filter(data => maintenanceDetails?.some(item => item?.assetmaterialcode === data))
                                .map((t) => ({
                                  ...t,
                                  label: t,
                                  value: t,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    subpro.location ===
                                    maintentancemasteredit.location &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    maintentancemasteredit.company &&
                                    subpro.branch ===
                                    maintentancemasteredit.branch &&
                                    subpro.unit ===
                                    maintentancemasteredit.unit &&
                                    subpro.floor ===
                                    maintentancemasteredit.floor &&
                                    subpro.area ===
                                    maintentancemasteredit.area &&
                                    subpro.assetmaterial ===
                                    maintentancemasteredit.assetmaterial
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
                                .filter(data => maintenanceDetails?.some(item => item?.assetmaterialcode === data))
                                .map((t) => ({
                                  ...t,
                                  label: t,
                                  value: t,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={selectedOptionsAssetCodeEdit}
                      onChange={(e) => {
                        handleAssetCodeEditChange(e);
                      }}
                      valueRenderer={customValueRendererAssetCodeEdit}
                      labelledBy="Please Select Asset Material Code"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Maintenance Details <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={materialDetailsOptEdit}
                      value={{
                        label: maintentancemasteredit.maintenancedetails ? maintentancemasteredit.maintenancedetails : "Please Select Maintenance Details",
                        value: maintentancemasteredit.maintenancedetails ? maintentancemasteredit.maintenancedetails : "Please Select Maintenance Details",
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          maintenancedetails: e.value,
                        });

                      }}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Maintenance Details <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2}
                      value={maintentancemasteredit?.maintenancedetails}
                      readOnly
                    // onChange={(e) => {
                    //   setMaintentancemasteredit({
                    //     ...maintentancemasteredit,
                    //     maintenancedetails: e.target.value,
                    //   });
                    // }}
                    />
                  </FormControl>
                </Grid> */}

                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Maintenance Frequency<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>

                        <Selects
                          maxMenuHeight={250}
                          options={frequencyOption}
                          value={{
                            label: maintentancemasteredit.frequency,
                            value: maintentancemasteredit.frequency,
                          }}
                          onChange={(e) => {
                            setMaintentancemasteredit({
                              ...maintentancemasteredit,
                              frequency: e.value,
                              hour: "",
                              min: "",
                              timetype: "",
                              monthdate: "",
                              date: "",
                              annumonth: "",
                              annuday: "",
                            });
                            setSelectedWeeklyOptionsEdit([]);
                            setValueWeeklyEdit([]);
                            setAddReqTodoEdit([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Schedule<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={scheduleOption}
                          placeholder="Please Select Schedule"
                          value={{
                            label:
                              maintentancemasteredit.schedule === ""
                                ? "Please Select Schedule"
                                : maintentancemasteredit.schedule,
                            value:
                              maintentancemasteredit.schedule === ""
                                ? "Please Select Schedule"
                                : maintentancemasteredit.schedule,
                          }}
                          onChange={(e) => {
                            setMaintentancemasteredit({
                              ...maintentancemasteredit,
                              schedule: e.value,
                              monthdate: "",
                              date: "",
                              annumonth: "",
                              annuday: "",
                            });
                            setSelectedWeeklyOptionsEdit([]);
                            setValueWeeklyEdit([]);
                            setAddReqTodoEdit([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {maintentancemasteredit.schedule === "Time Based" && (
                      <>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>
                              Time<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>

                            <Grid container>
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={maintentancemasteredit.hour}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={(e) => {
                                      setMaintentancemasteredit({
                                        ...maintentancemasteredit,
                                        hour: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"01"}>01</MenuItem>
                                    <MenuItem value={"02"}>02</MenuItem>
                                    <MenuItem value={"03"}>03</MenuItem>
                                    <MenuItem value={"04"}>04</MenuItem>
                                    <MenuItem value={"05"}>05</MenuItem>
                                    <MenuItem value={"06"}>06</MenuItem>
                                    <MenuItem value={"07"}>07</MenuItem>
                                    <MenuItem value={"08"}>08</MenuItem>
                                    <MenuItem value={"09"}>09</MenuItem>
                                    <MenuItem value={"10"}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={maintentancemasteredit.min}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={(e) => {
                                      setMaintentancemasteredit({
                                        ...maintentancemasteredit,
                                        min: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"00"}>00</MenuItem>
                                    <MenuItem value={"01"}>01</MenuItem>
                                    <MenuItem value={"02"}>02</MenuItem>
                                    <MenuItem value={"03"}>03</MenuItem>
                                    <MenuItem value={"04"}>04</MenuItem>
                                    <MenuItem value={"05"}>05</MenuItem>
                                    <MenuItem value={"06"}>06</MenuItem>
                                    <MenuItem value={"07"}>07</MenuItem>
                                    <MenuItem value={"08"}>08</MenuItem>
                                    <MenuItem value={"09"}>09</MenuItem>
                                    <MenuItem value={"10"}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={13}>13</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={16}>16</MenuItem>
                                    <MenuItem value={17}>17</MenuItem>
                                    <MenuItem value={18}>18</MenuItem>
                                    <MenuItem value={19}>19</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={21}>21</MenuItem>
                                    <MenuItem value={22}>22</MenuItem>
                                    <MenuItem value={23}>23</MenuItem>
                                    <MenuItem value={24}>24</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={26}>26</MenuItem>
                                    <MenuItem value={27}>27</MenuItem>
                                    <MenuItem value={28}>28</MenuItem>
                                    <MenuItem value={29}>29</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={31}>31</MenuItem>
                                    <MenuItem value={32}>32</MenuItem>
                                    <MenuItem value={33}>33</MenuItem>
                                    <MenuItem value={34}>34</MenuItem>
                                    <MenuItem value={35}>35</MenuItem>
                                    <MenuItem value={36}>36</MenuItem>
                                    <MenuItem value={37}>37</MenuItem>
                                    <MenuItem value={38}>38</MenuItem>
                                    <MenuItem value={39}>39</MenuItem>
                                    <MenuItem value={40}>40</MenuItem>
                                    <MenuItem value={41}>41</MenuItem>
                                    <MenuItem value={42}>42</MenuItem>
                                    <MenuItem value={43}>43</MenuItem>
                                    <MenuItem value={44}>44</MenuItem>
                                    <MenuItem value={45}>45</MenuItem>
                                    <MenuItem value={46}>46</MenuItem>
                                    <MenuItem value={47}>47</MenuItem>
                                    <MenuItem value={48}>48</MenuItem>
                                    <MenuItem value={49}>49</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={51}>51</MenuItem>
                                    <MenuItem value={52}>52</MenuItem>
                                    <MenuItem value={53}>53</MenuItem>
                                    <MenuItem value={54}>54</MenuItem>
                                    <MenuItem value={55}>55</MenuItem>
                                    <MenuItem value={56}>56</MenuItem>
                                    <MenuItem value={57}>57</MenuItem>
                                    <MenuItem value={58}>58</MenuItem>
                                    <MenuItem value={59}>59</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={maintentancemasteredit.timetype}
                                    onChange={(e) => {
                                      setMaintentancemasteredit({
                                        ...maintentancemasteredit,
                                        timetype: e.target.value,
                                      });
                                    }}
                                  >
                                    <MenuItem value={"AM"}>AM</MenuItem>
                                    <MenuItem value={"PM"}>PM</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </FormControl>
                        </Grid>
                        <Grid item md={0.5} xs={12} sm={12}>
                          <Button
                            variant="contained"
                            color="success"
                            disabled={addReqTodoEdit?.length > 0}
                            onClick={addTodoEdit}
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
                      </>
                    )}
                    {(maintentancemasteredit.frequency === "Monthly" ||
                      maintentancemasteredit.frequency === "Date Wise") && (
                        <>
                          <Grid item lg={3} md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                <b>
                                  {" "}
                                  Date<b style={{ color: "red" }}>*</b>{" "}
                                </b>
                              </Typography>

                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={maintentancemasteredit.monthdate}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => {
                                  setMaintentancemasteredit({
                                    ...maintentancemasteredit,
                                    monthdate: e.target.value,
                                  });
                                }}
                              >
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                                <MenuItem value={13}>13</MenuItem>
                                <MenuItem value={14}>14</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={16}>16</MenuItem>
                                <MenuItem value={17}>17</MenuItem>
                                <MenuItem value={18}>18</MenuItem>
                                <MenuItem value={19}>19</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={21}>21</MenuItem>
                                <MenuItem value={22}>22</MenuItem>
                                <MenuItem value={23}>23</MenuItem>
                                <MenuItem value={24}>24</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={26}>26</MenuItem>
                                <MenuItem value={27}>27</MenuItem>
                                <MenuItem value={28}>28</MenuItem>
                                <MenuItem value={29}>29</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={31}>31</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {(maintentancemasteredit.frequency === "Weekly" ||
                      maintentancemasteredit.frequency === "Day Wise") && (
                        <>
                          <Grid item lg={3} md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                <b>
                                  {" "}
                                  Days<b style={{ color: "red" }}>*</b>{" "}
                                </b>
                              </Typography>

                              <MultiSelect
                                size="small"
                                options={weekdays}
                                value={selectedWeeklyOptionsEdit}
                                onChange={handleWeeklyChangeEdit}
                                valueRenderer={customValueRendererCateEdit}
                                labelledBy="Please Select Days"
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {maintentancemasteredit.frequency === "Annually" && (
                      <>
                        <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b>
                              {" "}
                              Month <b style={{ color: "red" }}>*</b>{" "}
                            </b>
                          </InputLabel>
                          <FormControl size="small" fullWidth>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={maintentancemasteredit.annumonth}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                    width: 80,
                                  },
                                },
                              }}
                              onChange={(e) => {
                                setMaintentancemasteredit({
                                  ...maintentancemasteredit,
                                  annumonth: e.target.value,
                                });
                              }}
                            >
                              <MenuItem value={"01"}>01</MenuItem>
                              <MenuItem value={"02"}>02</MenuItem>
                              <MenuItem value={"03"}>03</MenuItem>
                              <MenuItem value={"04"}>04</MenuItem>
                              <MenuItem value={"05"}>05</MenuItem>
                              <MenuItem value={"06"}>06</MenuItem>
                              <MenuItem value={"07"}>07</MenuItem>
                              <MenuItem value={"08"}>08</MenuItem>
                              <MenuItem value={"09"}>09</MenuItem>
                              <MenuItem value={"10"}>10</MenuItem>
                              <MenuItem value={11}>11</MenuItem>
                              <MenuItem value={12}>12</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b>
                              {" "}
                              Day <b style={{ color: "red" }}>*</b>{" "}
                            </b>
                          </InputLabel>

                          <FormControl size="small" fullWidth>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={maintentancemasteredit.annuday}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                    width: 80,
                                  },
                                },
                              }}
                              onChange={(e) => {
                                setMaintentancemasteredit({
                                  ...maintentancemasteredit,
                                  annuday: e.target.value,
                                });
                              }}
                            >
                              <MenuItem value={"00"}>00</MenuItem>
                              <MenuItem value={"01"}>01</MenuItem>
                              <MenuItem value={"02"}>02</MenuItem>
                              <MenuItem value={"03"}>03</MenuItem>
                              <MenuItem value={"04"}>04</MenuItem>
                              <MenuItem value={"05"}>05</MenuItem>
                              <MenuItem value={"06"}>06</MenuItem>
                              <MenuItem value={"07"}>07</MenuItem>
                              <MenuItem value={"08"}>08</MenuItem>
                              <MenuItem value={"09"}>09</MenuItem>
                              <MenuItem value={"10"}>10</MenuItem>
                              <MenuItem value={11}>11</MenuItem>
                              <MenuItem value={12}>12</MenuItem>
                              <MenuItem value={13}>13</MenuItem>
                              <MenuItem value={14}>14</MenuItem>
                              <MenuItem value={15}>15</MenuItem>
                              <MenuItem value={16}>16</MenuItem>
                              <MenuItem value={17}>17</MenuItem>
                              <MenuItem value={18}>18</MenuItem>
                              <MenuItem value={19}>19</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                              <MenuItem value={21}>21</MenuItem>
                              <MenuItem value={22}>22</MenuItem>
                              <MenuItem value={23}>23</MenuItem>
                              <MenuItem value={24}>24</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={26}>26</MenuItem>
                              <MenuItem value={27}>27</MenuItem>
                              <MenuItem value={28}>28</MenuItem>
                              <MenuItem value={29}>29</MenuItem>
                              <MenuItem value={30}>30</MenuItem>
                              <MenuItem value={31}>31</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>

                <Grid item md={12} xs={12} sm={12}>
                  <Grid item md={6} xs={12} sm={6}>
                    {addReqTodoEdit?.length > 0 && (
                      <ul type="none">
                        {addReqTodoEdit?.map((row, index) => {
                          return (
                            <li key={index}>
                              <Grid container spacing={2}>
                                {editingIndexcheckEdit === index ? (
                                  // index == 0
                                  <>
                                    <Grid
                                      item
                                      lg={8}
                                      md={10}
                                      sm={12}
                                      xs={12}
                                      marginTop={2}
                                    >
                                      <Grid container>
                                        <Grid item xs={3.5} sm={3.5} md={3.5}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={hourTodoEdit}
                                              MenuProps={{
                                                PaperProps: {
                                                  style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                  },
                                                },
                                              }}
                                              onChange={(e) => {
                                                setHourTodoEdit(e.target.value);
                                              }}
                                            >
                                              <MenuItem value={"01"}>
                                                01
                                              </MenuItem>
                                              <MenuItem value={"02"}>
                                                02
                                              </MenuItem>
                                              <MenuItem value={"03"}>
                                                03
                                              </MenuItem>
                                              <MenuItem value={"04"}>
                                                04
                                              </MenuItem>
                                              <MenuItem value={"05"}>
                                                05
                                              </MenuItem>
                                              <MenuItem value={"06"}>
                                                06
                                              </MenuItem>
                                              <MenuItem value={"07"}>
                                                07
                                              </MenuItem>
                                              <MenuItem value={"08"}>
                                                08
                                              </MenuItem>
                                              <MenuItem value={"09"}>
                                                09
                                              </MenuItem>
                                              <MenuItem value={"10"}>
                                                10
                                              </MenuItem>
                                              <MenuItem value={11}>11</MenuItem>
                                              <MenuItem value={12}>12</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                        <Grid item xs={3.5} sm={3.5} md={3.5}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={minutesTodoEdit}
                                              MenuProps={{
                                                PaperProps: {
                                                  style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                  },
                                                },
                                              }}
                                              onChange={(e) => {
                                                setMinutesTodoEdit(
                                                  e.target.value
                                                );
                                              }}
                                            >
                                              <MenuItem value={"00"}>
                                                00
                                              </MenuItem>
                                              <MenuItem value={"01"}>
                                                01
                                              </MenuItem>
                                              <MenuItem value={"02"}>
                                                02
                                              </MenuItem>
                                              <MenuItem value={"03"}>
                                                03
                                              </MenuItem>
                                              <MenuItem value={"04"}>
                                                04
                                              </MenuItem>
                                              <MenuItem value={"05"}>
                                                05
                                              </MenuItem>
                                              <MenuItem value={"06"}>
                                                06
                                              </MenuItem>
                                              <MenuItem value={"07"}>
                                                07
                                              </MenuItem>
                                              <MenuItem value={"08"}>
                                                08
                                              </MenuItem>
                                              <MenuItem value={"09"}>
                                                09
                                              </MenuItem>
                                              <MenuItem value={"10"}>
                                                10
                                              </MenuItem>
                                              <MenuItem value={11}>11</MenuItem>
                                              <MenuItem value={12}>12</MenuItem>
                                              <MenuItem value={13}>13</MenuItem>
                                              <MenuItem value={14}>14</MenuItem>
                                              <MenuItem value={15}>15</MenuItem>
                                              <MenuItem value={16}>16</MenuItem>
                                              <MenuItem value={17}>17</MenuItem>
                                              <MenuItem value={18}>18</MenuItem>
                                              <MenuItem value={19}>19</MenuItem>
                                              <MenuItem value={20}>20</MenuItem>
                                              <MenuItem value={21}>21</MenuItem>
                                              <MenuItem value={22}>22</MenuItem>
                                              <MenuItem value={23}>23</MenuItem>
                                              <MenuItem value={24}>24</MenuItem>
                                              <MenuItem value={25}>25</MenuItem>
                                              <MenuItem value={26}>26</MenuItem>
                                              <MenuItem value={27}>27</MenuItem>
                                              <MenuItem value={28}>28</MenuItem>
                                              <MenuItem value={29}>29</MenuItem>
                                              <MenuItem value={30}>30</MenuItem>
                                              <MenuItem value={31}>31</MenuItem>
                                              <MenuItem value={32}>32</MenuItem>
                                              <MenuItem value={33}>33</MenuItem>
                                              <MenuItem value={34}>34</MenuItem>
                                              <MenuItem value={35}>35</MenuItem>
                                              <MenuItem value={36}>36</MenuItem>
                                              <MenuItem value={37}>37</MenuItem>
                                              <MenuItem value={38}>38</MenuItem>
                                              <MenuItem value={39}>39</MenuItem>
                                              <MenuItem value={40}>40</MenuItem>
                                              <MenuItem value={41}>41</MenuItem>
                                              <MenuItem value={42}>42</MenuItem>
                                              <MenuItem value={43}>43</MenuItem>
                                              <MenuItem value={44}>44</MenuItem>
                                              <MenuItem value={45}>45</MenuItem>
                                              <MenuItem value={46}>46</MenuItem>
                                              <MenuItem value={47}>47</MenuItem>
                                              <MenuItem value={48}>48</MenuItem>
                                              <MenuItem value={49}>49</MenuItem>
                                              <MenuItem value={50}>50</MenuItem>
                                              <MenuItem value={51}>51</MenuItem>
                                              <MenuItem value={52}>52</MenuItem>
                                              <MenuItem value={53}>53</MenuItem>
                                              <MenuItem value={54}>54</MenuItem>
                                              <MenuItem value={55}>55</MenuItem>
                                              <MenuItem value={56}>56</MenuItem>
                                              <MenuItem value={57}>57</MenuItem>
                                              <MenuItem value={58}>58</MenuItem>
                                              <MenuItem value={59}>59</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                        <Grid item xs={3.5} sm={3.5} md={3.5}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={timeTypeTodoEdit}
                                              onChange={(e) => {
                                                setTimeTypeTodoEdit(
                                                  e.target.value
                                                );
                                              }}
                                            >
                                              <MenuItem value={"AM"}>
                                                AM
                                              </MenuItem>
                                              <MenuItem value={"PM"}>
                                                PM
                                              </MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    </Grid>

                                    <Grid item lg={3} md={1} sm={1} xs={1}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={6} sm={6} md={6}>
                                          {/* <Box sx={{ display: "flex", gap: "10px", justifyContent: "space-around", alignItems: "center" }}> */}

                                          <Button
                                            variant="contained"
                                            color="success"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "37px",
                                              padding: "6px 10px",
                                            }}
                                            onClick={() => {
                                              if (
                                                addReqTodoEdit?.some(
                                                  (data, inde) =>
                                                    data?.hour ===
                                                    hourTodoEdit &&
                                                    data?.min ===
                                                    minutesTodoEdit &&
                                                    data?.timetype ===
                                                    timeTypeTodoEdit &&
                                                    index !== inde
                                                )
                                              ) {
                                                setPopupContentMalert(
                                                  "Already Time Added!"
                                                );
                                                setPopupSeverityMalert("info");
                                                handleClickOpenPopupMalert();
                                              } else {
                                                const updatedIsTodoEdit = [
                                                  ...isTodoEditPage,
                                                ];
                                                updatedIsTodoEdit[
                                                  index
                                                ] = false;
                                                setIsTodoEditPage(
                                                  updatedIsTodoEdit
                                                );
                                                setTodoSubmitEdit(false);
                                                handleUpdateTodocheckEdit();
                                              }
                                            }}
                                          >
                                            <MdOutlineDone
                                              style={{
                                                fontSize: "17px",
                                                fontWeight: "bold",
                                              }}
                                            />
                                          </Button>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                          <Button
                                            variant="contained"
                                            color="error"
                                            type="button"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "37px",
                                              padding: "6px 10px",
                                            }}
                                            onClick={() => {
                                              const updatedIsTodoEdit = [
                                                ...isTodoEditPage,
                                              ];
                                              updatedIsTodoEdit[index] = false;
                                              setIsTodoEditPage(
                                                updatedIsTodoEdit
                                              );
                                              setTodoSubmitEdit(false);
                                              setEditingIndexcheckEdit(-1);
                                            }}
                                          >
                                            <AiOutlineClose />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item lg={8} md={10} sm={12} xs={12}>
                                      <Grid container>
                                        <Grid item md={3.5} xs={3.5} sm={3.5}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Hour</Typography>
                                            <OutlinedInput
                                              readOnly
                                              value={row.hour}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={3.5} xs={3.5} sm={3.5}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Minutes</Typography>
                                            <OutlinedInput
                                              readOnly
                                              value={row.min}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={3.5} xs={3.5} sm={3.5}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Type</Typography>
                                            <OutlinedInput
                                              readOnly
                                              value={row.timetype}
                                            />
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid item lg={3} md={1} sm={1} xs={1}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={6} sm={6} md={6}>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "37px",
                                              padding: "6px 10px",
                                            }}
                                            onClick={() => {
                                              const updatedIsTodoEdit = [
                                                ...isTodoEditPage,
                                              ];
                                              updatedIsTodoEdit[index] = true;
                                              setIsTodoEditPage(
                                                updatedIsTodoEdit
                                              );
                                              setTodoSubmitEdit(true);
                                              setEditingIndexcheckEdit(index);
                                              handleEditTodocheckEdit(index);
                                            }}
                                          >
                                            <FaEdit />
                                          </Button>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6}>
                                          <Button
                                            variant="contained"
                                            color="error"
                                            type="button"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "37px",
                                              padding: "6px 10px",
                                            }}
                                            onClick={() => {
                                              deleteTodoEdit(index);
                                            }}
                                          >
                                            <AiOutlineClose />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                              </Grid>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{ label: hoursEdit, value: hoursEdit }}
                          onChange={(e) => {
                            setHoursEdit(e.value);
                            setMaintentancemasteredit({
                              ...maintentancemasteredit,
                              duration: `${e.value}:${minutesEdit}`,
                              breakupcount: "",
                            });
                            setbreakupHoursEdit("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="Mins"
                          value={{ label: minutesEdit, value: minutesEdit }}
                          onChange={(e) => {
                            setMinutesEdit(e.value);
                            setMaintentancemasteredit({
                              ...maintentancemasteredit,
                              duration: `${hoursEdit}:${e.value}`,
                              breakupcount: "",
                            });
                            setbreakupHoursEdit("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Breakup Count<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={maintentancemasteredit.breakupcount}
                      onChange={(e) => {
                        const ans = e.target.value > 0 ? e.target.value : "";
                        handleTimeCalculateEdit(ans);
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          breakupcount: ans,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Breakup</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={`${breakuphoursEdit} mins`}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Required</Typography>
                    <MultiSelect
                      options={requiredOption}
                      value={selectedRequiredOptionsCateEdit}
                      onChange={handleRequiredChangeEdit}
                      valueRenderer={customValueRendererRequiredEdit}
                      labelledBy="Please Select Required"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* <MultiSelect options={companies} value={selectedCompanyToEdit} onChange={handleCompanyChangeToEdit} valueRenderer={customValueRendererCompanyToEdit} labelledBy="Please Select Company" /> */}
                    <Selects
                      options={accessbranch ? accessbranch
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.companyto,
                        value: maintentancemasteredit.companyto,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          companyto: e.value,

                        });
                        setSelectedBranchToEdit([]);
                        setSelectedUnitToEdit([]);
                        setSelectedTeamToEdit([]);
                        setSelectedEmployeeToEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company
                        )
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
                        }) : []}
                      value={selectedBranchToEdit}
                      onChange={handleBranchChangeToEdit}
                      valueRenderer={customValueRendererBranchToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company &&
                            bnuserto?.includes(comp.branch)
                        )
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
                        }) : []}
                      value={selectedUnitToEdit}
                      onChange={handleUnitChangeToEdit}
                      valueRenderer={customValueRendererUnitToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>

                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company &&
                            bnuserto?.includes(comp.branch) &&
                            unituserto?.includes(comp.unit)
                        )
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
                      value={selectedTeamToEdit}
                      onChange={handleTeamChangeToEdit}
                      valueRenderer={customValueRendererTeamToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        { label: "ALL", value: "ALL" },
                        ...allUsersData
                          ?.filter(
                            (comp) =>
                              maintentancemasteredit.companyto ===
                              comp.company &&
                              selectedBranchToEdit
                                .map((item) => item.value)
                                .includes(comp.branch) &&
                              selectedUnitToEdit
                                .map((item) => item.value)
                                .includes(comp.unit) &&
                              selectedTeamToEdit
                                .map((item) => item.value)
                                .includes(comp.team)
                          )
                          ?.map((com) => ({
                            ...com,
                            label: com.companyname,
                            value: com.companyname,
                          })),
                      ]}
                      value={selectedEmployeeToEdit}
                      style={{
                        menu: (provided, state) => ({
                          ...provided,
                          position: "absolute",
                          top: "100%", // Set the desired top position
                          left: "0", // Set the desired left position
                          zIndex: 1000, // Set the desired zIndex
                        }),
                        menuList: (provided, state) => ({
                          ...provided,
                          maxHeight: "200px", // Set the desired max height here
                          overflowY: "auto", // Add scroll if the content exceeds max height
                        }),
                      }}
                      onChange={handleEmployeeChangeToEdit}
                      valueRenderer={customValueRendererEmployeeToEdit}
                      labelledBy="Please Select Employeename"
                    // className="scrollable-multiselect"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Schedule Status</Typography>
                    <Selects
                      options={[
                        { label: "Active", value: "Active" },
                        { label: "InActive", value: "InActive" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.schedulestatus,
                        value: maintentancemasteredit.schedulestatus,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          schedulestatus: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Task Assign</Typography>
                    <Selects
                      options={[
                        { label: "Individual", value: "Individual" },
                        { label: "Team", value: "Team" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.taskassign,
                        value: maintentancemasteredit.taskassign,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          taskassign: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Need Vendor<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={[
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit?.needvendor ? maintentancemasteredit?.needvendor : "Please Select Yes/No",
                        value: maintentancemasteredit?.needvendor ? maintentancemasteredit?.needvendor : "Please Select Yes/No",
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          needvendor: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {maintentancemasteredit?.needvendor === "Yes" && (<>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Vendor Group Name<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={vendorGroupOpt}
                        styles={colourStyles}
                        value={{ label: vendorGroupEdit ? vendorGroupEdit : "Please Select Vendor Group", value: vendorGroupEdit ? vendorGroupEdit : "Please Select Vendor Group" }}
                        onChange={(e) => {
                          handleChangeGroupNameEdit(e);
                          setVendorGroupEdit(e.value);
                          setVendorEdit("Choose Vendor");
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Vendor<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={vendorOptEdit}
                        styles={colourStyles}
                        value={{ label: vendorEdit ? vendorEdit : "Please Select Vendor", value: vendorEdit ? vendorEdit : "Please Select Vendor" }}
                        onChange={(e) => {
                          setVendorEdit(e.value);
                          vendorid(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth>
                      <Typography>Address</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={vendorgetidedit?.address}
                        readOnly
                      // onChange={(e) => { setMaintentancemaster({ ...maintentancemaster, address: e.target.value, }) }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendorgetidedit?.phonenumber}
                        readOnly
                      // onChange={(e) => { setMaintentancemaster({ ...maintentancemaster, phone: e.target.value, }) }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Email </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendorgetidedit?.emailid}
                        readOnly
                      // onChange={(e) => { setMaintentancemaster({ ...maintentancemaster, email: e.target.value, }) }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Other No </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendorgetidedit?.phonenumberone}
                        readOnly
                      // onChange={(e) => { setMaintentancemaster({ ...maintentancemaster, email: e.target.value, }) }}
                      />
                    </FormControl>
                  </Grid>
                </>)}


                {/* <Grid item md={3} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Vendor <b style={{ color: "red" }}>*</b>
                    </Typography>

                    <Selects
                      options={
                        // Array.from(new Set(
                        //   assetdetails
                        //     .filter((d) => d.material === maintentancemasteredit.assetmaterialcheck).map((d) => ({
                        //       ...d,
                        //       label: d.vendor,
                        //       value: d.vendor,
                        //     }))
                        //     .reduce((acc, curr) => {
                        //       if (!acc.some(obj => obj.value === curr.value)) {
                        //         acc.push(curr);
                        //       }
                        //       return acc;
                        //     }, [])))
                        vendormaster
                      }

                      styles={colourStyles}
                      value={{ label: maintentancemasteredit.vendor, value: maintentancemasteredit.vendor }}
                      onChange={(e) => {
                        setMaintentancemasteredit({ ...maintentancemasteredit, vendor: e.value });
                        vendorid(e.value);
                      }}
                    />
                  </FormControl>
                </Grid> */}


                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Priority<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "High", value: "High" },
                        { label: "Medium", value: "Medium" },
                        { label: "Low", value: "Low" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.priority,
                        value: maintentancemasteredit.priority,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          priority: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}></Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Description<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <ReactQuill
                      style={{ maxHeight: "250px", height: "250px" }}
                      value={maintentancemasteredit.description}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          description: e,
                        });
                      }}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }], // Note: Font options should be an array
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [{ align: [] }],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "align",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "video",
                        "Times New Roman",
                      ]}
                    />
                  </FormControl>
                  <br /> <br />
                  <br /> <br />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <br /> <br /> <br /> <br />
                  <Typography variant="h6">Upload Document</Typography>
                  <Grid marginTop={2}>
                    <Button
                      variant="contained"
                      size="small"
                      component="label"
                      sx={{
                        "@media only screen and (max-width:550px)": {
                          marginY: "5px",
                        },
                      }}
                    >
                      Upload
                      <input
                        type="file"
                        id="resume"
                        accept=".xlsx, .xls, .csv, .pdf, .txt, .image , .png , .jpg , .jpeg"
                        name="file"
                        hidden
                        onChange={(e) => {
                          handleResumeUploadEdit(e);
                        }}
                      />
                    </Button>
                    <br />
                    <br />
                    {documentFilesEdit?.length > 0 &&
                      documentFilesEdit.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreviewEdit(file)}
                              />
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <Button
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                  marginTop: "-5px",
                                }}
                                onClick={() => handleFileDeleteEdit(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmaintenancemaster") && (
        <>


          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Maintenance List
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <>
                <Grid item md={2.5} xs={12} sm={12}>
                  <Typography>
                    Company
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
                {/* Branch Unit Team */}
                <Grid item md={2.5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Branch
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
                <Grid item md={2.5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Unit
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
                <Grid item md={2.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset material
                    </Typography>
                    <MultiSelect
                      options={materialOptlist}
                      value={selectedOptionsAssetMaterial}
                      onChange={(e) => {
                        handleAssetMaterialChange(e);
                      }}
                      valueRenderer={customValueRendererAssetMaterial}
                      labelledBy="Please Select Asset Material"
                    />
                  </FormControl>
                </Grid>
                {/* <br />
                <br /> */}
                {/* <Grid container spacing={2}> */}
                <Grid item md={2} sm={12} xs={12} marginTop={3}>
                  <Grid sx={{ display: "flex", gap: "15px" }}>
                    <Button
                      variant="contained"
                      sx={buttonStyles.buttonsubmit}
                      onClick={(e) => {
                        handleSubmitlist(e);
                      }}
                    >
                      {" "}
                      Filter
                    </Button>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={() => {
                        handleClearlist();
                      }}
                    >
                      {" "}
                      CLEAR
                    </Button>
                  </Grid>
                </Grid>
                {/* </Grid> */}
              </>
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
                    <MenuItem value={totalProjects}>All</MenuItem>
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
                    "excelmaintenancemaster"
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
                  {isUserRoleCompare?.includes("csvmaintenancemaster") && (
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
                    "printmaintenancemaster"
                  ) && (
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    )}

                  {isUserRoleCompare?.includes("pdfmaintenancemaster") && (
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
                    "imagemaintenancemaster"
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
            </Grid>
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
                  {isUserRoleCompare?.includes("bdmaintenancemaster") && (
                    <Button
                      variant="contained"
                      sx={buttonStyles.buttonbulkdelete}
                      onClick={handleClickOpenalert}
                    >
                      Bulk Delete
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
            <br />
            {loader ? (

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
              <>
                <Box style={{ width: "100%", overflowY: "hidden" }}>
                  <>
                    {/* <AggridTable
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
                      // totalDatas={totalDatas}
                      searchQuery={searchedString}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                    /> */}
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
                      totalDatas={totalProjects}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      gridRefTableImg={gridRefTableImg}
                      itemsList={maintentanceoverall}
                    />
                  </>
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>
          {/* Search Bar */}
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
                          fetchMaintentance("filtered");
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
        </>
      )}
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


      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Maintenance</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{maintenanceview.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{maintenanceview.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{maintenanceview.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{maintenanceview.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{maintenanceview.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{maintenanceview.location}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material</Typography>
                  <Typography>{maintenanceview.assetmaterial}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material Code</Typography>
                  <Typography>{maintenanceview?.assetmaterialcode?.join(",")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Maintenance Details</Typography>
                  <Typography>{maintenanceview.maintenancedetails}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Maintenance Frequency</Typography>
                  <Typography>{maintenanceview.frequency}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Schedule</Typography>
                  <Typography>{maintenanceview.schedule}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                {maintenanceview.schedule === "Time Based" && (
                  <>
                    <Typography variant="h6">Time</Typography>
                    <Typography>
                      {maintenanceview.timetodo?.map(
                        (t, i) =>
                          `${i + 1 + ". "}` +
                          `${t?.hour}:${t?.min} ${t?.timetype}`
                      )}
                    </Typography>
                  </>
                )}
                {(maintenanceview.frequency === "Monthly" ||
                  maintenanceview.frequency === "Date Wise") && (
                    <>
                      <Typography variant="h6">Days</Typography>
                      <Typography>{maintenanceview?.monthdate}</Typography>
                    </>
                  )}
                {(maintenanceview?.frequency === "Weekly" ||
                  maintenanceview?.frequency === "Day Wise") && (
                    <>
                      <Typography variant="h6">Days</Typography>
                      <Typography>
                        {maintenanceview?.weekdays?.map(
                          (t, i) => `${i + 1 + ". "}` + t
                        )}
                      </Typography>
                    </>
                  )}
                {maintenanceview.frequency === "Annually" && (
                  <>
                    <Typography variant="h6">Annual</Typography>
                    <Typography>{`${maintenanceview?.annumonth} month ${maintenanceview?.annuday} days`}</Typography>
                  </>
                )}
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Duration</Typography>
                  <Typography>{maintenanceview.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Breakup Count</Typography>
                  <Typography>{maintenanceview.breakupcount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Breakup</Typography>
                  <Typography>{`${maintenanceview.breakup} mins`}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Required</Typography>
                  <Typography>{concReqs}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{maintenanceview.companyto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Branch
                  </Typography>
                  <Typography>
                    {maintenanceview?.branchto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={2.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Unit
                  </Typography>
                  <Typography>
                    {maintenanceview.unitto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={2.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Team
                  </Typography>
                  <Typography>
                    {maintenanceview.teamto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4.5} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Employee Name
                  </Typography>
                  <Typography>
                    {maintenanceview?.employeenameto
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Need Vendor</Typography>
                  <Typography>{maintentancemasteredit?.needvendor}</Typography>
                </FormControl>
              </Grid>
              {maintentancemasteredit?.needvendor === "Yes" && (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Vendor Group</Typography>
                      <Typography>{maintenanceview?.vendorgroup}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Vendor</Typography>
                      <Typography>{maintenanceview.vendor}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Address</Typography>
                      <Typography>{maintenanceview.address}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Phone</Typography>
                      <Typography>{maintenanceview.phone}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Email</Typography>
                      <Typography>{maintenanceview.emailid}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Otherno</Typography>
                      <Typography>{maintenanceview.phonenumberone}</Typography>
                    </FormControl>
                  </Grid>
                </>)}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Priority</Typography>
                  <Typography>{maintenanceview.priority}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}></Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Description</Typography>
                  <ReactQuill
                    style={{ maxHeight: "250px", height: "250px" }}
                    readOnly
                    value={maintenanceview.description}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }], // Note: Font options should be an array
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [{ align: [] }],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "align",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "image",
                      "video",
                      "Times New Roman",
                    ]}
                  />
                </FormControl>
                <br /> <br />
                <br /> <br />
              </Grid>
              {maintenanceview?.documentfiles?.length > 0 && (
                <Grid item md={12} sm={12} xs={12}>
                  <br /> <br /> <br /> <br />
                  <Typography variant="h6">Upload Document</Typography>
                  <Grid marginTop={2}>
                    {maintenanceview?.documentfiles?.length > 0 &&
                      maintenanceview?.documentfiles?.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={6}>
                              <Typography>{file?.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreviewEdit(file)}
                              />
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
        itemsTwo={maintentanceoverall ?? []}
        filename={"MaintenanceMaster"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Maintenance Master Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProject}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delProjectcheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default Maintentance;
