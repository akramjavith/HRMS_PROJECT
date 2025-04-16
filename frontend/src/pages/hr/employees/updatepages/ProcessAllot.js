import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../../components/Errorhandling";
import { MultiSelect } from "react-multi-select-component";
import jsPDF from "jspdf";
import MenuIcon from "@mui/icons-material/Menu";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import StyledDataGrid from "../../../../components/TableStyle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const useStyles = makeStyles((theme) => ({
  timeInput: {
    width: "45%", // Adjust the width as needed
  },
}));

function ProcessAllot() {
  const [hours, setHours] = useState("Hrs");
  const [minutes, setMinutes] = useState("Mins");

  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [oldTeam, setOldTeam] = useState("")
  const [newhierarchyTeam, setNewHierarchyTeam] = useState("")
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
    shift: "Please Select Shift",
    shiftgrouping: "",
    process: "Please Select Process",
    processtype: "Primary",
    processduration: "Full",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    time: "00:00",
    pluseshift: "",
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
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [openviewalert, setOpenviewalert] = useState(false);

  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };

  const handleCloseviewalert = () => {
    setOpenviewalert(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "processAllot.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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

  //process filter
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  const handleCompanyChange = (options) => {
    setSelectedOptionsCompany(options);
  };

  const handleBranchChange = (options) => {
    setSelectedOptionsBranch(options);
  };
  const handleUnitChange = (options) => {
    setSelectedOptionsUnit(options);
  };

  const handleTeamChange = (options) => {
    setSelectedOptionsTeam(options);
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
    empname: true,
    process: true,
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [ProcessOptions, setProcessOptions] = useState([]);
  const ProcessTeamDropdowns = async (e) => {
    let processTeam = e ? e.value : loginNotAllot.team;
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

  //add function
  const sendRequest = async (e) => {
    try {
      let result = allUsersData.filter((item) => {
        if (selectedOptionsTeam.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          let unitdatas = selectedOptionsUnit?.map((item) => item?.value);
          let teamdatas = selectedOptionsTeam?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            unitdatas?.includes(item.unit) &&
            teamdatas?.includes(item.team) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else if (selectedOptionsUnit.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          let unitdatas = selectedOptionsUnit?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            unitdatas?.includes(item.unit) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else if (selectedOptionsBranch.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);

          return (
            compdatas?.includes(item.company) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        }
      });
      setAllCompanyUsers(result);
      setAllCompanyUsersArray(result);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOptionsCompany.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest(e);
    }
  };

  let singleData = {};
  const sendRequestProcess = async (id) => {
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
            shiftgrouping: String(singleData?.shiftgrouping),
            shift: String(singleData?.shifttiming),
            shifttype: String(singleData?.shifttype),
            company: String(singleData?.company),
            pluseshift: String(""),
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      shift: "Please Select Shift",
      shiftgrouping: "",
      process: "Please Select Process",
      processtype: "Primary",
      processduration: "Full",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      time: "00:00",
      pluseshift: "",
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
      shift: "Please Select Shift",
      shiftgrouping: "",
      process: "Please Select Process",
      processtype: "Primary",
      processduration: "Full",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      time: "00:00",
      pluseshift: "",
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

  //get single row to edit....
  const getCode = async (e, name, employeename) => {
    let daysArray = [];
    let startMonthDate = new Date(formattedDate);
    let endMonthDate = new Date(formattedDate);

    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(
        2,
        "0"
      )}/${String(startMonthDate.getMonth() + 1).padStart(
        2,
        "0"
      )}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const dayCount = startMonthDate.getDate();
      const shiftMode = "Main Shift";
      const weekNumberInMonth =
        getWeekNumberInMonth(startMonthDate) === 1
          ? `${getWeekNumberInMonth(startMonthDate)}st Week`
          : getWeekNumberInMonth(startMonthDate) === 2
            ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
            : getWeekNumberInMonth(startMonthDate) === 3
              ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
              : getWeekNumberInMonth(startMonthDate) > 3
                ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                : "";

      daysArray.push({
        formattedDate,
        dayName,
        dayCount,
        shiftMode,
        weekNumberInMonth,
      });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }
    try {
      const [res, res_shiftGroupings, res_usershift] = await Promise.all([
        axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.GETALLSHIFTGROUPS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          userDates: daysArray,
          companyname: employeename,
        }),
      ]);

      handleClickOpenEdit();
      setGettingOldDatas(res?.data?.suser);
      setLoginNotAllotEdit(res?.data?.suser);

      // find shift grp
      const findShiftGroups = (shiftName) => {
        if (!shiftName) {
          return "";
        }

        const foundShiftName = res_shiftGroupings?.data?.shiftgroupings?.find(
          (d) => d.shift.includes(shiftName)
        );
        return foundShiftName
          ? `${foundShiftName.shiftday}_${foundShiftName.shifthours}`
          : "";
      };

      const BranchUnit = allTeam.filter(
        (d) =>
          d.company === res?.data?.suser?.company &&
          d.branch === res?.data?.suser?.branch &&
          d.unit === res?.data?.suser?.unit
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
        shift:
          res_usershift?.data?.finaluser.length === 0
            ? ""
            : res_usershift?.data?.finaluser[0].shift,
        shiftgrouping:
          res_usershift?.data?.finaluser.length === 0
            ? ""
            : findShiftGroups(res_usershift?.data?.finaluser[0].shift),
        pluseshift:
          res_usershift?.data?.finaluser.length === 0
            ? ""
            : res_usershift?.data?.finaluser.length > 1
              ? res_usershift?.data?.finaluser[1].shift
              : "",
      });
      // console.log(res?.data?.suser?.team, 'res?.data?.suser?.team)')
      setOldTeam(res?.data?.suser);
      setLoginNotAllotOld({
        ...loginNotAllotOld,
        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        team: res?.data?.suser?.team,
        shift:
          res_usershift?.data?.finaluser.length === 0
            ? ""
            : res_usershift?.data?.finaluser[0].shift,
        shiftgrouping:
          res_usershift?.data?.finaluser.length === 0
            ? ""
            : findShiftGroups(res_usershift?.data?.finaluser[0].shift),
        pluseshift:
          res_usershift?.data?.finaluser.length === 0
            ? ""
            : res_usershift?.data?.finaluser.length > 1
              ? res_usershift?.data?.finaluser[1].shift
              : "",
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get single row to edit....
  const getCodeSecond = async (e, name) => {
    try {
      const [res, res_shiftGroupings] = await Promise.all([
        axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.GETALLSHIFTGROUPS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      handleClickOpenEditSecond();
      setGettingOldDatas(res?.data?.suser);
      // console.log(res?.data?.suser, 'res?.data?.suser?.team)')
      setOldTeam(res?.data?.suser);
      setProcessAllottedSecondID(res?.data?.suser);
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

      let daysArray = [];
      let startMonthDate = new Date(
        res?.data?.suser.processlog[
          res?.data?.suser?.processlog?.length - 1
        ]?.date
      );
      let endMonthDate = new Date(
        res?.data?.suser.processlog[
          res?.data?.suser?.processlog?.length - 1
        ]?.date
      );

      while (startMonthDate <= endMonthDate) {
        const formattedDate = `${String(startMonthDate.getDate()).padStart(
          2,
          "0"
        )}/${String(startMonthDate.getMonth() + 1).padStart(
          2,
          "0"
        )}/${startMonthDate.getFullYear()}`;
        const dayName = startMonthDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dayCount = startMonthDate.getDate();
        const shiftMode = "Main Shift";
        const weekNumberInMonth =
          getWeekNumberInMonth(startMonthDate) === 1
            ? `${getWeekNumberInMonth(startMonthDate)}st Week`
            : getWeekNumberInMonth(startMonthDate) === 2
              ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
              : getWeekNumberInMonth(startMonthDate) === 3
                ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
                : getWeekNumberInMonth(startMonthDate) > 3
                  ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                  : "";

        daysArray.push({
          formattedDate,
          dayName,
          dayCount,
          shiftMode,
          weekNumberInMonth,
        });

        // Move to the next day
        startMonthDate.setDate(startMonthDate.getDate() + 1);
      }

      let res_usershift = await axios.post(
        SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          userDates: daysArray,
          companyname:
            res?.data?.suser.processlog[
              res?.data?.suser?.processlog?.length - 1
            ]?.empname,
        }
      );

      // find shift grp
      const findShiftGroups = (shiftName) => {
        if (!shiftName) {
          return "";
        }
        const foundShiftName = res_shiftGroupings?.data?.shiftgroupings?.find(
          (d) => d.shift.includes(shiftName)
        );
        return foundShiftName
          ? `${foundShiftName.shiftday}_${foundShiftName.shifthours}`
          : "";
      };

      if (res?.data?.suser?.processlog) {
        let newObj = {
          shifttype: res?.data?.suser?.shifttype,
          empname:
            res?.data?.suser?.processlog[
              res?.data?.suser?.processlog?.length - 1
            ].empname,
          date: res?.data?.suser?.processlog[
            res?.data?.suser?.processlog?.length - 1
          ].date,
          company:
            res?.data?.suser?.processlog[
              res?.data?.suser?.processlog?.length - 1
            ].company,
          shift:
            res_usershift?.data?.finaluser.length === 0
              ? ""
              : res_usershift?.data?.finaluser[0].shift,
          shiftgrouping:
            res_usershift?.data?.finaluser.length === 0
              ? ""
              : findShiftGroups(res_usershift?.data?.finaluser[0].shift),
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
          pluseshift:
            res_usershift?.data?.finaluser.length === 0
              ? ""
              : res?.data?.suser?.processlog[
                res?.data?.suser?.processlog?.length - 1
              ].pluseshift,
        };

        setProcessAllottedSecond(newObj);
        setProcessAllottedSecondOld(newObj);
      } else {
        setProcessAllottedSecond({
          date: "",
          company: res?.data?.suser?.company,
          shifttype: res?.data?.suser?.shifttype,
          shift: "Please Select Shift",
          shiftgrouping: "",
          process: "Please Select Process",
          processtype: "Primary",
          processduration: "Full",
          branch: res?.data?.suser?.branch,
          unit: res?.data?.suser?.unit,
          team: res?.data?.suser?.team,
          time: "00:00",
          pluseshift: "",
        });
        setProcessAllottedSecondOld({
          date: "",
          company: res?.data?.suser?.company,
          shifttype: res?.data?.suser?.shifttype,
          shift: "Please Select Shift",
          shiftgrouping: "",
          process: "Please Select Process",
          processtype: "Primary",
          processduration: "Full",
          branch: res?.data?.suser?.branch,
          unit: res?.data?.suser?.unit,
          team: res?.data?.suser?.team,
          time: "00:00",
          pluseshift: "",
        });
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getShiftForDateFirst = async (value, date) => {
    let daysArray = [];
    let startMonthDate = new Date(date);
    let endMonthDate = new Date(date);

    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(
        2,
        "0"
      )}/${String(startMonthDate.getMonth() + 1).padStart(
        2,
        "0"
      )}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const dayCount = startMonthDate.getDate();
      const shiftMode = "Main Shift";
      const weekNumberInMonth =
        getWeekNumberInMonth(startMonthDate) === 1
          ? `${getWeekNumberInMonth(startMonthDate)}st Week`
          : getWeekNumberInMonth(startMonthDate) === 2
            ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
            : getWeekNumberInMonth(startMonthDate) === 3
              ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
              : getWeekNumberInMonth(startMonthDate) > 3
                ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                : "";

      daysArray.push({
        formattedDate,
        dayName,
        dayCount,
        shiftMode,
        weekNumberInMonth,
      });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    try {
      const [res, res_shiftGroupings] = await Promise.all([
        axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          userDates: daysArray,
          companyname: value,
        }),
        axios.get(SERVICE.GETALLSHIFTGROUPS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      // find shift grp
      const findShiftGroups = (shiftName) => {
        if (!shiftName) {
          return "";
        }
        const foundShiftName = res_shiftGroupings?.data?.shiftgroupings?.find(
          (d) => d.shift.includes(shiftName)
        );
        return foundShiftName
          ? `${foundShiftName.shiftday}_${foundShiftName.shifthours}`
          : "";
      };

      setLoginNotAllot({
        ...loginNotAllot,
        empname: value,
        date: date,
        shift:
          res?.data?.finaluser.length === 0
            ? ""
            : res?.data?.finaluser[0].shift,
        shiftgrouping:
          res?.data?.finaluser.length === 0
            ? ""
            : findShiftGroups(res?.data?.finaluser[0].shift),
        pluseshift:
          res?.data?.finaluser.length === 0
            ? ""
            : res?.data?.finaluser.length > 1
              ? res?.data?.finaluser[1].shift
              : "",
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getShiftForDateSecond = async (value, date) => {
    let daysArray = [];
    let startMonthDate = new Date(date);
    let endMonthDate = new Date(date);

    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(
        2,
        "0"
      )}/${String(startMonthDate.getMonth() + 1).padStart(
        2,
        "0"
      )}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const dayCount = startMonthDate.getDate();
      const shiftMode = "Main Shift";
      const weekNumberInMonth =
        getWeekNumberInMonth(startMonthDate) === 1
          ? `${getWeekNumberInMonth(startMonthDate)}st Week`
          : getWeekNumberInMonth(startMonthDate) === 2
            ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
            : getWeekNumberInMonth(startMonthDate) === 3
              ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
              : getWeekNumberInMonth(startMonthDate) > 3
                ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                : "";

      daysArray.push({
        formattedDate,
        dayName,
        dayCount,
        shiftMode,
        weekNumberInMonth,
      });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    try {
      const [res, res_shiftGroupings] = await Promise.all([
        axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          userDates: daysArray,
          companyname: value,
        }),
        axios.get(SERVICE.GETALLSHIFTGROUPS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      // find shift grp
      const findShiftGroups = (shiftName) => {
        if (!shiftName) {
          return "";
        }
        const foundShiftName = res_shiftGroupings?.data?.shiftgroupings?.find(
          (d) => d.shift.includes(shiftName)
        );

        return foundShiftName
          ? `${foundShiftName.shiftday}_${foundShiftName.shifthours}`
          : "";
      };
      setProcessAllottedSecond({
        ...processAllottedSecond,
        empname: value,
        date: date,
        shift:
          res?.data?.finaluser.length === 0
            ? ""
            : res?.data?.finaluser[0].shift,
        shiftgrouping:
          res?.data?.finaluser.length === 0
            ? ""
            : findShiftGroups(res?.data?.finaluser[0].shift),
        pluseshift:
          res?.data?.finaluser.length === 0
            ? ""
            : res?.data?.finaluser.length > 1
              ? res?.data?.finaluser[1].shift
              : "",
      });
      setProcessAllottedSecondOld({
        ...processAllottedSecond,
        empname: value,
        date: date,
        shift:
          res?.data?.finaluser.length === 0
            ? ""
            : res?.data?.finaluser[0].shift,
        shiftgrouping:
          res?.data?.finaluser.length === 0
            ? ""
            : findShiftGroups(res?.data?.finaluser[0].shift),
        pluseshift:
          res?.data?.finaluser.length === 0
            ? ""
            : res?.data?.finaluser.length > 1
              ? res?.data?.finaluser[1].shift
              : "",
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchTeamSecond = async (e) => {
    let answerUnit = e ? e.value : processAllottedSecond?.unit;
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [ProcessOptionsSecond, setProcessOptionsSecond] = useState([]);
  const ProcessTeamDropdownsSecond = async (e) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

  const checkHierarchyName = async (newValue, type) => {
    try {
      if (
        type === "Designation"
          ? newValue != getingOlddatas?.department
          : newValue != getingOlddatas?.team
      ) {
        let res = await axios.post(SERVICE.HIERARCHI_TEAM_DESIGNATION_CHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldname: getingOlddatas,
          newname: newValue,
          type: type,
          username: getingOlddatas.companyname,
          designation: getingOlddatas.designation,
        });
        setGettingDesigGroup(res?.data?.desiggroup)
        setOldHierarchyData(res?.data?.hierarchyold);
        setNewHierarchyData(res?.data?.hierarchyfindchange);
        setOldHierarchyDataSupervisor(res?.data?.hierarchyoldsupervisor);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


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
        desiggroup: designationGrpName
      });
      const oldData = res?.data?.olddata?.length > 0 ? res?.data?.olddata : [];
      const newDataAll = res?.data?.newdata[0]?.all?.length > 0 ? res?.data?.newdata[0]?.all : [];
      const newDataRemaining = res?.data?.newdata[0]?.team?.length > 0 ? res?.data?.newdata[0]?.team : [];
      const newDataAllSupervisor = res?.data?.supData?.length > 0 ? res?.data?.supData : [];
       setoldTeamSupervisor(newDataAllSupervisor)
      setOldTeamData(oldData);
      setNewUpdateDataAll(newDataAll);
      setNewDataTeamWise(newDataRemaining)
      // console.log(oldData, newDataAll, newDataRemaining , newDataAllSupervisor)
    }
    else {
      setOldTeamData([]);
      setNewUpdateDataAll([]);
      setNewDataTeamWise([])
    }

  }
  const fetchReportingToUserHierarchy = async (value) => {
    if (oldTeam?.team !== value) {
      // console.log(value, oldTeam, 'value')
      let designationGrpName = alldesignation?.find(
        (data) => oldTeam?.designation === data?.name
      )?.group;
      let res = await axios.post(SERVICE.REPORTINGTO_PROCESS_USER_HIERARCHY_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldteam: oldTeam?.team,
        team: value,
        user: oldTeam,
        desiggroup: designationGrpName
      });

      const userResponse = res?.data?.newdata[0]?.result?.length > 0 ? res?.data?.newdata[0]?.result : []
      setUserReportingToChange(userResponse)
      // console.log(userResponse , 'New Data')
    }
    else {
      setUserReportingToChange([])
    }


  }

  //editing the single data...
  const sendEditRequestSecond = async () => {
    try {

      if (processAllottedSecondID.team === processAllottedSecond.team) {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${processid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          process: String(processAllottedSecond.process),
          processtype: String(processAllottedSecond.processtype),
          processduration: String(processAllottedSecond.processduration),
          time: String(hours),
          timemins: String(minutes),
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
          updatedby: [
            ...updatebySecond,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      } else {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${processid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          process: String(processAllottedSecond.process),
          processtype: String(processAllottedSecond.processtype),
          processduration: String(processAllottedSecond.processduration),
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
              date: String(processAllottedSecond.date),
              time: `${hours}:${minutes}`,
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
            },
          ],
          boardingLog: [
            ...processAllottedSecondID.boardingLog,
            {
              shifttype: processAllottedSecondID?.boardingLog[
                processAllottedSecondID?.boardingLog?.length - 1
              ].shifttype,
              shifttiming: processAllottedSecondID?.boardingLog[
                processAllottedSecondID?.boardingLog?.length - 1
              ].shifttiming,
              shiftgrouping: processAllottedSecondID?.boardingLog[
                processAllottedSecondID?.boardingLog?.length - 1
              ].shiftgrouping,
              weekoff: processAllottedSecondID?.boardingLog[
                processAllottedSecondID?.boardingLog?.length - 1
              ].weekoff,
              todo: processAllottedSecondID?.boardingLog[
                processAllottedSecondID?.boardingLog?.length - 1
              ].todo,
              logeditedby: [],
              company: String(processAllottedSecondID.company),
              branch: String(processAllottedSecondID.branch),
              unit: String(processAllottedSecondID.unit),
              floor: String(processAllottedSecondID.floor),
              area: String(processAllottedSecondID.area),
              workstation: String(processAllottedSecondID.workstation),
              team: String(processAllottedSecond.team),
              username: String(processAllottedSecondID.companyname),
              startdate: String(processAllottedSecond.date),
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
              time: `${hours}:${minutes}`,
              logcreation: "process",
              ischangecompany: Boolean(false),
              ischangebranch: Boolean(false),
              ischangeunit: Boolean(false),
              ischangeteam: Boolean(true),
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
      }
      // Deleting the Old Data of TEAM MATCHED
      if (oldTeamData?.length > 0) {
        let ans = oldTeamData?.map(data => {
          axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        })

      }
      // Adding NEW TEAM TO ALL Conditon Employee
      if (newUpdateDataAll?.length > 0) {
        let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          company: String(newUpdateDataAll[0].company),
          designationgroup: String(newUpdateDataAll[0]?.designationgroup),
          department: String(newUpdateDataAll[0].department),
          branch: String(newUpdateDataAll[0].branch),
          unit: String(newUpdateDataAll[0].unit),
          team: String(processAllottedSecond.team,),
          supervisorchoose: String(newUpdateDataAll[0].supervisorchoose),
          mode: String(newUpdateDataAll[0].mode),
          level: String(newUpdateDataAll[0].level),
          control: String(newUpdateDataAll[0].control),
          employeename: processAllottedSecond.empname,
          access: newUpdateDataAll[0].access,
          action: Boolean(true),
          empbranch: processAllottedSecond?.branch,
          empunit: processAllottedSecond.unit,
          empcode: oldTeam?.empcode,
          empteam: processAllottedSecond.team,
          addedby: [
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        });

        //Removing Name From the Old one
        let oldHierarchy = oldHierarchyData?.map((data) => {
          let oldemployeename = data.employeename?.filter(
            (ite) => ite != loginNotAllotEdit?.companyname
          );
          if (oldemployeename?.length > 1) {
            let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              employeename: oldemployeename,
            });
          } else {
            let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            });
          }
        });
      }

      // Adding NEW TEAM TO ACTUAL TEAM WISE DATA  Conditon Employee
      if (newDataTeamWise?.length > 0) {
        let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          company: String(newDataTeamWise[0].company),
          designationgroup: String(newDataTeamWise[0]?.designationgroup),
          department: String(newDataTeamWise[0].department),
          branch: String(newDataTeamWise[0].branch),
          unit: String(newDataTeamWise[0].unit),
          team: String(processAllottedSecond.team,),
          supervisorchoose: String(newDataTeamWise[0].supervisorchoose),
          mode: String(newDataTeamWise[0].mode),
          level: String(newDataTeamWise[0].level),
          control: String(newDataTeamWise[0].control),
          employeename: processAllottedSecond.empname,
          access: newDataTeamWise[0].access,
          action: Boolean(true),
          empbranch: processAllottedSecond?.branch,
          empunit: processAllottedSecond.unit,
          empcode: oldTeam?.empcode,
          empteam: processAllottedSecond.team,
          addedby: [
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        });

        //Removing Name From the Old one
        let oldHierarchy = oldHierarchyData?.map((data) => {
          let oldemployeename = data.employeename?.filter(
            (ite) => ite != loginNotAllotEdit?.companyname
          );
          if (oldemployeename?.length > 1) {
            let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              employeename: oldemployeename,
            });
          } else {
            let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            });
          }
        });
      }


      if((newUpdateDataAll?.length > 0 || newDataTeamWise?.length > 0) &&  userReportingToChange?.length > 0){
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
        shifttype: "",
        shift: "Please Select Shift",
        shiftgrouping: "",
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
      await sendRequest();
      handleCloseModEditSecond();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7AC767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //editing the single data...
  const sendEditRequest = async () => {
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
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          process: String(loginNotAllot.process),
          processtype: String(loginNotAllot.processtype),
          processduration: String(loginNotAllot.processduration),
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
            ...loginNotAllotEdit.boardingLog,
            {
              logeditedby: [],
              updateddatetime: String(new Date()),
              updatedusername: String(isUserRoleAccess.companyname),
              shifttiming: loginNotAllotEdit?.boardingLog[
                loginNotAllotEdit?.boardingLog?.length - 1
              ]?.shifttiming,
              shiftgrouping: loginNotAllotEdit?.boardingLog[
                loginNotAllotEdit?.boardingLog?.length - 1
              ]?.shiftgrouping,
              shifttype: loginNotAllotEdit?.boardingLog[
                loginNotAllotEdit?.boardingLog?.length - 1
              ]?.shifttype,
              company: String(loginNotAllotEdit.company),
              branch: String(loginNotAllotEdit.branch),
              unit: String(loginNotAllotEdit.unit),
              team: String(loginNotAllot.team),
              floor: String(loginNotAllotEdit.floor),
              area: String(loginNotAllotEdit.area),
              workstation: String(loginNotAllotEdit.workstation),
              username: String(loginNotAllotEdit.companyname),
              startdate: String(loginNotAllot.date),
              time: `${hours}:${minutes}`,
              logcreation: "process",
              ischangecompany: Boolean(false),
              ischangebranch: Boolean(false),
              ischangeunit: Boolean(false),
              ischangeteam: Boolean(true),
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
        let ans = oldTeamData?.map(data => {
          axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        })

      }
      // Adding NEW TEAM TO ALL Conditon Employee
      if (newUpdateDataAll?.length > 0) {
        let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          company: String(newUpdateDataAll[0].company),
          designationgroup: String(newUpdateDataAll[0]?.designationgroup),
          department: String(newUpdateDataAll[0].department),
          branch: String(newUpdateDataAll[0].branch),
          unit: String(newUpdateDataAll[0].unit),
          team: String(processAllottedSecond.team,),
          supervisorchoose: String(newUpdateDataAll[0].supervisorchoose),
          mode: String(newUpdateDataAll[0].mode),
          level: String(newUpdateDataAll[0].level),
          control: String(newUpdateDataAll[0].control),
          employeename: processAllottedSecond.empname,
          access: newUpdateDataAll[0].access,
          action: Boolean(true),
          empbranch: processAllottedSecond?.branch,
          empunit: processAllottedSecond.unit,
          empcode: oldTeam?.empcode,
          empteam: processAllottedSecond.team,
          addedby: [
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        });

        //Removing Name From the Old one
        let oldHierarchy = oldHierarchyData?.map((data) => {
          let oldemployeename = data.employeename?.filter(
            (ite) => ite != loginNotAllotEdit?.companyname
          );
          if (oldemployeename?.length > 1) {
            let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              employeename: oldemployeename,
            });
          } else {
            let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            });
          }
        });
      }

      // Adding NEW TEAM TO ACTUAL TEAM WISE DATA  Conditon Employee
      if (newDataTeamWise?.length > 0) {
        let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          company: String(newDataTeamWise[0].company),
          designationgroup: String(newDataTeamWise[0]?.designationgroup),
          department: String(newDataTeamWise[0].department),
          branch: String(newDataTeamWise[0].branch),
          unit: String(newDataTeamWise[0].unit),
          team: String(processAllottedSecond.team,),
          supervisorchoose: String(newDataTeamWise[0].supervisorchoose),
          mode: String(newDataTeamWise[0].mode),
          level: String(newDataTeamWise[0].level),
          control: String(newDataTeamWise[0].control),
          employeename: processAllottedSecond.empname,
          access: newDataTeamWise[0].access,
          action: Boolean(true),
          empbranch: processAllottedSecond?.branch,
          empunit: processAllottedSecond.unit,
          empcode: oldTeam?.empcode,
          empteam: processAllottedSecond.team,
          addedby: [
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        });

        //Removing Name From the Old one
        let oldHierarchy = oldHierarchyData?.map((data) => {
          let oldemployeename = data.employeename?.filter(
            (ite) => ite != loginNotAllotEdit?.companyname
          );
          if (oldemployeename?.length > 1) {
            let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              employeename: oldemployeename,
            });
          } else {
            let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            });
          }
        });
      }
      if((newUpdateDataAll?.length > 0 || newDataTeamWise?.length > 0) &&  userReportingToChange?.length > 0){
        console.log("Success")
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
        shift: "Please Select Shift",
        shiftgrouping: "",
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
      await sendRequest();
      handleCloseModEdit();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7AC767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // console.log(newUpdateDataAll?.length > 0 ,  newDataTeamWise?.length > 0 ,  userReportingToChange?.length > 0)
  const editSubmit = (e) => {
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(loginNotAllot).some(
      (key) => loginNotAllot[key] !== loginNotAllotOld[key]
    );
    if (
      loginNotAllot.team === "Please Select Team" ||
      loginNotAllot.team === undefined ||
      loginNotAllot.team === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      loginNotAllot.process === "Please Select Process" ||
      loginNotAllot.process === "" ||
      loginNotAllot.process === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      loginNotAllot.processtype === "" ||
      loginNotAllot.processtype === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      loginNotAllot.processduration === "" ||
      loginNotAllot.processduration === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process Duration"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      loginNotAllot.time === "Hrs:Mins" ||
      loginNotAllot.time === "" ||
      loginNotAllot.time === undefined ||
      loginNotAllot.time.includes("Mins") ||
      loginNotAllot.time.includes("Hrs") ||
      loginNotAllot.time === "00:00"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Duration"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      loginNotAllot.shiftgrouping === "" &&
      loginNotAllot.shift === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "Shift is not alloted for the selected date. Please select another date"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!isChanged) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No Changes to Update"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };
  const editSubmitSecond = (e) => {
    e.preventDefault();
    const isChanged = Object.keys(processAllottedSecond).some(
      (key) => processAllottedSecond[key] !== processAllottedSecondOld[key]
    );
    if (
      processAllottedSecond.team === "Please Select Team" ||
      processAllottedSecond.team === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      processAllottedSecond.process === "Please Select Process" ||
      processAllottedSecond.process === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      processAllottedSecond.processtype === "" ||
      processAllottedSecond.processtype === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      processAllottedSecond.processduration === "" ||
      processAllottedSecond.processduration === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process Duration"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      processAllottedSecond.time === "Hrs:Mins" ||
      processAllottedSecond.time === "" ||
      processAllottedSecond.time === undefined ||
      processAllottedSecond.time.includes("Mins") ||
      processAllottedSecond.time.includes("Hrs") ||
      processAllottedSecond.time === "00:00"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Duration"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      processAllottedSecond.shiftgrouping === "" &&
      processAllottedSecond.shift === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "Shift is not alloted for the selected date. Please select another date"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!isChanged) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No Changes to Update"}
          </p>
        </>
      );
      handleClickOpenerr();
    }


    else if (isChanged && oldTeamData?.length > 0 && (newUpdateDataAll?.length < 1 && newDataTeamWise?.length < 1)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"This Employee is not allowed to Change Team with their Designation , Create in Hierarchy First"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isChanged && oldTeamSupervisor?.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"This Employee is supervisor in hierarchy , So not allowed to Change Team."}
          </p>
        </>
      );
      handleClickOpenerr();
    }


    else {
       sendEditRequestSecond();
    }
  };

  // pdf.....
  const columns = [
    { title: "Company Name", field: "company" },
    { title: "Branch Name", field: "branch" },
    { title: "Employee Name", field: "companyname" },
    { title: "Role Name", field: "role" },
    { title: "Department Name", field: "department" },
    { title: "Unit Name", field: "unit" },
    { title: "Team Name", field: "team" },
    { title: "Process Name", field: "process" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          companyname: row.empname,
        }))
        : allCompanyUsersArray.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
        }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("processAllot.pdf");
  };

  // Excel
  const fileName = "processAllot";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Process_Allot_List",
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

  const addSerialNumber = () => {
    const itemsWithSerialNumber = allCompanyUsers?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [allCompanyUsers]);

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

            // Update the "Select ALL" checkbox based on whether all rows are selected
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
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "empname",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.empname,
      headerClassName: "bold-header",
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
              text={params?.row?.empname}
            >
              <ListItemText primary={params?.row?.empname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "role",
      headerName: "Role Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.role,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vprocesslog") &&
            params.row.process !== undefined && (
              <Button
                variant="contained"
                sx={{
                  minWidth: "15px",
                  padding: "6px 5px",
                }}
                onClick={() => {
                  sendRequestProcess(params.row.id);
                }}
              >
                <MenuIcon style={{ fontsize: "small" }} />
              </Button>
            )}
          &ensp;
          {isUserRoleCompare?.includes("eprocesslog") &&
            params.row.process === undefined && (
              <Button
                variant="contained"
                onClick={(e) => {
                  getCode(params.row.id, params.row.name, params.row.empname);
                }}
              >
                CHANGE
              </Button>
            )}
          {isUserRoleCompare?.includes("eprocesslog") &&
            params.row.process !== undefined && (
              <Button
                variant="contained"
                onClick={(e) => {
                  handleClickOpenEditSecond();
                  getCodeSecond(params.row.id, params.row.name);
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
      id: item._id,
      serialNumber: item.serialNumber,
      branch: item.branch,
      company: item.company,
      unit: item.unit,
      team: item.team,
      empname: item.companyname,
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
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          company: t.company,
          branch: t.branch,
          companyname: t.empname,
          role: t.role?.toString(),
          department: t.department,
          unit: t.unit,
          team: t.team,
          process: t.process,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        allCompanyUsersArray.map((t, index) => ({
          Sno: index + 1,
          company: t.company,
          branch: t.branch,
          empname: t.companyname,
          role: t.role?.toString(),
          department: t.department,
          unit: t.unit,
          team: t.team,
          process: t.process,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const customValueRendererCompany = (valueCate) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Company";
  };
  const customValueRendererBranch = (valueCate) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Branch";
  };
  const customValueRendererUnit = (valueCate) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Unit";
  };
  const customValueRendererTeam = (valueCate) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Team";
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"Process Allot"} />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("aprocesslog") && (
        <>
          <Typography sx={userStyle.HeaderText}>Process Allot</Typography>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}></Grid>
              <br />
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
                      valueRenderer={customValueRendererCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                        setSelectedOptionsBranch([]);

                        setSelectedOptionsUnit([]);
                        setSelectedOptionsTeam([]);
                      }}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
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
                      valueRenderer={customValueRendererBranch}
                      onChange={(e) => {
                        handleBranchChange(e);
                        setSelectedOptionsTeam([]);
                        setSelectedOptionsUnit([]);
                      }}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Unit</Typography>
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
                      valueRenderer={customValueRendererUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                        setSelectedOptionsTeam([]);
                      }}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Team</Typography>
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
                      valueRenderer={customValueRendererTeam}
                      onChange={(e) => {
                        handleTeamChange(e);
                      }}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1.5} xs={12} sm={6}>
                  <Button variant="contained" onClick={handleSubmit}>
                    Filter
                  </Button>
                </Grid>
                <Grid item md={1.5} xs={12} sm={6}>
                  <Button
                    variant="error"
                    sx={userStyle.btncancel}
                    onClick={(e) => {
                      setSelectedOptionsCompany([]);
                      setSelectedOptionsBranch([]);
                      setSelectedOptionsUnit([]);
                      setSelectedOptionsTeam([]);
                      setAllCompanyUsers([]);
                      setAllCompanyUsersArray([]);
                    }}
                  >
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
                      value={loginNotAllotEdit.companyname}
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
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          date: e.target.value,
                        });
                        getShiftForDateFirst(
                          loginNotAllotEdit.companyname,
                          e.target.value
                        );
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Main Shift</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={loginNotAllot.shift}
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
                        checkHierarchyName(e.value, "Team");
                        fetchSuperVisorChangingHierarchy(e.value)
                        fetchReportingToUserHierarchy(e.value)
                        ProcessTeamDropdowns(e);
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
                  <Button
                    variant="contained"
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
                    }}
                    onClick={editSubmit}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
                  <Typography>Date</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      placeholder="Date"
                      value={processAllottedSecond?.date}
                      onChange={(e) => {
                        setProcessAllottedSecond({
                          ...processAllottedSecond,
                          date: e.target.value,
                        });
                        getShiftForDateSecond(
                          processAllottedSecond?.empname,
                          e.target.value
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Main Shift</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={processAllottedSecond?.shift}
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
                        checkHierarchyName(e.value, "Team");
                        fetchSuperVisorChangingHierarchy(e.value)
                        fetchReportingToUserHierarchy(e.value)
                        ProcessTeamDropdownsSecond(e);
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
                  <Button
                    variant="contained"
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
                    }}
                    onClick={editSubmitSecond}
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
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
                Process Allot List
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
                    {/* <MenuItem value={allCompanyUsers?.length}>All</MenuItem> */}
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
            <br />
            <br />
            {!allCompanyUsers ? (
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
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
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
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

      {/* Delete Modal */}
      <Box>
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRef}
          >
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell> Role Name</TableCell>
                <TableCell> Department Name</TableCell>
                <TableCell> Unit Name</TableCell>
                <TableCell> Team Name</TableCell>
                <TableCell>Process</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.empname}</TableCell>
                    <TableCell>
                      {row.role
                        ?.map((t, i) => `${i + 1 + ". "}` + t)
                        .toString()}
                    </TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.process}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
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
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delGroupcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
                >
                  {" "}
                  Cancel
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
          }}
        >
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

          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          )}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
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
    </Box>
  );
}

export default ProcessAllot;