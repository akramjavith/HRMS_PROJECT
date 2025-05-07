import { makeStyles } from "@material-ui/core";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Backdrop,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextareaAutosize,
    Typography
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "axios";
import * as faceapi from "face-api.js";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { Link, useNavigate } from "react-router-dom";
import Selects from "react-select";
import { v4 as uuidv4 } from "uuid";
import AlertDialog from "../../../components/Alert";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import {
    documentTypeOption,
    followUpActionOption,
} from "../../../components/Componentkeyword";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import Webcamimage from "../../../components/webCamWithDuplicateVisitor";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import ExistingProfileVisitor from "./ExistingProfileVisitorForVisitorpage";
import ExistingVisitor from "./ExistingVisitorCheck";
import { Country, State, City } from "country-state-city";

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

const CustomPaper = (props) => {
    return <Paper {...props} sx={{ borderRadius: "8px" }} />;
};

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

function calculateLuminance(hex) {

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Calculate luminance using the formula
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;


    // If luminance is greater than 128, it's a light color
    return luminance > 128;
}

function VisitorEnquiery() {

    const [billUploadedFiles, setBillUploadedFiles] = useState([]);
    const [uploadBills, setUploadBills] = useState([]);

    const [uploadBillsRequestDocument, setUploadBillsRequestDocument] = useState([]);

    const handleDeleteFileDocumentEditRequestDocument = (index) => {
        const newSelectedFiles = [...uploadBillsRequestDocument];
        newSelectedFiles.splice(index, 1);
        setUploadBillsRequestDocument(newSelectedFiles);
    };

    const handleDeleteFileDocumentEdit = (index) => {
        const newSelectedFiles = [...uploadBills];
        newSelectedFiles.splice(index, 1);
        setUploadBills(newSelectedFiles);
    };


    let sno = 1;

    const renderFilePreviewMulter = async (file) => {
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const handleInputChangedocument = (event) => {
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

        if (billUploadedFiles?.length > 0) {
            setBillUploadedFiles([])
            setUploadBills([{ file: filteredFiles[0] }]);
        } else {
            // Accept only one file, replacing any existing file
            setUploadBills([{ file: filteredFiles[0] }]);
        }
    };

    const path = window.location.pathname.slice(1);

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;
    const [date, setDate] = useState(formattedDate);

    const getCurrentTime24Hour = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };
    const [existingUser, setExistingUser] = useState([])

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

    const [vendor, setVendor] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        visitortype: "Please Select Visitor Type",
        visitormode: "Please Select Visitor Mode",
        date: date,
        prefix: "Mr",
        visitorname: "",
        intime: "",
        visitorpurpose: "Please Select Visitor Purpose",
        visitorcontactnumber: "",
        visitoremail: "",
        visitorcompnayname: "",
        documenttype: "Please Select Document Type",
        documentnumber: "",
        meetingdetails: true,
        meetingpersonemployeename: "Please Select Employee Name",
        meetinglocationarea: "Please Select Area",
        enquiredbranchnumber: "Please Select Number",
        enquiredbranchemail: "Please Select Email",
        escortinformation: true,
        escortdetails: "",
        equipmentborrowed: "",
        outtime: "",
        remark: "",
        requestvisitorfollowaction: 'Please Select Request Follow Up Action',
        requestfollowupactionupdate: '',
        requestfollowupactionuptime: '',
        requestvisitorfollowupdate: "",
        // followupaction: "Please Select Follow Up Action",
        followupaction: "Required",
        followupdate: "",
        followuptime: "",
        visitorbadge: "",
        visitorsurvey: "",
        uploadedimage: null,
        materialcarryinginfo: false,

        //newdetails
        addesstype: "Home",
        personalprefix: "Please Select Personal Prefix",
        referencename: "",
        landmarkpositionprefix: "Please Select Landmark Position Prefix",
        landmarkname: "",
        houseflatnumber: "",
        streetroadname: "",
        localityareaname: "",
        pcountry: selectedCountryp?.name,
        pstate: selectedStatep?.name,
        pcity: selectedCityp?.name,
        ppincode: "",
        gpscoordinate: ""

    });

    const [subcategory, setSubcategory] = useState("");
    const [subCategoryTodo, setSubcategoryTodo] = useState([]);

    const handleTodoEdit = (index, newValue) => {
        const updatedTodos = [...subCategoryTodo];
        updatedTodos[index] = newValue;
        setSubcategoryTodo(updatedTodos);
    };


    const deleteTodo = (index) => {
        const updatedTodos = [...subCategoryTodo];
        updatedTodos.splice(index, 1);
        setSubcategoryTodo(updatedTodos);
    };


    const addTodo = () => {
        // getCategoryMaster();
        const isSubNameMatch = subCategoryTodo.some(
            (item) => item?.toLowerCase() === subcategory?.toLowerCase()
        );
        // const isSubNameMatch = categorySubcategoryList.some((item) => item.subcategoryname.includes(subcategory));

        if (subcategory === "") {

            setPopupContentMalert("Please Enter Material");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isSubNameMatch) {

            setPopupContentMalert("Already Added ! Please Enter Another Material");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setSubcategoryTodo([...subCategoryTodo, subcategory]);
            setSubcategory("");
        }
    };

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
    const [isLoading, setIsLoading] = useState(false);
    const [buttonLoad, setButtonLoad] = useState(false);
    const [visitorCode, setVisitorCode] = useState("VISIT#0001");
    const classes = useStyles();
    const backPage = useNavigate();

    const [isimgviewbill, setImgviewbill] = useState(false);
    const handleImgcodeviewbill = () => {
        setImgviewbill(true);
    };
    const handlecloseImgcodeviewbill = () => {
        setImgviewbill(false);
    };


    const [visitorCheck, setVisitorCheck] = useState("New Visitor")
    const [visitorCheckName, setVisitorCheckName] = useState("")
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const [popupContentMalert, setPopupContentMalert] = useState("");
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

    const [checkContactEmail, setCheckContactEmail] = useState(false)
    const [checkContactEmailForpopup, setCheckContactEmailForpopup] = useState(false)

    const [checkContactEmailMessage, setCheckContactEmailMessage] = useState("");

    const handleCloseOpenCheckContact = () => {
        setCheckContactEmail(false);
        setCheckContactEmailForpopup(false);
    };
    const handleCloseOpenCheckContactMessage = () => {
        setCheckContactEmail(false);
        setCheckContactEmailForpopup(false);
        setVendor({
            ...vendor,
            visitorcontactnumber: "",
            visitoremail: "",
        })
    };



    const [cateCode, setCatCode] = useState([]);
    const [vendorArray, setVendorArray] = useState([]);
    const {
        isUserRoleAccess,
        isAssignBranch,
        allUsersData,
        allTeam,
        allareagrouping,
        allfloor,
        alldepartment,
        pageName,
        setPageName,
        buttonStyles
    } = useContext(UserRoleAccessContext);

    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];
                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }
                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];

                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    const { auth } = useContext(AuthContext);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();


    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Addvisitors"),
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

    let [valueFloorLocationCat, setValueFloorLocationCat] = useState([]);
    let [valueBranchLocationCat, setValueBranchLocationCat] = useState([]);

    let [enquiredBranchNumber, setEnquiredBranchNumber] = useState([]);
    let [enquiredBranchEmail, setEnquiredBranchEmail] = useState([]);
    let [branchOpt, setBranchOpt] = useState([]);

    const fetchBranch = async () => {
        setPageName(!pageName);
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setBranchOpt(res_branch?.data?.branch)

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        getapi();
        fetchVendor();
        fetchBranch();
        fetchInteractorType();
        fetchInteractorMode();
        fetchLastindexVendor();
    }, []);

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


    const [file, setFile] = useState("");

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

    const [showDupProfileVIsitor, setShowDupProfileVIsitor] = useState();
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    const [isErrorOpenpopdragdrop, setIsErrorOpenpopdragdrop] = useState(false);
    const [showAlertpopdragdrop, setShowAlertpopdragdrop] = useState();
    const handleClickOpenerrpopdragdrop = () => {
        setIsErrorOpenpopdragdrop(true);
    };
    const handleCloseerrpopdragdrop = () => {
        setIsErrorOpenpopdragdrop(false);
        setUploadwithDupImage([])
    };

    const [uploadwithDupImage, setUploadwithDupImage] = useState([])
    const UploadWithDuplicate = (e, isUpload) => {
        if (isUpload === "upload") {
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
                            setIsLoading(false);
                            handleCloseerrpop();
                        } else {
                            setIsLoading(false);
                            setPopupContentMalert("No face detected!");
                            setPopupSeverityMalert("info");
                            handleClickOpenPopupMalert();
                        }
                    } catch (error) {
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
                if (file !== undefined) {
                    setPopupContentMalert(
                        "File size is greater than 1MB, please upload a file below 1MB.!"
                    );
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setBtnUpload(false);
                }
            }
        } else {
            setBtnUpload(true); // Enable loader when the process starts
            const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

            // Get the selected file
            const file = e;
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
                                setVendor({
                                    ...vendor,
                                    faceDescriptor: Array.from(faceDescriptor),
                                });
                                handleCloseerrpopdragdrop();
                            } else {
                                setPopupContentMalert("Only Accept Images");
                                setPopupSeverityMalert("info");
                                handleClickOpenPopupMalert();
                            }
                            // }
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
                if (file !== undefined) {
                    setPopupContentMalert(
                        "File size is greater than 1MB, please upload a file below 1MB.!"
                    );
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setBtnUpload(false);
                }
            }

        }
    }

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
            const NewData = []
            NewData.push({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: path,
                base64: path.split(",")[1],
            });
            setNewimage(NewData);
            image.onload = async () => {
                try {
                    const detections = await faceapi
                        .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptors();
                    if (detections.length > 0) {
                        const faceDescriptor = detections[0].descriptor;
                        const response = await axios.post(
                            `${SERVICE.DUPLICATECANDIDATEFACEDETECTVISITOR_FORINTERVIEW}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                faceDescriptor: Array.from(faceDescriptor),
                            }
                        );
                        if (response?.data?.matchfound) {
                            setIsLoading(false);
                            setUploadwithDupImage(e)
                            setShowDupProfileVIsitor(response?.data?.matchedData);
                            handleClickOpenerrpop();
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
            if (file !== undefined) {
                setPopupContentMalert(
                    "File size is greater than 1MB, please upload a file below 1MB.!"
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
                setBtnUpload(false);
            }
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

            const ImgFil = [];
            ImgFil.push({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: path,
                base64: path.split(",")[1],
            });

            setNewimage(ImgFil)


            image.onload = async () => {
                try {
                    const detections = await faceapi
                        .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptors();

                    if (detections.length > 0) {
                        const faceDescriptor = detections[0].descriptor;

                        const response = await axios.post(
                            `${SERVICE.DUPLICATECANDIDATEFACEDETECTVISITOR_FORINTERVIEW}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                faceDescriptor: Array.from(faceDescriptor),
                            }
                        );

                        if (response?.data?.matchfound) {
                            setUploadwithDupImage(file)
                            setShowAlertpopdragdrop(
                                response?.data?.matchedData
                            );
                            handleClickOpenerrpopdragdrop();
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
                                setVendor({
                                    ...vendor,
                                    faceDescriptor: Array.from(faceDescriptor),
                                });
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
                    }
                } catch (error) {
                    setPopupContentMalert("Error in face detection!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                } finally {
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
            if (file !== undefined) {
                setPopupContentMalert(
                    "File size is greater than 1MB, please upload a file below 1MB.!"
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
                setBtnUpload(false);
            }
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
    const [refImageedit, setRefImageedit] = useState([]);
    const [previewURLedit, setPreviewURLedit] = useState(null);
    const [refImageDragedit, setRefImageDragedit] = useState([]);
    const [valNumedit, setValNumedit] = useState(0);
    const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
    const [capturedImagesedit, setCapturedImagesedit] = useState([]);
    const [getImgedit, setGetImgedit] = useState(null);
    const webcamOpenedit = () => {
        setIsWebcamOpenedit(true);
    };
    const webcamCloseedit = () => {
        setIsWebcamOpenedit(false);
        setGetImgedit("");
    };
    const webcamDataStoreedit = () => {
        webcamCloseedit();
        setGetImgedit("");
    };
    const showWebcamedit = () => {
        webcamOpenedit();
    };
    const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);

    const handleUploadPopupCloseedit = () => {
        setUploadPopupOpenedit(false);
        setGetImgedit("");
        setRefImageedit([]);
        setPreviewURLedit(null);
        setRefImageDragedit([]);
        setCapturedImagesedit([]);
    };
    const handleInputChangeedit = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImageedit];

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
                    setRefImageedit(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {

                setPopupContentMalert("Only Accept Images");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);
    let combinedArray = allUploadedFilesedit.concat(
        refImageedit,
        refImageDragedit,
        capturedImagesedit
    );
    let uniqueValues = {};
    let resultArray = combinedArray.filter((item) => {
        if (!uniqueValues[item.name]) {
            uniqueValues[item.name] = true;
            return true;
        }
        return false;
    });

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
    const handleDragOveredit = (event) => { };
    const handleDropedit = (event) => {
        event.preventDefault();
        previewFileedit(event.dataTransfer.files[0]);
        const files = event.dataTransfer.files;
        let newSelectedFilesDrag = [...refImageDragedit];
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
                    setRefImageDragedit(newSelectedFilesDrag);
                };
                reader.readAsDataURL(file);
            } else {

                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleUploadOverAlledit = () => {
        setUploadPopupOpenedit(false);
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

    const handleMobile = (e) => {
        if (e.length > 10) {
            let num = e.slice(0, 10);
            setVendor({ ...vendor, visitorcontactnumber: num });
        }
    };

    const [getimgbillcode, setGetImgbillcode] = useState([]);


    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [visitorsTypeOption, setVisitorsTypeOption] = useState([]);
    const [visitorsModeOption, setVisitorsModeOption] = useState([]);
    const [visitorsPurposeOption, setVisitorsPurposeOption] = useState([]);
    //get all interactorMode name.
    const fetchInteractorMode = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALL_INTERACTORMODE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setVisitorsModeOption(
                res_freq?.data?.interactormode.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //get all interactorType name.
    const fetchInteractorType = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setVisitorsTypeOption(
                res_freq?.data?.manageTypePG.map((t) => ({
                    ...t,
                    label: t.interactorstype,
                    value: t.interactorstype,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchInteractorPurpose = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res?.data?.manageTypePG.filter(
                (d) => d.interactorstype === e
            );
            let ans = result.flatMap((data) => data.interactorspurpose);

            setVisitorsPurposeOption(
                ans.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }))
            );
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);
    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setVendor({
            ...vendor,
            meetingpersonemployeename: "Please Select Employee Name",
        });
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);
    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setVendor({
            ...vendor,
            meetingpersonemployeename: "Please Select Employee Name",
        });
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setVendor({
            ...vendor,
            meetingpersonemployeename: "Please Select Employee Name",
        });
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setVendor({
            ...vendor,
            meetingpersonemployeename: "Please Select Employee Name",
        });
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //Department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);
    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setVendor({
            ...vendor,
            meetingpersonemployeename: "Please Select Employee Name",
        });
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };

    //company location multiselect
    const [selectedOptionsCompanyLocation, setSelectedOptionsCompanyLocation] =
        useState([]);
    let [valueCompanyLocationCat, setValueCompanyLocationCat] = useState([]);




    //branch location multiselect
    const [selectedOptionsBranchLocation, setSelectedOptionsBranchLocation] =
        useState([]);




    //unit location multiselect
    const [selectedOptionsUnitLocation, setSelectedOptionsUnitLocation] =
        useState([]);
    let [valueUnitLocationCat, setValueUnitLocationCat] = useState([]);





    //floor location multiselect
    const [selectedOptionsFloorLocation, setSelectedOptionsFloorLocation] =
        useState([]);





    let name = "create";
    let nameedit = "edit";
    let allUploadedFiles = [];

    const [olduniqueid, setOldUnique] = useState(0)

    const fetchAssignedBy = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.CANDIDATESALLCOUNT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setOldUnique(res_vendor?.data?.candidates);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchAssignedBy();
    }, [])

    let uniqueid = olduniqueid ? Number(olduniqueid?.unique) : 0
    let idfinal = Number(uniqueid) + 1;

    const [isExistVisitor, setIsExistVisitor] = useState(false)
    //add function
    const [visitorLogData, setVisitorLogData] = useState([])

    const [documentFiles, setdocumentFiles] = useState([]);


    const sendRequest = async (type) => {
        setButtonLoad(true);
        setPageName(!pageName);
        try {

            let formData = new FormData();

            if (uploadBills.length > 0) {
                uploadBills.forEach((item) => {
                    formData.append("visitordocument", item.file); // `files` is the key for multiple files

                });
            }

            if (uploadBillsRequestDocument.length > 0) {
                uploadBillsRequestDocument.forEach((item, index) => {
                    formData.append('requestdocument', item.file); // Append the file
                    formData.append(`remarks[${index}]`, item.remark); // Append the remark for this file
                });
            }


            const resdata = await fetchLastindexVendor() || "VISIT#0001";

            const uniqueid = uuidv4()

            const jsonData = {
                company: String(vendor.company),
                branch: String(vendor.branch),
                unit: String(vendor.unit),
                unique: Number(idfinal),

                //Newvalue
                addesstype: String(vendor.addesstype),
                personalprefix: String(vendor.personalprefix),
                referencename: String(vendor.referencename),
                landmarkpositionprefix: String(vendor.landmarkpositionprefix),
                landmarkname: String(vendor.landmarkname),
                houseflatnumber: String(vendor.houseflatnumber),
                streetroadname: String(vendor.streetroadname),
                localityareaname: String(vendor.localityareaname),
                pcountry: String(vendor.pcountry),
                pstate: String(vendor.pstate),
                pcity: String(vendor.pcity),
                ppincode: String(vendor.ppincode),
                gpscoordinate: String(vendor.gpscoordinate),


                requestvisitorfollowaction: String(vendor.requestvisitorfollowaction),
                requestfollowupactionupdate: String(vendor.requestfollowupactionupdate),
                requestfollowupactionuptime: String(vendor.requestfollowupactionuptime),
                requestvisitorfollowupdate: String(vendor.requestvisitorfollowupdate),

                visitorcommonid: isExistVisitor ? vendor?.visitorcommonid : uniqueid,
                visitorid: String(resdata),
                visitortype: String(vendor.visitortype),
                visitormode: String(vendor.visitormode),
                date: String(vendor.date),
                prefix: String(vendor.prefix),
                visitorname: String(vendor.visitorname),
                intime: String(vendor.intime),
                visitorpurpose: String(vendor.visitorpurpose),
                visitorcontactnumber: String(vendor.visitorcontactnumber),
                visitoremail: String(vendor.visitoremail),
                visitorcompnayname: String(vendor.visitorcompnayname),
                documenttype: String(
                    vendor.documenttype === "Please Select Document Type"
                        ? ""
                        : vendor.documenttype
                ),
                faceDescriptor: vendor?.faceDescriptor?.length > 0 ? vendor?.faceDescriptor : [],
                documentnumber: String(vendor.documentnumber),
                // document: [...documentFiles],
                meetingdetails: Boolean(vendor.meetingdetails),
                meetingpersoncompany: vendor.meetingdetails === true ? [...valueCompanyCat] : [],
                meetingpersonbranch: vendor.meetingdetails === true ? [...valueBranchCat] : [],
                meetingpersonunit: vendor.meetingdetails === true ? [...valueUnitCat] : [],
                meetingpersondepartment: vendor.meetingdetails === true ? [...valueDepartmentCat] : [],
                meetingpersonteam: vendor.meetingdetails === true ? [...valueTeamCat] : [],
                meetingpersonemployeename: String(
                    vendor.meetingdetails === true ? vendor.meetingpersonemployeename : ""
                ),

                enquiredbranchnumber: String(vendor.enquiredbranchnumber),
                enquiredbranchemail: String(vendor.enquiredbranchemail),

                meetinglocationcompany: vendor.meetingdetails === true ? [...valueCompanyLocationCat] : [],
                meetinglocationbranch: vendor.meetingdetails === true ? [...valueBranchLocationCat] : [],
                meetinglocationunit: vendor.meetingdetails === true ? [...valueUnitLocationCat] : [],
                meetinglocationfloor: vendor.meetingdetails === true ? [...valueFloorLocationCat] : [],
                meetinglocationarea: String(
                    vendor.meetingdetails === true ? vendor.meetinglocationarea : ""
                ),
                escortinformation: Boolean(vendor.escortinformation),
                escortdetails: String(
                    vendor.escortinformation === true ? vendor.escortdetails : ""
                ),
                // followupdate: String(
                //     vendor.followupaction === "Required" ? vendor.followupdate : ""
                // ),
                // followuptime: String(
                //     vendor.followupaction === "Required" ? vendor.followuptime : ""
                // ),
                // followupaction: String(path === "interactor/addvisitorin" ? "" : vendor.followupaction),
                followupdate: visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument ? "" : String(vendor.followupaction === 'Required' ? vendor.followupdate : ''),
                followuptime: visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument ? "" : String(vendor.followupaction === 'Required' ? vendor.followuptime : ''),
                followupaction: visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument ? "" : String(path === "interactor/addvisitorin" ? "" : vendor.followupaction),

                visitorbadge: String(vendor.visitorbadge),
                equipmentborrowed: String(path === "interactor/addvisitorin" ? "" : vendor.equipmentborrowed),
                outtime: String(path === "interactor/addvisitorin" ? "" : vendor.outtime),
                remark: String(path === "interactor/addvisitorin" ? "" : vendor.remark),
                visitorsurvey: String(path === "interactor/addvisitorin" ? "" : vendor.visitorsurvey),
                addvisitorin: Boolean(path === "interactor/addvisitorin"),
                detailsaddedy: String(isUserRoleAccess?.companyname),
                visitorExistiongDocument: billUploadedFiles,
                followuparray: [
                    {
                        //Newvalue
                        addesstype: String(vendor.addesstype),
                        personalprefix: String(vendor.personalprefix),
                        referencename: String(vendor.referencename),
                        landmarkpositionprefix: String(vendor.landmarkpositionprefix),
                        landmarkname: String(vendor.landmarkname),
                        houseflatnumber: String(vendor.houseflatnumber),
                        streetroadname: String(vendor.streetroadname),
                        localityareaname: String(vendor.localityareaname),
                        pcountry: String(vendor.pcountry),
                        pstate: String(vendor.pstate),
                        pcity: String(vendor.pcity),
                        ppincode: String(vendor.ppincode),
                        gpscoordinate: String(vendor.gpscoordinate),

                        requestvisitorfollowaction: String(vendor.requestvisitorfollowaction),
                        requestfollowupactionupdate: String(vendor.requestfollowupactionupdate),
                        requestfollowupactionuptime: String(vendor.requestfollowupactionuptime),
                        requestvisitorfollowupdate: String(vendor.requestvisitorfollowupdate),

                        enquiredbranchnumber: String(vendor.enquiredbranchnumber),
                        enquiredbranchemail: String(vendor.enquiredbranchemail),
                        visitortype: String(vendor.visitortype),
                        visitormode: String(vendor.visitormode),
                        visitorpurpose: String(vendor.visitorpurpose),
                        meetingdetails: Boolean(vendor.meetingdetails),
                        intime: String(vendor.intime),
                        meetingpersoncompany: vendor.meetingdetails === true ? [...valueCompanyCat] : [],
                        meetingpersonbranch: vendor.meetingdetails === true ? [...valueBranchCat] : [],
                        meetingpersonunit: vendor.meetingdetails === true ? [...valueUnitCat] : [],
                        meetingpersondepartment: vendor.meetingdetails === true ? [...valueDepartmentCat] : [],
                        meetingpersonteam: vendor.meetingdetails === true ? [...valueTeamCat] : [],
                        meetingpersonemployeename: String(
                            vendor.meetingdetails === true ? vendor.meetingpersonemployeename : ""
                        ),
                        meetinglocationcompany: vendor.meetingdetails === true ? [...valueCompanyLocationCat] : [],
                        meetinglocationbranch: vendor.meetingdetails === true ? [...valueBranchLocationCat] : [],
                        meetinglocationunit: vendor.meetingdetails === true ? [...valueUnitLocationCat] : [],
                        meetinglocationfloor: vendor.meetingdetails === true ? [...valueFloorLocationCat] : [],
                        meetinglocationarea: String(
                            vendor.meetingdetails === true ? vendor.meetinglocationarea : ""
                        ),
                        escortinformation: Boolean(vendor.escortinformation),
                        escortdetails: String(
                            vendor.escortinformation === true ? vendor.escortdetails : ""
                        ),
                        equipmentborrowed: String(vendor.equipmentborrowed),
                        outtime: String(vendor.outtime),
                        remark: String(vendor.remark),
                        // followupaction: String(vendor.followupaction),
                        // followupdate: String(
                        //     vendor.followupaction === "Required" ? vendor.followupdate : ""
                        // ),
                        // followuptime: String(
                        //     vendor.followupaction === "Required" ? vendor.followuptime : ""
                        // ),
                        followupdate: visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument ? "" : String(vendor.followupaction === 'Required' ? vendor.followupdate : ''),
                        followuptime: visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument ? "" : String(vendor.followupaction === 'Required' ? vendor.followuptime : ''),
                        followupaction: visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument ? "" : vendor.followupaction,

                        visitorbadge: String(vendor.visitorbadge),
                        visitorsurvey: String(vendor.visitorsurvey),
                    },
                ],
                interactorstatus: String("visitorenquiry"),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            }

            formData.append("jsonData", JSON.stringify(jsonData));

            let addVendorDetails = await axios.post(SERVICE.CREATE_VISITORS, formData, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            await fetchVendor();
            if (type === "save1") {
                setPopupContent("Added Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                setButtonLoad(false);
                if (path === "interactor/addvisitorin") {
                    setTimeout(() => {
                        backPage("/interactor/visitoryoutentry");
                    }, 1000)
                } else {
                    setTimeout(() => {
                        backPage("/interactor/master/listvisitors");
                    }, 1000);
                }
            } else if (type === "save2") {
                fetchLastindexVendor();
                setVendor({
                    ...vendor,
                    visitorname: "",
                    intime: "",
                    visitorcontactnumber: "",
                    visitoremail: "",
                    visitorcompnayname: "",
                    documentnumber: "",
                    meetingdetails: true,
                    escortinformation: true,
                    escortdetails: "",
                    equipmentborrowed: "",
                    outtime: "",
                    remark: "",
                    followupdate: "",
                    followuptime: "",
                    visitorbadge: "",
                    visitorsurvey: "",
                    enquiredbranchnumber: "Please Select Number",
                    enquiredbranchemail: "Please Select Email",
                });
                setButtonLoad(false);
                setRefImageDrag([])
                setRefImage([])
                setCapturedImages([])
                setPopupContent("Added Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
            setIsExistVisitor(false)
            setSubcategoryTodo([])
            setSubcategory('')
        } catch (err) {
            setButtonLoad(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //valid email verification
    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };


    //submit option for saving
    const handleSubmit = async (e, type) => {
        e.preventDefault();
        // await fetchVendor();

        function hasDuplicates(array) {
            const map = {};
            for (const item of array) {
                if (map[item]) {
                    return true; // Duplicate found
                }
                map[item] = 1;
            }
            return false; // No duplicates
        }

        const DuplicateTodoValu = hasDuplicates(subCategoryTodo);
        let compopt = selectedOptionsCompany.map((item) => item.value);
        let branchopt = selectedOptionsBranch.map((item) => item.value);
        let unitopt = selectedOptionsUnit.map((item) => item.value);
        let departmentopt = selectedOptionsDepartment.map((item) => item.value);
        let teamopt = selectedOptionsTeam.map((item) => item.value);

        let compLocationopt = selectedOptionsCompanyLocation.map(
            (item) => item.value
        );
        let branchLocationopt = selectedOptionsBranchLocation.map(
            (item) => item.value
        );
        let unitLocationopt = selectedOptionsUnitLocation.map((item) => item.value);
        let floorLocationopt = selectedOptionsFloorLocation.map(
            (item) => item.value
        );
        const isNameMatch = vendorArray.some(
            (item) =>
                item.company === vendor.company &&
                item.branch === vendor.branch &&
                item.unit === vendor.unit &&
                item.visitortype === vendor.visitortype &&
                item.visitormode === vendor.visitormode &&
                item.visitorpurpose === vendor.visitorpurpose &&
                item.date === vendor.date &&
                item.visitorcontactnumber === vendor.visitorcontactnumber &&
                item.prefix === vendor.prefix &&
                item.visitorname?.trim()?.toLowerCase() ===
                vendor.visitorname?.trim()?.toLowerCase() &&
                item.intime === vendor.intime &&
                item.outtime === vendor.outtime &&
                (!vendor.meetingdetails || // If meetingdetails is false, skip the following conditions
                    // If meetingdetails is true, evaluate these conditions
                    (item.meetingpersoncompany.some((data) => compopt.includes(data)) &&
                        item.meetingpersonbranch.some((data) => branchopt.includes(data)) &&
                        item.meetingpersonunit.some((data) => unitopt.includes(data)) &&
                        item.meetingpersondepartment.some((data) =>
                            departmentopt.includes(data)
                        ) &&
                        item.meetingpersonteam.some((data) => teamopt.includes(data)) &&
                        item.meetingpersonemployeename ===
                        vendor.meetingpersonemployeename &&
                        item.meetinglocationcompany.some((data) =>
                            compLocationopt.includes(data)
                        ) &&
                        item.meetinglocationbranch.some((data) =>
                            branchLocationopt.includes(data)
                        ) &&
                        item.meetinglocationunit.some((data) =>
                            unitLocationopt.includes(data)
                        ) &&
                        item.meetinglocationfloor.some((data) =>
                            floorLocationopt.includes(data)
                        ) &&
                        item.meetinglocationarea === vendor.meetinglocationarea)) &&
                (!vendor.escortinformation ||
                    item.escortdetails == vendor.escortdetails) &&
                item.followupaction == vendor.followupaction &&
                (vendor.followupaction !== "Required" || // If followupaction is not "Required", skip the following conditions
                    // If followupaction is "Required", evaluate these conditions
                    (item.followupdate == vendor.followupdate &&
                        item.followuptime == vendor.followuptime))
        );



        if (vendor.company === "Please Select Company") {

            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.branch === "Please Select Branch") {

            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.unit === "Please Select Unit") {

            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.visitortype === "Please Select Visitor Type") {

            setPopupContentMalert("Please Select Visitor Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.visitormode === "Please Select Visitor Mode") {

            setPopupContentMalert("Please Select Visitor Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.date === "") {

            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.prefix === "") {

            setPopupContentMalert("Please Select Prefix");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.visitorname === "") {

            setPopupContentMalert("Please Enter Visitor Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.intime === "") {

            setPopupContentMalert("Please Select IN Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.visitorpurpose === "Please Select Visitor Purpose") {

            setPopupContentMalert("Please Select Visitor Purpose");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.visitorcontactnumber === "" || vendor.visitorcontactnumber === undefined) {
            setPopupContentMalert("Please Enter Visitor Contact Number");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (vendor.visitorcontactnumber.length < 10) {
            setPopupContentMalert("Please Enter Valid Visitor Contact Number");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (vendor.visitoremail === "") {

            setPopupContentMalert("Please Enter Visitor Email");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.visitoremail !== "" &&
            !validateEmail(vendor.visitoremail)
        ) {

            setPopupContentMalert("Please Enter Valid Visitor Email");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument) && vendor.requestvisitorfollowupdate === '') {
            setPopupContentMalert('Please Select Request Visitor Followup Date');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument) && vendor.requestvisitorfollowaction === 'Please Select Request Follow Up Action') {
            setPopupContentMalert('Please Select Request Follow Up Action');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument) && vendor.requestvisitorfollowaction === 'Required' && vendor.requestfollowupactionupdate === '') {
            setPopupContentMalert('Please Select Request Follow Up Date');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument) && vendor.requestvisitorfollowaction === 'Required' && vendor.requestfollowupactionuptime === '') {
            setPopupContentMalert('Please Select Request Follow Up Time');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }
        else if (valueCompanyCat?.length == 0) {

            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (valueBranchCat?.length == 0) {

            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (valueUnitCat?.length == 0) {

            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (

            valueDepartmentCat?.length == 0
        ) {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (valueTeamCat?.length == 0) {

            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (

            vendor.meetingpersonemployeename === "Please Select Employee Name"
        ) {

            setPopupContentMalert("Please Select Employee Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.enquiredbranchnumber === "Please Select Number"
        ) {
            setPopupContentMalert("Please Select Enquired Branch Number");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.enquiredbranchemail === "Please Select Email"
        ) {
            setPopupContentMalert("Please Select Enquired Branch Email");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!(visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument || false) && vendor.followupaction === "Please Select Follow Up Action") {

            setPopupContentMalert("Please Select Follow Up Action");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.followupaction === "Required" &&
            vendor.followupdate === ""
        ) {

            setPopupContentMalert("Please Select Follow Up Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            vendor.followupaction === "Required" &&
            vendor.followuptime === ""
        ) {

            setPopupContentMalert("Please Select Follow Up Time");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {

            setPopupContentMalert("Visitor Details already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest(type);
        }
    };
    const handleClear = (e) => {
        e.preventDefault();
        setVendor({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            visitortype: "Please Select Visitor Type",
            visitormode: "Please Select Visitor Mode",
            date: date,
            prefix: "",
            visitorname: "",
            intime: "",
            visitorpurpose: "Please Select Visitor Purpose",
            visitorcontactnumber: "",
            visitoremail: "",
            visitorcompnayname: "",
            documenttype: "Please Select Document Type",
            documentnumber: "",
            meetingdetails: true,
            meetingpersonemployeename: "Please Select Employee Name",
            meetinglocationarea: "Please Select Area",
            escortinformation: true,
            escortdetails: "",
            equipmentborrowed: "",
            outtime: "",
            remark: "",
            followupaction: "Please Select Follow Up Action",
            followupdate: "",
            followuptime: "",
            visitorbadge: "",
            visitorsurvey: "",
            enquiredbranchnumber: "Please Select Number",
            enquiredbranchemail: "Please Select Email",

        });
        setVisitorCheckName("")
        setVisitorCheck("Please Select")
        setSelectedOptionsCompany([]);
        setValueCompanyCat([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);

        setValueCompanyLocationCat([]);
        setSelectedOptionsCompanyLocation([]);
        setValueBranchLocationCat([]);
        setSelectedOptionsBranchLocation([]);
        setValueUnitLocationCat([]);
        setSelectedOptionsUnitLocation([]);
        setValueFloorLocationCat([]);
        setSelectedOptionsFloorLocation([]);

        setUploadPopupOpen(false);
        setGetImg("");
        setRefImage([]);
        setPreviewURL(null);
        setRefImageDrag([]);
        setCapturedImages([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //get all  vendordetails.
    const fetchVendor = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.post(
                SERVICE.ALL_VISITORS,
                {
                    assignbranch: accessbranch,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            setVendorArray(res_vendor?.data?.visitors);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchLastindexVendor = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.LASTINDEX_VISITORS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let refNo = res_vendor?.data?.visitor?.visitorid;
            let codenum = refNo.split("#");
            let prefixLength = Number(codenum[1]) + 1;
            let prefixString = String(prefixLength);
            let postfixLength =
                prefixString.length == 1
                    ? `000${prefixString}`
                    : prefixString.length == 2
                        ? `00${prefixString}`
                        : prefixString.length == 3
                            ? `0${prefixString}`
                            : prefixString.length == 4
                                ? `0${prefixString}`
                                : prefixString.length == 5
                                    ? `0${prefixString}`
                                    : prefixString.length == 6
                                        ? `0${prefixString}`
                                        : prefixString.length == 7
                                            ? `0${prefixString}`
                                            : prefixString.length == 8
                                                ? `0${prefixString}`
                                                : prefixString.length == 9
                                                    ? `0${prefixString}`
                                                    : prefixString.length == 10
                                                        ? `0${prefixString}`
                                                        : prefixString;

            let newval = "VISIT#" + postfixLength;
            setVisitorCode(newval);

            return newval;
        } catch (err) {
            if (err?.response?.data?.message === "Data not found!") {
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };

    const [TextEditor, setTextEditor] = useState("");
    const [textAreas, setTextAreas] = useState([]);

    const handleResumeUpload = (event) => {
        const resume = event.target.files;

        const reader = new FileReader();
        const file = resume[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            setdocumentFiles([{ name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
        };

    };


    const handleAutoSelect = async () => {
        setPageName(!pageName)
        try {

            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );

            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);


            setValueCompanyLocationCat(selectedCompany);
            setSelectedOptionsCompanyLocation(mappedCompany);


            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);


            setValueBranchLocationCat(selectedBranch);
            setSelectedOptionsBranchLocation(mappedBranch);

            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);
            setVendor({
                ...vendor,
                company: selectedCompany[0],
                branch: selectedBranch[0],
                unit: selectedUnit[0],
                intime: getCurrentTime24Hour()
            })

            const setPhoneEmailOpt = res_branch?.data?.branch?.filter((item) => item?.name === selectedBranch[0])[0]
            setEnquiredBranchNumber(setPhoneEmailOpt?.phone?.map((item) => ({
                label: item,
                value: item
            })))

            setEnquiredBranchEmail(setPhoneEmailOpt?.email?.map((item) => ({
                label: item,
                value: item
            })))


            setValueUnitLocationCat(selectedUnit);
            setSelectedOptionsUnitLocation(mappedUnit);

            let mappedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => u.teamname);

            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);

            setSelectedOptionsDepartment(alldepartment?.map((data) => ({
                label: data.deptname,
                value: data.deptname,
            })))


            setValueDepartmentCat(alldepartment.map((a, index) => {
                return a.deptname;
            }))

            setSelectedOptionsFloorLocation(allfloor
                ?.filter((u) =>
                    selectedBranch?.includes(u.branch)
                )
                .map((u) => ({
                    ...u,
                    label: u.name,
                    value: u.name,
                })))
            const floorval = allfloor?.map((a, index) => {
                return a.name;
            })
            setValueFloorLocationCat(floorval)
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };




    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);




    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };

    const [pervData, setPervData] = useState([])
    const [newimage, setNewimage] = useState([])
    const [refImagePerImage, setRefImagePerImage] = useState([])


    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setRefImage(newimage)
        setRefImagePerImage(e?.files)
        setIsEditOpen(false);
        setPervData(e)
        setVendor({
            ...e,
            company: e?.company,
            branch: e?.branch,
            unit: e?.unit,
            visitortype: e?.visitortype,
            visitormode: e?.visitormode,
            date: date,
            prefix: e?.prefix,
            visitorname: e?.visitorname,
            intime: getCurrentTime24Hour(),
            visitorpurpose: e?.visitorpurpose,
            visitorcontactnumber: e?.visitorcontactnumber,
            visitoremail: e?.visitoremail,
            visitorcompnayname: e?.visitorcompnayname,

            documenttype: e?.documenttype,
            documentnumber: e?.documentnumber,
            meetingdetails: e?.meetingdetails,
            meetingpersonemployeename: e?.meetingpersonemployeename,
            meetinglocationarea: e?.meetinglocationarea,
            escortinformation: e?.escortinformation,
            escortdetails: e?.escortdetails,
            equipmentborrowed: e?.equipmentborrowed,
            outtime: "",
            remark: e?.remark,
            followupaction: e?.followupaction,
            followupdate: "",
            followuptime: "",
            visitorbadge: e?.visitorbadge,
            visitorsurvey: e?.visitorsurvey,
            uploadedimage: null,
        })
        setdocumentFiles(e?.document || [])
        let multerUploadedFiles = e?.visitordocument?.filter(data => !data.preview)
        setBillUploadedFiles(multerUploadedFiles);
        fetchInteractorPurpose(e?.visitortype)
        let selectedValues = accessbranch
            ?.map((data) => ({
                company: data.company,
                branch: data.branch,
                unit: data.unit,
            }))
            .filter((t) =>
                e.meetingpersoncompany?.includes(t.company) &&
                e.meetingpersonbranch?.includes(t.branch) &&
                e.meetingpersonunit?.includes(t.unit)
            )

        let selectedValueslocation = accessbranch
            ?.map((data) => ({
                company: data.company,
                branch: data.branch,
                unit: data.unit,
            }))
            .filter((t) =>
                e.meetinglocationcompany?.includes(t.company) &&
                e.meetinglocationbranch?.includes(t.branch) &&
                e.meetinglocationunit?.includes(t.unit)
            )

        let selectedCompany = selectedValues
            ?.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.company === value.company)
            )
            .map((a, index) => {
                return a.company;
            });

        let mappedCompany = selectedValues
            ?.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.company === value.company)
            )
            ?.map((data) => ({
                label: data?.company,
                value: data?.company,
            }));

        let selectedCompanylocation = selectedValueslocation
            ?.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.company === value.company)
            )
            .map((a, index) => {
                return a.company;
            });

        let mappedCompanylocation = selectedValueslocation
            ?.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.company === value.company)
            )
            ?.map((data) => ({
                label: data?.company,
                value: data?.company,
            }));

        setValueCompanyCat(selectedCompany);
        setSelectedOptionsCompany(mappedCompany);

        setValueCompanyLocationCat(selectedCompanylocation);
        setSelectedOptionsCompanyLocation(mappedCompanylocation);

        let selectedBranch = selectedValues
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.company === value.company && t.branch === value.branch
                    )
            )
            .map((a, index) => {
                return a.branch;
            });

        let mappedBranch = selectedValues
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.company === value.company && t.branch === value.branch
                    )
            )
            ?.map((data) => ({
                label: data?.branch,
                value: data?.branch,
            }));

        let selectedBranchlocation = selectedValueslocation
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.company === value.company && t.branch === value.branch
                    )
            )
            .map((a, index) => {
                return a.branch;
            });

        let mappedBranchLocation = selectedValueslocation
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.company === value.company && t.branch === value.branch
                    )
            )
            ?.map((data) => ({
                label: data?.branch,
                value: data?.branch,
            }));

        setValueBranchCat(selectedBranch);
        setSelectedOptionsBranch(mappedBranch);

        setValueBranchLocationCat(selectedBranchlocation);
        setSelectedOptionsBranchLocation(mappedBranchLocation);

        let selectedUnit = selectedValues
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit
                    )
            )
            .map((a, index) => {
                return a.unit;
            });

        let mappedUnit = selectedValues
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit
                    )
            )
            ?.map((data) => ({
                label: data?.unit,
                value: data?.unit,
            }));

        let selectedUnitlocation = selectedValueslocation
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit
                    )
            )
            .map((a, index) => {
                return a.unit;
            });

        let mappedUnitlocation = selectedValueslocation
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit
                    )
            )
            ?.map((data) => ({
                label: data?.unit,
                value: data?.unit,
            }));

        setValueUnitCat(selectedUnit);
        setSelectedOptionsUnit(mappedUnit);

        setValueUnitLocationCat(selectedUnitlocation);
        setSelectedOptionsUnitLocation(mappedUnitlocation);

        let mappedTeam = allTeam
            ?.filter(
                (u) =>
                    selectedCompany?.includes(u.company) &&
                    selectedBranch?.includes(u.branch) &&
                    selectedUnit?.includes(u.unit)
            )
            .map((u) => ({
                label: u.teamname,
                value: u.teamname,
            }));

        let selectedTeam = allTeam
            ?.filter(
                (u) =>
                    selectedCompany?.includes(u.company) &&
                    selectedBranch?.includes(u.branch) &&
                    selectedUnit?.includes(u.unit)
            )
            .map((u) => u.teamname);

        setValueTeamCat(selectedTeam);
        setSelectedOptionsTeam(mappedTeam);

        setSelectedOptionsDepartment(alldepartment?.filter((t) => e?.meetingpersondepartment?.includes(t?.deptname))?.map((data) => ({
            label: data.deptname,
            value: data.deptname,
        })))

        setValueDepartmentCat(alldepartment?.filter((t) => e?.meetingpersondepartment?.includes(t?.deptname))?.map((a, index) => {
            return a.deptname;
        }))

        setSelectedOptionsFloorLocation(allfloor
            ?.filter((u) =>
                selectedBranchlocation?.includes(u.branch)
            )
            .map((u) => ({
                ...u,
                label: u.name,
                value: u.name,
            })))
        const floorval = allfloor?.map((a, index) => {
            return a.name;
        })
        setValueFloorLocationCat(floorval)
        handleUploadPopupClose();
        handleCloseerrpop();
        handleCloseerrpopdragdrop();
        webcamClose();
        setCheckContactEmailForpopup(true)

        setTimeout(() => {
            setNewimage("")
        }, 1000)

    };


    const handleCloseModEditProfileCheck = async (e, reason) => {
        setIsExistVisitor(true)


        if (reason && reason === "backdropClick") return;
        setRefImage(e?.files || e?.uploadedimage?.some((item) => item?.preview === "") ? [] : e?.uploadedimage || newimage || [])
        // setRefImage(e?.uploadedimage?.some((item)=> item?.preview === "") ? [] : e?.uploadedimage)
        // setRefImage(newimage)
        setRefImagePerImage(e?.files)
        setIsEditOpen(false);
        setPervData(e)
        setVendor({
            ...e,
            company: e?.company || "Please Select Company",
            branch: e?.branch || "Please Select Branch",
            unit: e?.unit || "Please Select Unit",
            visitortype: e?.visitortype || "Please Select Visitor Type",
            visitormode: e?.visitormode || "Please Select Visitor Mode",
            date: date,
            prefix: e?.prefix || "Mr",
            visitorname: e?.visitorname || e?.fullname || e?.companyname,
            intime: getCurrentTime24Hour(),
            visitorpurpose: e?.visitorpurpose || "Please Select Visitor Purpose",
            visitorcontactnumber: e?.visitorcontactnumber || e?.mobile,
            visitoremail: e?.visitoremail || e.email,
            visitorcompnayname: e?.visitorcompnayname === "undefined" ? "" : e?.visitorcompnayname || "",

            documenttype: e?.documenttype || "Please Select Document Type",
            documentnumber: e?.documentnumber === "undefined" ? "" : e?.documentnumber || "",
            meetingdetails: e?.meetingdetails,
            meetingpersonemployeename: e?.meetingpersonemployeename || "Please Select Employee Name",
            meetinglocationarea: e?.meetinglocationarea || "Please Select Area",
            escortinformation: e?.escortinformation,
            escortdetails: e?.escortdetails,
            equipmentborrowed: e?.equipmentborrowed === "undefined" ? "" : e?.equipmentborrowed || "",
            outtime: "",
            remark: e?.remark === "undefined" ? "" : e?.remark || "",
            followupaction: e?.followupaction || "Please Select Follow Up Action",
            followupdate: "",
            followuptime: "",
            visitorbadge: e?.visitorbadge === "undefined" ? "" : e?.visitorbadge || "",
            visitorsurvey: e?.visitorsurvey === "undefined" ? "" : e?.visitorsurvey || "",
            uploadedimage: null,
        })
        setdocumentFiles(e?.document || [])
        if (uploadBills?.length > 0) {
            setUploadBills([])
            let multerUploadedFiles = e?.visitordocument?.filter(data => !data.preview)
            setBillUploadedFiles(multerUploadedFiles);
        } else {
            let multerUploadedFiles = e?.visitordocument?.filter(data => !data.preview)
            setBillUploadedFiles(multerUploadedFiles);
        }
        fetchInteractorPurpose(e?.visitortype)
        let selectedValues = accessbranch
            ?.map((data) => ({
                company: data.company,
                branch: data.branch,
                unit: data.unit,
            }))
            .filter((t) =>
                e.meetingpersoncompany?.includes(t.company) &&
                e.meetingpersonbranch?.includes(t.branch) &&
                e.meetingpersonunit?.includes(t.unit)
            )

        let selectedValueslocation = accessbranch
            ?.map((data) => ({
                company: data.company,
                branch: data.branch,
                unit: data.unit,
            }))
            .filter((t) =>
                e.meetinglocationcompany?.includes(t.company) &&
                e.meetinglocationbranch?.includes(t.branch) &&
                e.meetinglocationunit?.includes(t.unit)
            )

        let selectedCompany = selectedValues
            ?.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.company === value.company)
            )
            .map((a, index) => {
                return a.company;
            });

        let mappedCompany = selectedValues
            ?.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.company === value.company)
            )
            ?.map((data) => ({
                label: data?.company,
                value: data?.company,
            }));

        let selectedCompanylocation = selectedValueslocation
            ?.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.company === value.company)
            )
            .map((a, index) => {
                return a.company;
            });

        let mappedCompanylocation = selectedValueslocation
            ?.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.company === value.company)
            )
            ?.map((data) => ({
                label: data?.company,
                value: data?.company,
            }));

        setValueCompanyCat(selectedCompany);
        setSelectedOptionsCompany(mappedCompany);

        setValueCompanyLocationCat(selectedCompanylocation);
        setSelectedOptionsCompanyLocation(mappedCompanylocation);

        let selectedBranch = selectedValues
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.company === value.company && t.branch === value.branch
                    )
            )
            .map((a, index) => {
                return a.branch;
            });

        let mappedBranch = selectedValues
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.company === value.company && t.branch === value.branch
                    )
            )
            ?.map((data) => ({
                label: data?.branch,
                value: data?.branch,
            }));

        let selectedBranchlocation = selectedValueslocation
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.company === value.company && t.branch === value.branch
                    )
            )
            .map((a, index) => {
                return a.branch;
            });

        let mappedBranchLocation = selectedValueslocation
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.company === value.company && t.branch === value.branch
                    )
            )
            ?.map((data) => ({
                label: data?.branch,
                value: data?.branch,
            }));

        setValueBranchCat(selectedBranch);
        setSelectedOptionsBranch(mappedBranch);

        setValueBranchLocationCat(selectedBranchlocation);
        setSelectedOptionsBranchLocation(mappedBranchLocation);

        let selectedUnit = selectedValues
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit
                    )
            )
            .map((a, index) => {
                return a.unit;
            });

        let mappedUnit = selectedValues
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit
                    )
            )
            ?.map((data) => ({
                label: data?.unit,
                value: data?.unit,
            }));

        let selectedUnitlocation = selectedValueslocation
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit
                    )
            )
            .map((a, index) => {
                return a.unit;
            });

        let mappedUnitlocation = selectedValueslocation
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit
                    )
            )
            ?.map((data) => ({
                label: data?.unit,
                value: data?.unit,
            }));

        setValueUnitCat(selectedUnit);
        setSelectedOptionsUnit(mappedUnit);

        setValueUnitLocationCat(selectedUnitlocation);
        setSelectedOptionsUnitLocation(mappedUnitlocation);

        let mappedTeam = allTeam
            ?.filter(
                (u) =>
                    selectedCompany?.includes(u.company) &&
                    selectedBranch?.includes(u.branch) &&
                    selectedUnit?.includes(u.unit)
            )
            .map((u) => ({
                label: u.teamname,
                value: u.teamname,
            }));

        let selectedTeam = allTeam
            ?.filter(
                (u) =>
                    selectedCompany?.includes(u.company) &&
                    selectedBranch?.includes(u.branch) &&
                    selectedUnit?.includes(u.unit)
            )
            .map((u) => u.teamname);

        setValueTeamCat(selectedTeam);
        setSelectedOptionsTeam(mappedTeam);

        setSelectedOptionsDepartment(alldepartment?.filter((t) => e?.meetingpersondepartment?.includes(t?.deptname))?.map((data) => ({
            label: data.deptname,
            value: data.deptname,
        })))

        setValueDepartmentCat(alldepartment?.filter((t) => e?.meetingpersondepartment?.includes(t?.deptname))?.map((a, index) => {
            return a.deptname;
        }))

        setSelectedOptionsFloorLocation(allfloor
            ?.filter((u) =>
                selectedBranchlocation?.includes(u.branch)
            )
            .map((u) => ({
                ...u,
                label: u.name,
                value: u.name,
            })))
        const floorval = allfloor?.map((a, index) => {
            return a.name;
        })
        setValueFloorLocationCat(floorval)
        handleUploadPopupClose();
        handleCloseerrpop();
        handleCloseerrpopdragdrop();
        webcamClose();
        setCheckContactEmailForpopup(true)

        let res = await axios.get(`${SERVICE.VISITORDETAILS_LOG_SINGLE}/${encodeURIComponent(e?.visitorid)}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        setVisitorLogData(res?.data?.svisitordetailslog)

        setTimeout(() => {
            setNewimage("")
        }, 1000)

    };


    const handleCloseModEditBack = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    }

    const [isGettingVisitorUserCandidate, setIsGettingVisitorUserCandidate] = useState(false)

    const handleExistingVisitorSearch = async () => {
        setPageName(!pageName);
        setIsGettingVisitorUserCandidate(true)
        try {
            let res_matchvisitor = await axios.post(
                SERVICE.CHECKEXISTING_VISITOR,
                {
                    visitornameexists: visitorCheckName,
                    assignbranch: accessbranch,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            setExistingUser(res_matchvisitor?.data?.visitors)
            setIsGettingVisitorUserCandidate(false)
            handleClickOpenEdit()
        } catch (err) {
            setIsGettingVisitorUserCandidate(false)
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    const handleFileUpload = (event) => {
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
            setPopupContentMalert(`The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(', ')}`);
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
        }

        if (filteredFiles.length === 0) return; // If no valid files, exit

        // Create array of file objects for upload
        const filesToUpload = filteredFiles.map(file => ({ file }));

        if (uploadBillsRequestDocument?.length > 0) {
            // If there are existing files, append the new ones (up to your desired limit)
            const combinedFiles = [...uploadBillsRequestDocument, ...filesToUpload];

            // If you want to limit the total number of files, add a check here
            // For example, limit to 5 files:
            // const finalFiles = combinedFiles.slice(0, 5);
            setUploadBillsRequestDocument(combinedFiles);
        } else {
            // No existing files, just set the new ones
            setUploadBillsRequestDocument(filesToUpload);
        }
    };


    const handleRemarkChange = (index, newRemark) => {
        setUploadBillsRequestDocument(prevFiles =>
            prevFiles.map((file, i) =>
                i === index ? { ...file, remark: newRemark } : file
            )
        );
    };

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

    const handlechangeppincode = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value?.slice(0, 6);
        if (regex.test(inputValue) || inputValue === "") {
            setVendor({ ...vendor, ppincode: inputValue });
        }
    };

    // SELECT DROPDOWN STYLES
    const colourStyles = {
        menuList: (styles) => ({
            ...styles,
            background: "white",
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            // color:'black',
            color: isFocused
                ? "rgb(255 255 255, 0.5)"
                : isSelected
                    ? "white"
                    : "black",
            background: isFocused
                ? "rgb(25 118 210, 0.7)"
                : isSelected
                    ? "rgb(25 118 210, 0.5)"
                    : null,
            zIndex: 1,
        }),
        menu: (base) => ({
            ...base,
            zIndex: 100,
        }),
    };

    return (
        <Box>
            <Headtitle title={"VISITORS ENQUIERY"} />
            {/* ****** Header Content ****** */}

            <PageHeading
                title="Visitors Enquiry"
                modulename="Interactors"
                submodulename="Visitor"
                mainpagename="Visitor Enquiry"
                subpagename=""
                subsubpagename=""
            />
            <>
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                {" "}
                                <Typography sx={{ fontWeight: "bold" }}>
                                    Add Visitor Enquiry
                                </Typography>{" "}
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={accessbranch
                                            ?.map((data) => ({
                                                label: data.company,
                                                value: data.company,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        placeholder="Please Select Company"
                                        value={{
                                            label: vendor.company,
                                            value: vendor.company,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                company: e.value,
                                                branch: "Please Select Branch",
                                                unit: "Please Select Unit",
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={accessbranch
                                            ?.filter((comp) => vendor.company === comp.company)
                                            ?.map((data) => ({
                                                label: data.branch,
                                                value: data.branch,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        placeholder="Please Select Branch"
                                        value={{
                                            label: vendor.branch,
                                            value: vendor.branch,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                branch: e.value,
                                                unit: "Please Select Unit",
                                                enquiredbranchnumber: "Please Select Number",
                                                enquiredbranchemail: "Please Select Email",
                                            });
                                            const setPhoneEmailOpt = branchOpt?.filter((item) => item?.name === e.value)[0]
                                            setEnquiredBranchNumber(setPhoneEmailOpt?.phone?.map((item) => ({
                                                label: item,
                                                value: item
                                            })))

                                            setEnquiredBranchEmail(setPhoneEmailOpt?.email?.map((item) => ({
                                                label: item,
                                                value: item
                                            })))
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={accessbranch
                                            ?.filter(
                                                (comp) =>
                                                    vendor.company === comp.company &&
                                                    vendor.branch === comp.branch
                                            )
                                            ?.map((data) => ({
                                                label: data.unit,
                                                value: data.unit,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        placeholder="Please Select Unit"
                                        value={{
                                            label: vendor.unit,
                                            value: vendor.unit,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                unit: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Visitor's ID <b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        placeholder="Please Enter Visitor's ID"
                                        value={visitorCode}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Visitor Type <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={visitorsTypeOption.filter(
                                            (item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            }
                                        )}
                                        placeholder="Please Select Visitor Type"
                                        value={{
                                            label: vendor.visitortype,
                                            value: vendor.visitortype,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                visitortype: e.value,
                                                visitorpurpose: "Please Select Visitor Purpose",
                                            });
                                            fetchInteractorPurpose(e.value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Visitor Mode <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={visitorsModeOption.filter(
                                            (item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            }
                                        )}
                                        placeholder="Please Select Visitor Mode"
                                        value={{
                                            label: vendor.visitormode,
                                            value: vendor.visitormode,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                visitormode: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={1.5} xs={2} sm={2}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={vendor.date}
                                        onChange={(e) => {
                                            setVendor({ ...vendor, date: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={1.5} sm={2} xs={2}>
                                <FormControl size="small" fullWidth>
                                    <Typography>
                                        Prefix<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        placeholder="Mr."
                                        value={vendor.prefix}
                                        onChange={(e) => {
                                            setVendor({ ...vendor, prefix: e.target.value });
                                        }}
                                    >
                                        <MenuItem value="Mr">Mr</MenuItem>
                                        <MenuItem value="Ms">Ms</MenuItem>
                                        <MenuItem value="Mrs">Mrs</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Visitor Name <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        disabled={isExistVisitor}
                                        value={vendor.visitorname}
                                        placeholder="Please Enter Visitor Name"
                                        onChange={(e) => {
                                            setVendor({ ...vendor, visitorname: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Enquiry Time <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="time"
                                        placeholder="HH:MM:AM/PM"
                                        value={vendor.intime}
                                        onChange={(e) => {
                                            setVendor({ ...vendor, intime: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Visitor Purpose <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={visitorsPurposeOption}
                                        placeholder="Please Select Visitor Purpose"
                                        value={{
                                            label: vendor.visitorpurpose,
                                            value: vendor.visitorpurpose,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                visitorpurpose: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Visitor Purpose <b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={visitorsPurposeOption}
                                        placeholder="Please Select Visitor Purpose"
                                        value={{
                                            label: vendor.visitorpurpose,
                                            value: vendor.visitorpurpose,
                                        }}

                                        onChange={(e) => {
                                            const dueDays = visitorsTypeOption?.filter((item) =>
                                                item?.interactorstype === vendor.visitortype &&
                                                item?.interactorspurpose?.includes(e.value)
                                            )[0]?.duedays || "";

                                            if (dueDays !== "") {
                                                // Calculate the follow-up date by adding dueDays to current date
                                                const currentDate = new Date();
                                                const followUpDate = new Date();
                                                followUpDate.setDate(currentDate.getDate() + parseInt(dueDays));

                                                // Format the date as YYYY-MM-DD (or your preferred format)
                                                const formattedDate = followUpDate.toISOString().split('T')[0];

                                                setVendor({
                                                    ...vendor,
                                                    requestvisitorfollowupdate: formattedDate,
                                                    visitorpurpose: e.value,
                                                    requestvisitorfollowaction: 'Please Select Request Follow Up Action',
                                                    requestfollowupactionupdate: '',
                                                    requestfollowupactionuptime: '',
                                                    followupaction: (visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(e.value))[0]?.requestdocument || false) ? "" : "Please Select Follow Up Action",
                                                });
                                            } else {
                                                setVendor({
                                                    ...vendor,
                                                    visitorpurpose: e.value,
                                                    requestvisitorfollowaction: 'Please Select Request Follow Up Action',
                                                    requestfollowupactionupdate: '',
                                                    requestfollowupactionuptime: '',
                                                    followupaction: (visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(e.value))[0]?.requestdocument || false) ? "" : "Please Select Follow Up Action",
                                                });
                                            }

                                            setUploadBillsRequestDocument([])
                                        }}
                                    />

                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Visitor Contact Number<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        value={vendor.visitorcontactnumber}
                                        placeholder="Please Enter Visitor Contact Number"
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                visitorcontactnumber: e.target.value,
                                            });
                                            handleMobile(e.target.value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Visitor Email<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="email"
                                        value={vendor.visitoremail}
                                        placeholder="Please Enter Visitor Email"
                                        onChange={(e) => {
                                            setVendor({ ...vendor, visitoremail: e.target.value?.toLowerCase() });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Visitor's Company Name</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={vendor.visitorcompnayname}
                                        placeholder="Please Enter Visitor's Company Name"
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                visitorcompnayname: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    Visitor ID / Document Details
                                </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Document Type</Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={documentTypeOption}
                                        placeholder="Please Select Document Type"
                                        value={{
                                            label: vendor.documenttype,
                                            value: vendor.documenttype,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                documenttype: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Document Number</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={vendor.documentnumber}
                                        placeholder="Please Enter Document Number"
                                        onChange={(e) => {
                                            if (vendor.documenttype === "Aadhar Card") {
                                                const regex = /^[0-9]+$/; // Only allows positive integers
                                                const inputValue = e.target.value?.slice(0, 12);
                                                if (regex.test(inputValue) || inputValue === "") {
                                                    setVendor({
                                                        ...vendor,
                                                        documentnumber: inputValue,
                                                    });
                                                }
                                            } else if (vendor.documenttype === "Pan Card") {
                                                if (e.target.value.length < 11) {
                                                    setVendor({
                                                        ...vendor,
                                                        documentnumber: e.target.value,
                                                    });
                                                }
                                            } else {
                                                setVendor({
                                                    ...vendor,
                                                    documentnumber: e.target.value,
                                                });
                                            }

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography >Upload Document</Typography>
                                <Grid >
                                    <Grid item md={2} sm={12} xs={12}>
                                        <Button size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" }, ...buttonStyles?.buttonsubmit }}>
                                            Upload
                                            <input
                                                type="file"
                                                id="resume"
                                                accept=".xlsx, .xls, .csv, .pdf, .txt,"
                                                name="file"
                                                hidden
                                                onChange={(e) => {
                                                    handleInputChangedocument(e);
                                                    setTextEditor("");
                                                    setTextAreas([])
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                    <Typography>&nbsp;</Typography>
                                    {uploadBills?.length > 0 && uploadBills?.map((data, index) => (
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

                                                        <img
                                                            className={classes.preview}
                                                            src={getFileIcon(data.name || data.file.name)}
                                                            height="25"
                                                            alt="file icon"
                                                        />
                                                        {/* )} */}
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
                                                        {data.name || data.file.name}{" "}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={2} sm={2} xs={2}>
                                                    <Button
                                                        sx={{
                                                            padding: "14px 14px",
                                                            minWidth: "40px !important",
                                                            borderRadius: "50% !important",
                                                            ":hover": {
                                                                backgroundColor: "#80808036", // theme.palette.primary.main
                                                            },
                                                        }}
                                                    >
                                                        <VisibilityOutlinedIcon
                                                            style={{
                                                                fontsize: "large",
                                                                color: "#357AE8",
                                                            }}
                                                            onClick={() => renderFilePreviewMulter(data.file)}
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
                                                        onClick={() =>
                                                            handleDeleteFileDocumentEdit(index)
                                                        }
                                                    >
                                                        <FaTrash
                                                            style={{
                                                                fontSize: "medium",
                                                                color: "#a73131",
                                                            }}
                                                        />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ))}
                                </Grid>
                            </Grid>
                            {visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument &&

                                <Grid item md={12} xs={12} sm={12}>
                                    <Box >
                                        <Grid item xs={8}>
                                            <Typography sx={{ fontWeight: 'bold' }}>Request Visitor Document</Typography>
                                        </Grid>
                                        <>
                                            <Grid container sx={{ justifyContent: "center" }} spacing={1}>
                                                {/* <Selects
                        options={designationsFileNames}
                        styles={colourStyles}
                        value={{
                          label: fileNames,
                          value: fileNames,
                        }}
                        onChange={(e) => {
                          setfileNames(e.value);
                        }}
                      /> */}
                                                &nbsp;
                                                <Button variant="outlined" component="label">
                                                    <CloudUploadIcon sx={{ fontSize: "21px" }} /> &ensp;Upload
                                                    Documents
                                                    <input
                                                        hidden
                                                        type="file"
                                                        multiple
                                                        onChange={handleFileUpload}
                                                    />
                                                </Button>
                                            </Grid>
                                        </>
                                        {/* <Typography sx={userStyle.SubHeaderText}>
                    {" "}
                    Document List{" "}
                  </Typography> */}
                                        <br />
                                        <br />
                                        <br />
                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table" id="branch">
                                                <TableHead sx={{ fontWeight: "600" }}>
                                                    <StyledTableRow>
                                                        <StyledTableCell align="center">SI.NO</StyledTableCell>
                                                        <StyledTableCell align="center">Document</StyledTableCell>
                                                        {/* <StyledTableCell align="center">Remarks</StyledTableCell> */}
                                                        <StyledTableCell align="center">View</StyledTableCell>
                                                        <StyledTableCell align="center">Action</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {uploadBillsRequestDocument &&
                                                        uploadBillsRequestDocument?.map((file, index) => (
                                                            <StyledTableRow key={index}>
                                                                <StyledTableCell align="center">
                                                                    {sno++}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {file.name || file.file.name}
                                                                </StyledTableCell>
                                                                <StyledTableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    align="center"
                                                                >
                                                                    {/* <a
                                    style={{ color: "#357ae8" }}
                                    href={`data:application/octet-stream;base64,${file.data}`}
                                    download={file.name}
                                  >
                                    Download
                                  </a> */}
                                                                    <a
                                                                        style={{
                                                                            color: "#357ae8",
                                                                            cursor: "pointer",
                                                                            textDecoration: "underline",
                                                                        }}
                                                                        onClick={() => renderFilePreviewMulter(file?.file)}
                                                                    >
                                                                        View
                                                                    </a>
                                                                </StyledTableCell>
                                                                <StyledTableCell align="center">
                                                                    <Button
                                                                        onClick={() => handleDeleteFileDocumentEditRequestDocument(index)}
                                                                        variant="contained"
                                                                        size="small"
                                                                        sx={{
                                                                            textTransform: "capitalize",
                                                                            minWidth: "0px",
                                                                        }}
                                                                    >
                                                                        <DeleteIcon style={{ fontSize: "20px" }} />
                                                                    </Button>
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                    <br />
                                </Grid>
                            }
                            {visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument && (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Request Visitor Followup Date<b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={vendor.requestvisitorfollowupdate}
                                                onChange={(e) => {
                                                    setVendor({ ...vendor, requestvisitorfollowupdate: e.target.value });

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Request Follow Up Action <b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={followUpActionOption}
                                                placeholder="Please Select Follow Up Action"
                                                value={{
                                                    label: vendor.requestvisitorfollowaction,
                                                    value: vendor.requestvisitorfollowaction,
                                                }}
                                                onChange={(e) => {
                                                    setVendor({
                                                        ...vendor,
                                                        requestvisitorfollowaction: e.value,
                                                        requestfollowupactionupdate: "",
                                                        requestfollowupactionuptime: ""
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {vendor.requestvisitorfollowaction === 'Required' ? (
                                        <>

                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Request Follow Up Date<b style={{ color: 'red' }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="date"
                                                        value={vendor.requestfollowupactionupdate}
                                                        onChange={(e) => {
                                                            setVendor({
                                                                ...vendor,
                                                                requestfollowupactionupdate: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Request Follow Up Time <b style={{ color: 'red' }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="time"
                                                        placeholder="HH:MM:AM/PM"
                                                        value={vendor.requestfollowupactionuptime}
                                                        onChange={(e) => {
                                                            setVendor({
                                                                ...vendor,
                                                                requestfollowupactionuptime: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) :
                                        (
                                            <>
                                                <Grid item md={6} xs={12} sm={12}>
                                                </Grid>
                                            </>
                                        )
                                    }


                                </>
                            )

                            }

                            <Grid item md={12} xs={12} sm={12}></Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Address Type
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={addressTypeOptions}
                                        value={{
                                            label: vendor.addesstype,
                                            value: vendor.addesstype,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
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
                                            label: vendor.personalprefix,
                                            value: vendor.personalprefix,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
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
                                        value={vendor.referencename}
                                        placeholder="Please Enter Reference Name"
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
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
                                            label: vendor.landmarkpositionprefix,
                                            value: vendor.landmarkpositionprefix,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
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
                                        value={vendor.landmarkname}
                                        placeholder="Please Enter Landmark Name"
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
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
                                        value={vendor.houseflatnumber}
                                        placeholder="Please Enter House/Flat Number"
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
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
                                        value={vendor.streetroadname}
                                        placeholder="Please Enter Street/Road Name"
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
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
                                        value={vendor.localityareaname}
                                        placeholder="Please Enter Locality/Area Name"
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
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
                                        styles={colourStyles}
                                        value={selectedCountryp}
                                        onChange={(item) => {
                                            setSelectedCountryp(item);
                                            setSelectedStatep("");
                                            setSelectedCityp("");
                                            setVendor((prevSupplier) => ({
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
                                            selectedCountryp?.isoCode
                                        )}
                                        getOptionLabel={(options) => {
                                            return options["name"];
                                        }}
                                        getOptionValue={(options) => {
                                            return options["name"];
                                        }}
                                        value={selectedStatep}
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedStatep(item);
                                            setSelectedCityp("");
                                            setVendor((prevSupplier) => ({
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
                                        styles={colourStyles}
                                        onChange={(item) => {
                                            setSelectedCityp(item);
                                            setVendor((prevSupplier) => ({
                                                ...prevSupplier,
                                                pcity: item?.name || "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography>Pincode</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        placeholder="Pincode"
                                        value={vendor.ppincode}
                                        onChange={(e) => {
                                            handlechangeppincode(e);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>GPS Coordinate</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={vendor.gpscoordinate}
                                        placeholder="Please Enter GPS Coordinate"
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                gpscoordinate: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Full Address<b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={5}
                                        value={
                                            [
                                                vendor.personalprefix !== "Please Select Personal Prefix" ? vendor.personalprefix : null,
                                                vendor.referencename,
                                                vendor.landmarkpositionprefix !== "Please Select Landmark Position Prefix" ? vendor.landmarkpositionprefix : null,
                                                vendor.landmarkname,
                                                vendor.houseflatnumber,
                                                vendor.streetroadname,
                                                vendor.localityareaname,
                                                vendor.pcity,
                                                vendor.pstate,
                                                vendor.pcountry,
                                                vendor.ppincode
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
                            {/* {vendor.meetingdetails && (
                <> */}
                            <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    Enquiry Person
                                </Typography>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={accessbranch
                                            ?.map((data) => ({
                                                label: data.company,
                                                value: data.company,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label &&
                                                            i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={selectedOptionsCompany}
                                        onChange={(e) => {
                                            handleCompanyChange(e);
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={accessbranch
                                            ?.filter((comp) =>
                                                valueCompanyCat?.includes(comp.company)
                                            )
                                            ?.map((data) => ({
                                                label: data.branch,
                                                value: data.branch,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label &&
                                                            i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={selectedOptionsBranch}
                                        onChange={(e) => {
                                            handleBranchChange(e);
                                        }}
                                        valueRenderer={customValueRendererBranch}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={accessbranch
                                            ?.filter(
                                                (comp) =>
                                                    valueCompanyCat?.includes(comp.company) &&
                                                    valueBranchCat?.includes(comp.branch)
                                            )
                                            ?.map((data) => ({
                                                label: data.unit,
                                                value: data.unit,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label &&
                                                            i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={selectedOptionsUnit}
                                        onChange={(e) => {
                                            handleUnitChange(e);
                                        }}
                                        valueRenderer={customValueRendererUnit}
                                        labelledBy="Please Select Unit"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Department<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={alldepartment
                                            ?.map((data) => ({
                                                label: data.deptname,
                                                value: data.deptname,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label &&
                                                            i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={selectedOptionsDepartment}
                                        onChange={(e) => {
                                            handleDepartmentChange(e);
                                        }}
                                        valueRenderer={customValueRendererDepartment}
                                        labelledBy="Please Select Department"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Team<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={allTeam
                                            ?.filter(
                                                (u) =>
                                                    valueCompanyCat?.includes(u.company) &&
                                                    valueBranchCat?.includes(u.branch) &&
                                                    valueUnitCat?.includes(u.unit)
                                            )
                                            .map((u) => ({
                                                ...u,
                                                label: u.teamname,
                                                value: u.teamname,
                                            }))}
                                        value={selectedOptionsTeam}
                                        onChange={(e) => {
                                            handleTeamChange(e);
                                        }}
                                        valueRenderer={customValueRendererTeam}
                                        labelledBy="Please Select Team"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Employee Name<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={allUsersData
                                            ?.filter(
                                                (u) =>
                                                    valueCompanyCat?.includes(u.company) &&
                                                    valueBranchCat?.includes(u.branch) &&
                                                    valueUnitCat?.includes(u.unit) &&
                                                    valueDepartmentCat?.includes(u.department) &&
                                                    valueTeamCat?.includes(u.team)
                                            )
                                            .map((u) => ({
                                                ...u,
                                                label: u.companyname,
                                                value: u.companyname,
                                            }))}
                                        placeholder="Please Select Employee Name"
                                        value={{
                                            label: vendor.meetingpersonemployeename,
                                            value: vendor.meetingpersonemployeename,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                meetingpersonemployeename: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Enquired Branch Number<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={enquiredBranchNumber}
                                        value={{
                                            label: vendor.enquiredbranchnumber,
                                            value: vendor.enquiredbranchnumber,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                enquiredbranchnumber: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Enquired Branch Email<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={enquiredBranchEmail}
                                        value={{
                                            label: vendor.enquiredbranchemail,
                                            value: vendor.enquiredbranchemail,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                enquiredbranchemail: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}></Grid>
                            <Grid item md={12} xs={12} sm={12}>

                            </Grid>
                            {/* <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Follow Up Action <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={followUpActionOption}
                                        placeholder="Please Select Follow Up Action"
                                        value={{
                                            label: vendor.followupaction,
                                            value: vendor.followupaction,
                                        }}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                followupaction: e.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid> */}
                            {visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument || false ?
                                <>

                                </>
                                :
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Follow Up Action <b style={{ color: 'red' }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={followUpActionOption}
                                                placeholder="Please Select Follow Up Action"
                                                value={{
                                                    label: vendor.followupaction,
                                                    value: vendor.followupaction,
                                                }}
                                                onChange={(e) => {
                                                    setVendor({
                                                        ...vendor,
                                                        followupaction: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {vendor.followupaction === "Required" && (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Follow Up Date<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="date"
                                                        value={vendor.followupdate}
                                                        onChange={(e) => {
                                                            setVendor({
                                                                ...vendor,
                                                                followupdate: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Follow Up Time <b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="time"
                                                        placeholder="HH:MM:AM/PM"
                                                        value={vendor.followuptime}
                                                        onChange={(e) => {
                                                            setVendor({
                                                                ...vendor,
                                                                followuptime: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}
                                </>

                            }
                            {/* </>
              } */}



                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Remark</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={2.5}
                                        value={vendor.remark}
                                        onChange={(e) => {
                                            setVendor({
                                                ...vendor,
                                                remark: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Added By</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={isUserRoleAccess?.companyname}
                                        placeholder="Please Enter AddedBy"
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <br /> <br />
                        <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Grid item md={1} sm={2} xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={buttonStyles.buttonsubmit}
                                    onClick={(e) => handleSubmit(e, "save1")}
                                    disabled={buttonLoad}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item md={2} sm={2} xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={buttonStyles.buttonsubmit}
                                    onClick={(e) => handleSubmit(e, "save2")}
                                    disabled={buttonLoad}
                                >
                                    Save & add another
                                </Button>
                            </Grid>
                            <Grid item md={1} sm={2} xs={12}>
                                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                    Clear
                                </Button>
                            </Grid>
                            <Grid item md={1} sm={2} xs={12}>
                                <Link
                                    to="/interactor/master/listvisitors"
                                    style={{
                                        textDecoration: "none",
                                        color: "white",
                                        float: "right",
                                    }}
                                >
                                    <Button sx={buttonStyles.btncancel}>Cancel</Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </>
                </Box>

            </>
            <br />

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
                                capturedImages?.map((image, index) => (
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
                            {refImage?.map((file, index) => (
                                <Grid container key={index}>
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
                                                    src={file?.preview}
                                                    alt={file?.name}
                                                    height={50}
                                                    style={{
                                                        maxWidth: "-webkit-fill-available",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    className={classes?.preview}
                                                    src={getFileIcon(file?.name)}
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
                                        <Typography variant="subtitle2"> {file?.name} </Typography>
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
                        handleCloseModEdit={handleCloseModEditProfileCheck}
                        webcamCloseedit={webcamCloseedit}
                        setNewimage={setNewimage}
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
                                        sx={userStyle.uploadbtn}
                                    >
                                        {" "}
                                        Upload
                                        <input
                                            type="file"
                                            multiple
                                            id="productimage"
                                            accept="image/*"
                                            hidden
                                            onChange={handleInputChangeedit}
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
                            {resultArray?.map((file, index) => (
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
                                                <Button
                                                    sx={{
                                                        padding: "14px 14px",
                                                        minWidth: "40px !important",
                                                        borderRadius: "50% !important",
                                                        ":hover": {
                                                            backgroundColor: "#80808036", // theme.palette.primary.main
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        handleDeleteFileedit(index);
                                                    }}
                                                >
                                                    <FaTrash
                                                        style={{ color: "#a73131", fontSize: "12px" }}
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadOverAlledit} variant="contained">
                        Ok
                    </Button>
                    <Button onClick={resetImageedit} sx={userStyle.btncancel}>
                        Reset
                    </Button>
                    <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

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
                        handleCloseModEdit={handleCloseModEdit}
                        webcamCloseedit={webcamCloseedit}
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
            <Dialog
                open={isimgviewbill}
                onClose={handlecloseImgcodeviewbill}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6">Images</Typography>
                    {getimgbillcode.map((imagefilebill, index) => (
                        <Grid container key={index}>
                            <Grid item md={6} sm={10} xs={10}>
                                <img
                                    src={imagefilebill.preview}
                                    style={{
                                        maxWidth: "70px",
                                        maxHeight: "70px",
                                        marginTop: "10px",
                                    }}
                                />
                            </Grid>

                            <Grid
                                item
                                md={4}
                                sm={10}
                                xs={10}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Typography>{imagefilebill.name}</Typography>
                            </Grid>
                            <Grid item md={2} sm={2} xs={2}>
                                <Button
                                    sx={{
                                        padding: "14px 14px",
                                        minWidth: "40px !important",
                                        borderRadius: "50% !important",
                                        ":hover": {
                                            backgroundColor: "#80808036", // theme.palette.primary.main
                                        },
                                    }}
                                    onClick={() => renderFilePreview(imagefilebill)}
                                >
                                    <VisibilityOutlinedIcon
                                        style={{
                                            fontsize: "12px",
                                            color: "#357AE8",
                                            marginTop: "35px !important",
                                        }}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handlecloseImgcodeviewbill} sx={userStyle.btncancel}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isEditOpen} onClose={handleCloseModEdit}
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
                                <b>Existing Visitors List</b>
                            </Typography>
                            <Grid item md={6} sm={12} xs={12}>
                                {existingUser && existingUser.length > 0 ? (
                                    <ExistingVisitor
                                        ExistingVisitors={existingUser}
                                        handleCloseModEdit={handleCloseModEditProfileCheck}
                                    />) : (
                                    <Typography sx={{ ...userStyle.HeaderText, marginLeft: '28px', display: "flex", justifyContent: "center" }}>
                                        There is no Visiter
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
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEditBack}>
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            {/* Table For Duplicate Profile Upload */}
            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isErrorOpenpop} onClose={handleCloseModEditProfileCheck}
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
                            <Grid item md={6} sm={12} xs={12}>
                                {showDupProfileVIsitor && showDupProfileVIsitor.length > 0 ? (
                                    <ExistingProfileVisitor
                                        ExistingProfileVisitors={showDupProfileVIsitor}
                                        handleCloseModEdit={handleCloseModEditProfileCheck}
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
                                        justifyContent: "flex-start",
                                        gap: "15px",
                                    }}
                                >
                                    {/* <Button
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
                      ...buttonStyles?.buttonsubmit
                    }}
                    onClick={() => {
                      // sendRequestEdit();
                      UploadWithDuplicate(uploadwithDupImage, "upload")
                    }}
                  >
                    Upload
                  </Button> */}
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>

            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isErrorOpenpopdragdrop} onClose={handleCloseerrpopdragdrop}
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
                            <Grid item md={6} sm={12} xs={12}>
                                {showAlertpopdragdrop && showAlertpopdragdrop.length > 0 ? (
                                    <ExistingProfileVisitor
                                        ExistingProfileVisitors={showAlertpopdragdrop}
                                        handleCloseModEdit={handleCloseModEditProfileCheck}
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
                                    {/* <Button
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
                      ...buttonStyles?.buttonsubmit
                    }}
                    onClick={() => {
                       sendRequestEdit();
                      UploadWithDuplicate(uploadwithDupImage, "dragdrop")
                    }}
                  >
                    Upload With Duplicate
                  </Button> */}
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpopdragdrop}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <Box>
                <Dialog
                    open={checkContactEmail}
                    // onClose={handleCloseOpenCheckContact}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    PaperComponent={CustomPaper}
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
                                <InfoOutlinedIcon style={{ fontSize: "3.5rem", color: "teal" }} />
                                <Typography
                                    sx={{ fontSize: "1.4rem", fontWeight: "600", color: "black" }}
                                >
                                    {checkContactEmailMessage}
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleCloseOpenCheckContact}
                                variant="contained"
                                color="success"
                            >
                                Confirm
                            </Button>
                            <Button
                                onClick={handleCloseOpenCheckContactMessage}
                                variant="contained"
                                color="primary"
                            >
                                Change
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
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
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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
            <LoadingBackdrop open={isLoading} />
        </Box>
    );
}
export default VisitorEnquiery;