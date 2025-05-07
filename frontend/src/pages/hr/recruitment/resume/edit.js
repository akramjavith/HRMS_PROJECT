import AddIcon from "@mui/icons-material/Add";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import LinkIcon from "@mui/icons-material/Link";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextareaAutosize,
  Typography,
  Tooltip
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { City, Country, State } from "country-state-city";
import * as faceapi from "face-api.js";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cropper from "react-cropper";
import { MultiSelect } from "react-multi-select-component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import { v4 as uuidv4 } from "uuid";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { BASE_URL } from "../../../../services/Authservice";
import { SERVICE } from "../../../../services/Baseservice";
import Webcamimage from "../../../../components/webCamWithDuplicate";
import ExistingProfileVisitor from "../../../interactors/visitors/ExistingProfileVisitor";

import AlertDialog from "../../../../components/Alert";
import MessageAlert from "../../../../components/MessageAlert";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import { candidatestatusOption, workmodeOption } from '../../../../components/Componentkeyword';

function calculateLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate luminance using the formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // If luminance is greater than 128, it's a light color
  return luminance > 128;
}

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
function ResumeEdit() {
  const [color, setColor] = useState('#FFFFFF');
  const [bgbtn, setBgbtn] = useState(false);
  const handleColorChange = (e) => {
    setColor(e.target.value);
  };
  const handleSubmitNew = async () => {
    setBgbtn(true);
    if (!image || !color) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('color', color);

    try {
      const response = await axios.post(SERVICE.REMOVEBG, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // setCroppedImage(response?.data?.image); // Set the base64 image
      setAddcandidateEdit({ ...addcandidateEdit, uploadedimage: response?.data?.image });
      setBgbtn(false);
    } catch (error) {
      setBgbtn(false);
      console.error('Error uploading image:', error);
    }
  };



  const isLightColor = calculateLuminance(color);

  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setBtnSubmitDuplicate(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
    setBtnSubmit(false);
    setIsLoading(false);
  };

  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

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
  const [btnSubmit, setBtnSubmit] = useState(false);

  const [btnSubmitDuplicate, setBtnSubmitDuplicate] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(null);

  // Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  // Country city state datas
  const [selectedCountry, setSelectedCountry] = useState(
    Country.getAllCountries().find((country) => country.name === "India")
  );

  console.log(selectedCountry, "selectedCountry")
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
    time: "",
    skill: [],
    uploadedimage: null,
    uploadedimagename: null,
    files: [],
    joinbydays: 0,
    noticeperiod: 0,
    gender: "Please Select Gender",
    expectedsalaryopts: "Please Select Expected Salary",
    joiningbydaysopts: "Please Select Joining By Days",
    candidatefilename: "Please Select Candidate Document",

    //newvalues
    experienceoption: "Please Select Experience",
    addesstype: "Home",
    personalprefix: "Please Select Personal Prefix",
    referencename: "",
    landmarkpositionprefix: "Please Select Landmark Position Prefix",
    landmarkname: "",
    houseflatnumber: "",
    streetroadname: "",
    localityareaname: "",
    pcountry: selectedCountry?.name,
    pstate: selectedState?.name,
    pcity: selectedCity?.name,
    postalcode: "",
    gpscoordinate: ""

  });

  console.log(addcandidateEdit, "addcandidateEdit");

  const [designations, setDesignations] = useState([]);

  //get all Areas.
  const fetchCandidatedocumentdropdowns = async (name, role) => {
    setPageName(!pageName);
    try {
      let res_candidate = await axios.get(SERVICE.CANDIDATEDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // let data_set = res_candidate.data.candidatedocuments;
      let data_set = res_candidate.data.candidatedocuments.filter(
        (data) => data.designation === role
      );
      let data_set_all = res_candidate.data.candidatedocuments.filter(
        (data) => data.allresume === true
      );

      const desigall = [
        ...data_set_all.reduce((acc, curr) => {
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

      const desig = [
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

      setDesignations(role === "All" ? desigall : desig);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [currentText, setCurrentText] = useState("");

  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef(null);

  const [file, setFile] = useState("");

  const [image, setImage] = useState("")
  const handleCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    const croppedImageData = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
    setCroppedImage(croppedImageData);
    setAddcandidateEdit({ ...addcandidateEdit, uploadedimage: croppedImageData });
    const base64Data = croppedImageData.split(',')[1]; // Get base64 data (without the prefix)
    const binaryData = atob(base64Data); // Decode base64 data
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    // Fill the array buffer with the decoded binary data
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the binary data
    const blob = new Blob([uint8Array], { type: 'image/png' });
    setImage(blob);
  };

  const handleClearImage = () => {
    setFile(null);
    setGetImg(null);
    setSelectedFile(null);
    setCroppedImage(null);
    setAddcandidateEdit({ ...addcandidateEdit, uploadedimage: "", faceDescriptor: [] });


    setImage("");
  };

  // Image Upload
  useEffect(() => {
    const loadModels = async () => {
      const modelUrl = SERVICE.FACEDETECTLOGINMODEL;
      console.log(modelUrl, "modelUrl");
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
      console.log("Models loaded");
    };
    loadModels();
    console.log(window.location.origin, "window.location.origin");
  }, []);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  useEffect(() => {
    setAddcandidateEdit((prev) => ({ ...prev, uploadedimage: getImg }))
  }, [getImg])
  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const closeWebCam = () => {
    setAddcandidateEdit({
      ...addcandidateEdit,
      uploadedimage: "",
      faceDescriptor: [],
    });
    setGetImg(null);
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
  const [btnUpload, setBtnUpload] = useState(false);
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showDupProfileVIsitor, setShowDupProfileVIsitor] = useState([]);
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };
  const UploadWithDuplicate = (e) => {
    setShowDupProfileVIsitor([]);
    handleCloseerrpop();
  }
  const UploadWithoutDuplicate = (e) => {

    setAddcandidateEdit({
      ...addcandidateEdit,
      uploadedimage: "",
      faceDescriptor: [],
    });
    setShowDupProfileVIsitor([]);
    handleCloseerrpop();
  }
  function handleChangeImage(e) {
    setBtnUpload(true); // Enable loader when the process starts
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    // Get the selected file
    const file = e.target.files[0];

    if (file && file.size < maxFileSize) {
      const path = URL.createObjectURL(file);
      const image = new Image();
      image.src = path;

      image.onload = async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          if (detections.length > 0) {
            const faceDescriptor = detections[0].descriptor;

            const response = await axios.post(
              `${SERVICE.DUPLICATECANDIDATEFACEDETECTVISITOR}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                id: null,
                faceDescriptor: Array.from(faceDescriptor),
              }
            );


            if (response?.data?.matchfound) {
              // setPopupContentMalert('Image Already In Use.');
              // setPopupSeverityMalert("info");
              // handleClickOpenPopupMalert();
              toDataURL(path, function (dataUrl) {
                setAddcandidateEdit({
                  ...addcandidateEdit,
                  uploadedimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
              setShowDupProfileVIsitor(response?.data?.matchedData);
              handleClickOpenerrpop();
            } else {
              toDataURL(path, function (dataUrl) {
                setAddcandidateEdit({
                  ...addcandidateEdit,
                  uploadedimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
            }
          } else {
            setPopupContentMalert('No face detected.');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } catch (error) {
          setPopupContentMalert('Error in face detection.');
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } finally {
          setBtnUpload(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert('Error loading image.');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();;
        setBtnUpload(false); // Disable loader in case of error
      };

      setFile(URL.createObjectURL(file));
    } else {
      setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setBtnUpload(false); // Disable loader if file is too large
    }
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
  const [selectedFile, setSelectedFile] = useState(null);

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



  const [educationDetails, setEducationDetails] = useState({
    school: "",
    department: "",
    degree: "",
    fromduration: "",
    toduration: "",
    percentage: "",
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
    if (from === "resumemanagement") {
      backPage("/resumemanagement");
    } else if (from === "recruitment") {
      backPage(`/company/recuritment/${jobopeningId}`);
    } else if (from === "assignedcandidates") {
      backPage("/recruitment/assignedcandidates");
    } else if (from === "candidatemissingfield") {
      backPage("/candidatemissingfields");
    } else {
      backPage("/resumemanagement");
    }
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

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);

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

  const fetchOverAllSettings = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setJobApplyDays(res?.data?.overallsettings[0].jobapplydays);
      setContactEmail(res?.data?.overallsettings[0]?.contactemail);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchCategoryBased = async (e) => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchEducation = async (e, categoryEdu) => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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

  const fetchCategoryEducation = async () => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [skill, setSkill] = useState([]);
  const fetchAllSkill = async () => {
    setPageName(!pageName);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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

  const renderValueSkill = (valueCate, _skill) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select category";
  };

  const { isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Edit Candidate"),
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

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const backPage = useNavigate();

  const ids = useParams().id;
  const from = useParams().from;

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

  const [certification, setCertification] = useState([]);

  const fetchCertification = async () => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.get(SERVICE.CERTIFICATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCertification(
        res_queue?.data?.certifications?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
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

  const getinfoCode = async () => {
    setPageName(!pageName);
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

      console.log(res?.data?.scandidates?.pcountry, "res?.data?.scandidates")

      console.log(Country.getAllCountries().find((country) => country.name === res?.data?.scandidates?.pcountry));
      setSelectedCountry(Country.getAllCountries().find((country) => country.name === res?.data?.scandidates?.pcountry));
      setSelectedState(State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === res?.data?.scandidates?.pcountry)?.isoCode).find((state) => state.name === res?.data?.scandidates?.pstate));
      setSelectedCity(City.getCitiesOfState(State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === res?.data?.scandidates?.pcountry)?.isoCode).find((state) => state.name === res?.data?.scandidates?.pstate)?.countryCode, State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === res?.data?.scandidates?.pcountry)?.isoCode).find((state) => state.name === res?.data?.scandidates?.pstate)?.isoCode).find((city) => city.name === res?.data?.scandidates?.pcity));


      setJobopeningId(res?.data?.scandidates?.jobopeningsid || "");
      setUploadedResumeFilesEdit(res?.data?.scandidates?.resumefile?.filter(data => !data?.preview));
      setUploadedCoverLetterEdit(res?.data?.scandidates?.coverletterfile?.filter(data => !data?.preview));
      setUploadedExperienceLetterEdit(res?.data?.scandidates?.experienceletterfile?.filter(data => !data?.preview));
      setUploadedCandidateFilesEdit(res.data.scandidates.candidatedatafile?.filter(data => !data?.preview));
      setUploadedPayslipLetterEdit(res?.data?.scandidates?.payslipletterfile?.filter(data => !data?.preview));

      setCurrentText(res?.data?.scandidates?.coverlettertext);
      setEducationtodo(res?.data?.scandidates?.educationdetails);
      setExperiencetodo(res?.data?.scandidates?.experiencedetails);
      setSelectedSkill(res?.data?.scandidates?.skill);
      getunitvaluesCate(res?.data?.scandidates);
      setValueCate(res?.data?.scandidates?.skill);
      setexperience(res.data.scandidates.experience);
      setSelectedCertification(
        res.data.scandidates.certification.map((t) => ({
          label: t,
          value: t,
        }))
      );

      fetchCandidatedocumentdropdowns(
        res.data.scandidates.candidatefilename,
        res.data.scandidates.role
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
    getinfoCode();
    fetchCertification();
    fetchCategoryEducation();
    fetchOverAllSettings();
    // fetchCandidatedocumentdropdowns();
  }, [ids]);

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
    setTodoscheck((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreview = async (file) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const renderFilePreviewMulterUploaded = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VIEW_RECRUITMENT_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
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
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      educationDetails.subcategoryedu == "Please Select Sub Category" ||
      educationDetails.subcategoryedu == ""
    ) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      educationDetails.specialization == "Please Select Specialization" ||
      educationDetails.specialization == ""
    ) {
      setPopupContentMalert("Please Select Specialization!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (educationDetails.school == "") {
      setPopupContentMalert("Please Enter School field!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (educationDetails.department == "") {
      setPopupContentMalert("Please Enter Department field!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (educationDetails !== "") {
      setEducationtodo([...educationtodo, educationDetails]);
      setEducationDetails({
        school: "",
        department: "",
        degree: "",
        fromduration: "",
        percentage: "",
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
      setPopupContentMalert("Please Enter Occupation  field!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (experienceDetails.company == "") {
      setPopupContentMalert("Please Enter Company field!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
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

  const [uploadedCandidateFilesEdit, setUploadedCandidateFilesEdit] = useState([]);
  const [uploadedCandidateFilesDelete, setUploadCandidateFilesDelete] = useState([]);

  const handleFileDeleteEditUploadedCandidateFiles = (index) => {
    setUploadedCandidateFilesEdit((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setUploadCandidateFilesDelete((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });

  };
  const handleCandidateUpload = (event) => {
    if (
      todoscheck.some(
        (data) => data.candidatefilename === addcandidateEdit.candidatefilename
      )
    ) {
      setPopupContentMalert(
        `${addcandidateEdit.candidatefilename} Already Exists!`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
      if (!selectedFiles.length) return;

      let largeFiles = []; // To store names of files larger than 1MB

      // Filter files that are <= 1MB (1,024,000 bytes)
      const filteredFiles = selectedFiles.filter((file) => {
        if (file.size > 1024000) {
          largeFiles.push(file.name); // Collect large file names
          return false;
        }
        return true;
      });

      // If there are large files, show a single popup message
      if (largeFiles.length > 0) {
        setPopupContentMalert(
          `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

      if (filteredFiles.length === 0) return; // If no valid files, exit


      let casesensitivefirstname = addcandidateEdit.firstname
        ?.replace(/\s+/g, "")
        ?.toLowerCase();
      let casesensitivelastname = addcandidateEdit.lastname
        ?.replace(/\s+/g, "")
        ?.toLowerCase();


      setTodoscheck((prevFiles) => [
        ...prevFiles,
        ...filteredFiles.map((file) => {
          let extension = file.name.split(".").pop();
          let newFileName = `${casesensitivefirstname}_${casesensitivelastname}_${addcandidateEdit?.shortname}.${extension}`;

          // Create a new File object with the modified name
          let updatedFile = new File([file], newFileName, { type: file.type });

          return {
            file: updatedFile, // Preserve all file properties
            candidatefilename: addcandidateEdit.candidatefilename,
            name: newFileName,
            remark: "candidate file",
            uploadedby: "employee",
            shortname: addcandidateEdit?.shortname,
          };
        }),
      ]);



    }
  };
  const handleCandidateUploadSingle = (event) => {
    if (
      todoscheck.some(
        (data) => data.candidatefilename === addcandidateEdit.candidatefilename
      )
    ) {
      setPopupContentMalert(
        `${addcandidateEdit.candidatefilename} Already Exists`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
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
  const [uploadedResumeFilesEdit, setUploadedResumeFilesEdit] = useState([]);
  const [uploadedResumeFilesDelete, setUploadResumeFilesDelete] = useState([]);
  const handleResumeUpload = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setResumeFiles((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
        remarks: ""
      })),
    ]);
  };
  const handleFileDeleteEditUploadedResumeFiles = (index) => {
    setUploadedResumeFilesEdit((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setUploadResumeFilesDelete((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });

  };
  const [coverletter, setCoverletter] = useState([]);
  const [uploadedCoverLetterEdit, setUploadedCoverLetterEdit] = useState([]);
  const [uploadedCoverLetterDelete, setUploadCoverLetterDelete] = useState([]);
  const handleCoverletterUpload = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setCoverletter((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
        remarks: ""
      })),
    ]);
  };
  const handleFileDeleteEditUploadedCoverLetter = (index) => {
    setUploadedCoverLetterEdit((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setUploadCoverLetterDelete((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });

  };
  const [experienceletter, setExperienceletter] = useState([]);
  const [uploadedExperienceLetterEdit, setUploadedExperienceLetterEdit] = useState([]);
  const [uploadedExperienceLetterDelete, setUploadExperienceLetterDelete] = useState([]);
  const handleExperienceletterUpload = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setExperienceletter((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
        remarks: ""
      })),
    ]);
  };
  const handleFileDeleteEditUploadedExperienceLetter = (index) => {
    setUploadedExperienceLetterEdit((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setUploadExperienceLetterDelete((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });

  };
  const [payslipletter, setPayslipletter] = useState([]);
  const [uploadedPayslipLetterEdit, setUploadedPayslipLetterEdit] = useState([]);
  const [uploadedPayslipLetterDelete, setUploadPayslipLetterDelete] = useState([]);
  const handlePayslipletterUpload = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setPayslipletter((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
        remarks: ""
      })),
    ]);
  };
  const handleFileDeleteEditUploadedPayslipLetter = (index) => {
    setUploadedPayslipLetterEdit((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setUploadPayslipLetterDelete((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });

  };

  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  let loginid = localStorage.LoginUserId;
  const usernameaddedby = isUserRoleAccess?.companyname;

  let updateby = addcandidateEdit.updatedby;

  let name = "edit";

  const sendRequest = async () => {
    let certi = selectedCertification.map((item) => item.value);

    setPageName(!pageName);
    try {

      let formData = new FormData();




      if (resumefiles.length > 0) {
        resumefiles.forEach((item, index) => {
          formData.append("resumefile", item.file);
        });
      }
      if (coverletter.length > 0) {
        coverletter.forEach((item, index) => {
          formData.append("coverletterfile", item.file);
        });
      }
      if (experienceletter.length > 0) {
        experienceletter.forEach((item, index) => {
          formData.append("experienceletterfile", item.file);
        });
      }
      if (payslipletter.length > 0) {
        payslipletter.forEach((item, index) => {
          formData.append("payslipletterfile", item.file);
        });
      }
      if (todoscheck.length > 0) {

        const filesArray = todoscheck.filter((item) => item.file);
        const nonFilesArray = todoscheck.filter((item) => !item.file);


        if (filesArray.length > 0) {
          filesArray.forEach((item, index) => {
            formData.append(`candidatedatafile`, item.file); // Append the file
            formData.append(`uniqueid[${index}]`, item?.uniqueid || ""); // Append unique ID
            formData.append(`link[${index}]`, item?.link || "");
            formData.append(`linkname[${index}]`, item?.linkname || "");
            formData.append(`csfilname[${index}]`, item?.csfilname || "");
            formData.append(`uploadedby[${index}]`, item?.uploadedby || "");
            formData.append(`shortname[${index}]`, item?.shortname || "");
            formData.append(`candidatefilename[${index}]`, item?.candidatefilename || "");
          });
        }
        if (nonFilesArray.length > 0) {
          formData.append("candidatenonfilesarray", JSON.stringify(nonFilesArray));
        }
      }

      if (uploadedCandidateFilesDelete.length > 0) {
        formData.append("deleteCandidatedatafile", JSON.stringify(uploadedCandidateFilesDelete));
      }
      if (uploadedResumeFilesDelete.length > 0) {
        formData.append("deleteResumefile", JSON.stringify(uploadedResumeFilesDelete));
      }
      if (uploadedCoverLetterDelete.length > 0) {
        formData.append("deleteCoverletterfile", JSON.stringify(uploadedCoverLetterDelete));
      }
      if (uploadedExperienceLetterDelete.length > 0) {
        formData.append("deleteExperienceletterfile", JSON.stringify(uploadedExperienceLetterDelete));
      }
      if (uploadedPayslipLetterDelete.length > 0) {
        formData.append("deletePayslipletterfile", JSON.stringify(uploadedPayslipLetterDelete));
      }
      const jsonData = {

        //Newvalue
        addesstype: String(addcandidateEdit.addesstype),
        personalprefix: String(addcandidateEdit.personalprefix),
        referencename: String(addcandidateEdit.referencename),
        landmarkpositionprefix: String(addcandidateEdit.landmarkpositionprefix),
        landmarkname: String(addcandidateEdit.landmarkname),
        houseflatnumber: String(addcandidateEdit.houseflatnumber),
        streetroadname: String(addcandidateEdit.streetroadname),
        localityareaname: String(addcandidateEdit.localityareaname),
        pcountry: String(addcandidateEdit.pcountry),
        pstate: String(addcandidateEdit.pstate),
        pcity: String(addcandidateEdit.pcity),
        ppincode: String(addcandidateEdit.ppincode),
        gpscoordinate: String(addcandidateEdit.gpscoordinate),
        experienceoption: String(addcandidateEdit.experienceoption),

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
        pannumber: String(
          addcandidateEdit.pannumber === null ? "" : addcandidateEdit.pannumber
        ),
        age: Number(addcandidateEdit.age),
        dateofbirth: String(addcandidateEdit.dateofbirth),
        interviewdate: String(addcandidateEdit.interviewdate),
        time: String(addcandidateEdit.time),
        street: String(addcandidateEdit.street),

        // city: String(selectedCity.name),
        // state: String(selectedState.name),
        // country: String(selectedCountry.name),
        // pcountry: String(addcandidateEdit.pcountry),
        // pstate: String(addcandidateEdit.pstate),
        // pcity: String(addcandidateEdit.pcity),

        postalcode: Number(addcandidateEdit.postalcode),

        experience: Number(
          addcandidateEdit.experience === null
            ? ""
            : addcandidateEdit.experience
        ),
        experienceestimation: String(addcandidateEdit.experienceestimation),
        domainexperienceestimation: addcandidateEdit.domainexperienceestimation,

        domainexperience: Number(addcandidateEdit.domainexperience),
        expectedsalaryopts: String(
          addcandidateEdit?.expectedsalaryopts === undefined
            ? ""
            : addcandidateEdit.expectedsalaryopts
        ),
        joiningbydaysopts: String(
          addcandidateEdit?.joiningbydaysopts === undefined
            ? ""
            : addcandidateEdit.expectedsalaryopts
        ),

        joinbydays: Number(addcandidateEdit.joinbydays),
        noticeperiod: Number(addcandidateEdit.noticeperiod),
        certification: valueCertification,
        faceDescriptor:
          addcandidateEdit?.faceDescriptor?.length > 0
            ? addcandidateEdit?.faceDescriptor
            : [],
        uploadedimage:
          getImg !== null && getImg !== undefined
            ? getImg
            : addcandidateEdit.uploadedimage == null
              ? ""
              : String(addcandidateEdit.uploadedimage),
        uploadedimagename: String(addcandidateEdit.uploadedimagename),
        files: addcandidateEdit.files,
        gender: addcandidateEdit.gender,

        // qualification: String(addcandidateEdit.qualification),
        //for other qualifictaion updates
        //
        // categoryedu: String(addcandidateEdit.categoryedu),
        // subcategoryedu: String(addcandidateEdit.subcategoryedu),
        // specialization: String(addcandidateEdit.specialization),
        jobopeningsid: String(jobopeningId),

        currentjobtitle: String(addcandidateEdit.currentjobtitle),
        currentemployer: String(addcandidateEdit.currentemployer),
        expectedsalary: String(addcandidateEdit.expectedsalary),
        currentsalary: String(addcandidateEdit.currentsalary),
        skillset: String(addcandidateEdit.skillset),
        additionalinfo: String(addcandidateEdit.additionalinfo),
        linkedinid: String(addcandidateEdit.linkedinid),
        status: String(
          addcandidateEdit.status === undefined ? "" : addcandidateEdit.status
        ),
        source: String(
          addcandidateEdit.source === undefined ? "" : addcandidateEdit.source
        ),
        sourcecandidate: String(addcandidateEdit.sourcecandidate),
        resumefile: [...resumefiles],
        coverletterfile: [...coverletter],
        coverlettertext: currentText,
        experienceletterfile: [...experienceletter],
        payslipletterfile: [...payslipletter],
        educationdetails: [...educationtodo],
        experiencedetails: [...experiencetodo],
        skill: [...valueCate],
        candidatedatafile: [...todoscheck],
        updatedby: [
          ...updateby,
          {
            name: String(usernameaddedby),
            date: String(new Date()),
          },
        ],
        role: String(addcandidateEdit.role),
        today: String(today),
      }
      formData.append("jsonData", JSON.stringify(jsonData));

      let res_queue = await axios.put(`${SERVICE.CANDIDATE_UPDATE_MULTER}/${ids}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });

      // backPage('/resumemanagement')
      handleCloseerrupdate();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsLoading(false);
    } catch (err) {
      console.log(err, "err")
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
    setResumeFiles([]);
    setExperienceletter([]);
    setEducationtodo([]);
    setExperiencetodo([]);
    setEducationDetails({
      school: "",
      department: "",
      percentage: "",
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

  const handleSubmit = (e) => {
    setBtnSubmit(true);
    setIsLoading(true);
    if (addcandidateEdit.firstname == "") {
      setPopupContentMalert("Please Enter First Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (addcandidateEdit.lastname == "") {
      setPopupContentMalert("Please Enter Last Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.gender == "Please Select Gender" ||
      addcandidateEdit.gender == "" ||
      addcandidateEdit.gender == undefined
    ) {
      setPopupContentMalert("Please Select Gender!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.email == "" ||
      addcandidateEdit.email == undefined
    ) {
      setPopupContentMalert("Please Enter Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.email &&
      !isValidEmail(addcandidateEdit.email)
    ) {
      setPopupContentMalert("Please Enter Valid Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.mobile == "" ||
      addcandidateEdit.mobile == undefined
    ) {
      setPopupContentMalert("Please Enter Mobile No!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.mobile?.length > 0 &&
      addcandidateEdit.mobile?.length < 10
    ) {
      setPopupContentMalert("Please enter a 10-digit mobile number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.whatsapp?.length > 0 &&
      addcandidateEdit.whatsapp?.length < 10
    ) {
      setPopupContentMalert("Please enter a 10-digit whatsapp number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (addcandidateEdit.dateofbirth == "" || addcandidateEdit.dateofbirth == undefined) {
      setPopupContentMalert("Please Select DOB!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.adharnumber?.length > 0 &&
      addcandidateEdit.adharnumber?.length < 12
    ) {
      setPopupContentMalert("Please enter a 12-digit Adhaar number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.pannumber?.length > 0 &&
      addcandidateEdit.pannumber?.length < 10
    ) {
      setPopupContentMalert("Please enter a valid Pan number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if ([...resumefiles,
    ...uploadedResumeFilesEdit].length === 0) {
      setPopupContentMalert("Please Upload Resume!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      addcandidateEdit.email &&
      !isValidEmail(addcandidateEdit.email)
    ) {
      setPopupContentMalert("Please Enter Valid Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (addcandidateEdit.experience != "" &&
        addcandidateEdit.experience > 0 &&
        addcandidateEdit.currentsalary == "" && addcandidateEdit.experienceoption !== "Not Working") ||
      0
    ) {
      setPopupContentMalert("Please Enter Current Salary!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchAllCandidates();
      // sendRequest();
    }
  };

  const fetchAllCandidates = async () => {
    setBtnSubmit(false);
    setPageName(!pageName);
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
          setPopupContentMalert("Email Already Exist!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          let foundDataMob = allcandidates.find((data) => {
            return data.mobile == addcandidateEdit.mobile && data._id != ids;
          });
          if (foundDataMob) {
            setPopupContentMalert("Mobile Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          } else {
            let foundDataadhaar;
            if (
              addcandidateEdit.adharnumber !== "" &&
              addcandidateEdit.adharnumber != 0 &&
              addcandidateEdit.adharnumber != null
            ) {
              foundDataadhaar = allcandidates.find((data) => {
                return (
                  data.adharnumber == addcandidateEdit.adharnumber &&
                  data._id != ids
                );
              });
            }

            if (foundDataadhaar) {
              setPopupContentMalert("Adhaar Already Exist!");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            } else {
              let foundDataPan;
              if (
                addcandidateEdit.pannumber !== "" &&
                addcandidateEdit.pannumber != 0 &&
                addcandidateEdit.pannumber != null
              ) {
                foundDataPan = allcandidates.find((data) => {
                  return (
                    data.pannumber == addcandidateEdit.pannumber &&
                    data._id != ids
                  );
                });
              }
              if (foundDataPan) {
                setPopupContentMalert("PAN Number Already Exist!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
              } else {
                sendRequest();
              }
            }
          }
        }
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const buttonStyleslocal = {
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
    setPageName(!pageName);
    try {
      if (addcandidateEdit.firstname == "") {
        setPopupContentMalert("Please Enter First Name!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (addcandidateEdit.lastname == "") {
        setPopupContentMalert("Please Enter Last Name!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        addcandidateEdit.email == "" ||
        addcandidateEdit.email == undefined
      ) {
        setPopupContentMalert("Please Enter Email!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        addcandidateEdit.email &&
        !isValidEmail(addcandidateEdit.email)
      ) {
        setPopupContentMalert("Please Enter Valid Email!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        addcandidateEdit.mobile == "" ||
        addcandidateEdit.mobile == undefined
      ) {
        setPopupContentMalert("Please Enter Mobile No!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        addcandidateEdit.mobile?.length > 0 &&
        addcandidateEdit.mobile?.length < 10
      ) {
        setPopupContentMalert("Please enter a 10-digit mobile number!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (addcandidateEdit.dateofbirth == "" || addcandidateEdit.dateofbirth == undefined) {
        setPopupContentMalert("Please Select DOB!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (
        addcandidateEdit.adharnumber?.length > 0 &&
        addcandidateEdit.adharnumber?.length < 12
      ) {
        setPopupContentMalert("Please Enter Valid Adhaar Number!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        addcandidateEdit.pannumber?.length > 0 &&
        addcandidateEdit.pannumber?.length < 10
      ) {
        setPopupContentMalert("Please Enter Valid Pan Number!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
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

  const handleMobile = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Mobile number can't more than 10 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setAddcandidateEdit({ ...addcandidateEdit, mobile: num });
    }
  };
  const handleAdhar = (e) => {
    if (e.length > 12) {
      setPopupContentMalert("Whats app number can't more than 10 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 12);
      setAddcandidateEdit({ ...addcandidateEdit, adharnumber: num });
    }
  };
  const handlepan = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("PAN number can't more than 10 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setAddcandidateEdit({ ...addcandidateEdit, pannumber: num });
    }
  };
  const handlewhatsapp = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Whats app number can't more than 10 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setAddcandidateEdit({ ...addcandidateEdit, whatsapp: num });
    }
  };
  const handlePostal = (e) => {
    if (e.length > 6) {
      setPopupContentMalert("Postal code can't more than 6 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 6);
      setAddcandidateEdit({ ...addcandidateEdit, postalcode: num });
    }
  };

  const handleSubmitUpdatedupe = (e) => {
    e.preventDefault();
    let updatedCandidate = { ...addcandidateEdit };

    // Iterate over the duplicates array and clear the corresponding fields in addcandidateEdit
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

  const addressTypeOptions = [
    { label: "Home", value: "Home" },
    { label: "Office", value: "Office" },
    { label: "Permanent", value: "Permanent" },  // Corrected from "Permanent"
    { label: "Temporary", value: "Temporary" },   // Corrected from "Temprory"
    { label: "Hostel", value: "Hostel" },
  ];

  const personalprefixOptions = [
    { label: "C/O-Care Of", value: "C/O-Care Of" },
    { label: "S/O-Son Of", value: "S/O-Son Of" },
    { label: "D/O-Daughter Of", value: "D/O-Daughter Of" },  // Corrected from "Permanent"
    { label: "W/O-Wife Of", value: "W/O-Wife Of" },   // Corrected from "Temprory"
  ];

  const landmarkpositionprefixOptions = [
    { label: "Near", value: "Near" },
    { label: "Opposite", value: "Opposite" },
    { label: "Behind", value: "Behind" },  // Corrected from "Permanent"
    { label: "In Front Of", value: "In Front Of" },   // Corrected from "Temprory"
    { label: "Beside", value: "Beside" },
    { label: "Adjacent to", value: "Adjacent to" },
  ];

  const ExpOptions = [
    { label: "Currently Working", value: "Currently Working" },
    { label: "Not Working", value: "Not Working" },
  ];

  const handlechangeppincode = (e) => {
    const inputValue = e.target.value;

    // Only allow digits (0-9) and empty string, max 6 digits
    if (inputValue === "" || (/^\d+$/.test(inputValue) && inputValue.length <= 6)) {
      setAddcandidateEdit({ ...addcandidateEdit, postalcode: inputValue });
    }
  };

  const [jobTitleOption, setJobTitleOption] = useState([])
  const [currentEmployeeOption, setCurrentEmployeeOption] = useState([])
  const [instituteschoolOption, setInstituteschoolOption] = useState([])
  const [majorDepartmentOption, setMajorDepartmentOption] = useState([])
  const [degreeOption, setDegreeOption] = useState([])
  const [occupationTitleOption, setOccupationTitleOption] = useState([])
  const [expCompanyOption, setExpCompanyOption] = useState([])


  const fetchAllJobDetailsResume = async (e) => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.VISITOR_JOBDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setJobTitleOption(res_category?.data?.result?.currentjobtitle?.values?.map((item) => ({
        label: item,
        value: item,
      }))
      )
      setCurrentEmployeeOption(res_category?.data?.result?.currentemployer?.values?.map((item) => ({
        label: item,
        value: item,
      }))
      )
      setInstituteschoolOption(res_category?.data?.result?.school?.values?.map((item) => ({
        label: item,
        value: item,
      }))
      )
      setMajorDepartmentOption(res_category?.data?.result?.department?.values?.map((item) => ({
        label: item,
        value: item,
      }))
      )
      setDegreeOption(res_category?.data?.result?.degree?.values?.map((item) => ({
        label: item,
        value: item,
      }))
      )
      setOccupationTitleOption(res_category?.data?.result?.occupation?.values?.map((item) => ({
        label: item,
        value: item,
      }))
      )
      setExpCompanyOption(res_category?.data?.result?.company?.values?.map((item) => ({
        label: item,
        value: item,
      }))
      )

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAllJobDetailsResume()
  }, [])

  const [twofaSwitch, setTwofaSwitch] = useState(false); // Initialize with false


  const handleTwoFaSwitchChange = () => {
    setTwofaSwitch(!twofaSwitch); // Toggle the boolean value
    setAddcandidateEdit({
      ...addcandidateEdit,
      currentjobtitle: "",
    });
  };

  const [currectEmployeeSwitch, setCurrectEmployeeSwitch] = useState(false);

  const [instituteschoolSwitch, setInstituteschoolSwitch] = useState(false);
  const [majorDepartmentSwitch, setMajorDepartmentSwitch] = useState(false);
  const [degreeSwitch, setDegreeSwitch] = useState(false);
  const [occupationTitleSwitch, setOccupationTitleSwitch] = useState(false);
  const [expCompanySwitch, setExpCompanySwitch] = useState(false);

  const handleTwoFaCurrentempSwitchChange = (e) => {
    setCurrectEmployeeSwitch(!currectEmployeeSwitch);
    setAddcandidateEdit({
      ...addcandidateEdit,
      currentemployer: "",
    });
  };
  const handleInstituteschoolSwitchChange = (e) => {
    setInstituteschoolSwitch(!instituteschoolSwitch);
    setEducationDetails({
      ...educationDetails,
      school: "",
    });
  };
  const handleMajorDepartmentSwitchChange = (e) => {
    setMajorDepartmentSwitch(!majorDepartmentSwitch);
    setEducationDetails({
      ...educationDetails,
      department: "",
    });
  };
  const handleDegreeSwitchChange = (e) => {
    setDegreeSwitch(!degreeSwitch);
    setEducationDetails({
      ...educationDetails,
      degree: "",
    });
  };
  const handleOccupationTitleSwitchChange = (e) => {
    setOccupationTitleSwitch(!occupationTitleSwitch);
    setExperienceDetails({
      ...experienceDetails,
      occupation: "",
    });
  };
  const handleExpCompanySwitchChange = (e) => {
    setExpCompanySwitch(!expCompanySwitch);
    setExperienceDetails({
      ...experienceDetails,
      company: "",
    });
  };

  return (
    <Box>
      <Headtitle title={"EDIT CANDIDATE"} />
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
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Typography variant="h5">
                Role : {addcandidateEdit.role}
              </Typography>
              {/* <Typography variant="h6" marginTop={0.4}>{addcandidateEdit.role}</Typography> */}
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
                  Reference No<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit?.candidateresumeid || ""}
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
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Email <b style={{ color: "red" }}>*</b>{" "}
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
                    label="Same as Whats app number"
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
            <Grid item lg={2} md={3} sm={12} xs={12}>
              <Typography>Profile Image</Typography>

              {(addcandidateEdit.uploadedimage) && (
                <>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img
                      style={{
                        height: 120,
                        borderRadius: '8px', // Rounded corners for the image
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for the image
                        objectFit: 'cover', // Ensure the image covers the area without distortion
                      }}
                      src={addcandidateEdit?.uploadedimage}
                      alt="Cropped"
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Color Picker */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Typography
                          variant="body1"
                          style={{

                            color: '#555',
                            fontSize: '10px'
                          }}
                        >
                          BG Color
                        </Typography>
                        <input
                          type="color"
                          value={color}
                          onChange={handleColorChange}
                          style={{
                            width: '30px',
                            height: '30px',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '5px',
                          }}
                        />
                      </div>

                      {/* Submit Button */}
                      <LoadingButton
                        onClick={handleSubmitNew}
                        loading={bgbtn}
                        variant="contained"
                        color="primary"
                        endIcon={<FormatColorFillIcon />}
                        sx={{
                          padding: '10px 10px',
                          fontSize: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          borderRadius: '5px',
                          color: isLightColor ? 'black' : 'white',
                          fontWeight: '600',
                          backgroundColor: color, // Dynamically set the background color
                          '&:hover': {
                            backgroundColor: `${color}90`, // Slightly transparent on hover for a nice effect
                          },
                          border: '1px solid  black'
                        }}
                      >

                      </LoadingButton>
                    </div>
                  </div>
                </>
              )}
              <div>
                {(addcandidateEdit.uploadedimage && !croppedImage) ? (
                  <>
                    <Cropper
                      style={{ height: 120, width: "100%" }}
                      aspectRatio={1 / 1}
                      // src={selectedFile}
                      src={addcandidateEdit.uploadedimage}
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
                          sx={buttonStyles.btncancel}
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
                    {!addcandidateEdit.uploadedimage &&
                      <>
                        <Box item md={4} sm={4}>
                          <LoadingButton
                            component="label"
                            variant="contained"
                            loading={btnUpload}
                            sx={buttonStyles.buttonsubmit}
                          >
                            Upload
                            <input
                              type="file"
                              id="profileimage"
                              name="file"
                              accept="image/*"
                              hidden
                              onChange={handleChangeImage}
                            />
                          </LoadingButton>
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
                      </>}
                    {addcandidateEdit.uploadedimage && (
                      <>
                        <Box item md={4} sm={4}>
                          <Button
                            variant="outlined"
                            sx={buttonStyles.btncancel}
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
                onClose={(event, reason) => {
                  if (reason === "backdropClick") {
                    // Ignore backdrop clicks
                    return;
                  }
                  webcamClose(); // Handle other close actions
                  closeWebCam();
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                  <Webcamimage
                    name="create"
                    getImg={getImg}
                    setGetImg={setGetImg}
                    valNum={valNum}
                    setValNum={setValNum}
                    capturedImages={capturedImages}
                    setCapturedImages={setCapturedImages}
                    setRefImage={setRefImage}
                    setRefImageDrag={setRefImageDrag}
                    setVendor={setAddcandidateEdit}
                    vendor={addcandidateEdit}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={webcamDataStore}
                    sx={buttonStyles?.buttonsubmit}
                  >
                    OK
                  </Button>
                  <Button variant="contained" color="error" onClick={() => {
                    webcamClose();
                    closeWebCam();
                  }}
                    sx={buttonStyles?.btncancel}
                  >
                    CANCEL
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>DOB<b style={{ color: "red" }}>*</b></Typography>
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
                  readOnly
                // onChange={(e) => {
                //   const inputValue = e.target.value;
                //   if (inputValue.length < 4 && inputValue >= 0) {
                //     setAddcandidateEdit({
                //       ...addcandidateEdit,
                //       age: inputValue,
                //     });
                //   }
                // }}
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
                      ? buttonStyleslocal.default
                      : isDuplicate
                        ? buttonStyleslocal.duplicate
                        : buttonStyleslocal.noDuplicate),
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

            <Grid item xs={12} sx={{ margin: "20px 0px" }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Address Information</b>
              </Typography>
            </Grid>
            {/* <Grid item md={6} sm={6} xs={12}>
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
                        
            <Grid item md={6} sm={6} xs={12}>
              <Typography>Country</Typography>
              <Grid sx={{ display: "flex" }}>
                {/* <Grid sx={userStyle.spanIcons}> <LanguageOutlinedIcon />  </Grid> 
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
                                </Grid> 
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
                {/* <Grid sx={userStyle.spanIcons}>  <LocationOnIconOutlined />  </Grid> 
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
            </Grid> */}
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Address Type
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={addressTypeOptions}
                  value={{
                    label: addcandidateEdit.addesstype,
                    value: addcandidateEdit.addesstype,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      addesstype: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Personal Prefix
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={personalprefixOptions}
                  value={{
                    label: addcandidateEdit.personalprefix,
                    value: addcandidateEdit.personalprefix,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      personalprefix: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Reference Name </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit.referencename === "undefined" ? "" : addcandidateEdit.referencename}
                  placeholder="Please Enter Reference Name"
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      referencename: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Landmark Position Prefix
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={landmarkpositionprefixOptions}
                  value={{
                    label: addcandidateEdit.landmarkpositionprefix,
                    value: addcandidateEdit.landmarkpositionprefix,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      landmarkpositionprefix: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Landmark Name</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit.landmarkname === "undefined" ? "" : addcandidateEdit.landmarkname}
                  placeholder="Please Enter Landmark Name"
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      landmarkname: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>House/Flat No</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit.houseflatnumber === "undefined" ? "" : addcandidateEdit.houseflatnumber}
                  placeholder="Please Enter House/Flat Number"
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      houseflatnumber: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Street/Road Name</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit.streetroadname === "undefined" ? "" : addcandidateEdit.streetroadname}
                  placeholder="Please Enter Street/Road Name"
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      streetroadname: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Locality/Area Name</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit.localityareaname === "undefined" ? "" : addcandidateEdit.localityareaname}
                  placeholder="Please Enter Locality/Area Name"
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      localityareaname: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <FormControl size="small" fullWidth>
                <Typography>Country</Typography>
                <Selects
                  options={Country.getAllCountries()}
                  getOptionLabel={(options) => {
                    return options["name"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"];
                  }}
                  // styles={colourStyles}
                  value={selectedCountry}
                  onChange={(item) => {
                    setSelectedCountry(item);
                    setSelectedState("");
                    setSelectedCity("");
                    setAddcandidateEdit((prevSupplier) => ({
                      ...prevSupplier,
                      pcountry: item?.name || "",
                      pstate: "",
                      pcity: "",
                    }));
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>State</Typography>
                <Selects
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
                  // styles={colourStyles}
                  onChange={(item) => {
                    setSelectedState(item);
                    setSelectedCity("");
                    setAddcandidateEdit((prevSupplier) => ({
                      ...prevSupplier,
                      pstate: item?.name || "",
                      pcity: "",
                    }));
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>City</Typography>
                <Selects
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
                    setAddcandidateEdit((prevSupplier) => ({
                      ...prevSupplier,
                      pcity: item?.name || "",
                    }));
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Pincode</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  value={addcandidateEdit.postalcode}
                  onChange={(e) => {
                    // setAddcandidateEdit({
                    //   ...addcandidateEdit,
                    //   postalcode: e.target.value,
                    // });
                    // handlePostal(e.target.value);
                    handlechangeppincode(e)
                  }}
                  sx={userStyle.input}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>GPS Coordinate</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidateEdit.gpscoordinate === "undefined" ? "" : addcandidateEdit.gpscoordinate}
                  placeholder="Please Enter GPS Coordinate"
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      gpscoordinate: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Full Address
                </Typography>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={5}
                  value={
                    [
                      addcandidateEdit.personalprefix !== "Please Select Personal Prefix" ? addcandidateEdit.personalprefix : null,
                      addcandidateEdit.referencename === "undefined" ? "" : addcandidateEdit.referencename,
                      addcandidateEdit.landmarkpositionprefix !== "Please Select Landmark Position Prefix" ? addcandidateEdit.landmarkpositionprefix : null,
                      addcandidateEdit.landmarkname === "undefined" ? "" : addcandidateEdit.landmarkname,
                      addcandidateEdit.houseflatnumber === "undefined" ? "" : addcandidateEdit.houseflatnumber,
                      addcandidateEdit.streetroadname === "undefined" ? "" : addcandidateEdit.streetroadname,
                      addcandidateEdit.localityareaname === "undefined" ? "" : addcandidateEdit.localityareaname,
                      addcandidateEdit.pcity === "undefined" ? "" : addcandidateEdit.pcity,
                      addcandidateEdit.pstate === "undefined" ? "" : addcandidateEdit.pstate,
                      addcandidateEdit.pcountry === "undefined" ? "" : addcandidateEdit.pcountry,
                      addcandidateEdit.postalcode === 0 ? "" : addcandidateEdit.postalcode
                    ]
                      .filter(part => part != null) // Remove null/undefined first
                      .map(part => String(part).trim()) // Convert to string and then trim
                      .filter(part => part !== "") // Remove empty strings after trim
                      .reduce((acc, part) => {
                        const trimmedPart = String(part).trim();
                        if (!trimmedPart) return acc;

                        if (acc.endsWith(',')) {
                          return `${acc} ${trimmedPart}`;
                        }
                        if (trimmedPart.startsWith(',')) {
                          return `${acc}${trimmedPart}`;
                        }
                        return acc ? `${acc}, ${trimmedPart}` : trimmedPart;
                      }, "")
                  }
                />
              </FormControl>
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
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Candidate Status<b style={{ color: 'red' }}>*</b>
                </Typography>
                <Selects
                  options={candidatestatusOption}
                  value={{
                    label: addcandidateEdit.candidatestatusexp,
                    value: addcandidateEdit.candidatestatusexp,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      candidatestatusexp: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Work Mode<b style={{ color: 'red' }}>*</b>
                </Typography>
                <Selects
                  options={workmodeOption}
                  value={{
                    label: addcandidateEdit.workmode,
                    value: addcandidateEdit.workmode,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      workmode: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Experience
                </Typography>
                <Selects
                  options={ExpOptions}
                  value={{
                    label: addcandidateEdit.experienceoption,
                    value: addcandidateEdit.experienceoption,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      experienceoption: e.value,
                    });
                  }}
                />
              </FormControl>
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
                  {`No. Of ${addcandidateEdit?.experienceestimation == undefined
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
                  {`No. Of ${addcandidateEdit?.domainexperienceestimation == undefined
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
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Expected Salary <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={expectedsalaryOption}
                  value={{
                    label: addcandidateEdit.expectedsalaryopts,
                    value: addcandidateEdit.expectedsalaryopts,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      expectedsalaryopts: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
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
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Joining By Days <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={joiningbydaysOption}
                  value={{
                    label: addcandidateEdit.joiningbydaysopts,
                    value: addcandidateEdit.joiningbydaysopts,
                  }}
                  onChange={(e) => {
                    setAddcandidateEdit({
                      ...addcandidateEdit,
                      joiningbydaysopts: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
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
            <Grid item md={3} sm={4} xs={12}>
              <Typography>Current Job title </Typography>
              <FormControl fullWidth size="small">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {twofaSwitch ?
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={addcandidateEdit.currentjobtitle}
                        sx={{ width: "100%" }}
                        onChange={(e) => {
                          setAddcandidateEdit({
                            ...addcandidateEdit,
                            currentjobtitle: e.target.value,
                          });
                        }}
                      />
                      :
                      <Selects
                        options={jobTitleOption}
                        placeholder="Please Select"
                        value={{ label: addcandidateEdit.currentjobtitle, value: addcandidateEdit.currentjobtitle }}
                        onChange={(e) => {
                          setAddcandidateEdit({
                            ...addcandidateEdit,
                            currentjobtitle: e.value,
                          });
                        }}
                      />
                    }
                  </Box>
                  <FormGroup>
                    <Button
                      variant={twofaSwitch ? "contained" : "outlined"}
                      onClick={handleTwoFaSwitchChange}
                      size="small"
                    >
                      {twofaSwitch ? "Exist" : "New"}
                    </Button>
                  </FormGroup>
                </Box>
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Typography>Current Employer </Typography>
              <FormControl fullWidth size="small">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {currectEmployeeSwitch ?
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={addcandidateEdit.currentemployer}
                        sx={{ width: "100%" }}
                        onChange={(e) => {
                          setAddcandidateEdit({
                            ...addcandidateEdit,
                            currentemployer: e.target.value,
                          });
                        }}
                      />
                      :
                      <Selects
                        options={currentEmployeeOption}
                        placeholder="Please Select"
                        value={{ label: addcandidateEdit.currentemployer, value: addcandidateEdit.currentemployer }}
                        onChange={(e) => {
                          setAddcandidateEdit({
                            ...addcandidateEdit,
                            currentemployer: e.value,
                          });
                        }}
                      />
                    }
                  </Box>

                  <FormGroup>
                    <Button
                      variant={currectEmployeeSwitch ? "contained" : "outlined"}
                      onClick={handleTwoFaCurrentempSwitchChange}
                      size="small"
                    >
                      {currectEmployeeSwitch ? "Exist" : "New"}
                    </Button>
                  </FormGroup>
                </Box>
              </FormControl>
            </Grid>
            {addcandidateEdit.experience <= 0 ? (
              ""
            ) : (
              <>
                <Grid item md={3} sm={6} xs={12}>
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

                <Grid item md={3} sm={6} xs={12}>
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
                {/* <Grid item md={4} sm={6} xs={12}>
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
                </Grid> */}
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>Institute / School </Typography>
                  <FormControl fullWidth size="small">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        {instituteschoolSwitch ?
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={educationDetails.school}
                            sx={{ width: "100%" }}
                            onChange={(e) => {
                              setEducationDetails({
                                ...educationDetails,
                                school: e.target.value,
                              });
                            }}
                          />
                          :
                          <Selects
                            options={instituteschoolOption}
                            placeholder="Please Select"
                            value={{ label: educationDetails.school, value: educationDetails.school }}
                            onChange={(e) => {
                              setEducationDetails({
                                ...educationDetails,
                                school: e.value,
                              });
                            }}
                          />
                        }
                      </Box>

                      <FormGroup>
                        <Button
                          variant={instituteschoolSwitch ? "contained" : "outlined"}
                          onClick={handleInstituteschoolSwitchChange}
                          size="small"
                        >
                          {instituteschoolSwitch ? "Exist" : "New"}
                        </Button>
                      </FormGroup>
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Typography>Major / Department </Typography>
                  <FormControl fullWidth size="small">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        {majorDepartmentSwitch ?
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={educationDetails.department}
                            sx={{ width: "100%" }}
                            onChange={(e) => {
                              setEducationDetails({
                                ...educationDetails,
                                department: e.target.value,
                              });
                            }}
                          />
                          :
                          <Selects
                            options={majorDepartmentOption}
                            placeholder="Please Select"
                            value={{ label: educationDetails.department, value: educationDetails.department }}
                            onChange={(e) => {
                              setEducationDetails({
                                ...educationDetails,
                                department: e.value,
                              });
                            }}
                          />
                        }
                      </Box>

                      <FormGroup>
                        <Button
                          variant={majorDepartmentSwitch ? "contained" : "outlined"}
                          onClick={handleMajorDepartmentSwitchChange}
                          size="small"
                        >
                          {majorDepartmentSwitch ? "Exist" : "New"}
                        </Button>
                      </FormGroup>
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <Typography>Degree </Typography>
                  <FormControl fullWidth size="small">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        {degreeSwitch ?
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={educationDetails.degree}
                            sx={{ width: "100%" }}
                            onChange={(e) => {
                              setEducationDetails({
                                ...educationDetails,
                                degree: e.target.value,
                              });
                            }}
                          />
                          :
                          <Selects
                            options={degreeOption}
                            placeholder="Please Select"
                            value={{ label: educationDetails.degree, value: educationDetails.degree }}
                            onChange={(e) => {
                              setEducationDetails({
                                ...educationDetails,
                                degree: e.value,
                              });
                            }}
                          />
                        }
                      </Box>

                      <FormGroup>
                        <Button
                          variant={degreeSwitch ? "contained" : "outlined"}
                          onClick={handleDegreeSwitchChange}
                          size="small"
                        >
                          {degreeSwitch ? "Exist" : "New"}
                        </Button>
                      </FormGroup>
                    </Box>
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Percentage</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text" // Use text to control input formatting
                      placeholder="Percentage"
                      sx={userStyle.input}
                      value={educationDetails?.percentage}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Allow empty input
                        if (value === "") {
                          setEducationDetails({ ...educationDetails, percentage: "" });
                          return;
                        }

                        // Allow only numbers and a single decimal point
                        if (!/^\d*\.?\d*$/.test(value)) return;

                        // Convert to number for validation
                        let numValue = parseFloat(value);

                        // Ensure value is within range and max 2 decimal places
                        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {

                          setEducationDetails({
                            ...educationDetails,
                            percentage: value.match(/^\d+(\.\d{0,2})?/)[0],
                          });
                        }

                      }}
                    />

                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>Completed Year</Typography>
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
                  md={4}
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
                      <StyledTableCell>Percentage</StyledTableCell>

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
                          <StyledTableCell>{row?.percentage}</StyledTableCell>
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
                {/* <Grid item md={4} sm={6} xs={12}>
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
                </Grid> */}
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>Occupation / Title </Typography>
                  <FormControl fullWidth size="small">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        {occupationTitleSwitch ?
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={experienceDetails.occupation}
                            sx={{ width: "100%" }}
                            onChange={(e) => {
                              setExperienceDetails({
                                ...experienceDetails,
                                occupation: e.target.value,
                              });
                            }}
                          />
                          :
                          <Selects
                            options={occupationTitleOption}
                            placeholder="Please Select"
                            value={{ label: experienceDetails.occupation, value: experienceDetails.occupation }}
                            onChange={(e) => {
                              setExperienceDetails({
                                ...experienceDetails,
                                occupation: e.value,
                              });
                            }}
                          />
                        }
                      </Box>

                      <FormGroup>
                        <Button
                          variant={occupationTitleSwitch ? "contained" : "outlined"}
                          onClick={handleOccupationTitleSwitchChange}
                          size="small"
                        >
                          {occupationTitleSwitch ? "Exist" : "New"}
                        </Button>
                      </FormGroup>
                    </Box>
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>Company </Typography>
                  <FormControl fullWidth size="small">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        {expCompanySwitch ?
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={experienceDetails.company}
                            sx={{ width: "100%" }}
                            onChange={(e) => {
                              setExperienceDetails({
                                ...experienceDetails,
                                company: e.target.value,
                              });
                            }}
                          />
                          :
                          <Selects
                            options={expCompanyOption}
                            placeholder="Please Select"
                            value={{ label: experienceDetails.company, value: experienceDetails.company }}
                            onChange={(e) => {
                              setExperienceDetails({
                                ...experienceDetails,
                                company: e.value,
                              });
                            }}
                          />
                        }
                      </Box>

                      <FormGroup>
                        <Button
                          variant={expCompanySwitch ? "contained" : "outlined"}
                          onClick={handleExpCompanySwitchChange}
                          size="small"
                        >
                          {expCompanySwitch ? "Exist" : "New"}
                        </Button>
                      </FormGroup>
                    </Box>
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
                  labelledBy="Please Select Category"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Certification</Typography>
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
                          sx={{ mt: 2, ...buttonStyles.buttonsubmit, }}
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
                              onClick={() => renderFilePreview(todo?.file)}
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
            {uploadedCandidateFilesEdit?.length > 0 &&
              uploadedCandidateFilesEdit.map((todo, index) => (
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
                              onClick={() => renderFilePreviewMulterUploaded(todo)}
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
                            onClick={() => handleFileDeleteEditUploadedCandidateFiles(index)}
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
                      ...buttonStyles.buttonsubmit,
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
                  resumefiles.map((data, index) => (
                    <>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid item lg={8} md={8} sm={8} xs={8}>
                          <Typography>{data?.file?.name}</Typography>
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreview(data?.file)}
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
                {uploadedResumeFilesEdit?.length > 0 &&
                  uploadedResumeFilesEdit.map((data, index) => (
                    <>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid item lg={8} md={8} sm={8} xs={8}>
                          <Typography>{data?.name}</Typography>
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreviewMulterUploaded(data)}
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
                            onClick={() => handleFileDeleteEditUploadedResumeFiles(index)}
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
                          ...buttonStyles.buttonsubmit,
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
                      experienceletter.map((data, index) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                              <Typography>{data?.file?.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreview(data?.file)}
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
                    {uploadedExperienceLetterEdit?.length > 0 &&
                      uploadedExperienceLetterEdit.map((data, index) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                              <Typography>{data?.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreviewMulterUploaded(data)}
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
                                onClick={() => handleFileDeleteEditUploadedExperienceLetter(index)}
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
                          ...buttonStyles.buttonsubmit,
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
                      payslipletter.map((data, index) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                              <Typography>{data?.file?.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreview(data?.file)}
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
                    {uploadedPayslipLetterEdit?.length > 0 &&
                      uploadedPayslipLetterEdit.map((data, index) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                              <Typography>{data?.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreviewMulterUploaded(data)}
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
                                onClick={() => handleFileDeleteEditUploadedPayslipLetter(index)}
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
                      ...buttonStyles.buttonsubmit,
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
                  coverletter.map((data, index) => (
                    <>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid item lg={8} md={8} sm={8} xs={8}>
                          <Typography>{data?.file?.name}</Typography>
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreview(data?.file)}
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
                {uploadedCoverLetterEdit?.length > 0 &&
                  uploadedCoverLetterEdit.map((data, index) => (
                    <>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid item lg={8} md={8} sm={8} xs={8}>
                          <Typography>{data?.name}</Typography>
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreviewMulterUploaded(data)}
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
                            onClick={() => handleFileDeleteEditUploadedCoverLetter(index)}
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
                <Button
                  sx={buttonStyles.buttonsubmit}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  update
                </Button>
              </Grid>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                {/* <Link to={`/resumemanagement`}> */}
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseerrupdate}
                >
                  cancel
                </Button>
                {/* </Link> */}
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
                  sx={buttonStyles.buttonsubmit}
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
                  sx={buttonStyles.buttonsubmit}
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
                  Update Without Duplicate
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseerrdupe}
                >
                  Update With Duplicate
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
                  sx={buttonStyles.btncancel}
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


      <Dialog open={isErrorOpenpop} onClose={(event, reason) => {
        if (reason === "backdropClick") {
          // Ignore backdrop clicks
          return;
        }
        handleCloseerrpop(); // Handle other close actions
      }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: "80px" }}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              <b>Existing Profile List</b>
            </Typography>
            <Grid item md={12} sm={12} xs={12}>
              {showDupProfileVIsitor && showDupProfileVIsitor.length > 0 ? (
                <ExistingProfileVisitor
                  ExistingProfileVisitors={showDupProfileVIsitor}

                />) : (
                <Typography sx={{ ...userStyle.HeaderText, marginLeft: '28px', display: "flex", justifyContent: "center" }}>
                  There is No Profile
                </Typography>
              )}
            </Grid>
            <br />
            <Grid item md={12} sm={12} xs={12}>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >

                <Button
                  style={{
                    padding: "7px 13px",
                    color: "white",
                    background: "rgb(25, 118, 210)",
                    ...buttonStyles?.buttonsubmit,
                  }}
                  onClick={() => {
                    UploadWithDuplicate();
                  }}
                >
                  Upload With Duplicate
                </Button>
                <Button sx={buttonStyles.btncancel} onClick={UploadWithoutDuplicate}>
                  Upload Without Duplicate
                </Button>
              </Grid>
            </Grid>

          </>
        </Box>
      </Dialog>
    </Box>
  );
}

export default ResumeEdit;