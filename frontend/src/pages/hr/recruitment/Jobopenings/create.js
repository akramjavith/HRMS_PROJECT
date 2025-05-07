import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  OutlinedInput,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import "jspdf-autotable";
import { useContext, useEffect, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Selects from "react-select";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

import { makeStyles } from "@material-ui/core";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import csvIcon from "../../../../components/Assets/CSV.png";
import excelIcon from "../../../../components/Assets/excel-icon.png";
import fileIcon from "../../../../components/Assets/file-icons.png";
import pdfIcon from "../../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../../components/Assets/word-icon.png";

import AlertDialog from "../../../../components/Alert";
import MessageAlert from "../../../../components/MessageAlert";

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

const Jobopening = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };

  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [remote, setRemote] = useState(false);
  const id = useParams().id;
  const classes = useStyles();
  const [jobopenening, setJobOpeing] = useState({
    status: "OnProgress",
    recruitmentname: "",
    hiringmanager: "Please Select",
    branch: "",
    floor: "",
    approvedseats: "",
    designation: "",
    department: "Please Select Department",
    jobtype: "Please Select Jobtype",
    education: "",
    salary: "",
    dateopened: "",
    targetdate: "",
    address: "",
    city: "",
    state: "",
    country: "",
    email: "",
    phone: "",
    jobdescription: "",
    jobrequirements: "",
    jobbenefits: "",
  });
  const [educationValue, setEducationValue] = useState([]);
  let [valueLan, setValueLan] = useState([]);
  let [ValueSkill, setValueSkill] = useState([]);
  const [jobId, setJobId] = useState([]);
  const [hrManName, setHrManName] = useState([]);
  let newval = "JO0001";

  const [textSumm, setTextSummary] = useState("");
  const [jobrequire, setJobRequire] = useState("<ul><li></li></ul>");
  const [jobBenefits, setJobBenefits] = useState(
    "<ul><li> Collaborative and fun team.</li><li> Flat organizational structure.</li><li> Rewards and recognition.</li><li> Health care benefits.</li><li> Upskill allowance.</li><li> Located at the heart of the city with world class infrastructure.</li></ul>"
  );
  const [roleAndRes, setRoleAndRes] = useState({});

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

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleChangeRoleres = (value) => {
    setRoleAndRes(value);
  };
  const handleChangeSummary = (value) => {
    setTextSummary(value);
  };
  const handleChangeJobRequire = (value) => {
    setJobRequire(value);
  };

  const handleChangeJobBenefits = (value) => {
    setJobBenefits(value);
  };
  const backLPage = useNavigate();
  const statusOptions = [
    { label: "OnProgress", value: "OnProgress" },
    { label: "OnHold", value: "OnHold" },
    { label: "Closed", value: "closed" },
  ];
  const jobtypeoptions = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
    { label: "Intern", value: "Intern" },
  ];
  const { auth, setAuth } = useContext(AuthContext);
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
    setPageName(!pageName);
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchJob = async () => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.get(SERVICE.ALLJOBOPENINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setJobId(res_queue?.data?.jobopenings);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    fetchJob();
    fetchDepartments();
  }, []);

  const fetchAllApproveds = async (company, branch) => {
    setPageName(!pageName);
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    fetchAllApproveds();
  }, []);

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
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.APPROVEDS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let resdesreq = await axios.get(
        `${SERVICE.DESIGNATIONREQUUIREMENTS_SINGLE}/${res?.data?.sapprovevacancies?.designationuniqid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setJobOpeing({
        ...res?.data?.sapprovevacancies,
        status: "OnProgress",
        experiencefrom: resdesreq?.data?.sdesiggroupreq?.experiencefrom,
        experienceto: resdesreq?.data?.sdesiggroupreq?.experienceto,
        jobtype: "Please Select Jobtype",
        hiringmanager: "Please Select",
      });
      setTextSummary(resdesreq?.data?.sdesiggroupreq?.jobdescription);
      setJobRequire(resdesreq?.data?.sdesiggroupreq?.jobrequirements);
      setJobBenefits(resdesreq?.data?.sdesiggroupreq?.jobbenefits);
      setRoleAndRes(resdesreq?.data?.sdesiggroupreq?.rolesandres);
      setEducationValue(res?.data?.sapprovevacancies?.education);
      setValueLan(res?.data?.sapprovevacancies?.language);
      setValueSkill(res?.data?.sapprovevacancies?.skill);
      fetchAllApproveds(
        res?.data?.sapprovevacancies.company,
        res?.data?.sapprovevacancies.branch
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    getviewCode();
  }, [id]);

  const [branchAddress, setBranchAddress] = useState([]);

  const fetchAddress = async () => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.post(SERVICE.BRANCHADDRESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: String(jobopenening?.branch),
      });

      setBranchAddress(res_queue.data.branchaddress[0]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);
  const {
    isUserRoleAccess,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const username = isUserRoleAccess.username;
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.JOBOPENING_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String(
          jobopenening.status !== "" ? jobopenening.status : "OnProgress"
        ),
        recruitmentname: String(jobopenening.recruitmentname),
        joboopenid: String(newval),
        hiringmanager: String(jobopenening.hiringmanager),
        company: String(jobopenening.company),
        branch: String(jobopenening.branch),
        floor: String(jobopenening.floor),
        area: [...jobopenening.area],
        designationuniqid: String(jobopenening.designationuniqid),
        experiencefrom: String(jobopenening.experiencefrom),
        experienceto: String(jobopenening.experienceto),
        approvedseats: String(jobopenening.seats),
        designation: String(jobopenening.designation),
        education: [...educationValue],
        language: [...valueLan],
        requiredskill: [...ValueSkill],
        fromsalary: String(jobopenening.fromsalary),
        tosalary: String(jobopenening.tosalary),
        dateopened: String(jobopenening.dateopened),
        targetdate: String(jobopenening.targetdate),
        address: String(branchAddress.address),
        city: String(branchAddress.city),
        country: String(branchAddress.country),
        state: String(branchAddress.state),
        pincode: String(branchAddress.pincode),
        email: String(branchAddress.email),
        phone: String(branchAddress.phone),
        jobdescription: String(textSumm),
        jobrequirements: String(jobrequire),
        jobbenefits: String(jobBenefits),
        attachments: [...uploadfiles],
        department: String(jobopenening.department),
        jobtype: String(jobopenening.jobtype),
        remotejob: Boolean(remote),
        rolesresponse: String(roleAndRes),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      deleteApproved();
      backLPage("/recruitment/jobopenlist");
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const deleteApproved = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.delete(`${SERVICE.APPROVEDS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleSubmit = () => {
    if (
      jobopenening.recruitmentname === undefined ||
      jobopenening.recruitmentname === ""
    ) {
      setPopupContentMalert("Please Enter Recruitment Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      jobopenening.hiringmanager === undefined ||
      jobopenening.hiringmanager === "Please Select"
    ) {
      setPopupContentMalert("Please Select Hiring Manager!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      jobopenening.dateopened === undefined ||
      jobopenening.dateopened === ""
    ) {
      setPopupContentMalert("Please Select OpenDate!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      jobopenening.targetdate === undefined ||
      jobopenening.targetdate === ""
    ) {
      setPopupContentMalert("Please Select Targetdate!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      jobopenening.fromsalary === undefined ||
      jobopenening.fromsalary === ""
    ) {
      setPopupContentMalert("Please Enter From Salary!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      jobopenening.tosalary === undefined ||
      jobopenening.tosalary === ""
    ) {
      setPopupContentMalert("Please Enter To Salary!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      jobopenening.jobtype === undefined ||
      jobopenening.jobtype === "Please Select Jobtype"
    ) {
      setPopupContentMalert("Please Select Job Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
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
      <Headtitle title={"ADD JOB OPENINGS"} />

      <PageHeading
        title="Job Openings"
      // modulename="Human Resources"
      // submodulename="Recruitment"
      // mainpagename="Recruitment Planning"
      // subpagename=""
      // subsubpagename=""
      />
      <Box sx={userStyle.selectcontainer}>
        <Grid container spacing={2}>
          <Grid item md={12} sm={12} sx={12}>
            <Typography variant="h5">Job Openings</Typography>
          </Grid>
          <Grid item md={9} xs={12}></Grid>
          <Grid item md={3} sm={12} xs={12}>
            <Typography>
              Status<b style={{ color: "red" }}>*</b>
            </Typography>
            <Selects
              options={statusOptions}
              value={{
                label: jobopenening.status,
                value: jobopenening.status,
              }}
              onChange={(e) => {
                setJobOpeing({ ...jobopenening, status: e.value });
              }}
              id="component-outlined"
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
                      jobopenening.status == undefined
                        ? "OnProgress"
                        : jobopenening.status,
                  });
                }}
                value={jobopenening.recruitmentname}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            {jobId &&
              jobId.map(() => {
                let strings = "JO";
                let refNo = jobId[jobId.length - 1].joboopenid;
                let digits = (jobId.length + 1).toString();
                const stringLength = refNo.length;
                let lastChar = refNo.charAt(stringLength - 1);
                let getlastBeforeChar = refNo.charAt(stringLength - 2);
                let getlastThreeChar = refNo.charAt(stringLength - 3);
                let lastBeforeChar = refNo.slice(-2);
                let lastThreeChar = refNo.slice(-3);
                let lastDigit = refNo.slice(-4);
                let refNOINC = parseInt(lastChar) + 1;
                let refLstTwo = parseInt(lastBeforeChar) + 1;
                let refLstThree = parseInt(lastThreeChar) + 1;
                let refLstDigit = parseInt(lastDigit) + 1;
                if (
                  digits.length < 4 &&
                  getlastBeforeChar == 0 &&
                  getlastThreeChar == 0
                ) {
                  refNOINC = ("000" + refNOINC).substr(-4);
                  newval = strings + refNOINC;
                } else if (
                  digits.length < 4 &&
                  getlastBeforeChar > 0 &&
                  getlastThreeChar == 0
                ) {
                  refNOINC = ("00" + refLstTwo).substr(-4);
                  newval = strings + refNOINC;
                } else if (digits.length < 4 && getlastThreeChar > 0) {
                  refNOINC = ("0" + refLstThree).substr(-4);
                  newval = strings + refNOINC;
                } else {
                  refNOINC = refLstDigit.substr(-4);
                  newval = strings + refNOINC;
                }
              })}
            <FormControl fullWidth size="small">
              <Typography>
                Job Opening ID<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={newval}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography>
              Hiring Manager<b style={{ color: "red" }}>*</b>
            </Typography>
            <Selects
              options={hrManName}
              styles={colourStyles}
              value={{
                label: jobopenening.hiringmanager,
                value: jobopenening.hiringmanager,
              }}
              onChange={(e) => {
                setJobOpeing({ ...jobopenening, hiringmanager: e.value });
              }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Company<b style={{ color: "red" }}>*</b>
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
                Branch<b style={{ color: "red" }}>*</b>
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
                Area<b style={{ color: "red" }}>*</b>
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
                value={jobopenening.seats}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Designation<b style={{ color: "red" }}>*</b>
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
                Education<b style={{ color: "red" }}>*</b>
              </Typography>
              <TextField
                value={educationValue.join(",")}
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
                value={valueLan.join(",")}
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
                value={ValueSkill.join(",")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                From Salary<b style={{ color: "red" }}>*</b>
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
                type="date"
                id="from-date"
                value={jobopenening.dateopened}
                onChange={(e) => {
                  setJobOpeing({
                    ...jobopenening,
                    dateopened: e.target.value,
                    targetdate: "",
                  });
                  document.getElementById("to-date").min = e.target.value;
                }}
              // id="myDateInput"
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Target Date <b style={{ color: "red" }}>*</b>{" "}
              </Typography>
              <OutlinedInput
                type="date"
                id="to-date"
                value={jobopenening.targetdate}
                onChange={(e) => {
                  setJobOpeing({ ...jobopenening, targetdate: e.target.value });
                }}
                min={jobopenening.dateopened}
              />
            </FormControl>
          </Grid>
          {/* <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Target Date<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                type="date"
                value={jobopenening.targetdate}
                onChange={(e) => {
                  // setJobOpeing({ ...jobopenening, targetdate: e.target.value, dateopened: jobopenening.dateopened == undefined ? today : jobopenening.dateopened });
                  setJobOpeing({ ...jobopenening, targetdate: e.target.value});
                }}
                // id="myDate"
              />
            </FormControl>
          </Grid> */}
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Department</Typography>
              <Selects
                options={department}
                styles={colourStyles}
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
                styles={colourStyles}
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
          <Grid item md={8} xs={12}>
            {" "}
          </Grid>
          {!remote ? (
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
                    checked={remote}
                    onChange={(e) => {
                      setRemote(e.target.checked);
                    }}
                  />
                }
                label="Remote Job"
              />
            </FormGroup>
          </Grid>
          {!remote ? (
            <>
              <Grid item md={7} sx={12}></Grid>
              <Grid item md={6} xs={12}>
                <InputLabel id="demo-select-small">Address</InputLabel>
                <FormControl size="small" fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={7}
                    style={{ border: "1px solid #4a7bf7" }}
                    value={branchAddress?.address}
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
                        value={branchAddress?.city}
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
                        value={branchAddress?.state}
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
                        value={branchAddress?.country}
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
                        value={branchAddress?.pincode}
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
                        value={branchAddress?.email}
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
                        value={branchAddress?.phone}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : null}

          <Grid md={12} sm={12} xs={12}>
            <Typography variant="h6">
              <b>Description Information</b>
            </Typography>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>
                <b>Job Description </b>
              </Typography>
              <ReactQuill
                style={{ height: "180px" }}
                value={textSumm}
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
                value={jobrequire}
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
                value={jobBenefits}
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
                value={roleAndRes}
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
                                style={{
                                  fontSize: "medium",
                                  color: "#a73131",
                                  fontSize: "14px",
                                }}
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
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={buttonStyles.buttonsubmit}
              >
                Save
              </Button>
            </Grid>
            <Grid>
              <Button
                sx={buttonStyles.btncancel}
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

              onClick={handleCloseerr}
              sx={buttonStyles.buttonsubmit}
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
    </Box>
  );
};

export default Jobopening;
