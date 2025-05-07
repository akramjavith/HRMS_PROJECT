import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import ActionEmployeeAssignInterviewer from "./ActionEmployeeAssignInterviewer";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

function Assigninterviewer() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setBtnDisable(false);
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
    "From Company",
    "From Branch",
    "From Unit",
    "From Team",
    "Type",
    "Designation",
    "Round",
    "To Company",
    "To Branch",
    "To Unit",
    "To Team",
    "Employee",
  ];
  let exportRowValues = [
    "fromcompany",
    "frombranch",
    "fromunit",
    "fromteam",
    "type",
    "designation",
    "round",
    "tocompany",
    "tobranch",
    "tounit",
    "toteam",
    "employee",
  ];

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
      pagename: String("Assign Interviewer"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [isDeleteOpenAl, setIsDeleteOpenAl] = useState(false);
  const [isBulkDeleteOpenAl, setIsBulkDeleteOpenAl] = useState(false);
  const [employeEdit, setEmployeeEdit] = useState([]);
  const [selectedOptionsEdit, setSelectedOptionsEdit] = useState([]);
  const [selectedEmployeeOpt, setSelectedEmployeeOpt] = useState([]);
  const [empValue, setEmpValue] = useState([]);
  const [editId, setEditId] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);
  //state to handle powerstation values
  const [assignInterviewerState, setAssignInterviewerState] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    type: "Interviewer",
    team: "Please Select Team",
    designation: "Please Select Designation",
    employee: [""],
  });
  const [assignInterviewerEdit, setAssignInterviewerEdit] = useState({
    tocompany: "Please Select Compay",
    tobranch: "Please Select Branch",
    tounit: "Please Select Unit",
    type: "Please Select Type",
    toteam: "Please Select Team",
    employee: "",
  });

  const [selectedOptionsCompanyAdd, setSelectedOptionsCompanyAdd] = useState(
    []
  );
  const [selectedOptionsRoundAdd, setSelectedOptionsRoundAdd] = useState([]);
  const [selectedOptionsBranchAdd, setSelectedOptionsBranchAdd] = useState([]);
  const [selectedOptionsUnitAdd, setSelectedOptionsUnitAdd] = useState([]);
  const [selectedOptionsTeamAdd, setSelectedOptionsTeamAdd] = useState([]);
  const [round, setRound] = useState([]);

  //get all Sub vendormasters.
  const fetchInterviewgrouping = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const roundall = [
        ...res_vendor?.data?.interviewgroupingquestion.map((d) => ({
          ...d,
          label: d.round,
          value: d.round,
        })),
      ];

      setRound(roundall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //company-----------------------------------------
  const handleCompanyChangeAdd = (options) => {
    setSelectedOptionsCompanyAdd(options);
    setSelectedOptionsBranchAdd([]);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsTeamAdd([]);
  };

  const customValueRendererCompanyAdd = (valueCompanyAdd, _shifts) => {
    return valueCompanyAdd.length ? (
      valueCompanyAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    );
  };

  //Branch-----------------------------------------
  const handleBranchChangeAdd = (options) => {
    setSelectedOptionsBranchAdd(options);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsTeamAdd([]);
  };

  const customValueRendererBranchAdd = (valueBranchAdd, _shifts) => {
    return valueBranchAdd.length ? (
      valueBranchAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    );
  };

  //Unit-----------------------------------------
  const handleUnitChangeAdd = (options) => {
    setSelectedOptionsUnitAdd(options);
    setSelectedOptionsTeamAdd([]);
  };

  const customValueRendererUnitAdd = (valueUnitAdd, _shifts) => {
    return valueUnitAdd.length ? (
      valueUnitAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Unit</span>
    );
  };

  //Team-----------------------------------------

  const handleTeamChangeAdd = (options) => {
    setSelectedOptionsTeamAdd(options);
  };

  const customValueRendererTeamAdd = (valueTeamAdd, _shifts) => {
    return valueTeamAdd.length ? (
      valueTeamAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Team</span>
    );
  };

  //round-----------------------------------------
  const handleRoundChangeAdd = (options) => {
    setSelectedOptionsRoundAdd(options);
  };

  const customValueRendererRoundAdd = (valueRoundAdd, _shifts) => {
    return valueRoundAdd.length ? (
      valueRoundAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Round</span>
    );
  };
  // for Edit section---------------------------------------------------------------------------

  const [selectedOptionsCompanyAddEdit, setSelectedOptionsCompanyAddEdit] =
    useState([]);
  const [selectedOptionsRoundAddEdit, setSelectedOptionsRoundAddEdit] =
    useState([]);
  const [selectedOptionsBranchAddEdit, setSelectedOptionsBranchAddEdit] =
    useState([]);
  const [selectedOptionsUnitAddEdit, setSelectedOptionsUnitAddEdit] = useState(
    []
  );
  const [selectedOptionsTeamAddEdit, setSelectedOptionsTeamAddEdit] = useState(
    []
  );
  //round-----------------------------------------
  const handleRoundChangeAddEdit = (options) => {
    setSelectedOptionsRoundAddEdit(options);
  };

  const customValueRendererRoundAddEdit = (valueRoundAddEdit, _shifts) => {
    return valueRoundAddEdit.length ? (
      valueRoundAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Round</span>
    );
  };

  //company-----------------------------------------
  const handleCompanyChangeAddEdit = (options) => {
    setSelectedOptionsCompanyAddEdit(options);
    setSelectedOptionsBranchAddEdit([]);
    setSelectedOptionsUnitAddEdit([]);
    setSelectedOptionsTeamAddEdit([]);
  };

  const customValueRendererCompanyAddEdit = (valueCompanyAddEdit, _shifts) => {
    return valueCompanyAddEdit.length ? (
      valueCompanyAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    );
  };

  //Branch-----------------------------------------
  const handleBranchChangeAddEdit = (options) => {
    setSelectedOptionsBranchAddEdit(options);
    setSelectedOptionsUnitAddEdit([]);
    setSelectedOptionsTeamAddEdit([]);
  };

  const customValueRendererBranchAddEdit = (valueBranchAddEdit, _shifts) => {
    return valueBranchAddEdit.length ? (
      valueBranchAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    );
  };

  //Unit-----------------------------------------
  const handleUnitChangeAddEdit = (options) => {
    setSelectedOptionsUnitAddEdit(options);
    setSelectedOptionsTeamAddEdit([]);
  };

  const customValueRendererUnitAddEdit = (valueUnitAddEdit, _shifts) => {
    return valueUnitAddEdit.length ? (
      valueUnitAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Unit</span>
    );
  };

  //Team-----------------------------------------

  const handleTeamChangeAddEdit = (options) => {
    setSelectedOptionsTeamAddEdit(options);
  };

  const customValueRendererTeamAddEdit = (valueTeamAddEdit, _shifts) => {
    return valueTeamAddEdit.length ? (
      valueTeamAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Team</span>
    );
  };

  const handleCategoryEditChange = (options) => {
    setEmployeeEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEdit(options);
  };
  const [powerstationArray, setPowerstationArray] = useState([]);
  const [powerstationArrayFormer, setPowerstationArrayFormer] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    alldesignation,
    allTeam,
    allUsersData,
    pageName,
    setPageName,
    buttonStyles,
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
  const { auth } = useContext(AuthContext);
  const [statusCheck, setStatusCheck] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteHoliday, setDeleteHoliday] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    fromcompany: true,
    frombranch: true,
    fromunit: true,
    fromteam: true,
    tocompany: true,
    tobranch: true,
    tounit: true,
    toteam: true,
    employee: true,
    type: true,
    designation: true,
    round: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isAddOpenalert, setIsAddOpenalert] = useState(false);
  const [isClearOpenalert, setIsClearOpenalert] = useState(false);
  const [isUpdateOpenalert, setIsUpdateOpenalert] = useState(false);
  const [isBulkDeleteOpenalert, seBulktIsDeletealert] = useState(false);
  //useEffect

  const typeOpt = [
    { value: "Interviewer", label: "Interviewer" },
    { value: "Hiring Manager", label: "Hiring Manager" },
    { value: "Issuing Authority", label: "Issuing Authority" },
  ];

  const handleEmployeeChange = (options) => {
    setEmpValue(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmployeeOpt(options);
  };
  const customValueRendererCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee";
  };

  const customValueRendererEditCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee";
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnDisable(false);
    setStatusCheck(false);
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
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
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
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteHoliday(res?.data?.sassigninterviewer);
      handleClickOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Alert delete popup
  let powerstationid = deleteHoliday._id;
  const delPowerstation = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(
        `${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${powerstationid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setSelectedRows([]);
      setPage(1);
      setFilteredChanges(null)
      setFilteredRowData([]);
      await fetchPowerstationAll();
      await fetchPowerstationAllFormer();

    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchAssignedInterviewEditAll = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(
        SERVICE.ASSIGNINTERVIEWERS,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      return res_status?.data?.assigninterview.filter(
        (item) => item._id !== assignInterviewerEdit._id
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

  //add function
  const sendRequest = async () => {
    let fromCompanyName = selectedOptionsCompanyAdd.map((data) => data.value);
    let fromBranchName = selectedOptionsBranchAdd.map((data) => data.value);
    let fromUnitName = selectedOptionsUnitAdd.map((data) => data.value);
    let fromTeamName = selectedOptionsTeamAdd.map((data) => data.value);
    let round = selectedOptionsRoundAdd.map((data) => data.value);
    setPageName(!pageName);
    try {
      await axios.post(SERVICE.ASSIGNINTERVIEWER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        fromcompany: fromCompanyName,
        frombranch: fromBranchName,
        fromunit: fromUnitName,
        fromteam: fromTeamName,
        tocompany: String(assignInterviewerState.company),
        tobranch: String(assignInterviewerState.branch),
        tounit: String(assignInterviewerState.unit),
        toteam: String(assignInterviewerState.team),
        type: String(assignInterviewerState.type),
        designation: String(
          assignInterviewerState.type === "Interviewer"
            ? assignInterviewerState.designation
            : ""
        ),
        round: assignInterviewerState.type === "Interviewer" ? round : [],
        employee: empValue,
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setTimeout(() => {
        setBtnDisable(false);
      }, 1000);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([]);
      await fetchPowerstationAll();
      await fetchPowerstationAllFormer();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //submit option for saving
  const handleSubmit = async (e) => {
    setBtnDisable(true);
    e.preventDefault();
    let fromCompanyName = selectedOptionsCompanyAdd.map((data) => data.value);
    let fromBranchName = selectedOptionsBranchAdd.map((data) => data.value);
    let fromUnitName = selectedOptionsUnitAdd.map((data) => data.value);
    let fromTeamName = selectedOptionsTeamAdd.map((data) => data.value);
    let round = selectedOptionsRoundAdd.map((data) => data.value);

    const employeExits = empValue.map((c) => c);
    const isNameMatch = powerstationArray?.some(
      (item) =>
        item.tocompany?.toLowerCase() ==
        assignInterviewerState.company?.toLowerCase() &&
        item.tobranch == assignInterviewerState.branch &&
        item.tounit == assignInterviewerState.unit &&
        item.type == assignInterviewerState.type &&
        item.employeeArray?.some((data) => employeExits.includes(data)) &&
        item.toteam == assignInterviewerState.team &&
        item.fromcompanyArray?.some((item) => fromCompanyName.includes(item)) &&
        item.frombranchArray?.some((item) => fromBranchName.includes(item)) &&
        item.fromunitArray?.some((item) => fromUnitName.includes(item)) &&
        (assignInterviewerState.type !== "Interviewer" ||
          (item?.designation == assignInterviewerState?.designation &&
            item?.roundArray?.some((item) => round.includes(item)))) &&
        (assignInterviewerState.type !== "Hiring Manager" ||
          item.fromteamArray?.some((item) => fromTeamName.includes(item)))
    );
    if (selectedOptionsCompanyAdd.length === 0) {
      setPopupContentMalert("Please Select From Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsBranchAdd.length === 0) {
      setPopupContentMalert("Please Select From Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsUnitAdd.length === 0) {
      setPopupContentMalert("Please Select From Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerState.type === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      assignInterviewerState.type === "Interviewer" &&
      assignInterviewerState.designation === "Please Select Designation"
    ) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      assignInterviewerState.type === "Interviewer" &&
      selectedOptionsRoundAdd.length === 0
    ) {
      setPopupContentMalert("Please Select Round!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (assignInterviewerState.type === "Hiring Manager" ||
        assignInterviewerState.type === "Issuing Authority") &&
      selectedOptionsTeamAdd.length === 0
    ) {
      setPopupContentMalert("Please Select From Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerState.company === "Please Select Company") {
      setPopupContentMalert("Please Select To Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerState.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select To Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerState.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select To Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerState.team === "Please Select Team") {
      setPopupContentMalert("Please Select To Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (empValue.length === 0) {
      setPopupContentMalert("Please Select Employee!");
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
  const handleclear = (e) => {
    e.preventDefault();
    setAssignInterviewerState({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      type: "Interviewer",
      employee: "Please Select Employee",
      designation: "Please Select Designation",
    });
    setEmpValue([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
    setSelectedEmployeeOpt([]);
    setSelectedOptionsCompanyAdd([]);
    setSelectedOptionsBranchAdd([]);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsTeamAdd([]);
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
    setEditId(e);
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignInterviewerEdit(res?.data?.sassigninterviewer);
      setSelectedOptionsEdit([
        ...res?.data?.sassigninterviewer?.employee.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setEmployeeEdit(res?.data?.sassigninterviewer?.employee);

      setSelectedOptionsRoundAddEdit(
        res?.data?.sassigninterviewer?.round.map((data) => {
          return { label: data, value: data };
        })
      );
      setSelectedOptionsCompanyAddEdit(
        res?.data?.sassigninterviewer?.fromcompany.map((data) => {
          return { label: data, value: data };
        })
      );
      setSelectedOptionsBranchAddEdit(
        res?.data?.sassigninterviewer?.frombranch.map((data) => {
          return { label: data, value: data };
        })
      );
      setSelectedOptionsUnitAddEdit(
        res?.data?.sassigninterviewer?.fromunit.map((data) => {
          return { label: data, value: data };
        })
      );
      setSelectedOptionsTeamAddEdit(
        res?.data?.sassigninterviewer?.fromteam.map((data) => {
          return { label: data, value: data };
        })
      );
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignInterviewerEdit(res?.data?.sassigninterviewer);
      handleClickOpenview();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignInterviewerEdit(res?.data?.sassigninterviewer);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // updateby edit page...
  let updateby = assignInterviewerEdit?.updatedby;

  let addedby = assignInterviewerEdit?.addedby;
  let powerstationId = assignInterviewerEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    let fromCompanyName = selectedOptionsCompanyAddEdit.map(
      (data) => data.value
    );
    let fromBranchName = selectedOptionsBranchAddEdit.map((data) => data.value);
    let fromUnitName = selectedOptionsUnitAddEdit.map((data) => data.value);
    let fromTeamName = selectedOptionsTeamAddEdit.map((data) => data.value);
    let round = selectedOptionsRoundAddEdit.map((data) => data.value);
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${powerstationId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          fromcompany: fromCompanyName,
          frombranch: fromBranchName,
          fromunit: fromUnitName,
          fromteam: fromTeamName,
          tocompany: String(assignInterviewerEdit.tocompany),
          tobranch: String(assignInterviewerEdit.tobranch),
          tounit: String(assignInterviewerEdit.tounit),
          toteam: String(assignInterviewerEdit.toteam),
          type: String(assignInterviewerEdit.type),
          designation: String(
            assignInterviewerEdit.type === "Interviewer"
              ? assignInterviewerEdit.designation
              : ""
          ),
          round: assignInterviewerEdit.type === "Interviewer" ? round : [],
          employee: employeEdit,
          updatedby: [
            ...updateby,
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );

      await fetchPowerstationAll();
      await fetchPowerstationAllFormer();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModEdit();
      setFilteredChanges(null)
      setFilteredRowData([]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchAssignedInterviewEditAll();
    let fromCompanyName = selectedOptionsCompanyAddEdit.map(
      (data) => data.value
    );
    let fromBranchName = selectedOptionsBranchAddEdit.map((data) => data.value);
    let fromUnitName = selectedOptionsUnitAddEdit.map((data) => data.value);
    let fromTeamName = selectedOptionsTeamAddEdit.map((data) => data.value);
    let round = selectedOptionsRoundAddEdit.map((data) => data.value);
    const employeExitsEdit = employeEdit.map((c) => c);
    const isNameMatch = resdata?.some(
      (item) =>
        item.tocompany?.toLowerCase() ==
        assignInterviewerEdit.tocompany?.toLowerCase() &&
        item.tobranch == assignInterviewerEdit.tobranch &&
        item.tounit == assignInterviewerEdit.tounit &&
        item.type == assignInterviewerEdit.type &&
        item.employeeArray?.some((data) => employeExitsEdit.includes(data)) &&
        item.toteam == assignInterviewerEdit.toteam &&
        item.fromcompanyArray?.some((item) => fromCompanyName.includes(item)) &&
        item.frombranchArray?.some((item) => fromBranchName.includes(item)) &&
        item.fromunitArray?.some((item) => fromUnitName.includes(item)) &&
        (assignInterviewerEdit.type !== "Interviewer" ||
          (item?.designation == assignInterviewerEdit?.designation &&
            item?.roundArray?.some((item) => round.includes(item)))) &&
        (assignInterviewerEdit.type !== "Hiring Manager" ||
          item.fromteamArray?.some((item) => fromTeamName.includes(item)))
    );
    if (selectedOptionsCompanyAddEdit.length === 0) {
      setPopupContentMalert("Please Select From Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsBranchAddEdit.length === 0) {
      setPopupContentMalert("Please Select From Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsUnitAddEdit.length === 0) {
      setPopupContentMalert("Please Select From Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerEdit.type === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      assignInterviewerEdit.type === "Interviewer" &&
      (assignInterviewerEdit.designation === "Please Select Designation" ||
        assignInterviewerEdit.designation === "" ||
        assignInterviewerEdit.designation === undefined)
    ) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      assignInterviewerEdit.type === "Interviewer" &&
      selectedOptionsRoundAddEdit.length === 0
    ) {
      setPopupContentMalert("Please Select Round!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (assignInterviewerEdit.type === "Hiring Manager" ||
        assignInterviewerEdit.type === "Issuing Authority") &&
      selectedOptionsTeamAddEdit.length === 0
    ) {
      setPopupContentMalert("Please Select From Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerEdit.tocompany === "Please Choose Company") {
      setPopupContentMalert("Please Select To Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerEdit.tobranch === "Please Select Branch") {
      setPopupContentMalert("Please Select To Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerEdit.tounit === "Please Select Unit") {
      setPopupContentMalert("Please Select To Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignInterviewerEdit.toteam === "Please Select Team") {
      setPopupContentMalert("Please Select To Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEdit.length <= 0) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  // get all data.
  const fetchPowerstationAll = async () => {
    setStatusCheck(true);
    setPageName(!pageName);
    try {

      const [res_status, response] = await Promise.all([
        axios.post(
          SERVICE.ASSIGNINTERVIEWERS,
          {
            assignbranch: accessbranch,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),
        axios.get(SERVICE.FORMERUSERS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      let formerUserArray = response?.data?.formerusers?.map(
        (data) => data?.companyname
      );


      const itemsWithSerialNumber = res_status?.data?.assigninterview
        ?.map((item) => ({
          ...item,
          employee: item?.employee?.filter((name) => !formerUserArray.includes(name)),
        }))
        ?.filter((item) => item.employee.length > 0)
        ?.map((item, index) => ({
          ...item,
          id: item?._id,
          serialNumber: index + 1,
          fromcompany: item.fromcompany.join(","),
          frombranch: item.frombranch.join(","),
          fromunit: item.fromunit.join(","),
          fromteam: item.fromteam.join(","),
          fromcompanyArray: item.fromcompany,
          frombranchArray: item.frombranch,
          fromunitArray: item.fromunit,
          fromteamArray: item.fromteam,
          tocompany: item.tocompany,
          tobranch: item.tobranch,
          tounit: item.tounit,
          toteam: item.toteam,
          type: item.type,
          designation: item?.designation,
          round: item?.round.join(","),
          roundArray: item?.round,
          employee: item.employee
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          employeeArray: item.employee,
        }));
      setPowerstationArray(itemsWithSerialNumber);
      setStatusCheck(false);
    } catch (err) {
      setStatusCheck(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchPowerstationAllFormer = async () => {
    setPageName(!pageName);
    try {
      const [res_status, response] = await Promise.all([
        axios.post(
          SERVICE.ASSIGNINTERVIEWERS,
          {
            assignbranch: accessbranch,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),
        axios.get(SERVICE.FORMERUSERS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      let formerUserArray = response?.data?.formerusers?.map(
        (data) => data?.companyname
      );
      console.log(formerUserArray, "formerUserArray")
      setFormerUsers(formerUserArray);

      let filteredData = res_status?.data?.assigninterview
        ?.filter((item) =>
          item?.employee?.some((name) => formerUserArray.includes(name))
        )
        ?.map((item, index) => ({
          ...item,
          id: item?._id,
          serialNumber: index + 1,
          employee: item?.employee?.filter((name) =>
            formerUserArray.includes(name)
          )?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          fromcompany: item.fromcompany.join(","),
          frombranch: item.frombranch.join(","),
          fromunit: item.fromunit.join(","),
          fromteam: item.fromteam.join(","),
          round: item?.round.join(","),
        }));




      setPowerstationArrayFormer(filteredData);
    } catch (err) {
      setStatusCheck(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //image

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assigninterviewer.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  // Excel
  const fileName = "Assigninterviewer";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assign Interviewer",
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

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },

    {
      field: "fromcompany",
      headerName: "From Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.fromcompany,
      headerClassName: "bold-header",
    },
    {
      field: "frombranch",
      headerName: "From Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.frombranch,
      headerClassName: "bold-header",
    },
    {
      field: "fromunit",
      headerName: "From Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.fromunit,
      headerClassName: "bold-header",
    },
    {
      field: "fromteam",
      headerName: "From Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.fromteam,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 120,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 120,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "round",
      headerName: "Round",
      flex: 0,
      width: 150,
      hide: !columnVisibility.round,
      headerClassName: "bold-header",
    },

    {
      field: "tocompany",
      headerName: "To Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.tocompany,
      headerClassName: "bold-header",
    },
    {
      field: "tobranch",
      headerName: "To Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.tobranch,
      headerClassName: "bold-header",
    },
    {
      field: "tounit",
      headerName: "To Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.tounit,
      headerClassName: "bold-header",
    },
    {
      field: "toteam",
      headerName: "To Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.toteam,
      headerClassName: "bold-header",
    },

    {
      field: "employee",
      headerName: "Employee",
      flex: 0,
      width: 200,
      hide: !columnVisibility.employee,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      //lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eassigninterviewer") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassigninterviewer") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassigninterviewer") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassigninterviewer") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const [formerUsers, setFormerUsers] = useState([]);



  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      fromcompany: item.fromcompany,
      frombranch: item.frombranch,
      fromunit: item.fromunit,
      fromteam: item.fromteam,
      tocompany: item.tocompany,
      tobranch: item.tobranch,
      tounit: item.tounit,
      toteam: item.toteam,
      type: item.type,
      designation: item?.designation,
      round: item?.round,
      employee: item.employee,
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

  useEffect(() => {
    fetchPowerstationAll();
    fetchPowerstationAllFormer();
    fetchInterviewgrouping();
  }, []);

  useEffect(() => {
    addSerialNumber(powerstationArray);
  }, [powerstationArray]);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const delAccountcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setIsBulkDeleteOpenAl(true);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setFilteredChanges(null)
      setFilteredRowData([]);
      await fetchPowerstationAllFormer();
      await fetchPowerstationAll();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const bulkdeletefunction = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setFilteredChanges(null)
      setFilteredRowData([]);
      await fetchPowerstationAll();
      await fetchPowerstationAllFormer();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  return (
    <Box>
      <Headtitle title={"Assign Interviewer"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Assign Interviewer"
        modulename="Interview"
        submodulename="Interview Setup"
        mainpagename="Assign Interviewer"
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("aassigninterviewer") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} variant="h6">
                    From Assign Interviewer
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
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
                      value={selectedOptionsCompanyAdd}
                      onChange={handleCompanyChangeAdd}
                      valueRenderer={customValueRendererCompanyAdd}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={accessbranch
                        ?.filter((comp) =>
                          selectedOptionsCompanyAdd
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
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsBranchAdd}
                      onChange={handleBranchChangeAdd}
                      valueRenderer={customValueRendererBranchAdd}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            selectedOptionsCompanyAdd
                              .map((data) => data.value)
                              .includes(comp.company) &&
                            selectedOptionsBranchAdd
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
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsUnitAdd}
                      onChange={handleUnitChangeAdd}
                      valueRenderer={customValueRendererUnitAdd}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={typeOpt}
                      // placeholder="New"
                      value={{
                        label: assignInterviewerState.type,
                        value: assignInterviewerState.type,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          type: e.value,
                          designation: "Please Select Designation",
                        });
                        setSelectedOptionsRoundAdd([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                {assignInterviewerState?.type === "Interviewer" ? (
                  <>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Designation<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={alldesignation
                            ?.map((data) => ({
                              label: data.name,
                              value: data.name,
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
                          value={{
                            label: assignInterviewerState.designation,
                            value: assignInterviewerState.designation,
                          }}
                          onChange={(e) => {
                            setAssignInterviewerState({
                              ...assignInterviewerState,
                              designation: e.value,
                            });
                            setSelectedOptionsRoundAdd([]);
                            setSelectedOptionsTeamAdd([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Round<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={Array.from(
                            new Set(
                              round
                                ?.filter(
                                  (item) =>
                                    item.designation ===
                                    assignInterviewerState?.designation
                                )
                                .map((item) => item.round)
                            )
                          ).map((roundValue) => ({
                            label: roundValue,
                            value: roundValue,
                          }))}
                          value={selectedOptionsRoundAdd}
                          onChange={handleRoundChangeAdd}
                          valueRenderer={customValueRendererRoundAdd}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={allTeam
                          ?.filter(
                            (comp) =>
                              selectedOptionsCompanyAdd
                                .map((data) => data.value)
                                .includes(comp.company) &&
                              selectedOptionsBranchAdd
                                .map((data) => data.value)
                                .includes(comp.branch) &&
                              selectedOptionsUnitAdd
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
                        value={selectedOptionsTeamAdd}
                        onChange={handleTeamChangeAdd}
                        valueRenderer={customValueRendererTeamAdd}
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              <br />
              <br />

              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} variant="h6">
                    To Assign Interviewer
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
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
                      value={{
                        label: assignInterviewerState.company,
                        value: assignInterviewerState.company,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                        });
                        setSelectedEmployeeOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            assignInterviewerState.company === comp.company
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
                      // placeholder="New"
                      value={{
                        label: assignInterviewerState.branch,
                        value: assignInterviewerState.branch,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                        });
                        setSelectedEmployeeOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            assignInterviewerState.company === comp.company &&
                            assignInterviewerState.branch === comp.branch
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
                      // placeholder="New"
                      value={{
                        label: assignInterviewerState.unit,
                        value: assignInterviewerState.unit,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          unit: e.value,
                          team: "Please Select Team",
                        });
                        setSelectedEmployeeOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            assignInterviewerState.company === comp.company &&
                            assignInterviewerState.branch === comp.branch &&
                            assignInterviewerState.unit === comp.unit
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
                      value={{
                        label: assignInterviewerState.team,
                        value: assignInterviewerState.team,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          team: e.value,
                        });
                        setSelectedEmployeeOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter(
                          (u) =>
                            assignInterviewerState.company === u.company &&
                            assignInterviewerState.branch === u.branch &&
                            assignInterviewerState.unit === u.unit &&
                            assignInterviewerState.team === u.team
                        )
                        .map((u) => ({
                          ...u,
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      value={selectedEmployeeOpt}
                      onChange={handleEmployeeChange}
                      valueRenderer={customValueRendererCompanyFrom}
                      labelledBy="Please Select Participants"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  {isUserRoleCompare?.includes("aassigninterviewer") && (
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      loading={btnDisable}
                      onClick={handleSubmit}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Submit
                    </LoadingButton>
                  )}
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
        <br />
      </>

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lassigninterviewer") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Assign Interviewer
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
                    <MenuItem value={powerstationArray?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("csvassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("printassigninterviewer") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("imageassigninterviewer") && (
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
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={powerstationArray}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={powerstationArray}
                />
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
            {isUserRoleCompare?.includes("bdassigninterviewer") && (
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
            {statusCheck ? (
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
                // totalDatas={totalProjects}
                searchQuery={searchQuery}
                handleShowAllColumns={handleShowAllColumns}
                setFilteredRowData={setFilteredRowData}
                filteredRowData={filteredRowData}
                setFilteredChanges={setFilteredChanges}
                filteredChanges={filteredChanges}
                gridRefTableImg={gridRefTableImg}
                itemsList={powerstationArray}
              />
            )}
            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      <br />
      <ActionEmployeeAssignInterviewer powerstationArrayFormer={powerstationArrayFormer} />
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
        itemsTwo={powerstationArray ?? []}
        filename={"Assign Interviewer"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Assign Interviewer Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delPowerstation}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delAccountcheckbox}
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
      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleClickOpenerr}
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
              sx={buttonStyles.buttonsubmit}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "50px" }}
      >
        <Box sx={{ padding: "30px 50px", marginTop: "30px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Assign Interviewer
            </Typography>
            <br />
            <br />
            <Typography sx={userStyle.HeaderText}>
              {" "}
              From Assign Interviewer
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Company</Typography>
                  <Typography>
                    {assignInterviewerEdit.fromcompany
                      ? assignInterviewerEdit.fromcompany.join(",")
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Branch</Typography>
                  <Typography>
                    {assignInterviewerEdit.frombranch
                      ? assignInterviewerEdit.frombranch.join(",")
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Unit</Typography>
                  <Typography>
                    {assignInterviewerEdit.fromunit
                      ? assignInterviewerEdit.fromunit.join(",")
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{assignInterviewerEdit.type}</Typography>
                </FormControl>
              </Grid>
              {assignInterviewerEdit?.type === "Interviewer" ? (
                <>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Designation</Typography>
                      <Typography>
                        {assignInterviewerEdit.designation}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Round</Typography>

                      <Typography>
                        {assignInterviewerEdit?.round
                          ? assignInterviewerEdit?.round?.join(",")
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">From Team</Typography>
                    <Typography>
                      {assignInterviewerEdit.fromteam
                        ? assignInterviewerEdit.fromteam.join(",")
                        : ""}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <br /> <br />
            <Typography sx={userStyle.HeaderText}>
              {" "}
              To Assign Interviewer
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Company</Typography>
                  <Typography>{assignInterviewerEdit.tocompany}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Branch</Typography>
                  <Typography>{assignInterviewerEdit.tobranch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Unit</Typography>
                  <Typography>{assignInterviewerEdit.tounit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Team</Typography>
                  <Typography>{assignInterviewerEdit.toteam}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee</Typography>
                  <Typography>
                    {Array.isArray(assignInterviewerEdit?.employee)
                      ? assignInterviewerEdit.employee
                        .filter((name) => !formerUsers.includes(name))
                        .join(",")
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
                sx={buttonStyles.btncancel}
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
          // sx={{
          //   overflow: "scroll",
          //   "& .MuiPaper-root": {
          //     overflow: "scroll",
          //   },
          // }}
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{ marginTop: "50px" }}
          fullWidth={true}
        >
          <Box sx={{ padding: "30px 50px", marginTop: "30px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Assign Interviewer
                </Typography>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  From Assign Interviewer
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
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
                      value={selectedOptionsCompanyAddEdit}
                      onChange={handleCompanyChangeAddEdit}
                      valueRenderer={customValueRendererCompanyAddEdit}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={accessbranch
                        ?.filter((comp) =>
                          selectedOptionsCompanyAddEdit
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
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsBranchAddEdit}
                      onChange={handleBranchChangeAddEdit}
                      valueRenderer={customValueRendererBranchAddEdit}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            selectedOptionsCompanyAddEdit
                              .map((data) => data.value)
                              .includes(comp.company) &&
                            selectedOptionsBranchAddEdit
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
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsUnitAddEdit}
                      onChange={handleUnitChangeAddEdit}
                      valueRenderer={customValueRendererUnitAddEdit}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={typeOpt}
                      // placeholder="New"
                      value={{
                        label: assignInterviewerEdit.type,
                        value: assignInterviewerEdit.type,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerEdit({
                          ...assignInterviewerEdit,
                          type: e.value,
                          designation: "Please Select Designation",
                        });
                        setSelectedOptionsRoundAddEdit([]);
                        setSelectedOptionsTeamAddEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                {assignInterviewerEdit?.type === "Interviewer" ? (
                  <>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Designation<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={alldesignation
                            ?.map((data) => ({
                              label: data.name,
                              value: data.name,
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
                          value={{
                            label:
                              assignInterviewerEdit?.designation === "" ||
                                assignInterviewerEdit?.designation === undefined
                                ? "Please Select Designation"
                                : assignInterviewerEdit.designation,
                            value:
                              assignInterviewerEdit?.designation === "" ||
                                assignInterviewerEdit?.designation === undefined
                                ? "Please Select Designation"
                                : assignInterviewerEdit?.designation,
                          }}
                          onChange={(e) => {
                            setAssignInterviewerEdit({
                              ...assignInterviewerEdit,
                              designation: e.value,
                            });
                            setSelectedOptionsRoundAddEdit([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Round<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={Array.from(
                            new Set(
                              round
                                ?.filter(
                                  (item) =>
                                    item.designation ===
                                    assignInterviewerEdit?.designation
                                )
                                .map((item) => item.round)
                            )
                          ).map((roundValue) => ({
                            label: roundValue,
                            value: roundValue,
                          }))}
                          value={selectedOptionsRoundAddEdit}
                          onChange={handleRoundChangeAddEdit}
                          valueRenderer={customValueRendererRoundAddEdit}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={allTeam
                          ?.filter(
                            (comp) =>
                              selectedOptionsCompanyAddEdit
                                .map((data) => data.value)
                                .includes(comp.company) &&
                              selectedOptionsBranchAddEdit
                                .map((data) => data.value)
                                .includes(comp.branch) &&
                              selectedOptionsUnitAddEdit
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
                        value={selectedOptionsTeamAddEdit}
                        onChange={handleTeamChangeAddEdit}
                        valueRenderer={customValueRendererTeamAddEdit}
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  To Assign Interviewer
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
                      value={{
                        label: assignInterviewerEdit.tocompany,
                        value: assignInterviewerEdit.tocompany,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerEdit({
                          ...assignInterviewerEdit,
                          tocompany: e.value,
                          tobranch: "Please Select Branch",
                          tounit: "Please Select Unit",
                          toteam: "Please Select Team",
                        });
                        setSelectedOptionsEdit([]);
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
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            assignInterviewerEdit.tocompany === comp.company
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
                      styles={colourStyles}
                      value={{
                        label: assignInterviewerEdit.tobranch,
                        value: assignInterviewerEdit.tobranch,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerEdit({
                          ...assignInterviewerEdit,
                          tobranch: e.value,
                          tounit: "Please Select Unit",
                          toteam: "Please Select Team",
                        });
                        setSelectedOptionsEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            assignInterviewerEdit.tocompany === comp.company &&
                            assignInterviewerEdit.tobranch === comp.branch
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
                      styles={colourStyles}
                      value={{
                        label: assignInterviewerEdit.tounit,
                        value: assignInterviewerEdit.tounit,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerEdit((prev) => ({
                          ...assignInterviewerEdit,
                          tounit: e.value,
                          toteam: "Please Select Team",
                        }));
                        setSelectedOptionsEdit([]);
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
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            assignInterviewerEdit.tocompany === comp.company &&
                            assignInterviewerEdit.tobranch === comp.branch &&
                            assignInterviewerEdit.tounit === comp.unit
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
                      value={{
                        label: assignInterviewerEdit.toteam,
                        value: assignInterviewerEdit.toteam,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerEdit({
                          ...assignInterviewerEdit,
                          toteam: e.value,
                        });
                        setSelectedOptionsEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter(
                          (u) =>
                            assignInterviewerEdit.tocompany === u.company &&
                            assignInterviewerEdit.tobranch === u.branch &&
                            assignInterviewerEdit.tounit === u.unit &&
                            assignInterviewerEdit.toteam === u.team
                        )
                        .map((u) => ({
                          ...u,
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      value={selectedOptionsEdit}
                      onChange={handleCategoryEditChange}
                      valueRenderer={customValueRendererEditCompanyFrom}
                      labelledBy="Please Select Participants"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
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
    </Box>
  );
}
export default Assigninterviewer;
