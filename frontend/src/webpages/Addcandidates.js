import React, { useState, useEffect, useContext } from "react";
import { userStyle, useraccessStyle } from "./addcandidatestyle.js";

import { GlobalStyles } from "@mui/material";
import { FaPrint, FaFilePdf, FaTrash, FaPlus } from "react-icons/fa";
import Footer from "../components/footer/footer.js";
import "./addcandidates.css";
import hilife from "./images/+-removebg-preview-removebg-preview.png";
import uploadfile from "./images/upload.png";
import numberone from "./images/one.png";
import numberonenew from "./images/onenew.png";
import numbertwo from "./images/two.png";
import numbertwonew from "./images/twonew.png";
import numberthree from "./images/three.png";
import numberthreenew from "./images/threenew.png";
import numberfour from "./images/four.png";
import numberfournew from "./images/fournew.png";
import numberfive from "./images/five.png";
import numberfivenew from "./images/fivenew.png";
import { Country, State, City } from "country-state-city";
import { SERVICE } from "../services/Baseservice";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import celebration from "../images/celebration.png";

import { FaArrowAltCircleRight } from "react-icons/fa";

import { colourStyles, colourStylesred } from "../pageStyle.js";
import { Link } from "react-router-dom";
import "jspdf-autotable";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useParams, useNavigate } from "react-router-dom";
// import Webcamimage from "../../asset/Webcameimageasset";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import pdfIcon from "./Assets/pdf-icon.png";
import wordIcon from "./Assets/word-icon.png";
import excelIcon from "./Assets/excel-icon.png";
import csvIcon from "./Assets/CSV.png";
import fileIcon from "./Assets/file-icons.png";

import {
  FormGroup,
  TableRow,
  TableCell,
  TextareaAutosize,
  OutlinedInput,
  Checkbox,
  TableBody,
  TableHead,
  Table,
  Dialog,
  TableContainer,
  Paper,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  FormControl,
  TextField,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";

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

function Addcandidates() {


  const [overallSettings, setOverAllsettingsCount] = useState({});
  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);
      setOverAllsettingsCount(res?.data?.overallsettings[0]);

    } catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  }

  useEffect(() => {
    fetchOverAllSettings()
  }, []);




  const genderOption = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const [isDeletealert, setDeletealert] = useState(false);

  const [buttonLoad, setButtonLoad] = useState(false);
  const [todosEdit, setTodosEdit] = useState([]);
  const classes = useStyles();
  const backPage = useNavigate();
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

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


  // const handleClearImage = () => {
  //   setFile(null);
  //   setGetImg(null);
  //   setSelectedFile(null);
  //   setCroppedImage(null);
  //   setEmployee({ ...employee, profileimage: "" });
  // };

  const [selectedFile, setSelectedFile] = useState([]); // State to store the selected file object
  const [selectedFileone, setSelectedFileone] = useState([]); // State to store the selected file object
  const [selectedFiletwo, setSelectedFiletwo] = useState([]); // State to store the selected file object

  const handleDeleteFileDocument = (index) => {
    setSelectedFile((prevFiles) => prevFiles.filter((_, i) => i !== index));

  };
  const handleDeleteFileDocumentone = (index) => {
    setSelectedFileone((prevFiles) => prevFiles.filter((_, i) => i !== index));
    // Update state with the selected file object
  };
  const handleDeleteFileDocumenttwo = (index) => {
    // Get the selected file
    setSelectedFiletwo((prevFiles) => prevFiles.filter((_, i) => i !== index));
    // Update state with // Update state with the selected file object
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleResumeUpload = (event) => {
    const resume = event.target.files;

    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedFile((prevFiles) => [
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
  const handleResumeUploadone = (event) => {
    const resume = event.target.files;

    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedFileone((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "experience file",
          },
        ]);
      };
    }
  };
  const handleResumeUploadtwo = (event) => {
    const resume = event.target.files;

    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedFiletwo((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "cover file",
          },
        ]);
      };
    }
  };

  const [educationDetails, setEducationDetails] = useState({
    categoryedu: "",
    subcategoryedu: "",
    specialization: "",
    school: "",
    department: "",
    degree: "",
    fromduration: "",
    toduration: "",
    pursuing: false,
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
  const [experiencetodo, setExperiencetodo] = useState([]);

  const educationTodo = () => {
    // if (
    //   educationDetails.school == "" &&
    //   educationDetails.department == "" &&
    //   educationDetails.degree == ""
    // ) {
    //   setShowAlert("Please Enter Atleast one field!");
    //   handleClickOpenerr();
    // } 
    if (educationDetails.school == "") {
      setShowAlert("Please Enter Institute / School field!");
      handleClickOpenerr();
    } else if (educationDetails.department == "") {
      setShowAlert("Please Enter Major / Department field!");
      handleClickOpenerr();
    }
    else if (educationDetails.degree == "") {
      setShowAlert("Please Enter Degree field!");
      handleClickOpenerr();
    }
    else if (educationDetails.fromduration == "") {
      setShowAlert("Please Enter From Duration!");
      handleClickOpenerr();
    }
    else if (educationDetails.toduration == "") {
      setShowAlert("Please Select To Duration!");
      handleClickOpenerr();
    }


    else if (educationDetails !== "") {
      setEducationtodo([...educationtodo, educationDetails]);
      setEducationDetails({
        categoryedu: "",
        subcategoryedu: "",
        specialization: "",
        school: "",
        department: "",
        degree: "",
        fromduration: "",
        toduration: "",
        pursuing: false,
      });
    }
  };
  const educationTodoremove = (index) => {
    const newTasks = [...educationtodo];
    newTasks.splice(index, 1);
    setEducationtodo(newTasks);
  };

  const experienceTodo = () => {
    // if (
    //   experienceDetails.occupation == "" &&
    //   experienceDetails.company == "" &&
    //   experienceDetails.summary == ""
    // ) {
    //   setShowAlert("Please Enter Atleast one field!");
    //   handleClickOpenerr();
    // }
    if (experienceDetails.occupation == "") {
      setShowAlert("Please Enter Occupation / Title field!");
      handleClickOpenerr();
    } else if (experienceDetails.company == "") {
      setShowAlert("Please Enter Company!");
      handleClickOpenerr();
    }
    else if (experienceDetails.summary == "") {
      setShowAlert("Please Enter Summary field!");
      handleClickOpenerr();
    }
    else if (experienceDetails.fromduration == "") {
      setShowAlert("Please Enter From Duration!");
      handleClickOpenerr();
    }
    else if (experienceDetails.toduration == "") {
      setShowAlert("Please Select To Duration!");
      handleClickOpenerr();
    }
    else if (experienceDetails !== "") {
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

  const [resumefiles, setResumeFiles] = useState([]);

  const handleValidationfirstname = (e) => {
    let val = e.target.value;
    let numbers = new RegExp('[0-9]')
    var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (e.target.value.match(numbers)) {
      setShowAlert("Please enter characters only! (A-Z or a-z)")
      handleClickOpenerr();
      let num = val.length;
      let value = val.slice(0, num - 1)
      setAddcandidate((prevState) => {
        return { ...prevState, firstname: value };
      })
    }
    else if (regExSpecialChar.test(e.target.value)) {
      setShowAlert("Please enter characters only! (A-Z or a-z)")
      handleClickOpenerr();
      let num = val.length;
      let value = val.slice(0, num - 1)
      setAddcandidate((prevState) => {
        return { ...prevState, firstname: value };
      })
    }

  }

  const handleValidationlastname = (e) => {
    let val = e.target.value;
    let numbers = new RegExp('[0-9]')
    var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (e.target.value.match(numbers)) {
      setShowAlert("Please enter characters only! (A-Z or a-z)")
      handleClickOpenerr();
      let num = val.length;
      let value = val.slice(0, num - 1)
      setAddcandidate((prevState) => {
        return { ...prevState, lastname: value };
      })
    }
    else if (regExSpecialChar.test(e.target.value)) {
      setShowAlert("Please enter characters only! (A-Z or a-z)")
      handleClickOpenerr();
      let num = val.length;
      let value = val.slice(0, num - 1)
      setAddcandidate((prevState) => {
        return { ...prevState, lastname: value };
      })
    }

  }

  let newval = "VISIT#0001";
  const [addcandidate, setAddcandidate] = useState({
    role: "",
    prefix: "Mr",
    firstname: "",
    lastname: "",
    gender: "",
    recruitmentname: "Please Select Role",
    email: "",
    mobile: "",
    whatsapp: "",
    website: "",
    street: "",
    uploadedimage: "",
    jobopeningsid: "",
    city: "",
    state: "",
    postalcode: "",
    country: "",
    experience: "",
    qualification: "MCA",
    currentjobtitle: "",
    currentemployer: "",
    expectedsalary: "",
    currentsalary: "",
    skillset: "",
    additionalinfo: "",
    linkedinid: "",
    // status: "New", source: "Added by User",
    sourcecandidate: "Walk-in",
    educationdetails: "",
    experiencedetails: "",
    resumefile: "",
    coverletterfile: "",
    experienceletterfile: "",
    phonecheck: false,
    dateofbirth: "",
    age: "",
    skill: [],
  });

  const getPhoneNumber = () => {
    if (addcandidate.phonecheck) {
      setAddcandidate({ ...addcandidate, whatsapp: addcandidate.mobile })
    } else {
      setAddcandidate({ ...addcandidate, whatsapp: "" })
    }
  }

  useEffect(
    () => {
      getPhoneNumber();
    }, [addcandidate.phonecheck]
  )
  const [skill, setSkill] = useState([]);
  const [jobopen, setJobopen] = useState([]);

  const fetchAllSkill = async () => {
    try {
      let res_queue = await axios.get(SERVICE.SKILLSET);
      setSkill(
        res_queue?.data?.skillsets?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        }))
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something 5  went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const [filterdJobCandidates, setFilteredJobCandidates] = useState([]);
  const [jobcandidateid, setJobcandidateid] = useState("");

  const fetchAllJobeopenings = async () => {

    const resalldata = await axios.post(SERVICE.JOB_OPEN_CANDIDATE_REGISTER, {
      // headers: {
      //     'Authorization': `Bearer ${auth.APIToken}`
      // },

      company: addcandidate.company,
      branch: addcandidate.branch,


    });

    let filteruser = resalldata.data.jobopenings.map(d => ({
      ...d,
      label: d.recruitmentname,
      value: d.recruitmentname,
      id: d._id
    }))
    setFilteredJobCandidates(filteruser);
  }


  useEffect(() => {
    fetchAllSkill();
  }, []);
  useEffect(() => {
    fetchAllJobeopenings()
  }, [addcandidate]);

  const [selectedskill, setSelectedSkill] = useState([]);
  let [valueCate, setValueCate] = useState([]);

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
      : "Please select Skill";
  };

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const formatDateString = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // const username = isUserRoleAccess.username;

  const handleMobile = (e) => {
    if (e.length > 10) {
      setShowAlert("Mobile number can't more than 10 characters!")
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setAddcandidate({ ...addcandidate, mobile: num });
    }
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setButtonLoad(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [isAddOpenalert, setAddOpenalert] = useState(false);

  let name = "create";
  let nameedit = "edit";
  let allUploadedFiles = [];
  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const stepOne = () => {
    if (addcandidate.recruitmentname === "Please Select Role" || addcandidate.recruitmentname == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Role"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.firstname == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter First Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.lastname == "") {
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
    }
    else if (addcandidate.gender == "") {
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
    }
    else if (addcandidate.email == "") {
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
    }
    else if (!isValidEmail(addcandidate.email) && addcandidate.email != "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter  Valid Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.mobile == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Mobile Number!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (String(addcandidate.mobile).length != 10) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Mobile No!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.whatsapp == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Whatsapp Number !"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (String(addcandidate.whatsapp).length != 10) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Whatsapp No !"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (addcandidate.age == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Age"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.dateofbirth == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date of Birth"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      nextStep();
    }
  };

  const stepTwo = () => {
    if (addcandidate.street == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Street"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedCity == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter City"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedState == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select State"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.postalcode == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Postal Code"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.postalcode !== "" && addcandidate.postalcode.length < 6) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Postal Code"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedCountry == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Country!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (addcandidate.aaadharnumber === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Aadhar Number  !"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (addcandidate.aaadharnumber !== "" && addcandidate.aaadharnumber.length < 12) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Aadhaar Number!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }


    else if (addcandidate.pannumber == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Pan Number "}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.pannumber !== "" && addcandidate.pannumber.length < 10) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid PAN Number "}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else {
      nextStep();
    }
  };
  const stepThree = () => {
    if (selectedskill.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Skill Set Known"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.experience == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Experience in Years"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (addcandidate.qualification == "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Highest Qualification "}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (addcandidate.currentjobtitle == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Current Job title"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (addcandidate.currentemployer == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Current Employer!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (addcandidate.expectedsalary == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Expected Salary!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }


    else if (addcandidate.currentsalary == "") {
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
    }
    else if (addcandidate.skillset == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Skill Set"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addcandidate.additionalinfo == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Additional Info"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (addcandidate.sourcecandidate == "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Enter How Did You Know As"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (addcandidate.linkedinid == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Linkedin Id"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else {
      nextStep();
    }
  };
  const stepFour = () => {
    nextStep();
  };

  const [step, setStep] = useState(1);
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  const id = useParams().id;



  const getviewCode = async () => {
    try {
      if (id) {
        let res = await axios.post(`${SERVICE.VISITORS_GETUNIQUEIDDATA}`, {
          id: id
        });
        if (res.data.scandidates.length > 0) {
          setAddcandidate({
            ...res.data.scandidates[0],
            role: "",

            isDisable: false,
            recruitmentname: "Please Select Role",
            prefix: res.data.scandidates[0].prefix,
            firstname: res.data.scandidates[0].visitorfirstname,
            lastname: res.data.scandidates[0].visitorlastname,
            email: res.data.scandidates[0].visitoremail,
            mobile: res.data.scandidates[0].visitorcontactnumber,
            phonecheck: res.data.scandidates[0].visitorphonecheck,
            whatsapp: res.data.scandidates[0].visitorwhatsapp,
            uploadedimage: res.data.scandidates[0]?.files[0]?.preview,

            website: "",
            street: "",
            city: "",
            state: "",
            postalcode: "",
            country: "",
            gender: "",
            experience: "",
            qualification: "MCA",
            currentjobtitle: "",
            currentemployer: "",
            expectedsalary: "",
            currentsalary: "",
            skillset: "",
            additionalinfo: "",
            linkedinid: "",
            // status: "New", source: "Added by User",
            sourcecandidate: "Walk-in",
            educationdetails: "",
            experiencedetails: "",
            resumefile: "",
            coverletterfile: "",
            experienceletterfile: "",
            dateofbirth: "",
            age: "",
            skill: [],
            aaadharnumber: "",
            pannumber: "",
            isDisable: true
          });

        } else {
          setAddcandidate({
            role: "",
            prefix: "Mr",
            firstname: "",
            isDisable: false,
            lastname: "",
            company: "",
            gender: "",
            branch: "",
            recruitmentname: "Please Select Role",
            email: "",
            mobile: "",
            phonecheck: false,
            whatsapp: "",
            website: "",
            street: "",
            city: "",
            state: "",
            postalcode: "",
            country: "",
            experience: "",
            qualification: "MCA",
            currentjobtitle: "",
            currentemployer: "",
            expectedsalary: "",
            currentsalary: "",
            skillset: "",
            additionalinfo: "",
            linkedinid: "",
            // status: "New", source: "Added by User",
            sourcecandidate: "Walk-in",
            educationdetails: "",
            experiencedetails: "",
            resumefile: "",
            coverletterfile: "",
            experienceletterfile: "",
            dateofbirth: "",
            age: "",
            aaadharnumber: "",
            pannumber: "",
            skill: [],
          })
        }

      } else {
        setAddcandidate({
          role: "",
          prefix: "Mr",
          isDisable: false,
          recruitmentname: "Please Select Role",
          firstname: "",
          lastname: "",
          email: "",
          mobile: "",
          company: "",
          gender: "",
          branch: "",
          phonecheck: false,
          whatsapp: "",
          website: "",
          street: "",
          city: "",
          state: "",
          postalcode: "",
          country: "",
          experience: "",
          qualification: "MCA",
          currentjobtitle: "",
          currentemployer: "",
          expectedsalary: "",
          currentsalary: "",
          skillset: "",
          additionalinfo: "",
          linkedinid: "",
          // status: "New", source: "Added by User",
          sourcecandidate: "Walk-in",
          educationdetails: "",
          experiencedetails: "",
          resumefile: "",
          coverletterfile: "",
          experienceletterfile: "",
          dateofbirth: "",
          age: "",
          aaadharnumber: "",
          pannumber: "",
          skill: [],
        })
      }

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  useEffect(() => {
    getviewCode();
  }, [id]);


  const [queueCheck, setQueueCheck] = useState(false);
  const [coverletter, setCoverletter] = useState([]);
  const [experienceletter, setExperienceletter] = useState([]);


  const sendRequest = async () => {
    try {
      let res_queue = await axios.post(`${SERVICE.CANDIDATES_CREATE}`, {
        // let res_queue = await axios.post(SERVICE.CANDIDATES_CREATE, {
        role: String(addcandidate.recruitmentname),
        prefix: String(addcandidate.prefix),
        firstname: String(addcandidate.firstname),
        gender: String(addcandidate.gender),
        status: "New",
        overallstatus: "Applied",

        lastname: String(addcandidate.lastname),
        fullname: String(addcandidate.firstname + " " + addcandidate.lastname),
        email: String(addcandidate.email),
        mobile: Number(addcandidate.mobile),
        whatsapp: Number(addcandidate.whatsapp),
        phonecheck: Boolean(addcandidate.phonecheck),
        adharnumber: Number(addcandidate.aaadharnumber),
        pannumber: Number(addcandidate.pannumber),
        age: Number(addcandidate.age),
        jobopeningsid: String(addcandidate.jobopeningsid),
        dateofbirth: String(addcandidate.dateofbirth),
        street: String(addcandidate.street),
        country: String(selectedCountry?.name),
        state: String(selectedState?.name),
        city: String(selectedCity?.name),
        postalcode: Number(addcandidate.postalcode),
        experience: String(addcandidate.experience),
        qualification: String([addcandidate.qualification]),
        currentjobtitle: String(addcandidate.currentjobtitle),
        currentemployer: String(addcandidate.currentemployer),
        expectedsalary: String(addcandidate.expectedsalary),
        currentsalary: String(addcandidate.currentsalary),
        skillset: String(addcandidate.skillset),
        sourcecandidate: String(addcandidate.sourcecandidate),
        additionalinfo: String(addcandidate.additionalinfo),
        linkedinid: String(addcandidate.linkedinid),
        expectedsalaryopts: "",
        joiningbydaysopts: "",
        source: "",
        uploadedimage: String(addcandidate.uploadedimage),
        resumefile: selectedFile,
        coverletterfile: selectedFileone,
        experienceletterfile: selectedFiletwo,
        educationdetails: educationtodo,
        experiencedetails: experiencetodo,
        skill: valueCate,
        addedby: [
          {
            name: String(addcandidate.firstname),
            date: String(new Date()),
          },
        ],
      });

      setQueueCheck(true);

      // setAddcandidate({

      //   prefix: "Mr",
      //   firstname: "",
      //   lastname: "",
      //   email: "",
      //   mobile: "",
      //   whatsapp: "",
      //   website: "",
      //   street: "",
      //   city: "",
      //   state: "",
      //   postalcode: "",
      //   country: "",
      //   experience: "",
      //   qualification: "MCA",
      //   currentjobtitle: "",
      //   currentemployer: "",
      //   expectedsalary: "",
      //   currentsalary: "",
      //   skillset: "",
      //   sourcecandidate: "Walk-in",
      //   additionalinfo: "",
      //   linkedinid: "",
      //   status: "New",
      //   source: "Added by User",
      //   educationdetails: "",
      //   experiencedetails: "",
      //   resumefile: "",
      //   coverletterfile: "",
      //   experienceletterfile: "",
      // });
      // setEducationtodo([]);
      // setExperiencetodo([]);
      // setExperienceletter([]);
      // setCoverletter([]);
      // setResumeFiles([]);
      // setEducationDetails({
      //   school: "",
      //   department: "",
      //   degree: "",
      //   fromduration: "",
      //   toduration: "",
      //   pursuing: false,
      // });
      // setExperienceDetails({
      //   occupation: "",
      //   company: "",
      //   summary: "",
      //   fromduration: "",
      //   toduration: "",
      //   currentlyworkhere: false,
      // });

      // setTimeout(() => {
      //   setShowAlert("Added Successfully");
      //   handleClickOpenerr();
      // }, 2000)
      setDeletealert(true);
      setTimeout(() => {
        setDeletealert(false);
      }, 1000)
      setTimeout(() => {
        backPage(`/Checkinvisitor/${addcandidate.company}/${addcandidate.branch}`)
        // window.location.href = `/Checkinvisitor/${addcandidate.company}/${addcandidate.branch}`;
      }, 2000)

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert({ messages });
        handleClickOpenerr();
      } else {
        setShowAlert("something 1  went wrong!");
        handleClickOpenerr();
      }
    }
  };

  const handleSubmit = () => {
    if (selectedFile.length == 0) {
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
    }
    else {
      sendRequest()
    }

  }

  const renderStepOne = () => {
    return (
      <>
        <Box>
          {/* <Typography sx={userStyle.heading}>Basic Registration</Typography> */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ color: "#171A1C", fontWeight: 700, fontFamily: "JostMedium", fontSize: { md: "25px", sm: "25px", xs: "22px" } }}>Basic Registration</Typography>
          </Box>
          <br />
          <Grid container spacing={2} >
            <Grid item lg={10} md={10} xs={12} sm={12}>


              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Role</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={filterdJobCandidates}
                      value={{
                        label: addcandidate.recruitmentname,
                        value: addcandidate.recruitmentname,


                      }}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          recruitmentname: e.value,
                          jobopeningsid: e.id
                        });

                      }}
                      sx={{
                        backgroundColor: "#E3E3E3",
                      }}
                    ></Selects>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid
                  item
                  lg={12}
                  md={12}
                  xs={12}
                  sm={12}
                  sx={{ display: "flex" }}
                >
                  <Grid item lg={12} md={11} xs={12} sm={12}>
                    <Typography
                      sx={{
                        color: "black",
                        fontFamily: " JostMedium",
                        fontsize: "30px",
                      }}
                    >
                      {" "}
                      <b>First Name</b> <b style={{ color: "red" }}>*</b>:&emsp;
                    </Typography>
                    <Grid container>
                      <Grid item md={3} sm={3} xs={3}>
                        <FormControl size="small" fullWidth>
                          <Select
                            placeholder="Mr."
                            value={addcandidate.prefix}
                            disabled={addcandidate.isDisable}
                            onChange={(e) => {
                              setAddcandidate({
                                ...addcandidate,
                                prefix: e.target.value,
                              });
                            }}
                            sx={{
                              backgroundColor: "#E3E3E3",
                            }}
                          >
                            <MenuItem value="Mr">Mr</MenuItem>
                            <MenuItem value="Ms">Ms</MenuItem>
                            <MenuItem value="Mrs">Mrs</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={8} sm={9} xs={9}>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            style={{
                              backgroundColor: "#E3E3E3", // Background color
                            }}
                            disabled={addcandidate.isDisable}
                            value={addcandidate.firstname}
                            onChange={(e) => {
                              setAddcandidate({
                                ...addcandidate,
                                firstname: e.target.value,
                              });
                              handleValidationfirstname(e)
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Last Name</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="text"
                      disabled={addcandidate.isDisable}
                      value={addcandidate.lastname}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          lastname: e.target.value,
                        });
                        handleValidationlastname(e)
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Gender</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Email</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="email"
                      disabled={addcandidate.isDisable}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Mobile</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="number"
                      disabled={addcandidate.isDisable}
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
                </Grid>
                <br />
              </Grid>
              <Grid
                sx={useraccessStyle.containercontentdisplay}
                style={{ marginTop: "15px" }}
              >
                <Grid
                  item
                  lg={3}
                  md={3}
                  xs={12}
                  sm={12}
                  sx={{ textAlign: "right" }}
                ></Grid>
                <Grid
                  item
                  lg={9}
                  md={9}
                  xs={12}
                  sm={12}
                  sx={{ marginRight: "40px" }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{}}
                          checked={addcandidate.phonecheck}
                          disabled={addcandidate.isDisable}
                          onChange={(e) =>
                            setAddcandidate({
                              ...addcandidate,
                              phonecheck: !addcandidate.phonecheck,
                            })
                          }
                        />
                      }
                      label="Same as Whatsapp number"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontFamily: " JostMedium",
                          color: "black",
                          fontsize: "30px", // Change this value to adjust the font size
                        },
                      }}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid
                sx={useraccessStyle.containercontentdisplay}
                style={{ marginTop: "15px" }}
              >
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Whatsapp</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="number"
                      disabled={addcandidate.isDisable}
                      value={addcandidate.whatsapp}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          whatsapp: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Age</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="number"
                      value={addcandidate.age}
                      onChange={(e) => {
                        if (e.target.value.length < 4) {
                          setAddcandidate({
                            ...addcandidate,
                            age: e.target.value,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Date of Birth</b> <b style={{ color: "red" }}>*</b>
                    :&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="date"
                      value={addcandidate.dateofbirth}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          dateofbirth: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>


            <Grid item lg={10} md={10} xs={12} sm={12} sx={userStyle.next}>
              <Button
                // className="next"
                size="small"
                variant="contained"
                sx={{ ...userStyle.nextbutton, width: "100px", marginRight: 0 }}
                onClick={() => { stepOne() }}
              >
                <b>Next</b> &emsp;
                <EastIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
              </Button>
            </Grid>
            <Grid container sx={{ justifyContent: "center", alignItems: "center" }} marginTop={2}>
              <Footer />
            </Grid>

          </Grid>
        </Box>
      </>
    );
  };
  const renderStepTwo = () => {
    return (
      <>
        <Box>
          <Typography sx={userStyle.heading}>Address Information</Typography>
          <br />
          <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
            <Grid item lg={10} md={10} xs={12} sm={12}>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Street</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>

              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Country</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  {/* <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
                  </FormControl> */}
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
                          setSelectedState("");
                          setSelectedCity("")
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> State</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  {/* <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
                  </FormControl> */}
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
                          setSelectedCity("")
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> City</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  {/* <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
                  </FormControl> */}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Postal code</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Aadhar number</b> <b style={{ color: "red" }}>*</b>
                    :&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="number"
                      value={addcandidate.aaadharnumber}
                      onChange={(e) => {
                        if (e.target.value.length < 13) {
                          setAddcandidate({
                            ...addcandidate,
                            aaadharnumber: e.target.value,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Pan Number</b> <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
            </Grid>
            <Grid item lg={10} md={10} xs={10} sm={10} marginTop={2} sx={{ display: "flex", justifyContent: { xs: "end", md: "space-between", lg: "space-between", sm: "space-around" } }}>
              <Button
                variant="contained"
                size="small"
                onClick={prevStep}
              >
                {" "}
                <WestIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
                &emsp; <b>Previous</b>
              </Button>
              &emsp;&emsp;
              <Button
                // className="next"
                variant="contained"
                // sx={userStyle.nextbutton}
                color="primary"
                onClick={stepTwo}
              >
                <b>Next</b> &emsp;
                <EastIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
              </Button>
            </Grid>



            <Grid
              item
              sx={{
                alignItems: "center",
                marginTop: "10px",
                justifyContent: "center",
                marginLeft: "180px",
                "@media (max-width: 400px)": {
                  marginLeft: "0", // Override marginLeft for small screens
                },
              }}
            >
              <Footer />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  const renderStepThree = () => {
    return (
      <>
        <Box>
          <Typography sx={userStyle.heading}>Professional Details</Typography>
          <br />
          <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
            <Grid item lg={10} md={10} xs={12} sm={12}>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Typography
                  sx={{
                    color: "black",
                    fontFamily: " JostMedium",
                    fontsize: "30px",
                  }}
                >
                  {" "}
                  <b> Skill set known</b>
                  <b style={{ color: "red" }}>*</b>
                  {/* :&emsp; */}
                </Typography>

                {/* <Grid item lg={11} md={11} xs={12} sm={12}> */}
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    options={skill}
                    value={selectedskill}
                    onChange={handleSkilChange}
                    valueRenderer={renderValueSkill}
                    labelledBy="Please Select Category"
                  />
                </FormControl>
                {/* </Grid> */}
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Experience in Years</b> <b style={{ color: "red" }}>*</b>
                    :&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      sx={userStyle.input}
                      id="component-outlined"
                      type="number"
                      value={addcandidate.experience}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          experience: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Highest Qualification held</b>{" "}
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>

                  <FormControl size="small" fullWidth>
                    <Select
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      placeholder="Please Select"
                      value={addcandidate.qualification}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          qualification: e.target.value,
                        });
                      }}
                    >
                      {/* {qualificationOption?.map((option) => (
                                          <MenuItem key={option.value} value={option.value}>
                                              {option.label}
                                          </MenuItem>
                                      ))} */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Current Job title</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Current Employer</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Expected Salary</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="number"
                      value={addcandidate.expectedsalary}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          expectedsalary: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Current Salary</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      id="component-outlined"
                      type="number"
                      value={addcandidate.currentsalary}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          currentsalary: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography
                      sx={{
                        color: "black",
                        fontFamily: " JostMedium",
                        fontsize: "30px",
                      }}
                    >
                      {" "}
                      <b> Skill set</b>
                      <b style={{ color: "red" }}>*</b>:&emsp;
                    </Typography>
                    <TextareaAutosize
                      id="component-outlined"
                      minRows={5}
                      value={addcandidate.skillset}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          skillset: e.target.value,
                        });
                      }}
                      style={{
                        backgroundColor: "#E3E3E3",
                        height: "40px",
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "60px",
                    }}
                  >
                    {" "}
                    <b>Additional Info</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <TextareaAutosize
                      id="component-outlined"
                      minRows={5}
                      value={addcandidate.additionalinfo}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          additionalinfo: e.target.value,
                        });
                      }}
                      style={{
                        backgroundColor: "#E3E3E3",
                        height: "40px",
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> How Did You Know As</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      // options={sourcecandidateOption}
                      placeholder="Please Select"
                      value={addcandidate.sourcecandidate}
                      onChange={(e) => {
                        setAddcandidate({
                          ...addcandidate,
                          sourcecandidate: e.target.value,
                        });
                      }}
                      sx={{
                        backgroundColor: "#E3E3E3",
                      }}
                    >
                      {/* {sourcecandidateOption?.map((option) => (
                                          <MenuItem key={option.value} value={option.value}>
                                              {option.label}
                                          </MenuItem>
                                      ))} */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Linkedin Id</b>
                    <b style={{ color: "red" }}>*</b>:&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
            </Grid>
            <Grid item lg={10} md={10} xs={10} sm={10} marginTop={2} sx={{ display: "flex", justifyContent: { xs: "end", md: "space-between", lg: "space-between", sm: "space-around" } }}>
              <Button
                // className="next"
                variant="contained"
                size="small"
                // sx={userStyle.Previousbutton}
                onClick={prevStep}
              >
                {" "}
                <WestIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
                &emsp; <b>Previous</b>
              </Button>
              &emsp;&emsp;
              <Button
                // className="next"

                variant="contained"
                // sx={userStyle.nextbutton}
                color="primary"
                onClick={stepThree}
              >
                <b>Next</b> &emsp;
                <EastIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
              </Button>
            </Grid>
            <Grid
              item
              sx={{
                alignItems: "center",
                marginTop: "10px",
                justifyContent: "center",
                marginLeft: "180px",
                "@media (max-width: 400px)": {
                  marginLeft: "0", // Override marginLeft for small screens
                },
              }}
            >
              <Footer />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  const renderStepFour = () => {
    return (
      <>
        <Box>
          <Typography sx={userStyle.heading}>Education details</Typography>
          <br />
          <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
            <Grid item lg={10} md={10} xs={12} sm={12}>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Institute / School</b>
                    {/* <b style={{ color: "red" }}>*</b> */}
                    :&emsp;
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b> Major / Department</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Degree</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid
                  item
                  lg={8}
                  md={9}
                  xs={12}
                  sm={12}
                  sx={{ display: "flex" }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Duration</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
                  <Typography sx={{ margin: "10px 10px 0 10px" }}>
                    To
                  </Typography>
                  <FormControl
                    size="small"
                    fullWidth
                    sx={{ marginTop: "-25px" }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontFamily: " JostMedium",
                        fontsize: "30px",
                      }}
                    >
                      {" "}
                      &nbsp;
                    </Typography>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplaycheck}>
                <Grid item lg={8} md={4} xs={2} sm={2}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Currently pursuing</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
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
              <Grid
                sx={{
                  marginLeft: "30vw",
                  marginTop: "20px",
                  "@media only screen and (max-width: 500px)": {
                    marginLeft: "25vw",
                  },
                  "@media only screen and (max-width: 350px)": {
                    marginLeft: "15vw",
                  },
                }}
              >
                <Grid item md={10} sm={12} xs={12}>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "capitalize",
                      "@media only screen and (max-width: 500px)": {
                        fontSize: "13px",
                      },
                    }}
                    onClick={educationTodo}
                  >
                    <AddIcon />
                    &nbsp; Add Education Details
                  </Button>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplaytable}>
                <Grid item md={12} sm={12} xs={12}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 650, border: "2px solid #8cc1db" }}
                      aria-label="simple table"
                      id="usertable"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              SNo
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              School
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Department
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Degree
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Duration
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Pursuing
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Action
                            </b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody align="left">
                        {educationtodo?.length > 0 ? (
                          educationtodo?.map((row, index) => (
                            <TableRow>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.school}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.department}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.degree}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.fromduration + " to " + row.toduration}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.pursuing ? "true" : "false"}
                              </TableCell>
                              <TableCell>
                                <CloseIcon
                                  sx={{ color: "red", cursor: "pointer" }}
                                  onClick={() => {
                                    educationTodoremove(index);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            {" "}
                            <TableCell colSpan={8} align="center">
                              No Data Available
                            </TableCell>{" "}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={10} md={10} xs={10} sm={10} marginTop={2} sx={{ display: "flex", justifyContent: { xs: "end", md: "space-between", lg: "space-between", sm: "space-around" } }}>
              <Button
                // className="next"
                size="small"
                variant="contained"
                // sx={userStyle.Previousbutton}
                onClick={prevStep}
              >
                {" "}
                <WestIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
                &emsp; <b>Previous</b>
              </Button>
              &emsp;&emsp;
              <Button
                // className="next"
                variant="contained"
                // sx={userStyle.nextbutton}
                onClick={stepFour}
              >
                <b>Next</b> &emsp;
                <EastIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
              </Button>
            </Grid>
            <Grid
              item
              sx={{
                alignItems: "center",
                marginTop: "10px",
                justifyContent: "center",
                marginLeft: "180px",
                "@media (max-width: 400px)": {
                  marginLeft: "0", // Override marginLeft for small screens
                },
              }}
            >
              <Footer />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  const renderStepFive = () => {
    return (
      <>
        <Box>
          <Typography sx={userStyle.heading}>Experience Details</Typography>
          <br />
          <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
            <Grid item lg={10} md={10} xs={12} sm={12}>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Occupation / Title</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Company</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid item lg={11} md={11} xs={12} sm={12}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Summary</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplay}>
                <Grid
                  item
                  lg={11}
                  md={11}
                  xs={12}
                  sm={12}
                  sx={{ display: "flex" }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>Work Duration</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
                  <Typography sx={{ margin: "10px 10px 0 10px" }}>
                    To
                  </Typography>
                  <FormControl
                    size="small"
                    fullWidth
                    sx={{ marginTop: "-25px" }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontFamily: " JostMedium",
                        fontsize: "30px",
                      }}
                    >
                      {" "}
                      &nbsp;
                    </Typography>
                    <OutlinedInput
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
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
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplaycheck}>
                <Grid item lg={8} md={4} xs={2} sm={2}>
                  <Typography
                    sx={{
                      color: "black",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    <b>I Currently Work here</b>
                    {/* <b style={{ color: "red" }}>*</b>:&emsp; */}
                  </Typography>
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
              <Grid
                sx={{
                  marginLeft: "30vw",
                  marginTop: "20px",
                  "@media only screen and (max-width: 500px)": {
                    marginLeft: "25vw",
                  },
                  "@media only screen and (max-width: 350px)": {
                    marginLeft: "15vw",
                  },
                }}
              >
                <Grid item md={10} sm={12} xs={12}>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "capitalize",
                      "@media only screen and (max-width: 500px)": {
                        fontSize: "13px",
                      },
                    }}
                    onClick={experienceTodo}
                  >
                    <AddIcon />
                    &nbsp; Add Experience Details
                  </Button>
                </Grid>
              </Grid>
              <Grid sx={useraccessStyle.containercontentdisplaytable}>
                <Grid item md={12} sm={12} xs={12}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 650, border: "2px solid #8cc1db" }}
                      aria-label="simple table"
                      id="usertable"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              SNo
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Occupation
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Company
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Summay
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Work Duration
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Work Here
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRight: "2px solid #8cc1db",
                              borderBottom: "2px solid #8cc1db",
                            }}
                          >
                            <b
                              style={{
                                color: "#5756a2",
                                fontFamily: "JostMedium",
                              }}
                            >
                              Action
                            </b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody align="left">
                        {experiencetodo?.length > 0 ? (
                          experiencetodo?.map((row, index) => (
                            <TableRow>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.occupation}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.company}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.summary}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.fromduration + " to " + row.toduration}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                {row.currentlyworkhere ? "true" : "false"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: "2px solid #8cc1db",
                                  borderBottom: "2px solid #8cc1db",
                                }}
                              >
                                <CloseIcon
                                  sx={{ color: "red", cursor: "pointer" }}
                                  onClick={() => {
                                    experienceTodoremove(index);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            {" "}
                            <TableCell colSpan={8} align="center">
                              No Data Available
                            </TableCell>{" "}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <br />
              <Box
                sx={{
                  display: "flex",
                  marginLeft: "80px",
                  justifyContent: "start",
                  "@media only screen and (max-width:550px)": {
                    flexDirection: "column",
                  },
                }}
              ></Box>

              <Box sx={useraccessStyle.containercontentdisplaytable}>
                <Grid container spacing={2}>
                  <Grid item md={0.5} sm={0.5} lg={0.5}></Grid>
                  <Grid item md={10} sm={10} lg={10}>
                    <Typography
                      style={{
                        color: "black",
                        fontFamily: "JostMedium",
                        fontSize: "20px",
                      }}
                    >
                      Resume <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Box
                      sx={{
                        border: "0.5px dashed #50B2FA",

                        backgroundColor: "#D2E7F7",
                        borderRadius: "10px",
                        justifyContent: "center",
                        padding: "20px",
                        // marginTop: "20px",
                        // marginBottom: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "180px",
                      }}
                    >
                      <Box sx={{ padding: "8px" }}>
                        <img src={uploadfile} alt="Upload Icon" />{" "}
                        {/* Ensure to add alt text for accessibility */}
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item md={4} >
                              <Button
                                variant="outlined"
                                size="small"
                                component="label"
                                sx={{
                                  color: "black",
                                  backgroundColor: "#E3E3E3",
                                  bordercolor: "black",
                                  fontFamily: "inherit",
                                  fontWeight: "bold",
                                  "&:hover": {
                                    backgroundColor: "#CCCCCC", // Example hover color
                                  },
                                  "@media only screen and (max-width:550px)": {
                                    marginY: "5px",
                                  },
                                }}
                              >
                                Choose File
                                <input
                                  type="file"
                                  id="resume"
                                  accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                  name="file"
                                  hidden
                                  onChange={handleResumeUpload}
                                />
                              </Button>

                            </Grid>
                            <Grid item md={8} >
                              <Box>
                                {selectedFile?.length > 0 &&
                                  selectedFile.map((file, index) => (
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
                                            onClick={() => handleDeleteFileDocument(index)}
                                          >
                                            <DeleteIcon />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </>
                                  ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                        {/* <Typography
                          sx={{
                            marginLeft: "5px",
                            marginTop: "9px",
                            fontWeight: "bold",
                            fontsize: "2px",
                          }}
                        > */}
                        {/* {selectedFile ? selectedFile.name : "No file chosen"}
                          <input
                            type="file"
                            id="resume"
                            accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                            name="file"
                            style={{ display: "none" }}
                          />
                        </Typography>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={handleDeleteFileDocument}
                        >
                          <FaTrash
                            style={{
                              fontSize: "medium",
                              color: "#a73131",
                            }}
                          />
                        </Button> */}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={1} sm={1} lg={1}></Grid>
                </Grid>
              </Box>


              <Box sx={useraccessStyle.containercontentdisplaytable}>
                <Grid container spacing={2}>
                  <Grid item md={0.5} sm={0.5} lg={0.5}></Grid>
                  <Grid item md={10} sm={10} lg={10}>
                    <Typography
                      style={{
                        color: "black",
                        fontFamily: "JostMedium",
                        fontSize: "20px",
                      }}
                    >
                      Experience letter
                      {/* <b style={{ color: "red" }}>*</b> */}
                    </Typography>
                    <Box
                      sx={{
                        border: "0.5px dashed #50B2FA",

                        backgroundColor: "#D2E7F7",
                        borderRadius: "10px",
                        justifyContent: "center",
                        padding: "20px",
                        // marginTop: "20px",
                        // marginBottom: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "180px",
                      }}
                    >
                      <Box sx={{ padding: "8px" }}>
                        <img src={uploadfile} alt="Upload Icon" />{" "}
                        {/* Ensure to add alt text for accessibility */}
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item md={4} >
                              <Button
                                variant="outlined"
                                size="small"
                                component="label"
                                sx={{
                                  color: "black",
                                  backgroundColor: "#E3E3E3",
                                  bordercolor: "black",
                                  fontFamily: "inherit",
                                  fontWeight: "bold",
                                  "&:hover": {
                                    backgroundColor: "#CCCCCC", // Example hover color
                                  },
                                  "@media only screen and (max-width:550px)": {
                                    marginY: "5px",
                                  },
                                }}
                              >
                                Choose File
                                <input
                                  type="file"
                                  id="resume"
                                  accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                  name="file"
                                  hidden
                                  onChange={handleResumeUploadone}
                                />
                              </Button>

                            </Grid>
                            <Grid item md={8} >
                              <Box>
                                {selectedFileone?.length > 0 &&
                                  selectedFileone.map((file, index) => (
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
                                            onClick={() => handleDeleteFileDocumentone(index)}
                                          >
                                            <DeleteIcon />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </>
                                  ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={1} sm={1} lg={1}></Grid>
                </Grid>
              </Box>
              <Box sx={useraccessStyle.containercontentdisplaytable}>
                <Grid container spacing={2}>
                  <Grid item md={0.5} sm={0.5} lg={0.5}></Grid>
                  <Grid item md={10} sm={10} lg={10}>
                    <Typography
                      style={{
                        color: "black",
                        fontFamily: "JostMedium",
                        fontSize: "20px",
                      }}
                    >
                      Cover letter
                      {/* <b style={{ color: "red" }}>*</b> */}
                    </Typography>
                    <Box
                      sx={{
                        border: "0.5px dashed #50B2FA",

                        backgroundColor: "#D2E7F7",
                        borderRadius: "10px",
                        justifyContent: "center",
                        padding: "20px",
                        // marginTop: "20px",
                        // marginBottom: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "180px",
                      }}
                    >
                      <Box sx={{ padding: "8px" }}>
                        <img src={uploadfile} alt="Upload Icon" />{" "}
                        {/* Ensure to add alt text for accessibility */}
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item md={4} >
                              <Button
                                variant="outlined"
                                size="small"
                                component="label"
                                sx={{
                                  color: "black",
                                  backgroundColor: "#E3E3E3",
                                  bordercolor: "black",
                                  fontFamily: "inherit",
                                  fontWeight: "bold",
                                  "&:hover": {
                                    backgroundColor: "#CCCCCC", // Example hover color
                                  },
                                  "@media only screen and (max-width:550px)": {
                                    marginY: "5px",
                                  },
                                }}
                              >
                                Choose File
                                <input
                                  type="file"
                                  id="resume"
                                  accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                  name="file"
                                  hidden
                                  onChange={handleResumeUploadtwo}
                                />
                              </Button>

                            </Grid>
                            <Grid item md={8} >
                              <Box>
                                {selectedFiletwo?.length > 0 &&
                                  selectedFiletwo.map((file, index) => (
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
                                            onClick={() => handleDeleteFileDocumenttwo(index)}
                                          >
                                            <DeleteIcon />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </>
                                  ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={1} sm={1} lg={1}></Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item lg={10} md={10} xs={10} sm={10} marginTop={2} sx={{ display: "flex", justifyContent: { xs: "end", md: "space-between", lg: "space-between", sm: "space-around" } }}>
              <Button
                // className="next"
                variant="contained"
                // sx={userStyle.Previousbutton}
                size="small"
                onClick={prevStep}
              >
                {" "}
                <WestIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
                &emsp; <b>Previous</b>
              </Button>
              &emsp;&emsp;
              <Button
                // className="next"
                variant="contained"
                // sx={userStyle.nextbutton}
                color="primary"
                onClick={handleSubmit}
              >
                <b>Submit</b> &emsp;
              </Button>
            </Grid>
            <Grid
              item
              sx={{
                alignItems: "center",
                marginTop: "10px",
                justifyContent: "center",
                marginLeft: "180px",
                "@media (max-width: 400px)": {
                  marginLeft: "0", // Override marginLeft for small screens
                },
              }}
            >
              <Footer />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  const [isMobile, setIsMobile] = useState(false);
  const [isMobile1, setIsMobile1] = useState(false);
  const [steperDisplay, setSteperDisplay] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // setIsMobile(window.innerWidth <= 900);
      // setIsMobile1(window.innerWidth <= 900);
      setSteperDisplay(window.innerWidth <= 900);
    };
    handleResize(); // Call the handleResize function once to set the initial state
    window.addEventListener("resize", handleResize); // Listen for window resize events
    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
    };
  }, []);

  const renderIndicator = () => {
    return (
      <Box>
        {steperDisplay ? (
          <Grid container spacing={2}>
            <>
              <Grid
                item
                lg={2.8}
                md={2.8}
                sm={12}
                xs={12}
                className="indicatorvertical"
                sx={{
                  height: "100%",
                  position: "relative",
                  top: "0",
                  flexDirection: "column",
                }}
              >
                <Grid item sx={{ marginTop: "50px" }}></Grid>
                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "80px",
                      width: "80px",
                    }}
                    // src={hilife}
                    src={overallSettings?.companylogo}
                  />
                </Grid>
                <Grid item sx={{ marginTop: "10px" }}></Grid>

                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontFamily: " JostMedium",
                      fontsize: "32px",
                    }}
                  >
                    {" "}
                    Candidate Registration{" "}
                  </Typography>
                </Grid>
                <Grid item sx={{ marginTop: "30px" }}></Grid>

                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ul style={{ marginLeft: "45px" }}>
                    <li
                    //  className={step === 1 ? "active" : null}
                    >
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 1 ? <img src={numberonenew} /> : null}
                        </Grid>
                        <Grid item>
                          {step === 1 ? (
                            <Typography
                              sx={{
                                fontFamily: " JostMedium",
                                fontsize: "32px",
                              }}
                            >
                              {" "}
                              Basic Information
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>

                      {/* <Grid
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid> */}
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 2 ? <img src={numbertwonew} /> : null}
                        </Grid>
                        <Grid item>
                          {step === 2 ? (
                            <Typography
                              sx={{
                                fontFamily: " JostMedium",
                                fontsize: "32px",
                              }}
                            >
                              {" "}
                              Address Information
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 3 ? <img src={numberthreenew} /> : null}
                        </Grid>
                        <Grid item>
                          {step === 3 ? (
                            <Typography
                              sx={{
                                fontFamily: " JostMedium",
                                fontsize: "32px",
                              }}
                            >
                              {" "}
                              Professional Details
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>
                      {/* <Grid
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid> */}
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 4 ? <img src={numberfournew} /> : null}
                        </Grid>
                        <Grid item>
                          {step === 4 ? (
                            <Typography
                              sx={{
                                fontFamily: " JostMedium",
                                fontsize: "32px",
                              }}
                            >
                              {" "}
                              Education details
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>

                      {/* <Grid
                          style={{
                            borderLeft: "2px dashed",
                            marginLeft: "16px",
                            height: "70px",
                          }}
                        ></Grid> */}
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          display: "flex",
                          flexDirection: "Row",
                          marginBottom: "10px",
                        }}
                      >
                        <Grid item>
                          {step === 5 ? <img src={numberfivenew} /> : null}
                        </Grid>
                        <Grid item>
                          {step === 5 ? (
                            <Typography
                              sx={{
                                fontFamily: " JostMedium",
                                fontsize: "32px",
                              }}
                            >
                              {" "}
                              Experience Details
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>
                    </li>
                  </ul>
                </Grid>
              </Grid>
              <Grid item lg={9.2} md={6} sm={12} xs={12}>
                {step === 1 ? renderStepOne() : null}
                {step === 2 ? renderStepTwo() : null}
                {step === 3 ? renderStepThree() : null}
                {step === 4 ? renderStepFour() : null}
                {step === 5 ? renderStepFive() : null}
              </Grid>
            </>
          </Grid>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid
                item
                lg={2.8}
                md={2.8}
                sm={12}
                xs={12}
                className="indicatorwebsite"
                sx={{
                  position: "sticky",
                  height: "100%",
                  top: "0",
                  flexDirection: "column",
                }}
              >
                <Grid item sx={{ marginTop: "50px" }}></Grid>
                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "158px",
                      width: "158px",
                    }}
                    // src={hilife}
                    src={overallSettings?.companylogo}
                  />
                </Grid>
                <Grid item sx={{ marginTop: "30px" }}></Grid>

                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontFamily: " JostMedium",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    Candidate Registration{" "}
                  </Typography>
                </Grid>
                <Grid item sx={{ marginTop: "70px" }}></Grid>

                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ul style={{ marginLeft: "45px" }}>
                    <li
                    //  className={step === 1 ? "active" : null}
                    >
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 1 ? (
                            <img src={numberonenew} />
                          ) : (
                            <img src={numberone} />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{
                              fontFamily: " JostMedium",
                              fontsize: "32px",
                            }}
                          >
                            {" "}
                            Basic Information
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 2 ? (
                            <img src={numbertwonew} />
                          ) : (
                            <img src={numbertwo} />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{
                              fontFamily: " JostMedium",
                              fontsize: "32px",
                            }}
                          >
                            {" "}
                            Address Information
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 3 ? (
                            <img src={numberthreenew} />
                          ) : (
                            <img src={numberthree} />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{
                              fontFamily: " JostMedium",
                              fontsize: "32px",
                            }}
                          >
                            {" "}
                            Professional Details
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 4 ? (
                            <img src={numberfournew} />
                          ) : (
                            <img src={numberfour} />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{
                              fontFamily: " JostMedium",
                              fontsize: "32px",
                            }}
                          >
                            {" "}
                            Education details
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid>
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          display: "flex",
                          flexDirection: "Row",
                          marginBottom: "10px",
                        }}
                      >
                        <Grid item>
                          {step === 5 ? (
                            <img src={numberfivenew} />
                          ) : (
                            <img src={numberfive} />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{
                              fontFamily: " JostMedium",
                              fontsize: "32px",
                            }}
                          >
                            {" "}
                            Experience Details
                          </Typography>
                        </Grid>
                      </Grid>
                    </li>
                  </ul>
                </Grid>
              </Grid>

              <Grid item lg={9.2} md={6} sm={12} xs={12} >
                {step === 1 ? renderStepOne() : null}
                {step === 2 ? renderStepTwo() : null}
                {step === 3 ? renderStepThree() : null}
                {step === 4 ? renderStepFour() : null}
                {step === 5 ? renderStepFive() : null}
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    );
  };

  return (
    <>
      <GlobalStyles
        styles={{
          "@import":
            "url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap')",
          body: {
            fontFamily: "League Spartan, sans-serif",
          },
        }}
      />
      <>{renderIndicator()}</>
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        ></Dialog>
      </Box>

      <Box>
        {/* <Headtitle title={"ADD VISITORS"} /> */}

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
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Dialog
          open={isDeletealert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              padding: "37px 23px",
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
            <Typography variant="h6">
              <b>Added Successfully👍</b>
            </Typography>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
export default Addcandidates;