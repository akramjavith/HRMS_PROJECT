import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FormGroup,
  FormControlLabel,
  TextareaAutosize,
  Box,
  Checkbox,
  Typography,
  OutlinedInput,
  TableBody,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  InputLabel,
  TableHead,
  TableContainer,
  Button,
  IconButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import "jspdf-autotable";
import Selects from "react-select";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Country, State, City } from "country-state-city";
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Cropper from "react-cropper";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Webcamimage from "../webcamprofile";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LinkIcon from "@mui/icons-material/Link";
import FolderIcon from "@mui/icons-material/Folder";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../../../services/Authservice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import moment from "moment";

const LoadingBackdrop = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <div className="pulsating-circle">
        <CircularProgress color="inherit" className="loading-spinner" />
      </div>
      <Typography
        variant="h6"
        sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
      >
        please wait...
      </Typography>
    </Backdrop>
  );
};

function Addcandidate() {
  const currentYear = new Date().getFullYear();
  const maxDate = `${currentYear - 16}-12-31`;

  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [isLoading, setIsLoading] = useState(false);
  // Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [addcandidate, setAddcandidate] = useState({
    prefix: "Mr",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    whatsapp: "",
    pannumber: "",
    adharnumber: "",
    street: "",
    city: "",
    state: "",
    postalcode: "",
    country: "",
    experience: 0,
    experienceestimation: "Years",
    qualification: "Please Select Qualification",
    currentjobtitle: "",
    currentemployer: "",
    expectedsalaryopts: "Please Select Expected Salary",
    joiningbydaysopts: "Please Select Joining By Days",
    expectedsalary: 0,
    currentsalary: 0,
    skillset: "",
    additionalinfo: "",
    linkedinid: "",
    status: "New",
    source: "Added by User",
    sourcecandidate: "Choose Source",
    educationdetails: "",
    experiencedetails: "",
    resumefile: "",
    coverletterfile: "",
    experienceletterfile: "",
    payslipletterfile: "",
    phonecheck: false,
    dateofbirth: "",
    interviewdate: "",
    time: "",
    age: "",
    otherqualification: "",
    skill: [],
    uploadedimage: "",
    uploadedimagename: "",
    files: [],
    joinbydays: 0,
    noticeperiod: 0,
    domainexperience: 0,
    domainexperienceestimation: "Years",
    gender: "Please Select Gender",
    candidatefilename: "Please Select Candidate Document",
    shortanme: "",
  });

  const [currentText, setCurrentText] = useState("");

  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef(null);

  const [file, setFile] = useState("");
  const [webfile, setwebFile] = useState("");

  //image cropping
  const handleFileSelect = (acceptedFiles) => {
    setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
  };

  const handleCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
  };

  const handleClearImage = () => {
    setFile(null);
    setGetImg(null);
    setSelectedFile(null);
    setCroppedImage(null);
    setAddcandidate({ ...addcandidate, uploadedimage: "" });
  };

  // Image Upload
  function handleChangeImage(e) {
    let uploadedimage = document.getElementById("uploadedimage");
    var path = (window.URL || window.webkitURL).createObjectURL(
      uploadedimage.files[0]
    );
    toDataURL(path, function (dataUrl) {
      uploadedimage.setAttribute("value", String(dataUrl));
      setAddcandidate({ ...addcandidate, uploadedimage: String(dataUrl) });
      return dataUrl;
    });
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };

  const [roleName, setRoleName] = useState("");
  const [experience, setexperience] = useState(0);
  const [educationDetails, setEducationDetails] = useState({
    school: "",
    department: "",
    degree: "",
    fromduration: "",
    toduration: "",
    pursuing: false,
    categoryedu: "Please Select Category",
    subcategoryedu: "Please Select Sub Category",
    specialization: "Please Select Specialization",
  });

  const genderOption = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const expectedsalaryOption = [
    { label: "Negotiable", value: "Negotiable" },
    { label: "Not provided", value: "Not provided" },
    { label: "As per company norms", value: "As per company norms" },
  ];

  const joiningbydaysOption = [
    { label: "Anytime", value: "Anytime" },
    { label: "Immediate", value: "Immediate" },
    { label: "Unknown", value: "Unknown" },
    { label: "None", value: "None" },
  ];

  const [btnSubmit, setBtnSubmit] = useState(false);

  const [btnSubmitDuplicate, setBtnSubmitDuplicate] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(null);

  const [educationtodo, setEducationtodo] = useState([]);
  // warn
  const [experienceDetails, setExperienceDetails] = useState({
    occupation: "",
    company: "",
    summary: "",
    fromduration: "",
    toduration: "",
    currentlyworkhere: false,
  });
  const [experiencetodo, setExperiencetodo] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);

  // Country city state datas
  const [selectedCountry, setSelectedCountry] = useState(
    Country.getAllCountries().find((country) => country.name === "India")
  );
  const [selectedState, setSelectedState] = useState(
    State.getStatesOfCountry(selectedCountry?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    )
  );
  const [selectedCity, setSelectedCity] = useState(
    City.getCitiesOfState(
      selectedState?.countryCode,
      selectedState?.isoCode
    ).find((city) => city.name === "Tiruchirappalli")
  );

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
    setBtnSubmitDuplicate(false);
    setIsLoading(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const getPhoneNumber = () => {
    if (addcandidate.phonecheck) {
      setAddcandidate({ ...addcandidate, whatsapp: addcandidate.mobile });
    } else {
      setAddcandidate({ ...addcandidate, whatsapp: "" });
    }
  };
  useEffect(() => {
    getPhoneNumber();
  }, [addcandidate.phonecheck]);

  const [designations, setDesignations] = useState([]);

  //get all Areas.
  const fetchCandidatedocumentdropdowns = async (name) => {
    try {
      let res_candidate = await axios.get(SERVICE.CANDIDATEDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_candidate.data.candidatedocuments.filter(
        (data) => data.designation === name
      );

      const desigall = [
        ...data_set.reduce((acc, curr) => {
          if (
            !acc.some(
              (item) => item.candidatefilename === curr.candidatefilename
            )
          ) {
            acc.push({
              ...curr,
              label: curr.candidatefilename,
              value: curr.candidatefilename,
            });
          }
          return acc;
        }, []),
      ];

      setDesignations(desigall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [selectedCertification, setSelectedCertification] = useState([]);
  let [valueCertification, setValueCertification] = useState("");

  const handleCertficationChange = (options) => {
    setValueCertification(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCertification(options);
  };

  const renderValueCertification = (valueCertification, _skill) => {
    return valueCertification.length
      ? valueCertification.map(({ label }) => label).join(", ")
      : "Please select Certification";
  };

  const [certification, setCertification] = useState([]);

  const fetchCertification = async () => {
    try {
      let res_queue = await axios.get(SERVICE.CERTIFICATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data = res_queue?.data?.certifications?.map((t) => ({
        ...t,
        label: t.name,
        value: t.name,
      }));
      setCertification([...data, { label: "Other", value: "Other" }]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //education
  const fetchCategoryEducation = async () => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_category.data.educationcategory.map(
        (d) => d.categoryname
      );
      let filter_opt = [...new Set(data_set)];
      setCategorys(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchCategoryBased = async (e) => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.educationcategory.filter((data) => {
        return data.categoryname === e.value;
      });

      let get = data_set[0].subcategoryname.map((data) => ({
        label: data,
        value: data,
      }));

      setSubcategorys(get);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //inbetween dates

  const [showAlertBetween, setShowAlertBetween] = useState();
  const [isErrorOpenBetween, setIsErrorOpenBetween] = useState(false);
  const handleClickOpenBetween = () => {
    setIsErrorOpenBetween(true);
    setBtnSubmit(false);
    setBtnSubmitDuplicate(false);
    setIsDuplicate(true);
  };
  const handleCloseBetween = () => {
    setIsErrorOpenBetween(false);
  };
  //duplicatepopup

  const [showAlertDuplicate, setShowAlertDuplicate] = useState();
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const handleClickOpenDuplicate = () => {
    setIsDuplicateOpen(true);
    setBtnSubmit(false);
    setBtnSubmitDuplicate(false);
    setIsDuplicate(true);
  };
  const handleCloseDuplicate = () => {
    setIsDuplicateOpen(false);
  };

  const fetchEducation = async (e) => {
    try {
      let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res?.data?.educationspecilizations.filter((data) => {
        return (
          data?.category?.includes(educationDetails?.categoryedu) &&
          data?.subcategory?.includes(e.value)
        );
      });

      let result = data_set[0]?.specilizationgrp?.map((data) => ({
        label: data?.label,
        value: data?.label,
      }));

      setEducationsOpt(result);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [skill, setSkill] = useState([]);
  const fetchAllSkill = async () => {
    try {
      let res_queue = await axios.get(SERVICE.SKILLSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSkill(
        res_queue?.data?.skillsets?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchAllSkill();
    fetchCertification();
    // fetchCandidatedocumentdropdowns();
    fetchCategoryEducation();
    fetchOverAllSettings();
    fetchAllVisitors();
    window.scrollTo(0, 0);
  }, []);

  const [selectedOptionsEduCate, setSelectedOptionsEduCate] = useState([]);
  let [valueEduCate, setValueEduCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueEduCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEduCate(options);
  };

  const customValueRendererEduCate = (valueEduCate, _categorys) => {
    return valueEduCate.length
      ? valueEduCate.map(({ label }) => label).join(", ")
      : "Please Select Category";
  };

  // Subcategroy multi select
  const [selectedOptionsEduSubCate, setSelectedEduOptionsSubCate] = useState(
    []
  );
  let [valueEduSubCate, setValueEduSubCate] = useState("");

  const handleEduSubCategoryChange = (options) => {
    setValueEduSubCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEduOptionsSubCate(options);
  };

  const customValueRendererEduSubCate = (valueSubCate, _subcategorys) => {
    return valueSubCate.length
      ? valueSubCate.map(({ label }) => label).join(", ")
      : "Please Select Subcategory";
  };

  // Specialization
  // This line muliti select Education
  const [selectedOptionsEdu, setSelectedOptionsEdu] = useState([]);
  let [valueEdu, setValueEdu] = useState("");

  const handleEducationChange = (options) => {
    setValueEdu(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEdu(options);
  };

  const customValueRendererEdu = (valueEdu, _educations) => {
    return valueEdu.length
      ? valueEdu.map(({ label }) => label).join(", ")
      : "Please Select Specialization";
  };

  const [selectedskill, setSelectedSkill] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleSkilChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSkill(options);
  };

  const renderValueSkill = (valueCate, _skill) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select";
  };
  let alleduarr = [];

  const { isUserRoleCompare, allProjects, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth, setAuth } = useContext(AuthContext);
  const [queueCheck, setQueueCheck] = useState(false);

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const backPage = useNavigate();

  const ids = useParams().id;

  const [jobOpeningDetails, setJobOpeningDetails] = useState({});
  const [daysCount, setDaysCount] = useState("NA");

  const getinfoCode = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(`${SERVICE.DESIGNATIONREQUIREMENTS}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let desigReq = res2?.data?.designationreq;

      let foundData = desigReq?.find(
        (data) => data?.designation == res1?.data?.sjobopening?.designation
      );

      if (foundData?.dayscount) {
        setDaysCount(foundData?.dayscount);
      } else {
        setDaysCount("NA");
      }

      setJobOpeningDetails(res1?.data?.sjobopening);

      setRoleName(res1?.data?.sjobopening?.recruitmentname);
      await fetchCandidatedocumentdropdowns(
        res1?.data?.sjobopening.designation
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    getinfoCode();
  }, [ids]);

  // candidate document
  const renderFilePreviewCandidate = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileCandidateDelete = (index) => {
    setTodoscheck((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDelete = (index) => {
    setResumeFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreviewcover = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeletecover = (index) => {
    setCoverletter((prevFiles) => prevFiles.filter((_, i) => i !== index));
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

  const handleFileDeleteexp = (index) => {
    setExperienceletter((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileDeletepayslip = (index) => {
    setPayslipletter((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const educationTodo = () => {
    if (
      educationDetails.categoryedu == "Please Select Category" ||
      educationDetails.categoryedu == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      educationDetails.subcategoryedu == "Please Select Sub Category" ||
      educationDetails.subcategoryedu == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Category!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      educationDetails.specialization == "Please Select Specialization" ||
      educationDetails.specialization == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Specialization!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (educationDetails.school == "") {
      setShowAlert("Please Enter School field!");
      handleClickOpenerr();
    } else if (educationDetails.department == "") {
      setShowAlert("Please Enter Department field!");
      handleClickOpenerr();
    }
    // else if (educationDetails.degree == "") {
    //   setShowAlert("Please Enter Degree field!");
    //   handleClickOpenerr();
    // }
    else if (educationDetails !== "") {
      setEducationtodo([...educationtodo, educationDetails]);
      setEducationDetails({
        school: "",
        department: "",
        degree: "",
        fromduration: "",
        toduration: "",
        pursuing: false,
        categoryedu: "Please Select Category",
        subcategoryedu: "Please Select Sub Category",
        specialization: "Please Select Specialization",
      });
      setEducationsOpt([]);
      setSubcategorys([]);
    }
  };
  const educationTodoremove = (index) => {
    const newTasks = [...educationtodo];
    newTasks.splice(index, 1);
    setEducationtodo(newTasks);
  };

  const experienceTodo = () => {
    if (experienceDetails.occupation == "") {
      setShowAlert("Please Enter Occupation  field!");
      handleClickOpenerr();
    } else if (experienceDetails.company == "") {
      setShowAlert("Please Enter Company field!");
      handleClickOpenerr();
    } else if (experienceDetails !== "") {
      setExperiencetodo([...experiencetodo, experienceDetails]);
      setExperienceDetails({
        occupation: "",
        company: "",
        summary: "",
        fromduration: "",
        toduration: "",
        currentlyworkhere: false,
      });
    }
  };
  const experienceTodoremove = (index) => {
    const newTasks = [...experiencetodo];
    newTasks.splice(index, 1);
    setExperiencetodo(newTasks);
  };

  const candidateOption = [
    { label: "New", value: "New" },
    { label: "Existing", value: "Existing" },
  ];

  const sourceOption = [
    { label: "Added by User", value: "Added by User" },
    { label: "Added by HR", value: "Added by HR" },
    { label: "Added by Admin", value: "Added by Admin" },
  ];

  const sourcecandidateOption = [
    { label: "Walk-in", value: "Walk-in" },
    { label: "Email", value: "Email" },
    { label: "Employee Referral", value: "Employee Referral" },
    { label: "Advertisement", value: "Advertisement" },
    { label: "Job fair", value: "Job fair" },
    { label: "Job Portal", value: "Job Portal" },
    { label: "Website", value: "Website" },
    { label: "Social Media", value: "Social Media" },
  ];

  // Todo list

  const [todoscheck, setTodoscheck] = useState([]);

  const handleCreateTodocheck = (data, filename) => {
    const newTodocheck = {
      ...data,
      candidatefilename: filename,
    };
    setTodoscheck((prevTodos) => [...prevTodos, newTodocheck]);
  };

  const handleCandidateUpload = (event) => {
    if (
      todoscheck.some(
        (data) => data.candidatefilename === addcandidate.candidatefilename
      )
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`${addcandidate.candidatefilename} Already Exists`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const candidate = event.target.files;

      for (let i = 0; i < candidate.length; i++) {
        const reader = new FileReader();
        const file = candidate[i];
        reader.readAsDataURL(file);

        let hello = (reader.onload = () => {
          let casesensitivefirstname = addcandidate.firstname
            ?.replace(/\s+/g, "")
            ?.toLowerCase();
          let casesensitivelastname = addcandidate.lastname
            ?.replace(/\s+/g, "")
            ?.toLowerCase();
          let extension = file.name.split(".").pop();
          handleCreateTodocheck(
            {
              candidatefilename: addcandidate.candidatefilename,
              name: `${casesensitivefirstname}_${casesensitivelastname}_${addcandidate?.shortname}.${extension}`,
              preview: reader.result,
              data: reader.result.split(",")[1],
              remark: "candidate file",
              uploadedby: "employee",
              shortname: addcandidate?.shortname,
            },
            addcandidate.candidatefilename
          );
        });
      }
    }
  };
  const handleCandidateUploadSingle = (event) => {
    if (
      todoscheck.some(
        (data) => data.candidatefilename === addcandidate.candidatefilename
      )
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`${addcandidate.candidatefilename} Already Exists`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const uniqueId = uuidv4();
      let casesensitivefilename = addcandidate.candidatefilename
        .replace(/\s+/g, "")
        .toLowerCase();
      handleCreateTodocheck(
        {
          candidatefilename: addcandidate.candidatefilename,
          name: "",
          preview: "",
          data: "",
          remark: "candidate file",
          link: `${BASE_URL}/uploaddocument/single/${casesensitivefilename}/${uniqueId}`,
          uniqueid: uniqueId,
          linkname: `${addcandidate.candidatefilename} Upload Link`,
          csfilname: casesensitivefilename,
          uploadedby: "",
          shortname: addcandidate?.shortname,
        },
        addcandidate.candidatefilename
      );
    }
  };
  const handleCandidateUploadSingleAll = (alloptions) => {
    setTodoscheck([]);
    alloptions.forEach((filename) => {
      const uniqueId = uuidv4();
      let casesensitivefilename = filename?.value
        .replace(/\s+/g, "")
        .toLowerCase();
      handleCreateTodocheck(
        {
          candidatefilename: filename?.value,
          name: "",
          preview: "",
          data: "",
          remark: "candidate file",
          link: `${BASE_URL}/uploaddocument/all/${casesensitivefilename}/${uniqueId}`,
          uniqueid: uniqueId,
          linkname: `All Files Upload Link`,
          csfilname: casesensitivefilename,
          uploadedby: "",
          shortname: filename?.shortname,
        },
        filename?.value
      );
    });
  };

  const handleCandidateUploadSingleExternalAll = (alloptions) => {
    setTodoscheck([]);
    alloptions.forEach((filename) => {
      const uniqueId = uuidv4();
      let casesensitivefilename = filename?.value
        .replace(/\s+/g, "")
        .toLowerCase();
      handleCreateTodocheck(
        {
          candidatefilename: filename?.value,
          name: "",
          preview: "",
          data: "",
          remark: "candidate file",
          link: `http://hihrms.ttsbusinessservices.com/uploaddocument/all/${casesensitivefilename}/${uniqueId}`,
          uniqueid: uniqueId,
          linkname: `All Files Upload Link`,
          csfilname: casesensitivefilename,
          uploadedby: "",
          shortname: filename?.shortname,
        },
        filename?.value
      );
    });
  };

  const [resumefiles, setResumeFiles] = useState([]);

  const handleResumeUpload = (event) => {
    const resume = event.target.files;

    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setResumeFiles((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "resume file",
          },
        ]);
      };
    }
  };

  const [coverletter, setCoverletter] = useState([]);

  const handleCoverletterUpload = (event) => {
    const cover = event.target.files;

    for (let i = 0; i < cover.length; i++) {
      const reader = new FileReader();
      const file = cover[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setCoverletter((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "cover letter",
          },
        ]);
      };
    }
  };

  const [experienceletter, setExperienceletter] = useState([]);

  const handleExperienceletterUpload = (event) => {
    const experience = event.target.files;

    for (let i = 0; i < experience.length; i++) {
      const reader = new FileReader();
      const file = experience[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setExperienceletter((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "Experience letter",
          },
        ]);
      };
    }
  };

  const [payslipletter, setPayslipletter] = useState([]);

  const handlePayslipletterUpload = (event) => {
    const payslip = event.target.files;

    for (let i = 0; i < payslip.length; i++) {
      const reader = new FileReader();
      const file = payslip[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPayslipletter((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "Pay slip letter",
          },
        ]);
      };
    }
  };

  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const usernameaddedby = isUserRoleAccess?.username;

  // const [todos, setTodos] = useState([]);

  let name = "create";

  const sendRequest = async () => {
    let certi = selectedCertification.map((item) => item.value);
    try {
      let res_queue = await axios.post(SERVICE.CANDIDATES_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        prefix: String(addcandidate.prefix),
        firstname: String(addcandidate.firstname),
        lastname: String(addcandidate.lastname),
        fullname: String(addcandidate.firstname + " " + addcandidate.lastname),
        email: String(addcandidate.email),
        mobile: Number(addcandidate.mobile),
        whatsapp: Number(addcandidate.whatsapp),
        phonecheck: Boolean(addcandidate.phonecheck),
        adharnumber: Number(addcandidate.adharnumber),
        pannumber: String(addcandidate.pannumber),
        age: Number(addcandidate.age),
        dateofbirth: String(addcandidate.dateofbirth),
        interviewdate: String(addcandidate.interviewdate),
        time: String(addcandidate.time),
        street: String(addcandidate.street),
        // city: String(addcandidate.city),
        // state: String(addcandidate.state),
        // country: String(addcandidate.country),
        country: String(selectedCountry?.name),
        state: String(selectedState?.name),
        city: String(selectedCity?.name),
        postalcode: Number(addcandidate.postalcode),
        experience: Number(addcandidate.experience),
        experienceestimation: String(addcandidate.experienceestimation),
        domainexperienceestimation: String(
          addcandidate.domainexperienceestimation
        ),
        expectedsalaryopts: String(addcandidate?.expectedsalaryopts),
        joiningbydaysopts: String(addcandidate?.joiningbydaysopts),
        domainexperience: Number(addcandidate.domainexperience),
        joinbydays: Number(addcandidate.joinbydays),
        noticeperiod: Number(addcandidate.noticeperiod),
        certification: certi,
        uploadedimage:
          getImg !== null && getImg !== undefined
            ? getImg
            : addcandidate.uploadedimage == null
            ? ""
            : String(addcandidate.uploadedimage),
        uploadedimagename: String(addcandidate.uploadedimagename),
        files: addcandidate.files,
        gender: addcandidate.gender,

        education: [...alleduarr],
        // qualification: [...valueEdu],

        // categoryedu: String(addcandidate.categoryedu),
        // subcategoryedu: String(addcandidate.subcategoryedu),
        // specialization: String(addcandidate.specialization),

        category: [...valueEduCate],
        subcategory: [...valueEduSubCate],
        otherqualification: String(addcandidate.otherqualification),
        currentjobtitle: String(addcandidate.currentjobtitle),
        currentemployer: String(addcandidate.currentemployer),
        expectedsalary: String(addcandidate.expectedsalary),
        currentsalary: String(addcandidate.currentsalary),
        skillset: String(addcandidate.skillset),
        additionalinfo: String(addcandidate.additionalinfo),
        linkedinid: String(addcandidate.linkedinid),
        status: String(addcandidate.status),
        source: String(addcandidate.source),
        sourcecandidate: String(addcandidate.sourcecandidate),
        resumefile: [...resumefiles],
        coverletterfile: [...coverletter],
        // candidatedatafile: [...todoscheck],
        candidatedatafile: [...todoscheck],
        coverlettertext: currentText,
        experienceletterfile: [...experienceletter],
        payslipletterfile: [...payslipletter],

        educationdetails: [...educationtodo],
        experiencedetails: [...experiencetodo],
        skill: [...valueCate],
        jobopeningsid: String(ids),
        overallstatus: "Applied",
        addedby: [
          {
            name: String(usernameaddedby),
            date: String(new Date()),
          },
        ],
        role: String(roleName),
        today: String(today),
      });

      setQueueCheck(true);
      setAddcandidate({
        prefix: "Mr",
        firstname: "",
        lastname: "",
        email: "",
        mobile: "",
        whatsapp: "",
        pannumber: "",
        adharnumber: "",
        street: "",
        city: "",
        state: "",
        postalcode: "",
        country: "",
        experience: 0,
        domainexperience: 0,
        experienceestimation: "Years",
        domainexperienceestimation: "Years",
        qualification: "Please Select Qualification",
        currentjobtitle: "",
        currentemployer: "",
        expectedsalary: "",
        currentsalary: "",
        skillset: "",
        additionalinfo: "",
        linkedinid: "",
        status: "New",
        source: "Added by User",
        sourcecandidate: "Choose Source",
        educationdetails: "",
        experiencedetails: "",
        resumefile: "",
        coverletterfile: "",
        experienceletterfile: "",
        payslipletter: "",
        dateofbirth: "",
        interviewdate: "",
        time: "",
        age: "",
        otherqualification: "",
        phonecheck: false,
      });
      setEducationtodo([]);
      setExperiencetodo([]);
      setEducationDetails({
        school: "",
        department: "",
        degree: "",
        fromduration: "",
        toduration: "",
        pursuing: false,
        subcategoryedu: "Please Select Sub Category",
        specialization: "Please Select Specialization",
        categoryedu: "Please Select Category",
      });
      setExperienceDetails({
        occupation: "",
        company: "",
        summary: "",
        fromduration: "",
        toduration: "",
        currentlyworkhere: false,
      });
      setResumeFiles([]);
      setCoverletter([]);
      setExperienceletter([]);
      setPayslipletter([]);
      setEducationtodo([]);
      setExperiencetodo([]);
      setValueCate([]);
      setBtnSubmit(false);

      backPage(`/company/recuritment/${ids}`);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      setBtnSubmit(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleClear = () => {
    setAddcandidate({
      prefix: "Mr",
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      whatsapp: "",
      pannumber: "",
      adharnumber: "",
      street: "",
      city: "",
      state: "",
      postalcode: "",
      country: "",
      qualification: "Please Select Qualification",
      expectedsalaryopts: "Please Select Expected Salary",
      joiningbydaysopts: "Please Select Joining By Days",
      currentjobtitle: "",
      currentemployer: "",
      expectedsalary: 0,
      currentsalary: 0,
      skillset: "",
      additionalinfo: "",
      linkedinid: "",
      status: "New",
      source: "Added by User",
      sourcecandidate: "Choose Source",
      educationdetails: "",
      experiencedetails: "",
      resumefile: "",
      coverletterfile: "",
      experienceletterfile: "",
      payslipletterfile: "",
      dateofbirth: "",
      interviewdate: "",
      time: "",
      age: "",
      otherqualification: "",
      phonecheck: false,

      joinbydays: 0,
      noticeperiod: 0,
      experience: 0,
      domainexperience: 0,
      experienceestimation: "Years",
      domainexperienceestimation: "Years",
      gender: "Please Select Gender",
      candidatefilename: "Please Select Candidate Document",
      shortname: "",
    });
    setCurrentText("");
    setexperience(0);
    setCoverletter([]);
    setResumeFiles([]);
    setTodoscheck([]);
    setSubcategorys([]);
    setEducationsOpt([]);
    setExperienceletter([]);
    setPayslipletter([]);
    setEducationtodo([]);
    setExperiencetodo([]);
    setSelectedOptionsEdu([]);
    setValueEdu([]);
    setSelectedEduOptionsSubCate([]);
    setValueEduSubCate([]);
    setSelectedOptionsEduCate([]);
    setValueEduCate([]);
    setEducationsOpt([]);
    setSubcategorys([]);
    setEducationDetails({
      school: "",
      department: "",
      degree: "",
      fromduration: "",
      toduration: "",
      pursuing: false,
      categoryedu: "Please Select Category",
      subcategoryedu: "Please Select Sub Category",
      specialization: "Please Select Specialization",
    });
    setExperienceDetails({
      occupation: "",
      company: "",
      summary: "",
      fromduration: "",
      toduration: "",
      currentlyworkhere: false,
    });
    setShowAlert(
      <>
        {/* <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        /> */}
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  const [jobApplyDays, setJobApplyDays] = useState();
  const [contactEmail, setContactEmail] = useState("");
  const [allcandidates, setAllCandidates] = useState("");

  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setJobApplyDays(res?.data?.overallsettings[0].jobapplydays);
      setContactEmail(res?.data?.overallsettings[0]?.contactemail);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Error Popup model
  const [isErrorOpendupe, setIsErrorOpendupe] = useState(false);
  const [showAlertdupe, setShowAlertdupe] = useState();
  const handleClickOpenerrdupe = () => {
    setIsErrorOpendupe(true);
  };
  const handleCloseerrdupe = () => {
    setIsLoading(false);
    setIsErrorOpendupe(false);
  };

  const [CheckDup, setCheckDup] = useState(true);

  const handleSubmit = async (e) => {
    setBtnSubmit(true);
    setIsLoading(true);

    if (CheckDup) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Check Duplicate!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addcandidate.firstname == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter First Name!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addcandidate.lastname == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Last Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addcandidate.gender == "Please Select Gender" ||
      addcandidate.gender == "" ||
      addcandidate.gender == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Gender"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addcandidate.email == "" || addcandidate.email == undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addcandidate.email && !isValidEmail(addcandidate.email)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (addcandidate.mobile == "" || addcandidate.mobile == undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Mobile No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addcandidate.mobile.length > 0 &&
      addcandidate.mobile.length < 10
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please enter a 10-digit mobile number!."}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addcandidate.whatsapp.length > 0 &&
      addcandidate.whatsapp.length < 10
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please enter a 10-digit whatsapp number!."}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (addcandidate.experience != "" &&
        addcandidate.experience > 0 &&
        addcandidate.currentsalary == "") ||
      0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Current Salary"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (addcandidate.experience != "" &&
        addcandidate.experience > 0 &&
        addcandidate.noticeperiod == 0) ||
      0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Notice Period Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (resumefiles == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Upload Resume"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addcandidate.adharnumber.length > 0 &&
      addcandidate.adharnumber.length < 12
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please enter a 12-digit Adhaar number!."}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addcandidate.pannumber.length > 0 &&
      addcandidate.pannumber.length < 10
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please enter a valid Pan number!."}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedCountry?.isoCode !== selectedState?.countryCode) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select The Correct State"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      selectedCountry?.isoCode !== selectedCity?.countryCode ||
      selectedState?.isoCode !== selectedCity?.stateCode
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select The Correct City"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      fetchAllCandidates();
      // sendRequest();
    }
  };


  const [allVisitors, setAllVisitors] = useState([])

  const fetchAllVisitors = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VISITORSFORCANDIDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllVisitors(res_vendor?.data?.visitors)
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchAllCandidates = async () => {
    setBtnSubmit(false);
    try {
      let res = await axios.get(SERVICE.CANDIDATESALLBYRESTRICTION);

      let allcandidates = res?.data?.candidates.slice().sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      let foundData = allcandidates?.find((data) => {
        return (
          data.fullname?.toLowerCase() ===
            String(
              addcandidate.firstname + " " + addcandidate.lastname
            )?.toLowerCase() &&
          data.email?.toLowerCase() ===
            String(addcandidate.email)?.toLowerCase() &&
          data.mobile == addcandidate.mobile
        );
      });

      const visitorAlreadyexists = allVisitors?.filter((vist) => vist?.interactorstatus !== "addresume").some(item =>
        item?.visitorname?.replace(/\s+/g, '').toLowerCase() === (addcandidate.firstname + "" + addcandidate.lastname)?.toLowerCase()
      );

      if (foundData) {
        if (daysCount !== "NA") {
          const datesAdded = new Date(foundData?.createdAt);
          datesAdded.setDate(datesAdded.getDate() + Number(daysCount));
          datesAdded.setHours(0, 0, 0, 0); // Set time to midnight

          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set time to midnight

          const showApplyValue = datesAdded <= currentDate;

          if (showApplyValue) {
            setIsLoading(false);
            setShowAlertDuplicate(
              <>
                <ErrorOutlineOutlinedIcon
                  style={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                  Previous application for the candidate as{" "}
                  <span
                    style={{
                      color: "#1565c0",
                      fontWeight: "900",
                      marginLeft: "10px",
                    }}
                  >
                    {jobOpeningDetails?.designation}
                  </span>{" "}
                  accepted over{" "}
                  <span
                    style={{
                      color: "#1565c0",
                      fontWeight: "900",
                      marginLeft: "10px",
                    }}
                  >
                    {daysCount}
                  </span>{" "}
                  days. Would you like to submit again?
                </p>
              </>
            );
            handleClickOpenDuplicate();
          } else {
            setIsLoading(false);
            setShowAlertBetween(
              <>
                <ErrorOutlineOutlinedIcon
                  style={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                  You are Already Applied. It is on Screening Position. If any
                  Queries contact{" "}
                  <span style={{ color: "#1976D2" }}>{contactEmail}</span>
                </p>
              </>
            );
            handleClickOpenBetween();
          }
        } else {
          const datesAdded = new Date(foundData?.createdAt);
          datesAdded.setDate(datesAdded.getDate() + jobApplyDays);
          datesAdded.setHours(0, 0, 0, 0); // Set time to midnight

          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set time to midnight

          const showApplyValue = datesAdded <= currentDate;

          if (showApplyValue) {
            setIsLoading(false);
            setShowAlertDuplicate(
              <>
                <ErrorOutlineOutlinedIcon
                  style={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                  The Same Candidate is Already Exists/Rejected!. Do you wish to
                  Submit Again?
                </p>
              </>
            );
            handleClickOpenDuplicate();
          } else {
            setIsLoading(false);
            setShowAlertBetween(
              <>
                <ErrorOutlineOutlinedIcon
                  style={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                  You are Already Applied. It is on Screening Position. If any
                  Queries contact{" "}
                  <span style={{ color: "#1976D2" }}>{contactEmail}</span>
                </p>
              </>
            );
            handleClickOpenBetween();
          }
        }
      } else {
        let foundDataNew = allcandidates.find((data) => {
          return (
            data.email?.toLowerCase() ===
            String(addcandidate?.email)?.toLowerCase()
          );
        });

        if (foundDataNew) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                style={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                Email Already Exist!
              </p>
            </>
          );
          handleClickOpenerr();
        } else {
          let foundDataMob = allcandidates.find((data) => {
            return data.mobile == addcandidate.mobile;
          });
          if (foundDataMob) {
            setShowAlert(
              <>
                <ErrorOutlineOutlinedIcon
                  style={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                  Mobile Already Exist!
                </p>
              </>
            );
            handleClickOpenerr();
          } else {
            let foundDataadhaar;
            if (addcandidate.adharnumber !== "") {
              foundDataadhaar = allcandidates.find((data) => {
                return data.adharnumber == addcandidate.adharnumber;
              });
            }

            if (foundDataadhaar) {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon
                    style={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    Adhaar Already Exist!
                  </p>
                </>
              );
              handleClickOpenerr();
            } else {
              let foundDataPan;
              if (addcandidate?.pannumber !== "") {
                foundDataPan = allcandidates?.find((data) => {
                  return data.pannumber == addcandidate.pannumber;
                });
              }

              if (foundDataPan) {
                setShowAlert(
                  <>
                    <ErrorOutlineOutlinedIcon
                      style={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                      Pan Number Already Exist!
                    </p>
                  </>
                );
                handleClickOpenerr();
              } else if (visitorAlreadyexists) {
                setShowAlert(
                  <>
                    <ErrorOutlineOutlinedIcon
                      style={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                      Candidate Exist In Visitor List!
                    </p>
                  </>
                );
                handleClickOpenerr();

              } else {
                sendRequest();
              }
            }
          }
        }
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const buttonStyles = {
    default: {
      backgroundColor: "primary.main",
    },
    duplicate: {
      backgroundColor: "red",
      "&:hover": {
        backgroundColor: "darkred",
      },
    },
    noDuplicate: {
      backgroundColor: "green",
      "&:hover": {
        backgroundColor: "darkgreen",
      },
    },
  };

  const [duplicateValues, setDuplicateValues] = useState([]);

  const checkDuplicateFunction = async () => {
    setBtnSubmitDuplicate(true);
    // setIsLoading(true);
    try {
      if (addcandidate.firstname == "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter First Name!"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (addcandidate.lastname == "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Last Name"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (addcandidate.email == "" || addcandidate.email == undefined) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Email"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (addcandidate.email && !isValidEmail(addcandidate.email)) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Valid Email"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        addcandidate.mobile == "" ||
        addcandidate.mobile == undefined
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Mobile No"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        addcandidate.mobile.length > 0 &&
        addcandidate.mobile.length < 10
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please enter a 10-digit mobile number!."}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        addcandidate.adharnumber?.length > 0 &&
        addcandidate.adharnumber?.length < 12
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Valid Adhaar Number"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        addcandidate.pannumber?.length > 0 &&
        addcandidate.pannumber?.length < 10
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Valid Pan Number"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        let res = await axios.get(SERVICE.CANDIDATESALLBYRESTRICTION);

        let allcandidates = res?.data?.candidates.slice().sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        let foundData = allcandidates?.find((data) => {
          return (
            data.fullname?.toLowerCase() ===
              String(
                addcandidate.firstname + " " + addcandidate.lastname
              )?.toLowerCase() &&
            data.email?.toLowerCase() ===
              String(addcandidate.email)?.toLowerCase() &&
            data.mobile == addcandidate.mobile
          );
        });

        if (foundData) {
          if (daysCount !== "NA") {
            const datesAdded = new Date(foundData?.createdAt);
            datesAdded.setDate(datesAdded.getDate() + Number(daysCount));
            datesAdded.setHours(0, 0, 0, 0); // Set time to midnight

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to midnight

            const showApplyValue = datesAdded <= currentDate;

            if (showApplyValue) {
              setIsLoading(false);
              setShowAlertDuplicate(
                <>
                  <ErrorOutlineOutlinedIcon
                    style={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    Previous application for the candidate as{" "}
                    <span
                      style={{
                        color: "#1565c0",
                        fontWeight: "900",
                        marginLeft: "10px",
                      }}
                    >
                      {jobOpeningDetails?.designation}
                    </span>{" "}
                    accepted over{" "}
                    <span
                      style={{
                        color: "#1565c0",
                        fontWeight: "900",
                        marginLeft: "10px",
                      }}
                    >
                      {daysCount}
                    </span>{" "}
                    days. Would you like to submit again?
                  </p>
                </>
              );
              handleClickOpenDuplicate();
            } else {
              setIsLoading(false);
              setShowAlertBetween(
                <>
                  <ErrorOutlineOutlinedIcon
                    style={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    You are Already Applied. It is on Screening Position. If any
                    Queries contact{" "}
                    <span style={{ color: "#1976D2" }}>{contactEmail}</span>
                  </p>
                </>
              );
              handleClickOpenBetween();
            }
          } else {
            const datesAdded = new Date(foundData?.createdAt);
            datesAdded.setDate(datesAdded.getDate() + jobApplyDays);
            datesAdded.setHours(0, 0, 0, 0); // Set time to midnight

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to midnight

            const showApplyValue = datesAdded <= currentDate;

            if (showApplyValue) {
              setIsLoading(false);
              setShowAlertDuplicate(
                <>
                  <ErrorOutlineOutlinedIcon
                    style={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    The Same Candidate is Already Exists/Rejected!. Do you wish
                    to Submit Again?
                  </p>
                </>
              );
              handleClickOpenDuplicate();
            } else {
              setIsLoading(false);
              setShowAlertBetween(
                <>
                  <ErrorOutlineOutlinedIcon
                    style={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    You are Already Applied. It is on Screening Position. If any
                    Queries contact{" "}
                    <span style={{ color: "#1976D2" }}>{contactEmail}</span>
                  </p>
                </>
              );
              handleClickOpenBetween();
            }
          }
        } else {
          let duplicates = [];

          let foundDataName = allcandidates.find(
            (data) =>
              data.fullname?.toLowerCase() ===
              String(addcandidate.firstname?.toLowerCase()) +
                " " +
                String(addcandidate.lastname?.toLowerCase())
          );
          if (foundDataName && addcandidate.firstname + addcandidate.lastname) {
            duplicates.push({
              field: "Name",
              value:
                addcandidate.firstname +
                " " +
                addcandidate.lastname +
                " " +
                `(Role: ${foundDataName.role}, Applied Date: ${moment(
                  foundDataName.createdAt
                ).format("DD-MM-YYYY")})`,
              id: foundDataName?._id,
            });
          }

          let foundDataNew = allcandidates.find(
            (data) => data.email === String(addcandidate.email)
          );
          if (foundDataNew && addcandidate.email) {
            duplicates.push({
              field: "Email",
              value: addcandidate.email,
              id: foundDataNew?._id,
            });
          }

          let foundDataMob = allcandidates.find(
            (data) => data.mobile == addcandidate.mobile
          );
          if (foundDataMob && addcandidate.mobile) {
            duplicates.push({
              field: "Mobile",
              value: addcandidate.mobile,
              id: foundDataMob?._id,
            });
          }

          let foundDataDob = allcandidates.find(
            (data) => data.dateofbirth == addcandidate.dateofbirth
          );
          if (foundDataDob && addcandidate.dateofbirth) {
            duplicates.push({
              field: "DOB",
              value: moment(addcandidate.dateofbirth).format("DD-MM-YYYY"),
              id: foundDataDob?._id,
            });
          }

          let foundDataadhaar;
          if (addcandidate.adharnumber) {
            foundDataadhaar = allcandidates.find(
              (data) => data.adharnumber == addcandidate.adharnumber
            );
            if (foundDataadhaar) {
              duplicates.push({
                field: "Adhaar",
                value: addcandidate.adharnumber,
                id: foundDataadhaar?._id,
              });
            }
          }

          let foundDataPan;
          if (addcandidate.pannumber) {
            foundDataPan = allcandidates.find(
              (data) => data.pannumber == addcandidate.pannumber
            );
            if (foundDataPan) {
              duplicates.push({
                field: "Pan Number",
                value: addcandidate.pannumber,
                id: foundDataPan?._id,
              });
            }
          }

          setDuplicateValues(duplicates);

          if (duplicates.length > 0) {
            setIsDuplicate(null);
            setBtnSubmitDuplicate(false);
            setCheckDup(false);
            setShowAlertdupe(
              <>
                <Typography
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  Duplicate Entry
                  <Button onClick={handleCloseerrdupe}>
                    <CloseIcon color="black" />
                  </Button>
                </Typography>
                <div>
                  <Table style={{ width: "100%" }}>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "10px 20px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "10px 20px !important" }}>
                        {"Field"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "10px 20px !important" }}>
                        {"Value"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "10px 20px !important" }}>
                        {"View"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {duplicates.map((item, i) => (
                        <StyledTableRow key={i}>
                          <StyledTableCell
                            sx={{ padding: "10px 20px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "10px 20px !important" }}
                          >
                            {item.field}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "10px 20px !important" }}
                          >
                            {item.value}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "10px 20px !important" }}
                          >
                            <Button
                              sx={userStyle.buttonedit}
                              onClick={() =>
                                window.open(
                                  `/resumemanagement/view/${item.id}`,
                                  "_blank"
                                )
                              }
                            >
                              <VisibilityOutlinedIcon
                                style={{ fontSize: "large" }}
                              />
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <br />
                Already Added
              </>
            );
            handleClickOpenerrdupe();
          } else {
            setIsDuplicate(false);
            setBtnSubmitDuplicate(false);
            setCheckDup(false);
          }
        }
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const handleMobile = (e) => {
    if (e.length > 10) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Mobile number can't more than 10 characters!
          </p>
        </>
      );
      handleClickOpenerr();

      let num = e.slice(0, 10);
      setAddcandidate({ ...addcandidate, mobile: num });
    }
  };
  const handlewhatsapp = (e) => {
    if (e.length > 10) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Whats app number can't more than 10 characters!
          </p>
        </>
      );
      handleClickOpenerr();

      let num = e.slice(0, 10);
      setAddcandidate({ ...addcandidate, whatsapp: num });
    }
  };
  const handlePostal = (e) => {
    if (e.length > 6) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Postal code can't more than 6 characters!
          </p>
        </>
      );
      handleClickOpenerr();

      let num = e.slice(0, 6);
      setAddcandidate({ ...addcandidate, postalcode: num });
    }
  };

  const handleSubmitUpdatedupe = (e) => {
    e.preventDefault();
    let updatedCandidate = { ...addcandidate };

    // Iterate over the duplicates array and clear the corresponding fields in addcandidate
    duplicateValues.forEach((duplicate) => {
      switch (duplicate.field) {
        case "Name":
          updatedCandidate.firstname = "";
          updatedCandidate.lastname = "";
          break;
        case "Email":
          updatedCandidate.email = "";
          break;
        case "Mobile":
          updatedCandidate.mobile = "";
          break;
        case "DOB":
          updatedCandidate.dateofbirth = "";
          updatedCandidate.age = "";
          break;
        case "Adhaar":
          updatedCandidate.adharnumber = "";
          break;
        case "Pan Number":
          updatedCandidate.pannumber = "";
          break;
        default:
          break;
      }
    });

    setAddcandidate(updatedCandidate);
    handleCloseerrdupe();
  };

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  return (
    <Box>
      <Headtitle title={"ADD CANDIDATE"} />
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Add Candidate </Typography>

      <>
        <Box sx={userStyle.selectcontainer}>
          <Grid container spacing={2}>
            <Grid
              item
              md={12}
              lg={12}
              sm={12}
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Typography variant="h5">Role : {roleName}</Typography>
            </Grid>
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
                  <Typography>
                    First Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container sx={{ display: "flex" }}>
                <Grid item md={3} sm={3} xs={3}>
                  <FormControl size="small" fullWidth>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      placeholder="Mr."
                      value={addcandidate.prefix}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          prefix: e.target.value,
                        });
                      }}
                    >
                      <MenuItem value="Mr">Mr</MenuItem>
                      <MenuItem value="Ms">Ms</MenuItem>
                      <MenuItem value="Mrs">Mrs</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={9} sm={9} xs={9}>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={addcandidate.firstname}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          firstname: e?.target?.value?.toLocaleUpperCase(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Last Name<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.lastname}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      lastname: e?.target?.value?.toLocaleUpperCase(),
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Gender <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={genderOption}
                  placeholder="Added by User"
                  value={{
                    label: addcandidate.gender,
                    value: addcandidate.gender,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      gender: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Email <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.email}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      email: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Mobile <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  sx={userStyle.input}
                  value={addcandidate.mobile}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      mobile: e.target.value,
                    });
                    handleMobile(e.target.value);
                  }}
                />
              </FormControl>
              <Grid>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={addcandidate.phonecheck}
                        onChange={(e) =>
                          setAddcandidate({
                            ...addcandidate,
                            phonecheck: !addcandidate.phonecheck,
                          })
                        }
                      />
                    }
                    label="Same as Whatsapp number"
                  />
                </FormGroup>
              </Grid>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Whatsapp</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  sx={userStyle.input}
                  value={addcandidate.whatsapp}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      whatsapp: e.target.value,
                    });
                    handlewhatsapp(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item lg={2} md={3} sm={12} xs={12}>
              <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>

              {croppedImage && (
                <>
                  <img style={{ height: 120 }} src={croppedImage} alt="" />
                </>
              )}
              <div>
                {(addcandidate.uploadedimage && !croppedImage) ||
                (getImg !== null && getImg !== undefined) ? (
                  <>
                    <Cropper
                      style={{ height: 120, width: "100%" }}
                      aspectRatio={1 / 1}
                      // src={selectedFile}
                      src={
                        getImg !== null && getImg !== undefined
                          ? getImg
                          : addcandidate.uploadedimage
                      }
                      ref={cropperRef}
                    />
                    <Box
                      sx={{ display: "flex", marginTop: "10px", gap: "10px" }}
                    >
                      <Box>
                        <Typography
                          sx={userStyle.uploadbtn}
                          onClick={handleCrop}
                        >
                          Crop Image
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          variant="outlined"
                          sx={userStyle.btncancel}
                          onClick={handleClearImage}
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: "flex", marginTop: "10px", gap: "10px" }}>
                    {" "}
                    {/* <Grid item md={4} sm={4}>
                        <Dropzone onDrop={handleFileSelect}>
                          {({ getRootProps, getInputProps }) => (
                            <section>
                              <div {...getRootProps()}>
                                <input
                                  {...getInputProps()}
                                  id="uploadedimage"
                                  onChange={handleChangeImage}
                                />

                                <Typography sx={userStyle.uploadbtn}>
                                  Upload
                                </Typography>
                                <br />
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </Grid> */}
                    <Box item md={4} sm={4}>
                      <section>
                        <input
                          type="file"
                          accept="image/*"
                          id="uploadedimage"
                          onChange={handleChangeImage}
                          style={{ display: "none" }}
                        />
                        <label htmlFor="uploadedimage">
                          <Typography sx={userStyle.uploadbtn}>
                            Upload
                          </Typography>
                        </label>
                        <br />
                      </section>
                    </Box>
                    <Box item md={4} sm={4}>
                      <Button
                        onClick={showWebcam}
                        variant="contained"
                        sx={userStyle.uploadbtn}
                      >
                        <CameraAltIcon />
                      </Button>
                    </Box>
                    {addcandidate.uploadedimage && (
                      <>
                        <Box item md={4} sm={4}>
                          <Button
                            variant="outlined"
                            sx={userStyle.btncancel}
                            onClick={handleClearImage}
                          >
                            Clear
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                )}
              </div>
              <Dialog
                open={isWebcamOpen}
                onClose={webcamClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent
                  sx={{ textAlign: "center", alignItems: "center" }}
                >
                  <Webcamimage
                    getImg={getImg}
                    setGetImg={setGetImg}
                    capturedImages={capturedImages}
                    valNum={valNum}
                    setValNum={setValNum}
                    name={name}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={webcamDataStore}
                  >
                    OK
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={webcamClose}
                  >
                    CANCEL
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>DOB</Typography>
                {/* <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={addcandidate.dateofbirth}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      dateofbirth: e.target.value,
                    });
                  }}
                /> */}
                <OutlinedInput
                  id="component-outlined"
                  value={addcandidate.dateofbirth}
                  onChange={(e) => {
                    let age = calculateAge(e.target.value);
                    setAddcandidate({
                      ...addcandidate,
                      dateofbirth: e.target.value,
                      age,
                    });
                  }}
                  type="date"
                  size="small"
                  name="dob"
                  inputProps={{ max: maxDate }}
                  onKeyDown={(e) => e.preventDefault()}
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
                  // inputProps={{ maxLength: 3 }}
                  value={addcandidate.age}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length < 4 && inputValue >= 0) {
                      setAddcandidate({
                        ...addcandidate,
                        age: inputValue,
                      });
                    }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2.5} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Aadhar Number</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.adharnumber}
                  onChange={(e) => {
                    if (e.target.value.length < 13) {
                      setAddcandidate({
                        ...addcandidate,
                        adharnumber: e.target.value,
                      });
                    }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2.5} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Pan Number</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.pannumber}
                  onChange={(e) => {
                    if (e.target.value.length < 11) {
                      setAddcandidate({
                        ...addcandidate,
                        pannumber: e.target.value,
                      });
                    }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>&nbsp;</Typography>
                <LoadingButton
                  loading={btnSubmitDuplicate}
                  sx={{
                    ...userStyle.buttonadd,
                    ...(isDuplicate === null
                      ? buttonStyles.default
                      : isDuplicate
                      ? buttonStyles.duplicate
                      : buttonStyles.noDuplicate),
                  }}
                  variant="contained"
                  size="small"
                  onClick={checkDuplicateFunction}
                  startIcon={
                    isDuplicate === null ? null : isDuplicate ? (
                      <CancelIcon style={{ color: "white" }} />
                    ) : (
                      <CheckCircleIcon style={{ color: "white" }} />
                    )
                  }
                >
                  {isDuplicate === null
                    ? "Check Duplicate"
                    : isDuplicate
                    ? "Duplicate Found"
                    : "No Duplicate Found"}
                </LoadingButton>
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Source of Candidate</Typography>
                <Selects
                  options={sourcecandidateOption}
                  placeholder="Choose Source"
                  value={{
                    label: addcandidate.sourcecandidate,
                    value: addcandidate.sourcecandidate,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      sourcecandidate: e.value,
                    });
                  }}
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
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      street: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            {/* <Grid item md={6} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    City
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={addcandidate.city}
                                    onChange={(e) => {
                                        setAddcandidate({
                                            ...addcandidate,
                                            city: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid> */}
            {/* <Grid item md={6} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    State
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={addcandidate.state}
                                    onChange={(e) => {
                                        setAddcandidate({
                                            ...addcandidate,
                                            state: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid> */}
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Postal Code</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  value={addcandidate.postalcode}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      postalcode: e.target.value,
                    });
                    handlePostal(e.target.value);
                  }}
                  sx={userStyle.input}
                />
              </FormControl>
            </Grid>
            {/* <Grid item md={6} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Country
                                </Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={addcandidate.country}
                                    onChange={(e) => {
                                        setAddcandidate({
                                            ...addcandidate,
                                            country: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid> */}
            <Grid item md={6} sm={6} xs={12}>
              <Typography>Country</Typography>
              <Grid sx={{ display: "flex" }}>
                {/* <Grid sx={userStyle.spanIcons}> <LanguageOutlinedIcon />  </Grid> */}
                <FormControl size="small" fullWidth>
                  <Selects
                    placeholder=""
                    options={Country.getAllCountries()}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedCountry}
                    // styles={colourStyles}
                    onChange={(item) => {
                      setSelectedCountry(item);
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography>State</Typography>
              <Grid sx={{ display: "flex" }}>
                {/* <Grid sx={userStyle.spanIcons}>
                                    <LocationOnIconOutlined />
                                </Grid> */}
                <FormControl size="small" fullWidth>
                  <Selects
                    placeholder=""
                    options={State?.getStatesOfCountry(
                      selectedCountry?.isoCode
                    )}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedState}
                    onChange={(item) => {
                      setSelectedState(item);
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography>City</Typography>
              <Grid sx={{ display: "flex" }}>
                {/* <Grid sx={userStyle.spanIcons}>  <LocationOnIconOutlined />  </Grid> */}
                <FormControl size="small" fullWidth>
                  <Selects
                    placeholder=""
                    options={City.getCitiesOfState(
                      selectedState?.countryCode,
                      selectedState?.isoCode
                    )}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedCity}
                    // styles={colourStyles}
                    onChange={(item) => {
                      setSelectedCity(item);
                    }}
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
                <b>Experience Details</b>
              </Typography>
            </Grid>
            {/* <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                    <Typography>
                        Qualification Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                        options={categorys}
                        value={selectedOptionsEduCate}
                        onChange={(e) => {
                            handleCategoryChange(e);
                            fetchCategoryBased(e);
                            setAddcandidate({
                              ...addcandidate,
                              category: e.value
                            });
                            setSelectedEduOptionsSubCate([]);
                            setSelectedOptionsEdu([]);
                        }}
                        valueRenderer={customValueRendererEduCate}
                        labelledBy="Please Select Qualification Type"
                    />
                </FormControl>
            </Grid>
            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                    <Typography>
                        Qualification SubType <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                        options={subcategorys}
                        value={selectedOptionsEduSubCate}
                        onChange={(e) => {
                            handleEduSubCategoryChange(e);
                            fetchEducation(e);
                            
                            setSelectedOptionsEdu([]);
                        }}
                        valueRenderer={customValueRendererEduSubCate}
                        labelledBy="Please Select Qualification SubType"
                    />
                </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12} >
                <Typography>  Specialization<b style={{ color: 'red' }}>*</b></Typography>
                <FormControl fullWidth size="small">
                    <MultiSelect
                        options={educationsOpt}
                        value={selectedOptionsEdu}
                        onChange={(e) => {
                            handleEducationChange(e);
                        }}
                        valueRenderer={customValueRendererEdu}
                        labelledBy="Please Select Specialization"
                    />
                </FormControl>
            </Grid> */}
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Overall Experience <b style={{ color: "red" }}>*</b>
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={addcandidate.experienceestimation}
                  onChange={(e) => {
                    setexperience(0);
                    setAddcandidate({
                      ...addcandidate,
                      experience: 0,
                      experienceestimation: e.target.value,
                      noticeperiod: 0,
                      currentsalary: 0,
                    });
                  }}
                >
                  <MenuItem value="Years">Years</MenuItem>
                  <MenuItem value="Months">Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {`No. Of ${addcandidate?.experienceestimation}`}
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  sx={userStyle.input}
                  value={addcandidate.experience}
                  onChange={(e) => {
                    setexperience(Number(e.target.value));
                    setAddcandidate({
                      ...addcandidate,
                      experience:
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0,
                      noticeperiod: 0,
                      currentsalary: 0,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Domain Field Experience
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={addcandidate.domainexperienceestimation}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      domainexperience: 0,
                      domainexperienceestimation: e.target.value,
                    });
                  }}
                >
                  <MenuItem value="Years">Years</MenuItem>
                  <MenuItem value="Months">Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {`No. Of ${addcandidate?.domainexperienceestimation}`}
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  sx={userStyle.input}
                  value={addcandidate.domainexperience}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      domainexperience:
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Current Job title</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.currentjobtitle}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      currentjobtitle: e.target.value,
                    });
                  }}
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
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      currentemployer: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Expected Salary <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={expectedsalaryOption}
                  value={{
                    label: addcandidate.expectedsalaryopts,
                    value: addcandidate.expectedsalaryopts,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      expectedsalaryopts: e.value,
                    });
                  }}
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
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      expectedsalary:
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Joining By Days <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={joiningbydaysOption}
                  value={{
                    label: addcandidate.joiningbydaysopts,
                    value: addcandidate.joiningbydaysopts,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      joiningbydaysopts: e.value,
                    });
                  }}
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
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      joinbydays:
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0,
                    });
                  }}
                  sx={userStyle.input}
                />
              </FormControl>
            </Grid>
            {experience <= 0 ? (
              ""
            ) : (
              <>
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Current Salary<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={addcandidate.currentsalary}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          currentsalary:
                            Number(e.target.value) >= 0
                              ? Number(e.target.value)
                              : 0,
                        });
                      }}
                      sx={userStyle.input}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Notice Period Days In Previous Company
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={addcandidate.noticeperiod}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          noticeperiod:
                            Number(e.target.value) >= 0
                              ? Number(e.target.value)
                              : 0,
                        });
                      }}
                      sx={userStyle.input}
                    />
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Skill set</Typography>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={5}
                  value={addcandidate.skillset}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      skillset: e.target.value,
                    });
                  }}
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
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      additionalinfo: e.target.value,
                    });
                  }}
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
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      linkedinid: e.target.value,
                    });
                  }}
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
                <Selects
                  options={candidateOption}
                  placeholder="New"
                  value={{
                    label: addcandidate.status,
                    value: addcandidate.status,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      status: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2.5} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Source</Typography>
                <Selects
                  options={sourceOption}
                  placeholder="Added by User"
                  value={{
                    label: addcandidate.source,
                    value: addcandidate.source,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      source: e.value,
                    });
                  }}
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
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      interviewdate: e.target.value,
                    });
                  }}
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
                  onChange={(e) => {
                    setAddcandidate({ ...addcandidate, time: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ margin: "20px 0px 10px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Education details</b>
              </Typography>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Grid container spacing={3} sx={{ display: "flex" }}>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={categorys}
                      // styles={colourStyles}
                      value={
                        educationDetails.categoryedu
                          ? {
                              label: educationDetails.categoryedu,
                              value: educationDetails.subcategoryedu,
                            }
                          : {
                              label: "Please Select Category",
                              value: "Please Select Category",
                            }
                      }
                      onChange={(e) => {
                        setEducationDetails((prev) => ({
                          ...prev,
                          categoryedu: e.value,
                          subcategoryedu: "Please Select Sub Category",
                          specialization: "Please Select Specialization",
                        }));
                        fetchCategoryBased(e);
                        setSubcategorys([]);
                        setEducationsOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={subcategorys}
                      // styles={colourStyles}
                      value={
                        educationDetails.subcategoryedu
                          ? {
                              label: educationDetails.subcategoryedu,
                              value: educationDetails.subcategoryedu,
                            }
                          : {
                              label: "Please Select Sub Category",
                              value: "Please Select Sub Category",
                            }
                      }
                      onChange={(e) => {
                        setEducationDetails((prev) => ({
                          ...prev,
                          subcategoryedu: e.value,
                          specialization: "Please Select Specialization",
                        }));
                        fetchEducation(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    {" "}
                    Specialization <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={educationsOpt}
                      // styles={colourStyles}
                      value={
                        educationDetails.specialization
                          ? {
                              label: educationDetails.specialization,
                              value: educationDetails.specialization,
                            }
                          : {
                              label: "Please Select Specialization",
                              value: "Please Select Specialization",
                            }
                      }
                      onChange={(e) => {
                        setEducationDetails((prev) => ({
                          ...prev,
                          specialization: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Institute / School</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={educationDetails.school}
                      onChange={(e) => {
                        setEducationDetails({
                          ...educationDetails,
                          school: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Major / Department</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={educationDetails.department}
                      onChange={(e) => {
                        setEducationDetails({
                          ...educationDetails,
                          department: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Degree</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={educationDetails.degree}
                      onChange={(e) => {
                        setEducationDetails({
                          ...educationDetails,
                          degree: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    Completed Year{" "}
                    <OutlinedInput
                      id="component-outlined"
                      type="month"
                      value={educationDetails.fromduration}
                      onChange={(e) => {
                        setEducationDetails({
                          ...educationDetails,
                          fromduration: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <Typography sx={{ margin: "30px 10px 0 10px" }}>
                    To
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Typography>&nbsp;</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="month"
                      value={educationDetails.toduration}
                      onChange={(e) => {
                        setEducationDetails({
                          ...educationDetails,
                          toduration: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{ display: "flex", marginTop: "20px" }}
                >
                  <Typography sx={{ marginTop: "8px" }}>
                    Currently pursuing
                  </Typography>
                  &emsp;
                  <FormControl size="small">
                    <Checkbox
                      checked={educationDetails.pursuing}
                      onChange={(e) =>
                        setEducationDetails({
                          ...educationDetails,
                          pursuing: !educationDetails.pursuing,
                        })
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Button
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
                onClick={educationTodo}
              >
                <AddIcon />
                &nbsp; Add Education Details
              </Button>
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
                      <StyledTableCell>Completed Year</StyledTableCell>
                      <StyledTableCell>Pursuing</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {educationtodo?.length > 0 ? (
                      educationtodo?.map((row, index) => (
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
                            {row.pursuing ? "true" : "false"}
                          </StyledTableCell>
                          <StyledTableCell>
                            <CloseIcon
                              sx={{ color: "red", cursor: "pointer" }}
                              onClick={() => {
                                educationTodoremove(index);
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
              <Grid container spacing={3} sx={{ display: "flex" }}>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Occupation / Title</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={experienceDetails.occupation}
                      onChange={(e) => {
                        setExperienceDetails({
                          ...experienceDetails,
                          occupation: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={experienceDetails.company}
                      onChange={(e) => {
                        setExperienceDetails({
                          ...experienceDetails,
                          company: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Summary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={experienceDetails.summary}
                      onChange={(e) => {
                        setExperienceDetails({
                          ...experienceDetails,
                          summary: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>Work Duration</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="month"
                      value={experienceDetails.fromduration}
                      onChange={(e) => {
                        setExperienceDetails({
                          ...experienceDetails,
                          fromduration: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <Typography sx={{ margin: "30px 10px 0 10px" }}>
                    To
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Typography>&nbsp;</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="month"
                      value={experienceDetails.toduration}
                      onChange={(e) => {
                        setExperienceDetails({
                          ...experienceDetails,
                          toduration: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{ display: "flex", marginTop: "20px" }}
                >
                  <Typography sx={{ marginTop: "8px" }}>
                    I Currently Work here
                  </Typography>
                  &emsp;
                  <FormControl size="small">
                    <Checkbox
                      checked={experienceDetails.currentlyworkhere}
                      onChange={(e) =>
                        setExperienceDetails({
                          ...experienceDetails,
                          currentlyworkhere:
                            !experienceDetails.currentlyworkhere,
                        })
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Button
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
                onClick={experienceTodo}
              >
                <AddIcon />
                &nbsp; Experience Details
              </Button>
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
                      <StyledTableCell>Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {experiencetodo?.length > 0 ? (
                      experiencetodo?.map((row, index) => (
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
                            {row.currentlyworkhere ? "true" : "false"}
                          </StyledTableCell>
                          <StyledTableCell>
                            <CloseIcon
                              sx={{ color: "red", cursor: "pointer" }}
                              onClick={() => {
                                experienceTodoremove(index);
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
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <br />
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Skill set known</Typography>
                <MultiSelect
                  options={skill}
                  value={selectedskill}
                  onChange={handleSkilChange}
                  valueRenderer={renderValueSkill}
                  labelledBy="Please select"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Certificaion</Typography>
                <MultiSelect
                  options={certification}
                  value={selectedCertification}
                  onChange={handleCertficationChange}
                  valueRenderer={renderValueCertification}
                  labelledBy="Please select"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ margin: "20px 0px 10px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Attachement Information </b>
              </Typography>
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
                container
                item
                lg={10}
                md={10}
                xs={12}
                sm={12}
                spacing={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "@media only screen and (max-width:550px)": {
                    flexDirection: "column",
                  },
                }}
              >
                <Grid item lg={3} md={3} xs={12} sm={12}>
                  <Typography variant="h6">Candidate Document</Typography>
                </Grid>
                <Grid item lg={3} md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <Selects
                      options={designations}
                      styles={colourStyles}
                      value={{
                        label: addcandidate.candidatefilename,
                        value: addcandidate.candidatefilename,
                      }}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          candidatefilename: e.value,
                          shortname: e.shortname,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                  {addcandidate.candidatefilename !==
                    "Please Select Candidate Document" && (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        component="label"
                        sx={{ mt: 2 }}
                      >
                        Upload
                        <input
                          type="file"
                          id="candidate"
                          accept=".xlsx, .xls, .csv, .pdf, .doc, .txt"
                          name="file"
                          hidden
                          onChange={handleCandidateUpload}
                        />
                      </Button>
                      &nbsp;
                      <Button
                        variant="outlined"
                        startIcon={<LinkIcon />}
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => {
                          handleCandidateUploadSingle();
                        }}
                      >
                        Single Link
                      </Button>
                      &nbsp;
                    </>
                  )}
                  {designations?.length > 0 && (
                    <Button
                      variant="outlined"
                      startIcon={<FolderIcon />}
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        handleCandidateUploadSingleAll(designations);
                      }}
                    >
                      Internal All Link
                    </Button>
                  )}
                  {designations?.length > 0 && (
                    <Button
                      variant="outlined"
                      startIcon={<FolderIcon />}
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        handleCandidateUploadSingleExternalAll(designations);
                      }}
                    >
                      External All Link
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={8} xs={12} sm={12}></Grid>
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
                      {todo.candidatefilename} &nbsp;
                      {todo.uploadedby !== "" && (
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
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <Button
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                              marginTop: "-5px",
                            }}
                            onClick={() => handleFileCandidateDelete(index)}
                          >
                            <DeleteIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              ))}

            <br />
            <br />
            <br />

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
                  Resume <b style={{ color: "red" }}>*</b>
                </Typography>
                <Box sx={{ paddingLeft: "5px" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    sx={{
                      "@media only screen and (max-width:550px)": {
                        marginY: "5px",
                      },
                    }}
                  >
                    Upload
                    <input
                      type="file"
                      id="resume"
                      accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                      name="file"
                      hidden
                      onChange={handleResumeUpload}
                    />
                  </Button>
                </Box>
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
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <Button
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                              marginTop: "-5px",
                            }}
                            onClick={() => handleFileDelete(index)}
                          >
                            <DeleteIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ))}
                {/* </Typography> */}
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
                      Experience Letter
                    </Typography>
                    <Box sx={{ paddingLeft: "5px" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        component="label"
                        sx={{
                          "@media only screen and (max-width:550px)": {
                            marginY: "5px",
                          },
                        }}
                      >
                        Upload
                        <input
                          type="file"
                          id="resume"
                          accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                          name="file"
                          hidden
                          onChange={handleExperienceletterUpload}
                        />
                      </Button>
                    </Box>
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
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <Button
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                  marginTop: "-5px",
                                }}
                                onClick={() => handleFileDeleteexp(index)}
                              >
                                <DeleteIcon />
                              </Button>
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
                      Pay Slip
                    </Typography>
                    <Box sx={{ paddingLeft: "5px" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        component="label"
                        sx={{
                          "@media only screen and (max-width:550px)": {
                            marginY: "5px",
                          },
                        }}
                      >
                        Upload
                        <input
                          type="file"
                          id="resume"
                          accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                          name="file"
                          hidden
                          onChange={handlePayslipletterUpload}
                        />
                      </Button>
                    </Box>
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
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <Button
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                  marginTop: "-5px",
                                }}
                                onClick={() => handleFileDeletepayslip(index)}
                              >
                                <DeleteIcon />
                              </Button>
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
                  Cover letter
                </Typography>
                <Box sx={{ paddingLeft: "5px" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    sx={{
                      "@media only screen and (max-width:550px)": {
                        marginY: "5px",
                      },
                    }}
                    disabled={
                      currentText === "<p><br></p>" || currentText === ""
                        ? false
                        : true
                    }
                  >
                    Upload
                    <input
                      type="file"
                      id="resume"
                      accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                      name="file"
                      hidden
                      onChange={handleCoverletterUpload}
                    />
                  </Button>
                </Box>
              </Grid>
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
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <Button
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                              marginTop: "-5px",
                            }}
                            onClick={() => handleFileDeletecover(index)}
                          >
                            <DeleteIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ))}
                {/* </Typography> */}
              </Grid>
            </Grid>
            {coverletter.length === 0 && (
              <>
                <Grid
                  item
                  lg={10}
                  md={10}
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    marginLeft: "30px",
                    justifyContent: "center",
                    "@media only screen and (max-width:550px)": {
                      flexDirection: "column",
                    },
                  }}
                >
                  <Grid item md={2} sm={12} xs={12}></Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      {/* <Typography>
                        <b> Description </b>
                      </Typography> */}
                      <ReactQuill
                        style={{ height: "180px" }}
                        value={currentText}
                        onChange={(e) => {
                          setCurrentText(e);
                        }}
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
                </Grid>
              </>
            )}
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
                <LoadingButton
                  loading={btnSubmit}
                  sx={userStyle.buttonadd}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button
                  sx={userStyle.btncancel}
                  onClick={() => {
                    backPage(`/company/recuritment/${ids}`);
                  }}
                >
                  Cancel
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
                {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> */}
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
          <Box>
            <Dialog
              open={isDuplicateOpen}
              onClose={handleCloseDuplicate}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "450px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  style={{ fontSize: "20px", fontWeight: 900 }}
                >
                  {showAlertDuplicate}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  style={{
                    padding: "7px 13px",
                    color: "black",
                    background: "#fff",
                  }}
                  onClick={handleCloseDuplicate}
                >
                  No
                </Button>
                <Button
                  variant="contained"
                  style={{
                    padding: "7px 13px",
                    color: "white",
                    background: "rgb(25, 118, 210)",
                  }}
                  onClick={sendRequest}
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Box>
            <Dialog
              open={isErrorOpendupe}
              onClose={handleCloseerrdupe}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth="sm"
              fullWidth={true}
            >
              <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                <Typography variant="h6">{showAlertdupe}</Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitUpdatedupe}
                >
                  Upload Without Duplicate
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseerrdupe}
                >
                  Upload With Duplicate
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Box>
            <Dialog
              open={isErrorOpenBetween}
              onClose={handleCloseBetween}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "450px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  style={{ fontSize: "20px", fontWeight: 900 }}
                >
                  {showAlertBetween}
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
                  onClick={handleCloseBetween}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </>
      {/* } */}
      <LoadingBackdrop open={isLoading} />
    </Box>
  );
}

export default Addcandidate;