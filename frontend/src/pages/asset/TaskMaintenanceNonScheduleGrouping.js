import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box, InputAdornment,
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
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
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

function TaskMaintenanceNonScheduleGrouping() {
  const [taskGroupingArray, setTaskGroupingArray] = useState([]);


  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);


  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setBtnLoad(false);
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
    "Companys",
    "Branchs",
    "Units",
    "Floors",
    "Areas",
    "Locations",
    "assetmaterial",
    "schedule",
    "priority",
    "type",
    "designation",
    "department",
    "company",
    "branch",
    "unit",
    "team",
    "employeenames",
    "Date",
    "time",
    "duration",
    "breakup",
    "breakupcount",
    "required",
  ];
  let exportRowValues = [
    "companyto",
    "branchto",
    "unitto",
    "floorto",
    "areato",
    "locationto",
    "assetmaterial",
    "schedule",
    "priority",
    "type",
    "designation",
    "department",
    "company",
    "branch",
    "unit",
    "team",
    "employeenames",
    "date",
    "time",
    "duration",
    "breakup",
    "breakupcount",
    "required",
  ];



  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {

      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Task Maintenance Non Schedule Grouping"),
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


  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [taskGrouping, setTaskGrouping] = useState({
    companyto: "Please Select Company",
    branchto: "Please Select Branch",
    unitto: "Please Select Unit",
    floorto: "Please Select Floor",
    areato: "Please Select Area",
    locationto: "Please Select Location",
    assetmaterial: "Please Select AssetMaterial",
    subcategory: "Please Select SubCategory",
    date: "",
    breakupcount: "1",
    duration: "00:10",
    type: "Please Select Type",
    frequency: "Please Select Schedule",
    priority: "Please Select Priority",
  });
  const [taskGroupingEdit, setTaskGroupingEdit] = useState({
    companyto: "Please Select Company",
    branchto: "Please Select Branch",
    unitto: "Please Select Unit",
    floorto: "Please Select Floor",
    areato: "Please Select Area",
    locationto: "Please Select Location",
    assetmaterial: "Please Select AssetMaterial",
    subcategory: "Please Select SubCategory",
    schedule: "Please Select Schedule",
    frequency: "Please Select Schedule",
    duration: "00:10",
    breakupcount: "1",
    hour: "",
    min: "",
    timetype: "",
    monthdate: "",
    date: "",
    annumonth: "",
    annuday: "",
  });
  const [btnLoad, setBtnLoad] = useState(false);
  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
  const [floors, setFloors] = useState([]);

  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);

  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([
    { label: "ALL", value: "ALL" },
  ]);
  const [floorsEdit, setFloorEdit] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editingIndexcheckEdit, setEditingIndexcheckEdit] = useState(-1);
  const [taskGroupingArrayEdit, setTaskGroupingArrayEdit] = useState([]);
  const [taskGroupingLogEdit, setTaskGroupingLogEdit] = useState([]);

  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState([]);
  const [filteredSubCategoryEdit, setFilteredSubCategoryEdit] = useState([]);
  const [addReqTodo, setAddReqTodo] = useState([]);
  const [viewReqTodo, setViewReqTodo] = useState([]);
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

  const [frequencyOption, setFrequencyOption] = useState([
    { label: "Daily", value: "Daily" },
    { label: "Day Wise", value: "Day Wise" },
    { label: "Date Wise", value: "Date Wise" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ]);

  const fetchFloor = async (e) => {
    let result = allfloor.filter((d) => d.branch === e.value);
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloors(floorall);
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
          d.branch === taskGrouping.branchto &&
          d.floor === taskGrouping.floorto &&
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

  const fetchFloorEdit = async (e) => {
    let result = allfloor.filter((d) => d.branch === e);
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloorEdit(floorall);
  };
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

  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("10");
  const [hoursEdit, setHoursEdit] = useState("00");
  const [minutesEdit, setMinutesEdit] = useState("10");
  const [breakuphours, setbreakupHours] = useState("10");
  const [breakuphoursEdit, setbreakupHoursEdit] = useState("10");

  const {
    isUserRoleCompare, pageName, setPageName,
    isUserRoleAccess,
    isAssignBranch,
    allfloor,
    alldepartment,
    alldesignation,
    allareagrouping,
    alllocationgrouping,
    allUsersData, buttonStyles,
    allTeam,
  } = useContext(UserRoleAccessContext);


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


  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [openReassign, setOpenReassign] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTaskGrouping, setDeleteTaskGrouping] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    companyto: true,
    branchto: true,
    unitto: true,
    floorto: true,
    areato: true,
    locationto: true,
    assetmaterial: true,
    subcategory: true,
    duration: true,
    breakup: true,
    breakupcount: true,
    required: true,
    schedule: true,
    priority: true,
    actions: true,
    designation: true,
    department: true,
    branch: true,
    company: true,
    unit: true,
    team: true,
    date: true,
    time: true,
    employeenames: true,
    type: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //useEffect
  useEffect(() => {
    addSerialNumber(taskGroupingArray);
  }, [taskGroupingArray]);
  useEffect(() => {
    fetchAllLocationEdit();
  }, [isEditOpen, taskGroupingEdit.floor]);

  useEffect(() => {
    fetchTaskGroupingAll();
  }, [isEditOpen]);

  // useEffect(() => {
  //   fetchTaskGrouping();
  // }, []);

  useEffect(() => {
    fetchCategory();
    fetchSubCategory();
    generateHrsOptions();
    generateMinsOptions();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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

  const [concReqs, setConcReqs] = useState("");
  const concordinateParticipants = (fileshare) => {
    const require = fileshare.required;
    const concatenatedDepts = require.join(",");
    setConcReqs(concatenatedDepts);
  };

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

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnLoad(false);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  // Reassign model
  const handleClickOpenReassign = () => {
    setOpenReassign(true);
  };
  const handleCloseReassign = () => {
    setOpenReassign(false);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // page refersh reload
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
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  let [valueDesignation, setValueDesignation] = useState([]);
  let [valueDesignationEdit, setValueDesignationEdit] = useState([]);
  const [selectedDesignationOptions, setSelectedDesignationOptions] = useState(
    []
  );
  const [selectedDesignationOptionsEdit, setSelectedDesignationOptionsEdit] =
    useState([]);
  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState(
    []
  );
  let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);

  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState(
    []
  );
  let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);
  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  //unit multiselect
  const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
  let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
  let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);
  let [valueEmployee, setValueEmployee] = useState([]);
  const [selectedEmployeeOptions, setSelectedEmployeeOptions] = useState([]);
  let [valueEmployeeEdit, setValueEmployeeEdit] = useState([]);
  const [selectedEmployeeOptionsEdit, setSelectedEmployeeOptionsEdit] =
    useState([]);
  const [employeesNames, setEmployeesNames] = useState([]);
  const [employeesNamesEdit, setEmployeesNamesEdit] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [department, setDepartment] = useState([]);
  let [valueDepartment, setValueDepartment] = useState([]);
  const [selectedDepartmentOptions, setSelectedDepartmentOptions] = useState(
    []
  );
  let [valueDepartmentEdit, setValueDepartmentEdit] = useState([]);
  const [selectedDepartmentOptionsEdit, setSelectedDepartmentOptionsEdit] =
    useState([]);
  const [materialOpt, setMaterialopt] = useState([]);
  const fetchMaterial = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETMATERIALIP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setMaterialopt(res.data.assetmaterialip);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  const fetchCategory = async () => {
    try {
      let res_category = await axios.get(SERVICE.MAINTENTANCE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.maintenances.map((d) => ({
          ...d,
          label: d.assetmaterial,
          value: d.assetmaterial,
        })),
      ];

      setCategoryOption(categoryall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchSubCategory = async () => {
    try {
      let res_subcategory = await axios.get(SERVICE.MAINTENTANCE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_subcategory?.data?.maintenances.map((d) => ({
          ...d,
          label: d.assetmaterial,
          value: d.assetmaterial,
        })),
      ];
      setSubCategoryOption(categoryall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchDesignation = async () => {
    const categoryall = [
      ...alldesignation.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      })),
    ];

    setDesignation(categoryall);
  };
  const fetchDepartments = async () => {
    const categoryall = [
      ...alldepartment.map((d) => ({
        ...d,
        label: d.deptname,
        value: d.deptname,
      })),
    ];

    setDepartment(categoryall);
  };

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setSelectedOptionsBranch([]);
    setValueBranchCat([]);
    setSelectedOptionsUnit([]);
    setValueUnitCat([]);
    setSelectedOptionsTeam([]);
    setValueTeamCat([]);
    setSelectedEmployeeOptions([]);
    setEmployeesNames([]);
    setValueEmployee([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };
  const handleCompanyChangeEdit = (options) => {
    setValueCompanyCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyEdit(options);
    setSelectedOptionsBranchEdit([]);
    setValueBranchCatEdit([]);
    setSelectedOptionsUnitEdit([]);
    setValueUnitCatEdit([]);
    setSelectedOptionsTeamEdit([]);
    setValueTeamCatEdit([]);
    setSelectedEmployeeOptionsEdit([]);
    setEmployeesNamesEdit([]);
    setValueEmployeeEdit([]);
  };

  const customValueRendererCompanyEdit = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setSelectedOptionsUnit([]);
    setValueUnitCat([]);
    setSelectedOptionsTeam([]);
    setValueTeamCat([]);
    setSelectedEmployeeOptions([]);
    setEmployeesNames([]);
    setValueEmployee([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  const handleBranchChangeEdit = (options) => {
    setValueBranchCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchEdit(options);
    setSelectedOptionsUnitEdit([]);
    setValueUnitCatEdit([]);
    setSelectedOptionsTeamEdit([]);
    setValueTeamCatEdit([]);
    setSelectedEmployeeOptionsEdit([]);
    setEmployeesNamesEdit([]);
    setValueEmployeeEdit([]);
  };

  const customValueRendererBranchEdit = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setSelectedOptionsTeam([]);
    setValueTeamCat([]);
    setSelectedEmployeeOptions([]);
    setEmployeesNames([]);
    setValueEmployee([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  const handleUnitChangeEdit = (options) => {
    setValueUnitCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitEdit(options);
    setSelectedOptionsTeamEdit([]);
    setValueTeamCatEdit([]);
    setSelectedEmployeeOptionsEdit([]);
    setEmployeesNamesEdit([]);
    setValueEmployeeEdit([]);
  };

  const customValueRendererUnitEdit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    fetchEmployeeOptions(options, "Employee");
    setSelectedEmployeeOptions([]);
    setValueEmployee([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  const handleTeamChangeEdit = (options) => {
    setValueTeamCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamEdit(options);
    fetchEmployeeOptionsEdit(
      valueCompanyCatEdit,
      valueBranchCatEdit,
      valueUnitCatEdit,
      options,
      "Employee"
    );
    setSelectedEmployeeOptionsEdit([]);
    setValueEmployeeEdit([]);
  };

  const customValueRendererTeamEdit = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //Designation_Wise_Employees
  const handleEmployeeChange = (options) => {
    setValueEmployee(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmployeeOptions(options);
  };

  const customValueRendererEmployee = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };
  //Designation_Wise_Employees
  const handleEmployeeChangeEdit = (options) => {
    setValueEmployeeEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmployeeOptionsEdit(options);
  };

  const customValueRendererEmployeeEdit = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };

  useEffect(() => {
    fetchDesignation();
    fetchDepartments();
  }, []);

  const fetchEmployeeOptions = async (e, type) => {
    let designation = e?.map((data) => data.value);

    const employeenames =
      type === "Designation"
        ? allUsersData?.filter((item) =>
          designation?.includes(item.designation)
        )
        : type === "Department"
          ? allUsersData?.filter((item) => designation?.includes(item.department))
          : type === "Employee"
            ? allUsersData?.filter(
              (item) =>
                valueCompanyCat?.includes(item.company) &&
                valueBranchCat?.includes(item.branch) &&
                valueUnitCat?.includes(item.unit) &&
                designation?.includes(item.team)
            )
            : [];

    const categoryall = [
      ...employeenames?.map((d) => ({
        label: d.companyname,
        value: d.companyname,
      })),
    ];
    setEmployeesNames(categoryall);
  };

  const fetchEmployeeOptionsEdit = async (company, branch, unit, e, type) => {
    let designation = e?.map((data) => data.value);
    const employeenames =
      type === "Designation"
        ? allUsersData?.filter((item) =>
          designation?.includes(item.designation)
        )
        : type === "Department"
          ? allUsersData?.filter((item) => designation?.includes(item.department))
          : type === "Employee"
            ? allUsersData?.filter(
              (item) =>
                company?.includes(item.company) &&
                branch?.includes(item.branch) &&
                unit?.includes(item.unit) &&
                designation?.includes(item.team)
            )
            : [];

    const categoryall = [
      ...employeenames?.map((d) => ({
        label: d.companyname,
        value: d.companyname,
      })),
    ];
    setEmployeesNamesEdit(categoryall);
  };

  //Designation
  const handleDesignationChange = (options) => {
    setValueDesignation(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeOptions(options, "Designation");
    setSelectedEmployeeOptions([]);
    setValueEmployee([]);

    setSelectedDesignationOptions(options);
  };

  const customValueRendererDesignation = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Designation";
  };
  //Designation
  const handleDesignationChangeEdit = (options) => {
    setValueDesignationEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeOptionsEdit(
      valueCompanyCatEdit,
      valueBranchCatEdit,
      valueUnitCatEdit,
      options,
      "Designation"
    );
    setSelectedEmployeeOptionsEdit([]);
    setValueEmployeeEdit([]);
    setSelectedDesignationOptionsEdit(options);
  };

  const customValueRendererDesignationEdit = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Designation";
  };

  //Department
  const handleDepartmentChange = (options) => {
    setValueDepartment(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeOptions(options, "Department");
    setSelectedEmployeeOptions([]);
    setValueEmployee([]);
    setSelectedDepartmentOptions(options);
  };

  const customValueRendererDepartment = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };

  //Department
  const handleDepartmentChangeEdit = (options) => {
    setValueDepartmentEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeOptionsEdit(
      valueCompanyCatEdit,
      valueBranchCatEdit,
      valueUnitCatEdit,
      options,
      "Department"
    );
    setSelectedEmployeeOptionsEdit([]);
    setValueEmployeeEdit([]);
    setSelectedDepartmentOptionsEdit(options);
  };

  const customValueRendererDepartmentEdit = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };

  //set function to get particular row
  const rowData = async (id) => {

    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteTaskGrouping(res?.data?.staskmaintenancenonschedulegrouping);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  // Alert delete popup
  let proid = deleteTaskGrouping._id;
  const delProcess = async () => {

    setPageName(!pageName)
    try {
      await axios.delete(
        `${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${proid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      await fetchTaskGrouping("filtered");
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

  const addTodo = () => {
    const result = {
      hour: taskGrouping?.hour,
      min: taskGrouping?.min,
      timetype: taskGrouping?.timetype,
    };
    if (
      taskGrouping?.hour === "" ||
      taskGrouping?.min === "" ||
      taskGrouping?.timetype === ""
    ) {
      setPopupContentMalert("Please Select Hour, Minutes and Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addReqTodo?.some(
        (data) =>
          data?.hour === taskGrouping?.hour &&
          data?.min === taskGrouping?.min &&
          data?.timetype === taskGrouping?.timetype
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
  const handleEditTodoCreate = (index, key, newValue) => {
    // Assuming addReqTodo is an array of objects
    const updatedTodos = addReqTodo.map((todo, i) => {
      if (i === index) {
        // Update the specific key-related value
        const updatedTodo = { ...todo, [key]: newValue };
        return updatedTodo;
      }
      return todo;
    });

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
      hour: taskGroupingEdit?.hour,
      min: taskGroupingEdit?.min,
      timetype: taskGroupingEdit?.timetype,
    };

    if (
      taskGroupingEdit?.hour === "" ||
      taskGroupingEdit?.hour === undefined ||
      taskGroupingEdit?.min === "" ||
      taskGroupingEdit?.min === undefined ||
      taskGroupingEdit?.timetype === "" ||
      taskGroupingEdit?.timetype === undefined
    ) {
      setPopupContentMalert("Please Select Hour, Minutes and Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addReqTodoEdit?.some(
        (data) =>
          data?.hour === taskGroupingEdit?.hour &&
          data?.min === taskGroupingEdit?.min &&
          data?.timetype === taskGroupingEdit?.timetype
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

  //add function
  const sendRequest = async (item) => {

    setPageName(!pageName)
    setBtnLoad(true);
    try {
      let brandCreate = await axios.post(
        SERVICE.CREATE_TASK_MAINTENANCE_NONSCHEDULEGROUPING,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          companyto: String(taskGrouping.companyto),
          branchto: String(taskGrouping.branchto),
          unitto: String(taskGrouping.unitto),
          floorto: String(taskGrouping.floorto),
          locationto: String(taskGrouping.locationto),
          areato: String(taskGrouping.areato),
          assetmaterial: String(taskGrouping.assetmaterial),
          subcategory: String(taskGrouping.subcategory),
          date: String(taskGrouping.date),
          time:
            taskGrouping.frequency === "Time Based"
              ? String(taskGrouping.time)
              : "",
          type: String(taskGrouping.type),
          schedule: String(taskGrouping.frequency),
          priority: String(taskGrouping.priority),
          designation: valueDesignation,
          department: valueDepartment,
          company: valueCompanyCat,
          branch: valueBranchCat,
          unit: valueUnitCat,
          team: valueTeamCat,
          taskdetails: "nonschedule",
          employeenames: valueEmployee,
          duration: String(taskGrouping.duration),
          breakupcount: String(taskGrouping.breakupcount),
          breakup: breakuphours,
          required: [...requiredValueCate],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      setTaskGrouping(brandCreate.data);
      await fetchTaskGrouping("filtered");
      setTaskGrouping({
        ...taskGrouping,
        date: "",
        time: "",
        breakupcount: "1",
        duration: "00:10",
      });
      setbreakupHours("10");
      setHours("00");
      setMinutes("10");
      setAddReqTodo([]);
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
    e.preventDefault();
    const isNameMatch = taskGroupingArray?.some(
      (item) =>
        item.assetmaterial === taskGrouping.assetmaterial &&
        valueEmployee?.some((data) => item?.employeenames?.includes(data))
    );

    if (taskGrouping.companyto === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.branchto === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.unitto === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.floorto === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.areato === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.locationto === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.assetmaterial === "Please Select AssetMaterial") {
      setPopupContentMalert("Please Select AssetMaterial!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.type === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGrouping.type === "Designation" &&
      selectedDesignationOptions?.length < 1
    ) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGrouping.type === "Department" &&
      selectedDepartmentOptions?.length < 1
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGrouping.type === "Employee" &&
      selectedOptionsCompany?.length < 1
    ) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGrouping.type === "Employee" &&
      selectedOptionsBranch?.length < 1
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGrouping.type === "Employee" &&
      selectedOptionsUnit?.length < 1
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGrouping.type === "Employee" &&
      selectedOptionsTeam?.length < 1
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeOptions?.length < 1) {
      setPopupContentMalert("Please Select Employee Names!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.frequency === "Please Select Schedule") {
      setPopupContentMalert("Please Select Schedule!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.priority === "Please Select Priority") {
      setPopupContentMalert("Please Select Priority!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.date === "" || taskGrouping.date === undefined) {
      setPopupContentMalert("Please Choose Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (taskGrouping.frequency === "Time Based" && taskGrouping.time === "") ||
      taskGrouping.time === undefined
    ) {
      setPopupContentMalert("Please choose Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGrouping.duration === undefined ||
      taskGrouping.duration === "00:00" ||
      taskGrouping?.duration?.includes("Mins")
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGrouping.breakupcount === "") {
      setPopupContentMalert("Please Enter Breakup count!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert(
        "This Maintenance Non-Schedule Grouping data already exits!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setTaskGrouping({
      companyto: "Please Select Company",
      branchto: "Please Select Branch",
      unitto: "Please Select Unit",
      floorto: "Please Select Floor",
      areato: "Please Select Area",
      locationto: "Please Select Location",
      assetmaterial: "Please Select AssetMaterial",
      subcategory: "Please Select SubCategory",
      type: "Please Select Type",
      frequency: "Please Select Schedule",
      priority: "Please Select Priority",
      date: "",
      duration: "00:10",
      breakupcount: "1",
      time: "",
    });
    setFloors([]);
    setAreas([]);
    setLocations([]);
    setSelectedWeeklyOptions([]);
    setAddReqTodo([]);
    setHours("00");
    setMinutes("10");
    setbreakupHours("10");
    setFilteredSubCategory([]);
    setSelectedRequiredOptionsCate([]);
    setRequiredValueCate("");
    setEmployeesNames([]);
    setSelectedDesignationOptions([]);
    setValueDesignation([]);
    setValueEmployee([]);
    setSelectedEmployeeOptions([]);
    setSelectedOptionsCompany([]);
    setSelectedOptionsBranch([]);
    setSelectedDepartmentOptions([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsUnit([]);
    setValueBranchCat([]);
    setValueCompanyCat([]);
    setValueUnitCat([]);
    setValueTeamCat([]);
    setValueDesignation([]);
    setValueDepartment([]);
    setSelectedDesignationOptions([]);
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
  };
  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setTaskGroupingEdit(res?.data?.staskmaintenancenonschedulegrouping);
      fetchFloorEdit(res?.data?.staskmaintenancenonschedulegrouping?.branch);
      fetchAreaEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.branch,
        res?.data?.staskmaintenancenonschedulegrouping?.floor
      );
      fetchAllLocationEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.branch,
        res?.data?.staskmaintenancenonschedulegrouping?.floor,
        res?.data?.staskmaintenancenonschedulegrouping?.area
      );

      const [hourscal, minutescal] =
        res?.data?.staskmaintenancenonschedulegrouping.duration.split(":");
      setHoursEdit(hourscal);
      setMinutesEdit(minutescal);
      setRequiredValueCateEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.required
      );
      setbreakupHoursEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.breakup
      );
      setSelectedRequiredOptionsCateEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.required.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setSelectedOptionsCompanyEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.company.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueCompanyCatEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.company
      );
      setSelectedOptionsBranchEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.branch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueBranchCatEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.branch
      );
      setValueUnitCatEdit(res?.data?.staskmaintenancenonschedulegrouping?.unit);
      setSelectedOptionsUnitEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.unit.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueTeamCatEdit(res?.data?.staskmaintenancenonschedulegrouping?.team);
      setSelectedOptionsTeamEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.team.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSelectedDesignationOptionsEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.designation.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setValueDesignationEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.designation
      );
      setSelectedDepartmentOptionsEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.department.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setValueDepartmentEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.department
      );
      setSelectedEmployeeOptionsEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.employeenames.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setValueEmployeeEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.employeenames
      );
      const typeChecking =
        res?.data?.staskmaintenancenonschedulegrouping?.type === "Designation"
          ? [
            ...res?.data?.staskmaintenancenonschedulegrouping?.designation.map(
              (t) => ({ ...t, label: t, value: t })
            ),
          ]
          : res?.data?.staskmaintenancenonschedulegrouping?.type ===
            "Department"
            ? [
              ...res?.data?.staskmaintenancenonschedulegrouping?.department.map(
                (t) => ({ ...t, label: t, value: t })
              ),
            ]
            : [
              ...res?.data?.staskmaintenancenonschedulegrouping?.team.map(
                (t) => ({ ...t, label: t, value: t })
              ),
            ];
      fetchEmployeeOptionsEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.company,
        res?.data?.staskmaintenancenonschedulegrouping?.branch,
        res?.data?.staskmaintenancenonschedulegrouping?.unit,
        typeChecking,
        res?.data?.staskmaintenancenonschedulegrouping?.type
      );
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // get single row to view....

  const getviewCode = async (e) => {

    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setTaskGroupingEdit(res?.data?.staskmaintenancenonschedulegrouping);
      concordinateParticipants(res?.data?.staskmaintenancenonschedulegrouping);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // get single row to view....

  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setTaskGroupingEdit(res?.data?.staskmaintenancenonschedulegrouping);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const getReassignCode = async (e) => {
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setTaskGroupingEdit(res?.data?.staskmaintenancenonschedulegrouping);
      fetchFloorEdit(res?.data?.staskmaintenancenonschedulegrouping?.branchto);
      fetchAreaEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.branchto,
        res?.data?.staskmaintenancenonschedulegrouping?.floorto
      );
      fetchAllLocationEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.branchto,
        res?.data?.staskmaintenancenonschedulegrouping?.floorto,
        res?.data?.staskmaintenancenonschedulegrouping?.areato
      );

      const [hourscal, minutescal] =
        res?.data?.staskmaintenancenonschedulegrouping.duration.split(":");
      setHoursEdit(hourscal);
      setMinutesEdit(minutescal);
      setRequiredValueCateEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.required
      );
      setbreakupHoursEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.breakup
      );
      setSelectedRequiredOptionsCateEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.required.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setSelectedOptionsCompanyEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.company.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueCompanyCatEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.company
      );
      setSelectedOptionsBranchEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.branch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueBranchCatEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.branch
      );
      setValueUnitCatEdit(res?.data?.staskmaintenancenonschedulegrouping?.unit);
      setSelectedOptionsUnitEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.unit.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueTeamCatEdit(res?.data?.staskmaintenancenonschedulegrouping?.team);
      setSelectedOptionsTeamEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.team.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSelectedDesignationOptionsEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.designation.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setValueDesignationEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.designation
      );
      setSelectedDepartmentOptionsEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.department.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setValueDepartmentEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.department
      );
      setSelectedEmployeeOptionsEdit([
        ...res?.data?.staskmaintenancenonschedulegrouping?.employeenames.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setValueEmployeeEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.employeenames
      );
      const typeChecking =
        res?.data?.staskmaintenancenonschedulegrouping?.type === "Designation"
          ? [
            ...res?.data?.staskmaintenancenonschedulegrouping?.designation.map(
              (t) => ({ ...t, label: t, value: t })
            ),
          ]
          : res?.data?.staskmaintenancenonschedulegrouping?.type ===
            "Department"
            ? [
              ...res?.data?.staskmaintenancenonschedulegrouping?.department.map(
                (t) => ({ ...t, label: t, value: t })
              ),
            ]
            : [
              ...res?.data?.staskmaintenancenonschedulegrouping?.team.map(
                (t) => ({ ...t, label: t, value: t })
              ),
            ];
      fetchEmployeeOptionsEdit(
        res?.data?.staskmaintenancenonschedulegrouping?.company,
        res?.data?.staskmaintenancenonschedulegrouping?.branch,
        res?.data?.staskmaintenancenonschedulegrouping?.unit,
        typeChecking,
        res?.data?.staskmaintenancenonschedulegrouping?.type
      );
      handleClickOpenReassign();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  let updateby = taskGroupingEdit.updatedby;
  let addedby = taskGroupingEdit.addedby;
  let taskgroupingId = taskGroupingEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${taskgroupingId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assetmaterial: String(taskGroupingEdit.assetmaterial),
          subcategory: String(taskGroupingEdit.subcategory),
          date: String(taskGroupingEdit.date),
          time:
            taskGroupingEdit.frequency === "Time Based"
              ? String(taskGroupingEdit.time)
              : "",
          type: String(taskGroupingEdit.type),
          schedule: String(taskGroupingEdit.frequency),
          priority: String(taskGroupingEdit.priority),
          designation: valueDesignationEdit,
          department: valueDepartmentEdit,
          company: valueCompanyCatEdit,
          branch: valueBranchCatEdit,
          unit: valueUnitCatEdit,
          team: valueTeamCatEdit,
          employeenames: valueEmployeeEdit,
          duration: String(taskGroupingEdit.duration),
          breakupcount: String(taskGroupingEdit.breakupcount),
          breakup: breakuphoursEdit,
          required: [...requiredValueCateEdit],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchTaskGrouping("filtered");
      await fetchTaskGroupingAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const sendEditRequestReassingn = async (item) => {

    setPageName(!pageName)
    try {
      let res = await axios.post(`${SERVICE.CREATE_TASKMAINTENACEFORUSER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        companyto: String(taskGrouping.companyto),
        branchto: String(taskGrouping.branchto),
        unitto: String(taskGrouping.unitto),
        floorto: String(taskGrouping.floorto),
        locationto: String(taskGrouping.locationto),
        areato: String(taskGrouping.areato),
        assetmaterial: String(taskGroupingEdit.assetmaterial),
        subcategory: String(taskGroupingEdit.subcategory),
        taskdate: String(taskGroupingEdit.date),
        tasktime:
          taskGroupingEdit.schedule === "Time Based"
            ? String(taskGroupingEdit.time)
            : "",
        type: String(taskGroupingEdit.type),
        schedule: String(taskGroupingEdit.schedule),
        priority: String(taskGroupingEdit.priority),
        username: item,
        taskstatus: "Assigned",
        orginalid: taskGroupingEdit._id,
        taskdetails: "nonschedule",
        duration: String(taskGroupingEdit.duration),
        breakupcount: String(taskGroupingEdit.breakupcount),
        breakup: breakuphoursEdit,
        required: [...requiredValueCateEdit],
        description: "",
        taskassigneddate: moment(taskGroupingEdit.date).format("DD-MM-YYYY"),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchTaskGrouping("filtered");
      await fetchTaskGroupingAll();
      handleCloseReassign();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const editSubmitReassign = (e) => {
    e.preventDefault();
    const isNameMatch = taskGroupingArrayEdit?.some(
      (item) =>
        item.assetmaterial == taskGroupingEdit.assetmaterial &&
        valueEmployeeEdit?.some((data) => item.employeenames?.includes(data)) &&
        item.date == taskGroupingEdit.date &&
        item.time == taskGroupingEdit.time
    );
    const isNameMatchtask = taskGroupingLogEdit?.some(
      (item) =>
        item.assetmaterial == taskGroupingEdit.assetmaterial &&
        valueEmployeeEdit?.includes(item.username) &&
        item.taskdate == taskGroupingEdit.date &&
        item.tasktime == taskGroupingEdit.time &&
        item.taskdetails === "nonschedule"
    );
    if (taskGroupingEdit.companyto === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.branchto === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.unitto === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.floorto === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.areato === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.locationto === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit.assetmaterial === "Please Select AssetMaterial"
    ) {
      setPopupContentMalert("Please Select AssetMaterial!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.subcategory === "Please Select SubCategory") {
      setPopupContentMalert("Please Select SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.type === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit.type === "Designation" &&
      selectedDesignationOptionsEdit?.length < 1
    ) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit.type === "Department" &&
      selectedDepartmentOptionsEdit?.length < 1
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit.type === "Employee" &&
      selectedOptionsCompanyEdit?.length < 1
    ) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit.type === "Employee" &&
      selectedOptionsBranchEdit?.length < 1
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit.type === "Employee" &&
      selectedOptionsUnitEdit?.length < 1
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit.type === "Employee" &&
      selectedOptionsTeamEdit?.length < 1
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeOptionsEdit?.length < 1) {
      setPopupContentMalert("Please Select Employee Names!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.schedule === "Please Select Schedule") {
      setPopupContentMalert("Please Select Schedule!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.priority === "Please Select Priority") {
      setPopupContentMalert("Please Select Priority!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit.date === "" ||
      taskGroupingEdit.date === undefined
    ) {
      setPopupContentMalert("Please Choose Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (taskGroupingEdit.schedule === "Time Based" &&
        taskGroupingEdit.time === "") ||
      taskGroupingEdit.time === undefined
    ) {
      setPopupContentMalert("Please choose Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskGroupingEdit?.duration === undefined ||
      taskGroupingEdit?.duration === "00:00" ||
      taskGroupingEdit?.duration?.includes("Mins")
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (taskGroupingEdit.breakupcount === "") {
      setPopupContentMalert("Please Enter Breakup count!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert(
        "This Maintenance Non-Schedule Grouping data already exits!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatchtask) {
      setPopupContentMalert("These Data is already exits in Task!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const empName = valueEmployeeEdit?.map((data) =>
        sendEditRequestReassingn(data)
      );
    }
  };
  //get all Task Schedule Grouping.

  const fetchTaskGrouping = async (e) => {

    setPageName(!pageName)
    setLoader(true);
    try {
      if (e === "filtered") {
        let res_freq = await axios.post(
          // SERVICE.ALL_TASK_MAINTENANCE_NONSCHEDULEGROUPING,
          SERVICE.TASK_MAINTENANCE_NON_SCHEDULING_ACCESS,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assignbranch: accessbranch,
            company: valueCompanyCatlist,
            branch: valueBranchCatlist,
            unit: valueUnitCatlist,
            material: valueAssetMateriallist,
          }
        );

        setTaskGroupingArray(res_freq?.data?.taskmaintenancenonschedulegrouping?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          id: item._id,
          assetmaterial: item.assetmaterial,
          type: item.type,
          designation: item.designation
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          schedule: item.schedule,
          priority: item.priority,
          department:
            item.department?.length > 0
              ? item.department?.map((t, i) => `${i + 1 + ". "}` + t).toString()
              : "",
          company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          employeenames: item.employeenames
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          date: moment(item.date).format("DD-MM-YYYY"),
          time: item?.time,
          duration: item.duration,
          breakup: item.breakup,
          breakupcount: item.breakupcount,
          required: item.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        })));
        setLoader(false);
      }
      else {
        setLoader(false)
      }
    } catch (err) {
      setLoader(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }

  }

  const bulkdeletefunction = async () => {

    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(
          `${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${item}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchTaskGrouping("filtered");
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //get all Task Schedule Grouping.
  const fetchTaskGroupingAll = async () => {
    try {
      let res_freq = await axios.get(
        SERVICE.ALL_TASK_MAINTENANCE_NONSCHEDULEGROUPING,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setTaskGroupingArrayEdit(
        res_freq?.data?.taskmaintenancenonschedulegrouping.filter(
          (item) => item._id !== taskgroupingId
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchTaskGroupingAllReassign = async (e) => {
    try {
      let res_freq = await axios.get(
        SERVICE.ALL_TASK_MAINTENANCE_NONSCHEDULEGROUPING,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let res_freq_task = await axios.get(SERVICE.ALL_TASKMAINTENACEFORUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskGroupingArrayEdit(
        res_freq?.data?.taskmaintenancenonschedulegrouping
      );
      setTaskGroupingLogEdit(res_freq_task?.data?.taskmaintenanceforuser);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //image

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "TaskMaintenanceNonScheduleGrouping.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  // get particular columns for export excel

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Task Schedule Grouping",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
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
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
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
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox",
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
    },
    {
      field: "companyto",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.companyto,
      headerClassName: "bold-header",
    },
    {
      field: "branchto",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branchto,
      headerClassName: "bold-header",
    },
    {
      field: "unitto",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unitto,
      headerClassName: "bold-header",
    },
    {
      field: "floorto",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floorto,
      headerClassName: "bold-header",
    },
    {
      field: "areato",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !columnVisibility.areato,
      headerClassName: "bold-header",
    },
    {
      field: "locationto",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !columnVisibility.locationto,
      headerClassName: "bold-header",
    },
    {
      field: "assetmaterial",
      headerName: "Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.assetmaterial,
      headerClassName: "bold-header",
    },

    {
      field: "schedule",
      headerName: "Schedule",
      flex: 0,
      width: 100,
      hide: !columnVisibility.schedule,
      headerClassName: "bold-header",
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 0,
      width: 100,
      hide: !columnVisibility.priority,
      headerClassName: "bold-header",
    },

    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 100,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 160,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    // {
    //   field: "department",
    //   headerName: "Department",
    //   flex: 0,
    //   width: 160,
    //   hide: !columnVisibility.department,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "company",
    //   headerName: "Company",
    //   flex: 0,
    //   width: 160,
    //   hide: !columnVisibility.company,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "branch",
    //   headerName: "Branch",
    //   flex: 0,
    //   width: 160,
    //   hide: !columnVisibility.branch,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "unit",
    //   headerName: "Unit",
    //   flex: 0,
    //   width: 160,
    //   hide: !columnVisibility.unit,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "team",
    //   headerName: "Team",
    //   flex: 0,
    //   width: 160,
    //   hide: !columnVisibility.team,
    //   headerClassName: "bold-header",
    // },
    {
      field: "employeenames",
      headerName: "Employee Names",
      flex: 0,
      width: 250,
      hide: !columnVisibility.employeenames,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 75,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0,
      width: 75,
      hide: !columnVisibility.duration,
      headerClassName: "bold-header",
    },
    {
      field: "breakupcount",
      headerName: "Breakup Count",
      flex: 0,
      width: 75,
      hide: !columnVisibility.breakupcount,
      headerClassName: "bold-header",
    },
    {
      field: "breakup",
      headerName: "Breakup",
      flex: 0,
      width: 75,
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
      width: 500,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes(
            "dtaskmaintenancenonschedulegrouping"
          ) && (
              <Button
                sx={userStyle.buttondelete}
                onClick={(e) => {
                  rowData(params.data.id);
                }}
              >
                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
              </Button>
            )}
          {isUserRoleCompare?.includes(
            "vtaskmaintenancenonschedulegrouping"
          ) && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getviewCode(params.data.id);
                }}
              >
                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
              </Button>
            )}
          {isUserRoleCompare?.includes(
            "itaskmaintenancenonschedulegrouping"
          ) && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  handleClickOpeninfo();
                  getinfoCode(params.data.id);
                }}
              >
                <InfoOutlinedIcon sx={buttonStyles.buttonedit} />
              </Button>
            )}
          &ensp;
          {isUserRoleCompare?.includes(
            "etaskmaintenancenonschedulegrouping"
          ) && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  handleClickOpenReassign();
                  getReassignCode(params.data.id);
                  fetchTaskGroupingAllReassign(params.data.id);
                }}
              >
                Reassign
              </Button>
            )}
          &ensp; &ensp;
          {isUserRoleCompare?.includes(
            "etaskmaintenancenonschedulegrouping"
          ) && (
              <Link
                to={`/asset/taskmaintenancenonschedulelog/${params.data.id}`}
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      assetmaterial: item.assetmaterial,
      companyto: item.companyto,
      branchto: item.branchto,
      unitto: item.unitto,
      floorto: item.floorto,
      areato: item.areato,
      locationto: item.locationto,
      subcategory: item.subcategory,
      duration: item.duration,
      breakup: item.breakup,
      schedule: item.schedule,
      priority: item.priority,
      breakupcount: item.breakupcount,
      required: item?.required,
      designation: item.designation,
      department: item.department,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      type: item.type,
      date: item.date,
      time: item.time,
      employeenames: item.employeenames,
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


  //company multiselect
  //team multiselect
  const [materialOptlist, setMaterialoptlist] = useState([]);
  const [selectedOptionsAssetMateriallist, setSelectedOptionsAssetMateriallist] = useState([]);
  let [valueAssetMateriallist, setValueAssetMateriallist] = useState([]);
  const [selectedOptionsCompanylist, setSelectedOptionsCompanylist] = useState([]);
  let [valueCompanyCatlist, setValueCompanyCatlist] = useState([]);

  const handleCompanyChangelist = (options) => {
    setValueCompanyCatlist(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanylist(options);
    setValueBranchCatlist([]);
    setSelectedOptionsBranchlist([]);
    setValueUnitCatlist([]);
    setSelectedOptionsUnitlist([]);
    setValueAssetMateriallist([]);
    setSelectedOptionsAssetMateriallist([]);
  };

  const customValueRendererCompanylist = (valueCompanyCatlist, _categoryname) => {
    return valueCompanyCatlist?.length
      ? valueCompanyCatlist.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranchlist, setSelectedOptionsBranchlist] = useState([]);
  let [valueBranchCatlist, setValueBranchCatlist] = useState([]);

  const handleBranchChangelist = (options) => {
    setValueBranchCatlist(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchlist(options);
    setValueUnitCatlist([]);
    setSelectedOptionsUnitlist([]);
    setValueAssetMateriallist([]);
    setSelectedOptionsAssetMateriallist([]);
  };

  const customValueRendererBranchlist = (valueBranchCatlist, _categoryname) => {
    return valueBranchCatlist?.length
      ? valueBranchCatlist.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnitlist, setSelectedOptionsUnitlist] = useState([]);
  let [valueUnitCatlist, setValueUnitCatlist] = useState([]);

  const handleUnitChangelist = (options) => {
    setValueUnitCatlist(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitlist(options);
    setValueAssetMateriallist([]);
    setSelectedOptionsAssetMateriallist([]);
  };

  const customValueRendererUnitlist = (valueUnitCatlist, _categoryname) => {
    return valueUnitCatlist?.length
      ? valueUnitCatlist.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };



  const handleAssetMaterialChangelist = (options) => {
    setValueAssetMateriallist(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsAssetMateriallist(options);
  };

  const customValueRendererAssetMateriallist = (valueAssetMateriallist, _categoryname) => {
    return valueAssetMateriallist?.length
      ? valueAssetMateriallist?.map(({ label }) => label)?.join(", ")
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

      setValueCompanyCatlist(selectedCompany);
      setSelectedOptionsCompanylist(mappedCompany);

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

      setValueBranchCatlist(selectedBranch);
      setSelectedOptionsBranchlist(mappedBranch);

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

      setValueUnitCatlist(selectedUnit);
      setSelectedOptionsUnitlist(mappedUnit);

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  const handleAssetMaterials = async () => {
    try {
      let res = await axios.get(SERVICE.TASK_NON_SCHEDULE_GROUPING_MATERIAL_IP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resultall = res?.data?.assetmaterialip?.map((d) => ({
        ...d,
        label: d.component,
        value: d.component,

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
    if (selectedOptionsCompanylist?.length === 0 &&
      selectedOptionsBranchlist?.length === 0 &&
      selectedOptionsUnitlist?.length === 0 &&
      selectedOptionsAssetMateriallist?.length === 0) {
      setPopupContentMalert("Please Select Any One");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      fetchTaskGrouping("filtered");
    }
  };

  const handleClearlist = () => {
    setTaskGroupingArray([]);
    setItems([]);
    setSelectedOptionsCompanylist([])
    setSelectedOptionsBranchlist([])
    setSelectedOptionsUnitlist([])
    setSelectedOptionsAssetMateriallist([])
    setValueCompanyCatlist([])
    setValueBranchCatlist([])
    setValueUnitCatlist([])
    setValueAssetMateriallist([])
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
  }




  return (
    <Box>
      <Headtitle title={"MAINTENANCE NON-SCHEDULE GROUPING"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>
        Manage Maintenance Non-Schedule Grouping
      </Typography> */}
      <PageHeading
        title="  Manage Maintenance Task Non-Schedule Grouping"
        modulename="Asset"
        submodulename="Maintenance"
        mainpagename="Task Maintenance Non Schedule Grouping"
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("ataskmaintenancenonschedulegrouping") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography
                    sx={userStyle.importheadtext}
                    style={{ fontWeight: "600" }}
                  >
                    Add Task Maintenance Non-Schedule Grouping
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <>
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
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          }) : []}
                        styles={colourStyles}
                        value={{
                          label: taskGrouping.companyto,
                          value: taskGrouping.companyto,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            companyto: e.value,
                            branchto: "Please Select Branch",
                            unitto: "Please Select Unit",
                            floorto: "Please Select Floor",
                            areato: "Please Select Area",
                            locationto: "Please Select Location",
                            assetmaterial: "Please Select AssetMaterial",
                          });
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
                            (comp) => taskGrouping.companyto === comp.company
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
                          }) : []}
                        styles={colourStyles}
                        value={{
                          label: taskGrouping.branchto,
                          value: taskGrouping.branchto,
                        }}
                        onChange={(e) => {
                          setNewcheckBranch(e.value);
                          setTaskGrouping({
                            ...taskGrouping,
                            branchto: e.value,
                            unitto: "Please Select Unit",
                            floorto: "Please Select Floor",
                            areato: "Please Select Area",
                            locationto: "Please Select Location",
                            assetmaterial: "Please Select AssetMaterial",
                          });
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
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch ? accessbranch
                          ?.filter(
                            (comp) =>
                              taskGrouping.companyto === comp.company &&
                              taskGrouping.branchto === comp.branch
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
                          }) : []}
                        styles={colourStyles}
                        value={{
                          label: taskGrouping.unitto,
                          value: taskGrouping.unitto,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            unitto: e.value,
                          });
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
                          label: taskGrouping.floorto,
                          value: taskGrouping.floorto,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,

                            floorto: e.value,
                            areato: "Please Select Area",
                            assetmaterial: "Please Select AssetMaterial",
                          });
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
                          label: taskGrouping.areato,
                          value: taskGrouping.areato,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            areato: e.value,
                            locationto: "Please Select Location",
                            assetmaterial: "Please Select AssetMaterial",
                          });
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
                          label: taskGrouping.locationto,
                          value: taskGrouping.locationto,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            locationto: e.value,
                            assetmaterial: "Please Select AssetMaterial",
                          });
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
                          taskGrouping.locationto === "ALL"
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
                                      taskGrouping.companyto &&
                                      subpro.branch ===
                                      taskGrouping.branchto &&
                                      subpro.unit === taskGrouping.unitto &&
                                      subpro.floor === taskGrouping.floorto &&
                                      subpro.area === taskGrouping.areato
                                  )
                                  .map((t) => t.component)
                                  .reduce((acc, curr) => acc.concat(curr), [])
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
                                      taskGrouping.locationto &&
                                      subpro.maintenance === true &&
                                      subpro.company ===
                                      taskGrouping.companyto &&
                                      subpro.branch ===
                                      taskGrouping.branchto &&
                                      subpro.unit === taskGrouping.unitto &&
                                      subpro.floor === taskGrouping.floorto &&
                                      subpro.area === taskGrouping.areato
                                  )
                                  .map((t) => t.component)
                                  .reduce((acc, curr) => acc.concat(curr), [])
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
                        value={{
                          label: taskGrouping.assetmaterial,
                          value: taskGrouping.assetmaterial,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            assetmaterial: e.value,
                            assetmaterialcheck: e.material,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Designation", value: "Designation" },
                          { label: "Department", value: "Department" },
                          { label: "Employee", value: "Employee" },
                        ]}
                        styles={colourStyles}
                        value={{
                          label: taskGrouping.type,
                          value: taskGrouping.type,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            type: e.value,
                          });
                          setEmployeesNames([]);
                          setValueEmployee([]);
                          setSelectedEmployeeOptions([]);
                          setSelectedDesignationOptions([]);
                          setValueDesignation([]);
                          setSelectedOptionsCompany([]);
                          setValueCompanyCat([]);
                          setSelectedOptionsBranch([]);
                          setValueBranchCat([]);
                          setSelectedOptionsUnit([]);
                          setValueUnitCat([]);
                          setSelectedDepartmentOptions([]);
                          setValueDepartment([]);
                          setSelectedOptionsTeam([]);
                          setValueTeamCat([]);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {taskGrouping.type === "Designation" ? (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Designation<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={designation}
                          value={selectedDesignationOptions}
                          onChange={handleDesignationChange}
                          valueRenderer={customValueRendererDesignation}
                          labelledBy="Please Select Designation"
                        />
                      </FormControl>
                    </Grid>
                  ) : taskGrouping.type === "Department" ? (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={department}
                          value={selectedDepartmentOptions}
                          onChange={handleDepartmentChange}
                          valueRenderer={customValueRendererDepartment}
                          labelledBy="Please Select Department"
                        />
                      </FormControl>
                    </Grid>
                  ) : taskGrouping.type === "Employee" ? (
                    <>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Company <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch ? accessbranch
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
                              }) : []}
                            value={selectedOptionsCompany}
                            onChange={(e) => {
                              handleCompanyChange(e);
                            }}
                            valueRenderer={customValueRendererCompany}
                            labelledBy="Please Select Company"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Branch<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch ? accessbranch
                              ?.filter((comp) =>
                                selectedOptionsCompany
                                  .map((item) => item.value)
                                  .includes(comp.company)
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
                              }) : []}
                            value={selectedOptionsBranch}
                            onChange={(e) => {
                              handleBranchChange(e);
                            }}
                            valueRenderer={customValueRendererBranch}
                            labelledBy="Please Select Branch"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Unit<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch ? accessbranch
                              ?.filter(
                                (comp) =>
                                  selectedOptionsCompany
                                    .map((item) => item.value)
                                    .includes(comp.company) &&
                                  selectedOptionsBranch
                                    .map((item) => item.value)
                                    .includes(comp.branch)
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
                              }) : []}
                            value={selectedOptionsUnit}
                            onChange={(e) => {
                              handleUnitChange(e);
                            }}
                            valueRenderer={customValueRendererUnit}
                            labelledBy="Please Select Unit"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Team<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={allTeam
                              ?.filter(
                                (comp) =>
                                  selectedOptionsCompany
                                    .map((item) => item.value)
                                    .includes(comp.company) &&
                                  selectedOptionsBranch
                                    .map((item) => item.value)
                                    .includes(comp.branch) &&
                                  selectedOptionsUnit
                                    .map((item) => item.value)
                                    .includes(comp.unit)
                              )
                              ?.map((data) => ({
                                label: data.teamname,
                                value: data.teamname,
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
                  ) : (
                    ""
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Names<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={employeesNames}
                        value={selectedEmployeeOptions}
                        onChange={handleEmployeeChange}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Employee"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Schedule<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Time Based", value: "Time Based" },
                          { label: "Any Time", value: "Any Time" },
                        ]}
                        styles={colourStyles}
                        value={{
                          label: taskGrouping.frequency,
                          value: taskGrouping.frequency,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            frequency: e.value,
                            time: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
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
                          label: taskGrouping.priority,
                          value: taskGrouping.priority,
                        }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            priority: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="Date"
                        value={taskGrouping.date}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            date: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {taskGrouping?.frequency === "Time Based" && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Time<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="Time"
                          value={taskGrouping.time}
                          onChange={(e) => {
                            setTaskGrouping({
                              ...taskGrouping,
                              time: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}

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
                              setTaskGrouping({
                                ...taskGrouping,
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
                              setTaskGrouping({
                                ...taskGrouping,
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
                      value={taskGrouping.breakupcount}
                      onChange={(e) => {
                        const ans = e.target.value > 0 ? e.target.value : "";
                        handleTimeCalculate(ans);
                        setTaskGrouping({
                          ...taskGrouping,
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
                </>
              </Grid>
              <br />
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
                  <LoadingButton
                    loading={btnLoad}
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                  >
                    {" "}
                    Submit
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br /> <br />
      {/* ****** Table Start ****** */}

      <>
        {isUserRoleCompare?.includes(
          "ltaskmaintenancenonschedulegrouping"
        ) && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Task Maintenance Non Schedule Grouping List
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
                        value={selectedOptionsCompanylist}
                        onChange={(e) => {
                          handleCompanyChangelist(e);
                        }}
                        valueRenderer={customValueRendererCompanylist}
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
                            valueCompanyCatlist?.includes(comp.company)
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
                        value={selectedOptionsBranchlist}
                        onChange={(e) => {
                          handleBranchChangelist(e);
                        }}
                        valueRenderer={customValueRendererBranchlist}
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
                              valueCompanyCatlist?.includes(comp.company) &&
                              valueBranchCatlist?.includes(comp.branch)
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
                        value={selectedOptionsUnitlist}
                        onChange={(e) => {
                          handleUnitChangelist(e);
                        }}
                        valueRenderer={customValueRendererUnitlist}
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
                        value={selectedOptionsAssetMateriallist}
                        onChange={(e) => {
                          handleAssetMaterialChangelist(e);
                        }}
                        valueRenderer={customValueRendererAssetMateriallist}
                        labelledBy="Please Select Asset Material Code"
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
                      <MenuItem value={taskGroupingArray?.length}>
                        All
                      </MenuItem>
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
                      "exceltaskmaintenancenonschedulegrouping"
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
                      "csvtaskmaintenancenonschedulegrouping"
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
                      "printtaskmaintenancenonschedulegrouping"
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
                      "pdftaskmaintenancenonschedulegrouping"
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
                      "imagetaskmaintenancenonschedulegrouping"
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
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={taskGroupingArray}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={taskGroupingArray}

                  />
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
              {isUserRoleCompare?.includes(
                "bdtaskmaintenancenonschedulegrouping"
              ) && (
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonbulkdelete}
                    onClick={handleClickOpenalert}
                  >
                    Bulk Delete
                  </Button>
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
                  <Box style={{ width: "100%", overflowY: "hidden" }}>
                    <>
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
                        // totalDatas={totalDatas}
                        searchQuery={searchedString}
                        handleShowAllColumns={handleShowAllColumns}
                        setFilteredRowData={setFilteredRowData}
                        filteredRowData={filteredRowData}
                        setFilteredChanges={setFilteredChanges}
                        filteredChanges={filteredChanges}
                        gridRefTableImg={gridRefTableImg}
                        itemsList={taskGroupingArray}
                      />
                    </>
                  </Box>
                </>
              )}
              {/* ****** Table End ****** */}
            </Box>
          )}
      </>

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
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Maintenance Non - Schedule Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{taskGroupingEdit.companyto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{taskGroupingEdit.branchto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{taskGroupingEdit.unitto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{taskGroupingEdit.floorto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{taskGroupingEdit.areato}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{taskGroupingEdit.locationto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material</Typography>
                  <Typography>{taskGroupingEdit.assetmaterial}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{taskGroupingEdit?.type}</Typography>
                </FormControl>
              </Grid>

              {taskGroupingEdit.type === "Designation" ? (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Designation</Typography>
                    <Typography>
                      {taskGroupingEdit.designation
                        ?.map((t, i) => `${i + 1 + ". "}` + t)
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              ) : taskGroupingEdit.type === "Department" ? (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Department</Typography>
                    <Typography>
                      {taskGroupingEdit.department
                        ?.map((t, i) => `${i + 1 + ". "}` + t)
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              ) : taskGroupingEdit.type === "Employee" ? (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Company</Typography>
                      <Typography>
                        {taskGroupingEdit.company
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Branch</Typography>
                      <Typography>
                        {taskGroupingEdit.branch
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Unit</Typography>
                      <Typography>
                        {taskGroupingEdit.unit
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Team</Typography>
                      <Typography>
                        {taskGroupingEdit.team
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee Names</Typography>
                  <Typography>
                    {taskGroupingEdit.employeenames
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Schedule</Typography>
                  <Typography>{`${taskGroupingEdit?.schedule}`}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Priority</Typography>
                  <Typography>{`${taskGroupingEdit?.priority}`}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Date</Typography>
                  <Typography>{`${moment(taskGroupingEdit.date).format(
                    "DD-MM-YYYY"
                  )}`}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Time</Typography>
                  <Typography>{`${taskGroupingEdit.time}`}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Duration</Typography>
                  <Typography>{taskGroupingEdit.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Breakup Count</Typography>
                  <Typography>{taskGroupingEdit.breakupcount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Breakup</Typography>
                  <Typography>{`${taskGroupingEdit.breakup} mins`}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Required</Typography>
                  <Typography>{concReqs}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Re Assign DIALOG */}
      <Box>
        <Dialog
          open={openReassign}
          onClose={handleCloseReassign}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{
            overflow: "Auto",
            "& .MuiPaper-root": {
              overflow: "Auto",
            },
            marginTop: "95px"
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Reassign Maintenance Non Schedule Grouping
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
                        label: taskGroupingEdit.companyto,
                        value: taskGroupingEdit.companyto,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          companyto: e.value,
                          branchto: "Please Select Branch",
                          unitto: "Please Select Unit",
                          floorto: "Please Select Floor",
                          areato: "Please Select Area",
                          locationto: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                        });
                        setFloorEdit([]);
                        setAreasEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
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
                          (comp) => taskGroupingEdit.companyto === comp.company
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
                        label: taskGroupingEdit.branchto,
                        value: taskGroupingEdit.branchto,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          branchto: e.value,
                          unitto: "Please Select Unit",
                          floorto: "Please Select Floor",
                          areato: "Please Select Area",
                          locationto: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                        });

                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
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
                            taskGroupingEdit.companyto === comp.company &&
                            taskGroupingEdit.branchto === comp.branch
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
                        label: taskGroupingEdit.unitto,
                        value: taskGroupingEdit.unitto,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          unitto: e.value,
                        });
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
                        label: taskGroupingEdit.floorto,
                        value: taskGroupingEdit.floorto,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,

                          floorto: e.value,
                          areato: "Please Select Area",
                          assetmaterial: "Please Select AssetMaterial",
                        });
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        fetchAreaEdit(taskGroupingEdit.branchto, e.value);
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
                        label: taskGroupingEdit.areato,
                        value: taskGroupingEdit.areato,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          areato: e.value,
                          locationto: "Please Select Location",
                          assetmaterial: "Please Select AssetMaterial",
                        });
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        fetchAllLocationEdit(
                          taskGroupingEdit.branchto,
                          taskGroupingEdit.floorto,
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
                        label: taskGroupingEdit.locationto,
                        value: taskGroupingEdit.locationto,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          locationto: e.value,
                          assetmaterial: "Please Select AssetMaterial",
                        });
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
                        taskGroupingEdit.locationto === "ALL"
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
                                    taskGroupingEdit.companyto &&
                                    subpro.branch ===
                                    taskGroupingEdit.branchto &&
                                    subpro.unit === taskGroupingEdit.unitto &&
                                    subpro.floor ===
                                    taskGroupingEdit.floorto &&
                                    subpro.area === taskGroupingEdit.areato
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
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
                                    taskGroupingEdit.locationto &&
                                    subpro.maintenance === true &&
                                    subpro.company ===
                                    taskGroupingEdit.companyto &&
                                    subpro.branch ===
                                    taskGroupingEdit.branchto &&
                                    subpro.unit === taskGroupingEdit.unitto &&
                                    subpro.floor ===
                                    taskGroupingEdit.floorto &&
                                    subpro.area === taskGroupingEdit.areato
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
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
                      value={{
                        label: taskGroupingEdit.assetmaterial,
                        value: taskGroupingEdit.assetmaterial,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          assetmaterial: e.value,
                          assetmaterialcheck: e.material,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "Designation", value: "Designation" },
                        { label: "Department", value: "Department" },
                        { label: "Employee", value: "Employee" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: taskGroupingEdit.type,
                        value: taskGroupingEdit.type,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          type: e.value,
                        });
                        setEmployeesNamesEdit([]);
                        setValueEmployeeEdit([]);
                        setSelectedEmployeeOptionsEdit([]);
                        setSelectedDesignationOptionsEdit([]);
                        setValueDesignationEdit([]);
                        setSelectedOptionsCompanyEdit([]);
                        setValueCompanyCatEdit([]);
                        setSelectedOptionsBranchEdit([]);
                        setValueBranchCatEdit([]);
                        setSelectedOptionsUnitEdit([]);
                        setValueUnitCatEdit([]);
                        setSelectedDepartmentOptionsEdit([]);
                        setValueDepartmentEdit([]);
                        setSelectedOptionsTeamEdit([]);
                        setValueTeamCatEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                {taskGroupingEdit?.type === "Designation" ? (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Designation<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={designation}
                        value={selectedDesignationOptionsEdit}
                        onChange={handleDesignationChangeEdit}
                        valueRenderer={customValueRendererDesignationEdit}
                        labelledBy="Please Select Designation"
                      />
                    </FormControl>
                  </Grid>
                ) : taskGroupingEdit?.type === "Department" ? (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Department<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={department}
                        value={selectedDepartmentOptionsEdit}
                        onChange={handleDepartmentChangeEdit}
                        valueRenderer={customValueRendererDepartmentEdit}
                        labelledBy="Please Select Department"
                      />
                    </FormControl>
                  </Grid>
                ) : taskGroupingEdit?.type === "Employee" ? (
                  <>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch ? accessbranch
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
                            }) : []}
                          value={selectedOptionsCompanyEdit}
                          onChange={(e) => {
                            handleCompanyChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererCompanyEdit}
                          labelledBy="Please Select Company"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch ? accessbranch
                            ?.filter((comp) =>
                              selectedOptionsCompanyEdit
                                .map((data) => data.value)
                                .includes(comp.company)
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
                            }) : []}
                          value={selectedOptionsBranchEdit}
                          onChange={(e) => {
                            handleBranchChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererBranchEdit}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch ? accessbranch
                            ?.filter(
                              (comp) =>
                                selectedOptionsCompanyEdit
                                  .map((data) => data.value)
                                  .includes(comp.company) &&
                                selectedOptionsBranchEdit
                                  .map((data) => data.value)
                                  .includes(comp.branch)
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
                            }) : []}
                          value={selectedOptionsUnitEdit}
                          onChange={(e) => {
                            handleUnitChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererUnitEdit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={allTeam
                            ?.filter(
                              (comp) =>
                                selectedOptionsCompanyEdit
                                  .map((data) => data.value)
                                  .includes(comp.company) &&
                                selectedOptionsBranchEdit
                                  .map((data) => data.value)
                                  .includes(comp.branch) &&
                                selectedOptionsUnitEdit
                                  .map((data) => data.value)
                                  .includes(comp.unit)
                            )
                            ?.map((data) => ({
                              label: data.teamname,
                              value: data.teamname,
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
                          value={selectedOptionsTeamEdit}
                          onChange={(e) => {
                            handleTeamChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererTeamEdit}
                          labelledBy="Please Select Team"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Names<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={employeesNamesEdit}
                      value={selectedEmployeeOptionsEdit}
                      onChange={handleEmployeeChangeEdit}
                      valueRenderer={customValueRendererEmployeeEdit}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Schedule<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "Time Based", value: "Time Based" },
                        { label: "Any Time", value: "Any Time" },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: taskGroupingEdit.schedule,
                        value: taskGroupingEdit.schedule,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          schedule: e.value,
                          time: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
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
                        label: taskGroupingEdit.priority,
                        value: taskGroupingEdit.priority,
                      }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          priority: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="Date"
                      value={taskGroupingEdit.date}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          date: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {taskGroupingEdit.schedule === "Time Based" && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Time<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="Time"
                        value={taskGroupingEdit.time}
                        onChange={(e) => {
                          setTaskGroupingEdit({
                            ...taskGroupingEdit,
                            time: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}

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
                            setTaskGroupingEdit({
                              ...taskGroupingEdit,
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
                            setTaskGroupingEdit({
                              ...taskGroupingEdit,
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
                      value={taskGroupingEdit.breakupcount}
                      onChange={(e) => {
                        const ans = e.target.value > 0 ? e.target.value : "";
                        handleTimeCalculateEdit(ans);
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
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
              </Grid>
              <br />
              <br />
              <br />
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmitReassign}>
                    {" "}
                    Reassign
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseReassign}
                  >
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
        itemsTwo={taskGroupingArray ?? []}
        filename={"Task Maintenance Schedule Grouping"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Task Maintenance Schedule Grouping Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProcess}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
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
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default TaskMaintenanceNonScheduleGrouping;
