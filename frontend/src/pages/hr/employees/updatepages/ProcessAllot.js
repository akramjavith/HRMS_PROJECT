import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";
import LoadingButton from "@mui/lab/LoadingButton";
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
  Chip
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import FormControlLabel from "@mui/material/FormControlLabel";
import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import MessageAlert from "../../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";

function ProcessAllot() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setUpdateLoader(false);
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setUpdateLoader(false);
    setOpenPopup(false);
  };

  let exportColumnNames = [
    "Company",
    "Branch",
    "Companyname",
    "Role",
    "Department",
    "Unit",
    "Team",
    "Work Mode",
    "Process",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "companyname",
    "role",
    "department",
    "unit",
    "team",
    "workmode",
    "process",
  ];

  const workmodeOptions = [
    { label: 'Remote', value: 'Remote' },
    { label: 'Office', value: 'Office' },
  ];
  const [hours, setHours] = useState("Hrs");
  const [minutes, setMinutes] = useState("Mins");

  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [oldTeam, setOldTeam] = useState("");
  const [newhierarchyTeam, setNewHierarchyTeam] = useState("");
  const [oldTeamData, setOldTeamData] = useState([]);
  const [userReportingToChange, setUserReportingToChange] = useState([]);
  const [oldTeamSupervisor, setoldTeamSupervisor] = useState(false);
  const [newUpdateDataAll, setNewUpdateDataAll] = useState([]);
  const [newDataTeamWise, setNewDataTeamWise] = useState([]);
  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
  }, []);

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

  const [allCompanyUsers, setAllCompanyUsers] = useState([]);
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  const [processAllottedSecond, setProcessAllottedSecond] = useState([]);
  const [processAllottedSecondOld, setProcessAllottedSecondOld] = useState({});
  const [processAllottedSecondID, setProcessAllottedSecondID] = useState([]);
  const [TeamOptions, setTeamOptions] = useState([]);
  const [TeamOptionsSecond, setTeamOptionsSecond] = useState([]);

  const [loginNotAllot, setLoginNotAllot] = useState({
    date: formattedDate,
    company: "Please Select Company",
    process: "Please Select Process",
    processtype: "Primary",
    processduration: "Full",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    time: "00:00",
  });
  const [loginNotAllotOld, setLoginNotAllotOld] = useState();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [loginNotAllotEdit, setLoginNotAllotEdit] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    allUsersData,
    isAssignBranch,
    alldesignation,
    allTeam,
    pageName,
    setPageName,
    buttonStyles,
    allUsersLimit
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [openviewalert, setOpenviewalert] = useState(false);

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

  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };

  const handleCloseviewalert = () => {
    setOpenviewalert(false);
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
          saveAs(blob, "ProcessLog.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

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
      pagename: String("Process Log"),
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

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
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

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
    if (selectedRows.includes(params.row.id)) {
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
    team: true,
    department: true,
    role: true,
    companyname: true,
    process: true,
    workmode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const delGroupcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_CLIENTUSERID}/${item}`, {
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

      await sendRequest();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [ProcessOptions, setProcessOptions] = useState([]);
  const ProcessTeamDropdowns = async (e) => {
    let processTeam = e ? e.value : loginNotAllot.team;
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.ALL_PROCESS_AND_TEAM_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: loginNotAllot.company,
        branch: loginNotAllot.branch,
        unit: loginNotAllot.unit,
        team: processTeam,
      });
      const ans =
        res?.data?.processteam?.length > 0 ? res?.data?.processteam : [];
      setProcessOptions(
        ans.map((data) => ({
          ...data,
          label: data.process,
          value: data.process,
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

  const processTypes = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
  ];
  const processDuration = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  useEffect(() => {
    ProcessTeamDropdowns();
  }, [loginNotAllot]);

  const [allCompanyUsersArray, setAllCompanyUsersArray] = useState([]);

  let singleData = {};
  const sendRequestProcess = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      singleData = res?.data?.suser;
      const requestData = {};

      if (
        singleData?.processlog?.length === 0 &&
        singleData?.processlog?.length !== 0
      ) {
        requestData.processlog = [
          ...singleData.processlog,
          {
            company: String(singleData?.company),
            branch: String(singleData?.branch),
            unit: String(singleData?.unit),
            team: String(singleData?.team),
            empname: String(singleData?.companyname),
            process: String(singleData?.process),
            processtype: String(singleData?.processtype),
            processduration: String(singleData?.processduration),
            date: String(singleData?.doj),
            time: singleData?.time,
          },
        ];
      } else {
        window.open(`/updatepages/processallotlist/${singleData._id}`);
        return;
      }

      const headers = {
        Authorization: `Bearer ${auth.APIToken}`,
      };

      // Use Promise.all to make asynchronous operations concurrent
      await Promise.all([
        // Send the PUT request
        axios.put(`${SERVICE.USER_SINGLE_PWD}/${singleData._id}`, requestData, {
          headers,
        }),
        // Fetch the updated designationlog data
        sendRequest(),
      ]);

      // Redirect after all asynchronous operations are completed
      window.open(`/updatepages/loginnotallotlist/${singleData._id}`);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setLoginNotAllot({
      date: formattedDate,
      company: "Please Select Company",
      process: "Please Select Process",
      processtype: "Primary",
      processduration: "Full",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      time: "00:00",
    });
    setHours("Hrs");
    setMinutes("Mins");
  };

  //Edit model Second...
  const [isEditOpenSecond, setIsEditOpenSecond] = useState(false);
  const handleClickOpenEditSecond = () => {
    setIsEditOpenSecond(true);
  };
  const handleCloseModEditSecond = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenSecond(false);
    setLoginNotAllot({
      date: formattedDate,
      company: "Please Select Company",
      process: "Please Select Process",
      processtype: "Primary",
      processduration: "Full",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      time: "00:00",
    });
    setHours("Hrs");
    setMinutes("Mins");
  };

  // info model

  // get week for month's start to end
  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }


  const [prevLogDates, setPrveLogDates] = useState([])

  //get single row to edit....
  const getCode = async (e, name, employeename) => {
    setPageName(!pageName);
    try {
      const [res] = await Promise.all([
        axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      handleClickOpenEdit();
      setGettingOldDatas(res?.data?.suser);
      setLoginNotAllotEdit(res?.data?.suser);
      let prevLogDates = res?.data?.suser?.processlog?.length > 0 ? res?.data?.suser?.processlog?.map((data) => data?.date) : []
      setPrveLogDates(prevLogDates)
      const BranchUnit = allTeam.filter(
        (d) =>
          d.company === res?.data?.suser?.company &&
          d.branch === res?.data?.suser?.branch &&
          d.unit === res?.data?.suser?.unit &&
          d.department === res?.data?.suser?.department
      );

      const teamall = [
        ...BranchUnit.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];

      setTeamOptions(teamall);

      let res_process = await axios.post(SERVICE.ALL_PROCESS_AND_TEAM_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        team: res?.data?.suser?.team,
      });
      const ans =
        res_process?.data?.processteam?.length > 0
          ? res_process?.data?.processteam
          : [];
      setProcessOptions(
        ans.map((data) => ({
          ...data,
          label: data.process,
          value: data.process,
        }))
      );

      setLoginNotAllot({
        ...loginNotAllot,
        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        team: res?.data?.suser?.team,
        doj: res?.data?.suser?.doj,
      });
      setOldTeam(res?.data?.suser);
      setLoginNotAllotOld({

        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        team: res?.data?.suser?.team,
        ...res?.data?.suser?.processlog[res?.data?.suser?.processlog?.length - 1],
      });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get single row to edit....
  const getCodeSecond = async (e, name) => {
    setPageName(!pageName);
    try {
      const [res] = await Promise.all([
        axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      handleClickOpenEditSecond();
      setGettingOldDatas(res?.data?.suser);
      setOldTeam(res?.data?.suser);
      setProcessAllottedSecondID(res?.data?.suser);
      let prevLogDates = res?.data?.suser?.processlog?.length > 0 ? res?.data?.suser?.processlog?.map((data) => data?.date) : []
      setPrveLogDates(prevLogDates)
      if (
        res?.data?.suser?.processlog?.length !== 0 &&
        res?.data?.suser?.processlog[res?.data?.suser?.processlog?.length - 1]
          .time !== undefined
      ) {
        const [hours, minutes] =
          res?.data?.suser?.processlog[
            res?.data?.suser?.processlog.length - 1
          ]?.time?.split(":");
        setHours(hours);
        setMinutes(minutes);
      } else {
        setHours("Hrs");
        setMinutes("Mins");
      }

      fetchTeamSecond(
        res?.data?.suser.processlog[res?.data?.suser?.processlog?.length - 1]
          ?.unit
      );

      if (res?.data?.suser?.processlog) {
        let newObj = {
          workmode: res?.data?.suser?.workmode,
          empname: res?.data?.suser?.companyname,
          doj: res?.data?.suser?.doj,
          date: res?.data?.suser?.processlog[
            res?.data?.suser?.processlog?.length - 1
          ].date,
          prevdate:
            res?.data?.suser?.processlog[
              res?.data?.suser?.processlog?.length - 1
            ].date,
          company:
            res?.data?.suser?.processlog[
              res?.data?.suser?.processlog?.length - 1
            ].company,
          process:
            res?.data?.suser?.processlog[
              res?.data?.suser?.processlog?.length - 1
            ].process,
          processtype:
            res?.data?.suser?.processlog[
              res?.data?.suser?.processlog?.length - 1
            ].processtype,
          processduration:
            res?.data?.suser?.processlog[
              res?.data?.suser?.processlog?.length - 1
            ].processduration,
          branch:
            res?.data?.suser?.processlog[
              res?.data?.suser?.processlog?.length - 1
            ].branch,
          unit: res?.data?.suser?.processlog[
            res?.data?.suser?.processlog?.length - 1
          ].unit,
          team: res?.data?.suser?.processlog[
            res?.data?.suser?.processlog?.length - 1
          ].team,
          time: res?.data?.suser?.processlog[
            res?.data?.suser?.processlog?.length - 1
          ].time,
        };

        setProcessAllottedSecond(newObj);
        setProcessAllottedSecondOld(newObj);
      } else {
        setProcessAllottedSecond({
          date: "",
          company: res?.data?.suser?.company,
          process: "Please Select Process",
          processtype: "Primary",
          processduration: "Full",
          branch: res?.data?.suser?.branch,
          unit: res?.data?.suser?.unit,
          team: res?.data?.suser?.team,
          doj: res?.data?.suser?.doj,
          time: "00:00",

          empname: res?.data?.suser?.companyname,
          prevdate: "",
        });
        setProcessAllottedSecondOld({
          date: "",
          company: res?.data?.suser?.company,
          process: "Please Select Process",
          processtype: "Primary",
          processduration: "Full",
          branch: res?.data?.suser?.branch,
          unit: res?.data?.suser?.unit,
          team: res?.data?.suser?.team,
          time: "00:00",



          empname: res?.data?.suser?.companyname,
          doj: res?.data?.suser?.doj,
          prevdate: "",

        });
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

  const getShiftForDateFirst = async (value, date) => {
    setPageName(!pageName);
    try {
      setLoginNotAllot({
        ...loginNotAllot,
        empname: value,
        date: date,
      });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getShiftForDateSecond = async (value, date) => {
    setPageName(!pageName);
    try {
      setProcessAllottedSecond({
        ...processAllottedSecond,
        empname: value,
        date: date,
      });
      setProcessAllottedSecondOld({
        ...processAllottedSecondOld,
        empname: value,
        date: date,
      });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchTeamSecond = async (e) => {
    let answerUnit = e ? e.value : processAllottedSecond?.unit;
    setPageName(!pageName);
    try {
      const BranchUnit =
        processAllottedSecond?.branch === "ALL" && answerUnit === "ALL"
          ? allTeam.filter((d) => d.company === processAllottedSecond?.company)
          : processAllottedSecond?.branch === "ALL"
            ? allTeam.filter(
              (d) =>
                d.company === processAllottedSecond?.company &&
                d.unit === answerUnit
            )
            : answerUnit === "ALL"
              ? allTeam.filter(
                (d) =>
                  d.company === processAllottedSecond?.company &&
                  d.branch === processAllottedSecond?.branch
              )
              : allTeam.filter(
                (d) =>
                  d.company === processAllottedSecond?.company &&
                  d.branch === processAllottedSecond?.branch &&
                  d.unit === answerUnit
              );

      const teamall = [
        ...BranchUnit.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];

      setTeamOptionsSecond(teamall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [ProcessOptionsSecond, setProcessOptionsSecond] = useState([]);
  const ProcessTeamDropdownsSecond = async (e) => {
    setPageName(!pageName);
    try {
      let processTeam = e ? e?.value : processAllottedSecond?.team;
      let res = await axios.post(SERVICE.ALL_PROCESS_AND_TEAM_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: processAllottedSecond?.company,
        branch: processAllottedSecond?.branch,
        unit: processAllottedSecond?.unit,
        team: processTeam,
      });

      const ans =
        res?.data?.processteam?.length > 0 ? res?.data?.processteam : [];
      setProcessOptionsSecond(
        ans.map((data) => ({
          ...data,
          label: data.process,
          value: data.process,
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

  useEffect(() => {
    fetchTeamSecond();
    ProcessTeamDropdownsSecond();
  }, [processAllottedSecond]);

  //Project updateby edit page...
  let updateby = loginNotAllotEdit.updatedby;
  let updatebySecond = processAllottedSecondID.updatedby;

  let projectsid = loginNotAllotEdit._id;
  let processid = processAllottedSecondID._id;

  const [oldHierarchyData, setOldHierarchyData] = useState([]);
  const [newHierarchyData, setNewHierarchyData] = useState([]);
  const [getingOlddatas, setGettingOldDatas] = useState([]);
  const [gettingDesigGroup, setGettingDesigGroup] = useState([]);
  const [oldHierarchyDataSupervisor, setOldHierarchyDataSupervisor] = useState(
    []
  );

  // const checkHierarchyName = async (newValue, type) => {
  //   setPageName(!pageName);
  // try {
  //     if (
  //       type === "Designation"
  //         ? newValue != getingOlddatas?.department
  //         : newValue != getingOlddatas?.team
  //     ) {
  //       let res = await axios.post(SERVICE.HIERARCHI_TEAM_DESIGNATION_CHECK, {
  //         headers: {
  //           Authorization: `Bearer ${auth.APIToken}`,
  //         },
  //         oldname: getingOlddatas,
  //         newname: newValue,
  //         type: type,
  //         username: getingOlddatas.companyname,
  //         designation: getingOlddatas.designation,
  //       });
  //       setGettingDesigGroup(res?.data?.desiggroup)
  //       setOldHierarchyData(res?.data?.hierarchyold);
  //       setNewHierarchyData(res?.data?.hierarchyfindchange);
  //       setOldHierarchyDataSupervisor(res?.data?.hierarchyoldsupervisor);
  //     }
  //   } catch (err) {
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }
  // };


  function getUniqueData(dataArray) {
    const uniqueData = [];
    const seen = new Set();

    for (const item of dataArray) {
      // Sort supervisorchoose array for consistent uniqueness checks
      const supervisorKey = item.supervisorchoose ? [...item.supervisorchoose].sort().join(",") : "";

      // Create a unique key based on (team, designation, supervisorchoose)
      const key = `${item.team}-${item.designation}-${supervisorKey}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(item);
      }
    }

    return uniqueData;
  }




  const fetchSuperVisorChangingHierarchy = async (value) => {
    if (oldTeam?.team !== value) {
      // console.log(value, oldTeam, 'value')
      let designationGrpName = alldesignation?.find(
        (data) => oldTeam?.designation === data?.name
      )?.group;
      let res = await axios.post(SERVICE.HIERARCHY_PROCESSALOOT_TEAM_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldteam: oldTeam?.team,
        team: value,
        user: oldTeam,
        desiggroup: designationGrpName,
      });
      const oldData = res?.data?.olddata?.length > 0 ? getUniqueData(res?.data?.olddata) : [];
      const newDataAll =
        res?.data?.newdata[0]?.all?.length > 0
          ? getUniqueData(res?.data?.newdata[0]?.all)
          : [];
      const newDataRemaining =
        res?.data?.newdata[0]?.team?.length > 0
          ? getUniqueData(res?.data?.newdata[0]?.team)
          : [];
      const newDataAllSupervisor =
        res?.data?.supData?.length > 0 ? getUniqueData(res?.data?.supData) : [];
      setoldTeamSupervisor(newDataAllSupervisor);
      setOldTeamData(oldData);
      setNewUpdateDataAll(newDataAll);
      setNewDataTeamWise(newDataRemaining);
      console.log(oldData, newDataAll, newDataRemaining, newDataAllSupervisor)
      const uniqueData = [];
      const seen = new Set();
      for (const item of newDataAll) {
        // Sort supervisorchoose array for consistent uniqueness checks
        const supervisorKey = item.supervisorchoose ? [...item.supervisorchoose].sort().join(",") : "";

        // Create a unique key based on (team, designation, supervisorchoose)
        const key = `${item.team}-${item.designation}-${supervisorKey}`;

        if (!seen.has(key)) {
          seen.add(key);
          uniqueData.push(item);
        }
      }

      console.log(uniqueData, 'uniqueData')
    } else {
      setOldTeamData([]);
      setNewUpdateDataAll([]);
      setNewDataTeamWise([]);
    }
  };
  const fetchReportingToUserHierarchy = async (value) => {
    if (oldTeam?.team !== value) {
      // console.log(value, oldTeam, 'value')
      let designationGrpName = alldesignation?.find(
        (data) => oldTeam?.designation === data?.name
      )?.group;
      let res = await axios.post(
        SERVICE.REPORTINGTO_PROCESS_USER_HIERARCHY_RELATION,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldteam: oldTeam?.team,
          team: value,
          user: oldTeam,
          desiggroup: designationGrpName,
        }
      );

      const userResponse =
        res?.data?.newdata[0]?.result?.length > 0
          ? res?.data?.newdata[0]?.result
          : [];
      setUserReportingToChange(userResponse);
      // console.log(userResponse , 'New Data')
    } else {
      setUserReportingToChange([]);
    }
  };

  //editing the single data...
  const sendEditRequestSecond = async () => {
    setPageName(!pageName);

    let rocketchatshiftgrouping = [];
    let rocketchatshift = [];

    // Check if the user's boardingLog exists and has entries
    if (getingOlddatas?.boardingLog && getingOlddatas?.boardingLog.length > 0) {
      const lastBoardingLog = getingOlddatas?.boardingLog[getingOlddatas?.boardingLog.length - 1];

      // If shifttype is "Standard", push shiftgrouping and shifttiming values
      if (lastBoardingLog.shifttype === "Standard") {
        if (lastBoardingLog.shiftgrouping) {
          rocketchatshiftgrouping.push(lastBoardingLog.shiftgrouping);
        }
        if (lastBoardingLog.shifttiming) {
          rocketchatshift.push(lastBoardingLog.shifttiming);
        }
      } else if (lastBoardingLog.shifttype !== "Standard") {
        // If shifttype is not "Standard", check the todo array
        const boardtodo = lastBoardingLog.todo;

        if (boardtodo && boardtodo.length > 0) {
          // Iterate over the todo array and push shiftgrouping and shifttiming
          boardtodo.forEach(item => {
            if (item.shiftgrouping) {
              rocketchatshiftgrouping.push(item.shiftgrouping);
            }
            if (item.shifttiming) {
              rocketchatshift.push(item.shifttiming);
            }
          });
        }
      }
    }





    try {
      if (processAllottedSecondID.team === processAllottedSecond.team) {
        let shouldUpdateBoardingLog = processAllottedSecondID.workmode !== getingOlddatas?.workmode;
        let lastBoardingLog = processAllottedSecondID?.boardingLog?.length > 0 ?
          processAllottedSecondID?.boardingLog[
          processAllottedSecondID?.boardingLog?.length - 1
          ] : {}
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${processid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          process: String(processAllottedSecond.process),
          processtype: String(processAllottedSecond.processtype),
          processduration: String(processAllottedSecond.processduration),
          time: String(hours),
          timemins: String(minutes),

          username: getingOlddatas?.username,
          companyname: getingOlddatas?.companyname,
          department: getingOlddatas?.department,
          designation: getingOlddatas?.designation,
          rocketchatemail: getingOlddatas?.rocketchatemail,
          rocketchatid: getingOlddatas?.rocketchatid,
          // workmode: getingOlddatas?.workmode,
          workmode: String(processAllottedSecond?.workmode),

          rocketchatroles: getingOlddatas?.rocketchatroles,
          rocketchatteamid: getingOlddatas?.rocketchatteamid,
          rocketchatchannelid: getingOlddatas?.rocketchatchannelid,
          company: getingOlddatas?.company,
          branch: getingOlddatas?.branch,
          unit: getingOlddatas?.unit,
          team: getingOlddatas?.team,
          rocketchatshiftgrouping,
          rocketchatshift,

          processlog: [
            ...processAllottedSecondID.processlog,
            {
              time: `${hours}:${minutes}`,
              company: String(processAllottedSecondID.company),
              branch: String(processAllottedSecondID.branch),
              unit: String(processAllottedSecondID.unit),
              team: String(processAllottedSecondID.team),
              empname: String(processAllottedSecondID.companyname),
              process: String(processAllottedSecond.process),
              processduration: String(processAllottedSecond.processduration),
              processtype: String(processAllottedSecond.processtype),
              date: String(processAllottedSecond.date),
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
            },
          ],

          ...(shouldUpdateBoardingLog && lastBoardingLog && {
            boardingLog: [
              ...processAllottedSecondID?.boardingLog,
              {
                ...(() => {
                  const { _id, ...rest } = lastBoardingLog || {};
                  return rest;
                })(),
                shifttype: processAllottedSecondID?.boardingLog?.[processAllottedSecondID?.boardingLog?.length - 1]?.shifttype,
                shifttiming: processAllottedSecondID?.boardingLog?.[processAllottedSecondID?.boardingLog?.length - 1]?.shifttiming,
                shiftgrouping: processAllottedSecondID?.boardingLog?.[processAllottedSecondID?.boardingLog?.length - 1]?.shiftgrouping,
                weekoff: processAllottedSecondID?.boardingLog?.[processAllottedSecondID?.boardingLog?.length - 1]?.weekoff,
                todo: processAllottedSecondID?.boardingLog?.[processAllottedSecondID?.boardingLog?.length - 1]?.todo,
                company: String(processAllottedSecondID.company),
                branch: String(processAllottedSecondID.branch),
                unit: String(processAllottedSecondID.unit),
                floor: String(processAllottedSecondID.floor),
                area: String(processAllottedSecondID.area),
                workstation: String(processAllottedSecondID.workstation),
                workmode: String(processAllottedSecond?.workmode),
                username: String(processAllottedSecondID.companyname),
                logeditedby: [],
                updateddatetime: String(new Date()),
                updatedusername: String(isUserRoleAccess.companyname),
                team: String(processAllottedSecond.team),
                startdate: String(processAllottedSecond?.date || ""),
                time: `${hours}:${minutes}`,
                logcreation: "process",
                ischangecompany: false,
                ischangebranch: false,
                ischangeunit: false,
                ischangeteam: false,
                ischangefloor: false,
                ischangearea: false,
                ischangeworkstation: false,
                ischangeworkmode: processAllottedSecond.workmode !== getingOlddatas?.workmode,
              },
            ],
          }),
          updatedby: [
            ...updatebySecond,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      } else {
        let lastBoardingLog = processAllottedSecondID?.boardingLog?.length > 0 ?
          processAllottedSecondID?.boardingLog[
          processAllottedSecondID?.boardingLog?.length - 1
          ] : {}
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${processid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          process: String(processAllottedSecond.process),
          processtype: String(processAllottedSecond.processtype),
          processduration: String(processAllottedSecond.processduration),

          username: getingOlddatas?.username,
          companyname: getingOlddatas?.companyname,
          department: getingOlddatas?.department,
          designation: getingOlddatas?.designation,
          rocketchatemail: getingOlddatas?.rocketchatemail,
          rocketchatid: getingOlddatas?.rocketchatid,
          rocketchatroles: getingOlddatas?.rocketchatroles,
          rocketchatteamid: getingOlddatas?.rocketchatteamid,
          rocketchatchannelid: getingOlddatas?.rocketchatchannelid,
          company: getingOlddatas?.company,
          branch: getingOlddatas?.branch,
          unit: getingOlddatas?.unit,
          rocketchatshiftgrouping,
          rocketchatshift,
          workmode: String(processAllottedSecond?.workmode),
          team: String(processAllottedSecond.team),
          time: String(hours),
          timemins: String(minutes),
          processlog: [
            ...processAllottedSecondID.processlog,
            {
              company: String(processAllottedSecondID.company),
              branch: String(processAllottedSecondID.branch),
              unit: String(processAllottedSecondID.unit),
              team: String(processAllottedSecond.team),
              floor: String(processAllottedSecondID.floor),
              area: String(processAllottedSecondID.area),
              workstation: String(processAllottedSecondID.workstation),
              empname: String(processAllottedSecondID.companyname),
              process: String(processAllottedSecond.process),
              processduration: String(processAllottedSecond.processduration),
              processtype: String(processAllottedSecond.processtype),
              date: String(processAllottedSecond?.date || ""),
              time: `${hours}:${minutes}`,
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
            },
          ],
          boardingLog: [
            ...processAllottedSecondID?.boardingLog,
            {
              ...(() => {
                const { _id, ...rest } = lastBoardingLog || {};
                return rest;
              })(),
              shifttype:
                processAllottedSecondID?.boardingLog[
                  processAllottedSecondID?.boardingLog?.length - 1
                ].shifttype,
              shifttiming:
                processAllottedSecondID?.boardingLog[
                  processAllottedSecondID?.boardingLog?.length - 1
                ].shifttiming,
              shiftgrouping:
                processAllottedSecondID?.boardingLog[
                  processAllottedSecondID?.boardingLog?.length - 1
                ].shiftgrouping,
              weekoff:
                processAllottedSecondID?.boardingLog[
                  processAllottedSecondID?.boardingLog?.length - 1
                ].weekoff,
              todo:
                processAllottedSecondID?.boardingLog[
                  processAllottedSecondID?.boardingLog?.length - 1
                ].todo,
              company: String(processAllottedSecondID.company),
              branch: String(processAllottedSecondID.branch),
              unit: String(processAllottedSecondID.unit),
              floor: String(processAllottedSecondID.floor),
              area: String(processAllottedSecondID.area),
              workstation: String(processAllottedSecondID.workstation),
              workmode: String(processAllottedSecond?.workmode),
              username: String(processAllottedSecondID.companyname),
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
              team: String(processAllottedSecond.team),
              startdate: String(processAllottedSecond?.date || ""),
              time: `${hours}:${minutes}`,
              logcreation: "process",
              ischangecompany: Boolean(false),
              ischangebranch: Boolean(false),
              ischangeunit: Boolean(false),
              ischangeteam: Boolean(true),
              ischangefloor: Boolean(false),
              ischangearea: Boolean(false),
              ischangeworkstation: false,
              ischangeworkmode: processAllottedSecond.workmode !== getingOlddatas?.workmode,
            },
          ],

          updatedby: [
            ...updatebySecond,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });

        await axios.post(
          `${SERVICE.UPDATE_LOGINALLOT_LOGPAGES}`,
          {
            empname: getingOlddatas.companyname,
            company: getingOlddatas?.company,
            branch: getingOlddatas?.branch,
            unit: getingOlddatas?.unit,
            team: String(processAllottedSecond.team),
            date: String(processAllottedSecond.date),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      }
      // Deleting the Old Data of TEAM MATCHED
      if (oldTeamData?.length > 0) {
        let ans = oldTeamData?.map((data) => {
          axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });
      }

      async function addNewTeams(dataArray, processData) {
        await Promise.all(
          dataArray.map(async (item) => {
            await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              company: String(item.company),
              designationgroup: String(item.designationgroup),
              department: String(item.department),
              branch: String(item.branch),
              unit: String(item.unit),
              team: String(item.team),
              supervisorchoose: String(item.supervisorchoose),
              mode: String(item.mode),
              level: String(item.level),
              control: String(item.control),
              pagecontrols: item.pagecontrols,
              employeename: processData.empname,
              access: item.access,
              action: true,
              empbranch: processData.branch,
              empunit: processData.unit,
              empcode: oldTeam?.empcode,
              empteam: processData.team,
              addedby: [
                {
                  name: String(isUserRoleAccess?.username),
                  date: new Date().toISOString(),
                },
              ],
            });
          })
        );
      }

      // Function to remove old employee data
      async function removeOldHierarchy(oldHierarchyData) {
        await Promise.all(
          oldHierarchyData.map(async (data) => {
            let oldemployeename = data.employeename?.filter(
              (ite) => ite !== loginNotAllotEdit?.companyname
            );

            if (oldemployeename.length > 1) {
              await axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                employeename: oldemployeename,
              });
            } else {
              await axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            }
          })
        );
      }

      // Execute the operations
      if (newUpdateDataAll.length > 0) {
        await addNewTeams(newUpdateDataAll, processAllottedSecond);
        await removeOldHierarchy(oldHierarchyData);
      }

      if (newDataTeamWise.length > 0) {
        await addNewTeams(newDataTeamWise, processAllottedSecond);
        await removeOldHierarchy(oldHierarchyData);
      }



      if (
        (newUpdateDataAll?.length > 0 || newDataTeamWise?.length > 0) &&
        userReportingToChange?.length > 0
      ) {
        // console.log("Success")
        const supervisor = userReportingToChange[0]?.supervisorchoose;
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${processid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          reportingto: String(supervisor[0]),
          updatedby: [
            ...updatebySecond,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      setProcessAllottedSecond({
        date: "",
        company: "Please Select Company",
        process: "Please Select Process",
        processtype: "Primary",
        processduration: "Full",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        time: "00:00",
      });
      setHours("Hrs");
      setMinutes("Mins");
      setFilteredChanges(null)
      setFilteredRowData([]);
      await sendRequest();
      handleCloseModEditSecond();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setUpdateLoader(false);
    } catch (err) {
      setUpdateLoader(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);

    let rocketchatshiftgrouping = [];
    let rocketchatshift = [];

    // Check if the user's boardingLog exists and has entries
    if (getingOlddatas?.boardingLog && getingOlddatas?.boardingLog.length > 0) {
      const lastBoardingLog = getingOlddatas?.boardingLog[getingOlddatas?.boardingLog.length - 1];

      // If shifttype is "Standard", push shiftgrouping and shifttiming values
      if (lastBoardingLog.shifttype === "Standard") {
        if (lastBoardingLog.shiftgrouping) {
          rocketchatshiftgrouping.push(lastBoardingLog.shiftgrouping);
        }
        if (lastBoardingLog.shifttiming) {
          rocketchatshift.push(lastBoardingLog.shifttiming);
        }
      } else if (lastBoardingLog.shifttype !== "Standard") {
        // If shifttype is not "Standard", check the todo array
        const boardtodo = lastBoardingLog.todo;

        if (boardtodo && boardtodo.length > 0) {
          // Iterate over the todo array and push shiftgrouping and shifttiming
          boardtodo.forEach(item => {
            if (item.shiftgrouping) {
              rocketchatshiftgrouping.push(item.shiftgrouping);
            }
            if (item.shifttiming) {
              rocketchatshift.push(item.shifttiming);
            }
          });
        }
      }
    }

    try {
      if (loginNotAllotEdit.team === loginNotAllot.team) {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          process: String(loginNotAllot.process),
          processtype: String(loginNotAllot.processtype),
          processduration: String(loginNotAllot.processduration),
          time: String(hours),
          timemins: String(minutes),

          username: getingOlddatas?.username,
          companyname: getingOlddatas?.companyname,
          department: getingOlddatas?.department,
          designation: getingOlddatas?.designation,
          rocketchatemail: getingOlddatas?.rocketchatemail,
          rocketchatid: getingOlddatas?.rocketchatid,
          workmode: getingOlddatas?.workmode,
          rocketchatroles: getingOlddatas?.rocketchatroles,
          rocketchatteamid: getingOlddatas?.rocketchatteamid,
          rocketchatchannelid: getingOlddatas?.rocketchatchannelid,
          company: getingOlddatas?.company,
          branch: getingOlddatas?.branch,
          unit: getingOlddatas?.unit,
          team: getingOlddatas?.team,
          rocketchatshiftgrouping,
          rocketchatshift,

          processlog: [
            ...loginNotAllotEdit.processlog,
            {
              company: String(loginNotAllotEdit.company),
              branch: String(loginNotAllotEdit.branch),
              unit: String(loginNotAllotEdit.unit),
              team: String(loginNotAllotEdit.team),
              empname: String(loginNotAllotEdit.companyname),
              process: String(loginNotAllot.process),
              processduration: String(loginNotAllot.processduration),
              processtype: String(loginNotAllot.processtype),
              date: String(loginNotAllot.date),
              time: `${hours}:${minutes}`,
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
            },
          ],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      } else {
        let lastBoardingLog = loginNotAllotEdit?.boardingLog?.length > 0 ?
          loginNotAllotEdit?.boardingLog[
          loginNotAllotEdit?.boardingLog?.length - 1
          ] : {}
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          process: String(loginNotAllot.process),
          processtype: String(loginNotAllot.processtype),
          processduration: String(loginNotAllot.processduration),


          username: getingOlddatas?.username,
          companyname: getingOlddatas?.companyname,
          department: getingOlddatas?.department,
          designation: getingOlddatas?.designation,
          rocketchatemail: getingOlddatas?.rocketchatemail,
          rocketchatid: getingOlddatas?.rocketchatid,
          // workmode: getingOlddatas?.workmode,
          workmode: String(processAllottedSecond?.workmode),
          rocketchatroles: getingOlddatas?.rocketchatroles,
          rocketchatteamid: getingOlddatas?.rocketchatteamid,
          rocketchatchannelid: getingOlddatas?.rocketchatchannelid,
          company: getingOlddatas?.company,
          branch: getingOlddatas?.branch,
          unit: getingOlddatas?.unit,
          rocketchatshiftgrouping,
          rocketchatshift,


          team: String(loginNotAllot.team),
          time: String(hours),
          timemins: String(minutes),
          processlog: [
            ...loginNotAllotEdit.processlog,
            {
              company: String(loginNotAllotEdit.company),
              branch: String(loginNotAllotEdit.branch),
              unit: String(loginNotAllotEdit.unit),
              team: String(loginNotAllot.team),
              empname: String(loginNotAllotEdit.companyname),
              process: String(loginNotAllot.process),
              processduration: String(loginNotAllot.processduration),
              processtype: String(loginNotAllot.processtype),
              date: String(loginNotAllot.date),
              time: `${hours}:${minutes}`,
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
            },
          ],
          boardingLog: [
            ...loginNotAllotEdit?.boardingLog,
            {
              ...lastBoardingLog,
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
              shifttiming:
                loginNotAllotEdit?.boardingLog[
                  loginNotAllotEdit?.boardingLog?.length - 1
                ]?.shifttiming,
              shiftgrouping:
                loginNotAllotEdit?.boardingLog[
                  loginNotAllotEdit?.boardingLog?.length - 1
                ]?.shiftgrouping,
              shifttype:
                loginNotAllotEdit?.boardingLog[
                  loginNotAllotEdit?.boardingLog?.length - 1
                ]?.shifttype,
              company: String(loginNotAllotEdit.company),
              branch: String(loginNotAllotEdit.branch),
              unit: String(loginNotAllotEdit.unit),
              team: String(loginNotAllot.team),
              floor: String(loginNotAllotEdit.floor),
              area: String(loginNotAllotEdit.area),
              workstation: String(loginNotAllotEdit.workstation),
              workmode: String(processAllottedSecond?.workmode),
              username: String(loginNotAllotEdit.companyname),
              startdate: String(loginNotAllot?.date || ""),
              process: String(loginNotAllot.process),
              time: `${hours}:${minutes}`,
              logcreation: "process",
              ischangecompany: Boolean(false),
              ischangebranch: Boolean(false),
              ischangeunit: Boolean(false),
              ischangeteam: Boolean(true),
              ischangefloor: Boolean(false),
              ischangearea: Boolean(false),
              ischangeworkstation: false,
              ischangeworkmode: processAllottedSecond.workmode !== getingOlddatas?.workmode,

              processduration: String(loginNotAllot.processduration),
              processtype: String(loginNotAllot.processtype),
              date: String(loginNotAllot.date),
              weekoff:
                loginNotAllotEdit?.boardingLog[
                  loginNotAllotEdit?.boardingLog?.length - 1
                ]?.weekoff,
              todo: loginNotAllotEdit?.boardingLog[
                loginNotAllotEdit?.boardingLog?.length - 1
              ]?.todo,
            },
          ],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      // Deleting the Old Data of TEAM MATCHED
      if (oldTeamData?.length > 0) {
        let ans = oldTeamData?.map((data) => {
          axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });
      }



      // // Adding NEW TEAM TO ALL Conditon Employee
      // if (newUpdateDataAll?.length > 0) {
      //   let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
      //     headers: {
      //       Authorization: `Bearer ${auth.APIToken}`,
      //     },

      //     company: String(newUpdateDataAll[0].company),
      //     designationgroup: String(newUpdateDataAll[0]?.designationgroup),
      //     department: String(newUpdateDataAll[0].department),
      //     branch: String(newUpdateDataAll[0].branch),
      //     unit: String(newUpdateDataAll[0].unit),
      //     team: String(newUpdateDataAll[0].team),
      //     supervisorchoose: String(newUpdateDataAll[0].supervisorchoose),
      //     mode: String(newUpdateDataAll[0].mode),
      //     level: String(newUpdateDataAll[0].level),
      //     control: String(newUpdateDataAll[0].control),
      //     pagecontrols: newUpdateDataAll[0].pagecontrols,
      //     employeename: processAllottedSecond.empname,
      //     access: newUpdateDataAll[0].access,
      //     action: Boolean(true),
      //     empbranch: processAllottedSecond?.branch,
      //     empunit: processAllottedSecond.unit,
      //     empcode: oldTeam?.empcode,
      //     empteam: processAllottedSecond.team,
      //     addedby: [
      //       {
      //         name: String(isUserRoleAccess?.username),
      //         date: String(new Date()),
      //       },
      //     ],
      //   });

      //   //Removing Name From the Old one
      //   let oldHierarchy = oldHierarchyData?.map((data) => {
      //     let oldemployeename = data.employeename?.filter(
      //       (ite) => ite != loginNotAllotEdit?.companyname
      //     );
      //     if (oldemployeename?.length > 1) {
      //       let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
      //         headers: {
      //           Authorization: `Bearer ${auth.APIToken}`,
      //         },
      //         employeename: oldemployeename,
      //       });
      //     } else {
      //       let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
      //         headers: {
      //           Authorization: `Bearer ${auth.APIToken}`,
      //         },
      //       });
      //     }
      //   });
      // }

      // // Adding NEW TEAM TO ACTUAL TEAM WISE DATA  Conditon Employee
      // if (newDataTeamWise?.length > 0) {
      //   let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
      //     headers: {
      //       Authorization: `Bearer ${auth.APIToken}`,
      //     },

      //     company: String(newDataTeamWise[0].company),
      //     designationgroup: String(newDataTeamWise[0]?.designationgroup),
      //     department: String(newDataTeamWise[0].department),
      //     branch: String(newDataTeamWise[0].branch),
      //     unit: String(newDataTeamWise[0].unit),
      //     team: String(newDataTeamWise[0].team),
      //     supervisorchoose: String(newDataTeamWise[0].supervisorchoose),
      //     mode: String(newDataTeamWise[0].mode),
      //     level: String(newDataTeamWise[0].level),
      //     control: String(newDataTeamWise[0].control),
      //     pagecontrols: newDataTeamWise[0].pagecontrols,
      //     employeename: processAllottedSecond.empname,
      //     access: newDataTeamWise[0].access,
      //     action: Boolean(true),
      //     empbranch: processAllottedSecond?.branch,
      //     empunit: processAllottedSecond.unit,
      //     empcode: oldTeam?.empcode,
      //     empteam: processAllottedSecond.team,
      //     addedby: [
      //       {
      //         name: String(isUserRoleAccess?.username),
      //         date: String(new Date()),
      //       },
      //     ],
      //   });

      //   //Removing Name From the Old one
      //   let oldHierarchy = oldHierarchyData?.map((data) => {
      //     let oldemployeename = data.employeename?.filter(
      //       (ite) => ite != loginNotAllotEdit?.companyname
      //     );
      //     if (oldemployeename?.length > 1) {
      //       let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
      //         headers: {
      //           Authorization: `Bearer ${auth.APIToken}`,
      //         },
      //         employeename: oldemployeename,
      //       });
      //     } else {
      //       let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
      //         headers: {
      //           Authorization: `Bearer ${auth.APIToken}`,
      //         },
      //       });
      //     }
      //   });
      // }


      async function addNewTeams(dataArray, processData) {
        await Promise.all(
          dataArray.map(async (item) => {
            await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              company: String(item.company),
              designationgroup: String(item.designationgroup),
              department: String(item.department),
              branch: String(item.branch),
              unit: String(item.unit),
              team: String(item.team),
              supervisorchoose: String(item.supervisorchoose),
              mode: String(item.mode),
              level: String(item.level),
              control: String(item.control),
              pagecontrols: item.pagecontrols,
              employeename: processData.empname,
              access: item.access,
              action: true,
              empbranch: processData.branch,
              empunit: processData.unit,
              empcode: oldTeam?.empcode,
              empteam: processData.team,
              addedby: [
                {
                  name: String(isUserRoleAccess?.username),
                  date: new Date().toISOString(),
                },
              ],
            });
          })
        );
      }

      // Function to remove old employee data
      async function removeOldHierarchy(oldHierarchyData) {
        await Promise.all(
          oldHierarchyData.map(async (data) => {
            let oldemployeename = data.employeename?.filter(
              (ite) => ite !== loginNotAllotEdit?.companyname
            );

            if (oldemployeename.length > 1) {
              await axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                employeename: oldemployeename,
              });
            } else {
              await axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            }
          })
        );
      }

      // Execute the operations
      if (newUpdateDataAll.length > 0) {
        await addNewTeams(newUpdateDataAll, processAllottedSecond);
        await removeOldHierarchy(oldHierarchyData);
      }

      if (newDataTeamWise.length > 0) {
        await addNewTeams(newDataTeamWise, processAllottedSecond);
        await removeOldHierarchy(oldHierarchyData);
      }






      if (
        (newUpdateDataAll?.length > 0 || newDataTeamWise?.length > 0) &&
        userReportingToChange?.length > 0
      ) {
        console.log("Success");
        const supervisor = userReportingToChange[0]?.supervisorchoose;
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${processid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          reportingto: String(supervisor[0]),
          updatedby: [
            ...updatebySecond,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      setLoginNotAllot({
        date: formattedDate,
        company: "Please Select Company",
        process: "Please Select Process",
        processtype: "Primary",
        processduration: "Full",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        time: "00:00",
      });
      setMinutes("Mins");
      setHours("Hrs");
      setFilteredRowData([]);
      setFilteredChanges(null)
      await sendRequest();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

      setUpdateLoader(false);
    } catch (err) {
      setUpdateLoader(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // console.log(newUpdateDataAll?.length > 0 ,  newDataTeamWise?.length > 0 ,  userReportingToChange?.length > 0)
  const editSubmit = (e) => {
    setUpdateLoader(true);
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(loginNotAllot).some(
      (key) => loginNotAllot[key] !== loginNotAllotOld[key]
    );
    if (
      prevLogDates?.includes(loginNotAllot.date)
    ) {
      setPopupContentMalert("Date Can not be same as prev logs!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      loginNotAllot.team === "Please Select Team" ||
      loginNotAllot.team === undefined ||
      loginNotAllot.team === ""
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      loginNotAllot.process === "Please Select Process" ||
      loginNotAllot.process === "" ||
      loginNotAllot.process === undefined
    ) {
      setPopupContentMalert("Please Select Process!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      loginNotAllot.processtype === "" ||
      loginNotAllot.processtype === undefined
    ) {
      setPopupContentMalert("Please Select Process Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      loginNotAllot.processduration === "" ||
      loginNotAllot.processduration === undefined
    ) {
      setPopupContentMalert("Please Select Process Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      loginNotAllot.time === "Hrs:Mins" ||
      loginNotAllot.time === "" ||
      loginNotAllot.time === undefined ||
      loginNotAllot.time.includes("Mins") ||
      loginNotAllot.time.includes("Hrs") ||
      loginNotAllot.time === "00:00"
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!isChanged) {
      setPopupContentMalert("No Changes to Update!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  const editSubmitSecond = (e) => {
    setUpdateLoader(true);
    e.preventDefault();
    const isChanged = Object.keys(processAllottedSecond).some(
      (key) => processAllottedSecond[key] !== processAllottedSecondOld[key]
    );

    if (
      processAllottedSecond.workmode === "Please Select Work Mode" ||
      processAllottedSecond.workmode === "" ||
      !processAllottedSecond.workmode
    ) {
      setPopupContentMalert("Please Select Work Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      processAllottedSecond.team === "Please Select Team" ||
      processAllottedSecond.team === ""
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (
      processAllottedSecond.process === "Please Select Process" ||
      processAllottedSecond.process === ""
    ) {
      setPopupContentMalert("Please Select Process!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      processAllottedSecond.processtype === "" ||
      processAllottedSecond.processtype === undefined
    ) {
      setPopupContentMalert("Please Select Process Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      processAllottedSecond.processduration === "" ||
      processAllottedSecond.processduration === undefined
    ) {
      setPopupContentMalert("Please Select Process Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      processAllottedSecond.time === "Hrs:Mins" ||
      processAllottedSecond.time === "" ||
      processAllottedSecond.time === undefined ||
      processAllottedSecond.time.includes("Mins") ||
      processAllottedSecond.time.includes("Hrs") ||
      processAllottedSecond.time === "00:00"
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!isChanged) {
      setPopupContentMalert("No Changes to Update!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      prevLogDates?.includes(processAllottedSecond.date)
    ) {
      setPopupContentMalert("Date Can not be same as prev logs!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    //  else if (
    //   isChanged &&
    //   oldTeamData?.length > 0 &&
    //   newUpdateDataAll?.length < 1 &&
    //   newDataTeamWise?.length < 1
    // ) {
    //   setPopupContentMalert(
    //     "This Employee is not allowed to Change Team with their Designation , Create in Hierarchy First!"
    //   );
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // } 
    // else if (isChanged && oldTeamSupervisor?.length > 0) {
    //   setPopupContentMalert(
    //     "This Employee is supervisor in hierarchy , So not allowed to Change Team!"
    //   );
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else {
      sendEditRequestSecond();
    }
  };

  // Excel
  const fileName = "ProcessLog";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Process Log",
    pageStyle: "print",
  });

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {

    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(allCompanyUsers);
  }, [allCompanyUsers]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase()?.split(" ");
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

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

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

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 120,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
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
      field: "role",
      headerName: "Role",
      flex: 0,
      width: 120,
      hide: !columnVisibility.role,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 120,
      hide: !columnVisibility.department,
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
      field: "process",
      headerName: "Process",
      flex: 0,
      width: 120,
      hide: !columnVisibility.process,
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vprocesslog") &&
            params.data.process !== undefined && (
              <Button
                variant="contained"
                sx={{
                  minWidth: "15px",
                  padding: "6px 5px",
                }}
                onClick={() => {
                  sendRequestProcess(params.data.id);
                }}
              >
                <MenuIcon style={{ fontsize: "small" }} />
              </Button>
            )}
          &ensp;
          {isUserRoleCompare?.includes("eprocesslog") &&
            params.data.process === undefined && (
              <Button
                variant="contained"
                onClick={(e) => {
                  getCode(
                    params.data.id,
                    params.data.name,
                    params.data.companyname
                  );
                }}
              >
                CHANGE
              </Button>
            )}
          {isUserRoleCompare?.includes("eprocesslog") &&
            params.data.process !== undefined && (
              <Button
                variant="contained"
                onClick={(e) => {
                  handleClickOpenEditSecond();
                  getCodeSecond(params.data.id, params.data.name);
                }}
              >
                CHANGE
              </Button>
            )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      branch: item.branch,
      company: item.company,
      unit: item.unit,
      team: item.team,
      workmode: item.workmode,
      companyname: item.companyname,
      department: item.department,
      process: item.process,
      role: item.role,
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

  // // Function to filter columns based on search query
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [fileFormat, setFormat] = useState("");

  //FILTER START
  const [internChecked, setInternChecked] = useState(false);
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    setPageName(!pageName);
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


  // const handlePasteForEmp = (e) => {
  //   e.preventDefault();
  //   const pastedText = e.clipboardData.getData('text');

  //   // Process the pasted text
  //   const newValues = pastedText.split('\n').filter((value) => value.trim() !== '');
  //   const pastedNames = newValues
  //     .flatMap(value => value.split(","))
  //     .map(name => name.replace(/\s*\.\s*/g, ".").trim())
  //     .filter(name => name !== "");


  //   // Update the state
  //   updateEmployees(pastedNames);

  //   // Refocus the Box after paste
  //   e.target.focus();
  // };

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  // const updateEmployees = (pastedNames) => {
  //   // Ensure pastedNames is always an array
  //   const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

  //   const availableOptions = allUsersLimit
  //     ?.filter(
  //       (comp) =>
  //         valueCompanyCat?.includes(comp.company) &&
  //         valueBranchCat?.includes(comp.branch) &&
  //         valueUnitCat?.includes(comp.unit) &&
  //         valueTeamCat?.includes(comp.team)
  //     )
  //     ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

  //   const matchedValues = namesArray.filter((name) =>
  //     availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
  //   );

  //   setValueEmp((prev) => {
  //     const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
  //     const updatedValues = [...prev, ...uniqueValues];
  //     const uniqueSet = new Set(updatedValues); // Ensure uniqueness
  //     return Array.from(uniqueSet);
  //   });

  //   setSelectedOptionsEmployee((prev) => {
  //     // Filter out duplicates from namesArray
  //     const uniqueValues = matchedValues.filter((value) =>
  //       !prev.some((item) => item.value === value.replace(/\s*\.\s*/g, ".").trim())
  //     );

  //     // Map the unique values to label-value pairs
  //     const uniqueValuesMap = uniqueValues.map((data) => ({
  //       label: data.replace(/\s*\.\s*/g, ".").trim(),
  //       value: data.replace(/\s*\.\s*/g, ".").trim(),
  //     }));

  //     // Merge with previous values
  //     const updatedValues = [...prev, ...uniqueValuesMap];

  //     // Deduplicate based on the `value` property using a Map
  //     const uniqueSet = new Map(updatedValues.map((item) => [item.value, item]));

  //     // Convert the Map back to an array
  //     const uniqueArray = Array.from(uniqueSet.values());

  //     return uniqueArray;
  //   });

  //   setValueEmployeeCat((prev) => {
  //     const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
  //     const updatedValues = [...prev, ...uniqueValues];
  //     const uniqueSet = new Set(updatedValues); // Ensure uniqueness
  //     return Array.from(uniqueSet);
  //   });

  // };

  // Handle clicks outside the Box


  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = internChecked
      ? allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            valueUnitCat?.includes(u.unit) &&
            valueTeamCat?.includes(u.team) &&
            u.workmode === "Internship"
        )
        ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())
      : allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            valueUnitCat?.includes(u.unit) &&
            valueTeamCat?.includes(u.team) &&
            u.workmode !== "Internship"
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
    setValueEmp([]); setEmployeeOptions([]);
    setAllCompanyUsers([]);
    setInternChecked(false);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [filterLoader, setFilterLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const handleFilter = () => {
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
    // else if (
    //   filterState?.employeestatus === "Please Select Employee Status" ||
    //   filterState?.employeestatus === ""
    // ) {
    //   setPopupContentMalert("Please Select Employee Status!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
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
      sendRequest();
    }
  };

  const sendRequest = async () => {
    setFilterLoader(true);
    setTableLoader(true);
    setPageName(!pageName);
    setSearchQuery("");
    setSearchedString("");
    const aggregationPipeline = [
      {
        $match: {
          $and: [
            // Enquiry status filter
            {
              enquirystatus: {
                $nin: ["Enquiry Purpose"],
              },
            },
            // Reasonable status filter
            {
              resonablestatus: {
                $nin: [
                  "Not Joined",
                  "Postponed",
                  "Rejected",
                  "Closed",
                  "Releave Employee",
                  "Absconded",
                  "Hold",
                  "Terminate",
                ],
              },
            },
            // Conditional company filter
            ...(valueCompanyCat.length > 0
              ? [
                {
                  company: { $in: valueCompanyCat },
                },
              ]
              : [
                {
                  company: { $in: allAssignCompany },
                },
              ]),
            // Conditional branch filter
            ...(valueBranchCat.length > 0
              ? [
                {
                  branch: { $in: valueBranchCat },
                },
              ]
              : [
                {
                  branch: { $in: allAssignBranch },
                },
              ]),
            // Conditional unit filter
            ...(valueUnitCat.length > 0
              ? [
                {
                  unit: { $in: valueUnitCat },
                },
              ]
              : [
                {
                  unit: { $in: allAssignUnit },
                },
              ]),
            // Conditional team filter
            ...(valueTeamCat.length > 0
              ? [
                {
                  team: { $in: valueTeamCat },
                },
              ]
              : []),
            // Conditional department filter
            ...(valueDepartmentCat.length > 0
              ? [
                {
                  department: { $in: valueDepartmentCat },
                },
              ]
              : []),
            // Conditional Employee filter
            ...(valueEmployeeCat.length > 0
              ? [
                {
                  companyname: { $in: valueEmployeeCat },
                },
              ]
              : []),
          ],
        },
      },
      {
        $project: {
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          empcode: 1,
          companyname: 1,
          department: 1,
          designation: 1,
          role: 1,
          process: 1,
          workmode: 1,
        },
      },
    ];
    try {
      let response = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );


      const itemsWithSerialNumber = response.data.users?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
      }));
      setSearchQuery("");
      setFilteredChanges(null)
      setFilteredRowData([]);
      setAllCompanyUsers(itemsWithSerialNumber);
      setAllCompanyUsersArray(response.data.users);

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
    setPageName(!pageName);
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
            u.workmode !== "Internship"
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
            u.workmode !== "Internship"
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
      <Headtitle title={"PROCESS LOG"} />

      <PageHeading
        title="Process Log"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Log Details"
        subsubpagename="Process Log"
      />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("aprocesslog") && (
        <>

          <Box sx={userStyle.dialogbox}>
            <>
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
                {/* {["Individual"]?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={
                          internChecked
                            ? allUsersData
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
                              }))
                            : allUsersData
                              ?.filter(
                                (u) =>
                                  valueCompanyCat?.includes(u.company) &&
                                  valueBranchCat?.includes(u.branch) &&
                                  valueUnitCat?.includes(u.unit) &&
                                  valueTeamCat?.includes(u.team) &&
                                  u.workmode !== "Internship"
                              )
                              .map((u) => ({
                                label: u.companyname,
                                value: u.companyname,
                              }))
                        }
                        value={selectedOptionsEmployee}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Employee"
                      />
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={internChecked}
                          onChange={(event) => {
                            setInternChecked(event.target.checked);
                            setValueEmployeeCat([]);
                            setSelectedOptionsEmployee([]);
                            setValueEmp([]);
                          }}
                        />
                      }
                      label="Internship"
                    />
                  </Grid>
                )} */}
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
                          options={
                            internChecked
                              ? allUsersData
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
                                }))
                              : allUsersData
                                ?.filter(
                                  (u) =>
                                    valueCompanyCat?.includes(u.company) &&
                                    valueBranchCat?.includes(u.branch) &&
                                    valueUnitCat?.includes(u.unit) &&
                                    valueTeamCat?.includes(u.team) &&
                                    u.workmode !== "Internship"
                                )
                                .map((u) => ({
                                  label: u.companyname,
                                  value: u.companyname,
                                }))
                          }
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={internChecked}
                          onChange={(event) => {
                            setInternChecked(event.target.checked);
                            setValueEmployeeCat([]);
                            setSelectedOptionsEmployee([]);
                            setValueEmp([]);
                          }}
                        />
                      }
                      label="Internship"
                    />
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
                          // onClick={() => console.log("clicked chip")}
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
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Typography sx={userStyle.HeaderText}>
                Process Log Entry
              </Typography>
              <br></br>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Employee Name</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="User Id"
                      value={loginNotAllotEdit.companyname}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Company</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput value={loginNotAllot.company} readOnly />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Branch</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput value={loginNotAllot.branch} readOnly />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Unit</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput value={loginNotAllot.unit} readOnly />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Team<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={TeamOptions}
                      value={{
                        label: loginNotAllot.team,
                        value: loginNotAllot.team,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          team: e.value,
                          process: "Please Select Process",
                        });
                        // checkHierarchyName(e.value, "Team");
                        fetchSuperVisorChangingHierarchy(e.value);
                        fetchReportingToUserHierarchy(e.value);
                        ProcessTeamDropdowns(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Date</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      placeholder="Date"
                      value={loginNotAllot.date}
                      inputProps={{
                        min: loginNotAllot.doj, // Set the minimum date to today
                      }}
                      onChange={(e) => {
                        const selectedDate = e.target.value;

                        // Compare selected date with DOJ
                        if (selectedDate >= loginNotAllot.doj) {
                          setLoginNotAllot({
                            ...loginNotAllot,
                            date: selectedDate,
                          });

                          getShiftForDateFirst(
                            loginNotAllotEdit.companyname,
                            selectedDate
                          );
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Process<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={ProcessOptions}
                      value={{
                        label: loginNotAllot.process,
                        value: loginNotAllot.process,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          process: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Process Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={processTypes}
                      value={{
                        label: loginNotAllot.processtype,
                        value: loginNotAllot.processtype,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          processtype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Process Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={processDuration}
                      value={{
                        label: loginNotAllot.processduration,
                        value: loginNotAllot.processduration,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          processduration: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{ label: hours, value: hours }}
                          onChange={(e) => {
                            setHours(e.value);
                            setLoginNotAllot({
                              ...loginNotAllot,
                              time: `${e.value}:${minutes}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="Mins"
                          value={{ label: minutes, value: minutes }}
                          onChange={(e) => {
                            setMinutes(e.value);
                            setLoginNotAllot({
                              ...loginNotAllot,
                              time: `${hours}:${e.value}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>


                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={editSubmit}
                    loading={updateLoader}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Save
                  </LoadingButton>
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEdit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpenSecond}
          onClose={handleCloseModEditSecond}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                Process Allot Entry
              </Typography>
              <br></br>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Employee Name</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="User Id"
                      value={processAllottedSecond?.empname}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Company</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      value={processAllottedSecond?.company}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Branch</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      value={processAllottedSecond?.branch}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Unit</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      value={processAllottedSecond?.unit}
                      readOnly
                    />
                  </FormControl>
                </Grid>



                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Work Mode<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={workmodeOptions}
                      placeholder="Please Select Work Mode"
                      value={{
                        label: processAllottedSecond?.workmode ? processAllottedSecond?.workmode : "Please Select Work Mode",
                        value: processAllottedSecond?.workmode ? processAllottedSecond?.workmode : "Please Select Work Mode",
                      }}
                      onChange={(e) => {
                        setProcessAllottedSecond({
                          ...processAllottedSecond,
                          workmode: e.value,
                          team: "Please Select Team",
                          process: "Please Select Process",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Team<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={TeamOptionsSecond}
                      value={{
                        label: processAllottedSecond?.team,
                        value: processAllottedSecond?.team,
                      }}
                      onChange={(e) => {
                        setProcessAllottedSecond({
                          ...processAllottedSecond,
                          team: e.value,
                          process: "Please Select Process",
                        });
                        // checkHierarchyName(e.value, "Team");
                        fetchSuperVisorChangingHierarchy(e.value);
                        fetchReportingToUserHierarchy(e.value);
                        ProcessTeamDropdownsSecond(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Date</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="deadline-date"
                      type="date"
                      placeholder="Date"
                      value={processAllottedSecond?.date || ""}
                      onChange={(e) => {
                        const selectedDate = e.target.value;

                        // Compare selected date with DOJ
                        if (
                          selectedDate >= processAllottedSecond?.doj &&
                          selectedDate >= processAllottedSecond?.prevdate
                        ) {
                          setProcessAllottedSecond({
                            ...processAllottedSecond,
                            date: selectedDate, // Set only if selected date is valid
                          });
                          getShiftForDateSecond(
                            processAllottedSecond?.empname,
                            selectedDate
                          );
                        }
                      }}
                      inputProps={{
                        min:
                          processAllottedSecond?.prevdate ||
                          processAllottedSecond?.doj, // Set the minimum date to today
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Process<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={ProcessOptionsSecond}
                      value={{
                        label: processAllottedSecond?.process,
                        value: processAllottedSecond?.process,
                      }}
                      onChange={(e) => {
                        setProcessAllottedSecond({
                          ...processAllottedSecond,
                          process: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Process Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={processTypes}
                      value={{
                        label: processAllottedSecond?.processtype,
                        value: processAllottedSecond?.processtype,
                      }}
                      onChange={(e) => {
                        setProcessAllottedSecond({
                          ...processAllottedSecond,
                          processtype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Process Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={processDuration}
                      value={{
                        label: processAllottedSecond?.processduration,
                        value: processAllottedSecond?.processduration,
                      }}
                      onChange={(e) => {
                        setProcessAllottedSecond({
                          ...processAllottedSecond,
                          processduration: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{ label: hours, value: hours }}
                          onChange={(e) => {
                            setHours(e.value);
                            setProcessAllottedSecond({
                              ...processAllottedSecond,
                              time: `${e.value}:${minutes}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="Mins"
                          value={{ label: minutes, value: minutes }}
                          onChange={(e) => {
                            setMinutes(e.value);
                            setProcessAllottedSecond({
                              ...processAllottedSecond,
                              time: `${hours}:${e.value}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <br />

              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={editSubmitSecond}
                    loading={updateLoader}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Update
                  </LoadingButton>
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEditSecond}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lprocesslog") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.HeaderText}>
                Process Log List
              </Typography>
            </Grid>
            <br />
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
                    <MenuItem value={allCompanyUsers?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelprocesslog") && (
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
                  {isUserRoleCompare?.includes("csvprocesslog") && (
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
                  {isUserRoleCompare?.includes("printprocesslog") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfprocesslog") && (
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
                  {isUserRoleCompare?.includes("imageprocesslog") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={allCompanyUsers}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={allCompanyUsers}
                  />
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
            <br />
            <br />
            {tableLoader ? (
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
                  itemsList={allCompanyUsers}
                />
              </>
            )}
          </Box>
        </>
      )}

      {/* Second Page */}

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

      {/* Reason of Leaving  */}
      <Dialog
        open={openviewalert}
        onClose={handleClickOpenviewalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"></Typography>

                    <FormControl size="small" fullWidth>
                      <TextField />
                    </FormControl>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseviewalert}
                  sx={buttonStyles.buttonsubmit}
                >
                  Save
                </Button>
              </Grid>

              <Grid item md={0.2} xs={12} sm={12}></Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseviewalert}
                  sx={buttonStyles.btncancel}
                >
                  {" "}
                  Cancel
                </Button>
              </Grid>
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
        itemsTwo={allCompanyUsers ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default ProcessAllot;