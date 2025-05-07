import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Popover,
  Radio, RadioGroup,
  Select,
  TextField,
  Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import domtoimage from 'dom-to-image';
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
// import { colourStyles, userStyle } from "../../../../pageStyle";

function IndividualSettings() {


  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [switches, setSwitches] = useState({
    primary: false,
    secondary: false,
    wfh: false,
    unauthorized: false,
  });
  const handleSwitchChange = (event) => {
    setSwitches({ ...switches, [event.target.name]: event.target.checked });
  };
  const [switchesEdit, setSwitchesEdit] = useState({
    primary: false,
    secondary: false,
    wfh: false,
    unauthorized: false,
  });
  const handleSwitchChangeEdit = (event) => {
    setSwitchesEdit({ ...switchesEdit, [event.target.name]: event.target.checked });
  };

  const pathname = window.location.pathname;

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [totalProjects, setTotalProjects] = useState(0);

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  }


  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [isHandleChange, setIsHandleChange] = useState(false);

  const [loginapprestriction, setLoginapprestriction] = useState("desktopapponly");
  const [externalloginapprestriction, setExternalLoginapprestriction] =
    useState("");
  const [bothloginapprestriction, setBothLoginapprestriction] = useState("");
  const [loginapprestrictionEdit, setLoginapprestrictionEdit] = useState("");
  const [externalloginapprestrictionEdit, setExternalLoginapprestrictionEdit] =
    useState("");
  const [bothloginapprestrictionEdit, setBothLoginapprestrictionEdit] =
    useState("");
  const [isAllUsers, setIsAllUsers] = useState([]);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const [fileFormat, setFormat] = useState("");
  let exportColumnNamescrt = [
    'Company ',
    'Branch ',
    'Unit',
    'Team ',
    'Employee Names',
    'Two Factor Authentication',
    'IP Restriction',
    'Mobile Restriction',
    'Login Restriction',
    'Login Mode',
    "Login Status",
    "Login By Work Station",

  ]
  let exportRowValuescrt = [
    'company',
    'branch',
    'unit',
    'team',
    'companyname',
    'twofaswitch',
    'ipswitch',
    'mobileipswitch',
    'loginipswitch',
    "loginmode",
    "loginmodestring",
    "loginbyworkstation",
  ]
  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  //useStates
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  //state to handle meeting values
  const [individualSettings, setIndividualSettings] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    loginapprestriction: "desktopapponly"
  });
  //state to handle edit meeting values
  const [individualSettingsEdit, setIndividualSettingsEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    companyname: "Please Select Employee Name",
    loginapprestriction: ""
  });
  const [meetingArray, setMeetingArray] = useState([]);
  const [individualSetArrayEdit, setIndividualSetArrayEdit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allTeam,
    pageName, setPageName, buttonStyles, allUsersData
  } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
      branchaddress: data?.branchaddress,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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
        branchaddress: data?.branchaddress
      }));
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("")

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteMeeting, setDeleteMeeting] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    companyname: true,
    twofaswitch: true,
    ipswitch: true,
    mobileipswitch: true,
    loginipswitch: true,
    actions: true,
    loginmode: true,
    loginmodestring: true,
    loginbyworkstation: true,
    loginapprestriction: true,
    externalloginapprestriction: true,
    bothloginapprestriction: true,

  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const [valueCate, setValueCate] = useState("");
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  const [valueCateEdit, setValueCateEdit] = useState("");
  const [twofaSwitch, setTwofaSwitch] = useState(false);
  const [IPSwitch, setIPSwitch] = useState(false);
  const [MobileSwitch, setMobileSwitch] = useState(false);
  const [loginSwitch, setLoginSwitch] = useState(false);
  const [twofaSwitchEdit, setTwofaSwitchEdit] = useState();
  const [IPSwitchEdit, setIPSwitchEdit] = useState();
  const [MobileSwitchEdit, setMobileSwitchEdit] = useState();
  const [loginSwitchEdit, setLoginSwitchEdit] = useState();
  const [btnLoading, setBtnLoading] = useState(false);
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    setIsHandleChange(true);
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
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const handleTwoFaSwitchChange = (e) => {
    setTwofaSwitch(e.target.checked);
  };
  const handleIPSwitchChange = (e) => {
    setIPSwitch(e.target.checked);
  };
  const handleMobileSwitchChange = (e) => {
    setMobileSwitch(e.target.checked);
  };
  const handleLoginSwitchChange = (e) => {
    setLoginSwitch(e.target.checked);
  };
  const handleTwoFaSwitchChangeEdit = (e) => {
    setTwofaSwitchEdit(e.target.checked);
  };
  const handleIPSwitchChangeEdit = (e) => {
    setIPSwitchEdit(e.target.checked);
  };
  const handleMobileSwitchChangeEdit = (e) => {
    setMobileSwitchEdit(e.target.checked);
  };
  const handleLoginSwitchChangeEdit = (e) => {
    setLoginSwitchEdit(e.target.checked);
  };
  //set function to get particular row
  const fetchAllUsers = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ALLUSERENQLIVE}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIsAllUsers(res?.data?.users);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // useEffect(() => {
  //   addSerialNumber();
  // }, [meetingArray]);
  useEffect(() => {
    addSerialNumber(meetingArray);
  }, [meetingArray]);
  // useEffect(() => {
  //   fetchMeetingAllEdit();
  // }, [isEditOpen]);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("IndividualSettings"),
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
    fetchAllUsers();
    getapi()
    fetchMeetingAll();
  }, []);
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
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
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
  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setDeleteMeeting(res?.data?.sindividualsettings);
      handleClickOpen();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const bulkdeletefunction = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      setFilteredRowData([])
      setFilteredChanges(null)
      await fetchMeetingAll();
      handleCloseMod();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false)
      setPage(1);
      setSearchQuery("")
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Alert delete popup
  let meetingid = deleteMeeting._id;
  const delMeeting = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${deleteMeeting._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setFilteredRowData([])
      setFilteredChanges(null)
      await fetchMeetingAll();

      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setSearchQuery("")
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const [filterState, setFilterState] = useState({
    type: "Individual",
  });

  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];
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
    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const TypeCompany = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeBranch = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueBranchCat?.includes(u.branch)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeUnit = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueBranchCat?.includes(u.branch) &&
        valueUnitCat?.includes(u.unit)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeTeam = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueBranchCat?.includes(u.branch) &&
        valueUnitCat?.includes(u.unit) &&
        valueTeamCat?.includes(u.team)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeDepart = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueDepartmentCat?.includes(u.department)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeEmployee = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueBranchCat?.includes(u.branch) &&
        valueUnitCat?.includes(u.unit) &&
        valueTeamCat?.includes(u.team) &&
        valueEmployeeCat?.includes(u.companyname)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  //add function
  const sendRequest = async () => {
    setBtnLoading(true);
    setPageName(!pageName)
    const filterEmployee = filterState?.type === "Individual" ?
      TypeEmployee : filterState?.type === "Department" ? TypeDepart : filterState?.type === "Company" ?
        TypeCompany : filterState?.type === "Branch" ? TypeBranch : filterState?.type === "Unit" ?
          TypeUnit : filterState?.type === "Team" ? TypeTeam : []

    const isFilterMatch = filterEmployee
      .filter(
        (item) =>
          !meetingArray?.some((data) => item.companyname === data?.companyname)
      )
      .filter(
        (item, index, self) =>
          index === self.findIndex((data) => data.companyname === item.companyname)
      );

    try {
      const IndividualSettingPromises = isFilterMatch?.map((item) => {
        return axios.post(SERVICE.CREATE_INDIVIDUAL_SETTING, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(item.company),
          loginbyworkstation: switches,
          branch: String(item.branch),
          unit: String(item.unit),
          team: String(item.team),
          loginapprestriction: String(loginapprestriction),
          externalloginapprestriction: String(externalloginapprestriction),
          bothloginapprestriction: String(bothloginapprestriction),
          loginmode: String(loginMode),
          companyname: String(item.companyname),
          // companyname: [...valueCate],
          twofaswitch: Boolean(twofaSwitch),
          ipswitch: Boolean(IPSwitch),
          mobileipswitch: Boolean(MobileSwitch),
          loginipswitch: Boolean(loginSwitch),
          addedby: [{ name: String(isUserRoleAccess.companyname), date: String(new Date()) }],
        })
      });

      await Promise.all(IndividualSettingPromises);

      await fetchMeetingAll();
      setIndividualSettings({
        ...individualSettings,
        loginapprestriction: "desktopapponly"
      })
      setIndividualSettings({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
      });
      setSwitches({
        primary: false,
        secondary: false,
        wfh: false,
        unauthorized: false,
      });
      setFilterState({
        type: "Individual",
      })
      setSelectedOptionsEmployee([]);
      setValueCompanyCat([]);
      setSelectedOptionsCompany([]);
      setValueBranchCat([]);
      setSelectedOptionsBranch([]);
      setValueUnitCat([]);
      setSelectedOptionsUnit([]);
      setValueTeamCat([]);
      setSelectedOptionsTeam([]);
      setLoginapprestriction("desktopapponly");
      setSelectedOptionsCate([]);
      setValueCate("");
      setTwofaSwitch(false);
      setIPSwitch(false);
      setMobileSwitch(false);
      setLoginSwitch(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setBtnLoading(false);
    } catch (err) {
      setBtnLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = async (e) => {
    e.preventDefault();
    let empname = selectedOptionsCate.map((item) => item.value);

    const filterEmployee = filterState?.type === "Individual" ?
      TypeEmployee : filterState?.type === "Department" ? TypeDepart : filterState?.type === "Company" ?
        TypeCompany : filterState?.type === "Branch" ? TypeBranch : filterState?.type === "Unit" ?
          TypeUnit : filterState?.type === "Team" ? TypeTeam : []

    const isFilterMatch = filterEmployee
      .filter(
        (item) =>
          !meetingArray?.some((data) => item.companyname === data?.companyname)
      )
      .filter(
        (item, index, self) =>
          index === self.findIndex((data) => data.companyname === item.companyname)
      );


    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee Names");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (isNameMatch) {
    //   setPopupContentMalert("Data Already Exist!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (isFilterMatch?.length === 0) {
      setPopupContentMalert("There Is No Employee To Add!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };
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
      : "Please Select Employee Names";
  };
  //multiselect edit
  const handleCategoryChangeEdit = (options) => {
    setValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCateEdit(options);
  };
  const customValueRendererCateEdit = (valueCateEdit, _employeename) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Employee Names";
  };
  const [loginMode, setLoginMode] = useState("Internal Login");
  const [loginModeEdit, setLoginModeEdit] = useState("Internal Login");
  const handleclear = (e) => {
    e.preventDefault();
    setSwitches({
      primary: false,
      secondary: false,
      wfh: false,
      unauthorized: false,
    });
    setIndividualSettings({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
    });
    setFilterState({
      type: "Individual",
    })
    fetchMeetingAll()
    setFilteredRowData([])
    setFilteredChanges(null)
    setSelectedOptionsEmployee([]);
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setLoginapprestriction("desktopapponly");
    setSelectedOptionsCate([]);
    setValueCate("");
    setTwofaSwitch(false);
    setIPSwitch(false);
    setMobileSwitch(false);
    setLoginSwitch(false);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const handleRadioChange = (mode, value) => {
    if (mode === "internal") {
      setLoginapprestriction(value);
      setExternalLoginapprestriction("");
      setBothLoginapprestriction("");
    } else if (mode === "external") {
      setExternalLoginapprestriction(value);
      // setLoginapprestriction("");
      setBothLoginapprestriction("");
    } else if (mode === "both") {
      setBothLoginapprestriction(value);
      setExternalLoginapprestriction("");
      // setLoginapprestriction("");
    }
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };
  const handleRadioChangeEdit = (mode, value) => {
    if (mode === "internal") {
      setLoginapprestrictionEdit(value);
      setExternalLoginapprestrictionEdit("");
      setBothLoginapprestrictionEdit("");
    } else if (mode === "external") {
      setExternalLoginapprestrictionEdit(value);
      // setLoginapprestrictionEdit("");
      setBothLoginapprestrictionEdit("");
    } else if (mode === "both") {
      setBothLoginapprestrictionEdit(value);
      setExternalLoginapprestrictionEdit("");
      // setLoginapprestrictionEdit("");
    }
  };
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setTwofaSwitchEdit(res?.data?.sindividualsettings?.twofaswitch);
      setIPSwitchEdit(res?.data?.sindividualsettings?.ipswitch);
      setSwitchesEdit({
        primary: res?.data?.sindividualsettings?.loginbyworkstation?.primary || false,
        secondary: res?.data?.sindividualsettings?.loginbyworkstation?.secondary || false,
        wfh: res?.data?.sindividualsettings?.loginbyworkstation?.wfh || false,
        unauthorized: res?.data?.sindividualsettings?.loginbyworkstation?.unauthorized || false,
      })
      setMobileSwitchEdit(res?.data?.sindividualsettings?.mobileipswitch);
      setLoginSwitchEdit(res?.data?.sindividualsettings?.loginipswitch);
      setLoginModeEdit(
        res?.data?.sindividualsettings?.loginmode || "Internal Login"
      );
      setIndividualSettingsEdit(res?.data?.sindividualsettings);
      setLoginapprestrictionEdit(
        res?.data?.sindividualsettings?.loginapprestriction || ""
      );
      setExternalLoginapprestrictionEdit(
        res?.data?.sindividualsettings?.externalloginapprestriction || ""
      );
      setBothLoginapprestrictionEdit(
        res?.data?.sindividualsettings?.bothloginapprestriction || ""
      );
      handleClickOpenEdit();
      // setValueCateEdit(res?.data?.sindividualsettings?.companyname);
      // setSelectedOptionsCateEdit([
      //   ...res?.data?.sindividualsettings?.companyname.map((t) => ({
      //     ...t,
      //     label: t,
      //     value: t,
      //   })),
      // ]);
      setIndividualSetArrayEdit(
        meetingArray.filter(
          (item) => item._id !== e
        )
      );

      handleClickOpenEdit();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIndividualSettingsEdit(res?.data?.sindividualsettings);
      setTwofaSwitchEdit(res?.data?.sindividualsettings?.twofaswitch);
      setIPSwitchEdit(res?.data?.sindividualsettings?.ipswitch);
      setMobileSwitchEdit(res?.data?.sindividualsettings?.mobileipswitch);
      setLoginSwitchEdit(res?.data?.sindividualsettings?.loginipswitch);
      setSwitchesEdit({
        primary: res?.data?.sindividualsettings?.loginbyworkstation?.primary || false,
        secondary: res?.data?.sindividualsettings?.loginbyworkstation?.secondary || false,
        wfh: res?.data?.sindividualsettings?.loginbyworkstation?.wfh || false,
        unauthorized: res?.data?.sindividualsettings?.loginbyworkstation?.unauthorized || false,
      })
      // concordinateParticipants(res?.data?.sindividualsettings);
      handleClickOpenview();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const [concParticipants, setConcParticipants] = useState("");
  const concordinateParticipants = (meeting) => {
    const participants = meeting.companyname;
    const concatenatedParticipants = participants.join(",");
    // const concatenatedParticipants = participants;
    setConcParticipants(concatenatedParticipants);
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIndividualSettingsEdit(res?.data?.sindividualsettings);
      handleClickOpeninfo();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // updateby edit page...
  let updateby = individualSettingsEdit.updatedby;
  let addedby = individualSettingsEdit.addedby;
  let meetingId = individualSettingsEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${meetingId}`,
        {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          company: String(individualSettingsEdit.company),
          branch: String(individualSettingsEdit.branch),
          loginbyworkstation: switchesEdit,
          unit: String(individualSettingsEdit.unit),
          team: String(individualSettingsEdit.team),
          loginapprestriction: String(loginapprestrictionEdit),
          externalloginapprestriction: String(externalloginapprestrictionEdit),
          bothloginapprestriction: String(bothloginapprestrictionEdit),
          companyname: String(individualSettingsEdit.companyname),
          twofaswitch: Boolean(twofaSwitchEdit),
          ipswitch: Boolean(IPSwitchEdit),
          mobileipswitch: Boolean(MobileSwitchEdit),
          loginipswitch: Boolean(loginSwitchEdit),
          loginmode: String(loginModeEdit),
          updatedby: [
            ...updateby,
            { name: String(isUserRoleAccess.companyname), date: String(new Date()) },
          ],
        }
      );
      await fetchMeetingAll();
      setLoginapprestriction("desktopapponly");
      handleCloseModEdit();
      setValueCateEdit("");
      setSelectedOptionsCateEdit([]);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const editSubmit = async (e) => {
    e.preventDefault();
    await fetchMeetingAll();
    let empname = selectedOptionsCateEdit.map((item) => item.value);

    const isNameMatch = individualSetArrayEdit.some(
      (item) =>
        item.companyname === individualSettingsEdit.companyname
    );

    if (individualSettingsEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (individualSettingsEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (individualSettingsEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (individualSettingsEdit.team === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (individualSettingsEdit.companyname === "Please Select Employee Name") {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get all data.
  const fetchMeetingAll = async () => {
    setLoader(false);

    setPageName(!pageName)
    try {
      let res_status = await axios.post(SERVICE.ALL_INDIVIDUAL_SETTING, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMeetingArray(res_status?.data?.individualsettings?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
        twofaswitch: item.twofaswitch === false ? "OFF" : "ON",
        ipswitch: item.ipswitch === false ? "OFF" : "ON",
        mobileipswitch: item.mobileipswitch === false ? "OFF" : "ON",
        loginipswitch: item.loginipswitch === false ? "OFF" : "ON",
        loginapprestriction: item.loginapprestriction,
        loginbyworkstation: (Object.entries(item?.loginbyworkstation || {})
          ?.filter(([key, value]) => value) // Filter out false values
          ?.map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)) // Capitalize first letter
          ?.join(", ")) || "No WorkStation Selected",
        loginmodestring:
          item.loginmode === "Internal Login" || item.loginmode === "Both Login"
            ? item.loginapprestriction == "urlonly"
              ? "Browser Url Only With Authentication"
              : item.loginapprestriction == "urlonlywithoutauthentication"
                ? "Browser Url Only Without Authentication"
                : item.loginapprestriction == "desktopurl"
                  ? "Desktop & Browser url"
                  : item.loginapprestriction == "loginrestirct"
                    ? "User Login Restriction"
                    : item.loginapprestriction == "desktopapponly"
                      ? "Desktop App Only"
                      : item.loginapprestriction == "desktopclockinout"
                        ? "Desktop Clock In Out"
                        : ""
            : item.loginmode === "External Login"
              ? "User Login Restriction"
              : "",
      })));
      setTotalProjects(res_status?.data?.individualsettings?.length)

      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "IndividualSettings.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  // Excel
  const fileName = "IndividualSettings";
  // get particular columns for export excel
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Individual Settings List",
    pageStyle: "print",
  });
  const addSerialNumber = (datas) => {
    setItems(datas);
  };


  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };
  //datatable....

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

  const columnDataTable = [
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
      pinned: 'left', lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left', lockPinned: true,

    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: 'left', lockPinned: true,

    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: 'left', lockPinned: true,
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
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Employee Names",
      flex: 0,
      width: 180,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
    },
    {
      field: "twofaswitch",
      headerName: "Two Factor Authentication",
      flex: 0,
      width: 200,
      hide: !columnVisibility.twofaswitch,
      headerClassName: "bold-header",
    },
    {
      field: "ipswitch",
      headerName: "IP Resttriction",
      flex: 0,
      width: 150,
      hide: !columnVisibility.ipswitch,
      headerClassName: "bold-header",
    },
    {
      field: "mobileipswitch",
      headerName: "Mobile Restriction",
      flex: 0,
      width: 180,
      hide: !columnVisibility.mobileipswitch,
      headerClassName: "bold-header",
    },
    {
      field: "loginipswitch",
      headerName: "Login Restriction",
      flex: 0,
      width: 180,
      hide: !columnVisibility.loginipswitch,
      headerClassName: "bold-header",
    },
    // {
    //   field: "loginapprestriction",
    //   headerName: "Login Mode",
    //   flex: 0,
    //   width: 180,
    //   hide: !columnVisibility.loginapprestriction,
    //   headerClassName: "bold-header",
    // },
    {
      field: "loginmode",
      headerName: "Login Mode",
      flex: 0,
      width: 180,
      hide: !columnVisibility.loginmode,
      headerClassName: "bold-header",
    },
    {
      field: "loginmodestring",
      headerName: "Login Status",
      flex: 0,
      width: 180,
      hide: !columnVisibility.loginmodestring,
      headerClassName: "bold-header",
    },
    {
      field: "loginbyworkstation",
      headerName: "Login By Work Station",
      flex: 0,
      width: 180,
      hide: !columnVisibility.loginbyworkstation,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eindividualsettings") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />            </Button>
          )}
          {isUserRoleCompare?.includes("dindividualsettings") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              {" "}
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />            </Button>
          )}
          {isUserRoleCompare?.includes("vindividualsettings") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />            </Button>
          )}
          {isUserRoleCompare?.includes("iindividualsettings") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      companyname: item.companyname,
      twofaswitch: item.twofaswitch,
      ipswitch: item.ipswitch,
      mobileipswitch: item.mobileipswitch,
      loginipswitch: item.loginipswitch,
      loginmode: item.loginmode,
      loginmodestring: item.loginmodestring,
      loginbyworkstation: item.loginbyworkstation,
      // loginapprestriction: item.loginapprestriction == "urlonly" ? "Browser Url Only With Authentication" :
      //  item.loginapprestriction == "urlonlywithoutauthentication" ? "Browser Url Only Without Authentication" :
      //   item.loginapprestriction == "desktopurl" ? "Desktop & Browser url" : "Desktop App Only"

      loginapprestriction:
        item.loginapprestriction == "urlonly"
          ? "Browser Url Only With Authentication"
          : item.loginapprestriction == "urlonlywithoutauthentication"
            ? "Browser Url Only Without Authentication"
            : item.loginapprestriction == "desktopurl"
              ? "Desktop & Browser url"
              : item.loginapprestriction == "loginrestirct"
                ? "User Login Restriction"
                : item.loginapprestriction == "desktopapponly"
                  ? "Desktop App Only"
                  : "",

      externalloginapprestriction:
        item.externalloginapprestriction == "urlonly"
          ? "Browser Url Only With Authentication"
          : item.externalloginapprestriction == "urlonlywithoutauthentication"
            ? "Browser Url Only Without Authentication"
            : item.externalloginapprestriction == "desktopurl"
              ? "Desktop & Browser url"
              : item.externalloginapprestriction == "loginrestirct"
                ? "User Login Restriction"
                : item.externalloginapprestriction == "desktopapponly"
                  ? "Desktop App Only"
                  : "",

      bothloginapprestriction:
        item.bothloginapprestriction == "urlonly"
          ? "Browser Url Only With Authentication"
          : item.bothloginapprestriction == "urlonlywithoutauthentication"
            ? "Browser Url Only Without Authentication"
            : item.bothloginapprestriction == "desktopurl"
              ? "Desktop & Browser url"
              : item.bothloginapprestriction == "loginrestirct"
                ? "User Login Restriction"
                : item.bothloginapprestriction == "desktopapponly"
                  ? "Desktop App Only"
                  : "",
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
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
              Hide All{" "}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

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



    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <Headtitle title={"INDIVIDUAL SETTINGS"} />
      <PageHeading
        title="Individual Settings"
        modulename="Settings"
        submodulename="Individual Settings"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aindividualsettings") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={TypeOptions}
                    // styles={colourStyles}
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
              {["Individual", "Team"]?.includes(filterState.type) ? (
                <>
                  {/* Branch Unit Team */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Branch <b style={{ color: "red" }}>*</b>
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
                        Branch <b style={{ color: "red" }}>*</b>
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
                    <MultiSelect
                      options={isAllUsers
                        ?.filter(
                          (u) =>
                            valueCompanyCat?.includes(u.company) &&
                            valueBranchCat?.includes(u.branch) &&
                            valueUnitCat?.includes(u.unit) &&
                            valueTeamCat?.includes(u.team)
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
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid item md={12} xs={12} sm={12}></Grid>
              <Grid item md={12} xs={12} sm={12}></Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <FormGroup>
                    <FormControlLabel
                      label="Enable Two Factor Authentication"
                      control={
                        <Switch
                          checked={twofaSwitch}
                          onChange={handleTwoFaSwitchChange}
                        />
                      }
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <FormGroup>
                    <FormControlLabel
                      label="Enable IP Restriction Clockin"
                      control={
                        <Switch
                          checked={IPSwitch}
                          onChange={handleIPSwitchChange}
                        />
                      }
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <FormGroup>
                    <FormControlLabel
                      label="Enable Mobile Restriction Clockin"
                      control={
                        <Switch
                          checked={MobileSwitch}
                          onChange={handleMobileSwitchChange}
                        />
                      }
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <FormGroup>
                    <FormControlLabel
                      label="Enable IP Restriction Login"
                      control={
                        <Switch
                          checked={loginSwitch}
                          onChange={handleLoginSwitchChange}
                        />
                      }
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Login Mode</Typography>
                  <Selects
                    options={[
                      {
                        label: "Internal Login",
                        value: "Internal Login",
                      },
                      { label: "External Login", value: "External Login" },
                      { label: "Both Login", value: "Both Login" },
                    ]}
                    // styles={colourStyles}
                    value={{
                      label: loginMode,
                      value: loginMode,
                    }}
                    onChange={(e) => {
                      setLoginMode(e.value);
                    }}
                  />
                </FormControl>
              </Grid>
              {(loginMode === "Internal Login" ||
                loginMode === "Both Login") && (
                  <Grid item lg={4} md={4} sm={6} xs={12}>
                    <Grid item md={10} sm={12}>
                      <FormControl size="small" fullWidth>
                        <FormLabel>Internal Login Mode</FormLabel>
                        <RadioGroup
                          aria-labelledby="internal-login-mode-group"
                          value={loginapprestriction}
                          name="internal-login-mode-group"
                          onChange={(e) =>
                            handleRadioChange("internal", e.target.value)
                          }
                        >
                          <FormControlLabel
                            value="desktopapponly"
                            control={<Radio />}
                            label="DeskTop App Only"
                          />
                          <FormControlLabel
                            value="urlonly"
                            control={<Radio />}
                            label="Browser Url Only With Authentication"
                          />
                          <FormControlLabel
                            value="urlonlywithoutauthentication"
                            control={<Radio />}
                            label={`Browser Url Only Without Authentication${loginMode === "Both Login" ? " (Both Login)" : ""
                              }`}
                          />
                          <FormControlLabel
                            value="desktopurl"
                            control={<Radio />}
                            label="Desktop & Browser Url"
                          />
                          <FormControlLabel
                            value="loginrestirct"
                            control={<Radio />}
                            label={`User Login Restriction${loginMode === "Both Login" ? " (Both Login)" : ""
                              }`}
                          />
                          <FormControlLabel
                            value="desktopclockinout"
                            control={<Radio />}
                            label="Desktop Clock In/Out"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

              {/* External login mode grid */}
              {loginMode === "External Login" && (
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Grid item md={10} sm={12}>
                    <FormControl size="small" fullWidth>
                      <FormLabel>External Login Mode</FormLabel>
                      <RadioGroup
                        aria-labelledby="external-login-mode-group"
                        value={externalloginapprestriction}
                        name="external-login-mode-group"
                        onChange={(e) =>
                          handleRadioChange("external", e.target.value)
                        }
                      >
                        <FormControlLabel
                          value="urlonlywithoutauthentication"
                          control={<Radio />}
                          label="Browser Url Only Without Authentication"
                        />

                        {/* <FormControlLabel
                          value="desktopapponly"
                          control={<Radio />}
                          label="DeskTop App Only"
                        />
                        <FormControlLabel
                          value="urlonly"
                          control={<Radio />}
                          label="Browser Url Only With Authentication"
                        />
                        
                        <FormControlLabel
                          value="desktopurl"
                          control={<Radio />}
                          label="Desktop & Browser Url"
                        /> */}
                        <FormControlLabel
                          value="loginrestirct"
                          control={<Radio />}
                          label="User Login Restriction"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              <Grid item md={4} sm={12} xs={12} >
                <Grid container spacing={2}>
                  {/* Heading */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Login By WorkStation
                    </Typography>
                  </Grid>

                  {/* Switches (Column-wise) */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" fullWidth>
                      <FormGroup>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={switches.primary}
                                  onChange={handleSwitchChange}
                                  name="primary"
                                />
                              }
                              label="Primary"
                            />
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={switches.secondary}
                                  onChange={handleSwitchChange}
                                  name="secondary"
                                />
                              }
                              label="Secondary"
                            />
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={switches.wfh}
                                  onChange={handleSwitchChange}
                                  name="wfh"
                                />
                              }
                              label="WFH"
                            />
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={switches.unauthorized}
                                  onChange={handleSwitchChange}
                                  name="unauthorized"
                                />
                              }
                              label="UnAuthorized"
                            />
                          </Grid>
                        </Grid>
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={3} xs={12} sm={6}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "end",
                  alignItems: "end"
                }}>
                <Grid>
                  <LoadingButton
                    // loading={btnLoading}
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                  >
                    Submit
                  </LoadingButton>
                  &nbsp;
                  &nbsp;
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    {" "}
                    Clear{" "}
                  </Button>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />

            </Grid>
          </>
        </Box>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lindividualsettings") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Individual Settings
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
                      PaperProps: { style: { maxHeight: 180, width: 80 } },
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
                    <MenuItem value={meetingArray?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelindividualsettings") && (
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
                  {isUserRoleCompare?.includes("csvindividualsettings") && (
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
                  {isUserRoleCompare?.includes("printindividualsettings") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp; <FaPrint /> &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfindividualsettings") && (
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
                  {isUserRoleCompare?.includes("imageindividualsettings") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
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
                  maindatas={meetingArray}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={meetingArray}

                />
              </Grid>

            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdindividualsettings") && (
              <Button
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            <Box style={{ width: "100%", overflowY: "hidden" }}>
              {!loader ? (
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
                  totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={meetingArray}
                />

              )}
            </Box>

          </Box>
        </>
      )}
      {/* ****** Table End ****** */}
      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {" "}
        {manageColumnsContent}
      </Popover>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "80px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Individual Settings List
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{individualSettingsEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{individualSettingsEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Unit</Typography>
                  <Typography>{individualSettingsEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>{individualSettingsEdit.team}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Employee Names</Typography>
                  <Typography>{individualSettingsEdit.companyname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Two Factor Authentication
                  </Typography>
                  <Typography>{twofaSwitchEdit ? "ON" : "OFF"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">IP Restriction</Typography>
                  <Typography>{IPSwitchEdit ? "ON" : "OFF"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mobile Restriction</Typography>
                  <Typography>{MobileSwitchEdit ? "ON" : "OFF"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Login Restriction</Typography>
                  <Typography>{individualSettingsEdit.loginapprestriction == "urlonly" ? "Browser Url Only With Authentication" : individualSettingsEdit.loginapprestriction == "urlonlywithoutauthentication" ? "Browser Url Only Without Authentication" : individualSettingsEdit.loginapprestriction == "desktopurl" ? "Desktop & Browser url" : "Desktop App Only"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Login Mode</Typography>
                  <Typography>{individualSettingsEdit?.loginmode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Login Status</Typography>
                  <Typography>
                    {individualSettingsEdit.loginmode === "Internal Login" ||
                      individualSettingsEdit.loginmode === "Both Login"
                      ? individualSettingsEdit.loginapprestriction == "urlonly"
                        ? "Browser Url Only With Authentication"
                        : individualSettingsEdit.loginapprestriction ==
                          "urlonlywithoutauthentication"
                          ? "Browser Url Only Without Authentication"
                          : individualSettingsEdit.loginapprestriction ==
                            "desktopurl"
                            ? "Desktop & Browser url"
                            : individualSettingsEdit.loginapprestriction ==
                              "loginrestirct"
                              ? "User Login Restriction"
                              : individualSettingsEdit.loginapprestriction ==
                                "desktopapponly"
                                ? "Desktop App Only"
                                : ""
                      : individualSettingsEdit.loginmode === "External Login"
                        ? "User Login Restriction"
                        : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Login By WorkStation</Typography>
                  <Typography>
                    {(Object.entries(switchesEdit || {})
                      .filter(([key, value]) => value) // Filter out false values
                      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)) // Capitalize first letter
                      .join(", ")) || "No WorkStation Selected"} {/* Default message if all are false */}
                  </Typography>
                </FormControl>
              </Grid>

            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
          // PaperProps={{
          //   style: {
          //     marginTop: '100px',
          //   },
          // }}
          sx={{ marginTop: "80px" }}
        >
          <Box sx={{ padding: "20px 30px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  Edit Individual Settings{" "}
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
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
                      placeholder="Please Select Company"
                      value={{
                        label:
                          individualSettingsEdit.company === ""
                            ? "Please Select Company"
                            : individualSettingsEdit.company,
                        value:
                          individualSettingsEdit.company === ""
                            ? "Please Select Company"
                            : individualSettingsEdit.company,
                      }}
                      onChange={(e) => {
                        setIndividualSettingsEdit({
                          ...individualSettingsEdit,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          companyname: "Please Select Employee Name",
                        });
                        setSelectedOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            individualSettingsEdit.company === comp.company
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
                        })}
                      placeholder="Please Select Branch"
                      value={{
                        label: individualSettingsEdit.branch,
                        value: individualSettingsEdit.branch,
                      }}
                      onChange={(e) => {
                        setIndividualSettingsEdit({
                          ...individualSettingsEdit,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          companyname: "Please Select Employee Name",
                        });
                        setSelectedOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            individualSettingsEdit.company === comp.company &&
                            individualSettingsEdit.branch === comp.branch
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
                        })}
                      placeholder="Please Select Unit"
                      value={{
                        label: individualSettingsEdit.unit,
                        value: individualSettingsEdit.unit,
                      }}
                      onChange={(e) => {
                        setIndividualSettingsEdit({
                          ...individualSettingsEdit,
                          unit: e.value,
                          team: "Please Select Team",
                          companyname: "Please Select Employee Name",
                        });
                        setSelectedOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            individualSettingsEdit.company === comp.company &&
                            individualSettingsEdit.branch === comp.branch &&
                            individualSettingsEdit.unit === comp.unit
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
                      placeholder="Please Select Team"
                      value={{
                        label: individualSettingsEdit.team,
                        value: individualSettingsEdit.team,
                      }}
                      onChange={(e) => {
                        setIndividualSettingsEdit({
                          ...individualSettingsEdit,
                          team: e.value,
                          companyname: "Please Select Employee Name",
                        });
                        setSelectedOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Names<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAllUsers
                        ?.filter(
                          (comp) =>
                            individualSettingsEdit.company === comp.company &&
                            individualSettingsEdit.branch === comp.branch &&
                            individualSettingsEdit.unit === comp.unit &&
                            individualSettingsEdit.team === comp.team
                        )
                        ?.map((data) => ({
                          label: data.companyname,
                          value: data.companyname,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={{
                        label: individualSettingsEdit.companyname,
                        value: individualSettingsEdit.companyname,
                      }}
                      onChange={(e) => {
                        setIndividualSettingsEdit({
                          ...individualSettingsEdit,
                          companyname: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        label="Enable Two Factor Authentication"
                        control={
                          <Switch
                            checked={twofaSwitchEdit}
                            onChange={handleTwoFaSwitchChangeEdit}
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        label="Enable IP Restriction Clockin"
                        control={
                          <Switch
                            checked={IPSwitchEdit}
                            onChange={handleIPSwitchChangeEdit}
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        label="Enable Mobile Restriction Clockin"
                        control={
                          <Switch
                            checked={MobileSwitchEdit}
                            onChange={handleMobileSwitchChangeEdit}
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        label="Enable IP Restriction Login"
                        control={
                          <Switch
                            checked={loginSwitchEdit}
                            onChange={handleLoginSwitchChangeEdit}
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Login Mode</Typography>
                    <Selects
                      options={[
                        {
                          label: "Internal Login",
                          value: "Internal Login",
                        },
                        { label: "External Login", value: "External Login" },
                        { label: "Both Login", value: "Both Login" },
                      ]}
                      // styles={colourStyles}
                      value={{
                        label: loginModeEdit,
                        value: loginModeEdit,
                      }}
                      onChange={(e) => {
                        setLoginModeEdit(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                {(loginModeEdit === "Internal Login" ||
                  loginModeEdit === "Both Login") && (
                    <Grid item lg={4} md={4} sm={6} xs={12}>
                      <Grid item md={10} sm={12}>
                        <FormControl size="small" fullWidth>
                          <FormLabel>Internal Login Mode</FormLabel>
                          <RadioGroup
                            aria-labelledby="internal-login-mode-groupedit"
                            value={loginapprestrictionEdit}
                            name="internal-login-mode-groupedit"
                            onChange={(e) =>
                              handleRadioChangeEdit("internal", e.target.value)
                            }
                          >
                            <FormControlLabel
                              value="desktopapponly"
                              control={<Radio />}
                              label="DeskTop App Only"
                            />
                            <FormControlLabel
                              value="urlonly"
                              control={<Radio />}
                              label="Browser Url Only With Authentication"
                            />
                            <FormControlLabel
                              value="urlonlywithoutauthentication"
                              control={<Radio />}
                              label={`Browser Url Only Without Authentication${loginModeEdit === "Both Login"
                                ? " (Both Login)"
                                : ""
                                }`}
                            />
                            <FormControlLabel
                              value="desktopurl"
                              control={<Radio />}
                              label="Desktop & Browser Url"
                            />
                            <FormControlLabel
                              value="loginrestirct"
                              control={<Radio />}
                              label={`User Login Restriction${loginModeEdit === "Both Login"
                                ? " (Both Login)"
                                : ""
                                }`}
                            />
                            <FormControlLabel
                              value="desktopclockinout"
                              control={<Radio />}
                              label="Desktop Clock In/Out"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  )}

                {/* External login mode grid */}
                {loginModeEdit === "External Login" && (
                  <Grid item lg={4} md={4} sm={6} xs={12}>
                    <Grid item md={10} sm={12}>
                      <FormControl size="small" fullWidth>
                        <FormLabel>External Login Mode</FormLabel>
                        <RadioGroup
                          aria-labelledby="external-login-mode-groupedit"
                          value={externalloginapprestrictionEdit}
                          name="external-login-mode-groupedit"
                          onChange={(e) =>
                            handleRadioChangeEdit("external", e.target.value)
                          }
                        >
                          <FormControlLabel
                            value="urlonlywithoutauthentication"
                            control={<Radio />}
                            label="Browser Url Only Without Authentication"
                          />
                          <FormControlLabel
                            value="loginrestirct"
                            control={<Radio />}
                            label="User Login Restriction"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                <Grid item md={4} sm={12} xs={12} >
                  <Grid container spacing={2}>
                    {/* Heading */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Login By WorkStation
                      </Typography>
                    </Grid>

                    {/* Switches (Column-wise) */}
                    <Grid item xs={12}>
                      <FormControl component="fieldset" fullWidth>
                        <FormGroup>
                          <Grid container direction="column" spacing={1}>
                            <Grid item>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={switchesEdit.primary}
                                    onChange={handleSwitchChangeEdit}
                                    name="primary"
                                  />
                                }
                                label="Primary"
                              />
                            </Grid>
                            <Grid item>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={switchesEdit.secondary}
                                    onChange={handleSwitchChangeEdit}
                                    name="secondary"
                                  />
                                }
                                label="Secondary"
                              />
                            </Grid>
                            <Grid item>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={switchesEdit.wfh}
                                    onChange={handleSwitchChangeEdit}
                                    name="wfh"
                                  />
                                }
                                label="WFH"
                              />
                            </Grid>
                            <Grid item>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={switchesEdit.unauthorized}
                                    onChange={handleSwitchChangeEdit}
                                    name="unauthorized"
                                  />
                                }
                                label="UnAuthorized"
                              />
                            </Grid>
                          </Grid>
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid item lg={6} md={4} sm={6} xs={12}>
                  <Grid item md={10} sm={12}>
                    <FormControl size="small" fullWidth>
                      <FormLabel>Login Mode</FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={individualSettingsEdit.loginapprestriction}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="desktopapponly" control={<Radio onChange={(e) => { setIndividualSettingsEdit({ ...individualSettingsEdit, loginapprestriction: e.target.value }) }} />} label="DeskTop App Only" />
                        <FormControlLabel value="desktopurl" control={<Radio onChange={(e) => { setIndividualSettingsEdit({ ...individualSettingsEdit, loginapprestriction: e.target.value }) }} />} label="Desktop & Browser Url" />
                        <FormControlLabel value="urlonly" control={<Radio onChange={(e) => { setIndividualSettingsEdit({ ...individualSettingsEdit, loginapprestriction: e.target.value }) }} />} label="Browser Url Only With Authentication" />
                        <FormControlLabel value="urlonlywithoutauthentication" control={<Radio onChange={(e) => { setIndividualSettingsEdit({ ...individualSettingsEdit, loginapprestriction: e.target.value }) }} />} label="Browser Url Only Without Authentication" />
                        <FormControlLabel value="loginrestirct" control={<Radio onChange={(e) => { setIndividualSettingsEdit({ ...individualSettingsEdit, loginapprestriction: e.target.value }) }} />} label="User Login Restriction" />

                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid> */}

              </Grid>
              <br /> <br />
              <Grid container spacing={2}></Grid>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={editSubmit}
                  sx={buttonStyles.buttonsubmit}
                >
                  {" "}
                  Update
                </Button>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                  {" "}
                  Cancel{" "}
                </Button>
              </DialogActions>
            </>
          </Box>
        </Dialog>
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
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              {" "}
              ok{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
      {/* EXTERNAL COMPONENTS -------------- END */}
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
        itemsTwo={meetingArray ?? []}
        filename={"Individual Settings"}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Individual Settings Info"
        addedby={addedby}
        updateby={updateby}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delMeeting}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
    </Box>
  );
}
export default IndividualSettings;