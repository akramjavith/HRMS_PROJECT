import React, { useState, useContext, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Headtitle from "../../../components/Headtitle";
import { handleApiError } from "../../../components/Errorhandling";
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from "../../../context/Appcontext";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, Grid, Typography, } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
// Set Monday as the first day of the week for moment.js
moment.updateLocale("en", {
  week: {
    dow: 1, // Monday is the first day of the week
    doy: 7,
  },
});

export default function HolidayCalendar() {
  const pathname = window.location.pathname;
  const { auth } = useContext(AuthContext);
  const [holidayArray, setHolidayArray] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [openview, setOpenview] = useState(false);
  const [holidayEdit, setHolidayEdit] = useState([]);
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
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("HolidayCalendar View"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  }

  useEffect(() => {
    getapi();
  }, []);

  useEffect(() => {
    fetchHolidayAll();
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
  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];

        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));


  //get all data.
  const fetchHolidayAll = async () => {
    setPageName(!pageName);

    try {
      let res_status = await axios.post(SERVICE.ALL_HOLIDAY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      const result = res_status?.data?.holiday.filter((data, index) => {
        if (
          data.employee.includes("ALL") &&
          data.company.includes(isUserRoleAccess.company) &&
          data.applicablefor.includes(isUserRoleAccess.branch) &&
          data.unit.includes(isUserRoleAccess.unit) &&
          data.team.includes(isUserRoleAccess.team)
        ) {
          return (
            data.company.includes(isUserRoleAccess.company) &&
            data.applicablefor.includes(isUserRoleAccess.branch) &&
            data.unit.includes(isUserRoleAccess.unit) &&
            data.team.includes(isUserRoleAccess.team)
          );
        } else {
          return (
            data.company.includes(isUserRoleAccess.company) &&
            data.applicablefor.includes(isUserRoleAccess.branch) &&
            data.unit.includes(isUserRoleAccess.unit) &&
            data.team.includes(isUserRoleAccess.team) &&
            data.employee.includes(isUserRoleAccess.companyname)
          );
        }
      });

      const resdata = isUserRoleAccess.role.includes("Manager")
        ? res_status?.data?.holiday?.map((t) => {
          const dateParts = t.date.split("-");
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1;
          const day = parseInt(dateParts[2]);

          const start = new Date(year, month, day);
          const end = new Date(start);

          return {
            id: t._id,
            title: t.name,
            start: start,
            end: end,
          };
        }) || []
        : result?.map((t) => {
          const dateParts = t.date.split("-");
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1;
          const day = parseInt(dateParts[2]);

          const start = new Date(year, month, day);
          const end = new Date(start);

          return {
            id: t._id,
            title: t.name,
            start: start,
            end: end,
          };
        }) || [];
      setHolidayArray(resdata);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    let _id = e.id;
    try {
      let res = await axios.get(`${SERVICE.SINGLE_HOLIDAY}/${_id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setHolidayEdit(res?.data?.sholiday);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  return (
    <>
      <Headtitle title={"HOLIDAY CALENDAR"} />
      <PageHeading
        title="Holiday Calendar View "
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Holiday"
        subpagename="HolidayCalendar View"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lholidaycalendarview") && (
        <Calendar
          views={["agenda", "week", "month"]}
          selectable
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={holidayArray}
          style={{ height: "100vh" }}
          onSelectEvent={(holidayArray) => getviewCode(holidayArray)}
        />
      )}
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
              View Holiday Calendar
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{holidayEdit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Date</Typography>
                  <Typography>
                    {moment(holidayEdit.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee</Typography>
                  <Typography>
                    {holidayEdit.employee
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Description</Typography>
                  <Typography>{holidayEdit.description}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Reminder</Typography>
                  <Typography>{holidayEdit.noofdays}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* VALIDATION */}
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      {/* SUCCESS */}
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
    </>
  );
}