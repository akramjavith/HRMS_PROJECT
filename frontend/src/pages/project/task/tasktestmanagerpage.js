import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Dialog, FormControlLabel, Checkbox, DialogContent, DialogActions, FormControl, Paper, TableContainer, Grid, TableCell, TableRow, TableBody, Table, TableHead, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { handleApiError } from "../../../components/Errorhandling";
import { Delete } from "@material-ui/icons";
import { FaExpand, FaTrash } from "react-icons/fa";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { makeStyles } from "@material-ui/core";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tab from "@material-ui/core/Tab";
import SearchIcon from "@mui/icons-material/Search";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";

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
  const [showFullscreen, setShowFullscreen] = useState(false);
  const classes = useStyles();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [developerTask, setDeveloperTask] = useState([]);
  const [pbiUploadDev, setPbiUploadDev] = useState([]);
  const [resourcesDev, setResourcesDev] = useState([]);
  const [checktask, setchecktask] = useState(false);
  const [todosedit, setTodosedit] = useState([]);
  const [editingIndexedit, setEditingIndexedit] = useState(-1);
  const [filteredtasks, setFilteredtasks] = useState([]);
  const [filteredassigned, setFilteredassigned] = useState([]);
  const [usersid, setUsersid] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);
  const [value, setValue] = useState("1");
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isErrorOpenFiles, setIsErrorOpenFiles] = useState(false);
  const [showAlert, setShowAlert] = useState();
  // view model
  const [openview, setOpenview] = useState(false);
  const [indexData, setIndex] = useState("");
  const [timerDetails, setTimerDetails] = useState({
    userid: "",
    startTime: "",
    endTime: "",
  });

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [runningTime, setRunningTime] = useState(0);
  const [getStartTime, setGetStartTime] = useState(0);

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
  // Error Popup model
  const handleClickOpenerr = async () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  let userId = localStorage.LoginUserId;
  const backPage = useNavigate();

  const id = useParams().id;

  const rowData = async () => {
    try {
      let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await profilePic(res_project?.data?.stask?.assignedbyprofileimg);
      setchecktask(true);
      setDeveloperTask(res_project?.data?.stask);
      setPbiUploadDev(res_project?.data?.stask?.pbiupload);
      setResourcesDev(res_project?.data?.stask?.resources);
      setFilteredtasks(res_project?.data?.stask?.usecasetester);
      setFilteredassigned(res_project?.data?.stask?.assignedtodeveloper);
      setTodosedit(res_project?.data?.stask?.checkpointsdev);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const filteredtasksnew = filteredtasks
    .map((task, index) => ({
      ...task,
      index: index.toString(),
    }))
    .filter((task, index) => task.checkuser === isUserRoleAccess?.username)
    .map((task, i) => ({
      ...task,
      id: id,
      indexval: task.index.toString(),
    }));

  const username = usersid.username;

  useEffect(() => {
    rowData();
  }, []);

  const handleClickOpenerrFiles = async (index) => {
    setIndex(index);
    setIsErrorOpenFiles(true);
  };
  const handleCloseerrFiles = () => {
    setIsErrorOpenFiles(false);
  };

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const handleFullscreenClick = () => {
    setShowFullscreen(true);
  };

  const handleFullscreenClose = () => {
    setShowFullscreen(false);
  };

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
          setEditedTodoFiles(newSelectedFiles);
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
  const [editedTodoFiles, setEditedTodoFiles] = useState("");
  const handleEditTodoEdit = (index) => {
    setEditingIndexedit(index);
    setEditedTodoFiles(todosedit[index]?.files); // Set the initial files state
  };

  const handleUpdateTodoEdit = () => {
    const newTodosedit = [...todosedit];
    // Update the files field
    newTodosedit[editingIndexedit].files = selectedFiles;

    setTodosedit(newTodosedit);
    setEditingIndexedit(-1);
    setSelectedFiles([]);
  };

  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.TASK_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkpointsdev: filteredtasks,
      });
      handleCloseerrFiles();
      setSelectedFiles([]);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const updatedTodos = filteredassigned.map((todo) => {
    if (todo.label == isUserRoleAccess?.username) {
      return { ...todo, status: "complete" };
    }
    return todo;
  });

  const sendCompleRequest = () => {
    sendRequest();

    sendcompleteEditRequest();
    setStartTime(null);
    setElapsedTime(0);

    localStorage.removeItem("timerStartTime");
  };

  const sendcompleteEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.TASK_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignedtodeveloper: updatedTodos,
      });
      backPage("/project/tasklist");
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //LoginUser image Access

  const profilePic = async (userprofile) => {
    try {
      let res = await axios.post(SERVICE.USERTASKPROFILE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userprofile: String(userprofile),
      });
      setUsersid(res?.data?.users);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [taskname, setTaskname] = useState("");
  // Start the timer
  const startTimer = (e) => {
    setTaskname(e);
    const now = Date.now();
    setStartTime(now);
    setGetStartTime(now);
    localStorage.setItem("timerStartTime", now);
    localStorage.setItem("taskName", developerTask.taskname);
  };

  const d = new Date();
  d.setHours(9, 0, 0);

  let s = d.setTime(d.getTime() + 9 * 60 * 60 * 1000);

  // Stop the timer and reset the elapsed time
  const stopTimer = () => {
    sendRequest();
    setStartTime(null);
    setElapsedTime(0);

    localStorage.removeItem("timerStartTime");
  };

  useEffect(() => {
    // Check if there is a stored start time in localStorage
    const storedStartTime = localStorage.getItem("timerStartTime");
    if (storedStartTime) {
      setStartTime(parseInt(storedStartTime));
    }

    // Calculate the elapsed time on each tick
    const timerInterval = setInterval(() => {
      if (startTime) {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        setRunningTime(elapsed);
        setElapsedTime(elapsed);
      }
    }, 1000);
    // Clear the interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, [startTime]);

  // Format the elapsed time as hours, minutes, and seconds
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  let answer = 0;

  //submitting the form
  const sendRequest = async () => {
    try {
      let req = await axios.post(SERVICE.TIMER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userid: localStorage.LoginUserId,
        startTime: getStartTime,
        endTime: runningTime,
        taskname: developerTask.taskname,
      });
      setTimerDetails(req.data);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.preview);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);
      window.open(link, "_blank");
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
      {!checktask ? (
        <Box style={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
          <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          {/* <FacebookCircularProgress /> */}
        </Box>
      ) : (
        <>
          <Box>
            <Typography variant="h5">Task Details</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} lg={6} sm={6} xs={12}></Grid>
              <Grid item md={6} lg={6} sm={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={4} sm={6} xs={12}>
                    <Typography variant="h6"> Estimate Time</Typography>
                    <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}>
                      {" "}
                      {developerTask.calculatedtime} {"Hours"}
                    </Typography>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Typography variant="h6"> Actual Time</Typography>
                    <Typography variant="h5" sx={{ fontWeight: "600", fontFamily: "auto", color: "red" }}>
                      {" "}
                      00:00:00
                    </Typography>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Typography variant="h6">Status</Typography>

                    <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}></Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} lg={3} sm={6} xs={12}>
                <Typography variant="h6">Project</Typography>
                <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}>
                  {developerTask.projectname}
                </Typography>
              </Grid>
              <Grid item md={3} lg={3} sm={6} xs={12}>
                <Typography variant="h6">Sub Project</Typography>
                <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}>
                  {developerTask.subprojectname}
                </Typography>
              </Grid>
              <Grid item md={3} lg={3} sm={6} xs={12}>
                <Typography variant="h6">Module</Typography>
                <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}>
                  {developerTask.module}
                </Typography>
              </Grid>
              <Grid item md={3} lg={3} sm={6} xs={12}>
                <Typography variant="h6"> Sub Module</Typography>
                <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}>
                  {developerTask.submodule}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography variant="h6">Task ID </Typography>
                <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}>
                  {developerTask.taskid}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography variant="h6">Task Name : </Typography>
                <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}>
                  {developerTask.taskname}
                  {"(Testing"}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography variant="h6">Assigned Date</Typography>
                <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto" }}>
                  {developerTask.assigneddate}
                </Typography>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Typography variant="h6">Assigned By</Typography>
                <Box style={{ display: "flex", gap: "10px" }}>
                  {usersid?.profileimage ? (
                    <>
                      <img src={usersid?.profileimage} alt="User profile picture" style={{ height: 50, width: 50, borderRadius: "50%", maxHeight: { xs: 233, md: 167 }, maxWidth: { xs: 350, md: 250 }, alignItems: "flex-end", justifyContent: "center" }} />
                    </>
                  ) : (
                    <>
                      <img src="https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg" alt="" style={{ borderRadius: "50%" }} height={50} />
                    </>
                  )}
                  <Typography variant="h6" sx={{ fontWeight: "600", fontFamily: "auto", marginTop: "10px" }}>
                    {developerTask.assignedby}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <br />
          <br />
          <br />
          <br />
          <Typography variant="h6">Task Details :</Typography>
          <br />
          <br />

          <Box container spacing={2}>
            <div>
              <TabContext value={value}>
                <Box
                  style={{
                    borderBottom: 1,
                    borderColor: "divider",
                    borderRadius: "4px",
                    boxShadow: "0px 0px 4px #b7b1b1",
                    border: "1px solid #c3c3c3",
                    overflow: "hidden",
                    marginBottom: "0px",
                    boxSizing: "border-box",
                  }}
                >
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      ".MuiTab-textColorPrimary.Mui-selected": {
                        color: "white",
                        border: "1px solid #b5afaf",
                        borderBottom: "none",
                        background: " #3346569c",
                      },
                      ".css-1aquho2-MuiTabs-indicator": {
                        background: "none",
                      },
                    }}
                  >
                    <Tab
                      label="PBI"
                      value="1"
                      sx={userStyle.tablelistStyle}
                      // }}
                    />

                    <Tab label="Description" value="2" sx={userStyle.tablelistStyle} />

                    <Tab label="Resources" value="3" sx={userStyle.tablelistStyle} />
                  </TabList>
                </Box>
                <TabPanel value="1" index={0} sx={userStyle.tabpanelstyle}>
                  {pbiUploadDev.map((data) => {
                    return (
                      <>
                        {data.type.includes("image/") ? (
                          <>
                            <img src={data.preview} alt={data.name} style={{ maxHeight: "100px", marginTop: "10px" }} />
                            <Button
                              style={userStyle.buttonedit}
                              onClick={() => {
                                handleClickOpenview();
                                setViewImage(data.preview);
                              }}
                            >
                              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Box>
                              <Button variant="contained" onClick={() => renderFilePreview(data)} style={{ textTranform: "capitalize" }}>
                                <SearchIcon />
                                Preview
                              </Button>
                            </Box>
                            <img className={classes.preview} src={getFileIcon(data.name)} height="100" alt="file icon" />
                          </>
                        )}
                      </>
                    );
                  })}
                </TabPanel>
                <TabPanel value="2" index={1} sx={userStyle.tabpanelstyle}>
                  <div dangerouslySetInnerHTML={{ __html: developerTask.description }}></div>
                </TabPanel>
                <TabPanel value="3" index={2} sx={userStyle.tabpanelstyle}>
                  {resourcesDev.map((data, index) => {
                    return (
                      <>
                        <Box key={index}>
                          <Button variant="contained" onClick={() => renderFilePreview(data)} style={{ textTranform: "capitalize" }}>
                            <SearchIcon />
                            Preview
                          </Button>
                        </Box>
                        {data.type.includes("image/") ? <img src={data.preview} alt={data.name} height="100" style={{ maxWidth: "-webkit-fill-available" }} /> : <img className={classes.preview} src={getFileIcon(data.name)} height="100" alt="file icon" />}
                        <Typography
                          onClick={() => {
                            handleDownload(data);
                          }}
                          style={{ onClick: "pointer" }}
                        >
                          {data.name}
                        </Typography>
                      </>
                    );
                  })}
                </TabPanel>
              </TabContext>
            </div>
          </Box>

          <br />
          <br />
          <br />
          <Box>
            <Typography variant="h6">Check Points :</Typography>
            <br />

            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 900 }} aria-label="customized table" id="usertable">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell sx={{ maxWidth: "30px" }}></StyledTableCell>
                      <StyledTableCell>Checkpoints</StyledTableCell>
                      <StyledTableCell sx={{ minWidth: "fit-content" }}>Estimate Time</StyledTableCell>
                      <StyledTableCell>Actual Time</StyledTableCell>
                      <StyledTableCell>Image</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell sx={{ minWidth: "100px" }}>Done By</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {filteredtasks.length > 0 ? (
                      filteredtasks?.map((data, index) => (
                        <StyledTableRow>
                          <StyledTableCell align="left">
                            {" "}
                            <FormControl>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={data?.files?.length > 0 ? true : false}
                                    onClick={(e) => {
                                      // handleEditTodoEdit(data.indexval);
                                      // handleClickOpenerrFiles(index);
                                    }}
                                    name=""
                                    disabled={data?.files?.length > 0 ? true : false}
                                  />
                                }
                              />
                            </FormControl>
                          </StyledTableCell>
                          <StyledTableCell align="left" sx={{ whiteSpace: "pre-line", wordBreak: "break-all" }}>
                            {" "}
                            <Typography>{data.label}</Typography>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {data.time}
                            {" Hours"}
                          </StyledTableCell>
                          <StyledTableCell align="left">Actual Time</StyledTableCell>
                          <StyledTableCell align="left">
                            <Typography>
                              {data?.files?.map((file) => (
                                <>
                                  <Box sx={{ display: "flex" }}>
                                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                                      <Typography variant="subtitle2">{file.name} </Typography>
                                    </Box>
                                    <Button
                                      sx={{ padding: "0px" }}
                                      onClick={() => {
                                        handleClickOpenview();
                                        setViewImage(file?.preview);
                                      }}
                                    >
                                      <VisibilityIcon style={{ fontsize: "large", padding: "0px !IMPORTANT" }} />
                                    </Button>
                                  </Box>
                                </>
                              ))}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell aling="left">
                            <Box
                              sx={{
                                padding: "2px 5px",
                                width: "fit-content",
                                background: "red",
                                borderRadius: "10px",
                                color: "white",
                              }}
                            >
                              Status
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>{developerTask.assignedtotester}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        {" "}
                        <StyledTableCell colSpan={4} align="center">
                          No Data Available
                        </StyledTableCell>{" "}
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
            </>
          </Box>
        </>
      )}
      {/* ALERT POPUP DIALOG */}
      <Box>
        <Dialog open={isErrorOpenFiles} onClose={handleCloseerrFiles} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent style={{ width: "550px", textAlign: "center", alignItems: "center" }}>
            <div>
              <input className={classes.inputs} type="file" id="file-inputuploadfiletask" multiple onChange={handleInputChange} />
              <label htmlFor="file-inputuploadfiletask" style={{ textAlign: "center" }}>
                <Button style={userStyle.btncancel} component="span">
                  <AddCircleOutlineIcon /> &ensp; Add Images
                </Button>
              </label>

              <Grid container>
                {selectedFiles?.map((file, index) =>
                  file.index === indexData ? (
                    <>
                      <Grid item md={3} sm={11} xs={11}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Typography variant="subtitle2">{/* {file.name}{" "} */}</Typography>
                        </Box>
                        <img src={file.preview} height={100} />
                      </Grid>
                      <Grid item md={1} sm={1} xs={1}>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            marginTop: "16px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => handleDeleteFile(index)}
                        >
                          <FaTrash style={{ fontSize: "large", color: "#a73131" }} />
                        </Button>
                        <Button
                          style={userStyle.buttonedit}
                          onClick={() => {
                            handleClickOpenview();
                            setViewImage(file.preview);
                          }}
                        >
                          <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
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
              color="primary"
              onClick={() => {
                handleUpdateTodoEdit();
                sendEditRequest();
              }}
            >
              ok
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
          <DialogContent style={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
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
