import React, { useState, useEffect, useContext } from "react";
import { userStyle, useraccessStyle } from "./visitorstyle.js";
import { GlobalStyles } from "@mui/material";
import Webcamimage from "../pages/asset/Webcameimageasset.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaPrint, FaFilePdf, FaTrash, FaPlus } from "react-icons/fa";
import Footer from "../components/footer/footer.js";
import "./visitors.css";
import newproj from "./images/newproject.png";
import hilife from "./images/+-removebg-preview-removebg-preview.png";
import uploadfile from "./images/upload.png";
import uploadconfetti from "./images/wired-flat-1103-confetti.gif";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router-dom";

import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel } from "react-icons/fa";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

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

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import pdfIcon from "./Assets/pdf-icon.png";
import wordIcon from "./Assets/word-icon.png";
import excelIcon from "./Assets/excel-icon.png";
import csvIcon from "./Assets/CSV.png";
import fileIcon from "./Assets/file-icons.png";
import logout from "./images/logout.png";
import moment from "moment-timezone";

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
import wave from "./images/waving.png";
import { SERVICE } from "../services/Baseservice";


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

function Checkoutaction() {

  const { company, branch } = useParams()

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [openviewedout, setOpenviewedout] = useState(false);
  const handleClickOpenviewedout = () => {
    setOpenviewedout(true);
    setTimeout(() => {
      // <a href={`/Checkinvisitor/${company}/${branch}`}> </a>

      backPage(`/Checkinvisitor/${company}/${branch}`)

    }, 3000)
    // setOpenviewedout(false);
  };
  const handleCloseviewedout = () => {
    setOpenviewedout(false);
  };


  const rows = [
    { sno: 1, date: "01/05/2024", name: "name1", intime: "07:24" },
    { sno: 2, date: "01/06/2024", name: "name1", intime: "07:24" },
    { sno: 3, date: "01/07/2024", name: "name1", intime: "07:24" },
    { sno: 4, date: "01/08/2024", name: "name1", intime: "07:24" },

  ]

  const [allvisitor, setAllVisitor] = useState([])



  const fetchAllVisitors = async () => {
    try {
      let res_vendor = await axios.post(SERVICE.ALL_VISITORS_CHECKOUT, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
        company: company,
        branch: branch
      });
      setAllVisitor(res_vendor?.data?.visitors);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        handleClickOpenerr();
      }
    }
  };



  useEffect(() => {
    fetchAllVisitors();
  }, [])


  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsDeleteOpenalert(true);
  };

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    webcamClose();
    setGetImg("");
  };
  const showWebcam = () => {
    webcamOpen();
  };
  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
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

  //reference images
  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImage(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        handleClickOpenalert();
      }
    }
  };
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const removeCapturedImage = (index) => {
    const newCapturedImages = [...capturedImages];
    newCapturedImages.splice(index, 1);
    setCapturedImages(newCapturedImages);
  };
  const resetImage = () => {
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    previewFile(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDrag];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFilesDrag.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageDrag(newSelectedFilesDrag);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        handleClickOpenalert();
      }
    }
  };
  const handleUploadOverAll = () => {
    setUploadPopupOpen(false);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...refImageDrag];
    newSelectedFiles.splice(index, 1);
    setRefImageDrag(newSelectedFiles);
  };

  const [buttonLoad, setButtonLoad] = useState(false);
  const [todosEdit, setTodosEdit] = useState([]);
  const classes = useStyles();
  const backPage = useNavigate();
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  // const handleClearImage = () => {
  //   setFile(null);
  //   setGetImg(null);
  //   setSelectedFile(null);
  //   setCroppedImage(null);
  //   setEmployee({ ...employee, profileimage: "" });
  // };

  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file object
  const [selectedFileone, setSelectedFileone] = useState(null); // State to store the selected file object
  const [selectedFiletwo, setSelectedFiletwo] = useState(null); // State to store the selected file object

  const handleDeleteFileDocument = (event) => {
    // Get the selected file
    setSelectedFile(""); // Update state with the selected file object
  };
  const handleDeleteFileDocumentone = (event) => {
    // Get the selected file
    setSelectedFileone(""); // Update state with the selected file object
  };
  const handleDeleteFileDocumenttwo = (event) => {
    // Get the selected file
    setSelectedFiletwo(""); // Update state with the selected file object
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    setSelectedFile(file); // Update state with the selected file object
  };
  const handleResumeUploadone = (event) => {
    const file = event.target.files[0]; // Get the selected file
    setSelectedFileone(file); // Update state with the selected file object
  };
  const handleResumeUploadtwo = (event) => {
    const file = event.target.files[0]; // Get the selected file
    setSelectedFiletwo(file); // Update state with the selected file object
  };

  const [educationDetails, setEducationDetails] = useState({
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
  const [jobopenening, setJobOpeing] = useState([]);

  const [selectedskill, setSelectedSkill] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleSkilChange = (options) => {
    setValueCate(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSkill(options);
  };

  const renderValueSkill = (valueCate, _skill) => {
    return valueCate.length
      ? valueCate?.map(({ label }) => label).join(", ")
      : "Please select Skill";
  };

  const educationTodo = () => {
    if (
      educationDetails.school == "" &&
      educationDetails.department == "" &&
      educationDetails.degree == ""
    ) {
      setShowAlert("Please Enter Atleast one field!");
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
      });
    }
  };
  const educationTodoremove = (index) => {
    const newTasks = [...educationtodo];
    newTasks.splice(index, 1);
    setEducationtodo(newTasks);
  };

  const experienceTodo = () => {
    if (
      experienceDetails.occupation == "" &&
      experienceDetails.company == "" &&
      experienceDetails.summary == ""
    ) {
      setShowAlert("Please Enter Atleast one field!");
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

  const [resumefiles, setResumeFiles] = useState([]);

  // const handleResumeUpload = (event) => {
  //   const resume = event.target.files;

  //   for (let i = 0; i < resume.length; i++) {
  //     const reader = new FileReader();
  //     const file = resume[i];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       setResumeFiles((prevFiles) => [
  //         ...prevFiles,
  //         {
  //           name: file.name,
  //           preview: reader.result,
  //           data: reader.result.split(",")[1],
  //           remark: "resume file",
  //         },
  //       ]);
  //     };
  //   }
  // };

  //   const renderFilePreview = async (file) => {
  //     const response = await fetch(file.preview);
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     window.open(link, "_blank");
  //   };
  const handleFileDelete = (index) => {
    setResumeFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
            remark: "experience letter",
          },
        ]);
      };
    }
  };

  const renderFilePreviewexp = async (file) => {
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

  let newval = "VISIT#0001";
  const [vendor, setVendor] = useState({
    visitortype: "Please Select Visitor Type",

    prefix: "",
    visitorname: "",
    visitorlastname: "",
    hostname: "",

    visitorpurpose: "",
    visitorcontactnumber: "",
    visitoremail: "",
  });
  const [cateCode, setCatCode] = useState([]);
  const [errors, setErrors] = useState({});
  const [vendorArray, setVendorArray] = useState([]);
  const [vendormaster, setVendormaster] = useState([]);
  
  const [vendorCheck, setVendorcheck] = useState(false);
  // Error Popup model
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
      let num = e.slice(0, 10);
      setVendor({ ...vendor, visitorcontactnumber: num });
    }
  };

  const handleChangeEdit = async (index, name, value, id) => {
    const updatedTodos = [...todosEdit];
    updatedTodos[index] = {
      ...updatedTodos[index],
      [name]: value,
    };
    setTodosEdit(updatedTodos);
    const updatedTodo = updatedTodos[index];
    if (
      updatedTodo.estimationtime !== "" &&
      updatedTodo.purchasedate &&
      updatedTodo.estimation !== ""
    ) {
      const currentDate = new Date(updatedTodo.purchasedate);
      let expiryDate = new Date(currentDate);

      if (updatedTodo.estimationtime === "Days") {
        expiryDate.setDate(
          currentDate.getDate() + parseInt(updatedTodo.estimation)
        );
      } else if (updatedTodo.estimationtime === "Month") {
        expiryDate.setMonth(
          currentDate.getMonth() + parseInt(updatedTodo.estimation)
        );
      } else if (updatedTodo.estimationtime === "Year") {
        expiryDate.setFullYear(
          currentDate.getFullYear() + parseInt(updatedTodo.estimation)
        );
      }
      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        warrantycalculation: formattedempty,
      };
      setTodosEdit(updatedTodosCopy);
    }
    const updatedTodovendor = updatedTodos[index];
    if (updatedTodovendor.vendor !== "" && id) {
      // const res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });
      const updatedTodosCopy = [...updatedTodos];
      // updatedTodosCopy[index] = {
      //   ...updatedTodosCopy[index],
      //   address: res?.data?.svendordetails.address,
      //   phonenumber: res?.data?.svendordetails.phonenumber,
      // };
      setTodosEdit(updatedTodosCopy);
    }
  };
  const handleDeleteEdit = (index) => {
    const updatedTodos = [...todosEdit];
    updatedTodos?.splice(index, 1);
    setTodosEdit(updatedTodos);
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setButtonLoad(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [visitorsTypeOption, setVisitorsTypeOption] = useState([]);
  const [visitorsModeOption, setVisitorsModeOption] = useState([]);
  const [visitorsPurposeOption, setVisitorsPurposeOption] = useState([]);
  //get all interactorMode name.
  // const fetchInteractorMode = async () => {
  //   try {
  //     let res_freq = await axios.get(SERVICE.ALL_INTERACTORMODE, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     setVisitorsModeOption(
  //       res_freq?.data?.interactormode?.map((t) => ({
  //         ...t,
  //         label: t.name,
  //         value: t.name,
  //       }))
  //     );
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"something went wrong!"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };
  //get all interactorType name.
  // const fetchInteractorType = async () => {
  //   try {
  //     let res_freq = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     setVisitorsTypeOption(
  //       res_freq?.data?.manageTypePG?.map((t) => ({
  //         ...t,
  //         label: t.interactorstype,
  //         value: t.interactorstype,
  //       }))
  //     );
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"something went wrong!"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  // const fetchInteractorPurpose = async (e) => {
  //   try {
  //     let res = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });

  //     let result = res.data.manageTypePG.filter(
  //       (d) => d.interactorstype === e.value
  //     );
  //     let ans = result.flatMap((data) => data.interactorspurpose);

  //     setVisitorsPurposeOption(
  //       ans?.map((d) => ({
  //         ...d,
  //         label: d,
  //         value: d,
  //       }))
  //     );
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             style={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             style={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"something  went wrong!"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  const [departmentOption, setDepartmentOption] = useState([]);

  const [floorOption, setFloorOption] = useState([]);
  const [areaOption, setAreaOption] = useState([]);

  //function to fetch department
  // const fetchDepartmentAll = async () => {
  //   try {
  //     let res_deptandteam = await axios.get(SERVICE.DEPARTMENT, {
  //       headers: { Authorization: `Bearer ${auth.APIToken}` },
  //     });

  //     setDepartmentOption([
  //       ...res_deptandteam?.data?.departmentdetails?.map((t) => ({
  //         ...t,
  //         label: t.deptname,
  //         value: t.deptname,
  //       })),
  //     ]);
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           {" "}
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />{" "}
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       // setShowAlert(
  //       //   <>
  //       //     {" "}
  //       //     <ErrorOutlineOutlinedIcon
  //       //       sx={{ fontSize: "100px", color: "orange" }}
  //       //     />{" "}
  //       //     <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //       //       {"something went wrong!"}
  //       //     </p>{" "}
  //       //   </>
  //       // );
  //       // handleClickOpenerr();
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  //get all floor.
  // const fetchFloorAll = async () => {
  //   try {
  //     let res_location = await axios.get(SERVICE.FLOOR, {
  //       headers: { Authorization: `Bearer ${auth.APIToken}` },
  //     });
  //     setFloorOption([
  //       ...res_location?.data?.floors?.map((t) => ({
  //         ...t,
  //         label: t.name,
  //         value: t.name,
  //       })),
  //     ]);
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"something went wrong!"}
  //           </p>{" "}
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  //get all area
  // const fetchAllLocation = async () => {
  //   try {
  //     let res_location = await axios.get(SERVICE.AREAGROUPING, {
  //       headers: { Authorization: `Bearer ${auth.APIToken}` },
  //     });
  //     setAreaOption(res_location?.data?.areagroupings);
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           {" "}
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />{" "}
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       // setShowAlert(
  //       //   <>
  //       //     {" "}
  //       //     <ErrorOutlineOutlinedIcon
  //       //       sx={{ fontSize: "100px", color: "orange" }}
  //       //     />{" "}
  //       //     <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //       //       {"something went wrong!"}
  //       //     </p>{" "}
  //       //   </>
  //       // );
  //       // handleClickOpenerr();
  //       handleClickOpenerr();
  //     }
  //   }
  // };
  const [isAddOpenalert, setAddOpenalert] = useState(false);

  let name = "create";
  let nameedit = "edit";
  let allUploadedFiles = [];
  //add function
  // const sendRequest = async (type) => {
  //   try {
  //     let addVendorDetails = await axios.post(SERVICE.CREATE_VISITORS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },

  //       prefix: String(vendor.prefix),
  //       visitorname: String(vendor.visitorname),
  //       visitorlastname: String(vendor.visitorlastname),

  //       visitorpurpose: String(vendor.visitorpurpose),
  //       visitorcontactnumber: String(vendor.visitorcontactnumber),
  //       visitoremail: String(vendor.visitoremail),
  //       hostname: String(vendor.hostname),

  //       addedby: [
  //         {
  //           // name: String(isUserRoleAccess.companyname),
  //           date: String(new Date()),
  //         },
  //       ],
  //     });
  //     await fetchVendor();
  //     setButtonLoad(false);
  //     if (type === "save1") {
  //       setAddOpenalert(true);
  //       setTimeout(() => {
  //         setAddOpenalert(false);
  //         backPage("/interactor/master/listvisitors");
  //       }, 1000);
  //     } else if (type === "save2") {
  //       setVendor({
  //         ...vendor,
  //         visitorname: "",
  //         intime: "",
  //         visitorcontactnumber: "",
  //         visitoremail: "",
  //         visitorcompnayname: "",
  //         documentnumber: "",
  //         meetingdetails: true,
  //         escortinformation: true,
  //         escortdetails: "",
  //         equipmentborrowed: "",
  //         outtime: "",
  //         remark: "",
  //         followupdate: "",
  //         followuptime: "",
  //         visitorbadge: "",
  //         visitorsurvey: "",
  //       });
  //       setShowAlert(
  //         <>
  //           <CheckCircleOutlineIcon
  //             sx={{ fontSize: "100px", color: "#7ac767" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"Added Successfully 👍"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   } catch (err) {
  //     setButtonLoad(false);
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           {" "}
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />{" "}
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       // setShowAlert(
  //       //   <>
  //       //     {" "}
  //       //     <ErrorOutlineOutlinedIcon
  //       //       sx={{ fontSize: "100px", color: "orange" }}
  //       //     />{" "}
  //       //     <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //       //       {"something went wrong!"}
  //       //     </p>{" "}
  //       //   </>
  //       // );
  //       // handleClickOpenerr();
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  //submit option for saving
  // const handleSubmit = async (e, type) => {
  //   setButtonLoad(true);
  //   e.preventDefault();
  //   await fetchVendor();

  //   const isNameMatch = vendorArray.some(
  //     (item) =>

  //       item.prefix=== vendor.prefix&&

  //       item.visitorpurpose === vendor.visitorpurpose &&
  //       item.hostname === vendor.hostname &&

  //       item.visitorcontactnumber === vendor.visitorcontactnumber &&
  //       item.prefix=== vendor.prefix&&
  //       item.visitorname?.trim()?.toLowerCase() ===vendor.visitorname?.trim()?.toLowerCase()&&
  //         item.visitorlastname?.trim()?.toLowerCase() ===vendor.visitorlastname?.trim()?.toLowerCase()

  //   );

  //  if (vendor.prefix === "") {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"Please Select Prefix"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //   }else if (vendor.prefix === "") {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"Please Select Prefix"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //   } else if (vendor.visitorname === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"Please Enter Visitor Name"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.visitorlastname === "") {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"Please Enter Visitor Name"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();

  //   } else if (vendor.visitorpurpose === "Please Select Visitor Purpose") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"Please Select Visitor Purpose"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();

  //   } else if (vendor.visitorcontactnumber.length < 10) {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"Please Enter Valid Visitor Contact Number"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (
  //     vendor.visitoremail !== "" &&
  //     !validateEmail(vendor.visitoremail)
  //   ) {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"Please Enter Valid Visitor Email"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.hostname === "Please Select Hostname") {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"Please Select Visitor Purpose"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //   } else if (vendor.visitorcontactnumber === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"Please Enter Visitor Contact Number"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();

  //   } else {
  //     sendRequest(type);
  //   }
  // };
  const handleClear = (e) => {
    e.preventDefault();
    setVendor({
      prefix: "",
      visitorname: "",
      visitorlastname: "",
      visitorpurpose: "",
      visitorcontactnumber: "",
      visitoremail: "",

      hostname: "",
    });

    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //get all  vendordetails.
  // const fetchVendor = async () => {
  //   try {
  //     let res_vendor = await axios.get(SERVICE.ALL_VISITORS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     setVendorcheck(true);
  //     setVendormaster(res_vendor?.data?.visitors);
  //     setCatCode(res_vendor?.data?.visitors);
  //     setVendorArray(res_vendor?.data?.visitors);
  //   } catch (err) {
  //     setVendorcheck(true);
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           {" "}
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />{" "}
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       // setShowAlert(
  //       //   <>
  //       //     {" "}
  //       //     <ErrorOutlineOutlinedIcon
  //       //       sx={{ fontSize: "100px", color: "orange" }}
  //       //     />{" "}
  //       //     <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //       //       {"something went wrong!"}
  //       //     </p>{" "}
  //       //   </>
  //       // );
  //       // handleClickOpenerr();
  //       handleClickOpenerr();
  //     }
  //   }
  // };
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  // const nextStep = () => {
  //   console.log("nextstep");
  //   console.log(vendor.prefix

  //   );

  //   // Check the validity of field1

  //   if (vendor.prefix === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"Please Select Prefix"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.visitorname === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"First name must be required"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.visitorlastname === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"Last Name be required"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.visitorlastname.length < 3) {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"  Last Name must be 3 characters!"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.visitoremail === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"  Email must be required"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (isValidEmail) {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {" Please Enter Valid Email"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.visitorcontactnumber === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"  Emergency no must be required"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.visitorcontactnumber.length !== 10) {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {" Emergency no must be 10 digits required"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.hostname === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"  hostname name must be required"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else if (vendor.visitorpurpose === "") {
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"  Visitor purpose must be required"}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   } else {
  //     setStep(step + 1);
  //   }
  // };
  const hoverableCell = {
    "&:hover": {
      backgroundColor: "#D2E7F7",
    },
  };

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const sortedData = allvisitor.sort((a, b) => new Date(b.date) - new Date(a.date));



    const itemsWithSerialNumber = sortedData?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [allvisitor]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
    );
  });

  const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const rowCode = (id) => {
    sendRequest(id)
  }

  let now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  let currtime = `${hours}:${minutes}`;



  const sendRequest = async (id) => {
    try {
      let addVendorDetails = await axios.post(
        `${SERVICE.SINGLE_VISITORS_UPDATEID}`,
        {
          outerId: id,
          outtime: currtime,

        }
      );
      handleClickOpenviewedout()



    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        handleClickOpenerr();
      }
    }
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
      <Box>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12} lg={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                alt=""
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "570px",
                  width: "570px",
                  padding: "40px",
                }}
                src={newproj}
              />
            </Box>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            lg={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "50px",
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                }}
              >
                Check Out Action
              </Typography>
            </Box>
            <br />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label htmlFor="pageSizeSelect">Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      size="small"
                      onChange={handlePageSizeChange}
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    <FormControl fullWidth size="small">
                      <Typography>Search</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </FormControl>
                  </Box>
                </Grid>

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 750 }} aria-label="simple table">
                    <TableHead>
                      <TableRow sx={{
                        fontFamily: " League Spartan, sans-serif",
                        fontsize: "20px",
                        color: "white",
                        backgroundColor: " #008BFF ",
                      }}>
                        <TableCell sx={{
                          fontFamily: " League Spartan, sans-serif",
                          fontsize: "20px",
                          color: "white",
                        }}>Sno</TableCell>
                        <TableCell sx={{
                          fontFamily: " League Spartan, sans-serif",
                          fontsize: "20px",
                          color: "white",
                        }}>Date</TableCell>
                        <TableCell sx={{
                          fontFamily: " League Spartan, sans-serif",
                          fontsize: "20px",
                          color: "white",
                        }} >Name</TableCell>
                        <TableCell sx={{
                          fontFamily: " League Spartan, sans-serif",
                          fontsize: "20px",
                          color: "white",
                        }}>In Time</TableCell>
                        <TableCell sx={{
                          fontFamily: " League Spartan, sans-serif",
                          fontsize: "20px",
                          color: "white",
                        }} >Check Out</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.length > 0 ?
                        (filteredData.map((row, index) => (
                          <TableRow
                            key={row.sno}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell > {moment(new Date(row.date)).format("DD/MM/YYYY")}</TableCell>
                            <TableCell >{row.visitorname}</TableCell>
                            <TableCell >{row.intime}</TableCell>
                            <TableCell >{
                              <img
                                onClick={() => rowCode(row._id)}
                                alt=""
                                style={{
                                  cursor: "pointer",
                                  justifyContent: "center",
                                  height: "30px",
                                  width: "30px",
                                }}
                                src={logout}
                              />}</TableCell>
                          </TableRow>
                        )))
                        : <TableRow>
                          <TableCell colSpan={10} sx={{ textAlign: "center" }}>No data Available</TableCell></TableRow>
                      }
                    </TableBody>

                  </Table>
                </TableContainer>

                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                    to {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <FirstPageIcon />
                    </Button>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                        disabled={page === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateNextIcon />
                    </Button>
                    <Button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={openviewedout}
        onClose={handleClickOpenviewedout}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
      >

        <Grid container spacing={2}>
          <Grid item lg={12} md={12}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "50px",
                color: "black",
                textAlign: "center",
                alignitems: "center",
                fontFamily: " League Spartan, sans-serif",
              }}
            >
              Check Out Details
            </Typography>
          </Grid>

          <Grid item lg={12} md={12}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "40px",
                color: "black",
                fontFamily: " League Spartan, sans-serif",
                marginLeft: "15px",
              }}
            >
              Bye{" "}
              <img
                style={{
                  marginRight: "3px",
                  height: "40px",
                  width: "40px",
                }}
                src={wave}
              />{" "}
              !
            </Typography>
          </Grid>
          <br />
          <Grid
            item
            lg={12}
            md={12}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  height: "200px",
                  width: "200px",
                  textAlign: "center",
                }}
                src={uploadconfetti}
                alt=""
              />{" "}
            </Box>
          </Grid>
          <Grid item lg={1} md={1}></Grid>
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "30px",
                color: "black",
                textAlign: "center",
                alignitems: "center",
                fontFamily: " League Spartan, sans-serif",
              }}
            >
              Check Out Successfully
            </Typography>
          </Grid>
          {/* </Grid> */}
          {/* </Grid> */}
          <Grid item md={1}></Grid>

        </Grid>

      </Dialog>
    </>
  );
}
export default Checkoutaction;