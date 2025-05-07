import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Dialog, TextareaAutosize, TextField, FormControlLabel, Checkbox, Divider, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import pdfIcon from "../../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../../components/Assets/word-icon.png";
import excelIcon from "../../../../components/Assets/excel-icon.png";
import csvIcon from "../../../../components/Assets/CSV.png";
import fileIcon from "../../../../components/Assets/file-icons.png";
import successtickimg from "../../../../components/Assets/successImg.png";
import { handleApiError } from "../../../../components/Errorhandling";
import FolderIcon from "@mui/icons-material/Folder";
import { FaExpand, FaTrash } from "react-icons/fa";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { makeStyles } from "@material-ui/core";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CodeIcon from "@mui/icons-material/Code";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));

function TaskTabs() {
  const [viewImage, setViewImage] = useState("");

  const classes = useStyles();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [overallTasks, setOverallTasks] = useState([]);

  const [uiTasks, setUItasks] = useState({});
  const [uiTasksuser, setUItasksuser] = useState([]);
  const [checktask, setchecktask] = useState(false);
  const [todosedit, setTodosedit] = useState([]);
  const [indexid, setIndexid] = useState("");
  const [indexstate, setIndexstate] = useState("");
  const [usersid, setUsersid] = useState([]);
  const { auth } = useContext(AuthContext);
  const [value, setValue] = useState("1");
  const [refCode, setRefCode] = useState("");
  const [refImage, setRefImage] = useState([]);
  const [refDocuments, setrefDocuments] = useState([]);
  const [refLinks, setRefLinks] = useState("");
  const [refDetails, setRefDetails] = useState("");
  const [inputvalue, setInputvalue] = useState("");
  const [sizeheight, setSizeheight] = useState("");
  const [sizewidth, setSizewidth] = useState("");
  const [colour, setColour] = useState("");
  const [direction, setDirection] = useState("");
  const [position, setPosition] = useState("");
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = async () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Error Popup model
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [showCompleteMsg, setShowCompleteMsg] = useState();

  const handleClickOpenComplete = async () => {
    setIsCompleteOpen(true);
  };
  const handleCloseComplete = () => {
    setIsCompleteOpen(false);
  };

  const [isErrorOpenFiles, setIsErrorOpenFiles] = useState(false);
  const handleClickOpenerrFiles = async (idval, state) => {
    setIndexid(idval);
    setIndexstate(state);
    setIsErrorOpenFiles(true);
  };
  const handleCloseerrFiles = () => {
    setIsErrorOpenFiles(false);
  };

  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleFullscreenClick = () => {
    setShowFullscreen(true);
  };

  const handleFullscreenClose = () => {
    setShowFullscreen(false);
  };

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const [indexData, setIndex] = useState("");

  const [isErrorOpenRef, setIsErrorOpenRef] = useState(false);

  const handleCloseRef = () => {
    setIsErrorOpenRef(false);
    setRefCode("");
    setRefImage([]);
    setRefDetails("");
    setRefLinks("");
    setrefDocuments([]);
    setValue("1");
  };

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);

  const backPage = useNavigate();

  const id = useParams().id;

  const rowData = async () => {
    try {
      let res_project = await axios.post(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE_NEW}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        user: isUserRoleAccess.companyname,
      });
      setchecktask(true);
      setUItasks(res_project?.data?.staskAssignBoardList);
      setTodosedit(res_project?.data?.staskAssignBoardList?.uidesign);
      setUItasksuser(res_project?.data?.staskAssignBoardListnew);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchOverallTask = async () => {
    try {
      let res_sub = await axios.get(SERVICE.TASKASSIGN_BOARD_LIST_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setOverallTasks(res_sub?.data?.taskAssignBoardList);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  useEffect(() => {
    fetchOverallTask();
  }, [id]);

  useEffect(() => {
    rowData();
  }, [todosedit]);

  // uiTasks.develop(item => item.taskdev == )
  // uiTasksuser.filter((item) => item.isreturn == "returned"),
  // "uiTasksuser"
  

  const handleInputChange = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...selectedFiles];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
            index: indexData,
          });
          setSelectedFiles(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Only Accept Images!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  //FILEUPLAD
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  const getRowDataId = (idval) => {
    let indexdata = uiTasksuser.filter((item) => item._id == idval);
    setRefCode(indexdata[0]?.refCode);
    setRefImage(indexdata[0]?.refImage);
    setrefDocuments(indexdata[0]?.refDocuments);
    setRefLinks(indexdata[0]?.refLinks);
    setRefDetails(indexdata[0]?.refDetails);
    setInputvalue(indexdata[0]?.inputvalue);
    setSizeheight(indexdata[0]?.sizeheight);
    setSizewidth(indexdata[0]?.sizewidth);
    setColour(indexdata[0]?.colour);
    setDirection(indexdata[0]?.direction);
    setPosition(indexdata[0]?.position);

    setIsErrorOpenRef(true);
  };

  //tab context create
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //first deletefile
  const handleDeleteFileDocument = (index) => {
    const newSelectedFiles = [...refDocuments];
    newSelectedFiles.splice(index, 1);
    setrefDocuments(newSelectedFiles);
  };

  const handleUpdateTodoEdit = async (taskid) => {
    const findidArray = overallTasks.filter((row) => row.taskid === taskid).map((row) => row._id);

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = dd + "/" + mm + "/" + yyyy;

    let findarrIndex = todosedit.findIndex((item) => item._id == indexid);

    let oldendtime = todosedit[findarrIndex].endtime;
    const newTodosedit = [...todosedit];
    // Update the files field
    newTodosedit[findarrIndex].endtime = indexstate === "running" ? [...oldendtime, formattedDate + " " + now.toLocaleTimeString()] : [...oldendtime];
    newTodosedit[findarrIndex].files = selectedFiles;
    newTodosedit[findarrIndex].state = "stopped";
    newTodosedit[findarrIndex].checkpointsstatus = "completed";

    setRunningIndex(null);

    try {
      const requests = findidArray.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          uidesign: [...newTodosedit],
        });
      });
      setTodosedit(newTodosedit);

      let check = newTodosedit.filter((item) => item.taskdev === isUserRoleAccess.companyname).every((data) => data.checkpointsstatus === "completed");

      if (check === true) {
        setShowCompleteMsg("Task Successfully Completed 😎");
        handleClickOpenComplete();
      }

      // NotificationManager.success("Task Successfully Completed ✔😎", "", 2000);
      handleCloseerrFiles();
      setSelectedFiles([]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const sendCompleRequest = async (taskid) => {
    if (uiTasksuser.every((item) => item.files.length > 0)) {
     
    }
  };

  const now = new Date();

  // const initialRunningIndex = localStorage.getItem("runningIndex") || null;

  // const [runningIndex, setRunningIndex] = useState(initialRunningIndex);
  const [runningIndex, setRunningIndex] = useState(null);

  const handleUpdateTodoEditrunning = async (idval, priority) => {
    try {
      let resdev = await axios.post(SERVICE.TASKASSIGNCHECKTIMER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        user: String(isUserRoleAccess.companyname),
      });
      if (resdev.data.taskallcheck.length === 0) {
        if (priority.toLowerCase() == "high" || priority.toLowerCase() == "veryhigh" || priority.toLowerCase() == "very high") {
          let today = new Date();

          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0");
          var yyyy = today.getFullYear();
          let formattedDate = dd + "/" + mm + "/" + yyyy;

          let findarrIndex = todosedit.findIndex((item) => item._id == idval);

          let oldstarttime = todosedit[findarrIndex].starttime;

          const newTodosedit = [...todosedit];
          newTodosedit[findarrIndex].starttime = [...oldstarttime, formattedDate + " " + now.toLocaleTimeString()];
          newTodosedit[findarrIndex].state = "running";

          await sendEditRequest(newTodosedit);
          setRunningIndex(id);
        } else if (resdev.data.prioritycheckUI.length === 0 && resdev.data.prioritycheckDEV.length === 0 && resdev.data.prioritycheckTest.length === 0) {
          let today = new Date();

          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0");
          var yyyy = today.getFullYear();
          let formattedDate = dd + "/" + mm + "/" + yyyy;

          let findarrIndex = todosedit.findIndex((item) => item._id == idval);

          let oldstarttime = todosedit[findarrIndex].starttime;

          const newTodosedit = [...todosedit];
          newTodosedit[findarrIndex].starttime = [...oldstarttime, formattedDate + " " + now.toLocaleTimeString()];
          newTodosedit[findarrIndex].state = "running";

          await sendEditRequest(newTodosedit);
          setRunningIndex(id);
        } else {
          setShowAlert(
            <Box sx={{ disply: "flex", justifyContent: "center" }}>
              <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
              <Typography style={{ fontSize: "17px" }}>{`There is some pending task in`}</Typography>
              <Typography style={{ fontSize: "13px", fontWeight: 800, wordBreak: "break-all" }}>HIGH</Typography>
            </Box>
          );
          handleClickOpenerr();
        }
      } else {
        setShowAlert(
          <Box sx={{ disply: "flex", justifyContent: "center" }}>
            <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
            <Typography style={{ fontSize: "17px" }}>{`Timer Already Running in`}</Typography>
            <Typography style={{ fontSize: "13px", fontWeight: 800, wordBreak: "break-all" }}>{`${resdev.data.taskallcheck[0]?.taskname}`}</Typography>
          </Box>
        );
        handleClickOpenerr();
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleUpdateTodoEditpaused = async (idval) => {
    try {
      let today = new Date();

      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      let formattedDate = dd + "/" + mm + "/" + yyyy;

      let findarrIndex = todosedit.findIndex((item) => item._id == idval);

      let oldendtime = todosedit[findarrIndex].endtime;
      const newTodosedit = [...todosedit];
      newTodosedit[findarrIndex].endtime = [...oldendtime, formattedDate + " " + now.toLocaleTimeString()];
      newTodosedit[findarrIndex].state = "paused";

      await sendEditpausRequest(newTodosedit);
      setRunningIndex(null);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    // localStorage.setItem("runningIndex", null);
  };

  const sendEditRequest = async (todosvalue) => {
    try {
      let res = await axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        uidesign: todosvalue,
      });
      setTodosedit(todosvalue);
      // handleCloseerrFiles();
      // setSelectedFiles([])
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const sendEditpausRequest = async (todoval) => {
    try {
      let res = await axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        uidesign: todoval,
      });
      setTodosedit(todoval);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so we add 1.
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      // Convert hours to 12-hour format
      hours = hours % 12 || 12;

      let formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;

      setTimestamp(formattedDateTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const calculateTotalTimes = (idval) => {
    const matchedItem = uiTasksuser.find((item) => item._id == idval);
    const startTimes = matchedItem?.starttime;
    const endTimes = matchedItem?.endtime;

    let totalMilliseconds = 0;

    for (let i = 0; i < startTimes.length; i++) {
      // Rearrange the date format to "MM/DD/YYYY hh:mm:ss A"
      const startTime = new Date(startTimes[i].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
      const endTime = new Date(endTimes[i].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));

      const timeDifference = endTime - startTime;
      totalMilliseconds += timeDifference;
    }

    // Calculate the total time difference in seconds, minutes, hours, and days
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;

    // Convert total days to hours and add it to "24:00:04"
    const totalHoursWithDays = totalDays * 24 + hours;
    return `${String(totalHoursWithDays).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  return (
    <Box sx={userStyle.container}>
      <NotificationContainer />
      {!checktask ? (
        <Box style={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
          <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          {/* <FacebookCircularProgress /> */}
        </Box>
      ) : (
        <>
          <Box>
            <Grid container spacing={2}>
              <Grid item md={5} xs={5} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                <Typography>Task Name : </Typography>
                <h4>{uiTasks.taskname}</h4>
              </Grid>
              <Grid item md={5} xs={6} sm={5} style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <img alt="" src={usersid?.profileimage ? usersid?.profileimage : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"} alt="User profile picture" style={{ height: 50, width: 50, borderRadius: "50%", maxHeight: { xs: 233, md: 167 }, maxWidth: { xs: 350, md: 250 }, alignItems: "flex-end", justifyContent: "center" }} />
                <Typography style={{ marginTop: "10px", fontFamily: "auto", fontWeight: "900" }}>{uiTasks?.assignedby}</Typography>
              </Grid>

              <Grid item md={2} xs={12} sm={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Button
                  variant="contained"
                  size="small"
                  // color="success"
                  style={{ padding: "5px 12px", backgroundColor: "#00905d", height: "fit-content", color: "white" }}
                  onClick={() => {
                    sendCompleRequest(uiTasks.taskid);
                  }}
                >
                  Complete
                </Button>
              </Grid>
            </Grid>
          </Box>
          <br />
          <br />
          <Box>
            <Typography>PBI :</Typography>
            <Grid container spacing={2}>
              <Grid item md={4} sm={12} xs={12} lg={4}>
                {uiTasks.uploadpbi?.map((item, index) => {
                  return (
                    <>
                      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <Box>
                          <img src={item.preview} alt="pbi" height={50} />
                        </Box>
                        <Box>
                          <Button
                            sx={{
                              padding: "14px 14px",
                              minWidth: "40px !important",
                              borderRadius: "50% !important",
                              ":hover": {
                                backgroundColor: "#80808036", // theme.palette.primary.main
                              },
                            }}
                            onClick={() => renderFilePreview(item)}
                          >
                            <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8", marginTop: "35px !important" }} />
                          </Button>
                        </Box>
                      </Box>
                      <br />
                    </>
                  );
                })}
              </Grid>
            </Grid>
          </Box>

          <br />
          <Typography>Check Points :</Typography>
          <Box sx={{ padding: "12px" }}>
            <br />
            <br />
            {uiTasksuser?.length > 0 &&
              uiTasksuser?.map((data, index) => {
                const lastStartTime = data.starttime[data.starttime?.length - 1];

                // Parse the first time string into a Date object
                const time1 = new Date(lastStartTime?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
                const timestamprun = new Date(timestamp?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));

                const timeDifferencecurrent = timestamprun - time1;
                const totalSecondsrun = Math.floor(timeDifferencecurrent / 1000);
                const totalMinutesrun = Math.floor(totalSecondsrun / 60);
                const totalHoursrun = Math.floor(totalMinutesrun / 60);
                const totalDaysrun = Math.floor(totalHoursrun / 24);

                const secondsrun = totalSecondsrun % 60;
                const minutesrun = totalMinutesrun % 60;
                const hoursrun = totalHoursrun % 24;

                // Convert total days to hours and add it to "24:00:04"
                const totalHoursWithDaysrun = totalDaysrun * 24 + hoursrun;
                let durationTimerun = `${String(totalHoursWithDaysrun).padStart(2, "0")}:${String(minutesrun).padStart(2, "0")}:${String(secondsrun).padStart(2, "0")}`;

                const data1 = data.subEstTime + "_" + data.subEstType; // Assuming `data.time` is in the format of minutes
                const data2 = data.state === "running" ? "00:00:00" : data.state === "" ? "00:00:00" : calculateTotalTimes(data._id);

                const convertToTimeFormat = (duration) => {
                  if (duration.includes("Hours")) {
                    const hours = parseInt(duration.split("_")[0], 10);
                    return `0:${hours * 60}:0`;
                  } else if (duration.includes("Minutes")) {
                    const minutes = parseInt(duration.split("_")[0], 10);
                    return `0:${minutes}:0`;
                  }
                };

                const formatToSeconds = (timeFormat) => {
                  const [hours, minutes, seconds] = timeFormat.split(":").map((str) => parseInt(str, 10));
                  return hours * 3600 + minutes * 60 + seconds;
                };

                const formattedData1 = convertToTimeFormat(data1);
                const duration1 = formatToSeconds(formattedData1);
                const duration2 = formatToSeconds(data2);

                let greaterDuration;

                if (duration1 > duration2) {
                  greaterDuration = "On Time";
                } else if (duration2 > duration1) {
                  greaterDuration = "Delay";
                } else {
                  greaterDuration = "";
                }
                const lowercaseStringPriority = data.priority.toLowerCase();

                return (
                  <div key={index}>
                    <Grid container sx={{ padding: "0px 10px", display: "flex", alignItems: "center" }}>
                      <Grid md={1.5} sm={12} xs={12} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                        <FormControl>
                          <FormControlLabel
                            sx={{ color: data.isreturn === "returned" ? "red" : "inherit" }}
                            control={
                              <Checkbox
                                sx={{ fontSize: "13px" }}
                                checked={data?.files?.length > 0 ? true : false}
                                onClick={(e) => {
                                  handleClickOpenerrFiles(data._id, data.state);
                                }}
                                name=""
                                disabled={data?.files?.length > 0 || data.state !== "running" ? true : false}
                              />
                            }
                            label={" " + data.name}
                          />
                        </FormControl>
                      </Grid>
                      <Grid md={2.5} sm={12} xs={12} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                        <Typography variant="subtitle2">{data.inputvalue}</Typography>
                      </Grid>
                      <Grid md={1} sm={12} xs={12}>
                        <Typography variant="subtitle2">{data.isreturn === "returned" ? " " : data.subEstTime + " " + data.subEstType}</Typography>
                      </Grid>
                      <Grid md={1} sm={12} xs={12}>
                        <Typography
                          sx={{
                            backgroundColor: lowercaseStringPriority.includes("low") ? "#69bf77" : lowercaseStringPriority.includes("medium") ? "#a9a9cb" : "#ff0000b5",
                            textTransform: "capitalize",
                            padding: "1px 6px",
                            maxWidth: "fit-content",
                            borderRadius: "13%",
                            color: "white",
                            lineHeight: "1.3",
                            fontSize: "11px", // Note the correct spelling of fontSize

                            // Media query for small screens
                            "@media (max-width: 600px)": {
                              fontSize: "small",
                              padding: "1px 4px",
                            },
                          }}
                        >
                          {data.priority}
                        </Typography>
                      </Grid>
                      <Grid md={0.5} sm={12} xs={12}>
                        {data.isreturn === "returned" ? null : (
                          <FolderIcon
                            style={{ color: "#f5d36e", cursor: "pointer" }}
                            onClick={(e) => {
                              getRowDataId(data._id);
                            }}
                          />
                        )}
                      </Grid>
                      <Grid md={2.5} sm={12} xs={12}>
                        <Typography>
                          {data?.files?.map((file) => (
                            <>
                              <Box sx={{ display: "flex", justifyContent: "left" }}>
                                <Typography sx={{ fontSize: "11px" }}>{file.name} </Typography>
                              </Box>
                            </>
                          ))}
                        </Typography>
                      </Grid>
                      <Grid md={1} sm={12} xs={12}>
                        <Typography style={{ background: data.state === "running" ? "#8080809e" : greaterDuration === "On Time" ? "#66c366ed" : greaterDuration === "Delay" ? "#f82c2ceb" : "", width: "max-content", borderRadius: "5px", fontSize: "12px", color: "white", padding: "0px 5px" }}>{data.state === "running" ? "On going" : data.state === "paused" || data.state === "stopped" ? greaterDuration : ""}</Typography>
                      </Grid>
                      <Grid md={1} sm={12} xs={12}>
                        <Typography variant="subtitle2">{data.state === "running" ? durationTimerun : data.state === "" ? "00:00:00" : calculateTotalTimes(data._id)}</Typography>
                      </Grid>
                      {data.isreturn !== "returned" && (
                        <Grid md={1} sm={12} xs={12} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                          {data.state === "running" ? (
                            <Button
                              style={{ textTransform: "capitalize", minWidth: "30px", padding: "0px 10px", background: "#f5f5f5", border: "1px solid", color: "#0000008f" }}
                              onClick={() => {
                                handleUpdateTodoEditpaused(data._id);
                              }}
                            >
                              Pause
                            </Button>
                          ) : (
                            <Button
                              style={{ textTransform: "capitalize", minWidth: "30px", padding: "0px 10px", background: "#f5f5f5", border: (runningIndex !== null && runningIndex !== data._id) || data.state === "stopped" ? "none" : "1px solid", color: "#0000008f" }}
                              disabled={(runningIndex !== null && runningIndex !== data._id) || data.state === "stopped"}
                              onClick={() => {
                                handleUpdateTodoEditrunning(data._id, data.priority);
                              }}
                            >
                              Start
                            </Button>
                          )}
                        </Grid>
                      )}
                    </Grid>
                    <Divider />
                    <br />
                  </div>
                );
              })}
            <div></div>
          </Box>
        </>
      )}
      {/* ALERT POPUP DIALOG */}
      <Box>
        <Dialog open={isErrorOpenFiles} onClose={handleCloseerrFiles} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
          <DialogContent style={{ textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <div>
              <input className={classes.inputs} type="file" id="file-inputuploadfiletask" multiple onChange={handleInputChange} />
              <label htmlFor="file-inputuploadfiletask" style={{ textAlign: "center", padding: "7px 14px" }}>
                <Button style={userStyle.btncancel} component="span">
                  <AddCircleOutlineIcon /> &ensp; Add Images
                </Button>
              </label>

              <Grid container>
                {selectedFiles?.map((file, index) =>
                  file.index === indexData ? (
                    <>
                      <Grid item md={3} sm={11} xs={11}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <img src={file.preview} height={100} width={120} />
                        </Box>
                      </Grid>
                      <Grid item md={1} sm={1} xs={1}>
                        <Button
                          sx={{
                            padding: "10px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => handleDeleteFile(index)}
                        >
                          <FaTrash style={{ fontSize: "medium", color: "#a73131" }} />
                        </Button>

                        <Button
                          sx={{
                            padding: "10px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => {
                            handleClickOpenview();
                            setViewImage(file.preview);
                          }}
                        >
                          <VisibilityOutlinedIcon style={{ fontsize: "medium" }} />
                        </Button>
                      </Grid>
                    </>
                  ) : (
                    ""
                  )
                )}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              disabled={selectedFiles.length <= 0}
              color="primary"
              onClick={() => {
                handleUpdateTodoEdit(uiTasks.taskid);
                // sendEditRequest();
              }}
            >
              Update
            </Button>
            <Button variant="contained" style={userStyle.btncancel} onClick={handleCloseerrFiles}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent style={{ width: "400px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ background: "#da2f2f", color: "white", padding: "7px 14px", borderRadius: "4px" }} onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenRef} onClose={handleCloseRef} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
          <DialogContent>
            <Grid item md={10} xs={12} sm={12}>
              <Typography sx={{ fontSize: "20px", fontWeight: "bolder", whiteSpace: "pre-line", wordBreak: "break-all" }}> References </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                  <FormControl size="small" fullWidth>
                    <Typography>Input value</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>{inputvalue}</Typography>
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                  <FormControl size="small" fullWidth>
                    <Typography>Size-Height</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>{sizeheight}</Typography>
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                  <FormControl size="small" fullWidth>
                    <Typography>Size-Width</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>{sizewidth}</Typography>
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                  <FormControl size="small" fullWidth>
                    <Typography>Color</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>{colour}</Typography>
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                  <FormControl fullWidth size="small">
                    <Typography>Direction</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>{direction}</Typography>
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={6} sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                  <FormControl fullWidth size="small">
                    <Typography>Position</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>{position}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Box sx={{ width: "100%", height: "max-content", minHeight: "250px", typography: "body1", boxShadow: "0px 0px 2px #808080a3", border: "1px solid #80808057" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBotton: 1, border: "divider", background: "#80808036", height: "47px" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        backgroundColor: "#c5c1c11c",
                        borderRadius: "4px",
                        boxShadow: "0px 0px 5px #33303070",
                        minHeight: "47px",
                        ".css-can5u7-MuiButtonBase-root-MuiTab-root.Mui-selected": {
                          color: "white",
                          border: "1px solid #b5afaf",
                          background: " #3346569c",
                        },
                        ".css-1aquho2-MuiTabs-indicator": {
                          background: " none",
                        },
                      }}
                    >
                      <Tab label="  Code" value="1" icon={<CodeIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label="  Images" value="2" icon={<PermMediaOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label="  Documents" value="3" icon={<DescriptionOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label="  Links" value="4" icon={<InsertLinkOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                      <Tab label="  Details" value="5" icon={<InsertChartOutlinedOutlinedIcon />} iconPosition="start" sx={{ minHeight: "47px" }} />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <FormControl fullWidth>
                      <TextareaAutosize aria-label="minimum height" minRows={8} value={refCode} />
                    </FormControl>
                  </TabPanel>
                  <TabPanel value="2">
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {refImage.map((file, index) => (
                          <>
                            <Grid container>
                              <Grid item md={3} sm={3} xs={3}>
                                <Box
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {file.type.includes("image/") ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      height={50}
                                      style={{
                                        maxWidth: "-webkit-fill-available",
                                      }}
                                    />
                                  ) : (
                                    <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                                  )}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">{file.name} </Typography>
                              </Grid>
                              <Grid item md={1} sm={1} xs={1}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                >
                                  <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8", marginTop: "35px !important" }} />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="3">
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {refDocuments?.map((file, index) => (
                          <>
                            <Grid container>
                              <Grid item md={2} sm={2} xs={2}>
                                <Box
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {file.type.includes("image/") ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      height={50}
                                      style={{
                                        maxWidth: "-webkit-fill-available",
                                      }}
                                    />
                                  ) : (
                                    <img className={classes.preview} src={getFileIcon(file.name)} height="25" alt="file icon" />
                                  )}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">{file.name} </Typography>
                              </Grid>
                              <Grid item md={2} sm={2} xs={2}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                  onClick={() => handleDeleteFileDocument(index)}
                                >
                                  <FaTrash style={{ color: "#a73131", fontSize: "12px" }} />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="4">
                    <ReactQuill
                      style={{ height: "100px" }}
                      value={refLinks}
                      modules={{
                        toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
                      }}
                      formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                    />
                  </TabPanel>
                  <TabPanel value="5">
                    <FormControl fullWidth>
                      <TextareaAutosize aria-label="minimum height" minRows={8} value={refDetails} />
                    </FormControl>
                  </TabPanel>
                </TabContext>
              </Box>
              <br />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseRef}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* COMPLETE ALERT DIALOG */}
      <Box>
        <Dialog open={isCompleteOpen} onClose={handleCloseComplete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent style={{ width: "400px", textAlign: "center", alignItems: "center" }}>
            <img src={successtickimg} height="150px" alt="" />
            <Typography variant="h6">{showCompleteMsg}</Typography>
          </DialogContent>
          <DialogActions>
            <Link to="/project/tasklist">
              <Button variant="contained" style={{ padding: "7px 14px", borderRadius: "4px" }} onClick={handleCloseComplete}>
                ok
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview}>
        <DialogContent style={{ maxWidth: "100%", alignItems: "center" }}>
          <img src={viewImage} alt={viewImage} style={{ maxWidth: "100%", marginTop: "10px" }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              cursor: "pointer",
              padding: "5px",
              backgroundColor: "rgba(255,255,255,0.8)",
            }}
            onClick={handleFullscreenClick}
          >
            <FaExpand size={20} />
          </div>
          {showFullscreen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
              }}
              onClick={handleFullscreenClose}
            >
              <img src={viewImage} alt="Preview" style={{ maxWidth: "100%" }} />
            </div>
          )}
          <Button variant="contained" style={{ padding: "7px 19px", backgroundColor: "#00905d", height: "fit-content", color: "white" }} onClick={handleCloseview}>
            {" "}
            Back{" "}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default TaskTabs;
