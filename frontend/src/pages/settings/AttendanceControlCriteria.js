import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  FormControl,
  Dialog,
  DialogActions,
  TableBody,
  DialogContent,
  Grid,
  Button,
  OutlinedInput,
  Table,
  TableHead,
  TableContainer,
  Paper,
  Divider,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { Link } from "react-router-dom";
import { SERVICE } from "../../services/Baseservice";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import CloseIcon from "@mui/icons-material/Close";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

function AttendanceControlCriteria() {

  const shiftTypeOpt = [
    { label: "Day Shift", value: "Day Shift" },
    { label: "Night Shift", value: "Night Shift" }
  ]
  const timeTypeOpt = [
    { label: "Before", value: "Before" },
    { label: "After", value: "After" }
  ]

  const [shifType, setShifType] = useState({

    startShiftDay: "Day Shift",
    startTimeDay: "Before",
    startHourDay: "00",
    startMinDay: "00",

    startShiftNight: "Night Shift",
    startTimeNight: "Before",
    startHourNight: "00",
    startMinNight: "00",
    dayactive: "In-Active",
    nightactive: "In-Active",


    entrystatusDays: "0",
    entrystatusHour: "00",
    entrystatusMin: "00",
    
    approvalstatusDays: "0",
    approvalstatusHour: "00",
    approvalstatusMin: "00",

  });
  const [timeType, setTimeType] = useState("");

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
  }
  const { isUserRoleCompare, isAssignBranch, allUsersData, allTeam, pageName, setPageName, } = useContext(UserRoleAccessContext);
  const [overAllsettingsCount, setOverAllsettingsCount] = useState();
  const [overAllsettingsID, setOverAllsettingsID] = useState();
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);
  const [allData, setAllData] = useState({
    clockin: "",
    clockout: "",
    gracetime: "",
    onclockout: "",
    earlyclockin: "",
    lateclockin: "",
    earlyclockout: "",
    afterlateclockin: "",
    beforeearlyclockout: "",
    //
    lateclockincount: "",
    lateclockinreduces: "Half day",
    lateclockinmorethanthat: "Half day",
    //
    earlyclockoutcount: "",
    earlyclockoutreduces: "Half day",
    earlyclockoutmorethanthat: "Half day",
    //
    permissionperdayduration: "00:00",
    permissionpermonthduration: "",
    //
    leaverespecttoweekoff: false,
    leaverespecttotraining: false,
    //
    uninformedleave: false,
    uninformedleavecount: "",
    //
    leavefornoticeperiod: false,
    leavefornoticeperiodcount: "",
    //
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    //
    relievingfromdate: "",
    relievingtodate: "",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  const [allTodo, setAllTodo] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState("");
  const [singleTodo, setSingleTodo] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    employeename: "Please Select Employee Name",
    employeedbid: "",
    employeeleaverespecttoweekoff: false,
    employeegracetime: "",
  });
  const addTodo = () => {
    const isNameMatch = allTodo?.some(
      (item) =>
        item.company === singleTodo.company &&
        item.branch === singleTodo.branch &&
        item.unit === singleTodo.unit &&
        item.team === singleTodo.team &&
        item.employeename === singleTodo.employeename &&
        item.employeedbid === singleTodo.employeedbid
    );
    if (singleTodo.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleTodo.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleTodo.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleTodo.team === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    } else if (singleTodo.employeename === "Please Select Employee Name") {
      setPopupContentMalert("Please Select Employee");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    } else if (
      singleTodo.employeegracetime === "" ||
      Number(singleTodo.employeegracetime) <= 0
    ) {
      setPopupContentMalert("Please Enter Grace Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    } else if (isNameMatch) {
      setPopupContentMalert("Employee already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleTodo !== "") {
      setAllTodo([...allTodo, singleTodo]);
      setSingleTodo({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employeename: "Please Select Employee Name",
        employeedbid: "",
        employeeleaverespecttoweekoff: false,
        employeegracetime: "",
      });
    }
  };
  const deleteTodo = (index) => {
    const newTasks = [...allTodo];
    newTasks.splice(index, 1);
    setAllTodo(newTasks);
    handleCloseMod();
  };
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [hours, setHours] = useState("Hrs");
  const [minutes, setMinutes] = useState("Mins");
  const [hoursMonths, setHoursMonths] = useState("Hrs");
  const [minutesMonths, setMinutesMonths] = useState("Mins");
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
  const reduceOptions = [
    { label: "Half Day", value: "Half Day" },
    { label: "Full Day", value: "Full Day" },
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
  const fetchOverAllSettings = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
      : [];
    setPageName(!pageName)
    try {
      let res = await axios.post(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIAASSIGNBRANCH}`, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoading(true);
      if (res?.data?.count === 0) {
        setOverAllsettingsCount(res?.data?.count);
      } else {
        const lastObject =
          res?.data?.attendancecontrolcriteria[
          res?.data?.attendancecontrolcriteria.length - 1
          ];
        const lastObjectId = lastObject._id;
        setOverAllsettingsID(lastObjectId);
        setAllData(
          res?.data?.attendancecontrolcriteria[
          res?.data?.attendancecontrolcriteria.length - 1
          ]
        );
        setAllTodo(
          res?.data?.attendancecontrolcriteria[
            res?.data?.attendancecontrolcriteria.length - 1
          ]?.todos
        );
        const [hours, minutes] =
          res?.data?.attendancecontrolcriteria[
            res?.data?.attendancecontrolcriteria.length - 1
          ].permissionperdayduration.split(":");
        setHours(hours);
        setMinutes(minutes);
        const [hoursmonth, minutesmonth] =
          res?.data?.attendancecontrolcriteria[
            res?.data?.attendancecontrolcriteria.length - 1
          ].permissionpermonthduration;
        setHoursMonths(hoursmonth);
        setMinutesMonths(minutesmonth);
        setShifType({
          ...shifType,

          startShiftDay: lastObject.calcshiftday ? lastObject.calcshiftday : shifType.startShiftDay,
          startTimeDay: lastObject.calcshifttimeday ? lastObject.calcshifttimeday : shifType.startTimeDay,
          startHourDay: lastObject.calcshifthourday ? lastObject.calcshifthourday : shifType.startHourDay,
          startMinDay: lastObject.calcshiftminday ? lastObject.calcshiftminday : shifType.startMinDay,

          startShiftNight: lastObject.calcshiftnight ? lastObject.calcshiftnight : shifType.startShiftNight,
          startTimeNight: lastObject.calcshifttimenight ? lastObject.calcshifttimenight : shifType.startTimeDay,
          startHourNight: lastObject.calcshifthournight ? lastObject.calcshifthournight : shifType.startHourNight,
          startMinNight: lastObject.calcshiftminnight ? lastObject.calcshiftminnight : shifType.startMinNight,

          dayactive: lastObject.dayactive ? (lastObject.dayactive === true ? "Active" : "In-Active") : shifType.dayactive,
          nightactive: lastObject.nightactive ? (lastObject.nightactive === true ? "Active" : "In-Active") : shifType.nightactive,

          entrystatusDays: lastObject.entrystatusDays ? lastObject.entrystatusDays : shifType.entrystatusDays,
          entrystatusHour: lastObject.entrystatusHour ? lastObject.entrystatusHour : shifType.entrystatusHour,
          entrystatusMin: lastObject.entrystatusMin ? lastObject.entrystatusMin : shifType.entrystatusMin,

          approvalstatusDays: lastObject.approvalstatusDays ? lastObject.approvalstatusDays : shifType.approvalstatusDays,
          approvalstatusHour: lastObject.approvalstatusHour ? lastObject.approvalstatusHour : shifType.approvalstatusHour,
          approvalstatusMin: lastObject.approvalstatusMin ? lastObject.approvalstatusMin : shifType.approvalstatusMin,
        })

      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchOverAllSettings();
    generateHrsOptions();
    generateMinsOptions();
  }, []);
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.post(
        `${SERVICE.CREATE_ATTENDANCE_CONTROL_CRITERIA}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          clockin: String(allData.clockin),
          clockout: String(allData.clockout),
          gracetime: String(allData.gracetime),
          onclockout: String(allData.onclockout),
          earlyclockin: String(allData.earlyclockin),
          lateclockin: String(allData.lateclockin),
          earlyclockout: String(allData.earlyclockout),
          //
          afterlateclockin: String(allData.afterlateclockin),
          beforeearlyclockout: String(allData.beforeearlyclockout),
          lateclockincount: String(allData.lateclockincount),
          lateclockinreduces: String(allData.lateclockinreduces),
          lateclockinmorethanthat: String(allData.lateclockinmorethanthat),
          //
          earlyclockoutcount: String(allData.earlyclockoutcount),
          earlyclockoutreduces: String(allData.earlyclockoutreduces),
          earlyclockoutmorethanthat: String(allData.earlyclockoutmorethanthat),
          //
          permissionperdayduration: String(allData.permissionperdayduration),
          permissionpermonthduration: String(
            allData.permissionpermonthduration
          ),
          //
          leaverespecttoweekoff: Boolean(allData.leaverespecttoweekoff),
          leaverespecttotraining: Boolean(allData.leaverespecttotraining),
          //
          uninformedleave: Boolean(allData.uninformedleave),
          uninformedleavecount: String(allData.uninformedleavecount),
          //
          leavefornoticeperiod: Boolean(allData.leavefornoticeperiod),
          leavefornoticeperiodcount: String(allData.leavefornoticeperiodcount),
          //
          monday: Boolean(allData.monday),
          tuesday: Boolean(allData.tuesday),
          wednesday: Boolean(allData.wednesday),
          thursday: Boolean(allData.thursday),
          friday: Boolean(allData.friday),
          saturday: Boolean(allData.saturday),
          //
          relievingfromdate: String(allData.relievingfromdate),
          relievingtodate: String(allData.relievingtodate),
          //
          todos: [...allTodo],
        }
      );
      await fetchOverAllSettings();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_ATTENDANCE_CONTROL_CRITERIA}/${overAllsettingsID}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          clockin: String(allData.clockin),
          clockout: String(allData.clockout),
          gracetime: String(allData.gracetime),
          onclockout: String(allData.onclockout),
          earlyclockin: String(allData.earlyclockin),
          lateclockin: String(allData.lateclockin),
          earlyclockout: String(allData.earlyclockout),
          //
          afterlateclockin: String(allData.afterlateclockin),
          beforeearlyclockout: String(allData.beforeearlyclockout),
          lateclockincount: String(allData.lateclockincount),
          lateclockinreduces: String(allData.lateclockinreduces),
          lateclockinmorethanthat: String(allData.lateclockinmorethanthat),
          //
          earlyclockoutcount: String(allData.earlyclockoutcount),
          earlyclockoutreduces: String(allData.earlyclockoutreduces),
          earlyclockoutmorethanthat: String(allData.earlyclockoutmorethanthat),
          //
          permissionperdayduration: String(allData.permissionperdayduration),
          permissionpermonthduration: String(
            allData.permissionpermonthduration
          ),
          //
          leaverespecttoweekoff: Boolean(allData.leaverespecttoweekoff),
          leaverespecttotraining: Boolean(allData.leaverespecttotraining),
          //
          uninformedleave: Boolean(allData.uninformedleave),
          uninformedleavecount: String(allData.uninformedleavecount),
          //
          leavefornoticeperiod: Boolean(allData.leavefornoticeperiod),
          leavefornoticeperiodcount: String(allData.leavefornoticeperiodcount),
          //
          monday: Boolean(allData.monday),
          tuesday: Boolean(allData.tuesday),
          wednesday: Boolean(allData.wednesday),
          thursday: Boolean(allData.thursday),
          friday: Boolean(allData.friday),
          saturday: Boolean(allData.saturday),
          //
          relievingfromdate: String(allData.relievingfromdate),
          relievingtodate: String(allData.relievingtodate),
          //
          todos: [...allTodo],

          calcshiftday: shifType.startShiftDay,
          calcshifttimeday: shifType.startTimeDay,
          calcshifthourday: shifType.startHourDay,
          calcshiftminday: shifType.startMinDay,

          entrystatusDays: shifType.entrystatusDays,
          entrystatusHour: shifType.entrystatusHour,
          entrystatusMin: shifType.entrystatusMin,
          approvalstatusDays: shifType.approvalstatusDays,
          approvalstatusHour: shifType.approvalstatusHour,
          approvalstatusMin: shifType.approvalstatusMin,

          calcshiftnight: shifType.startShiftNight,
          calcshifttimenight: shifType.startTimeNight,
          calcshifthournight: shifType.startHourNight,
          calcshiftminnight: shifType.startMinNight,

          dayactive: Boolean(shifType.dayactive === "Active" ? true : false),
          nightactive: Boolean(shifType.nightactive === "Active" ? true : false),
        }
      );
      await fetchOverAllSettings();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (overAllsettingsCount === 0) {
      sendRequest();
    } else {
      sendEditRequest();
    }
  };
  return (
    <Box>
      <Headtitle title={"ATTENDANCE CONTROL CRITERIA"} />
      <PageHeading
        title="Manage Attendance Control Criteria"
        modulename="Settings"
        submodulename="Attendance Control Criteria"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {!loading ? (
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
        <Box sx={userStyle.selectcontainer}>
          {isUserRoleCompare?.includes("aattendancecontrolcriteria") && (
            <form onSubmit={handleSubmit}>
              <Typography sx={userStyle.SubHeaderText}>
                Attendance Control Criteria
              </Typography>
              <br />
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>ClockIn (hours)</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={hrsOption}
                      placeholder="Hrs"
                      value={{ label: allData.clockin, value: allData.clockin }}
                      onChange={(e) => {
                        setAllData({
                          ...allData,
                          clockin: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>ClockOut (hours)</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={hrsOption}
                      placeholder="Hrs"
                      value={{
                        label: allData.clockout,
                        value: allData.clockout,
                      }}
                      onChange={(e) => {
                        setAllData({
                          ...allData,
                          clockout: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Grace Time (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Grace Time in Minutes"
                      value={allData.gracetime}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 3);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            gracetime: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>On ClockOut (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter On Clockout in Minutes"
                      value={allData.onclockout}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 2);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            onclockout: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Early ClockIn (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Early ClockIn in Minutes"
                      value={allData.earlyclockin}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 2);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            earlyclockin: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Late Clockin (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Late Clockin in Minutes"
                      value={allData.lateclockin}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 2);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            lateclockin: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Early Clockout (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Early ClockIn in Minutes"
                      value={allData.earlyclockout}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 2);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            earlyclockout: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>After Late Clockin (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Early ClockIn in Minutes"
                      value={allData.afterlateclockin}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 2);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            afterlateclockin: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Before Early Clockout (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Early ClockIn in Minutes"
                      value={allData.beforeearlyclockout}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 2);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            beforeearlyclockout: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}></Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    <b>Allowed Late ClockIn Count (per month) </b>
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Late ClockIn Count"
                          value={allData.lateclockincount}
                          onChange={(e) => {
                            const enteredValue = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 2);
                            if (
                              enteredValue === "" ||
                              /^\d+$/.test(enteredValue)
                            ) {
                              setAllData({
                                ...allData,
                                lateclockincount: enteredValue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    <b>Allowed Early ClockOut Count (per month) </b>
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Early ClockOut Count"
                          value={allData.earlyclockoutcount}
                          onChange={(e) => {
                            const enteredValue = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 2);
                            if (
                              enteredValue === "" ||
                              /^\d+$/.test(enteredValue)
                            ) {
                              setAllData({
                                ...allData,
                                earlyclockoutcount: enteredValue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    <b>Allowed Permission </b>
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>Per Day</Typography>
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
                                setAllData({
                                  ...allData,
                                  permissionperdayduration: `${e.value}:${minutes}`,
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
                                setAllData({
                                  ...allData,
                                  permissionperdayduration: `${hours}:${e.value}`,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>Per Month Count</Typography>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Count"
                              value={allData.permissionpermonthduration}
                              onChange={(e) => {
                                const enteredValue = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 2);
                                if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                  setAllData({
                                    ...allData,
                                    permissionpermonthduration: enteredValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12} xs={12} sm={12}></Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    <b>Reliveing Dates</b>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>From Date</Typography>
                        <OutlinedInput
                          id="from-date"
                          type="date"
                          value={allData.relievingfromdate}
                          onChange={(e) => {
                            setAllData({
                              ...allData,
                              relievingfromdate: e.target.value,
                              relievingtodate: "",
                            });
                            document.getElementById("to-date").min =
                              e.target.value;
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>To Date</Typography>
                        <OutlinedInput
                          id="to-date"
                          type="date"
                          value={allData.relievingtodate}
                          onChange={(e) => {
                            setAllData({
                              ...allData,
                              relievingtodate: e.target.value,
                            });
                          }}
                          min={allData.relievingfromdate}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Todo  */}
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Company"
                      value={{
                        label:
                          singleTodo.company === ""
                            ? "Please Select Company"
                            : singleTodo.company,
                        value:
                          singleTodo.company === ""
                            ? "Please Select Company"
                            : singleTodo.company,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          employeename: "Please Select Employee Name",
                          employeedbid: "",
                          employeeleaverespecttoweekoff: false,
                          employeegracetime: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.filter(
                        (comp) =>
                          singleTodo.company === comp.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Branch"
                      value={{
                        label:
                          singleTodo.branch === ""
                            ? "Please Select Branch"
                            : singleTodo.branch,
                        value:
                          singleTodo.branch === ""
                            ? "Please Select Branch"
                            : singleTodo.branch,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          employeename: "Please Select Employee Name",
                          employeedbid: "",
                          employeeleaverespecttoweekoff: false,
                          employeegracetime: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.filter(
                        (comp) =>
                          singleTodo.company === comp.company && singleTodo.branch === comp.branch
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Unit"
                      value={{
                        label:
                          singleTodo.unit === ""
                            ? "Please Select Unit"
                            : singleTodo.unit,
                        value:
                          singleTodo.unit === ""
                            ? "Please Select Unit"
                            : singleTodo.unit,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          unit: e.value,
                          team: "Please Select Team",
                          employeename: "Please Select Employee Name",
                          employeedbid: "",
                          employeeleaverespecttoweekoff: false,
                          employeegracetime: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={allTeam
                        ?.filter((u) => singleTodo.company === u.company && singleTodo.branch === u.branch && u.unit === singleTodo.unit)
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      placeholder="Please Select Team"
                      value={{
                        label:
                          singleTodo.team === ""
                            ? "Please Select Team"
                            : singleTodo.team,
                        value:
                          singleTodo.team === ""
                            ? "Please Select Team"
                            : singleTodo.team,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          team: e.value,
                          employeename: "Please Select Employee Name",
                          employeedbid: "",
                          employeeleaverespecttoweekoff: false,
                          employeegracetime: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={allUsersData
                        ?.filter(
                          (u) =>
                            u.company === singleTodo.company &&
                            u.branch === singleTodo.branch &&
                            u.unit === singleTodo.unit &&
                            u.team === singleTodo.team
                        )
                        .map((u) => ({
                          ...u,
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      placeholder="Please Select Employee Name"
                      value={{
                        label:
                          singleTodo.employeename === ""
                            ? "Please Select Employee Name"
                            : singleTodo.employeename,
                        value:
                          singleTodo.employeename === ""
                            ? "Please Select Employee Name"
                            : singleTodo.employeename,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          employeename: e.value,
                          employeedbid: e._id,
                          employeeleaverespecttoweekoff: false,
                          employeegracetime: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Grace Time (minutes)<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Grace Time in Minutes"
                      value={singleTodo.employeegracetime}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 3);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setSingleTodo({
                            ...singleTodo,
                            employeegracetime: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.5} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: "30px",
                      minWidth: "20px",
                      padding: "19px 13px",
                      marginTop: "25px",
                    }}
                    onClick={addTodo}
                  >
                    <FaPlus />
                  </Button>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 700 }}
                      aria-label="customized table"
                      id="usertable"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                          <StyledTableCell>SNo</StyledTableCell>
                          <StyledTableCell>Company</StyledTableCell>
                          <StyledTableCell>Branch</StyledTableCell>
                          <StyledTableCell>Unit</StyledTableCell>
                          <StyledTableCell>Team</StyledTableCell>
                          <StyledTableCell>Employee Name</StyledTableCell>
                          <StyledTableCell>Grace Time</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody align="left">
                        {allTodo?.length > 0 ? (
                          allTodo?.map((row, index) => (
                            <StyledTableRow>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>{row.company}</StyledTableCell>
                              <StyledTableCell>{row.branch}</StyledTableCell>
                              <StyledTableCell>{row.unit}</StyledTableCell>
                              <StyledTableCell>{row.team}</StyledTableCell>
                              <StyledTableCell>
                                {row.employeename}
                              </StyledTableCell>
                              <StyledTableCell>
                                {`${row.employeegracetime} minutes`}
                              </StyledTableCell>
                              <StyledTableCell>
                                <CloseIcon
                                  sx={{ color: "red", cursor: "pointer" }}
                                  onClick={() => {
                                    handleClickOpen(index);
                                    setDeleteIndex(index);
                                  }}
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            {" "}
                            <StyledTableCell colSpan={8} align="center">
                              No Data Available
                            </StyledTableCell>{" "}
                          </StyledTableRow>
                        )}
                        <StyledTableRow></StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography> <b>Production Day Calculation</b></Typography>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={2.4} xs={12} sm={12} >
                      <FormControl fullWidth size="small">
                        <Typography>
                          ShiftType<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={shifType.startShiftDay}
                          onChange={(e) => {
                            setShifType({ ...shifType, startShiftDay: e.target.value })
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Shift Time<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={shifType.startTimeDay}
                          onChange={(e) => {
                            setShifType({ ...shifType, startTimeDay: e.target.value })
                          }}
                        />

                      </FormControl>

                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <Typography>Hours</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: shifType.startHourDay, value: shifType.startHourDay }}
                              onChange={(e) => {
                                setShifType({ ...shifType, startHourDay: e.value })

                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <Typography>Mintues</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: shifType.startMinDay, value: shifType.startMinDay }}
                              onChange={(e) => {
                                setShifType({ ...shifType, startMinDay: e.value })

                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Activate Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={[{ label: "Active", value: "Active" }, { label: "In-Active", value: "In-Active" }]}
                          value={{ label: shifType.dayactive, value: shifType.dayactive }}
                          onChange={(e) => {
                            setShifType({ ...shifType, dayactive: e.value })
                          }}
                        />

                      </FormControl>

                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={2.4} xs={12} sm={12} >
                      <FormControl fullWidth size="small">
                        <Typography>
                          ShiftType<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={shifType.startShiftNight}
                          onChange={(e) => {
                            setShifType({ ...shifType, startShiftNight: e.target.value })
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Shift Time<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={shifType.startTimeNight}
                          onChange={(e) => {
                            setShifType({ ...shifType, startTimeNight: e.target.value })
                          }}
                        />

                      </FormControl>

                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <Typography>Hours</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: shifType.startHourNight, value: shifType.startHourNight }}
                              onChange={(e) => {
                                setShifType({ ...shifType, startHourNight: e.value })

                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <Typography>Mintues</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: shifType.startMinNight, value: shifType.startMinNight }}
                              onChange={(e) => {
                                setShifType({ ...shifType, startMinNight: e.value })

                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Activate Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={[{ label: "Active", value: "Active" }, { label: "In-Active", value: "In-Active" }]}
                          value={{ label: shifType.nightactive, value: shifType.nightactive }}
                          onChange={(e) => {
                            setShifType({ ...shifType, nightactive: e.value })
                          }}
                        />

                      </FormControl>

                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
              <br></br>
              <br></br>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography> <b>Production Manual Entry</b></Typography>
                  <br />
                  <Grid container spacing={2}>

                    <Grid item md={12} xs={12} sm={12}>
                      <Typography><strong>Entry status</strong></Typography>
                      <Grid container spacing={1}>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Days</Typography>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Days"
                              value={shifType.entrystatusDays}
                              onChange={(e) => {
                                const enteredValue = e.target.value
                                  .replace(/\D/g, "").slice(0, 2)
                                if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                  setShifType({
                                    ...shifType,
                                    entrystatusDays: enteredValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Hours</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: shifType.entrystatusHour, value: shifType.entrystatusHour }}
                              onChange={(e) => {
                                setShifType({ ...shifType, entrystatusHour: e.value })

                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Mintues</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: shifType.entrystatusMin, value: shifType.entrystatusMin }}
                              onChange={(e) => {
                                setShifType({ ...shifType, entrystatusMin: e.value })

                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>

                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12} sm={12}>
                      <Typography><strong>Approval status</strong></Typography>
                      <Grid container spacing={1}>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Days</Typography>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Days"
                              value={shifType.approvalstatusDays}
                              onChange={(e) => {
                                const enteredValue = e.target.value
                                  .replace(/\D/g, "").slice(0, 2)
                                if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                  setShifType({
                                    ...shifType,
                                    approvalstatusDays: enteredValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Hours</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: shifType.approvalstatusHour, value: shifType.approvalstatusHour }}
                              onChange={(e) => {
                                setShifType({ ...shifType, approvalstatusHour: e.value })

                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Mintues</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: shifType.approvalstatusMin, value: shifType.approvalstatusMin }}
                              onChange={(e) => {
                                setShifType({ ...shifType, approvalstatusMin: e.value })

                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>


                  </Grid>
                </Grid>

              </Grid>
              <br />
              <br />
              <Grid
                container
                sx={{ justifyContent: "center", display: "flex" }}
                spacing={2}
              >
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">
                    Update
                  </Button>
                </Grid>
                <Grid item>
                  <Link
                    to="/dashboard"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {" "}
                    <Button sx={userStyle.btncancel}> Cancel </Button>{" "}
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      )}
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
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseMod}
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
            Are you sure? Do You Want to remove{" "}
            {allTodo[deleteIndex]?.employeename}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            No
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => deleteTodo(deleteIndex)}
          >
            {" "}
            Yes{" "}
          </Button>
        </DialogActions>
      </Dialog>
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
    </Box>
  );
}
export default AttendanceControlCriteria;