import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  TextareaAutosize,
  Modal,
  DialogTitle,
  LinearProgress,
  Skeleton,
  Paper,
  DialogContentText
} from "@mui/material";
import { handleApiError } from "../../components/Errorhandling";
import CloseIcon from "@mui/icons-material/Close";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { FaTrash } from "react-icons/fa";

import { userStyle } from "../../pageStyle";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaPlus } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Selects from "react-select";
import { Country, State, City } from "country-state-city";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { makeStyles } from "@material-ui/core";
import Webcamimage from "../../components/WebCamVendorDuplicate";
import * as faceapi from "face-api.js";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
let name = "create";

const CustomPaper = (props) => {
  return <Paper {...props} sx={{ borderRadius: "8px" }} />;
};

const severityIcons = {
  success: (
    <CheckCircleOutlineIcon style={{ fontSize: "3.5rem", color: "green" }} />
  ),
  info: <InfoOutlinedIcon style={{ fontSize: "3.5rem", color: "teal" }} />,
  warning: (
    <ErrorOutlineOutlinedIcon style={{ fontSize: "3.5rem", color: "orange" }} />
  ),
  error: (
    <ErrorOutlineOutlinedIcon style={{ fontSize: "3.5rem", color: "red" }} />
  ),
};

function calculateLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate luminance using the formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // If luminance is greater than 128, it's a light color
  return luminance > 128;
}

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

function VendorPopup({
  setVendorAuto,
  handleCloseviewalertvendor,
  sendDataToParent,
}) {
  const [isLoading, setIsLoading] = useState(false);
  let newval = "VEN0001";

  const classes = useStyles();

  const [color, setColor] = useState([]);
  const [bgbtn, setBgbtn] = useState([]);

  const [file, setFile] = useState("");

  const [vendorGrpOpen, setVendorgrpOpen] = useState(false);
  const [vendorgroup, setVendorgroup] = useState({ vendorgroupname: "" });
  //vendor grouping add popup
  const handleClickVendorgrpOpen = () => {
    setVendorgrpOpen(true);
  };
  const handleClickVendorgrpClose = () => {
    setVendorgrpOpen(false);
  };

  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setBtnSubmit(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };

  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setBtnSubmit(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const [isBtn, setIsBtn] = useState(false);

  const dayOptions = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];
  const [isVendorGroupMaster, setIsVendorGroungMaster] = useState([]);
  const [isExitsVendor, setIsExitsVendor] = useState(false);

  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
  };

  const [colorDrag, setColorDrag] = useState("#FFFFFF");
  const [bgbtnDrag, setBgbtnDrag] = useState(false);
  const handleColorChangeDrag = (e) => {
    setColorDrag(e.target.value);
  };
  const handleSubmitDrag = async (index) => {
    setBgbtnDrag(true);
    if (!image || !color) return;

    const formData = new FormData();
    formData.append("image", imageDrag);
    formData.append("color", colorDrag);

    try {
      const response = await axios.post(SERVICE.REMOVEBG, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // setCroppedImage(response?.data?.image); // Set the base64 image
      setRefImageDrag((prev) => {
        let updated = [...prev];
        let currentObject = {
          ...updated[index],
          preview: `${response?.data?.image}`,
        };
        updated[index] = currentObject;
        return updated;
      });
      setBgbtnDrag(false);
    } catch (error) {
      setBgbtnDrag(false);
      console.error("Error uploading image:", error);
    }
  };

  const isLightColorDrag = calculateLuminance(colorDrag);

  const [colorCaptured, setColorCaptured] = useState([]);
  const [bgbtnCaptured, setBgbtnCaptured] = useState([]);

  const handleColorChange = (e, index) => {
    setColor((prev) => {
      let allColors = [...prev];
      allColors[index] = e.target.value;
      const updated = allColors.map((color) => calculateLuminance(color));

      // Update the state for color and light color
      setIsLightColor(updated);
      return allColors;
    });
  };
  const handleColorChangeCaptured = (e, index) => {
    setColorCaptured((prev) => {
      let allColors = [...prev];
      allColors[index] = e.target.value;
      const updated = allColors.map((color) => calculateLuminance(color));

      // Update the state for color and light color
      setIsLightColorCaptured(updated);
      return allColors;
    });
  };
  const [image, setImage] = useState([]);
  const [capturedImage, setCapturedImage] = useState([]);
  const [imageDrag, setImageDrag] = useState([]);

  const handleSubmitNew = async (index, from) => {
    if (index === undefined || index < 0) {
      console.error("Invalid index provided.");
      return;
    }

    if (from === "upload") {
      setBgbtn((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    } else {
      setBgbtnCaptured((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    }

    const selectedImage =
      from === "upload" ? image?.[index] : capturedImage?.[index];
    const selectedColor =
      from === "upload" ? color?.[index] : colorCaptured?.[index];

    if (!selectedImage || !selectedColor) {
      console.error("Image or color not provided.");
      // Reset the button states in case of an error.
      if (from === "upload") {
        setBgbtn((prev) => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      } else {
        setBgbtnCaptured((prev) => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      }
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("color", selectedColor);

    try {
      const response = await axios.post(SERVICE.REMOVEBG, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Example: Set the cropped image (if needed).
      // setCroppedImage(response?.data?.image);
      from === "upload"
        ? setRefImage((prev) => {
          let updated = [...prev];
          let currentObject = {
            ...updated[index],
            preview: `${response?.data?.image}`,
          };
          updated[index] = currentObject;
          return updated;
        })
        : setCapturedImages((prev) => {
          let updated = [...prev];
          let currentObject = {
            ...updated[index],
            preview: `${response?.data?.image}`,
          };
          updated[index] = currentObject;
          return updated;
        });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      // Reset button states after the operation, regardless of success or failure.
      if (from === "upload") {
        setBgbtn((prev) => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      } else {
        setBgbtnCaptured((prev) => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      }
    }
  };

  const [isLightColor, setIsLightColor] = useState([]);
  const [isLightColorCaptured, setIsLightColorCaptured] = useState([]);

  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const modelUrl = SERVICE.FACEDETECTLOGINMODEL;

      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
    };
    loadModels();
  }, []);
  const [btnUpload, setBtnUpload] = useState(false);
  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };

  useEffect(() => {
    if (!capturedImages) return;

    const newBlobs = [];
    const newBgbtnCaptured = [];
    const newColors = [];

    capturedImages.forEach((item) => {
      if (!item?.preview) return;

      const base64Data = item.preview.split(",")[1]; // Extract base64 data
      const binaryData = atob(base64Data); // Decode base64 data
      const uint8Array = new Uint8Array(binaryData.length);

      // Fill the array buffer with the decoded binary data
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      // Create a Blob from the binary data
      const blob = new Blob([uint8Array], { type: "image/png" });
      newBlobs.push(blob);

      // Add default values for bgbtnCaptured and colors
      newBgbtnCaptured.push(false);
      newColors.push("#ffffff");
    });

    // Update states with the accumulated values
    setCapturedImage((prev) => [...prev, ...newBlobs]);
    setBgbtnCaptured((prev) => [...prev, ...newBgbtnCaptured]);

    // Calculate luminance for the new colors
    const luminanceValues = newColors.map((color) => calculateLuminance(color));
    setColorCaptured((prev) => [...prev, ...newColors]);
    setIsLightColorCaptured((prev) => [...prev, ...luminanceValues]);
  }, [capturedImages]);

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

  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    const bgbtnArray = [...bgbtn];
    const colorArray = [...color];
    newSelectedFiles.splice(index, 1);
    bgbtnArray.splice(index, 1);
    colorArray.splice(index, 1);
    setRefImage(newSelectedFiles);
    setBgbtn(bgbtnArray);
    setColor(colorArray);
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

  const handleDrop = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    previewFile(event.dataTransfer.files[0]);
    const data = await handleChangeImageDrag(event);
  };

  const handlePaste = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const clipboardItems = event.clipboardData.items;
    for (let item of clipboardItems) {
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        console.log(file, "file");
        if (file) {
          previewFile(file); // Preview the image
          await handleChangeImageDrag({ dataTransfer: { files: [file] } }); // Process the image
        }
      }
    }
  };

  function handleChangeImage(e) {
    setIsLoading(true);
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
              `${SERVICE.VENDORDUPLICATEFACEDETECTION}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                faceDescriptor: Array.from(faceDescriptor),
              }
            );

            if (response?.data?.matchfound) {
              setIsLoading(false);
              setPopupContentMalert("Image Already In Use!");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            } else {
              const files = e.target.files;
              let newSelectedFiles = [...refImage];
              for (let i = 0; i < files.length; i++) {
                const file = files[i];

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

                    const base64Data = reader.result.split(",")[1]; // Get base64 data (without the prefix)
                    const binaryData = atob(base64Data); // Decode base64 data
                    const arrayBuffer = new ArrayBuffer(binaryData.length);
                    const uint8Array = new Uint8Array(arrayBuffer);

                    // Fill the array buffer with the decoded binary data
                    for (let i = 0; i < binaryData.length; i++) {
                      uint8Array[i] = binaryData.charCodeAt(i);
                    }

                    // Create a Blob from the binary data
                    const blob = new Blob([uint8Array], { type: "image/png" });
                    setImage((prev) => [...prev, blob]);
                    setBgbtn((prev) => {
                      let availed = [...prev];
                      if (availed.length > 0) {
                        availed.push(false);
                      } else {
                        Array(newSelectedFiles.length).fill(false);
                      }
                      return availed;
                    });
                    setColor((prev) => {
                      let availed = [...prev];

                      // Check if there are any existing colors in the state
                      if (availed.length > 0) {
                        availed.push("#ffffff");
                      } else {
                        // If no colors are present, create a new array with default colors
                        availed = Array(newSelectedFiles.length).fill(
                          "#ffffff"
                        );
                      }

                      // Calculate luminance for the updated array of colors
                      const updated = availed.map((color) =>
                        calculateLuminance(color)
                      );

                      // Update the state for color and light color
                      setIsLightColor(updated);

                      return availed;
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }
              toDataURL(path, function (dataUrl) {
                setVendor({
                  ...vendor,
                  uploadedimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setPopupContentMalert("No face detected!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          setPopupContentMalert("Error in face detection!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } finally {
          setIsLoading(false);
          setBtnUpload(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert("Error loading image!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setBtnUpload(false); // Disable loader in case of error
      };

      setFile(URL.createObjectURL(file));
    } else {
      setIsLoading(false);
      setPopupContentMalert(
        "File size is greater than 1MB, please upload a file below 1MB.!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setBtnUpload(false); // Disable loader if file is too large
    }
  }

  function handleChangeImageDrag(e) {
    setBtnUpload(true); // Enable loader when the process starts
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    // Get the selected file
    const file = e.dataTransfer.files[0];

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
              `${SERVICE.VENDORDUPLICATEFACEDETECTION}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                faceDescriptor: Array.from(faceDescriptor),
              }
            );

            if (response?.data?.matchfound) {
              setPopupContentMalert("Image Already In Use!");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            } else {
              let newSelectedFilesDrag = [...refImageDrag];

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

                  const base64Data = reader.result.split(",")[1]; // Get base64 data (without the prefix)
                  const binaryData = atob(base64Data); // Decode base64 data
                  const arrayBuffer = new ArrayBuffer(binaryData.length);
                  const uint8Array = new Uint8Array(arrayBuffer);

                  // Fill the array buffer with the decoded binary data
                  for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i);
                  }

                  // Create a Blob from the binary data
                  const blob = new Blob([uint8Array], { type: "image/png" });
                  setImageDrag(blob);
                };
                reader.readAsDataURL(file);
              } else {
                setPopupContentMalert("Only Accept Images");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
              }
            }
          } else {
            setPopupContentMalert("No face detected!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return false;
          }
        } catch (error) {
          setPopupContentMalert("Error in face detection!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return false;
        } finally {
          setIsLoading(false);
          setBtnUpload(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert("Error loading image!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setBtnUpload(false); // Disable loader in case of error
        return false;
      };

      setFile(URL.createObjectURL(file));
    } else {
      setPopupContentMalert(
        "File size is greater than 1MB, please upload a file below 1MB.!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setBtnUpload(false);
      setIsLoading(false);
      return false;
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

  const [vendor, setVendor] = useState({
    vendorname: "",
    emailid: "",
    phonenumber: "",
    phonenumberone: "",
    phonenumbertwo: "",
    phonenumberthree: "",
    phonenumberfour: "",
    whatsappnumber: "",
    contactperson: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    gstnumber: "",
    creditdays: "",
    bankname: "Please Select Bank Name",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    phonecheck: false,
    modeofpayments: "Please Select Mode of Payments",
    paymentfrequency: "Please Select Payment Frequency",
    monthlyfrequency: "",
    weeklyfrequency: "",
    vendorstatus: "",
    upinumber: "",
    chequenumber: "",
    cardnumber: "",
    cardholdername: "",
    cardtransactionnumber: "",
    cardtype: "Please Select Card Type",
    cardmonth: "Month",
    cardyear: "Year",
    cardsecuritycode: "",
  });
  const [cateCode, setCatCode] = useState([]);
  const [stdCode, setStdCode] = useState();
  const [lanNumber, setLanNumber] = useState();
  const [vendormaster, setVendormaster] = useState([]);
  const { isUserRoleAccess, buttonStyles, isUserRoleCompare } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [monthsOption, setMonthsOption] = useState([]);
  const [yearsOption, setYearsOption] = useState([]);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  // Country city state datas
  const [selectedCountryp, setSelectedCountryp] = useState(
    Country.getAllCountries().find((country) => country.name === "India")
  );
  const [selectedStatep, setSelectedStatep] = useState(
    State.getStatesOfCountry(selectedCountryp?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    )
  );
  const [selectedCityp, setSelectedCityp] = useState(
    City.getCitiesOfState(
      selectedStatep?.countryCode,
      selectedStatep?.isoCode
    ).find((city) => city.name === "Tiruchirappalli")
  );

  const fetchVendorGrouping = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const all = [
        ...res_vendor?.data?.vendorgrouping
          .map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
          }))
          .filter((item, index, self) => {
            return (
              self.findIndex(
                (i) => i.label === item.label && i.value === item.value
              ) === index
            );
          }),
      ];

      setIsVendorGroungMaster(all);
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
    fetchVendorGrouping();
  }, []);

  const updateVendor = async () => {
    if (vendorgroup.vendorgroupname === "") {
      setPopupContentMalert("Please Select/Enter VendorGroup Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      let addvend = await axios.post(
        SERVICE.ADD_VENDORGROUPING,
        {
          vendor: String(vendor.vendorname),
          name: String(vendorgroup.vendorgroupname),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      handleClickVendorgrpClose();
      await sendRequest();
      setVendorgroup({ vendorgroupname: "" });
      setVendorAuto("none1");
      sendDataToParent("123");

      setVendor({
        ...vendor,
        vendorname: "",
        emailid: "",
        phonenumber: "",
        phonenumberone: "",
        phonenumbertwo: "",
        phonenumberthree: "",
        phonenumberfour: "",
        whatsappnumber: "",
        contactperson: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        gstnumber: "",
        creditdays: "",
        bankbranchname: "",
        accountholdername: "",
        accountnumber: "",
        ifsccode: "",
        upinumber: "",
        cardnumber: "",
        cardholdername: "",
        cardtransactionnumber: "",
        cardsecuritycode: "",
        chequenumber: "",
        phonecheck: false,
      });
      setmodeofpay([]);
      setStdCode("");
      setLanNumber("");
      const country = Country.getAllCountries().find(
        (country) => country.name === "India"
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === "Tamil Nadu"
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === "Tiruchirappalli");
      setSelectedCountryp(country);
      setSelectedStatep(state);
      setSelectedCityp(city);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setRefImage([]);
      setRefImageDrag([]);
      setCapturedImages([]);
      setIsBtn(false);
      handleCloseviewalertvendor();
    }
  };

  //useEffect
  useEffect(() => {
    getPhoneNumber();
  }, [vendor.phonecheck, vendor.phonenumber]);

  const [autoId, setAutoId] = useState("");
  const fetchAutoId = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.VENDOR_AUTOID, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let refNo = res_vendor?.data?.autoid;

      setAutoId(refNo);

      return refNo;
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
    fetchVendor();
    generateMonthsOptions();
    generateYearsOptions();
    fetchAutoId();
    generateDateOptions();
  }, []);
  const [dateOption, setDateOption] = useState([]);
  const generateDateOptions = () => {
    const minsOpt = [];
    for (let i = 1; i <= 28; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setDateOption(minsOpt);
  };
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [btnSubmit, setBtnSubmit] = useState(false);
  const maxLength = 15; //gst number limit

  //function to generate hrs
  const generateMonthsOptions = () => {
    const mnthsOpt = [];
    for (let i = 1; i <= 12; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      mnthsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMonthsOption(mnthsOpt);
  };
  let today = new Date();
  var yyyy = today.getFullYear();
  //function to generate mins
  const generateYearsOptions = () => {
    const yearsOpt = [];
    for (let i = yyyy; i <= 2050; i++) {
      yearsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setYearsOption(yearsOpt);
  };
  const handlechangecpincode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === "") {
      setVendor({ ...vendor, pincode: inputValue });
    }
  };

  const handlechangestdcode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 4);
    if (regex.test(inputValue) || inputValue === "") {
      setStdCode(inputValue);
    }
  };
  const handlechangephonenumber = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      return inputValue;
    }
  };

  const handleMobile = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Mobile number can't more than 10 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, phonenumber: num });
    }
  };
  const handlewhatsapp = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Whats app number can't more than 10 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, whatsappnumber: num });
    }
  };
  const getPhoneNumber = () => {
    if (vendor.phonecheck) {
      setVendor({ ...vendor, whatsappnumber: vendor.phonenumber });
    } else {
      setVendor({ ...vendor, whatsappnumber: "" });
    }
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const paymentfrequency = [
    { value: "Daily", label: "Daily" },
    { value: "Monthly", label: "Monthly" },
    { value: "BillWise", label: "BillWise" },
  ];
  const vendorstatusopt = [
    { value: "Active", label: "Active" },
    { value: "In Active", label: "In Active" },
  ];
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [ifscModalOpen, setIfscModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const handleModalClose = () => {
    setIfscModalOpen(false);
    setBankDetails(null); // Reset bank details
  };

  const handleModalOpen = () => {
    setIfscModalOpen(true);
  };
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert small alphabets to capital letters
    const capitalizedValue = value.toUpperCase();

    // Validate input to allow only capital letters and numbers
    const regex = /^[A-Z0-9]*$/;
    if (!regex.test(capitalizedValue)) {
      // If the input contains invalid characters, do not update the state
      return;
    }

    // Validate length of IFSC code (should be 11 characters)
    if (name === "ifsccode" && capitalizedValue.length > 11) {
      // If the IFSC code is longer than 11 characters, truncate it

      setVendor({
        ...vendor,
        [name]: capitalizedValue.slice(0, 11),
      });
    } else {
      setVendor({
        ...vendor,
        [name]: capitalizedValue,
      });
    }
  };
  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://ifsc.razorpay.com/${vendor.ifsccode}`
      );
      if (response.status === 200) {
        setBankDetails(response.data);
        setLoading(false);
      } else {
        setPopupContentMalert("Bank Details Not Found!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setLoading(false);
      // handleApiError(
      //   err,
      //   setPopupContentMalert,
      //   setPopupSeverityMalert,
      //   handleClickOpenPopupMalert
      // );
      setPopupContentMalert("Error Getting Bank Branch Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };
  //bank name options
  const accounttypes = [
    { value: "ALLAHABAD BANK - AB", label: "ALLAHABAD BANK - AB" },
    { value: "ANDHRA BANK - ADB", label: "ANDHRA BANK - ADB" },
    { value: "AXIS BANK - AXIS", label: "AXIS BANK - AXIS" },
    { value: "STATE BANK OF INDIA - SBI", label: "STATE BANK OF INDIA - SBI" },
    { value: "BANK OF BARODA - BOB", label: "BANK OF BARODA - BOB" },
    { value: "CITY UNION BANK - CUB", label: "CITY UNION BANK - CUB" },
    { value: "UCO BANK - UCO", label: "UCO BANK - UCO" },
    { value: "UNION BANK OF INDIA - UBI", label: "UNION BANK OF INDIA - UBI" },
    { value: "BANK OF INDIA - BOI", label: "BANK OF INDIA - BOI" },
    {
      value: "BANDHAN BANK LIMITED - BBL",
      label: "BANDHAN BANK LIMITED - BBL",
    },
    { value: "CANARA BANK - CB", label: "CANARA BANK - CB" },
    { value: "GRAMIN VIKASH BANK - GVB", label: "GRAMIN VIKASH BANK - GVB" },
    { value: "CORPORATION BANK - CORP", label: "CORPORATION BANK - CORP" },
    { value: "INDIAN BANK - IB", label: "INDIAN BANK - IB" },
    {
      value: "INDIAN OVERSEAS BANK - IOB",
      label: "INDIAN OVERSEAS BANK - IOB",
    },
    {
      value: "ORIENTAL BANK OF COMMERCE - OBC",
      label: "ORIENTAL BANK OF COMMERCE - OBC",
    },
    {
      value: "PUNJAB AND SIND BANK - PSB",
      label: "PUNJAB AND SIND BANK - PSB",
    },
    {
      value: "PUNJAB NATIONAL BANK - PNB",
      label: "PUNJAB NATIONAL BANK - PNB",
    },
    {
      value: "RESERVE BANK OF INDIA - RBI",
      label: "RESERVE BANK OF INDIA - RBI",
    },
    { value: "SOUTH INDIAN BANK - SIB", label: "SOUTH INDIAN BANK - SIB" },
    {
      value: "UNITED BANK OF INDIA - UBI",
      label: "UNITED BANK OF INDIA - UBI",
    },
    {
      value: "CENTRAL BANK OF INDIA - CBI",
      label: "CENTRAL BANK OF INDIA - CBI",
    },
    { value: "VIJAYA BANK - VB", label: "VIJAYA BANK - VB" },
    { value: "DENA BANK - DEN", label: "DENA BANK - DEN" },
    {
      value: "BHARATIYA MAHILA BANK LIMITED - BMB",
      label: "BHARATIYA MAHILA BANK LIMITED - BMB",
    },
    { value: "FEDERAL BANK - FB", label: "FEDERAL BANK - FB" },
    { value: "HDFC BANK - HDFC", label: "HDFC BANK - HDFC" },
    { value: "ICICI BANK - ICICI", label: "ICICI BANK - ICICI" },
    { value: "IDBI BANK - IDBI", label: "IDBI BANK - IDBI" },
    { value: "PAYTM BANK - PAYTM", label: "PAYTM BANK - PAYTM" },
    { value: "FINO PAYMENT BANK - FINO", label: "FINO PAYMENT BANK - FINO" },
    { value: "INDUSIND BANK - IIB", label: "INDUSIND BANK - IIB" },
    { value: "KARNATAKA BANK - KBL", label: "KARNATAKA BANK - KBL" },
    {
      value: "KOTAK MAHINDRA BANK - KOTAK",
      label: "KOTAK MAHINDRA BANK - KOTAK",
    },
    { value: "YES BANK - YES", label: "YES BANK - YES" },
    { value: "SYNDICATE BANK - SYN", label: "SYNDICATE BANK - SYN" },
    { value: "BANK OF MAHARASHTRA - BOM", label: "BANK OF MAHARASHTRA - BOM" },
    { value: "DCB BANK - DCB", label: "DCB BANK - DCB" },
    { value: "IDFC BANK - IDFC", label: "IDFC BANK - IDFC" },
    {
      value: "JAMMU AND KASHMIR BANK - J&K",
      label: "JAMMU AND KASHMIR BANK - J&K",
    },
    { value: "KARUR VYSYA BANK - KVB", label: "KARUR VYSYA BANK - KVB" },
    { value: "RBL BANK - RBL", label: "RBL BANK - RBL" },
    { value: "DHANLAXMI BANK - DLB", label: "DHANLAXMI BANK - DLB" },
    { value: "CSB BANK - CSB", label: "CSB BANK - CSB" },
    {
      value: "TAMILNAD MERCANTILE BANK - TMB",
      label: "TAMILNAD MERCANTILE BANK - TMB",
    },
  ];
  const modeofpayments = [
    { value: "Cash", label: "Cash" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "UPI", label: "UPI" },
    { value: "Card", label: "Card" },
    { value: "Cheque", label: "Cheque" },
  ];
  const cardtypes = [
    { value: "Credit Card", label: "Credit Card" },
    { value: "Debit Card", label: "Debit Card" },
    { value: "Visa Card", label: "Visa Card" },
    { value: "Master Card", label: "Master Card" },
  ];

  const [modeofpay, setmodeofpay] = useState([]);

  const deleteTodo = (index) => {
    setmodeofpay(
      modeofpay.filter((data) => {
        return data !== index;
      })
    );
    switch (index) {
      case "Bank Transfer":
        setVendor({
          ...vendor,
          bankname: "Please Select Bank Name",
          bankbranchname: "",
          accountholdername: "",
          accountnumber: "",
          ifsccode: "",
        });
        break;
      case "UPI":
        setVendor({ ...vendor, upinumber: "" });
        break;
      case "Cheque":
        setVendor({ ...vendor, chequenumber: "" });
        break;
      case "Card":
        setVendor({
          ...vendor,
          cardnumber: "",
          cardholdername: "",
          cardtransactionnumber: "",
          cardtype: "Please Select Card Type",
          cardmonth: "Month",
          cardyear: "Year",
          cardsecuritycode: "",
        });
        break;
    }
  };

  //submit option for saving
  const handlemodeofpay = () => {
    if (modeofpay.includes(vendor.modeofpayments)) {
      setPopupContentMalert("To Do is Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setmodeofpay([...modeofpay, vendor.modeofpayments]);
    }
  };

  let allUploadedFiles = [];

  //add function
  const sendRequest = async () => {
    let filtered = Array.from(new Set(modeofpay));
    let autoIds = await fetchAutoId();
    try {
      let addVendorDetails = await axios.post(SERVICE.ADD_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorid: String(autoIds),
        vendorname: String(vendor.vendorname),
        emailid: String(vendor.emailid),
        phonenumber: Number(vendor.phonenumber),
        phonenumberone: Number(vendor.phonenumberone),
        phonenumbertwo: Number(vendor.phonenumbertwo),
        phonenumberthree: Number(vendor.phonenumberthree),
        phonenumberfour: Number(vendor.phonenumberfour),
        whatsappnumber: Number(vendor.whatsappnumber),
        phonecheck: Boolean(vendor.phonecheck),
        contactperson: String(vendor.contactperson),
        address: String(vendor.address),
        vendorstatus: String(vendor.vendorstatus),
        monthlyfrequency: String(
          vendor.paymentfrequency === "Monthly" ? vendor.monthlyfrequency : ""
        ),
        country: String(
          selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
        ),
        state: String(
          selectedStatep?.name == undefined ? "" : selectedStatep?.name
        ),
        city: String(
          selectedCityp?.name == undefined ? "" : selectedCityp?.name
        ),
        pincode: Number(vendor.pincode),
        gstnumber: String(vendor.gstnumber),
        landline: String(stdCode && lanNumber ? `${stdCode}${lanNumber}` : ""),
        creditdays: Number(vendor.creditdays),

        modeofpayments: [...filtered],

        paymentfrequency:
          vendor.paymentfrequency === "Please Select Payment Frequency"
            ? ""
            : String(vendor.paymentfrequency),

        bankname: filtered.includes("Bank Transfer")
          ? String(vendor.bankname)
          : "",
        bankbranchname: filtered.includes("Bank Transfer")
          ? String(vendor.bankbranchname)
          : "",
        accountholdername: filtered.includes("Bank Transfer")
          ? String(vendor.accountholdername)
          : "",
        accountnumber: filtered.includes("Bank Transfer")
          ? String(vendor.accountnumber)
          : "",
        ifsccode: filtered.includes("Bank Transfer")
          ? String(vendor.ifsccode)
          : "",

        upinumber: filtered.includes("UPI") ? String(vendor.upinumber) : "",

        cardnumber: filtered.includes("Card") ? String(vendor.cardnumber) : "",
        cardholdername: filtered.includes("Card")
          ? String(vendor.cardholdername)
          : "",
        cardtransactionnumber: filtered.includes("Card")
          ? String(vendor.cardtransactionnumber)
          : "",
        cardtype: filtered.includes("Card") ? String(vendor.cardtype) : "",
        cardmonth: filtered.includes("Card") ? String(vendor.cardmonth) : "",
        cardyear: filtered.includes("Card") ? String(vendor.cardyear) : "",
        cardsecuritycode: filtered.includes("Card")
          ? String(vendor.cardsecuritycode)
          : "",

        faceDescriptor:
          vendor?.faceDescriptor?.length > 0 ? vendor?.faceDescriptor : [],

        files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),

        chequenumber: filtered.includes("Cheque")
          ? String(vendor.chequenumber)
          : "",

        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setVendorAuto("none");
      // await fetchVendor();
      // setVendor({
      //   ...vendor,
      //   // vendorname: "",
      //   emailid: "",
      //   phonenumber: "",
      //   phonenumberone: "",
      //   phonenumbertwo: "",
      //   phonenumberthree: "",
      //   phonenumberfour: "",
      //   whatsappnumber: "",
      //   contactperson: "",
      //   address: "",
      //   country: "",
      //   state: "",
      //   city: "",
      //   pincode: "",
      //   gstnumber: "",
      //   creditdays: "",
      //   bankbranchname: "",
      //   accountholdername: "",
      //   accountnumber: "",
      //   ifsccode: "",
      //   upinumber: "",
      //   cardnumber: "",
      //   cardholdername: "",
      //   cardtransactionnumber: "",
      //   cardsecuritycode: "",
      //   chequenumber: "",
      //   phonecheck: false,
      // });
      // setStdCode("");
      // setLanNumber("");
      // const country = Country.getAllCountries().find(
      //   (country) => country.name === "India"
      // );
      // const state = State.getStatesOfCountry(country?.isoCode).find(
      //   (state) => state.name === "Tamil Nadu"
      // );
      // const city = City.getCitiesOfState(
      //   state?.countryCode,
      //   state?.isoCode
      // ).find((city) => city.name === "Tiruchirappalli");
      // setSelectedCountryp(country);
      // setSelectedStatep(state);
      // setSelectedCityp(city);
      // setBtnSubmit(false);
      await fetchAutoId();
      // setPopupContent("Added Successfully");
      // setPopupSeverity("success");
      // handleClickOpenPopup();
      // handleCloseviewalertvendor();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //valid email verification
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnSubmit(true);
    const isNameMatch = vendormaster.some(
      (item) =>
        item.vendorname.toLowerCase() === vendor.vendorname.toLowerCase()
    );
    if (vendor.vendorname === "") {
      setPopupContentMalert("Please Enter Vendor Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!validateEmail(vendor.emailid) && vendor.emailid !== "") {
      setPopupContentMalert("Please Enter Valid Email Id!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.address === "") {
      setPopupContentMalert("Please Enter Address!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedCountryp?.isoCode !== selectedStatep?.countryCode) {
      setPopupContentMalert("Please Select The Correct State!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedCountryp?.isoCode !== selectedCityp?.countryCode ||
      selectedStatep?.isoCode !== selectedCityp?.stateCode
    ) {
      setPopupContentMalert("Please Select The Correct City!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.vendorstatus === "") {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendor.paymentfrequency === "Please Select Payment Frequency" ||
      vendor.paymentfrequency === ""
    ) {
      setPopupContentMalert("Please Select Payment Frequency!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendor.paymentfrequency === "Monthly" &&
      (vendor.monthlyfrequency === "" || !vendor.monthlyfrequency)
    ) {
      setPopupContentMalert("Please Select Monthly Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.modeofpayments === "Please Select Mode of Payments") {
      setPopupContentMalert("Please Select Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.bankname === "Please Select Bank Name"
    ) {
      setPopupContentMalert("Please Select Bank Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.bankbranchname === ""
    ) {
      setPopupContentMalert("Please Enter Bank Branch Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.accountholdername === ""
    ) {
      setPopupContentMalert("Please Enter Account Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.accountnumber === ""
    ) {
      setPopupContentMalert("Please Enter Account Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Bank Transfer") && vendor.ifsccode === "") {
      setPopupContentMalert("Please Enter IFSC Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("UPI") && vendor.upinumber === "") {
      setPopupContentMalert("Please Enter UPI Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardnumber === "") {
      setPopupContentMalert("Please Enter Card Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardholdername === "") {
      setPopupContentMalert("Please Enter Card Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Card") &&
      vendor.cardtransactionnumber === ""
    ) {
      setPopupContentMalert("Please Enter Card Transaction Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Card") &&
      vendor.cardtype === "Please Select Card Type"
    ) {
      setPopupContentMalert("Please Select Card Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardmonth === "Month") {
      setPopupContentMalert("Please Select Expire Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardyear === "Year") {
      setPopupContentMalert("Please Select Expire Year!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardsecuritycode === "") {
      setPopupContentMalert("Please Enter Card Security Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Cheque") && vendor.chequenumber === "") {
      setPopupContentMalert("Please Enter Cheque Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.length === 0) {
      setPopupContentMalert("Please Insert Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Vendorame already exits!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      // sendRequest();
      handleClickVendorgrpOpen();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setVendor({
      vendorname: "",
      monthlyfrequency: "",
      vendorstatus: "",
      emailid: "",
      phonenumber: "",
      phonenumberone: "",
      phonenumbertwo: "",
      phonenumberthree: "",
      phonenumberfour: "",
      whatsappnumber: "",
      contactperson: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      gstnumber: "",
      creditdays: "",
      bankname: "Please Select Bank Name",
      bankbranchname: "",
      accountholdername: "",
      accountnumber: "",
      ifsccode: "",
      phonecheck: false,
      modeofpayments: "Please Select Mode of Payments",
      upinumber: "",
      chequenumber: "",
      cardnumber: "",
      cardholdername: "",
      cardtransactionnumber: "",
      cardtype: "Please Select Card Type",
      cardmonth: "Month",
      cardyear: "Year",
      cardsecuritycode: "",
      paymentfrequency: "Please Select Payment Frequency",
    });
    const country = Country.getAllCountries().find(
      (country) => country.name === "India"
    );
    const state = State.getStatesOfCountry(country?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    );
    const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find(
      (city) => city.name === "Tiruchirappalli"
    );
    setSelectedCountryp(country);
    setSelectedStatep(state);
    setSelectedCityp(city);
    setStdCode("");
    setLanNumber("");
    setmodeofpay([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //editing the single data...
  //get all  vendordetails.
  const fetchVendor = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setVendormaster(res_vendor?.data?.vendordetails);
      setCatCode(res_vendor?.data?.vendordetails);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [subsusbcomponents, setSubsubcomponents] = useState([]);

  const fetchvendorgrouping = async () => {
    try {
      let res1 = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const allGroup = Array.from(
        new Set(res1?.data?.vendorgrouping.map((d) => d.name))
      ).map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      setSubsubcomponents(allGroup);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  return (
    <Box>
      <>
        {isUserRoleCompare?.includes("avendormaster") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  {" "}
                  <Typography sx={{ fontWeight: "bold" }}>
                    Add Vendor
                  </Typography>{" "}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    {cateCode &&
                      cateCode.map(() => {
                        let strings = "VEN";
                        let refNo = cateCode[cateCode?.length - 1]?.vendorid;
                        let digits = (cateCode?.length + 1).toString();
                        const stringLength = refNo?.length;
                        let lastChar = refNo?.charAt(stringLength - 1);
                        let getlastBeforeChar = refNo?.charAt(stringLength - 2);
                        let getlastThreeChar = refNo?.charAt(stringLength - 3);
                        let lastBeforeChar = refNo?.slice(-2);
                        let lastThreeChar = refNo?.slice(-3);
                        let lastDigit = refNo?.slice(-4);
                        let refNOINC = parseInt(lastChar) + 1;
                        let refLstTwo = parseInt(lastBeforeChar) + 1;
                        let refLstThree = parseInt(lastThreeChar) + 1;
                        let refLstDigit = parseInt(lastDigit) + 1;
                        if (
                          digits.length < 4 &&
                          getlastBeforeChar == 0 &&
                          getlastThreeChar == 0
                        ) {
                          refNOINC = ("000" + refNOINC)?.substr(-4);
                          newval = strings + refNOINC;
                        } else if (
                          digits.length < 4 &&
                          getlastBeforeChar > 0 &&
                          getlastThreeChar == 0
                        ) {
                          refNOINC = ("00" + refLstTwo)?.substr(-4);
                          newval = strings + refNOINC;
                        } else if (digits.length < 4 && getlastThreeChar > 0) {
                          refNOINC = ("0" + refLstThree)?.substr(-4);
                          newval = strings + refNOINC;
                        }
                      })}
                    <Typography>
                      Vendor ID <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      placeholder="Please Enter Vendor Id"
                      value={newval}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.vendorname}
                      placeholder="Please Enter Vendor Name"
                      onChange={(e) => {
                        setVendor({ ...vendor, vendorname: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Email ID</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="email"
                      value={vendor.emailid}
                      placeholder="Please Enter Email ID"
                      onChange={(e) => {
                        setVendor({ ...vendor, emailid: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumber}
                      placeholder="Please Enter Phone Number"
                      onChange={(e) => {
                        setVendor({ ...vendor, phonenumber: e.target.value });
                        handleMobile(e.target.value);
                      }}
                    />
                  </FormControl>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={vendor.phonecheck} />}
                        onChange={(e) =>
                          setVendor({
                            ...vendor,
                            phonecheck: !vendor.phonecheck,
                          })
                        }
                        label="Same as Whats app number"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex" }}>
                  <Grid item md={3} sm={12} xs={12}>
                    <Typography>Photograph</Typography>
                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                      <Button
                        sx={buttonStyles.buttonsubmit}
                        onClick={handleClickUploadPopupOpen}
                      >
                        Upload
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item md={9} sm={12} xs={12}>
                    <Typography>&nbsp;</Typography>
                    {refImageDrag.length > 0 && (
                      <>
                        {refImageDrag.map((file, index) => (
                          <>
                            <img
                              src={file.preview}
                              alt={file.name}
                              style={{
                                maxWidth: "70px",
                                maxHeight: "70px",
                                marginTop: "10px",
                              }}
                            />
                            <Button
                              onClick={() => handleRemoveFile(index)}
                              style={{ marginTop: "0px", color: "red" }}
                            >
                              X
                            </Button>
                          </>
                        ))}
                      </>
                    )}
                    {isWebcamCapture == true &&
                      capturedImages.map((image, index) => (
                        <Grid container key={index}>
                          <Typography>&nbsp;</Typography>

                          <Grid item md={2} sm={2} xs={12}>
                            <Box
                              style={{
                                isplay: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: "37px",
                              }}
                            >
                              <img
                                src={image.preview}
                                alt={image.name}
                                height={50}
                                style={{ maxWidth: "-webkit-fill-available" }}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={7}
                            sm={7}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">
                              {" "}
                              {image.name}{" "}
                            </Typography>
                          </Grid>
                          <Grid item md={1} sm={1} xs={12}>
                            <Grid sx={{ display: "flex" }}>
                              <Button
                                sx={{
                                  marginTop: "15px !important",
                                  padding: "14px 14px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036", // theme.palette.primary.main
                                  },
                                }}
                                onClick={() => renderFilePreview(image)}
                              >
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "12px",
                                    color: "#357AE8",
                                    marginTop: "35px !important",
                                  }}
                                />
                              </Button>
                              <Button
                                sx={{
                                  marginTop: "15px !important",
                                  padding: "14px 14px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036",
                                  },
                                }}
                                onClick={() => removeCapturedImage(index)}
                              >
                                <FaTrash
                                  style={{
                                    color: "#a73131",
                                    fontSize: "12px",
                                    marginTop: "35px !important",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    {refImage.map((file, index) => (
                      <Grid container key={index}>
                        <Typography>&nbsp;</Typography>

                        <Grid item md={2} sm={2} xs={2}>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {file?.type?.includes("image/") ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                height={50}
                                style={{
                                  maxWidth: "-webkit-fill-available",
                                }}
                              />
                            ) : (
                              <img
                                className={classes.preview}
                                src={getFileIcon(file.name)}
                                height="10"
                                alt="file icon"
                              />
                            )}
                          </Box>
                        </Grid>
                        <Grid
                          item
                          md={7}
                          sm={7}
                          xs={7}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {" "}
                            {file.name}{" "}
                          </Typography>
                        </Grid>
                        <Grid item md={1} sm={1} xs={1}>
                          <Grid sx={{ display: "flex" }}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => renderFilePreview(file)}
                            >
                              <VisibilityOutlinedIcon
                                style={{ fontsize: "12px", color: "#357AE8" }}
                              />
                            </Button>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handleDeleteFile(index)}
                            >
                              <FaTrash
                                style={{ color: "#a73131", fontSize: "12px" }}
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Alternate Phone Number
                  </Typography>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number 1</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumberone}
                      placeholder="Please Enter Phone Number 1"
                      onChange={(e) => {
                        const phoneone = handlechangephonenumber(e);
                        setVendor({ ...vendor, phonenumberone: phoneone });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number 2</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumbertwo}
                      placeholder="Please Enter Phone Number 2"
                      onChange={(e) => {
                        const phonetwo = handlechangephonenumber(e);
                        setVendor({ ...vendor, phonenumbertwo: phonetwo });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number 3</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumberthree}
                      placeholder="Please Enter Phone Number 3"
                      onChange={(e) => {
                        const phonethree = handlechangephonenumber(e);
                        setVendor({ ...vendor, phonenumberthree: phonethree });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number 4</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumberfour}
                      placeholder="Please Enter Phone Number 4"
                      onChange={(e) => {
                        const phonefour = handlechangephonenumber(e);
                        setVendor({ ...vendor, phonenumberfour: phonefour });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>WhatsApp Number</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.whatsappnumber}
                      placeholder="Please Enter Whatsapp Number"
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
                          whatsappnumber: e.target.value,
                        });
                        handlewhatsapp(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Address <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      placeholder="Please Enter Address"
                      value={vendor.address}
                      onChange={(e) => {
                        setVendor({ ...vendor, address: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
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
                      value={selectedCountryp}
                      onChange={(item) => {
                        setSelectedCountryp(item);
                        setVendor((prevSupplier) => ({
                          ...prevSupplier,
                          country: item?.name || "",
                        }));
                        setSelectedStatep("");
                        setSelectedCityp("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>State</Typography>
                    <Selects
                      options={State?.getStatesOfCountry(
                        selectedCountryp?.isoCode
                      )}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      value={selectedStatep}
                      onChange={(item) => {
                        setSelectedStatep(item);
                        setVendor((prevSupplier) => ({
                          ...prevSupplier,
                          state: item?.name || "",
                        }));
                        setSelectedCityp("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>City</Typography>
                    <Selects
                      options={City.getCitiesOfState(
                        selectedStatep?.countryCode,
                        selectedStatep?.isoCode
                      )}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      value={selectedCityp}
                      onChange={(item) => {
                        setSelectedCityp(item);
                        setVendor((prevSupplier) => ({
                          ...prevSupplier,
                          city: item?.name || "",
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Pincode</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      placeholder="Please Enter Pincode"
                      value={vendor.pincode}
                      sx={userStyle.input}
                      onChange={(e) => {
                        handlechangecpincode(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>GST Number</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.gstnumber}
                      placeholder="Please Enter GST Number"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length <= maxLength) {
                          setVendor({ ...vendor, gstnumber: newValue });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <Grid container>
                    <Grid item md={4} xs={6} sm={6}>
                      <FormControl size="small" fullWidth>
                        <Typography>Landline</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={stdCode}
                          placeholder="STD Code"
                          sx={userStyle.input}
                          onChange={(e) => {
                            handlechangestdcode(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={8} xs={6} sm={6}>
                      <FormControl size="small" fullWidth>
                        <Typography>&nbsp;</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={lanNumber}
                          placeholder="Number"
                          sx={userStyle.input}
                          onChange={(e) => {
                            setLanNumber(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Contact Person Name</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.contactperson}
                      placeholder="Please Enter Contact Person Name"
                      onChange={(e) => {
                        setVendor({ ...vendor, contactperson: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Credit Days</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      value={vendor.creditdays}
                      placeholder="Please Enter Credit Days"
                      sx={userStyle.input}
                      onChange={(e) => {
                        setVendor({ ...vendor, creditdays: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Status<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={vendorstatusopt}
                      placeholder="Please Choose Status"
                      value={{
                        label: !vendor.vendorstatus
                          ? "Please Select Status"
                          : vendor.vendorstatus,
                        value: !vendor.vendorstatus
                          ? "Please Select Status"
                          : vendor.vendorstatus,
                      }}
                      onChange={(e) => {
                        setVendor({ ...vendor, vendorstatus: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Payment Frequency<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={paymentfrequency}
                      placeholder="Please Choose Payment Frequency"
                      value={{
                        label: vendor.paymentfrequency,
                        value: vendor.paymentfrequency,
                      }}
                      onChange={(e) => {
                        setVendor({ ...vendor, paymentfrequency: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                {vendor.paymentfrequency === "Monthly" && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Monthly Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={dateOption}
                        placeholder="Please Choose Monthly Date"
                        value={{
                          label: !vendor.monthlyfrequency
                            ? "Please Select Monthly Frequency"
                            : vendor.monthlyfrequency,
                          value: !vendor.monthlyfrequency
                            ? "Please Select Monthly Frequency"
                            : vendor.monthlyfrequency,
                        }}
                        onChange={(e) => {
                          setVendor({
                            ...vendor,
                            monthlyfrequency: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                {vendor.paymentfrequency === "Weekly" && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Weekly Days<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={dayOptions}
                        placeholder="Please Choose Monthly Date"
                        value={{
                          label: !vendor.weeklyfrequency
                            ? "Please Select Weekly Frequency"
                            : vendor.weeklyfrequency,
                          value: !vendor.weeklyfrequency
                            ? "Please Select Weekly Frequency"
                            : vendor.weeklyfrequency,
                        }}
                        onChange={(e) => {
                          setVendor({
                            ...vendor,
                            weeklyfrequency: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode of Payments<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={modeofpayments}
                      placeholder="Please Choose Mode Of Payments"
                      value={{
                        label: vendor.modeofpayments,
                        value: vendor.modeofpayments,
                      }}
                      onChange={(e) => {
                        setVendor({ ...vendor, modeofpayments: e.value });
                      }}
                    />
                  </FormControl>
                  &emsp;
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handlemodeofpay}
                    type="button"
                    sx={{
                      height: "30px",
                      minWidth: "30px",
                      marginTop: "28px",
                      padding: "6px 10px",
                    }}
                  >
                    <FaPlus />
                  </Button>
                  &nbsp;
                </Grid>
              </Grid>
              <br />
              {modeofpay.includes("Cash") && (
                <>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography sx={{ fontWeight: "bold" }}>
                          Cash <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly={true}
                          value={"Cash"}
                          onChange={(e) => { }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("Cash")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br />
              <br />
              {modeofpay.includes("Bank Transfer") && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Bank Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bank Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={accounttypes}
                          placeholder="Please Choose Bank Name"
                          value={{
                            label: vendor.bankname,
                            value: vendor.bankname,
                          }}
                          onChange={(e) => {
                            setVendor({ ...vendor, bankname: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bank Branch Name<b style={{ color: "red" }}>*</b>
                          <span
                            style={{
                              display: "inline",
                              fontSize: "0.8rem",
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                              marginLeft: "5px",
                            }}
                            onClick={handleModalOpen}
                          >
                            {"(Get By IFSC)"}
                          </span>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.bankbranchname}
                          placeholder="Please Enter Bank Branch Name"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                bankbranchname: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Account Holder Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.accountholdername}
                          placeholder="Please Enter Account Holder Name"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                accountholdername: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Account Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          value={vendor.accountnumber}
                          placeholder="Please Enter Account Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                accountnumber: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          IFSC Code<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.ifsccode}
                          placeholder="Please Enter IFSC Code"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({ ...vendor, ifsccode: inputvalue });
                            }
                          }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("Bank Transfer")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br /> <br />
              {modeofpay.includes("UPI") && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        UPI Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          UPI Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          value={vendor.upinumber}
                          placeholder="Please Enter UPI Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({ ...vendor, upinumber: inputvalue });
                            }
                          }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("UPI")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br /> <br />
              {modeofpay.includes("Card") && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Card Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Card Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          value={vendor.cardnumber}
                          placeholder="Please Enter Card Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({ ...vendor, cardnumber: inputvalue });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Card Holder Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.cardholdername}
                          placeholder="Please Enter Card Holder Name"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                cardholdername: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Card Transaction Number
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.cardtransactionnumber}
                          placeholder="Please Enter Card Transaction Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                cardtransactionnumber: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Card Type<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={cardtypes}
                          placeholder="Please Select Card Type"
                          value={{
                            label: vendor.cardtype,
                            value: vendor.cardtype,
                          }}
                          onChange={(e) => {
                            setVendor({ ...vendor, cardtype: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <Typography>
                        Expire At<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={monthsOption}
                              placeholder="Month"
                              id="select7"
                              value={{
                                label: vendor.cardmonth,
                                value: vendor.cardmonth,
                              }}
                              onChange={(e) => {
                                setVendor({ ...vendor, cardmonth: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={yearsOption}
                              placeholder="Year"
                              value={{
                                label: vendor.cardyear,
                                value: vendor.cardyear,
                              }}
                              id="select8"
                              onChange={(e) => {
                                setVendor({ ...vendor, cardyear: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Security Code<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={vendor.cardsecuritycode}
                          sx={userStyle.input}
                          placeholder="Please Enter Security Code"
                          onChange={(e) => {
                            setVendor({
                              ...vendor,
                              cardsecuritycode: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("Card")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br />
              {modeofpay.includes("Cheque") && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cheque Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Cheque Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          value={vendor.chequenumber}
                          placeholder="Please Enter Cheque Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                chequenumber: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("Cheque")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br />
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isBtn}
                    sx={buttonStyles.buttonsubmit}
                    loadingPosition="end"
                    variant="contained"
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseviewalertvendor}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
        {/* // )} */}
      </>
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* VALIDATION */}
      {/* <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      /> */}
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />

      <Box>
        <Dialog
          open={vendorGrpOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{
            overflow: "auto",
            "& .MuiPaper-root": {
              overflow: "auto",
            },
            marginTop: "50px",
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                {" "}
                Add Vendor Grouping
              </Typography>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography> Vendor Group Name Exits</Typography>
                    <Selects
                      maxMenuHeight={100}
                      options={isVendorGroupMaster}
                      disabled={isExitsVendor}
                      placeholder="Please Select Name"
                      value={{
                        label:
                          vendorgroup.vendorgroupname === ""
                            ? "Please Select Name"
                            : vendorgroup.vendorgroupname,
                        value:
                          vendorgroup.vendorgroupname === ""
                            ? "Please Select Name"
                            : vendorgroup.vendorgroupname,
                      }}
                      onChange={(e) => {
                        setIsExitsVendor(false);
                        setVendorgroup({ vendorgroupname: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography> Vendor Group Name New</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={isExitsVendor === false ? true : false}
                      value={vendorgroup.vendorgroupname}
                      placeholder="Please Enter Name"
                      onChange={(e) => {
                        setIsExitsVendor(true);
                        setVendorgroup({ vendorgroupname: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography>Vendor Name</Typography>
                    <Typography>{vendor.vendorname}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Button
                  variant="contained"
                  sx={buttonStyles.btnUpload}
                  onClick={updateVendor}
                >
                  {" "}
                  Update{" "}
                </Button>
                <Button
                  variant="contained"
                  sx={buttonStyles.btncancel}
                  onClick={(e) => {
                    setIsExitsVendor(null);
                    setVendorgroup({ vendorgroupname: "" });
                  }}
                >
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      <Modal
        open={ifscModalOpen}
        onClose={handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        sx={{ marginTop: "80px" }}
      >
        <div
          style={{
            margin: "auto",
            backgroundColor: "white",
            padding: "20px",
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Enter IFSC Code</Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <OutlinedInput
            type="text"
            placeholder="Enter IFSC Code"
            name="ifsccode"
            style={{ height: "30px", margin: "10px" }}
            value={vendor.ifsccode}
            onChange={handleInputChange}
          />
          <LoadingButton
            variant="contained"
            loading={loading}
            color="primary"
            sx={{ borderRadius: "20px", marginLeft: "5px" }}
            onClick={fetchBankDetails}
          >
            Get Branch
          </LoadingButton>
          <br />
          {bankDetails && (
            <div>
              <Typography variant="subtitle1">
                Bank Name: {bankDetails.BANK}
              </Typography>
              <Typography variant="subtitle1">
                Branch Name: {bankDetails.BRANCH}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  padding: "0 10px",
                  ...buttonStyles?.buttonsubmit,
                }}
                onClick={(e) => {
                  const matchedBank = accounttypes.find((bank) => {
                    const labelBeforeHyphen = bank.label.split(" - ")[0];

                    return (
                      labelBeforeHyphen.toLowerCase()?.trim() ===
                      bankDetails.BANK.toLowerCase()?.trim()
                    );
                  });

                  setVendor({
                    ...vendor,
                    bankbranchname: String(bankDetails.BRANCH),
                    ifsccode: vendor.ifsccode,
                    bankname: matchedBank?.value,
                  });

                  handleModalClose();
                }}
              >
                Submit
              </Button>
              {/* Add more details as needed */}
            </div>
          )}
        </div>
      </Modal>
      <Dialog
        open={uploadPopupOpen}
        onClose={handleUploadPopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{ marginTop: "80px", zIndex: openPopupMalert ? 1400 : 1300 }}
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
          onClick={() => {
            console.log(refImage);
            console.log(isLightColor);
          }}
        >
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              {isLoading && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "5px",
                  }}
                >
                  <Skeleton
                    variant="text"
                    width={500}
                    height={25}
                    animation="wave"
                    sx={{
                      bgcolor: "#f5f5f5", // Background color of the skeleton
                      "&::after": {
                        background:
                          "linear-gradient(90deg, transparent, #1694f5, transparent)", // Wave color
                      },
                    }}
                  />
                  <Typography variant="body2">Please Wait...</Typography>
                </Box>
              )}
              {/* {showDragField ? ( */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onPaste={handlePaste}
              >
                {previewURL && refImageDrag.length > 0 ? (
                  <>
                    {refImageDrag.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button
                          onClick={() => handleRemoveFile(index)}
                          style={{ marginTop: "0px", color: "red" }}
                        >
                          X
                        </Button>
                        <div style={{ display: "flex", gap: "10px" }}>
                          {/* Color Picker */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{
                                color: "#555",
                                fontSize: "10px",
                              }}
                            >
                              BG Color
                            </Typography>
                            <input
                              type="color"
                              value={colorDrag}
                              onChange={handleColorChangeDrag}
                              style={{
                                width: "30px",
                                height: "30px",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                            />
                          </div>

                          {/* Submit Button */}
                          <LoadingButton
                            onClick={(e) => handleSubmitDrag(index)}
                            loading={bgbtnDrag}
                            variant="contained"
                            color="primary"
                            endIcon={<FormatColorFillIcon />}
                            sx={{
                              padding: "10px 10px",
                              fontSize: "8px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              borderRadius: "5px",
                              color: isLightColorDrag ? "black" : "white",
                              fontWeight: "600",
                              backgroundColor: colorDrag, // Dynamically set the background color
                              "&:hover": {
                                backgroundColor: `${colorDrag}90`, // Slightly transparent on hover for a nice effect
                              },
                              border: "1px solid  black",
                            }}
                          ></LoadingButton>
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon />{" "}
                      {"Drag and drop or Paste here (ctrl+v)"}
                    </div>
                  </div>
                )}
              </div>

              {/* ) : null} */}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  {/* {showUploadBtn ? ( */}
                  <Button
                    variant="contained"
                    component="label"
                    sx={buttonStyles.buttonsubmit}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={handleChangeImage}
                    />
                  </Button>
                  &ensp;
                  <Button
                    variant="contained"
                    onClick={showWebcam}
                    sx={userStyle.uploadbtn}
                  >
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true &&
                capturedImages.map((image, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={12}>
                      <Box
                        style={{
                          isplay: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "37px",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          height={50}
                          style={{ maxWidth: "-webkit-fill-available" }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {" "}
                        {image.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={12}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(image)}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "12px",
                              color: "#357AE8",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036",
                            },
                          }}
                          onClick={() => removeCapturedImage(index)}
                        >
                          <FaTrash
                            style={{
                              color: "#a73131",
                              fontSize: "12px",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {/* Color Picker */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{
                                color: "#555",
                                fontSize: "10px",
                              }}
                            >
                              BG Color
                            </Typography>
                            <input
                              type="color"
                              value={color[index]}
                              onChange={(e) => {
                                handleColorChangeCaptured(e, index);
                              }}
                              style={{
                                width: "30px",
                                height: "30px",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                            />
                          </div>

                          {/* Submit Button */}
                          <LoadingButton
                            onClick={(e) => {
                              handleSubmitNew(index, "captured");
                            }}
                            loading={bgbtnCaptured[index]}
                            variant="contained"
                            color="primary"
                            endIcon={<FormatColorFillIcon />}
                            sx={{
                              padding: "10px 10px",
                              fontSize: "8px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              borderRadius: "5px",
                              color: isLightColorCaptured[index]
                                ? "black"
                                : "white",
                              fontWeight: "600",
                              backgroundColor: colorCaptured[index], // Dynamically set the background color
                              "&:hover": {
                                backgroundColor: `${colorCaptured[index]}90`, // Slightly transparent on hover for a nice effect
                              },
                              border: "1px solid  black",
                            }}
                          ></LoadingButton>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              {refImage.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIcon(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {/* Color Picker */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Typography
                            variant="body1"
                            style={{
                              color: "#555",
                              fontSize: "10px",
                            }}
                          >
                            BG Color
                          </Typography>
                          <input
                            type="color"
                            value={color[index]}
                            onChange={(e) => {
                              handleColorChange(e, index);
                            }}
                            style={{
                              width: "30px",
                              height: "30px",
                              border: "none",
                              cursor: "pointer",
                              borderRadius: "5px",
                            }}
                          />
                        </div>

                        {/* Submit Button */}
                        <LoadingButton
                          onClick={(e) => {
                            handleSubmitNew(index, "upload");
                          }}
                          loading={bgbtn[index]}
                          variant="contained"
                          color="primary"
                          endIcon={<FormatColorFillIcon />}
                          sx={{
                            padding: "10px 10px",
                            fontSize: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            borderRadius: "5px",
                            color: isLightColor[index] ? "black" : "white",
                            fontWeight: "600",
                            backgroundColor: color[index], // Dynamically set the background color
                            "&:hover": {
                              backgroundColor: `${color[index]}90`, // Slightly transparent on hover for a nice effect
                            },
                            border: "1px solid  black",
                          }}
                        ></LoadingButton>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAll} sx={buttonStyles.buttonsubmit}>
            Ok
          </Button>
          <Button onClick={resetImage} sx={buttonStyles.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={buttonStyles.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isWebcamOpen}
        onClose={webcamClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={name}
            getImg={getImg}
            setGetImg={setGetImg}
            valNum={valNum}
            setValNum={setValNum}
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            setRefImage={setRefImage}
            setRefImageDrag={setRefImageDrag}
            setVendor={setVendor}
            vendor={vendor}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStore}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamClose}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPopupMalert}
        onClose={handleClosePopupMalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        PaperComponent={CustomPaper}
        sx={{ zIndex: 1500 }} // Higher zIndex to be on top
      >
        <Box sx={{ width: "350px" }}>
          {/* <DialogTitle id="alert-dialog-title">{popupTitle}</DialogTitle> */}
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {severityIcons[popupSeverityMalert]}
              <Typography
                sx={{ fontSize: "1.4rem", fontWeight: "600", color: "black" }}
              >
                {popupContentMalert}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClosePopupMalert}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
export default VendorPopup;
