import {
  Box,
  Button,
  FormControl,
  Grid,
  OutlinedInput,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import Selects from "react-select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = ({ loading, message }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      open={loading}
    >
      <div style={{ textAlign: "center" }}>
        <CircularProgress sx={{ color: "#edf1f7" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#edf1f7" }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};

function LDAPsetting() {
  const [loading, setLoading] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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

  const [ldapurl, setLdapUrl] = useState("");
  const [cnname, setCnName] = useState("");
  const [cnnametwo, setCnNametwo] = useState("");
  const [dcnameone, setDCNameOne] = useState("");
  const [dcnametwo, setDCNameTwo] = useState("");
  const [ldappassword, setLdapPassword] = useState("");

  const [userAccessControl, setUserAccessControl] = useState(
    "Please Select User Account Control"
  );
  const [userAccessControlLabel, setUserAccessControlLabel] = useState(
    "Please Select User Account Control"
  );

  const userControlOptions = [
    { label: "Normal account + Password Required", value: "512" },
    { label: "Normal account + Password Not Required", value: "544" },
    { label: "Password never expires", value: "66048" },
  ];

  const [organizationalId, setOrganizationalId] = useState();
  const [organizationalCount, setOrganizationalCount] = useState(0);

  useEffect(() => {
    setCheckConnection(true);
  }, [ldapurl, cnname, cnnametwo, dcnameone, dcnametwo, ldappassword]);

  const [prioritymasterEdit, setPrioritymasterEdit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [isButton, setIsButton] = useState(false);

  useEffect(() => {
    fetchAllNotificationSounds();
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Settings/LDAP Setting"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const fetchAllNotificationSounds = async () => {
    setLoading(true);
    try {
      console.time("start");
      let response = await axios.get(SERVICE.ALL_LDAPSETTING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      console.timeEnd("start");
      setOrganizationalCount(response?.data?.count);
      const singleData =
        response?.data?.ldapsetting[response?.data?.ldapsetting?.length - 1];
      setOrganizationalId(singleData);
      setLdapUrl(singleData ? singleData?.ldapurl : "");
      setCnName(singleData ? singleData?.cnname : "");
      setCnNametwo(singleData ? singleData?.cnnametwo : "");
      setDCNameOne(singleData ? singleData?.dcnameone : "");
      setDCNameTwo(singleData ? singleData?.dcnametwo : "");
      setLdapPassword(singleData ? singleData?.ldappassword : "");
      setUserAccessControl(
        singleData
          ? singleData?.useraccountcontrol
          : "Please Select User Account Control"
      );
      let filteredData = userControlOptions?.find((item) => {
        return item?.value === singleData?.useraccountcontrol;
      });
      setUserAccessControlLabel(
        filteredData?.label ?? "Please Select User Account Control"
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  console.log(cnnametwo);
  const [checkConnection, setCheckConnection] = useState(false);
  //submit option for saving
  const handleCheckconnection = (e) => {
    e.preventDefault();
    if (ldapurl === "" || ldapurl === undefined) {
      setPopupContentMalert("Please Enter LDAP URL");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (cnname === "" || cnname === undefined) {
      setPopupContentMalert("Please Enter CN");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (cnnametwo === "" || cnnametwo === undefined) {
      setPopupContentMalert("Please Enter CN");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (dcnameone === "" || dcnameone === undefined) {
      setPopupContentMalert("Please Enter DC");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (dcnametwo === "" || dcnametwo === undefined) {
      setPopupContentMalert("Please Enter DC");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ldappassword === "" || ldappassword === undefined) {
      setPopupContentMalert("Please Enter Password");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      !userAccessControl ||
      userAccessControl === "Please Select User Account Control"
    ) {
      setPopupContentMalert("Please Select User Account Control");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      ConnectionCheckSendRequest();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ldapurl === "" || ldapurl === undefined) {
      setPopupContentMalert("Please Enter LDAP URL");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (cnname === "" || cnname === undefined) {
      setPopupContentMalert("Please Enter CN");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (cnnametwo === "" || cnnametwo === undefined) {
      setPopupContentMalert("Please Enter CN");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (dcnameone === "" || dcnameone === undefined) {
      setPopupContentMalert("Please Enter DC");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (dcnametwo === "" || dcnametwo === undefined) {
      setPopupContentMalert("Please Enter DC");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ldappassword === "" || ldappassword === undefined) {
      setPopupContentMalert("Please Enter Password");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      !userAccessControl ||
      userAccessControl === "Please Select User Account Control"
    ) {
      setPopupContentMalert("Please Select User Account Control");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (checkConnection) {
      setPopupContentMalert("Please Check Connection");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (organizationalCount === 0) {
        sendRequest();
      } else {
        sendEditRequest();
      }
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setLdapUrl("");
    setCnName("");
    setCnNametwo("");
    setDCNameOne("");
    setDCNameTwo("");
    setLdapPassword("");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Project updateby edit page...
  let updateby = prioritymasterEdit?.updatedby;
  let addedby = prioritymasterEdit?.addedby;

  let subprojectsid = prioritymasterEdit?._id;

  //Submiting the single data...
  const sendRequest = async () => {
    setIsButton(true);
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.CREATE_LDAPSETTING}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        ldapurl: ldapurl,
        cnname: cnname,
        cnnametwo: cnnametwo,
        dcnameone: dcnameone,
        dcnametwo: dcnametwo,
        ldappassword: ldappassword,
        useraccountcontrol: userAccessControl,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsButton(false);
    } catch (err) {
      setIsButton(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [checkLoad, setCheckLoad] = useState(false);
  //Submiting the single data...
  const ConnectionCheckSendRequest = async () => {
    setIsButton(true);
    setCheckLoad(true);
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.LDAPSETTING_CHECKCONNECTION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        ldapurl: ldapurl,
        cnname: cnname,
        cnnametwo: cnnametwo,
        dcnameone: dcnameone,
        dcnametwo: dcnametwo,
        ldappassword: ldappassword,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      setPopupContent("Connected to LDAP successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setCheckConnection(false);
      setIsButton(false);
      setCheckLoad(false);
    } catch (err) {
      console.log(err);
      setCheckLoad(false);
      setIsButton(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //Submiting the single data...
  const sendEditRequest = async () => {
    setIsButton(true);
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.LDAPSETTING_SINGLE}/${organizationalId?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ldapurl: ldapurl,
          cnname: cnname,
          cnnametwo: cnnametwo,
          dcnameone: dcnameone,
          dcnametwo: dcnametwo,
          ldappassword: ldappassword,
          useraccountcontrol: userAccessControl,
        }
      );

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsButton(false);
    } catch (err) {
      setIsButton(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box>
      <Headtitle title={"LDAP Setting"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="LDAP Setting"
        modulename="Settings"
        submodulename="LDAP Setting"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {/* {isUserRoleCompare?.includes("aldapsetting") && ( */}
      <Box sx={userStyle.dialogbox}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                LDAP Settings
              </Typography>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  LDAP URL <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter LDAP URL"
                  value={ldapurl}
                  onChange={(e) => {
                    setLdapUrl(e.target.value);
                  }}
                />
              </FormControl>
              <Typography>
                Sample Format - url : <strong>"ldap://($servername)"</strong>
              </Typography>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  CN <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter CN"
                  value={cnname}
                  onChange={(e) => {
                    setCnName(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  CN <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter CN"
                  value={cnnametwo}
                  onChange={(e) => {
                    setCnNametwo(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}></Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Password <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type={showPassword ? "text" : "password"}
                  placeholder="Please Enter Password"
                  value={ldappassword}
                  onChange={(e) => {
                    setLdapPassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  DC <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter DC"
                  value={dcnameone}
                  onChange={(e) => {
                    setDCNameOne(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  DC <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter DC"
                  value={dcnametwo}
                  onChange={(e) => {
                    setDCNameTwo(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl size="small" fullWidth>
                <Typography>
                  User Account Control <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={userControlOptions}
                  value={{
                    label: userAccessControlLabel,
                    value: userAccessControl,
                  }}
                  onChange={(e) => {
                    setUserAccessControl(e.value);
                    setUserAccessControlLabel(e.label);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <Typography>&nbsp;</Typography>
              <LoadingButton
                loading={checkLoad}
                variant="contained"
                onClick={handleCheckconnection}
              >
                Check Connection
              </LoadingButton>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid
            item
            md={12}
            xs={12}
            sm={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isButton}
              sx={buttonStyles.buttonsubmit}
            >
              Update
            </Button>
            &nbsp; &nbsp;
            <Button sx={buttonStyles.btncancel} onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </>
      </Box>
      {/* )} */}

      {/* EXTERNAL COMPONENTS -------------- START */}
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
      <Loader loading={loading} message={"Please Wait"} />
    </Box>
  );
}

export default LDAPsetting;
