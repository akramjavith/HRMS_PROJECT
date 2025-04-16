import react, { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  TextareaAutosize,
  Button,
  TextField,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { handleApiError } from "../../../../components/Errorhandling";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SERVICE } from "../../../../services/Baseservice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Selects from "react-select";
import "jspdf-autotable";
import "react-image-crop/dist/ReactCrop.css";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { FaTrash } from "react-icons/fa";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import pdfIcon from "../../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../../components/Assets/word-icon.png";
import excelIcon from "../../../../components/Assets/excel-icon.png";
import csvIcon from "../../../../components/Assets/CSV.png";
import fileIcon from "../../../../components/Assets/file-icons.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Headtitle from "../../../../components/Headtitle";

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

const JobopeningEdit = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const id = useParams().id;

  const classes = useStyles();

  const statusOptions = [
    { label: "OnProgress", value: "OnProgress" },
    { label: "OnHold", value: "OnHold" },
    { label: "Closed", value: "closed" },
  ];

  const [jobopenening, setJobOpeing] = useState({});
  const [jobId, setJobId] = useState([]);
  const [hrManName, setHrManName] = useState([]);

  const [uploadfiles, setUploadfiles] = useState([]);
  const handleChangeSummary = (value) => {
    setJobOpeing({ ...jobopenening, jobdescription: value });
  };

  const handleChangeJobRequire = (value) => {
    setJobOpeing({ ...jobopenening, jobrequirements: value });
  };

  const handleChangeRoleres = (value) => {
    setJobOpeing({ ...jobopenening, rolesresponse: value });
  };

  const handleChangeJobBenefits = (value) => {
    setJobOpeing({ ...jobopenening, jobbenefits: value });
  };

  const backLPage = useNavigate();
  const { isUserRoleAccess ,isAssignBranch} = useContext(UserRoleAccessContext);
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));
  const username = isUserRoleAccess.username;

  const jobtypeoptions = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
    { label: "Intern", value: "Intern" },
  ];

  const { auth } = useContext(AuthContext);

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [department, setDeparttment] = useState([]);

  //fetching departments whole list
  const fetchDepartments = async () => {
    try {
      let dep = await axios.get(SERVICE.DEPARTMENTGROUPINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeparttment(
        dep?.data?.departmentgrouping.map((d) => ({
          ...d,
          label: d.departmentname,
          value: d.departmentname,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const fetchJob = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALLJOBOPENINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setJobId(res_queue.data.jobopenings);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchAllApproveds = async (company, branch) => {
    try {
      let res = await axios.post(
        SERVICE.ASSIGNINTERVIEWERS,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let ans = res.data.assigninterview.filter(
        (data) =>
          data?.fromcompany?.includes(company) &&
          data?.frombranch?.includes(branch) &&
          data.type === "Hiring Manager"
      );

      let he = ans.flatMap((d) => d.employee);

      setHrManName(
        he.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // useEffect(() => {
  //   fetchAllApproveds();
  // }, []);

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

  const handleuploadfile = (event) => {
    const files = event.target.files;
    let newuploadfile = [...uploadfiles];

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        newuploadfile.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        setUploadfiles(newuploadfile);
      };
      reader.readAsDataURL(file);
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
      setJobOpeing(res?.data?.sjobopening);
      setUploadfiles(res?.data?.sjobopening?.attachments);
      fetchAllApproveds(
        res?.data?.sjobopening.company,
        res?.data?.sjobopening.branch
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    getviewCode();
  }, [id]);

  const [branchAddress, setBranchAddress] = useState([]);

  const fetchAddress = async () => {
    try {
      let res_queue = await axios.post(SERVICE.BRANCHADDRESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: String(jobopenening?.branch),
      });

      setBranchAddress(res_queue.data.branchaddress[0]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  let updateby = jobopenening?.updatedby;

  const sendRequest = async () => {
    try {
      await axios.put(`${SERVICE.JOBOPENING_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String(jobopenening.status),
        recruitmentname: String(jobopenening.recruitmentname),
        joboopenid: String(jobopenening.joboopenid),
        hiringmanager: String(jobopenening.hiringmanager),
        company: String(jobopenening.company),
        branch: String(jobopenening.branch),
        floor: String(jobopenening.floor),
        area: [...jobopenening.area],
        designationuniqid: String(jobopenening.designationuniqid),
        approvedseats: String(jobopenening.approvedseats),
        designation: String(jobopenening.designation),
        education: [...jobopenening.education],
        language: [...jobopenening.language],
        requiredskill: [...jobopenening.requiredskill],
        fromsalary: String(jobopenening.fromsalary),
        tosalary: String(jobopenening.tosalary),
        dateopened: String(jobopenening.dateopened),
        targetdate: String(jobopenening.targetdate),
        address: String(jobopenening.address),
        city: String(jobopenening.city),
        state: String(jobopenening.state),
        country: String(jobopenening.country),
        pincode: String(jobopenening.pincode),
        email: String(jobopenening.email),
        phone: String(jobopenening.phone),
        jobdescription: String(jobopenening.jobdescription),
        jobrequirements: String(jobopenening.jobrequirements),
        jobbenefits: String(jobopenening.jobbenefits),
        attachments: [...uploadfiles],
        department: String(jobopenening.department),
        jobtype: String(jobopenening.jobtype),
        remotejob: Boolean(jobopenening.remotejob),
        rolesresponse: String(jobopenening.rolesresponse),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      let updateRecruitment = await axios.put(
        `${SERVICE.CANDIDATES_ROLEUPDATE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          role: String(jobopenening.recruitmentname),
        }
      );

      if (jobopenening.status === "Closed") {
        backLPage("/recruitment/jobcloselist");
      } else {
        backLPage("/recruitment/jobopenlist");
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleSubmit = () => {
    if (
      jobopenening.recruitmentname === undefined ||
      jobopenening.recruitmentname === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Recruitment Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      jobopenening.hiringmanager === undefined ||
      jobopenening.hiringmanager === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Hiring Manager "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      jobopenening.dateopened === undefined ||
      jobopenening.dateopened === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Opendate"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      jobopenening.targetdate === undefined ||
      jobopenening.targetdate === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Targetdate"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      jobopenening.fromsalary === undefined ||
      jobopenening.fromsalary === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter From Salary"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      jobopenening.tosalary === undefined ||
      jobopenening.tosalary === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter To Salary"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      jobopenening.jobtype === undefined ||
      jobopenening.jobtype === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Job Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  // useEffect(() => {
  //   const todayDate = new Date().toISOString().split("T")[0];
  //   document.getElementById("myDateInput").min = todayDate;
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   const tomorrowString = tomorrow.toISOString().split("T")[0];
  //   document.getElementById("myDate").min = tomorrowString;
  // }, []);

  return (
    <Box>
      <Headtitle title={"EDIT JOB OPENINGS"} />
      <Typography sx={userStyle.HeaderText}>Manage Job Openings</Typography>
      <Box sx={userStyle.selectcontainer}>
        <Grid container spacing={2}>
          <Grid item md={12} sm={12} sx={12}>
            <Typography variant="h5">Edit Job Openings</Typography>
          </Grid>
          <Grid item md={9} xs={12}></Grid>
          <Grid item md={3} sm={12} xs={12}>
            <Typography>
              Status<b style={{ color: "red" }}>*</b>
            </Typography>
            <Selects
              options={statusOptions}
              value={{ label: jobopenening.status, value: jobopenening.status }}
              onChange={(e) => {
                setJobOpeing({ ...jobopenening, status: e.value });
              }}
              // placeholder={"OnProgress"}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Recruitment Name<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                onChange={(e) => {
                  setJobOpeing({
                    ...jobopenening,
                    recruitmentname: e.target.value,
                    status:
                      jobopenening.status === undefined
                        ? "On Progress"
                        : jobopenening.status,
                  });
                }}
                value={jobopenening.recruitmentname}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Job Opening ID<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.joboopenid}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography>
              {" "}
              Hiring Manager<b style={{ color: "red" }}>*</b>{" "}
            </Typography>
            <Selects
              options={hrManName}
              value={{
                label: jobopenening.hiringmanager,
                value: jobopenening.hiringmanager,
              }}
              // placeholder={jobopenening?.hiringmanager}
              onChange={(e) => {
                setJobOpeing({ ...jobopenening, hiringmanager: e.value });
              }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                {" "}
                Company<b style={{ color: "red" }}>*</b>{" "}
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.company}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                {" "}
                Branch<b style={{ color: "red" }}>*</b>{" "}
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.branch}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Floor<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.floor}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                {" "}
                Area<b style={{ color: "red" }}>*</b>{" "}
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.area}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Approved Seats<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.approvedseats}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                {" "}
                Designation<b style={{ color: "red" }}>*</b>{" "}
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={jobopenening.designation}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                {" "}
                Education<b style={{ color: "red" }}>*</b>{" "}
              </Typography>
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
              <Typography>
                Language<b style={{ color: "red" }}>*</b>
              </Typography>
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
              <Typography>
                Required Skill<b style={{ color: "red" }}>*</b>
              </Typography>
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
              <Typography>
                From Salary<b style={{ color: "red" }}>*</b>{" "}
              </Typography>
              <OutlinedInput
                id="component-outlined"
                value={jobopenening.fromsalary}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                To Salary<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                value={jobopenening.tosalary}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                From Experience<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                value={jobopenening.experiencefrom}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                To Experience<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                value={jobopenening.experienceto}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Date Opened<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="from-date"
                type="date"
                value={jobopenening.dateopened}
                onChange={(e) => {
                  setJobOpeing({
                    ...jobopenening,
                    dateopened: e.target.value,
                    targetdate: "",
                  });
                  document.getElementById("to-date").min = e.target.value;
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Target Date<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                type="date"
                id="to-date"
                value={jobopenening.targetdate}
                onChange={(e) => {
                  setJobOpeing({ ...jobopenening, targetdate: e.target.value });
                  // setJobOpeing({ ...jobopenening, targetdate: e.target.value, dateopened: jobopenening.dateopened === undefined ? today : jobopenening.dateopened });
                }}
                min={jobopenening.dateopened}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Department</Typography>
              <Selects
                options={department}
                value={{
                  label: jobopenening.department,
                  value: jobopenening.department,
                }}
                onChange={(e) => {
                  setJobOpeing({ ...jobopenening, department: e.value });
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Job Type<b style={{ color: "red" }}>*</b>
              </Typography>
              <Selects
                options={jobtypeoptions}
                value={{
                  label: jobopenening.jobtype,
                  value: jobopenening.jobtype,
                }}
                onChange={(e) => {
                  setJobOpeing({ ...jobopenening, jobtype: e.value });
                }}
              />
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
                control={
                  <Checkbox
                    checked={Boolean(jobopenening.remotejob)}
                    onChange={(e) => {
                      setJobOpeing({
                        ...jobopenening,
                        remotejob: e.target.checked,
                      });
                    }}
                  />
                }
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
                      <Typography>
                        City<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.city}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        State<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.state}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Country<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.country}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Pincode<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.pincode}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Email<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={jobopenening?.email}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Phone<b style={{ color: "red" }}>*</b>
                      </Typography>
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
                style={{ height: "180px" }}
                value={jobopenening.jobdescription}
                onChange={handleChangeSummary}
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
                style={{ height: "180px" }}
                value={jobopenening.jobrequirements}
                onChange={handleChangeJobRequire}
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
                style={{ height: "180px" }}
                value={jobopenening.jobbenefits}
                onChange={handleChangeJobBenefits}
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
                style={{ height: "180px" }}
                value={jobopenening.rolesresponse}
                onChange={handleChangeRoleres}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      // { indent: "+1" },
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
                onChange={handleuploadfile}
              />
              <label htmlFor="file-inputfileseditsecond">
                <Button
                  style={{
                    backgroundColor: "#f4f4f4",
                    color: "#444",
                    minWidth: "40px",
                    boxShadow: "none",
                    borderRadius: "5px",
                    marginTop: "-5px",
                    textTransform: "capitalize",
                    padding: "7px 16px",
                    border: "1px solid #0000006b",
                    "&:hover": {
                      "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                        backgroundColor: "#f4f4f4",
                      },
                    },
                  }}
                  component="span"
                >
                  Attachments &ensp; <CloudUploadIcon />
                </Button>
              </label>
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
                          <Grid item md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                          <Grid item md={1} sm={2} xs={2}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handledeleteupload(index)}
                            >
                              <FaTrash
                                style={{ color: "#a73131", fontSize: "14px" }}
                              />
                            </Button>
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
            sx={{ display: "flex", justifyContent: "center", gap: "15px" }}
          >
            <Grid>
              <Button variant="contained" onClick={handleSubmit}>
                Update
              </Button>
            </Grid>
            <Grid>
              <Button
                sx={userStyle.btncancel}
                onClick={() => {
                  backLPage("/recruitment/jobopenlist");
                }}
              >
                CANCEL
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
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
    </Box>
  );
};

export default JobopeningEdit;
