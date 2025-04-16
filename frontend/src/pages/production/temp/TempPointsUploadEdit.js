import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

function DayPointsUploadEditTemp() {
  const backPage = useNavigate();

  const [vendor, setVendor] = useState([]);
  const [vendorUpdatedBy, setVendorUpdatedBy] = useState();
  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  useEffect(() => {
    fetchTeamAll();
    fetchEmployeeAll();
  }, []);
  let subid = useParams().subid;
  let mainid = useParams().mainid;
  //useEffect
  useEffect(() => {
    getinfoCode();
  }, [subid, mainid]);
  const [vendorArray, setVendorArray] = useState([]);
  const [fileName, setFileName] = useState("");
  // get single row to view....
  const getinfoCode = async () => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DAY_POINTS_TEMP}/${mainid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.sdaypointsupload?.uploaddata.filter(
        (item) => item._id === subid
      );
      setVendor(result[0]);
      setFileName(res?.data?.sdaypointsupload?.filename);
      setVendorUpdatedBy(res?.data?.sdaypointsupload?.updatedby);
      setVendorArray(
        res?.data?.sdaypointsupload?.uploaddata.filter(
          (item) => item._id !== subid
        )
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const username = isUserRoleAccess.username;

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [teamOption, setTeamOption] = useState([]);
  const [employeeOption, setEmployeeOption] = useState([]);

  //function to fetch  team
  const fetchTeamAll = async () => {
    try {
      let res_team = await axios.get(SERVICE.TEAMS, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setTeamOption([
        ...res_team?.data?.teamsdetails?.map((t) => ({
          ...t,
          label: t.teamname,
          value: t.teamname,
        })),
      ]);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //function to fetch participants
  const fetchEmployeeAll = async () => {
    try {
      let res_participants = await axios.get(SERVICE.USERALLLIMIT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setEmployeeOption([
        ...res_participants?.data?.users?.map((t) => ({
          ...t,
          label: t.companyname,
          value: t.companyname,
        })),
      ]);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  let name = "create";
  let nameedit = "edit";
  let allUploadedFiles = [];
  //add function
  const sendRequest = async () => {
    try {
      let updatesingledata = await axios.put(
        `${SERVICE.SINGLE_DAY_POINTS_UPLOAD_TEMP}/${subid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          name: String(vendor.name),
          fromtodate: String(vendor.fromtodate),
          empcode: String(vendor.empcode),
          companyname: String(vendor.companyname),
          processcode: String(vendor.processcode),
          branch: String(vendor.branch),
          unit: String(vendor.unit),
          team: String(vendor.team),
          date: String(vendor.date),
          dateval: String(vendor.dateval),
          exper: String(vendor.exper),
          target: String(vendor.target),
          conshiftpoints: String(vendor.conshiftpoints),
          shiftsts: String(vendor.shiftsts),
          shiftpoints: String(vendor.shiftpoints),
          production: String(vendor.production),
          manual: String(vendor.manual),
          point: String(vendor.point),
          users: vendor.users,
          nonproduction: String(""),
          allowancepoint: String(vendor.allowancepoint),
          nonallowancepoint: String(vendor.nonallowancepoint),
          avgpoint: String(vendor.avgpoint),
          id: String(subid),
        }
      );
      let updatedata = await axios.put(
        `${SERVICE.SINGLE_DAY_POINTS_TEMP}/${mainid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          updatedby: [
            ...vendorUpdatedBy,
            { name: String(username), date: String(new Date()) },
          ],
        }
      );
      backPage("/production/temppointsupload");
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    const isNameMatch = vendorArray.some(
      (item) =>
        item.companyname === vendor.companyname &&
        item.branch === vendor.branch &&
        item.unit === vendor.unit &&
        item.team === vendor.team &&
        item.date === vendor.date &&
        item.exper?.toLowerCase() == vendor.exper?.toLowerCase() &&
        item.target?.toLowerCase() == vendor.target?.toLowerCase() &&
        item.production?.toLowerCase() == vendor.production?.toLowerCase() &&
        item.nonproduction?.toLowerCase() ==
        vendor.nonproduction?.toLowerCase() &&
        item.manual?.toLowerCase() == vendor.manual?.toLowerCase() &&
        item.point?.toLowerCase() == vendor.point?.toLowerCase() &&
        item.allowancepoint?.toLowerCase() ==
        vendor.allowancepoint?.toLowerCase() &&
        item.nonallowancepoint?.toLowerCase() ==
        vendor.nonallowancepoint?.toLowerCase() &&
        item.avgpoint?.toLowerCase() == vendor.avgpoint?.toLowerCase()
    );

    if (
      vendor.companyname === "Please Select Company" ||
      vendor.companyname === "" ||
      vendor.companyname == "undefined"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.branch === "Please Select Branch" ||
      vendor.branch === "" ||
      vendor.branch == "undefined"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.unit === "Please Select Unit" ||
      vendor.unit === "" ||
      vendor.unit == "undefined"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.team === "Please Select Team" ||
      vendor.team === "" ||
      vendor.team == "undefined"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.name === "Please Select Employee" ||
      vendor.name === "" ||
      vendor.name == "undefined"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (vendor.date === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.exper === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Exper"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.target === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Target"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.production === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Production"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.manual === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Manual"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.point === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Point"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.allowancepoint === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Allowance Point"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.nonallowancepoint === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Non-Allowance Point"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.avgpoint === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Average Point"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Data Already exits!"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  return (
    <Box>
      <Headtitle title={"EDIT TEMP DAY POINTS UPLOAD"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Edit Temp Day Points Upload</Typography>
      <>
        {isUserRoleCompare?.includes("eaddvisitors") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  {" "}
                  <Typography sx={{ fontWeight: "bold" }}>
                    Edit {fileName}
                  </Typography>{" "}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={isAssignBranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Company"
                      value={{
                        label: vendor.companyname,
                        value: vendor.companyname,
                      }}
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
                          companyname: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          name: "Please Select Employee",
                          empcode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={isAssignBranch?.filter(
                        (comp) =>
                          vendor.companyname === comp.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Branch"
                      value={{
                        label: vendor.branch,
                        value: vendor.branch,
                      }}
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          name: "Please Select Employee",
                          empcode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={isAssignBranch?.filter(
                        (comp) =>
                          vendor.companyname === comp.company && vendor.branch === comp.branch
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Unit"
                      value={{
                        label: vendor.unit,
                        value: vendor.unit,
                      }}
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
                          unit: e.value,
                          team: "Please Select Team",
                          name: "Please Select Employee",
                          empcode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={teamOption
                        ?.filter((u) => u.unit === vendor.unit)
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      placeholder="Please Select Team"
                      value={{
                        label: vendor.team,
                        value: vendor.team,
                      }}
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
                          team: e.value,
                          name: "Please Select Employee",
                          empcode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={employeeOption
                        ?.filter(
                          (u) =>
                            u.company === vendor.companyname &&
                            u.branch === vendor.branch &&
                            u.unit === vendor.unit &&
                            u.team === vendor.team
                        )
                        .map((u) => ({
                          ...u,
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      placeholder="Please Select Team"
                      value={{
                        label: vendor.name,
                        value: vendor.name,
                      }}
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
                          name: e.value,
                          empcode: e.empcode,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Employee Code</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.empcode}
                      placeholder="Please Enter Employee Code"
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={vendor.date}
                      onChange={(e) => {
                        setVendor({ ...vendor, date: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Exper<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.exper}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({ ...vendor, exper: sanitizedValue });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Target<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.target}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({ ...vendor, target: sanitizedValue });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Production<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.production}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({ ...vendor, production: sanitizedValue });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Manual<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.manual}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({ ...vendor, manual: sanitizedValue });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Non Production
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.nonproduction}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({
                            ...vendor,
                            nonproduction: sanitizedValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Point<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.point}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({ ...vendor, point: sanitizedValue });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Allowance Point<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.allowancepoint}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({
                            ...vendor,
                            allowancepoint: sanitizedValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Non-Allowance Point<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.nonallowancepoint}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({
                            ...vendor,
                            nonallowancepoint: sanitizedValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Average Point<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.avgpoint}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        const sanitizedValue = enteredValue.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const hasMultiplePeriods =
                          sanitizedValue.split(".").length > 2;
                        const isNegative = sanitizedValue.includes("-");
                        if (!hasMultiplePeriods && !isNegative) {
                          setVendor({
                            ...vendor,
                            avgpoint: sanitizedValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <br /> <br />
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={userStyle.buttonadd}
                    onClick={(e) => handleSubmit(e)}
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Link
                    to="/production/daypointsupload"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      float: "right",
                    }}
                  >
                    <Button sx={userStyle.btncancel}>Cancel</Button>
                  </Link>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br />

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
    </Box>
  );
}
export default DayPointsUploadEditTemp;
