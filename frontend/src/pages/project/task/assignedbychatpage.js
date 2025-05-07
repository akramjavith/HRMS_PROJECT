import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, TextField } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { Link } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import moment from "moment-timezone";

const SwipeableDrawerComponent = ({ isOpen, onClose, selectedRowId }) => {
  const [msg, setMsg] = useState({ usermsg: "" });
  const [oldmessages, setOldmessages] = useState([]);
  const [data, setData] = useState([]);

  //get all subpagetwo.
  const fetchAllTasks = async () => {
    try {
      let res_mainpage = await axios.get(SERVICE.TASK, {});
      setData(res_mainpage?.data?.tasks);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const rowData = async () => {
    try {
      let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${selectedRowId}`, {});
      setOldmessages(res_project?.data?.stask?.assignedbymsg);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchAllTasks();
  });
 
  const datas = data?.filter((item) => {
    if (selectedRowId === item._id) {
      return item;
    }
  });

  let oldMsg = oldmessages[0]?.message ? oldmessages[0]?.message : "";
  let oldMsgtime = oldmessages[0]?.time ? oldmessages[0]?.time : "";

  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.TASK_SINGLE}/${selectedRowId}`, {
        assignedbymsg: [
          {
            message: [...oldMsg, String(msg.usermsg)],
            time: [...oldMsgtime, String(new Date())],
          },
        ],
      });

      setMsg({ usermsg: "" });
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    rowData();
  });

  //Edit Button
  const editSubmit = (e) => {
    e.preventDefault();
    sendEditRequest();
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      onOpen={() => { }}
    >
      <Box sx={{ width: "520px !IMPORTANT" }}>
        <form onSubmit={editSubmit}>
          <Grid
            container
            spacing={2}
            sx={{ position: "absolute", bottom: "0px", padding: "10px" }}
          >
            <>
              <Grid md={12} sm={12}>
                <Box
                  sx={{ position: "relative", bottom: "10px", padding: "10px" }}
                >
                  <>
                    {datas.map((item) => (
                      <Grid container key={item._id}>
                        {item.usermsg.map((msg, index) => (
                          <Grid item md={6} sm={6} xs={6}>
                            {msg.message.map((text, index) => (
                              <Typography sx={{ width: "fit-content", background: "PINK", padding: "4PX 20PX", borderRadius: "15PX", }}
                                key={index}
                              >
                                {text}
                              </Typography>
                            ))}
                          </Grid>
                        ))}
                      </Grid>
                    ))}
                    {datas.map((item) => (
                      <>
                        <Grid container key={item._id}>
                          {item.assignedbymsg.map((msg, index) => (
                            <>
                              <Grid md={6} sm={6}>
                                {" "}
                              </Grid>
                              <Grid item md={6} sm={6} xs={6} sx={{ textAlign: "right", display: "grid", justifyContent: "end", justifyItems: 'end' }}   >
                                {msg.message.map((text, index) => (
                                  <Typography key={index} sx={{ width: "fit-content", background: "#80808057", padding: "4PX 20PX", borderRadius: "15PX", }}  >
                                    {text}
                                  </Typography>
                                ))}
                              </Grid>
                            </>
                          ))}
                        </Grid>
                      </>
                    ))}
                  </>

                  {/* HI */}
                </Box>
              </Grid>
            </>
            <Grid item md={9} sm={9} xs={9}>
              <TextField id="outlined-required" value={msg.usermsg} onChange={(e) => { setMsg({ ...msg, usermsg: e.target.value }); }} fullWidth placeholder="type message..." size="small" />
            </Grid>
            <Grid item md={3} sm={3} xs={3}>
              <Button variant="contained" type="submit" endIcon={<SendIcon style={{ transform: "rotate(320deg)", marginTop: "-6px" }} />}> Send</Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </SwipeableDrawer>
  );
};

function Tasklist() {
  const [tasklist, setTasklist] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersall, setallUsers] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [taskstester, setTaskstester] = useState([]);
  const [rowid, setRowid] = useState("");

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleButtonClick = (rowId) => {
    setOpenDrawer(true);
    setSelectedRowId(rowId);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };


  let userId = localStorage.LoginUserId;


  //get all project.
  const fetchAllUsers = async () => {
    try {
      let res_project = await axios.get(`${SERVICE.USER_SINGLE}/${userId}`, {});
      setUsers(res_project.data.suser);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getAssignedbyProfile = async () => {
    try {
      let res_project = await axios.get(`${SERVICE.USER}`);
      setallUsers(res_project.data.users);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };



  //get all project.
  const fetchAllProject = async () => {
    try {
      let res_project = await axios.get(SERVICE.TASK, {});
      let incompletetask = res_project.data.tasks.filter((obj) => obj.status === "incomplete");
      setTaskstester(incompletetask.filter((obj) => obj.assignedby === users.username));
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllProject();
  });

  useEffect(() => {
    getAssignedbyProfile();
  });



  return (
    <Box>
      <Typography variant="h5">Task Board</Typography>
      <br />
      <Grid container spacing={2}>
        {/* <Grid item md={3.5} sm={6} xs={12}>
          <Box sx={userStyle.taskboardcontainer}>
            <Typography variant="h6">Lists</Typography>
            <br />
            {taskstester &&
              taskstester?.map((row, index) => {
                return (
                  <>
                    <Box sx={userStyle.taskboardbox} key={index}>
                      <Grid container spacing={2}>
                        <Grid item md={3} sm={3} xs={3}>
                          <img
                            src={users?.profileimage}
                            alt=""
                            style={{ borderRadius: "50%" }}
                            height={50}
                          ></img>
                          <Typography sx={{ color: "grey", fontSize: "15px" }}>
                            <em>{moment(row.assigneddate).format("MMM DD")}</em>
                          </Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={6}>
                          <Typography>{"Test task2"}</Typography>
                          <Grid container sx={{ alignItems: "center" }}>
                            <Grid item md={6} sm={6} xs={6}>
                              <Typography sx={{ fontSize: "12px" }}>
                                Assigned-by
                              </Typography>
                            </Grid>
                            <Grid item md={6} sm={6} xs={6}>
                              <img
                                src={ usersall?.find(  (user) =>user._id == row.assignedbyprofileimg )?.profileimage
                                }
                                alt=""
                                style={{ borderRadius: "50%" }}
                                height={30}
                              ></img>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          md={3}
                          sm={3}
                          xs={3}
                          sx={{ padding: "20px 0px" }}
                        >
                          <Box>
                            <Link
                              to={`/project/taskpage/${row._id}`}
                              style={{ textDecoration: "none", color: "white" }}
                            >
                              {" "}
                              <Button sx={userStyle.taskboardbtn}>
                                <RemoveRedEyeIcon />
                              </Button>
                            </Link>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <br />
                  </>
                );
              })}
          </Box>
        </Grid> */}
        <Grid item md={3.5} sm={6} xs={12}>
          <Box sx={userStyle.taskboardcontainer}>
            <Typography variant="h6">Development</Typography>
            <br />
            {taskstester &&
              taskstester?.map((row, index) => {
                return (
                  <>
                    <Box sx={userStyle.taskboardbox} key={index}>
                      <Grid container spacing={2}>
                        <Grid item md={3} sm={3} xs={3}>
                          {/* <img
                            src={users?.profileimage}
                            alt=""
                            style={{ borderRadius: "50%" }}
                            height={50}
                          ></img> */}
                          <Typography sx={{ color: "grey", fontSize: "15px" }}>
                            <em>
                              {moment(row?.assigneddate).format("MMM DD")}
                            </em>
                          </Typography>
                        </Grid>
                        <Grid item md={6} sm={6} xs={6}>
                          <Box
                            sx={{
                              width: "fitContent",
                              maxWidth: "100%",
                              textAlign: "justify",
                            }}
                          >
                            <Typography
                              sx={{
                                display: "inline-block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {row.taskname}
                            </Typography>
                          </Box>
                          {/* <Grid container sx={{ alignItems: "center" }}>
                            <Grid item md={8} sm={8} xs={8}>
                              <Typography sx={{ fontSize: "12px" }}>
                                Assigned-by
                              </Typography>
                            </Grid>
                            <Grid item md={4} sm={4} xs={4}>
                              <img
                                src={
                                  usersall?.find(
                                    (user) =>
                                      user?._id == row.assignedbyprofileimg
                                  )?.profileimage
                                }
                                alt=""
                                style={{ borderRadius: "50%" }}
                                height={30}
                              ></img>
                            </Grid>
                          </Grid> */}
                          <Grid container sx={{ alignItems: "center" }}>
                            <Typography
                              sx={{
                                backgroundColor:
                                  row.priority == "Low"
                                    ? "#a9d0a9"
                                    : row.priority == "Medium"
                                      ? "#a9a9cb"
                                      : "#ff00007d",
                                textTransform: "capitalize",
                                padding: "2px 6px",
                                minWidth: "fit-content",
                                borderRadius: "13%",
                                color: "white",
                                fontSize: "9px",
                              }}
                            >
                              {row.priority}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid itemmd={3} sm={3}
                          xs={3}
                          sx={{ padding: "20px 0px" }}
                        >
                          <Box>
                            {/* <Link
                              to={`/project/taskpage/${row._id}`}
                              style={{ textDecoration: "none", color: "white" }}
                            >
                              {" "}
                              <Button sx={userStyle.taskboardbtn}>
                                <RemoveRedEyeIcon />
                              </Button>
                            </Link> */}
                            <Button onClick={() => handleButtonClick(row._id)}>
                              <ChatIcon />
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <br />
                  </>
                );
              })}

          </Box>
        </Grid>
        <Grid item md={3.5} sm={6} xs={12}>

        </Grid>
      </Grid>
      <>

        <SwipeableDrawerComponent isOpen={openDrawer} selectedRowId={selectedRowId} onClose={handleCloseDrawer} />
      </>
    </Box>
  );
}

export default Tasklist;