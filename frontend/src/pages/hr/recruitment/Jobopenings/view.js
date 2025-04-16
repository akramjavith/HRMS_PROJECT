import react, { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  FormControl,
  Grid,
  TextareaAutosize,
  Button,
  TextField,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SERVICE } from "../../../../services/Baseservice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import { FaTrash } from "react-icons/fa";
import { AuthContext } from "../../../../context/Appcontext";
import { handleApiError } from "../../../../components/Errorhandling";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import pdfIcon from "../../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../../components/Assets/word-icon.png";
import excelIcon from "../../../../components/Assets/excel-icon.png";
import csvIcon from "../../../../components/Assets/CSV.png";
import fileIcon from "../../../../components/Assets/file-icons.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const JobopeningView = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const id = useParams().id;
  const classes = useStyles();
  const [jobopenening, setJobOpeing] = useState({});

  const backLPage = useNavigate();

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const { auth } = useContext(AuthContext);

  const [uploadfiles, setUploadfiles] = useState([]);

  //3rd file icon...
  const getuploadfileicon = (fileName) => {
    const extension3 = fileName.split(".").pop();
    switch (extension3) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  //3rd deletefile...
  const handledeleteupload = (index) => {
    const newuploadedFiles = [...uploadfiles];
    newuploadedFiles.splice(index, 1);
    setUploadfiles(newuploadedFiles);
  };
  const getviewCode = async () => {
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setJobOpeing(res.data.sjobopening);
      setUploadfiles(res?.data?.sjobopening?.attachments);
   } catch (err) {}
  };

  useEffect(() => {
    getviewCode();
  }, [id]);

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    document.getElementById("myDateInput").min = todayDate;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split("T")[0];
    document.getElementById("myDate").min = tomorrowString;
  }, []);
  return (
    <Box>
      <Typography sx={userStyle.HeaderText}>Manage Job Openings</Typography>
      <Box sx={userStyle.selectcontainer}>
        <Grid container spacing={2}>
          <Grid item md={12} sm={12} sx={12}>
            <Typography variant="h5">View Job Openings</Typography>
          </Grid>
          <Grid item md={9} xs={12}></Grid>
          <Grid item md={3} sm={12} xs={12}>
            <Typography>Status</Typography>
            <OutlinedInput
              id="component-outlined"
              type="text"
              value={jobopenening.status}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Recruitment Name</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.recruitmentname}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Job Opening ID</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.joboopenid}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Hiring Manager</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.hiringmanager}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Company</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.company}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Branch</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.branch}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Floor</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.floor}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Area</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.area}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Approved Seats</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.approvedseats}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Designation</Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.designation}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Education</Typography>
              <TextField
                value={jobopenening?.education?.join(",")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Language</Typography>
              <TextField
                value={jobopenening?.language?.join(",")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Required Skill</Typography>
              <TextField
                value={jobopenening?.requiredskill?.join(",")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>From Salary</Typography>
              <OutlinedInput
                id="component-outlined"
                value={jobopenening.fromsalary}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>To Salary</Typography>
              <OutlinedInput
                id="component-outlined"
                value={jobopenening.tosalary}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>From Experience</Typography>
              <OutlinedInput
                id="component-outlined"
                value={jobopenening.experiencefrom}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>To Experience</Typography>
              <OutlinedInput
                id="component-outlined"
                value={jobopenening.experienceto}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Date Opened</Typography>
              <OutlinedInput
                readOnly
                id="myDateInput"
                type="date"
                value={jobopenening.dateopened}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Target Date</Typography>
              <OutlinedInput
                readOnly
                type="date"
                value={jobopenening.targetdate}
                id="myDate"
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Department</Typography>
              <OutlinedInput readOnly value={jobopenening.department} />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Job Type</Typography>
              <OutlinedInput readOnly value={jobopenening.jobtype} />
            </FormControl>
          </Grid>
          <Grid item md={8} xs={12}></Grid>
          <Grid item md={8} xs={12}></Grid>
          {!jobopenening.remotejob ? (
            <>
              <Grid item md={3} xs={12}>
                <br />
                <Typography variant="h6">
                  <b>Address Information</b>
                </Typography>
              </Grid>
            </>
          ) : null}

          <Grid item md={2} xs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={Boolean(jobopenening.remotejob)} />}
                label="Remote Job"
              />
            </FormGroup>
          </Grid>

          {!jobopenening.remotejob ? (
            <>
              <Grid item md={7} sx={12}></Grid>
              <Grid item md={6} xs={12}>
                <InputLabel id="demo-select-small">Address</InputLabel>
                <FormControl size="small" fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={7}
                    style={{ border: "1px solid #4a7bf7" }}
                    value={jobopenening?.address}
                    name="branchAddress"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>City</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.city}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>State</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.state}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Country</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.country}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Pincode</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.pincode}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Email</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.email}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.phone}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : null}
          <Grid md={12} sm={12} xs={12}>
            <Typography variant="h6">
              <b>Description information</b>
            </Typography>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                <b>Job Description </b>
              </Typography>
              <ReactQuill
                readOnly
                style={{ height: "180px" }}
                value={jobopenening.jobdescription}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
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

          <Grid item md={12} sm={12} xs={12}>
            <br /> <br />
            <FormControl fullWidth size="small">
              <Typography>
                {" "}
                <b>Job Requirements </b>
              </Typography>

              <ReactQuill
                readOnly
                style={{ height: "180px" }}
                value={jobopenening.jobrequirements}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
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
          <Grid item md={12} sm={12} xs={12}>
            <br /> <br />
            <FormControl fullWidth size="small">
              <Typography>
                <b>Job Benefits</b>{" "}
              </Typography>

              <ReactQuill
                readOnly
                style={{ height: "180px" }}
                value={jobopenening.jobbenefits}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
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
          <Grid item md={12} sm={12} xs={12}>
            <br /> <br />
            <FormControl fullWidth size="small">
              <Typography>
                <b>Role & Responsibilities</b>{" "}
              </Typography>

              <ReactQuill
                readOnly
                style={{ height: "180px" }}
                value={jobopenening.rolesresponse}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
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
          <Grid item md={12} xs={12} sm={12}>
            <br />
            <br /> <br /> <br />
            <Grid container>
              <input
                className={classes.inputs}
                type="file"
                id="file-inputfileseditsecond"
                multiple
              />
              <label htmlFor="file-inputfileseditsecond"></label>
            </Grid>
            <div>
              <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                  <Grid container>
                    {uploadfiles.map((file, index) => (
                      <>
                        <Grid container>
                          <Grid item md={2} sm={2} xs={2}>
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {file.type.includes("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  height={10}
                                  style={{
                                    maxWidth: "-webkit-fill-available",
                                  }}
                                />
                              ) : (
                                <img
                                  className={classes.preview}
                                  src={getuploadfileicon(file.name)}
                                  height="10"
                                  alt="file icon"
                                />
                              )}
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={8}
                            sm={8}
                            xs={8}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">
                              {file.name}{" "}
                            </Typography>
                          </Grid>
                          <Grid item md={2} sm={1} xs={1}>
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
              </Grid>
              <br />
              <br />
            </div>
          </Grid>
          <Grid
            item
            md={12}
            xs={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid>
              <Button
                variant="contained"
                onClick={() => {
                  backLPage("/recruitment/jobopenlist");
                }}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default JobopeningView;
