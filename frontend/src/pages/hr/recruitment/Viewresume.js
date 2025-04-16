import React, { useState, useEffect, useContext } from "react";
import {
  TextareaAutosize,
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
  IconButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import Selects from "react-select";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import "jspdf-autotable";
import axios from "axios";
import moment from "moment";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

function Viewresume() {
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };
  const [addcandidate, setAddcandidate] = useState({});

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [currentText, setCurrentText] = useState("");

  // Convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleViewImage = () => {
    const blob = dataURItoBlob(addcandidate.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  const [payslipletter, setPayslipletter] = useState([]);
  const [experienceletter, setExperienceletter] = useState([]);
  const [coverletter, setCoverletter] = useState([]);

  const [candidatefiles, setCandidateFiles] = useState([]);

  const [todoscheck, setTodoscheck] = useState([]);

  // candidate document
  const renderFilePreviewCandidate = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const { id, name } = useParams();

  const fetchCandidateData = async () => {
    try {
      let res_queue = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAddcandidate(res_queue?.data?.scandidates);
      setTodoscheck(res_queue?.data?.scandidates?.candidatedatafile);

      setResumeFiles([...res_queue?.data?.scandidates?.resumefile]);
      setCoverletter([...res_queue?.data?.scandidates?.coverletterfile]);
      setExperienceletter([
        ...res_queue?.data?.scandidates?.experienceletterfile,
      ]);
      setPayslipletter([...res_queue?.data?.scandidates?.payslipletterfile]);
      setCurrentText(res_queue?.data?.scandidates?.coverlettertext);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchCandidateData();
  }, []);

  const { auth } = useContext(AuthContext);

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const renderFilePreviewcover = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const renderFilePreviewexp = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const renderFilePreviewpayslip = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const [resumefiles, setResumeFiles] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if (name === "unassigned") {
      navigate("/recruitment/unassignedcandidates");
    } else if (name === "assigned") {
      navigate("/recruitment/assignedcandidates");
    } else if (name === "statuscount") {
      navigate("/recruitment/interviewstatuscountreportpage");
    } else if (name === "candidatemissingfield") {
      navigate("/candidatemissingfields");
    } else {
      navigate("/resumemanagement");
    }
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  return (
    <Box>
      <NotificationContainer />
      <Grid item xs={4}>
        <>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ textDecoration: "none", color: "white", float: "right" }}
          >
            Back
          </Button>
        </>
      </Grid>
      <Headtitle title={"VIEW RESUME"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>View Resume </Typography>

      <>
        <Box sx={userStyle.selectcontainer}>
          <Grid container spacing={2}>
            {name === "unassigned" ? (
              <Grid
                item
                md={12}
                lg={12}
                sm={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Typography variant="h6">
                  Applied Date :{" "}
                  {moment(addcandidate.createdAt).format("DD-MM-YYYY")}
                </Typography>
              </Grid>
            ) : (
              <></>
            )}
            {name === "assigned" ? (
              <Grid
                item
                md={12}
                lg={12}
                sm={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Typography variant="h5">Role : {addcandidate.role}</Typography>
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={12} sx={{ margin: "20px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Basic Info</b>
              </Typography>
            </Grid>
            <br />
            <Grid item md={6} sm={6} xs={12}>
              <Grid container sx={{ display: "flex" }}>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Prefix</Typography>
                </Grid>
                <Grid item md={9} sm={9} xs={9}>
                  <Typography>First Name</Typography>
                </Grid>
              </Grid>

              <Grid container sx={{ display: "flex" }}>
                <Grid item md={3} sm={3} xs={3}>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={addcandidate.prefix}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={9} sm={9} xs={9}>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={addcandidate.firstname}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Last Name</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.lastname}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Gender</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.gender}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Email</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.email}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Mobile</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  sx={userStyle.input}
                  value={addcandidate.mobile}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Whatsapp</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  sx={userStyle.input}
                  value={addcandidate.whatsapp}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <Typography>Profile Image</Typography>
              {addcandidate.uploadedimage && (
                <>
                  <img
                    src={addcandidate.uploadedimage}
                    style={{
                      maxHeight: "200px",
                      maxWidth: "150px",
                      marginTop: "10px",
                    }}
                  />
                </>
              )}
              {addcandidate?.uploadedimage && (
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p>
                      {addcandidate.uploadedimagename === null
                        ? "Capturedimage"
                        : addcandidate.uploadedimagename}
                    </p>
                    <IconButton aria-label="delete" onClick={handleViewImage}>
                      <VisibilityOutlinedIcon sx={{ color: "#1079E3" }} />
                    </IconButton>
                  </div>
                </>
              )}
              {/* <div style={{ display: 'flex' }}>
                <Button variant="contained" component="label" >
                  Upload
                  <input
                    accept="image/*"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleImageUpload(e);
                    }}
                  />
                </Button>
                

              </div> */}
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>DOB</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={addcandidate.dateofbirth}
                />
              </FormControl>
            </Grid>
            <Grid item md={1} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Age</Typography>
                <OutlinedInput
                  sx={userStyle.input}
                  id="component-outlined"
                  type="number"
                  value={addcandidate.age}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Aadhar Number</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.adharnumber}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Pan Number</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.pannumber}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Source of Candidate</Typography>
                <OutlinedInput
                  id="component-outlined"
                  value={addcandidate.sourcecandidate}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ margin: "20px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Address Information</b>
              </Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Street</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.street}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Postal Code</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  value={addcandidate.postalcode}
                  sx={userStyle.input}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography>Country</Typography>
              <Grid sx={{ display: "flex" }}>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    value={addcandidate.country}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography>State</Typography>
              <Grid sx={{ display: "flex" }}>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    value={addcandidate.state}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography>City</Typography>
              <Grid sx={{ display: "flex" }}>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    value={addcandidate.city}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ margin: "20px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Professional Details</b>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ margin: "20px 0px" }}>
              <Typography sx={{ fontSize: "16px" }}>
                <b> Experience Details</b>
              </Typography>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Overall Experience</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  sx={userStyle.input}
                  value={
                    addcandidate?.experienceestimation == undefined
                      ? "Years"
                      : addcandidate?.experienceestimation
                  }
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>{`No. Of ${
                  addcandidate?.experienceestimation == undefined
                    ? "Years"
                    : addcandidate?.experienceestimation
                }`}</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  sx={userStyle.input}
                  value={addcandidate.experience}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Domain Field Experience in Years</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  sx={userStyle.input}
                  readOnly
                  value={
                    addcandidate?.domainexperienceestimation == undefined
                      ? "Years"
                      : addcandidate?.domainexperienceestimation
                  }
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>{`No. Of ${
                  addcandidate?.domainexperienceestimation == undefined
                    ? "Years"
                    : addcandidate?.domainexperienceestimation
                }`}</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  sx={userStyle.input}
                  readOnly
                  value={addcandidate?.domainexperience}
                />
              </FormControl>
            </Grid>
            {/* <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Highest Qualification 
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  value={addcandidate.qualification}
                  />
              </FormControl>
            </Grid> */}

            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Current Job title</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.currentjobtitle}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Current Employer</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.currentemployer}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Expected Salary</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  sx={userStyle.input}
                  value={addcandidate.expectedsalary}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Current Salary</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.currentsalary}
                  sx={userStyle.input}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Joining By Days</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.joinbydays}
                  sx={userStyle.input}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Notice Period Days In Previous Company</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  readOnly
                  value={addcandidate.noticeperiod}
                  sx={userStyle.input}
                />
              </FormControl>
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Skill set</Typography>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={5}
                  value={addcandidate.skillset}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Additional Info</Typography>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={5}
                  value={addcandidate.additionalinfo}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>LinkedIn Id</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.linkedinid}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ margin: "20px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Other Info</b>
              </Typography>
            </Grid>
            <Grid item md={2.5} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Candidate Status</Typography>
                <OutlinedInput
                  id="component-outlined"
                  value={addcandidate.status}
                />
              </FormControl>
            </Grid>
            <Grid item md={2.5} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Source</Typography>
                <OutlinedInput
                  id="component-outlined"
                  value={addcandidate.source}
                />
              </FormControl>
            </Grid>

            <Grid item md={2} sm={6} xs={6}>
              <FormControl fullWidth size="small">
                <Typography>Interview Prefered Date</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={addcandidate.interviewdate}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} xs={6} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Time </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="time"
                  placeholder="HH:MM"
                  value={addcandidate.time}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ margin: "20px 0px 10px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Education details</b>
              </Typography>
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
                      <StyledTableCell>Category</StyledTableCell>
                      <StyledTableCell>Sub Category</StyledTableCell>
                      <StyledTableCell>Specialization</StyledTableCell>
                      <StyledTableCell>School</StyledTableCell>
                      <StyledTableCell>Department</StyledTableCell>
                      <StyledTableCell>Degree</StyledTableCell>
                      <StyledTableCell>Duration</StyledTableCell>
                      <StyledTableCell>pursuing</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {addcandidate.educationdetails?.length > 0 ? (
                      addcandidate.educationdetails?.map((row, index) => (
                        <StyledTableRow>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.categoryedu}</StyledTableCell>
                          <StyledTableCell>
                            {row.subcategoryedu}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.specialization}
                          </StyledTableCell>
                          <StyledTableCell>{row.school}</StyledTableCell>
                          <StyledTableCell>{row.department}</StyledTableCell>
                          <StyledTableCell>{row.degree}</StyledTableCell>
                          <StyledTableCell>
                            {row.fromduration}{" "}
                            {row.fromduration && row.toduration ? " To " : ""}{" "}
                            {row.toduration}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.pursuing ? "Yes" : "No"}
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
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} sx={{ margin: "20px 0px 10px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Experience details</b>
              </Typography>
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
                      <StyledTableCell>Occupation</StyledTableCell>
                      <StyledTableCell>Company</StyledTableCell>
                      <StyledTableCell>Summary</StyledTableCell>
                      <StyledTableCell>Work Duration</StyledTableCell>
                      <StyledTableCell>Work here</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {addcandidate.experiencedetails?.length > 0 ? (
                      addcandidate.experiencedetails?.map((row, index) => (
                        <StyledTableRow>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.occupation}</StyledTableCell>
                          <StyledTableCell>{row.company}</StyledTableCell>
                          <StyledTableCell>{row.summary}</StyledTableCell>
                          <StyledTableCell>
                            {row.fromduration}{" "}
                            {row.fromduration && row.toduration ? " To " : ""}{" "}
                            {row.toduration}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.currentlyworkhere ? "Yes" : "No"}
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
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <br />
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Skill set known</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  readOnly
                  value={addcandidate?.skill?.join(" ,")}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Certificaion</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  readOnly
                  value={addcandidate?.certification?.join(" ,")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ margin: "20px 0px 10px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Attachement Information</b>
              </Typography>
            </Grid>

            {/* candidate document */}
            {todoscheck?.length > 0 &&
              todoscheck.map((todo, index) => (
                <Grid
                  item
                  lg={10}
                  md={10}
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    marginLeft: "40px",
                    justifyContent: "center",
                    "@media only screen and (max-width:550px)": {
                      flexDirection: "column",
                    },
                  }}
                >
                  <Grid
                    item
                    lg={4}
                    md={4}
                    xs={12}
                    sm={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      "@media only screen and (max-width:550px)": {
                        flexDirection: "column",
                      },
                    }}
                  >
                    <Typography
                      sx={userStyle.importheadtext}
                      style={{ marginLeft: "5px" }}
                    >
                      {todo.candidatefilename}&nbsp;
                      {todo.uploadedby !== "" &&
                        todo.uploadedby != undefined && (
                          <Button
                            variant="contained"
                            size="small"
                            style={{
                              padding: "5px",
                              background:
                                todo.uploadedby === "candidiate"
                                  ? "green"
                                  : todo.uploadedby === "employee"
                                  ? "orange"
                                  : "brown",
                              color:
                                todo.uploadedby === "employee"
                                  ? "black"
                                  : "white",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {todo.uploadedby}
                          </Button>
                        )}
                    </Typography>
                    <Box sx={{ paddingLeft: "5px" }}></Box>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12} sm={12} sx={{}}>
                    <>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid item lg={8} md={8} sm={8} xs={8}>
                          <Typography>
                            {" "}
                            {todo.name === "" ? (
                              <ListItem
                                sx={{
                                  "&:hover": {
                                    cursor: "pointer",
                                    color: "blue",
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                <CopyToClipboard
                                  onCopy={() => {
                                    handleCopy(`Copied ${todo.linkname}`);
                                  }}
                                  options={{ message: "Copied Username!" }}
                                  text={todo.link}
                                >
                                  <ListItemText primary={todo.linkname} />
                                </CopyToClipboard>
                              </ListItem>
                            ) : (
                              todo.name
                            )}
                          </Typography>
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          {todo.name !== "" && (
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreviewCandidate(todo)}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              ))}

            <Grid
              item
              lg={10}
              md={10}
              xs={12}
              sm={12}
              sx={{
                display: "flex",
                marginLeft: "40px",
                justifyContent: "center",
                "@media only screen and (max-width:550px)": {
                  flexDirection: "column",
                },
              }}
            >
              <Grid
                item
                lg={4}
                md={4}
                xs={12}
                sm={12}
                sx={{
                  display: "flex",
                  "@media only screen and (max-width:550px)": {
                    flexDirection: "column",
                  },
                }}
              >
                <Typography
                  sx={userStyle.importheadtext}
                  style={{ marginLeft: "5px" }}
                >
                  Resume
                </Typography>
                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              </Grid>
              <Grid item lg={6} md={6} xs={12} sm={12} sx={{}}>
                {resumefiles?.length > 0 &&
                  resumefiles.map((file, index) => (
                    <>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid item lg={8} md={8} sm={8} xs={8}>
                          <Typography>{file.name}</Typography>
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreview(file)}
                          />
                        </Grid>
                      </Grid>
                    </>
                  ))}
              </Grid>
            </Grid>

            {addcandidate.experience > 0 && (
              <>
                <Grid
                  item
                  lg={10}
                  md={10}
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    marginLeft: "40px",
                    justifyContent: "center",
                    "@media only screen and (max-width:550px)": {
                      flexDirection: "column",
                    },
                  }}
                >
                  <Grid
                    item
                    lg={4}
                    md={4}
                    xs={12}
                    sm={12}
                    sx={{
                      display: "flex",
                      "@media only screen and (max-width:550px)": {
                        flexDirection: "column",
                      },
                    }}
                  >
                    <Typography
                      sx={userStyle.importheadtext}
                      style={{ marginLeft: "5px" }}
                    >
                      Experience Letter
                    </Typography>
                    &emsp;&emsp;
                  </Grid>
                  <Grid item lg={6} md={6} xs={12} sm={12} sx={{}}>
                    {experienceletter?.length > 0 &&
                      experienceletter.map((file, index) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreviewexp(file)}
                              />
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    marginLeft: "40px",
                    justifyContent: "center",
                    "@media only screen and (max-width:550px)": {
                      flexDirection: "column",
                    },
                  }}
                >
                  <Grid
                    item
                    lg={4}
                    md={4}
                    xs={12}
                    sm={12}
                    sx={{
                      display: "flex",
                      "@media only screen and (max-width:550px)": {
                        flexDirection: "column",
                      },
                    }}
                  >
                    <Typography
                      sx={userStyle.importheadtext}
                      style={{ marginLeft: "5px" }}
                    >
                      Pay Slip
                    </Typography>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                  </Grid>
                  <Grid item lg={6} md={6} xs={12} sm={12}>
                    {payslipletter?.length > 0 &&
                      payslipletter.map((file, index) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreviewpayslip(file)}
                              />
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
              </>
            )}
            <Grid
              item
              lg={10}
              md={10}
              xs={12}
              sm={12}
              sx={{
                display: "flex",
                marginLeft: "40px",
                justifyContent: "center",
                "@media only screen and (max-width:550px)": {
                  flexDirection: "column",
                },
              }}
            >
              <Grid
                item
                lg={4}
                md={4}
                xs={12}
                sm={12}
                sx={{
                  display: "flex",
                  "@media only screen and (max-width:550px)": {
                    flexDirection: "column",
                  },
                }}
              >
                <Typography
                  sx={userStyle.importheadtext}
                  style={{ marginLeft: "5px" }}
                >
                  Cover letter
                </Typography>
              </Grid>
              {coverletter?.length === 0 && currentText !== "<p><br></p>" && (
                <>
                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      {/* <Typography>
                        <b> Description </b>
                      </Typography> */}
                      <ReactQuill
                        style={{ height: "180px" }}
                        value={currentText}
                        // onChange={(e) => {
                        //   setCurrentText(e);
                        // }}
                        readOnly={true}
                        modules={{
                          toolbar: [
                            [{ header: "1" }, { header: "2" }, { font: [] }],
                            [{ size: [] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["link", "image", "video"],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "header",
                          "font",
                          "size",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                          "list",
                          "bullet",
                          "indent",
                          "link",
                          "image",
                          "video",
                        ]}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
              {coverletter?.length > 0 &&
                (currentText === "<p><br></p>" || currentText === "") && (
                  <>
                    <Grid item lg={6} md={6} xs={12} sm={12} sx={{}}>
                      {coverletter?.length > 0 &&
                        coverletter.map((file, index) => (
                          <>
                            <Grid
                              container
                              spacing={2}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Typography>{file.name}</Typography>
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => renderFilePreviewcover(file)}
                                />
                              </Grid>
                            </Grid>
                          </>
                        ))}
                    </Grid>
                  </>
                )}
              {coverletter?.length === 0 && currentText === "<p><br></p>" && (
                <>
                  <Grid item lg={6} md={6} xs={12} sm={12} sx={{}}></Grid>
                </>
              )}
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <br />
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Grid item md={12} sm={12} xs={12}>
                <Button
                  sx={userStyle.buttonadd}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Dialog
              open={isErrorOpen}
              onClose={handleCloseerr}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  style={{ fontSize: "20px", fontWeight: 900 }}
                >
                  {showAlert}
                </Typography>
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
        </Box>
      </>
      {/* } */}
    </Box>
  );
}

export default Viewresume;