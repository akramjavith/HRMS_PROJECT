import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  TableRow,
  TableCell,
  DialogContent,
  OutlinedInput,
  DialogActions,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
  Checkbox,
  FormGroup,
  Tooltip,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import FormControlLabel from "@mui/material/FormControlLabel";
import Selects from "react-select";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SERVICE } from "../../../services/Baseservice";
import axios from "axios";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import CancelIcon from "@mui/icons-material/Cancel";
import { ThreeDots } from "react-loader-spinner";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { MultiSelect } from "react-multi-select-component";
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";

function InternList() {
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

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [employees, setEmployees] = useState([]);
  const [deleteuser, setDeleteuser] = useState([]);
  const [exceldata, setexceldata] = useState([]);
  const [useredit, setUseredit] = useState([]);
  const [employeecodenew, setEmployeecodenew] = useState("");
  const [step, setStep] = useState(1);

  //state and method to show current date onload
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  var hours = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
  var minutes =
    today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes;
  var seconds =
    today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds;
  var time = hours + ":" + minutes + ":" + seconds;

  //useStates
  const [date, setDate] = useState(formattedDate);

  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const [checkemployeelist, setcheckemployeelist] = useState(false);
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [maxSelections, setMaxSelections] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "InternList.png");
        });
      });
    }
  };

  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => {
    setisDeleteOpen(true);
  };
  const handleCloseDel = () => {
    setisDeleteOpen(false);
  };
  //close internship model
  const [isCloseInternshipOpen, setisCloseInternshipOpen] = useState(false);
  const handleClickOpenInternship = () => {
    setisCloseInternshipOpen(true);
  };
  const handleCloseInternship = () => {
    setisCloseInternshipOpen(false);
    setUseredit([]);
  };

  //edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setDateOfJoining(date);
    setEmployeecodenew("");
  };

  // for work mode
  const workmodeOptions = [
    { label: "Remote", value: "Remote" },
    { label: "Office", value: "Office" },
  ];

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
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
    shift: true,
    experience: true,
    doj: true,
    checkbox: true,
    profileimage: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  let userid = deleteuser?._id;

  //set function to get particular row
  const [checkProject, setCheckProject] = useState();
  const [checkTask, setCheckTask] = useState();

  const rowData = async (id, username) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteuser(res?.data?.suser);
      let resdev = await axios.post(SERVICE.USERPROJECTCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkprojectouser: String(username),
      });
      setCheckProject(resdev?.data?.projects);

      let restask = await axios.post(SERVICE.USERTTASKCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkusertotask: String(username),
      });
      setCheckTask(restask?.data?.tasks);

      if (
        resdev?.data?.projects?.length > 0 ||
        restask?.data?.tasks?.length > 0
      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpendel();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  let userId = localStorage?.LoginUserId;

  //get all employees list details
  const fetchEmployee = async () => {
    try {
      const [res_employee] = await Promise.all([
        axios.post(SERVICE.USERSWITHSTATUS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          pageName: "Internship",
        }),
      ]);
      setcheckemployeelist(true);
      setEmployees(res_employee?.data?.allusers);
      const [resImages] = await Promise.all([
        axios.get(SERVICE.GETPROFILES, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let empDocs = resImages?.data?.alldocuments;

      let showData = res_employee?.data?.allusers?.map((data) => {
        let foundData = empDocs?.find((item) => item?.commonid == data?._id);
        if (foundData) {
          return {
            ...data,
            profileimage: foundData?.profileimage,
          };
        } else {
          return {
            ...data,
            profileimage: "",
          };
        }
      });

      setcheckemployeelist(true);
      setEmployees(showData);
    } catch (err) {
      setcheckemployeelist(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delAddemployee = async () => {
    try {
      let del = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchEmployee();
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  let updateby = useredit?.updatedby;
  let addedby = useredit?.addedby;
  const closeInternship = async () => {
    try {
      let employees_data = await axios.put(
        `${SERVICE.UPDATE_INTERN}/${useredit?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          resonablestatus: String("Internship Closed"),
          internstatus: String("Closed"),

          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        }
      );
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseInternship();
      await fetchEmployee();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUseredit(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const getinfoCodeIntern = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUseredit(res?.data?.suser);
      handleClickOpenInternship();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [userUpdate, setUserUpdate] = useState([]);
  const [updatedBy, setUpdatedBy] = useState([]);
  const [dateOfJoining, setDateOfJoining] = useState(date);
  const [internStatusUpdate, setInternStatusUpdate] = useState({
    workmode: "Please Select Work Mode",
    doj: date,
    empcode: "",
    wordcheck: "",
  });
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Please Select Primary Work Station"
  );
  const [overllsettings, setOverallsettings] = useState([]);
  const [overllsettingsDefault, setOverallsettingsDefault] = useState({});
  const [branchCodeGen, setBranchCodeGen] = useState("");
  const [branchNames, setBranchNames] = useState([]);
  const [empCode, setEmpCode] = useState([]);

  const [empsettings, setEmpsettings] = useState(false);
  const fetchOverAllSettings = async (comp, branc) => {
    try {
      let res = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverallsettingsDefault(res?.data?.overallsettings[0]);
      let filter = res?.data?.overallsettings[0].todos.filter(
        (item) => item.branch.includes(branc) && item.company == comp
      );
      setOverallsettings(filter);
      setEmpsettings(res?.data?.overallsettings[0].empdigits);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchUserDatas = async (selectedBranch) => {
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

      const branchCode = branchNames?.filter(
        (item) => item.name === selectedBranch
      );

      setBranchCodeGen(branchCode[0].code);
      setEmpCode(ALLusers);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchUserDatasOnChange = async (selectedBranch, company) => {
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

      let filteredsssssData = overllsettingsDefault?.todos?.filter(
        (item) =>
          item.branch.includes(selectedBranch) && item.company == company
      );
      setOverallsettings(filteredsssssData);

      const branchCode = branchNames?.filter(
        (item) => item.name === selectedBranch
      );

      setBranchCodeGen(branchCode[0].code);
      setEmpCode(ALLusers);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchUser = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setreportingtonames(req.data.users);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // auto id for employee code
  let autodate = dateOfJoining.split("-");
  let dateJoin = autodate[0]?.slice(-2) + autodate[1] + autodate[2];

  let newval =
    empsettings === true && overllsettings?.length > 0
      ? branchCodeGen.toUpperCase() +
        (dateJoin === undefined ? "" : dateJoin) +
        overllsettings[0]?.empcodedigits
      : branchCodeGen.toUpperCase() +
        (dateJoin === undefined ? "" : dateJoin) +
        "001";

  useEffect(() => {
    var filteredWorks;
    if (userUpdate.unit === "" && userUpdate.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === userUpdate.company && u.branch === userUpdate.branch
      );
    } else if (userUpdate.unit === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === userUpdate.company &&
          u.branch === userUpdate.branch &&
          u.floor === userUpdate.floor
      );
    } else if (userUpdate.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === userUpdate.company &&
          u.branch === userUpdate.branch &&
          u.unit === userUpdate.unit
      );
    } else {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === userUpdate.company &&
          u.branch === userUpdate.branch &&
          u.unit === userUpdate.unit &&
          u.floor === userUpdate.floor
      );
    }
    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos?.length > 0
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
  }, [userUpdate]);

  const [selectedWorkStation, setSelectedWorkStation] = useState("");
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );
  let [valueWorkStation, setValueWorkStation] = useState("");

  const handleWorkStationChange = (options) => {
    // If employeecount is greater than 0, limit the selections
    if (maxSelections > 0) {
      // Limit the selections to the maximum allowed
      options = options.slice(0, maxSelections - 1);
    }

    // Update the disabled property based on the current selections and employeecount
    const updatedOptions = filteredWorkStation.map((option) => ({
      ...option,
      disabled:
        maxSelections - 1 > 0 &&
        options?.length >= maxSelections - 1 &&
        !options.find(
          (selectedOption) => selectedOption.value === option.value
        ),
    }));

    setValueWorkStation(options.map((a, index) => a.value));
    setSelectedOptionsWorkStation(options);
    setFilteredWorkStation(updatedOptions);
  };
  const customValueRendererWorkStation = (
    valueWorkStation,
    _filteredWorkStation
  ) => {
    return valueWorkStation?.length ? (
      valueWorkStation.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Secondary Work Station
      </span>
    );
  };

  const [empcodelimited, setEmpCodeLimited] = useState([]);
  // get settings data
  const fetchUserDatasLimitedEmpcodeCreate = async (selectedBranch) => {
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

  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos?.length > 0
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

  const [companyOption, setCompanyOption] = useState([]);

  const fetchCompany = async () => {
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompanyOption([
        ...res?.data?.companies?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [unitsOption, setUnitsOption] = useState([]);
  const fetchUnit = async () => {
    try {
      let res_category = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const units = res_category.data.units.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setUnitsOption(units);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [teamsOption, setTeamsOption] = useState([]);
  const fetchTeam = async () => {
    try {
      let res_category = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const teams = res_category.data.teamsdetails.map((d) => ({
        ...d,
        label: d.teamname,
        value: d.teamname,
      }));
      setTeamsOption(teams);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [floorOption, setFloorOption] = useState([]);
  //get all floor.
  const fetchFloorAll = async () => {
    try {
      let res_location = await axios.get(SERVICE.FLOOR, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setFloorOption([
        ...res_location?.data?.floors?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [areaOption, setAreaOption] = useState([]);
  //get locations
  const fetchAreaGrouping = async () => {
    try {
      let res_location = await axios.get(SERVICE.AREAGROUPING, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setAreaOption(res_location?.data?.areagroupings);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [departmentOption, setDepartmentOption] = useState([]);

  const fetchDepartmentAll = async () => {
    try {
      let res_deptandteam = await axios.get(SERVICE.DEPARTMENT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      setDepartmentOption([
        ...res_deptandteam?.data?.departmentdetails?.map((t) => ({
          ...t,
          label: t.deptname,
          value: t.deptname,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [designation, setDesignation] = useState([]);

  const fetchDepartmentandesignation = async () => {
    try {
      let res_status = await axios.get(
        SERVICE.DEPARTMENTANDDESIGNATIONGROUPING,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDesignation(
        res_status?.data?.departmentanddesignationgroupings?.map((data) => ({
          ...data,
          label: data.designation,
          value: data.designation,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBoardingDetails({
        ...boardingDetails,
        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        floor:
          res?.data?.suser?.floor === "" ||
          res?.data?.suser?.floor === undefined
            ? "Please Select Floor"
            : res?.data?.suser?.floor,
        area:
          res?.data?.suser?.area === "" || res?.data?.suser?.area === undefined
            ? "Please Select Area"
            : res?.data?.suser?.area,
        department:
          res?.data?.suser?.department === "" ||
          res?.data?.suser?.department === undefined
            ? "Please Select Department"
            : res?.data?.suser?.department,
        team:
          res?.data?.suser?.team === "" || res?.data?.suser?.team === undefined
            ? "Please Select Team"
            : res?.data?.suser?.team,
        designation:
          res?.data?.suser?.designation === "" ||
          res?.data?.suser?.designation === undefined
            ? "Please Select Designation"
            : res?.data?.suser?.designation,
        shiftgrouping:
          res?.data?.suser?.shiftgrouping === "" ||
          res?.data?.suser?.shiftgrouping === undefined
            ? "Please Select Shift Grouping"
            : res?.data?.suser?.shiftgrouping,
        shifttiming:
          res?.data?.suser?.shifttiming === "" ||
          res?.data?.suser?.shifttiming === undefined
            ? "Please Select Shift Timing"
            : res?.data?.suser?.shifttiming,
        reportingto: res?.data?.suser?.reportingto,
      });
      ShiftDropdwonsSecond({ value: res?.data?.suser?.shiftgrouping });
      setValueCate(res?.data?.suser?.weekoff);
      setSelectedOptionsCate([
        ...res?.data?.suser?.weekoff.map((t) => ({
          label: t,
          value: t,
        })),
      ]);
      setUserUpdate(res?.data?.suser);
      setUpdatedBy(res?.data?.suser?.updatedby);
      setInternStatusUpdate(res?.data?.suser);
      setPrimaryWorkStation(res?.data?.suser?.workstation[0]);
      const employeeCount = res?.data?.suser.employeecount || 0;
      setMaxSelections(employeeCount);
      setSelectedWorkStation(
        res?.data?.suser?.workstation.slice(
          1,
          res?.data?.suser?.workstation?.length
        )
      );
      setSelectedOptionsWorkStation(
        Array.isArray(res?.data?.suser?.workstation)
          ? res?.data?.suser?.workstation
              .slice(1, res?.data?.suser?.workstation?.length)
              ?.map((x) => ({
                ...x,
                label: x,
                value: x,
              }))
          : []
      );
      const branchCode = branchNames?.filter(
        (item) => item.name === res?.data?.suser?.branch
      );

      setBranchCodeGen(branchCode[0].code);
      await fetchOverAllSettings(
        res?.data?.suser?.company,
        res?.data?.suser?.branch
      );
      await fetchUserDatas(res?.data?.suser?.branch);
      await fetchUserDatasLimitedEmpcodeCreate(res?.data?.suser?.branch);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [branchOption, setBranchOption] = useState([]);

  // Branch Dropdowns
  const fetchbranchNames = async () => {
    try {
      let req = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchNames(req?.data?.branch);
      const branchdata = req.data.branch.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setBranchOption(branchdata);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  if (empCode?.length > 0) {
    empCode &&
      empCode.forEach(() => {
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
        let digits = (empCode?.length + 1).toString();
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
          digits?.length < 4 &&
          getlastBeforeChar === "0" &&
          getlastThreeChar === "0"
        ) {
          refNOINC = "00" + refNOINC;
          newval = strings + refNOINC;
        } else if (
          digits?.length < 4 &&
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

    newval =
      branchCodeGen?.toUpperCase() +
      (dateJoin === undefined ? "" : dateJoin) +
      "001";
  }

  const editSubmit = (e) => {
    e.preventDefault();
    if (boardingDetails?.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.team === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.team === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.department === "Please Select Department") {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.designation === "Please Select Designation") {
      setPopupContentMalert("Please Select Designation");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      boardingDetails?.shiftgrouping === "Please Select Shift Grouping"
    ) {
      setPopupContentMalert("Please Select Shift Grouping");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.shifttiming === "Please Select Shift Timing") {
      setPopupContentMalert("Please Select Shift Timing");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.reportingto === "Please Select Reporting To") {
      setPopupContentMalert("Please Select Reporting To");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      internStatusUpdate.workmode === "" ||
      internStatusUpdate.workmode === "Please Select Work Mode" ||
      internStatusUpdate.workmode === "Internship"
    ) {
      setPopupContentMalert("Please Select Work Mode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (dateOfJoining === "") {
      setPopupContentMalert("Please Choose Date of Joining");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (internStatusUpdate.wordcheck && employeecodenew === "") {
      setPopupContentMalert("Please Enter Employee Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      internStatusUpdate.wordcheck &&
      empcodelimited.includes(employeecodenew.slice(-3))
    ) {
      setPopupContentMalert("Employee Code Already Exists");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const [boardingDetails, setBoardingDetails] = useState({
    status: "Please Select Status",
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    department: "Please Select Department",
    team: "Please Select Team",
    designation: "Please Select Designation",
    shiftgrouping: "Please Select Shift Grouping",
    shifttiming: "Please Select Shift Timing",
    reportingto: "Please Select Reporting To",
  });

  const [ShiftGroupingOptions, setShiftGroupingOptions] = useState([]);
  const [ShiftOptions, setShiftOptions] = useState([]);

  // days
  const weekdays = [
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
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Week Off Days";
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
      let ansGet = e ? e?.value : boardingDetails?.shiftgrouping;
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

      setShiftOptions(
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

  const [reportingtonames, setreportingtonames] = useState([]);

  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.UPDATE_INTERN}/${userUpdate?._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        company: String(boardingDetails.company),
        branch: String(boardingDetails.branch),
        unit: String(boardingDetails.unit),
        team: String(boardingDetails.team),
        floor: String(
          boardingDetails.floor === "Please Select Floor"
            ? ""
            : boardingDetails.floor
        ),
        area: String(
          boardingDetails.area === "Please Select Area"
            ? ""
            : boardingDetails.area
        ),
        department: String(boardingDetails.department),
        designation: String(boardingDetails.designation),
        shiftgrouping: String(boardingDetails.shiftgrouping),
        shifttiming: String(boardingDetails.shifttiming),
        reportingto: String(boardingDetails.reportingto),
        weekoff: [...valueCate],

        internstatus: String("Moved"),
        doj: String(dateOfJoining),
        workmode: String(internStatusUpdate.workmode),
        wordcheck: Boolean(internStatusUpdate.wordcheck),
        empcode: String(
          internStatusUpdate.wordcheck === true ? employeecodenew : newval
        ),

        workstation:
          internStatusUpdate.workmode !== "Remote"
            ? valueWorkStation?.length === 0
              ? [primaryWorkStation]
              : [primaryWorkStation, ...valueWorkStation]
            : ["WFH"],

        boardingLog: [
          ...userUpdate?.boardingLog,
          {
            username: String(userUpdate.companyname),
            company: String(boardingDetails.company),
            branch: String(boardingDetails.branch),
            unit: String(boardingDetails.unit),
            team: String(boardingDetails.team),
            shifttiming: String(boardingDetails.shifttiming),
            shiftgrouping: String(boardingDetails.shiftgrouping),
            process: String(boardingDetails.process),
            startdate: String(dateOfJoining),
            time: String(time),
          },
        ],
        designationlog: [
          ...userUpdate?.designationlog,
          {
            username: String(userUpdate.companyname),
            designation: String(boardingDetails.designation),
            startdate: String(dateOfJoining), // Fixed the field names
            time: String(time),
            branch: String(boardingDetails.branch), // Fixed the field names
            unit: String(boardingDetails.unit),
            team: String(boardingDetails.team),
          },
        ],

        departmentlog: [
          ...userUpdate?.departmentlog,
          {
            userid: String(boardingDetails.empcode),
            username: String(userUpdate.companyname),
            department: String(boardingDetails.department),
            startdate: String(dateOfJoining),
            time: String(time),
            branch: String(boardingDetails.branch),
            unit: String(boardingDetails.unit),
            team: String(boardingDetails.team),
            // status: String(departmentlog.status),
          },
        ],
        updatedby: [
          ...updatedBy,
          {
            name: String(isUserRoleAccess?.username),
            date: String(new Date()),
          },
        ],
      });
      setDateOfJoining(date);
      setEmployeecodenew("");
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchEmployee();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // Define columns
      worksheet.columns = [
        { header: "S.No", key: "serial", width: 10 },
        { header: "Status", key: "status", width: 15 },
        { header: "Empcode", key: "empcode", width: 15 },
        { header: "Employeename", key: "companyname", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Branch", key: "branch", width: 20 },
        { header: "Unit", key: "unit", width: 20 },
        { header: "Experience", key: "experience", width: 20 },
        { header: "DOJ", key: "doj", width: 20 },
        { header: "Image", key: "image", width: 30 },
      ];

      // Style header row
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
          status: item.status || "",
          empcode: item.empcode || "",
          companyname: item.companyname || "",
          username: item.username || "",
          email: item.email || "",
          branch: item.branch || "",
          unit: item.unit || "",
          experience: item.experience || "",
          doj: item.doj || "",
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
            tl: { col: 9, row: rowIndex - 1 },
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
    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(dataToExport, "Intern List");
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "S.No", field: "serialNumber" },
    { title: "Status", field: "status" },
    { title: "Empcode", field: "empcode" },
    { title: "Employee Name", field: "companyname" },
    { title: "Username", field: "username" },
    { title: "Email", field: "email" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Experience", field: "experience" },
    { title: "DOJ", field: "doj" },
    { title: "Image", field: "imageBase64" },
  ];

  const downloadPdf = async (isfilter) => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.title);
    const tableRows = [];
    const imagesToLoad = [];

    let datatoPdf = isfilter === "filtered" ? filteredData : items;

    datatoPdf.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.status || "",
        item.empcode || "",
        item.companyname || "",
        item.username || "",
        item.email || "",
        item.branch || "",
        item.unit || "",
        item.experience || "",
        item.doj || "",
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

    doc.save("Intern List.pdf");
  };

  // Excel
  const fileName = "InternList";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Intern List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEmployee();
    fetchUser();
    fetchWorkStation();
    fetchbranchNames();
    fetchCompany();
    fetchUnit();
    fetchTeam();
    fetchFloorAll();
    fetchAreaGrouping();
    fetchDepartmentAll();
    fetchDepartmentandesignation();
    ShiftGroupingDropdwons();
  }, []);

  const calculateExperience = (doj) => {
    const startDate = new Date(doj);
    const currentDate = new Date();
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += currentDate.getMonth();
    return Math.max(0, months);
  };

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => {
      return {
        _id: item._id,
        serialNumber: index + 1,
        status: item.status || "",
        empcode: item.empcode || "",
        nexttime: item.nexttime,
        companyname: item.companyname || "",
        username: item.username || "",
        email: item.email || "",
        branch: item.branch || "",
        unit: item.unit || "",
        shift: item.shift,
        team: item.team || "",
        internstatus: item.internstatus,
        experience: calculateExperience(item.doj),
        doj: item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
        profileimage: item?.profileimage,
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

  //table sorting

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
            if (rowDataTable?.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }

            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable?.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows?.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows?.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows?.length === filteredData?.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 90,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      renderCell: (params) => renderStatus(params?.row.status),
      hide: !columnVisibility.status,
    },

    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
      renderCell: (params) => (
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
                handleCopy("Copied Empcode!");
              }}
              options={{ message: "Copied Empcode!" }}
              text={params?.row?.empcode}
            >
              <ListItemText primary={params?.row?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
      renderCell: (params) => (
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
                handleCopy("Copied Employee Name!");
              }}
              options={{ message: "Copied Employee Name!" }}
              text={params?.row?.companyname}
            >
              <ListItemText primary={params?.row?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
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
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "doj",
      headerName: "DOJ",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.doj,
    },
    {
      field: "profileimage",
      headerName: "Profile",
      flex: 0,
      width: 100,
      hide: !columnVisibility.profileimage,
      headerClassName: "bold-header",
      renderCell: (params) => {
        // Define how you want to render the cell here
        // Example: return an image

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
      width: 430,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <>
          {!isUserRoleCompare.includes("Manager") ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes("einternlist") && (
                    <a
                      href={`/internedit/${params.row.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        style={userStyle.actionbutton}
                      >
                        <EditIcon style={{ fontSize: "20px" }} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("dinternlist") && (
                    <Link to="">
                      <Button
                        size="small"
                        variant="outlined"
                        style={userStyle.actionbutton}
                        onClick={(e) => {
                          rowData(params.row.id, params.row.username);
                        }}
                      >
                        <DeleteIcon style={{ fontSize: "20px" }} />
                      </Button>
                    </Link>
                  )}
                  {isUserRoleCompare?.includes("vinternlist") && (
                    <a
                      href={`/view/${params.row.id}/intern`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        style={userStyle.actionbutton}
                      >
                        <VisibilityIcon style={{ fontSize: "20px" }} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("iinternlist") && (
                    <Link to="">
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          // handleClickOpeninfo();
                          getinfoCode(params.row.id);
                        }}
                      >
                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
                      </Button>
                    </Link>
                  )}

                  {/* {isUserRoleCompare?.includes("einternlist") &&
                    params?.row?.internstatus != "Closed" && (
                    
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          handleClickOpenEdit();
                          getCode(params.row.id);
                        }}
                        title="Move to Live"
                      >
                        Live
                      </Button>
                      
                    )} */}
                  {isUserRoleCompare?.includes("einternlist") &&
                    params?.row?.internstatus != "Closed" && (
                      <Link
                        to={`/movetolive/${params.row.id}`}
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        <Button
                          sx={userStyle.actionbutton}
                          onClick={() => {
                            handleClickOpenEdit();
                            getCode(params.row.id);
                          }}
                          title="Move to Live"
                        >
                          Move to Live
                        </Button>
                      </Link>
                    )}

                  {isUserRoleCompare?.includes("einternlist") &&
                    params?.row?.internstatus != "Closed" && (
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          // handleClickOpenInternship();
                          getinfoCodeIntern(params.row.id);
                        }}
                        title="Close Internship"
                      >
                        <CancelIcon
                          style={{ fontsize: "large", color: "red" }}
                        />
                      </Button>
                    )}
                  {isUserRoleCompare?.includes("einternlist") &&
                    params?.row?.internstatus == "Closed" && (
                      <Button
                        variant="contained"
                        style={{
                          padding: "5px",
                          background: "red",
                          color: "white",
                          fontSize: "10px",
                          width: "70px",
                          fontWeight: "bold",
                        }}
                      >
                        Closed
                      </Button>
                    )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("vinternlist") && (
                  <Link
                    to={`/view/${params.row.id}/intern`}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      style={userStyle.actionbutton}
                    >
                      <VisibilityIcon style={{ fontSize: "20px" }} />
                    </Button>
                  </Link>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      status: item.status,
      empcode: item.empcode,
      nexttime: item.nexttime,
      companyname: item.companyname,
      username: item.username,
      email: item.email,
      branch: item.branch,
      unit: item.unit,
      shift: item.shift,
      internstatus: item.internstatus,
      experience: item.experience,
      doj: item.doj,
      profileimage: item.profileimage,
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

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"INTERN LIST"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Intern Details</Typography>
      <br />
      {isUserRoleCompare?.includes("linternlist") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Intern List
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {isUserRoleCompare?.includes("ainternlist") && (
                  <>
                    <Link
                      to="/intern/create"
                      style={{
                        textDecoration: "none",
                        color: "white",
                        float: "right",
                      }}
                    >
                      <Button variant="contained">ADD</Button>
                    </Link>
                  </>
                )}
              </Grid>
            </Grid>
            <br />
            <br />
            <Box>
              {checkemployeelist ? (
                <>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <Grid>
                      {isUserRoleCompare?.includes("excelinternlist") && (
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
                      {isUserRoleCompare?.includes("csvinternlist") && (
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
                      {isUserRoleCompare?.includes("printinternlist") && (
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
                      {isUserRoleCompare?.includes("pdfinternlist") && (
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
                      {isUserRoleCompare?.includes("imageinternlist") && (
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
                  <br />
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
                      </Box>
                    </Grid>
                  </Grid>
                  <br />
                  <Box
                    style={{
                      width: "100%",
                      overflowY: "hidden", // Hide the y-axis scrollbar
                    }}
                  >
                    <StyledDataGrid
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
                      rowHeight={100}
                    />
                  </Box>
                  <br />
                  <Box style={userStyle.dataTablestyle}>
                    <Box>
                      Showing{" "}
                      {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                      to {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
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
                </>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress color="inherit" />  */}
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

      {/*Close Internship DIALOG */}
      <Dialog
        open={isCloseInternshipOpen}
        onClose={handleCloseInternship}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            {" "}
            Are you sure? Dou you want Close Internship for{" "}
            {useredit?.companyname}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseInternship}
            variant="contained"
            color="error"
          >
            {" "}
            No
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="primary"
            onClick={(e) => {
              closeInternship();
            }}
          >
            {" "}
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Check Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog
              open={isCheckOpen}
              onClose={handleCloseCheck}
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
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "80px", color: "orange" }}
                />

                <Typography
                  variant="h6"
                  sx={{ color: "black", textAlign: "center" }}
                >
                  {checkProject?.length > 0 && checkTask?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deleteuser?.username} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Project & Task</span>{" "}
                    </>
                  ) : checkProject?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deleteuser?.username} `}</span>{" "}
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Project</span>
                    </>
                  ) : checkTask?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deleteuser?.username} `}</span>{" "}
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Task</span>
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseCheck}
                  autoFocus
                  variant="contained"
                  color="error"
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      </Box>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                SI.NO
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Empcode
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Employee Name
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Username
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Branch
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Unit
              </TableCell>

              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Experience
              </TableCell>
              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                DOJ
              </TableCell>

              <TableCell sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
                Image
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.status} </TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.companyname}</TableCell>
                  <StyledTableCell>{row.username} </StyledTableCell>
                  <TableCell> {row.email}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>

                  <StyledTableCell>{row.experience} </StyledTableCell>
                  <TableCell> {row.doj}</TableCell>

                  <TableCell>
                    {row?.profileimage ? (
                      <img
                        src={row?.profileimage}
                        style={{ height: "100px", width: "100px" }}
                      />
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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

      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
          // sx={{
          //   overflow: "visible",
          //   "& .MuiPaper-root": {
          //     overflow: "visible",
          //   },
          // }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Intern Status Update
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
                      options={companyOption}
                      placeholder="Please Select Company"
                      value={{
                        label: boardingDetails.company,
                        value: boardingDetails.company,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          team: "Please Select Team",
                        });
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
                      options={branchOption
                        ?.filter((u) => u.company === boardingDetails.company)
                        .map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      placeholder="Please Select Company"
                      value={{
                        label: boardingDetails.branch,
                        value: boardingDetails.branch,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          team: "Please Select Team",
                        });
                        fetchUserDatasOnChange(
                          e.value,
                          boardingDetails.company
                        );
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
                      maxMenuHeight={300}
                      options={unitsOption
                        ?.filter((u) => u.branch === boardingDetails.branch)
                        .map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      placeholder="Please Select Unit"
                      value={{
                        label: boardingDetails.unit,
                        value: boardingDetails.unit,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          unit: e.value,
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          team: "Please Select Team",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={teamsOption
                        ?.filter(
                          (u) =>
                            u.unit === boardingDetails.unit &&
                            u.branch === boardingDetails.branch
                        )
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      placeholder="Please Select Unit"
                      value={{
                        label: boardingDetails.team,
                        value: boardingDetails.team,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          team: e.value,
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Floor</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={floorOption
                        ?.filter((u) => u.branch === boardingDetails.branch)
                        .map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      placeholder="Please Select Floor"
                      value={{
                        label: boardingDetails.floor,
                        value: boardingDetails.floor,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          floor: e.value,
                          area: "Please Select Area",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Area</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={[
                        ...new Set(
                          areaOption
                            .filter(
                              (u) =>
                                u.branch === boardingDetails.branch &&
                                u.unit === boardingDetails.unit &&
                                u.floor === boardingDetails.floor
                            )
                            .flatMap((item) => item.area)
                        ),
                      ].map((location) => ({
                        label: location,
                        value: location,
                      }))}
                      placeholder="Please Select Floor"
                      value={{
                        label: boardingDetails.area,
                        value: boardingDetails.area,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          area: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={departmentOption}
                      placeholder="Please Select Department"
                      value={{
                        label: boardingDetails.department,
                        value: boardingDetails.department,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          department: e.value,
                          designation: "Please Select Designation",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Designation <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={designation?.filter(
                        (item) => item.department === boardingDetails.department
                      )}
                      placeholder="Please Select Designation"
                      value={{
                        label: boardingDetails.designation,
                        value: boardingDetails.designation,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          designation: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <Typography>
                    Shift Grouping<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={ShiftGroupingOptions}
                      label="Please Select Shift Group"
                      value={{
                        label: boardingDetails.shiftgrouping,
                        value: boardingDetails.shiftgrouping,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          shiftgrouping: e.value,
                          shifttiming: "Please Select Shift Timing",
                        });
                        ShiftDropdwonsSecond(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Shift Timing<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={ShiftOptions}
                      label="Please Select Shift"
                      value={{
                        label: boardingDetails.shifttiming,
                        value: boardingDetails.shifttiming,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          shifttiming: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
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
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reporting To <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      labelId="demo-select-small"
                      id="demo-select-small"
                      options={
                        reportingtonames &&
                        reportingtonames.map((row) => ({
                          label: row.companyname,
                          value: row.companyname,
                        }))
                      }
                      value={{
                        label: boardingDetails.reportingto,
                        value: boardingDetails.reportingto,
                      }}
                      onChange={(e) => {
                        setBoardingDetails({
                          ...boardingDetails,
                          reportingto: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Work Mode <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={workmodeOptions}
                      placeholder="Please Select Work Mode"
                      value={{
                        label:
                          internStatusUpdate.workmode === "Internship"
                            ? "Please Select Work Mode"
                            : internStatusUpdate.workmode,
                        value:
                          internStatusUpdate.workmode === "Internship"
                            ? "Please Select Work Mode"
                            : internStatusUpdate.workmode,
                      }}
                      onChange={(e) => {
                        setInternStatusUpdate((prev) => ({
                          ...internStatusUpdate,
                          workmode: e.value,
                        }));
                        setSelectedOptionsWorkStation([]);
                        setValueWorkStation([]);
                        setPrimaryWorkStation(
                          "Please Select Primary Work Station"
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                {internStatusUpdate.workmode !== "Remote" ? (
                  <>
                    {" "}
                    <Grid item md={6} sm={12} xs={12}>
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
                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)</Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt.filter(
                            (item) => item.value !== primaryWorkStation
                          )}
                          value={selectedOptionsWorkStation}
                          onChange={handleWorkStationChange}
                          valueRenderer={customValueRendererWorkStation}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <Grid item md={6} sm={12} xs={12}>
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
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Doj<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={dateOfJoining}
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          setDateOfJoining(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  {internStatusUpdate.wordcheck === true ? (
                    <FormControl size="small" fullWidth>
                      <Typography>
                        EmpCode(Manual) <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        // disabled
                        placeholder="EmpCode"
                        // value={employee.empcode}
                        value={employeecodenew}
                        onChange={(e) => setEmployeecodenew(e.target.value)}
                      />
                    </FormControl>
                  ) : (
                    <FormControl size="small" fullWidth>
                      <Typography>
                        EmpCode(Auto) <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="EmpCode"
                        value={
                          userUpdate.wordcheck === false
                            ? newval
                            : internStatusUpdate?.empcode
                        }
                      />
                    </FormControl>
                  )}
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={userUpdate.wordcheck === true}
                            checked={internStatusUpdate.wordcheck === true}
                          />
                        }
                        onChange={(e) => {
                          setInternStatusUpdate({
                            ...internStatusUpdate,
                            wordcheck: !internStatusUpdate.wordcheck,
                          });
                        }}
                        label="Enable Empcode"
                      />
                    </FormGroup>
                  </Grid>
                  {/* {errorsLog.empcode && <div>{errorsLog.empcode}</div>} */}
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
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
              // fetchProductionClientRateArray();
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
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="InternList Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseDel}
        onConfirm={delAddemployee}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default InternList;
