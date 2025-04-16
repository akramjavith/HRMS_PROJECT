import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
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
  OutlinedInput,
  Popover,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

function IndividualSettings() {
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [loginapprestriction, setLoginapprestriction] =
    useState("desktopapponly");
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
    "Company ",
    "Branch ",
    "Unit",
    "Team ",
    "Employee Names",
    "Two Factor Authentication",
    "IP Restriction",
    "Mobile Restriction",
    "Login Restriction",
    "Login Mode",
    "Login Status",
    // "Internal Login Mode",
    // "External Login Mode",
    // "Both Login Mode",
  ];
  let exportRowValuescrt = [
    "company",
    "branch",
    "unit",
    "team",
    "companyname",
    "twofaswitch",
    "ipswitch",
    "mobileipswitch",
    "loginipswitch",
    "loginmode",
    "loginmodestring",
    // "loginapprestriction",
    // "externalloginapprestriction",
    // "bothloginapprestriction",
  ];
  const gridRef = useRef(null);
  //useStates
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  //state to handle meeting values
  const [individualSettings, setIndividualSettings] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
  });
  //state to handle edit meeting values
  const [individualSettingsEdit, setIndividualSettingsEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
  });
  const [meetingArray, setMeetingArray] = useState([]);
  const [individualSetArrayEdit, setIndividualSetArrayEdit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allTeam,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    loginstatus: true,
    loginapprestriction: true,
    externalloginapprestriction: true,
    bothloginapprestriction: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
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
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ALLUSERENQLIVE}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIsAllUsers(res?.data?.users);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    addSerialNumber();
  }, [meetingArray]);
  useEffect(() => {
    fetchMeetingAll();
  }, [isEditOpen]);
  useEffect(() => {
    fetchAllUsers();
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
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setDeleteMeeting(res?.data?.sindividualsettings);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const bulkdeletefunction = async () => {
    setPageName(!pageName);
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
      await fetchMeetingAll();
      handleCloseMod();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // Alert delete popup
  let meetingid = deleteMeeting._id;
  const delMeeting = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(
        `${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${deleteMeeting._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchMeetingAll();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //add function
  const sendRequest = async () => {
    setBtnLoading(true);
    setPageName(!pageName);
    try {
      let eventCreate = await axios.post(SERVICE.CREATE_INDIVIDUAL_SETTING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(individualSettings.company),
        branch: String(individualSettings.branch),
        unit: String(individualSettings.unit),
        team: String(individualSettings.team),
        loginapprestriction: String(loginapprestriction),
        externalloginapprestriction: String(externalloginapprestriction),
        bothloginapprestriction: String(bothloginapprestriction),
        loginmode: String(loginMode),
        companyname: [...valueCate],
        twofaswitch: Boolean(twofaSwitch),
        ipswitch: Boolean(IPSwitch),
        mobileipswitch: Boolean(MobileSwitch),
        loginipswitch: Boolean(loginSwitch),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchMeetingAll();
      setLoginapprestriction("desktopapponly");
      setLoginMode("Individual Login");
      setExternalLoginapprestriction("");
      setBothLoginapprestriction("");
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //submit option for saving
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchMeetingAll();
    let empname = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = meetingArray.some(
      (item) =>
        item.company === individualSettings.company &&
        item.branch === individualSettings.branch &&
        item.companyname.some((data) => empname.includes(data))
    );
    if (individualSettings.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (individualSettings.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (individualSettings.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (individualSettings.team === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueCate.length === 0) {
      setPopupContentMalert("Please Select Employee Names");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
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
    setIndividualSettings({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
    });
    setLoginMode("Internal Login");
    setLoginapprestriction("desktopapponly");
    setExternalLoginapprestriction("");
    setBothLoginapprestriction("");
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
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setTwofaSwitchEdit(res?.data?.sindividualsettings?.twofaswitch);
      setIPSwitchEdit(res?.data?.sindividualsettings?.ipswitch);
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
      setValueCateEdit(res?.data?.sindividualsettings?.companyname);
      setSelectedOptionsCateEdit([
        ...res?.data?.sindividualsettings?.companyname.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIndividualSettingsEdit(res?.data?.sindividualsettings);
      setTwofaSwitchEdit(res?.data?.sindividualsettings?.twofaswitch);
      setIPSwitchEdit(res?.data?.sindividualsettings?.ipswitch);
      setMobileSwitchEdit(res?.data?.sindividualsettings?.mobileipswitch);
      setLoginSwitchEdit(res?.data?.sindividualsettings?.loginipswitch);
      concordinateParticipants(res?.data?.sindividualsettings);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIndividualSettingsEdit(res?.data?.sindividualsettings);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // updateby edit page...
  let updateby = individualSettingsEdit.updatedby;
  let addedby = individualSettingsEdit.addedby;
  let meetingId = individualSettingsEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_INDIVIDUAL_SETTING}/${meetingId}`,
        {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          company: String(individualSettingsEdit.company),
          branch: String(individualSettingsEdit.branch),
          unit: String(individualSettingsEdit.unit),
          team: String(individualSettingsEdit.team),
          loginapprestriction: String(loginapprestrictionEdit),
          externalloginapprestriction: String(externalloginapprestrictionEdit),
          bothloginapprestriction: String(bothloginapprestrictionEdit),
          companyname: [...valueCateEdit],
          twofaswitch: Boolean(twofaSwitchEdit),
          ipswitch: Boolean(IPSwitchEdit),
          mobileipswitch: Boolean(MobileSwitchEdit),
          loginipswitch: Boolean(loginSwitchEdit),
          loginmode: String(loginModeEdit),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchMeetingAll();
      setLoginapprestriction("desktopapponly");
      // setExternalLoginapprestriction("desktopapponly");
      // setBothLoginapprestriction("desktopapponly");
      handleCloseModEdit();
      setValueCateEdit("");
      setSelectedOptionsCateEdit([]);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const editSubmit = async (e) => {
    e.preventDefault();
    await fetchMeetingAll();
    let empname = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = individualSetArrayEdit.some(
      (item) =>
        item.company === individualSettingsEdit.company &&
        item.branch === individualSettingsEdit.branch &&
        item.companyname.some((data) => empname.includes(data))
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
    } else if (valueCateEdit.length === 0) {
      setPopupContentMalert("Please Select Employee Names");
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
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
          branch: data.branch,
          company: data.company,
          unit: data.unit,
        }))
      : []; // Return an empty array if isAssignBranch is undefined or null

    setPageName(!pageName);
    try {
      let res_status = await axios.post(
        SERVICE.ALL_INDIVIDUAL_SETTING,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setMeetingArray(res_status?.data?.individualsettings);
      setIndividualSetArrayEdit(
        res_status?.data?.individualsettings.filter(
          (item) => item._id !== individualSettingsEdit._id
        )
      );
      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "IndividualSettings.png");
        });
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
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = meetingArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      twofaswitch: item.twofaswitch === false ? "OFF" : "ON",
      ipswitch: item.ipswitch === false ? "OFF" : "ON",
      mobileipswitch: item.mobileipswitch === false ? "OFF" : "ON",
      loginipswitch: item.loginipswitch === false ? "OFF" : "ON",
      loginapprestriction: item.loginapprestriction,
      externalloginapprestriction: item.externalloginapprestriction,
      bothloginapprestriction: item.bothloginapprestriction,
      loginmode: item.loginmode,
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
            : ""
          : item.loginmode === "External Login"
          ? "User Login Restriction"
          : "",
    }));
    setItems(itemsWithSerialNumber);
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
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: { fontWeight: "bold" },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
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
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
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
    // {
    //   field: "loginapprestriction",
    //   headerName: "Internal Login Mode",
    //   flex: 0,
    //   width: 180,
    //   hide: !columnVisibility.loginapprestriction,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "externalloginapprestriction",
    //   headerName: "External Login Mode",
    //   flex: 0,
    //   width: 180,
    //   hide: !columnVisibility.externalloginapprestriction,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "bothloginapprestriction",
    //   headerName: "Both Login Mode",
    //   flex: 0,
    //   width: 180,
    //   hide: !columnVisibility.bothloginapprestriction,
    //   headerClassName: "bold-header",
    // },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eindividualsettings") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("dindividualsettings") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              {" "}
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("vindividualsettings") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iindividualsettings") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
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
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      companyname: item.companyname.join(","),
      twofaswitch: item.twofaswitch,
      ipswitch: item.ipswitch,
      mobileipswitch: item.mobileipswitch,
      loginipswitch: item.loginipswitch,
      loginmode: item.loginmode,
      loginmodestring: item.loginmodestring,
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
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
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
                    placeholder="Please Select Company"
                    value={{
                      label: individualSettings.company,
                      value: individualSettings.company,
                    }}
                    onChange={(e) => {
                      setIndividualSettings({
                        ...individualSettings,
                        company: e.value,
                        branch: "Please Select Branch",
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                      });
                      setValueCate("");
                      setSelectedOptionsCate([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={isAssignBranch
                      ?.filter(
                        (comp) => individualSettings.company === comp.company
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
                      label: individualSettings.branch,
                      value: individualSettings.branch,
                    }}
                    onChange={(e) => {
                      setIndividualSettings({
                        ...individualSettings,
                        branch: e.value,
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                      });
                      setSelectedOptionsCate([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={isAssignBranch
                      ?.filter(
                        (comp) =>
                          individualSettings.company === comp.company &&
                          individualSettings.branch === comp.branch
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
                      label: individualSettings.unit,
                      value: individualSettings.unit,
                    }}
                    onChange={(e) => {
                      setIndividualSettings({
                        ...individualSettings,
                        unit: e.value,
                        team: "Please Select Team",
                      });
                      setSelectedOptionsCate([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Team<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={allTeam
                      ?.filter(
                        (comp) =>
                          individualSettings.company === comp.company &&
                          individualSettings.branch === comp.branch &&
                          individualSettings.unit === comp.unit
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
                      label: individualSettings.team,
                      value: individualSettings.team,
                    }}
                    onChange={(e) => {
                      setIndividualSettings({
                        ...individualSettings,
                        team: e.value,
                      });
                      setValueCate("");
                      setSelectedOptionsCate([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Employee Names<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={isAllUsers
                      ?.filter(
                        (comp) =>
                          individualSettings.company === comp.company &&
                          individualSettings.branch === comp.branch &&
                          individualSettings.unit === comp.unit &&
                          individualSettings.team === comp.team
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
                    value={selectedOptionsCate}
                    onChange={handleCategoryChange}
                    valueRenderer={customValueRendererCate}
                    labelledBy="Please Select Employee Names"
                  />
                </FormControl>
              </Grid>
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
                          label={`Browser Url Only Without Authentication${
                            loginMode === "Both Login" ? " (Both Login)" : ""
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
                          label={`User Login Restriction${
                            loginMode === "Both Login" ? " (Both Login)" : ""
                          }`}
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

              {/* Both login mode grid */}
              {/* <Grid item lg={4} md={4} sm={6} xs={12}>
                <Grid item md={10} sm={12}>
                  <FormControl size="small" fullWidth>
                    <FormLabel>Both Login Mode</FormLabel>
                    <RadioGroup
                      aria-labelledby="both-login-mode-group"
                      value={bothloginapprestriction}
                      name="both-login-mode-group"
                      onChange={(e) =>
                        handleRadioChange("both", e.target.value)
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
                        label="Browser Url Only Without Authentication"
                      />
                      <FormControlLabel
                        value="desktopurl"
                        control={<Radio />}
                        label="Desktop & Browser Url"
                      />
                      <FormControlLabel
                        value="loginrestirct"
                        control={<Radio />}
                        label="User Login Restriction"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid> */}
              <br />
              <br />
            </Grid>
            <br />
            <br />
            <br />
            <Grid container>
              <Grid item md={3} xs={12} sm={6}>
                <LoadingButton
                  loading={btnLoading}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </LoadingButton>
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
                    {/* <MenuItem value={meetingArray?.length}>All</MenuItem> */}
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdindividualsettings") && (
              <Button
                variant="contained"
                color="error"
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
              )}
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
                  <Typography>{concParticipants}</Typography>
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
                  <Typography>{loginSwitchEdit ? "ON" : "OFF"}</Typography>
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
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
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
                      options={isAssignBranch
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
                      options={isAssignBranch
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
                    <MultiSelect
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
                      value={selectedOptionsCateEdit}
                      onChange={handleCategoryChangeEdit}
                      valueRenderer={customValueRendererCateEdit}
                      labelledBy="Please Select Employee Names"
                    />
                  </FormControl>
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
                            label={`Browser Url Only Without Authentication${
                              loginModeEdit === "Both Login"
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
                            label={`User Login Restriction${
                              loginModeEdit === "Both Login"
                                ? " (Both Login)"
                                : ""
                            }`}
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

                {/* Both login mode grid */}
                {/* <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Grid item md={10} sm={12}>
                    <FormControl size="small" fullWidth>
                      <FormLabel>Both Login Mode</FormLabel>
                      <RadioGroup
                        aria-labelledby="both-login-mode-groupedit"
                        value={bothloginapprestrictionEdit}
                        name="both-login-mode-groupedit"
                        onChange={(e) =>
                          handleRadioChangeEdit("both", e.target.value)
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
                          value="desktopurl"
                          control={<Radio />}
                          label="Desktop & Browser Url"
                        />
                        <FormControlLabel
                          value="loginrestirct"
                          control={<Radio />}
                          label="User Login Restriction"
                        />
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
                  sx={userStyle.buttonadd}
                >
                  {" "}
                  Update
                </Button>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
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