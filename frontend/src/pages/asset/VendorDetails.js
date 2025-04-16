import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, Grid, IconButton,
  List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, Switch, TextareaAutosize, TextField, Typography,
  DialogTitle, Backdrop,
} from "@mui/material";
import axios from "axios";
import { City, Country, State } from "country-state-city";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint, } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

import Webcamimage from "../../components/WebCamVendorDuplicate";
import * as faceapi from "face-api.js";
import LoadingButton from "@mui/lab/LoadingButton";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { FaTrash } from "react-icons/fa";
import { makeStyles } from "@material-ui/core";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import CircularProgress from "@mui/material/CircularProgress";
let name = "create";

const LoadingBackdrop = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      open={open}
    >
      <div className="pulsating-circle">
        <CircularProgress color="inherit" className="loading-spinner" />
      </div>
      <Typography
        variant="h6"
        sx={{ marginLeft: 2, color: "#ffffff", fontWeight: "bold" }}
      >
        please wait...
      </Typography>
    </Backdrop>
  );
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

function VendorDetails() {


  const [selectedRowsVendorMaster, setSelectedRowsVendorMaster] = useState([])
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({
    vendorgrouping: [],
    expense: [],
    assetdetail: [],
    schedule: [],
    stock: [],
    manualstockentry: [],
  });

  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  //check delete model
  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => {
    setisCheckOpenbulk(true);
  };
  const handlebulkCloseCheck = () => {

    setisCheckOpenbulk(false);
  };

  const [colorDragEdit, setColorDragEdit] = useState('#FFFFFF');
  const [bgbtnDragEdit, setBgbtnDragEdit] = useState(false);
  const handleColorChangeDragEdit = (e) => {
    setColorDragEdit(e.target.value);
  };
  const handleSubmitDragEdit = async (index) => {
    setBgbtnDragEdit(true);
    if (!image || !color) return;

    const formData = new FormData();
    formData.append('image', imageDragEdit);
    formData.append('color', colorDragEdit);

    try {
      const response = await axios.post(SERVICE.REMOVEBG, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // setCroppedImage(response?.data?.image); // Set the base64 image
      setRefImageDragedit((prev) => {
        let updated = [...prev];
        let currentObject = {
          ...updated[index],
          preview: `${response?.data?.image}`
        };
        updated[index] = currentObject;
        return updated
      })
      setBgbtnDragEdit(false);
    } catch (error) {
      setBgbtnDragEdit(false);
      console.error('Error uploading image:', error);
    }
  };

  const isLightColorDragEdit = calculateLuminance(colorDragEdit);

  const [colorEdit, setColorEdit] = useState([]);
  const [bgbtnEdit, setBgbtnEdit] = useState([]);

  const [colorCapturedEdit, setColorCapturedEdit] = useState([]);
  const [bgbtnCapturedEdit, setBgbtnCapturedEdit] = useState([]);

  const handleColorChangeEdit = (e, index) => {
    setColorEdit((prev) => {
      let allColors = [...prev]
      allColors[index] = e.target.value
      const updated = allColors.map((color) => calculateLuminance(color));

      // Update the state for color and light color
      setIsLightColorEdit(updated);
      return allColors;
    });
  };
  const handleColorChangeCapturedEdit = (e, index) => {
    setColorCapturedEdit((prev) => {
      let allColors = [...prev]
      allColors[index] = e.target.value
      const updated = allColors.map((color) => calculateLuminance(color));

      // Update the state for color and light color
      setIsLightColorCapturedEdit(updated);
      return allColors;
    });
  };
  const [imageEdit, setImageEdit] = useState([])
  const [capturedImageEdit, setCapturedImageEdit] = useState([])
  const [imageDragEdit, setImageDragEdit] = useState([])

  const handleSubmitNewEdit = async (index, from) => {

    if (index === undefined || index < 0) {
      console.error("Invalid index provided.");
      return;
    }

    if (from === "upload") {
      setBgbtnEdit((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    } else {
      setBgbtnCapturedEdit((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    }

    const selectedImageEdit = from === "upload" ? imageEdit?.[index] : capturedImageEdit?.[index];
    const selectedColorEdit = from === "upload" ? colorEdit?.[index] : colorCapturedEdit?.[index];

    if (!selectedImageEdit || !selectedColorEdit) {
      console.error("Image or color not provided.");
      // Reset the button states in case of an error.
      if (from === "upload") {
        setBgbtnEdit((prev) => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      } else {
        setBgbtnCapturedEdit((prev) => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      }
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImageEdit);
    formData.append('color', selectedColorEdit);

    try {
      const response = await axios.post(SERVICE.REMOVEBG, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      // Example: Set the cropped image (if needed).
      // setCroppedImage(response?.data?.image);
      from === "upload" ? setRefImageedit((prev) => {
        let updated = [...prev];
        let currentObject = {
          ...updated[index],
          preview: `${response?.data?.image}`
        };
        updated[index] = currentObject;
        return updated
      }) : setCapturedImagesedit((prev) => {
        let updated = [...prev];
        let currentObject = {
          ...updated[index],
          preview: `${response?.data?.image}`
        };
        updated[index] = currentObject;
        return updated
      })
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      // Reset button states after the operation, regardless of success or failure.
      if (from === "upload") {
        setBgbtnEdit((prev) => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      } else {
        setBgbtnCapturedEdit((prev) => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      }
    }
  };


  const [isLightColorEdit, setIsLightColorEdit] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const [isLightColorCapturedEdit, setIsLightColorCapturedEdit] = useState([])

  const classes = useStyles();
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let nameedit = "edit";

  let exportColumnNames = [
    "Vendor ID",
    "Vendor Name",
    "Email ID",
    "Phone No",
    "WhatsApp No",
    "Address",
    "Country",
    "State",
    "City",
    "Pincode",
    "GST No",
    "Landline",
    "Contact Person Name",
    "Credit Days",
    "Mode Of Payments",
    "Payment Frequency",
    "Status",
  ];
  let exportRowValues = [
    "vendorid",
    "vendorname",
    "emailid",
    "phonenumber",
    "whatsappnumber",
    "address",
    "country",
    "state",
    "city",
    "pincode",
    "gstnumber",
    "landline",
    "contactperson",
    "creditdays",
    "modeofpayments",
    "paymentfrequency",
    "vendorstatus",
  ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [isBtn, setIsBtn] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  let newval = "VEN0001";
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

  const [modeofpay, setmodeofpay] = useState([]);
  const [modeofpayEdit, setmodeofpayEdit] = useState([]);
  const [cateCode, setCatCode] = useState([]);
  const [stdCode, setStdCode] = useState();
  const [lanNumber, setLanNumber] = useState();
  const [vendoredit, setVendoredit] = useState({});
  const [vendormaster, setVendormaster] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allVendoredit, setAllVendoredit] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [vendorCheck, setVendorcheck] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [openview, setOpenview] = useState(false);
  const [monthsOption, setMonthsOption] = useState([]);
  const [yearsOption, setYearsOption] = useState([]);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteVendor, setDeletevendor] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  //-------------------------------------------------------------------------------------------------------------

  const [colorDrag, setColorDrag] = useState('#FFFFFF');
  const [bgbtnDrag, setBgbtnDrag] = useState(false);
  const handleColorChangeDrag = (e) => {
    setColorDrag(e.target.value);
  };
  const handleSubmitDrag = async (index) => {
    setBgbtnDrag(true);
    if (!image || !color) return;

    const formData = new FormData();
    formData.append('image', imageDrag);
    formData.append('color', colorDrag);

    try {
      const response = await axios.post(SERVICE.REMOVEBG, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // setCroppedImage(response?.data?.image); // Set the base64 image
      setRefImageDrag((prev) => {
        let updated = [...prev];
        let currentObject = {
          ...updated[index],
          preview: `${response?.data?.image}`
        };
        updated[index] = currentObject;
        return updated
      })
      setBgbtnDrag(false);
    } catch (error) {
      setBgbtnDrag(false);
      console.error('Error uploading image:', error);
    }
  };

  const isLightColorDrag = calculateLuminance(colorDrag);

  const [color, setColor] = useState([]);
  const [bgbtn, setBgbtn] = useState([]);

  const [colorCaptured, setColorCaptured] = useState([]);
  const [bgbtnCaptured, setBgbtnCaptured] = useState([]);

  const handleColorChange = (e, index) => {
    setColor((prev) => {
      let allColors = [...prev]
      allColors[index] = e.target.value
      const updated = allColors.map((color) => calculateLuminance(color));

      // Update the state for color and light color
      setIsLightColor(updated);
      return allColors;
    });
  };
  const handleColorChangeCaptured = (e, index) => {
    setColorCaptured((prev) => {
      let allColors = [...prev]
      allColors[index] = e.target.value
      const updated = allColors.map((color) => calculateLuminance(color));

      // Update the state for color and light color
      setIsLightColorCaptured(updated);
      return allColors;
    });
  };
  const [image, setImage] = useState([])
  const [capturedImage, setCapturedImage] = useState([])
  const [imageDrag, setImageDrag] = useState([])

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

    const selectedImage = from === "upload" ? image?.[index] : capturedImage?.[index];
    const selectedColor = from === "upload" ? color?.[index] : colorCaptured?.[index];

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
    formData.append('image', selectedImage);
    formData.append('color', selectedColor);

    try {
      const response = await axios.post(SERVICE.REMOVEBG, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      // Example: Set the cropped image (if needed).
      // setCroppedImage(response?.data?.image);
      from === "upload" ? setRefImage((prev) => {
        let updated = [...prev];
        let currentObject = {
          ...updated[index],
          preview: `${response?.data?.image}`
        };
        updated[index] = currentObject;
        return updated
      }) : setCapturedImages((prev) => {
        let updated = [...prev];
        let currentObject = {
          ...updated[index],
          preview: `${response?.data?.image}`
        };
        updated[index] = currentObject;
        return updated
      })
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

  const [isLightColor, setIsLightColor] = useState([])
  const [isLightColorCaptured, setIsLightColorCaptured] = useState([])


  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
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
  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
  };


  const [file, setFile] = useState("");
  const [fileEdit, setFileEdit] = useState("");

  // Image Upload
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


  const [btnUploadEdit, setBtnUploadEdit] = useState(false);


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
                    const blob = new Blob([uint8Array], { type: 'image/png' });
                    setImage((prev) => [...prev, blob]);
                    setBgbtn((prev) => {
                      let availed = [...prev]
                      if (availed.length > 0) {
                        availed.push(false)
                      } else {
                        Array(newSelectedFiles.length).fill(false)
                      }
                      return availed;
                    })
                    setColor((prev) => {
                      let availed = [...prev];

                      // Check if there are any existing colors in the state
                      if (availed.length > 0) {
                        availed.push("#ffffff");
                      } else {
                        // If no colors are present, create a new array with default colors
                        availed = Array(newSelectedFiles.length).fill("#ffffff");
                      }

                      // Calculate luminance for the updated array of colors
                      const updated = availed.map((color) => calculateLuminance(color));

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

                  const base64Data = reader.result.split(',')[1]; // Get base64 data (without the prefix)
                  const binaryData = atob(base64Data); // Decode base64 data
                  const arrayBuffer = new ArrayBuffer(binaryData.length);
                  const uint8Array = new Uint8Array(arrayBuffer);

                  // Fill the array buffer with the decoded binary data
                  for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i);
                  }

                  // Create a Blob from the binary data
                  const blob = new Blob([uint8Array], { type: 'image/png' });
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
            return false
          }
        } catch (error) {
          setPopupContentMalert("Error in face detection!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return false
        } finally {
          setBtnUpload(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert("Error loading image!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setBtnUpload(false); // Disable loader in case of error
        return false
      };

      setFile(URL.createObjectURL(file));
    } else {
      setPopupContentMalert(
        "File size is greater than 1MB, please upload a file below 1MB.!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setBtnUpload(false);
      return false
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

  const handleDeleteFile = (index) => {

    const newSelectedFiles = [...refImage];
    const bgbtnArray = [...bgbtn]
    const colorArray = [...color]
    newSelectedFiles.splice(index, 1);
    bgbtnArray.splice(index, 1);
    colorArray.splice(index, 1);
    setRefImage(newSelectedFiles);
    setBgbtn(bgbtnArray)
    setColor(colorArray)
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

  const handleDrop = async (event) => {
    event.preventDefault();
    previewFile(event.dataTransfer.files[0]);
    const data = await handleChangeImageDrag(event)
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
  //-----------------------------------------------------------------------------------------------------------------------

  const handleUploadOverAlledit = () => {
    setUploadPopupOpenedit(false);
  };
  const [closeFileDialog, setCloseFileDialog] = useState(false);
  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
  const handleClickUploadPopupOpenedit = () => {
    setUploadPopupOpenedit(true);
  };
  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
  };

  function handleChangeImageEdit(e) {
    setIsLoading(true);

    setBtnUploadEdit(true); // Enable loader when the process starts
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
            console.log(faceDescriptor);
            const response = await axios.post(
              `${SERVICE.DUPLICATECANDIDATEFACEDETECTVISITOR}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                faceDescriptor: Array.from(faceDescriptor),
              }
            );
            console.log(
              response?.data?.matchfound,
              "response?.data?.matchfound"
            );
            if (response?.data?.matchfound) {
              setIsLoading(false);
              setPopupContentMalert("Image Already In Use!");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            } else {
              setCloseFileDialog(true);
              const files = e.target.files;
              let newSelectedFiles = [...refImageedit];
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
                    setRefImageedit(newSelectedFiles);
                    const base64Data = reader.result.split(",")[1]; // Get base64 data (without the prefix)
                    const binaryData = atob(base64Data); // Decode base64 data
                    const arrayBuffer = new ArrayBuffer(binaryData.length);
                    const uint8Array = new Uint8Array(arrayBuffer);

                    // Fill the array buffer with the decoded binary data
                    for (let i = 0; i < binaryData.length; i++) {
                      uint8Array[i] = binaryData.charCodeAt(i);
                    }

                    // Create a Blob from the binary data
                    const blob = new Blob([uint8Array], { type: 'image/png' });
                    setImageEdit((prev) => [...prev, blob]);
                    setBgbtnEdit((prev) => {
                      let availed = [...prev]
                      if (availed.length > 0) {
                        availed.push(false)
                      } else {
                        Array(newSelectedFiles.length).fill(false)
                      }
                      return availed;
                    })
                    setColorEdit((prev) => {
                      let availed = [...prev];

                      // Check if there are any existing colors in the state
                      if (availed.length > 0) {
                        availed.push("#ffffff");
                      } else {
                        // If no colors are present, create a new array with default colors
                        availed = Array(newSelectedFiles.length).fill("#ffffff");
                      }

                      // Calculate luminance for the updated array of colors
                      const updated = availed.map((color) => calculateLuminance(color));

                      // Update the state for color and light color
                      setIsLightColorEdit(updated);

                      return availed;
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }
              toDataURL(path, function (dataUrl) {
                setVendoredit({
                  ...vendoredit,
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
            }
            setIsLoading(false);

          } else {
            setIsLoading(false);
            console.log("NOOOO")
            setPopupContentMalert("No face detected!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } catch (error) {
          setIsLoading(false);
          console.log("NOOOO ERR")

          setPopupContentMalert("Error in face detection!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } finally {
          setIsLoading(false);

          setBtnUploadEdit(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert("Error loading image!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setBtnUploadEdit(false); // Disable loader in case of error
      };

      setFile(URL.createObjectURL(file));
    } else {
      setIsLoading(false);
      setCloseFileDialog(true);
      if (file !== undefined) {
        setPopupContentMalert(
          "File size is greater than 1MB, please upload a file below 1MB.!"
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setBtnUploadEdit(false);
      }
    }
  }

  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [refImageDragedit, setRefImageDragedit] = useState([]);
  const [valNumedit, setValNumedit] = useState(0);
  const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
  const [capturedImagesedit, setCapturedImagesedit] = useState([]);
  const [getImgedit, setGetImgedit] = useState(null);

  useEffect(() => {

    if (!capturedImagesedit) return;

    const newBlobs = [];
    const newBgbtnCaptured = [];
    const newColors = [];

    capturedImagesedit.forEach((item) => {
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
  }, [capturedImagesedit]);

  const removeCapturedImageedit = (index) => {
    const newCapturedImages = [...capturedImagesedit];
    newCapturedImages.splice(index, 1);
    setCapturedImagesedit(newCapturedImages);
  };

  const webcamOpenedit = () => {
    setIsWebcamOpenedit(true);
  };
  const webcamCloseedit = () => {
    setIsWebcamOpenedit(false);
    setGetImgedit("");
  };
  const webcamDataStoreedit = () => {
    setIsWebcamCapture(true);
    webcamCloseedit();
    setGetImgedit("");
  };
  const showWebcamedit = () => {
    webcamOpenedit();
  };

  const previewFileedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLedit(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFileedit = (index) => {
    const newSelectedFiles = [...refImageDragedit];
    newSelectedFiles.splice(index, 1);
    setRefImageDragedit(newSelectedFiles);
  };

  //first deletefile
  const handleDeleteFileedit = (index) => {
    const newSelectedFiles = [...refImageedit];
    newSelectedFiles.splice(index, 1);
    setRefImageedit(newSelectedFiles);
  };

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const resetImageedit = () => {
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };

  const handleDragOveredit = (event) => {
    event.preventDefault();
  };


  function handleChangeImageDragEdit(e) {
    setBtnUploadEdit(true); // Enable loader when the process starts
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
            console.log(faceDescriptor);
            const response = await axios.post(
              `${SERVICE.VENDORDUPLICATEFACEDETECTION}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                faceDescriptor: Array.from(faceDescriptor),
              }
            );
            console.log(
              response?.data?.matchfound,
              "response?.data?.matchfound"
            );
            if (response?.data?.matchfound) {
              setPopupContentMalert("Image Already In Use!");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            } else {

              let newSelectedFilesDrag = [...refImageDragedit];

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
                  setRefImageDragedit(newSelectedFilesDrag);
                  const base64Data = reader.result.split(',')[1]; // Get base64 data (without the prefix)
                  const binaryData = atob(base64Data); // Decode base64 data
                  const arrayBuffer = new ArrayBuffer(binaryData.length);
                  const uint8Array = new Uint8Array(arrayBuffer);

                  // Fill the array buffer with the decoded binary data
                  for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i);
                  }

                  // Create a Blob from the binary data
                  const blob = new Blob([uint8Array], { type: 'image/png' });
                  setImageDragEdit(blob);

                };
                reader.readAsDataURL(file);
              } else {

                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
              }


            }
          } else {
            setPopupContentMalert("No face detected!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } catch (error) {
          setPopupContentMalert("Error in face detection!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } finally {
          setBtnUploadEdit(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert("Error loading image!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setBtnUploadEdit(false); // Disable loader in case of error
      };

      setFileEdit(URL.createObjectURL(file));
    } else {
      if (file !== undefined) {
        setPopupContentMalert(
          "File size is greater than 1MB, please upload a file below 1MB.!"
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setBtnUploadEdit(false);
      }
    }
  }

  const handleDropedit = async (event) => {

    event.preventDefault();
    previewFileedit(event.dataTransfer.files[0]);
    console.log(event.dataTransfer.files[0])
    const data = await handleChangeImageDragEdit(event)

  };

  //--------------------------------------------------------------------------------
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    vendorstatus: true,
    vendorid: true,
    vendorname: true,
    emailid: true,
    phonenumber: true,
    whatsappnumber: true,
    address: true,
    country: true,
    state: true,
    city: true,
    pincode: true,
    gstnumber: true,
    landline: true,
    contactperson: true,
    creditdays: true,
    modeofpayments: true,
    paymentfrequency: true,
    checkbox: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
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
  const [selectedCountryc, setSelectedCountryc] = useState();
  const [selectedStatec, setSelectedStatec] = useState();
  const [selectedCityc, setSelectedCityc] = useState();

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

  const deleteTodoEdit = (index) => {
    setmodeofpayEdit(
      modeofpayEdit.filter((data) => {
        return data !== index;
      })
    );
    switch (index) {
      case "Bank Transfer":
        setVendoredit({
          ...vendoredit,
          bankname: "Please Select Bank Name",
          bankbranchname: "",
          accountholdername: "",
          accountnumber: "",
          ifsccode: "",
        });
        break;
      case "UPI":
        setVendoredit({ ...vendoredit, upinumber: "" });
        break;
      case "Cheque":
        setVendoredit({ ...vendoredit, chequenumber: "" });
        break;
      case "Card":
        setVendoredit({
          ...vendoredit,
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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = async () => {
    try {


      let value = [...new Set(selectedRowsVendorMaster.flat())]
      console.log(value, "value")
      setIsHandleChange(true);
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {
        const [resvendorgrouping, resexpense, resassetdetail, resschedule, resstock, resmanual] = await Promise.all([

          axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            vgroup: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            expense: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            matassetdetail: value,
          }),


          axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            schedule: value,

          }),
          axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            matstock: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            matproduct: value
          })
        ])
        console.log(resschedule?.data?.schedulepayment, "reschedule")
        setCheckVendorGrouping(resvendorgrouping?.data?.vendorgrouping);
        setCheckExpense(resexpense?.data?.expense);
        setCheckAssetdetail(resassetdetail?.data?.assetdetail);
        setCheckSchedule(resschedule?.data?.schedulepayment);
        setCheckstock(resstock?.data?.stock);
        setCheckmanualstock(resmanual?.data?.manualstockentry);



        let vendorgrouping = resvendorgrouping?.data?.vendorgrouping.map(t => t.vendor).flat();
        let expense = resexpense?.data?.expense.map(t => t.vendor).flat();
        let assetdetail = resassetdetail?.data?.assetdetail.map(t => t.material).flat();
        let schedule = resschedule?.data?.schedulepayment.map(t => t.vendor).flat();
        let stock = resstock?.data?.stock.map(t => t.vendor).flat();
        let manualstockentry = resmanual?.data?.manualstockentry.map(t => t.vendorname).flat();

        if (
          (resvendorgrouping?.data?.vendorgrouping).length > 0 ||
          (resexpense?.data?.expense).length > 0 ||
          (resassetdetail?.data?.assetdetail).length > 0 ||
          (resschedule?.data?.schedulepayment).length > 0 ||
          (resmanual?.data?.manualstockentry).length > 0
        ) {
          handleClickOpenCheckbulk();
          setOveraldeletecheck({
            ...overalldeletecheck,
            vendorgrouping: [... new Set(vendorgrouping)],
            expense: [...new Set(expense)],
            assetdetail: [...new Set(assetdetail)],
            schedule: [... new Set(schedule)],
            stock: [...new Set(stock)],
            manualstockentry: [...new Set(manualstockentry)]

          })


          setCheckVendorGrouping([])
          setCheckExpense([])
          setCheckAssetdetail([])
          setCheckSchedule([])
          setCheckstock([])
          setCheckmanualstock([])
        } else {
          setIsDeleteOpencheckbox(true);
        }
      }
    }
    catch
    (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };



  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  useEffect(() => {
    getPhoneNumber();
  }, [vendor.phonecheck, vendor.phonenumber]);

  useEffect(() => {
    getPhoneNumberEdit();
  }, [vendoredit.phonecheck, vendoredit.phonenumber]);

  useEffect(() => {
    fetchVendor();
    generateMonthsOptions();
    generateYearsOptions();
    generateDateOptions();
  }, []);
  useEffect(() => {
    fetchVendorAll()
  }, [isEditOpen, vendoredit]);


  useEffect(() => {
    setVendoredit({
      ...vendoredit,
      whatsappnumber:
        vendoredit.phonecheck === true
          ? vendoredit.phonenumber
          : vendoredit.whatsappnumber,
    });
  }, [isEditOpen]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    addSerialNumber(vendormaster);
  }, [vendormaster]);
  const [dateOption, setDateOption] = useState([])
  const dayOptions = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];
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
  const maxLength = 15; //gst number limit
  const gridRef = useRef(null);
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
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
  const handlechangecpincodeEdit = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === "") {
      setVendoredit({ ...vendoredit, pincode: inputValue });
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

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      vendorid: item.vendorid,
      vendorname: item.vendorname,
      emailid: item.emailid,
      phonenumber: item.phonenumber,
      whatsappnumber: item.whatsappnumber,
      address: item.address,
      country: item.country,
      state: item.state,
      city: item.city,
      pincode: item.pincode,
      gstnumber: item.gstnumber,
      landline: item.landline,
      contactperson: item.contactperson,
      creditdays: item.creditdays,
      modeofpayments: item.modeofpayments,
      paymentfrequency: item.paymentfrequency,
      vendorstatus: item.vendorstatus,
    };
  });
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },

    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
      headerClassName: "bold-header",
    },
    {
      field: "vendorstatus",
      headerName: "Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.vendorstatus,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
      cellRenderer: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            background:
              params.data.vendorstatus === "Active"
                ? "green"
                : params.data.vendorstatus === "In Active"
                  ? "red"
                  : "brown",
            color: "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
            cursor: "default",
          }}
        >
          {params.data.vendorstatus}
        </Button>
      ),
    },
    {
      field: "vendorid",
      headerName: "Vendor ID",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.vendorid,
      headerClassName: "bold-header",
    },
    {
      field: "vendorname",
      headerName: "Vendor Name",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.vendorname,
      headerClassName: "bold-header",
    },
    {
      field: "emailid",
      headerName: "Email ID",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.emailid,
      headerClassName: "bold-header",
    },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.phonenumber,
      headerClassName: "bold-header",
    },
    {
      field: "whatsappnumber",
      headerName: "Whatsapp Number",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.whatsappnumber,
      headerClassName: "bold-header",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.address,
      headerClassName: "bold-header",
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.country,
      headerClassName: "bold-header",
    },
    {
      field: "state",
      headerName: "State",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.state,
      headerClassName: "bold-header",
    },
    {
      field: "city",
      headerName: "City",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.city,
      headerClassName: "bold-header",
    },
    {
      field: "pincode",
      headerName: "Pincode",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.pincode,
      headerClassName: "bold-header",
    },
    {
      field: "gstnumber",
      headerName: "GstNumber",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.gstnumber,
      headerClassName: "bold-header",
    },
    {
      field: "landline",
      headerName: "LandLine",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.landline,
      headerClassName: "bold-header",
    },
    {
      field: "contactperson",
      headerName: "Contact Person Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.contactperson,
      headerClassName: "bold-header",
    },
    {
      field: "creditdays",
      headerName: "Credit days",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.creditdays,
      headerClassName: "bold-header",
    },
    {
      field: "modeofpayments",
      headerName: "Mode Of Payments",
      flex: 0,
      width: 130,
      minHeight: "80px",
      hide: !columnVisibility.modeofpayments,
      headerClassName: "bold-header",
    },
    {
      field: "paymentfrequency",
      headerName: "Payment Frequency",
      flex: 0,
      width: 130,
      minHeight: "80px",
      hide: !columnVisibility.paymentfrequency,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 280,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("evendormaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getCode(params.data.id, params.data.vendorname);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("dvendormaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.vendorname);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vvendormaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              {" "}
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("ivendormaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              {" "}
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />{" "}
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const handleMobile = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Phone number can't more than 10 characters!");
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
  const getPhoneNumberEdit = () => {
    if (vendoredit.phonecheck) {
      setVendoredit({ ...vendoredit, whatsappnumber: vendor.phonenumber });
    } else {
      setVendoredit({ ...vendoredit, whatsappnumber: "" });
    }
  };
  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );
  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box
      style={{
        padding: "10px",
        minWidth: "325px",
        "& .MuiDialogContent-root": { padding: "10px 0" },
      }}
    >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        {" "}
        <CloseIcon />{" "}
      </IconButton>
      <Box sx={{ position: "relative", margin: "10px" }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={
                  column.field === "checkbox" ? "Checkbox" : column.headerName
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              {" "}
              Show All{" "}
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false;
                });
                setColumnVisibility(newColumnVisibility);
              }}
            >
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    checkbox: selectedRows.includes(row.id),
  }));
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  const [vendorGrpOpen, setVendorgrpOpen] = useState(false);
  const [vendorgroup, setVendorgroup] = useState({ vendorgroupname: "" })
  //vendor grouping add popup
  const handleClickVendorgrpOpen = () => {
    setVendorgrpOpen(true);
  };
  const handleClickVendorgrpClose = () => {
    setVendorgrpOpen(false);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [CheckVendorGrouping, setCheckVendorGrouping] = useState([]);
  const [checkexpense, setCheckExpense] = useState([]);
  const [checkassetdetail, setCheckAssetdetail] = useState([]);
  const [checkSchedule, setCheckSchedule] = useState([]);
  const [checkstock, setCheckstock] = useState([]);
  const [checkmanualstock, setCheckmanualstock] = useState([]);




  const rowData = async (id, vendorname) => {
    setPageName(!pageName)
    try {

      const [res, resvendorgrouping, resexpense, resassetdetail, resschedule, resstock, resmanual] = await Promise.all([
        axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),
        axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          vgroup: [vendorname],
        }),
        axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          expense: [vendorname],
        }),
        axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          matassetdetail: [vendorname],
        }),


        axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          schedule: [vendorname],

        }),
        axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          matstock: [vendorname],
        }),
        axios.post(SERVICE.OVERALL_DELETE_VENDOR_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          matproduct: [vendorname]
        })
      ])

      // let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });
      setDeletevendor(res?.data?.svendordetails);

      setCheckVendorGrouping(resvendorgrouping?.data?.vendorgrouping);
      setCheckExpense(resexpense?.data?.expense);
      setCheckAssetdetail(resassetdetail?.data?.assetdetail);
      setCheckSchedule(resschedule?.data?.schedulepayment);
      setCheckstock(resstock?.data?.stock);
      setCheckmanualstock(resmanual?.data?.manualstockentry);

      if (
        (resvendorgrouping?.data?.vendorgrouping).length > 0 ||
        (resexpense?.data?.expense).length > 0 ||
        (resassetdetail?.data?.assetdetail).length > 0 ||
        (resstock?.data?.stock).length > 0 ||
        (resschedule?.data?.schedulepayment).length > 0 ||
        (resmanual?.data?.manualstockentry).length > 0
      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }




      // handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let Vendorsid = deleteVendor?._id;
  const delVendor = async () => {
    setPageName(!pageName)
    try {
      if (Vendorsid) {
        await axios.delete(`${SERVICE.SINGLE_VENDORDETAILS}/${Vendorsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchVendor();
        handleCloseMod();
        setPage(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delVendorcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_VENDORDETAILS}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchVendor();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const delaccountheadwithoutlink = async () => {
    try {
      let valfilter = [
        ...overalldeletecheck.vendorgrouping,
        ...overalldeletecheck.expense,
        ...overalldeletecheck.assetdetail,
        ...overalldeletecheck.schedule,
        ...overalldeletecheck.stock,
        ...overalldeletecheck.manualstockentry
      ];

      let filtered = rowDataTable.filter(d => !valfilter.some(item => d.vendorname === item))?.flatMap(d => selectedRows?.filter(item => d.id === item));
      console.log(filtered, "filtered")
      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_VENDORDETAILS}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handlebulkCloseCheck();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchVendor();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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

  //bank name options
  const accounttypes = [
    { value: "ALLAHABAD BANK", label: "ALLAHABAD BANK" },
    { value: "ANDHRA BANK", label: "ANDHRA BANK" },
    { value: "AXIS BANK", label: "AXIS BANK" },
    { value: "STATE BANK OF INDIA", label: "STATE BANK OF INDIA" },
    { value: "BANK OF BARODA", label: "BANK OF BARODA" },
    { value: "CITY UNION BANK", label: "CITY UNION BANK" },
    { value: "UCO BANK", label: "UCO BANK" },
    { value: "UNION BANK OF INDIA", label: "UNION BANK OF INDIA" },
    { value: "BANK OF INDIA", label: "BANK OF INDIA" },
    { value: "BANDHAN BANK LIMITED", label: "BANDHAN BANK LIMITED" },
    { value: "CANARA BANK", label: "CANARA BANK" },
    { value: "GRAMIN VIKASH BANK", label: "GRAMIN VIKASH BANK" },
    { value: "CORPORATION BANK", label: "CORPORATION BANK" },
    { value: "INDIAN BANK", label: "INDIAN BANK" },
    { value: "INDIAN OVERSEAS BANK", label: "INDIAN OVERSEAS BANK" },
    { value: "ORIENTAL BANK OF COMMERCE", label: "ORIENTAL BANK OF COMMERCE" },
    { value: "PUNJAB AND SIND BANK", label: "PUNJAB AND SIND BANK" },
    { value: "PUNJAB NATIONAL BANK", label: "PUNJAB NATIONAL BANK" },
    { value: "RESERVE BANK OF INDIA", label: "RESERVE BANK OF INDIA" },
    { value: "SOUTH INDIAN BANK", label: "SOUTH INDIAN BANK" },
    { value: "UNITED BANK OF INDIA", label: "UNITED BANK OF INDIA" },
    { value: "CENTRAL BANK OF INDIA", label: "CENTRAL BANK OF INDIA" },
    { value: "VIJAYA BANK", label: "VIJAYA BANK" },
    { value: "DENA BANK", label: "DENA BANK" },
    {
      value: "BHARATIYA MAHILA BANK LIMITED",
      label: "BHARATIYA MAHILA BANK LIMITED",
    },
    { value: "FEDERAL BANK LTD", label: "FEDERAL BANK LTD" },
    { value: "HDFC BANK LTD", label: "HDFC BANK LTD" },
    { value: "ICICI BANK LTD", label: "ICICI BANK LTD" },
    { value: "IDBI BANK LTD", label: "IDBI BANK LTD" },
    { value: "PAYTM BANK", label: "PAYTM BANK" },
    { value: "FINO PAYMENT BANK", label: "FINO PAYMENT BANK" },
    { value: "INDUSIND BANK LTD", label: "INDUSIND BANK LTD" },
    { value: "KARNATAKA BANK LTD", label: "KARNATAKA BANK LTD" },
    { value: "KOTAK MAHINDRA BANK", label: "KOTAK MAHINDRA BANK" },
    { value: "YES BANK LTD", label: "YES BANK LTD" },
    { value: "SYNDICATE BANK", label: "SYNDICATE BANK" },
    { value: "BANK OF MAHARASHTRA", label: "BANK OF MAHARASHTRA" },
    { value: "DCB BANK", label: "DCB BANK" },
    { value: "IDFC BANK", label: "IDFC BANK" },
    {
      value: "JAMMU AND KASHMIR BANK BANK",
      label: "JAMMU AND KASHMIR BANK BANK",
    },
    { value: "KARUR VYSYA BANK", label: "KARUR VYSYA BANK" },
    { value: "RBL BANK", label: "RBL BANK" },
    { value: "TMB BANK", label: "TMB BANK" },
    { value: "DHANLAXMI BANK", label: "DHANLAXMI BANK" },
    { value: "CSB BANK", label: "CSB BANK" },
  ];
  const modeofpayments = [
    { value: "Cash", label: "Cash" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "UPI", label: "UPI" },
    { value: "Card", label: "Card" },
    { value: "Cheque", label: "Cheque" },
  ];
  const paymentfrequency = [
    { value: "Daily", label: "Daily" },
    { value: "Monthly", label: "Monthly" },
    { value: "BillWise", label: "BillWise" },
    { value: "Weekly", label: "Weekly" },
  ];
  const vendorstatusopt = [
    { value: "Active", label: "Active" },
    { value: "In Active", label: "In Active" },
  ];
  const cardtypes = [
    { value: "Credit Card", label: "Credit Card" },
    { value: "Debit Card", label: "Debit Card" },
    { value: "Visa Card", label: "Visa Card" },
    { value: "Master Card", label: "Master Card" },
  ];

  let allUploadedFiles = [];
  //add function
  const sendRequest = async () => {
    setIsBtn(true);
    let filtered = Array.from(new Set(modeofpay));
    try {
      let addVendorDetails = await axios.post(SERVICE.ADD_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorid: String(newval),
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

        paymentfrequency: String(vendor.paymentfrequency === "Please Select Payment Frequency" ? "" : vendor.paymentfrequency),
        vendorstatus: String(vendor.vendorstatus),
        monthlyfrequency: String(vendor.paymentfrequency === "Monthly" ? vendor.monthlyfrequency : ""),
        weeklyfrequency: String(vendor.paymentfrequency === "Weekly" ? vendor.weeklyfrequency : ""),

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
          vendor?.faceDescriptor?.length > 0
            ? vendor?.faceDescriptor
            : [],

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
      await handleClickVendorgrpOpen();

    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const updateVendor = async () => {
    if (vendorgroup.vendorgroupname === "") {
      setPopupContentMalert("Please Enter VendorGroup Name");
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
      await fetchVendor();
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
    }

  }
  //submit option for saving
  const handlemodeofpay = () => {
    if (modeofpay.includes(vendor.modeofpayments === "Please Select Mode of Payments")) {
      setPopupContentMalert("Please Select Mode of Payments");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (modeofpay.includes(vendor.modeofpayments)) {
      setPopupContentMalert("ToDo is Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setmodeofpay([...modeofpay, vendor.modeofpayments]);
    }
  };


  const handlemodeofpayEdit = () => {
    if (vendoredit.modeofpayments === "Please Select Mode of Payments") {
      setPopupContentMalert("Please Select Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (modeofpayEdit.includes(vendoredit.modeofpayments)) {
      setPopupContentMalert("To Do is Already Added!!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else {
      setmodeofpayEdit([...modeofpayEdit, vendoredit.modeofpayments]);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = vendormaster.some(
      (item) =>
        item.vendorname.toLowerCase() === (vendor.vendorname).toLowerCase()
    );

    if (vendor.vendorname === "") {
      setPopupContentMalert("Please Enter Vendor Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (refImage?.length === 0 && refImageDrag?.length === 0 && capturedImages?.length === 0) {
    //   setPopupContentMalert("Please Upload the Photograph!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (vendor.address === "") {
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
    }
    else if (vendor.vendorstatus === "") {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (vendor.paymentfrequency === "Please Select Payment Frequency") {
      setPopupContentMalert("Please Select Payment Frequency!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      vendor.paymentfrequency === "Monthly" && (vendor.monthlyfrequency === "" || !vendor.monthlyfrequency)
    ) {
      setPopupContentMalert("Please Select Monthly Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      vendor.paymentfrequency === "Weekly" && (vendor.weeklyfrequency === "" || !vendor.weeklyfrequency)
    ) {
      setPopupContentMalert("Please Select Weekly Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (vendor.modeofpayments === "Please Select Mode of Payments") {
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
      setPopupContentMalert("Data Already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setVendor({
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
    setmodeofpay([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setStdCode("");
    setLanNumber("");
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //get single row to edit....
  const getCode = async (e, vendorname) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      console.log(res?.data?.svendordetails, "res?.data?.svendordetails")
      setOvProj(vendorname);
      getOverallEditSection(vendorname);
      setVendoredit({
        ...res?.data?.svendordetails,
        modeofpayments: res?.data?.svendordetails.modeofpayments[0],
      });
      setRefImageedit(res?.data?.svendordetails?.files);

      // let blobedDatas = res?.data?.svendordetails?.files?.map((data) => {
      //   const base64Data = data?.preview?.split(",")[1]; // Get base64 data (without the prefix)
      //   const binaryData = atob(base64Data); // Decode base64 data
      //   const arrayBuffer = new ArrayBuffer(binaryData.length);
      //   const uint8Array = new Uint8Array(arrayBuffer);

      //   // Fill the array buffer with the decoded binary data
      //   for (let i = 0; i < binaryData.length; i++) {
      //     uint8Array[i] = binaryData.charCodeAt(i);
      //   }

      //   // Create a Blob from the binary data
      //   const blob = new Blob([uint8Array], { type: 'image/png' });
      //   return blob;
      // })
      // setImageEdit(blobedDatas);
      // setColorEdit((prev) => {

      //   // If no colors are present, create a new array with default colors
      //   let availed = Array(blobedDatas.length).fill("#ffffff");


      //   // Calculate luminance for the updated array of colors
      //   const updated = availed.map((color) => calculateLuminance(color));

      //   // Update the state for color and light color
      //   setIsLightColorEdit(updated);

      //   return availed;
      // });

      setmodeofpayEdit(res?.data?.svendordetails.modeofpayments);
      const country = Country.getAllCountries().find(
        (country) => country.name === res?.data?.svendordetails?.country
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === res?.data?.svendordetails?.state
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === res?.data?.svendordetails?.city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCityc(city);
      const landlinenumber = res?.data?.svendordetails?.landline;
      const firstFour = landlinenumber.slice(0, 4);
      setStdCode(firstFour);
      const numbersExceptFirstFour = landlinenumber.slice(4);
      setLanNumber(numbersExceptFirstFour);
      handleClickOpenEdit();
    } catch (err) {
      console.log(err, "err")
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [imagesview, setImagesView] = useState([]);
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendoredit(res?.data?.svendordetails);
      setImagesView(res?.data?.svendordetails?.files);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendoredit(res?.data?.svendordetails);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Project updateby edit page...
  let updateby = vendoredit?.updatedby;
  let addedby = vendoredit?.addedby;
  let vendorid = vendoredit?._id;
  //editing the single data...
  let allUploadedFilesEdit = [];

  const getOverallEditSection = async (e) => {
    console.log(e, "e")
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_VENDOR_MASTER_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);


      setGetOverallCount(`The ${e} is linked in
     ${res?.data?.vendorgrouping?.length > 0 ? "Vendor Grouping ," : ""}
     ${res?.data?.expense?.length > 0 ? "Expense ," : ""}
    ${res?.data?.assetdetail?.length > 0 ? "Asset List ," : ""}
      ${res?.data?.schedulepayment?.length > 0 ? "Schedule Payment," : ""}
        ${res?.data?.stock?.length > 0 ? "Stock Purchase ," : ""} 
    ${res?.data?.manualstockentry?.length > 0 ? "Manual Stock Entry ," : ""} 
    whether you want to do changes ..??`);
    } catch (err) {
      console.log(err, "err")
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_VENDOR_MASTER_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });

      sendEditRequestOverall(
        res?.data?.vendorgrouping,
        res?.data?.expense,
        res?.data?.assetdetail,
        res?.data?.schedulepayment,
        res?.data?.stock,
        res?.data?.manualstockentry

      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (
    vendorgrouping, expense, assetdetail, schedulepayment, stock, manualstockentry) => {
    try {
      if (vendorgrouping.length > 0) {
        let answ = vendorgrouping.map((d, i) => {

          let res = axios.put(`${SERVICE.SINGLE_VENDORGROUPING}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            vendor: vendoredit.vendorname,

          });
        });
      }
      if (expense.length > 0) {
        let answ = expense.map((d, i) => {
          let res = axios.put(`${SERVICE.EXPENSES_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            vendorname: String(vendoredit.vendorname),

          });
        });
      }
      // if (assetdetail.length > 0) {
      //   let answ = assetdetail.map((d, i) => {
      //     let res = axios.put(`${SERVICE.ASSETDETAIL_SINGLE}/${d._id}`, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },
      //       vendor: String(vendoredit.vendorname),
      //       address: vendoredit.address,
      //       phonenumber: vendoredit.phonenumber,
      //     });
      //   });
      // }


      if (assetdetail.length > 0) {

        let assetdetailaltered = assetdetail.map((d, i) => {

          return {
            ...d,
            subcomponent: d.subcomponent.map(item => {
              if (item.vendor === ovProj) {
                return {
                  ...item,
                  vendor: String(vendoredit.vendorname),
                  address: vendoredit.address,
                  phonenumber: vendoredit.phonenumber,
                }
              } else {

                return item
              }
            })
          }
        })



        let answ = assetdetailaltered.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETDETAIL_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            vendor: String(vendoredit.vendorname),
            address: vendoredit.address,
            phonenumber: vendoredit.phonenumber,
            subcomponent: d.subcomponent
          });
        });
      }

      if (schedulepayment.length > 0) {
        let answ = schedulepayment.map((d, i) => {
          let res = axios.put(`${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            vendor: String(vendoredit.vendorname),
          });
        });
      }





      // if (stock.length > 0) {
      //   let answ = stock.map((d, i) => {
      //     let res = axios.put(`${SERVICE.STOCKPURCHASE_SINGLE}/${d._id}`, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },
      //       vendor: String(vendoredit.vendorname),
      //       gstno: vendoredit.gstnumber
      //     });
      //   });
      // }




      if (stock.length > 0) {

        let stockaltered = stock.map((d, i) => {

          return {
            ...d,
            subcomponent: d.subcomponent.map(item => {
              if (item.vendor === ovProj) {
                return {
                  ...item,
                  vendor: String(vendoredit.vendorname),
                  gstno: vendoredit.gstnumber,

                }
              } else {

                return item
              }
            })
          }
        })



        let answ = stockaltered.map((d, i) => {
          let res = axios.put(`${SERVICE.STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            vendor: String(vendoredit.vendorname),
            gstno: vendoredit.gstnumber,
            subcomponent: d.subcomponent
          });
        });
      }

      // if (manualstockentry.length > 0) {
      //   let answ = manualstockentry.map((d, i) => {
      //     let res = axios.put(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${d._id}`, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },
      //       vendorname: String(vendoredit.vendorname),
      //       gstno: vendoredit.gstnumber
      //     });
      //   });
      // }

      if (manualstockentry.length > 0) {

        let manualstockentryaltered = manualstockentry.map((d, i) => {

          return {
            ...d,
            subcomponent: d.subcomponent.map(item => {
              if (item.vendor === ovProj) {
                return {
                  ...item,
                  vendor: String(vendoredit.vendorname),
                  gstno: vendoredit.gstnumber,
                  address: vendoredit.address,
                  phonenumber: vendoredit.phonenumber,
                }
              } else {

                return item
              }
            })
          }
        })



        let answ = manualstockentryaltered.map((d, i) => {
          let res = axios.put(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            vendorname: String(vendoredit.vendorname),
            gstno: vendoredit.gstnumber,
            subcomponent: d.subcomponent
          });
        });
      }


    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };





  const sendEditRequest = async () => {
    setPageName(!pageName)
    let filtered = Array.from(new Set(modeofpayEdit));
    try {
      let res = await axios.put(`${SERVICE.SINGLE_VENDORDETAILS}/${vendorid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorname: String(vendoredit.vendorname),
        emailid: String(vendoredit.emailid),
        phonenumber: Number(vendoredit.phonenumber),
        phonenumberone: Number(vendoredit.phonenumberone),
        phonenumbertwo: Number(vendoredit.phonenumbertwo),
        phonenumberthree: Number(vendoredit.phonenumberthree),
        phonenumberfour: Number(vendoredit.phonenumberfour),
        whatsappnumber: Number(vendoredit.whatsappnumber),
        phonecheck: Boolean(vendoredit.phonecheck),
        address: String(vendoredit.address),
        vendorstatus: String(vendoredit.vendorstatus),
        country: String(
          selectedCountryc?.name == undefined ? "" : selectedCountryc?.name
        ),
        state: String(
          selectedStatec?.name == undefined ? "" : selectedStatec?.name
        ),
        city: String(
          selectedCityc?.name == undefined ? "" : selectedCityc?.name
        ),
        pincode: String(vendoredit.pincode),
        gstnumber: String(vendoredit.gstnumber),
        landline: String(stdCode && lanNumber ? `${stdCode}${lanNumber}` : ""),
        contactperson: String(vendoredit.contactperson),
        creditdays: Number(vendoredit.creditdays),
        modeofpayments: [...filtered],
        paymentfrequency: String(vendoredit.paymentfrequency === "Please Select Mode of Payments" ? "" : vendoredit.paymentfrequency),
        monthlyfrequency: String(vendoredit.paymentfrequency === "Monthly" ? vendoredit.monthlyfrequency : ""),
        weeklyfrequency: String(vendoredit.paymentfrequency === "Weekly" ? vendoredit.weeklyfrequency : ""),
        bankname: filtered.includes("Bank Transfer")
          ? String(vendoredit.bankname)
          : "",
        bankbranchname: filtered.includes("Bank Transfer")
          ? vendoredit.bankbranchname
          : "",
        accountholdername: filtered.includes("Bank Transfer")
          ? vendoredit.accountholdername
          : "",
        accountnumber: filtered.includes("Bank Transfer")
          ? vendoredit.accountnumber
          : "",
        ifsccode: filtered.includes("Bank Transfer") ? vendoredit.ifsccode : "",

        upinumber: filtered.includes("UPI") ? vendoredit.upinumber : "",

        cardnumber: filtered.includes("Card") ? vendoredit.cardnumber : "",
        cardholdername: filtered.includes("Card")
          ? vendoredit.cardholdername
          : "",
        cardtransactionnumber: filtered.includes("Card")
          ? vendoredit.cardtransactionnumber
          : "",
        cardtype: filtered.includes("Card") ? vendoredit.cardtype : "",
        cardmonth: filtered.includes("Card") ? vendoredit.cardmonth : "",
        cardyear: filtered.includes("Card") ? vendoredit.cardyear : "",
        cardsecuritycode: filtered.includes("Card")
          ? vendoredit.cardsecuritycode
          : "",

        faceDescriptor:
          vendoredit?.faceDescriptor?.length > 0
            ? vendoredit?.faceDescriptor
            : [],

        files: allUploadedFilesEdit.concat(refImageedit, refImageDragedit, capturedImagesedit),

        chequenumber: filtered.includes("Cheque")
          ? vendoredit.chequenumber
          : "",
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setRefImageedit([]);
      setRefImageDragedit([]);
      setCapturedImageEdit([]);
      await getOverallEditSectionUpdate()
      await fetchVendor();
      setStdCode("");
      setLanNumber("");
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmit = async (e) => {
    e.preventDefault();
    fetchVendorAll();

    const isNameMatch = allVendoredit.some(
      (item) =>
        item.vendorname.toLowerCase() === vendoredit.vendorname.toLowerCase()
    );
    if (vendoredit.vendorname === "") {
      setPopupContentMalert("Please Enter Vendor Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (refImageedit?.length === 0 && refImageDragedit?.length === 0 && capturedImagesedit?.length === 0) {
    //   setPopupContentMalert("Please Upload the Photograph!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }

    else if (vendoredit.address === "") {
      setPopupContentMalert("Please Enter Address!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedCountryc?.isoCode !== selectedStatec?.countryCode) {
      setPopupContentMalert("Please Select The Correct State!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedCountryc?.isoCode !== selectedCityc?.countryCode ||
      selectedStatec?.isoCode !== selectedCityc?.stateCode
    ) {
      setPopupContentMalert("Please Select The Correct City!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      vendoredit.vendorstatus === "" || !vendoredit.vendorstatus
    ) {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      vendoredit.paymentfrequency === "Please Select Payment Frequency"
    ) {
      setPopupContentMalert("Please Select Payment Frequency!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      vendoredit.paymentfrequency === "Monthly" && (vendoredit.monthlyfrequency === "" || !vendoredit.monthlyfrequency)
    ) {
      setPopupContentMalert("Please Select Monthly Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      vendoredit.paymentfrequency === "Weekly" && (vendoredit.weeklyfrequency === "" || !vendoredit.weeklyfrequency)
    ) {
      setPopupContentMalert("Please Select Weekly Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    //  else if (vendoredit.modeofpayments === "Please Select Mode of Payments") {
    //   setPopupContentMalert("Please Select Mode of Payments!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      modeofpayEdit.includes("Bank Transfer") &&
      (vendoredit.bankname === "Please Select Bank Name" ||
        vendoredit.bankname === "")
    ) {
      setPopupContentMalert("Please Select Bank Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      vendoredit.bankbranchname === ""
    ) {
      setPopupContentMalert("Please Enter Bank Branch Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      vendoredit.accountholdername === ""
    ) {
      setPopupContentMalert("Please Enter Account Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      vendoredit.accountnumber === ""
    ) {
      setPopupContentMalert("Please Enter Account Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      vendoredit.ifsccode === ""
    ) {
      setPopupContentMalert("Please Enter IFSC Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpayEdit.includes("UPI") && vendoredit.upinumber === "") {
      setPopupContentMalert("Please Enter UPI Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpayEdit.includes("Card") && vendoredit.cardnumber === "") {
      setPopupContentMalert("Please Enter Card Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      vendoredit.cardholdername === ""
    ) {
      setPopupContentMalert("Please Enter Card Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      vendoredit.cardtransactionnumber === ""
    ) {
      setPopupContentMalert("Please Enter Card Transaction Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      (vendoredit.cardtype === "Please Select Card Type" ||
        vendoredit.cardtype === "")
    ) {
      setPopupContentMalert("Please Select Card Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      (vendoredit.cardmonth === "Month" || vendoredit.cardmonth === "")
    ) {
      setPopupContentMalert("Please Select Expire Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      (vendoredit.cardyear === "Year" || vendoredit.cardyear === "")
    ) {
      setPopupContentMalert("Please Select Expire Year!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendoredit.modeofpayments === "Card" &&
      vendoredit.cardsecuritycode === ""
    ) {
      setPopupContentMalert("Please Enter Card Security Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Cheque") &&
      vendoredit.chequenumber === ""
    ) {
      setPopupContentMalert("Please Enter Cheque Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpayEdit.length === 0) {
      setPopupContentMalert("Please Insert Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }


    else if (vendoredit.vendorname != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }

    else {
      sendEditRequest();
    }
  };
  //get all  vendordetails.
  const fetchVendor = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorcheck(true);
      setCatCode(res_vendor?.data?.vendordetails);
      setVendormaster(res_vendor?.data?.vendordetails.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        modeofpayments: item.modeofpayments === "Please Select Mode of Payments" ? "" : item.modeofpayments,
        paymentfrequency: item.paymentfrequency === "Please Select Payment Frequency" ? "" : item.paymentfrequency,

      })));
      // setAllVendoredit(
      //   res_vendor?.data?.vendordetails.filter(
      //     (item) => item._id !== vendoredit._id
      //   )
      // );
    } catch (err) {
      setVendorcheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchVendorAll = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllVendoredit(
        res_vendor?.data?.vendordetails.filter(
          (item) => item._id !== vendoredit._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Vendor Details.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Vendor Details",
    pageStyle: "print",
  });
  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  const totalPages = Math.ceil(filteredDatas.length / pageSize);
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

  const [fileFormat, setFormat] = useState("");

  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Vendor Details"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }

  useEffect(() => {
    getapi();
  }, []);


  const getLinkedLabelItem = (overalldeletecheck) => {
    const {
      vendorgrouping = [],
      expense = [],
      schedule = [],
      assetdetail = [],
      stock = [],
      manualstockentry = []
    } = overalldeletecheck;
    const labels = [];

    vendorgrouping.forEach(item => labels.push(item));
    expense.forEach(item => labels.push(item));

    schedule.forEach(item => labels.push(item));
    assetdetail.forEach(item => labels.push(item));

    stock.forEach(item => labels.push(item));
    manualstockentry.forEach(item => labels.push(item));
    // Remove duplicates using a Set
    const uniqueLabels = [...new Set(labels)];
    console.log(uniqueLabels, "uniqueLabels")
    return uniqueLabels.join(", ");
  };

  const getLinkedLabel = (overalldeletecheck) => {
    const {
      vendorgrouping = [],
      expense = [],
      assetdetail = [],
      schedule = [],
      stock = [],
      manualstockentry = []
    } = overalldeletecheck;
    const labels = [];

    if (vendorgrouping.length > 0) labels.push("Vendor Grouping");
    if (expense.length > 0) labels.push("Expense");
    if (assetdetail.length > 0) labels.push("Asset Details List");


    if (schedule.length > 0) labels.push("Schedule Payment Master");
    if (stock.length > 0) labels.push("Stock Purchase");
    if (manualstockentry.length > 0) labels.push("Manual Stock Entry");
    // console.log(labels, "labels")
    return labels.join(", ");
  };

  const getFilteredUnits = (vendormaster, selectedRows, overalldeletecheck) => {
    const {
      vendorgrouping = [],
      expense = [],
      assetdetail = [],
      schedule = [],
      stock = [],
      manualstockentry = []
    } = overalldeletecheck;
    const allConditions = [...new Set([
      ...vendorgrouping, ...expense,
      ...assetdetail,
      ...schedule,
      ...stock, ...manualstockentry
    ])];

    return vendormaster.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.vendorname));
  };

  const shouldShowDeleteMessage = (vendormaster, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(vendormaster, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (vendormaster, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(vendormaster, selectedRows, overalldeletecheck).length === 0;
  };









  return (
    <Box>
      <Headtitle title={"VENDOR DETAILS"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Vendor Details </Typography> */}
      <PageHeading
        title="Vendor Details"
        modulename="Asset"
        submodulename="Master"
        mainpagename="Vendor Master"
        subpagename=""
        subsubpagename=""
      />
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
                    )

                    }
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
                        setSelectedStatep("")
                        setSelectedCityp("")
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
                        setSelectedCityp("")
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
                        label: !vendor.vendorstatus ? "Please Select Status" : vendor.vendorstatus,
                        value: !vendor.vendorstatus ? "Please Select Status" : vendor.vendorstatus,
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
                {vendor.paymentfrequency === "Monthly" &&
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
                          label: !vendor.monthlyfrequency ? "Please Select Monthly Frequency" : vendor.monthlyfrequency,
                          value: !vendor.monthlyfrequency ? "Please Select Monthly Frequency" : vendor.monthlyfrequency,
                        }}
                        onChange={(e) => {
                          setVendor({
                            ...vendor,
                            monthlyfrequency: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>}
                {vendor.paymentfrequency === "Weekly" &&
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
                          label: !vendor.weeklyfrequency ? "Please Select Weekly Frequency" : vendor.weeklyfrequency,
                          value: !vendor.weeklyfrequency ? "Please Select Weekly Frequency" : vendor.weeklyfrequency,
                        }}
                        onChange={(e) => {
                          setVendor({
                            ...vendor,
                            weeklyfrequency: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>}
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
              </Grid>
            </>
          </Box>
        )}
      </>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lvendormaster") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Vendor List
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={vendormaster.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
                sm={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box>
                  {isUserRoleCompare?.includes("excelvendormaster") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvvendormaster") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printvendormaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfvendormaster") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagevendormaster") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={vendormaster}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </Grid>
            </Grid>
            <br />
            <Button
              sx={userStyle.buttongrp}
              onClick={() => {
                handleShowAllColumns();
                setColumnVisibility(initialColumnVisibility);
              }}
            >
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>{" "}
            &ensp;
            {isUserRoleCompare?.includes("bdvendormaster") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            {!vendorCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#1976d2"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </Box>
              </>
            ) : (
              <>
                <AggridTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  pagenamecheck={"Vendor Details"}
                  selectedRowsVendorMaster={selectedRowsVendorMaster}
                  setSelectedRowsVendorMaster={setSelectedRowsVendorMaster}
                  // totalDatas={totalDatas}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                />
              </>
            )}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}

      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {" "}
        {manageColumnsContent}{" "}
      </Popover>

      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{ marginTop: "47px" }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Vendor Details
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Vendor ID <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        placeholder="Please Enter Vendor Id"
                        value={vendoredit.vendorid}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Vendor Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Vendor Name"
                        value={vendoredit.vendorname}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            vendorname: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Email ID</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Email Id"
                        value={vendoredit.emailid}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            emailid: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Phone Number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumber}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            phonenumber: e.target.value,
                          });
                          handleMobile(e.target.value);
                        }}
                      />
                    </FormControl>
                    <Grid>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={vendoredit.phonecheck} />}
                          onChange={(e) =>
                            setVendoredit({
                              ...vendoredit,
                              phonecheck: !vendoredit.phonecheck,
                            })
                          }
                          label="Same as Whats app number"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                  <Grid item md={9} xs={12} sm={12} sx={{ display: "flex" }}>
                    <Grid item md={3} sm={12} xs={12}>

                      <Typography>Photograph</Typography>
                      <Box sx={{ display: "flex", justifyContent: "left" }}>
                        <Button
                          sx={buttonStyles.buttonsubmit}
                          onClick={handleClickUploadPopupOpenedit}
                        >
                          Upload
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item md={9} sm={12} xs={12}>
                      <Typography>&nbsp;</Typography>
                      {previewURLedit && refImageDragedit.length > 0 && (
                        <>
                          {refImageDragedit.map((file, index) => (
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
                                onClick={() => handleRemoveFileedit(index)}
                                style={{ marginTop: "0px", color: "red" }}
                              >
                                X
                              </Button>
                            </>
                          ))}
                        </>

                      )}
                      {isWebcamCapture == true &&
                        capturedImagesedit.map((image, index) => (
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
                              md={8}
                              sm={8}
                              xs={8}
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
                                  onClick={() => renderFilePreviewedit(image)}
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
                                  onClick={() => removeCapturedImageedit(index)}
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

                      {refImageedit.map((file, index) => (

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
                            md={8}
                            sm={8}
                            xs={8}
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
                                onClick={() => renderFilePreviewedit(file)}
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
                                onClick={() => handleDeleteFileedit(index)}
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
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number 1</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumberone}
                        placeholder="Please Enter Phone Number 1"
                        onChange={(e) => {
                          const phoneone = handlechangephonenumber(e);
                          setVendoredit({
                            ...vendoredit,
                            phonenumberone: phoneone,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number 2</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumbertwo}
                        placeholder="Please Enter Phone Number 2"
                        onChange={(e) => {
                          const phonetwo = handlechangephonenumber(e);
                          setVendoredit({
                            ...vendoredit,
                            phonenumbertwo: phonetwo,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number 3</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumberthree}
                        placeholder="Please Enter Phone Number 3"
                        onChange={(e) => {
                          const phonethree = handlechangephonenumber(e);
                          setVendoredit({
                            ...vendoredit,
                            phonenumberthree: phonethree,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number 4</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumberfour}
                        placeholder="Please Enter Phone Number 4"
                        onChange={(e) => {
                          const phonefour = handlechangephonenumber(e);
                          setVendoredit({
                            ...vendoredit,
                            phonenumberfour: phonefour,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>WhatsApp Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Whats App Number"
                        sx={userStyle.input}
                        value={vendoredit.whatsappnumber}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            whatsappnumber: e.target.value,
                          });
                          handlewhatsapp(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Address<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Address"
                        value={vendoredit.address}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            address: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
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
                        value={selectedCountryc}
                        onChange={(item) => {
                          setSelectedCountryc(item);
                          setVendoredit((prevSupplier) => ({
                            ...prevSupplier,
                            country: item?.name || "",
                          }));
                          setSelectedStatec("")
                          setSelectedCityc("")
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>State</Typography>
                      <Selects
                        options={State?.getStatesOfCountry(
                          selectedCountryc?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedStatec}
                        onChange={(item) => {
                          setSelectedStatec(item);
                          setVendoredit((prevSupplier) => ({
                            ...prevSupplier,
                            state: item?.name || "",
                          }));
                          setSelectedCityc("")
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>City</Typography>
                      <Selects
                        options={City.getCitiesOfState(
                          selectedStatec?.countryCode,
                          selectedStatec?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCityc}
                        onChange={(item) => {
                          setSelectedCityc(item);
                          setVendoredit((prevSupplier) => ({
                            ...prevSupplier,
                            city: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Pincode</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Pincode"
                        value={vendoredit.pincode}
                        sx={userStyle.input}
                        onChange={(e) => {
                          handlechangecpincodeEdit(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>GST Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter GST Number"
                        value={vendoredit.gstnumber}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (newValue.length <= maxLength) {
                            setVendoredit({
                              ...vendoredit,
                              gstnumber: newValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
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
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Contact Person Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendoredit.contactperson}
                        placeholder="Please Enter Contact Person Name"
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            contactperson: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Credit Days</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={vendoredit.creditdays}
                        placeholder="Please Enter Credit Days"
                        sx={userStyle.input}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            creditdays: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={vendorstatusopt}
                        placeholder="Please Choose Status"
                        value={{
                          label: !vendoredit.vendorstatus ? "Please Select Status" : vendoredit.vendorstatus,
                          value: !vendoredit.vendorstatus ? "Please Select Status" : vendoredit.vendorstatus,
                        }}
                        onChange={(e) => {
                          setVendoredit({ ...vendoredit, vendorstatus: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Payment Frequency<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={paymentfrequency}
                        placeholder="Please Choose Payment Frequency"
                        value={{
                          label: vendoredit.paymentfrequency,
                          value: vendoredit.paymentfrequency,
                        }}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            paymentfrequency: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {vendoredit.paymentfrequency === "Monthly" &&
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Monthly Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={dateOption}
                          placeholder="Please Choose Monthly Date"
                          value={{
                            label: !vendoredit.monthlyfrequency ? "Please Select Monthly Frequency" : vendoredit.monthlyfrequency,
                            value: !vendoredit.monthlyfrequency ? "Please Select Monthly Frequency" : vendoredit.monthlyfrequency,
                          }}
                          onChange={(e) => {
                            setVendoredit({
                              ...vendoredit,
                              monthlyfrequency: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>}
                  {vendoredit.paymentfrequency === "Weekly" &&
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Weekly Days<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={dayOptions}
                          placeholder="Please Choose Monthly Date"
                          value={{
                            label: !vendoredit.weeklyfrequency ? "Please Select Weekly Frequency" : vendoredit.weeklyfrequency,
                            value: !vendoredit.weeklyfrequency ? "Please Select Weekly Frequency" : vendoredit.weeklyfrequency,
                          }}
                          onChange={(e) => {
                            setVendoredit({
                              ...vendoredit,
                              weeklyfrequency: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>}

                  <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mode of Payments<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={modeofpayments}
                        placeholder="Please Choose Mode Of Payments"
                        value={{
                          label: vendoredit.modeofpayments,
                          value: vendoredit.modeofpayments,
                        }}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            modeofpayments: e.value,
                          });
                        }}
                      />
                    </FormControl>
                    &emsp;
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handlemodeofpayEdit}
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
                <br /> <br />
                {modeofpayEdit.includes("Cash") && (
                  <>
                    <br />
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={3}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
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
                          onClick={(e) => deleteTodoEdit("Cash")}
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
                )}{" "}
                <br />
                {modeofpayEdit.includes("Bank Transfer") && (
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
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Bank Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={accounttypes}
                            placeholder="Please Choose Bank Name"
                            value={{
                              label:
                                vendoredit.bankname === ""
                                  ? "Please Select Bank Name"
                                  : vendoredit.bankname,
                              value:
                                vendoredit.bankname === ""
                                  ? "Please Select Bank Name"
                                  : vendoredit.bankname,
                            }}
                            onChange={(e) => {
                              setVendoredit({
                                ...vendoredit,
                                bankname: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Bank Branch Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.bankbranchname}
                            placeholder="Please Enter Bank Branch Name"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  bankbranchname: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Account Holder Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.accountholdername}
                            placeholder="Please Enter Account Holder Name"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  accountholdername: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Account Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            sx={userStyle.input}
                            value={vendoredit.accountnumber}
                            placeholder="Please Enter Account Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  accountnumber: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            IFSC Code<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.ifsccode}
                            placeholder="Please Enter IFSC Code"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  ifsccode: inputvalue,
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
                          onClick={(e) => deleteTodoEdit("Bank Transfer")}
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
                {modeofpayEdit.includes("UPI") && (
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
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            UPI Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            sx={userStyle.input}
                            value={vendoredit.upinumber}
                            placeholder="Please Enter UPI Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  upinumber: inputvalue,
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
                          onClick={(e) => deleteTodoEdit("UPI")}
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
                {modeofpayEdit.includes("Card") && (
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
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            Card Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            sx={userStyle.input}
                            value={vendoredit.cardnumber}
                            placeholder="Please Enter Card Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  cardnumber: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Card Holder Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.cardholdername}
                            placeholder="Please Enter Card Holder Name"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  cardholdername: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Card Transaction Number
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.cardtransactionnumber}
                            placeholder="Please Enter Card Transaction Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  cardtransactionnumber: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Card Type<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={cardtypes}
                            placeholder="Please Select Card Type"
                            value={{
                              label:
                                vendoredit.cardtype === ""
                                  ? "Please Select Card Type"
                                  : vendoredit.cardtype,
                              value:
                                vendoredit.cardtype === ""
                                  ? "Please Select Card Type"
                                  : vendoredit.cardtype,
                            }}
                            onChange={(e) => {
                              setVendoredit({
                                ...vendoredit,
                                cardtype: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={6}>
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
                                  label:
                                    vendoredit.cardmonth === ""
                                      ? "Month"
                                      : vendoredit.cardmonth,
                                  value:
                                    vendoredit.cardmonth === ""
                                      ? "Month"
                                      : vendoredit.cardmonth,
                                }}
                                onChange={(e) => {
                                  setVendoredit({
                                    ...vendoredit,
                                    cardmonth: e.value,
                                  });
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
                                  label:
                                    vendoredit.cardyear === ""
                                      ? "Year"
                                      : vendoredit.cardyear,
                                  value:
                                    vendoredit.cardyear === ""
                                      ? "Year"
                                      : vendoredit.cardyear,
                                }}
                                id="select8"
                                onChange={(e) => {
                                  setVendoredit({
                                    ...vendoredit,
                                    cardyear: e.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            Security Code<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            value={vendoredit.cardsecuritycode}
                            sx={userStyle.input}
                            placeholder="Please Enter Security Code"
                            onChange={(e) => {
                              setVendoredit({
                                ...vendoredit,
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
                          onClick={(e) => deleteTodoEdit("Card")}
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
                {modeofpayEdit.includes("Cheque") && (
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
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            Cheque Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            sx={userStyle.input}
                            value={vendoredit.chequenumber}
                            placeholder="Please Enter Cheque Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
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
                          onClick={(e) => deleteTodoEdit("Cheque")}
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
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                  </Grid>
                  <br></br>
                  <Grid item md={3} xs={12} sm={12}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />

      {/* view model */}
      <Box>
        <Dialog
          open={openview}
          onClose={handleClickOpenview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{ marginTop: "47px" }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                {" "}
                View Vendor Deatils
              </Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Vendor ID</Typography>
                    <Typography>{vendoredit.vendorid}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Vendor Name</Typography>
                    <Typography>{vendoredit.vendorname}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Email Id</Typography>
                    <Typography>{vendoredit.emailid}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number</Typography>
                    <Typography>{vendoredit.phonenumber}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number 1</Typography>
                    <Typography>{vendoredit.phonenumberone}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number 2</Typography>
                    <Typography>{vendoredit.phonenumbertwo}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number 3</Typography>
                    <Typography>{vendoredit.phonenumberthree}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number 4</Typography>
                    <Typography>{vendoredit.phonenumberfour}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Whatsapp Number</Typography>
                    <Typography>{vendoredit.whatsappnumber}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Address</Typography>
                    <Typography>{vendoredit.address}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Country</Typography>
                    <Typography>{vendoredit.country}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">State</Typography>
                    <Typography>{vendoredit.state}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">City</Typography>
                    <Typography>{vendoredit.city}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Pincode</Typography>
                    <Typography>{vendoredit.pincode}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">GST Number</Typography>
                    <Typography>{vendoredit.gstnumber}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">LandLine</Typography>
                    <Typography>{vendoredit.landline}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Contact Person Name</Typography>
                    <Typography>{vendoredit.contactperson}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Credit Days</Typography>
                    <Typography>{vendoredit.creditdays}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Mode Of Payment</Typography>
                    <Typography>{vendoredit.modeofpayments}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Status</Typography>
                    <Typography>{vendoredit.vendorstatus}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Payment Frequency</Typography>
                    <Typography>{vendoredit.paymentfrequency}</Typography>
                  </FormControl>
                </Grid>
                {vendoredit.paymentfrequency === "Monthly" && <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Monthly Date</Typography>
                    <Typography>{vendoredit.monthlyfrequency}</Typography>
                  </FormControl>
                </Grid>}
                <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography variant="h6">Images</Typography>
                  <br />
                  {imagesview?.map((file, index) => (
                    <>
                      <Grid container>
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
                          md={8}
                          sm={8}
                          xs={8}
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
                              onClick={() => renderFilePreviewedit(file)}
                            >
                              <VisibilityOutlinedIcon
                                style={{ fontsize: "12px", color: "#357AE8" }}
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  ))}
                </Grid>

              </Grid>
              <br /> <br /> <br />
              <Grid container spacing={2}>
                <Button
                  variant="contained"
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseview}
                >
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* vendor grouping model  */}{
        <Box>
          <Dialog
            open={vendorGrpOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth="md"
            sx={{ marginTop: "47px" }}
          >
            <Box sx={{ padding: "20px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  Add Vendor Grouping
                </Typography>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Vendor Group Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendorgroup.vendorgroupname}
                        placeholder="Please Enter VendorGroup Name"
                        onChange={(e) => { setVendorgroup({ vendorgroupname: e.target.value }) }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Vendor Name</Typography>
                      <Typography>{vendor.vendorname}</Typography>
                    </FormControl>
                  </Grid>
                </Grid>
                <br /><br />
                <Grid container spacing={2}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.btnUpload}
                    onClick={updateVendor}
                  >
                    {" "}
                    Update{" "}
                  </Button>
                </Grid>
              </>
            </Box>
          </Dialog>
        </Box>
      }

      {/* EXTERNAL COMPONENTS -------------- START */}
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
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={vendormaster ?? []}
        filename={"Vendor Details"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Vendor Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delVendor}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delVendorcheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
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
      {/* EXTERNAL COMPONENTS -------------- END */}


      {/* UPLOAD IMAGE DIALOG */}
      <Dialog
        open={uploadPopupOpen}
        onClose={handleUploadPopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{ marginTop: "80px" }}
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
          onClick={() => {
            console.log(refImage);
            console.log(isLightColor)
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
              {/* {showDragField ? ( */}
              <div onDragOver={handleDragOver} onDrop={handleDrop}>
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
                        <div style={{ display: 'flex', gap: '10px' }}>
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
                              value={colorDrag}
                              onChange={handleColorChangeDrag}
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
                            onClick={(e) => handleSubmitDrag(index)}
                            loading={bgbtnDrag}
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
                              color: isLightColorDrag ? 'black' : 'white',
                              fontWeight: '600',
                              backgroundColor: colorDrag, // Dynamically set the background color
                              '&:hover': {
                                backgroundColor: `${colorDrag}90`, // Slightly transparent on hover for a nice effect
                              },
                              border: '1px solid  black'
                            }}
                          >

                          </LoadingButton>
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
                      <ContentCopyIcon /> Drag and drop
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
                              value={color[index]}
                              onChange={(e) => { handleColorChangeCaptured(e, index) }}
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
                            onClick={(e) => { handleSubmitNew(index, "captured") }}
                            loading={bgbtnCaptured[index]}
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
                              color: isLightColorCaptured[index] ? 'black' : 'white',
                              fontWeight: '600',
                              backgroundColor: colorCaptured[index], // Dynamically set the background color
                              '&:hover': {
                                backgroundColor: `${colorCaptured[index]}90`, // Slightly transparent on hover for a nice effect
                              },
                              border: '1px solid  black'
                            }}
                          >

                          </LoadingButton>
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
                            value={color[index]}
                            onChange={(e) => { handleColorChange(e, index) }}
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
                          onClick={(e) => { handleSubmitNew(index, "upload") }}
                          loading={bgbtn[index]}
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
                            color: isLightColor[index] ? 'black' : 'white',
                            fontWeight: '600',
                            backgroundColor: color[index], // Dynamically set the background color
                            '&:hover': {
                              backgroundColor: `${color[index]}90`, // Slightly transparent on hover for a nice effect
                            },
                            border: '1px solid  black'
                          }}
                        >

                        </LoadingButton>
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

      {/* webcam alert start */}
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
      <LoadingBackdrop open={isLoading} />
      {/* UPLOAD IMAGE DIALOG EDIT */}
      <Dialog
        open={uploadPopupOpenedit}
        onClose={handleUploadPopupCloseedit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "80px" }}
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image Edit
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              {/* {showDragField ? ( */}
              <div onDragOver={handleDragOveredit} onDrop={handleDropedit}>
                {previewURLedit && refImageDragedit.length > 0 ? (
                  <>
                    {refImageDragedit.map((file, index) => (
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
                          onClick={() => handleRemoveFileedit(index)}
                          style={{ marginTop: "0px", color: "red" }}
                        >
                          X
                        </Button>
                        <div style={{ display: 'flex', gap: '10px' }}>
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
                              value={colorDragEdit}
                              onChange={handleColorChangeDragEdit}
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
                            onClick={(e) => handleSubmitDragEdit(index)}
                            loading={bgbtnDragEdit}
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
                              color: isLightColorDragEdit ? 'black' : 'white',
                              fontWeight: '600',
                              backgroundColor: colorDragEdit, // Dynamically set the background color
                              '&:hover': {
                                backgroundColor: `${colorDragEdit}90`, // Slightly transparent on hover for a nice effect
                              },
                              border: '1px solid  black'
                            }}
                          >

                          </LoadingButton>
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
                      <ContentCopyIcon /> Drag and drop
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
                  <Button
                    variant="contained"
                    component="label"
                    sx={buttonStyles.buttonsubmit}
                  >
                    {" "}
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        handleChangeImageEdit(e); // Process the selected files
                        if (closeFileDialog) {
                          e.target.value = ""; // Reset the input to close the dialog
                          setCloseFileDialog(false); // Reset the state for future uploads
                        } // Reset the input to close the dialog automatically
                      }}
                    />
                  </Button>
                  &ensp;
                  <Button
                    variant="contained"
                    onClick={showWebcamedit}
                    sx={userStyle.uploadbtn}
                  >
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true &&
                capturedImagesedit.map((image, index) => (
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
                          onClick={() => renderFilePreviewedit(image)}
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
                          onClick={() => removeCapturedImageedit(index)}
                        >
                          <FaTrash
                            style={{
                              color: "#a73131",
                              fontSize: "12px",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
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
                              value={colorEdit[index]}
                              onChange={(e) => { handleColorChangeCapturedEdit(e, index) }}
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
                            onClick={(e) => { handleSubmitNewEdit(index, "captured") }}
                            loading={bgbtnCapturedEdit[index]}
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
                              color: isLightColorCapturedEdit[index] ? 'black' : 'white',
                              fontWeight: '600',
                              backgroundColor: colorCapturedEdit[index], // Dynamically set the background color
                              '&:hover': {
                                backgroundColor: `${colorCapturedEdit[index]}90`, // Slightly transparent on hover for a nice effect
                              },
                              border: '1px solid  black'
                            }}
                          >

                          </LoadingButton>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              {refImageedit.map((file, index) => (
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
                        onClick={() => renderFilePreviewedit(file)}
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
                        onClick={() => handleDeleteFileedit(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
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
                            value={colorEdit[index]}
                            onChange={(e) => { handleColorChangeEdit(e, index) }}
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
                          onClick={(e) => { handleSubmitNewEdit(index, "upload") }}
                          loading={bgbtnEdit[index]}
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
                            color: isLightColorEdit[index] ? 'black' : 'white',
                            fontWeight: '600',
                            backgroundColor: colorEdit[index], // Dynamically set the background color
                            '&:hover': {
                              backgroundColor: `${colorEdit[index]}90`, // Slightly transparent on hover for a nice effect
                            },
                            border: '1px solid  black'
                          }}
                        >

                        </LoadingButton>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAlledit} sx={buttonStyles.buttonsubmit}>
            Ok
          </Button>
          <Button onClick={resetImageedit} sx={buttonStyles.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={buttonStyles.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>



      <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(() => {
              // Mapping of conditions and their corresponding labels
              const conditions = [
                { check: CheckVendorGrouping?.length > 0, label: "Vendor Grouping" },
                { check: checkexpense?.length > 0, label: "Expense" },
                { check: checkassetdetail?.length > 0, label: "Asset Details List" },
                { check: checkSchedule?.length > 0, label: "Schedule Payment Master" },
                { check: checkstock?.length > 0, label: "Stock Purchase" },
                { check: checkmanualstock?.length > 0, label: "Manual Stock Entry" },
              ];

              // Filter out the true conditions
              const linkedItems = conditions.filter((item) => item.check);

              // Build the message dynamically
              if (linkedItems.length > 0) {
                const linkedLabels = linkedItems.map((item) => item.label).join(", ");
                return (
                  <>
                    <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteVendor.vendorname} `}</span>
                    was linked in <span style={{ fontWeight: "700" }}>{linkedLabels}</span>
                  </>
                );
              } else {
                // Default empty message if no conditions are true
                return "";
              }
            })()}
          </Typography>


        </DialogContent>
        <DialogActions>
          < Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>




      <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(
              overalldeletecheck.vendorgrouping?.length > 0 ||
              overalldeletecheck.expense?.length > 0 ||
              // overalldeletecheck.assetdetail?.length > 0 ||
              overalldeletecheck.schedule?.length > 0
              // overalldeletecheck.stock?.length > 0 ||
              // overalldeletecheck.manualstockentry?.length > 0
            )
              && (
                <>
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabelItem(overalldeletecheck)}
                  </span>{' '}
                  was linked in{' '}
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabel(overalldeletecheck)}
                  </span>
                  {shouldShowDeleteMessage(vendormaster, selectedRows, overalldeletecheck) && (
                    <Typography>Do you want to delete others?...</Typography>
                  )}
                </>
              )}
          </Typography>
        </DialogContent>
        <DialogActions>
          {shouldEnableOkButton(vendormaster, selectedRows, overalldeletecheck) ? (
            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
          ) : null}
          {shouldShowDeleteMessage(vendormaster, selectedRows, overalldeletecheck) && (
            <>
              <Button onClick={delaccountheadwithoutlink} variant="contained"> Yes </Button>
              <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">Cancel</Button>
            </>
          )}
        </DialogActions>
      </Dialog>


      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ marginTop: "95px" }}
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>




      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpenedit}
        onClose={webcamCloseedit}
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
            name={nameedit}
            getImgedit={getImgedit}
            setGetImgedit={setGetImgedit}
            valNumedit={valNumedit}
            setValNumedit={setValNumedit}
            capturedImagesedit={capturedImagesedit}
            setCapturedImagesedit={setCapturedImagesedit}
            setRefImageedit={setRefImageedit}
            setRefImageDragedit={setRefImageDragedit}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={webcamDataStoreedit}
          >
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamCloseedit}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>




    </Box>

  );
}
export default VendorDetails;