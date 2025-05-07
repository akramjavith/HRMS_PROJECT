import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Grid, Button, DialogActions, Dialog, DialogContent } from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Link } from "react-router-dom";
import { SERVICE } from "../../../../services/Baseservice";
import { AuthContext } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Headtitle from "../../../../components/Headtitle";
import { handleApiError } from "../../../../components/Errorhandling";
import AlertDialog from "../../../../components/Alert";
import MessageAlert from "../../../../components/MessageAlert";

function Tasklist({ filteralert, filterchange, filterclear, userTasksFilter, userTasksDevFilter,
  userTasksTestFilter, selectedProject, selectedSubProject, selectedModule,
  selectedSubModule, selectedMainpage, selectedSubpage, selectedSubSubpage,
  filteralertmsg, setfilteralert, setfilteralertmsg
}) {

  const priorityColors = {
    "urgent": "#8B0000",  // DarkRed (darker shade for urgent, high urgency)
    "very high": "#FF4500", // OrangeRed (distinct from urgent, bright red)
    high: "#FF6347",        // Tomato (lighter than "very high" and "urgent")
    medium: "#1E90FF",      // DodgerBlue (clear blue for medium)
    low: "#32CD32",         // LimeGreen (vivid, bright green for low priority)
    "very low": "#90EE90",  // LightGreen (softer green for very low priority)
  };
  const { auth } = useContext(AuthContext);
  const [isTaskdots, setIsTaskdots] = useState(true);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);

  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setfilteralert(false);
    setfilteralertmsg("")
  };

  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);

  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
    setfilteralert(false);
    setfilteralertmsg("");
  };

  const [userTasks, setUserTasks] = useState([]);
  const [userTasksDev, setUserTasksDev] = useState([]);
  const [userTasksTest, setUserTasksTest] = useState([]);



  const fetchUsersTasksFilter = async () => {
    setUserTasks(userTasksFilter);
    setUserTasksDev(userTasksDevFilter);
    setUserTasksTest(userTasksTestFilter);
  };





  useEffect(() => {
    if (filteralert && filteralertmsg !== "") {

      setPopupContentMalert(filteralertmsg);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else {
      fetchUsersTasksFilter();
    }
  }, [filterchange, filteralert, filteralertmsg]);

  useEffect(() => {
    if (filterclear === "clear") {
      setUserTasks([]);
      setUserTasksDev([]);
      setUserTasksTest([]);
      setPopupContentMalert("Cleared Successfully");
      setPopupSeverityMalert("success");
      handleClickOpenPopupMalert();
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
                              <Box
                                sx={{
                                  marginTop: "8px",
                                  padding: "4px 8px",
                                  color: "#fff",
                                  backgroundColor: priorityColors[row?.priority?.priority?.toLowerCase()] || "#ccc",
                                  borderRadius: "4px",
                                  display: "inline-block",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "12px", // Adjust font size as needed
                                }}
                              >
                                {row?.priority?.priority || "No Priority"}
                              </Box>
                              &ensp;
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

                              <Box
                                sx={{
                                  marginTop: "8px",
                                  padding: "4px 8px",
                                  color: "#fff",
                                  backgroundColor: priorityColors[row?.priority?.priority?.toLowerCase()] || "#ccc",
                                  borderRadius: "4px",
                                  display: "inline-block",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "12px", // Adjust font size as needed
                                }}
                              >
                                {row?.priority?.priority || "No Priority"}
                              </Box>
                              &ensp;
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
                              <Box
                                sx={{
                                  marginTop: "8px",
                                  padding: "4px 8px",
                                  color: "#fff",
                                  backgroundColor: priorityColors[row?.priority?.priority?.toLowerCase()] || "#ccc",
                                  borderRadius: "4px",
                                  display: "inline-block",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "12px", // Adjust font size as needed
                                }}
                              >
                                {row?.priority?.priority || "No Priority"}
                              </Box>
                              &ensp;
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
        <MessageAlert
          openPopup={openPopupMalert}
          handleClosePopup={handleClosePopupMalert}
          popupContent={popupContentMalert}
          popupSeverity={popupSeverityMalert}
        />
      </Box>
    </>
  );
}

export default Tasklist;