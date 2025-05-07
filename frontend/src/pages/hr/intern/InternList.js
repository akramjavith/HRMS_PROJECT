import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningIcon from "@mui/icons-material/Warning";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, Chip, DialogActions, DialogContent, FormControl, FormGroup, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import axios from "axios";
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import domtoimage from 'dom-to-image';
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell } from "../../../components/Table";
import { AuthContext, UserRoleAccessContext, } from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import EmployeeExportData from "../../../components/EmployeeExport";

function InternList() {

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
  const [isLoading, setIsLoading] = useState(false);

  const exportColumnNames = [
    "SNo",
    "Status",
    "Empcode",
    "Employee Name",
    "Username",
    "Email",
    "Branch",
    "Unit",
    "Team",
    "Experience",
    "DOJ",
    "Work Mode",
    "Religion",
    "Image",
  ];
  const exportRowValues = [
    "serialNumber",
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
    "religion",
    "imageBase64",
  ];
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
      pagename: String("Intern List"),
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

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [maxSelections, setMaxSelections] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Intern List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
    team: true,
    shift: true,
    experience: true,
    doj: true,
    religion: true,
    expmode: true,
    expval: true,
    endexp: true,
    endexpdate: true,
    endtar: true,
    endtardate: true,
    checkbox: true,
    profileimage: true,
    workmode: true,
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const delAddemployee = async () => {
    try {
      let del = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchListData();
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleCloseDel();
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
      await fetchListData();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleClickOpenEdit();
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.team === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.team === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.department === "Please Select Department") {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.designation === "Please Select Designation") {
      setPopupContentMalert("Please Select Designation");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      boardingDetails?.shiftgrouping === "Please Select Shift Grouping"
    ) {
      setPopupContentMalert("Please Select Shift Grouping");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.shifttiming === "Please Select Shift Timing") {
      setPopupContentMalert("Please Select Shift Timing");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (boardingDetails?.reportingto === "Please Select Reporting To") {
      setPopupContentMalert("Please Select Reporting To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      internStatusUpdate.workmode === "" ||
      internStatusUpdate.workmode === "Please Select Work Mode" ||
      internStatusUpdate.workmode === "Internship"
    ) {
      setPopupContentMalert("Please Select Work Mode");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (dateOfJoining === "") {
      setPopupContentMalert("Please Choose Date of Joining");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (internStatusUpdate.wordcheck && employeecodenew === "") {
      setPopupContentMalert("Please Enter Employee Code");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      internStatusUpdate.wordcheck &&
      empcodelimited.includes(employeecodenew.slice(-3))
    ) {
      setPopupContentMalert("Employee Code Already Exists");
      setPopupSeverityMalert("warning");
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      await fetchListData();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
    setIsLoading(false);
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
        { header: "SNo", key: "serial", width: 10 },
        { header: "Status", key: "status", width: 15 },
        { header: "Empcode", key: "empcode", width: 15 },
        { header: "Employeename", key: "companyname", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Branch", key: "branch", width: 20 },
        { header: "Unit", key: "unit", width: 20 },
        { header: "Experience", key: "experience", width: 20 },
        { header: "DOJ", key: "doj", width: 20 },
        { header: "Religion", key: "religion", width: 20 },
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
          religion: item.religion || "",
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
    { title: "SNo", field: "serialNumber" },
    { title: "Status", field: "status" },
    { title: "Empcode", field: "empcode" },
    { title: "Employee Name", field: "companyname" },
    { title: "Username", field: "username" },
    { title: "Email", field: "email" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Experience", field: "experience" },
    { title: "DOJ", field: "doj" },
    { title: "Religion", field: "religion" },
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
        item.religion || "",
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
    // fetchEmployee();
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

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(employees);
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
      width: 90,
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

      cellRenderer: (params) => renderStatus(params?.data.status),
      hide: !columnVisibility.status,
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },

    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
      pinned: "left",

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
                handleCopy("Copied Empcode!");
              }}
              options={{ message: "Copied Empcode!" }}
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
      headerName: "Employee Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
      pinned: "left",
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
                handleCopy("Copied Employee Name!");
              }}
              options={{ message: "Copied Employee Name!" }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
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
      headerName: "DOJ",
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
    {
      field: "religion",
      headerName: "Religion",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.religion,
    },
    {
      field: "expmode",
      headerName: "Mode",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.expmode,
    },
    {
      field: "expval",
      headerName: "Value",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.expval,
    },
    {
      field: "endexp",
      headerName: "End Exp",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.endexp,
    },
    {
      field: "endexpdate",
      headerName: "End-Exp Date",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.endexpdate,
    },
    {
      field: "endtar",
      headerName: "End Tar",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.endtardate,
    },
    {
      field: "endtardate",
      headerName: "End-Tar Date",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.endtardate,
    },
    {
      field: "profileimage",
      headerName: "Profile",
      flex: 0,
      width: 100,
      hide: !columnVisibility.profileimage,
      headerClassName: "bold-header",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => {
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <>
          {!isUserRoleCompare.includes("Manager") ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes("einternlist") && (
                    <a
                      href={`/internedit/${params.data.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" style={userStyle.actionbutton}>
                        <EditIcon sx={buttonStyles.buttonedit} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("dinternlist") && (
                    <Link to="">
                      <Button
                        size="small"
                        style={userStyle.actionbutton}
                        onClick={(e) => {
                          rowData(params.data.id, params.data.username);
                        }}
                      >
                        <DeleteIcon sx={buttonStyles.buttondelete} />
                      </Button>
                    </Link>
                  )}
                  {isUserRoleCompare?.includes("vinternlist") && (
                    <a
                      href={`/view/${params.data.id}/intern`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" style={userStyle.actionbutton}>
                        <VisibilityIcon sx={buttonStyles.buttonview} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("iinternlist") && (
                    <Link to="">
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          // handleClickOpeninfo();
                          getinfoCode(params.data.id);
                        }}
                      >
                        <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                      </Button>
                    </Link>
                  )}

                  {/* {isUserRoleCompare?.includes("einternlist") &&
                    params?.data?.internstatus != "Closed" && (
                    
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          handleClickOpenEdit();
                          getCode(params.data.id);
                        }}
                        title="Move to Live"
                      >
                        Live
                      </Button>
                      
                    )} */}
                  {isUserRoleCompare?.includes("einternlist") &&
                    params?.data?.internstatus != "Closed" && (
                      <Link
                        to={`/movetolive/${params.data.id}`}
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        <Button
                          sx={userStyle.actionbutton}
                          onClick={() => {
                            getCode(params.data.id);
                          }}
                          title="Move to Live"
                        >
                          Move to Live
                        </Button>
                      </Link>
                    )}

                  {isUserRoleCompare?.includes("einternlist") &&
                    params?.data?.internstatus != "Closed" && (
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          getinfoCodeIntern(params.data.id);
                        }}
                        title="Close Internship"
                      >
                        <CancelIcon
                          style={{ fontsize: "large", color: "red" }}
                        />
                      </Button>
                    )}
                  {isUserRoleCompare?.includes("einternlist") &&
                    params?.data?.internstatus == "Closed" && (
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
                    to={`/view/${params.data.id}/intern`}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      style={userStyle.actionbutton}
                    >
                      <VisibilityIcon sx={buttonStyles.buttonview} />
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

  // Create a data data object for the DataGrid
  const rowDataTable = filteredData.map((item) => {
    return {
      ...item,
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
      team: item.team,
      shift: item.shift,
      profileimage: item.profileimage,
      experience: item?.experience,
      expmode: item?.mode,
      expval: item?.value,
      endexp: item?.endexp,
      endexpdate: item?.endexpdate,
      endtar: item?.endtar,
      endtardate: item?.endtardate,
      doj: item?.doj,
      religion: item?.religion || "",
      internstatus: item.internstatus,
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
          company: valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
          branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
          unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
          team: valueTeamCat,
          department: valueDepartmentCat,
          employee: valueEmployeeCat,
          profileimage: true,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setEmployees(response.data.allusers?.map((item, index) => ({ ...item, serialNumber: index + 1 }))?.map((item, index) => {
        const lastExpLog =
          item?.assignExpLog?.length > 0
            ? item.assignExpLog[item.assignExpLog.length - 1]
            : {};
        return {
          ...item,
          _id: item._id,
          serialNumber: item.serialNumber,
          status: item.status || "",
          empcode: item.empcode || "",
          companyname: item.companyname || "",
          username: item.username || "",
          email: item.email || "",
          branch: item.branch || "",
          unit: item.unit || "",
          team: item.team || "",
          experience: calculateExperience(item.doj),
          religion: item.religion ? item.religion : "",
          doj: item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
          dob: item.dob ? moment(item.dob).format("DD-MM-YYYY") : "",
          dot: item.dot ? moment(item.dob).format("DD-MM-YYYY") : "",
          dom: item.dom ? moment(item.dom).format("DD-MM-YYYY") : "",
          mode: lastExpLog.expmode || "",
          value: lastExpLog.expval || "",
          endexp: lastExpLog.endexp || "",
          endexpdate: lastExpLog.endexpdate
            ? moment(lastExpLog.endexpdate).format("DD-MM-YYYY")
            : "",
          endtar: lastExpLog.endtar || "",
          endtardate: lastExpLog.endtardate
            ? moment(lastExpLog.endtardate).format("DD-MM-YYYY")
            : "",
          profileimage: item?.profileimage,
          shift: item.shift,
          internstatus: item.internstatus,
        };
      }));

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
      <NotificationContainer />
      <Headtitle title={"INTERN LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Intern Details"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Intern details"
        subsubpagename="Intern List"
      />
      {isUserRoleCompare?.includes("linternlist") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Intern List Filter
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
                      <Button
                        variant="contained"
                        sx={buttonStyles.buttonsubmit}
                      >
                        ADD
                      </Button>
                    </Link>
                  </>
                )}
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
              </Grid>  <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns</Button><br /> <br />
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
                      rowHeight={80}
                      itemsList={employees}
                    />
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
                  sx={buttonStyles.buttonsubmit}
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
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
                      Branch<b style={{ color: "red" }}>*</b>
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
                  <Button
                    variant="contained"
                    onClick={editSubmit}
                    sx={buttonStyles.buttonsubmit}
                  >
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEdit}
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
      <EmployeeExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        // filteredDataTwo={filteredData ?? []}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={employees ?? []}
        filename={"Intern List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default InternList;