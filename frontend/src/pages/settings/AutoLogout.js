import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import React, { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import "react-image-crop/dist/ReactCrop.css";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PageHeading from "../../components/PageHeading";

function AutoLogout() {
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
  const { isUserRoleCompare, allUsersData, allTeam, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
  const [overAllsettingsCount, setOverAllsettingsCount] = useState();
  const [overAllsettingsID, setOverAllsettingsID] = useState();
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);
  const [allData, setAllData] = useState({
    //
    autologoutswitch: false,
    autologoutmins: "",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  const [allTodo, setAllTodo] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState("");
  const [singleTodo, setSingleTodo] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    employeename: "Please Select Employee Name",
    employeedbid: "",
    autologoutswitch: false,
    autologoutmins: "",
  });
  const addTodo = () => {
    const isNameMatch = allTodo?.some(
      (item) =>
        item.company === singleTodo.company &&
        item.branch === singleTodo.branch &&
        item.unit === singleTodo.unit &&
        item.team === singleTodo.team &&
        item.employeename === singleTodo.employeename &&
        item.employeedbid === singleTodo.employeedbid
    );
    if (singleTodo.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleTodo.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleTodo.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleTodo.team === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    } else if (singleTodo.employeename === "Please Select Employee Name") {
      setPopupContentMalert("Please Select Employee");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    } else if (
      autoLogoutSwitchTodo &&
      (singleTodo.autologoutmins === "" ||
        Number(singleTodo.autologoutmins) <= 0)
    ) {
      setPopupContentMalert("Please Enter Auto Logout Mins");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    } else if (isNameMatch) {
      setPopupContentMalert("Employee already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleTodo !== "") {
      const data = {
        company: singleTodo?.company,
        branch: singleTodo?.branch,
        unit: singleTodo?.unit,
        team: singleTodo?.team,
        employeename: singleTodo?.employeename,
        employeedbid: singleTodo?.employeedbid,
        autologoutswitch: autoLogoutSwitchTodo,
        autologoutmins: singleTodo?.autologoutmins,
      };
      setAllTodo([...allTodo, data]);
      setSingleTodo({
        ...singleTodo,
        employeename: "Please Select Employee Name",
        employeedbid: "",
        autologoutmins: "",
      });
      setAutoLogoutSwitchTodo(false);
    }
  };
  const deleteTodo = (index) => {
    const newTasks = [...allTodo];
    newTasks.splice(index, 1);
    setAllTodo(newTasks);
    handleCloseMod();
  };
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };
  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };
  const reduceOptions = [
    { label: "Half Day", value: "Half Day" },
    { label: "Full Day", value: "Full Day" },
  ];
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const fetchOverAllSettings = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
      : [];

    setPageName(!pageName)
    try {
      let res = await axios.post(`${SERVICE.GET_AUTOLOGOUTASSIGNBRANCH}`, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoading(true);
      if (res?.data?.count === 0) {
        setOverAllsettingsCount(res?.data?.count);
      } else {
        const lastObject =
          res?.data?.autologout[res?.data?.autologout.length - 1];
        const lastObjectId = lastObject._id;
        setOverAllsettingsID(lastObjectId);
        setAllData(res?.data?.autologout[res?.data?.autologout.length - 1]);
        setAllTodo(
          res?.data?.autologout[res?.data?.autologout.length - 1]?.todos
        );
        setAutoLogoutSwitch(
          res?.data?.autologout[res?.data?.autologout.length - 1]
            ?.autologoutswitch
        );
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchOverAllSettings();
    generateHrsOptions();
    generateMinsOptions();
  }, []);
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.post(`${SERVICE.CREATE_AUTOLOGOUT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        autologoutswitch: Boolean(autoLogoutSwitch),
        autologoutmins: String(autoLogoutSwitch ? allData?.autologoutmins : ""),
        //
        todos: [...allTodo],
      });
      await fetchOverAllSettings();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_AUTOLOGOUT}/${overAllsettingsID}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          autologoutswitch: Boolean(autoLogoutSwitch),
          autologoutmins: String(
            autoLogoutSwitch ? allData?.autologoutmins : ""
          ),
          //
          todos: [...allTodo],
        }
      );
      await fetchOverAllSettings();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      autoLogoutSwitch &&
      (allData?.autologoutmins === "" || Number(allData?.autologoutmins) <= 0)
    ) {
      setPopupContentMalert("Please Enter Auto Logout Mins!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (overAllsettingsCount === 0) {
      sendRequest();
    } else {
      sendEditRequest();
    }
  };
  const [autoLogoutSwitch, setAutoLogoutSwitch] = useState();
  const handleAutoLogoutSwitchChange = (e) => {
    setAutoLogoutSwitch(e.target.checked);
    if (!e.target.checked) {
      setAllData({
        ...allData,
        autologoutmins: "",
      });
    }
  };
  const [autoLogoutSwitchTodo, setAutoLogoutSwitchTodo] = useState(false);
  const handleAutoLogoutSwitchChangeTodo = (e) => {
    setAutoLogoutSwitchTodo(e.target.checked);
    if (!e.target.checked) {
      setSingleTodo({
        ...singleTodo,
        autologoutmins: "",
      });
    }
  };
  return (
    <Box>
      <Headtitle title={"AUTOLOGOUT UPDATE"} />
      <PageHeading
        title="Manage Auto Logout Update"
        modulename="Settings"
        submodulename="Auto Logout Update"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "350px",
            }}
          >
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#1976d2"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={userStyle.container}>
          {isUserRoleCompare?.includes("aautologoutupdate") && (
            <form onSubmit={handleSubmit}>
              <Typography sx={userStyle.SubHeaderText}>
                Auto Logout Update
              </Typography>
              <br />
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Grid item md={10} sm={12}>
                    <FormControl size="small" fullWidth>
                      <FormGroup>
                        <FormControlLabel
                          label="Enable Auto Logout"
                          control={
                            <Switch
                              checked={autoLogoutSwitch}
                              onChange={handleAutoLogoutSwitchChange}
                            />
                          }
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Auto Logout (Mins)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      placeholder="Please Enter Auto Logout in Mins"
                      value={allData?.autologoutmins}
                      onChange={(e) => {
                        if (autoLogoutSwitch) {
                          const enteredValue = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 3);
                          if (
                            enteredValue === "" ||
                            /^\d+$/.test(enteredValue)
                          ) {
                            setAllData({
                              ...allData,
                              autologoutmins: enteredValue,
                            });
                          }
                        }
                      }}
                      disabled={!autoLogoutSwitch}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}></Grid>
                {/* Todo  */}
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Company"
                      value={{
                        label:
                          singleTodo.company === ""
                            ? "Please Select Company"
                            : singleTodo.company,
                        value:
                          singleTodo.company === ""
                            ? "Please Select Company"
                            : singleTodo.company,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          employeename: "Please Select Employee Name",
                          employeedbid: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.filter(
                        (comp) =>
                          singleTodo.company === comp.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Branch"
                      value={{
                        label:
                          singleTodo.branch === ""
                            ? "Please Select Branch"
                            : singleTodo.branch,
                        value:
                          singleTodo.branch === ""
                            ? "Please Select Branch"
                            : singleTodo.branch,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          employeename: "Please Select Employee Name",
                          employeedbid: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.filter(
                        (comp) =>
                          singleTodo.company === comp.company && singleTodo.branch === comp.branch
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Unit"
                      value={{
                        label:
                          singleTodo.unit === ""
                            ? "Please Select Unit"
                            : singleTodo.unit,
                        value:
                          singleTodo.unit === ""
                            ? "Please Select Unit"
                            : singleTodo.unit,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          unit: e.value,
                          team: "Please Select Team",
                          employeename: "Please Select Employee Name",
                          employeedbid: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={allTeam
                        ?.filter((u) => singleTodo.company === u.company && singleTodo.branch === u.branch && u.unit === singleTodo.unit)
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      placeholder="Please Select Team"
                      value={{
                        label:
                          singleTodo.team === ""
                            ? "Please Select Team"
                            : singleTodo.team,
                        value:
                          singleTodo.team === ""
                            ? "Please Select Team"
                            : singleTodo.team,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          team: e.value,
                          employeename: "Please Select Employee Name",
                          employeedbid: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={allUsersData
                        ?.filter(
                          (u) =>
                            u.company === singleTodo.company &&
                            u.branch === singleTodo.branch &&
                            u.unit === singleTodo.unit &&
                            u.team === singleTodo.team
                        )
                        .map((u) => ({
                          ...u,
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      placeholder="Please Select Employee Name"
                      value={{
                        label:
                          singleTodo.employeename === ""
                            ? "Please Select Employee Name"
                            : singleTodo.employeename,
                        value:
                          singleTodo.employeename === ""
                            ? "Please Select Employee Name"
                            : singleTodo.employeename,
                      }}
                      onChange={(e) => {
                        setSingleTodo({
                          ...singleTodo,
                          employeename: e.value,
                          employeedbid: e._id,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <Grid item md={10} sm={12}>
                    <FormControl size="small" fullWidth>
                      <FormGroup>
                        <FormControlLabel
                          label="Enable Auto Logout"
                          control={
                            <Switch
                              checked={autoLogoutSwitchTodo}
                              onChange={handleAutoLogoutSwitchChangeTodo}
                            />
                          }
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Auto Logout (Mins)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      placeholder="Please Enter Auto Logout in Mins"
                      value={singleTodo.autologoutmins}
                      onChange={(e) => {
                        if (autoLogoutSwitchTodo) {
                          const enteredValue = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 3);
                          if (
                            enteredValue === "" ||
                            /^\d+$/.test(enteredValue)
                          ) {
                            setSingleTodo({
                              ...singleTodo,
                              autologoutmins: enteredValue,
                            });
                          }
                        }
                      }}
                      disabled={!autoLogoutSwitchTodo}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.5} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: "30px",
                      minWidth: "20px",
                      padding: "19px 13px",
                      marginTop: "25px",
                    }}
                    onClick={addTodo}
                  >
                    <FaPlus />
                  </Button>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  {" "}
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 700 }}
                      aria-label="customized table"
                      id="usertable"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                          <StyledTableCell>SNo</StyledTableCell>
                          <StyledTableCell>Company</StyledTableCell>
                          <StyledTableCell>Branch</StyledTableCell>
                          <StyledTableCell>Unit</StyledTableCell>
                          <StyledTableCell>Team</StyledTableCell>
                          <StyledTableCell>Employee Name</StyledTableCell>
                          <StyledTableCell>Auto Logout</StyledTableCell>
                          <StyledTableCell>Auto Logout Mins</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody align="left">
                        {allTodo?.length > 0 ? (
                          allTodo?.map((row, index) => (
                            <StyledTableRow>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>{row.company}</StyledTableCell>
                              <StyledTableCell>{row.branch}</StyledTableCell>
                              <StyledTableCell>{row.unit}</StyledTableCell>
                              <StyledTableCell>{row.team}</StyledTableCell>
                              <StyledTableCell>
                                {row.employeename}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.autologoutswitch ? "ON" : "OFF"}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.autologoutmins === "" ? (
                                  ""
                                ) : (
                                  <>{`${row.autologoutmins} minutes`}</>
                                )}
                              </StyledTableCell>
                              <StyledTableCell>
                                <CloseIcon
                                  sx={{ color: "red", cursor: "pointer" }}
                                  onClick={() => {
                                    handleClickOpen(index);
                                    setDeleteIndex(index);
                                  }}
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            {" "}
                            <StyledTableCell colSpan={8} align="center">
                              No Data Available
                            </StyledTableCell>{" "}
                          </StyledTableRow>
                        )}
                        <StyledTableRow></StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <br />
              <Grid
                container
                sx={{ justifyContent: "center", display: "flex" }}
                spacing={2}
              >
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">
                    Update
                  </Button>
                </Grid>
                <Grid item>
                  <Link
                    to="/dashboard"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {" "}
                    <Button sx={userStyle.btncancel}> Cancel </Button>{" "}
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure? Do You Want to remove{" "}
            {allTodo[deleteIndex]?.employeename}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            No
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => deleteTodo(deleteIndex)}
          >
            {" "}
            Yes{" "}
          </Button>
        </DialogActions>
      </Dialog>
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
    </Box>
  );
}
export default AutoLogout;