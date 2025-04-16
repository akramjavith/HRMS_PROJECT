import React, { useState, useContext, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Headtitle from "../../../components/Headtitle";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext } from "../../../context/Appcontext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import PageHeading from "../../../components/PageHeading";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
// Set Monday as the first day of the week for moment.js
moment.updateLocale("en", {
  week: {
    dow: 1, // Monday is the first day of the week
    doy: 7,
  },
});

export default function EventsCalendar() {
  const { auth } = useContext(AuthContext);
  const [eventArray, setEventArray] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [openview, setOpenview] = useState(false);
  const [eventEdit, setEventEdit] = useState([]);
  const { isUserRoleAccess,isAssignBranch, pageName, setPageName, } = useContext(UserRoleAccessContext);
  useEffect(() => {
    fetchEventsAll();
  }, []);

  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

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
  //get all data.
  const fetchEventsAll = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(SERVICE.ALL_EVENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      if (isUserRoleAccess.role.includes("Manager")) {
        setEventArray(
          res_status?.data?.scheduleevent?.map((t) => {
            const dateParts = t.date.split("-");
            const timeParts = t.time.split(":");
            const durationParts = t.duration.split(":");

            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1; // Months are zero-based
            const day = parseInt(dateParts[2]);
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const durationHours = parseInt(durationParts[0]);
            const durationMinutes = parseInt(durationParts[1]);

            const start = new Date(year, month, day, hours, minutes, 0);
            const end = new Date(start);
            end.setHours(end.getHours() + durationHours);
            end.setMinutes(end.getMinutes() + durationMinutes);
            return {
              id: t._id,
              title: t.eventname,
              start: start,
              end: end,
            };
          })
        );
      } else {
        setEventArray(
          res_status?.data?.scheduleevent
            ?.filter(
              (event) =>
                event.company.includes(isUserRoleAccess.company) &&
                event.branch.includes(isUserRoleAccess.branch) &&
                event.unit.includes(isUserRoleAccess.unit) &&
                event.team.includes(isUserRoleAccess.team) &&
                (event.participants.includes(isUserRoleAccess.companyname) ||
                  event.participants.includes("ALL"))
            )
            ?.map((t) => {
              const dateParts = t.date.split("-");
              const timeParts = t.time.split(":");
              const durationParts = t.duration.split(":");

              const year = parseInt(dateParts[0]);
              const month = parseInt(dateParts[1]) - 1; // Months are zero-based
              const day = parseInt(dateParts[2]);
              const hours = parseInt(timeParts[0]);
              const minutes = parseInt(timeParts[1]);
              const durationHours = parseInt(durationParts[0]);
              const durationMinutes = parseInt(durationParts[1]);

              const start = new Date(year, month, day, hours, minutes, 0);
              const end = new Date(start);
              end.setHours(end.getHours() + durationHours);
              end.setMinutes(end.getMinutes() + durationMinutes);
              return {
                id: t._id,
                title: t.eventname,
                start: start,
                end: end,
              };
            })
        );
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    let _id = e.id;
    try {
      let res = await axios.get(`${SERVICE.SINGLE_EVENT}/${_id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEventEdit(res?.data?.sscheduleevent);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  return (
    <>
      <Headtitle title={"EVENTS CALENDAR"} />
      <PageHeading
        title="Events Calendar View"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Events"
        subpagename="Event Calendar View"
        subsubpagename=""
      />
      <Calendar
        views={["agenda", "day", "week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventArray}
        style={{ height: "100vh" }}
        onSelectEvent={(eventArray) => getviewCode(eventArray)}
      />
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
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Event Details
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Event Name</Typography>
                  <Typography>{eventEdit.eventname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Event Description</Typography>
                  <Typography>{eventEdit.eventdescription}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(eventEdit.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time</Typography>
                  <Typography>{eventEdit.time}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Duration</Typography>
                  <Typography>{eventEdit.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{eventEdit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reminder</Typography>
                  <Typography>{eventEdit.reminder}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Participants</Typography>
                  <Typography>
                    {eventEdit.participants
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
    </>
  );
}