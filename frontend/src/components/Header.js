import React, { useState, useEffect, useContext, useRef } from "react";
import Navbar from "./Navbar";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Button,
} from "@mui/material";
import { handleApiError } from "./Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH } from "../services/Authservice";
import Logoimg from "../images/logo192.png";
import Navbarnew from "../components/Navnew";
import { useLoading } from "./ApiStatusContext";
import { SERVICE } from "../services/Baseservice";

const Header = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const currentUrl = window?.location?.href;
  const passupdateStatus = currentUrl?.split('/')?.pop();

  const { isUserRoleAccess, isAssignBranch, listPageAccessMode, buttonStyles } =
    useContext(UserRoleAccessContext);
  const [widthsize, setWidthsize] = useState("");
  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Human Resources" &&
        data.submodulename === "HR" &&
        data.mainpagename === "Employee" &&
        data.subpagename === "Notice Period" &&
        data.subsubpagename === "Notice Period List Hierarchy"
    )?.listpageaccessmode || "Overall";
  const backPage = useNavigate();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [autoLogoutSwitch, setAutoLogoutSwitch] = useState("");
  const [autoLogoutMins, setAutoLogoutMins] = useState("");
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  //AUTO LOGOUT IF USER INACTIVE
  useEffect(() => {
    fetchAutoLogout();
    fetchOverAllSettings();
  }, []);
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const [overallSettings, setOverAllsettingsCount] = useState({});

  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverAllsettingsCount(res?.data?.overallsettings[0]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchAutoLogout = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_AUTOLOGOUT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let singleData = res?.data?.autologout[
        res?.data?.autologout.length - 1
      ]?.todos?.find((item) => item?.employeedbid === isUserRoleAccess?._id);

      if (singleData !== undefined) {
        setAutoLogoutMins(singleData?.autologoutmins);
        setAutoLogoutSwitch(singleData?.autologoutswitch);
      } else {
        setAutoLogoutMins(
          res?.data?.autologout[res?.data?.autologout.length - 1]
            ?.autologoutmins
        );
        setAutoLogoutSwitch(
          res?.data?.autologout[res?.data?.autologout.length - 1]
            ?.autologoutswitch
        );
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const inactivityTimeout = autoLogoutMins * 60 * 1000;
  let inactivityTimer;
  const { loading } = useLoading();

  const handleUserActivity = () => {
    // Log the current loading state for debugging

    // Clear the previous timer on user activity
    clearTimeout(inactivityTimer);

    // Only restart the timer if the app is not loading
    if (!loading) {
      inactivityTimer = setTimeout(logOut, inactivityTimeout);
    } else {
    }
  };

  useEffect(() => {
    const startAutoLogout = () => {
      if (autoLogoutSwitch) {
        // Attach event listeners to detect user activity
        window.addEventListener("mousemove", handleUserActivity);
        window.addEventListener("keydown", handleUserActivity);

        // If not loading, start the inactivity timer
        if (!loading) {
          inactivityTimer = setTimeout(logOut, inactivityTimeout);
        }
      }
    };

    const stopAutoLogout = () => {
      // Remove the event listeners
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);

      // Clear any existing inactivity timer
      clearTimeout(inactivityTimer);
    };

    startAutoLogout();

    // Cleanup function
    return () => {
      stopAutoLogout();
    };
  }, [autoLogoutSwitch, autoLogoutMins, loading]);
  // const handleUserActivity = () => {
  //   clearTimeout(inactivityTimer);
  //   inactivityTimer = setTimeout(logOut, inactivityTimeout);
  // };
  // useEffect(() => {
  //   const startAutoLogout = () => {
  //     if (autoLogoutSwitch) {
  //       window.addEventListener("mousemove", handleUserActivity);
  //       window.addEventListener("keydown", handleUserActivity);
  //       inactivityTimer = setTimeout(logOut, inactivityTimeout);
  //     }
  //   };

  //   const stopAutoLogout = () => {
  //     window.removeEventListener("mousemove", handleUserActivity);
  //     window.removeEventListener("keydown", handleUserActivity);
  //     clearTimeout(inactivityTimer);
  //   };

  //   startAutoLogout();

  //   return () => {
  //     stopAutoLogout();
  //   };
  // }, [autoLogoutSwitch, autoLogoutMins]);

  const updateIdleEndTime = async () => {
    await axios.post(SERVICE.USER_IDLETIME_UPDATE_ENDTIME, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      userId: localStorage.LoginUserId,
      endTime: new Date(),
    });
  }

  //get all project.
  const logOut = async () => {
    try {
      await axios.get(AUTH.LOGOUT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      //change login state
      updateIdleEndTime();
      backPage("/signin");
      setAuth({ ...auth, loginState: false });
      localStorage.clear();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const headerRef = useRef(null); // Ref for the header
  const [headerHeight, setHeaderHeight] = useState(0); // State to store the header height

  // Effect to set the height of the header when it changes
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight); // Get the header height
    }

    // Update the height on window resize to ensure responsiveness
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const shapeStyles = {
    Circular: {
      borderRadius: '50%',
      width: '60px',
      height: '60px',
    },
    Square: {
      borderRadius: '0%',
      width: '100px',
      height: '60px',
    },
    roundedSquare: {
      borderRadius: '15px',
      width: '100px',
      height: '60px',
    },
    rectangleVertical: {
      borderRadius: '5px',
      width: '100px',
      height: '60px',
    },
    Hexagonal: {
      clipPath: 'polygon(25% 5%, 75% 5%, 95% 50%, 75% 95%, 25% 95%, 5% 50%)',
      width: '100px',
      height: '60px',
    }
  };

  const normalizeShape = (shape) => {
    switch (shape) {
      case "Rectangle":
        return "rectangleVertical";
      case "Rounded Square":
        return "roundedSquare";
      default:
        return shape;  // Direct match for Circular, Square, or Hexagonal
    }
  };

  const companyLogoShape = normalizeShape(overallSettings?.companylogoshape);

  return (
    <div>
      <header
        ref={headerRef}
        style={{
          position: "fixed", // Fixes the navbar at the top
          top: 0, // Ensures it stays at the top
          width: "100%", // Make sure the navbar takes the full width
          zIndex: 1500, // Keep it above other elements
          // border: "1px solid green",
          boxSizing: "border-box",
          // overflow: "hidden",
          // height: "70px",
          ...buttonStyles.navbar,
        }}
      >
        <div className="nav-area">
          <div className="nav-arealeft">
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Link to="/dashboard">
                <Grid container spacing={0.5} sx={{ display: "flex" }}>
                  <Grid
                    item
                  // sx={{ textAlign: "center" }}
                  >
                    <img
                      src={Logoimg}
                      alt="Company Logo"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                        // ...buttonStyles.companylogo,
                        // ...shapeStyles[companyLogoShape],
                        // borderRadius: "20%", // Makes the image circular
                        // border: "1px solid #ccc", // Optional: border around the image
                      }}
                    />
                  </Grid>
                </Grid>
              </Link>
            </Box>
          </div>
          {passupdateStatus === "passupdate" ? "" : <Navbar />}
          <div className="nav-arearight">
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Link to="/dashboard">
                <Grid container spacing={0.5} sx={{ display: "flex" }}>
                  <Grid
                    item
                  // sx={{ textAlign: "center" }}
                  >
                    {overallSettings?.companylogo && (
                      <img
                        src={overallSettings?.companylogo}
                        alt="Company Logo"
                        style={{
                          width: "80px",
                          height: "60px",
                          objectFit: "contain",
                          ...buttonStyles.companylogo,
                          ...shapeStyles[companyLogoShape],
                          // borderRadius: "20%", // Makes the image circular
                          // border: "1px solid #ccc", // Optional: border around the image
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Link>
            </Box>
          </div>
        </div>
      </header>
      <Navbarnew headerHeight={headerHeight} />
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default Header;
