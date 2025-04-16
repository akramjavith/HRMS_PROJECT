import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { GlobalStyles } from "@mui/material";
import Footer from "../components/footer/footer.js";
import "./visitors.css";
import hilife from "./images/+-removebg-preview-removebg-preview.png";
import uploadconfetti from "./images/wired-flat-1103-confetti.gif";
import run from "./images/run.gif";
import message from "./images/message.png";
import exitdoor from "./images/exit.png";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Dialog, TableContainer,
  DialogContent,
  DialogActions,
  Box, Table, Paper,
  Typography,
  Grid,
  Button,
  TableCell, TableRow, TableBody, TableHead
} from "@mui/material";
import { SERVICE } from "../services/Baseservice";
import axios from "axios";
import { AUTH } from "../services/Authservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import wave from "./images/waving.png";
import logout from "./images/logout.png";
import newproj from "./images/newproject.png";


function Checkinvisitor() {

  const [overallSettings, setOverAllsettingsCount] = useState({});



  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);
      setOverAllsettingsCount(res?.data?.overallsettings[0]);

    } catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  }

  useEffect(() => {

    fetchOverAllSettings()

  }, []);



  const [units, setUnits] = useState([])

  const [openviewed, setOpenviewed] = useState(false);
  const handleClickOpenviewed = () => {
    setOpenviewed(true);
  };
  const handleCloseviewed = () => {
    setOpenviewed(false);
  };

  const [openviewedout, setOpenviewedout] = useState(false);
  const handleClickOpenviewedout = () => {
    setOpenviewedout(true);
  };
  const handleCloseviewedout = () => {
    setOpenviewedout(false);
  };

  const hoverableCell = {
    "&:hover": {
      backgroundColor: "#D2E7F7",
    },
  };

  const backpage = useParams()

  const rows = [
    { sno: 1, date: "01/05/2024", name: "name1", intime: "07:24" },
    { sno: 2, date: "01/06/2024", name: "name1", intime: "07:24" },
    { sno: 3, date: "01/07/2024", name: "name1", intime: "07:24" },
    { sno: 4, date: "01/08/2024", name: "name1", intime: "07:24" },

  ]


  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const { company, branch, unit } = useParams()

  const fetchUnits = async () => {
    try {
      let res_unit = await axios.get(SERVICE.BRANCH, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
      });
      setUnits(res_unit?.data?.branch);
      console.log(res_unit?.data?.branch, "comp")
    } catch (err) {
      console.log(err, "error015")
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      }
      else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };


  useEffect(() => {
    fetchUnits();
  }, [])

  const [filteredUnits, setFilteredUnits] = useState([]);

  useEffect(() => {
    const matchedUnits = units.filter(unit => {
      if (company === unit.company && branch === unit.name
      ) {
        return unit
      }
    }

    );
    setFilteredUnits(matchedUnits);
  }, [filteredUnits]);

  const logOut = async () => {
    try {
      await axios.get(AUTH.LOGOUT, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
      });

      // setAuth({ ...auth, loginState: false });
      localStorage.clear();
      window.location.href = `/Visitorsregister/${company}/${branch}`;

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };


  return (
    <>
      <GlobalStyles
        styles={{
          "@import":
            "url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap')",
          body: {
            fontFamily: "League Spartan, sans-serif",
          },
        }}
      />
      <Box sx={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid
            item
            md={5.5}
            xs={12}
            lg={5.5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <Box
              component="img"
              sx={{
                height: 450,
                width: 450,
                maxHeight: { xs: 170, sm: 250, md: 450 },
                maxWidth: { xs: 170, sm: 250, md: 450 },
              }}
              alt=""
              // src={hilife}
              src={overallSettings?.companylogo}
            />
          </Grid>
          <Grid item md={1}
            xs={0}
            lg={1}
            sm={0}
            sx={{
              display: { md: "flex", xs: "none", sm: "none" },
              justifyContent: "center",
              alignItems: "center",

            }}
          >
            <Box
              style={{
                borderLeft: "7px solid red",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                height: "630px",
              }}
            ></Box>
          </Grid>


          <Grid
            item
            md={5.5}
            xs={12}
            lg={5.5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box>
              <Grid container spacing={1}>
                <Grid
                  item
                  lg={3}
                  md={3}
                  xs={4}
                  sm={3}
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                  }}
                >
                  <img
                    alt={""}
                    style={{
                      height: "70px",
                      width: "70px",
                      marginTop: "4px",
                    }}
                    src={run}
                  />
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8} marginTop={2}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: 30, sm: 40, md: 50 },
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "League Spartan, sans-serif",
                      textalign: "center",
                    }}
                  >
                    HI-VISITOR
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                {filteredUnits.map(unit => (
                  // <div key={unit._id}>
                  //   {/* <h2>{unit.name}</h2> */}

                  //   <img
                  //     // style={{
                  //     //   justifyContent: "center",
                  //     //   alignItems: "center",
                  //     //   height: "400px",
                  //     //   width: "400px",
                  //     // }}
                  //     src={unit.qrcode}

                  //     alt="" />

                  // </div>

                  <Box key={unit._id}
                    component="img"
                    sx={{
                      height: 350,

                      width: 350,
                      maxHeight: { xs: 150, sm: 200, md: 350 },
                      maxWidth: { xs: 150, sm: 200, md: 350 },
                    }}
                    alt=""
                    src={unit.qrcode} />
                ))}
              </Box>
              <br />
              <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Button
                  sx={{
                    backgroundColor: "red",
                    borderRadius: "10px",
                    justifyContent: "center",
                    width: { xs: "300px", sm: "400px", md: "450px" },
                    display: "flex",
                    height: "50px",
                    // marginRight: "40px",
                  }}
                  onClick={logOut}
                  variant="contained"
                // color="#ff0000"
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "15px", sm: "20px", md: "23px" },
                      color: "white",
                      display: "flex",
                      fontFamily: " League Spartan, sans-serif",
                      textAlign: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "5px",
                    }}
                  >
                    Scan Qr or Tap to Check In
                  </Typography>
                </Button>
              </Box>
              <br />
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} xs={6} sm={6}>
                  <Grid container>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      {/* <img
                        alt=""
                        style={{
                          justifyContent: "center",
                          height: "60px",
                          width: "60px",
                        }}
                        src={message}
                      /> */}


                      <Box
                        component="img"
                        sx={{
                          height: 60,
                          width: 60,
                          maxHeight: { xs: 40, sm: 60, md: 60 },
                          maxWidth: { xs: 40, sm: 60, md: 60 },
                        }}
                        alt=""
                        src={message} />
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8} marginTop={1}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: 18, sm: 20, md: 30 },
                          color: "black",
                          fontFamily: " League Spartan, sans-serif",
                        }}
                      >
                        {" "}
                        Invitee
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={6} md={6} xs={6} sm={6}>
                  <Grid container>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      {" "}
                      <a href={`/checkoutaction/${company}/${branch}`}>
                        {/* <img
                          alt=""
                          style={{
                            justifyContent: "center",
                            height: "60px",
                            width: "60px",
                          }}
                          src={exitdoor}
                       
                        /> */}
                        <Box
                          component="img"
                          sx={{
                            height: 60,
                            width: 60,
                            maxHeight: { xs: 40, sm: 60, md: 60 },
                            maxWidth: { xs: 40, sm: 60, md: 60 },
                          }}
                          alt=""
                          src={exitdoor} />
                      </a>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8} marginTop={1}>
                      {" "}
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: 18, sm: 20, md: 30 },
                          color: "black",
                          fontFamily: " League Spartan, sans-serif",
                        }}

                      >
                        {" "}
                        Check Out
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                  <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="error" onClick={handleCloseerr}>
                    ok
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openviewed}
                onClose={handleCloseviewed}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}
              >

                <GlobalStyles
                  styles={{
                    "@import":
                      "url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap')",
                    body: {
                      fontFamily: "League Spartan, sans-serif",
                    },
                  }}
                />
                <Box sx={{ padding: "20px" }}>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12} lg={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          alt=""
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: "400px",
                            width: "400px",
                            padding: "40px",
                          }}
                          src={newproj}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                      lg={6}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "27px",
                            color: "black",
                            fontFamily: " League Spartan, sans-serif",
                          }}
                        >
                          Check Out Action
                        </Typography>
                      </Box>
                      <br />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >


                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 550 }} aria-label="simple table">
                            <TableHead>
                              <TableRow sx={{
                                fontFamily: " League Spartan, sans-serif",
                                fontsize: "20px",
                                color: "white",
                                backgroundColor: " #008BFF ",
                              }}>
                                <TableCell sx={{
                                  fontFamily: " League Spartan, sans-serif",
                                  fontsize: "20px",
                                  color: "white",
                                }}>Sno</TableCell>
                                <TableCell sx={{
                                  fontFamily: " League Spartan, sans-serif",
                                  fontsize: "20px",
                                  color: "white",
                                }}>Date</TableCell>
                                <TableCell sx={{
                                  fontFamily: " League Spartan, sans-serif",
                                  fontsize: "20px",
                                  color: "white",
                                }} >Name</TableCell>
                                <TableCell sx={{
                                  fontFamily: " League Spartan, sans-serif",
                                  fontsize: "20px",
                                  color: "white",
                                }}>In Time</TableCell>
                                <TableCell sx={{
                                  fontFamily: " League Spartan, sans-serif",
                                  fontsize: "20px",
                                  color: "white",
                                }} >Check Out</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row) => (
                                <TableRow
                                  key={row.sno}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell component="th" scope="row">
                                    {row.sno}
                                  </TableCell>
                                  <TableCell >{row.date}</TableCell>
                                  <TableCell >{row.name}</TableCell>
                                  <TableCell >{row.intime}</TableCell>
                                  <TableCell >{
                                    <img
                                      onClick={handleClickOpenviewedout}
                                      alt=""
                                      style={{
                                        justifyContent: "center",
                                        height: "40px",
                                        width: "40px",
                                      }}
                                      src={logout}
                                    />}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grid>
                  </Grid>
                  <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseviewed}>
                      Close
                    </Button>
                  </DialogActions>
                </Box>

                {/* </Box> */}
              </Dialog>

              <Dialog
                open={openviewedout}
                onClose={handleClickOpenviewedout}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
              >

                <Grid container spacing={2}>
                  <Grid item lg={12} md={12}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "50px",
                        color: "black",
                        textAlign: "center",
                        alignitems: "center",
                        fontFamily: " League Spartan, sans-serif",
                      }}
                    >
                      Check Out Details
                    </Typography>
                  </Grid>

                  <Grid item lg={12} md={12}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "40px",
                        color: "black",
                        fontFamily: " League Spartan, sans-serif",
                        marginLeft: "15px",
                      }}
                    >
                      Bye{" "}
                      <img
                        style={{
                          marginRight: "3px",
                          height: "40px",
                          width: "40px",
                        }}
                        src={wave}
                      />{" "}
                      !
                    </Typography>
                  </Grid>
                  <br />
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sx={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        style={{
                          height: "200px",
                          width: "200px",
                          textAlign: "center",
                        }}
                        src={uploadconfetti}
                        alt=""
                      />{" "}
                    </Box>
                  </Grid>
                  <Grid item lg={1} md={1}></Grid>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    sx={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "30px",
                        color: "black",
                        textAlign: "center",
                        alignitems: "center",
                        fontFamily: " League Spartan, sans-serif",
                      }}
                    >
                      Check Out Successfully
                    </Typography>
                  </Grid>
                  {/* </Grid> */}
                  {/* </Grid> */}
                  <Grid item md={1}></Grid>
                  <Grid item lg={12} md={12}>
                    {/* <Footer /> */}
                    {
                      localStorage.length === 0 &&
                      <Footer />
                    }
                  </Grid>
                </Grid>
                <DialogActions>
                  <Button variant="contained" color="error" onClick={handleCloseviewedout}>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>

            </Box>
          </Grid>
        </Grid>
        <br />
        {
          localStorage.length === 0 &&
          <Footer />
        }

      </Box>
    </>
  );
}
export default Checkinvisitor;