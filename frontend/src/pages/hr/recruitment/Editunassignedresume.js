import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FormControlLabel,
  FormGroup,
  TextareaAutosize,
  InputLabel,
  Box,
  Checkbox,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
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
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Selects, { components } from "react-select";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import CircularProgress from "@mui/material/CircularProgress";
import { MultiSelect } from "react-multi-select-component";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Backdrop } from "@mui/material";
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
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
function UnassignedResumeEdit() {
  const currentYear = new Date().getFullYear();
  const maxDate = `${currentYear - 16}-12-31`;

  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
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

  const [isLoading, setIsLoading] = useState(false);
  // Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [addcandidateEdit, setAddcandidateEdit] = useState({
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
    otherqualification: "",
    currentjobtitle: "",
    currentemployer: "",
    expectedsalaryopts: "Please Select Expected Salary",
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
    phonecheck: false,
    dateofbirth: "",
    age: "",
    interviewdate: "",
    jobopeningsid: "",
    joiningbydaysopts: "Please Select Joining By Days",
    time: "",
    skill: [],
    uploadedimage: null,
    uploadedimagename: null,
    files: [],
    joinbydays: 0,
    noticeperiod: 0,
    gender: "Please Select Gender",
    candidatefilename: "Please Select Candidate Document",
  });

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
        (data) => data.allresume === true
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
    setGetImgedit(null);
    setSelectedFile(null);
    setCroppedImage(null);
    setAddcandidateEdit({ ...addcandidateEdit, uploadedimage: "" });
  };

  // Image Upload
  function handleChangeImage(e) {
    let uploadedimage = document.getElementById("uploadedimage");
    var path = (window.URL || window.webkitURL).createObjectURL(
      uploadedimage.files[0]
    );
    toDataURL(path, function (dataUrl) {
      uploadedimage.setAttribute("value", String(dataUrl));
      setAddcandidateEdit({
        ...addcandidateEdit,
        uploadedimage: String(dataUrl),
      });
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
  const [getImgedit, setGetImgedit] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);
  const [valNume, setValNume] = useState(0);

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

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);

  const [certification, setCertification] = useState([]);
  const [btnSubmit, setBtnSubmit] = useState(false);

  const [btnSubmitDuplicate, setBtnSubmitDuplicate] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(null);

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

  // Convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString?.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString?.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
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

  const fetchEducation = async (e, categoryEdu) => {
    try {
      let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res?.data?.educationspecilizations.filter((data) => {
        return (
          data?.category?.includes(categoryEdu) &&
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

  const [roleName, setRoleName] = useState("");
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
  const [educationtodo, setEducationtodo] = useState([]);

  const [experienceDetails, setExperienceDetails] = useState({
    occupation: "",
    company: "",
    summary: "",
    fromduration: "",
    toduration: "",
    currentlyworkhere: false,
  });
  const [qualificationDrop, setQualificationDrop] = useState([]);
  const [experiencetodo, setExperiencetodo] = useState([]);
  const [experience, setexperience] = useState(0);

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
    setIsLoading(false);
    setBtnSubmitDuplicate(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // updated
  const [showAlertUpdate, setShowAlertUpdate] = useState();
  const [isErrorOpenUpdate, setIsErrorOpenUpdate] = useState(false);
  const handleClickOpenerrupdate = () => {
    setIsErrorOpenUpdate(true);
  };
  const handleCloseerrupdate = () => {
    backPage("/recruitment/unassignedcandidates");
    setIsErrorOpenUpdate(false);
  };

  const getPhoneNumber = () => {
    if (addcandidateEdit.phonecheck) {
      setAddcandidateEdit({
        ...addcandidateEdit,
        whatsapp: addcandidateEdit.mobile,
      });
    } else {
      setAddcandidateEdit({ ...addcandidateEdit, whatsapp: "" });
    }
  };
  useEffect(() => {
    getPhoneNumber();
  }, [addcandidateEdit.phonecheck]);

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
  }, []);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAddcandidateEdit({
          ...addcandidateEdit,
          uploadedimage: reader.result,
          uploadedimagename: file.name,
          files: [
            {
              filename: file.name,
              preview: reader.result,
              data: reader.result.split(",")[1],
              remark: "image file",
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewImage = () => {
    const blob = dataURItoBlob(addcandidateEdit.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  const handleDeleteImage = () => {
    setAddcandidateEdit({
      ...addcandidateEdit,
      isuploadimage: false,
      uploadedimage: null,
      files: [],
    });
  };

  const renderValueSkill = (valueCate, _skill) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select category";
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
    return valueCertification?.length
      ? valueCertification.map(({ label }) => label).join(", ")
      : "Please select Certification";
  };

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

  const [jobopeningId, setJobopeningId] = useState();
  const otherQualificationInputRef = useRef(null);

  useEffect(() => {
    if (
      addcandidateEdit.qualification === "Others" &&
      otherQualificationInputRef.current
    ) {
      otherQualificationInputRef.current.focus();
    }
  }, [addcandidateEdit.qualification]);

  const getinfoCode = async () => {
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAddcandidateEdit({
        ...res?.data?.scandidates,
        candidatefilename: "Please Select Candidate Document",
      });
      setResumeFiles(res?.data?.scandidates?.resumefile);
      setCoverletter(res?.data?.scandidates?.coverletterfile);
      setCurrentText(res?.data?.scandidates?.coverlettertext);
      setExperienceletter(res?.data?.scandidates?.experienceletterfile);
      setEducationtodo(res?.data?.scandidates?.educationdetails);
      setExperiencetodo(res?.data?.scandidates?.experiencedetails);
      setSelectedSkill(res?.data?.scandidates?.skill);
      getunitvaluesCate(res?.data?.scandidates);
      setValueCate(res?.data?.scandidates?.skill);
      setexperience(res?.data?.scandidates?.experience);
      setTodoscheck(res.data.scandidates.candidatedatafile);

      // setSelectedCertification(res?.data?.scandidates?.certification.map((item) => ({ label: item, value: item })))

      // setPayslipletter(res?.data?.scandidates?.payslipletterfile);

      // const cont = Country.getAllCountries().find((item) => item.name == res?.data?.scandidates?.country)
      // setSelectedCountry(cont);
      // const statess = State.getStatesOfCountry(cont.isoCode).find((item) => item.name == res?.data?.scandidates?.state)
      // setSelectedState(statess)
      // const citys = City.getCitiesOfCountry(cont.isoCode).find((item) => item.name == res?.data?.scandidates?.city)
      // setSelectedCity(citys)
      // // await fetchCategoryBased({ label: res.data.scandidates.categoryedu, value: res.data.scandidates.categoryedu })
      // // await fetchEducation({ value: res.data.scandidates.subcategoryedu }, res.data.scandidates.categoryedu)

      // setJobopeningId(res?.data?.scandidates.jobopeningsid)

      let res1 = await axios.get(`${SERVICE.QUALIFICATIONS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let arr = res1?.data?.qualificationdetails.map((data) => ({
        label: data.qualiname,
        value: data.qualiname,
      }));
      setQualificationDrop(arr);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    getinfoCode();
    fetchCategoryEducation();
    fetchCertification();
    fetchOverAllSettings();
    fetchCandidatedocumentdropdowns();
  }, [ids]);

  const getunitvaluesCate = (e) => {
    setSelectedSkill(
      Array.isArray(e?.skill)
        ? e?.skill?.map((x) => ({
            ...x,
            label: x,
            value: x,
            key: `education-${x._id}`,
          }))
        : []
    );
  };

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
    // setCandidateFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
      setShowAlert("Please Select Category");
      handleClickOpenerr();
    } else if (
      educationDetails.subcategoryedu == "Please Select Sub Category" ||
      educationDetails.subcategoryedu == ""
    ) {
      setShowAlert("Please Select Sub Category");
      handleClickOpenerr();
    } else if (
      educationDetails.specialization == "Please Select Specialization" ||
      educationDetails.specialization == ""
    ) {
      setShowAlert("Please Select Specialization");
      handleClickOpenerr();
    } else if (educationDetails.school == "") {
      setShowAlert("Please Enter School field!");
      handleClickOpenerr();
    } else if (educationDetails.department == "") {
      setShowAlert("Please Enter Department field!");
      handleClickOpenerr();
    } else if (educationDetails !== "") {
      setEducationtodo([...educationtodo, educationDetails]);
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
  const qualificationOption = [
    { label: "MCA", value: "MCA" },
    { label: "BE", value: "BE" },
    { label: "BSc", value: "BSc" },
    { label: "MS", value: "MS" },
    { label: "BTech", value: "BTech" },
    { label: "ME", value: "ME" },
    { label: "Diploma", value: "Diploma" },
    { label: "ITI", value: "ITI" },
  ];

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
  const [newTodoLabelcheck, setNewTodoLabelcheck] = useState("");

  const [deverrormsg, setdeverrormsg] = useState("");

  const handleCreateTodocheck = (data) => {
    const newTodocheck = {
      candidatefilename: addcandidateEdit.candidatefilename,
      //   candidatefile: [data]
      ...data,
    };
    // If not a duplicate, add the newTodocheck to the todoscheck array
    setdeverrormsg("");
    setTodoscheck((prevTodos) => [...prevTodos, newTodocheck]);
    setNewTodoLabelcheck("");
  };

  const handleDeleteTodocheck = (index) => {
    const newTodoscheck = [...todoscheck];
    newTodoscheck.splice(index, 1);
    setTodoscheck(newTodoscheck);
  };

  const [candidatefiles, setCandidateFiles] = useState([]);

  const handleCandidateUpload = (event) => {
    if (
      todoscheck.some(
        (data) => data.candidatefilename === addcandidateEdit.candidatefilename
      )
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`${addcandidateEdit.candidatefilename} Already Exists`}
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
          let casesensitivefirstname = addcandidateEdit.firstname
            ?.replace(/\s+/g, "")
            ?.toLowerCase();
          let casesensitivelastname = addcandidateEdit.lastname
            ?.replace(/\s+/g, "")
            ?.toLowerCase();
          let extension = file.name.split(".").pop();
          handleCreateTodocheck(
            {
              candidatefilename: addcandidateEdit.candidatefilename,
              name: `${casesensitivefirstname}_${casesensitivelastname}_${addcandidateEdit.shortname}.${extension}`,
              preview: reader.result,
              data: reader.result.split(",")[1],
              remark: "candidate file",
              uploadedby: "employee",
              shortname: addcandidateEdit?.shortname,
            },
            addcandidateEdit.candidatefilename
          );
        });
      }
    }
  };
  const handleCandidateUploadSingle = (event) => {
    if (
      todoscheck.some(
        (data) => data.candidatefilename === addcandidateEdit.candidatefilename
      )
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`${addcandidateEdit.candidatefilename} Already Exists`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const uniqueId = uuidv4();
      let casesensitivefilename = addcandidateEdit.candidatefilename
        .replace(/\s+/g, "")
        .toLowerCase();
      handleCreateTodocheck(
        {
          candidatefilename: addcandidateEdit.candidatefilename,
          name: "",
          preview: "",
          data: "",
          remark: "candidate file",
          link: `${BASE_URL}/uploaddocument/single/${casesensitivefilename}/${uniqueId}`,
          uniqueid: uniqueId,
          linkname: `${addcandidateEdit.candidatefilename} Upload Link`,
          csfilname: casesensitivefilename,
          uploadedby: "",
          shortname: addcandidateEdit?.shortname,
        },
        addcandidateEdit.candidatefilename
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

    for (let i = 0; i < resume?.length; i++) {
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

    for (let i = 0; i < cover?.length; i++) {
      const reader = new FileReader();
      const file = cover[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setCoverletter((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
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

    for (let i = 0; i < experience?.length; i++) {
      const reader = new FileReader();
      const file = experience[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setExperienceletter((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            data: reader.result.split(",")[1],
            remark: "experience letter",
          },
        ]);
      };
    }
  };

  const [payslipletter, setPayslipletter] = useState([]);

  const handlePayslipletterUpload = (event) => {
    const payslip = event.target.files;

    for (let i = 0; i < payslip?.length; i++) {
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

  let loginid = localStorage.LoginUserId;
  const usernameaddedby = isUserRoleAccess?.username;

  let updateby = addcandidateEdit.updatedby;

  let nameedit = "edit";

  const sendRequest = async () => {
    let certi = selectedCertification.map((item) => item.value);

    try {
      let res_queue = await axios.put(`${SERVICE.CANDIDATES_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        prefix: String(addcandidateEdit.prefix),
        firstname: String(addcandidateEdit.firstname),
        lastname: String(addcandidateEdit.lastname),
        fullname: String(
          addcandidateEdit.firstname + " " + addcandidateEdit.lastname
        ),
        email: String(addcandidateEdit.email),
        mobile: Number(addcandidateEdit.mobile),
        whatsapp: Number(addcandidateEdit.whatsapp),
        phonecheck: Boolean(addcandidateEdit.phonecheck),
        adharnumber: Number(addcandidateEdit.adharnumber),
        pannumber: String(addcandidateEdit.pannumber),
        age: Number(addcandidateEdit.age),
        dateofbirth: String(addcandidateEdit.dateofbirth),
        interviewdate: String(addcandidateEdit.interviewdate),
        time: String(addcandidateEdit.time),
        street: String(addcandidateEdit.street),
        city: String(addcandidateEdit.city),
        state: String(addcandidateEdit.state),
        postalcode: Number(addcandidateEdit.postalcode),

        city: String(selectedCity.name),
        state: String(selectedState.name),
        country: String(selectedCountry.name),

        experience: Number(addcandidateEdit.experience),
        experienceestimation: String(addcandidateEdit.experienceestimation),
        domainexperienceestimation: String(
          addcandidateEdit.domainexperienceestimation
        ),
        expectedsalaryopts: String(addcandidateEdit.expectedsalaryopts),

        domainexperience: Number(addcandidateEdit.domainexperience),

        joiningbydaysopts: String(addcandidateEdit.joiningbydaysopts),
        joinbydays: Number(addcandidateEdit.joinbydays),
        noticeperiod: Number(addcandidateEdit.noticeperiod),
        certification: certi,
        uploadedimage:
          getImgedit !== null && getImgedit !== undefined
            ? getImgedit
            : addcandidateEdit.uploadedimage == null
            ? ""
            : String(addcandidateEdit.uploadedimage),
        uploadedimagename: String(addcandidateEdit.uploadedimagename),
        files: addcandidateEdit.files,
        gender: addcandidateEdit.gender,

        candidatedatafile: [...todoscheck],

        // qualification: String(addcandidateEdit.qualification),

        // categoryedu: String(addcandidateEdit.categoryedu),
        // subcategoryedu: String(addcandidateEdit.subcategoryedu),
        // specialization: String(addcandidateEdit.specialization),

        //for other qualifictaion updates
        otherqualification:
          addcandidateEdit.qualification === "Others"
            ? String(addcandidateEdit.otherqualification)
            : "",
        jobopeningsid: String(jobopeningId),

        currentjobtitle: String(addcandidateEdit.currentjobtitle),
        currentemployer: String(addcandidateEdit.currentemployer),
        expectedsalary: String(addcandidateEdit.expectedsalary),
        currentsalary: String(addcandidateEdit.currentsalary),
        skillset: String(addcandidateEdit.skillset),
        additionalinfo: String(addcandidateEdit.additionalinfo),
        linkedinid: String(addcandidateEdit.linkedinid),
        status: String(addcandidateEdit.status),
        source: String(addcandidateEdit.source),
        sourcecandidate: String(addcandidateEdit.sourcecandidate),
        resumefile: [...resumefiles],
        coverletterfile: [...coverletter],
        coverlettertext: currentText,
        experienceletterfile: [...experienceletter],
        educationdetails: [...educationtodo],
        experiencedetails: [...experiencetodo],
        payslipletterfile: [...payslipletter],
        skill: [...valueCate],
        updatedby: [
          ...updateby,
          {
            name: String(usernameaddedby),
            date: String(new Date()),
          },
        ],
        role: String(addcandidateEdit.role),
        today: String(today),
      });

      setBtnSubmit(false);
      setIsLoading(false);

      // backPage('/resumemanagement')
      setShowAlertUpdate(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerrupdate();
      // setCheckDup(false)
    } catch (err) {
      // setCheckDup(false);
      setBtnSubmit(false);
      setIsLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleClear = () => {
    setAddcandidateEdit({
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
      otherqualification: "",
      experiencedetails: "",
      resumefile: "",
      coverletterfile: "",
      experienceletterfile: "",
      dateofbirth: "",
      interviewdate: "",
      time: "",
      age: "",
      phonecheck: false,
      jobopeningsid: "",
      joinbydays: 0,
      noticeperiod: 0,
      gender: "Please Select Gender",
    });
    setexperience(0);
    setCoverletter([]);
    setTodoscheck([]);
    setResumeFiles([]);
    setExperienceletter([]);
    setEducationtodo([]);
    setExperiencetodo([]);
    setEducationDetails({
      school: "",
      department: "",
      degree: "",
      fromduration: "",
      toduration: "",
      pursuing: false,
    });
    setExperienceDetails({
      occupation: "",
      company: "",
      summary: "",
      fromduration: "",
      toduration: "",
      currentlyworkhere: false,
    });
  };

  // const [CheckDup, setCheckDup] = useState(true)

  const handleSubmit = (e) => {
    setBtnSubmit(true);
    setIsLoading(true);
    // if (CheckDup) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Check Duplicate!"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    if (addcandidateEdit.firstname == "") {
      setShowAlert("Please Enter First Name");
      handleClickOpenerr();
    } else if (addcandidateEdit.lastname == "") {
      setShowAlert("Please Enter Last Name");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.gender == "Please Select Gender" ||
      addcandidateEdit.gender == "" ||
      addcandidateEdit.gender == undefined
    ) {
      setShowAlert("Please Select Gender");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.email == "" ||
      addcandidateEdit.email == undefined
    ) {
      setShowAlert("Please Enter Email");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.email &&
      !isValidEmail(addcandidateEdit.email)
    ) {
      setShowAlert("Please Enter Valid Email");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.mobile == "" ||
      addcandidateEdit.mobile == undefined
    ) {
      setShowAlert("Please Enter Mobile No");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.mobile?.length > 0 &&
      addcandidateEdit.mobile?.length < 10
    ) {
      setShowAlert("Please Enter Valid Mobile Number");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.whatsapp?.length > 0 &&
      addcandidateEdit.whatsapp?.length < 10
    ) {
      setShowAlert("Please Enter Valid Whatsapp Number");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.adharnumber?.length > 0 &&
      addcandidateEdit.adharnumber?.length < 12
    ) {
      setShowAlert("Please Enter Valid Adhaar Number");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.pannumber?.length > 0 &&
      addcandidateEdit.pannumber?.length < 10
    ) {
      setShowAlert("Please Enter Valid Pan Number");
      handleClickOpenerr();
    } else if (resumefiles == 0) {
      setShowAlert("Please upload resume");
      handleClickOpenerr();
    } else if (
      addcandidateEdit.email &&
      !isValidEmail(addcandidateEdit.email)
    ) {
      setShowAlert(
        <>
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter  Valid Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (addcandidateEdit.experience != "" &&
        addcandidateEdit.experience > 0 &&
        addcandidateEdit.currentsalary == "") ||
      0
    ) {
      setShowAlert("Please Enter Current Salary");
      handleClickOpenerr();
    }
    // else if (addcandidateEdit.joiningbydaysopts == "Please Select Joining By Days") {
    //     setShowAlert(
    //         "Please Select Joining By Days"
    //     );
    //     handleClickOpenerr();
    // }
    // else if (addcandidateEdit.expectedsalary == "" || addcandidateEdit.expectedsalary == 0) {
    //     setShowAlert(
    //         "Please Enter Expected Salary"
    //     );
    //     handleClickOpenerr();
    // }
    // else if ((addcandidateEdit.experience != "" && addcandidateEdit.experience > 0 && addcandidateEdit.joinbydays == 0) || 0) {
    //     setShowAlert(

    //         "Please Enter Join By Days"

    //     );
    //     handleClickOpenerr();
    // }
    // else if ((addcandidateEdit.experience != "" && addcandidateEdit.experience > 0 && addcandidateEdit.noticeperiod == 0) || 0) {
    //     setShowAlert(

    //         "Please Enter Notice Period Days"

    //     );
    //     handleClickOpenerr();
    // }
    else {
      fetchAllCandidates();
      // sendRequest();
    }
  };

  const fetchAllCandidates = async () => {
    setBtnSubmit(false);
    try {
      let res = await axios.get(SERVICE.CANDIDATESALLBYRESTRICTION);

      let allcandidates = res?.data?.candidates.slice().sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      let foundData = allcandidates.find((data) => {
        return (
          data.fullname?.toLowerCase() ===
            String(
              addcandidateEdit.firstname + " " + addcandidateEdit.lastname
            )?.toLowerCase() &&
          data.email === String(addcandidateEdit.email) &&
          data._id != ids &&
          data.mobile == addcandidateEdit.mobile
        );
      });

      if (foundData) {
        const datesAdded = new Date(foundData.createdAt);
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
      } else {
        let foundDataNew = allcandidates.find((data) => {
          return (
            data.email === String(addcandidateEdit.email) && data._id != ids
          );
        });

        if (foundDataNew) {
          setShowAlert("Email Already Exist!");
          handleClickOpenerr();
        } else {
          let foundDataMob = allcandidates.find((data) => {
            return data.mobile == addcandidateEdit.mobile && data._id != ids;
          });
          if (foundDataMob) {
            setShowAlert("Mobile Already Exist!");
            handleClickOpenerr();
          } else {
            let foundDataadhaar;
            if (
              addcandidateEdit.adharnumber !== "" &&
              addcandidateEdit.adharnumber != 0
            ) {
              foundDataadhaar = allcandidates.find((data) => {
                return (
                  data.adharnumber == addcandidateEdit.adharnumber &&
                  data._id != ids
                );
              });
            }

            if (foundDataadhaar) {
              setShowAlert("Adhaar Already Exist!");
              handleClickOpenerr();
            } else {
              let foundDataPan;
              if (
                addcandidateEdit.pannumber !== "" &&
                addcandidateEdit.pannumber != 0
              ) {
                foundDataPan = allcandidates.find((data) => {
                  return (
                    data.pannumber == addcandidateEdit.pannumber &&
                    data._id != ids
                  );
                });
              }
              if (foundDataPan) {
                setShowAlert("Pan Number Already Exist!");
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

  console.log(duplicateValues);

  const checkDuplicateFunction = async () => {
    setBtnSubmitDuplicate(true);
    // setIsLoading(true);
    try {
      if (addcandidateEdit.firstname == "") {
        setShowAlert("Please Enter First Name");
        handleClickOpenerr();
      } else if (addcandidateEdit.lastname == "") {
        setShowAlert("Please Enter Last Name");
        handleClickOpenerr();
      } else if (
        addcandidateEdit.email == "" ||
        addcandidateEdit.email == undefined
      ) {
        setShowAlert("Please Enter Email");
        handleClickOpenerr();
      } else if (
        addcandidateEdit.email &&
        !isValidEmail(addcandidateEdit.email)
      ) {
        setShowAlert("Please Enter Valid Email");
        handleClickOpenerr();
      } else if (
        addcandidateEdit.mobile == "" ||
        addcandidateEdit.mobile == undefined
      ) {
        setShowAlert("Please Enter Mobile No");
        handleClickOpenerr();
      } else if (
        addcandidateEdit.mobile?.length > 0 &&
        addcandidateEdit.mobile?.length < 10
      ) {
        setShowAlert("Please Enter Valid Mobile Number");
        handleClickOpenerr();
      } else if (
        addcandidateEdit.adharnumber?.length > 0 &&
        addcandidateEdit.adharnumber?.length < 12
      ) {
        setShowAlert("Please Enter Valid Adhaar Number");
        handleClickOpenerr();
      } else if (
        addcandidateEdit.pannumber?.length > 0 &&
        addcandidateEdit.pannumber?.length < 10
      ) {
        setShowAlert("Please Enter Valid Pan Number");
        handleClickOpenerr();
      } else {
        let res = await axios.get(SERVICE.CANDIDATESALLBYRESTRICTION);

        let allcandidates = res?.data?.candidates.slice().sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });


        let foundData = allcandidates.find((data) => {
          return (
            data.fullname?.toLowerCase() ===
              String(
                addcandidateEdit.firstname + " " + addcandidateEdit.lastname
              )?.toLowerCase() &&
            data.email === String(addcandidateEdit.email) &&
            data._id != ids &&
            data.mobile == addcandidateEdit.mobile
          );
        });

        if (foundData) {
          const datesAdded = new Date(foundData.createdAt);
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
        } else {
          let duplicates = [];

          const allcandidatescheck = allcandidates.filter(
            (item) => item._id !== ids
          );

          let foundDataName = allcandidatescheck.find(
            (data) =>
              data.fullname?.toLowerCase() ===
              String(addcandidateEdit.firstname?.toLowerCase()) +
                " " +
                String(addcandidateEdit.lastname?.toLowerCase())
          );
          if (
            foundDataName &&
            addcandidateEdit.firstname + addcandidateEdit.lastname
          ) {
            duplicates.push({
              field: "Name",
              value:
                addcandidateEdit.firstname +
                " " +
                addcandidateEdit.lastname +
                " " +
                `(Role: ${foundDataName.role}, Applied Date: ${moment(
                  foundDataName.createdAt
                ).format("DD-MM-YYYY")})`,
              id: foundDataName?._id,
            });
          }

          let foundDataNew = allcandidatescheck.find(
            (data) => data.email === String(addcandidateEdit.email)
          );
          if (foundDataNew && addcandidateEdit.email) {
            duplicates.push({
              field: "Email",
              value: addcandidateEdit.email,
              id: foundDataNew?._id,
            });
          }

          let foundDataMob = allcandidatescheck.find(
            (data) => data.mobile == addcandidateEdit.mobile
          );
          if (foundDataMob && addcandidateEdit.mobile) {
            duplicates.push({
              field: "Mobile",
              value: addcandidateEdit.mobile,
              id: foundDataMob?._id,
            });
          }
          let foundDataDob = allcandidatescheck.find(
            (data) => data.dateofbirth == addcandidateEdit.dateofbirth
          );
          if (foundDataDob && addcandidateEdit.dateofbirth) {
            duplicates.push({
              field: "DOB",
              value: moment(addcandidateEdit.dateofbirth).format("DD-MM-YYYY"),
              id: foundDataDob?._id,
            });
          }
          let foundDataadhaar;
          if (addcandidateEdit.adharnumber) {
            foundDataadhaar = allcandidatescheck.find(
              (data) => data.adharnumber == addcandidateEdit.adharnumber
            );
            if (foundDataadhaar) {
              duplicates.push({
                field: "Adhaar",
                value: addcandidateEdit.adharnumber,
                id: foundDataadhaar?._id,
              });
            }
          }
          let foundDataPan;
          if (addcandidateEdit.pannumber) {
            foundDataPan = allcandidatescheck.find(
              (data) => data.pannumber == addcandidateEdit.pannumber
            );
            if (foundDataPan) {
              duplicates.push({
                field: "Pan Number",
                value: addcandidateEdit.pannumber,
                id: foundDataPan?._id,
              });
            }
          }

          setDuplicateValues(duplicates);

          if (duplicates.length > 0) {
            setIsDuplicate(null);
            setBtnSubmitDuplicate(false);
            // setCheckDup(false)
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
            // setCheckDup(false)
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
    if (e?.length > 10) {
      setShowAlert("Mobile number can't more than 10 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setAddcandidateEdit({ ...addcandidateEdit, mobile: num });
    }
  };
  const handleAdhar = (e) => {
    if (e?.length > 12) {
      setShowAlert("Adhar number can't more than 12 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 12);
      setAddcandidateEdit({ ...addcandidateEdit, adharnumber: num });
    }
  };
  const handlepan = (e) => {
    if (e?.length > 10) {
      setShowAlert("Pan number can't more than 10 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setAddcandidateEdit({ ...addcandidateEdit, pannumber: num });
    }
  };
  const handlewhatsapp = (e) => {
    if (e?.length > 10) {
      setShowAlert("Whats app number can't more than 10 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setAddcandidateEdit({ ...addcandidateEdit, whatsapp: num });
    }
  };
  const handlePostal = (e) => {
    if (e?.length > 6) {
      setShowAlert("Postal code can't more than 6 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 6);
      setAddcandidateEdit({ ...addcandidateEdit, postalcode: num });
    }
  };

  const handleSubmitUpdatedupe = (e) => {
    e.preventDefault();
    let updatedCandidate = { ...addcandidateEdit };

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

    setAddcandidateEdit(updatedCandidate);
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
      <Headtitle title={"EDIT UNASSIGNED RESUME"} />
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Edit Candidate </Typography>

      <>
        <Box sx={userStyle.selectcontainer}>
          <Grid container spacing={2}>
            <Grid
              item
              md={12}
              lg={12}
              sm={12}
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="h6">
                Applied Date :{" "}
                {moment(addcandidateEdit.createdAt).format("DD-MM-YYYY")}
              </Typography>
              <Typography variant="h5">
                Role : {addcandidateEdit.role}
              </Typography>
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
                      value={addcandidateEdit.prefix}
                      onChange={(e) => {
                        setAddcandidateEdit({
                          ...addcandidateEdit,
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
                      value={addcandidateEdit.firstname}
                      onChange={(e) => {
                        setAddcandidateEdit({
                          ...addcandidateEdit,
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
                  value={addcandidateEdit.lastname}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                    label: addcandidateEdit.gender,
                    value: addcandidateEdit.gender,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  value={addcandidateEdit.email}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  value={addcandidateEdit.mobile}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                        checked={addcandidateEdit.phonecheck}
                        onChange={(e) =>
                          setAddcandidateEdit({
                            ...addcandidateEdit,
                            phonecheck: !addcandidateEdit.phonecheck,
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
                  value={addcandidateEdit.whatsapp}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      whatsapp: e.target.value,
                    });
                    handlewhatsapp(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            {/* <Grid item md={2} sm={6} xs={12}>
                            <Typography>Profile Image</Typography>
                            {addcandidateEdit.uploadedimage && <>
                                <img src={addcandidateEdit.uploadedimage} style={{ maxHeight: '200px', maxWidth: '150px', marginTop: '10px' }} />
                            </>}
                            <div style={{ display: 'flex' }}>
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
                                {addcandidateEdit?.uploadedimage && <>
                                    <IconButton aria-label="delete" onClick={handleDeleteImage}>
                                        <DeleteOutlineOutlinedIcon sx={{ color: 'red' }} />
                                    </IconButton>
                                </>}

                            </div>






                        </Grid> */}
            <Grid item lg={2} md={3} sm={12} xs={12}>
              <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>

              {croppedImage && (
                <>
                  <img style={{ height: 120 }} src={croppedImage} alt="" />
                </>
              )}
              <div>
                {(addcandidateEdit.uploadedimage && !croppedImage) ||
                (getImgedit !== null && getImgedit !== undefined) ? (
                  <>
                    <Cropper
                      style={{ height: 120, width: "100%" }}
                      aspectRatio={1 / 1}
                      // src={selectedFile}
                      src={
                        getImgedit !== null && getImgedit !== undefined
                          ? getImgedit
                          : addcandidateEdit.uploadedimage
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

                    {addcandidateEdit.uploadedimage && (
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
                    getImgedit={getImgedit}
                    setGetImgedit={setGetImgedit}
                    capturedImagesedit={capturedImages}
                    setValNumedit={setValNum}
                    name={nameedit}
                    valNumedit={valNume}
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
                  value={addcandidateEdit.dateofbirth}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      dateofbirth: e.target.value,
                    });
                  }}
                /> */}
                <OutlinedInput
                  id="component-outlined"
                  value={addcandidateEdit.dateofbirth}
                  onChange={(e) => {
                    let age = calculateAge(e.target.value);
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  value={addcandidateEdit.age}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue?.length < 4 && inputValue >= 0) {
                      setAddcandidateEdit({
                        ...addcandidateEdit,
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
                  value={addcandidateEdit.adharnumber}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      adharnumber: e.target.value,
                    });
                    handleAdhar(e.target.value);
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
                  value={addcandidateEdit.pannumber}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      pannumber: e.target.value,
                    });
                    handlepan(e.target.value);
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
                  value={addcandidateEdit.street}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                                    value={addcandidateEdit.city}
                                    onChange={(e) => {
                                        setAddcandidateEdit({
                                            ...addcandidateEdit,
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
                                    value={addcandidateEdit.state}
                                    onChange={(e) => {
                                        setAddcandidateEdit({
                                            ...addcandidateEdit,
                                            state: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid> */}
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Postal code</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  value={addcandidateEdit.postalcode}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                                    value={addcandidateEdit.country}
                                    onChange={(e) => {
                                        setAddcandidateEdit({
                                            ...addcandidateEdit,
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
                <b> Experience Details</b>
              </Typography>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Overall Experience<b style={{ color: "red" }}>*</b>
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    addcandidateEdit.experienceestimation == undefined
                      ? "Years"
                      : addcandidateEdit?.experienceestimation
                  }
                  onChange={(e) => {
                    setexperience(0);
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  {`No. Of ${
                    addcandidateEdit?.experienceestimation == undefined
                      ? "Years"
                      : addcandidateEdit?.experienceestimation
                  }`}
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit.experience}
                  onChange={(e) => {
                    setexperience(Number(e.target.value));
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      experience:
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0,
                      noticeperiod: 0,
                      currentsalary: 0,
                    });
                  }}
                  sx={userStyle.input}
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
                  value={
                    addcandidateEdit?.domainexperienceestimation == undefined
                      ? "Years"
                      : addcandidateEdit?.domainexperienceestimation
                  }
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  {`No. Of ${
                    addcandidateEdit?.domainexperienceestimation == undefined
                      ? "Years"
                      : addcandidateEdit?.domainexperienceestimation
                  }`}
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  sx={userStyle.input}
                  value={addcandidateEdit.domainexperience}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  value={addcandidateEdit.currentjobtitle}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  value={addcandidateEdit.currentemployer}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      currentemployer: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Expected Salary</Typography>
                <Selects
                  id="component-outlined"
                  type="text"
                  options={expectedsalaryOption}
                  value={{
                    value: addcandidateEdit.expectedsalaryopts,
                    label: addcandidateEdit.expectedsalaryopts,
                  }}
                  sx={userStyle.input}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  value={addcandidateEdit.expectedsalary}
                  sx={userStyle.input}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                <Typography>Joining By Days</Typography>
                <Selects
                  options={joiningbydaysOption}
                  id="component-outlined"
                  type="text"
                  value={{
                    value: addcandidateEdit.joiningbydaysopts,
                    label: addcandidateEdit.joiningbydaysopts,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      joiningbydaysopts: e.value,
                    });
                  }}
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
                  value={addcandidateEdit.joinbydays}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
            {addcandidateEdit.experience <= 0 ? (
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
                      value={addcandidateEdit.currentsalary}
                      onChange={(e) => {
                        setAddcandidateEdit({
                          ...addcandidateEdit,
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
                      value={addcandidateEdit.noticeperiod}
                      onChange={(e) => {
                        setAddcandidateEdit({
                          ...addcandidateEdit,
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
                  value={addcandidateEdit.skillset}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  value={addcandidateEdit.additionalinfo}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      additionalinfo: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Linked In Id</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit.linkedinid}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                    label: addcandidateEdit.status,
                    value: addcandidateEdit.status,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                    label: addcandidateEdit.source,
                    value: addcandidateEdit.source,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      source: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2.5} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Source of Candidate</Typography>
                <Selects
                  options={sourcecandidateOption}
                  placeholder="Choose Source"
                  value={{
                    label: addcandidateEdit.sourcecandidate,
                    value: addcandidateEdit.sourcecandidate,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      sourcecandidate: e.value,
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
                  value={addcandidateEdit.interviewdate}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
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
                  value={addcandidateEdit.time}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      time: e.target.value,
                    });
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
                        fetchEducation(e, educationDetails.categoryedu);
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
                    <Typography>Duration</Typography>
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
                      <StyledTableCell>degree</StyledTableCell>
                      <StyledTableCell>duration</StyledTableCell>
                      <StyledTableCell>pursuing</StyledTableCell>
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
                            {row.pursuing ? "Yes" : "No"}
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
                      <StyledTableCell>Summay</StyledTableCell>
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
                            {row.currentlyworkhere ? "Yes" : "No"}
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
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Skill set known</Typography>
                <MultiSelect
                  options={skill}
                  value={selectedskill}
                  onChange={handleSkilChange}
                  valueRenderer={renderValueSkill}
                  labelledBy="Please Select Category"
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
                <b> Attachement Information</b>
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
                        label: addcandidateEdit.candidatefilename,
                        value: addcandidateEdit.candidatefilename,
                      }}
                      onChange={(e) => {
                        setAddcandidateEdit({
                          ...addcandidateEdit,
                          candidatefilename: e.value,
                          shortname: e.shortname,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                  {addcandidateEdit.candidatefilename !==
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
                <Box>
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

            {addcandidateEdit.experience > 0 && (
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
                    <Box>
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
                <Box>
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
                    marginLeft: "20px",
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
                  update
                </LoadingButton>
              </Grid>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Link to={`/recruitment/unassignedcandidates`}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    cancel
                  </Button>
                </Link>
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
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "100px", color: "orange" }}
                />
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
              open={isErrorOpenUpdate}
              onClose={handleCloseerrupdate}
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
                {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} /> */}
                <Typography
                  variant="h6"
                  style={{ fontSize: "20px", fontWeight: 900 }}
                >
                  {showAlertUpdate}
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
                  onClick={handleCloseerrupdate}
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

export default UnassignedResumeEdit;