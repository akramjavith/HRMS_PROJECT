import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Grid, Button, DialogActions, Dialog, DialogContent } from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Link } from "react-router-dom";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import { AuthContext } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Headtitle from "../../../../components/Headtitle";
import { handleApiError } from "../../../../components/Errorhandling";

function Tasklist({filteralert, filterchange, filterclear, userTasksFilter, userTasksDevFilter, 
  userTasksTestFilter,selectedProject ,selectedSubProject,selectedModule,
  selectedSubModule,selectedMainpage,selectedSubpage,selectedSubSubpage

}) {
  const { auth } = useContext(AuthContext);
  const [isTaskdots, setIsTaskdots] = useState(false);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [userTasks, setUserTasks] = useState([]);
  const [userTasksDev, setUserTasksDev] = useState([]);
  const [userTasksTest, setUserTasksTest] = useState([]);

  const fetchUsersTasks = async () => {
    try {
      let res = await axios.get(SERVICE.ALLTASKSADMIN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setIsTaskdots(true);
      setUserTasks(res?.data?.taskUI);
      setUserTasksDev(res?.data?.taskDev);
      setUserTasksTest(res?.data?.taskTest);
    } catch (err) {setIsTaskdots(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchUsersTasksFilter = async () => {
      setUserTasks(userTasksFilter);
      setUserTasksDev(userTasksDevFilter);
      setUserTasksTest(userTasksTestFilter);
  };

  useEffect(() => {
    fetchUsersTasks();
  }, []);
  


  useEffect(() => {
    if(filteralert){
   
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please choose Any one filter"}</p>
          </>
        );
        handleClickOpenerr();
    
  }else{    
      fetchUsersTasksFilter();    
  }
  }, [filterchange,filteralert]);

  useEffect(() => {
    if(filterclear === "clear"){
      fetchUsersTasks();
    }    
  }, [filterclear]);

  return (
    <>
      <Box>
        <Headtitle title={"TASKBOARD"} />
        {isTaskdots ? (
          <>
            <Grid container spacing={1}>
              <Grid item md={2} sm={6} xs={12}>
                <Typography variant="h6">UI Design</Typography>

                <Box sx={userStyle.taskboardcontainer}>
                  <br />
                  {userTasks?.length > 0 &&
                    userTasks.map((row) => {
                      if (row.phase === "UI") {
                        return (
                          <>
                            <Box sx={userStyle.taskboardbox_ui} key={row._id}>
                              <Typography
                                sx={{
                                  fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                  fontWeight: "bold",
                                  fontFamily: "auto",
                                  wordWrap: "break-word",
                                }}
                              >
                                {row.taskname}
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                <Link target="_blank" rel="noopener noreferrer" to={`/project/taskuipageadmin/${row._id}`} style={{ background: "#b76eb7", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                  <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                </Link>
                              </Box>
                            </Box>
                            <br />
                          </>
                        );
                      }
                    })}
                </Box>
              </Grid>
              <Grid item md={2} sm={6} xs={12}>
                <Typography variant="h6">Development</Typography>
                <Box sx={userStyle.taskboardcontainer}>
                  <br />
                  {/* <Box sx={userStyle.taskboardbox_dev}>HI</Box> */}
                  {userTasksDev?.length > 0 &&
                    userTasksDev.map((row) => {
                      if (row.phase === "Development") {
                        return (
                          <>
                            <Box sx={userStyle.taskboardbox_dev} key={row._id}>
                              <Typography
                                sx={{
                                  fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                  fontWeight: "bold",
                                  fontFamily: "auto",
                                  wordWrap: "break-word",
                                }}
                              >
                                {row.taskname}
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                <Link target="_blank" rel="noopener noreferrer" to={`/project/taskdevpageadmin/${row._id}`} style={{ background: "#1976d291", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                  <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                </Link>
                              </Box>
                            </Box>
                            <br />
                          </>
                        );
                      }
                    })}
                </Box>
              </Grid>
              <Grid item md={2} sm={6} xs={12}>
                <Typography variant="h6">Testing</Typography>

                <Box sx={userStyle.taskboardcontainer}>
                  <br />
                  {userTasksTest?.length > 0 &&
                    userTasksTest.map((row) => {
                      if (row.phase === "Testing") {
                        return (
                          <>
                            <Box sx={userStyle.taskboardbox_test} key={row._id}>
                              <Typography
                                sx={{
                                  fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                  fontWeight: "bold",
                                  fontFamily: "auto",
                                  wordWrap: "break-word",
                                }}
                              >
                                {row.taskname}
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                <Link target="_blank" rel="noopener noreferrer" to={`/project/tasktesterpageadmin/${row._id}`} style={{ background: "#e3b052", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                  <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                </Link>
                              </Box>
                            </Box>
                            <br />
                          </>
                        );
                      }
                    })}
                </Box>
              </Grid>
              <Grid item md={2} sm={6} xs={12}>
                <Typography variant="h6">Source Integration</Typography>

                <Box sx={userStyle.taskboardcontainer}>
                  <br />
                </Box>
              </Grid>
              <Grid item md={2} sm={6} xs={12}>
                <Typography variant="h6">Deployment</Typography>
                <Box sx={userStyle.taskboardcontainer}>
                  <br />
                </Box>
              </Grid>
              <Grid item md={2} sm={6} xs={12}>
                <Typography variant="h6">Completed Tasks</Typography>
                <Box sx={userStyle.taskboardcontainer}>
                  <br />
                </Box>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}

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
      </Box>
    </>
  );
}

export default Tasklist;