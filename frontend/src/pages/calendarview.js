import React, { useState, useContext, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Headtitle from "../components/Headtitle";
import { SERVICE } from "../services/Baseservice";
import { AuthContext } from "../context/Appcontext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, Grid, Link, Typography } from "@mui/material";
import { userStyle } from "../pageStyle";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
// Set Monday as the first day of the week for moment.js
moment.updateLocale("en", {
  week: {
    dow: 1, // Monday is the first day of the week
    doy: 7,
  },
});

export default function CalendarView() {
  const { auth } = useContext(AuthContext);
  const [birthdayArray, setBirthdayArray] = useState([]);
  const [workAnniversaryArray, setWorkAnniversaryArray] = useState([]);
  const [weddingAnniversaryArray, setWeddingAnniversaryArray] = useState([]);
  const [singleView, setSingleView] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [openview, setOpenview] = useState(false);

  useEffect(() => {
    fetchBirthdayAll();
    fetchWorkAnniversaryAll();
    fetchWeddingAnniversaryAll();
  }, []);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor;

    if (birthdayArray.includes(event)) {
      backgroundColor = "blue";
    } else if (workAnniversaryArray.includes(event)) {
      backgroundColor = "green";
    } else if (weddingAnniversaryArray.includes(event)) {
      backgroundColor = "purple";
    }

    return { style: { backgroundColor } };
  };

  const allEvents = [...birthdayArray, ...workAnniversaryArray, ...weddingAnniversaryArray];
  //get all birthday data.
  const fetchBirthdayAll = async () => {
    try {
      let res_status = await axios.get(SERVICE.GET_ALL_DOB, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBirthdayArray(
        res_status?.data?.userbirthday?.map((t) => {
          const dateParts = t.dob.split("-");

          const year = parseInt(dateParts[2]);
          const month = parseInt(dateParts[0]) - 1; // Months are zero-based
          const day = parseInt(dateParts[1]);

          const start = new Date(year, month, day);
          const end = new Date(start);
          return {
            id: t._id,
            title: t.companyname,
            start: start,
            end: end,
            eventname: "Birthday",
          };
        })
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
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
  const fetchWorkAnniversaryAll = async () => {
    try {
      let res_status = await axios.get(SERVICE.GET_ALL_DOJ, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setWorkAnniversaryArray(
        res_status?.data?.userdateofjoining?.map((t) => {
          const dateParts = t.doj.split("-");

          const year = parseInt(dateParts[2]);
          const month = parseInt(dateParts[0]) - 1; // Months are zero-based
          const day = parseInt(dateParts[1]);

          const start = new Date(year, month, day);
          const end = new Date(start);
          return {
            id: t._id,
            title: t.companyname,
            start: start,
            end: end,
            eventname: "Work Anniversary",
          };
        })
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
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
  const fetchWeddingAnniversaryAll = async () => {
    try {
      let res_status = await axios.get(SERVICE.GET_ALL_DOM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setWeddingAnniversaryArray(
        res_status?.data?.userdateofmarriage?.map((t) => {
          const dateParts = t.dom.split("-");

          const year = parseInt(dateParts[2]);
          const month = parseInt(dateParts[0]) - 1; // Months are zero-based
          const day = parseInt(dateParts[1]);

          const start = new Date(year, month, day);
          const end = new Date(start);
          return {
            id: t._id,
            title: t.companyname,
            start: start,
            end: end,
            eventname: "Wedding Anniversary",
          };
        })
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
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

  return (
    <>
      <Headtitle title={"CALENDAR VIEW"} />
      {/* <Typography sx={userStyle.HeaderText}>Birthday Calendar View </Typography> */}
      <Calendar
        views={["agenda", "day", "week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={allEvents}
        style={{ height: "100vh" }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(allEvents) => {
          setSingleView(allEvents);
          handleClickOpenview();
        }}
      />
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm">
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> {singleView.eventname}</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>{singleView.title}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
    </>
  );
}
