import AddIcon from '@mui/icons-material/Add';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Backdrop, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableContainer, TableHead, TextareaAutosize, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { City, Country, State } from 'country-state-city';
import * as faceapi from 'face-api.js';
import 'jspdf-autotable';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import { MultiSelect } from 'react-multi-select-component';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import Selects from 'react-select';
import { handleApiError } from '../../../components/Errorhandling';
import Headtitle from '../../../components/Headtitle';
import { StyledTableCell, StyledTableRow } from '../../../components/Table';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import Webcamimage from '../webcamprofile';

import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import AlertDialog from '../../../components/Alert';
import MessageAlert from '../../../components/MessageAlert';
import { candidatestatusOption, workmodeOption } from '../../../components/Componentkeyword';

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
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <div className="pulsating-circle">
        <CircularProgress color="inherit" className="loading-spinner" />
      </div>
      <Typography variant="h6" sx={{ marginLeft: 2, color: '#fff', fontWeight: 'bold' }}>
        please wait...
      </Typography>
    </Backdrop>
  );
};

function Addresumeinteractor() {
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

      setCroppedImage(response?.data?.image); // Set the base64 image
      setBgbtn(false);
    } catch (error) {
      setBgbtn(false);
      console.error('Error uploading image:', error);
    }
  };

  const isLightColor = calculateLuminance(color);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
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

  const [isLoading, setIsLoading] = useState(false);
  // Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  const [selectedCountry, setSelectedCountry] = useState(Country.getAllCountries().find((country) => country.name === 'India'));
  const [selectedState, setSelectedState] = useState(State.getStatesOfCountry(selectedCountry?.isoCode).find((state) => state.name === 'Tamil Nadu'));
  const [selectedCity, setSelectedCity] = useState(City.getCitiesOfState(selectedState?.countryCode, selectedState?.isoCode).find((city) => city.name === 'Tiruchirappalli'));

  console.log(selectedCountry, "selectedCountry")

  const [addcandidate, setAddcandidate] = useState({
    prefix: 'Mr',
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    whatsapp: '',
    pannumber: '',
    adharnumber: '',
    street: '',
    city: '',
    state: '',
    postalcode: '',
    country: '',
    experience: 0,
    domainexperience: 0,
    experienceestimation: "Years",
    domainexperienceestimation: "Years",
    qualification: 'Please Select Qualification',
    currentjobtitle: '',
    currentemployer: '',
    expectedsalary: 0,
    currentsalary: 0,
    expectedsalaryopts: 'Please Select Expected Salary',
    joiningbydaysopts: 'Please Select Joining By Days',
    joinbydays: 0,
    noticeperiod: 0,
    skillset: '',
    additionalinfo: '',
    linkedinid: '',
    status: 'New',
    source: 'Added by User',
    sourcecandidate: 'Choose Source',
    educationdetails: '',
    experiencedetails: '',
    resumefile: '',
    coverletterfile: '',
    experienceletterfile: '',
    payslipletterfile: '',
    phonecheck: false,
    dateofbirth: '',
    interviewdate: '',
    time: '',
    age: '',
    skill: [],
    uploadedimage: null,
    uploadedimagename: null,
    files: [],
    gender: 'Please Select Gender',
    candidatefilename: 'Please Select Candidate Document',
    shortanme: '',

    candidatestatusexp: 'Please Select Candidate Status',
    workmode: 'Please Select Work Mode',

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

  const [currentText, setCurrentText] = useState('');

  const [croppedImage, setCroppedImage] = useState('');
  const cropperRef = useRef(null);

  const [file, setFile] = useState('');
  const [webfile, setwebFile] = useState('');

  //image cropping
  const handleFileSelect = (acceptedFiles) => {
    setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
  };

  const [image, setImage] = useState('');
  const handleCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    const croppedImageData = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
    setCroppedImage(croppedImageData);
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
    setAddcandidate({ ...addcandidate, uploadedimage: '' });
  };
  // Image Upload
  useEffect(() => {
    const loadModels = async () => {
      const modelUrl = SERVICE.FACEDETECTLOGINMODEL;
      console.log(modelUrl, 'modelUrl');
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
      console.log('Models loaded');
    };
    loadModels();
  }, []);
  const [btnUpload, setBtnUpload] = useState(false);
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
        setPageName(!pageName);
        try {
          const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

          if (detections.length > 0) {
            const faceDescriptor = detections[0].descriptor;
            const response = await axios.post(`${SERVICE.DUPLICATECANDIDATEFACEDETECT}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              faceDescriptor: Array.from(faceDescriptor),
            });

            if (response?.data?.matchfound) {
              setPopupContentMalert('Image Already In Use!');
              setPopupSeverityMalert('info');
              handleClickOpenPopupMalert();
            } else {
              toDataURL(path, function (dataUrl) {
                setAddcandidate({
                  ...addcandidate,
                  uploadedimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
            }
          } else {
            setPopupContentMalert('No face detected!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
          }
        } catch (error) {
          setPopupContentMalert('Error in face detection!');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } finally {
          setBtnUpload(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert('Error loading image!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setBtnUpload(false); // Disable loader in case of error
      };

      setFile(URL.createObjectURL(file));
    } else {
      setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.!');
      setPopupSeverityMalert('info');
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
    xhr.open('GET', url);
    xhr.responseType = 'blob';
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

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);

  const [btnSubmitDuplicate, setBtnSubmitDuplicate] = useState(false);

  const [btnSubmit, setBtnSubmit] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(null);

  const genderOption = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const expectedsalaryOption = [
    { label: 'Negotiable', value: 'Negotiable' },
    { label: 'Not provided', value: 'Not provided' },
    { label: 'As per company norms', value: 'As per company norms' },
  ];

  const joiningbydaysOption = [
    { label: 'Anytime', value: 'Anytime' },
    { label: 'Immediate', value: 'Immediate' },
    { label: 'Unknown', value: 'Unknown' },
    { label: 'None', value: 'None' },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAddcandidate({
          ...addcandidate,
          uploadedimage: reader.result,
          uploadedimagename: file.name,
          files: [
            {
              filename: file.name,
              preview: reader.result,
              data: reader.result.split(',')[1],
              remark: 'image file',
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewImage = () => {
    const blob = dataURItoBlob(addcandidate.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  const handleDeleteImage = () => {
    setAddcandidate({
      ...addcandidate,
      isuploadimage: false,
      uploadedimage: null,
      files: [],
    });
  };

  // Convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchEducation = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res?.data?.educationspecilizations.filter((data) => {
        return data?.category?.includes(educationDetails?.categoryedu) && data?.subcategory?.includes(e.value);
      });

      let result = data_set[0]?.specilizationgrp?.map((data) => ({
        label: data?.label,
        value: data?.label,
      }));

      setEducationsOpt(result);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchCategoryEducation = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_category.data.educationcategory.map((d) => d.categoryname);
      let filter_opt = [...new Set(data_set)];

      setCategorys(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );

      // setCategorysEdit(
      //     filter_opt.map((data) => ({
      //         ...data,
      //         label: data,
      //         value: data,
      //     }))
      // );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const id = useParams()?.id;
  const status = useParams()?.status;

  const fetchVendor = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(`${SERVICE.SINGLE_VISITORS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const visitorData = res_vendor?.data?.svisitors;

      let file;
      if (visitorData?.visitorid) {
        let url = `${SERVICE.VISITORDETAILS_LOG_SINGLE_PROFILE}/${encodeURIComponent(visitorData?.visitorid)}`;
        let resVisitor = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        // setPrevFiles(resVisitor?.data?.svisitordetailslog?.slice(-1)[0]);

        // Assign the files and use them
        file = resVisitor?.data?.svisitordetailslog?.slice(-1);
      }

      const ImgV = file[0]?.files[0]?.preview.startsWith('data:image/') ? file[0]?.files[0]?.preview || null : null;
      setAddcandidate((prevState) => ({
        ...prevState,
        firstname: visitorData?.visitorname?.toLocaleUpperCase() || '',
        email: visitorData?.visitoremail || '',
        mobile: visitorData?.visitorcontactnumber || '',
        uploadedimage: ImgV ? ImgV : null,
        postalcode: visitorData?.ppincode,

        //newvalues
        addesstype: visitorData?.addesstype,
        personalprefix: visitorData?.personalprefix,
        referencename: visitorData?.referencename,
        landmarkpositionprefix: visitorData?.landmarkpositionprefix,
        landmarkname: visitorData?.landmarkname,
        houseflatnumber: visitorData?.houseflatnumber,
        streetroadname: visitorData?.streetroadname,
        localityareaname: visitorData?.localityareaname,

        gpscoordinate: visitorData?.gpscoordinate,
        pcountry: Country.getAllCountries().find((country) => country.name === visitorData?.pcountry)?.name,
        pstate: State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === visitorData?.pcountry)?.isoCode).find((state) => state.name === visitorData?.pstate)?.name,
        pcity: City.getCitiesOfState(State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === visitorData?.pcountry)?.isoCode).find((state) => state.name === visitorData?.pstate)?.countryCode, State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === visitorData?.pcountry)?.isoCode).find((state) => state.name === visitorData?.pstate)?.isoCode).find((city) => city.name === visitorData?.pcity)?.name,
      }));

      console.log(Country.getAllCountries().find((country) => country.name === visitorData?.pcountry))

      setSelectedCountry(Country.getAllCountries().find((country) => country.name === visitorData?.pcountry));
      setSelectedState(State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === visitorData?.pcountry)?.isoCode).find((state) => state.name === visitorData?.pstate));
      setSelectedCity(City.getCitiesOfState(State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === visitorData?.pcountry)?.isoCode).find((state) => state.name === visitorData?.pstate)?.countryCode, State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === visitorData?.pcountry)?.isoCode).find((state) => state.name === visitorData?.pstate)?.isoCode).find((city) => city.name === visitorData?.pcity));

      // setSelectedCountry(visitorData?.pcountry)
      // setSelectedState(visitorData?.pstate)
      // setSelectedCity(visitorData?.pcity)
      setGetImg(ImgV);
      setExperienceDetails((prevState) => ({
        ...prevState,
        company: visitorData ? visitorData.meetingpersoncompany?.toString() : '',
      }));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const [jobApplyDays, setJobApplyDays] = useState();
  const [contactEmail, setContactEmail] = useState('');
  const [allcandidates, setAllCandidates] = useState('');

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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [roleName, setRoleName] = useState('All');
  const [experience, setexperience] = useState(0);
  const [qualificationDrop, setQualificationDrop] = useState([]);
  const [educationDetails, setEducationDetails] = useState({
    school: '',
    department: '',
    degree: '',
    fromduration: '',
    toduration: '',
    percentage: "",
    pursuing: false,
    categoryedu: 'Please Select Category',
    subcategoryedu: 'Please Select Sub Category',
    specialization: 'Please Select Specialization',
  });
  const [educationtodo, setEducationtodo] = useState([]);
  // warn
  const [experienceDetails, setExperienceDetails] = useState({
    occupation: '',
    company: '',
    summary: '',
    fromduration: '',
    toduration: '',
    currentlyworkhere: false,
  });
  const [experiencetodo, setExperiencetodo] = useState([]);

  // Country city state datas

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

  const getPhoneNumber = () => {
    if (addcandidate.phonecheck) {
      setAddcandidate({ ...addcandidate, whatsapp: addcandidate.mobile });
    } else {
      setAddcandidate({ ...addcandidate, whatsapp: '' });
    }
  };
  useEffect(() => {
    getPhoneNumber();
  }, [addcandidate.phonecheck]);

  const [certification, setCertification] = useState([]);

  const fetchCertification = async () => {
    setPageName(!pageName);
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
      setCertification([...data, { label: 'Other', value: 'Other' }]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [AutoId, setAutoId] = useState("")

  const fetchLastindexVendor = async () => {
    setPageName(!pageName);
    console.log("working")
    try {
      const res_vendor = await axios.get(SERVICE.CANDIDATES_RESUMEIDINDEX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Extract the ID (could be undefined)
      const refNo = res_vendor?.data?.candidateresume?.candidateresumeid;
      let newval;

      if (!refNo) {
        // If no ID exists, set newval to "CD#RE001"
        newval = "CD#RE001";
        setAutoId(newval)
      } else {
        // If ID exists, increment it
        const codenum = refNo.split('E');
        const prefixLength = Number(codenum[1]) + 1;
        const prefixString = String(prefixLength);
        const postfixLength = prefixString.padStart(3, '0');
        newval = 'CD#RE' + postfixLength;
        setAutoId(newval)
      }

    } catch (err) {
      if (err?.response?.data?.message === 'Data not found!') {
      } else {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };

  useEffect(() => {
    fetchLastindexVendor()
    fetchAllSkill();
    fetchCertification();
    fetchCategoryEducation();
    fetchVendor();
  }, []);

  useEffect(() => {
    fetchOverAllSettings();
  }, []);

  const fetchQualification = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.QUALIFICATIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let qualificationall = [
        ...res?.data?.qualificationdetails.map((d) => ({
          ...d,
          label: d.qualiname,
          value: d.qualiname,
        })),
      ];
      setQualificationDrop(qualificationall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchQualification();
  }, []);

  const [selectedskill, setSelectedSkill] = useState([]);
  let [valueCate, setValueCate] = useState('');

  const handleSkilChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSkill(options);
  };

  const renderValueSkill = (valueCate, _skill) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select';
  };

  const [selectedCertification, setSelectedCertification] = useState([]);
  let [valueCertification, setValueCertification] = useState('');

  const handleCertficationChange = (options) => {
    setValueCertification(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCertification(options);
  };

  const renderValueCertification = (valueCertification, _skill) => {
    return valueCertification.length ? valueCertification.map(({ label }) => label).join(', ') : 'Please select Certification';
  };

  const { isUserRoleCompare, allProjects, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth, setAuth } = useContext(AuthContext);
  const [queueCheck, setQueueCheck] = useState(false);

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  const backPage = useNavigate();

  const ids = useParams().id;

  const renderFilePreview = async (file) => {
    const url = window.URL.createObjectURL(file);
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
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };
  const handleFileDeletecover = (index) => {
    setCoverletter((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreviewexp = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };
  const renderFilePreviewpayslip = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };

  const handleFileDeleteexp = (index) => {
    setExperienceletter((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileDeletepayslip = (index) => {
    setPayslipletter((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const educationTodo = () => {
    if (educationDetails.categoryedu == 'Please Select Category' || educationDetails.categoryedu == '') {
      setPopupContentMalert('Please Select Category!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (educationDetails.subcategoryedu == 'Please Select Sub Category' || educationDetails.subcategoryedu == '') {
      setPopupContentMalert('Please Select Sub Category!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (educationDetails.specialization == 'Please Select Specialization' || educationDetails.specialization == '') {
      setPopupContentMalert('Please Select Specialization!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (educationDetails.school == '') {
      setPopupContentMalert('Please Enter School field!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (educationDetails.department == '') {
      setPopupContentMalert('Please Enter Department field!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // else if (educationDetails.degree == "") {
    //   setShowAlert("Please Enter Degree field!");
    //   handleClickOpenerr();
    // }
    else if (educationDetails !== '') {
      setEducationtodo([...educationtodo, educationDetails]);
      setEducationDetails({
        school: '',
        department: '',
        degree: '',
        fromduration: '',
        toduration: '',
        percentage: "",
        pursuing: false,
        categoryedu: 'Please Select Category',
        subcategoryedu: 'Please Select Sub Category',
        specialization: 'Please Select Specialization',
      });
      setEducationsOpt([]);
      setSubcategorys([]);
      setInstituteschoolSwitch(false)
      setMajorDepartmentSwitch(false)
      setDegreeSwitch(false)
    }
  };
  const educationTodoremove = (index) => {
    const newTasks = [...educationtodo];
    newTasks.splice(index, 1);
    setEducationtodo(newTasks);
  };

  const experienceTodo = () => {
    if (experienceDetails.occupation == '') {
      setPopupContentMalert('Please Enter Occupation  field!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (experienceDetails.company == '') {
      setPopupContentMalert('Please Enter Company field!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (experienceDetails !== '') {
      setExperiencetodo([...experiencetodo, experienceDetails]);
      setExperienceDetails({
        occupation: '',
        company: '',
        summary: '',
        fromduration: '',
        toduration: '',
        currentlyworkhere: false,
      });
      setOccupationTitleSwitch(false)
      setExpCompanySwitch(false)
    }
  };
  const experienceTodoremove = (index) => {
    const newTasks = [...experiencetodo];
    newTasks.splice(index, 1);
    setExperiencetodo(newTasks);
  };
  const qualificationOption = [
    { label: 'MCA', value: 'MCA' },
    { label: 'BE', value: 'BE' },
    { label: 'BSc', value: 'BSc' },
    { label: 'MS', value: 'MS' },
    { label: 'BTech', value: 'BTech' },
    { label: 'ME', value: 'ME' },
    { label: 'Diploma', value: 'Diploma' },
    { label: 'ITI', value: 'ITI' },
  ];

  const candidateOption = [
    { label: 'New', value: 'New' },
    { label: 'Existing', value: 'Existing' },
  ];

  const sourceOption = [
    { label: 'Added by User', value: 'Added by User' },
    { label: 'Added by HR', value: 'Added by HR' },
    { label: 'Added by Admin', value: 'Added by Admin' },
  ];

  const sourcecandidateOption = [
    { label: 'Walk-in', value: 'Walk-in' },
    { label: 'Email', value: 'Email' },
    { label: 'Employee Referral', value: 'Employee Referral' },
    { label: 'Advertisement', value: 'Advertisement' },
    { label: 'Jobfair', value: 'Jobfair' },
    { label: 'JobPortal', value: 'JobPortal' },
    { label: 'Website', value: 'Website' },
    { label: 'Social Media', value: 'Social Media' },
  ];

  const [resumefiles, setResumeFiles] = useState([]);

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


  const [coverletter, setCoverletter] = useState([]);

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

  const [experienceletter, setExperienceletter] = useState([]);

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

  const [payslipletter, setPayslipletter] = useState([]);

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

  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  let loginid = localStorage.LoginUserId;
  const usernameaddedby = isUserRoleAccess?.username;

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
      pagename: String('Add Resume Visitor'),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };

  // const [todos, setTodos] = useState([]);

  let name = 'create';

  const sendRequest = async () => {
    setIsLoading(true);
    setBtnSubmit(true);

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


      const jsonData = {

        //Newvalue
        addesstype: String(addcandidate.addesstype),
        candidateresumeid: String(AutoId),

        personalprefix: String(addcandidate.personalprefix),
        referencename: String(addcandidate.referencename),
        landmarkpositionprefix: String(addcandidate.landmarkpositionprefix),
        landmarkname: String(addcandidate.landmarkname),
        houseflatnumber: String(addcandidate.houseflatnumber),
        streetroadname: String(addcandidate.streetroadname),
        localityareaname: String(addcandidate.localityareaname),
        // pcountry: String(addcandidate.pcountry),
        // pstate: String(addcandidate.pstate),
        // pcity: String(addcandidate.pcity),
        pcountry: String(addcandidate.pcountry),
        pstate: String(addcandidate.pstate),
        pcity: String(addcandidate.pcity),
        ppincode: String(addcandidate.ppincode),
        gpscoordinate: String(addcandidate.gpscoordinate),
        experienceoption: String(addcandidate.experienceoption),

        experience: Number(addcandidate.experience),
        experienceestimation: String(addcandidate.experienceestimation),
        domainexperienceestimation: String(
          addcandidate.domainexperienceestimation
        ),
        domainexperience: Number(addcandidate.domainexperience),

        prefix: String(addcandidate.prefix),
        firstname: String(addcandidate.firstname),
        lastname: String(addcandidate.lastname),
        fullname: String(addcandidate.firstname + ' ' + addcandidate.lastname),
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
        candidatestatusexp: String(addcandidate.candidatestatusexp),
        workmode: String(addcandidate.workmode),
        country: String(selectedCountry?.name),
        state: String(selectedState?.name),
        city: String(selectedCity?.name),
        postalcode: Number(addcandidate.postalcode),

        expectedsalaryopts: String(addcandidate?.expectedsalaryopts),
        joiningbydaysopts: String(addcandidate?.joiningbydaysopts),
        domainexperience: Number(addcandidate.domainexperience),
        joinbydays: Number(addcandidate.joinbydays),
        noticeperiod: Number(addcandidate.noticeperiod),
        certification: certi,
        uploadedimage: croppedImage !== '' ? croppedImage : getImg !== null && getImg !== undefined ? getImg : addcandidate.uploadedimage == null ? '' : String(addcandidate.uploadedimage),
        uploadedimagename: String(addcandidate.uploadedimagename),
        files: addcandidate.files,
        gender: addcandidate.gender,
        faceDescriptor: addcandidate?.faceDescriptor?.length > 0 ? addcandidate?.faceDescriptor : [],
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
        coverlettertext: currentText,

        educationdetails: [...educationtodo],
        experiencedetails: [...experiencetodo],
        skill: [...valueCate],
        overallstatus: 'Applied',
        addedby: [
          {
            name: String(usernameaddedby),
            date: String(new Date()),
          },
        ],
        role: String(roleName),
        today: String(today),
      }
      formData.append("jsonData", JSON.stringify(jsonData));
      let res_queue = await axios.post(SERVICE.CANDIDATES_CREATE, formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });

      let addVendorDetails = await axios.put(`${SERVICE.VISITORS_STATUSUPDATE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        interactorstatus: 'addresume',
        enquirystatusforinteractorstatus: status === 'visitorenquiry' ? true : false,
        requestvisitorfollowupstatus: status === 'requestfollowupvisitor' ? true : false,
      });

      setQueueCheck(true);
      handleClickOpenerr();
      setAddcandidate({
        prefix: 'Mr',
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        whatsapp: '',
        pannumber: '',
        adharnumber: '',
        street: '',
        city: '',
        state: '',
        postalcode: '',
        country: '',
        experience: 0,
        domainexperience: 0,
        experienceestimation: "Years",
        domainexperienceestimation: "Years",
        qualification: 'Please Select Qualification',
        currentjobtitle: '',
        currentemployer: '',
        expectedsalary: 0,
        currentsalary: 0,
        skillset: '',
        additionalinfo: '',
        linkedinid: '',
        status: 'New',
        source: 'Added by User',
        sourcecandidate: 'Choose Source',
        educationdetails: '',
        experiencedetails: '',
        resumefile: '',
        coverletterfile: '',
        experienceletterfile: '',
        payslipletter: '',
        dateofbirth: '',
        interviewdate: '',
        time: '',
        age: '',
        phonecheck: false,
      });
      setEducationtodo([]);
      setExperiencetodo([]);
      setEducationDetails({
        school: '',
        department: '',
        degree: '',
        percentage: "",
        fromduration: '',
        toduration: '',
        pursuing: false,
      });
      setExperienceDetails({
        occupation: '',
        company: '',
        summary: '',
        fromduration: '',
        toduration: '',
        currentlyworkhere: false,
      });
      setCoverletter([]);
      setResumeFiles([]);
      setExperienceletter([]);
      setPayslipletter([]);
      setSelectedSkill([]);
      setCurrectEmployeeSwitch(false)
      setTwofaSwitch(false)
      setBtnSubmit(false);
      setIsLoading(false);
      backPage(`/recruitment/unassignedcandidates`);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setResumeFiles([]);
      setCheckDup(false);
    } catch (err) {
      setCheckDup(false);
      console.log(err, 'err');
      setBtnSubmit(false);
      setIsLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  let cityget = State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === 'India')?.isoCode).find((state) => state.name === 'Tamil Nadu');

  const handleClear = () => {
    setAddcandidate({
      prefix: 'Mr',
      firstname: '',
      lastname: '',
      email: '',
      mobile: '',
      whatsapp: '',
      pannumber: '',
      adharnumber: '',
      street: '',
      city: '',
      state: '',
      postalcode: '',
      country: '',
      experience: 0,
      domainexperience: 0,
      experienceestimation: "Years",
      domainexperienceestimation: "Years",
      qualification: 'Please Select Qualification',
      expectedsalaryopts: 'Please Select Expected Salary',
      joiningbydaysopts: 'Please Select Joining By Days',
      currentjobtitle: '',
      currentemployer: '',
      expectedsalary: 0,
      currentsalary: 0,
      skillset: '',
      additionalinfo: '',
      linkedinid: '',
      status: 'New',
      source: 'Added by User',
      sourcecandidate: 'Choose Source',
      educationdetails: '',
      experiencedetails: '',
      resumefile: '',
      coverletterfile: '',
      experienceletterfile: '',
      payslipletterfile: '',
      dateofbirth: '',
      interviewdate: '',
      time: '',
      age: '',
      phonecheck: false,
      categoryedu: 'Please Select Category',
      subcategoryedu: 'Please Select Sub Category',
      specialization: 'Please Select Specialization',

      joinbydays: 0,
      noticeperiod: 0,
      domainexperience: 0,
      gender: 'Please Select Gender',
    });
    setexperience(0);
    setCoverletter([]);
    setResumeFiles([]);
    setExperienceletter([]);
    setPayslipletter([]);
    setEducationtodo([]);
    setExperiencetodo([]);
    setSelectedSkill([]);
    setSubcategorys([]);
    setEducationsOpt([]);
    setSelectedCountry(Country.getAllCountries().find((country) => country.name === 'India'));
    setSelectedState(State.getStatesOfCountry(Country.getAllCountries().find((country) => country.name === 'India')?.isoCode).find((state) => state.name === 'Tamil Nadu'));
    setSelectedCity(City.getCitiesOfState(cityget?.countryCode, cityget?.isoCode).find((city) => city.name === 'Tiruchirappalli'));
    setEducationDetails({
      school: '',
      department: '',
      degree: '',
      percentage: "",
      fromduration: '',
      toduration: '',
      pursuing: false,
    });
    setExperienceDetails({
      occupation: '',
      company: '',
      summary: '',
      fromduration: '',
      toduration: '',
      currentlyworkhere: false,
    });
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
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
      setPopupContentMalert('Please Check Duplicate!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.firstname == '') {
      setPopupContentMalert('Please Enter First Name!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.lastname == '') {
      setPopupContentMalert('Please Enter Last Name!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.gender == 'Please Select Gender' || addcandidate.gender == '' || addcandidate.gender == undefined) {
      setPopupContentMalert('Please Select Gender!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.email == '' || addcandidate.email == undefined) {
      setPopupContentMalert('Please Enter Email!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.email && !isValidEmail(addcandidate.email)) {
      setPopupContentMalert('Please Enter Valid Email!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.mobile == '' || addcandidate.mobile == undefined) {
      setPopupContentMalert('Please Enter Mobile No!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.mobile.length > 0 && addcandidate.mobile.length < 10) {
      setPopupContentMalert('Please enter a 10-digit mobile number!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.dateofbirth == "" || addcandidate.dateofbirth == undefined) {
      setPopupContentMalert("Please Select DOB!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (addcandidate.candidatestatusexp === 'Please Select Candidate Status') {
      setPopupContentMalert('Please Select Candidate Status');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.workmode === 'Please Select Work Mode') {
      setPopupContentMalert('Please Select WorkMode!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.whatsapp.length > 0 && addcandidate.whatsapp.length < 10) {
      setPopupContentMalert('Please enter a 10-digit whatsapp number!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if ((addcandidate.experience != '' && addcandidate.experience > 0 && addcandidate.currentsalary == '' && addcandidate.experienceoption !== "Not Working") || 0) {
      setPopupContentMalert('Please Enter Current Salary!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if ((addcandidate.experience != '' && addcandidate.experience > 0 && addcandidate.noticeperiod == 0 && addcandidate.experienceoption !== "Not Working") || 0) {
      setPopupContentMalert('Please Enter Notice Period Days!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (resumefiles == 0) {
      setPopupContentMalert('Please Upload Resume!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.adharnumber.length > 0 && addcandidate.adharnumber.length < 12) {
      setPopupContentMalert('Please enter a 12-digit Adhaar number!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (addcandidate.pannumber.length > 0 && addcandidate.pannumber.length < 10) {
      setPopupContentMalert('Please enter a valid Pan number!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedCountry?.isoCode !== selectedState?.countryCode) {
      setPopupContentMalert('Please Select The Correct State!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedCountry?.isoCode !== selectedCity?.countryCode || selectedState?.isoCode !== selectedCity?.stateCode) {
      setPopupContentMalert('Please Select The Correct City!');
      setPopupSeverityMalert('info');
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
        return data.fullname?.toLowerCase() === String(addcandidate.firstname + ' ' + addcandidate.lastname)?.toLowerCase() && data.email === String(addcandidate.email) && data.mobile == addcandidate.mobile;
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
              <ErrorOutlineOutlinedIcon style={{ fontSize: '100px', color: 'orange' }} />
              <p style={{ fontSize: '20px', fontWeight: 900 }}>The Same Candidate is Already Exists/Rejected!. Do you wish to Submit Again?</p>
            </>
          );
          handleClickOpenDuplicate();
        } else {
          setIsLoading(false);
          setShowAlertBetween(
            <>
              <ErrorOutlineOutlinedIcon style={{ fontSize: '100px', color: 'orange' }} />
              <p style={{ fontSize: '20px', fontWeight: 900 }}>
                You are Already Applied. It is on Screening Position. If any Queries contact <span style={{ color: '#1976D2' }}>{contactEmail}</span>
              </p>
            </>
          );
          handleClickOpenBetween();
        }
      } else {
        let foundDataNew = allcandidates.find((data) => {
          return data.email === String(addcandidate.email);
        });

        if (foundDataNew) {
          setPopupContentMalert('Email Already Exist!');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else {
          let foundDataMob = allcandidates.find((data) => {
            return data.mobile == addcandidate.mobile;
          });
          if (foundDataMob) {
            setPopupContentMalert('Mobile Already Exist!');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
          } else {
            let foundDataadhaar;
            if (addcandidate.adharnumber !== '') {
              foundDataadhaar = allcandidates.find((data) => {
                return data.adharnumber == addcandidate.adharnumber;
              });
            }

            if (foundDataadhaar) {
              setPopupContentMalert('Adhaar Already Exist!');
              setPopupSeverityMalert('info');
              handleClickOpenPopupMalert();
            } else {
              let foundDataPan;
              if (addcandidate.pannumber !== '') {
                foundDataPan = allcandidates.find((data) => {
                  return data.pannumber == addcandidate.pannumber;
                });
              }
              if (foundDataPan) {
                setPopupContentMalert('PAN Number Already Exist!');
                setPopupSeverityMalert('info');
                handleClickOpenPopupMalert();
              } else {
                sendRequest();
              }
            }
          }
        }
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const buttonStyleslocal = {
    default: {
      backgroundColor: 'primary.main',
    },
    duplicate: {
      backgroundColor: 'red',
      '&:hover': {
        backgroundColor: 'darkred',
      },
    },
    noDuplicate: {
      backgroundColor: 'green',
      '&:hover': {
        backgroundColor: 'darkgreen',
      },
    },
  };

  const [duplicateValues, setDuplicateValues] = useState([]);

  const checkDuplicateFunction = async () => {
    setBtnSubmitDuplicate(true);
    // setIsLoading(true);
    setPageName(!pageName);
    try {
      if (addcandidate.firstname == '') {
        setPopupContentMalert('Please Enter First Name!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (addcandidate.lastname == '') {
        setPopupContentMalert('Please Enter Last Name!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setBtnSubmitDuplicate(false);
      } else if (addcandidate.email == '' || addcandidate.email == undefined) {
        setPopupContentMalert('Please Enter Email!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (addcandidate.email && !isValidEmail(addcandidate.email)) {
        setPopupContentMalert('Please Enter Valid Email!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (addcandidate.mobile == '' || addcandidate.mobile == undefined) {
        setPopupContentMalert('Please Enter Mobile No!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (addcandidate.mobile.length > 0 && addcandidate.mobile.length < 10) {
        setPopupContentMalert('Please enter a 10-digit mobile number!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setBtnSubmitDuplicate(false);
      } else if (addcandidate.dateofbirth == "" || addcandidate.dateofbirth == undefined) {
        setPopupContentMalert("Please Select DOB!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setBtnSubmitDuplicate(false);
      } else if (addcandidate.adharnumber?.length > 0 && addcandidate.adharnumber?.length < 12) {
        setPopupContentMalert('Please Enter Valid Adhaar Number!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (addcandidate.pannumber?.length > 0 && addcandidate.pannumber?.length < 10) {
        setPopupContentMalert('Please Enter Valid Pan Number!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else {
        let res = await axios.get(SERVICE.CANDIDATESALLBYRESTRICTION);

        let allcandidates = res?.data?.candidates.slice().sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        let foundData = allcandidates.find((data) => {
          return data.fullname?.toLowerCase() === String(addcandidate.firstname + ' ' + addcandidate.lastname)?.toLowerCase() && data.email === String(addcandidate.email) && data.mobile == addcandidate.mobile;
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
                <ErrorOutlineOutlinedIcon style={{ fontSize: '100px', color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>The Same Candidate is Already Exists/Rejected!. Do you wish to Submit Again?</p>
              </>
            );
            handleClickOpenDuplicate();
          } else {
            setIsLoading(false);
            setShowAlertBetween(
              <>
                <ErrorOutlineOutlinedIcon style={{ fontSize: '100px', color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>
                  You are Already Applied. It is on Screening Position. If any Queries contact <span style={{ color: '#1976D2' }}>{contactEmail}</span>
                </p>
              </>
            );
            handleClickOpenBetween();
          }
        } else {
          console.log('che');
          let duplicates = [];

          let foundDataName = allcandidates.find((data) => data.fullname?.toLowerCase() === String(addcandidate.firstname?.toLowerCase()) + ' ' + String(addcandidate.lastname?.toLowerCase()));
          if (foundDataName && addcandidate.firstname + addcandidate.lastname) {
            duplicates.push({
              field: 'Name',
              value: addcandidate.firstname + ' ' + addcandidate.lastname + ' ' + `(Role: ${foundDataName.role}, Applied Date: ${moment(foundDataName.createdAt).format('DD-MM-YYYY')})`,
              id: foundDataName?._id,
            });
          }

          let foundDataNew = allcandidates.find((data) => data.email === String(addcandidate.email));
          if (foundDataNew && addcandidate.email) {
            duplicates.push({
              field: 'Email',
              value: addcandidate.email,
              id: foundDataNew?._id,
            });
          }

          let foundDataMob = allcandidates.find((data) => data.mobile == addcandidate.mobile);
          if (foundDataMob && addcandidate.mobile) {
            duplicates.push({
              field: 'Mobile',
              value: addcandidate.mobile,
              id: foundDataMob?._id,
            });
          }

          let foundDataDob = allcandidates.find((data) => data.dateofbirth == addcandidate.dateofbirth);
          if (foundDataDob && addcandidate.dateofbirth) {
            duplicates.push({
              field: 'DOB',
              value: moment(addcandidate.dateofbirth).format('DD-MM-YYYY'),
              id: foundDataDob?._id,
            });
          }

          let foundDataadhaar;
          if (addcandidate.adharnumber) {
            foundDataadhaar = allcandidates.find((data) => data.adharnumber == addcandidate.adharnumber);
            if (foundDataadhaar) {
              duplicates.push({
                field: 'Adhaar',
                value: addcandidate.adharnumber,
                id: foundDataadhaar?._id,
              });
            }
          }

          let foundDataPan;
          if (addcandidate.pannumber) {
            foundDataPan = allcandidates.find((data) => data.pannumber == addcandidate.pannumber);
            if (foundDataPan) {
              duplicates.push({
                field: 'Pan Number',
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
                    fontSize: '20px',
                    fontWeight: 900,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  Duplicate Entry
                  <Button onClick={handleCloseerrdupe}>
                    <CloseIcon color="black" />
                  </Button>
                </Typography>
                <div>
                  <Table style={{ width: '100%' }}>
                    <TableHead>
                      <StyledTableCell sx={{ padding: '10px 20px !important' }}>{'SNO'}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: '10px 20px !important' }}>{'Field'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '10px 20px !important' }}>{'Value'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '10px 20px !important' }}>{'View'}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {duplicates.map((item, i) => (
                        <StyledTableRow key={i}>
                          <StyledTableCell sx={{ padding: '10px 20px !important' }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: '10px 20px !important' }}>{item.field}</StyledTableCell>
                          <StyledTableCell sx={{ padding: '10px 20px !important' }}>{item.value}</StyledTableCell>
                          <StyledTableCell sx={{ padding: '10px 20px !important' }}>
                            <Button sx={userStyle.buttonedit} onClick={() => window.open(`/resumemanagement/view/${item.id}`, '_blank')}>
                              <VisibilityOutlinedIcon style={{ fontSize: 'large' }} />
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleMobile = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Mobile number can't more than 10 characters!");
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setAddcandidate({ ...addcandidate, mobile: num });
    }
  };
  const handlewhatsapp = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Whats app number can't more than 10 characters!");
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setAddcandidate({ ...addcandidate, whatsapp: num });
    }
  };
  const handlePostal = (e) => {
    if (e.length > 6) {
      setPopupContentMalert("Postal code can't more than 6 characters!");
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
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
        case 'Name':
          updatedCandidate.firstname = '';
          updatedCandidate.lastname = '';
          break;
        case 'Email':
          updatedCandidate.email = '';
          break;
        case 'Mobile':
          updatedCandidate.mobile = '';
          break;
        case 'DOB':
          updatedCandidate.dateofbirth = '';
          updatedCandidate.age = '';
          break;
        case 'Adhaar':
          updatedCandidate.adharnumber = '';
          break;
        case 'Pan Number':
          updatedCandidate.pannumber = '';
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

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
      setAddcandidate({ ...addcandidate, postalcode: inputValue });
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
    setAddcandidate({
      ...addcandidate,
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
    setAddcandidate({
      ...addcandidate,
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
      <Headtitle title={'ADD RESUME'} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Add Resume </Typography>

      <>
        <Box sx={userStyle.selectcontainer}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ margin: '20px 0px' }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Basic Info</b>
              </Typography>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Grid container sx={{ display: 'flex' }}>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography>Prefix</Typography>
                </Grid>
                <Grid item md={9} sm={9} xs={12}>
                  <Typography>
                    First Name<b style={{ color: 'red' }}>*</b>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container sx={{ display: 'flex' }}>
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
                <Grid item md={9} sm={6} xs={12}>
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
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Last Name<b style={{ color: 'red' }}>*</b>
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
                  Reference No<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={AutoId}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Gender <b style={{ color: 'red' }}>*</b>
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
            <Grid item lg={2} md={3} sm={12} xs={12}>
              <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>

              {croppedImage && (
                <>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img
                      style={{
                        height: 120,
                        borderRadius: '8px', // Rounded corners for the image
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for the image
                        objectFit: 'cover', // Ensure the image covers the area without distortion
                      }}
                      src={croppedImage}
                      alt="Cropped"
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Color Picker */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Typography
                          variant="body1"
                          style={{
                            color: '#555',
                            fontSize: '10px',
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
                          border: '1px solid  black',
                        }}
                      ></LoadingButton>
                    </div>
                  </div>
                </>
              )}
              <div>
                {addcandidate.uploadedimage && !croppedImage && (getImg !== undefined || getImg !== null) ? (
                  // (getImg !== null && getImg !== undefined) ? (
                  <>
                    <Cropper
                      style={{ height: 120, width: '100%' }}
                      aspectRatio={1 / 1}
                      // src={selectedFile}
                      src={
                        // getImg !== null && getImg !== undefined
                        //   ? getImg
                        addcandidate.uploadedimage
                      }
                      ref={cropperRef}
                    />
                    <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                      <Box>
                        <Typography sx={userStyle.uploadbtn} onClick={handleCrop}>
                          Crop Image
                        </Typography>
                      </Box>
                      <Box>
                        <Button variant="outlined" sx={buttonStyles.btncancel} onClick={handleClearImage}>
                          Clear
                        </Button>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                    <Box item md={1} sm={3}>
                      <LoadingButton component="label" variant="contained" loading={btnUpload} sx={userStyle.buttonadd}>
                        Upload
                        <input type="file" id="profileimage" name="file" accept="image/*" hidden onChange={handleChangeImage} />
                      </LoadingButton>
                    </Box>

                    <Box item md={1} sm={3}>
                      <Button onClick={showWebcam} variant="contained" sx={userStyle.uploadbtn}>
                        <CameraAltIcon />
                      </Button>
                    </Box>

                    {addcandidate.uploadedimage && (
                      <>
                        <Box item md={3} sm={3}>
                          <Button variant="outlined" sx={buttonStyles.btncancel} onClick={handleClearImage}>
                            Clear
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                )}
              </div>
              <Dialog open={isWebcamOpen} onClose={webcamClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                  <Webcamimage getImg={getImg} setGetImg={setGetImg} capturedImages={capturedImages} valNum={valNum} setValNum={setValNum} name={name} />
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="success" onClick={webcamDataStore}>
                    OK
                  </Button>
                  <Button variant="contained" sx={buttonStyles.btncancel} onClick={webcamClose}>
                    CANCEL
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Email<b style={{ color: 'red' }}>*</b>
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
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Mobile<b style={{ color: 'red' }}>*</b>
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
            <Grid item md={2} sm={6} xs={12}>
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
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>DOB<b style={{ color: "red" }}>*</b></Typography>
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
            <Grid item md={2} sm={6} xs={12}>
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
            <Grid item md={2} sm={6} xs={12}>
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
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>&nbsp;</Typography>
                <LoadingButton
                  loading={btnSubmitDuplicate}
                  sx={{
                    ...userStyle.buttonadd,
                    ...(isDuplicate === null ? buttonStyleslocal.default : isDuplicate ? buttonStyleslocal.duplicate : buttonStyleslocal.noDuplicate),
                  }}
                  variant="contained"
                  size="small"
                  onClick={checkDuplicateFunction}
                  startIcon={isDuplicate === null ? null : isDuplicate ? <CancelIcon style={{ color: 'white' }} /> : <CheckCircleIcon style={{ color: 'white' }} />}
                >
                  {isDuplicate === null ? 'Check Duplicate' : isDuplicate ? 'Duplicate Found' : 'No Duplicate Found'}
                </LoadingButton>
              </FormControl>
            </Grid>


            <Grid item xs={12} sx={{ margin: '20px 0px' }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Address Information</b>
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Address Type
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={addressTypeOptions}
                  value={{
                    label: addcandidate.addesstype,
                    value: addcandidate.addesstype,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                    label: addcandidate.personalprefix,
                    value: addcandidate.personalprefix,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                  value={addcandidate.referencename}
                  placeholder="Please Enter Reference Name"
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                    label: addcandidate.landmarkpositionprefix,
                    value: addcandidate.landmarkpositionprefix,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                  value={addcandidate.landmarkname}
                  placeholder="Please Enter Landmark Name"
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                  value={addcandidate.houseflatnumber}
                  placeholder="Please Enter House/Flat Number"
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                  value={addcandidate.streetroadname}
                  placeholder="Please Enter Street/Road Name"
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                  value={addcandidate.localityareaname}
                  placeholder="Please Enter Locality/Area Name"
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                    setAddcandidate((prevSupplier) => ({
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
                    setAddcandidate((prevSupplier) => ({
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
                    setAddcandidate((prevSupplier) => ({
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
                  value={addcandidate.postalcode}
                  onChange={(e) => {
                    // setAddcandidate({
                    //   ...addcandidate,
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
                  value={addcandidate.gpscoordinate}
                  placeholder="Please Enter GPS Coordinate"
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                      addcandidate.personalprefix !== "Please Select Personal Prefix" ? addcandidate.personalprefix : null,
                      addcandidate.referencename,
                      addcandidate.landmarkpositionprefix !== "Please Select Landmark Position Prefix" ? addcandidate.landmarkpositionprefix : null,
                      addcandidate.landmarkname,
                      addcandidate.houseflatnumber,
                      addcandidate.streetroadname,
                      addcandidate.localityareaname,
                      addcandidate.pcity,
                      addcandidate.pstate,
                      addcandidate.pcountry,
                      addcandidate.postalcode
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
            <Grid item xs={12} sx={{ margin: '20px 0px' }}>
              <Typography sx={{ fontSize: '16px' }}>
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
                    label: addcandidate.candidatestatusexp,
                    value: addcandidate.candidatestatusexp,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                    label: addcandidate.workmode,
                    value: addcandidate.workmode,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
                    label: addcandidate.experienceoption,
                    value: addcandidate.experienceoption,
                  }}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
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
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Expected Salary</Typography>
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
            <Grid item md={3} sm={4} xs={12}>
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
                      expectedsalary: Number(e.target.value) >= 0 ? Number(e.target.value) : 0,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Joining By Days</Typography>
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
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Joining By Days</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={addcandidate.joinbydays}
                  onChange={(e) => {
                    setAddcandidate({
                      ...addcandidate,
                      joinbydays: Number(e.target.value) >= 0 ? Number(e.target.value) : 0,
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
                        value={addcandidate.currentjobtitle}
                        sx={{ width: "100%" }}
                        onChange={(e) => {
                          setAddcandidate({
                            ...addcandidate,
                            currentjobtitle: e.target.value,
                          });
                        }}
                      />
                      :
                      <Selects
                        options={jobTitleOption}
                        placeholder="Please Select"
                        value={{ label: addcandidate.currentjobtitle, value: addcandidate.currentjobtitle }}
                        onChange={(e) => {
                          setAddcandidate({
                            ...addcandidate,
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
                        value={addcandidate.currentemployer}
                        sx={{ width: "100%" }}
                        onChange={(e) => {
                          setAddcandidate({
                            ...addcandidate,
                            currentemployer: e.target.value,
                          });
                        }}
                      />
                      :
                      <Selects
                        options={currentEmployeeOption}
                        placeholder="Please Select"
                        value={{ label: addcandidate.currentemployer, value: addcandidate.currentemployer }}
                        onChange={(e) => {
                          setAddcandidate({
                            ...addcandidate,
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


            {experience <= 0 ? (
              ''
            ) : (
              <>
                <Grid item md={3} sm={4} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Current Salary<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={addcandidate.currentsalary}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          currentsalary: Number(e.target.value) >= 0 ? Number(e.target.value) : 0,
                        });
                      }}
                      sx={userStyle.input}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} sm={4} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Notice Period Days
                      <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={addcandidate.noticeperiod}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          noticeperiod: Number(e.target.value) >= 0 ? Number(e.target.value) : 0,
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
            <Grid item xs={12} sx={{ margin: '20px 0px' }}>
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
            <Grid item xs={12} sx={{ margin: '20px 0px 10px 0px' }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Education details</b>
              </Typography>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Grid container spacing={3} sx={{ display: 'flex' }}>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: 'red' }}>*</b>
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
                            label: 'Please Select Category',
                            value: 'Please Select Category',
                          }
                      }
                      onChange={(e) => {
                        setEducationDetails((prev) => ({
                          ...prev,
                          categoryedu: e.value,
                          subcategoryedu: 'Please Select Sub Category',
                          specialization: 'Please Select Specialization',
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
                      Sub Category <b style={{ color: 'red' }}>*</b>
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
                            label: 'Please Select Sub Category',
                            value: 'Please Select Sub Category',
                          }
                      }
                      onChange={(e) => {
                        setEducationDetails((prev) => ({
                          ...prev,
                          subcategoryedu: e.value,
                          specialization: 'Please Select Specialization',
                        }));
                        fetchEducation(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    {' '}
                    Specialization <b style={{ color: 'red' }}>*</b>
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
                            label: 'Please Select Specialization',
                            value: 'Please Select Specialization',
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
                <Grid item md={4} sm={6} xs={12} sx={{ display: 'flex' }}>
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
                  <Typography sx={{ margin: '30px 10px 0 10px' }}>To</Typography>
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
                <Grid item md={4} sm={6} xs={12} sx={{ display: 'flex', marginTop: '20px' }}>
                  <Typography sx={{ marginTop: '8px' }}>Currently pursuing</Typography>
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
              <Button variant="outlined" sx={{ textTransform: 'capitalize' }} onClick={educationTodo}>
                <AddIcon />
                &nbsp; Add Education Details
              </Button>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                  <TableHead sx={{ fontWeight: '600' }}>
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
                          <StyledTableCell>{row.subcategoryedu}</StyledTableCell>
                          <StyledTableCell>{row.specialization}</StyledTableCell>
                          <StyledTableCell>{row.school}</StyledTableCell>
                          <StyledTableCell>{row.department}</StyledTableCell>
                          <StyledTableCell>{row.degree}</StyledTableCell>
                          <StyledTableCell>{row?.percentage}</StyledTableCell>
                          <StyledTableCell>
                            {row.fromduration} {row.fromduration && row.toduration ? ' To ' : ''} {row.toduration}
                          </StyledTableCell>
                          <StyledTableCell>{row.pursuing ? 'Yes' : 'No'}</StyledTableCell>
                          <StyledTableCell>
                            <CloseIcon
                              sx={{ color: 'red', cursor: 'pointer' }}
                              onClick={() => {
                                educationTodoremove(index);
                              }}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        {' '}
                        <StyledTableCell colSpan={8} align="center">
                          No Data Available
                        </StyledTableCell>{' '}
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} sx={{ margin: '20px 0px 10px 0px' }}>
              <Typography sx={userStyle.importheadtext}>
                <b> Experience details</b>
              </Typography>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Grid container spacing={3} sx={{ display: 'flex' }}>
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
                <Grid item md={6} sm={6} xs={12} sx={{ display: 'flex' }}>
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
                  <Typography sx={{ margin: '30px 10px 0 10px' }}>To</Typography>
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
                <Grid item md={6} sm={6} xs={12} sx={{ display: 'flex', marginTop: '20px' }}>
                  <Typography sx={{ marginTop: '8px' }}>I Currently Work here</Typography>
                  &emsp;
                  <FormControl size="small">
                    <Checkbox
                      checked={experienceDetails.currentlyworkhere}
                      onChange={(e) =>
                        setExperienceDetails({
                          ...experienceDetails,
                          currentlyworkhere: !experienceDetails.currentlyworkhere,
                        })
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Button variant="outlined" sx={{ textTransform: 'capitalize' }} onClick={experienceTodo}>
                <AddIcon />
                &nbsp; Experience Details
              </Button>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                  <TableHead sx={{ fontWeight: '600' }}>
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
                            {row.fromduration} {row.fromduration && row.toduration ? ' To ' : ''} {row.toduration}
                          </StyledTableCell>
                          <StyledTableCell>{row.currentlyworkhere ? 'Yes' : 'No'}</StyledTableCell>
                          <StyledTableCell>
                            <CloseIcon
                              sx={{ color: 'red', cursor: 'pointer' }}
                              onClick={() => {
                                experienceTodoremove(index);
                              }}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        {' '}
                        <StyledTableCell colSpan={8} align="center">
                          No Data Available
                        </StyledTableCell>{' '}
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
                <MultiSelect options={skill} value={selectedskill} onChange={handleSkilChange} valueRenderer={renderValueSkill} labelledBy="Please select" />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Certificaion</Typography>
                <MultiSelect options={certification} value={selectedCertification} onChange={handleCertficationChange} valueRenderer={renderValueCertification} labelledBy="Please select" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ margin: '20px 0px 10px 0px' }}>
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
                display: 'flex',
                marginLeft: '40px',
                justifyContent: 'center',
                '@media only screen and (max-width:550px)': {
                  flexDirection: 'column',
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  '@media only screen and (max-width:550px)': {
                    flexDirection: 'column',
                  },
                }}
              >
                <Typography sx={userStyle.importheadtext} style={{ marginLeft: '5px' }}>
                  Resume <b style={{ color: 'red' }}>*</b>
                </Typography>
                <Box sx={{ paddingLeft: '5px' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    sx={{
                      '@media only screen and (max-width:550px)': {
                        marginY: '5px',
                      },
                    }}
                  >
                    Upload
                    <input type="file" id="resume" accept=".xlsx, .xls, .csv, .pdf, .doc, .txt," name="file" hidden onChange={handleResumeUpload} />
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
                          <Typography>{data.file.name}</Typography>
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreview(data.file)}
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
                    display: 'flex',
                    marginLeft: '40px',
                    justifyContent: 'center',
                    '@media only screen and (max-width:550px)': {
                      flexDirection: 'column',
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
                      display: 'flex',
                      justifyContent: 'space-between',
                      '@media only screen and (max-width:550px)': {
                        flexDirection: 'column',
                      },
                    }}
                  >
                    <Typography sx={userStyle.importheadtext} style={{ marginLeft: '5px' }}>
                      Experience Letter
                    </Typography>
                    <Box sx={{ paddingLeft: '5px' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        component="label"
                        sx={{
                          '@media only screen and (max-width:550px)': {
                            marginY: '5px',
                          },
                        }}
                      >
                        Upload
                        <input type="file" id="resume" accept=".xlsx, .xls, .csv, .pdf, .doc, .txt," name="file" hidden onChange={handleExperienceletterUpload} />
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
                              <Typography>{data.file.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreview(data.file)}
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
                    display: 'flex',
                    marginLeft: '40px',
                    justifyContent: 'center',
                    '@media only screen and (max-width:550px)': {
                      flexDirection: 'column',
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
                      display: 'flex',
                      justifyContent: 'space-between',
                      '@media only screen and (max-width:550px)': {
                        flexDirection: 'column',
                      },
                    }}
                  >
                    <Typography sx={userStyle.importheadtext} style={{ marginLeft: '5px' }}>
                      Pay Slip
                    </Typography>
                    <Box sx={{ paddingLeft: '5px' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        component="label"
                        sx={{
                          '@media only screen and (max-width:550px)': {
                            marginY: '5px',
                          },
                        }}
                      >
                        Upload
                        <input type="file" id="resume" accept=".xlsx, .xls, .csv, .pdf, .doc, .txt," name="file" hidden onChange={handlePayslipletterUpload} />
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
                              <Typography>{data.file.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreview(data.file)}
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
                display: 'flex',
                marginLeft: '40px',
                justifyContent: 'center',
                '@media only screen and (max-width:550px)': {
                  flexDirection: 'column',
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  '@media only screen and (max-width:550px)': {
                    flexDirection: 'column',
                  },
                }}
              >
                <Typography sx={userStyle.importheadtext} style={{ marginLeft: '5px' }}>
                  Cover letter
                </Typography>
                <Box sx={{ paddingLeft: '5px' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    sx={{
                      '@media only screen and (max-width:550px)': {
                        marginY: '5px',
                      },
                    }}
                    disabled={currentText === '<p><br></p>' || currentText === '' ? false : true}
                  >
                    Upload
                    <input type="file" id="resume" accept=".xlsx, .xls, .csv, .pdf, .doc, .txt," name="file" hidden onChange={handleCoverletterUpload} />
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
                          <Typography>{data.file.name}</Typography>
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreview(data.file)}
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
                    display: 'flex',
                    marginLeft: '30px',
                    justifyContent: 'center',
                    '@media only screen and (max-width:550px)': {
                      flexDirection: 'column',
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
                        style={{ height: '180px' }}
                        value={currentText}
                        onChange={(e) => {
                          setCurrentText(e);
                        }}
                        modules={{
                          toolbar: [[{ header: '1' }, { header: '2' }, { font: [] }], [{ size: [] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], ['link', 'image', 'video'], ['clean']],
                        }}
                        formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video']}
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
          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Grid item md={12} sm={12} xs={12}>
                <LoadingButton x={buttonStyles.buttonsubmit} loading={btnSubmit} variant="contained" onClick={handleSubmit}>
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: '350px',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" style={{ fontSize: '20px', fontWeight: 900 }}>
                  {showAlert}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  style={{
                    padding: '7px 13px',
                    color: 'white',
                    background: 'rgb(25, 118, 210)',
                  }}
                  onClick={handleCloseerr}
                >
                  ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box>
            <Dialog open={isDuplicateOpen} onClose={handleCloseDuplicate} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: '450px',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" style={{ fontSize: '20px', fontWeight: 900 }}>
                  {showAlertDuplicate}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  style={{
                    padding: '7px 13px',
                    color: 'black',
                    background: '#fff',
                  }}
                  onClick={handleCloseDuplicate}
                >
                  No
                </Button>
                <Button
                  variant="contained"
                  style={{
                    padding: '7px 13px',
                    color: 'white',
                    background: 'rgb(25, 118, 210)',
                  }}
                  onClick={sendRequest}
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box>
            <Dialog open={isErrorOpendupe} onClose={handleCloseerrdupe} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
              <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                <Typography variant="h6">{showAlertdupe}</Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSubmitUpdatedupe}>
                  Upload Without Duplicate
                </Button>
                <Button variant="contained" color="primary" onClick={handleCloseerrdupe}>
                  Upload With Duplicate
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box>
            <Dialog open={isErrorOpenBetween} onClose={handleCloseBetween} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: '450px',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" style={{ fontSize: '20px', fontWeight: 900 }}>
                  {showAlertBetween}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  style={{
                    padding: '7px 13px',
                    color: 'white',
                    background: 'rgb(25, 118, 210)',
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
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default Addresumeinteractor;