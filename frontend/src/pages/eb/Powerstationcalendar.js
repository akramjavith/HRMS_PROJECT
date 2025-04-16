import React, { useState, useContext, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Headtitle from "../../components/Headtitle";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
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
import { userStyle } from "../../pageStyle";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";


moment.locale("en-GB");
const localizer = momentLocalizer(moment);
// Set Monday as the first day of the week for moment.js
moment.updateLocale("en", {
  week: {
    dow: 1, // Monday is the first day of the week
    doy: 7,
  },
});

export default function PowerStationCalendar() {

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



  const [powerstationArray, setPowerstationArray] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [openview, setOpenview] = useState(false);
  const [powerstationEdit, setPowerstationEdit] = useState({});

  const {
    pageName, setPageName, isAssignBranch, buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const accessbranch = isAssignBranch
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))


  useEffect(() => {
    fetchPowerstationAll();
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
  //get all data.
  const fetchPowerstationAll = async () => {
    setPageName(!pageName)
    try {
      let res_status = await axios.post(SERVICE.ALL_POWERSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      setPowerstationArray(
        res_status?.data?.powerstation?.map((t) => {
          const dateParts =
            t.status === "Postponed"
              ? t.postponddate.split("-")
              : t.date.split("-");

          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // Months are zero-based
          const day = parseInt(dateParts[2]);

          const start = new Date(year, month, day);
          const end = new Date(start);
          return {
            id: t._id,
            title: t.name,
            start: start,
            end: end,
          };
        })
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    let _id = e.id;

    try {
      let res = await axios.get(`${SERVICE.SINGLE_POWERTSTATION}/${_id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPowerstationEdit(res?.data?.spowerstation);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  return (
    <>
      <Headtitle title={"Power ShutDown CALENDAR"} />
      {/* <Typography sx={userStyle.HeaderText}>
        Power ShutDown Calendar View{" "}
      </Typography> */}
      <PageHeading
        title="Power ShutDown Calendar View"
        modulename="EB"
        submodulename="Power ShutDown"
        mainpagename="Power ShutDown Calendar"
        subpagename=""
        subsubpagename=""
      />
      <Calendar
        views={["agenda", "week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={powerstationArray}
        style={{ height: "100vh" }}
        onSelectEvent={(powerstationArray) => getviewCode(powerstationArray)}
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
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ padding: "30px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Power ShutDown List
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>
                    {powerstationEdit.company
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{powerstationEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Unit</Typography>
                  <Typography>{powerstationEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{powerstationEdit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Date</Typography>
                  <Typography>
                    {powerstationEdit.date
                      ? new Date(powerstationEdit.date).toLocaleDateString(
                        "en-GB"
                      )
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> From Time</Typography>
                  <Typography>{powerstationEdit.fromtime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> To Time</Typography>
                  <Typography>{powerstationEdit.totime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Total Time</Typography>
                  <Typography>{powerstationEdit.totaltime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Power Shutdown Type</Typography>
                  <Typography>{powerstationEdit.powershutdowntype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Message Received From</Typography>
                  <Typography>
                    {powerstationEdit.messagereceivedfrom}
                  </Typography>
                </FormControl>
              </Grid>
              {powerstationEdit.messagereceivedfrom === "Person" && (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Person Name</Typography>
                    <Typography>{powerstationEdit.personname}</Typography>
                  </FormControl>
                </Grid>
              )}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reason</Typography>
                  <Typography>{powerstationEdit.reason}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Description</Typography>
                  <Typography>{powerstationEdit.description}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Reminder</Typography>
                  <Typography>{powerstationEdit.noofdays}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Status</Typography>
                  <Typography>{powerstationEdit.status}</Typography>
                </FormControl>
              </Grid>
              {powerstationEdit.status === "Canceled" && (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Cancel Reason</Typography>
                    <Typography>{powerstationEdit.cancelreason}</Typography>
                  </FormControl>
                </Grid>
              )}
              {powerstationEdit.status === "Postponed" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Postponed Date</Typography>
                      <Typography>
                        {moment(powerstationEdit.postponddate).format(
                          "DD-MM-YYYY"
                        )}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Postponed From Time</Typography>
                      <Typography>
                        {powerstationEdit.postpondfromtime}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Postponed To Time</Typography>
                      <Typography>{powerstationEdit.postpondtotime}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Postponed Total Time</Typography>
                      <Typography>
                        {powerstationEdit.postpondtotaltime}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
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