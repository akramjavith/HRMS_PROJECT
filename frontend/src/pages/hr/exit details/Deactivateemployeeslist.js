import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
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
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiInput from "@mui/material/Input";
import Popover from "@mui/material/Popover";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/system";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Resizable from "react-resizable";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import Webcamimage from "../webcamprofile";
import CheckListTable from "./ChecklistTable";

import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as FileSaver from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import Headtitle from "../../../components/Headtitle";

import BlockIcon from "@mui/icons-material/Block"; // For Terminate
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"; // For Absconded
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // For Releave Employee
import InfoIcon from "@mui/icons-material/Info";
import PauseIcon from "@mui/icons-material/Pause"; // For Hold
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

import { LoadingButton } from "@mui/lab";
import Backdrop from '@mui/material/Backdrop';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import domtoimage from 'dom-to-image';
import { MultiSelect } from "react-multi-select-component";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";

const Loader = ({ loading, message }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
      <div style={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#edf1f7' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};


const Input = styled(MuiInput)(({ theme }) => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none !important",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

function Deactivateemployeeslist() {
  let exportColumnNames = ["File Name", "Created Date & Time"];
  let exportRowValues = ["filename", "date"];
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setIsBoarding(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };


  const [manager, setManger] = useState(false);
  const [deletebtn, setDeleteBtn] = useState(false);
  const [deletebtnDisable, setDeleteBtnDisable] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');

  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [isTable, setIsTable] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleCloseTable = () => {
    setIsTable(false);
  };
  const handleOpenTable = (userId) => {
    setSelectedUserId(userId);
    setIsTable(true);
  };

  const [employees, setEmployees] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [replaceName, setReplaceName] = useState("Please Choose Replace name");
  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const [reason, setReason] = useState({ date: formattedDate, reasonname: "" });
  const [lastWorkday, setLastworkday] = useState({});

  const handleClearreason = () => {
    setReason({ date: formattedDate, reasonname: "" });
    setLastworkday({})
  };

  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
    allUsersData, allTeam, } = useContext(
      UserRoleAccessContext
    );


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
          data?.subsubpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0
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
      pagename: String("Deactivate Employee List"),
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


  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [notEmployees, setNotEmployees] = useState([]);
  const fetchDepartments = async () => {
    try {
      const [req] = await Promise.all([
        axios.get(SERVICE.DEPARTMENT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ])

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
  useEffect(() => {
    fetchDepartments();
  }, []);

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
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);


  const handleFilter = () => {
    setIsBoarding(false);
    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSearchQuery("");
      fetchHandler();
    }
  };

  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.ALLNOTINEMPLOYEES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      })
      setNotEmployees(res?.data?.allinterns)
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
      //----------------------------
      let mappedemployees = res?.data?.allinterns
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

      let employees = res?.data?.allinterns
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
        )
        .map((u) => u.companyname);
      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      //-----------------
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

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
    setEmployees([]);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
    setSearchQuery("")
  };


  const fetchHandler = async () => {

    setPageName(!pageName)
    try {
      const matchCriteria = {
        $and: [
          // Enquiry status filter
          {
            resonablestatus: { $in: ['Releave Employee', 'Absconded', 'Hold', 'Terminate'] }
          },
          {
            workmode: { $ne: "Internship" }
          },

          // Conditional company filter
          ...(valueCompanyCat.length > 0
            ? [{ company: { $in: valueCompanyCat } }]
            : [{ company: { $in: allAssignCompany } }]),

          // Conditional branch filter
          ...(valueBranchCat.length > 0
            ? [{ branch: { $in: valueBranchCat } }]
            : [{ branch: { $in: allAssignBranch } }]),

          // Conditional unit filter
          ...(valueUnitCat.length > 0
            ? [{ unit: { $in: valueUnitCat } }]
            : [{ unit: { $in: allAssignUnit } }]),

          // Conditional team filter
          ...(valueTeamCat.length > 0
            ? [{ team: { $in: valueTeamCat } }]
            : []),

          // Conditional department filter
          ...(valueDepartmentCat.length > 0
            ? [{ department: { $in: valueDepartmentCat } }]
            : []),

          // Conditional Employee filter
          ...(valueEmployeeCat.length > 0
            ? [{ companyname: { $in: valueEmployeeCat } }]
            : []),
        ]
      };



      let res = await axios.post(
        `${SERVICE.MYCHECKLISTVIEW}`, {
        companyname: isUserRoleAccess?.companyname,
        role: isUserRoleAccess?.role,
        modulename: "Human Resources",
        submodule: "HR",
        mainpage: "Employee",
        subpage: "Employee Action Details",
        subsubpage: "Deactivate Employees List",
        aggregationPipeline: matchCriteria
      },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        }
      );


      setEmployees(res?.data?.configuredUsers);
      setThisPageDatas(res?.data?.toViewDatas);
      setIsBoarding(true);


    } catch (err) {
      console.log(err);
      setIsBoarding(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);
  const [getrowid, setRowGetid] = useState([]);

  const [empaddform, setEmpaddform] = useState({});

  const [isBoarding, setIsBoarding] = useState(true);

  // popover content
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //    popup for releaving
  const [openviewReleave, setOpenviewReleave] = useState(false);
  const handleClickOpenviewReleave = () => {
    setOpenviewReleave(true);
    handleCloseManageColumns();
  };

  const handleCloseviewReleave = () => {
    setOpenviewReleave(false);
  };

  const [statusemployee, setstatusemployee] = useState("");

  const [hierarchyDeleteData, setHierarchyDeleteData] = useState([]);
  const [hierarchyDeleteEmployee, setHierarchyDeleteEmployee] = useState([]);

  const username = isUserRoleAccess.username;

  const [isEditOpenCheckList, setIsEditOpenCheckList] = useState(false);
  const handleClickOpenEditCheckList = () => {
    setIsEditOpenCheckList(true);
  };
  const handleCloseModEditCheckList = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenCheckList(false);
  };

  const renderStatus = (status) => {
    const iconProps = {
      size: "small",
      style: { marginRight: 4 },
    };

    let icon = <InfoIcon {...iconProps} />;
    let color = "#ccc"; // Default color

    switch (status) {
      case "Releave Employee":
        icon = <ExitToAppIcon {...iconProps} />;
        color = "#8bc34a"; // Light Green
        break;
      case "Absconded":
        icon = <DirectionsRunIcon {...iconProps} />;
        color = "#ff5722"; // Deep Orange
        break;
      case "Hold":
        icon = <PauseIcon {...iconProps} />;
        color = "#ff9800"; // light orange
        break;
      case "Terminate":
        icon = <BlockIcon {...iconProps} />;
        color = "#f44336"; // Red
        break;
      default:
        icon = <InfoIcon {...iconProps} />;
        color = "#ccc"; // Default color
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
          <Typography variant="body2" noWrap>
            {status}
          </Typography>
        </Button>
      </Tooltip>
    );
  };

  const [isCheckedList, setIsCheckedList] = useState([]);
  const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
  const overallCheckListChange = () => {
    let newArrayChecked = isCheckedList.map(
      (item) => (item = !isCheckedListOverall)
    );

    if (groupDetails) {
      let returnOverall = groupDetails?.map((row) => {
        {
          if (row.checklist === "DateTime") {
            if (
              ((row.data !== undefined && row.data !== "") ||
                row.files !== undefined) &&
              row.data.length === 16
            ) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === "Date Multi Span") {
            if (
              ((row.data !== undefined && row.data !== "") ||
                row.files !== undefined) &&
              row.data.length === 21
            ) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === "Date Multi Span Time") {
            if (
              ((row.data !== undefined && row.data !== "") ||
                row.files !== undefined) &&
              row.data.length === 33
            ) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === "Date Multi Random Time") {
            if (
              ((row.data !== undefined && row.data !== "") ||
                row.files !== undefined) &&
              row.data.length === 16
            ) {
              return true;
            } else {
              return false;
            }
          } else if (
            (row.data !== undefined && row.data !== "") ||
            row.files !== undefined
          ) {
            return true;
          } else {
            return false;
          }
        }
      });

      let allcondition = returnOverall?.every((item) => item == true);

      if (allcondition) {
        setIsCheckedList(newArrayChecked);
        setIsCheckedListOverall(!isCheckedListOverall);
      } else {
        setPopupContentMalert('Please Fill all the Fields');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } else {
      setPopupContentMalert('Please Add Check List');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };
  const handleCheckboxChange = (index) => {
    let currentItem = groupDetails[index];

    let data = () => {
      if (currentItem.checklist === "DateTime") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 16
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Span") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 21
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Span Time") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 33
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Random Time") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 16
        ) {
          return true;
        } else {
          return false;
        }
      } else if (
        (currentItem.data !== undefined && currentItem.data !== "") ||
        currentItem.files !== undefined
      ) {
        return true;
      } else {
        return false;
      }
    };
    let statusFor = data();

    if (statusFor) {
      const newCheckedState = [...isCheckedList];
      newCheckedState[index] = !newCheckedState[index];
      setIsCheckedList(newCheckedState);
      handleDataChange(newCheckedState[index], index, "Check Box");
      let overallChecked = newCheckedState.every((item) => item === true);

      if (overallChecked) {
        setIsCheckedListOverall(true);
      } else {
        setIsCheckedListOverall(false);
      }
    } else {
      setPopupContentMalert('Please Fill the Field');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };

  let name = "create";

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);

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

  const deleteChecklist = async () => {
    setDeleteBtn(true);
    const searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid === postID &&
        item.module === "Human Resources" &&
        item.submodule === "HR" &&
        item.mainpage === "Employee" &&
        item.subpage === "Employee Action Details" &&
        item.subsubpage === "Deactivate Employees List"
    );
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.MYCHECKLIST_SINGLE}/${searchItem?._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseviewReleave();
      setDeleteBtn(false);
      setDeleteBtnDisable(true);
      setIsCheckedListOverall(false);
    } catch (err) {
      setDeleteBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeleteEdit = (index) => {
    let getData = groupDetails[index];
    delete getData.files;
    let finalData = getData;

    let updatedTodos = [...groupDetails];
    updatedTodos[index] = finalData;
    setGroupDetails(updatedTodos);
  };

  const [assignDetails, setAssignDetails] = useState();
  const [groupDetails, setGroupDetails] = useState();
  const [datasAvailedDB, setDatasAvailedDB] = useState();
  const [disableInput, setDisableInput] = useState([]);
  const [getDetails, setGetDetails] = useState();

  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);

  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);

  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
  const [postID, setPostID] = useState();
  const [pagesDetails, setPagesDetails] = useState({});
  const [fromWhere, setFromWhere] = useState("");

  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);

  const [isCheckList, setIsCheckList] = useState(true);

  let completedbyName = isUserRoleAccess.companyname;

  const updateIndividualData = async (index) => {
    setDeleteBtnDisable(false);
    let searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid == postID &&
        item.module == "Human Resources" &&
        item.submodule == "HR" &&
        item.mainpage == "Employee" &&
        item.subpage == "Employee Action Details" &&
        item.subsubpage == "Deactivate Employees List"
    );

    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

      if (check) {
        return {
          ...data, completedby: completedbyName, completedat: new Date()
        }
      } else {
        return {
          ...data, completedby: "", completedat: ""
        }
      }

    })

    setPageName(!pageName)
    try {
      let objectID = combinedGroups[index]?._id;
      let objectData = combinedGroups[index];
      if (searchItem) {
        let assignbranches = await axios.put(
          `${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            data: String(objectData?.data),
            lastcheck: objectData?.lastcheck,
            newFiles: objectData?.files !== undefined ? objectData?.files : "",
            completedby: objectData?.completedby,
            completedat: objectData?.completedat
          }
        );
        await fecthDBDatas();
      } else {
        let assignbranches = await axios.post(`${SERVICE.MYCHECKLIST_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          commonid: postID,
          module: thisPageDatas[0]?.modulename,
          submodule: thisPageDatas[0]?.submodule,
          mainpage: thisPageDatas[0]?.mainpage,
          subpage: thisPageDatas[0]?.subpage,
          subsubpage: thisPageDatas[0]?.subsubpage,
          category: thisPageDatas[0]?.category,
          subcategory: thisPageDatas[0]?.subcategory,
          candidatename: assignDetails?.companyname,
          status: "progress",
          groups: [...combinedGroups],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        await fecthDBDatas();
      }
      setPopupContent('Updated Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      setDeleteBtnDisable(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  async function fecthDBDatas() {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let foundData = res?.data?.mychecklist.find(
        (item) =>
          item.commonid == postID &&
          item.subsubpage == "Deactivate Employees List"
      );
      setGroupDetails(foundData?.groups);

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  const updateDateValuesAtIndex = (value, index) => {
    setDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "date");
  };

  const updateTimeValuesAtIndex = (value, index) => {
    setTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "time");
  };
  //---------------------------------------------------------------------------------------------------------------

  const updateFromDateValueAtIndex = (value, index) => {
    setDateValueMultiFrom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "fromdate");
  };

  const updateToDateValueAtIndex = (value, index) => {
    setDateValueMultiTo((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "todate");
  };
  //---------------------------------------------------------------------------------------------------------------------------------
  const updateDateValueAtIndex = (value, index) => {
    setDateValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "date");
  };

  const updateTimeValueAtIndex = (value, index) => {
    setTimeValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "time");
  };
  //---------------------------------------------------------------------------------------------------------------------------------------

  const updateFirstDateValuesAtIndex = (value, index) => {
    setFirstDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromdate");
  };

  const updateFirstTimeValuesAtIndex = (value, index) => {
    setFirstTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromtime");
  };

  const updateSecondDateValuesAtIndex = (value, index) => {
    setSecondDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "todate");
  };

  const updateSecondTimeValuesAtIndex = (value, index) => {
    setSecondTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "totime");
  };

  //------------------------------------------------------------------------------------------------------------

  const handleDataChange = (e, index, from, sub) => {
    let getData;
    let finalData;
    let updatedTodos;
    switch (from) {
      case "Check Box":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          lastcheck: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-number":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-alpha":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-alphanumeric":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Attachments":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          files: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Pre-Value":
        break;
      case "Date":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Time":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "DateTime":
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }

        break;
      case "Date Multi Span":
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${dateValueMultiTo[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueMultiFrom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Date Multi Span Time":
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "fromtime") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "todate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Date Multi Random":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Date Multi Random Time":
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValueRandom[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueRandom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Radio":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
    }
  };

  const handleChangeImage = (event, index) => {
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    const resume = event.target.files;

    const file = resume[0];
    if (file?.size < maxFileSize) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        handleDataChange(
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "resume file",
          },
          index,
          "Attachments"
        );
      };
    } else {
      setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };


  const handleCheckListSubmit = async () => {

    if (groupDetails) {
      let nextStep = isCheckedList.every((item) => item == true);
      if (!reason?.date) {
        setLoading(false);
        setPopupContentMalert('Please Select Date!');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

      else if (!nextStep) {
        setPopupContentMalert('Please Check All the Fields!');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else {
        sendRequestReason();
      }
    } else {
      setPopupContentMalert('Please Add Check List');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };

  let bor = empaddform._id;

  const sendRequestReason = async () => {
    setLoading(true);
    const searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid == postID &&
        item.module == "Human Resources" &&
        item.submodule == "HR" &&
        item.mainpage == "Employee" &&
        item.subpage == "Employee Action Details" &&
        item.subsubpage == "Deactivate Employees List"
    );

    let previousRejoinedDetails = getDetails.rejoineddetails ? getDetails.rejoineddetails : [];

    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

      if (check) {
        return {
          ...data, completedby: completedbyName, completedat: new Date()
        }
      } else {
        return {
          ...data, completedby: "", completedat: ""
        }
      }

    })

    const headers = {
      Authorization: `Bearer ${auth.APIToken}`,
    };

    const checklistData = searchItem
      ? {
        commonid: assignDetails?.commonid,
        module: assignDetails?.module,
        submodule: assignDetails?.submodule,
        mainpage: assignDetails?.mainpage,
        subpage: assignDetails?.subpage,
        subsubpage: assignDetails?.subsubpage,
        category: assignDetails?.category,
        subcategory: assignDetails?.subcategory,
        candidatename: assignDetails?.fullname,
        status: "completed",
        groups: [...combinedGroups],
        updatedby: [
          ...searchItem?.updatedby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }
      : {
        commonid: postID,
        module: thisPageDatas[0]?.modulename,
        submodule: thisPageDatas[0]?.submodule,
        mainpage: thisPageDatas[0]?.mainpage,
        subpage: thisPageDatas[0]?.subpage,
        subsubpage: thisPageDatas[0]?.subsubpage,
        category: thisPageDatas[0]?.category,
        subcategory: thisPageDatas[0]?.subcategory,
        candidatename: assignDetails?.companyname,
        status: "completed",
        groups: [...combinedGroups],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      };

    const updateChecklist = async () => {
      const url = searchItem ? `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem._id}` : SERVICE.MYCHECKLIST_CREATE;
      const method = searchItem ? 'put' : 'post';
      await axios[method](url, checklistData, { headers });
    };

    const updateProjectStatus = async () => {
      const projectData = {
        resonablestatus: "Rejoined",
        reasondate: "",
        reasonname: "",
        lastworkday: "",
        doj: formattedDate,
        rejoineddetails: [...previousRejoinedDetails, {
          dateofrejoining: formattedDate,
          reasonforrejoining: reason.reasonname
        }]
      };
      const projectscreate = await axios.put(`${SERVICE.INTERNUPDATE_STATUS}/${bor}`, projectData, { headers });
      return projectscreate.data;
    };

    setPageName(!pageName)
    try {
      await updateChecklist();
      const projectData = await updateProjectStatus();
      setReason(projectData);
      setLastworkday(projectData);
      setReason({ date: formattedDate, reasonname: "" });
      setLastworkday({});

      handleCloseviewReleave();
      setIsCheckedListOverall(false);
      setLoading(false);
      setReplaceName("Please Choose Replace Name");
      await fetchHandler();
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const sendBulkUpdateRequest = async () => {
    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

      if (check) {
        return {
          ...data, completedby: completedbyName, completedat: new Date()
        }
      } else {
        return {
          ...data, completedby: "", completedat: ""
        }
      }

    })

    const searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid === postID &&
        item.module === "Human Resources" &&
        item.submodule === "HR" &&
        item.mainpage === "Employee" &&
        item.subpage === "Employee Action Details" &&
        item.subsubpage === "Deactivate Employees List"
    );

    const headers = {
      Authorization: `Bearer ${auth.APIToken}`,
    };

    const createOrUpdateChecklist = async () => {
      const url = searchItem ? `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem._id}` : SERVICE.MYCHECKLIST_CREATE;
      const method = searchItem ? 'put' : 'post';

      const data = searchItem
        ? {
          commonid: assignDetails?.commonid,
          module: assignDetails?.module,
          submodule: assignDetails?.submodule,
          mainpage: assignDetails?.mainpage,
          subpage: assignDetails?.subpage,
          subsubpage: assignDetails?.subsubpage,
          category: assignDetails?.category,
          subcategory: assignDetails?.subcategory,
          candidatename: assignDetails?.fullname,
          status: "Progress",
          groups: [...combinedGroups],
          updatedby: [
            ...searchItem?.updatedby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
        : {
          commonid: postID,
          module: thisPageDatas[0]?.modulename,
          submodule: thisPageDatas[0]?.submodule,
          mainpage: thisPageDatas[0]?.mainpage,
          subpage: thisPageDatas[0]?.subpage,
          subsubpage: thisPageDatas[0]?.subsubpage,
          category: thisPageDatas[0]?.category,
          subcategory: thisPageDatas[0]?.subcategory,
          candidatename: assignDetails?.companyname,
          status: "Progress",
          groups: [...combinedGroups],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        };

      await axios[method](url, data, { headers });
    };



    setPageName(!pageName)
    try {
      await createOrUpdateChecklist();
      await fecthDBDatas();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

      setIsCheckedListOverall(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };




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

  const [userDetails, setUserDetails] = useState({});

  const [alreadyUpdatedDatas, setAlreadyUpdatedDatas] = useState([]);

  const getCode = async (e, name, details) => {

    setLoading(true);
    setGetDetails(details);
    let ans = details.attandances[details.attandances.length - 1]?.date ? details.attandances[details.attandances.length - 1]?.date.split('-') : ""
    let day = ans && ans[0];
    let month = ans && ans[1];
    let year = ans && ans[2];
    let finaldate = day && month && year ? `${year}-${month}-${day}` : details?.doj;
    setLastworkday(finaldate);


    setPageName(!pageName)
    try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res1 = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res1?.data?.mychecklist);
      let searchItem = res1?.data?.mychecklist.find(
        (item) =>
          item.commonid == details?.id &&
          item.module == "Human Resources" &&
          item.submodule == "HR" &&
          item.mainpage == "Employee" &&
          item.subpage == "Employee Action Details" &&
          item.subsubpage == "Deactivate Employees List"
      );

      if (searchItem) {
        setDeleteBtnDisable(false);
        setAssignDetails(searchItem);

        setPostID(searchItem?.commonid);
        let datasNew = searchItem.groups.map((item) => {
          switch (item.details) {
            case "LEGALNAME":
              return {
                ...item,
                data: details.companyname,
              };
              break;
            case "USERNAME":
              return {
                ...item,
                data: details.username,
              };
              break;
            case "PASSWORD":
              return {
                ...item,
                data: details.originalpassword,
              };
              break;
            case "DATE OF BIRTH":
              return {
                ...item,
                data: details.dob,
              };
              break;
            case "EMAIL":
              return {
                ...item,
                data: details.email,
              };
              break;
            case "PHONE NUMBER":
              return {
                ...item,
                data: details.contactpersonal,
              };
              break;
            case "FIRST NAME":
              return {
                ...item,
                data: details.firstname,
              };
              break;
            case "LAST NAME":
              return {
                ...item,
                data: details.lastname,
              };
              break;
            case "AADHAAR NUMBER":
              return {
                ...item,
                data: details.aadhar,
              };
              break;
            case "PAN NUMBER":
              return {
                ...item,
                data: details.panno,
              };
              break;
            case "CURRENT ADDRESS":
              return {
                ...item,
                data: details.currentaddress,
              };
              break;
            default:
              return {
                ...item,
              };
          }
        });
        setGroupDetails(
          datasNew?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));

        let forFillDetails = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Random Time") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });

        let forDateSpan = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Span") {
            if (data?.data && data?.data !== "") {
              const [fromdate, todate] = data?.data?.split(" ");
              return { fromdate, todate };
            }
          } else {
            return { fromdate: "0", todate: "0" };
          }
        });

        let forDateTime = datasNew?.map((data) => {
          if (data.checklist === "DateTime") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });

        let forDateMultiSpanTime = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Span Time") {
            if (data?.data && data?.data !== "") {
              const [from, to] = data?.data?.split("/");
              const [fromdate, fromtime] = from?.split(" ");
              const [todate, totime] = to?.split(" ");
              return { fromdate, fromtime, todate, totime };
            }
          } else {
            return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
          }
        });

        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate));
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate));

        setDateValueRandom(forFillDetails.map((item) => item?.date));
        setTimeValueRandom(forFillDetails.map((item) => item?.time));

        setDateValue(forDateTime.map((item) => item?.date));
        setTimeValue(forDateTime.map((item) => item?.time));

        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate));
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime));
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate));
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime));


      } else {
        setDeleteBtnDisable(true);
        setAssignDetails(details);
        setPostID(details?.id);
        let datasNew = details?.groups?.map((item) => {
          switch (item.details) {
            case "LEGALNAME":
              return {
                ...item,
                data: details.companyname,
              };

            case "USERNAME":
              return {
                ...item,
                data: details.username,
              };

            case "PASSWORD":
              return {
                ...item,
                data: details.originalpassword,
              };

            case "DATE OF BIRTH":
              return {
                ...item,
                data: details.dob,
              };

            case "EMAIL":
              return {
                ...item,
                data: details.email,
              };

            case "PHONE NUMBER":
              return {
                ...item,
                data: details.contactpersonal,
              };

            case "FIRST NAME":
              return {
                ...item,
                data: details.firstname,
              };

            case "LAST NAME":
              return {
                ...item,
                data: details.lastname,
              };

            case "AADHAAR NUMBER":
              return {
                ...item,
                data: details.aadhar,
              };

            case "PAN NUMBER":
              return {
                ...item,
                data: details.panno,
              };

            case "CURRENT ADDRESS":
              return {
                ...item,
                data: details.currentaddress,
              };

            default:
              return {
                ...item,
              };
          }
        });
        setGroupDetails(
          datasNew?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        let len = datasNew?.length;

        setIsCheckedList(new Array(len).fill(false));

        setDateValueRandom(new Array(details?.groups?.length).fill(0));
        setTimeValueRandom(new Array(details?.groups?.length).fill(0));

        setDateValueMultiFrom(new Array(details?.groups?.length).fill(0));
        setDateValueMultiTo(new Array(details?.groups?.length).fill(0));

        setDateValue(new Array(details?.groups?.length).fill(0));
        setTimeValue(new Array(details?.groups?.length).fill(0));

        setFirstDateValue(new Array(details?.groups?.length).fill(0));
        setFirstTimeValue(new Array(details?.groups?.length).fill(0));
        setSecondDateValue(new Array(details?.groups?.length).fill(0));
        setSecondTimeValue(new Array(details?.groups?.length).fill(0));

        setDisableInput(new Array(details?.groups?.length).fill(true));

      }

      handleClickOpenviewReleave();
      setEmpaddform(res?.data?.suser);
      setLoading(false);
    } catch (err) {
      console.log(err)
      setLoading(false);
      // handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };


  const [thisPageDatas, setThisPageDatas] = useState([]);




  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  const gridRef = useRef(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Deactivate Employee List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = async (csvData, fileName) => {
    if (!csvData || !csvData.length) {
      console.error("No data provided for export.");
      return;
    }

    if (!fileName) {
      console.error("No file name provided.");
      return;
    }

    setPageName(!pageName)
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // Define columns
      worksheet.columns = [
        { header: "S.No", key: "serial", width: 10 },

        { header: "Mode", key: "resonablestatus", width: 30 },
        { header: "Empcode", key: "empcode", width: 15 },
        { header: "Name", key: "companyname", width: 30 },
        { header: "Department", key: "department", width: 30 },
        { header: "DOB", key: "dob", width: 20 },
        { header: "Personal Number", key: "contactpersonal", width: 20 },
        { header: "DOJ", key: "doj", width: 20 },

        { header: "Experience", key: "experience", width: 20 },
        { header: "End Date", key: "reasondate", width: 20 },
        { header: "Reporting To", key: "reportingto", width: 20 },
        { header: "Reason", key: "reasonname", width: 20 },
        { header: "Last Work Day", key: "lastworkday", width: 20 },

        { header: "Image", key: "image", width: 20 },
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" }, // Yellow background
        };
        cell.font = {
          bold: true,
          color: { argb: "000" }, // Red text color
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Add rows and images
      for (let i = 0; i < csvData.length; i++) {
        const item = csvData[i];
        const row = worksheet.addRow({
          serial: i + 1,
          empcode: item.empcode || "",
          companyname: item.companyname || "",
          department: item.department || "",
          dob: item.dob || "",
          contactpersonal: item.contactpersonal || "",
          doj: item.doj || "",
          experience: item.experience || "",
          reasondate: item.reasondate || "",
          reportingto: item.reportingto || "",
          resonablestatus: item.resonablestatus || "",
          reasonname: item.reasonname || "",
          lastworkday: item.lastworkday || "",
        });

        // Center align the text in each cell of the row
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        if (item.profileimage) {
          const base64Image = item.profileimage.split(",")[1];
          const imageId = workbook.addImage({
            base64: base64Image,
            extension: "png",
          });

          const rowIndex = row.number;

          // Adjust row height to fit the image
          worksheet.getRow(rowIndex).height = 80;

          // Add image to the worksheet
          worksheet.addImage(imageId, {
            tl: { col: 13, row: rowIndex - 1 },
            ext: { width: 100, height: 80 },
          });

          // Center align the image cell
          worksheet.getCell(`H${rowIndex}`).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        }
      }

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, `${fileName}${fileExtension}`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? (filteredChanges !== null ? filteredRowData : filteredData) : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(dataToExport, "Deactivate Employee List");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "S.No", field: "serialNumber" },
    // { title: "Mode", field: "resonablestatus" },
    { title: "Empcode", field: "empcode" },
    { title: "Name", field: "companyname" },
    { title: "Department", field: "department" },
    { title: "Dob", field: "dob" },
    { title: "PersonalNo", field: "contactpersonal" },
    { title: "DOJ", field: "doj" },
    { title: "Experience", field: "experience" },
    { title: "EndDate", field: "reasondate" },
    { title: "Reportingto", field: "reportingto" },
    { title: "Reason", field: "reasonname" },
    { title: "Last Work Day", field: "lastworkday" },
    { title: "Image", field: "imageBase64" },
  ];

  const downloadPdf = async (isfilter) => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.title);
    const tableRows = [];
    const imagesToLoad = [];
    let newOne = filteredChanges !== null ? filteredRowData : filteredData
    let datatoPdf = isfilter === "filtered" ? newOne : items;

    datatoPdf.forEach((item, index) => {
      const rowData = [
        index + 1,

        item.empcode || "",
        item.companyname || "",
        item.department || "",
        item.dob || "",
        item.contactpersonal || "",
        item.doj || "",
        item.experience || "",
        item.reasondate || "",
        item.reportingto || "",
        // item.resonablestatus || "",
        item.reasonname || "",
        item.lastworkday || "",
        // item.mode || '',
        // item.value || '',
        // item.endexp || '',
        // item.endexpdate || '',
        // item.endtar || '',
        // item.endtardate || '',
        "", // Placeholder for the image column
      ];

      tableRows.push(rowData);

      if (item.profileimage) {
        imagesToLoad.push({ index, imageBase64: item.profileimage });
      }
    });

    const loadImage = (imageBase64) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageBase64;
      });
    };

    const loadedImages = await Promise.all(
      imagesToLoad.map((item) =>
        loadImage(item.imageBase64).then((img) => ({ ...item, img }))
      )
    );

    // Calculate the required row height based on image height
    const rowHeight = 10; // Set desired row height

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      didDrawCell: (data) => {
        // Ensure that the cell belongs to the body section and it's the image column
        if (
          data.section === "body" &&
          data.column.index === columns.length - 1
        ) {
          const imageInfo = loadedImages.find(
            (image) => image.index === data.row.index
          );
          if (imageInfo) {
            const imageHeight = 10; // Desired image height
            const imageWidth = 10; // Desired image width
            const xOffset = (data.cell.width - imageWidth) / 2; // Center the image horizontally
            const yOffset = (rowHeight - imageHeight) / 2; // Center the image vertically

            doc.addImage(
              imageInfo.img,
              "PNG",
              data.cell.x + xOffset,
              data.cell.y + yOffset,
              imageWidth,
              imageHeight
            );

            // Adjust cell styles to increase height
            data.cell.height = rowHeight; // Set custom height
          }
        }
      },
      headStyles: {
        minCellHeight: 5, // Set minimum cell height for header cells
        fontSize: 4, // You can adjust the font size if needed
        cellPadding: { top: 2, right: 1, bottom: 2, left: 1 }, // Adjust padding for header cells
      },
      bodyStyles: {
        fontSize: 4,
        minCellHeight: rowHeight, // Set minimum cell height for body cells
        cellPadding: { top: 4, right: 1, bottom: 0, left: 1 }, // Adjust padding for body cells
      },
      columnStyles: {
        [tableColumn.length - 1]: { cellWidth: 12 }, // Increase width of the image column
      },
    });

    doc.save("Deactivate Employee List.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Boardeditlist",
    pageStyle: "print",
  });

  const calculateExperience = (doj) => {
    const startDate = new Date(doj);
    const currentDate = new Date();
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += currentDate.getMonth();
    return Math.max(0, months);
  };

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => {
      let ans = item?.attandances[item?.attandances?.length - 1]?.date ? item?.attandances[item?.attandances?.length - 1]?.date?.split('-') : ""
      let day = ans && ans[0];
      let month = ans && ans[1];
      let year = ans && ans[2];
      let finaldate = day && month && year ? `${year}-${month}-${day}` : item?.doj;
      return {
        ...item,
        serialNumber: index + 1,
        dob: item?.dob ? moment(item.dob, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
        doj: item?.doj ? moment(item.doj, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
        reasondate: item?.reasondate
          ? moment(item.reasondate, "YYYY-MM-DD").format("DD-MM-YYYY")
          : "",
        experience: calculateExperience(item.doj),
        lastworkday: finaldate
      }
    });
    setItems(itemsWithSerialNumber);
    setOverallItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const handleSorting = (column) => {
    const direction =
      sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return (
        <>
          <Box sx={{ color: "#bbb6b6" }}>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sorting.direction === "asc") {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    }
  };

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

  const totalPages = Math.ceil(employees.length / pageSize);

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

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  // for new table
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    empcode: true,
    companyname: true,
    department: true,
    dateofbirth: true,
    contactpersonal: true,
    dateofjoining: true,
    experience: true,
    profileimage: true,
    reportingto: true,
    dob: true,
    doj: true,
    lastworkingdate: true,

    lastworkday: true,
    reasondate: true,
    reasonname: true,
    mode: true,
    checklist: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const rowDataTable = filteredData.map((item) => {

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      department: item.department,
      dob: item.dob,
      contactpersonal: item.contactpersonal,
      doj: item.doj,
      experience: item?.experience,
      reportingto: item?.reportingto,
      profileimage: item?.profileimage,
      attandances: item?.attandances,
      groups: item?.groups,
      originalpassword: item?.originalpassword,
      email: item?.email,
      firstname: item?.firstname,
      lastname: item?.lastname,
      aadhar: item?.aadhar,
      panno: item?.panno,
      username: item?.username,
      currentaddress: item?.currentaddress,
      lastworkingdate: item?.lastworkingdate,
      mode: renderStatus(item.resonablestatus),
      lastworkday: item?.lastworkday,
      reasondate: item?.reasondate,
      reasonname: item?.reasonname,
      resonablestatus: item?.resonablestatus,
      relieveddetails: item?.relieveddetails,
      rejoineddetails: item?.rejoineddetails,
    };
  });

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 200,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
      pinned: 'left',
      cellRenderer: (params) => (
        renderStatus(params?.data?.resonablestatus)
      )
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      pinned: 'left',
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Emp Code!");
              }}
              options={{ message: "Copied Emp Code!" }}
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Emp Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Company Name!");
              }}
              options={{ message: "Copied Company Name!" }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "checklist",
      headerName: "Checklist",
      flex: 0,
      width: 130,
      hide: !columnVisibility.checklist,
      headerClassName: "bold-header",
      cellRenderer: (params) => {

        return (
          <Button

            onClick={() => {
              handleOpenTable(params?.data?.id);
            }}
          >
            View
          </Button>
        )
      },
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 200,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "dob",
      headerName: "DOB",
      flex: 0,
      width: 150,
      hide: !columnVisibility.dob,
      headerClassName: "bold-header",
    },
    {
      field: "contactpersonal",
      headerName: "Contact Personal",
      flex: 0,
      width: 200,
      hide: !columnVisibility.contactpersonal,
      headerClassName: "bold-header",
    },

    {
      field: "doj",
      headerName: "DOJ",
      flex: 0,
      width: 150,
      hide: !columnVisibility.doj,
      headerClassName: "bold-header",
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 100,
      hide: !columnVisibility.experience,
      headerClassName: "bold-header",
    },
    {
      field: "reasondate",
      headerName: "EndDate",
      flex: 0,
      width: 150,
      hide: !columnVisibility.reasondate,
      headerClassName: "bold-header",
    },
    {
      field: "reportingto",
      headerName: "Reporting To",
      flex: 0,
      width: 200,
      hide: !columnVisibility.reportingto,
      headerClassName: "bold-header",
    },
    {
      field: "reasonname",
      headerName: "Reason",
      flex: 0,
      width: 200,
      hide: !columnVisibility.reasonname,
      headerClassName: "bold-header",
    },
    {
      field: "lastworkday",
      headerName: "Last Work Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.lastworkday,
      headerClassName: "bold-header",
    },


    {
      field: "profileimage",
      headerName: "Profile",
      flex: 0,
      width: 100,
      hide: !columnVisibility.profileimage,
      headerClassName: "bold-header",
      cellRenderer: (params) => {

        return params.value !== "" ? (
          <img
            src={params.value}
            alt="Profile"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <></>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 400,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <>
          <Grid sx={{ display: "flex", gap: '10px' }}>

            <ButtonGroup size="small" variant="contained" aria-label="Small button group" padding='0' sx={{ height: '20px', marginTop: '10px' }}>
              <Button sx={{ fontSize: '0.6rem', backgroundColor: '#0fa1ff' }} onClick={(e) => {
                setLoading(true);


                getCode(params?.data?.id, "Re-Join", params?.data);

              }}>Re-Join</Button>
              <Button sx={{ fontSize: '0.6rem', backgroundColor: '#ff0f20' }} onClick={(e) => {
                setLoading(true);


                getCode(params?.data?.id, "Un-Hold", params?.data);
              }}>Un-Hold</Button>
              <Button sx={{ fontSize: '0.6rem', backgroundColor: '#ffe40f', color: 'black' }} onClick={(e) => {
                setLoading(true);


                getCode(params?.data?.id, "Update Join", params?.data);
              }}>Update Join</Button>

            </ButtonGroup>

            <Link to={`/edit/${params?.data?.id}`}>
              <Button
                variant="outlined"
                size="small"
                style={userStyle.actionbutton}
              >
                <EditIcon style={{ fontSize: "20px" }} />
              </Button>
            </Link>

          </Grid>
        </>
      ),
    },
  ];



  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };

  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
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


  // Manage Columns
  const [isManageColumnsOpenNew, setManageColumnsOpenNew] = useState(false);
  const [anchorElNew, setAnchorElNew] = useState(null);

  const handleOpenManageColumnsNew = (event) => {
    setAnchorElNew(event.currentTarget);
    setManageColumnsOpenNew(true);
  };
  const handleCloseManageColumnsNew = () => {
    setManageColumnsOpenNew(false);
    setSearchQueryManage("");
  };

  const openNew = Boolean(anchorElNew);
  const idNew = openNew ? "simple-popover" : undefined;

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
        onClick={handleCloseManageColumnsNew}
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  return (
    <Box>
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <Headtitle title={"DEACTIVATE EMPLOYEE LIST"} />
      <PageHeading
        title="Deactivate Employees List"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Action Details"
        subsubpagename="Deactivate Employees List"
      />
      {isUserRoleCompare?.includes("ldeactivateemployeeslist") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext} onClick={() => { console.log(allUsersData) }}>Filters</Typography>
                </Grid>
                <br />
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
                        options={notEmployees
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
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={buttonStyles.buttonsubmit}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("ldeactivateemployeeslist") && (
        <>
          <Box sx={userStyle.container}>
            {!isBoarding ? (
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
                <br />
                <br />

                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes(
                      "csvdeactivateemployeeslist"
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
                      "exceldeactivateemployeeslist"
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
                      "printdeactivateemployeeslist"
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
                      "pdfdeactivateemployeeslist"
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
                      "imagedeactivateemployeeslist"
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
                  </Grid>
                </Grid>
                <br />
                {/* added to the pagination grid */}
                <Grid style={userStyle.dataTablestyle}>
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
                    </Select>
                  </Box>
                  <Box>
                    <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={employees} setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={overallItems}
                    />
                  </Box>
                </Grid>
                <br />

                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                  Show All Columns
                </Button>
                &ensp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNew}>
                  Manage Columns
                </Button>
                &ensp;

                {/* ****** Table start ****** */}

                {/* {isLoader ? ( */}

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
                  gridRefTable={gridRef}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}
                />
                {/* Manage Column */}
                <Popover
                  id={idNew}
                  open={isManageColumnsOpenNew}
                  anchorEl={anchorElNew}
                  onClose={handleCloseManageColumnsNew}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {manageColumnsContent}
                </Popover>

              </>
            )}
          </Box>
        </>
      )}
      <br />
      {/* ****** Table End ****** */}



      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Boarding Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Mode</StyledTableCell>
              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Name </StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Dob</StyledTableCell>
              <StyledTableCell>Personal Number</StyledTableCell>
              <StyledTableCell>Doj</StyledTableCell>
              <StyledTableCell>Experience</StyledTableCell>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>Reporting To</StyledTableCell>
              <StyledTableCell>Reason</StyledTableCell>
              <StyledTableCell>Last Work Day</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredData &&
              filteredData.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.resonablestatus}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>
                    {row.dob
                      ? moment(row.dob, "YYYY-MM-DD").format("DD-MM-YYYY")
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                  <StyledTableCell>
                    {row.doj
                      ? moment(row.doj, "YYYY-MM-DD").format("DD-MM-YYYY")
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>{row.experience}</StyledTableCell>
                  <StyledTableCell>
                    {row.reasondate
                      ? moment(row.reasondate, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>{row.reportingto}</StyledTableCell>
                  <StyledTableCell>{row.reasonname}</StyledTableCell>
                  <StyledTableCell>
                    {row.lastworkday
                      ? moment(row.lastworkday, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row?.profileimage ? (
                      <img
                        src={row?.profileimage}
                        style={{ height: "100px", width: "100px" }}
                      />
                    ) : (
                      ""
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* this is the alert for the popover ation button in Reason Employee */}
      <Dialog
        open={openviewReleave}
        onClose={handleClickOpenviewReleave}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        sx={{ marginTop: '85px' }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

              <Typography sx={userStyle.HeaderText}> Deactivate employee list</Typography>
              <Tooltip title="Delete Saved Check List For This Person">

                <LoadingButton
                  variant="contained"
                  color="error"
                  sx={{ paddingTop: '0 !important', paddingBottom: '0 !important', height: '30px' }}
                  startIcon={<DeleteIcon />}
                  onClick={() => { handleClickOpen(); }}
                  loading={deletebtn}
                  disabled={deletebtnDisable}
                >
                  Delete
                </LoadingButton>


              </Tooltip>



            </div>



            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Reason Apply</b>
                  </Typography>
                  <Typography>{statusemployee}</Typography>
                </FormControl>
              </Grid>
              {hierarchyDeleteData.length > 0 ? (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.SubHeaderText}>
                        <b>Replace</b>
                        <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={employeesList}
                        styles={colourStyles}
                        value={{ label: replaceName, value: replaceName }}
                        onChange={(e) => {
                          setReplaceName(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Employee code</b>
                  </Typography>
                  <Typography>{empaddform.empcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}></Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Employee Name</b>
                  </Typography>
                  <Typography>{empaddform.companyname}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={1} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Date</b>{" "}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    // value={formattedDate}
                    value={reason.date}
                    onChange={(e) => {
                      setReason({ ...reason, date: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Reason</b>{" "}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    value={reason.reasonname}
                    onChange={(e) => {
                      setReason({ ...reason, reasonname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            {getDetails?.relieveddetails && <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: '500', fontSize: '1.2rem' }}>Relieved Date</TableCell>
                      <TableCell align="left" sx={{ fontWeight: '500', fontSize: '1.2rem' }}>Reason For Relieved</TableCell>
                      <TableCell align="left" sx={{ fontWeight: '500', fontSize: '1.2rem' }}>Date of Joining</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>

                    <TableRow
                    >
                      <TableCell component="th" scope="row">
                        {moment(getDetails?.relieveddetails[getDetails?.relieveddetails?.length - 1]?.dateofrelieving).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell align="left">{getDetails?.relieveddetails[getDetails?.relieveddetails?.length - 1]?.reasonforrelieving}</TableCell>
                      <TableCell align="left">{getDetails?.relieveddetails[getDetails?.relieveddetails?.length - 1]?.dateofjoining}</TableCell>

                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </>}

            <Box sx={{ padding: "20px 10px", width: "100%" }}>
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography
                    sx={{ ...userStyle.SubHeaderText, fontWeight: "600" }}
                  >
                    My Check List
                  </Typography>
                  <div>
                    <Tooltip title="Update All the Values simultaneously">
                      <Button onClick={() => { sendBulkUpdateRequest(); }} variant="contained" color="success">
                        Bulk Update
                      </Button>
                    </Tooltip>
                  </div>

                </div>
                <br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontSize: "1.2rem" }}>
                          <Checkbox
                            onChange={() => {
                              overallCheckListChange();
                            }}
                            checked={isCheckedListOverall}
                          />
                        </TableCell>
                        <TableCell style={{ fontSize: "1.2rem" }}>
                          Details
                        </TableCell>
                        <TableCell style={{ fontSize: "1.2rem" }}>
                          Field
                        </TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Allotted To</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Completed By</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Completed At</TableCell>
                        <TableCell style={{ fontSize: "1.2rem" }}>
                          Status
                        </TableCell>
                        <TableCell style={{ fontSize: "1.2rem" }}>
                          Action
                        </TableCell>
                        <TableCell style={{ fontSize: "1.2rem" }}>
                          Category
                        </TableCell>
                        <TableCell style={{ fontSize: "1.2rem" }}>
                          Sub Category
                        </TableCell>

                        {/* Add more table headers as needed */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupDetails?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell style={{ fontSize: "1.2rem" }}>
                            <Checkbox
                              onChange={() => {
                                handleCheckboxChange(index);
                              }}
                              checked={isCheckedList[index]}
                            />
                          </TableCell>

                          <TableCell>{row.details}</TableCell>
                          {(() => {
                            switch (row.checklist) {
                              case "Text Box":
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      value={row.data}
                                      // disabled={disableInput[index]}
                                      onChange={(e) => {
                                        handleDataChange(e, index, "Text Box");
                                      }}
                                    />
                                  </TableCell>
                                );
                              case "Text Box-number":
                                return (
                                  <TableCell>
                                    <Input
                                      value={row.data}
                                      style={{ height: "32px" }}
                                      type="number"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                          value === "" ||
                                          /^\d*$/.test(value)
                                        ) {
                                          handleDataChange(
                                            e,
                                            index,
                                            "Text Box-number"
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>
                                );
                              case "Text Box-alpha":
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      value={row.data}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (/^[a-zA-Z]*$/.test(inputValue)) {
                                          handleDataChange(
                                            e,
                                            index,
                                            "Text Box-alpha"
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>
                                );
                              case "Text Box-alphanumeric":
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      value={row.data}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                          handleDataChange(
                                            e,
                                            index,
                                            "Text Box-alphanumeric"
                                          );
                                        }
                                      }}
                                      inputProps={{ pattern: "[A-Za-z0-9]*" }}
                                    />
                                  </TableCell>
                                );
                              case "Attachments":
                                return (
                                  <TableCell>
                                    <div>
                                      <InputLabel sx={{ m: 1 }}>
                                        File
                                      </InputLabel>

                                      <div>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            marginTop: "10px",
                                            gap: "10px",
                                          }}
                                        >
                                          <Box item md={4} sm={4}>
                                            <section>
                                              <input
                                                type="file"
                                                accept="*/*"
                                                id={index}
                                                onChange={(e) => {
                                                  handleChangeImage(e, index);
                                                }}
                                                style={{ display: "none" }}
                                              />
                                              <label htmlFor={index}>
                                                <Typography
                                                  sx={userStyle.uploadbtn}
                                                >
                                                  Upload
                                                </Typography>
                                              </label>
                                              <br />
                                            </section>
                                          </Box>

                                          <Box item md={4} sm={4}>
                                            <Button
                                              onClick={showWebcam}
                                              variant="contained"
                                              sx={userStyle.uploadbtn}
                                            >
                                              <CameraAltIcon />
                                            </Button>
                                          </Box>

                                        </Box>
                                        {row.files && (
                                          <Grid container spacing={2}>
                                            <Grid
                                              item
                                              lg={8}
                                              md={8}
                                              sm={8}
                                              xs={8}
                                            >
                                              <Typography>
                                                {row.files.name}
                                              </Typography>
                                            </Grid>
                                            <Grid
                                              item
                                              lg={1}
                                              md={1}
                                              sm={1}
                                              xs={1}
                                            >
                                              <VisibilityOutlinedIcon
                                                style={{
                                                  fontsize: "large",
                                                  color: "#357AE8",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  renderFilePreviewEdit(
                                                    row.files
                                                  )
                                                }
                                              />
                                            </Grid>
                                            <Grid
                                              item
                                              lg={1}
                                              md={1}
                                              sm={1}
                                              xs={1}
                                            >
                                              <Button
                                                style={{
                                                  fontsize: "large",
                                                  color: "#357AE8",
                                                  cursor: "pointer",
                                                  marginTop: "-5px",
                                                }}
                                                onClick={() =>
                                                  handleFileDeleteEdit(index)
                                                }
                                              >
                                                <DeleteIcon />
                                              </Button>
                                            </Grid>
                                          </Grid>
                                        )}
                                      </div>
                                      <Dialog
                                        open={isWebcamOpen}
                                        onClose={webcamClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                      >
                                        <DialogContent
                                          sx={{
                                            textAlign: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Webcamimage
                                            getImg={getImg}
                                            setGetImg={setGetImg}
                                            capturedImages={capturedImages}
                                            valNum={valNum}
                                            setValNum={setValNum}
                                            name={name}
                                          />
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            variant="contained"
                                            color="success"
                                            onClick={webcamDataStore}
                                          >
                                            OK
                                          </Button>
                                          <Button
                                            variant="contained"
                                            color="error"
                                            onClick={webcamClose}
                                          >
                                            CANCEL
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </div>
                                  </TableCell>
                                );
                              case "Pre-Value":
                                return (
                                  <TableCell>
                                    <Typography>{row?.data}</Typography>
                                  </TableCell>
                                );
                              case "Date":
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="date"
                                      value={row.data}
                                      onChange={(e) => {
                                        handleDataChange(e, index, "Date");
                                      }}
                                    />
                                  </TableCell>
                                );
                              case "Time":
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="time"
                                      value={row.data}
                                      onChange={(e) => {
                                        handleDataChange(e, index, "Time");
                                      }}
                                    />
                                  </TableCell>
                                );
                              case "DateTime":
                                return (
                                  <TableCell>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        type="date"
                                        value={dateValue[index]}
                                        onChange={(e) => {
                                          updateDateValuesAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                      <OutlinedInput
                                        type="time"
                                        style={{ height: "32px" }}
                                        value={timeValue[index]}
                                        onChange={(e) => {
                                          updateTimeValuesAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                    </Stack>
                                  </TableCell>
                                );
                              case "Date Multi Span":
                                return (
                                  <TableCell>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        type="date"
                                        value={dateValueMultiFrom[index]}
                                        onChange={(e) => {
                                          updateFromDateValueAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                      <OutlinedInput
                                        type="date"
                                        style={{ height: "32px" }}
                                        value={dateValueMultiTo[index]}
                                        onChange={(e) => {
                                          updateToDateValueAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                    </Stack>
                                  </TableCell>
                                );
                              case "Date Multi Span Time":
                                return (
                                  <TableCell>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                      }}
                                    >
                                      <Stack direction="row" spacing={2}>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          type="date"
                                          value={firstDateValue[index]}
                                          onChange={(e) => {
                                            updateFirstDateValuesAtIndex(
                                              e.target.value,
                                              index
                                            );
                                          }}
                                        />
                                        <OutlinedInput
                                          type="time"
                                          style={{ height: "32px" }}
                                          value={firstTimeValue[index]}
                                          onChange={(e) => {
                                            updateFirstTimeValuesAtIndex(
                                              e.target.value,
                                              index
                                            );
                                          }}
                                        />
                                      </Stack>
                                      <Stack direction="row" spacing={2}>
                                        <OutlinedInput
                                          type="date"
                                          style={{ height: "32px" }}
                                          value={secondDateValue[index]}
                                          onChange={(e) => {
                                            updateSecondDateValuesAtIndex(
                                              e.target.value,
                                              index
                                            );
                                          }}
                                        />
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          type="time"
                                          value={secondTimeValue[index]}
                                          onChange={(e) => {
                                            updateSecondTimeValuesAtIndex(
                                              e.target.value,
                                              index
                                            );
                                          }}
                                        />
                                      </Stack>
                                    </div>
                                  </TableCell>
                                );
                              case "Date Multi Random":
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="date"
                                      value={row.data}
                                      onChange={(e) => {
                                        handleDataChange(
                                          e,
                                          index,
                                          "Date Multi Random"
                                        );
                                      }}
                                    />
                                  </TableCell>
                                );
                              case "Date Multi Random Time":
                                return (
                                  <TableCell>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        type="date"
                                        value={dateValueRandom[index]}
                                        onChange={(e) => {
                                          updateDateValueAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                      <OutlinedInput
                                        type="time"
                                        style={{ height: "32px" }}
                                        value={timeValueRandom[index]}
                                        onChange={(e) => {
                                          updateTimeValueAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                    </Stack>
                                  </TableCell>
                                );
                              case "Radio":
                                return (
                                  <TableCell>
                                    <FormControl component="fieldset">
                                      <RadioGroup
                                        value={row.data}
                                        sx={{
                                          display: "flex",
                                          flexDirection: "row !important",
                                        }}
                                        onChange={(e) => {
                                          handleDataChange(e, index, "Radio");
                                        }}
                                      >
                                        <FormControlLabel
                                          value="No"
                                          control={<Radio />}
                                          label="No"
                                        />
                                        <FormControlLabel
                                          value="Yes"
                                          control={<Radio />}
                                          label="Yes"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </TableCell>
                                );

                              default:
                                return <TableCell></TableCell>; // Default case
                            }
                          })()}
                          <TableCell>{row?.employee && row?.employee?.map((data, index) => (
                            <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>
                          ))}</TableCell>
                          <TableCell>{row.completedby}</TableCell>
                          <TableCell>{row.completedat && moment(row.completedat).format("DD-MM-YYYY hh:mm:ss A")}</TableCell>
                          <TableCell>
                            {row.checklist === "DateTime" ? (
                              ((row.data !== undefined && row.data !== "") ||
                                row.files !== undefined) &&
                                row.data.length === 16 ? (
                                <Typography>Completed</Typography>
                              ) : (
                                <Typography>Pending</Typography>
                              )
                            ) : row.checklist === "Date Multi Span" ? (
                              ((row.data !== undefined && row.data !== "") ||
                                row.files !== undefined) &&
                                row.data.length === 21 ? (
                                <Typography>Completed</Typography>
                              ) : (
                                <Typography>Pending</Typography>
                              )
                            ) : row.checklist === "Date Multi Span Time" ? (
                              ((row.data !== undefined && row.data !== "") ||
                                row.files !== undefined) &&
                                row.data.length === 33 ? (
                                <Typography>Completed</Typography>
                              ) : (
                                <Typography>Pending</Typography>
                              )
                            ) : row.checklist === "Date Multi Random Time" ? (
                              ((row.data !== undefined && row.data !== "") ||
                                row.files !== undefined) &&
                                row.data.length === 16 ? (
                                <Typography>Completed</Typography>
                              ) : (
                                <Typography>Pending</Typography>
                              )
                            ) : (row.data !== undefined && row.data !== "") ||
                              row.files !== undefined ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            {row.checklist === "DateTime" ? (
                              ((row.data !== undefined && row.data !== "") ||
                                row.files !== undefined) &&
                                row.data.length === 16 ? (
                                <>
                                  <IconButton
                                    sx={{ color: "green", cursor: "pointer" }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  sx={{ color: "#1565c0", cursor: "pointer" }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )
                            ) : row.checklist === "Date Multi Span" ? (
                              ((row.data !== undefined && row.data !== "") ||
                                row.files !== undefined) &&
                                row.data.length === 21 ? (
                                <>
                                  <IconButton
                                    sx={{ color: "green", cursor: "pointer" }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  sx={{ color: "#1565c0", cursor: "pointer" }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )
                            ) : row.checklist === "Date Multi Span Time" ? (
                              ((row.data !== undefined && row.data !== "") ||
                                row.files !== undefined) &&
                                row.data.length === 33 ? (
                                <>
                                  <IconButton
                                    sx={{ color: "green", cursor: "pointer" }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  sx={{ color: "#1565c0", cursor: "pointer" }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )
                            ) : row.checklist === "Date Multi Random Time" ? (
                              ((row.data !== undefined && row.data !== "") ||
                                row.files !== undefined) &&
                                row.data.length === 16 ? (
                                <>
                                  <IconButton
                                    sx={{ color: "green", cursor: "pointer" }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  sx={{ color: "#1565c0", cursor: "pointer" }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )
                            ) : (row.data !== undefined && row.data !== "") ||
                              row.files !== undefined ? (
                              <>
                                <IconButton
                                  sx={{ color: "green", cursor: "pointer" }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: "#1565c0", cursor: "pointer" }}
                                onClick={() => {
                                  let itemValue = disableInput[index];
                                  itemValue = false;
                                  let spreadData = [...disableInput];
                                  spreadData[index] = false;
                                  setDisableInput(spreadData);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.subcategory}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br /> <br /> <br />
              </>
            </Box>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheckListSubmit}
                  sx={buttonStyles.buttonsubmit}
                >
                  Save
                </Button>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClearreason}
                  sx={buttonStyles.btncancel}
                >
                  {" "}
                  Clear
                </Button>
              </Grid>
              <Grid item md={0.2} xs={12} sm={12}></Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseviewReleave}
                  sx={buttonStyles.btncancel}
                >
                  {" "}
                  Close
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {fileFormat === "xl" ? (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      <CheckListTable
        isTable={isTable}
        handleCloseTable={handleCloseTable}
        userId={selectedUserId}
        from={"deactivate"}
      />
      <Loader loading={loading} message={loadingMessage} />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteChecklist}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* SUCCESS */}
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />

    </Box>

    //    another table
  );
}

export default Deactivateemployeeslist;