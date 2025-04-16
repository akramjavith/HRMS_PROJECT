
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  FormControlLabel,
  Checkbox,
  TableRow,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { Delete } from "@material-ui/icons";
import { FaExpand, FaTrash } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { makeStyles } from "@material-ui/core";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tab from "@material-ui/core/Tab";
import SearchIcon from '@mui/icons-material/Search';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { ThreeDots } from 'react-loader-spinner'


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
      textTransform: 'capitalize !IMPORTANT',
      padding: '7px 19px',
      backgroundColor: "#00905d",
      height: 'fit-content'
    }
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
  const [value, setValue] = useState('1');
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


  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  // Error Popup model
  const handleClickOpenerr = async () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const backPage = useNavigate();

  const id = useParams().id;

  const rowData = async () => {
    try {
      let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },

      });
      await profilePic(res_project?.data?.stask?.assignedbyprofileimg)
      setchecktask(true);
      setDeveloperTask(res_project?.data?.stask);
      setPbiUploadDev(res_project?.data?.stask?.pbiupload);
      setResourcesDev(res_project?.data?.stask?.resources);
      setFilteredtasks(res_project?.data?.stask?.checkpointsdev);
      setFilteredassigned(res_project?.data?.stask?.assignedtodeveloper);
      setTodosedit(res_project?.data?.stask?.checkpointsdev);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    rowData();
  }, []);





  const filteredtasksnew = filteredtasks.map((task, index) => ({
    ...task,
    index: index.toString(),
    endtime: task.endtime,
    processstatus: task.processstatus
  })).filter((task, index) => task.checkuser === isUserRoleAccess?.username)
    .map((task, i) => ({
      ...task,
      id: id,
      indexval: task.index.toString()
    }));



  // Group todos by their title values
  const groupedTodos = filteredtasksnew.reduce((groups, todo) => {

    const groupKey = todo.title;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(todo);
    return groups;
  }, {});

  const returnedGroup = groupedTodos['Returned'] || []; // Get the "Returned" todos

  const groupedReturnedTodos = returnedGroup.reduce((groups, todo) => {
    const returnCount = todo.returncount;
    if (!groups[returnCount]) {
      groups[returnCount] = [];
    }
    groups[returnCount].push(todo);
    return groups;
  }, {});



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
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
            index: indexData
          });
          setSelectedFiles(newSelectedFiles);
          setEditedTodoFiles(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      }
      else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Only Accept Images!"}</p>
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


  const [editedTodoFiles, setEditedTodoFiles] = useState("")
  const [editedendtime, setEditedendtime] = useState("")
  const [editedprocstatus, setEditedprocstatus] = useState("")
  const [totaltimevalue, settotaltimevalue] = useState("")


  const handleEditTodoEdit = async (index, duration, idval) => {

    const data1 = `${duration} minutes`; // Assuming `data.time` is in the format of hours
    const data2 = calculateTotalTime(idval);

    const convertToTimeFormat = (duration) => {
      if (duration.includes('hours')) {
        const hours = parseInt(duration.split(' ')[0], 10);
        return `0:${hours * 60}:0`;
      } else if (duration.includes('minutes')) {
        const minutes = parseInt(duration.split(' ')[0], 10);
        return `0:${minutes}:0`;
      }

      return duration;
    };
    const formatToSeconds = (timeFormat) => {
      const [hours, minutes, seconds] = timeFormat.split(':').map((str) => parseInt(str, 10));
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
      greaterDuration = "on going";
    }

    let totaltime = calculateTotalTime(idval)


    setEditingIndexedit(index);
    setEditedTodoFiles(todosedit[index]?.files);

    await setEditedprocstatus(greaterDuration)
    await settotaltimevalue(totaltime)

  };

  const handleUpdateTodoEdit = async () => {

    let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${id}`, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`
      },

    });
    let oldendtime = (res_project?.data?.stask?.checkpointsdev[editingIndexedit].endtime);

    // stopsTimer();
    const newTodosedit = [...todosedit];
    // Update the files field
    newTodosedit[editingIndexedit].files = selectedFiles;
    newTodosedit[editingIndexedit].state = "stopped";
    newTodosedit[editingIndexedit].endtime = [...(oldendtime), now.toLocaleTimeString()];
    newTodosedit[editingIndexedit].processstatus = editedprocstatus;
    newTodosedit[editingIndexedit].difftime = totaltimevalue;
    setTodosedit(newTodosedit);
    setRunningIndex(null);
    sendEditRequeststop(newTodosedit)
    setEditingIndexedit(-1);

  };

  const sendEditRequeststop = async (todosvalue) => {
    try {
      let res = await axios.put(`${SERVICE.TASK_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        checkpointsdev: todosvalue
      })
      handleCloseerrFiles();
      setSelectedFiles([])
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  const updatedTodos = filteredassigned.map(todo => {

    if (todo.label == isUserRoleAccess?.username) {
      return { ...todo, status: 'complete' };
    }
    return todo;
  });

  const sendCompleRequest = () => {
    if (filteredtasksnew.every(item => item.files.length > 0)) {
      sendcompleteEditRequest();
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please complete all the checkpoints"}</p>
        </>
      );
      handleClickOpenerr();
    }
  }

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const sendcompleteEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.TASK_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        testerassigneddate: today,
        assignedtodeveloper: updatedTodos,
        taskstatus: 'incomplete'
      })
      backPage('/project/tasklist')
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  //LoginUser image Access

  const profilePic = async (userprofile) => {
    try {
      let res = await axios.post(SERVICE.USERTASKPROFILE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        userprofile: String(userprofile)
      });
      setUsersid(res?.data?.users);
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

  const now = new Date();

  const [runningIndex, setRunningIndex] = useState(null);


  const handleUpdateTodoEditrunning = async (index) => {

    let resdev = await axios.post(SERVICE.TASKCHECKTIMER, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`
      },
      homeuserloginchecktimer: String(isUserRoleAccess.username)
    })

    let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${id}`, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`
      },

    });


    let oldstarttime = (res_project?.data?.stask?.checkpointsdev[index].starttime);

    if (resdev.data.tasks.length == 0) {

      const newTodosedit = [...todosedit];
      newTodosedit[index].starttime = [...oldstarttime, (now.toLocaleTimeString())];
      newTodosedit[index].state = "running";
      setTodosedit(newTodosedit);
      await sendEditRequest(newTodosedit);
      setRunningIndex(index);
      setEditingIndexedit(-1);
    }
    // const taskToUpdate = todosedit.find(task => task.idval === idval);


    // if (!taskToUpdate) {
    //   return;
    // }

    // if (taskToUpdate) {
    //   const newTodosedit = todosedit.map(task => {
    //     if (task.idval === idval) {
    //       return {
    //         ...task,
    //         starttime: [...task.starttime, now.toLocaleTimeString()],
    //         state: 'running'
    //       };
    //     }
    //     return task;
    //   });
    //   setTodosedit(newTodosedit);
    //   await sendEditRequest(newTodosedit);
    //   setRunningIndex(idval);
    //   setEditingIndexedit(-1);
    // }
    else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: 'orange' }} />
          <p style={{ fontSize: '18px', fontWeight: 800 }}>{`Timer Already Running in ${resdev.data.tasks[0].taskname}`}</p>
        </>
      );
      handleClickOpenerr();
    }




  };

  const handleUpdateTodoEditpaused = async (index) => {

    let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${id}`, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`
      },

    });
    let oldendtime = (res_project?.data?.stask?.checkpointsdev[index].endtime);
    // setCurrentTime(now.toLocaleTimeString());
    const newTodosedit = [...todosedit];
    newTodosedit[index].endtime = [...(res_project?.data?.stask?.checkpointsdev[index].endtime), now.toLocaleTimeString()];
    newTodosedit[index].state = "paused";
    setTodosedit(newTodosedit);
    await sendEditpausRequest(newTodosedit);
    setRunningIndex(null);
    // const taskToUpdate = todosedit.find(task => task.idval === idval);


    // if (!taskToUpdate) {
    //   return;
    // }

    // if (taskToUpdate) {
    //   const newTodosedit = todosedit.map(task => {
    //     if (task.idval === idval) {
    //       return {
    //         ...task,
    //         endtime: [...task.endtime, now.toLocaleTimeString()],
    //         state: 'paused'
    //       };
    //     }
    //     return task;
    //   });

    //   setTodosedit(newTodosedit);
    //   await sendEditpausRequest(newTodosedit);
    //   setRunningIndex(null);
    // }

  };

  const sendEditRequest = async (todosvalue) => {
    try {
      let res = await axios.put(`${SERVICE.TASK_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        checkpointsdev: todosvalue
      })
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  const sendEditpausRequest = async (todoval) => {
    try {
      let res = await axios.put(`${SERVICE.TASK_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        checkpointsdev: todoval
      } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  let datenow = Date.now();;
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  const calculateTotalTime = (idval) => {
    const matchedItem = filteredtasksnew.find((item) => item.idval === idval);
    const startTimes = matchedItem?.starttime;
    const endTimes = matchedItem?.endtime;

    let totalTime = 0;

    for (let i = 0; i < startTimes?.length; i++) {
      const startTime = new Date(`01/01/2023 ${startTimes[i]}`);
      const endTime = new Date(`01/01/2023 ${endTimes[i]}`);

      const timeDifference = Math.abs(endTime - startTime);
      totalTime += +timeDifference;
    }

    // Convert totalTime to hours, minutes, and seconds
    const hours = Math.floor((totalTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalTime % (1000 * 60)) / 1000);

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <Box sx={userStyle.container}>

      {!checktask ?

        <Box style={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
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
          {/* <FacebookCircularProgress /> */}
        </Box>
        :
        <>
          <Box>
            <Grid container spacing={2}>
              <Grid item md={5} xs={5} sm={6} sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                <Typography>Task Name : </Typography>
                <h3>{developerTask.taskname}</h3>
              </Grid>
              <Grid item md={5} xs={6} sm={5} style={{ display: "flex", justifyContent: "center", gap: '10px' }}>

                <img src={usersid?.profileimage ? usersid?.profileimage : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"} alt="User profile picture"
                  style={{ height: 50, width: 50, borderRadius: "50%", maxHeight: { xs: 233, md: 167 }, maxWidth: { xs: 350, md: 250 }, alignItems: "flex-end", justifyContent: "center" }}
                />
                <Typography style={{ marginTop: '10px', fontFamily: "auto", fontWeight: "900" }}>{developerTask.assignedby}</Typography>

              </Grid>

              <Grid item md={2} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  variant="contained"
                  style={{ padding: '7px 19px', backgroundColor: "#00905d", height: 'fit-content', color: "white" }}
                  onClick={() => {
                    sendCompleRequest();

                  }}
                >
                  Complete
                </Button>
              </Grid>

            </Grid>
          </Box>

          <br />
          <br />
          <br />
          <br />
          <Typography>Task Details :</Typography>
          <br />
          <br />


          <Box container spacing={2}>
            <div>
              <TabContext value={value} >
                <Box style={{
                  borderBottom: 1, borderColor: 'divider',
                  borderRadius: '4px',
                  boxShadow: '0px 0px 4px #b7b1b1',
                  border: '1px solid #c3c3c3',
                  overflow: 'hidden',
                  marginBottom: '0px',
                  boxSizing: 'border-box',
                }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example" sx={{
                    backgroundColor: '#f5f5f5', borderRadius: '4px',
                    '.MuiTab-textColorPrimary.Mui-selected': {
                      color: 'white',
                      border: '1px solid #b5afaf',
                      borderBottom: 'none',
                      background: ' #3346569c'
                    },
                    '.css-1aquho2-MuiTabs-indicator': {
                      background: 'none',
                    }

                  }}>
                    <Tab label="PBI" value="1"
                      sx={userStyle.tablelistStyle}
                    // }}  
                    />


                    <Tab label="Description" value="2" sx={userStyle.tablelistStyle} />

                    <Tab label="Resources" value="3" sx={userStyle.tablelistStyle} />
                  </TabList>
                </Box>
                <TabPanel value="1" index={0} sx={userStyle.tabpanelstyle}>
                  {pbiUploadDev.map((data) => {
                    return <>
                      {data.type.includes("image/") ?
                        <>
                          <img src={data.preview} alt={data.name} style={{ maxHeight: '100px', marginTop: '10px' }} />
                          <Button style={userStyle.buttonedit}
                            onClick={() => {
                              handleClickOpenview();
                              setViewImage(data.preview);
                            }} ><VisibilityOutlinedIcon style={{ fontsize: "large" }} /></Button>
                        </>
                        :
                        <>
                          <Box >
                            <Button variant='contained' onClick={() => renderFilePreview(data)} style={{ textTranform: 'capitalize' }}><SearchIcon />Preview</Button>
                          </Box>
                          <img className={classes.preview} src={getFileIcon(data.name)} height="100" alt="file icon" />
                        </>
                      }
                    </>

                  })}
                </TabPanel>
                <TabPanel value="2" index={1} sx={userStyle.tabpanelstyle}>
                  <div dangerouslySetInnerHTML={{ __html: developerTask.description }}></div>
                </TabPanel>
                <TabPanel value="3" index={2} sx={userStyle.tabpanelstyle}>
                  {resourcesDev.map((data, index) => {
                    return <>
                      <Box key={index}>
                        <Button variant='contained' onClick={() => renderFilePreview(data)} style={{ textTranform: 'capitalize' }}><SearchIcon />Preview</Button>
                      </Box>
                      {data.type.includes("image/") ? (
                        <img src={data.preview} alt={data.name} height="100" style={{ maxWidth: "-webkit-fill-available" }} />
                      ) : (
                        <img className={classes.preview} src={getFileIcon(data.name)} height="100" alt="file icon" />
                      )}
                      <Typography onClick={() => { handleDownload(data) }} style={{ onClick: "pointer" }}>{data.name}</Typography>

                    </>

                  })}
                </TabPanel>
              </TabContext>
            </div>
          </Box>


          <br />
          <br />
          <br />
          <Typography>Check Points :</Typography>
          <Box sx={{ padding: "12px" }}>
            <br />
            <br />
            <div>

              <div>
                {Object.keys(groupedTodos).map((title, i) => {
                  if (title !== "Returned") {
                    return (
                      <div key={title}>
                        <Grid container>
                          <Box> <h3>{title}</h3> </Box>
                        </Grid>
                        {groupedTodos[title].map((data, index) => {

                          const lastStartTime = data.starttime[data.starttime.length - 1]
                          const lastEndTime = data.endtime[data.endtime.length - 1]

                          // Parse the first time string into a Date object
                          const time1 = new Date(`01/01/2023 ${lastStartTime}`);

                          // Get the current time
                          const time2 = new Date(`01/01/2023 ${lastEndTime}`);

                          // Calculate the time difference in milliseconds
                          const timeDifference = Math.abs(time2 - time1);
                          const timeDifferencecurrent = Math.abs(timestamp - time1);

                          // Convert milliseconds to hours, minutes, and seconds
                          const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
                          //timer is running
                          const hours1 = Math.floor((timeDifferencecurrent / (1000 * 60 * 60)) % 24);
                          const minutes1 = Math.floor((timeDifferencecurrent % (1000 * 60 * 60)) / (1000 * 60));
                          const seconds1 = Math.floor((timeDifferencecurrent % (1000 * 60)) / 1000);

                          const data1 = `${data.time} minutes`; // Assuming `data.time` is in the format of minutes
                          const data2 = calculateTotalTime(data.idval);

                          const convertToTimeFormat = (duration) => {
                            if (duration.includes('hours')) {
                              const hours = parseInt(duration.split(' ')[0], 10);
                              return `0:${hours * 60}:0`;
                            } else if (duration.includes('minutes')) {
                              const minutes = parseInt(duration.split(' ')[0], 10);
                              return `0:${minutes}:0`;
                            }

                            return duration;
                          };

                          const formatToSeconds = (timeFormat) => {
                            const [hours, minutes, seconds] = timeFormat.split(':').map((str) => parseInt(str, 10));
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


                          return (
                            <div key={index}>

                              <Grid container sx={{ padding: '0px 10px' }}>
                                <Grid md={4} sm={12} xs={12} sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                                  <FormControl >
                                    <FormControlLabel
                                      sx={{ color: data.isreturn == "returned" ? "red" : "inherit" }}
                                      control={
                                        <Checkbox
                                          checked={(data?.files)?.length > 0 ? true : false}
                                          onClick={(e) => {

                                            handleEditTodoEdit(data.indexval, data.time, data.idval);
                                            handleClickOpenerrFiles(data.indexval);

                                          }}
                                          name=""
                                          disabled={(data?.files)?.length > 0 ? true : false}

                                        />
                                      }
                                      label={" " + data.label}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid md={1} sm={12} xs={12}>

                                  <Typography variant="subtitle2">
                                    {data.time === 1
                                      ? `${data.time} Minute`
                                      : data.time >= 60
                                        ? (
                                          <>
                                            {`${data.time} Minutes`} <br />
                                            {`(${Math.floor(data.time / 60)}:${data.time % 60}:${Math.floor((data.time % 1) * 60)})`}
                                          </>
                                        )
                                        : `${data.time} Minutes`}
                                  </Typography>

                                </Grid>
                                <Grid md={2} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: "baseline" }}>

                                  <Typography sx={{
                                    backgroundColor:
                                      (data.priority) === "Low" || (data.priority) === "low" || (data.priority) === "low1" || (data.priority) === "low2" || (data.priority) === "low3" || (data.priority) === "Low1" || (data.priority) === "Low2" || (data.priority) === "Low3" ? "#a9d0a9" :
                                        (data.priority) === "Medium" || (data.priority) === "medium" || (data.priority) === "Medium1" || (data.priority) === "Medium2" || (data.priority) === "Medium3" || (data.priority) === "medium1" || (data.priority) === "medium2" || (data.priority) === "medium3" ? "#a9a9cb" : "#ff0000b5",
                                    textTransform: "capitalize",
                                    padding: "1px 6px",
                                    maxWidth: "fit-content",

                                    borderRadius: "13%",
                                    color: "white",
                                    lineHeight: "1.3",
                                    fontSize: "11px", // Note the correct spelling of fontSize

                                    // Media query for small screens
                                    '@media (max-width: 600px)': {
                                      fontSize: "medium",
                                      padding: "1px 4px",
                                    }
                                  }}>
                                    {data.priority}
                                  </Typography>

                                </Grid>
                                <Grid md={2} sm={12} xs={12}>
                                  <Typography>{(data?.files)?.map((file) => (

                                    <>
                                      <Box sx={{ display: "flex", justifyContent: "left" }}>
                                        <Typography variant="subtitle2">
                                          {file.name}{" "}
                                        </Typography>
                                      </Box>
                                    </>
                                  ))}</Typography>
                                </Grid>
                                <Grid md={1} sm={12} xs={12}>
                                  <Typography style={{ background: greaterDuration == "On Time" ? "#34a034ed" : greaterDuration == "Delay" ? "#f82c2ceb" : "grey", width: 'max-content', borderRadius: '14px', color: 'white', padding: "0px 5px" }} variant="subtitle2" >
                                    {greaterDuration == "" && data.state == "running" ? "On going" : greaterDuration}
                                  </Typography>

                                </Grid>
                                <Grid md={1} sm={12} xs={12}>
                                  <Typography variant="subtitle2">
                                    {data.state == "running" ?
                                      `${hours1 ? hours1 : 0}:${minutes1 ? minutes1 : 0}:${seconds1 ? seconds1 : 0}`

                                      : data.state == "paused" || data.state == "stopped" ?
                                        calculateTotalTime(data.idval)
                                        :
                                        `${hours ? hours : 0}:${minutes ? minutes : 0}:${seconds ? seconds : 0}`}

                                  </Typography>

                                </Grid>
                                {data.isreturn != "returned" &&
                                  <Grid md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>

                                    {data.state === "running" ? (
                                      <Button style={{ textTransform: 'capitalize', padding: '3px 18px', background: '#f5f5f5', border: '1px solid', color: '#0000008f' }} onClick={() => { handleUpdateTodoEditpaused(data.indexval); }}>Pause</Button>
                                    ) : (
                                      <Button style={{ textTransform: 'capitalize', padding: '3px 22px', background: '#f5f5f5', border: runningIndex !== null && runningIndex !== data.idval || data.state == "stopped" ? "none" : '1px solid', color: '#0000008f' }}
                                        disabled={runningIndex !== null && runningIndex !== data.indexval || data.state == "stopped"}
                                        onClick={() => { handleUpdateTodoEditrunning(data.indexval); }}
                                      >
                                        Start
                                      </Button>
                                    )}

                                  </Grid>
                                }

                              </Grid>

                              <br />
                            </div>


                          )
                        })
                        }
                      </div>
                    )
                  }
                })}
              </div>

              <div>

                {Object.keys(groupedReturnedTodos).map((returnCount) => (
                  <div key={returnCount}>
                    <h3>Return Count: {returnCount}</h3>

                    {groupedReturnedTodos[returnCount].map((data, index) => (

                      <Grid container sx={{ background: 'rgb(183 9 9 / 31%)', alignItems: 'center', display: 'flex', padding: '0px 10px' }} >
                        <Grid md={4} sm={12} xs={12} sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                          <FormControl >
                            <FormControlLabel
                              sx={{ color: data.isreturn == "returned" ? "red" : "inherit" }}
                              control={
                                <Checkbox
                                  checked={(data?.files)?.length > 0 ? true : false}
                                  onClick={(e) => {

                                    handleEditTodoEdit(data.indexval, data.time);
                                    handleClickOpenerrFiles(index);

                                  }}
                                  name=""
                                  disabled={(data?.files)?.length > 0 ? true : false}

                                />
                              }
                              label={data.label}
                            />
                          </FormControl>
                        </Grid>
                        <Grid md={1} sm={12} xs={12}>

                          <Typography variant="subtitle2">
                            {data.time == 0 || "" ?
                              (data.time === 1
                                ? `${data.time} Minute`
                                : data.time >= 60
                                  ? (
                                    <>
                                      {`${data.time} Minutes`} <br />
                                      {`(${Math.floor(data.time / 60)}:${data.time % 60}:${Math.floor((data.time % 1) * 60)})`}
                                    </>
                                  )
                                  : `${data.time} Minutes`)
                              : data.returndate}

                          </Typography>

                        </Grid>
                        <Grid md={2} sm={2} xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: "baseline" }}>
                          <Typography sx={{
                            backgroundColor: "#ff0000b5",
                            textTransform: "capitalize",
                            padding: "1px 6px",
                            maxWidth: "fit-content",

                            borderRadius: "13%",
                            color: "white",
                            lineHeight: "1.3",
                            fontSize: "11px", // Note the correct spelling of fontSize

                            // Media query for small screens
                            '@media (max-width: 600px)': {
                              fontSize: "medium",
                              padding: "1px 4px",
                            }
                          }}>
                            {"High"}
                          </Typography>

                        </Grid>
                        <Grid md={3} sm={12} xs={12}>
                          <Typography>{(data?.files)?.map((file) => (

                            <>
                              <Box sx={{ display: "flex", justifyContent: "left" }}>
                                <Typography variant="subtitle2">
                                  {file.name}{" "}
                                </Typography>
                              </Box>
                            </>
                          ))}</Typography>
                        </Grid>

                        <Grid md={1} sm={12} xs={12}>


                        </Grid>

                        <Grid md={2} sm={12} xs={12} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>



                        </Grid>

                      </Grid>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          </Box>
        </>}
      {/* ALERT POPUP DIALOG */}
      <Box >
        <Dialog
          open={isErrorOpenFiles}
          onClose={handleCloseerrFiles}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            style={{ width: "550px", textAlign: "center", alignItems: "center" }}
          >
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <div>
              <input
                className={classes.inputs}
                type="file"
                id="file-inputuploadfiletask"
                multiple
                onChange={handleInputChange}
              />
              <label htmlFor="file-inputuploadfiletask" style={{ textAlign: "center", padding: '7px 14px' }}>
                <Button style={userStyle.btncancel} component="span">
                  <AddCircleOutlineIcon /> &ensp; Add Images
                </Button>
              </label>

              <Grid container>
                {selectedFiles?.map((file, index) => (
                  file.index === indexData ?
                    <>
                      <Grid item md={3} sm={11} xs={11}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Typography variant="subtitle2">
                          </Typography>
                        </Box>
                        <img src={file.preview} height={100} />
                      </Grid>
                      <Grid item md={1} sm={1} xs={1}>

                        <Button
                          sx={{
                            padding: '14px 14px', marginTop: '16px', minWidth: '40px !important', borderRadius: '50% !important', ':hover': {
                              backgroundColor: '#80808036', // theme.palette.primary.main

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
                    </> : ""
                ))}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" disabled={selectedFiles.length <= 0} color="primary" onClick={() => { handleUpdateTodoEdit(); sendEditRequest(); }}>
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
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent style={{ width: '400px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ background: "#da2f2f", color: 'white', padding: '7px 14px', borderRadius: '4px' }} onClick={handleCloseerr}>ok</Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} >
        <DialogContent style={{ maxWidth: "100%", alignItems: "center" }}>
          <img
            src={viewImage}
            alt={viewImage}
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
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
          <Button variant="contained" style={{ padding: '7px 19px', backgroundColor: "#00905d", height: 'fit-content', color: "white" }}
            onClick={handleCloseview}>
            {" "}
            Back{" "}
          </Button>
        </DialogContent>
      </Dialog>
    </Box >
  );
}

export default TaskTabs;